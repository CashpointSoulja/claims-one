# Test results

## Verification status

**Offline regression checks, local desktop/mobile acceptance and final-video playback verified. Public deployment and Drive sharing remain unverified.**

The commands below were actually executed on 11 October 2026 (UTC), with Node **v22.23.3**, npm **10.9.9**, and Vitest **5.0.3**. The installed Node 22 executable was selected through `PATH`. All evaluation and transport tests used invented fixtures, local synthetic signatures, or injected offline transports. No real claimant data, provider credentials, paid inference, or live model calls were used.

The first regression pass ran while documentation was still arriving. Its two build failures are preserved below as historical evidence. The integration follow-up completed the document set, fixed the zero-usage copy, added deployment packaging and code-only screen checks, and reran the full offline checks successfully: **287 tests across five suites, typecheck, lint, and full builds are green**. The later local browser/video acceptance is recorded separately below. Hosting and cloud sharing were unavailable.

## Earlier regression commands actually run

Run from the repository root:

| Command | Actual result | Scope / caveat |
| --- | --- | --- |
| `node --version` | `v22.23.3`; exit 0 | Runtime selected for all npm commands below. |
| `npm --version` | `10.9.9`; exit 0 | Package-manager version. |
| `npm test -- tests/audit.test.ts` | **124 passed**, one test file; exit 0; 1.72 seconds | Independent regression suite, first run. |
| `npm test` | **263 passed**, four test files; exit 0; 1.81 seconds | `tests/contract.test.ts`, `tests/engine.test.ts`, `tests/evals.test.ts`, and `tests/audit.test.ts`. Run began at 02:17:01 UTC. |
| `npm run typecheck` | **Passed**, exit 0 | Runs `tsc -b`; no diagnostics. |
| `npm run lint` | **Passed**, exit 0 | Runs `eslint .`; no diagnostics. |
| `npm run build` (first invocation) | **Blocked**, exit 1 | Documentation prerequisite check stopped the build before TypeScript compilation or Vite. See the original missing-file list below. |
| `npm run build` (second invocation, after adding this document) | **Blocked**, exit 1 | Six remaining source documents were still absent; compilation and Vite were not reached. See the latest missing-file list below. |

Durations above are test-run durations, not Jev inference latency. Command output was retained separately from the shipped documentation; environment-specific stack-trace paths are intentionally omitted here.

## Independent regression coverage

The added `tests/audit.test.ts` suite contains **124 passing test cases**. Numerical checks use independently written confidence and weighted-mean calculations rather than calling the production helper to manufacture an expected result.

### Published contract

- All twelve synthetic claim responses preserve exactly the request's question IDs and each primitive's expected answer fields.
- Both Noul answers contain **only `type` and `noul`**. Extra confidence, probability-map, Score, or explanatory fields are rejected. Missing, nonnumeric, nonfinite, negative, and greater-than-one values are rejected; 0, 0.5, and 1 are accepted as wire values.
- Choice and Score distributions contain every required key, contain only finite probabilities in [0, 1], and sum to one. Missing keys, additional keys, invalid values, and a deliberately incorrect sum are rejected for every distribution-bearing claim question.
- Choice accepts 1, 2, 254, and 255 arbitrary, fully named options; it rejects 0 and 256 instead of truncating the request. Score accepts 2, 5, and 10 levels and rejects 0, 1, 11, and 255. A batch of **256 independent Noul questions** is accepted: option cardinality is not a blanket question-count limit.
- Choice confidence matches the published normalization above a uniform split. Score confidence matches the published ordered-distance formula. Score is the probability-weighted mean, not the most likely label.
- The dental severity wire value remains **1.1**, with keys **0–4**. A one-based value or one-based probability map is rejected. Source assertions confirm that `src/App.tsx` adds one for the displayed five-level score, retains the raw score separately, and stores the returned response object directly. These are **source-level checks, not rendered UI verification**.

### Fail-closed routing and safety gates

