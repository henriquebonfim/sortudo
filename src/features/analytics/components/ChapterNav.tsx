import { motion } from 'framer-motion';

interface ChapterNavProps {
  chapters: Array<{ id: string; title: string; icon: React.ReactNode }>;
}

export function ChapterNav({ chapters }: ChapterNavProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(`chapter-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
    >
      {chapters.map((ch) => (
        <button
          key={ch.id}
          onClick={() => scrollTo(ch.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border
            bg-card/40 text-muted-foreground text-xs font-medium whitespace-nowrap
            hover:border-primary/40 hover:text-foreground hover:bg-card/70
            transition-all duration-200 cursor-pointer flex-shrink-0 backdrop-blur-sm"
        >
          <span className="w-3.5 h-3.5 flex-shrink-0">{ch.icon}</span>
          {ch.title}
        </button>
      ))}
    </motion.div>
  );
}
