import { motion } from 'framer-motion';
import { formatNumber } from '@/lib/formatters';
import { TOTAL_COMBINATIONS } from '@/domain/lottery/lottery.constants';

import { GenerationMode } from '@/domain/lottery/generators/number-generator';

interface ContextMessageProps {
  mode: GenerationMode;
  hasNumbers: boolean;
}

function getContextMessage(mode: GenerationMode): string {

  if (mode === 'dates') {
    return 'Jogar datas é tão válido quanto qualquer outra combinação — mesma probabilidade. Mas como muita gente faz isso, se você ganhar vai dividir com mais pessoas. Matematicamente pior.';
  }
  if (mode === 'primes') {
    return 'Existem 17 números primos na Mega-Sena. Jogar apenas primos é válido, mas a chance matemática de saírem 6 simultaneamente é pequena.';
  }
  if (mode === 'fibonacci') {
    return 'A sequência de Fibonacci gera apenas 9 dezenas compatíveis na Mega-Sena (1, 2, 3, 5, 8, 13, 21, 34, 55). Escolher entre eles restringe muito suas opções.';
  }
  if (mode === '3odds-3evens') {
    return 'Cerca de 31% dos sorteios da Mega-Sena resultam em 3 ímpares e 3 pares. É o padrão genérico mais comum estatisticamente.';
  }
  return `Esta combinação tem exatamente 1 em ${formatNumber(TOTAL_COMBINATIONS)} de ganhar a sena. Igual a qualquer outra combinação existente.`;
}

export function ContextMessage({ mode, hasNumbers }: ContextMessageProps) {
  if (!hasNumbers) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 card-surface p-4 text-center"
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        {getContextMessage(mode)}
      </p>
    </motion.div>
  );
}
