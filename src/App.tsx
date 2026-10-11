import { useMemo, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { Answer, Question, SystemOneRequest, SystemOneResponse } from './contract';
import { CLAIM_QUESTIONS, buildRequest } from './questions';
import { CLAIMS } from './samples';
import { evaluateClaim } from './adapter';
import { routeClaim } from './routing';
import routingSource from './routing.ts?raw';
import { calculateEconomics } from './economics';
import { EVAL_ROWS, evaluateThreshold, calibrationBins, escalationBreakdown } from './evals';

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;
const percent = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`;
const number = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const dollars = (value: number, digits = 2) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
const MIN_TEXT = 20;
const MAX_TEXT = 12000;
const QUESTION_LABELS: Record<string, { title: string; description: string }> = {
  claim_type: { title: 'Claim type', description: 'Classify the reported event.' },
  severity: { title: 'Clinical severity', description: 'Rate urgency, not entitlement.' },
  fraud_signal: { title: 'Integrity signal', description: 'An inconsistency to investigate, not a fraud finding.' },
  liability: { title: 'Policy alignment', description: 'Does the supplied synthetic evidence align?' },
  documentation_completeness: { title: 'Documentation', description: 'Are the stated records complete?' },
  churn_risk: { title: 'Churn risk', description: 'Route expressed service frustration.' },
};
const DOCUMENTS = [
  { file: 'README.md', title: 'Start here', text: 'What this is, how to run it, and the adapter boundary.', group: 'Engineering' },
  { file: 'PRD.md', title: 'The product brief', text: 'Problem, users, requirements, and success criteria.', group: 'Product' },
  { file: 'FIVE-WHYS.md', title: 'Get to the root', text: 'Five whys behind the claims-triage problem.', group: 'Product' },
  { file: 'JTBD.md', title: 'The job to be done', text: 'The operator, developer, and policyholder perspective.', group: 'Product' },
  { file: 'METRICS.md', title: 'Measure what matters', text: 'A metrics tree, with safety ahead of automation.', group: 'Product' },
  { file: 'VIABILITY.md', title: 'Why this direction', text: 'Product direction, developer empathy, and a path forward.', group: 'Product' },
  { file: 'ROADMAP.md', title: 'Beyond this reference', text: 'Production evaluation and more vertical templates.', group: 'Product' },
  { file: 'DECISIONS.md', title: 'Decisions, recorded', text: 'The tradeoffs behind the implementation.', group: 'Engineering' },
  { file: 'TEST-PLAN.md', title: 'What needs proving', text: 'Contract, safety, accessibility, and deployment checks.', group: 'Verification' },
  { file: 'TEST-RESULTS.md', title: 'What was actually run', text: 'Recorded results and the remaining verification work.', group: 'Verification' },
  { file: 'AGENTS.md', title: 'Maintainer context', text: 'Standing requirements for future repository work.', group: 'Engineering' },
  { file: 'BRAND.md', title: 'The visual reference', text: 'Observed brand details, interpretation, and rights caveats.', group: 'Brand' },
  { file: 'SOURCES.md', title: 'Follow the evidence', text: 'Public source ledger and what each reference can prove.', group: 'Verification' },
  { file: 'LICENSE.md', title: 'Rights & reuse', text: 'First-party code license and third-party brand exclusions.', group: 'Engineering' },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}
function SectionHeading({ index, eyebrow, title, children, dark = false }: { index: string; eyebrow: string; title: ReactNode; children?: ReactNode; dark?: boolean }) {
  return <div className={`section-heading${dark ? ' on-dark' : ''}`}>
    <div className="section-eyebrow"><span>{index} /</span> {eyebrow}</div>
    <div className="section-heading-row"><h2>{title}</h2>{children && <div className="section-intro">{children}</div>}</div>
  </div>;
}
function ThresholdControl({ value, onChange, id }: { value: number; onChange: (value: number) => void; id: string }) {
  return <div className="threshold-control">
    <div className="threshold-label"><label htmlFor={id}>Autonomy threshold</label><output htmlFor={id}>{percent(value)}</output></div>
    <input id={id} type="range" min="0.5" max="0.99" step="0.01" value={value} onChange={event => onChange(Number(event.target.value))} aria-valuetext={`${percent(value)} minimum confidence`} />
    <div className="range-labels"><span>50% · more delegation</span><span>99% · more review</span></div>
  </div>;
}
function ProbabilityBars({ answer }: { answer: Exclude<Answer, { type: 'noul' }> }) {
  const entries = Object.entries(answer.probabilities);
  const maximum = Math.max(...entries.map(([, probability]) => probability));
  return <div className="distribution" aria-label="Full returned probability distribution">
    {entries.map(([key, probability]) => <div className="probability-row" key={key}>
      <div className="probability-label"><span title={answer.type === 'score' ? answer.legend[key] : key}>{answer.type === 'score' ? answer.legend[key] : key}</span><span>{percent(probability, 1)}</span></div>
      <svg viewBox="0 0 240 7" preserveAspectRatio="none" role="img" aria-label={`${answer.type === 'score' ? answer.legend[key] : key}: ${percent(probability, 1)}`}>
        <rect width="240" height="7" rx="2" className="bar-track" />
        <rect width={probability * 240} height="7" rx="2" className={probability === maximum ? 'bar-selected' : 'bar-other'} />
      </svg>
    </div>)}
  </div>;
}
function QuestionCard({ id, question, answer, index, threshold }: { id: string; question: Question; answer?: Answer; index: number; threshold: number }) {
  const labels = QUESTION_LABELS[id];
  return <article className={`question-card ${answer ? 'has-answer' : 'awaiting-answer'}`}>
    <div className="question-topline"><span className="question-index">Q{String(index + 1).padStart(2, '0')}</span><span className={`primitive primitive-${question.type}`}>{question.type}</span></div>
    <h4>{labels?.title ?? id}</h4><code className="question-id">{id}</code>
    {!answer ? <div className="question-empty"><p>{labels?.description}</p><span>{question.type === 'choice' ? `${Object.keys(question.criteria).length} named options` : question.type === 'score' ? `${question.criteria.length} ordered levels` : 'One probability of yes'}</span><div className="empty-grid" aria-hidden="true"><i /><i /><i /><i /><i /></div><p className="waiting-label">Waiting for a demo batch.</p></div>
      : answer.type === 'noul' ? <div className="noul-answer">
        <div className="answer-value">{percent(answer.noul, 1)}</div><p className="answer-caption">Probability of yes</p>
        <svg className="noul-gauge" viewBox="0 0 240 38" role="img" aria-label={`Probability of yes ${percent(answer.noul, 1)}, on a scale from no at zero to yes at one`}>
          <rect x="0" y="12" width="240" height="8" rx="3" className="bar-track" />
          <rect x="0" y="12" width={answer.noul * 240} height="8" rx="3" className={id === 'fraud_signal' ? 'bar-selected' : 'bar-policy'} />
          <line x1="120" x2="120" y1="9" y2="23" className="gauge-midpoint" />
          <circle cx={Math.max(4, Math.min(236, answer.noul * 240))} cy="16" r="4" className="gauge-point" />
        </svg>
        <div className="range-labels"><span>0 · No</span><span>1 · Yes</span></div>
        <p className="noul-explanation">{labels?.description}</p>
        <p className="contract-note">Noul returns only a value. No separate confidence or distribution.</p>
      </div> : <>
        <div className={`answer-value ${answer.type === 'choice' ? 'choice-value' : ''}`}>{answer.type === 'choice' ? answer.choice : <>{(answer.score + 1).toFixed(2)}<span> / 5</span></>}</div>
        <p className="answer-caption">{answer.type === 'choice' ? 'Highest-probability option' : 'Probability-weighted mean · displayed 1–5'}</p>
        <ProbabilityBars answer={answer} />
        {answer.type === 'score' && <p className="score-note">Display = API score + 1. Raw score: {answer.score.toFixed(3)} (0–4).</p>}
        <div className="confidence-line"><span>Returned confidence</span><strong className={answer.confidence >= threshold ? 'confidence-above' : 'confidence-below'}>{percent(answer.confidence, 1)}</strong></div>
      </>}
    <details className="rubric-details"><summary>Question & rubric</summary><pre>{JSON.stringify(question, null, 2)}</pre></details>
  </article>;
}

function Triage({ threshold, onThreshold }: { threshold: number; onThreshold: (value: number) => void }) {
  const initial = CLAIMS.find(claim => /dental/i.test(claim.title)) ?? CLAIMS[0];
  const [text, setText] = useState(initial?.text ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ response: SystemOneResponse; request: SystemOneRequest; runtime: number } | null>(null);
  const [wireView, setWireView] = useState<'request' | 'response'>('request');
  const [wireOpen, setWireOpen] = useState(false);
  const generation = useRef(0);
  const inFlight = useRef(false);
  const request = useMemo(() => buildRequest(text), [text]);
  const selected = CLAIMS.find(claim => claim.text === text);
  const validText = text.trim().length >= MIN_TEXT && text.length <= MAX_TEXT;
  const decision = result ? routeClaim(result.response, threshold) : null;
  function changeText(value: string) {
    generation.current += 1;
    inFlight.current = false;
    setBusy(false);
    setText(value);
    setResult(null);
    setError('');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    if (!validText) { setError(`Enter ${MIN_TEXT}–${number(MAX_TEXT)} characters for this demo.`); return; }
    const ticket = ++generation.current;
    const submitted = buildRequest(text);
    inFlight.current = true;
    setBusy(true);
    setError('');
    setResult(null);
    const started = performance.now();
    try {
      const response = await evaluateClaim(submitted);
      if (ticket !== generation.current) return;
      setResult({ response, request: submitted, runtime: performance.now() - started });
    } catch (caught) {
      if (ticket !== generation.current) return;
      setError(caught instanceof Error ? caught.message : 'The demo batch could not be evaluated. Please try again.');
    } finally {
      if (ticket === generation.current) { inFlight.current = false; setBusy(false); }
    }
  }
  return <section id="triage" className="triage-section anchor-section" aria-labelledby="triage-title">
    <div className="triage-sky" aria-hidden="true" />
    <div className="page-container">
      <SectionHeading index="01" eyebrow="THE WORKING REFERENCE" title={<span id="triage-title">Put uncertainty<br />to work.</span>}><p>One claim in. Six typed answers out.<br />You set the threshold. Code sets the guardrails.</p></SectionHeading>
      <div className="console-window">
        <div className="window-bar"><div><span className="window-dot" /> claims-one / triage</div><span className="mode-badge">Mock demo</span></div>
        <div className="console-grid">
          <aside className="claim-editor">
            <div className="editor-heading"><span className="small-label">STATE / FIRST NOTICE OF LOSS</span><h3>A claim, not a prompt.</h3><p>Twelve synthetic pet claims. No real policyholder data.</p></div>
            <form onSubmit={submit} noValidate>
              <label htmlFor="claim-sample">Load a synthetic claim</label>
              <select id="claim-sample" value={selected?.id ?? ''} onChange={event => { const claim = CLAIMS.find(item => item.id === event.target.value); if (claim) changeText(claim.text); }}>
                <option value="" disabled>Custom / edited claim</option>
                {CLAIMS.map((claim, index) => <option value={claim.id} key={claim.id}>{String(index + 1).padStart(2, '0')} · {claim.title}</option>)}
              </select>
              <div className="sample-shortcuts" aria-label="Quick-load synthetic claims">
                {CLAIMS.filter(claim => /dental|string|chocolate|pre.existing/i.test(`${claim.title} ${claim.category}`)).slice(0, 4).map(claim => <button type="button" key={claim.id} className={selected?.id === claim.id ? 'sample-active' : ''} aria-pressed={selected?.id === claim.id} onClick={() => changeText(claim.text)}>{claim.title}</button>)}
              </div>
              <div className="text-label"><label htmlFor="claim-text">Claim narrative & supplied evidence</label><span>{selected ? 'Fixture' : 'Custom'}</span></div>
              <textarea id="claim-text" value={text} onChange={event => changeText(event.target.value)} maxLength={MAX_TEXT} rows={14} aria-describedby="claim-text-help claim-text-count" aria-invalid={!validText} spellCheck="false" />
              <div id="claim-text-count" className="character-count">{number(text.length)} / {number(MAX_TEXT)} characters</div>
              <p id="claim-text-help" className="field-help">Demo input: {MIN_TEXT}–{number(MAX_TEXT)} characters. Edited text uses generic, uncertain outputs and stays with a human. Do not paste personal data.</p>
              <button className="button button-pink submit-button" type="submit" disabled={busy || !validText}>{busy ? <><span className="spinner" aria-hidden="true" /> Evaluating demo batch…</> : <>Evaluate claim <Arrow /></>}</button>
              <p className="batch-label">ONE BATCH · SIX INDEPENDENT QUESTIONS</p>
              <div role="status" aria-live="polite" className="submit-status">{busy ? 'Evaluating synthetic demo data; no live model call.' : result ? 'Demo batch complete. Six typed answers ready.' : 'Ready when you are.'}</div>
              {error && <p className="form-error" role="alert">{error}</p>}
            </form>
            <div className="editor-note"><span>NUANCE</span><p>This is a simulation, not a payment, coverage, medical, or fraud determination.</p></div>
          </aside>
          <div className="answers-workspace" aria-busy={busy}>
            <div className="answers-header"><div><span className="small-label">ATOMIC QUESTIONS / COMPOSED IN CODE</span><h3>Decisions with a shape.</h3></div><span className="answer-count">{result ? '06 / 06' : '00 / 06'}<small>typed answers</small></span></div>
            <div className="question-grid">{Object.entries(CLAIM_QUESTIONS).map(([id, question], index) => <QuestionCard id={id} question={question} answer={result?.response.answers[id]} index={index} key={id} threshold={threshold} />)}</div>
            <div className="routing-panel">
              <div className="routing-controls"><ThresholdControl id="triage-threshold" value={threshold} onChange={onThreshold} /><p>Every required confidence must pass. Safety holds stay in place at any threshold.</p><button className="text-button" type="button" onClick={() => { const dental = CLAIMS.find(claim => /dental/i.test(claim.title)); if (dental) changeText(dental.text); }}>Try routine dental: 85% → 65% <Arrow /></button></div>
              <div className={`routing-decision ${decision?.autonomous ? 'route-autonomous' : decision?.action === 'urgent_review' ? 'route-urgent' : 'route-review'}`} role="status" aria-live="polite" aria-atomic="true">
                <div className="route-eyebrow"><span className="small-label">SIMULATED ROUTING</span>{decision && <span className="route-tag">{decision.autonomous ? 'Autonomous path' : 'Human in the loop'}</span>}</div>
                <h4>{decision ? decision.label : 'An adjuster stays in control.'}</h4>
                {decision ? <><ul>{decision.reasons.map((reason, index) => <li key={`${index}-${reason}`}>{reason}</li>)}</ul><p className="routing-confidence">Routing confidence: {percent(decision.confidence, 1)} · threshold: {percent(threshold)}</p></> : <p>Evaluate a sample to see the composed route. The routine dental fixture demonstrates the threshold tradeoff; urgent, disputed, or incomplete claims are always held.</p>}
                <p className="simulation-note">All actions simulated. Nothing is paid, denied, or reported.</p>
              </div>
            </div>
            <div className="wire-header"><button className="text-button" type="button" aria-expanded={wireOpen} aria-controls="wire-contract" onClick={() => setWireOpen(!wireOpen)}>{wireOpen ? '−' : '+'} Inspect the single-batch contract</button>{result && <span className="demo-runtime">Local demo runtime: {result.runtime.toFixed(1)} ms · not Jev latency</span>}</div>
            {wireOpen && <div id="wire-contract" className="wire-panel"><div className="segmented-control" aria-label="Contract view"><button type="button" aria-pressed={wireView === 'request'} onClick={() => setWireView('request')}>Request</button><button type="button" aria-pressed={wireView === 'response'} onClick={() => setWireView('response')}>Raw response</button></div><p className="contract-note">Published API shape. Mock response usage is zero: no API ran. Rough token sizing is a separate estimate, never a response counter. Score stays zero-based in raw JSON. Noul has no confidence field.</p><pre tabIndex={0} aria-label={wireView === 'request' ? 'Single batch JSON request' : 'Raw mock JSON response'}>{wireView === 'request' ? JSON.stringify(result?.request ?? request, null, 2) : result ? JSON.stringify(result.response, null, 2) : '// Evaluate a claim to see its raw mock response.'}</pre></div>}
          </div>
        </div>
        <div className="console-footer"><span>Reference implementation on the published TypeSafe AI API contract.</span><a href="https://docs.typesafe.ai/api" target="_blank" rel="noreferrer">Read the contract <Arrow diagonal /></a></div>
      </div>
    </div>
  </section>;
}

function Workflow() {
  const [view, setView] = useState<'questions' | 'routing'>('questions');
  const [copied, setCopied] = useState('');
  const generated = `// Actual exported question definitions; one shared state.\nconst questions = ${JSON.stringify(CLAIM_QUESTIONS, null, 2)};\n\n// Application composition. Every question is independent.\nconst request = buildRequest(claimText);\nconst response = await evaluateClaim(request);\nconst decision = routeClaim(response, threshold);\n// Render a simulated route. Never execute a payment or denial.`;
  const code = view === 'questions' ? generated : routingSource;
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied('Copied.'); }
    catch { setCopied('Clipboard unavailable. Select and copy the code below.'); }
  }
  return <section id="workflow" className="workflow-section anchor-section"><div className="page-container">
    <SectionHeading index="02" eyebrow="THE COMPOSITION" title={<>Small questions.<br />Explicit decisions.</>}><p>No hidden chain of thought. Each question sees the same state. The final route is ordinary, inspectable TypeScript.</p></SectionHeading>
    <div className="workflow-graph" aria-label="Shared claim state fans out to six independent questions, then typed answers are composed by the routing function">
      <div className="graph-end"><span className="small-label">INPUT</span><strong>Claim state</strong><code>string + evidence</code></div>
      <div className="graph-fan" role="list">{Object.entries(CLAIM_QUESTIONS).map(([id, question]) => <div className="graph-question" role="listitem" key={id}><code>{id}</code><span className={`primitive primitive-${question.type}`}>{question.type}</span></div>)}</div>
      <div className="graph-end graph-output"><span className="small-label">COMPOSE IN CODE</span><strong>Simulated route</strong><code>routeClaim(response,<br />threshold)</code><span>Safety holds → human review</span></div>
    </div>
    <div className="code-window"><div className="code-toolbar"><div className="segmented-control" aria-label="Workflow code view"><button type="button" aria-pressed={view === 'questions'} onClick={() => { setView('questions'); setCopied(''); }}>Question definitions</button><button type="button" aria-pressed={view === 'routing'} onClick={() => { setView('routing'); setCopied(''); }}>Actual routing source</button></div><button type="button" className="copy-button" onClick={copy}>Copy code <Arrow /></button></div><div className="copy-status" role="status">{copied}</div><pre tabIndex={0} aria-label={view === 'questions' ? 'Actual question definitions and application composition' : 'Actual shared routing module source'}><code>{code}</code></pre></div>
    <div className="nuance"><span>NUANCE</span><p>Typed answers are not policy authority. Confidence gates are necessary, not sufficient: integrity signals, uncertain policy evidence, incomplete documentation, disputes, and urgency independently keep a person in the loop.</p></div>
  </div></section>;
}
function ComparisonChart({ title, jev, comparison, formatter, unit }: { title: string; jev: number; comparison: number; formatter: (value: number) => string; unit: string }) {
  const max = Math.max(jev, comparison, 0.000001);
  return <div className="comparison-chart"><h4>{title}</h4><svg viewBox="0 0 540 170" role="img" aria-label={`${title}. Jev illustration ${formatter(jev)}. Ratio-derived comparator ${formatter(comparison)}. Linear scale in ${unit}; not independent benchmarking.`}>
    <text x="0" y="20" className="chart-label">Jev illustration</text><text x="535" y="20" textAnchor="end" className="chart-value">{formatter(jev)}</text>
    <rect x="0" y="31" width="535" height="24" className="light-chart-track" /><rect x="0" y="31" width={535 * jev / max} height="24" className="chart-pink-fill" />
    <text x="0" y="87" className="chart-label">Ratio-derived comparator</text><text x="535" y="87" textAnchor="end" className="chart-value">{formatter(comparison)}</text>
    <rect x="0" y="98" width="535" height="24" className="light-chart-track" /><rect x="0" y="98" width={535 * comparison / max} height="24" className="chart-ink-fill" />
    <text x="0" y="154" className="chart-tick">0 {unit}</text><text x="535" y="154" textAnchor="end" className="chart-tick">{formatter(max)} · linear scale</text>
  </svg></div>;
}
function Economics() {
  const [claims, setClaims] = useState('50000');
  const [tokens, setTokens] = useState('1500');
  const workload = Number(claims);
  const input = Number(tokens);
  const valid = claims.trim() !== '' && tokens.trim() !== '' && Number.isSafeInteger(workload) && workload >= 0 && workload <= 10000000 && Number.isSafeInteger(input) && input > 0 && input <= 1000000;
  const economics = valid ? calculateEconomics(workload, input) : null;
  return <section id="economics" className="economics-section anchor-section"><div className="page-container">
    <SectionHeading index="03" eyebrow="THE ECONOMICS" title={<>Fast is useful.<br />Cheap is useful, too.</>}><p>Start with a workload. Inspect the units. Keep published results separate from measured performance.</p></SectionHeading>
    <div className="economics-layout"><div className="calculator-controls"><span className="small-label">YOUR ILLUSTRATIVE WORKLOAD</span><label htmlFor="monthly-claims">Claims per month</label><input id="monthly-claims" type="number" inputMode="numeric" min="0" max="10000000" step="1000" value={claims} onChange={event => setClaims(event.target.value)} aria-describedby="economics-input-help" aria-invalid={!valid} /><label htmlFor="input-tokens">Input tokens per claim</label><input id="input-tokens" type="number" inputMode="numeric" min="1" max="1000000" step="100" value={tokens} onChange={event => setTokens(event.target.value)} aria-describedby="economics-input-help" aria-invalid={!valid} /><p id="economics-input-help">Include claim state and all six question rubrics. Output tokens are free in the published Jev pricing.</p><div className="token-total"><span>Monthly input tokens</span><strong>{valid ? number(workload * input) : '—'}</strong></div>{!valid && <p className="form-error" role="alert">Use whole numbers: 0–10,000,000 claims and 1–1,000,000 input tokens per claim.</p>}<a className="source-link" href="https://typesafe.ai/blog/introducing-system-one-models-and-jev" target="_blank" rel="noreferrer">Published pricing & nuance <Arrow diagonal /></a></div>
      <div className="economics-output" aria-live="polite"><div className="cost-headline"><span className="small-label">ILLUSTRATIVE JEV INPUT COST / MONTH</span><div>{economics ? dollars(economics.jevCost) : '—'}</div><p>$42 per billion input tokens. Output free.</p></div><div className="economics-stat-row"><div><span>Illustrative per-claim cost</span><strong>{economics ? dollars(input * 42 / 1000000000, 6) : '—'}</strong></div><div><span>Ratio-derived monthly comparator</span><strong>{economics ? dollars(economics.impliedLlmCost) : '—'}</strong></div></div><div className="economics-charts">{economics ? <><ComparisonChart title="Monthly input cost" jev={economics.jevCost} comparison={economics.impliedLlmCost} formatter={dollars} unit="USD" /><ComparisonChart title="Illustrative request latency" jev={economics.jevLatencyMs} comparison={economics.impliedLlmLatencyMs} formatter={value => `${number(value)} ms`} unit="ms" /></> : <p className="empty-chart">Enter a valid workload to calculate the comparison.</p>}</div></div>
    </div>
    <div className="economics-assumptions"><div><span className="small-label">COST ASSUMPTION</span><p><code>claims × input tokens × $42 ÷ 1,000,000,000</code><br />Comparator = illustrative Jev cost × 444.6.</p></div><div><span className="small-label">LATENCY ASSUMPTION</span><p>114 ms illustrative Jev request; published range 70–500 ms.<br />Comparator = 114 ms × 193.6. Not a monthly duration.</p></div></div>
    <div className="nuance"><span>NUANCE</span><p>193.6× faster and 444.6× cheaper are TypeSafe AI’s published results for a specific workflow, likely toward the higher end of real-world gains. They are not measured Claims One benefits. The ratio-derived LLM comparator is not independent pricing or a benchmark. This calculator excludes infrastructure, human review, policy checks, retries, and evaluation.</p></div>
  </div></section>;
}

