import type { ExamData, QuestionSection, Section } from "../types";
import { isQuestionSection } from "../types";
import { ATO_CONTRICAO } from "../content/prayers";

export interface ReviewItem {
  q: string;
  note: string;
}

export interface ReviewBlock {
  section: QuestionSection;
  items: ReviewItem[];
  note: string;
}

/**
 * Monta os blocos da Revisão: para cada seção de perguntas, as perguntas
 * marcadas com "sim" (com sua anotação) e a anotação geral da seção.
 * Seções sem nada marcado são omitidas.
 */
export function buildReviewBlocks(
  sections: Section[],
  data: ExamData,
): ReviewBlock[] {
  return sections
    .filter(isQuestionSection)
    .map((section) => {
      const items: ReviewItem[] = section.questions
        .map((q, i) => ({ q, note: (data.qnotes[`${section.id}-${i}`] ?? "").trim() }))
        .filter((_, i) => data.answers[`${section.id}-${i}`] === "sim");
      const note = (data.notes[section.id] ?? "").trim();
      return { section, items, note };
    })
    .filter((b) => b.items.length > 0 || b.note);
}

/** Gera o texto puro da Revisão para copiar/imprimir. */
export function buildReviewText(sections: Section[], data: ExamData): string {
  const blocks = buildReviewBlocks(sections, data);
  if (blocks.length === 0) return "Nenhum ponto foi marcado com “Sim”.";

  const lines: string[] = [
    "EXAME DE CONSCIÊNCIA — Pontos para a confissão",
    "",
  ];

  for (const { section, items, note } of blocks) {
    lines.push(section.ribbon.toUpperCase());
    if (section.precept) lines.push(section.precept);
    for (const it of items) {
      lines.push("• " + it.q);
      if (it.note) lines.push("    — " + it.note);
    }
    if (note) lines.push("Outras anotações: " + note);
    lines.push("");
  }

  lines.push("ATO DE CONTRIÇÃO");
  lines.push(ATO_CONTRICAO);
  return lines.join("\n");
}
