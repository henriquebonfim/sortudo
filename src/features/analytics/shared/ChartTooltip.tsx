import { memo } from "react";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: Record<string, unknown>;
    value: number | string;
    name: string;
    color?: string;
  }>;
  label?: string;
  title?: string;
  formatter?: (value: number | string | unknown, name: string) => string | React.ReactNode;
  items?: Array<{
    label: string;
    value: string | number;
    color?: string;
    suffix?: string;
  }>;
}

export const ChartTooltip = memo(function ChartTooltip({
  active,
  payload,
  title,
  items,
  formatter,
  label: _label
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as Record<string, string | number | undefined>;

  return (
    <div className="glass-card border border-border p-3 text-xs font-mono shadow-xl bg-background/95 backdrop-blur-md">
      {(title || data?.number || data?.name || data?.label) && (
        <p className="text-foreground font-bold text-sm mb-1.5 border-b border-border pb-1">
          {title || (data.number ? `Número ${data.number}` : data.name || data.label)}
        </p>
      )}

      <div className="space-y-1.5">
        {items ? (
          items.map((item, i) => {
            // If value is a string, it's likely a key in the data object
            const val = typeof item.value === 'string' && data[item.value] !== undefined
              ? data[item.value]
              : item.value;

            const displayVal = formatter ? formatter(val, item.label) : `${val}${item.suffix || ""}`;
            return (
              <p key={i} className="text-muted-foreground flex justify-between gap-4">
                <span className="opacity-80 font-medium">{item.label}:</span>
                <span className={item.color || "text-foreground font-bold"}>
                  {displayVal}
                </span>
              </p>
            );
          })
        ) : (
          payload.map((entry, i) => (
            <p key={i} className="text-muted-foreground flex justify-between gap-4">
              <span className="opacity-80">{entry.name}:</span>
              <span className="text-foreground font-bold" style={{ color: entry.color }}>
                {formatter ? formatter(entry.value, entry.name) : entry.value}
              </span>
            </p>
          ))
        )}
      </div>
    </div>
  );
});
