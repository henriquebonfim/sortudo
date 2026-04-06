import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const CHAPTERS = [
  { id: 'inicio', label: 'Início' },
  { id: 'matematica', label: 'Matemática' },
  { id: 'probabilidade', label: 'Probabilidade' },
  { id: 'recordes', label: 'Recordes' },
  { id: 'arrecadacao', label: 'Arrecadação' },
];

/**
 * ChapterProgress Component
 *
 * Provides visual feedback of the user's journey through the narrative sections.
 * Combines a global scroll progress bar with a contextual side indicator.
 */
export function ChapterProgress() {
  const [activeChapter, setActiveChapter] = useState('inicio');

  // Progress bar at the top
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Track active section for the side indicator
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the entry is intersecting and moving into the upper half of the screen
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        });
      },
      {
        // Trigger when the element is roughly in the middle of the viewport
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0,
      }
    );

    CHAPTERS.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Top Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-[100] origin-left shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
        style={{
          scaleX,
          background:
            'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.6) 100%)',
        }}
      />

      {/* ── Side Narrative Progress ── */}
      <nav
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6"
        aria-label="Progresso da Narrativa"
      >
        <div className="flex flex-col gap-5 items-end">
          {CHAPTERS.map((chapter, index) => {
            const isActive = activeChapter === chapter.id;

            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="group relative flex items-center justify-end gap-3 outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(chapter.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {/* Chapter Label */}
                <span
                  className={`text-[10px] translate-x-0 font-mono font-bold tracking-[0.2em] uppercase transition-all duration-500 transform ${
                    isActive
                      ? 'text-primary opacity-100 text-[15px]'
                      : 'text-muted-foreground/40    group-hover:translate-x-0 group-hover:text-muted-foreground'
                  }`}
                >
                  {chapter.label}
                </span>

                {/* Dot Indicator */}
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isActive
                        ? 'hsl(var(--primary))'
                        : 'rgba(255, 255, 255, 0.15)',
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                      isActive
                        ? 'shadow-[0_0_10px_hsl(var(--primary)/0.5)]'
                        : 'group-hover:bg-muted-foreground/50'
                    }`}
                  />

                  {isActive && (
                    <motion.div
                      layoutId="active-chapter-glow"
                      className="absolute -inset-2 rounded-full bg-primary/10 blur-sm"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>

                {/* Vertical Line Segment (except for last) */}
                {index < CHAPTERS.length - 1 && (
                  <div className="absolute right-[2.5px] top-[1.4rem] w-[1px] h-4 bg-border/20 pointer-events-none" />
                )}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
