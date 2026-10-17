import { useLayoutEffect, useRef, type RefObject } from "react";

/**
 * Mueve el `<span class="ind">` de un grupo (segmentado, pestañas, navegación) debajo del hijo activo.
 * El hijo activo se reconoce por aria-pressed="true", aria-selected="true", aria-current="page" o data-state="active".
 */
export function useIndicator<T extends HTMLElement>(deps: unknown[]): {
  groupRef: RefObject<T | null>;
  indRef: RefObject<HTMLSpanElement | null>;
} {
  const groupRef = useRef<T | null>(null);
  const indRef = useRef<HTMLSpanElement | null>(null);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const group = groupRef.current;
    const ind = indRef.current;
    if (!group || !ind) return;

    const place = (instant: boolean) => {
      const act = group.querySelector<HTMLElement>(
        ':scope > [aria-pressed="true"], :scope > [aria-selected="true"], :scope > [aria-current="page"], :scope > [data-state="active"]',
      );
      if (!act) {
        ind.style.setProperty("--ind-w", "0px");
        return;
      }
      if (instant) ind.style.transition = "none";
      ind.style.setProperty("--ind-x", `${act.offsetLeft}px`);
      ind.style.setProperty("--ind-w", `${act.offsetWidth}px`);
      if (instant) {
        void ind.offsetWidth;
        ind.style.transition = "";
      }
    };

    place(!placed.current);
    placed.current = true;

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => place(true)) : null;
    ro?.observe(group);
    document.fonts?.ready.then(() => place(true));
    return () => ro?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { groupRef, indRef };
}
