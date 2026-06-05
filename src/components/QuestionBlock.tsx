import { Check } from "lucide-react";
import type { Answer } from "../types";

interface Props {
  id: string;
  index: number;
  question: string;
  value: Answer | undefined;
  qnote: string;
  reducedMotion: boolean;
  onAnswer: (value: Answer) => void;
  onQNote: (value: string) => void;
}

export function QuestionBlock({
  id,
  index,
  question,
  value,
  qnote,
  reducedMotion,
  onAnswer,
  onQNote,
}: Props) {
  const noteId = `${id}-note`;
  return (
    <li>
      <div
        className={`qblock${value === "sim" ? " sim" : ""}`}
        style={
          reducedMotion
            ? undefined
            : { animationDelay: `${Math.min(index * 32, 480)}ms` }
        }
      >
        <p className="qtext">{question}</p>
        <div className="qa" role="group" aria-label="Resposta">
          <button
            className={`qbtn sim${value === "sim" ? " on" : ""}`}
            onClick={() => onAnswer("sim")}
            aria-pressed={value === "sim"}
          >
            {value === "sim" && <Check size={14} strokeWidth={3} aria-hidden="true" />}
            Sim
          </button>
          <button
            className={`qbtn nao${value === "nao" ? " on" : ""}`}
            onClick={() => onAnswer("nao")}
            aria-pressed={value === "nao"}
          >
            Não
          </button>
        </div>
        {value === "sim" && (
          <div className="qnote-wrap">
            <label className="qnote-label" htmlFor={noteId}>
              Escrever (opcional)
            </label>
            <textarea
              id={noteId}
              className="qnote"
              value={qnote}
              onChange={(e) => onQNote(e.target.value)}
              placeholder="O que deseja dizer ao confessor? (ex.: circunstâncias, número de vezes…)"
            />
          </div>
        )}
      </div>
    </li>
  );
}
