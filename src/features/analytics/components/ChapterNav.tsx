import { motion, useDragControls, useMotionValue, type PanInfo } from 'framer-motion';
import { ChevronUp, GripHorizontal } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';

interface ChapterNavProps {
  chapters: Array<{ id: string; title: string; icon: ReactNode }>;
  currentChapterIndex: number;
  onChapterSelect: (index: number, chapterId?: string) => void;
}

export function ChapterNav({ chapters, currentChapterIndex, onChapterSelect }: ChapterNavProps) {
  const navRef = useRef<HTMLDivElement | null>(null);
  const floatingBoundsRef = useRef<HTMLDivElement | null>(null);
  const draggedSincePointerDownRef = useRef(false);
  const [isFloating, setIsFloating] = useState(false);
  const dragControls = useDragControls();
  const floatingX = useMotionValue(0);
  const floatingY = useMotionValue(0);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePosition = () => {
      if (!navRef.current) {
        setIsFloating(false);
        return;
      }

      const shouldFloat = navRef.current.getBoundingClientRect().bottom < 0;
      setIsFloating((prev) => (prev === shouldFloat ? prev : shouldFloat));
    };

    handlePosition();
    window.addEventListener('scroll', handlePosition, { passive: true });
    window.addEventListener('resize', handlePosition);

    return () => {
      window.removeEventListener('scroll', handlePosition);
      window.removeEventListener('resize', handlePosition);
    };
  }, []);

  const handleFloatingDragPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    draggedSincePointerDownRef.current = false;
    dragControls.start(event, { snapToCursor: false });
  };

  const handleFloatingDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) + Math.abs(info.offset.y) > 4) {
      draggedSincePointerDownRef.current = true;
    }
  };

  const handleFloatingDragEnd = () => {
    window.setTimeout(() => {
      draggedSincePointerDownRef.current = false;
    }, 0);
  };

  const handleChapterClick = (index: number, chapterId: string) => {
    if (draggedSincePointerDownRef.current) return;
    onChapterSelect(index, chapterId);
  };

  const renderButtons = (floating = false) =>
    chapters.map((ch, idx) => (
      <button
        key={`${floating ? 'floating' : 'inline'}-${ch.id}`}
        onClick={() => handleChapterClick(idx, ch.id)}
        className={`flex items-center gap-2 rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 backdrop-blur-md font-semibold
            ${floating ? 'px-3.5 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs' : 'px-4 py-2 text-xs'}
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
    ));

  return (
    <>
      <motion.div
        ref={navRef}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
      >
        {renderButtons()}
      </motion.div>

      {isFloating && chapters.length > 0 && (
        <motion.div
          ref={floatingBoundsRef}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-2 z-50 sm:inset-4"
        >
          <motion.div
            drag
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={floatingBoundsRef}
            dragMomentum={false}
            dragElastic={0.1}
            onDrag={handleFloatingDrag}
            onDragEnd={handleFloatingDragEnd}
            style={{ x: floatingX, y: floatingY }}
            className="pointer-events-auto absolute bottom-1 right-1 touch-none select-none"
          >
            <div className="rounded-full bg-transparent p-1.5 shadow-lg backdrop-blur-xl">
              <button
                onClick={handleScrollTop}
                aria-label="Voltar ao topo"
                title="Voltar ao topo"
                className="flex h-10 w-10 items-center justify-center rounded-full  bg-card/30 text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground hover:bg-card/60 cursor-pointer"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <div className="h-px w-6 bg-border/80" />
              <div className="flex flex-col items-center gap-1.5">
                {chapters.map((ch, idx) => (
                  <button
                    key={`floating-icon-${ch.id}`}
                    onClick={() => handleChapterClick(idx, ch.id)}
                    aria-label={ch.title}
                    title={ch.title}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer backdrop-blur-md
                    ${
                      idx === currentChapterIndex
                        ? 'bg-primary border-primary text-black shadow-[0_0_12px_rgba(251,197,49,0.3)]'
                        : 'bg-card/30 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card/60'
                    }`}
                  >
                    <span
                      className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 ${idx === currentChapterIndex ? 'scale-110' : 'opacity-70'}`}
                    >
                      {ch.icon}
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onPointerDown={handleFloatingDragPointerDown}
                  aria-label="Mover atalhos"
                  title="Mover atalhos"
                  className="flex h-7 w-7 items-center justify-center rounded-full     bg-card/40 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40 cursor-grab active:cursor-grabbing"
                >
                  <GripHorizontal className="h-3.5 w-3.5" />
                </button>

                <div className="h-px w-6 bg-border/80" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
