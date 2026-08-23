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
- Scene queue with approve/unapprove, regenerate, edit, preview and send to LedFx.
- Published scene manager with search, tags, activation, rename, edit and delete.
- Playlist editor and Playlist Patch for Web MIDI mapping.
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
Safari support is limited, so Playlist Patch MIDI mapping may not work there.

## Quick Start

Start LedFx first. The default LedFx address is usually:

```text
http://127.0.0.1:8888
```

Then start Workshop:

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
|-- data/
|   |-- effects.yaml              # Effect metadata used by the scene generator
|   |-- palettes.yaml             # Built-in and saved gradient palettes
|   |-- settings.example.json      # Example local connection settings
|   `-- styles.yaml               # Music styles, scene types and layouts
|-- docs/
|   `-- REPOSITORY_STRUCTURE.md   # More detailed file/module map
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
- Import/export of full show packs.
- Stronger preset generation and preset diffing.
- Playlist Patch profiles for common MIDI controllers.
- Better visual preview controls and device snapshots.
- Optional packaging as a desktop app.

## License

No license is included yet. Add a `LICENSE` file before publishing if you want
others to use, modify or redistribute the project.
