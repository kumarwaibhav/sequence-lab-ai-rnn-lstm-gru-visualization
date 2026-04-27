import type { Scenario } from "@/lib/models/types";

export const scenarios: Scenario[] = [
  {
    id: "meeting-followup",
    name: "Long Clue: Meeting Follow-up",
    difficulty: "Long context",
    description:
      "The model must remember the early scheduling clue before predicting the next word.",
    input:
      "Hi Maya, during Monday's kickoff the client specifically requested the compliance appendix, but after several unrelated updates could you please attach the final",
    target: "appendix",
    clueTokens: ["Monday's", "client", "compliance", "appendix"]
  },
  {
    id: "apology-recovery",
    name: "Sentiment Flip: Customer Reply",
    difficulty: "Sentiment shift",
    description:
      "The sentence starts negative but becomes constructive, testing whether the model updates context.",
    input:
      "I am sorry the invoice caused confusion, but we corrected the amount and attached the updated receipt for your",
    target: "records",
    clueTokens: ["confusion", "corrected", "attached", "receipt"]
  },
  {
    id: "negation-trap",
    name: "Hard Negation: Archive Trap",
    difficulty: "Negation trap",
    description:
      "A small word changes the meaning, making shallow memory unreliable.",
    input:
      "Please do not archive the onboarding notes because the new analyst still needs access to the shared",
    target: "active folder",
    clueTokens: ["not", "archive", "needs", "shared"]
  },
  {
    id: "short-confirmation",
    name: "Easy Baseline: Short Confirmation",
    difficulty: "Short context",
    description:
      "A compact sentence where even a vanilla RNN can usually preserve enough context.",
    input: "Thanks for the update, I will confirm the final date by",
    target: "Friday",
    clueTokens: ["confirm", "final", "date"]
  },
  {
    id: "deadline-extension",
    name: "Delayed Dependency: Extension",
    difficulty: "Long context",
    description:
      "The model must connect the early deadline pressure with a polite request at the end.",
    input:
      "Hello Priya, because the compliance review took longer than expected, could we extend the submission deadline until next",
    target: "week",
    clueTokens: ["compliance", "review", "extend", "deadline"]
  },
  {
    id: "invoice-reminder",
    name: "Business Context: Invoice",
    difficulty: "Short context",
    description:
      "A practical business email where the next word follows from invoice and payment context.",
    input:
      "Dear team, this is a gentle reminder that the pending invoice should be processed before the end of this",
    target: "month",
    clueTokens: ["reminder", "pending", "invoice", "processed"]
  },
  {
    id: "policy-exception",
    name: "Policy Rule: Approval Hold",
    difficulty: "Negation trap",
    description:
      "The wording contains a constraint, so the model must not ignore the negation.",
    input:
      "Please do not approve the travel request until the manager confirms the exception in writing by",
    target: "email approval",
    clueTokens: ["not", "approve", "confirms", "writing"]
  },
  {
    id: "interview-scheduling",
    name: "Schedule Memory: Interview",
    difficulty: "Long context",
    description:
      "The model follows scheduling clues across a professional email draft.",
    input:
      "Hi Alex, the candidate is available after the technical round on Wednesday, so let us schedule the final interview for",
    target: "Thursday",
    clueTokens: ["candidate", "available", "Wednesday", "schedule"]
  },
  {
    id: "support-resolution",
    name: "Recovery Signal: Support Update",
    difficulty: "Sentiment shift",
    description:
      "The email begins with a problem and ends with a positive resolution signal.",
    input:
      "We identified the login issue and restored account access, so the customer should now be able to continue without",
    target: "interruption",
    clueTokens: ["identified", "restored", "access", "continue"]
  },
  {
    id: "legal-redline",
    name: "Legal Context: Redline Memory",
    difficulty: "Long context",
    description:
      "Early legal wording controls the final phrase, making weak memory choose generic completions.",
    input:
      "Counsel approved the liability cap but asked that the indemnity clause remain unchanged after the pricing and delivery edits, so please keep the original",
    target: "indemnity clause",
    clueTokens: ["liability", "indemnity", "unchanged", "original"]
  },
  {
    id: "medical-referral",
    name: "Clinical Referral Email",
    difficulty: "Long context",
    description:
      "A domain-like email where the important referral clue appears early and must survive later details.",
    input:
      "The patient completed the initial assessment for recurring chest discomfort, and after insurance confirmation please schedule the specialist",
    target: "cardiology referral",
    clueTokens: ["patient", "chest", "specialist", "referral"]
  },
  {
    id: "security-warning",
    name: "Security Warning: Do Not Share",
    difficulty: "Negation trap",
    description:
      "The model must preserve a safety-critical instruction instead of following nearby sharing words.",
    input:
      "Do not share the temporary access code in the team thread, even though the onboarding checklist asks everyone to post the",
    target: "secure link",
    clueTokens: ["not", "share", "temporary", "secure"]
  }
];
