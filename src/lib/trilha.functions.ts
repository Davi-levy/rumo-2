import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { buildPrompt, parseTrilhaJson, validarTrilha, NIVEIS } from "./trilha.server";

const MAX_TENTATIVAS = 3;

export const gerarTrilha = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ linguagem: z.string().min(1).max(80), nivel: z.enum(NIVEIS) })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("IA não configurada.");

    const gateway = createLovableAiGatewayProvider(key);
    let ultimoErro = "";

    for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
      let texto = "";
      try {
        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          prompt: buildPrompt(data.linguagem, data.nivel, ultimoErro),
          maxRetries: 0,
        });
        texto = await result.text;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const status = (err as { statusCode?: number })?.statusCode;

        // 402 = créditos esgotados: erro definitivo, não re-tentar.
        if (status === 402 || /402|payment|credit/i.test(msg)) {
          throw new Error("Os créditos de IA acabaram. Adicione créditos para gerar novas trilhas.");
        }
        // 429 / 5xx são transitórios: espera e tenta de novo.
        const transitorio = status === 429 || (status ?? 0) >= 500 || /429|rate|timeout|fetch/i.test(msg);
        if (!transitorio || tentativa === MAX_TENTATIVAS) {
          throw new Error(
            status === 429
              ? "A IA está sobrecarregada agora. Tente novamente em alguns instantes."
              : "Não foi possível falar com a IA agora. Tente novamente.",
          );
        }
        await new Promise((r) => setTimeout(r, 1200 * tentativa));
        continue;
      }

      try {
        const trilha = parseTrilhaJson(texto);
        validarTrilha(trilha);
        return trilha;
      } catch (err) {
        // JSON inválido/incompleto: reforça o formato no próximo prompt.
        ultimoErro = err instanceof Error ? err.message : "JSON inválido";
        if (tentativa === MAX_TENTATIVAS) {
          throw new Error(
            "A IA devolveu uma trilha incompleta depois de várias tentativas. Tente novamente ou use um tema mais específico.",
          );
        }
      }
    }

    throw new Error("Não foi possível gerar a trilha. Tente novamente.");
  });
