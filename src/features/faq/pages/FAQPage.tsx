import { FAQ } from '@/features/faq/components/FAQ';
import { SEO } from '@/shared/components/SEO';
import { Helmet } from 'react-helmet-async';

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Qual é a chance exata de ganhar na Mega-Sena com a aposta simples?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A probabilidade de acertar os 6 números com uma aposta simples de 6 dezenas é de 1 em 50.063.860.',
        },
      },
      {
        '@type': 'Question',
        name: 'Apostar em números que já saíram muito aumenta a minha chance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Não. Sorteios de loteria são eventos independentes. Ter sido sorteado antes não influencia o próximo sorteio, trata-se da Falácia do Apostador.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como essas probabilidades são calculadas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Elas são calculadas usando a matemática da combinação simples. Onde temos 60 dezenas escolhendo 6: C(60,6) = 50.063.860 possibilidades úteis e mutuamente exclusivas.',
        },
      },
    ],
  };

  return (
    <>
      <SEO
        title="Dúvidas Frequentes (FAQ) | Sortudo"
        description="Respostas claras para as dúvidas mais comuns sobre a probabilidade da Mega-Sena, sorte e matemática envolvida nos sorteios."
        url="https://sortudo.web.app/faq"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <FAQ />
    </>
  );
}
