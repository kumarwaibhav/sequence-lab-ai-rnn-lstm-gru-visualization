import type { ModelResult } from "@/lib/models/types";
import { MetricRing } from "./metric-ring";
import { algorithms } from "@/lib/content/algorithms";
import { cn } from "@/lib/utils";

export function ModelCard({ result, activeStep, showPredictions }: {
  result: ModelResult;
  activeStep: number;
  showPredictions: boolean;
}) {
  const step = result.steps[Math.min(activeStep, result.steps.length - 1)];
  const content = algorithms.find((item) => item.id === result.kind);
  const retentionPercent = Math.round((step?.retention ?? 0) * 100);
  const contextStatus =
    retentionPercent < 48
      ? { label: "Context fading", className: "border-secondary bg-secondary/10 text-secondary" }
      : retentionPercent > 74
        ? { label: "Context preserved", className: "border-primary bg-primary/10 text-primary" }
        : { label: "Partial memory", className: "border-accent bg-accent/10 text-accent" };

  return (
    <article
      className={cn(
        "glass-panel rounded-lg border p-4 shadow-sm transition",
        retentionPercent < 48 && "shadow-[0_0_34px_hsl(var(--secondary)/0.28)]",
        retentionPercent > 74 && "shadow-[0_0_34px_hsl(var(--primary)/0.24)]"
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">{content?.fullName}</p>
          <h3 className="font-display text-3xl font-semibold">{result.label}</h3>
        </div>
        <div className="rounded-md border px-3 py-1 text-sm font-bold" style={{ color: result.color }}>
          {result.parameterComplexity}x params
        </div>
      </div>

      <p className="mb-4 text-sm leading-6 text-muted-foreground">{content?.intuition}</p>

      <div className="mb-4 rounded-md bg-muted/55 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Current token</p>
          <span className={cn("rounded-md border px-2 py-1 text-xs font-black", contextStatus.className)}>
            {contextStatus.label}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="rounded-md bg-card px-3 py-2 text-lg font-black">{step?.token ?? "Ready"}</span>
          <span className="text-right text-sm text-muted-foreground">Step {Math.min(activeStep + 1, result.steps.length)} / {result.steps.length}</span>
        </div>
        <p className="mt-3 text-sm leading-6">{step?.explanation}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricRing label="Memory retention" value={retentionPercent} color={result.color} />
        <MetricRing label="Confidence" value={Math.round((step?.confidence ?? 0) * 100)} color={result.color} />
      </div>

      {showPredictions ? (
        <div className="mt-4 rounded-md border bg-background/60 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Top predicted next words</p>
        <div className="mt-3 grid gap-2">
          {result.predictions.map((prediction, index) => (
            <div key={`${result.kind}-${prediction.word}`} className="flex items-center justify-between gap-3 rounded-md bg-card px-3 py-2">
              <div>
                <span className="mr-2 text-xs font-black text-muted-foreground">#{index + 1}</span>
                <span className="font-black">{prediction.word}</span>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{prediction.reason}</p>
              </div>
              <span className="shrink-0 rounded-md border px-2 py-1 text-sm font-bold">{prediction.confidence}%</span>
            </div>
          ))}
        </div>
      </div>
      ) : (
        <div className="mt-4 rounded-md border border-dashed bg-background/40 p-3 text-sm leading-6 text-muted-foreground">
          Prediction locked until the run reaches the end. Press Start or Step through the sequence to reveal how this model arrives at its answer.
        </div>
      )}

      {step?.gates ? (
        <div className="mt-4 grid gap-2">
          {Object.entries(step.gates).map(([gate, value]) => (
            <div key={gate}>
              <div className="mb-1 flex justify-between text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                <span>{gate} gate</span>
                <span>{Math.round(value * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full" style={{ width: `${value * 100}%`, backgroundColor: result.color }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
