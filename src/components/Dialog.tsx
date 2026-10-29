import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { FormEvent, ReactNode } from "react";
import { cx } from "../lib/cx";
import { Button } from "./Button";
import { Sheet, SheetClose } from "./Sheet";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Qué se hace, con el objeto: "Editar movimiento". */
  title: ReactNode;
  /** Una línea de contexto debajo del título. Visible. */
  description?: ReactNode;
  /** Contenido libre. Si no entra en la pantalla, scrollea adentro y el título y las acciones quedan fijos. */
  children?: ReactNode;
  /** Botones al pie, alineados a la derecha. Usá <DialogClose asChild> para el de cancelar. */
  actions?: ReactNode;
  /** Si está, el diálogo es un <form> y esto corre al enviar (ya con preventDefault). */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  /** "alertdialog" para confirmaciones que no se deshacen. */
  role?: "dialog" | "alertdialog";
  className?: string;
}

/**
 * Diálogo centrado con contenido y acciones libres. Foco atrapado, Escape y el scrim cierran (Radix).
 * Para crear o editar en el celular, preferí <Sheet>.
 */
export function Dialog({ open, onOpenChange, title, description, children, actions, onSubmit, role = "dialog", className }: DialogProps) {
  const body = (
    <>
      <div className="dialog-head">
        <DialogPrimitive.Title className="display" style={{ fontSize: "calc(var(--text-xl) * var(--display-scale))" }}>
          {title}
        </DialogPrimitive.Title>
        {description != null ? (
          <DialogPrimitive.Description className="muted" style={{ fontSize: "var(--text-sm)" }}>
            {description}
          </DialogPrimitive.Description>
        ) : null}
      </div>
      {children != null ? <div className="dialog-body">{children}</div> : null}
      {actions != null ? <div className="actions">{actions}</div> : null}
    </>
  );
  const props = {
    role,
    className: cx("dialog open", className),
    ...(description != null ? {} : { "aria-describedby": undefined }),
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="scrim open" />
        {onSubmit ? (
          <DialogPrimitive.Content asChild {...props}>
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
              }}
            >
              {body}
            </form>
          </DialogPrimitive.Content>
        ) : (
          <DialogPrimitive.Content {...props}>{body}</DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export const DialogClose = DialogPrimitive.Close;

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
  /**
   * `sheet`: hoja inferior con botones grandes apilados (confirmar arriba, cancelar abajo),
   * al alcance del pulgar. Misma API que el diálogo centrado.
   */
  variant?: "dialog" | "sheet";
  className?: string;
}

/** Confirmación de algo que no se deshace. Centrada o en hoja inferior (`variant="sheet"`). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  danger,
  variant = "dialog",
  className,
}: ConfirmDialogProps) {
  const confirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  if (variant === "sheet") {
    const srDescription = typeof description === "string" ? description : "Confirmación";
    return (
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
        role="alertdialog"
        title={title}
        description={srDescription}
        className={cx("confirm-sheet", className)}
      >
        <p className="muted confirm-sheet-desc" aria-hidden="true">
          {description}
        </p>
        <div className="confirm-sheet-actions">
          <Button block size="lg" variant={danger ? "danger" : "primary"} onClick={confirm}>
            {confirmLabel}
          </Button>
          <SheetClose asChild>
            <Button block size="lg" variant="outline">
              {cancelLabel}
            </Button>
          </SheetClose>
        </div>
      </Sheet>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      role="alertdialog"
      title={title}
      description={description}
      className={className}
      actions={
        <>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <Button variant={danger ? "danger" : "primary"} onClick={confirm}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
