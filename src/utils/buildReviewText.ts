import type { ExamData, QuestionSection, Section } from "../types";
import { isQuestionSection, normalizeQuestion } from "../types";
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
 * Uma pergunta entra na Revisão quando:
 *  - é aberta (`open`) e tem texto anotado; ou
 *  - a resposta dada é a "marcante" (igual ao `flag` da pergunta).
 * "Não se aplica" nunca entra.
 */
function isMarked(
  section: QuestionSection,
  index: number,
  data: ExamData,
): { marked: boolean; note: string } {
  const norm = normalizeQuestion(section.questions[index]);
  const key = `${section.id}-${index}`;
  const note = (data.qnotes[key] ?? "").trim();
  if (norm.open) return { marked: note.length > 0, note };
  return { marked: data.answers[key] === norm.flag, note };
}

/**
 * Monta os blocos da Revisão: para cada seção de perguntas, as perguntas
 * marcadas (com sua anotação) e a anotação geral da seção. Seções sem nada
 * marcado são omitidas.
 */
export function buildReviewBlocks(
  sections: Section[],
  data: ExamData,
): ReviewBlock[] {
  return sections
    .filter(isQuestionSection)
    .map((section) => {
      const items: ReviewItem[] = [];
      section.questions.forEach((q, i) => {
        const { marked, note } = isMarked(section, i, data);
        if (marked) items.push({ q: normalizeQuestion(q).text, note });
      });
      const note = (data.notes[section.id] ?? "").trim();
      return { section, items, note };
    })
    .filter((b) => b.items.length > 0 || b.note);
}

/** Conta quantas perguntas estão marcadas como matéria a levar à confissão. */
export function countMarked(sections: Section[], data: ExamData): number {
  let n = 0;
  for (const section of sections) {
    if (!isQuestionSection(section)) continue;
    section.questions.forEach((_, i) => {
      if (isMarked(section, i, data).marked) n += 1;
    });
  }
  return n;
}

/** Gera o texto puro da Revisão para copiar/imprimir. */
export function buildReviewText(sections: Section[], data: ExamData): string {
  const blocks = buildReviewBlocks(sections, data);
  if (blocks.length === 0) return "Nenhum ponto foi marcado para a confissão.";

  const lines: string[] = ["EXAME DE CONSCIÊNCIA — Pontos para a confissão", ""];

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
