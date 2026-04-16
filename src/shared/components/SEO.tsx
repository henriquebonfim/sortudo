import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = 'Sortudo — A Matemática da Mega-Sena',
  description = 'A sorte é um erro de cálculo. Explore a improbabilidade estatística e a história da Mega-Sena com dados reais.',
  url = 'https://sortudo.web.app/',
  type = 'website',
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
