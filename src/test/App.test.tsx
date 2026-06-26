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

  it("marcar a resposta relevante abre o campo de anotação", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Abrir índice/i }));
    const nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: /Exame Inicial/i }));

    // A 1ª pergunta com botões ("Escondi…") tem polaridade Sim.
    const simButtons = screen.getAllByRole("button", { name: "Sim" });
    await user.click(simButtons[0]);
    expect(
      screen.getByPlaceholderText(/O que deseja dizer ao confessor/i),
    ).toBeInTheDocument();
  });

  it("oferece o botão 'Não se aplica' nas perguntas", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Abrir índice/i }));
    const nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: /Exame Inicial/i }));
    expect(
      screen.getAllByRole("button", { name: "Não se aplica" }).length,
    ).toBeGreaterThan(0);
  });

  it("mostra controle de tempo em 'Há quanto tempo não me confesso?'", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Abrir índice/i }));
    const nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: /Exame Inicial/i }));
    expect(
      screen.getByRole("button", { name: /Primeira confissão/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Unidade de tempo/i)).toBeInTheDocument();
  });

  it("modo Resumido esconde perguntas detalhadas; Detalhado mostra todas", async () => {
    const user = userEvent.setup();
    render(<App />);
    // Seleciona Resumido na tela inicial (escopo no conteúdo, não no índice).
    const main = screen.getByRole("main");
    await user.click(within(main).getByRole("button", { name: "Resumido" }));

    const openIndex = () =>
      user.click(screen.getByRole("button", { name: /Abrir índice/i }));
    await openIndex();
    let nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: /1º Mandamento/i }));

    // "Tenho rezado diariamente?" é essencial (core) -> aparece no Resumido.
    expect(screen.getByText(/Tenho rezado diariamente/i)).toBeInTheDocument();
    // "Sou supersticioso?" é detalhada -> não aparece no Resumido.
    expect(screen.queryByText(/Sou supersticioso/i)).not.toBeInTheDocument();

    // Alterna para Detalhado pelo índice; a detalhada passa a aparecer.
    await openIndex();
    nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: "Detalhado" }));
    expect(screen.getByText(/Sou supersticioso/i)).toBeInTheDocument();
  });

  it("oferece 'Quantas vezes?' ao marcar um ato contável", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Abrir índice/i }));
    const nav = screen.getByRole("navigation", { name: /Índice do exame/i });
    await user.click(within(nav).getByRole("button", { name: /Exame Inicial/i }));

    // 1ª pergunta com botões: "Escondi…" (ato contável, polaridade Sim).
    await user.click(screen.getAllByRole("button", { name: "Sim" })[0]);
    expect(screen.getByText(/Quantas vezes\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Diversas vezes/i }),
    ).toBeInTheDocument();
  });
});
