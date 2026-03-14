import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { calcularJurosCompostos } from "@/domain/math/compound-interest";
import { SELIC_RATE } from "@/core/constants/lottery";
import { Share2, Image as ImageIcon } from "lucide-react";

export default function FutureLetter() {
  const [nome, setNome] = useState("");
  const [valorMensal, setValorMensal] = useState(40);
  const [anos, setAnos] = useState(20);
  const [generated, setGenerated] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const textRef = useRef("");

  const futureYear = new Date().getFullYear() + anos;

  const data = useMemo(() => {
    const totalApostado = valorMensal * 12 * anos;
    const investido = calcularJurosCompostos(valorMensal, SELIC_RATE, anos);
    const totalSorteios = anos * 104;
    const chanceSena = ((totalSorteios * 2) / 50_063_860 * 100).toFixed(4);
    const estimativaCaixa = (22_000_000_000 * anos).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
    return { totalApostado, investido, totalSorteios, chanceSena, estimativaCaixa };
  }, [valorMensal, anos]);

  const fullText = useMemo(() => {
    const n = nome || "Jogador(a)";
    const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CARTA PARA ${n.toUpperCase()}, EM ${futureYear}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Olá, ${n}.

Você está lendo essa carta em ${futureYear}, após ${anos} anos
apostando na Mega-Sena. Aqui está um balanço honesto:

💸 Total apostado:        ${fmt(data.totalApostado)}
🎯 Chance de ter ganho:   ${data.chanceSena}% (provavelmente 0 vezes)
📈 Se tivesse investido:  ${fmt(data.investido)} (Tesouro Selic)

Nesse período, houve aproximadamente ${data.totalSorteios.toLocaleString("pt-BR")} sorteios.
Em 78,2% deles não houve nenhum ganhador.

A Caixa Econômica Federal arrecadou aproximadamente
${data.estimativaCaixa} com apostas como a sua nesse período.

Esperamos que você tenha se divertido.
Com carinho,
A Matemática.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }, [nome, anos, futureYear, data]);

  const handleGenerate = () => {
    setGenerated(true);
    setDisplayedText("");
    textRef.current = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        textRef.current += fullText[i];
        setDisplayedText(textRef.current);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 12);
  };

  const shareWhatsApp = () => {
    const text = `Descobri que vou gastar R$${data.totalApostado.toLocaleString("pt-BR")} na Mega-Sena em ${anos} anos. Veja quanto VOCÊ já perdeu:`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.origin)}`, "_blank");
  };

  return (
    <div className="container py-20 md:py-28 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">💌 Carta para o Seu Eu do Futuro</h1>
        <p className="section-subheading mb-10">
          Uma mensagem honesta sobre o que a Mega-Sena vai custar.
        </p>
      </motion.div>

      <div className="glass-card p-6 md:p-8 space-y-6 mb-8">
        <div>
          <label className="stat-label mb-2 block">Seu nome (opcional)</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Jogador(a)"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="stat-label mb-2 block">Quanto pretende gastar por mês (R$)</label>
          <input
            type="range"
            min={10}
            max={200}
            step={10}
            value={valorMensal}
            onChange={(e) => setValorMensal(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <span className="font-mono text-xl font-bold text-foreground">R$ {valorMensal}/mês</span>
        </div>
        <div>
          <label className="stat-label mb-2 block">Por quantos anos</label>
          <input
            type="range"
            min={1}
            max={40}
            value={anos}
            onChange={(e) => setAnos(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <span className="font-mono text-xl font-bold text-foreground">{anos} anos</span>
        </div>
        <button onClick={handleGenerate} className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-display font-bold hover:bg-primary/90 transition-colors">
          Gerar minha carta
        </button>
      </div>

      {generated && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card p-6 md:p-8 gold-glow">
            <pre className="terminal-text whitespace-pre-wrap text-sm leading-relaxed overflow-x-auto">
              {displayedText}
              {displayedText.length < fullText.length && <span className="animate-pulse">▊</span>}
            </pre>
          </div>

          {displayedText.length >= fullText.length && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-6 justify-center">
              <button onClick={shareWhatsApp} className="pill-btn pill-btn-active flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Compartilhar no WhatsApp
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
