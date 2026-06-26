import type { GroupName, QuestionItem, Section } from "../types";
import { ORACAO_INICIAL, ATO_CONTRICAO, ORACAO_AGRADECIMENTO } from "./prayers";

/**
 * Estrutura completa do exame de consciência.
 *
 * Convenções por pergunta:
 *  - string          -> a falta é responder "Sim"; ato contável; só no Detalhado.
 *  - { flag: "nao" } -> a falta é responder "Não" (perguntas positivas).
 *  - { countable: false } -> estado/disposição/omissão (sem "quantas vezes").
 *  - { since: true } -> "Há quanto tempo não me confesso?".
 *  - C(...) / core:true -> pergunta essencial: aparece também no modo "Resumido".
 *
 * A opção "Não se aplica" está em todas as perguntas e nunca gera ponto.
 */

type QExtra = Omit<QuestionItem, "text">;
/** Marca a pergunta como essencial (presente também no modo Resumido). */
const C = (text: string, extra: QExtra = {}): QuestionItem => ({
  text,
  core: true,
  ...extra,
});

export const SECTIONS: Section[] = [
  {
    id: "inicio",
    kind: "intro",
    group: "Preparação",
    label: "Início",
  },
  {
    id: "oracao-inicial",
    kind: "prayer",
    group: "Preparação",
    label: "Oração Inicial",
    ribbon: "Oração Inicial",
    text: ORACAO_INICIAL,
  },
  {
    id: "exame-inicial",
    kind: "exam",
    group: "Preparação",
    label: "Exame Inicial",
    ribbon: "Exame Inicial",
    precept: "Antes de percorrer os mandamentos",
    questions: [
      C("Há quanto tempo não me confesso?", { since: true }),
      C("Escondi, conscientemente, algum pecado grave em alguma confissão precedente?"),
      C(
        "Confessei, o melhor que me lembro, o número de vezes que cometi cada pecado grave?",
        { flag: "nao" },
      ),
      {
        text: "Confessei com clareza os meus pecados ou fui demasiado genérico?",
        flag: "nao",
      },
      C("Fiz a penitência que me foi imposta?", { flag: "nao" }),
      { text: "Reparei as injustiças que cometi?", flag: "nao" },
      C("Comunguei em pecado mortal?"),
      {
        text: "Respeitei o jejum eucarístico de uma hora antes da comunhão?",
        flag: "nao",
      },
      C(
        "Estou verdadeiramente arrependido dos meus pecados e luto para não pecar mais?",
        { flag: "nao" },
      ),
    ],
  },
  {
    id: "mand-1",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "1º Mandamento",
    ribbon: "1º Mandamento",
    precept: "Adorar a Deus e amá-Lo sobre todas as coisas",
    questions: [
      {
        text: "Duvidei voluntariamente da existência de Deus Pai, Filho e Espírito Santo?",
        countable: false,
      },
      { text: "Revoltei-me contra Deus nos meus sofrimentos?", countable: false },
      { text: "Deixei-me levar pelo desespero?", countable: false },
      { text: "Duvidei da bondade ou da onipotência de Deus?", countable: false },
      { text: "Tive ódio a Deus?", countable: false },
      { text: "Esperei a vida eterna sem abandonar o pecado?", countable: false },
      {
        text: "Esperei a vida eterna confiando apenas nos meus esforços?",
        countable: false,
      },
      "Cometi pecados no intuito de confessá-los mais tarde?",
      C(
        "Tenho posto em dúvida ou negado, deliberadamente, alguma verdade revelada por Deus e como tal ensinada pela Igreja?",
        { countable: false },
      ),
      C("Tenho rezado diariamente com atenção e devoção?", { flag: "nao" }),
      "Frequentei os sacramentos de má vontade?",
      { text: "Leio e medito, com frequência, na Palavra de Deus?", flag: "nao" },
      {
        text: "Procuro formar-me na fé com a ajuda do Catecismo da Igreja Católica?",
        flag: "nao",
      },
      "Defendi, por exemplo, que nós podemos só confessar diretamente a Deus, ou que o “casamento” civil entre batizados é aceitável em certos casos, ou que todas as religiões são iguais?",
      "Li alguma coisa, ouvi alguma música, ou vi algum programa contra Deus, contra a Igreja ou contra os bons costumes?",
      "Recebi indignamente algum sacramento?",
      C(
        "Faltei ao respeito das coisas santas, por exemplo, conversando ou brincando dentro da igreja, vindo indecentemente vestido para a igreja, ou omitindo a genuflexão sempre que passo diante do Santíssimo Sacramento?",
      ),
      C(
        "Coloquei a minha vontade, as minhas ideias, o dinheiro, o trabalho, os divertimentos, o prazer, a fama, o poder ou alguma coisa criada em primeiro lugar na minha vida?",
        { countable: false },
      ),
      "Adorei a Satanás? Invoquei Satanás?",
      "Usei coisas, li textos, ou ouvi músicas que invocam explicitamente o demônio?",
      { text: "Sou supersticioso?", countable: false },
      C(
        "Pratiquei a magia, o espiritismo, fui à bruxa, a médiuns, ou a curandeiros?",
      ),
      "Pratiquei a adivinhação através da astrologia, do jogo do copo, do pêndulo, das cartas do tarôt, da leitura da palma da mão ou coisas semelhantes a estas?",
      { text: "Acreditei em horóscopos?", countable: false },
      "Usei amuletos como a ferradura, o corno, as figas, os cristais ou coisas semelhantes?",
      {
        text: "Acreditei nas “energias”, nas ideias da Nova Era, na reencarnação, no Reiki, ou em coisas semelhantes?",
        countable: false,
      },
      "Tive vergonha de me mostrar católico ou de demonstrar a minha fé diante dos outros?",
      {
        text: "Fui negligente na oração e na vida espiritual por preguiça (acédia)?",
        countable: false,
      },
      {
        text: "Murmurei contra Deus ou fui ingrato pelos seus benefícios?",
        countable: false,
      },
      "Pus em risco a minha fé com leituras, ambientes, companhias ou conteúdos contrários a ela?",
      { text: "Pertenci à maçonaria ou a alguma seita?", countable: false },
      "Tentei a Deus, exigindo sinais ou milagres?",
      {
        text: "Pratiquei a religião apenas por hábito ou aparência, sem o coração?",
        countable: false,
      },
      "Comulguei sem a devida preparação ou sem ação de graças?",
    ],
  },
  {
    id: "mand-2",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "2º Mandamento",
    ribbon: "2º Mandamento",
    precept: "Não invocar o santo Nome de Deus em vão",
    questions: [
      C(
        "Blasfemei ou falei sem respeito contra Deus, contra os Santos ou contra as coisas santas?",
      ),
      "Falei mal da Igreja, do Papa, dos Bispos ou dos Padres?",
      C(
        "Pronunciei levianamente ou sem respeito o Nome de Deus, por exemplo, em anedotas ou piadas? Ou achei graça a tais piadas?",
      ),
      C("Jurei sabendo que era falso o que prometia?"),
      "Jurei fazer alguma coisa injusta ou ilícita?",
      "Roguei pragas?",
      "Deixei de cumprir algum voto ou promessa?",
      "Usei o nome de Deus, de Jesus, de Nossa Senhora ou dos Santos com irritação ou de modo irreverente?",
      "Reclamei usando expressões irreverentes (“meu Deus”, “pelo amor de Deus”) em vão?",
      "Zombei de pessoas piedosas ou de práticas religiosas?",
    ],
  },
  {
    id: "mand-3",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "3º Mandamento",
    ribbon: "3º Mandamento",
    precept: "Santificar os domingos e festas de guarda",
    questions: [
      C("Faltei à Missa ao domingo ou em algum dia santo?"),
      C("Cheguei tarde à Missa por culpa própria?"),
      C("Trabalhei ou mandei trabalhar nesses dias sem grave necessidade?"),
      {
        text: "Não dediquei nesses dias mais tempo a Deus, à família, aos pobres, aos doentes e ao descanso?",
        countable: false,
      },
      "Distraí-me voluntariamente na Missa, por exemplo com o celular?",
      "Saí da Missa antes do fim sem motivo justo?",
      "Comulguei sem ter participado da Missa inteira por culpa minha?",
      "Deixei de santificar as festas de guarda?",
      "Fiz, sem necessidade, compras ou trabalhos pesados que poderia evitar no domingo?",
    ],
  },
  {
    id: "mand-4",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "4º Mandamento",
    ribbon: "4º Mandamento",
    precept: "Honrar pai e mãe e os outros legítimos superiores",
    questions: [
      C("Obedeci aos meus pais enquanto estive sob a sua tutela?", { flag: "nao" }),
      C("Manifesto-lhes o devido amor, gratidão e respeito?", { flag: "nao" }),
      { text: "Ajudo-os espiritual e materialmente?", flag: "nao" },
      "Entristeci-os com as minhas atitudes e comportamentos?",
      { text: "Abandonei-os na velhice, ou na doença?", countable: false },
      { text: "Tenho rezado por eles?", flag: "nao" },
      C("Zanguei-me com os meus irmãos? Maltratei-os?"),
      C("Tenho transmitido a fé aos meus filhos?", { flag: "nao" }),
      "Atrasei o seu batismo, ou a sua primeira comunhão?",
      { text: "Tenho me empenhado na sua educação?", flag: "nao" },
      "Defendo-os do pecado? Dei-lhes maus exemplos?",
      { text: "Corrigi com firmeza e paciência os seus defeitos?", flag: "nao" },
      {
        text: "Fui amável com os estranhos e pouco amável na vida de família?",
        countable: false,
      },
      "Usei palavras duras com o meu esposo(a)?",
      "Evitei as discussões diante dos filhos? Tenho-lhe faltado ao respeito?",
      {
        text: "Ajudo, dentro das minhas possibilidades, os meus familiares nas necessidades espirituais ou materiais?",
        flag: "nao",
      },
      { text: "Guardei a abstinência de carne nas sextas-feiras ao longo do ano?", flag: "nao" },
      { text: "Jejuei na Quarta-Feira de Cinzas e Sexta-Feira Santa?", flag: "nao" },
      C("Confessei-me pelo menos uma vez por ano?", { flag: "nao" }),
      C("Comunguei pelo menos uma vez por ano pela Páscoa?", { flag: "nao" }),
      {
        text: "Tenho contribuído para as necessidades da Igreja segundo minhas possibilidades?",
        flag: "nao",
      },
      { text: "Obedeci ao Papa, ao meu Bispo e ao meu Pároco?", flag: "nao" },
      { text: "Obedeci às justas determinações das autoridades civis?", flag: "nao" },
      {
        text: "Como cidadão, omiti-me do bem comum, por exemplo deixando de votar com consciência ou de participar da vida social?",
        countable: false,
      },
      {
        text: "Deixei-me absorver pelo trabalho ou pelas telas, descuidando da presença com a minha família?",
        countable: false,
      },
      "Desejei a morte ou algum mal aos meus pais ou superiores?",
      "Envergonhei-me dos meus pais ou falei mal deles?",
      {
        text: "Como pai, mãe ou superior, fui injusto, autoritário ou negligente com quem me é confiado?",
        countable: false,
      },
      "Critiquei ou desautorizei o meu cônjuge diante dos filhos?",
    ],
  },
  {
    id: "mand-5",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "5º Mandamento",
    ribbon: "5º Mandamento",
    precept:
      "Não matar nem causar outro dano no corpo ou na alma a si mesmo ou ao próximo",
    questions: [
      C("Causei prejuízos ao próximo com palavras ou com obras?"),
      "Desejei-lhe mal? Agredi alguém? Insultei alguém?",
      C("Deixei-me levar pela ira?"),
      { text: "Alimentei pensamentos de vingança?", countable: false },
      C("Guardo, no coração, ódio ou rancor a alguém?", { countable: false }),
      C("Perdoei verdadeiramente as ofensas que recebi?", { flag: "nao" }),
      { text: "Deixei de falar ou nego a saudação a alguém?", countable: false },
      "Cheguei a ferir ou a tirar a vida do próximo?",
      "Colaborei, de algum modo, em atos que ocasionassem a morte de um inocente?",
      C("Pratiquei, aconselhei ou facilitei o crime gravíssimo de aborto?"),
      { text: "Defendi o aborto em certos casos?", countable: false },
      "Fui gravemente imprudente na condução de veículos motorizados, pondo em risco a minha vida e dos outros?",
      {
        text: "Cometi algum atentado contra a minha vida? Alimento pensamentos de suicídio?",
        countable: false,
      },
      C("Embriaguei-me ou, levado pela gula, comi mais do que devia? Tomei drogas?"),
      {
        text: "Preocupei-me eficazmente pelo bem do próximo, advertindo-o de algum perigo material ou espiritual, em que se encontrava?",
        flag: "nao",
      },
      "Escandalizei o próximo, incitando-o a pecar, com as minhas conversas, o meu modo de vestir, ou convidando-o a praticar alguma má ação?",
      { text: "Visto-me com decência?", flag: "nao" },
      { text: "Procurei reparar o mal que causei pelo escândalo?", flag: "nao" },
      { text: "Apoiei ou defendi a eutanásia?", countable: false },
      "Tratei alguém com desprezo por sua raça, condição ou origem?",
      "Humilhei ou pratiquei bullying contra alguém, inclusive pela internet?",
      { text: "Descuidei gravemente da minha saúde?", countable: false },
      { text: "Desejei a morte a alguém ou a mim mesmo?", countable: false },
      "Bati, feri ou maltratei fisicamente alguém?",
      "Provoquei brigas, rixas ou ódio entre as pessoas?",
      "Fui cruel com pessoas ou com animais?",
    ],
  },
  {
    id: "mand-6-9",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "6º e 9º Mandamentos",
    ribbon: "6º e 9º Mandamentos",
    precept:
      "Guardar castidade nas palavras e nas obras. Guardar castidade nos pensamentos e nos desejos",
    questions: [
      C("Consenti em pensamentos ou desejos contra a castidade?"),
      "Fixei o olhar, falei ou li coisas sensuais ou obscenas?",
      C("Vi pornografia?"),
      "Procurei o prazer sexual fora do ato conjugal?",
      "Tive liberdades no namoro? Respeitei o corpo da minha namorada (do meu namorado)?",
      C(
        "Pequei contra a castidade por atos? Sozinho (masturbação) ou acompanhado (adultério, fornicação, com pessoas do mesmo sexo)?",
      ),
      {
        text: "Havia alguma circunstância — de parentesco, matrimónio, consagração a Deus, ou menoridade — que tornassem mais grave aquela ação?",
        countable: false,
      },
      {
        text: "Vivo maritalmente com alguém com a qual não estou casado pela Igreja?",
        countable: false,
      },
      "Permiti situações que me colocaram numa situação próxima de pecado? Tenho em conta que expor-me a essas ocasiões já é pecado?",
      {
        text: "Antes de assistir a um filme ou de ler um livro procuro informar-me sobre a sua classificação moral?",
        flag: "nao",
      },
      "Usei do matrimônio indevidamente procurando o prazer sexual fora do ato conjugal?",
      "Neguei ao meu cônjuge os seus direitos?",
      "Tive intenção de tornar o ato conjugal voluntariamente infecundo praticando assim a contracepção?",
      "Tomei a pílula, usei o preservativo, ou o dispositivo intra-uterino, laqueei as trompas, ou interrompi o ato conjugal para evitar ter filhos?",
      "Aconselhei ou defendi a contracepção?",
      {
        text: "Uso do matrimônio somente naqueles dias em que julgo não poder haver descendência?",
        countable: false,
      },
      C("Faltei à fidelidade conjugal por pensamentos ou por acções?"),
      {
        text: "Mantenho amizades que são ocasião habitual deste pecado de infidelidade? Estou disposto(a) a abandoná-las?",
        countable: false,
      },
      "Troquei mensagens, fotos ou conversas de conteúdo sexual (sexting)?",
      {
        text: "Cultivei relacionamentos virtuais afetivos impróprios?",
        countable: false,
      },
      "Conversei sobre temas impuros ou contei e ouvi piadas obscenas?",
      "Fui imodesto no modo de vestir ou de me comportar?",
      "Frequentei lugares, festas ou companhias perigosas para a castidade?",
    ],
  },
  {
    id: "mand-7-10",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "7º e 10º Mandamentos",
    ribbon: "7º e 10º Mandamentos",
    precept:
      "Não furtar, ou injustamente reter ou danificar os bens do próximo. Não cobiçar as coisas alheias",
    questions: [
      C("Roubei algum objeto ou alguma quantia em dinheiro? Reparei os danos causados?"),
      {
        text: "Tive inveja dos outros? Cobicei as coisas alheias?",
        countable: false,
      },
      C("Paguei aos outros os salários devidos pelo trabalho?", { flag: "nao" }),
      { text: "Paguei os impostos?", flag: "nao" },
      {
        text: "Trabalhei com empenho nas horas que devia, ou desperdicei tempo no meu trabalho?",
        flag: "nao",
      },
      "Abusei da confiança dos meus superiores?",
      "Prejudiquei o Estado, por exemplo, abusando do fundo de desemprego ou da baixa médica?",
      "Desrespeitei os direitos de autor, copiando livros, software, filmes ou músicas, contra a vontade do autor?",
      {
        text: "Devolvi ao respectivo dono coisas emprestadas ou encontradas?",
        flag: "nao",
      },
      "Aproveitei-me injustamente da desgraça alheia?",
      "Prejudiquei, de algum modo, o próximo nos seus bens?",
      "Enganei o próximo cobrando mais do que o valor justo combinado, ou alterando a quantidade ou qualidade dos bens ou dos serviços prestados?",
      C("Reparei as injustiças que pratiquei?", { flag: "nao" }),
      {
        text: "Tolerei abusos ou injustiças que tinha obrigação de impedir?",
        countable: false,
      },
      "Fiz acepção de pessoas ou manifestei favoritismo?",
      "Gastei mais do que permitem as minhas possibilidades?",
      "Desperdicei dinheiro no jogo ou noutras coisas fúteis?",
      {
        text: "Tratei com cuidado das minhas coisas ou, por descuido, estraguei-as?",
        flag: "nao",
      },
      {
        text: "Sei aceitar, com espírito cristão, a carência de coisas necessárias ou deixo-me vencer pela ira ou pela revolta?",
        flag: "nao",
      },
      "Dei ou recebi suborno, propina, ou participei de corrupção?",
      C(
        "Fui indiferente aos pobres, deixando de socorrê-los conforme as minhas possibilidades?",
        { countable: false },
      ),
      "Causei danos à propriedade alheia ou aos bens públicos?",
      "Contraí dívidas sem intenção ou possibilidade de pagá-las?",
      {
        text: "Fui avarento e apegado ao dinheiro, fechando o coração a quem precisa?",
        countable: false,
      },
      "Encobri ou comprei coisa que sabia ser furtada?",
    ],
  },
  {
    id: "mand-8",
    kind: "commandment",
    group: "Os Dez Mandamentos",
    label: "8º Mandamento",
    ribbon: "8º Mandamento",
    precept:
      "Não levantar falsos testemunhos nem de qualquer outro modo faltar à verdade ou difamar o próximo",
    questions: [
      C("Disse mentiras? Reparei os prejuízos causados?"),
      {
        text: "Minto habitualmente com a desculpa de que as mentiras não prejudicam ninguém?",
        countable: false,
      },
      "Fiz juízos falsos ou temerários?",
      "Copiei nos exames?",
      "Revelei, sem motivo justo, defeitos graves alheios que, embora reais, não são conhecidos?",
      {
        text: "Reparei de algum modo os prejuízos causados, por exemplo, falando dos aspectos positivos dessa pessoa?",
        flag: "nao",
      },
      C(
        "Caluniei, atribuindo ao próximo defeitos que não eram verdadeiros? Já reparei os males causados?",
      ),
      "Disse mal dos outros baseando-me apenas nos boatos que ouço?",
      C("Colaborei, nas minhas conversas, na calúnia, na difamação ou na murmuração?"),
      "Semeei discórdias e inimizades com as minhas palavras?",
      "Exagerei os defeitos do próximo?",
      { text: "Gosto de ouvir falar mal do próximo?", countable: false },
      "Compartilhei notícias falsas, boatos ou a vida alheia nas redes sociais?",
      "Revelei um segredo ou confidência que devia guardar?",
      {
        text: "Deixei de defender a verdade ou a boa fama de alguém quando podia?",
        countable: false,
      },
      { text: "Fui hipócrita ou falso, fingindo o que não sou?", countable: false },
      "Acusei falsamente alguém ou dei falso testemunho?",
      "Adulei alguém por interesse?",
    ],
  },
  {
    id: "ato-contricao",
    kind: "prayer",
    group: "Conclusão",
    label: "Ato de Contrição",
    ribbon: "Ato de Contrição",
    text: ATO_CONTRICAO,
  },
  {
    id: "agradecimento",
    kind: "prayer",
    group: "Conclusão",
    label: "Oração de Agradecimento",
    ribbon: "Oração de Agradecimento",
    note: "Se possível, diante do Santíssimo Sacramento",
    text: ORACAO_AGRADECIMENTO,
    coda: "Pai nosso  ·  Ave-Maria  ·  Glória ao Pai",
  },
  {
    id: "revisao",
    kind: "review",
    group: "Conclusão",
    label: "Revisão",
    ribbon: "Revisão",
    precept: "Para levar ao confessionário",
  },
];

export const GROUP_ORDER: GroupName[] = [
  "Preparação",
  "Os Dez Mandamentos",
  "Conclusão",
];
