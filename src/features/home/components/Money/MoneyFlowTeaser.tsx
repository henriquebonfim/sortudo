import { useLotteryMath } from "@/application/selectors/useLotteryMath";
import { SectionHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/features/home/components/Common/shared-animations";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { MoneyFlowChart } from "./MoneyFlowChart";
import { MoneyFunnel } from "./MoneyFunnel";

export function MoneyFlowTeaser() {
  const { expectedReturn: expected } = useLotteryMath();

  return (
    <div className="container px-4 md:px-0">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        <motion.div variants={fadeUp} className="space-y-6">
          <SectionHeader
            title={<>O Paraíso da <span className="text-gradient-gold">Banca</span></>}
            icon={<BarChart3 className="text-primary w-6 h-6" />}
          />

          <p className="text-xl text-muted-foreground leading-relaxed">
            A Mega-Sena é uma das formas mais eficientes de arrecadação do Estado.
            Apenas <span className="text-foreground font-bold">{expected.returnPercentage}%</span> de tudo o que é pago pelos apostadores retorna como prêmio. O restante tem destino certo.
          </p>

          <MoneyFunnel />

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
              <a
                href="https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx#:~:text=Repasses%20Sociais-,Repasses%20Sociais,-Ao%20jogar%20na"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Entender os repasses oficiais
              </a>
            </Button>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="sticky top-24">
          <MoneyFlowChart expected={expected} />
        </motion.div>


      </motion.div>
    </div>
  );
}
