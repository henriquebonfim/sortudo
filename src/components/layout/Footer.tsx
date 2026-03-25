import { Github, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-display font-bold text-foreground">
              Sortudo?
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/sobre" className="hover:text-foreground transition-colors">Sobre</Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              Open Source
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            Dados oficiais da CEF. Matemática por nossa conta. Não somos um site de apostas. Somos a cura.
            <br />
            "Jogar pode ser divertido. Só saiba quanto está custando."
          </p>
        </div>
      </div>
    </footer>
  );
}
