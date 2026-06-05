interface Props {
  persist: boolean;
  onChange: (on: boolean) => void;
}

/**
 * Liga/desliga a gravação local (localStorage) das anotações neste aparelho.
 * Desligado por padrão — privacidade em primeiro lugar.
 */
export function SaveToggle({ persist, onChange }: Props) {
  return (
    <div className="save-toggle no-print">
      <span className="switch">
        <input
          type="checkbox"
          checked={persist}
          onChange={(e) => onChange(e.target.checked)}
          aria-label="Salvar respostas neste aparelho"
        />
        <span className="track" aria-hidden="true" />
      </span>
      <div>
        <div className="save-title">Salvar neste aparelho</div>
        <div className="save-desc">
          {persist
            ? "Suas respostas ficam guardadas neste navegador e continuam ao recarregar. Use “Apagar tudo” na Revisão para remover."
            : "Desligado: nada é guardado. Ao recarregar ou fechar, tudo é apagado. Ligue se quiser continuar depois neste mesmo aparelho."}
        </div>
      </div>
    </div>
  );
}