- The same dental response produces **human review at 0.85** and **Simulated auto-approve at 0.65**. Equality at its 0.70 confidence is accepted; a slightly higher gate holds the claim. Routing does not change the response JSON.
- For every sample, increasing the threshold through **all 101 whole-percent values from 0 to 1** never restores autonomy after the claim has been held. Every autonomous route requires each needed Choice/Score confidence to meet the threshold, not merely their average.
- Separate, valid mutations of a safe, provenance-retaining fixture prove independent holds for high integrity probability, uncertain liability, incomplete documentation by mean or top-level probability, a chosen or probable prior condition, unknown type, urgency by mean or emergency probability, and high cancellation risk. These holds remain in place at every tested threshold. The tests explicitly validate each modified wire response so an invalid shape or lost fixture identity cannot accidentally mask the gate being tested.
- Fraud Noul **0.15** and liability Noul **0.90** are inclusive boundaries when every other gate passes; values just outside them require human review.
- Every emergency, disputed, incomplete, integrity-review, uncertain-policy, and service-escalation fixture remains human-only even with the confidence gate set to zero.
- Missing responses, missing required answers, malformed responses, and invalid or missing thresholds fail closed without throwing.
- Custom, instruction-like, abbreviated, or edited claim text never receives autonomy. Fixture matching requires the complete exact narrative and unchanged rubric. Structured clones, JSON round-trips, and shallow response copies have no trusted fixture provenance and remain human-only.
- All actions are simulated. The tests do not establish real eligibility, medical urgency, fraud, payment authority, or production safety.

### Usage, evaluation, and economics integrity

- Demo response usage remains **zero input and zero output tokens**. The separate rough estimate is `ceil(serialized request characters / 4)`; requesting an estimate never changes wire usage. Fractional, negative, nonfinite, missing, string, and unsafe counters are rejected.
- All **240 unique deterministic synthetic evaluation rows** validate, preserve zero measured usage, and use the minimum required Choice/Score confidence. The audit recounts autonomy, correctness, escalations, and primary reasons at every whole-percent threshold.
- Autonomy rate uses **all rows** as its denominator. Autonomous accuracy uses **autonomous rows only** and returns **null** when none are autonomous. Autonomous plus escalated equals total; correct autonomous never exceeds autonomous. Primary-reason counts sum exactly to escalated rows, avoiding double-counting a claim with several holds.
- Every confidence bin is reconstructed from the actual rows and synthetic truth labels. Bin counts cover all rows, and weighted confidence and accuracy totals reproduce the dataset totals. This is an illustrative fixture calculation, **not observed provider calibration**.
- Published-number arithmetic checks include **50,000 claims × 1,500 input tokens = $3.15** illustrative Jev input cost and **$1,400.49** ratio-derived comparator; **one billion input tokens = $42**. Output price is zero under the published figures.
- Illustrative latency is **114 ms per batch request**, with a published **70–500 ms** range. The **193.6×** ratio produces a **22,070.4 ms** illustrative comparator, not a measured baseline. Workload size does not multiply request latency, and six questions do not charge the supplied input-token total six times. The **444.6×** cost ratio is also a published specific-workflow ratio, not an independent pricing benchmark or measured Claims One benefit.
- Negative, fractional, nonfinite, and unsafe workload totals are rejected. Empty workloads and zero input-token assumptions produce zero workload cost without claiming measured latency.

The existing three suites also passed in the full run. Their optional Worker tests use injected responses and locally generated synthetic Access signatures to exercise opt-in controls, identity verification, origin checks, quotas, body limits, response validation, and safe failure bodies. This is **offline logic coverage**, not proof of a deployed Cloudflare Access integration or the live provider's behavior.

## Historical build blocker and integration observation

### Build prerequisite: public documentation was incomplete

The first `npm run build` invocation failed at the intentional prerequisite check in `scripts/build-docs.mjs:13–16` with:

> Required public documents are missing: PRD.md, FIVE-WHYS.md, JTBD.md, METRICS.md, TEST-PLAN.md, TEST-RESULTS.md, VIABILITY.md, ROADMAP.md, DECISIONS.md, AGENTS.md

A second invocation, after adding this document and after some other source documents had arrived, also exited 1 at the same prerequisite check:

