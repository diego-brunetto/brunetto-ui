import { useState } from "react";
import { Stepper } from "../../src";

/** Carga de una serie con una mano: peso con saltos rápidos y reps que arrancan sin valor. */
export function StepperLarge() {
  const [kg, setKg] = useState<number | null>(62.5);
  const [reps, setReps] = useState<number | null>(null);
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Stepper label="Peso" size="lg" value={kg} onValueChange={setKg} onClear={() => setKg(null)} min={0} step={2.5} quickSteps={[5, 10]} unit="kg" />
      <Stepper label="Reps" size="lg" value={reps} onValueChange={setReps} onClear={() => setReps(null)} min={0} max={50} />
      <span className="muted" style={{ fontSize: "var(--text-xs)" }}>Mantené apretado + o − para repetir. Tocá el número para escribirlo.</span>
    </div>
  );
}
