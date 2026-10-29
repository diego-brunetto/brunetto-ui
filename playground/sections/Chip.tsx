import { useState } from "react";
import { Card, Chip, ChipGroup, Icon } from "../../src";

export function ChipSection() {
  const [day, setDay] = useState("a");
  const [cardio, setCardio] = useState("run");
  const [pending, setPending] = useState(false);

  return (
    <Card style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">Chip</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{"<Chip> <ChipGroup>"}</code>
      </div>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <p className="muted" style={{ fontSize: "var(--text-sm)", margin: 0 }}>Día de la rutina</p>
        <ChipGroup aria-label="Día de la rutina" mode="single" value={day} onValueChange={setDay}>
          <Chip value="a" description="Pecho · tríceps">Día A</Chip>
          <Chip value="b" description="Espalda · bíceps">Día B</Chip>
          <Chip value="c" description="Piernas">Día C</Chip>
        </ChipGroup>
        <p className="muted" style={{ fontSize: "var(--text-sm)", margin: 0 }}>Tipo de cardio</p>
        <ChipGroup aria-label="Tipo de cardio" mode="single" value={cardio} onValueChange={setCardio}>
          <Chip value="run"><Icon name="footprints" /> Correr</Chip>
          <Chip value="bike"><Icon name="bike" /> Bici</Chip>
          <Chip value="walk"><Icon name="footprints" /> Cinta</Chip>
        </ChipGroup>
        <Chip pressed={pending} onPressedChange={setPending} description="Sin fecha de cobro">
          Pendiente
        </Chip>
      </div>
    </Card>
  );
}
