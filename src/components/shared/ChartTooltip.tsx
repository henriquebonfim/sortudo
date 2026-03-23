import { memo } from "react";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  title?: string;
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
  items 
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono shadow-xl">
      {title ? (
        <p className="text-foreground font-bold text-sm mb-1">{title}</p>
      ) : data.number ? (
        <p className="text-foreground font-bold text-sm mb-1">Número {data.number}</p>
      ) : data.label ? (
        <p className="text-foreground font-bold text-sm mb-1">{data.label}</p>
      ) : null}
      
      <div className="space-y-1">
        {items ? (
          items.map((item, i) => (
            <p key={i} className="text-muted-foreground">
              {item.label}: <span className={item.color || "text-foreground"}>
                {item.value}{item.suffix || ""}
              </span>
            </p>
          ))
        ) : (
          <>
            {data.frequency !== undefined && (
              <p className="text-muted-foreground">
                Aparições: <span className="text-foreground">{data.frequency}</span>
              </p>
            )}
            {data.percentage !== undefined && (
              <p className="text-muted-foreground italic">
                Frequência: {data.percentage}%
              </p>
            )}
            {data.position !== undefined && (
              <p className="text-muted-foreground">
                Ranking: <span className="text-primary">#{data.position}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
});
