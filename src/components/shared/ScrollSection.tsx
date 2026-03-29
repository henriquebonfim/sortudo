import { motion, useInView, type Variant } from "framer-motion";
import { useRef } from "react";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

/**
 * A wrapper component for storytelling sections that triggers
 * entrance animations when they enter the viewport.
 */
export function ScrollSection({ children, className = "", id, delay = 0 }: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-15% 0px -15% 0px" // Trigger slightly before it hits the center
  });

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.21, 1.11, 0.81, 0.99] as [number, number, number, number], // Cubic bezier array
        delay: delay
      }
    }
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={`relative min-h-[60vh] flex flex-col justify-center py-20 px-4 md:px-0 ${className}`}
    >
      {children}
    </motion.section>
  );
}
