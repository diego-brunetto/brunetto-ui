import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { getMotion, replayClass } from "../lib/motion";
import { Badge } from "./Badge";

export interface AchievementProps {
  /** Cuando pasa a true (o cambia el número), la insignia salta y suelta chispas. */
  trigger: boolean | number;
  children: ReactNode;
  /** Color de las chispas. Por defecto warning. Gym usa var(--record). */
  color?: string;
  /** Mantiene la insignia visible antes del primer disparo. */
  visibleBeforeTrigger?: boolean;
}

interface Spark {
  id: number;
  a: number;
  r: number;
}

/** Logro: el único rebote fuerte del sistema. Solo para hitos reales (un récord, todo pagado). */
export function Achievement({ trigger, children, color, visibleBeforeTrigger }: AchievementProps) {
  const badge = useRef<HTMLSpanElement>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [shown, setShown] = useState(!!visibleBeforeTrigger);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (!trigger) return;
    }
    if (!trigger) return;
    setShown(true);
    requestAnimationFrame(() => badge.current && replayClass(badge.current, "pop"));
    const m = getMotion();
    if (!m) return;
    const base = Date.now();
    setSparks(Array.from({ length: 10 }, (_, i) => ({ id: base + i, a: i * 36 + Math.random() * 14, r: -(24 + Math.random() * 18) })));
    const t = setTimeout(() => setSparks([]), 900 * m + 200);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <span className="burst" style={color ? ({ "--celebrate": color } as CSSProperties) : undefined}>
      <Badge ref={badge} tone="warning" icon="trophy" hidden={!shown}>
        {children}
      </Badge>
      {sparks.map((s) => (
        <i
          key={s.id}
          className="spark-dot"
          aria-hidden="true"
          style={{ "--a": `${s.a}deg`, "--r": `${s.r}px`, animationDelay: `${90 * getMotion()}ms` } as CSSProperties}
        />
      ))}
    </span>
  );
}
