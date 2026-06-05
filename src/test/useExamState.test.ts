import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useExamState } from "../hooks/useExamState";

beforeEach(() => {
  window.localStorage.clear();
});

describe("useExamState", () => {
  it("começa vazio e sem persistência", () => {
    const { result } = renderHook(() => useExamState());
    expect(result.current.answers).toEqual({});
    expect(result.current.persist).toBe(false);
    expect(result.current.markedCount).toBe(0);
  });

  it("define resposta e tocar de novo na mesma escolha limpa", () => {
    const { result } = renderHook(() => useExamState());
    act(() => result.current.setAnswer("mand-1-0", "sim"));
    expect(result.current.answers["mand-1-0"]).toBe("sim");
    expect(result.current.markedCount).toBe(1);

    act(() => result.current.setAnswer("mand-1-0", "sim"));
    expect(result.current.answers["mand-1-0"]).toBeUndefined();
    expect(result.current.markedCount).toBe(0);
  });

  it("trocar de 'sim' para 'nao' atualiza e zera contagem de sim", () => {
    const { result } = renderHook(() => useExamState());
    act(() => result.current.setAnswer("mand-1-0", "sim"));
    act(() => result.current.setAnswer("mand-1-0", "nao"));
    expect(result.current.answers["mand-1-0"]).toBe("nao");
    expect(result.current.markedCount).toBe(0);
  });

  it("persiste em localStorage quando ligado e limpa ao desligar", () => {
    const { result } = renderHook(() => useExamState());
    act(() => result.current.setAnswer("mand-1-0", "sim"));
    act(() => result.current.setPersist(true));
    expect(window.localStorage.getItem("exame-consciencia:v1")).toContain("sim");

    act(() => result.current.setPersist(false));
    expect(window.localStorage.getItem("exame-consciencia:v1")).toBeNull();
  });

  it("recarrega dados salvos quando a flag de persistência está ligada", () => {
    const first = renderHook(() => useExamState());
    act(() => first.result.current.setPersist(true));
    act(() => first.result.current.setAnswer("mand-2-1", "sim"));

    // Novo "mount" simula recarregar a página.
    const second = renderHook(() => useExamState());
    expect(second.result.current.persist).toBe(true);
    expect(second.result.current.answers["mand-2-1"]).toBe("sim");
  });

  it("clearAll esvazia tudo", () => {
    const { result } = renderHook(() => useExamState());
    act(() => result.current.setAnswer("mand-1-0", "sim"));
    act(() => result.current.setQNote("mand-1-0", "nota"));
    act(() => result.current.setNote("mand-1", "geral"));
    act(() => result.current.clearAll());
    expect(result.current.answers).toEqual({});
    expect(result.current.qnotes).toEqual({});
    expect(result.current.notes).toEqual({});
  });
});
