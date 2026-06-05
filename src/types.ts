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

/** Seções com perguntas: exame inicial e mandamentos. */
export interface QuestionSection extends SectionBase {
  kind: "exam" | "commandment";
  ribbon: string;
  precept: string;
  questions: string[];
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
export type Answer = "sim" | "nao";

export interface ExamData {
  /** chave `${sectionId}-${index}` -> "sim" | "nao" */
  answers: Record<string, Answer>;
  /** chave `${sectionId}-${index}` -> anotação livre da pergunta */
  qnotes: Record<string, string>;
  /** chave `${sectionId}` -> anotação geral da seção */
  notes: Record<string, string>;
}
