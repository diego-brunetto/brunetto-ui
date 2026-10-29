import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Chip, ChipGroup } from "../index";

describe("Chip", () => {
  it("togglea pressed y expone aria-pressed", async () => {
    const onPressedChange = vi.fn();
    render(
      <Chip pressed={false} onPressedChange={onPressedChange} description="Pecho">
        Día A
      </Chip>,
    );
    const btn = screen.getByRole("button", { name: /Día A/ });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Pecho")).toBeInTheDocument();
    await userEvent.click(btn);
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});

describe("ChipGroup", () => {
  it("en mode single deja una sola activa", async () => {
    function Harness() {
      const [day, setDay] = useState("a");
      return (
        <ChipGroup aria-label="Día de la rutina" mode="single" value={day} onValueChange={setDay}>
          <Chip value="a">Día A</Chip>
          <Chip value="b">Día B</Chip>
          <Chip value="c">Día C</Chip>
        </ChipGroup>
      );
    }
    render(<Harness />);
    expect(screen.getByRole("button", { name: "Día A" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "Día C" }));
    expect(screen.getByRole("button", { name: "Día A" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Día C" })).toHaveAttribute("aria-pressed", "true");
  });
});
