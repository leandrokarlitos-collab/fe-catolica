import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

beforeEach(() => {
  window.localStorage.clear();
});

describe("App", () => {
  it("renderiza a introdução com o título principal", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Exame de Consciência/i }),
    ).toBeInTheDocument();
  });

  it("avança da introdução para a Oração Inicial", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Começar o exame/i }));
    expect(
      screen.getByRole("heading", { level: 1, name: "Oração Inicial" }),
    ).toBeInTheDocument();
  });

  it("permite abrir o índice e saltar para um mandamento", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Abrir índice/i }));
    const nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: /1º Mandamento/i }));
    expect(
      screen.getByRole("heading", { level: 1, name: "1º Mandamento" }),
    ).toBeInTheDocument();
  });

  it("marcar 'Sim' abre o campo de anotação da pergunta", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Abrir índice/i }));
    const nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: /Exame Inicial/i }));

    const simButtons = screen.getAllByRole("button", { name: "Sim" });
    await user.click(simButtons[0]);
    expect(
      screen.getByPlaceholderText(/O que deseja dizer ao confessor/i),
    ).toBeInTheDocument();
  });
});
