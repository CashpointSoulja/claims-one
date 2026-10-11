import {
  choiceConfidence, describeLevel, expectedScore, scoreConfidence, validateRequest, validateResponse,
} from './contract';
import type { Answer, Question, SystemOneRequest, SystemOneResponse } from './contract';
import { CLAIM_QUESTIONS } from './questions';
import { CLAIMS } from './samples';

type Profile = {
  claimType: number[]; severity: number[]; fraud: number; liability: number;
  documentation: number[]; churn: number[]; holdReasons: string[]; urgent?: boolean;
};
// Deliberately specified synthetic distributions, not inference, measurements or model outputs.
// claimType order: accident, illness, dental, wellness, pre_existing, other.
const PROFILES: Record<string, Profile> = {
  string: { claimType: [.96,.01,.005,.005,.005,.015], severity: [0,0,.02,.18,.8], fraud: .02, liability: .96, documentation: [0,.05,.2,.65,.1], churn: [.9,.09,.01], holdReasons: ['Ongoing emergency requires human clinical coordination.', 'Final invoice is pending.'], urgent: true },
  cruciate: { claimType: [.88,.05,.01,.01,.03,.02], severity: [0,.01,.2,.77,.02], fraud: .04, liability: .72, documentation: [0,0,.08,.85,.07], churn: [.87,.11,.02], holdReasons: ['Orthopedic onset and bilateral-condition evidence require specialist verification.'] },
  chocolate: { claimType: [.98,.005,0,0,.005,.01], severity: [0,0,0,.1,.9], fraud: .01, liability: .97, documentation: [0,.02,.18,.7,.1], churn: [.86,.12,.02], holdReasons: ['Potentially life-threatening ingestion requires urgent human coordination.', 'Final invoice is pending.'], urgent: true },
  dental: { claimType: [.05,.05,.75,.05,.05,.05], severity: [.05,.8,.15,0,0], fraud: .04, liability: .97, documentation: [0,0,0,.03,.97], churn: [.82,.15,.03], holdReasons: [] },
  'foreign-body': { claimType: [.97,.01,0,0,.005,.015], severity: [0,0,.02,.93,.05], fraud: .03, liability: .96, documentation: [0,0,.1,.8,.1], churn: [.91,.08,.01], holdReasons: ['Hospitalization requires human coordination.', 'Discharge evidence is pending.'], urgent: true },
  wellness: { claimType: [.005,.005,.005,.98,0,.005], severity: [.98,.02,0,0,0], fraud: .01, liability: .99, documentation: [0,0,0,.01,.99], churn: [.98,.015,.005], holdReasons: [] },
  preexisting: { claimType: [.02,.05,.01,.01,.88,.03], severity: [.02,.86,.12,0,0], fraud: .08, liability: .28, documentation: [0,0,.85,.1,.05], churn: [.2,.55,.25], holdReasons: ['Pre-existing condition dispute requires specialist human review.'] },
  'missing-invoice': { claimType: [.02,.89,.01,.01,.02,.05], severity: [.03,.9,.07,0,0], fraud: .12, liability: .5, documentation: [.2,.75,.05,0,0], churn: [.85,.13,.02], holdReasons: ['Required invoice, event date and policy schedule are missing.'] },
  'duplicate-invoice': { claimType: [.94,.015,.005,.005,.005,.03], severity: [.08,.9,.02,0,0], fraud: .91, liability: .94, documentation: [0,.02,.93,.05,0], churn: [.9,.08,.02], holdReasons: ['Potential duplicate invoice requires human integrity review; no fraud finding is made.'] },
  liability: { claimType: [.02,.9,.005,.005,.04,.03], severity: [0,.15,.83,.02,0], fraud: .06, liability: .52, documentation: [0,0,.15,.8,.05], churn: [.76,.2,.04], holdReasons: ['Conflicting waiting-period dates and onset require human policy verification.'] },
  cancellation: { claimType: [.01,.96,.005,.005,.005,.015], severity: [.05,.94,.01,0,0], fraud: .03, liability: .97, documentation: [0,0,0,.02,.98], churn: [.02,.08,.9], holdReasons: ['Explicit cancellation intent requires human service attention.'] },
  'ear-infection': { claimType: [.015,.95,.01,.005,.005,.015], severity: [.02,.96,.02,0,0], fraud: .02, liability: .98, documentation: [0,0,0,.01,.99], churn: [.98,.015,.005], holdReasons: [] },
};
export interface DemoContext { sampleId: string; holdReasons: readonly string[]; urgent: boolean }
const contexts = new WeakMap<SystemOneResponse, DemoContext>();
export function getDemoContext(response: SystemOneResponse): DemoContext | undefined {
  const context = contexts.get(response);
  return context ? { ...context, holdReasons: [...context.holdReasons] } : undefined;
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  return JSON.stringify(value);
}
const standardQuestions = canonical(CLAIM_QUESTIONS);
function fixtureFor(request: SystemOneRequest) {
  if (typeof request.state !== 'string' || canonical(request.questions) !== standardQuestions) return undefined;
  // Full exact equality only: no substring, label, filename, keyword or selected-ID shortcut.
  const sample = CLAIMS.find(claim => claim.text === request.state);
  return sample ? { sample, profile: PROFILES[sample.id] } : undefined;
}
function distribution(keys: string[], values: number[]) { return Object.fromEntries(keys.map((key, i) => [key, values[i]])); }
function answerQuestion(id: string, question: Question, profile?: Profile): Answer {
  if (question.type === 'noul') return { type: 'noul', noul: profile ? (id === 'fraud_signal' ? profile.fraud : profile.liability) : .5 };
  if (question.type === 'choice') {
    const keys = Object.keys(question.criteria);
    const values = profile ? (id === 'claim_type' ? profile.claimType : profile.churn) : keys.map(() => 1 / keys.length);
    return { type: 'choice', choice: keys[values.indexOf(Math.max(...values))], probabilities: distribution(keys, values), confidence: choiceConfidence(values) };
  }
  const keys = question.criteria.map((_, i) => String(i));
  const values = profile ? (id === 'severity' ? profile.severity : profile.documentation) : keys.map(() => 1 / keys.length);
  return { type: 'score', score: expectedScore(values), legend: Object.fromEntries(question.criteria.map((level, i) => [String(i), describeLevel(level)])), probabilities: distribution(keys, values), confidence: scoreConfidence(values) };
}
function finishResponse(request: SystemOneRequest, answers: Record<string, Answer>, fixture: ReturnType<typeof fixtureFor>): SystemOneResponse {
  const response: SystemOneResponse = {
    model: 'demo-fixture-v1', answers,
    // No API has run, so these counters are zero. Estimates are separate adapter helpers.
    usage: { input_tokens: 0, output_tokens: 0 },
  };
  validateResponse(response, request);
  if (fixture) contexts.set(response, { sampleId: fixture.sample.id, holdReasons: [...fixture.profile.holdReasons], urgent: !!fixture.profile.urgent });
  return response;
}
/** Synchronous version for deterministic synthetic evaluations; same answers and validation as the batch adapter. */
export function createDemoResponse(request: SystemOneRequest): SystemOneResponse {
  validateRequest(request);
  const fixture = fixtureFor(request);
  return finishResponse(request, Object.fromEntries(Object.entries(request.questions).map(([id, question]) => [id, answerQuestion(id, question, fixture?.profile)])), fixture);
}
/** One batch contract. Independent typed questions are evaluated together, not as sequential calls. */
export async function mockEvaluate(request: SystemOneRequest): Promise<SystemOneResponse> {
  validateRequest(request);
  const fixture = fixtureFor(request);
  const answers = await Promise.all(Object.entries(request.questions).map(async ([id, question]) => [id, answerQuestion(id, question, fixture?.profile)] as const));
  return finishResponse(request, Object.fromEntries(answers), fixture);
}
