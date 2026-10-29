import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../index";

describe("Button", () => {
  it("con href renderiza un <a> con las clases del botón", () => {
    render(
      <Button href="/hoy" variant="primary">
        Volver a Hoy
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Volver a Hoy" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/hoy");
    expect(link).toHaveClass("btn", "btn-primary");
  });

  it("usa renderLink para el router de la app", () => {
    render(
      <Button
        href="/progreso"
        renderLink={({ href, className, children }) => (
          <a data-router href={href} className={className}>
            {children}
          </a>
        )}
      >
        Ver progreso
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Ver progreso" })).toHaveAttribute("data-router");
  });
});
