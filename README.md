# LedFx Workshop

LedFx Workshop is a local companion app for [LedFx](https://github.com/LedFx/LedFx).
It helps prepare audio-reactive scene sets before a show: generate controlled scene
batches, preview them on LedFx virtuals/devices, manage published scenes and
playlists, build reusable presets, and draft experimental LedFx effect modules.

The app is intentionally local-first. It talks to your running LedFx controller
through the LedFx REST API and uses the official LedFx `visualisation_update`
websocket stream for the top device preview.

## Features

- Connect to a local or network LedFx REST API.
- Discover installed virtuals/devices, effects, schemas, presets, scenes and playlists.
- Generate 1-250 controlled-random scenes instead of pure random output.
- Music profiles for techno, drum and bass, house, dub and grime.
- Scene types such as ambient, dark, intro, warmup, breakdown, groove, bass, roll,
  build, tension, transition, drop, peak, finale and strobe.
- Multi-palette selection with editable gradient palettes.
- Device targeting with active/ignore handling per generated scene.
- Live top preview from LedFx official visualisation stream.
- Show Pack export/import for local Workshop profiles, generated queues and LedFx library snapshots.
- Scene queue with approve/unapprove, regenerate, edit, preview and send to LedFx.
- Published scene manager with search, tags, activation, rename, edit and delete.
- Playlist editor and Playlist Patch for Web MIDI mapping.
- MIDI Layout designer with controller-model presets, saved Custom pad/button/knob/fader
  models, drag-and-drop position editing, reset-to-factory mappings, physical input
  flashing, and LED feedback disabled for controls that do not light up.
- Preset Lab for generating and previewing presets before sending them to LedFx.
- Effect Forge for experimental Python effect module drafts and Workshop profiles.

## What It Is Not

LedFx Workshop does not replace LedFx. LedFx remains the renderer, audio engine and
effect host. Workshop generates and manages LedFx configuration.

Effect Forge can draft new Python effect modules, but new effect code cannot be
published into a running LedFx instance through the REST API. Generated effect
modules must be installed into LedFx and LedFx must be restarted.

## Requirements

- Python 3.10 or newer.
- LedFx running locally or on the network.
- A modern browser.
- Optional: PyYAML, useful if you edit the profile files as real YAML instead of
  JSON-compatible YAML.

Web MIDI support is browser-dependent. Chrome and Edge support Web MIDI best.
Safari support is limited, so Playlist Patch mapping may not work there.

## MIDI Notes, Control And Channel

Workshop learns the exact MIDI message sent by your controller:

- `Note` is usually a pad or button press. It has a note number and a channel.
- `Control` means MIDI CC, usually from knobs, faders or encoders. It has a CC number, a channel and a changing value from 0-127.
- `Channel` is the MIDI lane, from 1 to 16. A mapping only triggers when the message type, number and channel all match.

If your controller exposes both `Notes` and `Control` ports, start with `Notes`
for pad/button input and RGB LED output. Use `Control` when knobs, faders or
encoders do not flash in the Controller Surface. Saved Custom models keep their
dimensions, labels, learned MIDI messages and drag-and-drop control positions in
the controller-model list.

The MIDI Layout designer includes presets for common controllers such as Akai APC Mini MK2, Novation Launchpad Mini MK3, Novation Launchkey Mini MK3, Akai MPK Mini MK3 and Arturia MiniLab 3. Faders are treated as unlit controls, so Workshop does not send ON/OFF color feedback to them.

Use `Refresh Mappings` after editing profiles, layouts or another browser tab. It
reloads the current Workshop MIDI assignments, controller settings and visual
layout from local browser storage, then refreshes LED feedback.

For Akai APC Mini MK2, Workshop follows the published communication protocol: the 8x8 pad matrix uses note values 0-63 with the top visual row mapped to the top physical row, Track buttons are note 100-107 from left to right, Scene Launch buttons are note 112-119 from top to bottom, Shift is note 122, and faders are CC 48-56 from left to right. Reset All Mappings also sends LED-off messages to the controller output so pads/buttons return to an unlit stock state.

## Quick Start

Start LedFx first. The default LedFx address is usually:

```text
http://127.0.0.1:8888
```

### Windows One-Click Start

On Windows, double-click `LedFx Workshop Launcher Windows.vbs`. It starts the local Workshop
server in the background and opens your browser automatically.

If Windows blocks the hidden launcher or you need to see startup errors,
double-click `LedFx Workshop Launcher Windows.bat` instead.

The Windows launcher uses `.venv\Scripts\python.exe` when it exists, then falls
back to the Python launcher `py.exe -3`, then `python.exe`.

### macOS One-Click Start

On macOS, double-click `LedFx Workshop Launcher MacOS.app` in this folder. It starts the local
Workshop server in the background and opens the browser automatically.

If macOS blocks the app the first time, right-click it and choose `Open`. The
fallback one-file launcher is `LedFx Workshop Launcher MacOS.command`.

The launchers use `http://127.0.0.1:8057` when it is free, then pick the next
available local port. Logs are written to `ledfx-workshop.log` and
`ledfx-workshop-error.log`.

### Terminal Start

You can still start Workshop manually:

```bash
python3 -m src.server
```

Open the URL printed by the server.

Optional virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m src.server --port 8057 --ledfx http://127.0.0.1:8888
```

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m src.server --port 8057 --ledfx http://127.0.0.1:8888
```

## Repository Structure

```text
.
|-- LedFx Workshop Launcher Windows.vbs # Windows no-terminal launcher
|-- LedFx Workshop Launcher Windows.bat # Windows fallback launcher with visible errors
|-- LedFx Workshop Launcher MacOS.app/  # macOS no-terminal launcher
|-- LedFx Workshop Launcher MacOS.command # macOS one-file launcher fallback
|-- data/
|   |-- effects.yaml              # Effect metadata used by the scene generator
|   |-- palettes.yaml             # Built-in and saved gradient palettes
|   |-- settings.example.json      # Example local connection settings
|   `-- styles.yaml               # Music styles, scene types and layouts
|-- docs/
|   `-- REPOSITORY_STRUCTURE.md   # More detailed file/module map
|-- scripts/
|   |-- launch_workshop.sh         # Shared launcher used by the macOS app
|   `-- launch_workshop.ps1       # Shared launcher used by Windows files
|-- src/
|   |-- api/
|   |   `-- ledfx_client.py       # LedFx REST API adapter
|   |-- generator/
|   |   |-- effect_selector.py
|   |   |-- layout_engine.py
|   |   |-- name_utils.py
|   |   |-- palette_engine.py
|   |   |-- parameter_randomizer.py
|   |   |-- scene_generator.py
|   |   `-- scene_scorer.py
|   |-- models/
|   |   `-- scene.py              # Internal Scene model
|   |-- ui/
|   |   |-- app.js
|   |   |-- favicon.svg
|   |   |-- index.html
|   |   `-- styles.css
|   `-- server.py                 # Local Workshop HTTP server
|-- tests/
|   `-- smoke_generator.py
|-- .gitignore
|-- README.md
`-- requirements.txt
```

Generated files are intentionally ignored:

- `data/settings.json` - local LedFx API URL.
- `outputs/` - generated Effect Forge exports.
- `backups/` - local safety backups.
- `*.bak` - local data backups.

## Core Concepts

### Controlled Randomness

Scene Factory does not use pure random choices. A generated scene is built by:

1. Choosing a scene type from the selected style and energy settings.
2. Selecting effects that fit the style, scene type and audio-reactivity mode.
3. Starting from a LedFx preset or generated preset draft when requested.
4. Mutating only safe parameters inside defined ranges.
5. Applying one of the selected gradient palettes.
6. Assigning selected devices with the chosen layout.
7. Scoring similarity against the current batch and rejecting close duplicates.

### Internal Scene Model

The generator uses its own `Scene` and `VirtualAssignment` models. LedFx-specific
payloads are produced by the API/serialization layer, so generator logic does not
need to know every detail of the LedFx scene payload.

### Tags

Workshop writes tags as safe comma-separated text to avoid LedFx client issues
caused by array tags. Generated tags include scene type, style, layout and palette
information where possible.

### Music-Reactive Effects

`Music-reactive only` includes direct audio-analysis effects and LedFx beat/BPM
driven effects. In the default profiles, BPM `strobe` is marked as beat-reactive,
while `real_strobe` is marked as direct audio-reactive.

### Effect Forge

Effect Forge has two source groups:

- `LedFx-based sources` draft modules inspired by installed LedFx effect families.
- `Custom Workshop sources` draft standalone Python modules with their own render
  logic.

Forge exports a ZIP containing:

- A Python effect module.
- A Workshop effect profile.
- An optional installer script.
- Import instructions.

Review generated modules before installing them into LedFx.

## Testing

Run the local smoke checks:

```bash
node --check src/ui/app.js
python3 -m compileall src
python3 tests/smoke_generator.py
```

The GitHub Actions workflow in `.github/workflows/smoke.yml` runs the same checks.

## Preparing A GitHub Push

Recommended first commit:

```bash
git status --short
git add .gitignore README.md requirements.txt docs .github src tests data/effects.yaml data/palettes.yaml data/styles.yaml data/settings.example.json
git status --short
git commit -m "Initial LedFx Workshop"
```

Do not commit `data/settings.json`, `outputs/`, `backups/` or `*.bak` files.

## Roadmap Ideas

- More verified LedFx effect metadata.
- Richer Show Pack merge controls and conflict previews.
- Stronger preset generation and preset diffing.
- Playlist Patch profiles for common MIDI controllers.
- Better visual preview controls and device snapshots.
- Optional packaging as a desktop app.

## License

No license is included yet. Add a `LICENSE` file before publishing if you want
others to use, modify or redistribute the project.
