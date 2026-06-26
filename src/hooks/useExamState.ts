import { useCallback, useEffect, useRef, useState } from "react";
import type { Answer, ExamData } from "../types";

/**
 * Estado central do exame: respostas, anotações por pergunta e anotações por
 * seção.
 *
 * Privacidade por padrão: nada é salvo. O usuário pode **optar** por salvar
 * neste aparelho (localStorage). Quando desliga o autosave, os dados gravados
 * são apagados. "Apagar tudo" limpa memória e localStorage.
 *
 * Nenhum dado trafega pela rede em nenhuma hipótese — o app é 100% local.
 */

const STORAGE_VERSION = "v1";
const DATA_KEY = `exame-consciencia:${STORAGE_VERSION}`;
const PERSIST_FLAG_KEY = `exame-consciencia:persist:${STORAGE_VERSION}`;

const EMPTY: ExamData = { answers: {}, qnotes: {}, counts: {}, notes: {} };

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* localStorage indisponível (modo privado, cota) — ignora silenciosamente */
  }
}

function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignora */
  }
}

function loadPersistFlag(): boolean {
  return safeGetItem(PERSIST_FLAG_KEY) === "1";
}

function loadData(): ExamData {
  const raw = safeGetItem(DATA_KEY);
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<ExamData>;
    return {
      answers: parsed.answers ?? {},
      qnotes: parsed.qnotes ?? {},
      counts: parsed.counts ?? {},
      notes: parsed.notes ?? {},
    };
  } catch {
    return EMPTY;
  }
}

export interface ExamState extends ExamData {
  /** Se true, o estado é persistido em localStorage neste aparelho. */
  persist: boolean;
  setPersist: (on: boolean) => void;
  /** Define/alterna resposta. Tocar na escolha já ativa limpa (volta a indefinido). */
  setAnswer: (key: string, value: Answer) => void;
  setQNote: (key: string, value: string) => void;
  setCount: (key: string, value: string) => void;
  setNote: (sectionId: string, value: string) => void;
  clearAll: () => void;
}

export function useExamState(): ExamState {
  // Inicializa a partir do localStorage somente se o usuário tinha optado por salvar.
  const [persist, setPersistState] = useState<boolean>(() => loadPersistFlag());
  const [data, setData] = useState<ExamData>(() =>
    loadPersistFlag() ? loadData() : EMPTY,
  );

  // Evita gravar no primeiro render quando não há persistência.
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (persist) {
      safeSetItem(DATA_KEY, JSON.stringify(data));
    }
  }, [data, persist]);

  const setPersist = useCallback((on: boolean) => {
    setPersistState(on);
    if (on) {
      safeSetItem(PERSIST_FLAG_KEY, "1");
      // Grava o estado atual imediatamente ao ligar.
      setData((d) => {
        safeSetItem(DATA_KEY, JSON.stringify(d));
        return d;
      });
    } else {
      // Desligar = remover o que foi gravado neste aparelho.
      safeRemoveItem(PERSIST_FLAG_KEY);
      safeRemoveItem(DATA_KEY);
    }
  }, []);

  const setAnswer = useCallback((key: string, value: Answer) => {
    setData((d) => {
      const answers = { ...d.answers };
      if (answers[key] === value) delete answers[key];
      else answers[key] = value;
      return { ...d, answers };
    });
  }, []);

  const setQNote = useCallback((key: string, value: string) => {
    setData((d) => ({ ...d, qnotes: { ...d.qnotes, [key]: value } }));
  }, []);

  const setCount = useCallback((key: string, value: string) => {
    setData((d) => ({ ...d, counts: { ...d.counts, [key]: value } }));
  }, []);

  const setNote = useCallback((sectionId: string, value: string) => {
    setData((d) => ({ ...d, notes: { ...d.notes, [sectionId]: value } }));
  }, []);

  const clearAll = useCallback(() => {
    setData(EMPTY);
    safeRemoveItem(DATA_KEY);
  }, []);

  return {
    ...data,
    persist,
    setPersist,
    setAnswer,
    setQNote,
    setCount,
    setNote,
    clearAll,
  };
}
