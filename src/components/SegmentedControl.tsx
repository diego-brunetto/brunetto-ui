import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { useIndicator } from "../lib/useIndicator";

export interface SegmentedOption<V extends string> {
  value: V;
  label: ReactNode;
}

export interface SegmentedControlProps<V extends string> {
  options: SegmentedOption<V>[];
  value: V;
  onValueChange: (value: V) => void;
  /** Nombre del grupo: "Período", "Unidad". */
  "aria-label": string;
  /** Ocupa todo el ancho. */
  block?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/** Dos a cuatro opciones con un indicador que se desliza a la elegida. */
export function SegmentedControl<V extends string>({
  options,
  value,
  onValueChange,
  block,
  size = "md",
  className,
  ...rest
}: SegmentedControlProps<V>) {
  const { groupRef, indRef } = useIndicator<HTMLDivElement>([value, options.length]);
  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={rest["aria-label"]}
      className={cx("seg", block && "block", size === "sm" && "seg-sm", className)}
    >
      <span ref={indRef} className="ind" aria-hidden="true" />
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onValueChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