function CalibrationChart({ bins }: { bins: ReturnType<typeof calibrationBins> }) {
  const populated = bins.filter(bin => bin.count > 0);
  const largest = Math.max(1, ...populated.map(bin => bin.count));
  return <div className="eval-chart"><div className="chart-heading"><h3>Confidence ≠ proof.</h3><span>Calibration / synthetic</span></div>
    {populated.length === 0 ? <p className="empty-chart">No synthetic rows available for calibration.</p> : <svg viewBox="0 0 560 310" role="img" aria-label={`Synthetic confidence versus observed synthetic accuracy. ${populated.map(bin => `${bin.label}, ${bin.count} rows, mean confidence ${percent(bin.meanConfidence, 1)}, accuracy ${percent(bin.accuracy, 1)}`).join('; ')}. Not live calibration evidence.`}>
      {[0, 0.25, 0.5, 0.75, 1].map(tick => <g key={tick}><line x1="55" x2="530" y1={255 - tick * 205} y2={255 - tick * 205} className="chart-grid-line" /><text x="43" y={259 - tick * 205} textAnchor="end" className="chart-tick">{percent(tick)}</text><text x={55 + tick * 475} y="280" textAnchor="middle" className="chart-tick">{percent(tick)}</text></g>)}
      <line x1="55" x2="530" y1="255" y2="50" className="chart-ideal" /><text x="65" y="27" className="chart-label">Accuracy</text><text x="292" y="306" textAnchor="middle" className="chart-tick">Mean returned confidence</text>
      {populated.map(bin => <g key={bin.label}><circle cx={55 + bin.meanConfidence * 475} cy={255 - bin.accuracy * 205} r={5 + Math.sqrt(bin.count / largest) * 5} className="calibration-point" /><title>{`${bin.label}: n=${bin.count}, confidence ${percent(bin.meanConfidence, 1)}, accuracy ${percent(bin.accuracy, 1)}`}</title></g>)}
    </svg>}
    <div className="chart-legend"><span><i className="legend-pink" />Synthetic bin · size = row count</span><span><i className="legend-dashed" />Perfect calibration reference</span></div><p className="chart-method">Confidence = minimum required Choice/Score confidence. Accuracy = baseline simulated route versus synthetic truth, within each bin.</p>
    <details className="chart-data"><summary>Inspect bin counts & values</summary><div className="table-scroll"><table><caption>Synthetic calibration bins</caption><thead><tr><th>Bin</th><th>Rows</th><th>Mean confidence</th><th>Accuracy</th></tr></thead><tbody>{bins.map(bin => <tr key={bin.label}><th scope="row">{bin.label}</th><td>{bin.count}</td><td>{bin.count ? percent(bin.meanConfidence, 1) : 'No data'}</td><td>{bin.count ? percent(bin.accuracy, 1) : 'No data'}</td></tr>)}</tbody></table></div></details>
  </div>;
}
function TradeoffChart({ threshold }: { threshold: number }) {
  const points = useMemo(() => Array.from({ length: 21 }, (_, index) => { const value = index / 20; return { threshold: value, ...evaluateThreshold(value) }; }), []);
  const path = points.map((point, index) => `${index ? 'L' : 'M'}${55 + point.threshold * 475},${255 - point.autonomyRate * 205}`).join(' ');
  let previousHasAccuracy = false;
  const accuracyPath = points.map(point => {
    if (point.autonomousAccuracy === null) { previousHasAccuracy = false; return ''; }
    const part = `${previousHasAccuracy ? 'L' : 'M'}${55 + point.threshold * 475},${255 - point.autonomousAccuracy * 205}`;
    previousHasAccuracy = true;
    return part;
  }).join(' ');
  return <div className="eval-chart"><div className="chart-heading"><h3>More autonomy. More care.</h3><span>Threshold tradeoff / synthetic</span></div>
    <svg viewBox="0 0 560 310" role="img" aria-label={`Synthetic autonomy rate and autonomous accuracy across confidence thresholds. Current threshold ${percent(threshold)}. Accuracy has gaps where no claims are autonomous. See the data table for counts and denominators.`}>
      {[0, 0.25, 0.5, 0.75, 1].map(tick => <g key={tick}><line x1="55" x2="530" y1={255 - tick * 205} y2={255 - tick * 205} className="chart-grid-line" /><text x="43" y={259 - tick * 205} textAnchor="end" className="chart-tick">{percent(tick)}</text><text x={55 + tick * 475} y="280" textAnchor="middle" className="chart-tick">{percent(tick)}</text></g>)}
      <text x="65" y="27" className="chart-label">Rate / accuracy</text><text x="292" y="306" textAnchor="middle" className="chart-tick">Minimum confidence threshold</text>
      <path d={path} className="chart-line-autonomy" />{accuracyPath && <path d={accuracyPath} className="chart-line-accuracy" />}<line x1={55 + threshold * 475} x2={55 + threshold * 475} y1="40" y2="255" className="chart-current" /><text x={Math.min(500, 55 + threshold * 475)} y="34" textAnchor="middle" className="chart-current-label">{percent(threshold)}</text>
    </svg><div className="chart-legend"><span><i className="legend-pink" />Autonomy / all rows</span><span><i className="legend-green" />Accuracy / autonomous rows</span></div>
    <details className="chart-data"><summary>Inspect threshold counts & values</summary><div className="table-scroll"><table><caption>Synthetic threshold tradeoff (5-point increments)</caption><thead><tr><th>Threshold</th><th>Autonomous / total</th><th>Correct / autonomous</th><th>Autonomy</th><th>Accuracy</th></tr></thead><tbody>{points.map(point => <tr key={point.threshold}><th scope="row">{percent(point.threshold)}</th><td>{point.autonomous} / {point.total}</td><td>{point.correctAutonomous} / {point.autonomous}</td><td>{percent(point.autonomyRate, 1)}</td><td>{point.autonomousAccuracy === null ? 'No autonomous rows' : percent(point.autonomousAccuracy, 1)}</td></tr>)}</tbody></table></div></details>
  </div>;
}
function Evaluation({ threshold, onThreshold }: { threshold: number; onThreshold: (value: number) => void }) {
  const metrics = evaluateThreshold(threshold);
  const bins = useMemo(() => calibrationBins(), []);
  const breakdown = escalationBreakdown(threshold);
  const maxReasonCount = Math.max(1, ...breakdown.map(row => row.count));
  return <section id="evaluation" className="evaluation-section anchor-section"><div className="page-container">
    <SectionHeading index="04" eyebrow="THE EVALUATION" dark title={<>Show your work.<br />Especially the doubt.</>}><p>Deterministic synthetic cases, explicit truth labels, real calculations. A surface for evaluation—not evidence of live model accuracy.</p></SectionHeading>
    <div className="eval-toolbar"><div><span className="mode-badge">Synthetic / illustrative</span><p>{number(EVAL_ROWS.length)} synthetic rows · shared routing logic · no live usage</p></div><ThresholdControl id="evaluation-threshold" value={threshold} onChange={onThreshold} /></div>
    <div className="eval-metrics" aria-live="polite"><div><span>Autonomy rate</span><strong>{percent(metrics.autonomyRate, 1)}</strong><small>{metrics.autonomous} / {metrics.total} synthetic claims</small></div><div><span>Autonomous accuracy</span><strong>{metrics.autonomousAccuracy === null ? '—' : percent(metrics.autonomousAccuracy, 1)}</strong><small>{metrics.autonomousAccuracy === null ? 'No autonomous cases at this threshold' : `${metrics.correctAutonomous} correct / ${metrics.autonomous} autonomous`}</small></div><div><span>Human escalation</span><strong>{number(metrics.escalated)}</strong><small>{metrics.escalated} / {metrics.total} synthetic claims</small></div></div>
    <div className="eval-chart-grid"><CalibrationChart bins={bins} /><TradeoffChart threshold={threshold} /></div>
    <div className="escalation-panel"><div><span className="small-label">SAFETY HOLDS / REASON COUNTS</span><h3>What stays<br />with a person?</h3><p>Thresholds change delegation. They never switch off safety holds.</p><p className="contract-note">One primary reason per escalated claim; counts sum to {metrics.escalated}. Safety holds take precedence over threshold reasons.</p></div><div className="escalation-bars">{breakdown.length ? breakdown.map(row => <div className="escalation-row" key={row.reason}><div><span>{row.reason}</span><strong>{row.count}<small> cases</small></strong></div><svg viewBox="0 0 560 9" preserveAspectRatio="none" role="img" aria-label={`${row.reason}: ${row.count} synthetic cases at ${percent(threshold)} threshold`}><rect width="560" height="9" rx="3" className="bar-track" /><rect width={row.count / maxReasonCount * 560} height="9" rx="3" className="bar-selected" /></svg></div>) : <p className="empty-chart">No escalation reasons at this threshold.</p>}</div></div>
    <div className="nuance nuance-dark"><span>NUANCE</span><p>Synthetic data can make the interface inspectable; it cannot establish calibration, safety, or real-world benefit. These charts are calculated from labeled fixtures, not measured Jev predictions. Production needs representative held-out data, subgroup analysis, policy validation, monitoring, and human oversight.</p></div>
  </div></section>;
}
function Documentation() {
  return <section id="docs" className="docs-section anchor-section"><div className="page-container">
    <SectionHeading index="05" eyebrow="THE DOCUMENTATION" title={<>The thinking<br />ships, too.</>}><p>Product, engineering, and verification in the open. Read the assumptions, not just the headline.</p></SectionHeading>
    <div className="docs-grid">{DOCUMENTS.map((document, index) => <a href={asset(`docs/${document.file.replace(/\.md$/, '.html')}`)} className="doc-link" key={document.file}><div className="doc-topline"><span>{String(index + 1).padStart(2, '0')} / {document.group}</span><Arrow diagonal /></div><h3>{document.title}</h3><p>{document.text}</p><code>{document.file}</code></a>)}</div>
    <div className="brand-guide-link"><p>The literal homepage, the console adaptation, and the rights caveats.</p><a href={asset('docs/brand/index.html')}>Open the visual brand study <Arrow diagonal /></a></div>
    <div className="faq"><div><span className="small-label">A LITTLE MORE NUANCE</span><h2>We give<br />a FAQ.</h2></div><div className="faq-items">
      <details><summary>Is this connected to Jev?</summary><p>No. The default experience is a visibly labeled mock demo on the published TypeSafe AI System One contract. Exact sample narratives use explicit synthetic distributions. Other text receives conservative generic outputs, not model inference. A server-side Cloudflare Worker adapter is the optional integration boundary; the browser never needs an API key.</p></details>
      <details><summary>Can this approve or deny an insurance claim?</summary><p>No. Every route is simulated. “Auto-approve” demonstrates a product path, not a real payment or coverage judgment. Integrity signals never establish fraud; uncertain policy evidence, incomplete records, disputes, and urgent events remain human-review cases independent of the confidence slider.</p></details>
      <details><summary>Why do two questions have no confidence?</summary><p>Integrity signal and policy alignment are Noul answers: a single probability of yes. The API returns only <code>type</code> and <code>noul</code>, without a separate confidence or probability map. Choice and Score return full distributions and derived confidence. A confident answer is not a guarantee of domain correctness.</p><a href="https://docs.typesafe.ai/confidence" target="_blank" rel="noreferrer">Read the official confidence definitions <Arrow diagonal /></a></details>
      <details><summary>What are the contract and demo limits?</summary><p>The documented API supports up to 255 options per Choice and 2–10 levels per Score; these are not question-count limits. This application asks six fixed questions in one batch. Its editor accepts 20–12,000 characters as a demo UX limit, not a published API constraint. Both five-level Scores display API score + 1; raw values remain 0–4.</p></details>
      <details><summary>Are the economics and charts measured results?</summary><p>No. Pricing uses the published $42 per billion input tokens with output free. The published 193.6× / 444.6× workflow ratios only derive an illustrative comparator; they are not a Claims One benchmark. Evaluation uses deterministic synthetic truth labels. Mock response usage is zero because no API ran. Local demo runtime is not Jev latency; rough token sizing is a separate estimate, not measured consumption.</p></details>
      <details><summary>How is this different from the insurance cookbook?</summary><p>TypeSafe AI already publishes an auto-insurance self-consistency recipe: one claim, fourteen Noul questions, repeated evaluations. Claims One is a separate synthetic pet-claims product reference with six mixed primitives, an adjustable autonomy threshold, inspectable routing, economics, and an illustrative evaluation surface. It is not a first-insurance claim or a reproduction of that benchmark.</p><a href="https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook" target="_blank" rel="noreferrer">Read the existing insurance recipe <Arrow diagonal /></a></details>
      <details><summary>Is this an official TypeSafe AI product?</summary><p>No. Claims One is an independent concept by Ayo Ahmed, not affiliated with or endorsed by TypeSafe AI. TypeSafe AI, Jev, and the reference brand assets belong to their respective owners. The brand study records provenance and reuse caveats. Commercial headline fonts are not redistributed; the application uses an approximate system sans-serif fallback and licensed Fragment Mono.</p></details>
    </div></div>
  </div></section>;
}

