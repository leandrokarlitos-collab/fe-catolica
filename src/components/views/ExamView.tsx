import { forwardRef } from "react";
import type { Answer, ExamData, QuestionSection } from "../../types";
import { SectionHeader } from "../SectionHeader";
import { QuestionBlock } from "../QuestionBlock";

interface Props {
  section: QuestionSection;
  data: ExamData;
  reducedMotion: boolean;
  onAnswer: (key: string, value: Answer) => void;
  onQNote: (key: string, value: string) => void;
  onNote: (sectionId: string, value: string) => void;
}

export const ExamView = forwardRef<HTMLHeadingElement, Props>(
  function ExamView(
    { section, data, reducedMotion, onAnswer, onQNote, onNote },
    ref,
  ) {
    const answered = section.questions.filter(
      (_, i) => data.answers[`${section.id}-${i}`],
    ).length;
    const noteId = `${section.id}-section-note`;

    return (
      <div>
        <SectionHeader ref={ref} ribbon={section.ribbon} precept={section.precept} />
        <p className="qhint">
          Leia cada pergunta com calma, na presença de Deus. Responda <em>Sim</em> ou{" "}
          <em>Não</em>; ao marcar <em>Sim</em>, abre-se um espaço para escrever o que
          desejar levar à confissão.
        </p>
        <p className="section-progress" aria-live="polite">
          {answered} de {section.questions.length} respondidas
        </p>

        <ul className="qlist">
          {section.questions.map((q, i) => {
            const key = `${section.id}-${i}`;
            return (
              <QuestionBlock
                key={key}
                id={key}
                index={i}
                question={q}
                value={data.answers[key]}
                qnote={data.qnotes[key] ?? ""}
                reducedMotion={reducedMotion}
                onAnswer={(v) => onAnswer(key, v)}
                onQNote={(v) => onQNote(key, v)}
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
