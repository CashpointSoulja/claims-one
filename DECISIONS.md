# Decisions — Ayo Ahmed

[Documentation index](README.md) · [Product requirements](PRD.md) · [Sources](SOURCES.md)

I wrote this log to make my product choices and their limitations inspectable. These are implementation decisions, not customer research findings or a record of production performance.

## 1. I chose a full pet-FNOL reference, not a claim of being first

I chose pet-claims intake because an invented narrative can make category, urgency, evidence gaps, disputes, and service attention concrete in one screen. I narrowed the implementation to six mixed questions and twelve synthetic claims instead of implying broad insurance coverage.

I found that TypeSafe already lists FNOL in its public use-case map and publishes an auto-insurance cookbook with 14 Noul questions repeated 15 times per condition. That example already includes probability heatmaps, uncertainty bands, human routing, and per-call economics. My contribution is a fuller interactive pet-FNOL template, application policy, adjustable delegation plus nonoverrideable holds, a workload calculator, and a synthetic evaluation/documentation surface—not invention of insurance routing.

**Tradeoff:** the reference is approachable, but its scope and invented evidence cannot validate real claims operations. I will revisit the vertical if developer and operator discovery identifies a stronger or lower-risk problem.

## 2. I kept the default demo offline

I chose explicit synthetic distributions rather than suggesting that a credential-free site is running Jev. The default adapter has no network, environment lookup, or live fallback. Exact full-text and rubric equality select the fixture. Any edited/custom narrative receives generic uncertain answers.

I separated a protected server transport option from that default. A real key belongs only on the server; it is not a browser setting or a promise that a static host supplies the API route.

**Tradeoff:** the demo teaches composition, not model capability. That is preferable to plausible-looking fabricated inference. Any live integration needs deliberate wiring, security/budget approval, and recorded verification.

## 3. I treated the API's answer shapes as product requirements

I used the official HTTP, primitive, and confidence documentation rather than broad marketing descriptions. Choice preserves every option key, probabilities, and derived confidence. Score preserves its legend, mean, distribution, and confidence. Noul returns only `type` and `noul`.

I kept wire Scores zero-based and used `score + 1` only for the 1–5 display. I used 255 as the Choice-option limit and 2–10 as the Score-level range, without inventing a universal question-count limit.

**Tradeoff:** exact schema details add explanation to the interface, but silently flattening them would make the reference less useful and less safe to copy.

## 4. I separated confidence from permission

I chose the minimum of all required Choice/Score confidences rather than an average that could hide one uncertain judgment. I added independent holds for integrity, policy ambiguity, incomplete documents, prior-condition/dispute evidence, unknown type, urgent narratives, and high service risk. I threshold the two Nouls directly; I do not invent Noul confidence.

The dental fixture's minimum confidence is 70%. It stays human-reviewed at .85 and shows simulated auto-approve at .65. I chose it as an inspectable threshold example, not a recommended production setting.

**Tradeoff:** the reference may over-escalate, particularly because it includes churn confidence in the minimum gate. A future action-specific gate could be better, but I would require independent evidence before relaxing it. Nothing here pays, denies, determines fraud, or assures coverage.

## 5. I kept synthetic trust outside the published JSON contract

I used external object provenance so the response shape remains the documented `{ model, answers, usage }`. A valid JSON shape alone is not evidence that an arbitrary response came from a recognized synthetic fixture. Custom, cloned, serialized, and live responses therefore remain human-only.

The UI retains the original returned object and clears stale results when text changes. Displaying JSON is fine; replacing the stored response with a JSON round trip is not.

**Tradeoff:** object identity is a demo-specific boundary, not a production evidence system. Real delegation would require a separately reviewed provenance/policy design, not a forged fixture marker or an extra API field.

## 6. I used one batch and shared engine functions

I put all independent questions over one state in a single request. The mock uses `Promise.all`; composition happens after typed answers exist. I made the interface use the same routing, economics, and evaluation functions as the engine rather than hardcoding parallel versions of them for charts.

I exposed the actual question definitions and routing source as the workflow view. I chose inspectable code over a fictitious reasoning transcript.

**Tradeoff:** the graph is a useful mental model, not a trace of live inference or measured concurrency. It should never be narrated as six real model calls in this demo.

## 7. I made the economics arithmetic reproducible, not a benchmark

I used the published $42/billion input-token price with output free. I made input tokens per claim a visible assumption including the state and questions. I used the published 444.6×/193.6× workflow ratios only to derive illustrative comparators, and kept the latency scenario at 114 ms within the published 70–500 ms range.

I kept mock API usage counters at zero and token estimates separate. Local demo runtime is not Jev latency. Human review, policy verification, infrastructure, integration, retries, and evaluation costs are excluded and must be named.

**Tradeoff:** ratio-derived comparators are easy to understand but not independent pricing or speed evidence. I would replace them with a matched, authorized measurement study before making a customer benefit claim.

## 8. I shipped calculated synthetic evaluations with visible limitations

I chose 240 deterministic variations with synthetic truth labels so the dashboard exercises the real router and has reproducible denominators. I return null accuracy when no rows are autonomous and use one primary reason per escalation so counts reconcile.

I also disclose that generated confidence and label agreement are deliberately related. A persuasive-looking calibration plot is not independently measured calibration, and twenty variants of one claim do not become twenty independent real cases.

**Tradeoff:** this is useful for explaining metric design and catching calculation regressions, not for selecting a production confidence threshold. Held-out independent labels and operational evidence are the next gate.

## 9. I chose portability and a protected server boundary

I chose a static React/Vite build with relative asset paths and root Markdown rendered/copied into the public documentation. The reference can remain public without a sign-in wall.

For the optional live API route I required server-only credentials, exact HTTPS origin, verified Cloudflare Access identity and audience, an email allowlist, mandatory per-identity/global quotas, streamed body limits, validated upstream answers, timeouts, generic errors, and no-store responses. I chose no automatic retries in this version to avoid silently expanding spend.

**Tradeoff:** these controls make a future adapter more than “paste a key.” Deployment configuration and real integration verification remain separate work, and live responses still do not qualify for simulated autonomy.

## 10. I mirrored observed visual language without claiming licensed typography

I followed the public brand study's paper/ink editorial opening, literal transparent TypeSafe AI wordmark, bounded sky scene, dark working console, restrained pink accents, and evidence/nuance voice. I did not describe a generic all-dark landing page as an identical public-site reproduction.

I kept commercial font files out of the repository, used an explicitly approximate system sans-serif fallback, and retained the licensed Fragment Mono font with its licence. I preserved third-party asset ownership and non-affiliation rather than implying TypeSafe endorsement.

**Tradeoff:** the result is a close visual reference with a typography limitation, not a claim of unrestricted rights or exact commercial-font identity. Broader commercial reuse needs rights review.

## 11. I separated verification intent from evidence

I put planned checks in the test plan and reserve the test-results document for actual execution evidence. Source review, automated tests, static rendering, rendered browser checks, and logged-out public availability establish different things. I do not promote one into proof of another.

**Tradeoff:** delivery has more explicit gates, but a credible reference must be precise about what has—and has not—been verified.

## Revisit triggers

I would reconsider the rubric or gates after independent reviewer disagreement, new supported API semantics, demonstrated developer confusion, a critical hold defect, unacceptable review load, a rights issue, or representative live shadow evidence. I would not relax them merely because a synthetic chart looks well calibrated or a published workflow ratio is impressive.
