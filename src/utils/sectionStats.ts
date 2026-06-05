import type { ExamData, Section } from "../types";
import { isQuestionSection } from "../types";

export interface SectionStat {
  /** Perguntas respondidas (sim ou não). */
  answered: number;
  /** Total de perguntas da seção. */
  total: number;
  /** Há qualquer marcação "sim" ou anotação nesta seção. */
  hasContent: boolean;
}

/** Calcula progresso/conteúdo de uma seção de perguntas. */
export function sectionStat(section: Section, data: ExamData): SectionStat | null {
  if (!isQuestionSection(section)) return null;
  let answered = 0;
  let hasContent = (data.notes[section.id] ?? "").trim().length > 0;
  section.questions.forEach((_, i) => {
    const key = `${section.id}-${i}`;
    const ans = data.answers[key];
    if (ans) answered += 1;
    if (ans === "sim" || (data.qnotes[key] ?? "").trim()) hasContent = true;
  });
  return { answered, total: section.questions.length, hasContent };
}
