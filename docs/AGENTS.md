# Standing maintenance context

[Documentation index](README.md) · [Decisions](DECISIONS.md) · [Test plan](TEST-PLAN.md)

## Product identity

Claims One is an independent synthetic pet-FNOL reference by Ayo Ahmed. It demonstrates composition around TypeSafe AI's documented System One contract and Jev; it is not an official TypeSafe product, an insurer, or a live decision service.

Keep **“An independent concept by Ayo Ahmed.”** Keep public material synthetic, transparent, and non-affiliated. TypeSafe AI and Jev are subject names, not project-author credits. Third-party assets remain their owners' work. Preserve the Fragment Mono licence and approximate-commercial-font disclosure.

## Safe defaults

- The public static experience is **Mock demo** with no API key, paid request, runtime secret, browser analytics, or mandatory sign-in.
- The twelve samples are invented. Do not paste real claimant/policyholder, payment, medical, or policy records into the public demo or commit them as examples.
- `src/adapter.ts` defaults to local evaluation. Never silently switch to a remote service, add a credential field, or use a paid fallback.
- Exact complete sample text plus exact rubric identifies a fixture. Edited input is generic uncertainty, not model inference.
- Every route is simulated. Never imply real approval, payment, denial, coverage verification, or a fraud finding.

## Contract invariants

Consult the official API, primitives, and confidence docs in [Sources](SOURCES.md) before changing API details.

| Boundary | Required behavior |
| --- | --- |
| Request | `{ state, model, questions }`; six application question IDs in `src/questions.ts`, one shared state, no dependency on another answer |
| Choice | 1–255 options, exact probability keys, sum one, argmax option, formula-derived confidence |
| Score | 2–10 ordered levels, exact legend/probability keys, zero-based weighted mean and ordered-spread confidence |
| Noul | `{ type: 'noul', noul: number }` only; no confidence, reason, or predicted label |
| Response | `{ model, answers, usage }`; all required answers present, strict validation, no application metadata added to JSON |
| Limits | Choice option limit is not a universal question-count limit; retain the >255 independent-question regression |
| Display | Scores add one only for the 1–5 UI; raw wire values remain 0–4. Noul is probability of yes |
| Usage | Offline counters are zero; serialized-character token sizing is an estimate, not measured usage |

Preserve `Promise.all` in the mock to reflect independent questions. Do not describe it as measured model concurrency or six live calls.

## Routing and provenance invariants

`routeClaim(response, threshold)` in `src/routing.ts` is the sole application routing policy. Keep the UI and evaluation harness using it.

- Validate threshold and response before action; fail closed on malformed data.
- Require trusted external fixture context for simulated delegation. It lives in a WeakMap in `src/mock.ts`, not in the response schema.
- Retain the original response object in the UI. JSON serialization/cloning removes trusted context; copied JSON is for inspection, not restored authority.
- Custom, unrecognized, edited-rubric, cloned, and live responses remain human-only.
- All required Choice/Score confidences must meet the selected threshold. Do not average them to hide an uncertain answer.
- Integrity Noul must be at most .15 and policy-alignment Noul at least .90 for simulated delegation.
- Complete documentation needs raw score at least 3.8 and raw level-4 probability at least .90, plus trusted complete fixture evidence.
- Prior-condition/claim-value/invoice concerns, disputes, incomplete evidence, unknown type, severe or urgent cases, and high churn risk remain human/urgent regardless of slider.
- Keep the routine dental regression: human review at .85, simulated auto-approve at .65.
- Clear a stale result immediately on narrative/sample changes; gate pending async results by request identity. Never show an old route under new text.

Changes to a gate need explicit product/risk rationale, focused boundary tests, and matching documentation. A looser threshold is not a production rollout approval.

## Economics and evaluations

