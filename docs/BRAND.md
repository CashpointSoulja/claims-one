# Claims One — brand reference

A public-site study of TypeSafe AI, followed by an explicit interpretation for an independent claims-triage reference application. Captured **11 October 2026**, before application UI work. This is not an official TypeSafe identity manual.

**Mock-only framing:** built against Jev's documented API contract; the mock adapter mirrors real endpoints and response shapes. A real key can later be connected through one adapter file plus a server-side environment variable. The site must visibly say **“Mock demo.”** Do not claim a live Jev connection or measured Jev performance.

**Visual guide:** [docs/brand/index.html](docs/brand/index.html). **Measured evidence:** [docs/brand/observations.json](docs/brand/observations.json). All screenshot and asset paths below are repository-relative.

## 1. Sources and capture method

- Homepage: <https://typesafe.ai/>
- Enterprise: <https://typesafe.ai/enterprise>
- Launch article: <https://typesafe.ai/blog/introducing-system-one-models-and-jev>
- API reference: <https://docs.typesafe.ai/api.md>
- Primitives: <https://docs.typesafe.ai/primitives.md>
- Confidence: <https://docs.typesafe.ai/confidence.md>

The public pages were rendered in Chrome at **1440 × 1000 desktop** and the homepage at **390 × 844 mobile**, with device scale factor 1. Fonts were allowed to load; the pages were scrolled to trigger lazy content before full-page capture. CSS values below are computed styles, not guesses from a compressed screenshot. A desktop scrollbar leaves a 1425px content area. Animated elements may differ between the viewport and full-page captures; these are actual rendered captures, not stitched mockups. No analytics, tracking scripts, page source bundle, or private application data was copied.

| Public page | Full-page screenshot | Opening viewport |
| --- | --- | --- |
| Home, desktop | `public/brand/typesafe-home-desktop.png` (1440 × 11282) | `public/brand/typesafe-home-desktop-viewport.png` |
| Home, mobile | `public/brand/typesafe-home-mobile.png` (390 × 10206) | `public/brand/typesafe-home-mobile-viewport.png` |
| Enterprise, desktop | `public/brand/typesafe-enterprise-desktop.png` (1440 × 5822) | `public/brand/typesafe-enterprise-desktop-viewport.png` |
| Launch article, desktop | `public/brand/typesafe-blog-desktop.png` (1440 × 10475) | `public/brand/typesafe-blog-desktop-viewport.png` |

Screenshot content and the TypeSafe AI trademark belong to their respective owners. Screenshots are credited to **TypeSafe AI, typesafe.ai**, and reproduced here for visual reference. Claims One is an independent concept by Ayo Ahmed, not affiliated with or endorsed by TypeSafe AI. A public asset URL is provenance, not a grant of unrestricted reuse.

## 2. Direct observations: do not replace these with generic SaaS styling

The live homepage is primarily a **grey/white desktop operating-system canvas with enormous near-black type**. The opening headline is textual; the pink/purple sky appears in the next prominent desktop scene. The top-left wordmark is literal **“TypeSafe AI” text**, not a made-up geometric symbol. There are pixel-terminal accents, base64 decorations, a shallow system-menu strip, rendered window/chart graphics, and unusually blunt editorial headings. Pink is an accent, not a wash over every panel.

The literal hierarchy is:

1. Near-white menu strip; TypeSafe AI owns the top-left.
2. Huge tightly set, near-black grotesk headline and plain direct copy.
3. A sky desktop scene with layered/floating window imagery.
4. Giant economics statements, small qualifiers, and operational diagrams.
5. “We give a FAQ” and evidence with named **Nuance** sections.

The menu, editorial type, and sky are the identity. A completely dark landing page with glowing violet gradients, pill cards, and generic startup copy would miss it. The application console can be dark; the hero should remain recognizably this homepage.

### Observed color values

| Token recommendation | Exact value | Direct evidence / role |
| --- | --- | --- |
| `--brand-paper` | `#FEFEFE` | Computed page body and menu backgrounds; inverse text on dark sections |
| `--brand-ink` | `#1E1E1E` | Wordmark, headline, dark panel backgrounds |
| `--brand-ink-soft` | `rgba(30,30,30,.86)` | Large downstream headings and prose |
| `--brand-grey` | `#DEDEDE` | Secondary text and desktop surfaces |
| `--brand-grey-deep` | `#C4C4C4` | Background surfaces within the OS treatment |
| `--brand-pink` | `#F386A1` | Accent backgrounds, labels, and accessible skip-link background |
| `--brand-magenta` | `#E551BA` | Homepage plotted accent |
| `--brand-success-observed` | `rgba(3,170,92,.74)` | One plotted/demo accent; not evidence of a universal success token |
| `--brand-system-muted` | `#ABBAB9` | System-caption text and launch-article canvas background |

