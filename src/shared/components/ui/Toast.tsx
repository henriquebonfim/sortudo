import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastProps extends ToastItem {
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-emerald-400" size={18} />,
    error: <AlertCircle className="text-rose-400" size={18} />,
    info: <Info className="text-blue-400" size={18} />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-rose-500/10 border-rose-500/20',
    info: 'bg-blue-500/10 border-blue-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={cn(
        'pointer-events-auto flex items-center gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md',
        bgColors[type]
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium text-foreground">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-auto rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col gap-3 w-full max-w-xs">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
