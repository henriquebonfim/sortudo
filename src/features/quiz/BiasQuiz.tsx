import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  bias: string;
  explanation: string;
}

const questions: Question[] = [
  {
    question: 'O número 26 não sai há 40 sorteios. O que isso significa?',
    options: ["Ele está 'na hora' de sair", "Vai continuar atrasado", "Absolutamente nada — cada sorteio é independente", "Devo evitar o 26"],
    correct: 2,
    bias: "Falácia do Jogador (Gambler's Fallacy)",
    explanation: "Cada sorteio é completamente independente. A bola não tem memória. 40 ausências não alteram a probabilidade do próximo sorteio."
  },
  {
    question: 'Jogar 1, 2, 3, 4, 5, 6 tem menos chance que uma combinação "aleatória"?',
    options: ["Sim, sequências são raras", "Não — toda combinação tem exatamente 1 em 50 milhões", "Depende do histórico"],
    correct: 1,
    bias: "Viés de Representatividade",
    explanation: "Todas as 50.063.860 combinações têm probabilidade idêntica. '1,2,3,4,5,6' parece especial, mas não é."
  },
  {
    question: "Qual é mais provável: ser atingido por raio na vida ou ganhar a Mega-Sena?",
    options: ["Ser atingido por raio", "Ganhar a Mega-Sena", "São iguais"],
    correct: 0,
    bias: "Viés de Disponibilidade",
    explanation: "Raio: ~1 em 15.000 na vida. Mega-Sena: 1 em 50 milhões por jogo. O raio é ~3.300 vezes mais provável."
  },
  {
    question: "Um bolão de 10 pessoas ganha R$50M. Cada um recebe:",
    options: ["R$50 milhões", "R$5 milhões — dividem o prêmio", "R$50 milhões cada"],
    correct: 1,
    bias: "Ilusão de Controle",
    explanation: "Bolão aumenta a chance, mas dilui o prêmio proporcionalmente. Mais chance de ganhar menos."
  },
  {
    question: "Você aposta todo sorteio por 1 ano (156 apostas). Sua chance acumulada de ganhar a sena é:",
    options: ["0,0003%", "1 em 321.000", "Muito maior depois de 1 ano"],
    correct: 0,
    bias: "Falácia da Acumulação",
    explanation: "156 ÷ 50.063.860 = 0,0003%. Apostar mais não 'acumula' sorte — cada jogo é independente."
  },
  {
    question: "Jogar datas de aniversário (números 1–31) é ruim porque:",
    options: ["Esses números saem menos", "Muita gente faz isso, então o prêmio é mais dividido", "Não é ruim, tão válido quanto"],
    correct: 1,
    bias: "Efeito Manada",
    explanation: "A chance é igual para qualquer combinação, mas números populares (1-31) resultam em prêmio mais dividido."
  },
  {
    question: "O nº mais sorteado (10, 352x) vs. menos (26, 245x). Diferença de 107 em 30 anos é:",
    options: ["Evidência de que 10 é especial", "Motivo para evitar o 26", "Variação estatística completamente normal"],
    correct: 2,
    bias: "Apofenia (ver padrões onde não há)",
    explanation: "Em ~17.898 bolas sorteadas, variação de 107 está perfeitamente dentro do esperado estatisticamente."
  },
];

function getVerdict(score: number) {
  if (score === 7) return { emoji: "🧠", text: "Você entende probabilidade melhor que 99% dos jogadores. Por isso provavelmente não joga." };
  if (score >= 4) return { emoji: "📊", text: "Você sabe bastante, mas alguns vieses ainda escapam. A matemática é implacável." };
  return { emoji: "🎰", text: "A Caixa agradece sua fidelidade. Que tal ver quanto já gastou?" };
}

export default function BiasQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const verdict = getVerdict(score);

  return (
    <div className="container py-20 md:py-28 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">🧠 Teste de Vieses Cognitivos</h1>
        <p className="section-subheading mb-10">
          Você acha que o 10 está "quente"? Vamos testar sua intuição contra a matemática.
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full mb-10 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${((finished ? questions.length : current) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="glass-card p-6 md:p-8">
              <p className="text-xs font-mono text-muted-foreground mb-4">
                Pergunta {current + 1} de {questions.length}
              </p>
              <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-6">
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  let btnClass = "pill-btn-inactive bg-secondary/50";
                  if (selected !== null) {
                    if (idx === q.correct) btnClass = "border-success bg-success/10 text-success";
                    else if (idx === selected) btnClass = "border-hot bg-hot/10 text-hot";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`pill-btn w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 ${btnClass}`}
                    >
                      {selected !== null && idx === q.correct && <CheckCircle className="h-5 w-5 text-success shrink-0" />}
                      {selected !== null && idx === selected && idx !== q.correct && <XCircle className="h-5 w-5 text-hot shrink-0" />}
                      <span className="text-sm">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <div className="educational-box">
                    <p className="text-xs font-mono text-primary mb-1">{q.bias}</p>
                    <p className="text-sm text-muted-foreground">{q.explanation}</p>
                  </div>
                  <button onClick={next} className="mt-4 py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary/90 transition-colors">
                    {current < questions.length - 1 ? (
                      <><ArrowRight className="inline mr-2 h-4 w-4" />Próxima</>
                    ) : (
                      "Ver resultado"
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="glass-card p-8 md:p-12 text-center">
              <span className="text-6xl mb-6 block">{verdict.emoji}</span>
              <p className="font-mono text-5xl font-bold text-primary mb-4">
                {score}/{questions.length}
              </p>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
                {verdict.text}
              </p>
              <button onClick={reset} className="py-3 px-8 rounded-xl bg-primary text-primary-foreground font-display font-bold hover:bg-primary/90 transition-colors">
                <RotateCcw className="inline mr-2 h-4 w-4" />
                Tentar novamente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
