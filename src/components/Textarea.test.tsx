import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field, Textarea } from "../index";

describe("Textarea", () => {
  it("dentro de Field conecta label, hint y error", () => {
    const { rerender } = render(
      <Field label="Notas" hint="Opcional.">
        <Textarea placeholder="Cómo te sentiste" />
      </Field>,
    );
    const area = screen.getByLabelText("Notas");
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toHaveAccessibleDescription("Opcional.");
    expect(area).toHaveClass("input", "textarea");

    rerender(
      <Field label="Notas" error="Escribí al menos una palabra.">
        <Textarea defaultValue="" />
      </Field>,
    );
    expect(screen.getByLabelText("Notas")).toHaveAccessibleDescription("Escribí al menos una palabra.");
    expect(screen.getByLabelText("Notas")).toBeInvalid();
  });

  it("autoSize agrega la clase de alto automático", () => {
    render(<Textarea autoSize aria-label="Notas" />);
    expect(screen.getByLabelText("Notas")).toHaveClass("textarea-auto");
  });
});