> Required public documents are missing: METRICS.md, TEST-PLAN.md, VIABILITY.md, ROADMAP.md, DECISIONS.md, AGENTS.md

These are the missing documents **at each recorded invocation**, not permanent assertions about the working tree. The integration follow-up below supplied the completed document set and successfully ran the complete build, including document rendering, compilation, Vite and package verification. An older `dist` directory was not used as evidence for the failed invocations.

### Historical copy discrepancy — resolved in integration

At the earlier review, the interface incorrectly described zero mock usage as estimated response usage. Integration corrected both the raw-contract note and FAQ: **zero usage because no API ran**, with rough sizing separate from response counters. The mock and its contract are unchanged. A new source regression assertion covers the corrected wording; the earlier audit did not edit production source.

## Integration follow-up: actual offline checks

Run on 11 October 2026 (UTC), still using Node **v22.23.3** and npm **10.9.9**. No application server or browser was opened, and no paid/model endpoint was called. The following commands were actually executed from the repository root:

| Command | Actual result | Scope / caveat |
| --- | --- | --- |
| `node --version`, `npm --version` | `v22.23.3`, `10.9.9`; both exit 0 | Runtime versions rechecked. |
| `npm view wrangler version` | `4.149.0`; exit 0 | Public npm registry lookup, not an inference or hosting call. |
| `npm test` (initial integration pass) | **287 passed**, five test files; exit 0; 1.86 seconds | Original 263 checks plus 24 integration checks. Started 02:28:01 UTC. |
| `npm run typecheck` (initial integration pass) | **Failed**, exit 2 | The new static React render test imports DOM-dependent app code into the Node test config. Added DOM/JSX/Vite types to that config. |
| `npm run lint` | **Passed**, exit 0 | Full repository ESLint scope, not a browser accessibility audit. |
| `npm run build` (first integration invocation) | **Failed**, exit 2 | Docs now complete; TypeScript exposed the Web Crypto `Uint8Array` buffer type. Fixed the decoder return annotation to an ArrayBuffer-backed typed array, without changing logic. |
| `npm run build` (after the type fix) | **Passed**, exit 0 | 14 source/rendered docs, brand guide, full Vite client, and 432 local HTML/CSS reference checks across root/repository mounts. |
| `CLOUDFLARE_SEND_METRICS=false npx --yes wrangler@4.149.0 deploy --dry-run` | **Passed**, exit 0 | CLI read 51 built files, bundled Worker at 16.84 KiB (4.94 KiB gzip), showed `ASSETS` and `ENABLE_LIVE: false`, then exited without publication. No account, credentials, Access integration or live provider validation. |
| `VITE_BASE_PATH=/claims-one/ npm run build` | **Passed**, exit 0 | Explicit repository-subpath build; 216 packaged local HTML/CSS reference checks. |
| `VITE_BASE_PATH=/ npm run build` | **Passed**, exit 0 | Explicit domain-root build; 216 packaged local HTML/CSS reference checks. |
| `npm test` (follow-up) | **287 passed**, five test files; exit 0; 1.81 seconds | Started 02:29:16 UTC, after the type fixes. |
| `npm run typecheck` (follow-up) | **Passed**, exit 0 | No diagnostics. |
| `npm run lint` (follow-up) | **Passed**, exit 0 | No diagnostics. |
| `npm test && npm run typecheck && npm run lint && npm run build` | **All passed**, exit 0; 287 tests, five suites, 1.76-second test run | Sequential final verification started 02:31:12 UTC. Relative-base artifact restored; full docs/assets and 432 reference checks passed. |
| `npm run check:package` | **Passed**, exit 0 | Standalone repeat of the filesystem package check: 14 source/rendered docs, 44 public files, 432 references. |

### Code-only screen and package coverage

`tests/integration.test.ts` adds 24 offline cases. Static React rendering checks the **six required section anchors**, navigation, literal wordmark reference, product/subject names, exact footer, visible mock/no-inference label, non-affiliation, all twelve samples, six pending typed cards, economics defaults, calculated synthetic chart tables, and every root documentation link plus the brand guide and font license. Source assertions preserve response identity, stale-result invalidation, one-based Score display and corrected zero-usage wording. These tests do **not** submit forms, drag controls, load images/fonts, test clipboard or execute browser interactions.

