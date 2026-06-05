import { forwardRef } from "react";
import { ChevronRight } from "lucide-react";
import { SaveToggle } from "../SaveToggle";

interface Props {
  persist: boolean;
  onPersistChange: (on: boolean) => void;
  onStart: () => void;
}

export const IntroView = forwardRef<HTMLHeadingElement, Props>(
  function IntroView({ persist, onPersistChange, onStart }, ref) {
    return (
      <div>
        <div className="fleuron" aria-hidden="true">
          ✦
        </div>
        <h1 className="ribbon" tabIndex={-1} ref={ref}>
          Exame de Consciência
        </h1>
        <p className="precept" style={{ fontStyle: "normal" }}>
          Para uma boa confissão
        </p>
        <p className="section-note">
          Santuário Basílica Sagrada Família — Goiânia
        </p>
        <div className="rule" aria-hidden="true" />

        <p className="lead first">
          Faça este exame com calma e confiança na misericórdia de Deus, sem
          ansiedade nem escrúpulo. Não é uma lista para nos condenar, mas uma luz
          para nos conhecermos e voltarmos ao Pai que já nos espera. Percorra as
          seções pelo menu (☰) ou pelos botões abaixo. Em cada pergunta, responda{" "}
          <em>Sim</em> ou <em>Não</em>; quando for <em>Sim</em>, abre-se um espaço
          para escrever o que precisa levar ao confessionário.
        </p>

        <section className="panel calm">
          <h3>Para se fazer uma boa confissão</h3>
          <ol className="olist">
            <li>Fazer bem o exame de consciência.</li>
            <li>Estar sinceramente arrependido dos pecados cometidos.</li>
            <li>Ter o firme propósito de não mais pecar.</li>
            <li>
              Confessar os próprios pecados junto ao confessor, dizendo-os com toda
              a sinceridade, clareza e brevidade.
            </li>
            <li>
              Reparar o mal que se fez, cumprindo a penitência que o confessor
              indicar.
            </li>
          </ol>
        </section>

        <section className="panel caution">
          <h3>Uma confissão não tem valor</h3>
          <ol className="olist">
            <li>
              Se omite voluntariamente algum pecado grave e o número de vezes que se
              cometeu.
            </li>
            <li>Se não se estiver arrependido do pecado cometido.</li>
            <li>Se não existir o propósito de emenda de vida.</li>
            <li>Se não quiser cumprir a penitência imposta.</li>
          </ol>
        </section>

        <div className="privacy">
          <span className="seal" aria-hidden="true">
            ✠
          </span>
          <div>
            <strong>Suas anotações são privadas.</strong> Tudo o que você escrever ou
            marcar fica apenas neste aparelho — nada é enviado para lugar nenhum. Por
            padrão, ao fechar ou recarregar a página tudo é apagado. Para levar seus
            pontos ao confessionário, use <em>Imprimir</em> ou <em>Copiar</em> na
            seção <em>Revisão</em>; depois da confissão, convém apagar (ou descartar o
            papel).
          </div>
        </div>

        <SaveToggle persist={persist} onChange={onPersistChange} />

        <div className="actions no-print">
          <button className="btn btn-primary" onClick={onStart}>
            Começar o exame <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  },
);
