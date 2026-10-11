import { describe, expect, it } from 'vitest';
import { calculateEconomics, ECONOMICS_ASSUMPTIONS } from '../src/economics';
import { calibrationBins, EVAL_ROWS, evaluateThreshold, escalationBreakdown } from '../src/evals';
import { validateResponse } from '../src/contract';
import { buildRequest } from '../src/questions';
import { routeClaim } from '../src/routing';

describe('published-number illustrative economics', () => {
  it('uses $42 per billion INPUT tokens, with output free', () => {
    const result = calculateEconomics(50_000, 1_800);
    expect(result.jevCost).toBeCloseTo(3.78);
    expect(result.impliedLlmCost).toBeCloseTo(3.78 * 444.6);
    expect(result.jevLatencyMs).toBe(114);
    expect(result.impliedLlmLatencyMs).toBeCloseTo(114 * 193.6);
    expect(result.speedRatio).toBe(193.6); expect(result.costRatio).toBe(444.6);
    expect(ECONOMICS_ASSUMPTIONS.outputPriceUsd).toBe(0);
    expect(ECONOMICS_ASSUMPTIONS.publishedLatencyRangeMs).toEqual([70, 500]);
  });
  it('states units, workload assumptions, ratio derivation and non-measurement caveats', () => {
    const note = ECONOMICS_ASSUMPTIONS.note;
    for (const text of ['specific published', 'not measured Claims One', 'ratio-derived', 'not independent', 'per claim', 'USD', 'per batch request', 'No live usage']) expect(note).toContain(text);
  });
  it('scales linearly in claims and input tokens per claim', () => {
    expect(calculateEconomics(20_000, 1_000).jevCost).toBeCloseTo(2 * calculateEconomics(10_000, 1_000).jevCost);
    expect(calculateEconomics(10_000, 2_000).jevCost).toBeCloseTo(2 * calculateEconomics(10_000, 1_000).jevCost);
    expect(calculateEconomics(10_000, 1_000).jevLatencyMs).toBe(calculateEconomics(20_000, 1_000).jevLatencyMs);
  });
  it('handles an empty workload or zero input without claiming workload latency measurements', () => {
    expect(calculateEconomics(0, 1_800).jevCost).toBe(0);
    expect(calculateEconomics(50_000, 0).impliedLlmCost).toBe(0);
  });
  it.each([[-1, 1000], [1000, -1], [.5, 1000], [1000, .5], [NaN, 1000], [1000, Infinity], [Number.MAX_SAFE_INTEGER, 2]])('rejects invalid/unsafe workloads (%s, %s)', (claims, tokens) => {
    expect(() => calculateEconomics(claims, tokens)).toThrow(RangeError);
  });
});

describe('deterministic synthetic evaluation calculations', () => {
  it('ships 240 distinct rows and validates every response using the shared contract', () => {
    expect(EVAL_ROWS).toHaveLength(240);
    expect(new Set(EVAL_ROWS.map(row => row.id)).size).toBe(240);
    for (const row of EVAL_ROWS) {
      validateResponse(row.response, buildRequest('validation'));
      expect(row.confidence).toBe(routeClaim(row.response, 0).confidence);
      expect(row.predictedAction).toBe(routeClaim(row.response, 0).action);
      expect(['auto_approve', 'fast_track', 'human_review', 'urgent_review']).toContain(row.truthAction);
    }
  });
  it.each([0, .5, .65, .85, .95, 1])('calculates threshold %s metrics from real engine decisions and truth labels', threshold => {
    const decisions = EVAL_ROWS.map(row => ({ row, decision: routeClaim(row.response, threshold) }));
    const automatic = decisions.filter(({ decision }) => decision.autonomous);
    const correct = automatic.filter(({ row, decision }) => row.truthAction === decision.action).length;
    const metrics = evaluateThreshold(threshold);
    expect(metrics.total).toBe(240);
    expect(metrics.autonomous).toBe(automatic.length);
    expect(metrics.escalated).toBe(240 - automatic.length);
    expect(metrics.correctAutonomous).toBe(correct);
    expect(metrics.autonomyRate).toBe(automatic.length / 240);
    expect(metrics.autonomousAccuracy).toBe(automatic.length ? correct / automatic.length : null);
  });
  it('increasing the gate never increases autonomy', () => {
    let previous = Infinity;
    for (let hundredths = 0; hundredths <= 100; hundredths += 5) {
      const current = evaluateThreshold(hundredths / 100).autonomous;
      expect(current).toBeLessThanOrEqual(previous); previous = current;
    }
  });
  it('returns null accuracy when no actions are autonomous, not a misleading 100%', () => {
    expect(evaluateThreshold(1)).toMatchObject({ autonomous: 0, autonomyRate: 0, correctAutonomous: 0, autonomousAccuracy: null });
    expect(evaluateThreshold(NaN)).toMatchObject({ autonomous: 0, escalated: 240, autonomousAccuracy: null });
  });
  it('keeps every risky fixture variation human-only even at threshold zero', () => {
    const safeIds = new Set(['dental', 'wellness', 'ear-infection']);
    for (const row of EVAL_ROWS.filter(row => !safeIds.has(row.claimId))) expect(routeClaim(row.response, 0).autonomous).toBe(false);
  });
  it('bins actual confidence and empirical synthetic truth agreement, with weighted totals', () => {
    const bins = calibrationBins();
    expect(bins.map(bin => bin.label)).toEqual(['0–59%', '60–69%', '70–79%', '80–89%', '90–100%']);
    expect(bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(240);
    expect(bins.every(bin => bin.count > 0)).toBe(true);
    const weightedConfidence = bins.reduce((sum, bin) => sum + bin.meanConfidence * bin.count, 0) / 240;
    const weightedAccuracy = bins.reduce((sum, bin) => sum + bin.accuracy * bin.count, 0) / 240;
    expect(weightedConfidence).toBeCloseTo(EVAL_ROWS.reduce((sum, row) => sum + row.confidence, 0) / 240);
    expect(weightedAccuracy).toBeCloseTo(EVAL_ROWS.filter(row => row.predictedAction === row.truthAction).length / 240);
    const bounds = [[0,.6],[.6,.7],[.7,.8],[.8,.9],[.9,1.000001]];
    bins.forEach((bin, index) => {
      const rows = EVAL_ROWS.filter(row => row.confidence >= bounds[index][0] && row.confidence < bounds[index][1]);
      expect(bin.count).toBe(rows.length);
      expect(bin.accuracy).toBe(rows.filter(row => row.predictedAction === row.truthAction).length / rows.length);
    });
  });
  it.each([0, .65, .85, 1])('primary escalation reasons at %s sum to actual escalations', threshold => {
    const breakdown = escalationBreakdown(threshold);
    expect(breakdown.reduce((sum, row) => sum + row.count, 0)).toBe(evaluateThreshold(threshold).escalated);
    const manual = new Map<string, number>();
    for (const row of EVAL_ROWS) {
      const decision = routeClaim(row.response, threshold);
      if (!decision.autonomous) manual.set(decision.reasons[0], (manual.get(decision.reasons[0]) ?? 0) + 1);
    }
    expect(Object.fromEntries(breakdown.map(row => [row.reason, row.count]))).toEqual(Object.fromEntries(manual));
  });
});
