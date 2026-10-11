import { choiceConfidence } from './contract';
import type { ChoiceAnswer, SystemOneResponse } from './contract';
import { createDemoResponse } from './mock';
import { buildRequest } from './questions';
import { routeClaim } from './routing';
import type { RoutingAction } from './routing';
import { CLAIMS } from './samples';

export const EVAL_NOTICE = '240 deterministic synthetic variations of twelve invented claims, with synthetic truth labels. This is an illustrative evaluation harness, not live usage, independently measured accuracy or proof of calibration. Confidence is the minimum required Choice/Score confidence; accuracy compares simulated routing with synthetic truth.';
export interface EvalRow {
  id: string; claimId: string; response: SystemOneResponse; confidence: number;
  predictedAction: RoutingAction; truthAction: RoutingAction;
}
function setChoiceConfidence(answer: ChoiceAnswer, target: number) {
  const keys = Object.keys(answer.probabilities);
  const top = (1 + (keys.length - 1) * target) / keys.length;
  const otherTotal = keys.filter(key => key !== answer.choice).reduce((sum, key) => sum + answer.probabilities[key], 0);
  answer.probabilities = Object.fromEntries(keys.map(key => [key, key === answer.choice ? top : (1 - top) * (otherTotal > 0 ? answer.probabilities[key] / otherTotal : 1 / (keys.length - 1))]));
  answer.confidence = choiceConfidence(Object.values(answer.probabilities));
}
// These rows exercise the actual shared validator and router, not chart-only hardcodes.
export const EVAL_ROWS: EvalRow[] = CLAIMS.flatMap((claim, claimIndex) => Array.from({ length: 20 }, (_, variant) => {
  const response = createDemoResponse(buildRequest(claim.text));
  const claimType = response.answers.claim_type;
  if (claimType.type === 'choice') setChoiceConfidence(claimType, .4 + variant * .03);
  const baseline = routeClaim(response, 0);
  const confidence = baseline.confidence;
  // Deterministic synthetic label disagreements increase at lower reported confidence.
  // There are no observed model outcomes behind this illustrative fixture generator.
  const draw = ((claimIndex * 37 + variant * 17 + 11) % 100) / 100;
  const agrees = draw < confidence;
  const truthAction: RoutingAction = agrees ? baseline.action : baseline.autonomous ? 'human_review' : 'fast_track';
  return { id: `synthetic-${claim.id}-${variant + 1}`, claimId: claim.id, response, confidence, predictedAction: baseline.action, truthAction };
}));
export interface ThresholdMetrics {
  total: number; autonomous: number; escalated: number; correctAutonomous: number;
  autonomyRate: number; autonomousAccuracy: number | null;
}
export function evaluateThreshold(threshold: number): ThresholdMetrics {
  const decisions = EVAL_ROWS.map(row => ({ row, decision: routeClaim(row.response, threshold) }));
  const autonomous = decisions.filter(({ decision }) => decision.autonomous);
  const correctAutonomous = autonomous.filter(({ row, decision }) => decision.action === row.truthAction).length;
  return {
    total: decisions.length, autonomous: autonomous.length, escalated: decisions.length - autonomous.length,
    correctAutonomous, autonomyRate: decisions.length ? autonomous.length / decisions.length : 0,
    autonomousAccuracy: autonomous.length ? correctAutonomous / autonomous.length : null,
  };
}
export interface CalibrationBin { label: string; count: number; meanConfidence: number; accuracy: number }
export function calibrationBins(): CalibrationBin[] {
  const ranges: [string, number, number][] = [['0–59%', 0, .6], ['60–69%', .6, .7], ['70–79%', .7, .8], ['80–89%', .8, .9], ['90–100%', .9, 1.000001]];
  return ranges.map(([label, start, end]) => {
    const rows = EVAL_ROWS.filter(row => row.confidence >= start && row.confidence < end);
    return {
      label, count: rows.length,
      meanConfidence: rows.length ? rows.reduce((sum, row) => sum + row.confidence, 0) / rows.length : 0,
      accuracy: rows.length ? rows.filter(row => row.predictedAction === row.truthAction).length / rows.length : 0,
    };
  });
}
export function escalationBreakdown(threshold: number): { reason: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const row of EVAL_ROWS) {
    const result = routeClaim(row.response, threshold);
    if (!result.autonomous) {
      // Primary reason per claim, so counts sum to the total escalated; holds precede slider reasons.
      const reason = result.reasons[0] ?? 'Human review required.';
      counts.set(reason, (counts.get(reason) ?? 0) + 1);
    }
  }
  return [...counts].map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason));
}
