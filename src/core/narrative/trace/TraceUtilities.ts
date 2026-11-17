export function generateTraceId(): string {
  return `trace-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`;
}

export function isValidConfidence(confidence: number): boolean {
  return confidence >= 0 && confidence <= 1.0;
}
