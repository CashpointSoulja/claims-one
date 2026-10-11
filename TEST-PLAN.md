# Test plan

[Documentation index](README.md) · [Metrics](METRICS.md) · [Test results](TEST-RESULTS.md)

This document defines checks and acceptance criteria. It is **not** evidence that they have run. Actual command output, versions, timestamps, screenshots, observed limitations, and deployment checks belong in [Test results](TEST-RESULTS.md). A synthetic reference passing these checks is not approved for real claims decisions.

## Scope and boundaries

Validate the offline contract, twelve fixtures, six-question composition, fail-closed router, economics, calculated synthetic evaluation, React interaction, public documentation build, and optional server transport. All automated suites must remain offline with injected test transport and synthetic inputs. No credentials, paid requests, new accounts, real records, or model calls are required.

Source inspection and static rendering are useful but do not replace rendered browser and public-host checks. The rendered acceptance pass is a separate handoff; do not start a server or browser during documentation-only work.

## Automated verification commands

Run from the repository root using the project's supported Node version. Preserve the actual output and failure details rather than summarizing a failed command as passed.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

`npm ci` is setup, not a quality result. `npm test` runs the offline Vitest suite. `npm run build` requires all substantive root documents, renders and copies them, then builds the static app. A missing document, including the audit-owned `TEST-RESULTS.md`, should fail visibly; do not create an empty test record to bypass it.

## Contract suite — `tests/contract.test.ts`

| Check | Expected behavior |
| --- | --- |
| Exact request/response envelopes | Only the documented state/model/questions and model/answers/usage fields; required fields and all answer IDs present |
| Primitive shape separation | Choice/Score preserve full keyed distributions and confidence; Noul contains only `type` and `noul` |
| Choice bounds | 1 and 255 options accepted; 0 and 256 rejected; identifiers and selected argmax align |
| Score bounds | 2 and 10 levels accepted; 1 and 11 rejected; legend/probability keys match exact levels |
| Question-count distinction | 256 independently named Noul questions valid; no blanket 255-question restriction |
| Probability integrity | Reject nonfinite, negative, out-of-range, missing/extra keys, and invalid sums; accept valid round-trip distributions within implementation tolerance |
| Choice confidence | Formula `(n × max(p) − 1)/(n − 1)` with explicit one-option case and clamp; reject contradictory reported confidence |
| Score confidence/mean | Ordered distance and weighted zero-based mean; reject inconsistent means/confidence and invalid legend |
| Zero-based wire convention | Raw .3 remains .3 in the contract; 1.3 is display-only; five levels are keyed 0–4 |
| Model/state handling | Missing or invalid model rejected; supported JSON state and valid model alias preserved |
| Unexpected fields | Reject fabricated Noul confidence, explanation, risk flags, and application provenance added to the public shape |

When semantics change, consult current official docs first, then adjust implementation, exact boundary tests, and matching documentation together.

## Engine and safety suite — `tests/engine.test.ts`

### Fixtures and routing

- All twelve invented samples yield the full six-question response with valid distributions, documented model, and zero usage.
- The default adapter has no environment/network/live fallback. Matching requires the complete sample text and exact fixed rubric; a copied rubric with changed labels/levels is not a fixture.
- A short phrase match, token-heavy unrelated narrative, extra text, custom input, or rubric drift produces generic uncertain answers and human-only routing.
- Preserve independent `Promise.all` evaluation over one shared state. Do not interpret offline scheduling as a latency benchmark.
- Keep external trusted provenance separate from the API response. Repeated routing of the original object works; JSON serialization/clone, arbitrary structurally valid answers, and live-shaped responses do not acquire trust.
- Reject invalid threshold or response before considering a route; no thrown exception should become silent simulated approval.
- Routine dental stays human-reviewed at .85 and changes to simulated auto-approve at .65.
- Emergency/severe, disputed, prior-condition, invoice/date/integrity, incomplete-evidence, unknown, and high-service-risk examples cannot become autonomous at a low threshold.
- Integrity > .15 and policy-alignment < .90 are independent holds. Documentation requires raw score ≥3.8 and raw level-4 probability ≥.90. Test equality boundaries and values immediately outside them.
- Require every required Choice/Score confidence, not an average. The slider cannot override evidence holds.
- Ensure the four actions remain clearly simulated and never call a payment/coverage/denial system.

