import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Fontes auto-hospedadas (sem Google Fonts) — privacidade + funciona offline.
// Apenas o subconjunto "latin" (cobre o português) para um precache enxuto.
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-700.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";
import "@fontsource/spectral/latin-300.css";
import "@fontsource/spectral/latin-400.css";
import "@fontsource/spectral/latin-500.css";
import "@fontsource/spectral/latin-600.css";
import "@fontsource/spectral/latin-400-italic.css";

import "./styles/theme.css";
import "./styles/global.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
