const KEY = "rumo:progresso";

export interface Entry {
  exercicio_id: string;
  resposta: string;
  feedback_ia: string;
  acertou: boolean;
  criado_em: string;
}

export function getProgress(): Record<string, Entry> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as Record<string, Entry>;
  } catch {
    return {};
  }
}

export function saveAnswer(entry: Entry) {
  if (typeof window === "undefined") return;
  const all = getProgress();
  all[entry.exercicio_id] = entry;
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function recentAnswers(limit = 5): Entry[] {
  return Object.values(getProgress())
    .sort((a, b) => b.criado_em.localeCompare(a.criado_em))
    .slice(0, limit);
}
