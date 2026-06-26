import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SECTIONS } from "./content/sections";
import { isQuestionSection } from "./types";
import { useExamState } from "./hooks/useExamState";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { buildReviewText, countMarked } from "./utils/buildReviewText";
import { copyText } from "./utils/clipboard";
import { TopBar } from "./components/TopBar";
import { ProgressBar } from "./components/ProgressBar";
import { Drawer } from "./components/Drawer";
import { BottomNav } from "./components/BottomNav";
import { IntroView } from "./components/views/IntroView";
import { PrayerView } from "./components/views/PrayerView";
import { ExamView } from "./components/views/ExamView";
import { ReviewView } from "./components/views/ReviewView";

export default function App() {
  const [idx, setIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const exam = useExamState();
  const reducedMotion = useReducedMotion();

  const { answers, qnotes, counts, notes } = exam;
  const markedCount = useMemo(
    () => countMarked(SECTIONS, { answers, qnotes, counts, notes }),
    [answers, qnotes, counts, notes],
  );

  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const section = SECTIONS[idx];

  // Ao trocar de seção: volta ao topo e move o foco para o título (a11y).
  // Não rouba o foco no primeiro render, para não atrapalhar o leitor de tela.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    setConfirmClear(false);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [idx, reducedMotion]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
    },
    [],
  );

  const go = useCallback(
    (delta: number) =>
      setIdx((p) => Math.max(0, Math.min(SECTIONS.length - 1, p + delta))),
    [],
  );

  const jump = useCallback((i: number) => {
    setIdx(i);
    setMenuOpen(false);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  // Navegação por teclado (setas), exceto quando digitando num campo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menuOpen) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, menuOpen]);

  const handleCopy = useCallback(async () => {
    const ok = await copyText(buildReviewText(SECTIONS, exam));
    showToast(
      ok ? "Texto copiado." : "Não foi possível copiar — selecione e copie manualmente.",
    );
  }, [exam, showToast]);

  const handlePrint = useCallback(() => window.print(), []);

  const handleClear = useCallback(() => {
    if (!confirmClear) {
      setConfirmClear(true);
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    exam.clearAll();
    setConfirmClear(false);
    showToast("Tudo apagado.");
  }, [confirmClear, exam, showToast]);

  const progress = ((idx + 1) / SECTIONS.length) * 100;

  return (
    <div className="app">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <TopBar
        current={idx + 1}
        total={SECTIONS.length}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <ProgressBar value={progress} />

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sections={SECTIONS}
        currentIndex={idx}
        onJump={jump}
        data={exam}
        markedCount={markedCount}
      />

      <main id="conteudo" className="reading" tabIndex={-1}>
        <div className="enter" key={idx}>
          {section.kind === "intro" && (
            <IntroView
              ref={headingRef}
              persist={exam.persist}
              onPersistChange={exam.setPersist}
              onStart={() => go(1)}
            />
          )}
          {section.kind === "prayer" && (
            <PrayerView ref={headingRef} section={section} />
          )}
          {isQuestionSection(section) && (
            <ExamView
              ref={headingRef}
              section={section}
              data={exam}
              reducedMotion={reducedMotion}
              onAnswer={exam.setAnswer}
              onQNote={exam.setQNote}
              onCount={exam.setCount}
              onNote={exam.setNote}
            />
          )}
          {section.kind === "review" && (
            <ReviewView
              ref={headingRef}
              section={section}
              sections={SECTIONS}
              data={exam}
              markedCount={markedCount}
              confirmClear={confirmClear}
              toast={toast}
              onPrint={handlePrint}
              onCopy={handleCopy}
              onClear={handleClear}
            />
          )}
        </div>
      </main>

      <BottomNav
        label={section.label}
        markedCount={markedCount}
        canPrev={idx > 0}
        canNext={idx < SECTIONS.length - 1}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
      />
    </div>
  );
}
