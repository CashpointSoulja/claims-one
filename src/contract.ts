export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type StructuredContent = string | JsonValue[] | { [key: string]: JsonValue };

export interface ChoiceQuestion {
  type: 'choice';
  instructions: StructuredContent;
  criteria: Record<string, StructuredContent | null>;
}
export interface ScoreQuestion {
  type: 'score';
  instructions: StructuredContent;
  criteria: StructuredContent[];
}
export interface NoulQuestion {
  type: 'noul';
  instructions: StructuredContent;
  criteria?: { true?: StructuredContent; false?: StructuredContent };
}
export type Question = ChoiceQuestion | ScoreQuestion | NoulQuestion;
export interface ChoiceAnswer {
  type: 'choice';
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
}
export interface ScoreAnswer {
  type: 'score';
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
}
export interface NoulAnswer { type: 'noul'; noul: number }
export type Answer = ChoiceAnswer | ScoreAnswer | NoulAnswer;
export interface SystemOneRequest { state: unknown; model: string; questions: Record<string, Question> }
export interface SystemOneResponse {
  model: string;
  answers: Record<string, Answer>;
  usage: { input_tokens: number; output_tokens: number };
}

// Published HTTP reference and primitive pages: Choice <=255; Score 2–10.
// No maximum question count is stated there. Do not confuse options with questions.
export const API_LIMITS = { choiceOptions: 255, scoreLevels: 10 } as const;
const EPSILON = 1e-6;
export class ContractError extends Error {
  constructor(message: string) { super(message); this.name = 'ContractError'; }
}
function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ContractError(message);
}
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}
function exactKeys(value: Record<string, unknown>, keys: string[], label: string) {
  const actual = Object.keys(value);
  requireValue(actual.length === keys.length && keys.every(key => Object.hasOwn(value, key)), `${label}: unexpected or missing keys`);
}
function isJson(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (!Array.isArray(value) && !record(value)) return false;
  if (seen.has(value)) return false;
  seen.add(value);
  const values = Array.isArray(value) ? Array.from(value) : Object.values(value);
  const valid = values.every(item => isJson(item, seen));
  seen.delete(value);
  return valid;
}
function content(value: unknown): value is StructuredContent {
  return (typeof value === 'string' || Array.isArray(value) || record(value)) && isJson(value);
}
function probability(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}
function near(a: number, b: number) { return Math.abs(a - b) <= EPSILON; }

export function choiceConfidence(values: readonly number[]): number {
  if (values.length === 1) return 1;
  return Math.max(0, Math.min(1, (values.length * Math.max(...values) - 1) / (values.length - 1)));
}
export function scoreConfidence(values: readonly number[]): number {
  const n = values.length;
  if (n < 2) throw new ContractError('A Score requires at least two levels');
  const peak = values.indexOf(Math.max(...values));
  const spread = values.reduce((sum, p, i) => sum + p * Math.abs(i - peak), 0);
  const evenSpread = values.reduce((sum, _, i) => sum + Math.abs(i - (n - 1) / 2), 0) / n;
  return Math.max(0, Math.min(1, 1 - spread / evenSpread));
}
export function expectedScore(values: readonly number[]): number {
  return values.reduce((sum, p, index) => sum + index * p, 0);
}
export function describeLevel(level: StructuredContent): string {
  return typeof level === 'string' ? level : JSON.stringify(level);
}

