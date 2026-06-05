import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  label: string;
  markedCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function BottomNav({
  label,
  markedCount,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: Props) {
  return (
    <nav className="bottombar no-print" aria-label="Navegação entre seções">
      <button className="btn" onClick={onPrev} disabled={!canPrev}>
        <ChevronLeft size={16} aria-hidden="true" />
        <span className="lbl">Anterior</span>
      </button>
      <span className="spacer">
        {label}
        {markedCount > 0 && (
          <span className="marked">{markedCount} marcado(s)</span>
        )}
      </span>
      <button className="btn btn-primary" onClick={onNext} disabled={!canNext}>
        <span className="lbl">Próximo</span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
