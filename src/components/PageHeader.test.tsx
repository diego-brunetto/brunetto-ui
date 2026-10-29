import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "../index";

describe("PageHeader", () => {
  it("pone el título como h1 y muestra rótulo, descripción y acciones", () => {
    render(<PageHeader eyebrow="Finanzas" title="Resumen" description="Lo que entró y lo que salió." actions={<button>Mes</button>} />);
    expect(screen.getByRole("heading", { level: 1, name: "Resumen" })).toHaveClass("page-title");
    expect(screen.getByText("Finanzas")).toHaveClass("eyebrow");
    expect(screen.getByText("Lo que entró y lo que salió.")).toHaveClass("page-desc");
    expect(screen.getByRole("button", { name: "Mes" }).parentElement).toHaveClass("page-actions");
  });

  it("sin opcionales no deja contenedores vacíos", () => {
    const { container } = render(<PageHeader title="Movimientos" className="extra" />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("page-header", "extra");
    expect(container.querySelector(".eyebrow, .page-desc, .page-actions")).toBeNull();
  });

  it("sticky agrega la clase de barra fija y oculta la descripción", () => {
    const { container } = render(
      <PageHeader sticky title="Rutina" eyebrow="PPL" description="No se ve en la barra." actions={<button>Editar</button>} />,
    );
    expect(container.querySelector("header")).toHaveClass("page-header-sticky");
    expect(screen.queryByText("No se ve en la barra.")).toBeNull();
    expect(screen.getByText("PPL")).toBeInTheDocument();
  });
});
