export function ClosingQuote() {
  return (
    <section className="py-16 border-t border-border">
      <div className="container text-center">
        <blockquote className="text-2xl md:text-3xl font-display font-bold text-foreground max-w-3xl mx-auto text-balance">
          "A <span className="text-gradient-gold">Caixa Econômica Federal</span> nunca perdeu dinheiro com loterias. O
          sistema é matematicamente perfeito —{" "}
          <span className="text-gradient-gold">para eles</span>."
        </blockquote>
        <p className="mt-6 text-sm text-muted-foreground">
          43,79% dos R$ 6 voltam como prêmio. 56,21% vão para o Estado, operação e social. Você nunca
          está jogando contra o azar — está jogando contra a matemática.
        </p>
      </div>
    </section>
  );
}
