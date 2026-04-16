import { Search } from '@/features/search/components/Search';
import { SEO } from '@/shared/components/SEO';

export default function SearchPage() {
  return (
    <>
      <SEO
        title="Buscador de Resultados | Sortudo"
        description="Consulte qualquer concurso da Mega-Sena ou verifique se seus números da sorte já foram sorteados no passado."
        url="https://sortudo.web.app/buscar"
      />
      <Search />
    </>
  );
}
