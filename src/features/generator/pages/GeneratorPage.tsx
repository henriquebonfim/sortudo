import { Generator } from '@/features/generator/components/Generator';
import { SEO } from '@/shared/components/SEO';

export default function GeneratorPage() {
  return (
    <>
      <SEO
        title="Gerador de Sorte (Números) | Sortudo"
        description="Gere combinações aleatórias para a Mega-Sena. Descubra a dificuldade extrema através de uma simulação física baseada em estatística real."
        url="https://sortudo.web.app/gerador"
      />
      <Generator />
    </>
  );
}
