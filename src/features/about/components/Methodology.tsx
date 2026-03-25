export function Methodology() {
  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-display font-bold text-xl text-foreground mb-3">Metodologia</h2>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Dados oficiais dos resultados da Caixa Econômica Federal</li>
        <li>• Probabilidades calculadas com combinatória padrão (C(60,6))</li>
        <li>• Simulações Monte Carlo para o simulador de apostas</li>
        <li>• Taxas de rendimento baseadas em médias históricas (Selic, Poupança, IBOVESPA)</li>
        <li>• Nenhuma IA, nenhum palpite — apenas matemática</li>
      </ul>
    </div>
  );
}
