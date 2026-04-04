import { ExternalLink } from "lucide-react";
const sources = [
  "https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx#:~:text=Resultados%20da%20Mega%2DSena%20por%20ordem%20crescente",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses-2025.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses-2024.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses_sociais_2023.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses_sociais_2022.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses_sociais_2021.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses-sociais-2020.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/REPASSES_2019.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_sociais-loterias-2018.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2017.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2016.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2015.pdf",
]
export function Sources() {

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-display font-bold text-xl text-foreground mb-3">Fontes (Sources)</h2>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {sources.map((source) => (
          <li key={source}>
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>{source}</span>
            </a>
          </li>
        ))}

      </ul>
    </div>
  );
}
