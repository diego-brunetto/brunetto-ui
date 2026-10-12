import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../lib/cx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Bloque principal de la pantalla: fondo de marca suave, sin borde y con bisel grande. Una por pantalla. */
  soft?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ soft, className, ...rest }, ref) {
  return <div ref={ref} className={cx("card", soft && "card-soft", className)} {...rest} />;
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  /** A la derecha: una insignia de cantidad o una acción chica. */
  aside?: ReactNode;
}

export function CardHeader({ title, aside, className, style, ...rest }: CardHeaderProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem", ...style }}
      {...rest}
    >
      <span className="card-title">{title}</span>
      {aside}
    </div>
  );
}

export function Divider({ className, ...rest }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx("divider", className)} {...rest} />;
}
