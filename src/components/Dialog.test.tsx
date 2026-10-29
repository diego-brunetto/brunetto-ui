import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button, ConfirmDialog, Dialog, DialogClose, Field, Input } from "../index";

function Harness({ onSubmit }: { onSubmit?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Editar</Button>
      <span data-testid="state">{open ? "abierto" : "cerrado"}</span>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Editar movimiento"
        description="Cambia solo este movimiento."
        onSubmit={onSubmit}
        actions={
          <>
            <DialogClose asChild><Button>Cancelar</Button></DialogClose>
            <Button variant="primary" type="submit">Guardar</Button>
          </>
        }
      >
        <Field label="Detalle"><Input defaultValue="Supermercado" /></Field>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("abre con título, descripción y foco adentro", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Editar" }));
    const dialog = screen.getByRole("dialog", { name: "Editar movimiento" });
    expect(dialog).toHaveAccessibleDescription("Cambia solo este movimiento.");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByLabelText("Detalle")).toBeInTheDocument();
  });

  it("Escape cierra y sincroniza el estado", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Editar" }));
    expect(screen.getByTestId("state")).toHaveTextContent("abierto");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("state")).toHaveTextContent("cerrado");
  });

  it("DialogClose cierra", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Editar" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("con onSubmit es un form: Enter y el botón submit lo envían", async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Editar" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.tagName).toBe("FORM");
    await userEvent.type(screen.getByLabelText("Detalle"), "{Enter}");
    await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(onSubmit.mock.calls[0]?.[0].defaultPrevented).toBe(true);
  });

  it("sin descripción no deja aria-describedby colgado", () => {
    render(<Dialog open onOpenChange={() => {}} title="Notas">Texto</Dialog>);
    expect(screen.getByRole("dialog", { name: "Notas" })).not.toHaveAttribute("aria-describedby");
  });
});

describe("ConfirmDialog", () => {
  it("sigue confirmando y cerrando con la misma API", async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        danger
        title="¿Borrar la serie 3?"
        description="No se puede deshacer."
        confirmLabel="Borrar serie"
        onConfirm={onConfirm}
      />,
    );
    const dialog = screen.getByRole("alertdialog", { name: "¿Borrar la serie 3?" });
    expect(dialog).toHaveAccessibleDescription("No se puede deshacer.");
    const confirm = screen.getByRole("button", { name: "Borrar serie" });
    expect(confirm).toHaveClass("btn-danger");
    await userEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    onOpenChange.mockClear();
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("variant sheet confirma, cierra y Escape cancela", async () => {
    const onConfirm = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <span data-testid="state">{open ? "abierto" : "cerrado"}</span>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            variant="sheet"
            danger
            title="¿Terminar la sesión?"
            description="Se guarda lo cargado hasta ahora."
            confirmLabel="Terminar sesión"
            onConfirm={onConfirm}
          />
        </>
      );
    }
    const { unmount } = render(<Harness />);
    const sheet = screen.getByRole("alertdialog", { name: "¿Terminar la sesión?" });
    expect(sheet).toHaveClass("sheet", "confirm-sheet");
    await userEvent.click(screen.getByRole("button", { name: "Terminar sesión" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByTestId("state")).toHaveTextContent("cerrado");
    unmount();

    render(<Harness />);
    await userEvent.keyboard("{Escape}");
    expect(screen.getByTestId("state")).toHaveTextContent("cerrado");
  });
});