The sky is a **raster image**, not a computed CSS purple gradient. Its exact observed source is <https://framerusercontent.com/images/khHXfJSV1hyOxMqy8loI0dIEz4.png>. The reference copy is `public/brand/typesafe-sky.png`. Use it as a bounded decorative desktop scene, not as text-bearing chart ink. The sampled palette should not be presented as the image's full color space.

### Observed typography, URLs, and licensing

| Family | Role / exact observation | Public font URL | Rights |
| --- | --- | --- | --- |
| **Die Grotesk C Medium** | Main headings and wordmark; CSS weight 500 | <https://framerusercontent.com/assets/4w6Hg5DeDzuWT6PSthKEwbacV0g.woff2> | Font metadata: Copyright 2026 Klim Type Foundry, all rights reserved; use subject to Klim licence |
| **Die Grotesk C Regular** | Supporting copy; CSS weight 400 | <https://framerusercontent.com/assets/AjH8uNDZvXKC9xfhOZo8jIJKVss.woff2> | Font metadata: Copyright 2025 Klim Type Foundry; use subject to Klim licence |
| **LisaTerminal Paper 2X3Y Medium** | Pixel-like system captions, announcement bar, `TS.AI.0S1`; CSS weight 500 | <https://framerusercontent.com/assets/V2AZqQSDXyGgvnJfcbuPd1WaW0.woff2> | No distribution licence established from the public font metadata; do not bundle |
| **JetBrains Mono** | Base64/code decoration; commonly CSS weight 300, 10–13px | <https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8lqxTOlOV.woff2> | Observed source only; not bundled here |
| **Fragment Mono** | Declared in the homepage's font stylesheet and loaded on the launch article; selected for portable console labels | <https://fonts.gstatic.com/s/fragmentmono/v6/4iCr6K5wfMRRjxp0DA6-2CLnB4NHhg.woff2> | SIL Open Font License 1.1; copyright 2022 The Fragment-Mono Project Authors |

**Important distinction:** Fragment Mono is present in the public site's font resources, but the measured homepage system captions actually use LisaTerminal, and its measured code decorations use JetBrains Mono. Calling every caption “Fragment Mono” would be inaccurate.

