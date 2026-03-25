import type { SearchResult } from '@/domain/lottery/lottery.types';

interface ShareButtonProps {
  result: SearchResult;
}

export function ShareButton({ result }: ShareButtonProps) {
  const handleShare = () => {
    const nums = result.combination.join(' ');
    const hasJackpot = result.jackpot.length > 0;
    const msg = `Busquei minha combinação [${nums}] em todos os sorteios da Mega-Sena. Resultado: ${
      hasJackpot ? `saiu ${result.jackpot.length} vez(es)!` : 'nunca saiu.'
    } Chance de sair: 1 em 50 milhões. 😅\n    Confira: ${window.location.origin}/buscar?jogo=${result.combination.join(',')}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="text-center">
      <button
        onClick={handleShare}
        className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-green hover:text-green"
      >
        📱 Compartilhar no WhatsApp
      </button>
    </div>
  );
}
