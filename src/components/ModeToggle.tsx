import type { ExamMode } from "../types";

interface Props {
  mode: ExamMode;
  onChange: (mode: ExamMode) => void;
  /** "lg" para a tela inicial; "sm" para o índice. */
  size?: "lg" | "sm";
}

/**
 * Seletor deslizante Resumido / Detalhado — define quantas perguntas aparecem.
 */
export function ModeToggle({ mode, onChange, size = "lg" }: Props) {
  return (
    <div
      className={`mode-toggle ${size}${mode === "detalhado" ? " is-detalhado" : ""}`}
      role="group"
      aria-label="Quantidade de perguntas"
    >
      <span className="mode-thumb" aria-hidden="true" />
      <button
        type="button"
        className={`mode-opt${mode === "resumido" ? " on" : ""}`}
        onClick={() => onChange("resumido")}
        aria-pressed={mode === "resumido"}
      >
        Resumido
      </button>
      <button
        type="button"
        className={`mode-opt${mode === "detalhado" ? " on" : ""}`}
        onClick={() => onChange("detalhado")}
        aria-pressed={mode === "detalhado"}
      >
        Detalhado
      </button>
    </div>
  );
}
