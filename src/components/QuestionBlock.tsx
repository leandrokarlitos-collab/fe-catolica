import { Check } from "lucide-react";
import type { Answer, Polarity } from "../types";

interface Props {
  id: string;
  index: number;
  question: string;
  /** Resposta que indica matéria a levar à confissão. */
  flag: Polarity;
  /** Pergunta aberta: sem Sim/Não, apenas anotação. */
  open: boolean;
  /** Admite "quantas vezes". */
  countable: boolean;
  value: Answer | undefined;
  qnote: string;
  count: string;
  reducedMotion: boolean;
  onAnswer: (value: Answer) => void;
  onQNote: (value: string) => void;
  onCount: (value: string) => void;
}

export function QuestionBlock({
  id,
  index,
  question,
  flag,
  open,
  countable,
  value,
  qnote,
  count,
  reducedMotion,
  onAnswer,
  onQNote,
  onCount,
}: Props) {
  const noteId = `${id}-note`;
  // Pergunta marcada (matéria a confessar): aberta com texto, ou resposta = flag.
  const isMarked = open ? qnote.trim().length > 0 : value === flag;

  return (
    <li>
      <div
        className={`qblock${isMarked ? " marked" : ""}`}
        style={
          reducedMotion
            ? undefined
            : { animationDelay: `${Math.min(index * 32, 480)}ms` }
        }
      >
        <p className="qtext">{question}</p>

        {!open && (
          <div className="qa" role="group" aria-label="Resposta">
            <AnswerButton
              kind="sim"
              label="Sim"
              active={value === "sim"}
              marking={flag === "sim"}
              onClick={() => onAnswer("sim")}
            />
            <AnswerButton
              kind="nao"
              label="Não"
              active={value === "nao"}
              marking={flag === "nao"}
              onClick={() => onAnswer("nao")}
            />
            <AnswerButton
              kind="na"
              label="Não se aplica"
              active={value === "na"}
              marking={false}
              onClick={() => onAnswer("na")}
            />
          </div>
        )}

        {isMarked && countable && (
          <TimesControl id={id} count={count} onCount={onCount} />
        )}

        {(open || isMarked) && (
          <div className="qnote-wrap">
            <label className="qnote-label" htmlFor={noteId}>
              {open ? "Anotar" : "Escrever (opcional)"}
            </label>
            <textarea
              id={noteId}
              className="qnote"
              value={qnote}
              onChange={(e) => onQNote(e.target.value)}
              placeholder={
                open
                  ? "Escreva aqui o que deseja registrar…"
                  : "O que deseja dizer ao confessor? (ex.: circunstâncias…)"
              }
            />
          </div>
        )}
      </div>
    </li>
  );
}

interface TimesProps {
  id: string;
  count: string;
  onCount: (value: string) => void;
}

/** Controle "Quantas vezes?": número ou "Diversas vezes" (incontáveis). */
function TimesControl({ id, count, onCount }: TimesProps) {
  const numId = `${id}-times`;
  const diverse = count === "diversas";

  const setNumber = (v: string) => {
    const clean = v.replace(/\D/g, "");
    onCount(clean);
  };

  return (
    <div className="times">
      <label className="times-label" htmlFor={numId}>
        Quantas vezes?
      </label>
      <input
        id={numId}
        className="times-input"
        type="number"
        min={1}
        inputMode="numeric"
        placeholder="0"
        value={diverse ? "" : count}
        disabled={diverse}
        onChange={(e) => setNumber(e.target.value)}
      />
      <button
        type="button"
        className={`times-diverse${diverse ? " on" : ""}`}
        onClick={() => onCount(diverse ? "" : "diversas")}
        aria-pressed={diverse}
      >
        {diverse && <Check size={13} strokeWidth={3} aria-hidden="true" />}
        Diversas vezes
      </button>
    </div>
  );
}

interface AnswerButtonProps {
  kind: "sim" | "nao" | "na";
  label: string;
  active: boolean;
  /** Esta resposta é a que indica matéria a confessar. */
  marking: boolean;
  onClick: () => void;
}

function AnswerButton({ kind, label, active, marking, onClick }: AnswerButtonProps) {
  return (
    <button
      className={`qbtn ${kind}${active ? " on" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {active && marking && <Check size={14} strokeWidth={3} aria-hidden="true" />}
      {label}
    </button>
  );
}
