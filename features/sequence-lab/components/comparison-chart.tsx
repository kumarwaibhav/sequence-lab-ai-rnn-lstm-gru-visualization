"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ModelResult } from "@/lib/models/types";

export function ComparisonCharts({ results }: { results: ModelResult[] }) {
  const finalMetrics = results.map((result) => ({
    model: result.label,
    memory: result.memoryRetention,
    confidence: result.confidence,
    quality: result.predictionQuality,
    latency: result.latency,
    complexity: result.parameterComplexity * 25,
    efficiency: Math.max(5, Math.round(result.predictionQuality - result.parameterComplexity * 7)),
    stability: Math.max(5, Math.round(100 - average(result.steps.map((step) => step.error * 100))))
  }));

  const steps = results[0]?.steps.map((step, index) => {
    const row: Record<string, number | string> = { token: step.token };
    results.forEach((result) => {
      row[`${result.label} memory`] = Math.round(result.steps[index].retention * 100);
      row[`${result.label} confidence`] = Math.round(result.steps[index].confidence * 100);
      row[`${result.label} error`] = Math.round(result.steps[index].error * 100);
    });
    return row;
  }) ?? [];

  const radarMetrics = [
    {
      metric: "Memory",
      RNN: finalMetrics.find((item) => item.model === "RNN")?.memory ?? 0,
      LSTM: finalMetrics.find((item) => item.model === "LSTM")?.memory ?? 0,
      GRU: finalMetrics.find((item) => item.model === "GRU")?.memory ?? 0
    },
    {
      metric: "Confidence",
      RNN: finalMetrics.find((item) => item.model === "RNN")?.confidence ?? 0,
      LSTM: finalMetrics.find((item) => item.model === "LSTM")?.confidence ?? 0,
      GRU: finalMetrics.find((item) => item.model === "GRU")?.confidence ?? 0
    },
    {
      metric: "Quality",
      RNN: finalMetrics.find((item) => item.model === "RNN")?.quality ?? 0,
      LSTM: finalMetrics.find((item) => item.model === "LSTM")?.quality ?? 0,
      GRU: finalMetrics.find((item) => item.model === "GRU")?.quality ?? 0
    },
    {
      metric: "Stability",
      RNN: finalMetrics.find((item) => item.model === "RNN")?.stability ?? 0,
      LSTM: finalMetrics.find((item) => item.model === "LSTM")?.stability ?? 0,
      GRU: finalMetrics.find((item) => item.model === "GRU")?.stability ?? 0
    },
    {
      metric: "Efficiency",
      RNN: finalMetrics.find((item) => item.model === "RNN")?.efficiency ?? 0,
      LSTM: finalMetrics.find((item) => item.model === "LSTM")?.efficiency ?? 0,
      GRU: finalMetrics.find((item) => item.model === "GRU")?.efficiency ?? 0
    }
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {finalMetrics.map((metric) => (
          <div key={metric.model} className="rounded-lg border bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{metric.model}</p>
            <p className="mt-2 text-3xl font-black">{metric.quality}%</p>
            <p className="text-sm text-muted-foreground">prediction quality</p>
            <div className="mt-3 grid gap-1 text-sm">
              <span>Memory: {metric.memory}%</span>
              <span>Confidence: {metric.confidence}%</span>
              <span>Latency: {metric.latency} ms</span>
            </div>
          </div>
        ))}
        <div className="rounded-lg border bg-card p-4 md:col-span-2 xl:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">How to read results</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            High memory means the model kept earlier clues alive. Low error means its internal confidence stayed stable.
            Latency and complexity show the cost of that capability.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 font-display text-2xl font-semibold">Memory Over Time</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={steps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis dataKey="token" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="RNN memory" stroke="#14b8a6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="LSTM memory" stroke="#f97316" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="GRU memory" stroke="#8b5cf6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 font-display text-2xl font-semibold">Confidence During the Run</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={steps}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="token" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="RNN confidence" stroke="#14b8a6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="LSTM confidence" stroke="#f97316" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="GRU confidence" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 font-display text-2xl font-semibold">Error / Context Drift</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={steps}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="token" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="RNN error" stroke="#14b8a6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="LSTM error" stroke="#f97316" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="GRU error" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 font-display text-2xl font-semibold">Capability Radar</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="RNN" dataKey="RNN" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.14} />
                <Radar name="LSTM" dataKey="LSTM" stroke="#f97316" fill="#f97316" fillOpacity={0.14} />
                <Radar name="GRU" dataKey="GRU" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.14} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 font-display text-2xl font-semibold">Cost vs Capability</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={finalMetrics}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quality" fill="#f97316" />
              <Bar dataKey="efficiency" fill="#14b8a6" />
              <Bar dataKey="complexity" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </div>
  );
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
