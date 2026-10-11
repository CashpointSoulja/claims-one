# Viability memo — productize the pattern, earn the evidence

[Documentation index](README.md) · [Product requirements](PRD.md) · [Metrics](METRICS.md) · [Roadmap](ROADMAP.md)

## Recommendation

Treat Claims One as a **product-shaped reference and discovery instrument**, not as a validated insurance automation business or an official TypeSafe product. The useful direction is a family of bounded vertical templates paired with an evaluation discipline: typed questions, explicit application policy, human-review boundaries, and evidence that developers can actually integrate them.

My recommendation is to validate developer friction and operator/risk requirements before expanding the live integration or the number of verticals. The current static experience proves that the contract can be made concrete and inspectable. It cannot prove model quality, customer demand, production safety, calibration, cost savings, or a sales conversion effect.

## Start with the overlap, not a novelty claim

TypeSafe already publishes meaningful insurance material:

- Its [use-case map](https://docs.typesafe.ai/concepts/use-case-map.md) explicitly lists insurance FNOL triage.
- [Self-consistency: nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook.md) evaluates **one auto-insurance claim with 14 Noul questions, repeated 15 times per condition**.
- That cookbook includes probability heatmaps, per-question **.30–.70 uncertainty bands** mapped to human review, and **per-call latency and cost** comparisons.

These capabilities are not missing from the published example. Claims One does not invent insurance routing, confidence thresholds, probability visualization, or economics. It does not reproduce the cookbook's measured results. The public written recipe is the verified comparison basis; no claim is made about the configuration of an inaccessible console variant.

The differentiated proposal is **productization**: a complete synthetic **pet-FNOL template** with mixed Choice/Score/Noul, application-level policy, editable confidence thresholds plus nonoverrideable risk gates, an interactive workflow/code surface, workload economics, a synthetic evaluation dashboard, and PM/engineering documentation. It shows a fuller product journey around the same underlying philosophy rather than claiming a new primitive or an absent industry category.

Public pages do not establish TypeSafe's full enterprise application inventory. It would be inaccurate to assert that TypeSafe has zero enterprise applications or that this is its first enterprise reference. See [Sources](SOURCES.md).

## How this maps to product-management work

| PM responsibility | Concrete artifact | What it demonstrates now | What still needs evidence |
| --- | --- | --- | --- |
| Translate capabilities into compelling experiences | Six-section interface, six atomic questions, full distributions and simulated routes | A legible product model for structured judgments and uncertainty | Whether developers and operators understand it without coaching |
| Identify what to build next | Narrow pet-claims wedge, explicit non-goals, stage-gated roadmap | Prioritization and a hypothesis about reusable vertical/evaluation tooling | Demand, repeatable friction, buying process, and better alternatives |
| Developer empathy | Copyable actual code, strict types, honest Noul/Score treatment, portable setup, key-isolated adapter | Attention to integration details and unsafe assumptions | Task success, time to useful integration, SDK needs, and documentation gaps |
| Analyze usage and quality | Calculated threshold metrics, bin counts, primary escalation reasons, explicit denominators | A design for asking the right measurement questions | Real privacy-approved telemetry, independent labels, operational cohorts, and causal benefit |
| Balance product ambition and risk | Human-only custom/live responses, independent holds, visible provenance | A clear separation of simulation, triage, and insurer authority | Domain approval, representative evaluations, deployment controls, appeals, and monitoring |

The evaluation dashboard is a **usage-analysis surface**, not actual usage analysis. Synthetic rows deliberately couple confidence and truth agreement. The PM value is in the metric definitions and decision questions, not an implied measured result.

## Technical and operational viability

### What is feasible in v1

A credential-free static React/Vite site can show the full typed workflow without a backend. The mock handles arbitrary valid requests conservatively, the fixed router fails closed, and a server-side Worker option isolates future credentials. Documentation makes the schema, numerical holds, score conversion, and assumptions explicit.

### What is not established

- Narrative classification or urgency is accurate on representative pet claims.
- Supplied policy summaries are sufficient for any real eligibility decision.
- The same confidence threshold works across actions, policies, languages, or risk levels.
- The shared minimum-confidence gate yields acceptable review volume.
- Cloudflare deployment, Access configuration, quotas, and real upstream compatibility work as a deployed system.
- Brand materials are approved for commercial reuse beyond this reference context.

Type-safe outputs constrain structure, not truth. The synthetic policy-alignment Noul must not be sold as a verified coverage decision. A potential duplicate remains an investigation signal. Urgent narratives remain human-prioritized even at a permissive threshold.

## Commercial hypothesis

A reference may help a developer answer “What can I safely compose with this API?” and shorten time to a valid prototype. A reusable eval harness might then help a team answer “What evidence would let me roll it out?” This is a potential adoption path, not observed conversion or revenue.

The public launch article's input pricing makes frequent structured queries plausible to explore. It does not establish this product's total economics. At 50,000 claims/month and 1,500 input tokens/claim, the calculator illustrates $3.15 input spend; human review, record retrieval, policy checks, retries, integration, governance, and support are excluded. The 444.6× cost and 193.6× speed ratios come from published specific workflows, not measured pet claims or independent comparator pricing.

A commercially worthwhile product could have low inference spend and still be operationally expensive. The relevant business test is total cost and time per **correct permitted route** without worse safety outcomes, not token savings alone.

## Risk register

| Risk | Consequence | Mitigation and stop condition |
| --- | --- | --- |
| Confidence mistaken for coverage authority | Unsafe decision or misleading promise | Explicit simulation labels; independent policy gates; no payment/denial operation; stop any proposed path without domain approval |
| Synthetic charts mistaken for calibration | Premature delegation | Provenance and denominators beside charts; independent held-out evaluation required |
| Unknown/custom text inherits sample behavior | Invented certainty | Exact full-text/rubric matching; generic uncertainty; external object provenance; regression tests |
| Public live proxy spends or leaks data | Unbounded cost, exposure, abuse | Static default; server-only key; exact origin; signed allowlisted Access identity; quotas; no-store/generic errors; leave disabled without all controls |
| Review queue overload | Delayed urgent or routine attention | Measure queue capacity and appropriate-attention time; pause delegation when review capacity fails |
| Biased or ambiguous labels | Misleading quality claims | Independent review, adjudication, subgroup checks, mature outcomes and count/interval reporting |
| Brand confusion or unlicensed reuse | Implied affiliation or rights problem | Visible independence; retained asset ownership/licence notes; approximate licensed typography treatment; rights review for broader reuse |

## v1 → v2 recommendation

1. **Finish reference verification:** source checks plus dedicated browser, subpath, documentation, and logged-out deployment verification. Record only performed checks.
2. **Run small discovery:** developer comprehension and composition tasks, operator workflow mapping, and risk-owner hold review. No real records or paid endpoint needed for these tasks.
3. **Package the successful pattern:** if friction is validated, extract a versioned rubric/evaluation interface rather than immediately adding more simulated claims.
4. **Controlled shadow integration:** only after privacy/budget/security approval, use a protected same-origin Worker, representative held-out labels, and humans retaining all authority. Current live responses remain human-only.
5. **Assist before delegate:** connect reviewer queues only after shadow evidence supports them; any future bounded delegation needs its own gate and cannot inherit the mock threshold's legitimacy.

Support triage, content moderation, and KYC are roadmap candidates, not equally safe interchangeable templates. Start expansion with the smallest reversible action and strongest labeling opportunities. Moderation and KYC need explicit policy, rights, and review/appeal safeguards. [Roadmap](ROADMAP.md) provides the gate details.

## Decision requested

Approve the reference as a way to discuss the integration and evaluation problem—not as evidence of a production claims business. Use the proposed studies to decide whether the next investment is a better template, reusable eval tooling, developer documentation, or a different vertical. Stop or redirect if evidence shows the primary barrier is procurement, data access, deterministic rules, or policy verification instead of model-workflow composition.
