import { useRef, useState } from "react";
import { cx } from "../lib/cx";
import { formatNumber } from "../lib/format";
import { replayClass } from "../lib/motion";
import { Icon } from "./Icon";

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Se muestra después del número: "kg", "reps". */
  unit?: string;
  format?: (value: number) => string;
  /** Nombre de lo que se ajusta, para lectores de pantalla: "Peso serie 3". */
  "aria-label"?: string;
  className?: string;
}

/** Más y menos con paso fijo. El número entra desde arriba o desde abajo según el sentido. */
export function Stepper({
  value,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit,
  format = (v) => formatNumber(v),
  className,
  ...rest
}: StepperProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const out = useRef<HTMLSpanElement>(null);

  const bump = (d: 1 | -1) => {
    const next = Math.min(max, Math.max(min, Math.round((current + d * step) * 1000) / 1000));
    if (next === current) return;
    if (value === undefined) setInner(next);
    onValueChange?.(next);
    if (out.current) replayClass(out.current, d > 0 ? "bump-up" : "bump-down");
  };

  const text = `${format(current)}${unit ? ` ${unit}` : ""}`;
  return (
    <div className={cx("stepper", className)} role="group" aria-label={rest["aria-label"]}>
      <button type="button" aria-label="Menos" onClick={() => bump(-1)} disabled={current <= min}>
        <Icon name="minus" />
      </button>
      <output aria-live="polite">
        <span ref={out}>{text}</span>
      </output>
      <button type="button" aria-label="Más" onClick={() => bump(1)} disabled={current >= max}>
        <Icon name="plus" />
      </button>
    </div>
  );
}
