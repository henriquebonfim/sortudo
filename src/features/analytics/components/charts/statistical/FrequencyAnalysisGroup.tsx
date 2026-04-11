import { Button } from '@/shared/components/ui/Button';
import { useFrequencies } from '@/store/selectors';
import { useState } from 'react';
import { BubbleChart } from './BubbleChart';
import { FrequencyBarChart } from './FrequencyBarChart';
import { FILTER_OPTIONS, FilterMode, LEGEND_ITEMS } from './frequency-bar.constants';

export function FrequencyAnalysisGroup() {
  const [filter, setFilter] = useState<FilterMode>('all');
  const data = useFrequencies();

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <FrequencyBarChart filter={filter} />
        <BubbleChart filter={filter} />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {FILTER_OPTIONS.map((f) => (
          <Button
            key={f.id}
            onClick={() => setFilter(f.id)}
            variant={filter === f.id ? 'default' : 'outline'}
            size="sm"
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 text-[10px] sm:text-xs text-muted-foreground justify-center mt-6 py-4 border-t border-border">
        {LEGEND_ITEMS.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
