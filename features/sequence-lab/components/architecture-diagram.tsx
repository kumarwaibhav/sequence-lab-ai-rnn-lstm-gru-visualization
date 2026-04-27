import type { ModelKind } from "@/lib/models/types";
import { cn } from "@/lib/utils";

const nodes: Record<ModelKind, string[]> = {
  rnn: ["Input x_t", "Hidden h_t", "Output y_t"],
  lstm: ["Input gate", "Forget gate", "Cell state", "Output gate"],
  gru: ["Update gate", "Reset gate", "Candidate state", "Hidden h_t"]
};

const explanations: Record<ModelKind, Array<{ term: string; meaning: string }>> = {
  rnn: [
    { term: "Input x_t", meaning: "The current word represented as numbers." },
    { term: "Hidden h_t", meaning: "A compressed memory of what has been read so far." },
    { term: "Output y_t", meaning: "The model's next-word probability guess." }
  ],
  lstm: [
    { term: "Input gate", meaning: "Decides how much new information should enter memory." },
    { term: "Forget gate", meaning: "Decides what old information should be weakened or removed." },
    { term: "Cell state", meaning: "The long-term memory highway that carries important clues forward." },
    { term: "Output gate", meaning: "Decides which part of memory should influence the prediction." }
  ],
  gru: [
    { term: "Update gate", meaning: "Controls how much previous memory should be kept." },
    { term: "Reset gate", meaning: "Controls how much past context should be ignored for the current update." },
    { term: "Candidate state", meaning: "A proposed new memory based on the current word." },
    { term: "Hidden h_t", meaning: "The final compact memory used for prediction." }
  ]
};

export function ArchitectureDiagram({ kind }: { kind: ModelKind }) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {nodes[kind].map((node, index) => (
          <div key={node} className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em]",
                index === 0 && "bg-primary/10",
                index === nodes[kind].length - 1 && "bg-secondary/15"
              )}
            >
              {node}
            </div>
            {index < nodes[kind].length - 1 ? (
              <div className="flex items-center">
                <div className="h-px w-7 bg-border" />
                <div className="h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-border" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {kind === "rnn"
          ? "A single recurrent hidden state carries compressed context forward."
          : kind === "lstm"
            ? "Separate gates protect the cell state so important email clues survive longer."
            : "Compact gates decide how much old context to keep and how much new evidence to write."}
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {explanations[kind].map((item) => (
          <div key={item.term} className="rounded-md border bg-background/55 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-foreground">{item.term}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
