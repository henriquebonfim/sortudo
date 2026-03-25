import { motion } from 'framer-motion';
import {
  WhatIsIt,
  Methodology,
  OpenSource,
  Contribute,
  FooterNote,
} from '@/features/about/components';

export default function AboutPage() {
  return (
    <div className="container py-20 md:py-28 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-6">Sobre o Projeto</h1>

        <div className="space-y-8">
          <WhatIsIt />
          <Methodology />
          <OpenSource />
          <Contribute />
          <FooterNote />
        </div>
      </motion.div>
    </div>
  );
}
