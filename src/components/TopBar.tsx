import { Menu } from "lucide-react";

interface Props {
  current: number;
  total: number;
  onOpenMenu: () => void;
}

export function TopBar({ current, total, onOpenMenu }: Props) {
  return (
    <header className="topbar no-print">
      <button className="icon-btn" onClick={onOpenMenu} aria-label="Abrir índice">
        <Menu size={20} aria-hidden="true" />
      </button>
      <div className="brand">
        Exame de Consciência
        <small>Para uma boa confissão</small>
      </div>
      <div
        className="counter"
        aria-label={`Seção ${current} de ${total}`}
      >
        {current} / {total}
      </div>
    </header>
  );
}
