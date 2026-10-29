import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler } from "react";
import { cx } from "../lib/cx";
import { defaultRenderLink, type RenderLink } from "../lib/link";

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
  /**
   * Si está, el botón navega: se dibuja con `renderLink` (mismo contrato que SideNav / ListItem).
   * En Next: `renderLink={(p) => <Link {...p} />}`.
   */
  href?: string;
  /** Cómo dibujar el link cuando hay `href`. Por defecto, un `<a>`. */
  renderLink?: RenderLink;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    iconOnly,
    block,
    loading,
    href,
    renderLink,
    className,
    children,
    type = "button",
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const cls = cx(
    "btn",
    `btn-${variant}`,
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    iconOnly && "btn-icon",
    block && "btn-block",
    loading && "is-loading",
    className,
  );
  const body = (
    <>
      {children}
      {loading && (
        <svg className="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-6.2-8.56" />
        </svg>
      )}
    </>
  );

  if (href) {
    const link = renderLink ?? defaultRenderLink;
    return link({
      href,
      className: cls,
      onClick: onClick as MouseEventHandler | undefined,
      children: body,
      ...(disabled || loading ? { "aria-disabled": true as const, onClick: (e) => e.preventDefault() } : {}),
    });
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      className={cls}
      onClick={onClick}
      {...rest}
    >
      {body}
    </button>
  );
});
