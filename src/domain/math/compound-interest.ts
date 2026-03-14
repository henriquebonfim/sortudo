export function calcularJurosCompostos(aporteMensal: number, taxaAnual: number, anos: number): number {
  const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  const n = anos * 12;
  return aporteMensal * ((Math.pow(1 + taxaMensal, n) - 1) / taxaMensal);
}
