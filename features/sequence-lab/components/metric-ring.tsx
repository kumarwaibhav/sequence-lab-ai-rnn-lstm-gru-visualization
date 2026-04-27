import { cn } from "@/lib/utils";

type MetricRingProps = {
  label: string;
  value: number;
  suffix?: string;
  color?: string;
  className?: string;
};

export function MetricRing({ label, value, suffix = "%", color = "hsl(var(--primary))", className }: MetricRingProps) {
  const angle = Math.max(0, Math.min(100, value)) * 3.6;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="grid h-16 w-16 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${angle}deg, hsl(var(--muted)) 0deg)`
        }}
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-card text-sm font-bold">
          {value}
          {suffix}
        </div>
      </div>
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}
