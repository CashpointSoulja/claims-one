import { describe, expect, it } from 'vitest';
import { API_LIMITS, choiceConfidence, expectedScore, scoreConfidence, validateRequest, validateResponse } from '../src/contract';
import type { Answer, SystemOneRequest, SystemOneResponse } from '../src/contract';
import { mockEvaluate, createDemoResponse } from '../src/mock';
import { buildRequest, CLAIM_QUESTIONS } from '../src/questions';
import { CLAIMS } from '../src/samples';

function routine() { return createDemoResponse(buildRequest(CLAIMS.find(claim => claim.id === 'dental')!.text)); }
function checkMutated(mutate: (response: SystemOneResponse) => void) {
  const response = structuredClone(routine());
  mutate(response);
  expect(() => validateResponse(response, buildRequest('validation'))).toThrow();
}
const generic: SystemOneRequest = {
  state: { notes: ['An arbitrary structured input', { nested: true }] }, model: 'jev-latest',
  questions: {
    'custom-category': { type: 'choice', instructions: { question: 'Pick one', context: [1, true, null] }, criteria: { alpha: null, beta: { description: 'Structured' }, gamma: ['Another'] } },
    'custom-rating': { type: 'score', instructions: ['Rate', { dimension: 'quality' }], criteria: ['Low', { label: 'Medium' }, ['High']] },
    'custom-flag': { type: 'noul', instructions: 'Is it clear?' },
  },
};

