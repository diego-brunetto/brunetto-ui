import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, Button } from "../index";

describe("Alert", () => {
  it("danger se anuncia como alert, con título, texto y acción", () => {
    render(
      <Alert tone="danger" title="No se pudo cargar" action={<Button size="sm">Reintentar</Button>}>
        Revisá la conexión y probá de nuevo.
      </Alert>,
    );
    const a = screen.getByRole("alert");
    expect(a).toHaveClass("alert", "alert-danger");
    expect(a).toHaveTextContent("No se pudo cargar");
    expect(a).toHaveTextContent("Revisá la conexión y probá de nuevo.");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it.each(["info", "success", "warning"] as const)("%s se anuncia como status", (tone) => {
    render(<Alert tone={tone}>Aviso</Alert>);
    expect(screen.getByRole("status")).toHaveClass(`alert-${tone}`);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("info por defecto, ícono decorativo del tono, y icon={false} lo saca", () => {
    const { container, rerender } = render(<Alert>Sin datos del crédito todavía.</Alert>);
    expect(screen.getByRole("status")).toHaveClass("alert-info");
    expect(container.querySelector("svg.ic")).toHaveAttribute("aria-hidden", "true");
    rerender(<Alert icon={false}>Sin ícono</Alert>);
    expect(container.querySelector("svg")).toBeNull();
  });
});
