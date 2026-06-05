import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom não implementa matchMedia/scrollTo — fornecemos stubs.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
window.print = vi.fn();
