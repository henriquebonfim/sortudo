import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-display font-black mb-4 flex items-center justify-center gap-3">
        <span className="text-gradient-gold">{title}</span>
      </h1>
      <p className="section-subheading max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
}
