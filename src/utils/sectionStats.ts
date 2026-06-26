import type { ExamData, Section } from "../types";
import { isQuestionSection, normalizeQuestion } from "../types";

export interface SectionStat {
  /** Perguntas já tratadas (respondidas, ou abertas com texto). */
  answered: number;
  /** Total de perguntas da seção. */
  total: number;
  /** Há qualquer ponto marcado ou anotação nesta seção. */
  hasContent: boolean;
}

/** Calcula progresso/conteúdo de uma seção de perguntas. */
export function sectionStat(section: Section, data: ExamData): SectionStat | null {
  if (!isQuestionSection(section)) return null;
  let answered = 0;
  let hasContent = (data.notes[section.id] ?? "").trim().length > 0;

  section.questions.forEach((q, i) => {
    const norm = normalizeQuestion(q);
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

  return { answered, total: section.questions.length, hasContent };
}