### Optional adapter and Worker

Use offline `Request` objects, injected fetch boundaries, and test keys only. The suite should cover:

- Browser adapter accepts an origin-root relative path only; reject absolute URLs, protocol-relative URLs, scheme endpoints, backslashes, and query/hash components. Strictly validate returned JSON. Endpoint configuration remains a developer-controlled setting, not a claim-text field.
- Disabled live path or missing server key fails closed and makes no upstream request.
- Exact HTTPS origin configuration and incoming Origin required. Reject wrong/missing/null origin and cross-site metadata; do not treat a permissive CORS header as authentication.
- Require configured Access team domain/audience, valid signed Access JWT, trusted issuer, current expiry, allowed identity, and verified signing-key constraints. Optional `nbf`/`iat` claims must be valid and not more than the implementation's 30-second future tolerance.
- Require `LIVE_RATE_LIMITER`; test per-identity and global quotas and denial behavior. A binding error does not make the request free to proceed.
- Reject unsupported path/method/content type, body over the 32 KiB limit, malformed or excessive declared length, streamed overflow, invalid JSON/schema/primitive limits, and unsupported model before upstream work where applicable. Missing Content-Length is permitted: streamed byte counting must enforce the limit even when length is omitted or understated.
- Upstream is fixed to the official System One endpoint; server adds the credential, forwards exact request fields, and validates full returned response and requested answer set/model.
- Test upstream HTTP error, oversized/error body, malformed successful JSON, invalid probabilities, wrong model/IDs, and abort/timeout behavior. Keep browser errors generic, no-store, and free of credentials/upstream details.
- No unconfigured retry, remote redirect, or accidental live request may occur during tests.

These tests verify code boundaries, not real Access policy, runtime binding, deployment routing, or a live vendor account. A future live deployment needs separately authorized integration verification and budget control; v1 has no such evidence.

## Economics and evaluation suite — `tests/evals.test.ts`

| Check | Expected behavior |
| --- | --- |
| Input validation | Reject negative, fractional, nonfinite, empty/invalid, excessive, and unsafe-integer values; accept specified limits |
| Published-price arithmetic | 50,000 × 1,500 input tokens at $42/billion = $3.15; output charge is zero |
| Comparator arithmetic | Cost derives from 444.6×, latency from 193.6× and 114 ms; neither is independently measured |
| Token/runtime caveats | Separate rough input estimate, zero mock usage, local demo runtime, and illustrative published latency |
| Synthetic dataset | Exactly 240 deterministic rows, twelve fixture groups × twenty variations, with constructed labels |
| Threshold safety | Increasing threshold cannot raise synthetic autonomy; holds remain binding |
| Metric denominators | Autonomy = autonomous/240; conditional autonomous accuracy = agreed/autonomous; null when none autonomous |
| Calibration bins | Every row included exactly once; use minimum required Choice/Score confidence and synthetic agreement; show row counts |
| Escalation reasons | One primary reason per human/urgent row; sum reconciles to escalated count, not 240 or multi-label findings |
| Source of truth | Interface calculations call shared engine functions; no chart-only hardcoded rates or benchmark claims |

## Independent regression suite — `tests/audit.test.ts`

Retain the separate offline checks of all twelve exact response shapes, independently calculated confidence/weighted means, primitive cardinality boundaries, every required question's malformed-answer handling, zero-based wire Scores, threshold monotonicity, independent risk holds, and default-network isolation. Source assertions about React labels/state storage remain source checks; they do not count as rendered interaction evidence. Read the actual test record for executed scope and counts.

## Build, documentation, and publication audit

1. Verify `npm run typecheck` includes browser, worker, and tests; lint has no ignored blocking error; production build emits portable app assets.
2. Confirm the documentation renderer fails for missing required Markdown and emits readable HTML plus raw Markdown for every required file, including the actual test record.
3. Follow app documentation links and document-to-document links. Check source and rendered forms, heading fragments where used, external public citations, source downloads, and readable print output.
4. Confirm `BRAND.md` and licence/research assets are available at linked paths. Keep licence/ownership text and font-approximation caveat intact.
5. Check project-root and subpath asset loading. Relative Vite base alone is not evidence of correct host rewrite behavior; test a built deployment or an equivalent static host configuration.
6. Confirm exact primitive field distinctions and Score conversion match code. No static document may describe a fixture as live inference or show added response metadata.
7. Scan source, docs, compiled pages, metadata, committed public media, and any publication history for private planning material, machine paths, secrets, unintended builder bylines, unsupported affiliation, and stale benchmark claims.
8. Search for inaccurate “first insurance” or “no enterprise apps” claims. Acknowledge the existing official FNOL use-case map and 14-question/15-repeat Noul cookbook with uncertainty routing, heatmaps, latency, and cost; do not imply independent reproduction.

