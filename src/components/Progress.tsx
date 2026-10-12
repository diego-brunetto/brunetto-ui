import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0 a 100. Pasado 100, la barra queda llena. */
  value: number;
  /** Color de la barra: "warning" cerca del límite, "danger" pasado, o cualquier color CSS. */
  bar?: "primary" | "warning" | "danger" | "success" | (string & {});
  "aria-label"?: string;
}

export function Progress({ value, bar = "primary", className, style, ...rest }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  const color = ["primary", "warning", "danger", "success"].includes(bar) ? `var(--${bar})` : bar;
  return (
    <div
      className={cx("progress", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      style={style}
      {...rest}
    >
      <span style={{ ["--v" as string]: `${pct}%`, ["--bar" as string]: color }} />
    </div>
  );
}

export interface StackBarPart {
  label: ReactNode;
  value: number;
  /** Por defecto, chart-1 … chart-7 en orden. Usá "var(--chart-8)" para "Otros". */
  color?: string;
}

export interface StackBarProps extends HTMLAttributes<HTMLDivElement> {
  parts: StackBarPart[];
  /** Muestra la leyenda abajo. */
  legend?: boolean;
}

/** Partes de un total, con hueco de 2 px entre cada una. Hasta seis partes; agrupá el resto en "Otros". */
export function StackBar({ parts, legend = true, className, ...rest }: StackBarProps) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const color = (p: StackBarPart, i: number) => p.color ?? `var(--chart-${Math.min(i + 1, 7)})`;
  return (
    <div className={className} style={{ display: "grid", gap: "0.625rem" }} {...rest}>
      <div className="stack-bar" aria-hidden="true">
        {parts.map((p, i) => (
          <span key={i} style={{ ["--v" as string]: `${(p.value / total) * 100}%`, ["--c" as string]: color(p, i) }} />
        ))}
      </div>
      {legend && (
        <div className="legend">
          {parts.map((p, i) => (
            <span key={i}>
              <i style={{ ["--c" as string]: color(p, i) }} />
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
