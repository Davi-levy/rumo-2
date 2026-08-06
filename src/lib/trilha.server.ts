import { z } from "zod";

export const NIVEIS = ["iniciante", "intermediario", "avancado"] as const;
export type Nivel = (typeof NIVEIS)[number];

export const TrilhaGeradaSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  modulos: z.array(
    z.object({
      titulo: z.string(),
      conteudo: z.string(),
      exercicios: z.array(
        z.object({
          pergunta: z.string(),
          resposta_esperada: z.string(),
          dica: z.string().nullable().optional(),
          explicacao: z.string().nullable().optional(),
        }),
      ),
    }),
  ),
});

export type TrilhaGerada = z.infer<typeof TrilhaGeradaSchema>;

export function buildPrompt(linguagem: string, nivel: Nivel) {
  const rotulo =
    nivel === "iniciante" ? "iniciante absoluto" : nivel === "intermediario" ? "intermediário" : "avançado";

  return `Você é um professor especialista em ${linguagem}. Monte uma trilha de estudos completa em PORTUGUÊS DO BRASIL para um aluno de nível ${rotulo}.

Regras:
- Entre 6 e 8 módulos, em ordem didática crescente.
- Cada módulo tem "conteudo" em Markdown com 250 a 500 palavras: explicação clara + pelo menos um exemplo de código em bloco \`\`\`.
- Cada módulo tem de 3 a 4 exercícios.
- "resposta_esperada" deve ser CURTA e objetiva (uma palavra, um termo, um trecho de código de uma linha ou uma frase curta), porque a correção é feita por comparação textual. Nunca peça respostas longas ou dissertativas.
- "dica" é uma pista curta. "explicacao" explica em 1-2 frases por que a resposta é essa.
- Não use crases fora dos blocos de código do campo "conteudo".

Responda SOMENTE com JSON válido, sem texto antes ou depois, neste formato exato:
{"titulo":"...","descricao":"...","modulos":[{"titulo":"...","conteudo":"...","exercicios":[{"pergunta":"...","resposta_esperada":"...","dica":"...","explicacao":"..."}]}]}`;
}

export function parseTrilhaJson(text: string): TrilhaGerada {
  let raw = text.trim();
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence?.[1]) raw = fence[1].trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start > 0 || end < raw.length - 1) raw = raw.slice(start, end + 1);
  return TrilhaGeradaSchema.parse(JSON.parse(raw));
}
