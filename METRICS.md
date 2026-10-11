# Metrics — safety before delegation

[Documentation index](README.md) · [Product requirements](PRD.md) · [Roadmap gates](ROADMAP.md)

## Status and north-star hypothesis

**No production usage is measured in Claims One.** The current dashboard calculates deterministic synthetic results. There is no analytics ingestion, customer cohort, live Jev inference, independent calibration study, or measured insurer savings.

For a future validated triage product, a candidate north star is **correct permitted routes per reviewed hour, subject to safety and equity constraints**. The numerator must be audited correct routes, not just routed records; the denominator must include review and exception work, not only inference duration. Whether this is the right business metric requires operator discovery.

Autonomy rate is a coverage metric, not a quality metric and not a goal to maximize in isolation.

## Proposed metrics tree

```text
Useful, trustworthy triage
├── Safety: critical hold bypasses, harmful misroutes, privacy incidents
├── Quality: route agreement, per-question errors, subgroup gaps, appeals
├── Coverage: permitted autonomy, human-review share, reason composition
├── Operations: time to appropriate attention, queue load, rework
├── Economics: total cost per correct permitted route, not token cost alone
└── Adoption: developer comprehension, valid integration, repeated useful use
```

The tree is a measurement design, not implemented telemetry. Production signals need a privacy-approved collection plan and independent truth labels.

## What the synthetic dashboard actually computes

`src/evals.ts` builds **12 invented claims × 20 variants = 240 rows**. It changes claim-type Choice concentration, recomputes its official confidence, and routes each response through the actual validator/router. The baseline `predictedAction` is the route at threshold **0**, which still preserves every safety hold. Row confidence is the minimum of the four required Choice/Score confidences.

Truth actions are **constructed**, not independently observed: a deterministic draw is compared to row confidence; agreeing rows use the baseline action, and disagreements use an alternative synthetic action. This deliberately couples generated confidence and agreement. Plotting it near a calibration diagonal is not evidence that Jev or an insurer workflow is calibrated. Variants of one narrative are not 20 independent clinical or insurance cases.

| Quantity | Exact calculation / denominator | Important reading |
| --- | --- | --- |
| `total` | All 240 synthetic rows evaluated at the supplied threshold | Not live monthly claims |
| `autonomous` | Rows for which the shared router sets `autonomous: true` | Only simulated auto-approve or fast-track |
| `escalated` | `total − autonomous` | Includes urgent and ordinary human review |
| `correctAutonomous` | Autonomous rows whose current route equals synthetic `truthAction` | Correctness is synthetic action agreement, not coverage accuracy |
| `autonomyRate` | `autonomous / total` | Coverage across all rows, including safety holds |
| `autonomousAccuracy` | `correctAutonomous / autonomous` | **null** when autonomous is zero; do not render 100% |
| Bin `count` | Rows whose minimum required confidence falls in the bin | Bins use all rows and are independent of slider threshold |
| Bin `meanConfidence` | Sum of row confidence in bin / bin count | Empty bins return 0 in the engine; UI must display no data, not inferred accuracy |
| Bin `accuracy` | Baseline `predictedAction == truthAction` count / bin count | Baseline synthetic route agreement, not current-threshold autonomous accuracy |
| Escalation breakdown | One **first** reason for every non-autonomous row at current threshold | Counts sum to escalated rows, not all reasons attached to those rows |

Bins are `[0,.60)`, `[.60,.70)`, `[.70,.80)`, `[.80,.90)`, and `[.90,1]`, labeled 0–59%, 60–69%, 70–79%, 80–89%, and 90–100%. The tradeoff plot computes 21 thresholds from 0 through 1 in .05 increments; the active slider uses .50–.99 in .01 increments. The same shared functions drive both calculations. High-threshold accuracy has a gap where there are no autonomous rows.

Safety reasons precede threshold reasons. A primary-reason bar therefore describes **first-hold composition**, not the prevalence of every integrity, documentation, or policy issue. For future analysis, maintain both mutually exclusive primary reasons and clearly labeled multi-label reason counts; never combine their denominators.

### Synthetic invariants worth testing

- `autonomous + escalated == total`.
- `0 <= correctAutonomous <= autonomous <= total`.
- Increasing the threshold cannot increase autonomy for a fixed dataset and hold policy.
- Bin counts sum to 240; weighted bin agreement equals overall baseline agreement.
- Primary reason counts sum to escalated rows.
- Risk-held, custom, invalid, and unrecognized responses do not become autonomous when the slider falls.

These invariants show internally coherent calculations. They do not establish external validity.

## Proposed production definitions

Each future report must identify its time window, inclusion/exclusion rules, rubric/model/policy versions, threshold, label availability, and cohort. Separate attempted requests, successfully evaluated claims, and audited claims.

