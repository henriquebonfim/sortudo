import { SOURCES_LIST } from '@/features/about/constants';
import { NavigatorExtended } from '@/features/about/types';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Info,
  LayoutDashboard,
  Lightbulb,
  PieChart,
  Shield,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

function SuggestedFeaturesPanel() {
  const FEATURES = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Previsão por Frequência Adaptativa',
      description:
        'Calcule a "tendência" de saída de cada número usando médias móveis ponderadas por período — com visualização de aquecimento e resfriamento temporal.',
      tag: 'Análise avançada',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Comparação entre Loterias',
      description:
        'Compare probabilidades, EV e ROI histórico da Mega-Sena com Quina, Timemania, Lotofácil e outras loterias.',
      tag: 'Comparativo',
      color: 'from-green-500/20 to-emerald-500/10 border-green-500/30',
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: 'Dashboard Personalizado',
      description:
        'Usuário salva seus números favoritos e acompanha ao longo do tempo: quantas vezes quase ganhou (5, 4 acertos), quanto teria ganhado vs. gasto.',
      tag: 'Personalização',
      color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
          className={`rounded-2xl border bg-gradient-to-br p-5 flex flex-col gap-3 ${f.color}`}
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-white/5 text-foreground">{f.icon}</div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              {f.tag}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const GithubIcon = ({ className }: { className?: string }) => (
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

const STEPS = [
  {
    icon: <FileSpreadsheet className="w-5 h-5" />,
    title: 'Fonte de Dados',
    description: 'Leitura do Excel oficial contendo todos os sorteios desde o sorteio #1.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Normalização',
    description: 'Tratamento de duplicatas, formatos de data e limpeza de nomes de cidades.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: <PieChart className="w-5 h-5" />,
    title: 'Estatísticas',
    description: 'Cálculo de frequências, desvios, médias e tendências temporais.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: 'Insights',
    description: 'Geração de padrões e correlações visuais para suporte à decisão.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
];

function DataParsingProcessChart() {
  const [activeStep, setActiveStep] = useState(0);
  const nav = navigator as NavigatorExtended;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (STEPS.length + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 overflow-hidden">
      <h3 className="text-xl font-mono text-muted-foreground mb-12 text-center uppercase tracking-[0.3em] font-bold">
        Fluxo de Processamento de Dados
      </h3>
      <div className="relative space-y-8">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:h-0.5 sm:top-6 sm:bottom-auto hidden sm:block" />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
          {STEPS.map((step, i) => {
            const isCompleted = activeStep > i;
            const isActive = activeStep === i;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-row sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-4 group"
              >
                <div
                  className={`relative flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : isActive
                        ? `${step.bg} border-primary glow-sm text-primary`
                        : 'bg-muted/50 border-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}

                  {isActive && (
                    <motion.div
                      layoutId="active-ring"
                      className="absolute -inset-1 rounded-[14px] border border-primary/40"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h3
                    className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
              CPU: {nav.hardwareConcurrency} núcleos - RAM: {nav.deviceMemory} GB
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground italic max-w-[200px] text-center sm:text-right">
            * O processamento ocorre localmente para garantir privacidade e performance. Nenhum dado
            é coletado ou enviado para servidores.
          </p>
        </div>
      </div>
    </div>
  );
}

export function About() {
  const PIX_KEY = '220aeae9-2f05-4d7e-b7c2-217971479d5a';
  const [isPixCopied, setIsPixCopied] = useState(false);

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setIsPixCopied(true);
      setTimeout(() => setIsPixCopied(false), 1600);
    } catch {
      setIsPixCopied(false);
    }
  };

  const METHODOLOGY_ITEMS = [
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Sanitização',
      desc: 'Normalização de dados brutos e tratamento de inconsistências históricas para garantir integridade total.',
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: 'Processamento',
      desc: 'Cálculos de probabilidade e frequência realizados instantaneamente no browser com tecnologia Web Worker.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Auditoria',
      desc: 'Validação cruzada entre diferentes fontes para garantir precisão matemática 1:1.',
    },
  ];
  return (
    <div className="page-hero">
      <section className="container m-auto flex flex-col pb-16 pt-10 sm:pb-24 sm:pt-14 md:pb-32 md:pt-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-12 max-w-4xl text-center sm:mb-16 md:mb-24"
        >
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 sm:mb-6 sm:h-16 sm:w-16">
            <Info className="w-8 h-8 text-primary" />
          </div>
          <h1 className="mb-5 font-display text-3xl font-bold tracking-tight text-foreground sm:mb-6 sm:text-4xl md:mb-8 md:text-5xl lg:text-6xl">
            Transparência e <span className="text-gradient-gold">Precisão</span>
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg lg:text-xl">
            O Sortudo é uma ferramenta de auditoria cidadã que processa décadas de dados oficiais
            para revelar a realidade matemática dos números premiados.
          </p>
        </motion.div>

        {/* Methodology Section */}
        <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16 md:space-y-24">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3 md:gap-8">
            {METHODOLOGY_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl transition-colors hover:border-primary/30 sm:p-6 md:p-8"
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
            className="rounded-3xl border border-white/10 bg-[#0a0a0c] p-5 shadow-3xl sm:rounded-[40px] sm:p-8 md:p-12"
          >
            <div className="grid gap-8 ">
              <div className=" w-full">
                <DataParsingProcessChart />
              </div>
              {/* Open Source & Sources */}
              <div className="glass-card space-y-5 rounded-3xl p-5 sm:space-y-6 sm:p-8 md:p-10 md:rounded-[32px]">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-success" />
                  <h2 className="text-2xl font-display font-bold">Fontes Oficiais</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos exclusivamente dados públicos fornecidos pela CAIXA Econômica Federal.
                </p>
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-4 scrollbar-thin">
                  {SOURCES_LIST.map((source, i) => (
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

                <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-300">
                    Aviso Legal
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Este projeto utiliza exclusivamente dados oficiais disponibilizados pela CAIXA
                    Econômica Federal. Eventuais inconsistências, omissões, atrasos de atualização
                    ou divergências nesses dados são de responsabilidade exclusiva da própria CAIXA
                    Econômica Federal.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    O Sortudo possui finalidade estritamente informativa e educacional, não realiza
                    apostas, não intermedeia jogos e não apoia a prática de jogos de azar.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Projeto independente e sem fins lucrativos.
                  </p>
                </div>
              </div>

              <div className="glass-card space-y-5 rounded-3xl p-5 sm:space-y-6 sm:p-8 md:p-10 md:rounded-[32px]">
                <div className="flex items-center gap-3 mb-2">
                  <Code2 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-display font-bold">Código Aberto</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Acreditamos que algoritmos de loteria devem ser auditáveis. Por isso, 100% do
                  nosso código está disponível no GitHub sob licença MIT.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Confira as sugestões de melhorias e novas funcionalidades que planejamos para o
                  Sortudo.
                </p>
                <SuggestedFeaturesPanel />
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

              <div className="glass-card space-y-5 rounded-3xl p-5 sm:space-y-6 sm:p-8 md:p-10 md:rounded-[32px]">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-amber-400" />
                  <h2 className="text-2xl font-display font-bold">Apoie Este Projeto</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Se o Sortudo te ajuda de alguma forma, você pode apoiar a manutenção do projeto
                  com uma contribuição via Buy Me a Coffee ou PIX.
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <details
                      name="support-option"
                      className="group rounded-2xl border border-white/10 bg-white/5"
                    >
                      <summary className="flex list-none cursor-pointer items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-sm font-semibold text-foreground">Buy Me a Coffee</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            Débito/Crédito
                          </span>
                          <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </div>
                      </summary>
                      <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-2">
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-white p-2">
                          <img
                            src="/assets/qrcode_bmc.png"
                            alt="QR Code para apoiar no Buy Me a Coffee"
                            className="w-full h-auto"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed text-center">
                          Escaneie com a câmera do celular para abrir o link.
                        </p>
                      </div>
                    </details>
                  </div>
                  <div>
                    <details
                      name="support-option"
                      className="group rounded-2xl border border-white/10 bg-white/5"
                    >
                      <summary className="flex list-none cursor-pointer items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="text-sm font-semibold text-foreground">
                          Transferência via PIX
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            PIX
                          </span>
                          <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                            ▾
                          </span>
                        </div>
                      </summary>
                      <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-2">
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-white p-2">
                          <img
                            src="/assets/qrcode_pix.png"
                            alt="QR Code para apoiar via PIX"
                            className="w-full h-auto"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground leading-relaxed">
                          Escaneie com o app do seu banco para fazer uma doação via PIX ou copie a
                          chave abaixo.
                        </p>
                        <button
                          type="button"
                          onClick={handleCopyPixKey}
                          className="w-full text-xs text-muted-foreground bg-muted/50 border border-muted/20 p-2 rounded monospace block text-center transition-colors hover:bg-muted/70"
                          aria-label="Copiar chave PIX"
                          title="Clique para copiar a chave PIX"
                        >
                          {PIX_KEY}
                        </button>
                        <p
                          className={`text-[10px] text-center transition-opacity ${
                            isPixCopied
                              ? 'text-emerald-400 opacity-100'
                              : 'text-muted-foreground/60 opacity-70'
                          }`}
                          aria-live="polite"
                        >
                          {isPixCopied ? 'Chave PIX copiada!' : 'Clique na chave para copiar'}
                        </p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
