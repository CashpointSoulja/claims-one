import type { SystemOneResponse } from './contract';
import { isValidResponse } from './contract';
import { getDemoContext } from './mock';
import { buildRequest } from './questions';

export type RoutingAction = 'auto_approve' | 'fast_track' | 'human_review' | 'urgent_review';
export interface RoutingDecision {
  action: RoutingAction; label: string; reasons: string[]; confidence: number; autonomous: boolean;
}
const LABELS: Record<RoutingAction, string> = {
  auto_approve: 'Simulated auto-approve', fast_track: 'Simulated fast-track',
  human_review: 'Human review', urgent_review: 'Urgent human review',
};
function decision(action: RoutingAction, reasons: string[], confidence = 0): RoutingDecision {
  return { action, label: LABELS[action], reasons, confidence, autonomous: action === 'auto_approve' || action === 'fast_track' };
}
/** Triage simulation only: never pays, denies, determines coverage or makes a finding of fraud. */
export function routeClaim(response: SystemOneResponse, threshold: number): RoutingDecision {
  if (typeof threshold !== 'number' || !Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    return decision('human_review', ['Invalid autonomy threshold; fail closed.']);
  }
  const validationRequest = buildRequest('Response validation only');
  if (!isValidResponse(response, validationRequest)) {
    return decision('human_review', ['Missing or invalid typed response; fail closed.']);
  }
  const { claim_type: type, severity, fraud_signal: fraud, liability, documentation_completeness: docs, churn_risk: churn } = response.answers;
  // Validation binds all six answer types and option/level keys to the shared rubric.
  if (type.type !== 'choice' || severity.type !== 'score' || fraud.type !== 'noul' || liability.type !== 'noul' || docs.type !== 'score' || churn.type !== 'choice') {
    return decision('human_review', ['Required question types are missing; fail closed.']);
  }
  const confidence = Math.min(type.confidence, severity.confidence, docs.confidence, churn.confidence);
  const context = getDemoContext(response);
  const urgent = !!context?.urgent || severity.score >= 3 || severity.probabilities['4'] >= .25;
  const reasons: string[] = [];
  // Provenance lives outside the published response. Serialized, custom and live inputs stay human-only.
  if (!context) reasons.push('Unrecognized or custom input: human-only; no validated synthetic fixture provenance.');
  if (context) reasons.push(...context.holdReasons);
  if (type.choice === 'other') reasons.push('Claim type is unknown or outside the supported rubric.');
  if (type.choice === 'pre_existing' || type.probabilities.pre_existing >= .15) reasons.push('Prior-condition or dispute evidence requires specialist review.');
  if (fraud.noul > .15) reasons.push('Integrity signal exceeds 0.15; human investigation only, not a fraud determination.');
  if (liability.noul < .9) reasons.push('Synthetic policy eligibility evidence is uncertain (below 0.90); verify with a human.');
  if (docs.score < 3.8 || docs.probabilities['4'] < .9) reasons.push('Documentation is not complete enough for simulated autonomy.');
  if (churn.choice === 'high' || churn.probabilities.high >= .25) reasons.push('Cancellation risk requires human service attention.');
  if (urgent) reasons.push('Urgent clinical narrative: prioritize a human; the slider cannot override this hold.');
  if (confidence < threshold) reasons.push(`At least one required Choice/Score confidence is below the ${Math.round(threshold * 100)}% threshold.`);
  if (reasons.length) return decision(urgent ? 'urgent_review' : 'human_review', [...new Set(reasons)], confidence);
  const action = type.choice === 'illness' || severity.score >= 1.5 ? 'fast_track' : 'auto_approve';
  return decision(action, [
    'Known synthetic fixture: all required Choice/Score confidences meet the threshold.',
    'Integrity probability ≤ 0.15, synthetic eligibility probability ≥ 0.90, and documents complete.',
    'Simulated workflow action only; a real insurer must independently determine coverage and payment.',
  ], confidence);
}