export function validateRequest(value: unknown): asserts value is SystemOneRequest {
  requireValue(record(value), 'Request must be an object');
  exactKeys(value, ['state', 'model', 'questions'], 'Request');
  requireValue(content(value.state), 'State must be a JSON string, object or array');
  requireValue(typeof value.model === 'string' && value.model.trim().length > 0, 'Model must be a nonempty string');
  requireValue(record(value.questions), 'Questions must be a map');
  requireValue(Object.keys(value.questions).length > 0, 'At least one question is required');
  for (const [id, question] of Object.entries(value.questions)) {
    requireValue(record(question), `Question ${id} must be an object`);
    requireValue(content(question.instructions), `Question ${id} instructions must be string, object or array`);
    if (question.type === 'choice') {
      exactKeys(question, ['type', 'instructions', 'criteria'], `Question ${id}`);
      requireValue(record(question.criteria), `Choice ${id} criteria must be a map`);
      const options = Object.values(question.criteria);
      requireValue(options.length >= 1 && options.length <= API_LIMITS.choiceOptions, `Choice ${id} needs 1–255 options`);
      requireValue(options.every(option => option === null || content(option)), `Choice ${id} has invalid criteria`);
    } else if (question.type === 'score') {
      exactKeys(question, ['type', 'instructions', 'criteria'], `Question ${id}`);
      requireValue(Array.isArray(question.criteria), `Score ${id} criteria must be an array`);
      requireValue(question.criteria.length >= 2 && question.criteria.length <= API_LIMITS.scoreLevels, `Score ${id} needs 2–10 levels`);
      requireValue(Array.from(question.criteria).every(content), `Score ${id} has invalid criteria`);
    } else if (question.type === 'noul') {
      exactKeys(question, Object.hasOwn(question, 'criteria') ? ['type', 'instructions', 'criteria'] : ['type', 'instructions'], `Question ${id}`);
      if (Object.hasOwn(question, 'criteria')) {
        requireValue(record(question.criteria), `Noul ${id} criteria must be a map`);
        requireValue(Object.entries(question.criteria).every(([key, entry]) => (key === 'true' || key === 'false') && content(entry)), `Noul ${id} accepts only true/false descriptions`);
      }
    } else throw new ContractError(`Question ${id} has an unknown type`);
  }
}
function validateDistribution(value: unknown, keys: string[], label: string): number[] {
  requireValue(record(value), `${label} must be a probability map`);
  exactKeys(value, keys, label);
  const values = keys.map(key => value[key]);
  requireValue(values.every(probability), `${label} probabilities must be finite and in [0,1]`);
  requireValue(near(values.reduce((sum, p) => sum + p, 0), 1), `${label} probabilities must sum to 1`);
  return values;
}
export function validateResponse(value: unknown, request: SystemOneRequest): asserts value is SystemOneResponse {
  validateRequest(request);
  requireValue(record(value), 'Response must be an object');
  exactKeys(value, ['model', 'answers', 'usage'], 'Response');
  requireValue(typeof value.model === 'string' && value.model.trim().length > 0, 'Response model must be a nonempty string');
  requireValue(record(value.usage), 'Usage must be an object');
  exactKeys(value.usage, ['input_tokens', 'output_tokens'], 'Usage');
  requireValue(Object.values(value.usage).every(count => typeof count === 'number' && Number.isSafeInteger(count) && count >= 0), 'Usage counts must be nonnegative integers');
  requireValue(record(value.answers), 'Answers must be a map');
  exactKeys(value.answers, Object.keys(request.questions), 'Answers');
  for (const [id, question] of Object.entries(request.questions)) {
    const answer = value.answers[id];
    requireValue(record(answer) && answer.type === question.type, `Answer ${id} type does not match question`);
    if (question.type === 'noul') {
      exactKeys(answer, ['type', 'noul'], `Noul ${id}`);
      requireValue(probability(answer.noul), `Noul ${id} must be finite and in [0,1]`);
    } else if (question.type === 'choice') {
      exactKeys(answer, ['type', 'choice', 'probabilities', 'confidence'], `Choice ${id}`);
      const keys = Object.keys(question.criteria);
      const values = validateDistribution(answer.probabilities, keys, `Choice ${id}`);
      requireValue(typeof answer.choice === 'string' && keys.includes(answer.choice), `Choice ${id} selected an unknown option`);
      requireValue(near(values[keys.indexOf(answer.choice)], Math.max(...values)), `Choice ${id} must select a highest-probability option`);
      requireValue(probability(answer.confidence) && near(answer.confidence, choiceConfidence(values)), `Choice ${id} confidence does not match distribution`);
    } else {
      exactKeys(answer, ['type', 'score', 'legend', 'probabilities', 'confidence'], `Score ${id}`);
      const keys = question.criteria.map((_, index) => String(index));
      const values = validateDistribution(answer.probabilities, keys, `Score ${id}`);
      requireValue(record(answer.legend), `Score ${id} requires a legend`);
      exactKeys(answer.legend, keys, `Score ${id} legend`);
      for (const [index, level] of question.criteria.entries()) {
        const description = answer.legend[String(index)];
        requireValue(typeof description === 'string', `Score ${id} legend descriptions must be strings`);
        // The HTTP contract specifies string legends but does not prescribe serialization of structured levels.
        if (typeof level === 'string') requireValue(description === level, `Score ${id} legend must match criteria`);
      }
      requireValue(typeof answer.score === 'number' && Number.isFinite(answer.score) && answer.score >= 0 && answer.score <= values.length - 1 && near(answer.score, expectedScore(values)), `Score ${id} must equal the zero-based probability-weighted mean`);
      requireValue(probability(answer.confidence) && near(answer.confidence, scoreConfidence(values)), `Score ${id} confidence does not match distribution`);
    }
  }
}
export function isValidResponse(value: unknown, request: SystemOneRequest): value is SystemOneResponse {
  try { validateResponse(value, request); return true; } catch { return false; }
}
