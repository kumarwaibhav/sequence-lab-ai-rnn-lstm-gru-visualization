export const algorithms = [
  {
    id: "rnn",
    name: "RNN",
    fullName: "Recurrent Neural Network",
    intuition:
      "An RNN reads a sequence one token at a time and compresses everything it has seen into a hidden state.",
    equations: [
      "h_t = \\tanh(W_{xh}x_t + W_{hh}h_{t-1} + b_h)",
      "\\hat{y}_t = \\operatorname{softmax}(W_{hy}h_t + b_y)"
    ],
    strengths: ["Simple architecture", "Fast baseline", "Good for short dependencies"],
    weaknesses: ["Vanishing gradients", "Weak long-term memory", "Hidden state can be overwritten"],
    useCases: ["Small sequence classification", "Simple autocomplete demos", "Educational baselines"]
  },
  {
    id: "lstm",
    name: "LSTM",
    fullName: "Long Short-Term Memory",
    intuition:
      "An LSTM adds a cell state and gates so it can choose what to write, forget, and reveal.",
    equations: [
      "f_t = \\sigma(W_f[x_t, h_{t-1}] + b_f)",
      "i_t = \\sigma(W_i[x_t, h_{t-1}] + b_i)",
      "\\tilde{C}_t = \\tanh(W_C[x_t, h_{t-1}] + b_C)",
      "C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t",
      "o_t = \\sigma(W_o[x_t, h_{t-1}] + b_o)",
      "h_t = o_t \\odot \\tanh(C_t)"
    ],
    strengths: ["Excellent long-context memory", "Controls forgetting", "Handles delayed clues well"],
    weaknesses: ["More parameters", "Higher latency", "More complex to explain and tune"],
    useCases: ["Language modeling", "Speech recognition", "Long-range time-series forecasting"]
  },
  {
    id: "gru",
    name: "GRU",
    fullName: "Gated Recurrent Unit",
    intuition:
      "A GRU keeps the gating idea but merges memory and hidden state into a simpler structure.",
    equations: [
      "z_t = \\sigma(W_z[x_t, h_{t-1}])",
      "r_t = \\sigma(W_r[x_t, h_{t-1}])",
      "\\tilde{h}_t = \\tanh(W[x_t, r_t \\odot h_{t-1}])",
      "h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t"
    ],
    strengths: ["Fewer parameters than LSTM", "Strong practical performance", "Good speed-memory tradeoff"],
    weaknesses: ["Less explicit memory control than LSTM", "Can underperform on very long dependencies"],
    useCases: ["Chat features", "Mobile NLP", "Real-time sequence prediction"]
  }
];