- `src/economics.ts` is the calculation source of truth. Validate numeric inputs and preserve explicit units.
- $42/billion input tokens, output free, 114 ms illustrative latency, 70–500 ms published range, and 193.6×/444.6× published workflow ratios are cited assumptions—not Claims One measurements.
- Comparators are ratio-derived. Show exclusions: review, integration, infrastructure, policy verification, retries, and evaluations.
- `src/evals.ts` has 240 deterministic synthetic rows: twelve fixture groups × twenty variations. Labels are constructed, not independently adjudicated.
- Preserve null autonomous accuracy for zero eligible rows; do not replace it with 0% or 100%.
- Calibration bins use all rows' minimum required Choice/Score confidence; chart agreement is synthetic and is not calibration proof.
- Escalation breakdown counts one primary reason per escalated row. Do not silently mix that denominator with multi-label holds.
- Never hand-code dashboard values or describe synthetic rows as customer outcomes.

## Optional live boundary

The default site does not use the Worker. The server route needs deliberate adapter wiring and an actual deployment; static Pages alone does not supply `/api/evaluate`.

Keep a server-only `TYPESAFE_API_KEY`, explicit `ENABLE_LIVE=true`, exact HTTPS `ALLOWED_ORIGIN`, verified Access team/audience, allowed identities, mandatory rate-limit binding, strict size/content/model validation, timeouts, upstream validation, generic redacted errors, and no-store responses. Worker transport tests use injected offline boundaries and do not prove a deployed Access configuration.

Do not add keys, live data, or upstream error bodies to logs. Do not weaken same-origin relative endpoint validation. Do not mark live responses as trusted fixtures. Future production evidence needs a separately designed provenance, labeling, policy, privacy, and rollout system.

## Brand and responsive behavior

Read `BRAND.md` before visual changes. Preserve the paper/ink opening, literal transparent wordmark, bounded sky imagery, dark working-console region, restrained pink actions, and evidence/nuance copy. Avoid a generic all-dark landing page, artificial logo treatment, excessive glow, and heavy radial decoration.

Keep the fixed demo indicators, honest source/economics notes, non-affiliation notice, visible focus, reduced-motion support, mobile reflow, and adjacent evaluation data tables. Visual correctness requires rendered desktop and narrow screenshots plus real keyboard checks, not source inspection alone.

## Documentation and verification workflow

- Update root product docs with behavior changes. The build renders and copies them into `public/docs`; do not maintain contradictory hand-written public copies.
- Required docs must be substantive. `scripts/build-docs.mjs` intentionally fails for missing required sources; never fix that with empty placeholders.
- `TEST-PLAN.md` specifies checks. `TEST-RESULTS.md` records actual commands, outcomes, limitations, and rendered/deployment evidence; preserve the separation.
- Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` as applicable, then record exact results. Do not claim a check passed unless it actually ran.
- Recheck relative assets and documentation at root and a project subpath. Test the generated site logged out after deployment before claiming public availability.
- Preserve file ownership in parallel work. Do not overwrite another workstream's sources or test record.
- Do not publish, merge, push, create a review request, or change repository settings without explicit authorization. Maintain the required Ayo Ahmed author identity for any separately authorized commits.
- Keep private planning references, secret material, machine-specific paths, and unrelated project material out of public sources and generated pages.

## Positioning guardrails

The public TypeSafe use-case map already includes insurance FNOL. Its self-consistency insurance cookbook uses 14 Noul questions and 15 repeats per condition, with probability heatmaps, .30–.70 uncertainty/human-review bands, and per-call cost/latency. A logged-out console variation was not verified. Do not claim Claims One is the first insurance example or that the cookbook lacked routing, thresholds, uncertainty, or economics.

Differentiate the full pet-FNOL product template: mixed primitives, application policy, editable delegation with nonoverrideable gates, interactive workflow, workload calculator, synthetic evals, and product/engineering docs. Published cookbook results were not independently reproduced. No interviews, customer outcomes, independent accuracy study, or internal TypeSafe enterprise-application inventory support this reference's product hypotheses.
