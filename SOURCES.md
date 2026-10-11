# Sources and evidence boundaries

[Documentation index](README.md)

This register cites **public** material and the implemented source. It is not a list of independent validations. Claims One is an independent concept by Ayo Ahmed, not affiliated with or endorsed by TypeSafe AI.

## Primary technical references

| Public source | What it supports | How Claims One uses it |
| --- | --- | --- |
| [HTTP API reference](https://docs.typesafe.ai/api.md) | `POST /v1/systemone`; bearer authorization; state/model/questions and model/answers/usage; answer shapes; Choice up to 255 options; Score 2–10 levels | `src/contract.ts`, fixed rubrics, offline adapter shape, optional server-only transport |
| [Primitives](https://docs.typesafe.ai/primitives.md) | Independent typed questions over one state; full Choice/Score distributions; Score legend; Noul returns a single probability | Six mixed questions in one batch; final composition in ordinary code |
| [Confidence](https://docs.typesafe.ai/confidence.md) | Choice normalization above a uniform split; Score ordered spread formula; Noul has no separate confidence; thresholds depend on risk | Shared formula implementations, strict response validation, minimum required Choice/Score gate |
| [Documentation index](https://docs.typesafe.ai/llms.txt) | Discoverable official reference, patterns, and cookbook links | Starting point for maintenance research; recheck current pages before changing the contract |
| [Use-case map](https://docs.typesafe.ai/concepts/use-case-map.md) | Insurance FNOL triage is an existing official use case | Evidence of domain overlap; does not establish a deployed customer inventory or validate this pet-claims rubric |
| [Self-consistency: nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook.md) | Existing auto-insurance example, one claim, 14 Noul questions, 15 repeated evaluations per condition, probability heatmaps, .30–.70 uncertainty/human-review bands, per-call latency and cost | Evidence that insurance and these workflow concepts are already public; Claims One productizes a distinct mixed-primitive pet-FNOL template, not a benchmark reproduced here |

The precise API pages override broad wording such as “every answer has confidence.” **Noul is only `{ type: 'noul', noul: number }`.** Question IDs are application keys, not a replacement for complete instructions. A count of Choice options must not become a blanket question-count limit.

The API reference suggests backoff for certain upstream errors. The optional Worker in this project does not implement automatic retries; its request budget and conservative failure behavior are local choices, not a claim about all TypeSafe clients.

## Published commercial figures

Primary source: [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), especially **Evidence / Technical Results** and **Workflow evals / Nuance**. The [TypeSafe homepage](https://typesafe.ai/) is also the visual source of the prominent multipliers.

| Figure | Source status | Project treatment |
| --- | --- | --- |
| $42 per billion input tokens; output free | Published TypeSafe pricing in the launch article | USD workload arithmetic; input tokens include state and questions |
| 70–500 ms end-to-end response range | Published TypeSafe description | Context for an illustration, not a guaranteed SLA or local measurement |
| 193.6× faster / 444.6× cheaper | Published specific-workflow results; source says likely toward the higher end of real-world gains | Only used to derive illustrative comparator values, never represented as measured Claims One benefit |
| 114 ms | Local illustrative constant in `src/economics.ts` | A scenario assumption inside the published range; not asserted as an independently verified typical Jev latency |

The comparator is not a separately researched pricing schedule, a matched claims workload benchmark, a throughput study, or a promise of customer savings. No inference was run to validate any of these figures. Source figures can change; update code, UI, documentation, and tests together if the assumptions change.

The launch article's type-safety discussion concerns constrained output structure. This project does **not** convert that into a guarantee of truthful claim content, accurate policy interpretation, medical safety, fraud detection, or insurance coverage. Runtime validation remains necessary at the integration boundary.

## Brand sources and rights

The detailed record is [Brand reference](BRAND.md), with [visual guide](docs/brand/index.html) and [measured observations](docs/brand/observations.json).

- [TypeSafe homepage](https://typesafe.ai/) — literal wordmark treatment, editorial hierarchy, sky imagery, colors, and voice.
- [Enterprise page](https://typesafe.ai/enterprise) — public positioning; it does not disclose a complete customer or application inventory.
- [Launch article](https://typesafe.ai/blog/introducing-system-one-models-and-jev) — evidence/nuance writing structure.
- [Die Grotesk foundry page](https://klim.co.nz/retail-fonts/die-grotesk/) and [Klim licences](https://klim.co.nz/licences/) — commercial typography context, not permission to distribute fonts.
- `docs/brand/fragment-mono-license.txt` — preserved SIL Open Font License for the bundled Fragment Mono font.

### Bundled asset ledger

| Repository asset | Public source / owner record | Reuse boundary |
| --- | --- | --- |
| `public/brand/typesafe-wordmark.svg` | [TypeSafe homepage](https://typesafe.ai/); transparent outlined rendering of its Die Grotesk C Medium textual wordmark | Third-party mark and font-derived reference; no unrestricted trademark/font permission established |
| `public/brand/typesafe-sky.png` | [Homepage sky artwork](https://framerusercontent.com/images/khHXfJSV1hyOxMqy8loI0dIEz4.png), observed on TypeSafe's public site | Third-party artwork; no unrestricted reuse permission established |
| `public/brand/typesafe-home-desktop.png`, `typesafe-home-desktop-viewport.png`, `typesafe-home-mobile.png`, `typesafe-home-mobile-viewport.png` | [TypeSafe homepage](https://typesafe.ai/), public-site captures dated 11 October 2026 in the brand record | Screenshot content remains third-party; visual reference, not app verification |
| `public/brand/typesafe-enterprise-desktop.png`, `typesafe-enterprise-desktop-viewport.png` | [TypeSafe enterprise page](https://typesafe.ai/enterprise), same capture record | Same screenshot/reference boundary |
| `public/brand/typesafe-blog-desktop.png`, `typesafe-blog-desktop-viewport.png` | [Launch article](https://typesafe.ai/blog/introducing-system-one-models-and-jev), same capture record | Same screenshot/reference boundary |
| `public/brand/fragment-mono-latin-400.woff2` | [Public font file](https://fonts.gstatic.com/s/fragmentmono/v6/4iCr6K5wfMRRjxp0DA6-2CLnB4NHhg.woff2); [upstream OFL notice](https://raw.githubusercontent.com/google/fonts/main/ofl/fragmentmono/OFL.txt) | SIL Open Font License 1.1, copyright 2022 The Fragment-Mono Project Authors; full notice retained in `docs/brand/fragment-mono-license.txt` |
| `public/favicon.svg` | Original Claims One initials icon | First-party MIT scope, not a TypeSafe trademark grant |

The static build preserves every `public/brand/` file and the brand guide, observations, and font license. [License and rights](LICENSE.md) applies MIT only to original work and explicitly excludes third-party marks, imagery, captures, fonts, and dependency rights.

Screenshots, the TypeSafe AI trademark, the wordmark reference rendering, and sky imagery remain third-party material. Public URLs are provenance, not unrestricted reuse grants. The interface uses an explicitly approximate system sans-serif fallback instead of redistributing commercial headline fonts. Broader commercial reuse needs an appropriate rights review.

## Local evidence and what it cannot prove

| Repository evidence | Demonstrates | Does not demonstrate |
| --- | --- | --- |
| `src/mock.ts` and `src/samples.ts` | Deliberately specified synthetic responses to exact invented narratives, generic uncertain responses otherwise | Model understanding or measured Jev outputs |
| `src/routing.ts` | Explicit simulated holds and delegation logic | Valid insurer policy or payment authorization |
| `src/evals.ts` | Deterministic row construction and actual calculations over 240 labeled variations | Independent labeling, live calibration, population-representative accuracy, or usage analysis |
| `src/economics.ts` | Transparent units and ratio-derived arithmetic | A matched independent LLM benchmark or total operating cost |
| `worker/index.ts` and offline transport tests | Security controls in source and injected-test coverage | Deployed security posture, approved real-data handling, or live API compatibility |
| [Test results](TEST-RESULTS.md) | Only the commands and checks actually recorded there | Unrecorded browser, public availability, or production results |

No customer interviews, client results, independent accuracy studies, or TypeSafe internal usage data were collected for these product documents. Discovery statements are labeled hypotheses or proposed experiments. No claim is made that TypeSafe has zero enterprise applications; public sources cannot establish that inventory, and the existing insurance cookbook is explicit contrary evidence to a first-insurance claim.
