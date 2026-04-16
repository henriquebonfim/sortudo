import { About } from '@/features/about/components/About';
import { SEO } from '@/shared/components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Sobre o Projeto | Sortudo"
        description="Entenda o objetivo educacional por trás do Sortudo e como a matemática explica a probabilidade de ganhar na loteria."
        url="https://sortudo.web.app/sobre"
      />
      <About />
    </>
  );
}
