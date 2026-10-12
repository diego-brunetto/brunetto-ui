import type { CSSProperties, HTMLAttributes } from "react";
import { cx } from "../lib/cx";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

/** Bloque de carga con la forma del contenido que viene. */
export function Skeleton({ width, height = "0.7rem", className, style, ...rest }: SkeletonProps) {
  return <div className={cx("skel", className)} style={{ width, height, ...style }} aria-hidden="true" {...rest} />;
}

/** Fila de lista en carga: un cuadrado de 40 px y dos líneas. */
export function SkeletonRow() {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }} aria-hidden="true">
      <Skeleton width="2.5rem" height="2.5rem" />
      <div style={{ flex: 1, display: "grid", gap: "0.4rem" }}>
        <Skeleton width="70%" />
        <Skeleton width="45%" />
      </div>
    </div>
  );
}
