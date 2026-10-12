import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pregunta con el objeto: "¿Borrar la serie 3?" */
  title: ReactNode;
  /** La consecuencia: "Se pierde el peso y las repeticiones que cargaste. No se puede deshacer." */
  description: ReactNode;
  /** Verbo y objeto: "Borrar serie". Nunca "Aceptar". */
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Usa el botón de peligro. */
  danger?: boolean;
  className?: string;
}

/** Diálogo centrado para confirmar algo que no se deshace. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  danger,
  className,
}: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="scrim open" />
        <DialogPrimitive.Content role="alertdialog" className={cx("dialog open", className)}>
          <div style={{ display: "grid", gap: "0.375rem" }}>
            <DialogPrimitive.Title className="display" style={{ fontSize: "calc(var(--text-xl) * var(--display-scale))" }}>
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="muted" style={{ fontSize: "var(--text-sm)" }}>
              {description}
            </DialogPrimitive.Description>
          </div>
          <div className="actions">
            <DialogPrimitive.Close asChild>
              <Button variant="outline">{cancelLabel}</Button>
            </DialogPrimitive.Close>
            <Button
              variant={danger ? "danger" : "primary"}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
