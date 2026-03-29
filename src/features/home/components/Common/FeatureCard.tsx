import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  link: string;
  cta: string;
}

export function FeatureCard({ icon, title, desc, link, cta }: FeatureCardProps) {
  return (
    <motion.div variants={fadeUp}>
      <Link to={link} className="group block h-full">
        <div className="glass-card-hover p-5 md:p-6 h-full flex flex-col cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <h3 className="font-display font-bold text-base mb-1.5 text-foreground">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground flex-1 mb-3 leading-relaxed">
            {desc}
          </p>
          <span className="text-xs font-medium text-primary group-hover:underline">
            {cta} →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
