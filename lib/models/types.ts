export type ModelKind = "rnn" | "lstm" | "gru";

export type TokenFeatures = {
  token: string;
  importance: number;
  sentiment: number;
  dependency: number;
  position: number;
};

export type ModelStep = {
  token: string;
  step: number;
  hidden: number;
  memory: number;
  confidence: number;
  retention: number;
  error: number;
  latency: number;
  gates?: Record<string, number>;
  explanation: string;
};

export type ModelResult = {
  kind: ModelKind;
  label: string;
  color: string;
  prediction: string;
  predictions: Array<{
    word: string;
    confidence: number;
    reason: string;
  }>;
  confidence: number;
  memoryRetention: number;
  predictionQuality: number;
  latency: number;
  parameterComplexity: number;
  steps: ModelStep[];
  summary: string;
};

export type Scenario = {
  id: string;
  name: string;
  difficulty: "Short context" | "Long context" | "Negation trap" | "Sentiment shift";
  description: string;
  input: string;
  target: string;
  clueTokens: string[];
};