export default function App() {
  const [threshold, setThreshold] = useState(0.85);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = [['triage', 'Triage'], ['workflow', 'Workflow'], ['economics', 'Economics'], ['evaluation', 'Evaluation'], ['docs', 'Docs']];
  return <>
    <a className="skip-link" href="#triage">Skip to triage console</a>
    <header className="site-header"><div className="nav-inner"><a className="identity" href="#hero" aria-label="TypeSafe AI / Claims One — back to hero"><img src={asset('brand/typesafe-wordmark.svg')} alt="TypeSafe AI" width="108" height="20" /><span className="identity-divider" /><span className="product-name">Claims One</span></a><button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close −' : 'Menu +'}</button><nav id="site-navigation" aria-label="Main navigation" className={menuOpen ? 'navigation navigation-open' : 'navigation'}>{navigation.map(([id, title]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{title}</a>)}</nav><span className="header-status"><i /> Mock demo</span></div></header>
    <main>
      <section id="hero" className="hero-section anchor-section" aria-labelledby="hero-title"><div className="page-container">
        <div className="hero-eyebrow"><span>CLAIMS ONE</span><span>AN INDEPENDENT SYSTEM ONE REFERENCE / 001</span></div>
        <h1 id="hero-title">System One<br />for claims<span className="hero-period">.</span></h1>
        <div className="hero-bottom"><div><p className="hero-tagline">Classify. Score. Route.<br />Keep uncertainty in view.</p><div className="hero-actions"><a className="button button-dark" href="#triage">Open the triage console <Arrow /></a><a className="hero-secondary" href="#workflow">See how it works <Arrow diagonal /></a></div></div><div className="hero-side-note"><span className="small-label">STRUCTURED DECISIONS, NOT MORE PROSE.</span><p>One state. Six questions. Typed answers.<br />A human where the evidence stops.</p><span className="hero-demo-label">Mock demo — built against Jev's documented API contract; synthetic responses, no live inference.</span></div></div>
        <div className="published-strip"><div className="published-heading"><span className="small-label">THE PUBLISHED<br />JEV WORKFLOW RESULTS</span><a href="https://typesafe.ai/blog/introducing-system-one-models-and-jev" target="_blank" rel="noreferrer">Source & nuance <Arrow diagonal /></a></div><div className="published-stat"><strong>193.6<span>×</span></strong><span>faster*</span></div><div className="published-stat"><strong>444.6<span>×</span></strong><span>cheaper*</span></div><p>*Specific-workflow ratios published by TypeSafe AI. Not measured Claims One performance or a promise for your workload.</p></div>
      </div></section>
      <Triage threshold={threshold} onThreshold={setThreshold} />
      <Workflow />
      <Economics />
      <Evaluation threshold={threshold} onThreshold={setThreshold} />
      <Documentation />
    </main>
    <footer className="site-footer"><div className="page-container"><div className="footer-top"><a className="footer-wordmark" href="#hero">Claims One <Arrow /></a><p>An independent concept by Ayo Ahmed.</p></div><div className="footer-bottom"><span>Synthetic reference. No real claims decisions.<br />Not affiliated with or endorsed by TypeSafe AI.</span><div><a href="https://docs.typesafe.ai" target="_blank" rel="noreferrer">TypeSafe AI docs <Arrow diagonal /></a><a href={asset('docs/brand/fragment-mono-license.txt')}>Font license <Arrow diagonal /></a><a href={asset('docs/BRAND.html')}>Brand & rights <Arrow diagonal /></a></div></div></div></footer>
  </>;
}
