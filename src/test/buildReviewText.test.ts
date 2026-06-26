import { describe, it, expect } from "vitest";
import type { ExamData } from "../types";
import { SECTIONS } from "../content/sections";
import {
  buildReviewBlocks,
  buildReviewText,
  countMarked,
} from "../utils/buildReviewText";

const empty: ExamData = { answers: {}, qnotes: {}, notes: {} };

describe("buildReviewBlocks", () => {
  it("retorna vazio quando nada foi marcado", () => {
    expect(buildReviewBlocks(SECTIONS, empty)).toEqual([]);
  });

  it("marca pergunta de polaridade 'sim' quando respondida 'sim'", () => {
    // mand-2-0 é uma pergunta comum (falta = responder Sim).
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

  it("marca pergunta de polaridade 'não' quando respondida 'não'", () => {
    // mand-1-9 = "Tenho rezado diariamente?" (falta = responder Não).
    const simData: ExamData = {
      answers: { "mand-1-9": "sim" },
      qnotes: {},
      notes: {},
    };
    const naoData: ExamData = {
      answers: { "mand-1-9": "nao" },
      qnotes: {},
      notes: {},
    };
    expect(buildReviewBlocks(SECTIONS, simData)).toHaveLength(0);
    expect(buildReviewBlocks(SECTIONS, naoData)).toHaveLength(1);
  });

  it("'não se aplica' nunca gera ponto", () => {
    const data: ExamData = {
      answers: { "mand-2-0": "na", "mand-1-9": "na" },
      qnotes: {},
      notes: {},
    };
    expect(buildReviewBlocks(SECTIONS, data)).toHaveLength(0);
  });

  it("pergunta aberta entra na revisão quando tem texto", () => {
    // exame-inicial-0 = "Há quanto tempo não me confesso?" (aberta).
    const data: ExamData = {
      answers: {},
      qnotes: { "exame-inicial-0": "uns dois anos" },
      notes: {},
    };
    const blocks = buildReviewBlocks(SECTIONS, data);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].items[0].note).toBe("uns dois anos");
  });

  it("anexa anotação da pergunta e a nota geral da seção", () => {
    const data: ExamData = {
      answers: { "mand-3-0": "sim" },
      qnotes: { "mand-3-0": "três vezes" },
      notes: { "mand-3": "reflexão geral" },
    };
    const [block] = buildReviewBlocks(SECTIONS, data);
    expect(block.items[0].note).toBe("três vezes");
    expect(block.note).toBe("reflexão geral");
  });
});

describe("countMarked", () => {
  it("conta pontos de polaridades diferentes", () => {
    const data: ExamData = {
      answers: { "mand-2-0": "sim", "mand-1-9": "nao", "mand-2-1": "na" },
      qnotes: { "exame-inicial-0": "um ano" },
      notes: {},
    };
    // sim marcante + nao marcante + aberta com texto = 3 (na não conta).
    expect(countMarked(SECTIONS, data)).toBe(3);
  });
});

describe("buildReviewText", () => {
  it("mensagem padrão quando nada marcado", () => {
    expect(buildReviewText(SECTIONS, empty)).toBe(
      "Nenhum ponto foi marcado para a confissão.",
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
