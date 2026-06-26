import { forwardRef } from "react";
import { Printer, Copy, Trash2 } from "lucide-react";
import type { ExamData, ReviewSection, Section } from "../../types";
import { ATO_CONTRICAO } from "../../content/prayers";
import { buildReviewBlocks } from "../../utils/buildReviewText";
import { SectionHeader } from "../SectionHeader";

interface Props {
  section: ReviewSection;
  sections: Section[];
  data: ExamData;
  markedCount: number;
  confirmClear: boolean;
  toast: string;
  onPrint: () => void;
  onCopy: () => void;
  onClear: () => void;
}

export const ReviewView = forwardRef<HTMLHeadingElement, Props>(
  function ReviewView(
    {
      section,
      sections,
      data,
      markedCount,
      confirmClear,
      toast,
      onPrint,
      onCopy,
      onClear,
    },
    ref,
  ) {
    const blocks = buildReviewBlocks(sections, data);

    return (
      <div className="printable">
        <SectionHeader ref={ref} ribbon={section.ribbon} precept={section.precept} />
        <p className="review-intro">
          Leve estes pontos ao confessionário e diga-os com sinceridade, clareza e
          brevidade. Confie: “se confessarmos os nossos pecados, Ele é fiel e justo
          para nos perdoar” (1Jo 1,9).
        </p>

        {blocks.length === 0 ? (
          <div className="empty">
            Você ainda não marcou nenhum ponto para a confissão nem escreveu
            anotações.
            <br />
            Volte às seções, leia as perguntas com calma e responda o que desejar
            levar à confissão.
          </div>
        ) : (
          blocks.map(({ section: s, items, note }) => (
            <div className="rev-block" key={s.id}>
              <h2>{s.ribbon}</h2>
              {s.precept && <div className="rev-precept">{s.precept}</div>}
              {items.length > 0 && (
                <ul className="rev-list">
                  {items.map((it, i) => (
                    <li key={i}>
                      {it.q}
                      {it.times && <span className="rev-times">{it.times}</span>}
                      {it.note && <div className="rev-subnote">{it.note}</div>}
                    </li>
                  ))}
                </ul>
              )}
              {note && (
                <div className="rev-note">
                  <b>Outras anotações</b>
                  {note}
                </div>
              )}
            </div>
          ))
        )}

        {blocks.length > 0 && (
          <div className="rev-block">
            <h2>Ato de Contrição</h2>
            <div className="rev-note" style={{ borderLeftColor: "var(--maroon)" }}>
              {ATO_CONTRICAO}
            </div>
          </div>
        )}

        <div className="actions no-print">
          <button className="btn btn-primary" onClick={onPrint}>
            <Printer size={16} aria-hidden="true" /> Imprimir
          </button>
          <button className="btn" onClick={onCopy}>
            <Copy size={16} aria-hidden="true" /> Copiar texto
          </button>
          <button className="btn btn-danger" onClick={onClear}>
            <Trash2 size={16} aria-hidden="true" />{" "}
            {confirmClear ? "Confirmar?" : "Apagar tudo"}
          </button>
        </div>
        <div className="toast no-print" role="status" aria-live="polite">
          {toast}
        </div>

        {blocks.length > 0 && (
          <div className="privacy no-print" style={{ marginTop: 18 }}>
            <span className="seal" aria-hidden="true">
              ✠
            </span>
            <div>
              Depois da confissão, você pode usar <em>Apagar tudo</em> com
              tranquilidade.
              {markedCount > 0
                ? ` ${markedCount} ponto(s) marcado(s) para a confissão.`
                : ""}
            </div>
          </div>
        )}
      </div>
    );
  },
);
