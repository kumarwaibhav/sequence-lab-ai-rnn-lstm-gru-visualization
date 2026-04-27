const sqlOrCommandPatterns = [
  /\b(select|insert|update|delete|drop|alter|truncate|union|exec|execute|xp_|sleep|benchmark)\b/i,
  /(--|\/\*|\*\/|;|`|\||&&|\$\(|\${)/,
  /\b(or|and)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i
];

const scriptPatterns = [
  /<\s*script/i,
  /<\/\s*script/i,
  /javascript:/i,
  /\bon\w+\s*=/i,
  /<\s*(iframe|object|embed|link|meta|style|svg|math)\b/i
];

const allowedTextPattern = /^[A-Za-z0-9\s.,!?'"()@:/&+-]+$/;
const alphabeticWordPattern = /[A-Za-z]{2,}/g;

export type ValidationResult = {
  ok: boolean;
  sanitized: string;
  warnings: string[];
};

export function sanitizeText(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateEmailFragment(value: string): ValidationResult {
  const sanitized = sanitizeText(value);
  const warnings: string[] = [];

  if (!sanitized) {
    return { ok: true, sanitized, warnings };
  }

  if (sanitized.length > 420) {
    warnings.push("Keep the email fragment under 420 characters for a controlled simulation.");
  }

  if (!allowedTextPattern.test(sanitized)) {
    warnings.push("Only letters, numbers, spaces, and basic email punctuation are allowed.");
  }

  if (scriptPatterns.some((pattern) => pattern.test(sanitized))) {
    warnings.push("HTML, scripts, event handlers, and embedded markup are blocked.");
  }

  if (sqlOrCommandPatterns.some((pattern) => pattern.test(sanitized))) {
    warnings.push("SQL-like, command-like, or shell-like input is blocked.");
  }

  const words = sanitized.match(alphabeticWordPattern) ?? [];
  if (words.length > 0 && words.length < 5) {
    warnings.push("Use at least five readable words so the sequence models have context to process.");
  }

  const symbolCount = (sanitized.match(/[^A-Za-z0-9\s]/g) ?? []).length;
  if (symbolCount / Math.max(1, sanitized.length) > 0.18) {
    warnings.push("Too many symbols detected. Use a natural email sentence instead.");
  }

  if (/(.)\1{5,}/i.test(sanitized)) {
    warnings.push("Repeated character patterns are blocked as low-quality or automated input.");
  }

  if (/\b\w{32,}\b/.test(sanitized)) {
    warnings.push("Extremely long unbroken tokens are blocked.");
  }

  return {
    ok: warnings.length === 0,
    sanitized,
    warnings
  };
}

export function validateTargetPhrase(value: string): ValidationResult {
  const sanitized = sanitizeText(value);
  const warnings: string[] = [];

  if (!sanitized) {
    warnings.push("Enter a target word or phrase before running the simulation.");
  }

  if (sanitized.length > 80) {
    warnings.push("Keep the target phrase under 80 characters.");
  }

  if (!/^[A-Za-z0-9\s'-]+$/.test(sanitized)) {
    warnings.push("Target phrases may only contain letters, numbers, spaces, apostrophes, and hyphens.");
  }

  if (scriptPatterns.some((pattern) => pattern.test(sanitized)) || sqlOrCommandPatterns.some((pattern) => pattern.test(sanitized))) {
    warnings.push("Unsafe target content is blocked.");
  }

  const words = sanitized.match(alphabeticWordPattern) ?? [];
  if (words.length > 6) {
    warnings.push("Use six words or fewer for the target completion.");
  }

  if (/(.)\1{4,}/i.test(sanitized)) {
    warnings.push("Repeated character patterns are blocked.");
  }

  return {
    ok: warnings.length === 0,
    sanitized,
    warnings
  };
}
