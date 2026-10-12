import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "../lib/cx";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: la acción principal de la pantalla, una sola. danger: borrar o algo que no se deshace. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Cuadrado, solo ícono. Pasale aria-label. */
  iconOnly?: boolean;
  /** Ocupa todo el ancho. */
  block?: boolean;
  /** Oculta el texto, muestra el spinner y bloquea clics. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", iconOnly, block, loading, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      className={cx(
        "btn",
        `btn-${variant}`,
        size === "sm" && "btn-sm",
        size === "lg" && "btn-lg",
        iconOnly && "btn-icon",
        block && "btn-block",
        loading && "is-loading",
        className,
      )}
      {...rest}
    >
      {children}
      {loading && (
        <svg className="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.2-8.56" />
        </svg>
      )}
    </button>
  );
});
