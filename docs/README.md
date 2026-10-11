# Claims One

**System One for claims.** An independent, synthetic pet-insurance triage reference by Ayo Ahmed, using the published TypeSafe AI API contract.

> **Mock demo, not live Jev.** Built against Jev's documented API contract, with synthetic responses and no live inference. Twelve invented claims, deliberately specified probability distributions, simulated routing, illustrative economics, and synthetic evaluation data. Nothing is paid, denied, reported as fraud, or determined to be covered. Claims One is not affiliated with or endorsed by TypeSafe AI.

## Explain it like I'm five

Imagine a sorting desk for pet-insurance paperwork. Instead of asking one big question—“Should we pay this?”—the desk asks six small ones: what happened, how urgent it sounds, whether anything is inconsistent, whether the supplied policy story aligns, whether the paperwork is complete, and whether the owner needs service attention.

Some answers are uncertain. A slider changes how much certainty the **simulation** requires before showing a delegated route. Safety rules still send emergencies, disputes, missing records, and suspicious inconsistencies to a person. Lowering the slider never removes those rules.

This demo does not read or understand new claims through a model. Exact sample text receives an invented, repeatable response. Edited or custom text gets generic, uncertain answers and stays human-only.

## Try the reference

1. Open **Triage**. Routine dental treatment is selected initially.
2. Evaluate the claim at the default **85%** threshold: it needs human review.
3. Move the threshold to **65%**: the same returned response shows **Simulated auto-approve**. Its minimum required confidence is 70%; this is a product demonstration, not a safe production threshold.
4. Load chocolate ingestion, a prior-condition dispute, or a potential duplicate invoice. Re-evaluate and lower the threshold: the safety hold remains.
5. Edit a sample. Previous results clear immediately; re-evaluation uses generic uncertainty, not a keyword-based approximation of Jev.
6. Inspect the request and response, copy the actual question/routing code, change the economics workload, and inspect synthetic evaluation denominators.

All six page sections have anchors: **Hero, Triage, Workflow, Economics, Evaluation, Docs**. The triage and evaluation sliders share one threshold.

## Run locally

Prerequisites: Node.js **22.13 or newer** and npm. No account, credential, or paid API is required for the static demo.

From the repository directory:

```bash
npm ci
npm run dev
```

The normal development command builds the public documentation and starts Vite. To check and build without starting an application server:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

`npm run build` checks required documents, renders them, typechecks, emits the client site to `dist/`, and verifies packaged documents/assets and local HTML/CSS references. `npm run check:package` repeats the filesystem packaging check on an existing build; neither command opens a browser. These are reproducible commands, not a claim that every check has passed. Actual execution evidence belongs in [Test results](TEST-RESULTS.md); planned browser and deployment checks belong in [Test plan](TEST-PLAN.md).

### Portable static hosting

The default application is TypeScript + React + Vite. It needs no application backend. Publish the **contents of `dist/`** to a static host; Cloudflare Pages or GitHub Pages can serve it. Vite uses relative asset URLs (`base: './'`) for a domain root or a repository subpath. This is a single page, not a client-side route tree.

Root Markdown documents are source-of-truth files. `scripts/build-docs.mjs` copies their source and renders HTML to `public/docs/`; Vite then copies that directory into the build. The brand guide is copied separately from `docs/brand/`. Do not maintain generated copies by hand. Keep source links relative so the same navigation can work in the repository and built documentation. Confirm root **and** subpath links in a browser before declaring portability verified.

