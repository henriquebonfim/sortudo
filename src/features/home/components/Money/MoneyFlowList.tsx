import { motion } from "framer-motion";

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

export function MoneyFlowList({ data }: { data: DistributionItem[] }) {
  return (
    <div className="glass-card p-6 h-full">
      <dl className="space-y-4 pr-2">
        {data.map((d) => (
          <div key={d.name}>
            <div className="flex justify-between text-xs mb-1.5 gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  aria-hidden="true"
                  style={{ backgroundColor: d.color }}
                />
                <dt className="text-muted-foreground truncate" title={d.name}>{d.name}</dt>
              </div>
              <dd className="font-mono font-bold text-foreground whitespace-nowrap">{d.value}%</dd>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden" aria-hidden="true">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${d.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
