# Five Whys — from uncertain intake to a bounded reference

[Documentation index](README.md) · [Product requirements](PRD.md) · [Discovery metrics](METRICS.md)

## Starting question

**Why might a team evaluating structured models struggle to turn a claims-triage idea into a dependable workflow?**

The chain below is a **product hypothesis**, not a finding from customer research. No adjuster interviews, enterprise usage data, or insurer client results were collected. Public sources can establish API shapes and published positioning; they cannot establish this problem's prevalence, severity, or willingness to pay.

## Hypothesis chain

| Step | Proposed why | What is actually evidenced | What would test or disprove it |
| --- | --- | --- | --- |
| 1 | Because deciding a route depends on several different judgments, not one category label | The implemented example separates type, urgency, integrity, policy alignment, records, and service intent. TypeSafe documents atomic questions composed in code | Observe real intake with consent; ask operators to identify the smallest sufficient decision set. A simple deterministic rule may already solve the useful part |
| 2 | Because those judgments depend on evidence of uneven completeness and certainty | The synthetic narratives deliberately include missing invoices, onset conflicts, disputed prior history, and emergencies. This demonstrates possible cases, not frequency | Sample approved, minimized records; independently label missingness and disputes. If evidence is usually structured and complete, text-based triage may be the wrong wedge |
| 3 | Because a probability or schema alone does not encode an insurer's risk tolerance | Official confidence docs distinguish uncertainty from action thresholds. This router explicitly adds holds | Ask a risk owner to enumerate allowed actions and irreversible harms. If all useful routes require expert deliberation, automation should remain assistive |
| 4 | Because teams must build and validate composition, human review, security, and measurement around the model | The source visibly contains these separate boundaries. Their difficulty for external developers has not been measured | Give developers the official docs and this reference in a counterbalanced task. Compare completion, mistakes, and points of confusion—not self-reported enthusiasm alone |
| 5 | Because the missing bridge may be a product-ready pattern, rather than another isolated prediction demo | Public TypeSafe materials include primitives, patterns, and an existing auto-insurance cookbook. Claims One packages a distinct pet-claims workflow as a reference | Ask whether this packaging changes integration decisions or merely looks polished. If developers already compose safely from the cookbook, prioritize an eval package or other friction instead |

**Candidate root cause:** domain-aware composition and evidence of safe behavior may be more important than the raw ability to output a typed label. That is the hypothesis this artifact makes concrete; it is not a proven market diagnosis.

## Alternative explanations

- Access, procurement, privacy, or legal review—not workflow design—may be the adoption bottleneck.
- Developers may need SDK ergonomics, better examples for structured state, or observability more than a vertical UI.
- Insurance economics may be dominated by human investigation, policy verification, or integrations rather than inference cost.
- Existing deterministic routing may already work well. A probabilistic layer could add uncertainty without value.
- Narrative judgments may not be stable enough to delegate, even when returned with high confidence.
- A minimum-confidence gate across all required Choice/Score judgments may over-escalate; a route-specific gate might be better only after independent evidence.

These alternatives prevent an attractive demo from becoming a premature product mandate.

## Evidence discipline

### Direct observations

- The official API supports Choice, Score, and Noul and batched independent questions over a shared state.
- Choice and Score include distributions and derived confidence; Noul does not include separate confidence.
- TypeSafe publishes an auto-insurance self-consistency example. This project cannot honestly claim to invent the first insurance use case.
- TypeSafe's launch article qualifies its published speed/cost gains as toward the higher end of real-world results.
- The current repository implements synthetic responses and calculations, not observed model behavior.

References are in [Sources](SOURCES.md). These observations support a possible design, not validated demand or production benefit.

### Not established

There is no verified inventory of TypeSafe's enterprise applications, no proof it has “zero enterprise apps,” no customer quote, no measured adjuster time saving, no retention uplift, no claims accuracy, and no willingness-to-pay result here. The public enterprise page and cookbook are not substitutes for internal adoption data.

## Discovery plan

1. **Operator workflow mapping:** recruit claims reviewers with consent; walk through sanitized or invented records. Ask what can be routed safely, what requires policy evidence, and what a wrong route costs. Record disagreements rather than forcing consensus.
2. **Developer comprehension:** use the proposed six-person study in [PRD](PRD.md). Have participants explain the Noul shape, locate the secret boundary, and identify an unsafe slider interpretation.
3. **Comparative integration task:** compare documentation-only versus reference-assisted composition using the same synthetic task and no paid endpoint. Use counterbalanced assignment where practical; capture errors and completion time with a predefined definition.
4. **Risk-owner review:** test the hold list and rubric with an independent reviewer. Treat a missing critical hold as a design defect, not an opportunity to increase autonomy.
5. **Decision checkpoint:** continue the vertical direction only if these sessions identify repeatable, consequential friction the reference reduces. If not, redirect effort toward the demonstrated integration or evaluation problem.

These activities are proposed; none is presented as completed. [Metrics](METRICS.md) specifies denominators and evidence gates.

## Product implication today

Keep the first release narrow: one invented input, six typed answers, explicit simulated routing, inspectable code, visible uncertainty, and a human-review default. Do not turn high confidence into a medical recommendation, fraud finding, denial, or coverage promise. The next product decision should be informed by developer and operator evidence, not the synthetic chart's apparent calibration.
