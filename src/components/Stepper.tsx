import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cx } from "../lib/cx";
import { formatNumber } from "../lib/format";
import { replayClass } from "../lib/motion";
import { Icon } from "./Icon";

/** Mantener apretado: espera antes de empezar a repetir y ritmo de repetición, en ms. */
const HOLD_DELAY = 400;
const HOLD_INTERVAL = 90;

export interface StepperProps {
  /** `null` es "sin cargar": muestra el placeholder. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number) => void;
  /** Se llama cuando se borra el número a mano. Sin esto, borrar deja el valor anterior. */
  onClear?: () => void;
  min?: number;
  max?: number;
  step?: number;
  /** Saltos de un toque además del paso: [5, 10] muestra +5 y +10; los negativos restan. */
  quickSteps?: number[];
  /** Se muestra después del número: "kg", "reps". */
  unit?: string;
  /** Lo que se ve sin valor. */
  placeholder?: string;
  /** Rótulo visible arriba; también nombra el grupo para lectores de pantalla. */
  label?: string;
  /** Tocar el número lo vuelve un campo para escribir valores que no caen en el paso. */
  editable?: boolean;
  /** "lg": botones de 64px para usar con una mano. */
  size?: "md" | "lg";
  format?: (value: number) => string;
  /** Nombre de lo que se ajusta, para lectores de pantalla: "Peso serie 3". */
  "aria-label"?: string;
  className?: string;
}

const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Más y menos con paso fijo. Mantener apretado repite; tocar el número permite escribirlo.
 * El número entra desde arriba o desde abajo según el sentido.
 */
export function Stepper({
  value,
  defaultValue = 0,
  onValueChange,
  onClear,
  min = -Infinity,
  max = Infinity,
  step = 1,
  quickSteps,
  unit,
  placeholder = "—",
  label,
  editable = true,
  size = "md",
  format = (v) => formatNumber(v),
  className,
  ...rest
}: StepperProps) {
  const [inner, setInner] = useState<number | null>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const [draft, setDraft] = useState<string | null>(null);

  const out = useRef<HTMLSpanElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const latest = useRef(current);
  latest.current = current;
  const hold = useRef<{ timeout?: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval> }>({});
  // pointerdown ya aplicó el paso: el click que llega al soltar no tiene que sumarlo de nuevo.
  const fromPointer = useRef(false);
  const labelId = useId();

  const stopHold = () => {
    clearTimeout(hold.current.timeout);
    clearInterval(hold.current.interval);
    hold.current = {};
  };
  useEffect(() => stopHold, []);
  useEffect(() => {
    if (draft !== null) input.current?.select();
  }, [draft !== null]);

  const commit = (next: number) => {
    // Se guarda también en el ref: al mantener apretado, el próximo paso parte de acá aunque React no haya pintado.
    latest.current = next;
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  /** Aplica un salto. Devuelve false si ya no se puede seguir en ese sentido. */
  const bump = (delta: number): boolean => {
    const base = latest.current ?? (Number.isFinite(min) ? min : 0);
    const next = Math.min(max, Math.max(min, round(base + delta)));
    if (next === latest.current) return false;
    commit(next);
    if (out.current) replayClass(out.current, delta > 0 ? "bump-up" : "bump-down");
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
    return next !== min && next !== max;
  };

  const startHold = (e: PointerEvent<HTMLButtonElement>, delta: number) => {
    // Solo el botón principal (o el dedo): el derecho abre el menú, no suma.
    if (e.button > 0) return;
    fromPointer.current = true;
    stopHold();
    if (!bump(delta)) return;
    hold.current.timeout = setTimeout(() => {
      hold.current.interval = setInterval(() => {
        if (!bump(delta)) stopHold();
      }, HOLD_INTERVAL);
    }, HOLD_DELAY);
  };

  // Enter y Espacio llegan solo como click: sin esto, con teclado no se podría ajustar.
  const onStepClick = (delta: number) => {
    if (fromPointer.current) {
      fromPointer.current = false;
      return;
    }
    bump(delta);
  };

  const holdProps = (delta: number) => ({
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => startHold(e, delta),
    onPointerUp: stopHold,
    onPointerLeave: stopHold,
    onPointerCancel: stopHold,
    onClick: () => onStepClick(delta),
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
  });

  const startEdit = () => setDraft(current === null ? "" : String(current).replace(".", ","));

  const finishEdit = () => {
    if (draft === null) return;
    const text = draft.trim();
    setDraft(null);
    if (text === "") {
      if (onClear) {
        latest.current = null;
        if (!controlled) setInner(null);
        onClear();
      }
      return;
    }
    const parsed = Number.parseFloat(text.replace(",", "."));
    if (!Number.isNaN(parsed)) commit(Math.min(max, Math.max(min, round(parsed))));
  };

  const onDraftKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") finishEdit();
    if (e.key === "Escape") {
      e.preventDefault();
      setDraft(null);
    }
  };

  const name = rest["aria-label"] ?? label;
  const empty = current === null;
  const text = empty ? placeholder : `${format(current)}${unit ? ` ${unit}` : ""}`;

  const control = (
    <div
      className={cx("stepper", size === "lg" && "stepper-lg", !label && className)}
      role="group"
      aria-label={label ? undefined : name}
      aria-labelledby={label ? labelId : undefined}
    >
      <button type="button" aria-label="Menos" disabled={current !== null && current <= min} {...holdProps(-step)}>
        <Icon name="minus" />
      </button>
      {draft !== null ? (
        <input
          ref={input}
          className="stepper-input"
          type="text"
          inputMode="decimal"
          aria-label={name}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={finishEdit}
          onKeyDown={onDraftKey}
        />
      ) : (
        <output aria-live="polite" className={cx(empty && "is-empty")}>
          {editable ? (
            <button type="button" className="stepper-value" aria-label={name ? `${name}: ${text}. Tocá para escribir` : undefined} onClick={startEdit}>
              <span ref={out}>{text}</span>
            </button>
          ) : (
            <span ref={out}>{text}</span>
          )}
        </output>
      )}
      <button type="button" aria-label="Más" disabled={current !== null && current >= max} {...holdProps(step)}>
        <Icon name="plus" />
      </button>
    </div>
  );

  if (!label && !quickSteps?.length) return control;

  return (
    <div className={cx("stepper-field", className)}>
      <div className="stepper-head">
        {label && <span id={labelId} className="label">{label}</span>}
        {quickSteps && quickSteps.length > 0 && (
          <div className="stepper-quick">
            {quickSteps.map((q) => (
              <button key={q} type="button" onClick={() => bump(q)} aria-label={`${q > 0 ? "Sumar" : "Restar"} ${formatNumber(Math.abs(q))}${name ? ` a ${name}` : ""}`}>
                {q > 0 ? "+" : "−"}
                {formatNumber(Math.abs(q))}
              </button>
            ))}
          </div>
        )}
      </div>
      {control}
    </div>
  );
}
