# Desktop walkthrough

A 1920 × 1080, 30 fps walkthrough of the actual local application, composed in
Remotion with generated British-English narration, word-timed captions, a
highlight around the recorded pointer, and restrained eased zooms.

The application remains in its labeled mock mode. All claim decisions are
simulated, evaluation rows are synthetic, and economics are illustrations based
on published claims. The final scene opens the local rendered README; it does
not pretend that a public repository or deployment exists.

## Prerequisites

- Node.js 22.13 or later and npm.
- Python 3.10 or later with `edge-tts`: `python -m pip install edge-tts`.
  This pipeline uses the free `en-GB-RyanNeural` endpoint, not a paid voice API.
  Network access to that endpoint is required for narration generation.
- Linux with an X11 desktop at **1920 × 1080**, `ffmpeg` (including `ffprobe`),
  and `xdotool`. Capture is specifically an X11 desktop workflow.
- Chrome or Chromium with a local remote-debugging port, opened full-screen at
  1920 × 1080 with device scale factor 1. Hide browser bars, prompts and overlays
  before recording. Keep the browser in the foreground and do not use the
  desktop during capture.
- Network access for dependency installation and Remotion's first-use browser
  download. Remotion's render browser is separate from the visible capture
  browser.

Do not expose Chrome's debugging port publicly. Use only fictional claims and
keep credentials and unrelated windows off the capture desktop.

## Reproduce

From the repository root, install and start the app:

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

In another shell, install this isolated video package:

```sh
cd demo
npm ci
```

Open Chrome with a dedicated temporary profile. Adapt the executable name to
your installation:

```sh
google-chrome \
  --user-data-dir="${TMPDIR:-/tmp}/claims-one-demo-profile" \
  --remote-debugging-port=29229 \
  --force-device-scale-factor=1 \
  --kiosk http://localhost:5173
```

Confirm that the entire display is 1920 × 1080, Chrome fills it, the hero is
visible, and no browser notification bars remain. On compatible Linux desktops,
`wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz` maximizes the active
window before entering full-screen mode.

Run these commands **in order**, from `demo/`:

```sh
npm run narrate
npm run capture
npm run typecheck
npm run render
```

Narration must precede capture because scene duration controls when real
interactions happen. Both scripts create their `public/` and `output/`
directories. Type checking and rendering require the generated timing, caption,
and pointer JSON files: these are intentionally not fabricated placeholders.
If narration or scene timings change, capture again before rendering.

The default addresses are `http://localhost:5173` for the app and
`http://localhost:29229` for Chrome's debugging endpoint. Override them when
needed:

```sh
APP_URL=http://localhost:5173 CDP_URL=http://localhost:29229 npm run capture
```

`DISPLAY` selects the X11 display; the default is `:0`. Capture uses native mouse
movement and clicks, including a real drag from 85% to 65%. It aborts if the
browser dimensions are wrong or the expected simulated route does not appear.
It does not inject application output or substitute a staged UI.

## Outputs and review

- `public/desktop-capture.mp4`: actual desktop footage.
- `public/capture-events.json`: time-stamped pointer positions.
- `public/*.mp3`: generated narration for each scene.
- `public/timing.json` and `public/captions.json`: scene and word-boundary timing.
- `output/narration.srt`: word-timed subtitle groups.
- `output/claims-one-walkthrough.mp4`: final rendered walkthrough.

Raw media and generated output are ignored by Git. Keep the final MP4 and SRT as
delivery attachments rather than publishing large intermediate files.
The render command finishes with a lossless ffmpeg stream-copy to clear
container metadata comments, then checks that no comment remains. This removes
the default tool byline without changing the edited images or audio.

Before delivery, watch the **entire final render with audio**. Check the real
claim submission, all primitive types, the 85% to 65% routing change, economic
units and caveats, synthetic evaluation, and local documentation. Reject any
render with loading frames, clipped captions, mistimed speech, browser chrome,
private information, an obscured route change, or a duration outside 60–90
seconds. No public deployment, cloud upload, or sharing permission is established
by producing this local video.
