import { forwardRef } from "react";

interface Props {
  ribbon: string;
  precept?: string;
  note?: string;
}

/**
 * Cabeçalho de seção (fleurão + faixa + preceito). Encaminha a ref para o
 * <h1> para que o foco possa ser movido até aqui ao trocar de seção (a11y).
 */
export const SectionHeader = forwardRef<HTMLHeadingElement, Props>(
  function SectionHeader({ ribbon, precept, note }, ref) {
    return (
      <header>
        <div className="fleuron" aria-hidden="true">
          ✦
        </div>
        <h1 className="ribbon" tabIndex={-1} ref={ref}>
          {ribbon}
        </h1>
        {precept && <p className="precept">{precept}</p>}
        {note && <p className="section-note">{note}</p>}
        <div className="rule" aria-hidden="true" />
      </header>
    );
  },
);
