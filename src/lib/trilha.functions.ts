import { createServerFn } from "@tanstack/react-start";
import { Output, streamText } from "ai";
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

/** Gera JSON estruturado, com re-tentativas quando a IA devolve algo inválido. */
async function gerarJson<T>(
  schema: z.ZodType<T>,
  construirPrompt: (erroAnterior?: string) => string,
  validar: (valor: T) => void,
  maxOutputTokens: number,
): Promise<T> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("IA não configurada.");
  const gateway = createLovableAiGatewayProvider(key);

  let ultimoErro: string | undefined;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    let valor: unknown;
    try {
      const result = streamText({
        model: gateway("google/gemini-3.6-flash"),
        prompt: construirPrompt(ultimoErro),
        maxOutputTokens,
        maxRetries: 0,
        output: Output.object({ schema }),
      });
      try {
        valor = await result.output;
      } catch {
        // fallback: alguns retornos vêm com cercas de markdown ou texto extra
        valor = extrairJson(await result.text);
      }
    } catch (err) {
      if (!transitorio(err) || tentativa === MAX_TENTATIVAS) erroDeRede(err);
      await new Promise((r) => setTimeout(r, 1000 * tentativa));
      continue;
    }

    try {
      const parsed = schema.parse(valor);
      validar(parsed);
      return parsed;
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
      EsqueletoSchema,
      (erro) => promptEsqueleto(data.linguagem, data.nivel, erro),
      validarEsqueleto,
      4000,
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
    gerarJson(ModuloSchema, (erro) => promptModulo(data, erro), validarModulo, 8000),
  );