Injected Worker asset tests check unauthenticated static serving, HEAD, status/header preservation, missing-asset 404, missing binding, method restriction, unknown API isolation, disabled live evaluation and absence of network calls. Configuration assertions cover the static directory, disabled live flag, manual Pages trigger, permission scopes, path selection, source ledger and third-party license exclusions. A successful Wrangler dry run validates packaging, not deployed routing or Cloudflare Access.

`scripts/check-package.mjs` checks every root Markdown source and corresponding rendered HTML, byte preservation of every public file, font license/observations, and filesystem existence of local HTML/CSS targets. All **14 source/rendered documents**, **44 public files**, eight public-site screenshot PNGs, sky PNG, transparent wordmark SVG, mono font and font notice are included. The final portable build contains **47 files**: 44 copied public files, the HTML entry and two compiled assets. Local link resolution is checked at root and `/claims-one/` for the relative artifact or at the selected explicit base. There is no network request or browser renderer in this check.

First-party repository source, documents, configuration and generated `public/docs`/`dist` text were searched for private-source leakage, builder bylines and absolute machine paths. No matches were found in those scans; required TypeSafe AI/Jev subject names and the prescribed maintenance-document filename are not treated as builder attribution. Dependency installation caches and git internals are not shipped documentation.

The preferred Cloudflare static configuration and manually dispatched GitHub Pages workflow are prepared, but hosting integrations and a public repository were unavailable. No workflow was dispatched, repo created, deployment URL invented or publication performed. Third-party branding retains its source ledger, owners' rights and reuse caveats; broader commercial reuse still requires rights review.

## Local browser acceptance and desktop walkthrough

Completed on 11 October 2026 (UTC), against the actual running mock application, after the offline checks above. The live provider remained disabled. The production build was also served under a temporary `/claims-one/` mount; this was local hosting, not a public deployment.

**56/56 recorded runtime assertions passed.** All six sections were inspected at 1360 px desktop and 390 px mobile widths. No horizontal overflow, broken brand assets, application console/page errors, failed network requests or inference POST requests were observed.

| Browser check | Actual result |
| --- | --- |
| Dental threshold change | At 85%, Human review; real slider drag to 65%, Simulated auto-approve. The raw response remained exactly unchanged. |
| All twelve samples and safety holds | All evaluated. Emergency, dispute/prior-condition, missing-document, integrity, uncertain-policy and cancellation holds persisted at 50%. |
| Custom/edit input | Human-only custom responses; stale results cleared on edits. Empty/short validation, 20-character boundary and 12,000-character limit checked. |
| Primitive/request display | One shared-state request with six questions; complete Choice/Score distributions and confidence; zero-based Score wire values with one-based display; Noul value only. |
| Workflow/clipboard | Both source tabs and clipboard copy passed. |
| Economics | 75M monthly input tokens, $3.15 illustrative cost, $1,400.49 ratio-derived comparator, 114 ms illustration and 22,070 ms comparator. Invalid inputs did not produce misleading values. |
| Synthetic evaluation | Shared 240-row threshold; at 65%, 33/240 autonomous and 25/33 correct. At 99%, zero autonomous rows and no-data accuracy, not 0%. Escalation-reason totals matched escalated rows. |
| Documentation/assets | All fourteen rendered documents, source README, wordmark/font and eleven brand images loaded at root and the local repository subpath. Lazy-image disclosures were opened before checking image dimensions. |
| Keyboard | Skip link, mobile menu and threshold controls passed. No screen-reader certification is implied. |

Two initial harness failures were resolved without application changes: checking lazy images while their disclosures were closed, and browser focus/scroll timing. Neither was counted as an application defect.

The final narrated walkthrough uses actual 1920 × 1080 desktop footage, native clicks and slider drag, seven scene-synchronized British-English TTS segments, word-timed captions, pointer highlighting and restrained eased zooms. The final file was reviewed completely with audio and then played uninterrupted in a browser from 0 to 74.261334 seconds, unmuted, without a media error. It covers hero, claim submission, distributions, 85% → 65% routing, economics, synthetic evaluation and local rendered documentation. It does not imply that the remote repo or public deployment exists.