describe('published typed request and batch contract', () => {
  it('uses the six fixed IDs and a fresh question map', () => {
    const request = buildRequest('Example');
    expect(Object.keys(request.questions)).toEqual(['claim_type', 'severity', 'fraud_signal', 'liability', 'documentation_completeness', 'churn_risk']);
    expect(request.model).toBe('jev-latest');
    expect(request.questions).toEqual(CLAIM_QUESTIONS);
    expect(request.questions).not.toBe(CLAIM_QUESTIONS);
  });
  it.each(CLAIMS)('validates every synthetic fixture response: $id', async claim => {
    const request = buildRequest(claim.text);
    const response = await mockEvaluate(request);
    expect(() => validateResponse(response, request)).not.toThrow();
    expect(response.usage).toEqual({ input_tokens: 0, output_tokens: 0 });
    expect(response.model).toBe('demo-fixture-v1');
    expect(Object.keys(response.answers)).toEqual(Object.keys(request.questions));
  });
  it('handles arbitrary IDs, options and structured instructions/criteria, without claim-only assumptions', async () => {
    validateRequest(generic);
    const response = await mockEvaluate(generic);
    validateResponse(response, generic);
    expect(response.answers['custom-category']).toMatchObject({ type: 'choice', confidence: 0 });
    expect(response.answers['custom-flag']).toEqual({ type: 'noul', noul: .5 });
    const score = response.answers['custom-rating'];
    expect(score.type).toBe('score');
    if (score.type === 'score') {
      expect(score.score).toBeCloseTo(1);
      expect(score.legend).toEqual({ '0': 'Low', '1': '{"label":"Medium"}', '2': '["High"]' });
    }
  });
  it('allows all 255 Choice options and rejects the 256th', async () => {
    const criteria = Object.fromEntries(Array.from({ length: 255 }, (_, i) => [`option-${i}`, null]));
    const request: SystemOneRequest = { state: 'input', model: 'jev-latest', questions: { options: { type: 'choice', instructions: 'Select', criteria } } };
    const result = await mockEvaluate(request);
    expect(Object.keys((result.answers.options as Extract<Answer, { type: 'choice' }>).probabilities)).toHaveLength(255);
    expect(() => validateRequest({ ...request, questions: { options: { ...request.questions.options, criteria: { ...criteria, overflow: null } } } })).toThrow('255');
  });
  it('enforces the currently published 2–10 Score levels, not a Choice-option limit', async () => {
    expect(API_LIMITS.scoreLevels).toBe(10);
    const request: SystemOneRequest = { state: [], model: 'jev-latest', questions: { rating: { type: 'score', instructions: 'Rate', criteria: Array.from({ length: 10 }, (_, i) => `Level ${i}`) } } };
    validateResponse(await mockEvaluate(request), request);
    for (const count of [0, 1, 11, 255]) expect(() => validateRequest({ ...request, questions: { rating: { ...request.questions.rating, criteria: Array.from({ length: count }, () => 'level') } } })).toThrow('2–10');
  });
  it('does not invent a 255-question ceiling; question count is distinct from Choice cardinality', async () => {
    const request: SystemOneRequest = { state: 'input', model: 'jev-latest', questions: Object.fromEntries(Array.from({ length: 256 }, (_, i) => [`q${i}`, { type: 'noul', instructions: 'Is this clear?' }])) };
    const response = await mockEvaluate(request);
    expect(Object.keys(response.answers)).toHaveLength(256);
    validateResponse(response, request);
  });
  it('handles a singleton Choice deterministically without NaN confidence', async () => {
    const request: SystemOneRequest = { state: 'input', model: 'jev-latest', questions: { only: { type: 'choice', instructions: 'Only option', criteria: { only: null } } } };
    const response = await mockEvaluate(request);
    expect(response.answers.only).toEqual({ type: 'choice', choice: 'only', probabilities: { only: 1 }, confidence: 1 });
    validateResponse(response, request);
  });
  it.each([null, 12, true, undefined, { invalid: undefined }, { invalid: NaN }, new Date()])('rejects unsupported state %s', state => {
    expect(() => validateRequest({ ...generic, state })).toThrow();
  });
  it.each([
    null, {}, { state: 'input', model: 'jev-latest' }, { ...generic, extra: true }, { ...generic, model: '' },
    { ...generic, questions: [] }, { ...generic, questions: {} },
    { ...generic, questions: { q: { type: 'unknown', instructions: 'What?' } } },
    { ...generic, questions: { q: { type: 'choice', instructions: 'What?', criteria: {} } } },
    { ...generic, questions: { q: { type: 'choice', instructions: 123, criteria: { yes: null } } } },
    { ...generic, questions: { q: { type: 'choice', instructions: 'What?', criteria: { yes: 123 } } } },
    { ...generic, questions: { q: { type: 'noul', instructions: 'What?', criteria: { maybe: 'Wrong' } } } },
    { ...generic, questions: { q: { type: 'noul', instructions: 'What?', confidence: 1 } } },
  ])('rejects invalid request shapes (%#)', async request => {
    expect(() => validateRequest(request)).toThrow();
    await expect(mockEvaluate(request as SystemOneRequest)).rejects.toThrow();
  });
  it('rejects cyclic and non-finite JSON content', () => {
    const state: Record<string, unknown> = {}; state.self = state;
    expect(() => validateRequest({ ...generic, state })).toThrow();
    expect(() => validateRequest({ ...generic, state: ['input', Infinity] })).toThrow();
  });
});

describe('probability-derived confidence and zero-based Score', () => {
  it('matches the exact documented Choice formula', () => {
    expect(choiceConfidence([.6,.3,.1])).toBeCloseTo(.4);
    expect(choiceConfidence([.6,.2,.2])).toBeCloseTo(.4);
    expect(choiceConfidence([1/3,1/3,1/3])).toBeCloseTo(0);
    expect(choiceConfidence([0,1,0])).toBe(1);
  });
  it('uses ordered-level spread for Score confidence', () => {
    expect(scoreConfidence([0,.5,.5])).toBeCloseTo(.25);
    expect(scoreConfidence([.5,0,.5])).toBe(0);
    expect(scoreConfidence([0,0,1,0,0])).toBe(1);
    expect(scoreConfidence([.2,.2,.2,.2,.2])).toBe(0);
    expect(scoreConfidence([.05,.8,.15,0,0])).toBeCloseTo(5/6);
  });
  it('returns the probability-weighted mean, not a one-based or argmax score', () => {
    expect(expectedScore([0,.95,.05])).toBeCloseTo(1.05);
    const response = routine();
    const score = response.answers.severity;
    if (score.type !== 'score') throw new Error('Missing severity');
    expect(score.score).toBeCloseTo(1.1);
    expect(Object.keys(score.legend)).toEqual(['0','1','2','3','4']);
    expect(score.score + 1).toBeCloseTo(2.1); // Display conversion only; raw contract stays unchanged.
  });
});

