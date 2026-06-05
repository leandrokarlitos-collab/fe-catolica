import { useEffect } from "react";
import { X } from "lucide-react";
import type { ExamData, Section } from "../types";
import { GROUP_ORDER } from "../content/sections";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { sectionStat } from "../utils/sectionStats";

interface Props {
  open: boolean;
  onClose: () => void;
  sections: Section[];
  currentIndex: number;
  onJump: (index: number) => void;
  data: ExamData;
  markedCount: number;
}

export function Drawer({
  open,
  onClose,
  sections,
  currentIndex,
  onJump,
  data,
  markedCount,
}: Props) {
  const ref = useFocusTrap<HTMLElement>(open, onClose);

  // Quando fechado, marca como inerte para que o leitor de tela e o Tab
  // ignorem os itens que ficam fora da tela (deslizados para a esquerda).
  useEffect(() => {
    if (ref.current) ref.current.inert = !open;
  }, [open, ref]);

  return (
    <>
      <div
        className={`backdrop no-print${open ? " show" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`drawer no-print${open ? " show" : ""}`}
        aria-label="Índice do exame"
        ref={ref}
      >
        <div className="drawer-head">
          <h2>Índice</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar índice">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-body">
          {GROUP_ORDER.map((group) => (
            <div key={group}>
              <div className="group-label">{group}</div>
              {sections.map((s, i) =>
                s.group === group ? (
                  <button
                    key={s.id}
                    className={`nav-item${i === currentIndex ? " active" : ""}`}
                    onClick={() => onJump(i)}
                    aria-current={i === currentIndex ? "true" : undefined}
                  >
                    <span className="nav-label">{s.label}</span>
                    {renderStat(s, data)}
                  </button>
                ) : null,
              )}
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          ✠ Nada é salvo nem enviado por padrão. Suas anotações ficam só neste
          aparelho.
          {markedCount > 0 ? ` · ${markedCount} ponto(s) marcado(s) com “Sim”.` : ""}
        </div>
      </nav>
    </>
  );
}

function renderStat(section: Section, data: ExamData) {
  const stat = sectionStat(section, data);
  if (!stat) return null;
  return (
    <>
      {stat.answered > 0 && (
        <span className="nav-count">
          {stat.answered}/{stat.total}
        </span>
      )}
      <span
        className={`dot${stat.hasContent ? " on" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
