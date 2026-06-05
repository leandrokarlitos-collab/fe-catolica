import { describe, it, expect } from "vitest";
import type { ExamData } from "../types";
import { SECTIONS } from "../content/sections";
import { buildReviewBlocks, buildReviewText } from "../utils/buildReviewText";

const empty: ExamData = { answers: {}, qnotes: {}, notes: {} };

describe("buildReviewBlocks", () => {
  it("retorna vazio quando nada foi marcado", () => {
    expect(buildReviewBlocks(SECTIONS, empty)).toEqual([]);
  });

  it("inclui apenas perguntas marcadas com 'sim'", () => {
    const data: ExamData = {
      answers: { "mand-2-0": "sim", "mand-2-1": "nao" },
      qnotes: {},
      notes: {},
    };
    const blocks = buildReviewBlocks(SECTIONS, data);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].section.id).toBe("mand-2");
    expect(blocks[0].items).toHaveLength(1);
  });

  it("inclui anexa a anotação da pergunta e a nota geral da seção", () => {
    const data: ExamData = {
      answers: { "mand-3-0": "sim" },
      qnotes: { "mand-3-0": "três vezes" },
      notes: { "mand-3": "reflexão geral" },
    };
    const [block] = buildReviewBlocks(SECTIONS, data);
    expect(block.items[0].note).toBe("três vezes");
    expect(block.note).toBe("reflexão geral");
  });

  it("inclui seção que só tem nota geral, sem perguntas marcadas", () => {
    const data: ExamData = {
      answers: {},
      qnotes: {},
      notes: { "mand-5": "algo a dizer" },
    };
    const blocks = buildReviewBlocks(SECTIONS, data);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].items).toHaveLength(0);
    expect(blocks[0].note).toBe("algo a dizer");
  });
});

describe("buildReviewText", () => {
  it("mensagem padrão quando nada marcado", () => {
    expect(buildReviewText(SECTIONS, empty)).toBe(
      "Nenhum ponto foi marcado com “Sim”.",
    );
  });

  it("monta texto com cabeçalho, pontos e Ato de Contrição", () => {
    const data: ExamData = {
      answers: { "mand-2-3": "sim" },
      qnotes: { "mand-2-3": "uma vez" },
      notes: {},
    };
    const text = buildReviewText(SECTIONS, data);
    expect(text).toContain("EXAME DE CONSCIÊNCIA");
    expect(text).toContain("2º MANDAMENTO");
    expect(text).toContain("• Jurei sabendo que era falso o que prometia?");
    expect(text).toContain("    — uma vez");
    expect(text).toContain("ATO DE CONTRIÇÃO");
  });
});