| Metric | Numerator / denominator or statistic | Guardrail |
| --- | --- | --- |
| End-to-end autonomy | Claims receiving a permitted delegated route / all eligible intake claims in the cohort | Failures, missing evidence, and unsupported cases must not disappear from the intake denominator |
| Conditional route accuracy | Audited delegated routes agreeing with independently adjudicated route / all audited delegated routes with resolved labels | Report audit coverage and uncertainty; do not substitute confidence for labels |
| Audit coverage | Delegated claims selected and resolved for independent audit / all delegated claims | Stratify by confidence, category, policy, and risk; correct for sampling when reporting population estimates |
| Critical hold bypass rate | Audited cases that required a critical hold but received delegation / audited cases requiring that hold | Separate from ordinary routing errors; any confirmed bypass pauses the affected path |
| Human-review rate | Claims sent to human queues / all intake claims | Separate urgent, ordinary, missing evidence, and failure fallback |
| Rework rate | Reviewed routes changed after new evidence or correction / reviewed routes with a mature outcome | Label reason for change; new evidence is not automatically a model mistake |
| Time to appropriate attention | Median/p95 elapsed time from intake to correct queue acceptance | Include waiting and exception handling, not just API time |
| Calibration gap | Per-bin absolute difference between mean confidence and independent correctness; weighted by bin counts | Validate per question/action first; minimum confidence is not a calibrated probability of a composed route |
| Total cost per correct route | Inference + infrastructure + evaluation + review + rework costs / audited or statistically estimated correct permitted routes | Exclude no required cost center; report assumptions and uncertainty |
| Developer activation | Consented developers completing a valid offline integration task / consented developers beginning that task | Define task start/end and errors; do not use page views as integration proof |
| Repeat useful use | Activated developers completing a second independent task in the defined window / activated developers eligible for that window | Requires consented observation or privacy-approved events; not implemented today |

Subgroup analysis should use relevant approved dimensions such as claim type, document completeness, policy version, language, and urgency. Avoid collecting protected or sensitive attributes just to fill a chart; any fairness audit requires a justified legal and research plan. Small cells should be withheld or aggregated, not presented as strong evidence.

### Statistical and label discipline

- Independent reviewers label routes and critical holds without seeing model confidence where feasible; disagreements go to adjudication and remain visible in the audit.
- Split by claim/policy/time boundaries before tuning thresholds. Related narratives and repeated variants must not leak across train/tune/held-out sets.
- Freeze a held-out evaluation before selecting a threshold. Evaluate critical cases and the delegated subset separately.
- Report bin/threshold sample counts and appropriate confidence intervals. A small perfect sample is not proof of safety. Zero observed errors is not zero possible error.
- Set acceptable error bounds and review capacity with the risk owner before collecting outcomes. Do not retrospectively choose a threshold to make a chart look good.

## Proposed experiment register

**All experiments below are plans, not completed studies.** No fake interview quotations or client results are implied.

### E1 — Does the reference improve contract comprehension?

- **Participants:** six consented developers; diagnostic sample, not a representative market estimate.
- **Tasks:** distinguish Noul shape, inspect raw Score versus 1–5 display, locate the secret boundary, explain the dental threshold change and an urgent hold.
- **Measure:** correct unassisted answers / participants attempting each task, plus median task time among completers and completion share / starters. Include failures and timeouts separately.
- **Candidate target:** 5/6 correctly explain primitive and simulation boundaries; 4/6 locate key isolation and reproduce the threshold example.
- **Decision:** iterate copy/rubrics on observed confusion. Do not enable live or autonomous claims from this outcome.

### E2 — Does the vertical packaging reduce integration friction?

- **Design:** a documentation-only versus reference-assisted synthetic composition task, counterbalanced where possible, with the same allowed time and no live endpoint.
- **Measures:** error-free integrations / starts in each condition; predefined schema/secret/routing errors / submitted implementations; time among successful completers, with non-completion shown.
- **Confounds:** prior TypeSafe familiarity, TypeScript skill, task order, learning effects, and sample recruitment.
- **Decision:** invest in reusable integration/evaluation tooling only if friction is repeatable and the reference meaningfully changes it. A small directional result is not causal proof of enterprise adoption.

### E3 — Is a future route safe in shadow mode?

- **Preconditions:** approved minimized data, budget, protected server route, independently defined labels/hold policy, and an agreed risk threshold. Not configured in v1.
- **Design:** record candidate routes without taking action; independent adjudication of representative and risk-enriched cases; predeclared tuning and held-out splits.
- **Measures:** label coverage, hold bypasses, per-action precision, conditional autonomy, subgroup gaps, review load, and uncertainty intervals with explicit denominators.
- **Decision:** no transition from shadow to assisted operation if critical holds fail, sample precision is inadequate, labels are unresolved, or the review queue cannot absorb demand.

### E4 — Is assistance operationally worthwhile?

- **Preconditions:** E3 passes and humans retain authority; rollback and monitoring owners identified.
- **Design:** an approved, controlled queue pilot with a predeclared comparator and mature follow-up window; not a payment experiment.
- **Measures:** time to appropriate attention, rework, total cost per correct route, service complaints, and hold safety, including all assigned claims.
- **Decision:** continue only if the operational benefit remains after review/integration costs without worse safety outcomes. Published multipliers are not the control group's measured performance.

## Proposed instrumentation, not current behavior

A future privacy-approved event design could include `task_started`, `evaluation_attempted`, `evaluation_succeeded`, `evaluation_failed`, `route_reviewed`, and `label_adjudicated`, with pseudonymous IDs, timestamps, schema/rubric/policy/model versions, mode, threshold, route, and structured reason codes. Do not log raw claim text, names, invoice contents, bank details, or keys. Define retention and deletion before collection.

Separate synthetic-demo sessions, offline tests, live shadow requests, and real operational outcomes. Client events alone do not prove API usage or correctness. Record server usage only after a validated live response; estimate token sizing in a separate field.

## Economics are not an outcome metric

The calculator's USD output is `claims × input tokens per claim × 42 / 1,000,000,000`; its comparison cost multiplies by 444.6. Per-request latency is an illustrative 114 ms, with a comparator of 114 × 193.6. These published-workflow ratios are not measured Claims One results or independent comparator pricing.

Do not add the local demo's runtime to a Jev latency dataset. Mock token counters are zero; the rough serialized-character helper and calculator inputs are assumptions. A future benchmark must use the same state/rubrics, comparable output contract and quality target, captured actual usage, region/network context, concurrency, repeated trials, and measured failure/retry costs. See [Sources](SOURCES.md).
