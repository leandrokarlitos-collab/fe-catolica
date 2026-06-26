import type { ExamData, QuestionSection, Section } from "../types";
import { isQuestionSection, normalizeQuestion } from "../types";
import { ATO_CONTRICAO } from "../content/prayers";
import { formatSince } from "./since";

export interface ReviewItem {
  q: string;
  note: string;
  /** Quantas vezes, já formatado (ex.: "3 vezes", "diversas vezes"). */
  times: string;
}

export interface ReviewBlock {
  section: QuestionSection;
  items: ReviewItem[];
  note: string;
}

/** Formata o número de vezes para exibição. "" quando não informado. */
export function formatTimes(count: string): string {
  if (!count) return "";
  if (count === "diversas") return "diversas vezes";
  const n = Number(count);
  if (!n) return "";
  return `${n} ${n === 1 ? "vez" : "vezes"}`;
}

/**
 * Avalia uma pergunta. Entra na Revisão quando:
 *  - é "há quanto tempo" (`since`) e foi informada; ou
 *  - é aberta (`open`) e tem texto; ou
 *  - a resposta dada é a "marcante" (igual ao `flag`).
 * "Não se aplica" nunca entra.
 */
function evalQuestion(
  section: QuestionSection,
  index: number,
  data: ExamData,
): { marked: boolean; item: ReviewItem } {
  const norm = normalizeQuestion(section.questions[index]);
  const key = `${section.id}-${index}`;
  const raw = (data.qnotes[key] ?? "").trim();

  if (norm.since) {
    const note = formatSince(raw);
    return { marked: note.length > 0, item: { q: norm.text, note, times: "" } };
  }
  if (norm.open) {
    return { marked: raw.length > 0, item: { q: norm.text, note: raw, times: "" } };
  }
  const marked = data.answers[key] === norm.flag;
  const times = norm.countable ? formatTimes(data.counts[key] ?? "") : "";
  return { marked, item: { q: norm.text, note: raw, times } };
}

/**
 * Monta os blocos da Revisão: para cada seção de perguntas, as perguntas
 * marcadas (com anotação e número de vezes) e a anotação geral da seção.
 */
export function buildReviewBlocks(
  sections: Section[],
  data: ExamData,
): ReviewBlock[] {
  return sections
    .filter(isQuestionSection)
    .map((section) => {
      const items: ReviewItem[] = [];
      section.questions.forEach((_, i) => {
        const { marked, item } = evalQuestion(section, i, data);
        if (marked) items.push(item);
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
      if (evalQuestion(section, i, data).marked) n += 1;
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
      lines.push("• " + it.q + (it.times ? ` (${it.times})` : ""));
      if (it.note) lines.push("    — " + it.note);
    }
    if (note) lines.push("Outras anotações: " + note);
    lines.push("");
  }

  lines.push("ATO DE CONTRIÇÃO");
  lines.push(ATO_CONTRICAO);
  return lines.join("\n");
}
