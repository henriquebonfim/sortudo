import { ExternalLink } from "lucide-react";

export function Sources() {
  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-display font-bold text-xl text-foreground mb-3">Fontes (Sources)</h2>
      <ul className="space-y-3 text-sm text-muted-foreground">
        <li>
          <a
            href="https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2015.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>Repasses 2015 - Caixa Loterias</span>
          </a>
        </li>
        <li>
          <a
            href="https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2016.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>Repasses 2016 - Caixa Loterias</span>
          </a>
        </li>
        <li>
          <a
            href="https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2017.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>Repasses 2017 - Caixa Loterias</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
