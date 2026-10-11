# Roadmap — gated v1 → v2

[Documentation index](README.md) · [Viability](VIABILITY.md) · [Metrics](METRICS.md) · [Test plan](TEST-PLAN.md)

This is a proposed sequence, not a dated delivery promise or a record of completed customer pilots. Every stage needs an accountable owner and evidence at its exit gate. A passed synthetic test does not authorize a real insurance action.

## Current v1 boundary

The source implements a portable static React/Vite reference, twelve invented pet claims, six mixed typed questions, offline fixture evaluation, fail-closed simulated routes, workload economics, and 240 deterministic synthetic eval variations. The optional same-origin Worker transport exists in source but is disabled by default and is not a configured live deployment.

The public experience must retain **Mock demo**, no real claimant records, and **“An independent concept by Ayo Ahmed.”** Static build readiness, rendered UI verification, logged-out public availability, and production readiness are different milestones. Read [Test results](TEST-RESULTS.md) for actual verification evidence.

## Stage 0 — reference release

**Deliverable:** a clearly independent public static concept with functioning links, inspectable code, and truthful demonstrations.

**Exit gate:**

- Record contract, routing, economics/eval, typecheck, lint, and production build results.
- Verify desktop and narrow layout, keyboard use, chart tables, stale-result handling, clipboard fallback, source/HTML document links, and root/subpath assets.
- Confirm the deployed static page loads logged out without a sign-in wall.
- Verify the dental .85 → .65 change and threshold-independent risk holds in the rendered experience.
- Scan source and rendered metadata for unintended attribution, private material, machine paths, exposed credentials, and misleading live/benchmark claims.
- Retain third-party ownership, font licence, non-affiliation, and approximation notices.

**Stop:** any unsafe hold bypass, secret exposure, misleading provenance, missing document, or blocking interaction defect prevents calling the reference release verified.

## Stage 1 — discover the actual adoption problem

**Deliverable:** a concise evidence memo from consented developer tasks, operator workflow mapping, and independent risk review.

**Questions:** does this productized template add value beyond official docs and the existing insurance cookbook? Which judgments are sufficiently narrow? Where do people misunderstand confidence, Noul, Score, or live-key placement?

**Exit gate:** repeatable integration or evaluation friction is observed; a developer can reproduce the contract safely; reviewers agree on a bounded action/hold taxonomy; the proposed rubric's limits are explicit. Diagnostic study targets are in [PRD](PRD.md), and denominators/confounds are in [Metrics](METRICS.md).

**Stop or redirect:** if the main barrier is procurement, policy retrieval, privacy, or an adequate deterministic rule, address that rather than adding more probabilistic UI.

## Stage 2 — controlled live shadow evaluation

**Deliverable:** a separately approved server integration and independently labeled evaluation corpus. Nothing changes the published static demo's default.

### Technical dependencies

1. Deploy the Worker on the same origin with an explicit `/api/evaluate` route; supply deployment/runtime configuration not included in v1.
2. Use a server-only `TYPESAFE_API_KEY` and explicit `ENABLE_LIVE=true` only after authorization and budget approval.
3. Configure exact HTTPS `ALLOWED_ORIGIN`, a Cloudflare Access team/application (`ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`), `LIVE_ALLOWED_EMAILS`, and mandatory `LIVE_RATE_LIMITER` quotas. Protect the API route, not the public mock page.
4. Explicitly wire `createWorkerAdapter` at the adapter boundary; merely setting an environment variable does not replace the default mock.
5. Validate deployed identity verification, origin enforcement, streamed limits, upstream response validation, error redaction, timeouts, quotas, and cost shutoff. Offline injected tests are not deployment proof.
6. Re-read the official API, primitive, and confidence documentation before any schema changes; test the supported model alias and actual usage accounting.

### Evidence and privacy dependencies

- Approve minimized synthetic or appropriately authorized data, consent, retention/deletion, legal/vendor terms, jurisdiction, and security review before handling real records.
- Define independent reviewer labels, disagreement adjudication, rubric/policy/model versioning, and claim-separated tuning/held-out splits.
- Predeclare allowed error bounds, critical hold coverage, subgroup checks, review capacity, latency/cost budgets, and rollback owners.
- Measure actual live usage and network latency separately from fixture counters, token estimates, and published-workflow illustrations.