describe('full response validation fails closed', () => {
  it.each([NaN, Infinity, -Infinity, -0.01, 1.01])('rejects invalid probability %s', invalid => {
    checkMutated(response => { const answer = response.answers.claim_type; if (answer.type === 'choice') answer.probabilities.dental = invalid; });
    checkMutated(response => { const answer = response.answers.fraud_signal; if (answer.type === 'noul') answer.noul = invalid; });
  });
  it('rejects missing/extra question and probability keys', () => {
    checkMutated(response => { delete response.answers.liability; });
    checkMutated(response => { response.answers.extra = { type: 'noul', noul: .01 }; });
    checkMutated(response => { const answer = response.answers.claim_type; if (answer.type === 'choice') delete answer.probabilities.other; });
    checkMutated(response => { const answer = response.answers.claim_type; if (answer.type === 'choice') answer.probabilities.unlisted = 0; });
  });
  it('rejects distributions not summing to one', () => {
    checkMutated(response => { const answer = response.answers.claim_type; if (answer.type === 'choice') answer.probabilities.dental = .8; });
    checkMutated(response => { const answer = response.answers.severity; if (answer.type === 'score') answer.probabilities['4'] = .1; });
  });
  it('rejects inconsistent choices and fabricated confidence', () => {
    checkMutated(response => { const answer = response.answers.claim_type; if (answer.type === 'choice') answer.choice = 'accident'; });
    checkMutated(response => { const answer = response.answers.claim_type; if (answer.type === 'choice') answer.choice = 'unknown'; });
    checkMutated(response => { const answer = response.answers.claim_type; if (answer.type === 'choice') answer.confidence = .99; });
    checkMutated(response => { const answer = response.answers.severity; if (answer.type === 'score') answer.confidence = .99; });
  });
  it('rejects score/legend errors, including zero-based versus display confusion', () => {
    checkMutated(response => { const answer = response.answers.severity; if (answer.type === 'score') answer.score += 1; });
    checkMutated(response => { const answer = response.answers.severity; if (answer.type === 'score') answer.score = NaN; });
    checkMutated(response => { const answer = response.answers.severity; if (answer.type === 'score') delete answer.legend['0']; });
    checkMutated(response => { const answer = response.answers.severity; if (answer.type === 'score') answer.legend['0'] = 'Forged rubric'; });
    checkMutated(response => { const answer = response.answers.severity; if (answer.type === 'score') answer.legend['5'] = 'Extra level'; });
  });
  it('rejects incorrect types, invalid token counters and unexpected top-level properties', () => {
    checkMutated(response => { response.answers.severity = { type: 'noul', noul: .2 }; });
    checkMutated(response => { response.usage.input_tokens = -1; });
    checkMutated(response => { response.usage.output_tokens = .5; });
    checkMutated(response => { response.usage.input_tokens = Infinity; });
    expect(() => validateResponse({ ...routine(), latency_ms: 114 }, buildRequest('validation'))).toThrow();
  });
  it('rejects confidence/probability fields on Noul, not just ignores them', () => {
    expect(() => validateResponse({ ...routine(), answers: { ...routine().answers, fraud_signal: { type: 'noul', noul: .04, confidence: .92 } } }, buildRequest('validation'))).toThrow();
    expect(() => validateResponse({ ...routine(), answers: { ...routine().answers, liability: { type: 'noul', noul: .97, probabilities: { true: .97, false: .03 } } } }, buildRequest('validation'))).toThrow();
  });
});
