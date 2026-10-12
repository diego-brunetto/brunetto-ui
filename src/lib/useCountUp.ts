import { useEffect, useRef, useState } from "react";
import { getMotion } from "./motion";

/**
 * Número que corre hasta `value` con salida exponencial (equivale a --ease-out).
 * Con --motion: 0 salta directo al valor.
 */
export function useCountUp(value: number, { duration = 900, from }: { duration?: number; from?: number } = {}): number {
  const [shown, setShown] = useState(from ?? value);
  const current = useRef(shown);

  useEffect(() => {
    const start = current.current;
    const dur = duration * getMotion();
    if (!dur || start === value) {
      current.current = value;
      setShown(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      current.current = start + (value - start) * e;
      setShown(current.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return shown;
}
