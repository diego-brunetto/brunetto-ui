import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button, Field, Input, Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Toaster, formatARS, formatPercent, toast } from "./index";

describe("formato es-AR", () => {
  it("pesos sin decimales y porcentaje con espacio", () => {
    expect(formatARS(1284350.4)).toBe("$ 1.284.350");
    expect(formatPercent(6.1)).toBe("6,1 %");
  });
});

describe("Button", () => {
  it("pone variante y bloquea mientras carga", () => {
    render(<Button variant="primary" loading>Guardar</Button>);
    const b = screen.getByRole("button", { name: "Guardar" });
    expect(b).toHaveClass("btn", "btn-primary", "is-loading");
    expect(b).toHaveAttribute("aria-busy", "true");
  });
});

describe("Field", () => {
  it("conecta label, control y error", () => {
    render(
      <Field label="Email" error="Falta el dominio, por ejemplo gmail.com.">
        <Input defaultValue="diego@gmail" />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Falta el dominio, por ejemplo gmail.com.");
  });
});

describe("Switch", () => {
  it("alterna aria-checked sin control externo", async () => {
    const onChange = vi.fn();
    render(<Switch aria-label="Vibrar" onCheckedChange={onChange} />);
    const sw = screen.getByRole("switch", { name: "Vibrar" });
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Stepper", () => {
  it("suma con paso y respeta el mínimo", async () => {
    render(<Stepper aria-label="Peso" defaultValue={80} step={2.5} min={77.5} unit="kg" />);
    await userEvent.click(screen.getByRole("button", { name: "Más" }));
    expect(screen.getByText("82,5 kg")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Menos" }));
    await userEvent.click(screen.getByRole("button", { name: "Menos" }));
    expect(screen.getByText("77,5 kg")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menos" })).toBeDisabled();
  });
});

describe("Tabs", () => {
  it("cambia con flechas del teclado", async () => {
    function T() {
      const [v, setV] = useState("semana");
      return (
        <Tabs value={v} onValueChange={setV}>
          <TabsList value={v} aria-label="Período">
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="mes">Mes</TabsTrigger>
          </TabsList>
          <TabsContent value="semana">4 sesiones</TabsContent>
          <TabsContent value="mes">17 sesiones</TabsContent>
        </Tabs>
      );
    }
    render(<T />);
    await userEvent.click(screen.getByRole("tab", { name: "Semana" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Mes" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("17 sesiones")).toBeInTheDocument();
  });
});

describe("toast", () => {
  it("muestra el aviso y lo saca solo", () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => void toast("Gasto guardado · $ 12.500"));
    expect(screen.getByRole("status")).toHaveTextContent("Gasto guardado · $ 12.500");
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
