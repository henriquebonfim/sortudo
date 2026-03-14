import { motion } from "framer-motion";
import { Github, ExternalLink, Heart, Code2 } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="container py-20 md:py-28 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-6">Sobre o Projeto</h1>

        <div className="space-y-8">
          <div className="glass-card p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-foreground mb-3">O que é isso?</h2>
            <p className="text-muted-foreground leading-relaxed">
              "Quanto você já perdeu?" é um simulador educativo e open source que usa dados reais
              da Mega-Sena para mostrar, de forma lúdica e descontraída, como funciona a matemática
              por trás das loterias. Não somos contra jogar — somos a favor de saber.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Metodologia</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Dados oficiais dos resultados da Caixa Econômica Federal</li>
              <li>• Probabilidades calculadas com combinatória padrão (C(60,6))</li>
              <li>• Simulações Monte Carlo para o simulador de apostas</li>
              <li>• Taxas de rendimento baseadas em médias históricas (Selic, Poupança, IBOVESPA)</li>
              <li>• Nenhuma IA, nenhum palpite — apenas matemática</li>
            </ul>
          </div>

          <div className="glass-card p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-foreground mb-3">
              <Code2 className="inline mr-2 h-5 w-5 text-primary" />
              Open Source
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Este projeto é completamente aberto. Contribuições são bem-vindas!
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="pill-btn pill-btn-inactive flex items-center gap-2">
                <Github className="h-4 w-4" /> Frontend (React)
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="pill-btn pill-btn-inactive flex items-center gap-2">
                <Github className="h-4 w-4" /> Backend (Cloud Functions)
              </a>
              <a href="#" className="pill-btn pill-btn-inactive flex items-center gap-2">
                <ExternalLink className="h-4 w-4" /> Documentação da API
              </a>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <h2 className="font-display font-bold text-xl text-foreground mb-3">Como contribuir</h2>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Fork o repositório no GitHub</li>
              <li>Clone e instale as dependências: <code className="font-mono text-primary">npm install</code></li>
              <li>Copie <code className="font-mono text-primary">.env.example</code> para <code className="font-mono text-primary">.env</code></li>
              <li>Rode o dev server: <code className="font-mono text-primary">npm run dev</code></li>
              <li>Abra um Pull Request com suas mudanças</li>
            </ol>
          </div>

          <div className="educational-box text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              Feito com <Heart className="h-4 w-4 text-hot" /> e matemática.
              <br />
              "Dados oficiais da CEF. Matemática por nossa conta. Não somos um site de apostas. Somos a cura."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
