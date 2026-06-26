/**
 * Codificação do valor de "Há quanto tempo não me confesso?" (guardado em
 * qnotes):
 *  - ""            -> não informado
 *  - "first"       -> primeira confissão
 *  - "<n>|<unit>"  -> ex.: "2|anos"
 */
export type SinceUnit = "dias" | "meses" | "anos";

export interface ParsedSince {
  first: boolean;
  amount: string;
  unit: SinceUnit;
}

export function parseSince(code: string): ParsedSince {
  if (code === "first") return { first: true, amount: "", unit: "anos" };
  const [amount = "", unit = "anos"] = code.split("|");
  return { first: false, amount, unit: (unit as SinceUnit) || "anos" };
}

/** Texto legível para a Revisão. "" quando nada foi informado. */
export function formatSince(code: string): string {
  if (code === "first") return "Primeira confissão";
  const { amount, unit } = parseSince(code);
  if (!amount.trim()) return "";
  const n = Number(amount);
  const labels: Record<SinceUnit, [string, string]> = {
    dias: ["dia", "dias"],
    meses: ["mês", "meses"],
    anos: ["ano", "anos"],
  };
  const [sing, plur] = labels[unit];
  return `Há ${amount} ${n === 1 ? sing : plur}`;
}
