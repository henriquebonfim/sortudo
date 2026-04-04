import { BarChart3, Dices, ExternalLink, Home, Info, Search, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const year = new Date().getFullYear();

const navLinks = [
  { label: "Início", path: "/", icon: Home },
  { label: "Gerador", path: "/gerador", icon: Dices },
  { label: "Buscar", path: "/buscar", icon: Search },
  { label: "Relatório", path: "/dados", icon: BarChart3 },
  { label: "Sobre", path: "/sobre", icon: Info },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background" role="contentinfo">
      {/* Gold gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(43 96% 56% / 0.35) 35%, hsl(43 96% 56% / 0.35) 65%, transparent 100%)' }}
      />

      <div className="container py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Col 1 — Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="Página inicial">
              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 96% 48%), hsl(43 96% 60%))',
                  boxShadow: '0 2px 6px hsl(43 96% 56% / 0.35)',
                }}
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-900/80" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-base text-foreground tracking-tight">
                Sortudo<span className="text-gradient-gold">?</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A matemática que ninguém te contou sobre a Mega-Sena. Dados oficiais, análise independente.
            </p>
            <p className="text-xs text-muted-foreground/50">
              © {year} Sortudo? · Não somos um site de apostas.
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium mb-4">
              Páginas
            </p>
            <nav className="space-y-2" aria-label="Links do rodapé">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 group"
                >
                  <item.icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-80 transition-opacity" strokeWidth={1.8} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — About + Legal */}
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium mb-4">
                Projeto
              </p>
              <a
                href="https://github.com/henriquebonfim/sortudo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <ExternalLink className="w-4 h-4" />
                Open Source no GitHub
              </a>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/30 space-y-1.5">
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                Dados oficiais da CEF. Matemática por nossa conta.
              </p>
              <p className="text-xs text-muted-foreground/50 italic leading-relaxed">
                "Jogar pode ser divertido. Só saiba quanto está custando."
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
