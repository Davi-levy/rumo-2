import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { buildPrompt, parseTrilhaJson, NIVEIS } from "./trilha.server";

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
    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      prompt: buildPrompt(data.linguagem, data.nivel),
    });

    const text = await result.text;
    return parseTrilhaJson(text);
  });
