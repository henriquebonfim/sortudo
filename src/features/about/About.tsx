import { motion } from 'framer-motion';
import { Code2, Database, ExternalLink, Info, Shield, ShieldCheck, Terminal } from 'lucide-react';
import { DataParsingProcessChart } from '../analytics/charts/process/DataParsingProcessChart';

const sources = [
  "https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses-2025.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses-2024.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses_sociais_2023.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses_sociais_2022.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses_sociais_2021.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/repasses-sociais-2020.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/REPASSES_2019.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_sociais-loterias-2018.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2017.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2016.pdf",
  "https://www.caixa.gov.br/Downloads/caixa-loterias/Repasses_2015.pdf",
];

// Simple fallback for Github icon if not found in Lucide
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function About() {
  return (
    <div className='page-hero'>
      <section className="container m-auto flex flex-col pt-20 pb-32 px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Info className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8 tracking-tight">
            Transparência e <span className="text-gradient-gold">Precisão</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            O Sortudo é uma ferramenta de auditoria cidadã que processa décadas de dados oficiais para revelar a realidade matemática por trás dos sonhos.
          </p>
        </motion.div>

        {/* Methodology Section */}
        <div className="max-w-5xl mx-auto space-y-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Database className="w-6 h-6" />, title: "Sanitização", desc: "Normalização de dados brutos e tratamento de inconsistências históricas para garantir integridade total." },
              { icon: <Terminal className="w-6 h-6" />, title: "Processamento", desc: "Cálculos de probabilidade e frequência realizados instantaneamente no browser com tecnologia Web Worker." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Auditoria", desc: "Validação cruzada entre diferentes fontes para garantir precisão matemática 1:1." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors shadow-xl"
              >
                <div className="text-primary mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0a0a0c] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-3xl"
          >
            <h3 className="text-sm font-mono text-muted-foreground mb-12 text-center uppercase tracking-[0.3em] font-bold">
              Fluxo de Processamento de Dados
            </h3>
            <div className="h-[400px] w-full">
              <DataParsingProcessChart />
            </div>
            <p className="text-xs text-muted-foreground/50 text-center mt-12 italic">
              * O processamento ocorre localmente para garantir privacidade e performance.
            </p>
          </motion.div>

          {/* Open Source & Sources */}
          <div className="grid gap-8">

            <div className="glass-card p-10 rounded-[32px] space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-success" />
                <h2 className="text-2xl font-display font-bold">Fontes Oficiais</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos exclusivamente dados públicos fornecidos pela CAIXA Econômica Federal.
              </p>
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-4 scrollbar-thin">
                {sources.map((source, i) => (
                  <a
                    key={i}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
                  >
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {source.split('/').pop()}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card p-10 rounded-[32px] space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold">Código Aberto</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Acreditamos que algoritmos de loteria devem ser auditáveis. Por isso, 100% do nosso código está
                disponível no GitHub sob licença MIT.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://github.com/henriquebonfim/sortudo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm"
                >
                  <GithubIcon className="w-4 h-4" /> Ver no GitHub
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
