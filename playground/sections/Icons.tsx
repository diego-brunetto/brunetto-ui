import { Card, Icon, icons, type IconName } from "../../src";

const names = Object.keys(icons) as IconName[];

export function IconsSection() {
  return (
    <Card style={{ display: "grid", gap: "1rem", gridColumn: "1 / -1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">Íconos</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{`<Icon name> · ${names.length}`}</code>
      </div>
      <div data-icon-grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(5.5rem, 1fr))", gap: "0.5rem" }}>
        {names.map((name) => (
          <div key={name} style={{ display: "grid", justifyItems: "center", gap: "0.5rem", padding: "0.75rem 0.25rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <Icon name={name} style={{ width: "1.5rem", height: "1.5rem" }} />
            <code className="num muted" style={{ fontSize: "0.6875rem" }}>{name}</code>
          </div>
        ))}
      </div>
    </Card>
  );
}
