import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { useCountUp } from "../lib/useCountUp";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Número protagonista de la pantalla. */
  large?: boolean;
  /** Debajo del valor: una insignia de variación o una línea de contexto. */
  footer?: ReactNode;
}

export function Stat({ label, value, large, footer, className, ...rest }: StatProps) {
  return (
    <div className={cx("stat", className)} {...rest}>
      <span className="stat-label">{label}</span>
      <span className={cx("stat-value", large && "xl")}>{value}</span>
      {footer}
    </div>
  );
}

export interface CountUpProps {
  value: number;
  format?: (value: number) => string;
  /** Desde dónde arranca la primera vez. Por defecto, el mismo valor (no corre al montar). */
  from?: number;
  duration?: number;
}

/** Número que corre cuando cambia. Usalo como `value` de un Stat. */
export function CountUp({ value, format = (v) => String(Math.round(v)), from, duration }: CountUpProps) {
  const shown = useCountUp(value, { from, duration });
  return <>{format(shown)}</>;
}

export interface MoneyProps extends HTMLAttributes<HTMLSpanElement> {
  /** Ya formateado: "$ 1.665.650". Usá formatARS. */
  children: ReactNode;
  /** A favor (positive) o en contra (negative). */
  trend?: "positive" | "negative";
}

export function Money({ trend, className, ...rest }: MoneyProps) {
  return <span className={cx("num", trend === "positive" && "pos", trend === "negative" && "neg", className)} {...rest} />;
}

export interface SparklineProps {
  data: number[];
  /** Área con degradé debajo de la línea. */
  area?: boolean;
  "aria-label": string;
  className?: string;
}

/** Línea de tendencia de 2 px en primary. Escala los datos al alto disponible. */
export function Sparkline({ data, area = true, className, ...rest }: SparklineProps) {
  const id = useId().replace(/:/g, "");
  if (data.length < 2) return null;
  const W = 200;
  const H = 48;
  const pad = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - pad - ((v - min) / span) * (H - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg className={cx("spark", className)} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={rest["aria-label"]}>
      {area && (
        <>
          <defs>
            <linearGradient id={`sg-${id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--primary)" stopOpacity=".22" />
              <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={`url(#sg-${id})`} />
        </>
      )}
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
