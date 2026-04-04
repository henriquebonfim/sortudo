import { Button } from '@/components/ui/components/button';
import { BarChart3, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClosingQuote() {
  return (
    <section className="container text-center flex flex-col items-center">
      <blockquote className="text-2xl md:text-4xl font-display font-bold text-foreground max-w-4xl mx-auto text-balance mb-8">
        A esperança motiva a aposta. Mas no final das contas, você não está jogando contra a sorte —{" "}
        <span className="text-gradient-gold">está jogando contra a matemática</span>.
      </blockquote>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
        Para a loteria, o sistema é perfeito. Independentemente de quem ganha ou perde, a estatística garante que a casa nunca saia no prejuízo.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button asChild size="lg" className="rounded-full w-full sm:w-auto hover:scale-105 transition-transform"><Link to="/dados"><BarChart3 className="w-5 h-5 mr-2 -ml-1" />Explorar o Banco de Dados</Link></Button>
        <Button asChild variant="outline" size="lg" className="rounded-full w-full sm:w-auto hover:bg-muted/50 transition-colors"><Link to="/sobre"><Info className="w-5 h-5 mr-2 -ml-1" />Sobre o Projeto</Link></Button>
      </div>
    </section>
  );
}
