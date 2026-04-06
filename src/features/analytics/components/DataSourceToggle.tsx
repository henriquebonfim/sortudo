import { cn } from '@/shared/utils/cn';
import { DataSource, useDataSourceStore } from '@/store/data';
import { useIsSeeding } from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import { Database, FileText, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Switcher between data sources.
 *
 * Provides an interface for the user to swap between 'Official Data' and 'Local XLSX Data'.
 * Contains a two-step confirmation for clearing local data from IndexedDB.
 */
export function DataSourceToggle() {
  const { source, switchTo, hasLocalData, clearLocalData } = useDataSourceStore();
  const isSeeding = useIsSeeding();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // If the user hasn't uploaded any local data yet, there's no reason to show the toggle.
  if (!hasLocalData) return null;

  const handleToggle = async (newSource: DataSource) => {
    if (newSource === source || isSwitching || isSeeding) return;

    setIsSwitching(true);
    try {
      await switchTo(newSource);
    } catch (error) {
      console.error('Failed to switch data source:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleClearLocal = async () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }

    try {
      await clearLocalData();
      setIsConfirmingClear(false);
    } catch (error) {
      console.error('Failed to clear local data:', error);
    }
  };

  const loading = isSwitching || isSeeding;

  return (
    <div className="flex items-center gap-1.5 transition-all">
      {/* Source Selector */}
      <div className="flex items-center p-1 rounded-xl bg-muted/10 border border-border backdrop-blur-md relative group/toggle">
        <button
          disabled={loading}
          onClick={() => handleToggle('official')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative z-10',
            source === 'official'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/10 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSwitching && source !== 'official' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Database size={14} />
          )}
          <span>Dados Oficiais</span>
        </button>

        <button
          disabled={loading}
          onClick={() => handleToggle('local')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative z-10',
            source === 'local'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/10 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSwitching && source !== 'local' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FileText size={14} />
          )}
          <span>Arquivo Local</span>
        </button>

        {loading && (
          <div className="absolute inset-0 rounded-xl bg-background/20 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none" />
        )}
      </div>

      {/* Clear/Delete Local Data Button */}
      <AnimatePresence>
        {source === 'local' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClearLocal}
            className={cn(
              'p-2.5 rounded-xl border transition-all text-muted-foreground flex items-center gap-2 min-w-[40px] justify-center overflow-hidden',
              isConfirmingClear
                ? 'bg-hot text-white border-hot shadow-hot-subtle px-4'
                : 'bg-muted/10 border-border hover:bg-hot hover:text-white'
            )}
            title="Sair do modo local e remover arquivo salvo"
          >
            {isConfirmingClear ? (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
              >
                Confirmar Limpeza
              </motion.span>
            ) : (
              <Trash2 size={15} />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
