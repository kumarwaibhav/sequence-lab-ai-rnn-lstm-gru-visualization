"use client";

import "katex/dist/katex.min.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  ChevronDown,
  Moon,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  Sun,
  TerminalSquare
} from "lucide-react";
import { BlockMath } from "react-katex";
import { Button } from "@/components/ui/button";
import { algorithms } from "@/lib/content/algorithms";
import { sanitizeText, validateEmailFragment, validateTargetPhrase } from "@/lib/security/input-validation";
import { scenarios } from "@/lib/simulation/presets";
import { runSimulation } from "@/lib/simulation/runner";
import { cn } from "@/lib/utils";
import { ArchitectureDiagram } from "./architecture-diagram";
import { ComparisonCharts } from "./comparison-chart";
import { ModelCard } from "./model-card";

export function SequenceLabApp() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [customInput, setCustomInput] = useState("");
  const [targetOverride, setTargetOverride] = useState(scenarios[0].target);
  const [useCustom, setUseCustom] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [speed, setSpeed] = useState(900);
  const labRef = useRef<HTMLElement | null>(null);

  const selectedScenario = scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
  const suggestedTarget = useMemo(() => inferTargetWord(customInput), [customInput]);
  const customInputValidation = useMemo(() => validateEmailFragment(customInput), [customInput]);
  const targetValidation = useMemo(() => validateTargetPhrase(targetOverride), [targetOverride]);
  const canRunSimulation = (!useCustom || customInputValidation.ok) && targetValidation.ok && simulationSafeLength(customInput, useCustom);
  const scenario = useMemo(
    () =>
      useCustom && customInput.trim()
        ? {
            ...selectedScenario,
            id: "custom",
            name: "Custom Email Draft",
            difficulty: "Long context" as const,
            description: "Your own email text is processed by all three models using the same simulation rules.",
            input: customInputValidation.sanitized,
            target: targetValidation.sanitized || suggestedTarget,
            clueTokens: customInputValidation.sanitized
              .split(/\s+/)
              .filter((word) => word.length > 6)
              .slice(-4)
              .map((word) => word.toLowerCase())
          }
        : { ...selectedScenario, target: targetValidation.sanitized || selectedScenario.target },
    [customInputValidation.sanitized, selectedScenario, suggestedTarget, targetValidation.sanitized, useCustom]
  );

  const simulation = useMemo(() => runSimulation(scenario), [scenario]);
  const maxStep = Math.max(0, simulation.tokens.length - 1);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step >= maxStep) {
          setIsRunning(false);
          return step;
        }
        return step + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [isRunning, maxStep, speed]);

  function resetRun() {
    setIsRunning(false);
    setHasStarted(false);
    setActiveStep(0);
  }

  function openArena() {
    window.setTimeout(() => {
      labRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function choosePreset(id: string, target: string) {
    setUseCustom(false);
    setScenarioId(id);
    setTargetOverride(target);
    resetRun();
    openArena();
  }

  function startRun() {
    if (!canRunSimulation) return;
    setHasStarted(true);
    setIsRunning(true);
    openArena();
  }

  function stepRun() {
    if (!canRunSimulation) return;
    setHasStarted(true);
    setActiveStep((step) => Math.min(maxStep, step + 1));
    openArena();
  }

  const revealPredictions = hasStarted && activeStep >= maxStep;

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#hero" className="flex items-center gap-3 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <BrainCircuit size={19} />
            </span>
            <span>SequenceLab AI</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#scenario">Scenario</a>
            <a href="#lab">Lab</a>
            <a href="#compare">Compare</a>
            <a href="#theory">Theory</a>
          </nav>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </header>

      <section id="hero" className="lab-grid relative px-4 pb-16 pt-28 sm:px-6 lg:pb-24 lg:pt-36">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-md border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              Email autocomplete memory lab
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
              Watch RNN, LSTM, and GRU compete to remember context.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              SequenceLab AI turns recurrent neural networks into a guided, gamified lab: one email draft, three models,
              live memory curves, rigorous equations, and plain-language explanations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href="#scenario">
                  Start the lab <ChevronDown size={18} />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#theory">
                  Read the theory <BookOpen size={18} />
                </a>
              </Button>
            </div>
          </div>

          <div className="glass-panel rounded-lg border p-5 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Live sequence trace</span>
              <Sparkles className="text-secondary" size={20} />
            </div>
            <div className="grid gap-2">
              {simulation.tokens.slice(0, 13).map((token, index) => (
                <div key={`${token}-${index}`} className="flex items-center gap-3">
                  <span className="w-8 text-right text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <div className={cn("h-8 rounded-md border px-3 py-1 font-semibold", index <= activeStep ? "bg-primary/15" : "bg-card")}>
                    {token}
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="scenario" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Step 1"
            title="Choose an email prediction challenge"
            body="The app does not auto-run. Pick a preset or write your own email fragment, then decide when the models start processing."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {scenarios.map((item) => (
              <button
                key={item.id}
                onClick={() => choosePreset(item.id, item.target)}
                className={cn(
                  "rounded-lg border bg-card p-4 text-left transition hover:-translate-y-1 hover:shadow-glow",
                  !useCustom && item.id === scenarioId && "border-primary bg-primary/10"
                )}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{item.difficulty}</p>
                <h3 className="mt-2 text-xl font-bold">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border bg-card p-4">
            <label className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Custom email fragment</label>
            <textarea
              value={customInput}
              onChange={(event) => {
                const value = event.target.value.slice(0, 420);
                setCustomInput(value);
                setUseCustom(Boolean(value.trim()));
                if (!useCustom || !targetOverride.trim()) {
                  setTargetOverride(inferTargetWord(value));
                }
                resetRun();
              }}
              placeholder="Example: Hi Jordan, I reviewed the contract and noticed the payment clause needs..."
              className="mt-3 min-h-28 w-full resize-y rounded-md border bg-background p-3 outline-none ring-ring transition focus:ring-2"
            />
            <ValidationMessages title="Email fragment warning" warnings={customInputValidation.warnings} />
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
              <label className="grid gap-2 text-sm font-semibold">
                Target word or phrase
                <input
                  value={targetOverride}
                  onChange={(event) => {
                    setTargetOverride(event.target.value.slice(0, 80));
                    setUseCustom(Boolean(customInput.trim()));
                    resetRun();
                  }}
                  placeholder={suggestedTarget || "Type expected completion phrase"}
                  className="rounded-md border bg-background px-3 py-2 outline-none ring-ring transition focus:ring-2"
                />
                <ValidationMessages title="Target warning" warnings={targetValidation.warnings} />
              </label>
              <div className="rounded-md border bg-background/60 p-3 text-sm leading-6 text-muted-foreground">
                Auto-suggested target: <span className="font-black text-foreground">{suggestedTarget || "Add a longer email fragment"}</span>
                <br />
                Works for a single word or phrase. For presets, edit this field to test a different expected completion.
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setUseCustom(Boolean(customInput.trim()));
                  if (!targetOverride.trim()) {
                    setTargetOverride(suggestedTarget || selectedScenario.target);
                  }
                  if (customInput.trim() && !customInputValidation.ok) return;
                  resetRun();
                  openArena();
                }}
                disabled={Boolean(customInput.trim()) && !customInputValidation.ok}
              >
                Lock draft and open arena
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTargetOverride(suggestedTarget || selectedScenario.target);
                  resetRun();
                }}
              >
                Use suggested target
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="lab" ref={labRef} className="bg-muted/45 px-4 py-16 scroll-mt-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Step 2"
            title="Run the three-model arena"
            body="All metrics come from the simplified TypeScript simulation. The goal is explainable behavior: memory, confidence, prediction quality, latency, and parameter complexity all arise from the same run."
          />

          <div className="mb-5 grid gap-4 rounded-lg border bg-card p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{scenario.name}</p>
              <p className="mt-2 text-lg font-semibold">{scenario.input}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Target word or phrase: <span className="font-bold text-foreground">{scenario.target}</span>
              </p>
              <label className="mt-4 grid max-w-xl gap-2 text-sm font-semibold">
                Edit target for this run
                <input
                  value={targetOverride}
                  onChange={(event) => {
                    setTargetOverride(event.target.value.slice(0, 80));
                    resetRun();
                  }}
                  placeholder="Expected next word or phrase"
                  className="rounded-md border bg-background px-3 py-2 outline-none ring-ring transition focus:ring-2"
                />
                <ValidationMessages title="Target warning" warnings={targetValidation.warnings} />
              </label>
              {revealPredictions ? (
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {simulation.results.map((result) => (
                    <div key={`${result.kind}-headline`} className="rounded-md border bg-background/60 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{result.label} predicts</p>
                      <p className="mt-1 text-2xl font-black" style={{ color: result.color }}>
                        {result.prediction}
                      </p>
                      <p className="text-sm text-muted-foreground">{result.predictions[0]?.confidence ?? result.confidence}% prediction confidence</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-md border border-dashed bg-background/55 p-3 text-sm text-muted-foreground">
                  Predictions are hidden until the run reaches the final token. This keeps the lab honest: first watch the memory behavior, then reveal each model's completion.
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={startRun} disabled={isRunning || simulation.tokens.length === 0 || !canRunSimulation}>
                <Play size={17} /> Start
              </Button>
              <Button variant="outline" onClick={() => setIsRunning(false)}>
                <Pause size={17} /> Pause
              </Button>
              <Button variant="outline" onClick={stepRun} disabled={!canRunSimulation}>
                <SkipForward size={17} /> Step
              </Button>
              <Button variant="outline" onClick={resetRun}>
                <RotateCcw size={17} /> Reset
              </Button>
            </div>
          </div>

          <div className="mb-6 grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-[1fr_1.4fr]">
            <label className="grid gap-2 text-sm font-semibold">
              Simulation speed
              <input
                type="range"
                min="300"
                max="1600"
                step="100"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              />
            </label>
            <p className="text-sm leading-6 text-muted-foreground">
              The Step button advances one word at a time for classroom explanation. Watch the glow labels: context fading means the model is losing the earlier clue.
            </p>
          </div>

          {!canRunSimulation ? (
            <div className="mb-6 rounded-lg border border-secondary bg-secondary/10 p-4 text-sm font-semibold text-secondary">
              Security guardrail active: fix the validation warnings before running the simulation.
            </div>
          ) : null}

          <div className="grid gap-4 xl:grid-cols-3">
            {simulation.results.map((result) => (
              <ModelCard
                key={result.kind}
                result={result}
                activeStep={activeStep}
                showPredictions={revealPredictions}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="bg-muted/45 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Step 3"
            title="Compare the outcome"
            body="The charts translate the run into visible evidence: where memory fades, where gates help, and what each model trades for speed, stability, quality, latency, and complexity."
          />
          {revealPredictions ? (
            <ComparisonCharts results={simulation.results} />
          ) : (
            <div className="rounded-lg border border-dashed bg-card p-6 text-muted-foreground">
              Complete the arena run to unlock memory, confidence, error, capability, latency, and complexity charts.
            </div>
          )}

          {revealPredictions ? <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {simulation.results.map((result) => (
              <div key={result.kind} className="rounded-lg border bg-card p-4">
                <div className="mb-3 flex items-center gap-2">
                  <TerminalSquare size={18} style={{ color: result.color }} />
                  <h3 className="text-xl font-bold">{result.label} takeaway</h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{result.summary}</p>
                <p className="mt-3 text-sm">
                  Final prediction: <span className="font-black">{result.prediction}</span> with {result.predictions[0]?.confidence ?? result.confidence}% prediction confidence.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.predictions.map((prediction, index) => (
                    <span key={`${result.kind}-summary-${prediction.word}`} className="rounded-md border px-2 py-1 text-xs font-bold">
                      #{index + 1} {prediction.word} - {prediction.confidence}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div> : null}
        </div>
      </section>

      <section id="theory" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Step 4"
            title="Theory, math, architecture, strengths, and weaknesses"
            body="Each model is explained twice: first in classroom language, then with formal equations suitable for technical study."
          />

          <div className="grid gap-5">
            {algorithms.map((algo) => (
              <article key={algo.id} className="rounded-lg border bg-card p-5">
                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">{algo.fullName}</p>
                    <h3 className="font-display text-4xl font-semibold">{algo.name}</h3>
                    <p className="mt-3 text-base leading-7 text-muted-foreground">{algo.intuition}</p>
                    <div className="mt-5">
                      <ArchitectureDiagram kind={algo.id as "rnn" | "lstm" | "gru"} />
                    </div>
                  </div>
                  <div className="rounded-md border bg-background/70 p-4">
                    <div className="mb-4 rounded-md bg-muted/55 p-3 text-sm leading-6 text-muted-foreground">
                      <span className="font-bold text-foreground">How to read this math:</span>{" "}
                      {algo.id === "rnn"
                        ? "x_t is the current word, h_t is the memory after reading it, and the softmax output becomes the next-word guess."
                        : algo.id === "lstm"
                          ? "The gates are small decision makers. They choose what enters memory, what gets forgotten, and what is exposed for prediction."
                          : "The update gate decides what to keep, the reset gate decides what to ignore, and the hidden state becomes the prediction memory."}
                    </div>
                    {algo.equations.map((equation) => (
                      <div key={equation} className="overflow-x-auto">
                        <BlockMath math={equation} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <InfoList title="Strengths" items={algo.strengths} />
                  <InfoList title="Weaknesses" items={algo.weaknesses} />
                  <InfoList title="Use cases" items={algo.useCases} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="compare-legacy" className="hidden">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Step 4"
            title="Compare the outcome"
            body="The charts translate the run into visible evidence: where memory fades, where gates help, and what each model trades for speed or stability."
          />
          {revealPredictions ? (
            <ComparisonCharts results={simulation.results} />
          ) : (
            <div className="rounded-lg border border-dashed bg-card p-6 text-muted-foreground">
              Complete the arena run to unlock the final charts and predicted completions.
            </div>
          )}

          {revealPredictions ? <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {simulation.results.map((result) => (
              <div key={result.kind} className="rounded-lg border bg-card p-4">
                <div className="mb-3 flex items-center gap-2">
                  <TerminalSquare size={18} style={{ color: result.color }} />
                  <h3 className="text-xl font-bold">{result.label} takeaway</h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{result.summary}</p>
                <p className="mt-3 text-sm">
                  Final prediction: <span className="font-black">{result.prediction}</span> with {result.predictions[0]?.confidence ?? result.confidence}% prediction confidence.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.predictions.map((prediction, index) => (
                    <span key={`${result.kind}-summary-${prediction.word}`} className="rounded-md border px-2 py-1 text-xs font-bold">
                      #{index + 1} {prediction.word} · {prediction.confidence}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div> : null}
        </div>
      </section>
    </main>
  );
}

function inferTargetWord(input: string) {
  const lower = sanitizeText(input).toLowerCase();
  const rules = [
    { includes: ["deadline", "extend"], target: "week" },
    { includes: ["invoice", "end of this"], target: "month" },
    { includes: ["meeting", "tomorrow"], target: "today" },
    { includes: ["receipt", "updated"], target: "records" },
    { includes: ["shared", "access"], target: "folder" },
    { includes: ["writing"], target: "email" },
    { includes: ["interview"], target: "Thursday" },
    { includes: ["without"], target: "interruption" }
  ];
  const match = rules.find((rule) => rule.includes.every((term) => lower.includes(term)));

  if (match) {
    return match.target;
  }

  const words = input
    .replace(/[^\w\s'-]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const last = words.at(-1)?.toLowerCase();

  if (last === "by") return "Friday";
  if (last === "for") return "review";
  if (last === "your") return "records";
  if (last === "next") return "week";
  if (last === "without") return "interruption";

  return words.length > 4 ? "response" : "";
}

function simulationSafeLength(input: string, useCustom: boolean) {
  if (!useCustom) return true;
  const words = sanitizeText(input).split(/\s+/).filter(Boolean);
  return words.length <= 70;
}

function ValidationMessages({ title, warnings }: { title: string; warnings: string[] }) {
  if (warnings.length === 0) return null;

  return (
    <div className="mt-2 rounded-md border border-secondary bg-secondary/10 p-3 text-sm leading-6 text-secondary">
      <p className="font-black">{title}</p>
      <ul className="mt-1 grid gap-1">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{body}</p>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border bg-background/60 p-4">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">{title}</h4>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
