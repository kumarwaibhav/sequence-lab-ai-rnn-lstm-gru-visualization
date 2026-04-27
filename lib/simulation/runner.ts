import type { ModelKind, ModelResult, ModelStep, Scenario, TokenFeatures } from "@/lib/models/types";

const profiles: Record<ModelKind, {
  label: string;
  color: string;
  decay: number;
  gateStrength: number;
  baseLatency: number;
  complexity: number;
}> = {
  rnn: {
    label: "RNN",
    color: "#14b8a6",
    decay: 0.72,
    gateStrength: 0,
    baseLatency: 7,
    complexity: 1
  },
  lstm: {
    label: "LSTM",
    color: "#f97316",
    decay: 0.93,
    gateStrength: 0.86,
    baseLatency: 15,
    complexity: 4
  },
  gru: {
    label: "GRU",
    color: "#8b5cf6",
    decay: 0.88,
    gateStrength: 0.72,
    baseLatency: 11,
    complexity: 3
  }
};

const importantTerms = new Set([
  "not",
  "no",
  "tomorrow",
  "tonight",
  "budget",
  "receipt",
  "records",
  "folder",
  "confirm",
  "date",
  "client",
  "meeting",
  "attached",
  "updated",
  "shared",
  "access"
]);

const fallbackVocabulary = [
  "today",
  "tomorrow",
  "week",
  "Friday",
  "email",
  "records",
  "folder",
  "month",
  "approval",
  "review",
  "interruption",
  "confirmation"
];

const phraseDistractors = [
  "today",
  "final budget",
  "shared folder",
  "email approval",
  "secure link",
  "project update",
  "next week",
  "review notes",
  "customer records",
  "meeting summary"
];

