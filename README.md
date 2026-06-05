# Exame de Consciência

Aplicativo web para o **Exame de Consciência** antes da confissão — Santuário
Basílica Sagrada Família (Goiânia).

SPA estático, **privado por padrão** (nada é salvo nem enviado), **instalável**
(PWA) e que **funciona offline** — útil na fila do confessionário.

## Stack

- **Vite + React + TypeScript**
- **vite-plugin-pwa** (offline / instalável)
- **Vitest** + Testing Library
- **ESLint + Prettier**
- Fontes auto-hospedadas (`@fontsource`) — sem Google Fonts, por privacidade e
  para funcionar offline.

## Desenvolvimento

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run test       # Vitest
npm run build      # build de produção em dist/
npm run preview    # serve o build (testar PWA/offline)
```

## Estrutura

```
src/
├── content/     # conteúdo litúrgico (orações, mandamentos) — separado da UI
├── types.ts     # união discriminada das seções + tipos de dados
├── hooks/       # useExamState (autosave opcional), useFocusTrap, useReducedMotion
├── components/  # UI; views/ contém uma view por tipo de seção
├── utils/       # buildReviewText, clipboard, sectionStats
├── styles/      # theme.css (tokens) + global.css
└── test/        # testes Vitest
```

Para **editar perguntas, mandamentos ou orações**, basta alterar
`src/content/` — nenhuma mudança de UI é necessária.

## Privacidade

- Por padrão, **nada é salvo**: respostas e anotações vivem só na memória da
  aba e somem ao recarregar/fechar.
- O usuário pode **optar** por "Salvar neste aparelho" (localStorage). Desligar
  remove o que foi gravado. "Apagar tudo" limpa memória e localStorage.
- **Nenhum dado trafega pela rede** — não há backend nem telemetria.

## Deploy (estático) e escala

O build gera arquivos estáticos em `dist/`. Hospede em qualquer CDN ou servidor
estático (Cloudflare Pages, Netlify, Vercel, GitHub Pages, Nginx…).

Como **não há backend nem estado de servidor**, cada acesso roda isolado no
navegador do fiel. Atender **dezenas ou milhares de acessos simultâneos** é
trivial: o único custo é entregar arquivos estáticos — resolvido por cache e
compressão na borda/CDN. Veja [`deploy/nginx.conf`](deploy/nginx.conf) para um
exemplo com SPA fallback, `Cache-Control` e gzip.

```bash
npm run build
# copie o conteúdo de dist/ para o servidor estático
```
