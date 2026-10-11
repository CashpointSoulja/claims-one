# Product requirements — Claims One v1

[Documentation index](README.md) · [Jobs](JTBD.md) · [Metrics](METRICS.md) · [Roadmap](ROADMAP.md)

## Product statement

**Claims One turns the TypeSafe AI System One contract into an inspectable pet-claims triage experience.** One invented claim fans out into six independent typed questions; ordinary code composes their answers into a simulated route. Uncertainty is visible, and a human-review path is a first-class result.

This is an independent concept by Ayo Ahmed, not an official TypeSafe product. v1 is a static, mock-only reference—not an insurer service, a live Jev evaluation, or a claim-payment system.

## Problem and evidence level

**Problem hypothesis:** teams exploring structured decision automation may understand an API's types but still struggle to design the surrounding workflow: rubrics, risk holds, threshold selection, evaluation, and safe deployment. A vertical reference could shorten that translation.

**Domain hypothesis:** first-notice-of-loss (FNOL) intake has repeatable classification and routing needs, but missing evidence, disputed onset, urgency, and inconsistent documentation limit delegation. The size of that opportunity and actual operator pain have not been measured here. No claim is made that all insurance workflows are manual, that current LLM pipelines always fail, or that claims triage is the largest insurance decision category.

**Observed public evidence:** TypeSafe documents typed primitives, independent batched evaluation, and application-code composition. Its existing auto-insurance Noul self-consistency cookbook already explores insurance. Claims One adds a separate pet-claims product surface, six mixed primitives, an adjustable threshold, explicit holds, transparent economics, and an illustrative evaluation dashboard. It is not a claim to be the first enterprise application or first insurance example. See [Sources](SOURCES.md).

## Users and jobs

| User | Job | Product response |
| --- | --- | --- |
| Workflow developer | Understand the contract and compose bounded decisions without putting secrets in a browser | Exact types, raw request/response, actual copyable rubrics/router, server-only adapter boundary |
| Claims operations reviewer | See why a claim stays with a person and what evidence is missing | Reasons, urgent review, policy ambiguity and documentation holds; no automatic denial |
| Product/risk owner | Explore the delegation/quality tradeoff with denominators, not a single confidence badge | Shared threshold, autonomy rate, conditional accuracy, reason counts, synthetic provenance |
| Policyholder, indirectly | Receive appropriate attention without uncertain evidence being treated as a coverage decision | Human escalation and explicit limitation of churn/integrity signals |

These are proposed personas, not interviewed participants. v1's primary hands-on user is the developer/product reviewer, not a policyholder submitting a real claim.

## Goals

1. Make state + typed questions + composed code understandable in one sitting.
2. Show how probabilities, confidence, and domain-specific holds differ.
3. Demonstrate a safe **simulation** of changing delegation, not authority to pay or deny.
4. Make assumptions, data provenance, and verification evidence as inspectable as the UI.
5. Offer a portable, credential-free static artifact and an optional protected server integration boundary.

## Non-goals

- Real payments, coverage decisions, denials, fraud findings, or medical advice.
- Reading attachments, validating invoices, retrieving a policy, or verifying the narrative's factual truth.
- Live API access, benchmark reproduction, production accuracy/calibration claims, or actual customer analytics.
- Identity onboarding, a claim database, real policyholder records, or a compliance certification.
- Proving exact licensed reproduction of commercial typography or ownership of third-party assets.

## Requirements and acceptance criteria

| ID | Requirement | Acceptance criterion |
| --- | --- | --- |
| R1 | Six-section, desktop-first single-page reference | Hero, Triage, Workflow, Economics, Evaluation, Docs anchors; usable narrow layout; source docs linked |
| R2 | Accurate public provenance | Visible mock label, synthetic inputs/evals, simulation labels, economics caveats, non-affiliation, exact footer credit |
| R3 | Synthetic claim editor | Twelve unique clearly invented samples; 20–12,000-character demo limit; no real-record encouragement; edits clear stale results |
| R4 | One batch contract | `buildRequest` includes state, `jev-latest`, and six fixed question IDs; mock evaluates questions independently through one batch, not sequential inference calls |
| R5 | Exact primitive presentation | Choice includes all criteria keys, selected option, probabilities, confidence; Score includes legend, mean, probabilities, confidence; Noul includes only type and noul |
| R6 | Score scale distinction | Five levels display 1–5 using raw score + 1; raw response, legend/probability keys, and routing use 0–4 positions |
| R7 | Fail-closed simulated routing | Invalid shape/threshold and unknown/custom/cloned/live responses remain non-autonomous; all required Choice/Score confidences meet threshold before delegation |
| R8 | Independent holds | Integrity probability > .15, policy alignment < .90, incomplete records, disputed/prior condition, unknown type, high churn, and urgency override the confidence slider |
| R9 | Demonstrable threshold change | Routine dental at .85 is human review and at .65 is simulated auto-approve on the same original response; risky cases remain human-only |
| R10 | Inspectable workflow | Actual shared question definitions and actual routing source are readable and copyable; independent questions over one state are accurately depicted |
| R11 | Honest economics | Input-only published rate; assumptions/units visible; 193.6×/444.6× only ratio-derived illustrations, not measured artifact benefits |
| R12 | Calculated synthetic evaluation | 240 deterministic truth-labeled variations; metrics, bins, and primary reasons computed through the shared router; correct denominators; empty autonomous accuracy is null |
| R13 | Credential isolation | Default adapter does not fetch; optional Worker owns the key, validates origin/identity/quotas/body/upstream; public static page needs no account |
| R14 | Build and portability | Documentation copied/rendered from root sources; relative Vite base; root/subpath links and assets verified before release |
| R15 | Usable and accessible interactions | Keyboard labels/focus, non-color-only statuses, readable chart tables, reduced-motion support; no unhandled console errors in recorded verification |

