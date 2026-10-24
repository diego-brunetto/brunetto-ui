import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, icons, type IconName } from "./Icon";

describe("Icon", () => {
  it.each(Object.keys(icons) as IconName[])("%s renderiza un svg 24x24 con contenido", (name) => {
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg!.childElementCount).toBeGreaterThan(0);
  });

  it("con label expone role img", () => {
    const { getByRole } = render(<Icon name="lock" label="Cerrado" />);
    expect(getByRole("img", { name: "Cerrado" })).toBeInTheDocument();
  });
});
