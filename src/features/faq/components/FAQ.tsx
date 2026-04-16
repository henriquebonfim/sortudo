import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'Qual é a chance exata de ganhar na Mega-Sena com a aposta simples?',
    answer:
      'A probabilidade de acertar os 6 números com uma aposta simples de 6 dezenas é de 1 em 50.063.860. Isso significa que se você jogasse um bilhete diferente por dia, levaria cerca de 137.000 anos para cobrir todas as combinações matemáticas.',
  },
  {
    question: 'Apostar em números que já saíram muito aumenta a minha chance?',
    answer:
      "Não. Sorteios de loteria são eventos inteiramente independentes. O fato de um número ter sido sorteado mais vezes na história não tem peso probabilístico no próximo sorteio. Acreditar que isso influencia é conhecido como a 'Falácia do Apostador'.",
  },
  {
    question: 'Como essas probabilidades são calculadas?',
    answer:
      'Trata-se de uma combinação simples na matemática, onde a ordem não importa. O cálculo é C(n, k) = n! / (k! * (n - k)!), e no caso da Mega-Sena temos 60 números (n) disponíveis escolhendo 6 (k). Isso resolve a equação totalizando 50.063.860 possibilidades únicas.',
  },
  {
    question: 'Se a chance é tão baixa, qual o objetivo do projeto?',
    answer:
      "O objetivo do 'Sortudo' é inteiramente educacional. Usar dados para mostrar o quão raro e improvável é vencer na loteria funciona como uma poderosa ferramenta de conscientização financeira, combatendo a dependência em sorteios de azar através do letramento matemático.",
  },
];

export function FAQ() {
  return (
    <div className="container max-w-4xl py-12 md:py-24 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 md:gap-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-gradient-gold">
            Perguntas Frequentes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Respostas diretas sobre a matemática, os dados e funcionamento histórico da loteria.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, ease: 'easeOut' }}
              className="card-glass border-white/5 rounded-2xl p-6 md:p-8"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h2 className="text-xl font-semibold mb-4 text-foreground" itemProp="name">
                {faq.question}
              </h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text" className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
