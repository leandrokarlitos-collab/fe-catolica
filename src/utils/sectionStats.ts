import type { ExamData, ExamMode, Section } from "../types";
import { isQuestionSection, normalizeQuestion, visibleInMode } from "../types";

export interface SectionStat {
  /** Perguntas já tratadas (respondidas, ou abertas/since com texto). */
  answered: number;
  /** Total de perguntas visíveis no modo atual. */
  total: number;
  /** Há qualquer ponto marcado ou anotação nesta seção. */
  hasContent: boolean;
}

/** Calcula progresso/conteúdo de uma seção, considerando o modo escolhido. */
export function sectionStat(
  section: Section,
  data: ExamData,
  mode: ExamMode,
): SectionStat | null {
  if (!isQuestionSection(section)) return null;
  let answered = 0;
  let total = 0;
  let hasContent = (data.notes[section.id] ?? "").trim().length > 0;

  section.questions.forEach((q, i) => {
    const norm = normalizeQuestion(q);
    if (!visibleInMode(norm, mode)) return;
    total += 1;
    const key = `${section.id}-${i}`;
    const note = (data.qnotes[key] ?? "").trim();
    if (norm.open || norm.since) {
      if (note) {
        answered += 1;
        hasContent = true;
      }
      return;
    }
    const ans = data.answers[key];
    if (ans) answered += 1;
    if (ans === norm.flag || note) hasContent = true;
  });

  return { answered, total, hasContent };
}
