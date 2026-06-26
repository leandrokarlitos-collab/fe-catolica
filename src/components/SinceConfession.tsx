import { Check } from "lucide-react";
import { parseSince } from "../utils/since";

/** Pergunta "Há quanto tempo não me confesso?": número + unidade + 1ª confissão. */
interface Props {
  id: string;
  value: string;
  onChange: (code: string) => void;
}

export function SinceConfession({ id, value, onChange }: Props) {
  const { first, amount, unit } = parseSince(value);
  const numId = `${id}-amount`;
  const unitId = `${id}-unit`;

  const setAmount = (a: string) => {
    const clean = a.replace(/\D/g, "");
    onChange(clean ? `${clean}|${unit}` : "");
  };
  const setUnit = (u: string) => {
    onChange(amount ? `${amount}|${u}` : "");
  };
  const toggleFirst = () => onChange(first ? "" : "first");

  return (
    <div className="since">
      <button
        type="button"
        className={`since-first${first ? " on" : ""}`}
        onClick={toggleFirst}
        aria-pressed={first}
      >
        {first && <Check size={15} strokeWidth={3} aria-hidden="true" />}
        Primeira confissão
      </button>

      {!first && (
        <>
          <div className="since-row">
            <label className="visually-hidden" htmlFor={numId}>
              Quantidade
            </label>
            <input
              id={numId}
              className="since-amount"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label className="visually-hidden" htmlFor={unitId}>
              Unidade de tempo
            </label>
            <select
              id={unitId}
              className="since-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="dias">dias</option>
              <option value="meses">meses</option>
              <option value="anos">anos</option>
            </select>
          </div>
          <p className="since-hint">
            Se não souber ao certo, informe um valor aproximado.
          </p>
        </>
      )}
    </div>
  );
}
