/**
 * Tipos do exame de consciência.
 *
 * As seções são uma união discriminada por `kind`, o que permite renderizar
 * cada tipo com o componente certo e mantém o conteúdo (em `content/`)
 * completamente separado da UI.
 */

export type GroupName = "Preparação" | "Os Dez Mandamentos" | "Conclusão";

interface SectionBase {
  /** Identificador estável, usado como chave de estado e âncora. */
  id: string;
  group: GroupName;
  /** Rótulo curto exibido no índice e no rodapé. */
  label: string;
}

export interface IntroSection extends SectionBase {
  kind: "intro";
}

export interface PrayerSection extends SectionBase {
  kind: "prayer";
  ribbon: string;
  text: string;
  note?: string;
  /** Linha final opcional (ex.: "Pai nosso · Ave-Maria · Glória ao Pai"). */
  coda?: string;
}

/** Qual resposta indica matéria a levar à confissão (abre anotação + entra na Revisão). */
export type Polarity = "sim" | "nao";

/**
 * Uma pergunta do exame. Pode ser uma string (caso comum: a falta é responder
 * "Sim") ou um objeto quando:
 *  - a falta é responder "Não" (`flag: "nao"`), ex.: "Tenho rezado diariamente?";
 *  - é informativa/aberta (`open: true`), ex.: "Há quanto tempo não me confesso?",
 *    que não tem polaridade e mostra apenas um campo para anotar.
 */
export interface QuestionItem {
  text: string;
  flag?: Polarity;
  open?: boolean;
}

export type QuestionInput = string | QuestionItem;

export interface NormalizedQuestion {
  text: string;
  flag: Polarity;
  open: boolean;
}

/** Normaliza uma pergunta para a forma completa usada pela UI e pela Revisão. */
export function normalizeQuestion(q: QuestionInput): NormalizedQuestion {
  if (typeof q === "string") return { text: q, flag: "sim", open: false };
  return { text: q.text, flag: q.flag ?? "sim", open: q.open ?? false };
}

/** Seções com perguntas: exame inicial e mandamentos. */
export interface QuestionSection extends SectionBase {
  kind: "exam" | "commandment";
  ribbon: string;
  precept: string;
  questions: QuestionInput[];
}

export interface ReviewSection extends SectionBase {
  kind: "review";
  ribbon: string;
  precept: string;
}

export type Section =
  | IntroSection
  | PrayerSection
  | QuestionSection
  | ReviewSection;

/** Seções que possuem perguntas marcáveis. */
export function isQuestionSection(s: Section): s is QuestionSection {
  return s.kind === "exam" || s.kind === "commandment";
}

/** Resposta a uma pergunta. Ausência da chave = não respondida. */
export type Answer = "sim" | "nao" | "na";

export interface ExamData {
  /** chave `${sectionId}-${index}` -> "sim" | "nao" */
  answers: Record<string, Answer>;
  /** chave `${sectionId}-${index}` -> anotação livre da pergunta */
  qnotes: Record<string, string>;
  /** chave `${sectionId}` -> anotação geral da seção */
  notes: Record<string, string>;
}
