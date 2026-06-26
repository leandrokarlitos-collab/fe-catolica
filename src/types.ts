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
 * "Sim", e é um ato contável) ou um objeto quando:
 *  - a falta é responder "Não" (`flag: "nao"`), ex.: "Tenho rezado diariamente?";
 *  - não é um ato contável, mas um estado/disposição/omissão (`countable: false`),
 *    ex.: "Guardo ódio no coração?" — não pede "quantas vezes";
 *  - é informativa/aberta (`open: true`), com campo livre para anotar;
 *  - é a pergunta "Há quanto tempo não me confesso?" (`since: true`), com
 *    seletor numérico de tempo.
 */
export interface QuestionItem {
  text: string;
  flag?: Polarity;
  open?: boolean;
  since?: boolean;
  /** Se a pergunta admite "quantas vezes". Default: atos respondidos com "Sim". */
  countable?: boolean;
}

export type QuestionInput = string | QuestionItem;

export interface NormalizedQuestion {
  text: string;
  flag: Polarity;
  open: boolean;
  since: boolean;
  countable: boolean;
}

/** Normaliza uma pergunta para a forma completa usada pela UI e pela Revisão. */
export function normalizeQuestion(q: QuestionInput): NormalizedQuestion {
  if (typeof q === "string") {
    return { text: q, flag: "sim", open: false, since: false, countable: true };
  }
  const flag = q.flag ?? "sim";
  const open = q.open ?? false;
  const since = q.since ?? false;
  // Por padrão, só atos cometidos (responder "Sim") pedem o número de vezes.
  const countable = q.countable ?? (flag === "sim" && !open && !since);
  return { text: q.text, flag, open, since, countable };
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
  /** chave `${sectionId}-${index}` -> "sim" | "nao" | "na" */
  answers: Record<string, Answer>;
  /** chave `${sectionId}-${index}` -> anotação livre da pergunta */
  qnotes: Record<string, string>;
  /**
   * chave `${sectionId}-${index}` -> número de vezes ("3") ou "diversas".
   * Vazio/ausente = não informado.
   */
  counts: Record<string, string>;
  /** chave `${sectionId}` -> anotação geral da seção */
  notes: Record<string, string>;
}
