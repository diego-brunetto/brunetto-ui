import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRef, type FormEvent, type ReactNode } from "react";
import { cx } from "../lib/cx";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** Descripción para lectores de pantalla. */
  description?: string;
  children: ReactNode;
  /** Si está, la hoja es un <form> y esto corre al enviar (ya con preventDefault). */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  /** "alertdialog" para confirmaciones que no se deshacen. */
  role?: "dialog" | "alertdialog";
  className?: string;
}

const CLOSE_DRAG_PX = 90;

/**
 * Hoja inferior para cargar o editar algo en el celular. Sube con --ease-out, baja con --ease-in
 * y se cierra arrastrando la manija más de 90 px. Foco atrapado y Escape cierra (Radix).
 */
export function Sheet({ open, onOpenChange, title, description, children, onSubmit, role = "dialog", className }: SheetProps) {
  const ref = useRef<HTMLFormElement>(null);
  const drag = useRef<{ y0: number; dy: number; moved: boolean } | null>(null);

  const setY = (dy: number | null) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = dy == null ? "" : `translateY(${dy}px)`;
    el.classList.toggle("dragging", dy != null);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="scrim open" />
        <DialogPrimitive.Content asChild role={role} {...(description ? {} : { "aria-describedby": undefined })}>
          <form
            ref={ref}
            className={cx("sheet open", className)}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.(e);
            }}
          >
            <button
              type="button"
              className="handle"
              aria-label="Cerrar"
              onPointerDown={(e) => {
                drag.current = { y0: e.clientY, dy: 0, moved: false };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (!d) return;
                d.dy = Math.max(0, e.clientY - d.y0);
                if (d.dy > 3) d.moved = true;
                setY(d.dy);
              }}
              onPointerUp={() => {
                const d = drag.current;
                drag.current = null;
                if (!d) return;
                if (d.dy > CLOSE_DRAG_PX || !d.moved) {
                  ref.current?.classList.remove("dragging");
                  onOpenChange(false);
                } else setY(null);
              }}
              onPointerCancel={() => {
                drag.current = null;
                setY(null);
              }}
            />
            <div style={{ display: "grid", gap: "1rem" }}>
              <DialogPrimitive.Title className="display" style={{ fontSize: "calc(var(--text-xl) * var(--display-scale))" }}>
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
              ) : null}
              {children}
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export const SheetClose = DialogPrimitive.Close;
