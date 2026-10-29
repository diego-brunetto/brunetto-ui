import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Stepper } from "../index";

afterEach(() => vi.useRealTimers());

describe("Stepper", () => {
  it("mantener apretado repite el paso y frena en el máximo", () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<Stepper aria-label="Reps" defaultValue={8} max={12} onValueChange={onValueChange} />);
    const plus = screen.getByRole("button", { name: "Más" });

    fireEvent.pointerDown(plus, { button: 0 });
    expect(onValueChange).toHaveBeenLastCalledWith(9);
    act(() => vi.advanceTimersByTime(400 + 90 * 2));
    expect(onValueChange).toHaveBeenLastCalledWith(11);
    act(() => vi.advanceTimersByTime(90 * 5));
    expect(onValueChange).toHaveBeenLastCalledWith(12);
    expect(onValueChange).toHaveBeenCalledTimes(4);
    fireEvent.pointerUp(plus);
    fireEvent.click(plus);
    expect(onValueChange).toHaveBeenCalledTimes(4);
  });

  it("con teclado suma una vez por Enter", async () => {
    render(<Stepper aria-label="Reps" defaultValue={8} />);
    screen.getByRole("button", { name: "Más" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("tocar el número permite escribirlo con coma y respeta el mínimo", async () => {
    function Peso() {
      const [kg, setKg] = useState<number | null>(80);
      return <Stepper label="Peso" value={kg} onValueChange={setKg} min={20} step={2.5} unit="kg" />;
    }
    render(<Peso />);
    await userEvent.click(screen.getByRole("button", { name: /Peso: 80 kg/ }));
    const input = screen.getByRole("textbox", { name: "Peso" });
    await userEvent.clear(input);
    await userEvent.type(input, "82,5{Enter}");
    expect(screen.getByText("82,5 kg")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Peso: 82,5 kg/ }));
    await userEvent.clear(screen.getByRole("textbox", { name: "Peso" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Peso" }), "5{Enter}");
    expect(screen.getByText("20 kg")).toBeInTheDocument();
  });

  it("Escape cancela la edición sin cambiar el valor", async () => {
    const onValueChange = vi.fn();
    render(<Stepper aria-label="Reps" defaultValue={8} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Reps: 8/ }));
    await userEvent.type(screen.getByRole("textbox", { name: "Reps" }), "99{Escape}");
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("sin valor muestra el placeholder; borrar llama a onClear y los saltos rápidos suman", async () => {
    function Serie() {
      const [reps, setReps] = useState<number | null>(null);
      return <Stepper label="Reps" value={reps} onValueChange={setReps} onClear={() => setReps(null)} min={0} quickSteps={[5]} />;
    }
    render(<Serie />);
    expect(screen.getByText("—")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Sumar 5 a Reps" }));
    expect(screen.getByText("5")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Reps: 5/ }));
    await userEvent.clear(screen.getByRole("textbox", { name: "Reps" }));
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
