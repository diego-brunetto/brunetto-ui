/** Multiplicador global de duraciones (`--motion`). Vale 0 si el sistema pide menos movimiento. */
export function getMotion(el: Element | null = typeof document !== "undefined" ? document.documentElement : null): number {
  if (!el || typeof getComputedStyle === "undefined") return 1;
  const v = parseFloat(getComputedStyle(el).getPropertyValue("--motion"));
  return Number.isNaN(v) ? 1 : v;
}

/** Fuerza a reiniciar una animación CSS sacando y volviendo a poner la clase. */
export function replayClass(el: HTMLElement, className: string): void {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}
