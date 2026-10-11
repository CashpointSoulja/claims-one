# Jobs to be done

[Documentation index](README.md) · [Product requirements](PRD.md) · [Metrics](METRICS.md)

These job statements are design hypotheses. They are not interview quotations, customer commitments, or evidence of a validated buying process. Claims One's current user is evaluating a synthetic reference, not submitting a real policy claim.

## 1. Workflow developer — compose a safe integration

**When** I am exploring whether a structured decision API fits my workflow, **I want** to see the complete request, typed answers, composition rules, and deployment boundary, **so I can** estimate integration effort and avoid unsafe assumptions before wiring a service into production.

- **Trigger:** an idea for routing unstructured intake, or an existing pipeline with opaque uncertainty handling.
- **Functional job:** define rubrics, batch independent questions, validate responses, gate permitted routes, and keep credentials server-side.
- **Emotional job:** feel confident that I understand what is contractual, illustrative, and unverified.
- **Current alternatives to investigate:** official docs/cookbooks, deterministic rules, an internal proof of concept, a general-purpose LLM pipeline, or leaving the process unchanged.
- **Anxiety:** demo code silently invents fields, treats a top probability as confidence, leaks a key, or appears production-ready without an evaluation.
- **v1 support:** raw request/response; full distributions; zero-based Score mean and legend; Noul-only shape; actual copyable router; honest optional Worker requirements.
- **Success signal, proposed:** task completion with no Noul-schema or key-placement mistake and a correct explanation of the human-only live path. Measure participants and tasks explicitly; see [Metrics](METRICS.md).
- **Not supplied:** hosted live access, policy integration, compliance approval, deployment configuration, or an independently evaluated domain model.

## 2. Claims operations reviewer — know what needs attention

**When** an intake record is incomplete, disputed, inconsistent, or urgent, **I want** the workflow to explain why it needs a person and what evidence is relevant, **so I can** prioritize review without mistaking a model signal for an insurer decision.

- **Functional job:** distinguish urgent human coordination, ordinary review, and an eligible delegated queue.
- **Emotional job:** avoid being pressured to accept an automated label without a reason.
- **Social job:** explain a route to colleagues and a policyholder in terms of evidence, not model mystique.
- **v1 support:** explicit reasons for pending invoices, policy ambiguity, prior-condition disputes, potential duplicate invoices, and cancellation intent; the slider cannot bypass holds.
- **Trust boundary:** fraud signal means “investigate,” liability means alignment with supplied synthetic evidence, and severity means reported narrative urgency. None is a factual adjudication.
- **Success signal, proposed:** independent reviewers agree on the permitted queue and identify missing evidence without additional guessing; record disagreements and review time rather than assuming all escalation is waste.
- **Not supplied:** a real adjuster workbench, records retrieval, appeal handling, SLA notifications, a human queue, or a payment operation.

## 3. Product and risk owner — decide what can be delegated

**When** a team proposes more automation, **I want** coverage, error rates, review load, and subgroup evidence at each threshold, **so I can** choose a bounded rollout and know when to stop it.

- **Functional job:** set an allowed-action policy, evaluate held-out outcomes, budget review capacity, and monitor shifts.
- **Emotional job:** know that a lower-review headline is not hiding more harmful mistakes.
- **v1 support:** shared threshold; conditional accuracy with explicit denominator; null accuracy when nothing is autonomous; confidence bins with counts; one primary escalation reason per row; transparent economics.
- **Success signal, proposed:** a documented risk decision with confidence intervals, error severity, denominator, review capacity, owner, and rollback condition—not merely a target autonomy percentage.
- **Not supplied:** representative live outcomes, subgroup calibration, causal savings evidence, production telemetry, or a validated risk tolerance.

## 4. Policyholder — receive fair, appropriate attention

**When** I report a pet's treatment and supporting documents, **I want** my record to reach an appropriate person or process, **so I can** get a clear next step without uncertain evidence becoming a denial or an accusation.

This is an indirect job informing the design, not a public submission feature.

- Emergencies need human coordination rather than a confident-looking green approval.
- Missing records should prompt a request for evidence, not an invented attachment.
- A duplicate invoice may be a clerical error, not proof of wrongdoing.
- Explicit cancellation intent calls for service attention, never a different entitlement standard.
- Policy disagreements need qualified review and an appeal path in any future real system.

A production product would need policyholder research, accessibility/language coverage, complaint analysis, and jurisdiction-specific safeguards. The synthetic demo cannot establish fairness or a suitable communication policy.

## Job journey and current coverage

| Stage | User question | What v1 demonstrates | Future requirement |
| --- | --- | --- | --- |
| Frame | Is this a focused judgment or a complex adjudication? | Six explicit, narrow rubrics | Operator discovery and risk-owner action taxonomy |
| Prepare | Is the evidence complete and authorized? | Invented narrative plus stated attachment/policy summaries | Minimized structured state, consent, evidence provenance |
| Evaluate | What are the typed answers and uncertainties? | One batch, full distributions, exact primitive shapes | Controlled live validation and versioned rubrics/model |
| Compose | What route is permitted? | Shared simulated router with independent holds | Validated route-specific policy; human approval boundaries |
| Review | Why does this need a person? | Reason list and urgent/ordinary labels | Real queues, ownership, appeal/escalation process |
| Learn | Is delegation correct and worthwhile? | Synthetic denominator-aware dashboard | Held-out labels, audit sampling, monitoring, cost-of-quality analysis |

## Prioritization rule

Serve the developer and risk-owner comprehension jobs first. Do not add a payment button, fabricated “fraud detected” label, or high-stakes autonomous action simply to complete a visual journey. Expand only after evidence shows which real job remains unsolved. [Roadmap](ROADMAP.md) ties those expansions to gates rather than dates.
