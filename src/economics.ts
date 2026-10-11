export const ECONOMICS_ASSUMPTIONS = {
  inputPricePerBillionUsd: 42,
  outputPriceUsd: 0,
  illustrativeLatencyMs: 114,
  publishedLatencyRangeMs: [70, 500] as const,
  publishedSpeedRatio: 193.6,
  publishedCostRatio: 444.6,
  note: 'Illustrative scenario using published TypeSafe figures. Ratios describe specific published System One workflows, not measured Claims One results. Comparator values are ratio-derived, not independent LLM pricing or performance benchmarks. Input tokens are per claim; costs are USD for the full workload. Latency is per batch request, not total workload wall-clock time. No live usage is measured.',
} as const;
export interface EconomicsResult {
  jevCost: number; impliedLlmCost: number; jevLatencyMs: number; impliedLlmLatencyMs: number;
  speedRatio: number; costRatio: number;
}
/** One six-question batch per claim; inputTokens includes serialized state and question overhead. */
export function calculateEconomics(claims: number, inputTokens: number): EconomicsResult {
  if (!Number.isSafeInteger(claims) || claims < 0 || !Number.isSafeInteger(inputTokens) || inputTokens < 0 || !Number.isSafeInteger(claims * inputTokens)) {
    throw new RangeError('Claims and input tokens per claim must be nonnegative safe integers; workload token total must also be safe.');
  }
  const jevCost = claims * inputTokens * ECONOMICS_ASSUMPTIONS.inputPricePerBillionUsd / 1_000_000_000;
  return {
    jevCost,
    impliedLlmCost: jevCost * ECONOMICS_ASSUMPTIONS.publishedCostRatio,
    jevLatencyMs: ECONOMICS_ASSUMPTIONS.illustrativeLatencyMs,
    impliedLlmLatencyMs: ECONOMICS_ASSUMPTIONS.illustrativeLatencyMs * ECONOMICS_ASSUMPTIONS.publishedSpeedRatio,
    speedRatio: ECONOMICS_ASSUMPTIONS.publishedSpeedRatio,
    costRatio: ECONOMICS_ASSUMPTIONS.publishedCostRatio,
  };
}
