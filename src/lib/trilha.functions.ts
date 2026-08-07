import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import {
  EsqueletoSchema,
  ModuloSchema,
  NIVEIS,
  extrairJson,
  promptEsqueleto,
  promptModulo,
  validarEsqueleto,
  validarModulo,
} from "./trilha.server";

const MAX_TENTATIVAS = 3;

function erroDeRede(err: unknown): never {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { statusCode?: number })?.statusCode;
  if (status === 402 || /402|payment|credit/i.test(msg)) {
    throw new Error("Os créditos de IA acabaram. Adicione créditos para gerar novas trilhas.");
  }
  if (status === 429 || /429|rate/i.test(msg)) {
    throw new Error("A IA está sobrecarregada agora. Tente novamente em alguns instantes.");
  }
  throw new Error("Não foi possível falar com a IA agora. Tente novamente.");
}

function transitorio(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { statusCode?: number })?.statusCode;
  return status === 429 || (status ?? 0) >= 500 || /429|rate|timeout|fetch|network/i.test(msg);
}

/** Gera texto e valida o JSON, com re-tentativas quando a IA devolve algo inválido. */
async function gerarJson<T>(
  construirPrompt: (erroAnterior?: string) => string,
  parse: (valor: unknown) => T,
  maxOutputTokens: number,
): Promise<T> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("IA não configurada.");
  const gateway = createLovableAiGatewayProvider(key);

  let ultimoErro: string | undefined;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    let texto = "";
    try {
      const result = streamText({
        model: gateway("google/gemini-3.6-flash"),
        prompt: construirPrompt(ultimoErro),
        maxOutputTokens,
        maxRetries: 0,
      });
      texto = await result.text;
    } catch (err) {
      if (!transitorio(err) || tentativa === MAX_TENTATIVAS) erroDeRede(err);
      await new Promise((r) => setTimeout(r, 1000 * tentativa));
      continue;
    }

    try {
      return parse(extrairJson(texto));
    } catch (err) {
      ultimoErro = err instanceof Error ? err.message : "JSON inválido";
      if (tentativa === MAX_TENTATIVAS) {
        throw new Error(`A IA devolveu um resultado incompleto (${ultimoErro}). Tente novamente.`);
      }
    }
  }

  throw new Error("Não foi possível gerar agora. Tente novamente.");
}

export const gerarEsqueleto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ linguagem: z.string().min(1).max(80), nivel: z.enum(NIVEIS) }).parse(input),
  )
  .handler(async ({ data }) =>
    gerarJson(
      (erro) => promptEsqueleto(data.linguagem, data.nivel, erro),
      (valor) => {
        const e = EsqueletoSchema.parse(valor);
        validarEsqueleto(e);
        return e;
      },
      2000,
    ),
  );

export const gerarModulo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        linguagem: z.string().min(1).max(80),
        nivel: z.enum(NIVEIS),
        tituloTrilha: z.string().min(1),
        tituloModulo: z.string().min(1),
        resumoModulo: z.string().default(""),
        posicao: z.number().int().min(1),
        total: z.number().int().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) =>
    gerarJson(
      (erro) => promptModulo(data, erro),
      (valor) => {
        const m = ModuloSchema.parse(valor);
        validarModulo(m);
        return m;
      },
      3000,
    ),
  );
