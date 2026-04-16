import { Analytics } from '@/features/analytics/components/Analytics';
import { SEO } from '@/shared/components/SEO';

export default function AnalyticsPage() {
  return (
    <>
      <SEO
        title="Análise de Dados Históricos | Sortudo"
        description="Explore gráficos, tendências de dezenas e o comportamento matemático de todos os sorteios da Mega-Sena ao longo da história."
        url="https://sortudo.web.app/dados"
      />
      <Analytics />
    </>
  );
}