R1, R14, and R15 require rendered browser/deployment checks, not just source review or static rendering. The acceptance matrix is operationalized in [Test plan](TEST-PLAN.md); actual outcomes belong in [Test results](TEST-RESULTS.md).

### Fixed question design

| ID | Primitive | What it is allowed to mean |
| --- | --- | --- |
| `claim_type` | Choice | Reported category, including `pre_existing` and `other`; not entitlement |
| `severity` | Score | Narrative urgency rubric, not clinical advice |
| `fraud_signal` | Noul | An inconsistency needing human investigation, not fraud guilt |
| `liability` | Noul | Alignment with stated synthetic policy evidence, not insurer liability |
| `documentation_completeness` | Score | Completeness of the stated record list, not documents inferred into existence |
| `churn_risk` | Choice | Explicit cancellation intent/service attention, not demographics or eligibility |

Question text, distribution fixtures, router, and evaluation logic live in shared modules. The UI must not create a second implementation of routing or metrics. See [README technical contract](README.md) for formulas and exact numerical holds.

## State and interaction requirements

- Evaluating freezes the submitted request for its response view; text changes invalidate pending results and clear old answers.
- Double submission is guarded. A rejected evaluation exposes an error rather than leaving a stale success decision visible.
- Threshold changes re-run routing and evaluation calculations without another inference call.
- The original returned response object is retained. Synthetic fixture provenance is external to JSON; clones lose eligibility.
- Custom input uses uniform Choice/Score distributions and Noul .5, not a plausible-looking fabricated diagnosis. Exact sample and rubric matching is required for fixture responses.
- Urgent review is prioritized human attention; every route remains simulated.

## Success definition

### v1 release criteria

All critical contract, isolation, and fail-closed checks pass with recorded evidence; public mock/synthetic framing is visible; documentation and assets resolve; the .85 → .65 dental demonstration works; risk holds do not change with the slider; browser verification finds no blocking interaction/accessibility defects. A static build does not substitute for the logged-out deployed-site check.

### Proposed discovery criteria, not achieved results

In a consented six-person developer comprehension study, aim for at least **5/6** participants to distinguish Noul from Choice/Score and correctly explain that mock autonomy is not coverage authority, after an unguided ten-minute task. At least **4/6** should locate the server-only key boundary and reproduce the intended dental threshold change. These are small-sample diagnostic targets, not generalizable adoption statistics or a release authorization for real claims.

A future production pilot must define its own representative held-out labels, risk-specific error bounds, service-level budgets, review capacity, privacy approval, and rollback trigger before activation. Synthetic metrics and published workflow ratios cannot satisfy those gates. [Metrics](METRICS.md) specifies denominators and candidate experiments; [Roadmap](ROADMAP.md) specifies stage transitions.

## Constraints and dependencies

No credential is required for v1. The live adapter is an option in source, not a turnkey deployed integration: it additionally needs origin policy, verified Cloudflare Access identities, allowlisted users, mandatory quotas, server configuration, budget approval, and live validation. Even then the current router keeps live responses human-only.

Brand reference material retains third-party ownership and reuse caveats. Literal commercial typography needs an appropriate licence; the shipped system fallback is explicitly approximate. Public release must keep the non-affiliation notice and **“An independent concept by Ayo Ahmed.”**

## Open product questions

1. Which intake judgments can operators reliably label without interpreting an entire policy?
2. Does the shared minimum-confidence gate create too much review load, especially when service signals are uncertain?
3. Are the category and completeness rubrics comprehensible and actionable across insurers?
4. Does a reference template reduce integration effort beyond TypeSafe's existing cookbook?
5. Would developers prefer an evaluation harness, reusable integration package, or another vertical first?

None is answered by the invented fixtures. The next step is discovery and controlled shadow evaluation, not expanding simulated payment authority.
