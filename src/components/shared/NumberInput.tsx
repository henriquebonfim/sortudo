export function NumberInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={2}
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, "");
        if (v === "" || (Number(v) >= 1 && Number(v) <= 60)) onChange(v);
      }}
      className={[
        "h-14 w-14 rounded-full border-2 bg-card text-center",
        "font-mono text-lg font-semibold text-foreground",
        "outline-none transition-all tabular-nums",
        "sm:h-16 sm:w-16 sm:text-xl",
        error
          ? "border-hot shadow-[0_0_12px_hsl(var(--hot)/0.3)]"
          : value
          ? "border-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
          : "border-border focus:border-primary",
      ].join(" ")}
    />
  );
}
