import { describe, it, expect } from "vitest";
import type { ExamData } from "../types";
import { SECTIONS } from "../content/sections";
import {
  buildReviewBlocks,
  buildReviewText,
  countMarked,
  formatTimes,
} from "../utils/buildReviewText";

function data(partial: Partial<ExamData>): ExamData {
  return {
    answers: {},
    qnotes: {},
    counts: {},
    notes: {},
    ...partial,
  };
}

const empty = data({});

describe("buildReviewBlocks", () => {
  it("retorna vazio quando nada foi marcado", () => {
    expect(buildReviewBlocks(SECTIONS, empty)).toEqual([]);
  });

  it("marca pergunta de polaridade 'sim' quando respondida 'sim'", () => {
    const blocks = buildReviewBlocks(
      SECTIONS,
      data({ answers: { "mand-2-0": "sim", "mand-2-1": "nao" } }),
    );
    expect(blocks).toHaveLength(1);
    expect(blocks[0].section.id).toBe("mand-2");
    expect(blocks[0].items).toHaveLength(1);
  });

  it("marca pergunta de polaridade 'não' quando respondida 'não'", () => {
    // mand-1-9 = "Tenho rezado diariamente?" (falta = responder Não).
    expect(
      buildReviewBlocks(SECTIONS, data({ answers: { "mand-1-9": "sim" } })),
    ).toHaveLength(0);
    expect(
      buildReviewBlocks(SECTIONS, data({ answers: { "mand-1-9": "nao" } })),
    ).toHaveLength(1);
  });

  it("'não se aplica' nunca gera ponto", () => {
    const blocks = buildReviewBlocks(
      SECTIONS,
      data({ answers: { "mand-2-0": "na", "mand-1-9": "na" } }),
    );
    expect(blocks).toHaveLength(0);
  });

  it("inclui número de vezes em ato contável", () => {
    const blocks = buildReviewBlocks(
      SECTIONS,
      data({ answers: { "mand-2-0": "sim" }, counts: { "mand-2-0": "3" } }),
    );
    expect(blocks[0].items[0].times).toBe("3 vezes");
  });

  it("aceita 'diversas vezes'", () => {
    const blocks = buildReviewBlocks(
      SECTIONS,
      data({ answers: { "mand-2-0": "sim" }, counts: { "mand-2-0": "diversas" } }),
    );
    expect(blocks[0].items[0].times).toBe("diversas vezes");
  });

  it("ignora contagem em perguntas de estado (não contáveis)", () => {
    // mand-1-20 = "Sou supersticioso?" -> countable: false.
    const blocks = buildReviewBlocks(
      SECTIONS,
      data({ answers: { "mand-1-20": "sim" }, counts: { "mand-1-20": "5" } }),
    );
    expect(blocks[0].items[0].times).toBe("");
  });

  it("formata 'há quanto tempo' (since) e a opção primeira confissão", () => {
    const tempo = buildReviewBlocks(
      SECTIONS,
      data({ qnotes: { "exame-inicial-0": "2|anos" } }),
    );
    expect(tempo[0].items[0].note).toBe("Há 2 anos");

    const primeira = buildReviewBlocks(
      SECTIONS,
      data({ qnotes: { "exame-inicial-0": "first" } }),
    );
    expect(primeira[0].items[0].note).toBe("Primeira confissão");
  });

  it("anexa anotação da pergunta e a nota geral da seção", () => {
    const [block] = buildReviewBlocks(
      SECTIONS,
      data({
        answers: { "mand-3-0": "sim" },
        qnotes: { "mand-3-0": "duas vezes" },
        notes: { "mand-3": "reflexão geral" },
      }),
    );
    expect(block.items[0].note).toBe("duas vezes");
    expect(block.note).toBe("reflexão geral");
  });
});

describe("formatTimes", () => {
  it("singular, plural, diversas e vazio", () => {
    expect(formatTimes("1")).toBe("1 vez");
    expect(formatTimes("4")).toBe("4 vezes");
    expect(formatTimes("diversas")).toBe("diversas vezes");
    expect(formatTimes("")).toBe("");
  });
});

describe("countMarked", () => {
  it("conta pontos de polaridades diferentes (na não conta)", () => {
    const n = countMarked(
      SECTIONS,
      data({
        answers: { "mand-2-0": "sim", "mand-1-9": "nao", "mand-2-1": "na" },
        qnotes: { "exame-inicial-0": "first" },
      }),
    );
    expect(n).toBe(3);
  });
});

describe("buildReviewText", () => {
  it("mensagem padrão quando nada marcado", () => {
    expect(buildReviewText(SECTIONS, empty)).toBe(
      "Nenhum ponto foi marcado para a confissão.",
    );
  });

  it("monta texto com cabeçalho, número de vezes e Ato de Contrição", () => {
    const text = buildReviewText(
      SECTIONS,
      data({
        answers: { "mand-2-3": "sim" },
        counts: { "mand-2-3": "2" },
        qnotes: { "mand-2-3": "uma vez sozinho" },
      }),
    );
    expect(text).toContain("EXAME DE CONSCIÊNCIA");
    expect(text).toContain("2º MANDAMENTO");
    expect(text).toContain("• Jurei sabendo que era falso o que prometia? (2 vezes)");
    expect(text).toContain("    — uma vez sozinho");
    expect(text).toContain("ATO DE CONTRIÇÃO");
  });
});
