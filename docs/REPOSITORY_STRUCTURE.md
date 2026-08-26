# Repository Structure

This document maps the main files in LedFx Workshop for contributors.

## Root

- `README.md` - project overview, setup and publishing notes.
- `requirements.txt` - optional Python dependency list.
- `.gitignore` - excludes local settings, generated exports and backups.
- `LedFx Workshop.app` - macOS Finder launcher that starts Workshop without
  requiring terminal commands.
- `Launch LedFx Workshop.command` - fallback macOS launcher file.
- `LedFx Workshop.vbs` - Windows launcher that starts Workshop hidden and opens
  the browser.
- `Launch LedFx Workshop.bat` - Windows fallback launcher with visible errors.

## `scripts/`

- `launch_workshop.sh` - shared launcher logic: finds Python, starts the local
  Workshop server, opens the browser and writes `ledfx-workshop.log`.
- `launch_workshop.ps1` - Windows equivalent used by the `.vbs` and `.bat`
  launchers.

## `data/`

Profile data lives outside application code so styles, palettes and effect
metadata can evolve without changing the generator internals.

- `effects.yaml` - effect metadata: scene types, style fit, energy range,
  rarity, audio reactivity and safe parameter ranges.
- `palettes.yaml` - gradient palette definitions and music-role color mapping.
- `styles.yaml` - music profiles, scene type definitions and layout descriptions.
- `settings.example.json` - example LedFx connection settings.
- `settings.json` - local-only runtime settings; ignored by git.

## `src/api/`

- `ledfx_client.py` - thin LedFx REST API client. This is the boundary between
  Workshop models and LedFx payloads.

## `src/generator/`

- `scene_generator.py` - batch orchestration and scene assembly.
- `effect_selector.py` - weighted effect selection by style and scene type.
- `parameter_randomizer.py` - controlled safe parameter mutation.
- `palette_engine.py` - palette selection and color/gradient application.
- `layout_engine.py` - device layout assignment.
- `scene_scorer.py` - similarity scoring and duplicate avoidance.
- `name_utils.py` - compact LedFx scene naming helpers.
- `data_loader.py` - JSON/YAML-compatible profile loading.

## `src/models/`

- `scene.py` - internal `Scene` and `VirtualAssignment` models.

## `src/ui/`

Static frontend served by `src.server`.

- `index.html` - app structure and dialogs.
- `styles.css` - application layout and visual design.
- `app.js` - UI state, LedFx interactions, generator controls, playlist tools,
  Preset Lab and Effect Forge.
- `favicon.svg` - browser tab icon.

## `src/server.py`

Local HTTP server. Responsibilities:

- Serve the static UI.
- Manage local settings.
- Proxy LedFx discovery and write operations.
- Generate scenes and presets.
- Provide the top preview stream through LedFx official visualisation updates.
- Export and import Workshop Show Packs.
- Save Effect Forge bundles.

## `tests/`

- `smoke_generator.py` - basic generator smoke test for CI and local checks.

## Ignored Local Folders

- `outputs/` - generated Effect Forge files and ZIP exports.
- `backups/` - local safety copies.
- `__pycache__/`, `.venv/`, `.pytest_cache/` and similar development artifacts.