`ffprobe` independently confirmed **74.24 seconds, 1920 × 1080, 30 fps, H.264/AAC**. File size: **10,138,790 bytes**. Container and stream tags contain no comment/byline or absolute machine path. An initial renderer metadata comment was caught during review, removed by lossless stream-copy, and the cleaned final file was rechecked and watched. The reproducible cleanup step is included in the video package.

After adding the isolated video package to lint coverage, these commands were executed again: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run typecheck --prefix demo`. All passed; the test run at 02:46:15 UTC reported 287 passing tests in five suites. The video package dependency audit and production dependency audit each reported zero vulnerabilities at the time checked. Generated JSON must exist before video type checking; a complete clean-clone video reproduction was not performed.

## Remaining verification

The following remain **unverified after local offline, browser and video checks**:

- Real TypeSafe/Jev inference, provider errors, provider tokenization, billing, accuracy, calibration, or latency. Public API, primitive, and confidence documentation was read to establish contract expectations; reading those pages is not live integration testing.
- A deployed Cloudflare Worker, real Cloudflare Access policies or identities, deployed quota configuration, or hosting/account configuration. Optional live transport should remain disabled until independently reviewed and explicitly enabled with the required server-side controls.
- Any public deployment URL, logged-out reachability, CDN behavior, root/subpath hosting, or deployed documentation links.
- Screen-reader behavior and a formal automated accessibility audit. Local keyboard and responsive checks are not accessibility certification.
- Video cloud upload and anyone-with-link sharing permissions. The final MP4 and subtitles are local delivery artifacts, not a Drive link.
- A fresh-clone reproduction of the complete narration/capture/render pipeline.

The owner subsequently created the public source repository. Branch-root Pages packaging is prepared separately below; enabling Pages remains an owner action. No logged-out public site, Drive upload or sharing permission is claimed. Local acceptance is not a substitute for insurer policy validation and representative held-out evaluation before any production use.

## Default-branch-root Pages preparation

The source HTML entry moved to `app/index.html`; Vite still emits the same compiled client asset hashes. The repository root now contains the static production entry, relative assets, all rendered docs and brand assets, favicon and `.nojekyll`. The source and public mock-only framing are unchanged. `npm run prepare:pages` runs the production build, copies its output to the root and byte-verifies every copied file. The GitHub Actions workflow remains optional and manual; it is not required to enable **main / (root)** hosting.

At 03:07:27 UTC on 11 October 2026, `npm test`, `npm run typecheck`, `npm run lint` and `npm run prepare:pages` all passed: 287 tests, five suites, 47 byte-verified static files plus `.nojekyll`, and 432 local references across root/repository mounts. This is preparation evidence, not proof that Pages was enabled or that a public URL loaded.

Three additional branch-root regression checks passed at 03:08:18 UTC: compiled relative asset URLs and `.nojekyll`, separate development entry/reproducible preparation command, and current mock-framed docs/identical brand assets. The expanded suite reported **290 passing tests in six suites**; a subsequent lint pass caught and removed an unnecessary regex escape in that new test file.

The actual repository-root static artifact was then exercised locally at both `/` and `/claims-one/`: dental 85% → 65% routing, unchanged response, primitive displays, README/viability/brand/font links and 390 px overflow checks passed. Moving the Vite HTML entry initially caused a development-only `/src/main.tsx` 404. Adding an in-root `app/main.ts` module corrected resolution without changing the compiled asset hashes. The restarted development server returned 200 for its entry and resolved source module, rendered the hero/mock label, passed the dental threshold regression and loaded the mock-framed README. No browser/network errors, failed HTTP requests, POSTs or upstream requests were observed. Preserved root/subpath desktop/mobile screenshots were visually reviewed without finding a regression. The final video is unchanged.

After the entry fix, at 03:14:07 UTC, the 290-test suite, type checks, lint and Pages preparation all passed again. Public Pages remains untested because the owner has not enabled hosting.