export function tokenize(input: string) {
  return input
    .trim()
    .replace(/[^\w\s'-]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function featureFor(token: string, index: number, total: number, scenario: Scenario): TokenFeatures {
  const normalized = token.toLowerCase();
  const isClue = scenario.clueTokens.includes(normalized);
  const importance =
    (isClue ? 0.72 : 0.18) +
    (importantTerms.has(normalized) ? 0.22 : 0) +
    (token.length > 7 ? 0.08 : 0);
  const negation = normalized === "not" || normalized === "no" ? -0.7 : 0;
  const positive = ["thanks", "corrected", "updated", "confirm", "please"].includes(normalized) ? 0.34 : 0;
  const dependency = scenario.clueTokens.includes(normalized) ? 1 : normalized.length > 6 ? 0.45 : 0.2;

  return {
    token,
    importance: clamp(importance),
    sentiment: clamp(0.5 + positive + negation),
    dependency,
    position: total <= 1 ? 1 : index / (total - 1)
  };
}

function explainStep(kind: ModelKind, feature: TokenFeatures, retention: number) {
  if (kind === "rnn") {
    return retention < 0.45
      ? "The vanilla RNN updates its hidden state, but older clues fade as newer words overwrite the memory."
      : "The RNN carries the latest context forward, which works best when the useful clue is nearby.";
  }

  if (kind === "lstm") {
    return feature.importance > 0.6
      ? "The LSTM gates treat this word as important, keeping it in the cell memory for later prediction."
      : "The LSTM balances new input with preserved cell memory, reducing long-context drift.";
  }

  return feature.importance > 0.6
    ? "The GRU update gate keeps this clue active while using fewer moving parts than the LSTM."
    : "The GRU blends previous memory and new context through a compact gated update.";
}

function runModel(kind: ModelKind, scenario: Scenario): ModelResult {
  const tokens = tokenize(scenario.input);
  const profile = profiles[kind];
  let hidden = 0.24;
  let memory = 0.28;
  let retainedClue = 0;
  const steps: ModelStep[] = [];

  tokens.forEach((token, index) => {
    const feature = featureFor(token, index, tokens.length, scenario);
    const signal = feature.importance * 0.58 + feature.sentiment * 0.22 + feature.dependency * 0.2;

    if (kind === "rnn") {
      hidden = Math.tanh(profile.decay * hidden + signal * 0.92);
      memory = clamp(memory * profile.decay + signal * 0.38);
    } else if (kind === "lstm") {
      const inputGate = sigmoid(signal * 2.4 - 0.45);
      const forgetGate = sigmoid(1.15 + feature.importance * 1.4);
      const outputGate = sigmoid(signal * 1.8 + memory * 0.8);
      memory = clamp(memory * forgetGate + inputGate * signal * 0.72);
      hidden = Math.tanh(memory) * outputGate;
      steps.push({
        token,
        step: index + 1,
        hidden: clamp(Math.abs(hidden)),
        memory,
        confidence: 0,
        retention: 0,
        error: 0,
        latency: 0,
        gates: {
          input: inputGate,
          forget: forgetGate,
          output: outputGate
        },
        explanation: ""
      });
      return;
    } else {
      const updateGate = sigmoid(signal * 2.1 + feature.importance * 0.9);
      const resetGate = sigmoid(0.65 + feature.dependency * 0.7);
      const candidate = Math.tanh(resetGate * hidden + signal);
      hidden = clamp((1 - updateGate) * hidden + updateGate * Math.abs(candidate));
      memory = clamp(memory * profile.decay + hidden * 0.35 + feature.importance * 0.18);
      steps.push({
        token,
        step: index + 1,
        hidden,
        memory,
        confidence: 0,
        retention: 0,
        error: 0,
        latency: 0,
        gates: {
          update: updateGate,
          reset: resetGate
        },
        explanation: ""
      });
      return;
    }

    steps.push({
      token,
      step: index + 1,
      hidden: clamp(Math.abs(hidden)),
      memory,
      confidence: 0,
      retention: 0,
      error: 0,
      latency: 0,
      explanation: ""
    });
  });

  const normalizedSteps = steps.map((step, index) => {
    const isClue = scenario.clueTokens.includes(step.token.toLowerCase());
    retainedClue = clamp(retainedClue * profile.decay + (isClue ? 0.38 + profile.gateStrength * 0.22 : 0));
    const recency = (index + 1) / Math.max(1, steps.length);
    const retention = clamp(step.memory * 0.48 + retainedClue * 0.42 + recency * 0.1);
    const confidence = clamp(0.32 + retention * 0.52 + step.hidden * 0.2 - profile.complexity * 0.012);
    const error = clamp(1 - confidence + (scenario.difficulty === "Long context" && kind === "rnn" ? 0.16 : 0));

    return {
      ...step,
      confidence,
      retention,
      error,
      latency: profile.baseLatency + (index + 1) * profile.complexity * 0.32,
      explanation: explainStep(kind, featureFor(step.token, index, steps.length, scenario), retention)
    };
  });

  const final = normalizedSteps.at(-1);
  const memoryRetention = Math.round((final?.retention ?? 0) * 100);
  const confidence = Math.round((final?.confidence ?? 0) * 100);
  const predictionQuality = Math.round(clamp((final?.confidence ?? 0) * 0.72 + (final?.retention ?? 0) * 0.28) * 100);
  const latency = Math.round(normalizedSteps.reduce((sum, step) => sum + step.latency, 0));
  const predictions = rankPredictions(kind, scenario, confidence, memoryRetention);

  return {
    kind,
    label: profile.label,
    color: profile.color,
    prediction: predictions[0]?.word ?? scenario.target,
    predictions,
    confidence,
    memoryRetention,
    predictionQuality,
    latency,
    parameterComplexity: profile.complexity,
    steps: normalizedSteps,
    summary: getSummary(kind, scenario.difficulty, memoryRetention)
  };
}

function rankPredictions(kind: ModelKind, scenario: Scenario, confidence: number, retention: number) {
  const target = cleanPhrase(scenario.target) || "response";
  const distractors = buildDistractors(scenario, target);
  const difficult = scenario.difficulty === "Long context" || scenario.difficulty === "Negation trap";
  const missPenalty = kind === "rnn" && difficult ? 34 : kind === "gru" && scenario.difficulty === "Negation trap" ? 10 : 0;
  const targetConfidence = Math.max(18, Math.min(96, Math.round(confidence - missPenalty + retention * 0.12)));
  const nearContextConfidence = Math.max(
    10,
    Math.round(targetConfidence * (kind === "rnn" && difficult ? 1.28 : kind === "gru" ? 0.72 : 0.52))
  );
  const fallbackConfidence = Math.max(7, Math.round(targetConfidence * (kind === "lstm" ? 0.34 : 0.55)));

  const ranked = [
    {
      word: target,
      confidence: targetConfidence,
      reason:
        kind === "rnn"
          ? "Selected from the latest compressed hidden state."
          : kind === "lstm"
            ? "Selected because the gated memory preserved the strongest contextual clue."
            : "Selected from a compact gated blend of old context and recent words."
    },
    {
      word: distractors[0],
      confidence: nearContextConfidence,
      reason:
        kind === "rnn" && difficult
          ? "A recency-biased alternative: the vanilla RNN is being pulled toward nearby words instead of the older clue."
          : "Plausible alternative from nearby email wording."
    },
    {
      word: distractors[1],
      confidence: fallbackConfidence,
      reason: "Lower-ranked fallback from the scenario vocabulary."
    }
  ];

  return ranked
    .filter((item, index, list) => list.findIndex((candidate) => candidate.word.toLowerCase() === item.word.toLowerCase()) === index)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

function buildDistractors(scenario: Scenario, target: string) {
  const words = [...scenario.clueTokens, ...tokenize(scenario.input), ...phraseDistractors, ...fallbackVocabulary]
    .map(cleanPhrase)
    .filter((word) => word && word.toLowerCase() !== target.toLowerCase() && word.length > 2);

  return Array.from(new Set(words)).slice(-8).reverse().concat(fallbackVocabulary).slice(0, 2);
}

function cleanWord(word: string) {
  return word.replace(/[^\w'-]/g, "").trim();
}

function cleanPhrase(phrase: string) {
  return phrase.replace(/[^\w\s'-]/g, "").replace(/\s+/g, " ").trim();
}

function getSummary(kind: ModelKind, difficulty: Scenario["difficulty"], retention: number) {
  if (kind === "rnn") {
    return difficulty === "Long context" || difficulty === "Negation trap"
      ? "Simple and fast, but its memory compresses everything into one hidden state, so early clues are easier to lose."
      : "Efficient baseline that works well when the useful context is short and close to the prediction.";
  }

  if (kind === "lstm") {
    return retention > 75
      ? "Best long-context memory in this run because its cell state and gates protect important clues."
      : "Strong memory control, though it pays for that stability with more parameters and latency.";
  }

  return "A compact gated model that balances memory and speed, often landing between RNN simplicity and LSTM control.";
}

export function runSimulation(scenario: Scenario) {
  return {
    scenario,
    tokens: tokenize(scenario.input),
    results: (["rnn", "lstm", "gru"] as ModelKind[]).map((kind) => runModel(kind, scenario))
  };
}
