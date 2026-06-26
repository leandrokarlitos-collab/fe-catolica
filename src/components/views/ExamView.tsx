import { forwardRef } from "react";
import type { Answer, ExamData, ExamMode, QuestionSection } from "../../types";
import { normalizeQuestion, visibleInMode } from "../../types";
import { SectionHeader } from "../SectionHeader";
import { QuestionBlock } from "../QuestionBlock";
import { SinceConfession } from "../SinceConfession";

interface Props {
  section: QuestionSection;
  data: ExamData;
  mode: ExamMode;
  reducedMotion: boolean;
  onAnswer: (key: string, value: Answer) => void;
  onQNote: (key: string, value: string) => void;
  onCount: (key: string, value: string) => void;
  onNote: (sectionId: string, value: string) => void;
}

export const ExamView = forwardRef<HTMLHeadingElement, Props>(
  function ExamView(
    { section, data, mode, reducedMotion, onAnswer, onQNote, onCount, onNote },
    ref,
  ) {
    // Mantém o índice original (chave de estado), filtrando pelo modo escolhido.
    const visible = section.questions
      .map((q, i) => ({ norm: normalizeQuestion(q), i }))
      .filter(({ norm }) => visibleInMode(norm, mode));

    const answered = visible.filter(({ norm, i }) => {
      const key = `${section.id}-${i}`;
      return norm.open || norm.since
        ? (data.qnotes[key] ?? "").trim().length > 0
        : Boolean(data.answers[key]);
    }).length;
    const noteId = `${section.id}-section-note`;

    return (
      <div>
        <SectionHeader ref={ref} ribbon={section.ribbon} precept={section.precept} />
        <p className="qhint">
          Leia cada pergunta com calma, na presença de Deus. Responda{" "}
          <em>Sim</em>, <em>Não</em> ou <em>Não se aplica</em>. Quando a resposta
          indicar algo a confessar, abre-se um espaço para escrever e, nos atos,
          para informar quantas vezes.
        </p>
        <p className="section-progress" aria-live="polite">
          {answered} de {visible.length} respondidas
        </p>

        <ul className="qlist">
          {visible.map(({ norm, i }, pos) => {
            const key = `${section.id}-${i}`;

            if (norm.since) {
              return (
                <li key={key}>
                  <div className="qblock">
                    <p className="qtext">{norm.text}</p>
                    <SinceConfession
                      id={key}
                      value={data.qnotes[key] ?? ""}
                      onChange={(v) => onQNote(key, v)}
                    />
                  </div>
                </li>
              );
            }

            return (
              <QuestionBlock
                key={key}
                id={key}
                index={pos}
                question={norm.text}
                flag={norm.flag}
                open={norm.open}
                countable={norm.countable}
                value={data.answers[key]}
                qnote={data.qnotes[key] ?? ""}
                count={data.counts[key] ?? ""}
                reducedMotion={reducedMotion}
                onAnswer={(v) => onAnswer(key, v)}
                onQNote={(v) => onQNote(key, v)}
                onCount={(v) => onCount(key, v)}
              />
            );
          })}
        </ul>

        <div className="notes-wrap">
          <label className="notes-label" htmlFor={noteId}>
            <span>Outras anotações desta seção (opcional)</span>
          </label>
          <textarea
            id={noteId}
            className="notes"
            value={data.notes[section.id] ?? ""}
            onChange={(e) => onNote(section.id, e.target.value)}
            placeholder="Reflexões gerais sobre esta seção, que não cabem em uma pergunta específica…"
          />
        </div>
      </div>
    );
  },
);
