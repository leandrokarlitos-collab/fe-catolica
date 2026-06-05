interface Props {
  /** Percentual de 0 a 100. */
  value: number;
}

export function ProgressBar({ value }: Props) {
  return (
    <div
      className="progress no-print"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label="Progresso pelas seções"
    >
      <i style={{ width: `${value}%` }} />
    </div>
  );
}
