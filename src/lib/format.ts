const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

/** "$ 1.284.350". Pesos sin decimales, con espacio fino entre el signo y el número. */
export function formatARS(value: number): string {
  return ars.format(Math.round(value)).replace(/\s/g, " ");
}

/** "US$ 912". */
export function formatUSD(value: number): string {
  return `US$ ${Math.round(value).toLocaleString("es-AR")}`;
}

/** "82,5". Decimales con coma, hasta `digits` posiciones. */
export function formatNumber(value: number, digits = 1): string {
  return value.toLocaleString("es-AR", { maximumFractionDigits: digits });
}

/** "6,1 %". Porcentaje con espacio, como se escribe en castellano. */
export function formatPercent(value: number, digits = 1): string {
  return `${formatNumber(value, digits)} %`;
}