**Exit gate:** held-out performance meets the risk owner's predefined bounds with sufficient sample precision, no unresolved critical hold bypass, acceptable review load, and verified deployed controls. Even then, **current live responses remain human-only**: the router only trusts external synthetic fixture provenance. Do not forge that provenance or add unpublished fields to make live responses autonomous.

**Stop:** any data incident, critical hold bypass, authentication/quotas failure, unacceptable quality uncertainty, or review overload disables the live path and returns work to human review.

## Stage 3 — reviewer assistance

**Deliverable:** an authorized human workbench using typed answers to prioritize attention and request missing evidence. Reviewers retain final authority; no payment, denial, fraud finding, or coverage determination is automatic.

**Requirements:** real queue ownership, evidence provenance, audit trail with minimized retention, override/disagreement capture, urgent handling, appeal/escalation process, and agreed service levels. A production system must distinguish an estimate, an invoice, a medical note, and verified policy data; v1 only demonstrates narrative summaries.

**Exit gate:** a controlled assisted pilot improves time to appropriate attention or correct-route efficiency against a predefined comparator without worse safety, rework, complaints, or subgroup outcomes. Include all assigned intake records in reporting, not only successful API calls.

**Stop:** a confirmed harmful route or critical hold bypass pauses the affected path. Trends in quality, queue capacity, or costs crossing predefined bounds also trigger rollback. Resume only after reviewed remediation and fresh evidence.

## Stage 4 — bounded delegation, if justified

**Deliverable:** a separate, narrowly scoped policy for reversible workflow actions, not a blanket autonomous insurer.

This stage is not a commitment to payments. “Auto-approve” in the mock is a demonstration label, not the action design for a regulated production rollout.

**Exit gate before any delegation:** domain/legal approval, independently validated action-specific confidence policy, complete verified evidence, critical holds, human challenge/override, mature outcomes, audit sampling, monitoring, rollback, and a kill switch. The response/provenance architecture must be deliberately redesigned and reviewed; do not relabel a live JSON response as a fixture.

**Stop:** without these conditions, remain human-assisted indefinitely. Raising a slider or publishing more synthetic rows is not a substitute.

## v2 workstream — evaluation harness as a product

If discovery validates the need, package the current transparent calculation pattern into reusable tooling:

- Versioned question/rubric, model, routing policy, and dataset identifiers.
- Import of approved labeled examples with data minimization and explicit consent/retention rules.
- Independent label adjudication and dataset-leakage checks.
- Threshold sweeps with counts, null-safe metrics, confidence intervals, per-action and subgroup breakdowns.
- Separate primary and multi-label escalation analyses.
- Offline regression suites plus optional authorized live shadow runs; never silently fall back to a paid API.
- Comparison runs that record actual usage, latency distribution, retry/failure rates, region, concurrency, and quality target.
- Exportable evidence reports with provenance and reproducible configuration, not chart-only hardcodes.

**Gate:** developers can use it on a second independently defined workflow, accurately explain its evidence limits, and identify a regression it catches. Distribution packaging, multi-tenant storage, billing, and compliance are not included in v1.

## v2 workstream — additional vertical templates

TypeSafe's public use-case map already lists multiple industries. These are productization candidates, not claims to invent those use cases.

| Candidate | First bounded workflow | Why explore it | Additional gate |
| --- | --- | --- | --- |
| Support triage | Classify intent/urgency and route to a queue; no automatic refund | Often reversible queue actions and clearer label opportunities | Validate urgency/service policy and personal-data handling; human escalation for ambiguous or sensitive tickets |
| Content moderation | Flag for review using explicit policy; no irreversible removal in the initial pilot | Useful test of policy-versioned rubrics and disagreement analysis | Language/subgroup review, reviewer welfare, rights/appeal process, and treatment of policy ambiguity |
| KYC | Assess stated document completeness and route to a specialist; no automated rejection or identity assertion | Tests high-stakes evidence and workflow boundaries | Regulated identity/privacy review, document authenticity limits, auditability, human approval, and stricter rollout controls |

Prefer the lowest-stakes workflow with the strongest available labels, not the most impressive-looking decision. Each vertical needs its own rubric, evidence, holds, harm analysis, and rollout approval; a pet-claim threshold is not transferable.

## Resource and sequencing principle

Invest first in evidence, shared contracts, safety regression coverage, and developer usability. Preserve the static demo as a no-account entry point. Keep live spend explicitly authorized and bounded. Choose between another vertical, integration packaging, and evaluation tooling using observed friction—not the published 193.6×/444.6× multipliers or synthetic calibration appearance.