Build artifacts are generated output; check the root source and renderer rather than hand-editing a public HTML document to hide a source defect.

## Rendered interaction and accessibility handoff

Run with the built app at **1280–1366 px desktop**, **390 px mobile**, and a useful intermediate width. Capture actual rendered screenshots; inspect them rather than asserting layout from CSS.

| Area | Acceptance |
| --- | --- |
| Opening/brand | Literal wordmark visible; paper/ink opening, bounded sky, dark working console, restrained pink actions, no excessive glow; ownership/non-affiliation visible |
| Navigation | All six sections reachable; tabs and in-page links have clear focus/current state; URL/back behavior does not break the page |
| Narrative input | Synthetic privacy caution readable; sample selection/input labeled; no real-record invitation |
| Pending/results | Loading state understandable; changing input clears stale results; rapidly changed requests cannot paint an old response into a new narrative |
| Primitive outputs | Full distributions legible; Noul only probability of yes; Score visibly 1–5 with zero-based raw contract clarified |
| Routing slider | Keyboard-operable control with value label; dental .85/.65 outcome changes; urgent/risky holds do not disappear |
| Copy/workflow | Copy question and routing source; success/failure feedback accessible; when clipboard is unavailable, selectable visible source remains usable |
| Economics | Input bounds enforced, assumptions visible, outputs recalculate from engine, no claim of measured Claims One savings or latency |
| Evaluations | Threshold results recalculate, table accompanies chart, bin/reason counts legible, synthetic/calibration caveats adjacent |
| Documentation | HTML and Markdown links work; no missing-test-record destination; readable dark/light and print modes where supported |
| Footer | Exact independent-concept statement, TypeSafe/Jev subject naming, demo mode and non-affiliation; no live video or page claim |
| Reflow | No clipped labels, unwanted horizontal viewport overflow, hidden logo, chart/control collision, or unreachable source view at 390 px |
| Accessibility | Full keyboard path, labels and semantic headings, discernible contrast/focus, sensible announcement order, no chart-only information |
| Motion/zoom | Reduced-motion preference honored; 200% zoom keeps controls/content reachable; sky imagery never obscures essential text |

Use an automated accessibility audit as a supplement, not a substitute for manual keyboard and contrast review. Record browser/version, viewport, screenshot paths, console errors, and known limitations. Test blocked clipboard, cleared fields, invalid economics entries, and rapid text edits—not only the happy path.

## Deployment acceptance

Only perform publication checks after explicit deployment authorization:

- Public URL resolves over HTTPS, logged out and without a sign-in wall for the static mock experience.
- Correct root/subpath assets, HTML/raw documentation, fonts/licence paths, and direct entry/reload behavior.
- No browser key, unexpected analytics, live API request, remote fallback, missing-asset error, or sensitive console message.
- The site and any walkthrough retain **Mock demo** and never imply live Jev inference.
- Optional live API, if separately authorized, is protected at the server route; public static access must not imply public authenticated evaluation access.

A local build is not deployment evidence. A configured origin that has not resolved is not a public URL.

## Release gate and evidence discipline

Block reference-release verification for critical unsafe routing, exposed secret/private material, misleading provenance/live claims, missing required documents, broken primary interactions, or inaccessible core controls. Record other known issues with impact, owner, and remediation instead of silently omitting them.

A results record should distinguish **executed and passed**, **executed and failed**, **not run**, and **out of scope**; include command output and rendered observations. Report another person's run as their reported evidence, separately from local execution. Repeat the affected tests and rendered checks after fixes. Nothing in this test plan establishes live accuracy, calibration, regulated compliance, commercial rights for future reuse, or readiness to handle real claims.