Die Grotesk is a commercial Klim typeface. [Foundry source](https://klim.co.nz/retail-fonts/die-grotesk/) and [licensing terms](https://klim.co.nz/licences/) must be consulted for the final deployment. Its full font files and LisaTerminal files are **not redistributed** here. Public accessibility does not establish a licence for a different domain. Do not hotlink commercial fonts as a licence workaround. If the project owner has the relevant licence, supply local webfont files and use the exact families above; otherwise the portable, no-purchase fallback is `Arial, Helvetica, sans-serif`, clearly an approximation rather than identical typography.

Fragment Mono's observed Latin WOFF2 is included at `public/brand/fragment-mono-latin-400.woff2`, with its complete licence at `docs/brand/fragment-mono-license.txt`. This is **Fragment Mono**, the open-source typeface, not a similarly named commercial Fragment family. Preserve that licence when distributing the font. The Latin subset does not promise every script; retain a system monospace fallback.

### Exact type and spacing measurements

| Element | Desktop (1440px viewport) | Mobile (390px viewport) |
| --- | --- | --- |
| TypeSafe AI menu text | 18px / 18px, weight 500, tracking .54px; glyph run 97.1328px wide | Compact menu; desktop wordmark measurement is the reproduction reference |
| Main homepage headline | 150px / 120px, weight 500, normal tracking | 54px / 43.2px, weight 500 |
| Intro line | 17px / 20.4px, weight 400, tracking .85px | Same 17px text, wraps |
| Large editorial CTA | 64px / 57.6px, weight 500 | 28px / 25.2px |
| System captions | 18px / 18px, weight 500, tracking .18px | Announcement 16px / 16px, tracking .16px; secondary announcement 18px / 18px |
| Main content container | 1240px wide, x=92.5px within 1425px content | Headline x=20px, width 339.5px |
| Headline inner container | max-width 1024px; 10px inner horizontal padding; live headline width 1004px | Narrow, intentionally wrapped headline |
| Headline stack | 50px gap; 200px bottom padding | Do not carry desktop empty space onto mobile |
| Outer opening stack | 60px top padding; 40px gap | Reduced at narrow widths |
| Sky desktop scene | 1240 × 800px, x=92.5px, y=1492.5px in this capture | Refer to full mobile capture for stacking |

Observed HTML wrappers are often square; two chart/image-area wrappers had 4px corner radii. One launch-video overlay had `0 4px 4px rgba(0,0,0,.25)`. Much of the floating-window appearance is contained in raster graphics, so a large-radius live application card is an **interpretation**, not a scraped universal homepage radius.

## 3. Literal wordmark and usage

Use **`public/brand/typesafe-wordmark.svg`**, served in the app as `brand/typesafe-wordmark.svg` with the deployment's base URL. It is a transparent, self-contained outline SVG, with a 97.132813 × 18 viewBox. No background rectangle, external font request, tracking script, or embedded full font is included.

Provenance: the homepage navigation renders the text “TypeSafe AI” in Die Grotesk C Medium at 18px, weight 500, tracking .54px. No original navigation-logo image exists in the observed DOM. The SVG reproduces those literal glyph outlines from the public font source above, positioned using the browser's measured character offsets: `0, 9.046875, 18.4296875, 29.2109375, 39.09375, 50.609375, 60.046875, 65.7109375, 75.59375, 79.5, 92.9140625`. This is a static reference rendering of the observed trademark, not a new brand mark or a font distribution licence. Its baseline is normalized within the transparent 18px line box.

- Put the TypeSafe AI wordmark first, top-left, on a near-white system strip. Place **Claims One** beside it, separated by a fine rule and generous breathing room, not fused into a new trademark.
- Preserve literal capitalization: **TypeSafe AI**, **Jev**, **Claims One**, **System One**.
- Keep aspect ratio. No stretching, purple glow, extra symbol, or novelty monospace replacement for the wordmark.
- Recommend at least 18px displayed line-box height and 12px clear space (application guidance, not an official clear-space rule).
- Keep the wordmark on the light strip even above a dark console. If an inverse version is required, change only the outline fill to `#FEFEFE`; document it as an application adaptation.
- Include accessible `alt="TypeSafe AI"` on an image; do not imply the product is an official TypeSafe service.

## 4. Interpretation: a dark console inside the literal homepage world

**Hero: direct reference. Console: deliberate adaptation.** Keep the paper/ink type-led opening and a bounded pink-sky scene; introduce a dark working window within that same desktop language. This reconciles the literal public homepage with a utilitarian terminal-adjacent triage surface, instead of inventing an unrelated purple SaaS brand.

Recommended composition:

1. Shallow paper system bar with the literal wordmark, Claims One, and restrained monospace status.
2. Huge ink headline: **“System One for claims.”** Supporting copy: **“Classify. Score. Route. Keep uncertainty in view.”** No vague “revolutionize” or “unlock” language.
3. A sky-backed preview/working-window scene, not a full-page generic gradient. One or two staggered windows are enough; avoid decorative dashboards unrelated to the task.
4. The main dark working console uses near-black surfaces, grey rules, white readable copy, Fragment Mono labels, tabular figures, a single pink action accent, and visible human-review states.
5. Economics and evidence return to direct headings and small, readable **Nuance** qualifiers. Use “We give a FAQ” for the FAQ heading.

### Recommended application-only tokens

These values are **design recommendations**, not computed homepage values, unless marked observed:

```css
:root {
  --brand-paper: #fefefe;             /* observed */
  --brand-ink: #1e1e1e;              /* observed */
  --brand-grey: #dedede;             /* observed */
  --brand-grey-deep: #c4c4c4;         /* observed */
  --brand-pink: #f386a1;             /* observed */
  --brand-magenta: #e551ba;          /* observed */
  --console-bg: #171717;             /* adaptation */
  --console-surface: #1e1e1e;        /* observed ink, new role */
  --console-raised: #262626;         /* adaptation */
  --console-rule: #414141;           /* adaptation */
  --console-text: #fefefe;           /* observed paper, new role */
  --console-muted: #b8b8b8;          /* adaptation */
  --status-approved: #88d7a5;        /* adaptation */
  --status-review: #f2c37b;          /* adaptation */
  --status-risk: #f386a1;            /* observed pink, new role */
  --font-display: "Die Grotesk C Medium", Arial, Helvetica, sans-serif;
  --font-body: "Die Grotesk C Regular", Arial, Helvetica, sans-serif;
  --font-mono: "Fragment Mono", ui-monospace, monospace;
  --radius-window: 18px;             /* adaptation */
  --radius-panel: 12px;              /* adaptation */
  --radius-control: 8px;             /* adaptation */
  --window-shadow: 0 24px 70px rgba(30, 30, 30, .22),
                   0 4px 12px rgba(30, 30, 30, .12); /* adaptation */
}
```

Use a **4, 8, 12, 16, 24, 32, 48, 64px** application spacing scale. Use 24–32px window padding, 16–24px card gaps, 44px minimum hit areas, and 12–14px mono labels with readable body text at 16px/1.5. The spacing scale and radii organize a usable product; they are not claimed to be the official site's token system. Match the 0.8 headline line-height only in display headings, never in paragraphs or code.

Use dark ink text on pink filled buttons, not white on light pink. On the dark console, pink and magenta can identify selected probability bars; nonselected bars remain grey. Review is amber with explicit **“Human review”** text; approval is green with explicit **“Auto-approve”** text. Never encode decisions by color alone. Rounded edges are useful; a sea of pill controls is not the desktop-OS motif.

Motion should be short (160–220ms), deterministic, and limited to window reveals, result bars, or route changes. Honor reduced-motion settings. No shimmering fake activity, endless terminal typing, or marketing animation across the working data.

## 5. Voice: claim, evidence, nuance

**Direct observation:** Enterprise says “Put Jev to work” and “Classify, score, and route quickly, at low cost.” The launch article follows large claims with **Evidence / Technical Results** and named **Nuance** sections. The homepage says **“We give a FAQ.”** The voice is brief, specific, developer-native, skeptical of its own boldness, and occasionally dry.

**Application copy recommendations:**

| Prefer | Avoid |
| --- | --- |
| “System One for claims.” | “The future of revolutionary intelligent insurance.” |
| “One state. Six questions. Typed answers.” | “Magic that understands everything.” |
| “Confidence below your threshold. Send to an adjuster.” | “Guaranteed correct decision.” |
| “Reference implementation on the published API contract.” | “Live Jev analysis” when using fixtures |
| “Synthetic evaluation data. Not measured Jev performance.” | “Validated accuracy” without a real evaluation |
| “Based on TypeSafe's published workflow results.” | “Your claims will be 193.6x faster.” |
| “Nuance: policy checks remain in code.” | “Zero errors. Fully autonomous insurance.” |

Published homepage multipliers **193.6x faster / 444.6x cheaper** are workflow-evaluation claims, not measured claims-triage guarantees. The blog explicitly says they are likely at the higher end of real-world gains. The blog reports $42 per billion input tokens, free output, and 70–500ms end-to-end response times; keep sources and assumptions beside economics, and do not present a local fixture delay as live service latency. Type-safe answers do not establish correct insurance coverage judgments.

## 6. Data display is part of the brand's honesty

The official API reference, primitives, and confidence docs were read before these recommendations. UI labels must preserve their distinctions:

- **Choice:** show the chosen option, every option in `probabilities`, and the returned `confidence`. Confidence is derived from the distribution; it is not simply the top probability.
- **Score:** show a possibly fractional `score`, every level in `probabilities`, the returned `legend`, and `confidence`. API level indices start at 0. A product severity scale of 1–5 must clearly identify the display transformation from a five-level API score; do not silently replace the raw contract.
- **Noul:** show the single `noul` value from 0 to 1, labeled **“Probability of yes.”** Do not invent `probabilities` or API `confidence` fields. Uncertainty is already present near 0.5.
- Several independent questions over the same `state` are evaluated in parallel in one request; final routing is composed in application code. Do not show a fictitious sequential reasoning transcript.
- Confidence is not a blanket promise of domain accuracy. Thresholds depend on risk and should be evaluated on the actual use case. Calibration charts populated with fixtures must remain explicitly synthetic.

The current docs specify up to 255 Choice options and 2–10 Score levels, not 255 Score levels or a documented blanket 255-question limit. These details matter to the data design; the broad marketing phrase “every decision includes confidence” must not override the precise Noul API shape.

Do not claim this is the first insurance example or that TypeSafe has no existing auto-insurance work; this study makes no exclusivity claim.

## 7. Implementation handoff and boundaries

- Brand assets are ready; this lane does not implement application UI or adapters.
- Use base-aware asset URLs for a portable Vite build, for example `${import.meta.env.BASE_URL}brand/typesafe-wordmark.svg`. The repository's visual guide instead uses relative links to `../../public/brand/` so it can be opened directly without a server.
- The visual guide and assets require no account, API call, external stylesheet, or remote font at viewing time. Source citations are links, not loaded trackers.
- Confirm permission/licensing for TypeSafe imagery and the outlined wordmark before broader commercial reuse. Obtain the correct Die Grotesk licence for literal full-page typography or disclose the system fallback. No permission has been claimed on behalf of TypeSafe or Klim.
- Preserve the font licence, screenshot credit, non-affiliation statement, and the footer credit **“An independent concept by Ayo Ahmed.”**
- Application rendering, responsive behavior, accessibility, and production screenshots belong to the subsequent UI verification handoff. This study's public-site captures are not application test results.