Source repository: [CashpointSoulja/claims-one](https://github.com/CashpointSoulja/claims-one). No deployment URL or logged-out site availability is asserted here. Pages must be enabled by the repository owner before the public site can be verified.

### Cloudflare Worker with static assets (preferred handoff)

`wrangler.jsonc` packages **all of `dist/`** and selects `worker/site.ts`. Static pages, docs, captures, the wordmark, sky image, bundled mono font, font license, and source/rights ledger stay public without authentication. Only `/api` and `/api/*` run the Worker before asset handling; `/api/evaluate` remains disabled (`ENABLE_LIVE: 'false'`). Unknown API routes and missing documents are not replaced with the hero. Application request logging through Wrangler observability is disabled; hosting-provider operational logs are a separate concern.

From the repository root, these are the exact packaging commands (the pinned CLI can be downloaded from npm; a dry run does not publish or require account creation):

```bash
npm run build
CLOUDFLARE_SEND_METRICS=false npx --yes wrangler@4.149.0 deploy --dry-run
```

**An authorized owner may later publish** using an existing Cloudflare integration. Do not create accounts or add secrets just to view this demo. After permissions and third-party asset rights are reviewed, the owner's publish command is:

```bash
CLOUDFLARE_SEND_METRICS=false npx --yes wrangler@4.149.0 deploy
```

That second command is intentionally not part of verification and was not executed here. Do not enable live transport or configure provider credentials for the static deployment. Serving the public app does not require Cloudflare Access; Access is relevant only to a separately approved live API route.

For an existing Cloudflare Pages project instead of a Worker, use build command `npm run build` and output directory `dist`, or the owner's manual upload command `CLOUDFLARE_SEND_METRICS=false npx --yes wrangler@4.149.0 pages deploy dist --project-name claims-one`. That upload is not executed or verified here and does not install the optional Worker API.

### GitHub Pages from the default branch root

The repository includes a compiled static site at its root: `index.html`, `assets/`, `brand/`, `docs/`, `favicon.svg` and `.nojekyll`. The development HTML entry lives separately in `app/index.html`; Pages never needs to interpret TypeScript or run npm. Asset and documentation URLs are relative, so the same static artifact supports the `/claims-one/` repository mount.

To enable hosting, choose **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → Folder: / (root)**, then save. The owner performs this step; preparing or pushing files does not itself enable Pages. Wait for GitHub's Pages build to finish and verify the resulting URL logged-out before calling the site deployed.

After source or documentation changes, regenerate the committed static site from the repository root:

```bash
npm run prepare:pages
```

This builds with the default relative base, copies the compiled artifact to the root, writes `.nojekyll`, and verifies every copied file byte-for-byte. Do not set `VITE_BASE_PATH` for this command. Review and commit the generated files along with the source changes. `npm run dev` continues to serve the source through Vite; it does not depend on the committed bundle.

### Optional GitHub Actions deployment

`.github/workflows/pages.yml` has no push/PR trigger. It installs from the lockfile, runs tests/typecheck/lint, builds, and uploads the complete static artifact. Normal workflow permission is only `contents: read`; only the deployment job receives `pages: write` and `id-token: write`. Checkout does not persist credentials.

For this alternative only, an authorized owner selects **Settings → Pages → Source: GitHub Actions**, then **Actions → Deploy static demo to GitHub Pages → Run workflow** on the reviewed branch. This is not required for the branch-root option above. No workflow dispatch, deployment, or public URL is claimed here.

The workflow defaults `VITE_BASE_PATH` to `/<repository-name>/` (thus `/claims-one/` for this repository). For a custom domain or user/organization site, set the repository Actions variable `PAGES_BASE_PATH` to `/` before dispatching. Do not treat the repository path as a domain name. Equivalent offline builds:

```bash
VITE_BASE_PATH=/claims-one/ npm run build
VITE_BASE_PATH=/ npm run build
npm run build
```

The last command restores the portable relative-base artifact for handoff. The packaging check resolves local document, image, font and CSS links at the chosen mount; default relative builds check both root and `/claims-one/` through the filesystem. This is code-only evidence, not CDN/browser verification. After actual publication, separately verify the real URL logged-out, document links, image/font loading, console, desktop/mobile layout and interactions. Record only observed results in [Test results](TEST-RESULTS.md).

## What is implemented

| Surface | Implementation and boundary |
| --- | --- |
| Triage | Twelve clearly synthetic pet claims; editor accepts 20–12,000 characters as a demo UX limit |
| Typed questions | One state and six independent questions, evaluated together with `Promise.all` in the mock |
| Answers | Complete Choice/Score distributions and derived confidence; Score legend; Noul probability of yes only |
| Composition | Shared fail-closed router; all actions simulated; safety holds independent of the slider |
| Workflow | Actual exported rubrics and raw routing source, with copy control |
| Economics | Workload arithmetic from published input pricing; explicitly ratio-derived comparator |
| Evaluation | 240 deterministic synthetic variations with synthetic truth labels, calculated through the shared router |
| Optional transport | Server-side Worker boundary, disabled by default; no configured live integration |

### Code map

- `src/contract.ts`: discriminated types, official confidence formulas, strict request/response validation.
- `src/questions.ts`: `CLAIM_QUESTIONS` and `buildRequest(state)`; fresh six-question rubric, request model `jev-latest`.
- `src/samples.ts`: twelve invented narratives and invented policy/attachment descriptions, not uploaded records.
- `src/mock.ts`: exact text/rubric matching, synthetic distributions, conservative arbitrary-request answers, external fixture provenance.
- `src/adapter.ts`: default offline `evaluateClaim`, rough sizing helper, explicit same-origin Worker adapter factory.
- `src/routing.ts`: `routeClaim(response, threshold)` and simulated routing reasons.
- `src/economics.ts` / `src/evals.ts`: shared calculator and evaluation calculations used by the UI.
- `src/App.tsx`: the six-section interface; retains the returned object and invalidates stale results on input changes.
- `worker/adapter.ts` / `worker/index.ts`: optional server-only transport and security checks.
- `worker/site.ts` / `wrangler.jsonc`: public static-asset wrapper and disabled-by-default Cloudflare deployment configuration.
- `.github/workflows/pages.yml`: owner-triggered GitHub Pages fallback with explicit base path and scoped permissions.
- `scripts/check-package.mjs`: byte-preserving public-asset/document and local-reference checks, without a browser.
- `app/index.html`: Vite's development/build HTML source. The root `index.html` and static directories are compiled Pages artifacts, refreshed by `npm run prepare:pages`.
- `demo/`: isolated desktop capture, free narration and Remotion composition. Its README documents the reproduction prerequisites and ordered pipeline; generated media is delivered separately, not committed.
- `tests/contract.test.ts`, `tests/engine.test.ts`, `tests/evals.test.ts`: offline contract, routing, transport, economics, and evaluation checks; `tests/audit.test.ts` adds independent regression checks; `tests/integration.test.ts` covers six-section static React rendering, wrapper logic, deployment configuration, and rights packaging. Static rendering does not test browser interaction.

## The technical contract

The official [HTTP API](https://docs.typesafe.ai/api.md), [primitives](https://docs.typesafe.ai/primitives.md), and [confidence definitions](https://docs.typesafe.ai/confidence.md) take precedence over broad marketing descriptions.

A request is `{ state, model, questions }`. State supports a JSON string, object, or array; the shared TypeScript interface declares `state: unknown` and validates at runtime. Questions are a map of named typed questions. A response is `{ model, answers, usage: { input_tokens, output_tokens } }`, with exactly one answer for each question ID.

| Primitive | Question criteria | Answer fields, including the discriminant |
| --- | --- | --- |
| Choice | Map of full option keys to descriptions, structured descriptions, or `null`; 1–255 options in this validator | `type: 'choice'`, `choice`, `probabilities`, `confidence` |
| Score | Ordered array of 2–10 level descriptions | `type: 'score'`, `score`, `legend`, `probabilities`, `confidence` |
| Noul | Optional `true` / `false` descriptions | **Only** `type: 'noul'`, `noul` |

Choice probabilities cover every criteria key and sum to 1. Score probabilities and legend use string keys for zero-based positions; `score` is the probability-weighted mean, not the most likely level. The two five-level rubrics display **score + 1**, giving a 1–5 display while the wire response remains 0–4, potentially fractional. Noul has no separate confidence or probability map.

For probabilities `p`, `n` options/levels, and most likely Score level `m`:

```text
Choice confidence = clamp((n × max(p) − 1) / (n − 1), 0, 1)
Score mean        = sum(i × p[i])
Score spread      = sum(p[i] × abs(i − m))
Uniform spread    = sum(abs(i − (n − 1)/2)) / n
Score confidence  = clamp(1 − Score spread / Uniform spread, 0, 1)
```

The implementation treats a one-option Choice as confidence 1. It rejects extra/missing answer keys, malformed probabilities, inconsistent means/confidence/legends, and invented Noul fields. The 255 limit is **Choice option cardinality**, not a documented blanket limit on questions. Arbitrary valid question maps are supported by the mock, including structured rubrics; that does not make arbitrary responses eligible for simulated autonomy.

### Routing is application policy, not model authority

The fixed IDs are `claim_type`, `severity`, `fraud_signal`, `liability`, `documentation_completeness`, and `churn_risk`. Routing confidence is the **minimum** confidence across the two Choices and two Scores, not an average and not a Noul confidence.

Simulated autonomy requires recognized exact-fixture provenance and all of these conditions:

- Every required Choice/Score confidence meets the supplied threshold.
- Integrity Noul is **≤ 0.15**; synthetic policy-alignment Noul is **≥ 0.90**.
- Documentation mean is **≥ 3.8** on the raw 0–4 scale and probability of level `4` is **≥ 0.90**.
- No fixture hold, unknown type, dispute/prior-condition hold, urgent narrative, or high cancellation risk.

Prior-condition probability ≥ 0.15 independently holds; high churn choice or high-churn probability ≥ 0.25 independently holds. Urgency is a fixture flag, raw severity mean ≥ 3, or probability of raw severity level `4` ≥ 0.25. Valid urgent cases prioritize human review. Invalid inputs or thresholds fail closed. Remaining eligible illness cases or cases with raw severity ≥ 1.5 use simulated fast-track; other eligible cases use simulated auto-approve.

**Retain the original returned response object.** Trusted synthetic provenance is stored outside the published JSON shape in a WeakMap. JSON serialization, spreading into a new object, or structured cloning loses that provenance; cloned, custom, and live responses stay human-only. Reading JSON for display does not require replacing the stored object. Do not mutate its answers in the interface.

## Economics and evaluation honesty

At the UI's default **50,000 claims/month × 1,500 input tokens/claim**, the illustrative input cost is **$3.15/month** at TypeSafe's published **$42/billion input tokens**, output free. Input includes state and all question overhead. The implied comparator is $3.15 × 444.6 = **$1,400.49**, not independently priced LLM usage.

The latency illustration is **114 ms per batch request**, with the published **70–500 ms** range disclosed. Multiplying 114 ms by 193.6 gives a **22,070.4 ms ratio-derived comparator**, not a measured claim latency or total monthly processing duration. The 193.6×/444.6× figures come from TypeSafe's specific published workflow results; the launch article says gains are likely toward the higher end of real-world results. They are not measured Claims One benefits.

Mock `usage` counters are **zero**, because no API ran. `estimateInputTokens` separately estimates serialized characters divided by four; it is not a tokenizer. The UI's local elapsed demo runtime is not Jev latency. The economics input is a user-supplied assumption, not automatically measured usage.

Evaluation labels and disagreements are deterministically constructed, including a relationship between generated confidence and label agreement. The charts demonstrate inspectable calculations, not independent calibration evidence. Read [Metrics](METRICS.md) for exact denominators and the proposed measurement plan.

## Privacy: synthetic input only

Do **not** paste real claims, names, contact details, medical records, invoice images, policy IDs, bank details, or other personal data into this public demonstration. Use invented narratives only. The default evaluation is local JavaScript with no model request, claim storage service, or claim logging. This is not a legal promise about the hosting provider's access logs or a replacement for a privacy review.

An optional live integration would send state and questions through the Worker to TypeSafe, changing the data boundary. It needs explicit consent, approved retention/security terms, data minimization, jurisdiction review, and representative evaluation before any real records are considered. No such approval or integration is claimed.

## Optional server-side Worker adapter

The mock adapter mirrors the documented `/v1/systemone` endpoint's request and response shapes. A real key drops in through one server-side adapter file, `worker/adapter.ts`, plus the `TYPESAFE_API_KEY` environment variable. That describes the credential/transport boundary, not permission to turn the published demo live; explicit wiring and the security gates below are still required.

**Keep the published demo offline.** An API key alone does not enable the shipped interface. `evaluateClaim` always calls the mock. A future controlled deployment would explicitly wire `createWorkerAdapter('/api/evaluate')` into the adapter boundary and deploy the Worker on the **same origin**. At a subpath, this is still an origin-root API route. Static hosting alone does not create that route.

The browser factory accepts no key. `worker/adapter.ts` is the only transport that supplies `Authorization: Bearer …` to `POST https://api.typesafe.ai/v1/systemone`. Never put the key in `VITE_*`, client code, HTML, screenshots, a commit, or a browser request payload.

The public page should stay accessible without a sign-in wall. A future live **API route**, not the public static demo, must be protected with Cloudflare Access and the controls below. All are required by `worker/index.ts`:

| Server setting or binding | Purpose |
| --- | --- |
| `ENABLE_LIVE` | Must explicitly equal `true`; otherwise disabled |
| `TYPESAFE_API_KEY` | Server-only secret, never a public build variable |
| `ALLOWED_ORIGIN` | Exact HTTPS origin, no path or trailing slash |
| `ACCESS_TEAM_DOMAIN` | Valid Cloudflare Access team hostname ending in `.cloudflareaccess.com` |
| `ACCESS_AUD` | Expected Access application audience |
| `LIVE_ALLOWED_EMAILS` | Comma-separated identity allowlist, checked after signature verification |
| `LIVE_RATE_LIMITER` | Runtime binding exposing `limit({ key })`; both per-identity and endpoint-wide quotas must succeed |

The handler verifies signed RS256 Access assertions, issuer, audience, expiry, and allowlisted identity. It checks method, content type, origin, same-origin fetch metadata when present, a streamed **32 KiB** request-body limit, and model `jev-latest`. It returns no-store responses, applies timeouts, validates the full upstream response, and emits generic errors rather than upstream claim contents. It performs **no automatic retries**. This is deliberately more conservative than the official API's retry guidance.

Static Worker deployment configuration is supplied, but an Access application, quota values, budget approval, credentials, and a verified live connection are **not supplied** by the project. Offline tests use injected transports and locally signed synthetic identities; they do not certify Cloudflare deployment or a real TypeSafe exchange. Even a valid future live response remains human-only under the current router. See [Roadmap](ROADMAP.md) for the gates before that can change.

## Documentation index

- [Product requirements](PRD.md) — problem, audience, scope, acceptance criteria.
- [Five Whys](FIVE-WHYS.md) — hypotheses, evidence, and discovery questions.
- [Jobs to be done](JTBD.md) — operator, developer, owner, and policyholder needs.
- [Metrics](METRICS.md) — actual synthetic formulas and proposed product measurement.
- [Test plan](TEST-PLAN.md) and [Test results](TEST-RESULTS.md) — intended checks versus execution evidence.
- [Viability](VIABILITY.md) — product direction, developer empathy, and usage-analysis mapping.
- [Roadmap](ROADMAP.md) — gated v1 → v2, further verticals, and evaluation tooling.
- [Decision log](DECISIONS.md) — my implementation tradeoffs.
- [Maintenance context](AGENTS.md) — standing product and verification rules.
- [Sources](SOURCES.md) — public API, commercial-claim provenance, and bundled asset ledger.
- [License and rights](LICENSE.md) — MIT for original work only; third-party wordmark, artwork, fonts, and dependency rights excluded.
- [Brand reference](BRAND.md) and [visual brand guide](docs/brand/index.html) — observations, assets, typography limitations, and rights.

## Ownership and non-affiliation

TypeSafe AI, Jev, their trademarks, and referenced imagery belong to their respective owners. Public availability of a brand asset is not permission for unrestricted reuse. The brand study records source URLs and reuse caveats. Commercial headline fonts are not redistributed; the interface uses an approximate system sans-serif fallback. Fragment Mono is bundled under its preserved SIL Open Font License. This is not a first-insurance-example claim: TypeSafe already publishes an auto-insurance Noul self-consistency cookbook, linked in [Sources](SOURCES.md).

**An independent concept by Ayo Ahmed.**
