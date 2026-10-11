import type { Question, SystemOneRequest } from './contract';
import { validateRequest } from './contract';

export const CLAIM_QUESTIONS = {
  claim_type: {
    type: 'choice',
    instructions: 'What is the primary type of this pet claim? Classify the reported event, not entitlement to payment. Use pre_existing for an explicit prior-condition dispute and other when there is insufficient evidence.',
    criteria: {
      accident: 'A sudden injury, ingestion or external accident.',
      illness: 'A newly reported medical illness or infection.',
      dental: 'A dental treatment or oral condition.',
      wellness: 'Routine preventive care or a wellness visit.',
      pre_existing: 'An explicit pre-existing condition or coverage dispute requiring specialist review.',
      other: 'Unclear, conflicting or outside the listed claim types.',
    },
  },
  severity: {
    type: 'score',
    instructions: 'How clinically urgent is the reported event? Rate the narrative only; do not give medical advice. Levels display as 1–5, while the API uses zero-based positions 0–4.',
    criteria: [
      '1 · Routine preventive care; no current symptoms.',
      '2 · Mild, stable symptoms; outpatient treatment.',
      '3 · Significant illness or injury; prompt clinical follow-up.',
      '4 · Urgent treatment, hospitalization or surgery.',
      '5 · Potentially life-threatening emergency; immediate clinical attention.',
    ],
  },
  fraud_signal: {
    type: 'noul',
    instructions: 'Does the narrative include a concrete inconsistency, duplicate invoice or other signal requiring an integrity review? A signal is not a finding of fraud and must never trigger an automatic denial.',
    criteria: {
      true: 'A specific inconsistency or potential duplicate needs a human to investigate.',
      false: 'No concrete inconsistency is reported in the supplied evidence.',
    },
  },
  liability: {
    type: 'noul',
    instructions: 'Does the supplied synthetic policy evidence clearly support this reported event being eligible for consideration? Absence of policy evidence, ambiguous onset or disputes mean uncertainty. This is not an insurer assurance or a coverage determination.',
    criteria: {
      true: 'Explicit synthetic policy evidence aligns with the event and dates, with no stated dispute.',
      false: 'Evidence is missing, conflicting, outside the synthetic policy or disputed.',
    },
  },
  documentation_completeness: {
    type: 'score',
    instructions: 'How complete is the supplied documentation for a simulated desk review? Evaluate the stated attachment list, not imaginary documents. Never infer a missing invoice or medical record.',
    criteria: [
      '1 · Narrative only; required records absent.',
      '2 · Some clinical notes, but invoice or identity details missing.',
      '3 · Invoice and notes present, with significant gaps or conflicts.',
      '4 · Nearly complete; one minor verification outstanding.',
      '5 · Itemized invoice, clinical notes, event dates and synthetic policy evidence all supplied consistently.',
    ],
  },
  churn_risk: {
    type: 'choice',
    instructions: 'What level of cancellation intent is expressed by the owner? Use explicit statements, not demographic assumptions; this signal routes service attention, not claim eligibility.',
    criteria: {
      low: 'No cancellation intent or material service frustration expressed.',
      medium: 'Frustration or repeated follow-up, without explicit cancellation intent.',
      high: 'Explicit cancellation intent, ultimatum or imminent departure.',
    },
  },
} satisfies Record<string, Question>;

export type ClaimQuestionId = keyof typeof CLAIM_QUESTIONS;
export function buildRequest(state: string): SystemOneRequest {
  // A fresh question map prevents consumer edits from mutating the shared rubric.
  const request = { state, model: 'jev-latest', questions: structuredClone(CLAIM_QUESTIONS) };
  validateRequest(request);
  return request;
}
