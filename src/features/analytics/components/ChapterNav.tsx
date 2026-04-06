import { motion } from 'framer-motion';

interface ChapterNavProps {
  chapters: Array<{ id: string; title: string; icon: React.ReactNode }>;
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
}

export function ChapterNav({ chapters, currentChapterIndex, onChapterSelect }: ChapterNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
    >
      {chapters.map((ch, idx) => (
        <button
          key={ch.id}
          onClick={() => onChapterSelect(idx)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 backdrop-blur-md text-xs font-semibold
            ${
              idx === currentChapterIndex
                ? 'bg-primary border-primary text-black shadow-[0_0_12px_rgba(251,197,49,0.3)]'
                : 'bg-card/30 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card/60'
            }`}
        >
          <span
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 ${idx === currentChapterIndex ? 'scale-110' : 'opacity-60'}`}
          >
            {ch.icon}
          </span>
          {ch.title}
        </button>
      ))}
    </motion.div>
  );
}
