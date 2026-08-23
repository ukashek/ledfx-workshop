const MIDI_MAPPINGS_KEY = "lsf.midi_mappings";

const state = {
  app: null,
  scenes: [],
  similarityReport: null,
  selectedSceneId: null,
  editingSceneId: null,
  activePresetEffect: "",
  selectedPresetPaletteIds: ["auto"],
  presetDrafts: [],
  editingPreset: null,
  editingPalette: null,
  ledfxLibrary: {scenes: [], playlists: [], playlist_state: {}},
  playlistSceneIds: new Set(),
  selectedLibrarySceneIds: new Set(),
  activeLibrarySceneId: null,
  editingPlaylistId: null,
  editingPublishedSceneId: null,
  gradientDrag: null,
  editingStyle: null,
  topPreviewDeviceId: localStorage.getItem("lsf.top_preview_device") || "",
  topPreviewSocket: null,
  topPreviewStreamKey: "",
  topPreviewLastFrameAt: 0,
  topPreviewFallbackTimer: null,
  topPreviewReconnectTimer: null,
  midi: {
    access: null,
    inputs: [],
    selectedInputId: localStorage.getItem("lsf.midi_input") || "",
    mappings: loadMidiMappings(),
    learn: null,
    lastTrigger: {},
  },
};

const DEFAULT_STYLE_DEFAULTS = {
  count: 24,
  energy: 0.65,
  variation: 0.6,
  brightness: 0.8,
  movement: 0.55,
  audio_response: 0.6,
  density: 0.5,
  flash: 0.45,
  layout: "auto",
};
const STYLE_DEFAULT_FIELDS = [
  {key: "count", label: "Scenes", type: "number", min: 1, max: 250, step: 1},
  {key: "energy", label: "Energy"},
  {key: "variation", label: "Variation"},
  {key: "brightness", label: "Brightness"},
  {key: "movement", label: "Movement"},
  {key: "audio_response", label: "Audio response"},
  {key: "density", label: "Density"},
  {key: "flash", label: "Flash"},
  {key: "layout", label: "Layout", type: "layout"},
];
const CONTROL_DESCRIPTIONS = {
  count: "Number of scenes to generate in this batch.",
  energy: "Sets target intensity: lower favors ambient, dark and groove scenes; higher favors build, drop, peak and strobe scenes.",
  variation: "Controls preset drift and duplicate avoidance: lower stays tighter, higher explores more combinations.",
  brightness: "Scales final LED brightness while keeping each effect inside its safe parameter range.",
  movement: "Adjusts animation speed, rolling gradients and motion-heavy parameters across selected effects.",
  audio_response: "Sets how easily scenes react to quieter bands: lower is steadier, higher catches more detail.",
  density: "Controls visual fullness: lower leaves more negative space, higher adds trails, bands and body.",
  flash: "Controls how often drop, peak and strobe scenes are selected and how aggressive flashes feel.",
  layout: "Default layout for this style. Auto lets Scene Factory choose based on scene type, energy and selected Devices.",
};
const PALETTE_ROLES = ["background", "dark", "low", "mid", "high", "accent", "strobe"];
const PALETTE_ROLE_META = {
  background: {label: "Black start", stop: "0%", description: "scene background and silence between reactions"},
  dark: {label: "Shadow", stop: "18%", description: "dark base, pauses and negative space"},
  low: {label: "Low", stop: "38%", description: "bass, kick and low-frequency content"},
  mid: {label: "Mid", stop: "62%", description: "groove, snare and synth body"},
  high: {label: "High", stop: "84%", description: "hi-hats, transients and bright detail"},
  accent: {label: "Accent", stop: "100%", description: "builds, drops and stronger accents"},
  strobe: {label: "Strobe", stop: "flash", description: "peak flashes and strobe scenes"},
};
const GRADIENT_ROLES = ["background", "dark", "low", "mid", "high", "accent"];
const DEFAULT_GRADIENT_POSITIONS = {background: 0, dark: 18, low: 38, mid: 62, high: 84, accent: 100};
const GRADIENT_MIN_GAP = 4;
const EDITABLE_GRADIENT_ROLES = GRADIENT_ROLES.filter((role) => role !== "background");
const FORGE_BEHAVIORS = {
  static: {
    label: "Solid color / dimmer",
    description: "A non-reactive or lightly modulated base layer inspired by LedFx singleColor: useful for dark, ambient and utility looks.",
    ledfxEffect: "singleColor",
    sceneTypes: ["ambient", "dark"],
    paletteMode: "single",
  },
  gradient: {
    label: "Gradient roll",
    description: "A palette gradient that rolls or breathes over time, close to LedFx gradient-style motion.",
    ledfxEffect: "gradient",
    sceneTypes: ["ambient", "dark", "build"],
    paletteMode: "gradient",
  },
  melt: {
    label: "Audio melt",
    description: "A soft smearing shape that bends with audio level, good for intros, breakdowns and restrained builds.",
    ledfxEffect: "melt",
    sceneTypes: ["ambient", "dark", "intro", "breakdown", "build"],
    paletteMode: "gradient",
  },
  scroll: {
    label: "Scroll / chase",
    description: "Moving lanes and chases in the spirit of LedFx scroll effects: good for groove, roll, build and transition scenes.",
    ledfxEffect: "scroll",
    sceneTypes: ["groove", "warmup", "energy", "bass", "roll", "build", "transition", "drop"],
    paletteMode: "bands",
  },
  energy: {
    label: "Energy wash",
    description: "A fuller audio-driven wash inspired by LedFx energy, designed for active scenes without becoming pure strobe.",
    ledfxEffect: "energy",
    sceneTypes: ["groove", "warmup", "energy", "bass", "roll", "build", "drop", "peak"],
    paletteMode: "bands-gradient",
  },
  rain: {
    label: "Rain trails",
    description: "Falling droplets and short trails, useful for ambient movement, groove texture and build-up motion.",
    ledfxEffect: "rain",
    sceneTypes: ["ambient", "intro", "breakdown", "groove", "warmup", "energy", "build"],
    paletteMode: "bands",
  },
  bar: {
    label: "Bar meter",
    description: "A filled meter or bouncing bar response, close to LedFx bar effects for bass, groove and drop work.",
    ledfxEffect: "bar",
    sceneTypes: ["groove", "warmup", "bass", "roll", "build", "transition", "drop", "peak"],
    paletteMode: "gradient",
  },
  multibar: {
    label: "Multi-bar layers",
    description: "Layered bars with offset motion, inspired by LedFx multiBar for high-energy and peak scenes.",
    ledfxEffect: "multiBar",
    sceneTypes: ["groove", "energy", "bass", "roll", "build", "drop", "peak"],
    paletteMode: "gradient",
  },
  equalizer: {
    label: "Equalizer 2D",
    description: "Stepped band blocks inspired by LedFx equalizer2d, useful when you want more frequency-section structure.",
    ledfxEffect: "equalizer2d",
    sceneTypes: ["groove", "warmup", "energy", "bass", "roll", "build", "drop", "peak"],
    paletteMode: "bands",
  },
  concentric: {
    label: "Concentric pulse",
    description: "Center-out pulses and rings, close to concentric-style effects for tension, transition, drop and finale moments.",
    ledfxEffect: "concentric",
    sceneTypes: ["build", "tension", "transition", "drop", "peak", "finale"],
    paletteMode: "gradient",
  },
  pulse: {
    label: "Beat pulse",
    description: "Beat-driven body with soft decay and palette-controlled color.",
    sceneTypes: ["groove", "energy", "build", "drop"],
    paletteMode: "single",
  },
  bands: {
    label: "Spectrum bands",
    description: "Frequency bars and moving bands for bass, mids or highs.",
    sceneTypes: ["groove", "energy", "peak"],
    paletteMode: "bands",
  },
  wave: {
    label: "Gradient wave",
    description: "Rolling color field with audio pressure modulating phase and brightness.",
    sceneTypes: ["ambient", "warmup", "groove", "build"],
    paletteMode: "gradient",
  },
  sparkle: {
    label: "Transient sparkle",
    description: "Short high-frequency accents with trails and sparse detail.",
    sceneTypes: ["energy", "drop", "peak", "strobe"],
    paletteMode: "strobe",
  },
  sub_swell: {
    label: "Sub swell",
    description: "Slow low-end pressure blooms that open with bass weight and fade back into black.",
    sceneTypes: ["dark", "breakdown", "bass", "build", "drop"],
    paletteMode: "gradient",
  },
  tunnel: {
    label: "Kick tunnel",
    description: "Center-weighted tunnel motion that tightens on kicks and spreads during heavier moments.",
    sceneTypes: ["bass", "roll", "build", "drop", "peak"],
    paletteMode: "gradient",
  },
  laser_gate: {
    label: "Laser gate",
    description: "Narrow moving beams with audio or timed gating for sharp accents and tension.",
    sceneTypes: ["tension", "transition", "drop", "peak", "strobe"],
    paletteMode: "strobe",
  },
  shimmer: {
    label: "High shimmer",
    description: "Fine bright particles and upper-band flicker for hats, transients and airy detail.",
    sceneTypes: ["ambient", "groove", "energy", "peak"],
    paletteMode: "strobe",
  },
  shadow_gap: {
    label: "Shadow gap",
    description: "Mostly dark negative-space movement with restrained reactive accents.",
    sceneTypes: ["ambient", "dark", "intro", "breakdown", "tension"],
    paletteMode: "single",
  },
  riser: {
    label: "Tension riser",
    description: "Rising pressure bands that become brighter and denser as phase and audio build.",
    sceneTypes: ["build", "tension", "transition", "drop"],
    paletteMode: "gradient",
  },
  call_response: {
    label: "Call response",
    description: "Alternating zones that trade focus across the strip for groove and phrase changes.",
    sceneTypes: ["warmup", "groove", "roll", "transition"],
    paletteMode: "bands",
  },
  ripple: {
    label: "Impact ripple",
    description: "Hit-driven ripples that travel outward after bass or beat pressure crosses the gate.",
    sceneTypes: ["bass", "drop", "peak", "finale"],
    paletteMode: "gradient",
  },
  blade: {
    label: "Blade power",
    description: "A sharp power curve inspired by blade_power_plus: heavy bass pressure, fast accents and strong movement.",
    ledfxEffect: "blade_power_plus",
    sceneTypes: ["groove", "energy", "bass", "roll", "transition", "drop", "peak"],
    paletteMode: "gradient",
  },
  bpm_strobe: {
    label: "BPM strobe",
    description: "Timed strobe gating. This is intentionally non-sound-reactive unless you change Reactivity.",
    ledfxEffect: "strobe",
    sceneTypes: ["drop", "peak", "strobe", "finale"],
    paletteMode: "strobe",
  },
  bass_strobe: {
    label: "Bass strobe",
    description: "Audio-gated strobe behavior inspired by LedFx real_strobe, reacting to bass hits and peak accents.",
    ledfxEffect: "real_strobe",
    sceneTypes: ["drop", "peak", "strobe", "finale"],
    paletteMode: "strobe",
  },
};
const FORGE_REACTIVITY = {
  sound: "General audio-reactive mode. The draft keeps a broad level follower and is safe for most music-responsive effects.",
  non_sound: "No audio dependency. Use for timed gradients, dimmers, BPM-like strobes or utility looks.",
};
const FORGE_FREQUENCIES = {
  Beat: "Beat/tempo cue from LedFx frequency_range enum. Best for pulse and timed strobe ideas.",
  Bass: "Bass-only LedFx frequency_range value for low-end pressure and bass strobes.",
  "Lows (beat+bass)": "Kick and bass together. This is the safest default for dance-floor reactive effects.",
  Mids: "LedFx mids value for central musical body such as snares, chords and main synth phrases.",
  High: "LedFx high-frequency value for hi-hats, clicks and bright accents.",
};
const MIDI_ACTION_LABELS = {
  start: "Start playlist",
  stop: "Stop",
  prev: "Previous scene",
  next: "Next scene",
};

const els = {
  factoryView: document.querySelector("#factoryView"),
  presetLabView: document.querySelector("#presetLabView"),
  effectForgeView: document.querySelector("#effectForgeView"),
  midiMapperView: document.querySelector("#midiMapperView"),
  factoryTabButton: document.querySelector("#factoryTabButton"),
  presetLabTabButton: document.querySelector("#presetLabTabButton"),
  effectForgeTabButton: document.querySelector("#effectForgeTabButton"),
  midiMapperTabButton: document.querySelector("#midiMapperTabButton"),
  connectionLine: document.querySelector("#connectionLine"),
  connectionStatus: document.querySelector("#connectionStatus"),
  connectionStatusText: document.querySelector("#connectionStatusText"),
  ledfxUrlInput: document.querySelector("#ledfxUrlInput"),
  saveConnectionButton: document.querySelector("#saveConnectionButton"),
  topPreviewDeviceSelect: document.querySelector("#topPreviewDeviceSelect"),
  topPreviewStatus: document.querySelector("#topPreviewStatus"),
  topPreviewVisual: document.querySelector("#topPreviewVisual"),
  topPreviewCanvas: document.querySelector("#topPreviewCanvas"),
  topPreviewEffectName: document.querySelector("#topPreviewEffectName"),
  topPreviewPixelCount: document.querySelector("#topPreviewPixelCount"),
  appGuideButton: document.querySelector("#appGuideButton"),
  refreshButton: document.querySelector("#refreshButton"),
  restoreButton: document.querySelector("#restoreButton"),
  modalBackdrop: document.querySelector("#modalBackdrop"),
  modalTitle: document.querySelector("#modalTitle"),
  closeModalButton: document.querySelector("#closeModalButton"),
  form: document.querySelector("#generatorForm"),
  styleSelect: document.querySelector("#styleSelect"),
  styleDescription: document.querySelector("#styleDescription"),
  styleInfoButton: document.querySelector("#styleInfoButton"),
  editStyleButton: document.querySelector("#editStyleButton"),
  newStyleButton: document.querySelector("#newStyleButton"),
  deleteStyleButton: document.querySelector("#deleteStyleButton"),
  styleEditor: document.querySelector("#styleEditor"),
  styleNameInput: document.querySelector("#styleNameInput"),
  styleDescriptionInput: document.querySelector("#styleDescriptionInput"),
  styleDefaultFields: document.querySelector("#styleDefaultFields"),
  saveStyleButton: document.querySelector("#saveStyleButton"),
  closeStyleEditorButton: document.querySelector("#closeStyleEditorButton"),
  countInput: document.querySelector("#countInput"),
  effectModeSelect: document.querySelector("#effectModeSelect"),
  presetModeSelect: document.querySelector("#presetModeSelect"),
  energyInput: document.querySelector("#energyInput"),
  energyValue: document.querySelector("#energyValue"),
  variationInput: document.querySelector("#variationInput"),
  variationValue: document.querySelector("#variationValue"),
  brightnessInput: document.querySelector("#brightnessInput"),
  brightnessValue: document.querySelector("#brightnessValue"),
  movementInput: document.querySelector("#movementInput"),
  movementValue: document.querySelector("#movementValue"),
  audioResponseInput: document.querySelector("#audioResponseInput"),
  audioResponseValue: document.querySelector("#audioResponseValue"),
  densityInput: document.querySelector("#densityInput"),
  densityValue: document.querySelector("#densityValue"),
  flashInput: document.querySelector("#flashInput"),
  flashValue: document.querySelector("#flashValue"),
  namePrefixInput: document.querySelector("#namePrefixInput"),
  startIndexInput: document.querySelector("#startIndexInput"),
  generationTagsInput: document.querySelector("#generationTagsInput"),
  seedInput: document.querySelector("#seedInput"),
  paletteSelect: document.querySelector("#paletteSelect"),
  paletteSelectionSummary: document.querySelector("#paletteSelectionSummary"),
  paletteList: document.querySelector("#paletteList"),
  paletteEditor: document.querySelector("#paletteEditor"),
  paletteNameInput: document.querySelector("#paletteNameInput"),
  paletteBlackStartInput: document.querySelector("#paletteBlackStartInput"),
  paletteGradientPreview: document.querySelector("#paletteGradientPreview"),
  paletteColorFields: document.querySelector("#paletteColorFields"),
  selectAllPalettesButton: document.querySelector("#selectAllPalettesButton"),
  unselectAllPalettesButton: document.querySelector("#unselectAllPalettesButton"),
  newPaletteButton: document.querySelector("#newPaletteButton"),
  randomPaletteButton: document.querySelector("#randomPaletteButton"),
  savePaletteButton: document.querySelector("#savePaletteButton"),
  closePaletteEditorButton: document.querySelector("#closePaletteEditorButton"),
  layoutSelect: document.querySelector("#layoutSelect"),
  layoutDescription: document.querySelector("#layoutDescription"),
  layoutInfoButton: document.querySelector("#layoutInfoButton"),
  selectAllSceneTypesButton: document.querySelector("#selectAllSceneTypesButton"),
  unselectAllSceneTypesButton: document.querySelector("#unselectAllSceneTypesButton"),
  sceneTypeList: document.querySelector("#sceneTypeList"),
  virtualList: document.querySelector("#virtualList"),
  sceneEditorHost: document.querySelector("#sceneEditorHost"),
  generateButton: document.querySelector("#generateButton"),
  saveButton: document.querySelector("#saveButton"),
  approveAllButton: document.querySelector("#approveAllButton"),
  unapproveAllButton: document.querySelector("#unapproveAllButton"),
  queueSummary: document.querySelector("#queueSummary"),
  similarityReport: document.querySelector("#similarityReport"),
  palettePreview: document.querySelector("#palettePreview"),
  sceneList: document.querySelector("#sceneList"),
  librarySummary: document.querySelector("#librarySummary"),
  refreshLibraryButton: document.querySelector("#refreshLibraryButton"),
  shortenLsfButton: document.querySelector("#shortenLsfButton"),
  ledfxSceneList: document.querySelector("#ledfxSceneList"),
  bulkSceneSummary: document.querySelector("#bulkSceneSummary"),
  libraryTagFilterInput: document.querySelector("#libraryTagFilterInput"),
  selectAllLibraryScenesButton: document.querySelector("#selectAllLibraryScenesButton"),
  selectFilteredLibraryScenesButton: document.querySelector("#selectFilteredLibraryScenesButton"),
  clearLibrarySelectionButton: document.querySelector("#clearLibrarySelectionButton"),
  bulkTagInput: document.querySelector("#bulkTagInput"),
  tagSelectedScenesButton: document.querySelector("#tagSelectedScenesButton"),
  deleteSelectedScenesButton: document.querySelector("#deleteSelectedScenesButton"),
  playlistEditor: document.querySelector("#playlistEditor"),
  playlistNameInput: document.querySelector("#playlistNameInput"),
  playlistModeSelect: document.querySelector("#playlistModeSelect"),
  playlistDurationInput: document.querySelector("#playlistDurationInput"),
  playlistTagFilterInput: document.querySelector("#playlistTagFilterInput"),
  playlistEditStatus: document.querySelector("#playlistEditStatus"),
  newPlaylistButton: document.querySelector("#newPlaylistButton"),
  selectLsfScenesButton: document.querySelector("#selectLsfScenesButton"),
  selectFilteredScenesButton: document.querySelector("#selectFilteredScenesButton"),
  clearPlaylistScenesButton: document.querySelector("#clearPlaylistScenesButton"),
  savePlaylistButton: document.querySelector("#savePlaylistButton"),
  stopPlaylistButton: document.querySelector("#stopPlaylistButton"),
  prevPlaylistButton: document.querySelector("#prevPlaylistButton"),
  nextPlaylistButton: document.querySelector("#nextPlaylistButton"),
  playlistScenePicker: document.querySelector("#playlistScenePicker"),
  playlistList: document.querySelector("#playlistList"),
  presetEffectSelect: document.querySelector("#presetEffectSelect"),
  presetBaseSelect: document.querySelector("#presetBaseSelect"),
  presetPaletteSelect: document.querySelector("#presetPaletteSelect"),
  presetPalettePreview: document.querySelector("#presetPalettePreview"),
  presetPalettePicker: document.querySelector("#presetPalettePicker"),
  presetDeviceSelect: document.querySelector("#presetDeviceSelect"),
  presetCountInput: document.querySelector("#presetCountInput"),
  presetNamePrefixInput: document.querySelector("#presetNamePrefixInput"),
  presetEnergyInput: document.querySelector("#presetEnergyInput"),
  presetEnergyValue: document.querySelector("#presetEnergyValue"),
  presetVariationInput: document.querySelector("#presetVariationInput"),
  presetVariationValue: document.querySelector("#presetVariationValue"),
  presetSeedInput: document.querySelector("#presetSeedInput"),
  refreshPresetButton: document.querySelector("#refreshPresetButton"),
  restorePresetPreviewButton: document.querySelector("#restorePresetPreviewButton"),
  generatePresetButton: document.querySelector("#generatePresetButton"),
  sendPresetDraftsButton: document.querySelector("#sendPresetDraftsButton"),
  clearPresetDraftsButton: document.querySelector("#clearPresetDraftsButton"),
  presetDraftSummary: document.querySelector("#presetDraftSummary"),
  presetDraftList: document.querySelector("#presetDraftList"),
  presetSummary: document.querySelector("#presetSummary"),
  presetList: document.querySelector("#presetList"),
  presetEditor: document.querySelector("#presetEditor"),
  presetEditNameInput: document.querySelector("#presetEditNameInput"),
  presetEditDeviceField: document.querySelector("#presetEditDeviceField"),
  presetEditDeviceSelect: document.querySelector("#presetEditDeviceSelect"),
  presetEditStatus: document.querySelector("#presetEditStatus"),
  presetParamFields: document.querySelector("#presetParamFields"),
  previewPresetEditButton: document.querySelector("#previewPresetEditButton"),
  savePresetEditButton: document.querySelector("#savePresetEditButton"),
  closePresetEditorButton: document.querySelector("#closePresetEditorButton"),
  tabsGuidePanel: document.querySelector("#tabsGuidePanel"),
  forgeGenerateButton: document.querySelector("#forgeGenerateButton"),
  forgeRandomizeButton: document.querySelector("#forgeRandomizeButton"),
  forgeSaveAsButton: document.querySelector("#forgeSaveAsButton"),
  forgeSaveStatus: document.querySelector("#forgeSaveStatus"),
  forgeEffectNameInput: document.querySelector("#forgeEffectNameInput"),
  forgeBehaviorSelect: document.querySelector("#forgeBehaviorSelect"),
  forgeBehaviorDescription: document.querySelector("#forgeBehaviorDescription"),
  forgeReactivitySelect: document.querySelector("#forgeReactivitySelect"),
  forgeReactivityDescription: document.querySelector("#forgeReactivityDescription"),
  forgeFrequencySelect: document.querySelector("#forgeFrequencySelect"),
  forgeFrequencyDescription: document.querySelector("#forgeFrequencyDescription"),
  forgeIntensityInput: document.querySelector("#forgeIntensityInput"),
  forgeIntensityValue: document.querySelector("#forgeIntensityValue"),
  forgeMotionInput: document.querySelector("#forgeMotionInput"),
  forgeMotionValue: document.querySelector("#forgeMotionValue"),
  forgeDetailInput: document.querySelector("#forgeDetailInput"),
  forgeDetailValue: document.querySelector("#forgeDetailValue"),
  forgeDecayInput: document.querySelector("#forgeDecayInput"),
  forgeDecayValue: document.querySelector("#forgeDecayValue"),
  forgeFlashInput: document.querySelector("#forgeFlashInput"),
  forgeFlashValue: document.querySelector("#forgeFlashValue"),
  forgeCodeOutput: document.querySelector("#forgeCodeOutput"),
  forgeProfileOutput: document.querySelector("#forgeProfileOutput"),
  forgeInstructionsOutput: document.querySelector("#forgeInstructionsOutput"),
  copyForgeCodeButton: document.querySelector("#copyForgeCodeButton"),
  copyForgeProfileButton: document.querySelector("#copyForgeProfileButton"),
  copyForgeInstructionsButton: document.querySelector("#copyForgeInstructionsButton"),
  midiConnectButton: document.querySelector("#midiConnectButton"),
  midiRefreshLibraryButton: document.querySelector("#midiRefreshLibraryButton"),
  midiInputSelect: document.querySelector("#midiInputSelect"),
  midiStatus: document.querySelector("#midiStatus"),
  midiTargetPlaylistSelect: document.querySelector("#midiTargetPlaylistSelect"),
  midiStopButton: document.querySelector("#midiStopButton"),
  midiPrevButton: document.querySelector("#midiPrevButton"),
  midiNextButton: document.querySelector("#midiNextButton"),
  midiMapStopButton: document.querySelector("#midiMapStopButton"),
  midiMapPrevButton: document.querySelector("#midiMapPrevButton"),
  midiMapNextButton: document.querySelector("#midiMapNextButton"),
  midiPlaylistSummary: document.querySelector("#midiPlaylistSummary"),
  midiPlaylistMapList: document.querySelector("#midiPlaylistMapList"),
  midiClearMappingsButton: document.querySelector("#midiClearMappingsButton"),
  midiMappingList: document.querySelector("#midiMappingList"),
  infoTooltip: document.querySelector("#infoTooltip"),
  toast: document.querySelector("#toast"),
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {"Content-Type": "application/json"},
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 3600);
}

function option(label, value) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  return node;
}

function checkbox(name, value, label, checked = true) {
  const item = document.createElement("label");
  const input = document.createElement("input");
  const text = document.createElement("span");
  input.type = "checkbox";
  input.name = name;
  input.value = value;
  input.checked = checked;
  text.textContent = label;
  item.append(input, text);
  return item;
}

function infoButton(description) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "info-button";
  button.textContent = "i";
  button.dataset.tooltip = description || "";
  return button;
}

function fieldTitle(label, description) {
  const title = document.createElement("span");
  title.className = "field-title";
  const text = document.createElement("span");
  text.textContent = label;
  title.append(text);
  if (description) {
    title.append(infoButton(description));
  }
  return title;
}

function showInfoTooltip(button) {
  if (!els.infoTooltip) return;
  const text = button.dataset.tooltip || "";
  if (!text.trim()) return;
  els.infoTooltip.textContent = text;
  els.infoTooltip.hidden = false;
  positionInfoTooltip(button);
}

function positionInfoTooltip(button) {
  if (!els.infoTooltip || els.infoTooltip.hidden) return;
  const rect = button.getBoundingClientRect();
  const margin = 10;
  const tooltipRect = els.infoTooltip.getBoundingClientRect();
  const maxLeft = window.innerWidth - tooltipRect.width - margin;
  const left = Math.max(margin, Math.min(rect.left, maxLeft));
  const bottomSpace = window.innerHeight - rect.bottom;
  const top =
    bottomSpace > tooltipRect.height + 16
      ? rect.bottom + 8
      : Math.max(margin, rect.top - tooltipRect.height - 8);
  els.infoTooltip.style.left = `${Math.round(left)}px`;
  els.infoTooltip.style.top = `${Math.round(top)}px`;
}

function hideInfoTooltip() {
  if (!els.infoTooltip) return;
  els.infoTooltip.hidden = true;
}

function sceneTypeCheckbox(item) {
  const id = typeof item === "string" ? item : item.id;
  const label = typeof item === "string" ? item : item.label || item.id;
  const description = typeof item === "string" ? "" : item.description || "";
  const energy = typeof item === "string" ? [] : item.energy || [];
  const energyText =
    energy.length === 2
      ? `${Math.round(Number(energy[0]) * 100)}-${Math.round(Number(energy[1]) * 100)}% energy`
      : "";

  const option = document.createElement("label");
  option.className = "scene-type-option";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.name = "scene_type";
  input.value = id;
  input.checked = true;

  const copy = document.createElement("div");
  copy.className = "scene-type-copy";
  const title = document.createElement("strong");
  title.textContent = label;
  const details = document.createElement("small");
  details.textContent = [description, energyText].filter(Boolean).join(" | ");
  copy.append(title);
  if (details.textContent) copy.append(details);

  option.append(input, copy);
  return option;
}

function openModal(title) {
  els.modalTitle.textContent = title;
  els.modalBackdrop.hidden = false;
}

function hideModal() {
  els.modalBackdrop.hidden = true;
}

function hideModalPanels() {
  if (els.styleEditor) els.styleEditor.hidden = true;
  if (els.paletteEditor) els.paletteEditor.hidden = true;
  if (els.presetEditor) els.presetEditor.hidden = true;
  if (els.playlistEditor) els.playlistEditor.hidden = true;
  if (els.tabsGuidePanel) els.tabsGuidePanel.hidden = true;
  if (els.sceneEditorHost) {
    els.sceneEditorHost.innerHTML = "";
    els.sceneEditorHost.hidden = true;
  }
}

function openTabsGuide() {
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  hideModalPanels();
  if (els.tabsGuidePanel) els.tabsGuidePanel.hidden = false;
  openModal("Workshop Guide");
}

function closeModal() {
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.playlistSceneIds = new Set();
  hideModalPanels();
  renderStyleEditor();
  renderPaletteEditor();
  renderPresetEditor();
  renderSceneEditorModal();
  renderPublishedSceneEditorModal();
  hideModal();
  renderScenes();
  renderLedFxLibrary();
}

function checkedValues(container, name) {
  return [...container.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (item) => item.value,
  );
}

function setCheckedValues(container, name, checked) {
  container.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = checked;
  });
}

function bindRangeValue(input, output) {
  if (!input || !output) return;
  const update = () => {
    output.textContent = `${input.value}%`;
  };
  input.addEventListener("input", update);
  update();
}

function setAppView(view) {
  const activeView = ["factory", "presets", "forge", "midi"].includes(view) ? view : "factory";
  if (els.factoryView) els.factoryView.hidden = activeView !== "factory";
  if (els.presetLabView) els.presetLabView.hidden = activeView !== "presets";
  if (els.effectForgeView) els.effectForgeView.hidden = activeView !== "forge";
  if (els.midiMapperView) els.midiMapperView.hidden = activeView !== "midi";
  if (els.factoryTabButton) els.factoryTabButton.classList.toggle("active", activeView === "factory");
  if (els.presetLabTabButton) els.presetLabTabButton.classList.toggle("active", activeView === "presets");
  if (els.effectForgeTabButton) els.effectForgeTabButton.classList.toggle("active", activeView === "forge");
  if (els.midiMapperTabButton) els.midiMapperTabButton.classList.toggle("active", activeView === "midi");
  if (els.factoryTabButton) els.factoryTabButton.setAttribute("aria-selected", String(activeView === "factory"));
  if (els.presetLabTabButton) els.presetLabTabButton.setAttribute("aria-selected", String(activeView === "presets"));
  if (els.effectForgeTabButton) els.effectForgeTabButton.setAttribute("aria-selected", String(activeView === "forge"));
  if (els.midiMapperTabButton) els.midiMapperTabButton.setAttribute("aria-selected", String(activeView === "midi"));
  if (activeView === "presets") renderPresetLab();
  if (activeView === "midi") renderMidiMapper();
  localStorage.setItem("lsf.active_view", activeView);
}

function initializeAppView() {
  setAppView(localStorage.getItem("lsf.active_view") || "factory");
}

function renderForgeBehaviorOptions() {
  if (!els.forgeBehaviorSelect) return;
  const current = els.forgeBehaviorSelect.value;
  const available = availableForgeBehaviors();
  els.forgeBehaviorSelect.innerHTML = "";
  const ledFxGroup = document.createElement("optgroup");
  ledFxGroup.label = "LedFx-based sources";
  const customGroup = document.createElement("optgroup");
  customGroup.label = "Custom Workshop sources";
  available.forEach(([id, meta]) => {
    const node = option(meta.ledfxEffect ? `${meta.label} - ${meta.ledfxEffect}` : `${meta.label} - new module`, id);
    if (meta.ledfxEffect) {
      ledFxGroup.append(node);
    } else {
      customGroup.append(node);
    }
  });
  if (ledFxGroup.children.length) els.forgeBehaviorSelect.append(ledFxGroup);
  if (customGroup.children.length) els.forgeBehaviorSelect.append(customGroup);
  const hasCurrent = available.some(([id]) => id === current);
  if (hasCurrent) {
    els.forgeBehaviorSelect.value = current;
  } else if (available.some(([id]) => id === "energy")) {
    els.forgeBehaviorSelect.value = "energy";
  } else if (available[0]) {
    els.forgeBehaviorSelect.value = available[0][0];
  }
  if (els.forgeGenerateButton) els.forgeGenerateButton.disabled = available.length === 0;
  els.forgeRandomizeButton.disabled = available.length === 0;
  els.forgeSaveAsButton.disabled = available.length === 0;
}

function availableForgeBehaviors() {
  const schemas = (state.app && state.app.effect_schemas) || {};
  const schemaIds = Object.keys(schemas);
  return Object.entries(FORGE_BEHAVIORS).filter(([, meta]) => {
    if (!meta.ledfxEffect) return true;
    return !schemaIds.length || Boolean(schemas[meta.ledfxEffect]);
  });
}

function currentForgeBehaviorMeta() {
  const key = els.forgeBehaviorSelect.value;
  return FORGE_BEHAVIORS[key] || (availableForgeBehaviors()[0] || [null, FORGE_BEHAVIORS.energy])[1];
}

function collectForgeOptions() {
  const name = (els.forgeEffectNameInput.value || "Energy Bloom").trim();
  const behavior = els.forgeBehaviorSelect.value || "energy";
  const reactivity = els.forgeReactivitySelect.value || "sound";
  const behaviorMeta = currentForgeBehaviorMeta();
  const frequencyChoices = forgeAllowedFrequencies(behaviorMeta.ledfxEffect);
  const frequency = frequencyChoices.includes(els.forgeFrequencySelect.value)
    ? els.forgeFrequencySelect.value
    : (frequencyChoices.includes("Lows (beat+bass)") ? "Lows (beat+bass)" : frequencyChoices[0]);
  return {
    name,
    id: snakeCase(name),
    className: `${pascalCase(name)}Effect`,
    behavior,
    behaviorMeta,
    ledfxEffect: behaviorMeta.ledfxEffect,
    reactivity,
    frequency,
    frequencyChoices,
    intensity: Number(els.forgeIntensityInput.value) / 100,
    motion: Number(els.forgeMotionInput.value) / 100,
    detail: Number(els.forgeDetailInput.value) / 100,
    decay: Number(els.forgeDecayInput.value) / 100,
    flash: Number(els.forgeFlashInput.value) / 100,
  };
}

function generateForgeDraft() {
  if (!els.forgeCodeOutput || !els.forgeProfileOutput) return;
  renderForgeFrequencyOptions();
  updateForgeDescriptions();
  const options = collectForgeOptions();
  const profileJson = buildForgeProfileDraft(options);
  els.forgeCodeOutput.textContent = buildForgeModuleDraft(options);
  els.forgeProfileOutput.textContent = forgeProfileJsonToYaml(profileJson);
  els.forgeInstructionsOutput.textContent = buildForgeInstructions(options);
}

function updateForgeDescriptions() {
  const behavior = currentForgeBehaviorMeta();
  if (els.forgeBehaviorDescription) {
    const schema = forgeBaseEffectSchema(behavior.ledfxEffect);
    const propCount = Object.keys((schema && schema.properties) || {}).length;
    if (behavior.ledfxEffect) {
      els.forgeBehaviorDescription.textContent =
        `${behavior.description} Verified against installed LedFx effect: ${behavior.ledfxEffect}` +
        (propCount ? ` (${propCount} schema fields).` : ".");
    } else {
      els.forgeBehaviorDescription.textContent =
        `${behavior.description} Custom Workshop source: drafts a standalone module instead of reusing a LedFx base effect.`;
    }
  }
  if (els.forgeReactivityDescription) {
    els.forgeReactivityDescription.textContent = FORGE_REACTIVITY[els.forgeReactivitySelect.value] || "";
  }
  if (els.forgeFrequencyDescription) {
    const base = FORGE_FREQUENCIES[els.forgeFrequencySelect.value] || "";
    const behavior = currentForgeBehaviorMeta();
    const enumValues = forgeFrequencyEnum(behavior.ledfxEffect);
    const suffix = enumValues.length
      ? ` Available from ${behavior.ledfxEffect}: ${enumValues.join(", ")}.`
      : behavior.ledfxEffect
        ? ` ${behavior.ledfxEffect} does not expose frequency_range; the new draft module defines this LedFx-style enum itself.`
        : " Custom source: the draft module defines this LedFx-style enum itself.";
    els.forgeFrequencyDescription.textContent = `${base}${suffix}`;
  }
}

function renderForgeFrequencyOptions() {
  if (!els.forgeFrequencySelect) return;
  const current = els.forgeFrequencySelect.value;
  const allowed = forgeAllowedFrequencies(currentForgeBehaviorMeta().ledfxEffect);
  els.forgeFrequencySelect.innerHTML = "";
  allowed.forEach((value) => {
    els.forgeFrequencySelect.append(option(value, value));
  });
  els.forgeFrequencySelect.value = allowed.includes(current) ? current : (allowed.includes("Lows (beat+bass)") ? "Lows (beat+bass)" : allowed[0]);
}

function forgeAllowedFrequencies(effectId) {
  const values = forgeFrequencyEnum(effectId);
  return values.length ? values : Object.keys(FORGE_FREQUENCIES);
}

function forgeBaseEffectSchema(effectId) {
  return (
    state.app &&
    state.app.effect_schemas &&
    state.app.effect_schemas[effectId]
  ) || null;
}

function forgeFrequencyEnum(effectId) {
  const schema = forgeBaseEffectSchema(effectId);
  const spec = schema && schema.properties && schema.properties.frequency_range;
  return Array.isArray(spec && spec.enum) ? spec.enum.map(String) : [];
}

function buildForgeInstructions(options, files = null) {
  const moduleFile = basename(files && files.module ? files.module : `${options.id}.py`);
  const profileFile = basename(
    files && (files.profile_yaml || files.profile)
      ? (files.profile_yaml || files.profile)
      : `${options.id}.workshop-profile.yaml`,
  );
  const installerFile = basename(
    files && files.installer ? files.installer : `install_${options.id}.py`,
  );
  const instructionsFile = basename(
    files && files.instructions ? files.instructions : `IMPORT_${options.id}.md`,
  );
  const bundleFile = basename(
    files && files.bundle ? files.bundle : `${options.id}-ledfx-workshop.zip`,
  );
  const bundleDir = basename(files && files.directory ? files.directory : `${options.id}-ledfx-workshop`);
  const savedLine = bundleFile
    ? `Save downloads ${bundleFile} into your browser's default Downloads folder. Extract it before running the installer.`
    : files && files.directory
    ? `Saved folder: ${files.directory}`
    : "Use Save to download a ZIP bundle into your browser's default Downloads folder.";
  return [
    `# Import ${options.name} into LedFx`,
    "",
    "Effect Forge exports an experimental Python LedFx effect module plus a Workshop effect profile.",
    "This does not publish through the LedFx REST API. New Python effect code must be reviewed and copied into the LedFx installation manually.",
    "",
    savedLine,
    "",
    "## What was saved",
    "",
    ...(bundleFile ? [`- ${bundleFile} - ZIP bundle containing the files below.`] : []),
    `- ${moduleFile} - the LedFx Python effect module.`,
    `- ${profileFile} - the Workshop effect profile for this effect.`,
    `- ${installerFile} - optional helper that can install the module and update the Workshop profile.`,
    `- ${instructionsFile} - this guide.`,
    "",
    "## Fast path - run the installer",
    "",
    "Run the installer with any Python 3. It first tries to auto-detect LedFx app bundles, pip installs, pipx installs and common source checkouts, then copies the module into every detected ledfx/effects folder. It also updates the Workshop effect profile when you pass --workshop.",
    ...(bundleFile
      ? [
          "",
          "First extract the ZIP. Most systems create an extracted folder with the same name as the ZIP.",
        ]
      : [
          "",
          "Open a terminal in the folder that contains the saved files.",
        ]),
    "",
    "macOS / Linux:",
    "",
    "```bash",
    "cd ~/Downloads",
    ...(bundleFile
      ? [`unzip ${bundleFile}`, `cd ${bundleDir}`]
      : []),
    `python3 ${installerFile} --list-targets`,
    `python3 ${installerFile} --workshop "/path/to/LedFX Scene Generator"`,
    "```",
    "",
    "Windows PowerShell:",
    "",
    "```powershell",
    "cd $env:USERPROFILE\\Downloads",
    ...(bundleFile
      ? [`Expand-Archive .\\${bundleFile} -DestinationPath .\\${bundleDir} -Force`, `cd .\\${bundleDir}`]
      : []),
    `py .\\${installerFile} --list-targets`,
    `py .\\${installerFile} --workshop "C:\\path\\to\\LedFX Scene Generator"`,
    "```",
    "",
    "If --list-targets finds more than one LedFx effects folder, that is normal for some macOS app bundles. The installer writes the same module to all detected targets. Use --first-target-only only when you explicitly want the first detected folder.",
    "",
    "If auto-detection misses your install, pass --effects-dir with the exact ledfx/effects folder. If you do not pass --workshop, the script installs the LedFx module and writes a local profile snippet instead of editing Workshop data/effects.yaml.",
    "",
    "## Manual path - find the LedFx effects folder",
    "",
    "You usually do not need this section. Use it only when --list-targets does not show the right folder.",
    "",
    "First try the installer with a manual path:",
    "",
    "```bash",
    `python3 ${installerFile} --effects-dir /path/to/ledfx/effects --workshop "/path/to/LedFX Scene Generator"`,
    "```",
    "",
    "On Windows:",
    "",
    "```powershell",
    `py .\\${installerFile} --effects-dir C:\\path\\to\\ledfx\\effects --workshop "C:\\path\\to\\LedFX Scene Generator"`,
    "```",
    "",
    "If you still need to find the folder manually, use the Python environment that starts LedFx. If LedFx runs from a virtualenv, activate that virtualenv first. If LedFx runs in Docker, run the command inside the container.",
    "",
    "macOS / Linux, after activating the LedFx environment:",
    "",
    "```bash",
    "python - <<'PY'",
    "from pathlib import Path",
    "import ledfx",
    "print(Path(ledfx.__file__).resolve().parent / 'effects')",
    "PY",
    "```",
    "",
    "Windows PowerShell:",
    "",
    "```powershell",
    "py -c \"from pathlib import Path; import ledfx; print(Path(ledfx.__file__).resolve().parent / 'effects')\"",
    "```",
    "",
    "If import still fails, ask the package manager where LedFx is installed:",
    "",
    "macOS / Linux pip install:",
    "",
    "```bash",
    "python -m pip show ledfx",
    "# Use the Location value, then append /ledfx/effects",
    "```",
    "",
    "pipx on macOS / Linux:",
    "",
    "```bash",
    "pipx runpip ledfx show ledfx",
    "# Use the Location value, then append /ledfx/effects",
    "```",
    "",
    "Windows:",
    "",
    "```powershell",
    "py -m pip show ledfx",
    "# Use the Location value, then append \\ledfx\\effects",
    "```",
    "",
    "Docker / container install:",
    "",
    "Open a shell inside the container, or copy the module into the mounted LedFx source folder. A host Python command will not see LedFx unless LedFx is also installed on the host.",
    "",
    "## Manual step 2 - install the effect module",
    "",
    "Copy the generated Python module into the effects folder printed above.",
    "",
    "macOS / Linux example:",
    "",
    "```bash",
    `cp ${moduleFile} /path/to/site-packages/ledfx/effects/`,
    "```",
    "",
    "Windows PowerShell example:",
    "",
    "```powershell",
    `Copy-Item .\\${moduleFile} C:\\path\\to\\site-packages\\ledfx\\effects\\`,
    "```",
    "",
    "## Manual step 3 - restart and verify LedFx",
    "",
    "Fully stop and restart LedFx. Then refresh Workshop or open LedFx /api/schema.",
    `The new LedFx effect id should appear as: ${options.id}`,
    "",
    "## Manual step 4 - add the Workshop effect profile",
    "",
    `Open ${profileFile}. Copy the generated effect entry into Workshop's data/effects.yaml.`,
    "If data/effects.yaml already has an effects: block, copy only the nested effect entry under that block. Then restart or refresh Workshop so Scene Factory and Preset Lab can use it.",
    "",
    "Important: this is experimental code. Inspect imports, CONFIG_SCHEMA and audio hooks before using it live.",
  ].join("\n");
}

function basename(path) {
  return String(path || "").split(/[\\/]/).pop() || "";
}

function buildForgeInstallScript(options, moduleCode, profileJson) {
  const effectId = JSON.stringify(options.id);
  const effectName = JSON.stringify(options.name);
  const moduleLiteral = JSON.stringify(`${moduleCode.trimEnd()}\n`);
  const profileLiteral = JSON.stringify(profileJson);
  return [
    "#!/usr/bin/env python3",
    "r\"\"\"Install an experimental LedFx Workshop effect draft.",
    "",
    "Run this with any Python 3. The script tries to find the LedFx effects folder automatically.",
    "Examples:",
    "  python install_effect.py --workshop \"/path/to/LedFX Scene Generator\"",
    "  py .\\install_effect.py --workshop \"C:/path/to/LedFX Scene Generator\"",
    "\"\"\"",
    "from __future__ import annotations",
    "",
    "import argparse",
    "import json",
    "import os",
    "import shutil",
    "import sys",
    "from pathlib import Path",
    "",
    `EFFECT_ID = ${effectId}`,
    `EFFECT_NAME = ${effectName}`,
    `MODULE_CODE = ${moduleLiteral}`,
    `PROFILE_JSON = ${profileLiteral}`,
    "",
    "",
    "def parse_args():",
    "    parser = argparse.ArgumentParser(description=f\"Install {EFFECT_NAME} into LedFx and LedFx Workshop.\")",
    "    parser.add_argument(\"--effects-dir\", action=\"append\", help=\"LedFx ledfx/effects folder. Can be repeated; usually not needed.\")",
    "    parser.add_argument(\"--workshop\", help=\"LedFx Workshop project folder, or the data/effects.yaml file.\")",
    "    parser.add_argument(\"--list-targets\", action=\"store_true\", help=\"Only print detected LedFx effects folders and exit.\")",
    "    parser.add_argument(\"--first-target-only\", action=\"store_true\", help=\"Install only into the first detected LedFx effects folder.\")",
    "    parser.add_argument(\"--skip-module\", action=\"store_true\", help=\"Do not install the LedFx Python module.\")",
    "    parser.add_argument(\"--skip-workshop\", action=\"store_true\", help=\"Do not update Workshop data/effects.yaml.\")",
    "    return parser.parse_args()",
    "",
    "",
    "def fail(message):",
    "    print(f\"ERROR: {message}\", file=sys.stderr)",
    "    return 1",
    "",
    "",
    "def write_text(path, text):",
    "    path.write_text(text.rstrip() + \"\\n\", encoding=\"utf-8\")",
    "",
    "",
    "def backup_if_exists(path):",
    "    if not path.exists():",
    "        return None",
    "    backup = path.with_name(path.name + \".bak\")",
    "    index = 1",
    "    while backup.exists():",
    "        backup = path.with_name(f\"{path.name}.bak{index}\")",
    "        index += 1",
    "    shutil.copy2(path, backup)",
    "    return backup",
    "",
    "",
    "def normalize_effects_dir(path):",
    "    if not path:",
    "        return None",
    "    candidate = Path(path).expanduser()",
    "    if candidate.name != \"effects\" and (candidate / \"effects\").is_dir():",
    "        candidate = candidate / \"effects\"",
    "    try:",
    "        candidate = candidate.resolve()",
    "    except OSError:",
    "        return None",
    "    if not candidate.is_dir() or candidate.name != \"effects\":",
    "        return None",
    "    if not ((candidate / \"audio.py\").is_file() or (candidate / \"gradient.py\").is_file() or (candidate / \"__init__.py\").is_file()):",
    "        return None",
    "    return candidate",
    "",
    "",
    "def unique_existing(paths):",
    "    seen = set()",
    "    for raw_path in paths:",
    "        path = normalize_effects_dir(raw_path)",
    "        if not path or path in seen:",
    "            continue",
    "        seen.add(path)",
    "        yield path",
    "",
    "",
    "def candidate_effects_dirs(manual_paths):",
    "    if manual_paths:",
    "        for manual_path in manual_paths:",
    "            yield manual_path",
    "    for env_name in (\"LEDFX_EFFECTS_DIR\", \"LEDFX_EFFECTS_PATH\"):",
    "        env_value = os.environ.get(env_name)",
    "        if env_value:",
    "            for part in env_value.split(os.pathsep):",
    "                yield part",
    "    try:",
    "        import ledfx  # type: ignore",
    "        yield Path(ledfx.__file__).resolve().parent / \"effects\"",
    "    except Exception:",
    "        pass",
    "    here = Path(__file__).resolve().parent",
    "    cwd = Path.cwd().resolve()",
    "    home = Path.home()",
    "    base_roots = [here, cwd, *here.parents, *cwd.parents, home / \"Downloads\", home / \"Documents\", home / \"Applications\", Path(\"/Applications\")]",
    "    for root in base_roots:",
    "        if not root.exists():",
    "            continue",
    "        yield root / \"ledfx\" / \"effects\"",
    "        yield root / \"LedFx\" / \"ledfx\" / \"effects\"",
    "        try:",
    "            for app in root.glob(\"LedFx*.app\"):",
    "                yield app / \"Contents\" / \"Resources\" / \"ledfx\" / \"effects\"",
    "                yield app / \"Contents\" / \"Frameworks\" / \"ledfx\" / \"effects\"",
    "            for app in root.glob(\"LedFX*.app\"):",
    "                yield app / \"Contents\" / \"Resources\" / \"ledfx\" / \"effects\"",
    "                yield app / \"Contents\" / \"Frameworks\" / \"ledfx\" / \"effects\"",
    "        except OSError:",
    "            pass",
    "    for root, pattern in (",
    "        (home, \".local/pipx/venvs/ledfx/lib/python*/site-packages/ledfx/effects\"),",
    "        (home, \".local/lib/python*/site-packages/ledfx/effects\"),",
    "        (Path(sys.prefix), \"lib/python*/site-packages/ledfx/effects\"),",
    "    ):",
    "        try:",
    "            yield from root.glob(pattern)",
    "        except OSError:",
    "            pass",
    "    for env_name in (\"LOCALAPPDATA\", \"PROGRAMFILES\", \"PROGRAMFILES(X86)\"):",
    "        root_value = os.environ.get(env_name)",
    "        if not root_value:",
    "            continue",
    "        root = Path(root_value)",
    "        for pattern in (\"LedFx*/ledfx/effects\", \"LedFX*/ledfx/effects\", \"LedFx*/Lib/site-packages/ledfx/effects\", \"LedFX*/Lib/site-packages/ledfx/effects\"):",
    "            try:",
    "                yield from root.glob(pattern)",
    "            except OSError:",
    "                pass",
    "",
    "",
    "def find_ledfx_effects_dirs(manual_paths):",
    "    effects_dirs = list(unique_existing(candidate_effects_dirs(manual_paths)))",
    "    if not effects_dirs:",
    "        raise RuntimeError(",
    "            \"Could not find a LedFx ledfx/effects folder automatically. Run with --list-targets to debug, \"",
    "            \"or pass --effects-dir /path/to/ledfx/effects.\"",
    "        )",
    "    return effects_dirs",
    "",
    "",
    "def install_module(effects_dirs):",
    "    for effects_dir in effects_dirs:",
    "        target = effects_dir / f\"{EFFECT_ID}.py\"",
    "        backup = backup_if_exists(target)",
    "        write_text(target, MODULE_CODE)",
    "        print(f\"Installed LedFx module: {target}\")",
    "        if backup:",
    "            print(f\"Previous module backup: {backup}\")",
    "",
    "",
    "def candidate_workshop_paths(manual_path):",
    "    candidates = []",
    "    if manual_path:",
    "        candidates.append(Path(manual_path).expanduser())",
    "    env_path = os.environ.get(\"LEDFX_WORKSHOP_DIR\")",
    "    if env_path:",
    "        candidates.append(Path(env_path).expanduser())",
    "    here = Path(__file__).resolve().parent",
    "    cwd = Path.cwd().resolve()",
    "    candidates.extend([cwd, here])",
    "    candidates.extend(cwd.parents)",
    "    candidates.extend(here.parents)",
    "    home = Path.home()",
    "    candidates.extend([",
    "        home / \"Documents\" / \"ChatGPT\" / \"LedFX Scene Generator\",",
    "        home / \"Documents\" / \"LedFX Scene Generator\",",
    "        home / \"Documents\" / \"LedFx Workshop\",",
    "    ])",
    "    seen = set()",
    "    for candidate in candidates:",
    "        try:",
    "            resolved = candidate.resolve()",
    "        except OSError:",
    "            continue",
    "        if resolved in seen:",
    "            continue",
    "        seen.add(resolved)",
    "        yield resolved",
    "",
    "",
    "def resolve_workshop_effects_file(manual_path):",
    "    for candidate in candidate_workshop_paths(manual_path):",
    "        if candidate.is_file() and candidate.name == \"effects.yaml\":",
    "            return candidate",
    "        path = candidate / \"data\" / \"effects.yaml\"",
    "        if path.is_file():",
    "            return path",
    "    return None",
    "",
    "",
    "def profile_yaml(profile):",
    "    try:",
    "        import yaml  # type: ignore",
    "        return yaml.safe_dump({\"effects\": profile}, sort_keys=False, allow_unicode=False)",
    "    except Exception:",
    "        return json.dumps({\"effects\": profile}, indent=2)",
    "",
    "",
    "def update_workshop_profile(manual_path):",
    "    profile_path = resolve_workshop_effects_file(manual_path)",
    "    profile = json.loads(PROFILE_JSON)",
    "    if not profile_path:",
    "        fallback = Path.cwd() / f\"{EFFECT_ID}.workshop-profile.yaml\"",
    "        write_text(fallback, profile_yaml(profile))",
    "        print(\"Workshop profile was not updated automatically.\")",
    "        print(f\"Profile snippet written here instead: {fallback}\")",
    "        print(\"Run again with --workshop /path/to/LedFX Scene Generator to update data/effects.yaml automatically.\")",
    "        return",
    "    text = profile_path.read_text(encoding=\"utf-8\")",
    "    backup = backup_if_exists(profile_path)",
    "    try:",
    "        data = json.loads(text)",
    "        if not isinstance(data, dict):",
    "            raise ValueError(\"effects.yaml root must be a mapping\")",
    "        data.setdefault(\"effects\", {})",
    "        if not isinstance(data[\"effects\"], dict):",
    "            raise ValueError(\"effects key must be a mapping\")",
    "        data[\"effects\"].update(profile)",
    "        write_text(profile_path, json.dumps(data, indent=2))",
    "    except Exception:",
    "        try:",
    "            import yaml  # type: ignore",
    "            data = yaml.safe_load(text) or {}",
    "            if not isinstance(data, dict):",
    "                raise RuntimeError(\"effects.yaml root must be a mapping\")",
    "            data.setdefault(\"effects\", {})",
    "            if not isinstance(data[\"effects\"], dict):",
    "                raise RuntimeError(\"effects key must be a mapping\")",
    "            data[\"effects\"].update(profile)",
    "            write_text(profile_path, yaml.safe_dump(data, sort_keys=False, allow_unicode=False))",
    "        except ModuleNotFoundError as exc:",
    "            raise RuntimeError(\"PyYAML is required to update a non-JSON effects.yaml file automatically.\") from exc",
    "    print(f\"Updated Workshop profile: {profile_path}\")",
    "    if backup:",
    "        print(f\"Previous profile backup: {backup}\")",
    "",
    "",
    "def main():",
    "    args = parse_args()",
    "    try:",
    "        effects_dirs = []",
    "        if not args.skip_module or args.list_targets:",
    "            effects_dirs = find_ledfx_effects_dirs(args.effects_dir)",
    "            if args.first_target_only:",
    "                effects_dirs = effects_dirs[:1]",
    "        if args.list_targets:",
    "            print(\"Detected LedFx effects folders:\")",
    "            for effects_dir in effects_dirs:",
    "                print(f\"- {effects_dir}\")",
    "            return 0",
    "        if not args.skip_module:",
    "            install_module(effects_dirs)",
    "        if not args.skip_workshop:",
    "            update_workshop_profile(args.workshop)",
    "    except Exception as exc:",
    "        return fail(str(exc))",
    "    print(\"Done. Restart LedFx, then refresh LedFx Workshop.\")",
    "    return 0",
    "",
    "",
    "if __name__ == \"__main__\":",
    "    raise SystemExit(main())",
  ].join("\n");
}

function buildForgeModuleDraft(options) {
  const audioEnabled = options.reactivity !== "non_sound";
  const baseClass = audioEnabled ? "AudioReactiveEffect, GradientEffect" : "GradientEffect";
  const importLines = audioEnabled
    ? [
        "from ledfx.effects.audio import AudioReactiveEffect",
        "from ledfx.effects.gradient import GradientEffect",
      ]
    : ["from ledfx.effects.gradient import GradientEffect"];
  const audioBlock = audioEnabled
    ? [
        "    def audio_data_updated(self, data):",
        "        # Draft: verify the exact audio helpers against your installed LedFx version.",
        "        self._level = getattr(data, \"volume\", lambda: 0.0)()",
        "        if hasattr(data, \"beat_oscillator\"):",
        "            self._beat = data.beat_oscillator()",
        "",
      ]
    : [
        "    def audio_data_updated(self, data):",
        "        self._level = 0.55",
        "        self._beat = 0.0",
        "",
      ];
  return [
    "# Experimental draft generated by LedFx Workshop.",
    "# Install only after checking imports and hooks against your LedFx version.",
    "from __future__ import annotations",
    "",
    "import numpy as np",
    "import voluptuous as vol",
    ...importLines,
    "",
    "",
    `class ${options.className}(${baseClass}):`,
    `    NAME = "${options.name}"`,
    `    CATEGORY = "${forgeCategory(options)}"`,
    "    HIDDEN_KEYS = [\"background_color\"]",
    "    CONFIG_SCHEMA = vol.Schema({",
    `        vol.Optional("brightness", default=${formatFloat(options.intensity)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("speed", default=${formatFloat(options.motion)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("detail", default=${formatFloat(options.detail)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("decay", default=${formatFloat(options.decay)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("flash", default=${formatFloat(options.flash)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("frequency_range", default="${options.frequency}"): vol.In(${JSON.stringify(options.frequencyChoices)}),`,
    "    }, extra=vol.ALLOW_EXTRA)",
    "",
    "    def config_updated(self, config):",
    "        GradientEffect.config_updated(self, config)",
    "        self._phase = 0.0",
    "        self._level = 0.0",
    "        self._beat = 0.0",
    "",
    ...audioBlock,
    "    def render(self):",
    "        pixel_count = getattr(self, \"pixel_count\", 1) or 1",
    "        x = np.linspace(0.0, 1.0, pixel_count)",
    "        brightness = float(self.config.get(\"brightness\", 0.7))",
    "        speed = float(self.config.get(\"speed\", 0.5))",
    "        detail = float(self.config.get(\"detail\", 0.5))",
    "        decay = float(self.config.get(\"decay\", 0.5))",
    "        flash = float(self.config.get(\"flash\", 0.3))",
    "        self._phase = (self._phase + 0.01 + speed * 0.06) % 1.0",
    `        level = self._shape_${options.behavior}(x, brightness, detail, decay, flash)`,
    "        gradient_points = (x + self._phase * 0.2) % 1.0",
    "        colors = self.get_gradient_color_vectorized1d(gradient_points)",
    "        self.pixels = np.clip(colors * level[:, None], 0, 255)",
    "        self.roll_gradient()",
    "",
    buildForgeShapeMethod(options.behavior),
    "",
  ].join("\n");
}

function forgeCategory(options) {
  return "LedFx Workshop";
}

function buildForgeShapeMethod(behavior) {
  const methods = {
    static: [
      "    def _shape_static(self, x, brightness, detail, decay, flash):",
      "        breathe = 0.92 + 0.08 * np.sin(self._phase * 6.283)",
      "        return np.clip(np.ones_like(x) * brightness * breathe, 0.0, 1.0)",
    ],
    gradient: [
      "    def _shape_gradient(self, x, brightness, detail, decay, flash):",
      "        wave = 0.5 + 0.5 * np.sin((x + self._phase) * 6.283)",
      "        contrast = 0.35 + detail * 0.65",
      "        return np.clip((wave * contrast + (1.0 - contrast) * 0.5) * brightness, 0.0, 1.0)",
    ],
    melt: [
      "    def _shape_melt(self, x, brightness, detail, decay, flash):",
      "        slow = np.sin((x * (1.5 + detail * 2.0)) + self._phase * 4.0)",
      "        smear = 0.5 + 0.5 * np.sin(slow + self._level * 3.0)",
      "        return np.clip(smear * brightness * (0.35 + self._level * (1.0 - decay * 0.25)), 0.0, 1.0)",
    ],
    scroll: [
      "    def _shape_scroll(self, x, brightness, detail, decay, flash):",
      "        lanes = np.sin(((x + self._phase) * (3.0 + detail * 14.0)) * 6.283) ** 2",
      "        gate = 0.25 + np.clip(self._level + flash * 0.35, 0.0, 1.0)",
      "        return np.clip(lanes * gate * brightness * (1.0 - decay * 0.2), 0.0, 1.0)",
    ],
    energy: [
      "    def _shape_energy(self, x, brightness, detail, decay, flash):",
      "        low = 0.5 + 0.5 * np.sin((x + self._phase) * 6.283)",
      "        high = 0.5 + 0.5 * np.sin((x * (7.0 + detail * 12.0)) - self._phase * 9.0)",
      "        mix = np.maximum(low * 0.7, high * detail)",
      "        return np.clip(mix * brightness * (0.35 + self._level + flash * 0.2), 0.0, 1.0)",
    ],
    rain: [
      "    def _shape_rain(self, x, brightness, detail, decay, flash):",
      "        drops = np.sin((x * (17.0 + detail * 25.0)) - self._phase * 18.0) ** 10",
      "        trail = np.sin((x * (5.0 + detail * 8.0)) - self._phase * 5.0) ** 2",
      "        return np.clip((drops + trail * 0.28) * brightness * (0.25 + self._level + flash * 0.15), 0.0, 1.0)",
    ],
    bar: [
      "    def _shape_bar(self, x, brightness, detail, decay, flash):",
      "        fill = np.clip(self._level * (0.45 + brightness + flash * 0.35), 0.03, 1.0)",
      "        edge = 0.015 + (1.0 - detail) * 0.08",
      "        return np.clip(1.0 - np.clip((x - fill) / max(edge, 0.001), 0.0, 1.0), 0.0, 1.0) * brightness",
    ],
    multibar: [
      "    def _shape_multibar(self, x, brightness, detail, decay, flash):",
      "        bars = np.sin((x * (4.0 + detail * 20.0)) * 3.1415) ** 6",
      "        offset = np.sin((x * 2.0 + self._phase) * 6.283) * 0.25 + 0.75",
      "        return np.clip(bars * offset * brightness * (0.35 + self._level + flash * 0.2), 0.0, 1.0)",
    ],
    equalizer: [
      "    def _shape_equalizer(self, x, brightness, detail, decay, flash):",
      "        steps = np.floor(x * (5.0 + detail * 18.0))",
      "        levels = 0.45 + 0.55 * np.sin((steps * 1.7) + self._phase * 8.0)",
      "        return np.clip(levels * brightness * (0.3 + self._level + flash * 0.2), 0.0, 1.0)",
    ],
    concentric: [
      "    def _shape_concentric(self, x, brightness, detail, decay, flash):",
      "        center_distance = np.abs(x - 0.5) * 2.0",
      "        rings = np.sin((center_distance * (3.0 + detail * 12.0) - self._phase * 5.0) * 6.283) ** 2",
      "        pulse = np.clip(self._level + self._beat * 0.35 + flash * 0.25, 0.0, 1.0)",
      "        return np.clip(rings * pulse * brightness * (1.0 - decay * 0.25), 0.0, 1.0)",
    ],
    pulse: [
      "    def _shape_pulse(self, x, brightness, detail, decay, flash):",
      "        width = 0.08 + (1.0 - detail) * 0.22",
      "        pulse = np.exp(-((x - self._beat) ** 2) / max(width, 0.01))",
      "        body = np.maximum(pulse, self._level * (0.35 + brightness))",
      "        return np.clip(body * (1.0 - decay * 0.35), 0.0, 1.0)",
    ],
    bands: [
      "    def _shape_bands(self, x, brightness, detail, decay, flash):",
      "        bands = np.sin((x * (4.0 + detail * 18.0)) + self._phase * 6.283) ** 2",
      "        gate = np.clip(self._level * (0.4 + brightness + flash), 0.0, 1.0)",
      "        return np.clip(bands * gate * (1.0 - decay * 0.25), 0.0, 1.0)",
    ],
    wave: [
      "    def _shape_wave(self, x, brightness, detail, decay, flash):",
      "        wave = 0.5 + 0.5 * np.sin((x + self._phase) * 6.283 * (1.0 + detail * 3.0))",
      "        lift = 0.15 + self._level * (0.35 + brightness)",
      "        return np.clip((wave * lift) + flash * self._level * 0.15, 0.0, 1.0)",
    ],
    sparkle: [
      "    def _shape_sparkle(self, x, brightness, detail, decay, flash):",
      "        sparkle = np.sin((x * 53.0) + self._phase * 31.0) ** 18",
      "        threshold = 0.45 + (1.0 - detail) * 0.35",
      "        accents = np.where(sparkle > threshold, sparkle, 0.0)",
      "        return np.clip(accents * (self._level + flash) * brightness * (1.2 - decay * 0.4), 0.0, 1.0)",
    ],
    sub_swell: [
      "    def _shape_sub_swell(self, x, brightness, detail, decay, flash):",
      "        weight = np.clip(self._level * (1.15 + brightness * 0.65), 0.0, 1.0)",
      "        swell = np.sin((x * (0.75 + detail * 1.8)) + self._phase * 2.2) * 0.5 + 0.5",
      "        floor = 0.04 + weight * (0.18 + flash * 0.18)",
      "        return np.clip((swell ** (1.4 + decay * 2.2)) * weight * brightness + floor, 0.0, 1.0)",
    ],
    tunnel: [
      "    def _shape_tunnel(self, x, brightness, detail, decay, flash):",
      "        center_distance = np.abs(x - 0.5) * 2.0",
      "        rings = np.sin((center_distance * (2.0 + detail * 16.0)) - self._phase * (5.0 + flash * 8.0)) ** 2",
      "        focus = np.clip(1.0 - center_distance * (0.45 + decay * 0.5), 0.0, 1.0)",
      "        pressure = np.clip(self._level * (0.75 + brightness) + self._beat * 0.22, 0.0, 1.0)",
      "        return np.clip(np.maximum(rings * focus, pressure * focus * 0.35) * pressure, 0.0, 1.0)",
    ],
    laser_gate: [
      "    def _shape_laser_gate(self, x, brightness, detail, decay, flash):",
      "        beam_count = 1.0 + detail * 7.0",
      "        beams = np.sin((x * beam_count + self._phase * (1.0 + flash * 2.0)) * 6.283) ** 24",
      "        gate = np.clip((self._level + flash * 0.55) * (1.2 - decay * 0.35), 0.0, 1.0)",
      "        return np.clip(beams * gate * brightness * 1.35, 0.0, 1.0)",
    ],
    shimmer: [
      "    def _shape_shimmer(self, x, brightness, detail, decay, flash):",
      "        fine = np.sin((x * (23.0 + detail * 52.0)) + self._phase * 27.0) ** 12",
      "        drift = 0.35 + 0.65 * (np.sin((x * 3.0) - self._phase * 4.0) * 0.5 + 0.5)",
      "        gate = np.clip(0.18 + self._level * 0.75 + flash * 0.45, 0.0, 1.0)",
      "        return np.clip(fine * drift * gate * brightness * (1.15 - decay * 0.25), 0.0, 1.0)",
    ],
    shadow_gap: [
      "    def _shape_shadow_gap(self, x, brightness, detail, decay, flash):",
      "        gap = np.sin((x * (1.0 + detail * 5.0)) + self._phase * 2.8) * 0.5 + 0.5",
      "        gate = np.where(gap > 0.72 - detail * 0.18, gap, 0.0)",
      "        accent = np.clip(self._level * (0.18 + flash * 0.5), 0.0, 0.55)",
      "        return np.clip(gate * brightness * accent * (1.0 - decay * 0.35), 0.0, 1.0)",
    ],
    riser: [
      "    def _shape_riser(self, x, brightness, detail, decay, flash):",
      "        ramp = self._phase",
      "        band = np.clip((x - (1.0 - ramp)) / max(0.04, 0.32 - detail * 0.22), 0.0, 1.0)",
      "        texture = 0.55 + 0.45 * np.sin((x * (3.0 + detail * 18.0) + ramp * 4.0) * 6.283)",
      "        pressure = np.clip(ramp * 0.55 + self._level * 0.7 + flash * 0.25, 0.0, 1.0)",
      "        return np.clip(band * texture * pressure * brightness * (1.15 - decay * 0.15), 0.0, 1.0)",
    ],
    call_response: [
      "    def _shape_call_response(self, x, brightness, detail, decay, flash):",
      "        zones = np.floor(x * (2.0 + detail * 8.0))",
      "        side = np.mod(zones + np.floor(self._phase * (2.0 + flash * 6.0)), 2.0)",
      "        active = np.where(side < 1.0, 1.0, 0.24 + self._level * 0.4)",
      "        groove = 0.45 + 0.55 * np.sin((x * (1.0 + detail * 4.0) - self._phase * 2.0) * 6.283) ** 2",
      "        return np.clip(active * groove * brightness * (0.35 + self._level + flash * 0.2), 0.0, 1.0)",
    ],
    ripple: [
      "    def _shape_ripple(self, x, brightness, detail, decay, flash):",
      "        origin = 0.5 + 0.2 * np.sin(self._phase * 6.283)",
      "        distance = np.abs(x - origin)",
      "        ripples = np.sin((distance * (10.0 + detail * 24.0) - self._phase * (5.0 + flash * 8.0)) * 6.283) ** 2",
      "        envelope = np.exp(-distance * (2.0 + decay * 5.0))",
      "        impact = np.clip(self._level * (0.65 + brightness) + flash * 0.35, 0.0, 1.0)",
      "        return np.clip(ripples * envelope * impact * brightness * 1.25, 0.0, 1.0)",
    ],
    blade: [
      "    def _shape_blade(self, x, brightness, detail, decay, flash):",
      "        edge = np.maximum(0.0, 1.0 - np.abs((x - self._phase) * 2.0 - 1.0))",
      "        blade = edge ** max(1.0, 6.0 - detail * 4.0)",
      "        pressure = np.clip(self._level * (0.6 + brightness) + flash * 0.25, 0.0, 1.0)",
      "        return np.clip(blade * pressure * (1.15 - decay * 0.2), 0.0, 1.0)",
    ],
    bpm_strobe: [
      "    def _shape_bpm_strobe(self, x, brightness, detail, decay, flash):",
      "        timed = 1.0 if np.sin(self._phase * 6.283 * (2.0 + detail * 6.0)) > 0.82 - flash * 0.35 else 0.0",
      "        return np.ones_like(x) * timed * brightness",
    ],
    bass_strobe: [
      "    def _shape_bass_strobe(self, x, brightness, detail, decay, flash):",
      "        gate = 1.0 if self._level + flash > 0.75 else 0.0",
      "        texture = 0.65 + 0.35 * np.sin((x * (2.0 + detail * 10.0)) + self._phase * 12.0)",
      "        return np.clip(texture * gate * brightness * (1.0 - decay * 0.2), 0.0, 1.0)",
    ],
  };
  return (methods[behavior] || methods.pulse).join("\n");
}

function buildForgeProfileDraft(options) {
  const sceneTypes = options.behaviorMeta.sceneTypes;
  const energyLow = clampNumber(options.intensity - 0.28, 0.05, 0.9);
  const energyHigh = clampNumber(options.intensity + 0.22, energyLow + 0.05, 1.0);
  const profile = {
    name: options.name,
    ledfx_effect: options.id,
    source: options.ledfxEffect ? "ledfx-based" : "custom-workshop",
    description: options.behaviorMeta.description,
    scene_types: sceneTypes,
    audio_reactive: options.reactivity !== "non_sound",
    energy: [Number(energyLow.toFixed(2)), Number(energyHigh.toFixed(2))],
    movement: Number(options.motion.toFixed(2)),
    rarity: Number((0.35 + options.detail * 0.35).toFixed(2)),
    safe_params: {
      brightness: {range: [0.15, Math.max(0.2, Number(options.intensity.toFixed(2)))], energy: "direct", spread: 0.14},
      speed: {range: [0.05, Math.max(0.12, Number(options.motion.toFixed(2)))], energy: "direct", spread: 0.12},
      detail: {range: [0.1, Math.max(0.2, Number(options.detail.toFixed(2)))], variation: "direct", spread: 0.16},
      decay: {range: [0.05, Math.max(0.12, Number(options.decay.toFixed(2)))], energy: "inverse", spread: 0.1},
      flash: {range: [0, Math.max(0.08, Number(options.flash.toFixed(2)))], energy: "direct", spread: 0.1},
      gradient_roll: {range: [0, Math.max(0.4, Number((options.motion * 3.5).toFixed(2)))], energy: "direct", spread: 0.16},
    },
    palette_keys: forgePaletteKeys(options.behaviorMeta.paletteMode),
    defaults: {
      frequency_range: options.frequency,
    },
  };
  if (options.ledfxEffect) {
    profile.based_on_ledfx_effect = options.ledfxEffect;
  }
  return JSON.stringify(
    {
      [options.id]: profile,
    },
    null,
    2,
  );
}

function forgePaletteKeys(mode) {
  return {gradient: "gradient"};
}

function updateForgeBehaviorDefaults() {
  if (els.forgeBehaviorSelect.value === "bpm_strobe") {
    els.forgeReactivitySelect.value = "non_sound";
  } else if (els.forgeBehaviorSelect.value === "bass_strobe" && els.forgeReactivitySelect.value === "non_sound") {
    els.forgeReactivitySelect.value = "sound";
  }
  generateForgeDraft();
}

function snakeCase(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || "custom_effect";
}

function pascalCase(value) {
  return snakeCase(value)
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") || "Custom";
}

function formatFloat(value) {
  return Number(value || 0).toFixed(2);
}

async function copyForgeOutput(target, label) {
  const text = target ? target.textContent : "";
  if (!text.trim()) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied.`);
  } catch (error) {
    showToast("Copy failed. Select the generated text manually.");
  }
}

function randomizeForgeDraft() {
  const available = availableForgeBehaviors();
  if (!available.length) {
    showToast("No effect sources are available for Forge.");
    return;
  }
  const [behaviorId, behaviorMeta] = randomChoice(available);
  els.forgeBehaviorSelect.value = behaviorId;

  if (behaviorId === "bpm_strobe") {
    els.forgeReactivitySelect.value = "non_sound";
  } else if (behaviorId === "static" || behaviorId === "gradient") {
    els.forgeReactivitySelect.value = Math.random() > 0.35 ? "non_sound" : "sound";
  } else {
    els.forgeReactivitySelect.value = "sound";
  }

  renderForgeFrequencyOptions();
  const frequencyChoices = forgeAllowedFrequencies(behaviorMeta.ledfxEffect);
  els.forgeFrequencySelect.value = randomChoice(frequencyChoices);

  const ranges = forgeRandomRanges(behaviorId);
  els.forgeIntensityInput.value = randomInt(ranges.intensity[0], ranges.intensity[1]);
  els.forgeMotionInput.value = randomInt(ranges.motion[0], ranges.motion[1]);
  els.forgeDetailInput.value = randomInt(ranges.detail[0], ranges.detail[1]);
  els.forgeDecayInput.value = randomInt(ranges.decay[0], ranges.decay[1]);
  els.forgeFlashInput.value = randomInt(ranges.flash[0], ranges.flash[1]);
  els.forgeEffectNameInput.value = randomForgeName(behaviorId, behaviorMeta);

  syncRangeOutputs([
    [els.forgeIntensityInput, els.forgeIntensityValue],
    [els.forgeMotionInput, els.forgeMotionValue],
    [els.forgeDetailInput, els.forgeDetailValue],
    [els.forgeDecayInput, els.forgeDecayValue],
    [els.forgeFlashInput, els.forgeFlashValue],
  ]);
  generateForgeDraft();
  showToast("Forge draft randomized.");
}

function forgeRandomRanges(behaviorId) {
  const ranges = {
    static: {intensity: [20, 58], motion: [4, 28], detail: [8, 35], decay: [45, 88], flash: [0, 12]},
    gradient: {intensity: [35, 78], motion: [20, 72], detail: [18, 62], decay: [35, 82], flash: [0, 20]},
    melt: {intensity: [28, 72], motion: [18, 58], detail: [20, 56], decay: [52, 90], flash: [4, 22]},
    scroll: {intensity: [45, 86], motion: [48, 92], detail: [32, 78], decay: [28, 72], flash: [10, 38]},
    energy: {intensity: [58, 92], motion: [42, 86], detail: [35, 82], decay: [22, 68], flash: [16, 52]},
    rain: {intensity: [35, 76], motion: [28, 78], detail: [42, 88], decay: [45, 86], flash: [8, 32]},
    bar: {intensity: [48, 88], motion: [34, 78], detail: [18, 62], decay: [24, 64], flash: [14, 46]},
    multibar: {intensity: [55, 94], motion: [48, 92], detail: [38, 84], decay: [20, 58], flash: [20, 58]},
    equalizer: {intensity: [48, 90], motion: [36, 82], detail: [46, 92], decay: [24, 66], flash: [14, 50]},
    concentric: {intensity: [50, 94], motion: [34, 84], detail: [32, 78], decay: [18, 62], flash: [24, 66]},
    sub_swell: {intensity: [32, 82], motion: [12, 48], detail: [22, 68], decay: [48, 92], flash: [4, 28]},
    tunnel: {intensity: [52, 94], motion: [34, 86], detail: [42, 88], decay: [18, 62], flash: [18, 58]},
    laser_gate: {intensity: [58, 100], motion: [42, 92], detail: [36, 88], decay: [8, 48], flash: [42, 96]},
    shimmer: {intensity: [34, 86], motion: [44, 94], detail: [58, 100], decay: [20, 66], flash: [20, 74]},
    shadow_gap: {intensity: [18, 58], motion: [10, 46], detail: [28, 74], decay: [58, 96], flash: [0, 24]},
    riser: {intensity: [46, 92], motion: [38, 88], detail: [34, 82], decay: [20, 66], flash: [18, 62]},
    call_response: {intensity: [38, 84], motion: [34, 82], detail: [26, 78], decay: [24, 72], flash: [10, 48]},
    ripple: {intensity: [48, 96], motion: [36, 86], detail: [34, 86], decay: [22, 74], flash: [20, 68]},
    blade: {intensity: [62, 98], motion: [54, 96], detail: [34, 82], decay: [16, 58], flash: [24, 70]},
    bpm_strobe: {intensity: [60, 100], motion: [42, 88], detail: [18, 72], decay: [8, 42], flash: [58, 100]},
    bass_strobe: {intensity: [62, 100], motion: [34, 82], detail: [20, 70], decay: [8, 46], flash: [62, 100]},
  };
  return ranges[behaviorId] || ranges.energy;
}

function randomForgeName(behaviorId, behaviorMeta) {
  const prefixes = ["Arc", "Bass", "Circuit", "Flux", "Ghost", "Ion", "Neon", "Pulse", "Signal", "Vector"];
  const suffixes = {
    static: ["Dimmer", "Hold", "Plate"],
    gradient: ["Roll", "Drift", "Field"],
    melt: ["Melt", "Smear", "Flow"],
    scroll: ["Chase", "Scroll", "Lane"],
    energy: ["Bloom", "Wash", "Body"],
    rain: ["Rain", "Trail", "Fall"],
    bar: ["Meter", "Bar", "Lift"],
    multibar: ["Stack", "Meter", "Array"],
    equalizer: ["Bands", "Grid", "Blocks"],
    concentric: ["Rings", "Pulse", "Core"],
    sub_swell: ["Swell", "Depth", "Pressure"],
    tunnel: ["Tunnel", "Core", "Drive"],
    laser_gate: ["Beam", "Gate", "Trace"],
    shimmer: ["Shimmer", "Flicker", "Dust"],
    shadow_gap: ["Shadow", "Gap", "Void"],
    riser: ["Riser", "Lift", "Pressure"],
    call_response: ["Answer", "Relay", "Phrase"],
    ripple: ["Ripple", "Impact", "Wake"],
    blade: ["Blade", "Edge", "Cut"],
    bpm_strobe: ["Clock", "Strobe", "Gate"],
    bass_strobe: ["Hit", "Strobe", "Gate"],
  };
  const baseSuffixes = suffixes[behaviorId] || [behaviorMeta.label.split(" ")[0] || "Effect"];
  return `${randomChoice(prefixes)} ${randomChoice(baseSuffixes)}`;
}

function syncRangeOutputs(pairs) {
  pairs.forEach(([input, output]) => {
    if (input && output) output.textContent = `${input.value}%`;
  });
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

async function saveForgeDraft() {
  renderForgeFrequencyOptions();
  updateForgeDescriptions();
  const options = collectForgeOptions();
  const moduleCode = buildForgeModuleDraft(options);
  const profileJson = buildForgeProfileDraft(options);
  const profileYaml = forgeProfileJsonToYaml(profileJson);
  const installerCode = buildForgeInstallScript(options, moduleCode, profileJson);
  const bundleDir = `${options.id}-ledfx-workshop`;
  const bundleFile = `${bundleDir}.zip`;
  const files = {
    bundle: bundleFile,
    directory: bundleDir,
    module: `${bundleDir}/${options.id}.py`,
    profile_yaml: `${bundleDir}/${options.id}.workshop-profile.yaml`,
    installer: `${bundleDir}/install_${options.id}.py`,
    instructions: `${bundleDir}/IMPORT_${options.id}.md`,
  };
  const instructions = buildForgeInstructions(options, files);
  els.forgeCodeOutput.textContent = moduleCode;
  els.forgeProfileOutput.textContent = profileYaml;
  els.forgeInstructionsOutput.textContent = instructions;
  els.forgeSaveAsButton.disabled = true;
  els.forgeSaveStatus.textContent = "Preparing ZIP...";
  try {
    const bundle = createZipBlob([
      {name: files.module, text: moduleCode},
      {name: files.profile_yaml, text: profileYaml},
      {name: files.installer, text: installerCode},
      {name: files.instructions, text: instructions},
    ]);
    downloadBlobAs(bundleFile, bundle);
    els.forgeSaveStatus.textContent = `Saved ${bundleFile} to your browser downloads folder.`;
    showToast("Effect draft ZIP saved.");
  } catch (error) {
    els.forgeSaveStatus.textContent = "";
    showToast(error.message);
  } finally {
    els.forgeSaveAsButton.disabled = availableForgeBehaviors().length === 0;
  }
}

function downloadBlobAs(fileName, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = CRC32_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function zipDateParts(date = new Date()) {
  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const dosDate =
    ((date.getFullYear() - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();
  return {dosTime, dosDate};
}

function createZipBlob(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const centralDirectory = [];
  let offset = 0;
  const {dosTime, dosDate} = zipDateParts();

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const data = encoder.encode(`${file.text.trimEnd()}\n`);
    const crc = crc32(data);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const local = new DataView(localHeader.buffer);
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0, true);
    local.setUint16(8, 0, true);
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, nameBytes.length, true);
    local.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);
    chunks.push(localHeader, data);
    centralDirectory.push({nameBytes, crc, size: data.length, offset});
    offset += localHeader.length + data.length;
  });

  const centralStart = offset;
  centralDirectory.forEach((entry) => {
    const header = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, dosTime, true);
    view.setUint16(14, dosDate, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.size, true);
    view.setUint32(24, entry.size, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, entry.offset, true);
    header.set(entry.nameBytes, 46);
    chunks.push(header);
    offset += header.length;
  });

  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, centralDirectory.length, true);
  endView.setUint16(10, centralDirectory.length, true);
  endView.setUint32(12, offset - centralStart, true);
  endView.setUint32(16, centralStart, true);
  endView.setUint16(20, 0, true);
  chunks.push(end);

  return new Blob(chunks, {type: "application/zip"});
}

function forgeProfileJsonToYaml(profileJson) {
  try {
    return toSimpleYaml({effects: JSON.parse(profileJson)});
  } catch (error) {
    return `effects:\n  # Could not convert profile JSON to YAML: ${error.message}\n`;
  }
}

function toSimpleYaml(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          return `${pad}-\n${toSimpleYaml(item, indent + 2)}`;
        }
        return `${pad}- ${yamlScalar(item)}`;
      })
      .join("\n") + (value.length ? "\n" : "");
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => {
        if (Array.isArray(item)) {
          if (item.every((entry) => !entry || typeof entry !== "object")) {
            return `${pad}${key}: [${item.map(yamlScalar).join(", ")}]`;
          }
          return `${pad}${key}:\n${toSimpleYaml(item, indent + 2).trimEnd()}`;
        }
        if (item && typeof item === "object") {
          return `${pad}${key}:\n${toSimpleYaml(item, indent + 2).trimEnd()}`;
        }
        return `${pad}${key}: ${yamlScalar(item)}`;
      })
      .join("\n") + "\n";
  }
  return `${pad}${yamlScalar(value)}\n`;
}

function yamlScalar(value) {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "null";
  const text = String(value);
  if (/^[A-Za-z0-9_./+() -]+$/.test(text) && text.trim() === text && text !== "") {
    return text;
  }
  return JSON.stringify(text);
}

function parseTagInput(value) {
  return String(value || "")
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSearchInput(value) {
  return String(value || "")
    .split(/[,;\n\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

async function loadAppState() {
  await loadConnectionSettings();
  setConnectionStatus("checking", "Checking");
  try {
    state.app = await api("/api/app-state");
    renderControls();
    renderConnection();
    await loadLedFxLibrary(false);
  } catch (error) {
    setConnectionStatus("offline", "Offline");
    els.connectionLine.textContent = `LedFx offline: ${error.message}`;
    closeTopPreviewStream();
    showToast(error.message);
  }
}

async function refreshAppCatalog() {
  try {
    state.app = await api("/api/app-state");
    renderConnection();
    renderPresetLab();
  } catch (error) {
    showToast(error.message);
  }
}

async function loadConnectionSettings() {
  try {
    const data = await api("/api/connection");
    if (data.ledfx_url) {
      els.ledfxUrlInput.value = data.ledfx_url;
    }
  } catch (error) {
    // The local Workshop server may still be starting; app-state will report the useful error.
  }
}

async function saveConnection() {
  const ledfxUrl = els.ledfxUrlInput.value.trim();
  if (!ledfxUrl) {
    showToast("LedFx API URL is required.");
    return;
  }
  els.saveConnectionButton.disabled = true;
  els.saveConnectionButton.textContent = "Connecting...";
  try {
    const data = await api("/api/connection", {
      method: "POST",
      body: JSON.stringify({ledfx_url: ledfxUrl}),
    });
    els.ledfxUrlInput.value = data.ledfx_url || ledfxUrl;
    showToast("LedFx connection updated.");
    await loadAppState();
  } catch (error) {
    showToast(error.message);
  } finally {
    els.saveConnectionButton.disabled = false;
    els.saveConnectionButton.textContent = "Connect";
  }
}

function renderConnection() {
  const app = state.app;
  if (!app) return;
  const info = app.info || {};
  const url = (app.connection && app.connection.ledfx_url) || els.ledfxUrlInput.value || "";
  setConnectionStatus("online", "Online");
  els.connectionLine.textContent =
    `${info.name || "LedFx"} ${info.version || ""} | ` +
    `${app.virtuals.length} devices | ${app.effect_count} effects | ` +
    `${app.scene_count} scenes | ${url}`;
  renderTopDevicePreview();
}

function setConnectionStatus(status, text) {
  if (!els.connectionStatus || !els.connectionStatusText) return;
  els.connectionStatus.className = `connection-status is-${status}`;
  els.connectionStatusText.textContent = text;
}

function renderTopDevicePreview() {
  if (!els.topPreviewDeviceSelect || !els.topPreviewVisual) return;
  const app = state.app;
  const virtuals = (app && app.virtuals) || [];
  const current = state.topPreviewDeviceId || els.topPreviewDeviceSelect.value;
  els.topPreviewDeviceSelect.innerHTML = "";
  virtuals.forEach((virtual) => {
    els.topPreviewDeviceSelect.append(option(`${virtual.name || virtual.id} (${virtual.id})`, virtual.id));
  });
  const preferred =
    (current && virtuals.some((virtual) => virtual.id === current) && current) ||
    ((app && app.default_virtual_ids) || []).find((id) => virtuals.some((virtual) => virtual.id === id)) ||
    (virtuals[0] && virtuals[0].id) ||
    "";
  if (preferred) {
    els.topPreviewDeviceSelect.value = preferred;
    state.topPreviewDeviceId = preferred;
    localStorage.setItem("lsf.top_preview_device", preferred);
  }
  const virtual = virtuals.find((item) => item.id === els.topPreviewDeviceSelect.value);
  updateTopDevicePreview(virtual);
  connectTopPreviewStream();
}

async function refreshTopDevicePreviewState() {
  try {
    state.app = await api("/api/app-state");
    renderConnection();
    renderPresetLab();
  } catch (error) {
    // Keep the last visible preview; the global connection status will report offline on the next full refresh.
  }
}

function updateTopDevicePreview(virtual) {
  const status = els.topPreviewStatus;
  const visual = els.topPreviewVisual;
  const effectName = els.topPreviewEffectName;
  const pixelCount = els.topPreviewPixelCount;
  if (!visual || !effectName || !pixelCount) return;
  const effect = (virtual && virtual.effect) || {};
  const effectType = effect.type || (virtual && virtual.effect_type) || "";
  const config = effect.config || {};
  const background = previewBackgroundFromConfig(effectType, config);
  state.topPreviewLastFrameAt = 0;
  visual.style.background = background;
  visual.classList.remove("has-live");
  visual.classList.toggle("is-idle", !effectType || !(virtual && virtual.active));
  effectName.textContent = effectType || "No effect";
  pixelCount.textContent = virtual
    ? `${virtual.pixel_count || 0} px | waiting for stream`
    : "-";
  if (status) {
    const active = Boolean(virtual && virtual.active && effectType);
    status.textContent = active ? "Waiting stream" : "Idle";
    status.classList.toggle("is-muted", !active);
  }
  clearTopPreviewCanvas();
  scheduleTopPreviewFallback(virtual);
}

function connectTopPreviewStream() {
  const virtualId = state.topPreviewDeviceId || (els.topPreviewDeviceSelect && els.topPreviewDeviceSelect.value) || "";
  const streamUrl = previewStreamUrlForDevice(virtualId);
  if (!virtualId || !streamUrl || typeof EventSource === "undefined") {
    closeTopPreviewStream();
    return;
  }
  const streamKey = `${streamUrl}|${virtualId}`;
  if (
    state.topPreviewSocket &&
    state.topPreviewStreamKey === streamKey &&
    state.topPreviewSocket.readyState !== EventSource.CLOSED
  ) {
    return;
  }
  closeTopPreviewStream(false);
  state.topPreviewStreamKey = streamKey;
  setTopPreviewStatus("Connecting stream", false);
  try {
    const source = new EventSource(streamUrl);
    state.topPreviewSocket = source;
    source.addEventListener("open", () => {
      if (state.topPreviewSocket !== source) return;
      setTopPreviewStatus("Stream connected", false);
    });
    source.addEventListener("message", (event) => handleTopPreviewSocketMessage(event, source, virtualId));
    source.addEventListener("error", () => {
      if (state.topPreviewSocket === source) {
        setTopPreviewStatus(state.topPreviewLastFrameAt ? "Stream reconnecting" : "Stream unavailable", true);
      }
    });
  } catch (error) {
    setTopPreviewStatus("Stream unavailable", true);
  }
}

function closeTopPreviewStream(clearKey = true) {
  if (state.topPreviewFallbackTimer) {
    clearTimeout(state.topPreviewFallbackTimer);
    state.topPreviewFallbackTimer = null;
  }
  if (state.topPreviewReconnectTimer) {
    clearTimeout(state.topPreviewReconnectTimer);
    state.topPreviewReconnectTimer = null;
  }
  const socket = state.topPreviewSocket;
  state.topPreviewSocket = null;
  state.topPreviewLastFrameAt = 0;
  if (clearKey) state.topPreviewStreamKey = "";
  if (socket && typeof socket.close === "function") {
    socket.close();
  }
}

function handleTopPreviewSocketMessage(event, socket, virtualId) {
  if (state.topPreviewSocket !== socket) return;
  let message = null;
  try {
    message = JSON.parse(event.data);
  } catch (error) {
    return;
  }
  if (message && message.success === false) {
    setTopPreviewStatus("Stream error", true);
    return;
  }
  if (message && message.stream_error) {
    setTopPreviewStatus("Stream error", true);
    return;
  }
  if (
    !message ||
    message.type !== "event" ||
    message.event_type !== "visualisation_update" ||
    message.vis_id !== virtualId
  ) {
    return;
  }
  drawTopPreviewFrame(message);
}

function drawTopPreviewFrame(message) {
  const visual = els.topPreviewVisual;
  const canvas = els.topPreviewCanvas;
  if (!visual || !canvas) return;
  const frame = normalizeLedFxPixels(message.pixels, message.shape);
  if (!frame.pixels.length) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = frame.cols;
  canvas.height = frame.rows;
  const image = ctx.createImageData(frame.cols, frame.rows);
  const pixelTotal = frame.rows * frame.cols;
  for (let index = 0; index < pixelTotal; index += 1) {
    const pixel = frame.pixels[index] || {r: 0, g: 0, b: 0};
    const offset = index * 4;
    image.data[offset] = clampChannel(pixel.r);
    image.data[offset + 1] = clampChannel(pixel.g);
    image.data[offset + 2] = clampChannel(pixel.b);
    image.data[offset + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  state.topPreviewLastFrameAt = Date.now();
  visual.style.background = "#020304";
  visual.classList.add("has-live");
  visual.classList.remove("is-idle");
  setTopPreviewStatus("Live stream", false);
  const pixelCount = els.topPreviewPixelCount;
  if (pixelCount) {
    pixelCount.textContent = `${pixelTotal} px | ${frame.rows}x${frame.cols} | official stream`;
  }
}

function normalizeLedFxPixels(rawPixels, shape) {
  const rows = Math.max(1, Number(Array.isArray(shape) ? shape[0] : 1) || 1);
  let cols = Math.max(1, Number(Array.isArray(shape) ? shape[1] : 0) || 0);
  let pixels = [];
  if (typeof rawPixels === "string") {
    pixels = pixelsFromBase64(rawPixels);
  } else if (Array.isArray(rawPixels)) {
    pixels = pixelsFromArray(rawPixels);
  }
  if (!cols) {
    cols = Math.max(1, Math.ceil(pixels.length / rows));
  }
  return {rows, cols, pixels};
}

function pixelsFromBase64(value) {
  try {
    const binary = atob(value);
    const pixels = [];
    for (let index = 0; index < binary.length; index += 3) {
      pixels.push({
        r: binary.charCodeAt(index) || 0,
        g: binary.charCodeAt(index + 1) || 0,
        b: binary.charCodeAt(index + 2) || 0,
      });
    }
    return pixels;
  } catch (error) {
    return [];
  }
}

function pixelsFromArray(value) {
  if (!value.length) return [];
  if (value.length === 3 && value.every((channel) => Array.isArray(channel))) {
    const length = Math.max(value[0].length, value[1].length, value[2].length);
    return Array.from({length}, (_, index) => ({
      r: value[0][index] || 0,
      g: value[1][index] || 0,
      b: value[2][index] || 0,
    }));
  }
  if (typeof value[0] === "number") {
    const pixels = [];
    for (let index = 0; index < value.length; index += 3) {
      pixels.push({r: value[index] || 0, g: value[index + 1] || 0, b: value[index + 2] || 0});
    }
    return pixels;
  }
  return value.map((pixel) => {
    if (Array.isArray(pixel)) {
      return {r: pixel[0] || 0, g: pixel[1] || 0, b: pixel[2] || 0};
    }
    return {
      r: pixel && Number(pixel.r) || 0,
      g: pixel && Number(pixel.g) || 0,
      b: pixel && Number(pixel.b) || 0,
    };
  });
}

function clearTopPreviewCanvas() {
  const canvas = els.topPreviewCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function scheduleTopPreviewFallback(virtual) {
  if (state.topPreviewFallbackTimer) {
    clearTimeout(state.topPreviewFallbackTimer);
  }
  state.topPreviewFallbackTimer = setTimeout(() => {
    const stale = !state.topPreviewLastFrameAt || Date.now() - state.topPreviewLastFrameAt > 2200;
    if (stale && virtual && virtual.active) {
      setTopPreviewStatus("Config fallback", true);
      if (els.topPreviewPixelCount) {
        els.topPreviewPixelCount.textContent = `${virtual.pixel_count || 0} px | stream pending`;
      }
    }
  }, 2400);
}

function setTopPreviewStatus(label, muted) {
  const status = els.topPreviewStatus;
  if (!status) return;
  status.textContent = label;
  status.classList.toggle("is-muted", Boolean(muted));
}

function previewStreamUrlForDevice(virtualId) {
  return virtualId ? `/api/preview-stream?vis_id=${encodeURIComponent(virtualId)}` : "";
}

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
}

function previewBackgroundFromConfig(effectType, config) {
  if (!config || typeof config !== "object") {
    return "linear-gradient(90deg, #000000, #27313a)";
  }
  const gradientEntry = Object.entries(config).find(([key, value]) => {
    return (
      typeof value === "string" &&
      value.includes("linear-gradient") &&
      key.toLowerCase() !== "background_color"
    );
  });
  const colors = previewColorsFromConfig(config, gradientEntry && gradientEntry[1]);
  const kind = topPreviewEffectKind(effectType, config);
  if (kind === "meter") return meterPreviewBackground(colors);
  if (kind === "strobe") return strobePreviewBackground(colors);
  if (gradientEntry) return gradientEntry[1];
  if (colors.length >= 2) return `linear-gradient(90deg, ${colors.slice(0, 8).join(", ")})`;
  if (colors.length === 1) return `linear-gradient(90deg, #000000, ${colors[0]}, ${colors[0]})`;
  return "linear-gradient(90deg, #000000, #17232b, #46505a)";
}

function previewColorsFromConfig(config, gradient = "") {
  const gradientColors = String(gradient || "").match(/#[0-9a-fA-F]{6}/g) || [];
  const colorEntries = Object.entries(config).filter(([, value]) => (
    typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)
  ));
  const primaryColors = colorEntries
    .filter(([key]) => key.toLowerCase() !== "background_color")
    .map(([, value]) => value);
  const colors = gradientColors.length ? gradientColors : primaryColors.length ? primaryColors : colorEntries.map(([, value]) => value);
  return colors.length ? colors : ["#25c7d9", "#a6e65c", "#f0b84e"];
}

function topPreviewEffectKind(effectType, config) {
  const text = `${effectType || ""} ${Object.keys(config || {}).join(" ")}`.toLowerCase();
  if (/strobe|flash|blink/.test(text)) return "strobe";
  if (/equalizer|bar|meter|spectrum|bands/.test(text)) return "meter";
  return "gradient";
}

function meterPreviewBackground(colors) {
  const low = colors[1] || colors[0] || "#25c7d9";
  const mid = colors[Math.floor(colors.length / 2)] || low;
  const high = colors[colors.length - 1] || mid;
  return [
    "linear-gradient(90deg",
    "#020304 0%",
    "#020304 13%",
    `${low} 13.3%`,
    `${low} 16.5%`,
    "#020304 16.8%",
    "#020304 39%",
    `${mid} 39.3%`,
    `${mid} 42.8%`,
    "#020304 43.2%",
    "#020304 63%",
    `${high} 63.3%`,
    `${high} 67%`,
    "#020304 67.4%",
    "#020304 100%)",
  ].join(", ");
}

function strobePreviewBackground(colors) {
  const accent = colors[colors.length - 1] || "#ffffff";
  return `linear-gradient(90deg, #000000 0%, #000000 46%, ${accent} 46.2%, ${accent} 53.8%, #000000 54%, #000000 100%)`;
}

async function loadLedFxLibrary(toastOnSuccess = true) {
  try {
    const data = await api("/api/ledfx-library");
    state.ledfxLibrary = {
      scenes: data.scenes || [],
      playlists: data.playlists || [],
      playlist_state: data.playlist_state || {},
    };
    const available = new Set(state.ledfxLibrary.scenes.map((scene) => scene.id));
    state.playlistSceneIds = new Set(
      [...state.playlistSceneIds].filter((sceneId) => available.has(sceneId)),
    );
    state.selectedLibrarySceneIds = new Set(
      [...state.selectedLibrarySceneIds].filter((sceneId) => available.has(sceneId)),
    );
    reconcileActiveLibraryScene();
    if (state.editingPublishedSceneId && !available.has(state.editingPublishedSceneId)) {
      state.editingPublishedSceneId = null;
    }
    renderLedFxLibrary();
    if (toastOnSuccess) showToast("LedFx library refreshed.");
  } catch (error) {
    setConnectionStatus("offline", "Offline");
    els.librarySummary.textContent = `Library unavailable: ${error.message}`;
    showToast(error.message);
  }
}

function renderLedFxLibrary() {
  renderLibrarySummary();
  renderLedFxScenes();
  renderPlaylistScenePicker();
  renderPlaylists();
  renderMidiMapper();
  renderBulkSceneSummary();
  renderPlaylistEditStatus();
  const isEditingPlaylist = Boolean(state.editingPlaylistId);
  els.savePlaylistButton.textContent = isEditingPlaylist ? "Save Changes" : "Save Playlist";
}

function renderPlaylistEditStatus() {
  if (!els.playlistEditStatus) return;
  if (!state.editingPlaylistId) {
    els.playlistEditStatus.textContent = "New playlist draft";
    return;
  }
  const playlist = state.ledfxLibrary.playlists.find((item) => item.id === state.editingPlaylistId);
  els.playlistEditStatus.textContent = playlist
    ? `Editing: ${playlist.name}`
    : "Editing selected playlist";
}

function renderLibrarySummary() {
  const library = state.ledfxLibrary;
  const active = library.playlist_state && library.playlist_state.active_playlist;
  const suffix = active ? ` | active playlist: ${active}` : "";
  const shown = filteredLibraryScenes().length;
  const filterSuffix = shown === library.scenes.length ? "" : ` | ${shown} shown`;
  els.librarySummary.textContent =
    `${library.scenes.length} scenes${filterSuffix} | ${library.playlists.length} playlists${suffix}`;
}

function renderLedFxScenes() {
  els.ledfxSceneList.innerHTML = "";
  if (!state.ledfxLibrary.scenes.length) {
    els.ledfxSceneList.append(emptyNote("No LedFx scenes found."));
    return;
  }
  const scenes = filteredLibraryScenes();
  if (!scenes.length) {
    els.ledfxSceneList.append(emptyNote("No scenes match the tag search."));
    return;
  }
  scenes.forEach((scene) => {
    const active = isLibrarySceneActive(scene);
    const row = document.createElement("article");
    row.className = "library-row";
    if (active) row.classList.add("is-active");
    if (state.selectedLibrarySceneIds.has(scene.id)) row.classList.add("is-selected");

    const select = document.createElement("label");
    select.className = "library-select";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedLibrarySceneIds.has(scene.id);
    checkbox.setAttribute("aria-label", `Select ${scene.name}`);
    checkbox.addEventListener("click", (event) => event.stopPropagation());
    checkbox.addEventListener("change", (event) => {
      event.stopPropagation();
      toggleLibrarySceneSelection(scene.id, checkbox.checked);
    });
    select.append(checkbox);

    const main = document.createElement("div");
    main.className = "library-main";
    const nameLine = document.createElement("div");
    nameLine.className = "library-scene-title";
    const title = document.createElement("strong");
    title.textContent = scene.name;
    const preview = scenePalettePreview(scene, {fallback: false, compact: true});
    nameLine.append(title);
    if (preview) nameLine.append(preview);

    const meta = document.createElement("div");
    meta.className = "meta";
    if (scene.is_scene_factory) meta.append(pill("LSF", "keep"));
    if (active) meta.append(pill("ACTIVE", "hot"));
    if (scene.has_bad_tags) meta.append(pill("BAD TAGS", "danger-pill"));
    sceneTags(scene).forEach((tag) => {
      meta.append(pill(tag, tag.startsWith("palette-") ? "palette-pill" : "tag-pill"));
    });
    meta.append(
      pill(`${scene.virtual_count} devices`),
      pill(scene.effect_types.length ? scene.effect_types.join(", ") : "no effects"),
    );
    main.append(nameLine, meta);

    const actions = document.createElement("div");
    actions.className = "library-row-actions";
    actions.append(
      actionButton("Activate", () => activateLibraryScene(scene.id), false),
      actionButton("Edit", () => openPublishedSceneEditor(scene.id), false),
      actionButton("Delete", () => deleteLibraryScene(scene.id, scene.name), false, "danger"),
    );

    row.append(select, main, actions);
    els.ledfxSceneList.append(row);
  });
}

function toggleLibrarySceneSelection(sceneId, selected) {
  if (selected) {
    state.selectedLibrarySceneIds.add(sceneId);
  } else {
    state.selectedLibrarySceneIds.delete(sceneId);
  }
  renderLedFxLibrary();
}

function renderBulkSceneSummary() {
  const count = state.selectedLibrarySceneIds.size;
  const shown = filteredLibraryScenes().length;
  els.bulkSceneSummary.textContent = `${count} selected | ${shown} shown`;
  els.tagSelectedScenesButton.disabled = count === 0;
  els.deleteSelectedScenesButton.disabled = count === 0;
  els.clearLibrarySelectionButton.disabled = count === 0;
}

function reconcileActiveLibraryScene() {
  const scenes = state.ledfxLibrary.scenes || [];
  const available = new Set(scenes.map((scene) => scene.id));
  const activeIds = scenes.filter((scene) => scene.active).map((scene) => scene.id);
  if (!available.has(state.activeLibrarySceneId)) {
    state.activeLibrarySceneId = activeIds[0] || null;
    return;
  }
  if (activeIds.length === 1 && activeIds[0] !== state.activeLibrarySceneId) {
    state.activeLibrarySceneId = activeIds[0];
    return;
  }
  if (!activeIds.length) {
    state.activeLibrarySceneId = null;
  }
}

function isLibrarySceneActive(scene) {
  if (state.activeLibrarySceneId) return scene.id === state.activeLibrarySceneId;
  return Boolean(scene.active);
}

function selectAllLibraryScenes() {
  state.selectedLibrarySceneIds = new Set(state.ledfxLibrary.scenes.map((scene) => scene.id));
  renderLedFxLibrary();
}

function selectFilteredLibraryScenes() {
  state.selectedLibrarySceneIds = new Set(filteredLibraryScenes().map((scene) => scene.id));
  renderLedFxLibrary();
}

function clearLibrarySelection() {
  state.selectedLibrarySceneIds = new Set();
  renderLedFxLibrary();
}

async function tagSelectedLibraryScenes() {
  const sceneIds = [...state.selectedLibrarySceneIds];
  const tags = els.bulkTagInput.value.trim();
  if (!sceneIds.length) return;
  if (!tags) {
    showToast("Add at least one tag.");
    return;
  }
  els.tagSelectedScenesButton.disabled = true;
  try {
    const data = await api("/api/ledfx-scenes/batch-tag", {
      method: "POST",
      body: JSON.stringify({scene_ids: sceneIds, tags}),
    });
    await loadLedFxLibrary(false);
    const tagged = (data.tagged || []).length;
    const errors = (data.errors || []).length;
    showToast(`Tagged ${tagged} scenes${errors ? `, ${errors} failed` : ""}.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    renderBulkSceneSummary();
  }
}

async function deleteSelectedLibraryScenes() {
  const sceneIds = [...state.selectedLibrarySceneIds];
  if (!sceneIds.length) return;
  const ok = window.confirm(`Delete ${sceneIds.length} selected LedFx scenes?`);
  if (!ok) return;
  els.deleteSelectedScenesButton.disabled = true;
  try {
    const data = await api("/api/ledfx-scenes/batch-delete", {
      method: "POST",
      body: JSON.stringify({scene_ids: sceneIds}),
    });
    const deletedIds = new Set((data.deleted || []).map((item) => item.id));
    state.playlistSceneIds = new Set([...state.playlistSceneIds].filter((sceneId) => !deletedIds.has(sceneId)));
    state.selectedLibrarySceneIds = new Set([...state.selectedLibrarySceneIds].filter((sceneId) => !deletedIds.has(sceneId)));
    await loadLedFxLibrary(false);
    const deleted = (data.deleted || []).length;
    const errors = (data.errors || []).length;
    showToast(`Deleted ${deleted} scenes${errors ? `, ${errors} failed` : ""}.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    renderBulkSceneSummary();
  }
}

function renderPlaylistScenePicker() {
  els.playlistScenePicker.innerHTML = "";
  const scenes = filteredPlaylistScenes();
  if (!state.ledfxLibrary.scenes.length) {
    els.playlistScenePicker.append(emptyNote("No scenes available for playlists."));
    return;
  }
  if (!scenes.length) {
    els.playlistScenePicker.append(emptyNote("No scenes match the tag filter."));
    return;
  }
  scenes.forEach((scene) => {
    const item = document.createElement("label");
    item.className = "playlist-scene-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.playlistSceneIds.has(scene.id);
    input.addEventListener("change", () => {
      if (input.checked) {
        state.playlistSceneIds.add(scene.id);
      } else {
        state.playlistSceneIds.delete(scene.id);
      }
      renderLibrarySummary();
    });
    const copy = document.createElement("span");
    copy.className = "playlist-scene-copy";
    const text = document.createElement("strong");
    text.textContent = scene.name;
    const preview = scenePalettePreview(scene, {fallback: false, compact: true});
    const tags = document.createElement("small");
    tags.textContent = sceneTags(scene).join(", ") || (scene.effect_types || []).join(", ");
    copy.append(text);
    if (preview) copy.append(preview);
    if (tags.textContent) copy.append(tags);
    item.append(input, copy);
    els.playlistScenePicker.append(item);
  });
}

function filteredLibraryScenes() {
  const filters = parseSearchInput(els.libraryTagFilterInput.value);
  if (!filters.length) return state.ledfxLibrary.scenes;
  return state.ledfxLibrary.scenes.filter((scene) => sceneMatchesFilters(scene, filters));
}

function filteredPlaylistScenes() {
  const filters = parseSearchInput(els.playlistTagFilterInput.value);
  if (!filters.length) return state.ledfxLibrary.scenes;
  return state.ledfxLibrary.scenes.filter((scene) => sceneMatchesFilters(scene, filters));
}

function sceneMatchesFilters(scene, filters) {
  const haystack = [
    scene.name,
    scene.id,
    scene.tags,
    ...sceneTags(scene),
    ...(scene.effect_types || []),
  ]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase());
  return filters.every((filter) => haystack.some((item) => item.includes(filter)));
}

function sceneTags(scene) {
  const tags = Array.isArray(scene.tags_list) && scene.tags_list.length
    ? [...scene.tags_list]
    : parseTagInput(scene.tags);
  if (scene.is_scene_factory && !tags.includes("scene-factory")) {
    tags.unshift("scene-factory");
  }
  return tags;
}

function renderPlaylists() {
  els.playlistList.innerHTML = "";
  if (!state.ledfxLibrary.playlists.length) {
    els.playlistList.append(emptyNote("No playlists yet."));
    return;
  }
  const activeId = state.ledfxLibrary.playlist_state.active_playlist;
  state.ledfxLibrary.playlists.forEach((playlist) => {
    const row = document.createElement("article");
    row.className = "library-row playlist-row";
    if (playlist.id === activeId) row.classList.add("is-active");
    if (playlist.id === state.editingPlaylistId) row.classList.add("is-editing");

    const main = document.createElement("div");
    main.className = "library-main";
    const title = document.createElement("strong");
    title.textContent = playlist.name;
    const palettes = playlistPalettePreview(playlist);
    const meta = document.createElement("div");
    meta.className = "meta";
    if (playlist.id === activeId) meta.append(pill("ACTIVE", "hot"));
    meta.append(
      pill(playlist.mode),
      pill(`${playlist.item_count} scenes`),
      pill(`${Math.round(playlist.default_duration_ms / 1000)}s`),
    );
    main.append(title);
    if (palettes) main.append(palettes);
    main.append(meta);

    const actions = document.createElement("div");
    actions.className = "library-row-actions";
    actions.append(
      actionButton("Edit", () => loadPlaylistIntoEditor(playlist)),
      actionButton("Start", () => controlPlaylist("start", playlist.id, playlist.mode)),
      actionButton("Delete", () => deletePlaylist(playlist.id, playlist.name), false, "danger"),
    );
    row.append(main, actions);
    els.playlistList.append(row);
  });
}

function emptyNote(text) {
  const note = document.createElement("p");
  note.className = "empty-note";
  note.textContent = text;
  return note;
}

async function activateLibraryScene(sceneId) {
  try {
    await api("/api/ledfx-scenes/activate", {
      method: "POST",
      body: JSON.stringify({scene_id: sceneId}),
    });
    state.activeLibrarySceneId = sceneId;
    await loadLedFxLibrary(false);
    showToast("Scene activated in LedFx.");
  } catch (error) {
    showToast(error.message);
  }
}

async function renameLibraryScene(sceneId, name) {
  const cleanName = name.trim();
  if (!cleanName) {
    showToast("Scene name is required.");
    return;
  }
  try {
    await api("/api/ledfx-scenes/rename", {
      method: "POST",
      body: JSON.stringify({scene_id: sceneId, name: cleanName}),
    });
    await loadLedFxLibrary(false);
    showToast("Scene renamed.");
  } catch (error) {
    showToast(error.message);
  }
}

function openPublishedSceneEditor(sceneId) {
  state.editingPreset = null;
  state.editingPublishedSceneId = sceneId;
  renderPresetEditor();
  renderPublishedSceneEditorModal();
}

function renderPublishedSceneEditorModal() {
  if (!els.sceneEditorHost) return;
  if (!state.editingPublishedSceneId) return;
  els.sceneEditorHost.innerHTML = "";
  els.sceneEditorHost.hidden = true;
  const scene = state.ledfxLibrary.scenes.find((item) => item.id === state.editingPublishedSceneId);
  if (!scene) {
    state.editingPublishedSceneId = null;
    return;
  }
  els.styleEditor.hidden = true;
  els.paletteEditor.hidden = true;
  if (els.presetEditor) els.presetEditor.hidden = true;
  state.editingSceneId = null;
  els.sceneEditorHost.hidden = false;
  els.sceneEditorHost.append(renderPublishedSceneEditor(scene));
  openModal("Edit Published Scene");
}

function closePublishedSceneEditor(renderLibrary = true) {
  state.editingPublishedSceneId = null;
  els.sceneEditorHost.innerHTML = "";
  els.sceneEditorHost.hidden = true;
  hideModal();
  if (renderLibrary) renderLedFxLibrary();
}

function renderPublishedSceneEditor(scene) {
  const editor = document.createElement("div");
  editor.className = "scene-editor published-scene-editor";
  editor.dataset.publishedSceneId = scene.id;

  const head = document.createElement("div");
  head.className = "scene-editor-head";
  const title = document.createElement("strong");
  title.textContent = "LedFx scene";
  const note = document.createElement("span");
  note.textContent = scene.id;
  head.append(title, note);

  const preview = scenePalettePreview(scene, {fallback: false});
  const details = document.createElement("div");
  details.className = "published-scene-details";
  if (preview) details.append(preview);
  details.append(
    pill(`${scene.virtual_count} devices`),
    pill(scene.effect_types.length ? scene.effect_types.join(", ") : "no effects"),
  );
  if (isLibrarySceneActive(scene)) details.append(pill("ACTIVE", "hot"));

  const nameLabel = document.createElement("label");
  nameLabel.className = "scene-name-field";
  nameLabel.append(fieldTitle("Scene name", "Saved to LedFx when you click Save Changes."));
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.maxLength = 48;
  nameInput.value = scene.name;
  nameInput.dataset.publishedSceneName = "true";
  nameLabel.append(nameInput);

  const tagsLabel = document.createElement("label");
  tagsLabel.className = "scene-name-field";
  tagsLabel.append(fieldTitle("Tags", "Comma-separated tags used by Workshop search and playlist filters."));
  const tagsInput = document.createElement("textarea");
  tagsInput.maxLength = 160;
  tagsInput.rows = 3;
  tagsInput.value = sceneTags(scene).join(", ");
  tagsInput.dataset.publishedSceneTags = "true";
  tagsLabel.append(tagsInput);

  const assignments = Array.isArray(scene.assignments) ? scene.assignments : [];
  const paramsWrap = document.createElement("div");
  paramsWrap.className = "published-scene-params";
  if (!assignments.length) {
    paramsWrap.append(emptyNote("This LedFx scene has no editable effect parameters."));
  } else {
    paramsWrap.append(sceneDeviceTable(assignments), sceneParameterSections(assignments));
  }

  const actions = document.createElement("div");
  actions.className = "scene-editor-actions";
  actions.append(
    actionButton("Save Changes", () => savePublishedScene(scene.id)),
    actionButton("Activate", () => activatePublishedSceneFromEditor(scene.id)),
    actionButton("Delete", () => deletePublishedSceneFromEditor(scene.id, scene.name), false, "danger"),
    actionButton("Close", () => closePublishedSceneEditor()),
  );

  editor.append(head, details, nameLabel, tagsLabel, paramsWrap, actions);
  return editor;
}

function collectPublishedSceneEditorPayload(sceneId) {
  const editor = [...els.sceneEditorHost.querySelectorAll(".published-scene-editor")].find(
    (node) => node.dataset.publishedSceneId === sceneId,
  );
  if (!editor) throw new Error("Scene editor is not open.");
  const scene = state.ledfxLibrary.scenes.find((item) => item.id === sceneId);
  if (!scene) throw new Error("Scene is no longer available.");
  const nameInput = editor.querySelector("[data-published-scene-name]");
  const tagsInput = editor.querySelector("[data-published-scene-tags]");
  const assignments = (scene.assignments || []).map((assignment, index) => ({
    virtual_id: assignment.virtual_id,
    effect_type: editor.querySelector(`[data-assignment-effect][data-assignment-index="${index}"]`)?.value || assignment.effect_type || "",
    ...assignmentPresetPayload(editor, index),
    target_virtual_id: assignment.virtual_id,
    action: editor.querySelector(`[data-assignment-action][data-assignment-index="${index}"]`)?.value || assignment.action || "activate",
    config: {},
  }));
  editor.querySelectorAll("[data-param-key]").forEach((input) => {
    const index = Number(input.dataset.assignmentIndex);
    if (!assignments[index]) return;
    assignments[index].config[input.dataset.paramKey] = parseParamInput(input);
  });
  assertUniqueAssignmentTargets(assignments);
  return {
    scene_id: sceneId,
    name: nameInput.value.trim() || scene.name,
    tags: tagsInput.value,
    assignments,
  };
}

async function savePublishedScene(sceneId) {
  try {
    const payload = collectPublishedSceneEditorPayload(sceneId);
    await api("/api/ledfx-scenes/update", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await loadLedFxLibrary(false);
    closePublishedSceneEditor(false);
    showToast("LedFx scene saved.");
  } catch (error) {
    showToast(error.message);
  }
}

async function activatePublishedSceneFromEditor(sceneId) {
  await activateLibraryScene(sceneId);
  state.editingPublishedSceneId = sceneId;
  renderPublishedSceneEditorModal();
}

async function deletePublishedSceneFromEditor(sceneId, name) {
  const deleted = await deleteLibraryScene(sceneId, name);
  if (deleted) closePublishedSceneEditor(false);
}

async function deleteLibraryScene(sceneId, name) {
  const ok = window.confirm(`Delete LedFx scene "${name}"?`);
  if (!ok) return false;
  try {
    await api("/api/ledfx-scenes/delete", {
      method: "POST",
      body: JSON.stringify({scene_id: sceneId}),
    });
    state.playlistSceneIds.delete(sceneId);
    await loadLedFxLibrary(false);
    showToast("Scene deleted from LedFx.");
    return true;
  } catch (error) {
    showToast(error.message);
    return false;
  }
}

async function shortenLsfNames() {
  const ok = window.confirm("Shorten names of existing Scene Factory scenes in LedFx?");
  if (!ok) return;
  els.shortenLsfButton.disabled = true;
  els.shortenLsfButton.textContent = "Shortening...";
  try {
    const data = await api("/api/ledfx-scenes/shorten-lsf", {method: "POST", body: "{}"});
    await loadLedFxLibrary(false);
    const renamed = (data.renamed || []).length;
    const errors = (data.errors || []).length;
    showToast(`Renamed ${renamed} LSF scenes${errors ? `, ${errors} failed` : ""}.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    els.shortenLsfButton.disabled = false;
    els.shortenLsfButton.textContent = "Shorten LSF Names";
  }
}

function newPlaylist() {
  state.editingPlaylistId = null;
  els.playlistNameInput.value = "Scene Factory Set";
  els.playlistModeSelect.value = "sequence";
  els.playlistDurationInput.value = "30";
  els.playlistTagFilterInput.value = "";
  state.playlistSceneIds = new Set();
  openPlaylistEditor("New Playlist");
}

function closePlaylistEdit() {
  state.editingPlaylistId = null;
  state.playlistSceneIds = new Set();
  if (els.playlistEditor) els.playlistEditor.hidden = true;
  hideModal();
  renderLedFxLibrary();
  showToast("Playlist edit closed.");
}

function openPlaylistEditor(title) {
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  els.styleEditor.hidden = true;
  els.paletteEditor.hidden = true;
  if (els.presetEditor) els.presetEditor.hidden = true;
  els.sceneEditorHost.innerHTML = "";
  els.sceneEditorHost.hidden = true;
  if (els.playlistEditor) els.playlistEditor.hidden = false;
  renderPlaylistScenePicker();
  renderPlaylistEditStatus();
  const isEditingPlaylist = Boolean(state.editingPlaylistId);
  els.savePlaylistButton.textContent = isEditingPlaylist ? "Save Changes" : "Save Playlist";
  openModal(title);
}

function selectLsfScenes() {
  state.playlistSceneIds = new Set(
    state.ledfxLibrary.scenes
      .filter((scene) => scene.is_scene_factory)
      .map((scene) => scene.id),
  );
  renderLedFxLibrary();
}

function selectFilteredScenes() {
  state.playlistSceneIds = new Set(filteredPlaylistScenes().map((scene) => scene.id));
  renderLedFxLibrary();
}

function clearPlaylistScenes() {
  state.playlistSceneIds = new Set();
  renderLedFxLibrary();
}

function loadPlaylistIntoEditor(playlist) {
  state.editingPlaylistId = playlist.id;
  els.playlistNameInput.value = playlist.name;
  els.playlistModeSelect.value = playlist.mode || "sequence";
  els.playlistDurationInput.value = formatSeconds((playlist.default_duration_ms || 30000) / 1000);
  state.playlistSceneIds = new Set((playlist.items || []).map((item) => item.scene_id));
  openPlaylistEditor("Edit Playlist");
}

function playlistPayload() {
  const durationSeconds = Math.max(0.5, Number(els.playlistDurationInput.value) || 30);
  const duration = Math.round(durationSeconds * 1000);
  const selected = new Set(state.playlistSceneIds);
  const items = state.ledfxLibrary.scenes
    .filter((scene) => selected.has(scene.id))
    .map((scene) => ({scene_id: scene.id, duration_seconds: durationSeconds, duration_ms: duration}));
  return {
    playlist_id: state.editingPlaylistId,
    name: els.playlistNameInput.value.trim() || "Scene Factory Set",
    mode: els.playlistModeSelect.value,
    default_duration_seconds: durationSeconds,
    default_duration_ms: duration,
    items,
    tags: ["scene-factory"],
    image: "Wallpaper",
  };
}

function formatSeconds(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

async function savePlaylist() {
  const payload = playlistPayload();
  if (!payload.items.length) {
    showToast("Select at least one scene for the playlist.");
    return;
  }
  els.savePlaylistButton.disabled = true;
  els.savePlaylistButton.textContent = "Saving...";
  try {
    const data = await api("/api/playlists/save", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    state.editingPlaylistId = (data.playlist && data.playlist.id) || state.editingPlaylistId;
    await loadLedFxLibrary(false);
    if (els.playlistEditor) els.playlistEditor.hidden = true;
    hideModal();
    state.editingPlaylistId = null;
    showToast("Playlist saved.");
  } catch (error) {
    showToast(error.message);
  } finally {
    els.savePlaylistButton.disabled = false;
    renderLedFxLibrary();
  }
}

async function deletePlaylist(playlistId, name) {
  const ok = window.confirm(`Delete playlist "${name}"?`);
  if (!ok) return;
  try {
    await api("/api/playlists/delete", {
      method: "POST",
      body: JSON.stringify({playlist_id: playlistId}),
    });
    if (state.editingPlaylistId === playlistId) {
      state.editingPlaylistId = null;
    }
    await loadLedFxLibrary(false);
    showToast("Playlist deleted.");
  } catch (error) {
    showToast(error.message);
  }
}

async function controlPlaylist(action, playlistId = null, mode = null) {
  try {
    await api("/api/playlists/control", {
      method: "POST",
      body: JSON.stringify({action, playlist_id: playlistId, mode}),
    });
    await loadLedFxLibrary(false);
    showToast(`Playlist ${action}.`);
  } catch (error) {
    showToast(error.message);
  }
}

function loadMidiMappings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MIDI_MAPPINGS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.message && item.action) : [];
  } catch (error) {
    return [];
  }
}

function saveMidiMappings() {
  localStorage.setItem(MIDI_MAPPINGS_KEY, JSON.stringify(state.midi.mappings));
}

function renderMidiMapper() {
  if (!els.midiMapperView) return;
  renderMidiInputs();
  renderMidiTargetPlaylists();
  renderMidiPlaylistMapList();
  renderMidiMappingList();
}

async function connectMidi() {
  if (!navigator.requestMIDIAccess) {
    els.midiStatus.textContent = "Web MIDI is not available in this browser.";
    showToast("Web MIDI is not available in this browser.");
    return;
  }
  els.midiConnectButton.disabled = true;
  els.midiConnectButton.textContent = "Connecting...";
  try {
    state.midi.access = await navigator.requestMIDIAccess({sysex: false});
    state.midi.access.onstatechange = refreshMidiInputs;
    refreshMidiInputs();
    showToast("MIDI connected.");
  } catch (error) {
    els.midiStatus.textContent = `MIDI unavailable: ${error.message}`;
    showToast(error.message);
  } finally {
    els.midiConnectButton.disabled = false;
    els.midiConnectButton.textContent = "Connect MIDI";
  }
}

function refreshMidiInputs() {
  const access = state.midi.access;
  state.midi.inputs = access ? [...access.inputs.values()] : [];
  if (!state.midi.inputs.some((input) => input.id === state.midi.selectedInputId)) {
    state.midi.selectedInputId = state.midi.inputs[0] ? state.midi.inputs[0].id : "";
  }
  selectMidiInput(state.midi.selectedInputId);
  renderMidiMapper();
}

function renderMidiInputs() {
  if (!els.midiInputSelect) return;
  const current = state.midi.selectedInputId || els.midiInputSelect.value;
  els.midiInputSelect.innerHTML = "";
  if (!state.midi.inputs.length) {
    els.midiInputSelect.append(option("No MIDI input connected", ""));
    els.midiInputSelect.disabled = true;
  } else {
    state.midi.inputs.forEach((input) => {
      els.midiInputSelect.append(option(input.name || input.id, input.id));
    });
    els.midiInputSelect.disabled = false;
    els.midiInputSelect.value = state.midi.inputs.some((input) => input.id === current)
      ? current
      : state.midi.inputs[0].id;
  }
  const selected = state.midi.inputs.find((input) => input.id === state.midi.selectedInputId);
  els.midiStatus.textContent = selected
    ? `Listening to ${selected.name || selected.id}${state.midi.learn ? " - press a MIDI control to learn." : "."}`
    : "MIDI not connected.";
}

function selectMidiInput(inputId) {
  state.midi.selectedInputId = inputId || "";
  localStorage.setItem("lsf.midi_input", state.midi.selectedInputId);
  state.midi.inputs.forEach((input) => {
    input.onmidimessage = input.id === state.midi.selectedInputId ? handleMidiMessage : null;
  });
}

function renderMidiTargetPlaylists() {
  if (!els.midiTargetPlaylistSelect) return;
  const current = els.midiTargetPlaylistSelect.value || "active";
  els.midiTargetPlaylistSelect.innerHTML = "";
  els.midiTargetPlaylistSelect.append(option("Active playlist", "active"));
  state.ledfxLibrary.playlists.forEach((playlist) => {
    els.midiTargetPlaylistSelect.append(option(playlist.name, playlist.id));
  });
  els.midiTargetPlaylistSelect.value = [...els.midiTargetPlaylistSelect.options].some((item) => item.value === current)
    ? current
    : "active";
}

function renderMidiPlaylistMapList() {
  if (!els.midiPlaylistMapList) return;
  els.midiPlaylistMapList.innerHTML = "";
  els.midiPlaylistSummary.textContent = `${state.ledfxLibrary.playlists.length} playlists`;
  if (!state.ledfxLibrary.playlists.length) {
    els.midiPlaylistMapList.append(emptyNote("No LedFx playlists found."));
    return;
  }
  state.ledfxLibrary.playlists.forEach((playlist) => {
    const row = document.createElement("article");
    row.className = "midi-playlist-row";
    const main = document.createElement("div");
    main.className = "library-main";
    const title = document.createElement("strong");
    title.textContent = playlist.name;
    const palettes = playlistPalettePreview(playlist);
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.append(pill(playlist.mode), pill(`${playlist.item_count} scenes`));
    main.append(title);
    if (palettes) main.append(palettes);
    main.append(meta);

    const actions = document.createElement("div");
    actions.className = "midi-row-actions";
    actions.append(
      actionButton("Start", () => controlPlaylist("start", playlist.id, playlist.mode)),
      actionButton("Learn Start", () => startMidiLearn({action: "start", playlistId: playlist.id, playlistName: playlist.name, mode: playlist.mode})),
    );
    row.append(main, actions);
    els.midiPlaylistMapList.append(row);
  });
}

function renderMidiMappingList() {
  if (!els.midiMappingList) return;
  els.midiMappingList.innerHTML = "";
  els.midiClearMappingsButton.disabled = state.midi.mappings.length === 0;
  if (!state.midi.mappings.length) {
    els.midiMappingList.append(emptyNote("No MIDI mappings yet. Click Learn and press a MIDI control."));
    return;
  }
  state.midi.mappings.forEach((mapping) => {
    const row = document.createElement("article");
    row.className = "midi-mapping-row";
    const main = document.createElement("div");
    main.className = "library-main";
    const title = document.createElement("strong");
    title.textContent = midiMappingTitle(mapping);
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.append(
      pill(midiMessageLabel(mapping.message)),
      pill(midiMappingPlaylistLabel(mapping)),
    );
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "midi-row-actions";
    actions.append(
      actionButton("Test", () => executeMidiMapping(mapping)),
      actionButton("Delete", () => deleteMidiMapping(mapping.id), false, "danger"),
    );
    row.append(main, actions);
    els.midiMappingList.append(row);
  });
}

function startMidiLearn(target) {
  if (!state.midi.selectedInputId) {
    showToast("Connect and select a MIDI input first.");
    return;
  }
  state.midi.learn = target;
  renderMidiMapper();
  showToast(`Learning ${MIDI_ACTION_LABELS[target.action] || target.action}. Press a MIDI control.`);
}

function midiTransportTarget(action) {
  return {
    action,
    playlistId: "active",
    playlistName: "Active playlist",
    mode: null,
  };
}

function handleMidiMessage(event) {
  const message = parseMidiMessage(event.data);
  if (!message) return;
  if (state.midi.learn) {
    const target = state.midi.learn;
    state.midi.learn = null;
    upsertMidiMapping({
      id: `${target.action}:${target.playlistId || "active"}:${message.type}:${message.channel}:${message.number}`,
      action: target.action,
      playlistId: target.playlistId || "active",
      playlistName: target.playlistName || "Active playlist",
      mode: target.mode || null,
      message,
    });
    renderMidiMapper();
    showToast(`Mapped ${midiMappingTitle(target)} to ${midiMessageLabel(message)}.`);
    return;
  }
  state.midi.mappings
    .filter((mapping) => midiMessagesMatch(mapping.message, message))
    .forEach((mapping) => executeMidiMapping(mapping));
}

function parseMidiMessage(data) {
  const [status, number, value = 0] = data;
  const command = status & 0xf0;
  const channel = (status & 0x0f) + 1;
  if (command === 0x90 && value > 0) return {type: "note", channel, number, value};
  if (command === 0xb0) return {type: "cc", channel, number, value};
  if (command === 0xc0) return {type: "program", channel, number, value: number};
  return null;
}

function midiMessagesMatch(left, right) {
  return left && right && left.type === right.type && left.channel === right.channel && left.number === right.number;
}

function upsertMidiMapping(mapping) {
  state.midi.mappings = state.midi.mappings.filter((item) => item.id !== mapping.id);
  state.midi.mappings.push(mapping);
  saveMidiMappings();
}

async function executeMidiMapping(mapping) {
  const key = mapping.id;
  const now = Date.now();
  if (state.midi.lastTrigger[key] && now - state.midi.lastTrigger[key] < 260) return;
  state.midi.lastTrigger[key] = now;
  const activeOnly = ["next", "prev", "stop"].includes(mapping.action);
  const playlistId = activeOnly || mapping.playlistId === "active" ? null : mapping.playlistId;
  await controlPlaylist(mapping.action, playlistId, mapping.mode);
}

function deleteMidiMapping(mappingId) {
  state.midi.mappings = state.midi.mappings.filter((mapping) => mapping.id !== mappingId);
  saveMidiMappings();
  renderMidiMapper();
}

function clearMidiMappings() {
  if (!state.midi.mappings.length) return;
  if (!window.confirm("Clear all MIDI mappings?")) return;
  state.midi.mappings = [];
  saveMidiMappings();
  renderMidiMapper();
}

function midiMappingTitle(mapping) {
  const label = MIDI_ACTION_LABELS[mapping.action] || mapping.action;
  return mapping.action === "start" ? `${label}: ${mapping.playlistName || mapping.playlistId}` : label;
}

function midiMappingPlaylistLabel(mapping) {
  return ["next", "prev", "stop"].includes(mapping.action)
    ? "Active playlist"
    : (mapping.playlistName || "Active playlist");
}

function midiMessageLabel(message) {
  if (!message) return "No MIDI message";
  const type = message.type === "cc" ? "CC" : message.type === "program" ? "Program" : "Note";
  return `${type} ${message.number} / ch ${message.channel}`;
}

function renderControls() {
  const app = state.app;
  const previousStyle = els.styleSelect.value;
  els.styleSelect.innerHTML = "";
  Object.entries(app.styles).forEach(([id, item]) => {
    els.styleSelect.append(option(item.name || id, id));
  });
  if (previousStyle && app.styles[previousStyle]) {
    els.styleSelect.value = previousStyle;
  }
  if (!els.styleSelect.value && els.styleSelect.options.length) {
    els.styleSelect.value = els.styleSelect.options[0].value;
  }

  renderPaletteControls(selectedPaletteIds());

  els.layoutSelect.innerHTML = "";
  els.layoutSelect.append(layoutOption("Auto", "auto"));
  app.layouts.forEach((layout) => {
    const layoutId = typeof layout === "string" ? layout : layout.id;
    const label = typeof layout === "string" ? layout : layout.label || layout.id;
    els.layoutSelect.append(layoutOption(label[0].toUpperCase() + label.slice(1), layoutId));
  });
  applyStyleDefaults(els.styleSelect.value);
  renderStyleDescription();
  renderLayoutDescription();

  els.sceneTypeList.innerHTML = "";
  app.scene_types.forEach((type) => {
    els.sceneTypeList.append(sceneTypeCheckbox(type));
  });

  els.virtualList.innerHTML = "";
  const defaults = new Set(app.default_virtual_ids || []);
  app.virtuals.forEach((virtual) => {
    const label = `${virtual.name} (${virtual.id})`;
    const item = checkbox("virtual", virtual.id, label, defaults.has(virtual.id));
    item.classList.add("device-option");
    els.virtualList.append(item);
  });
  renderForgeBehaviorOptions();
  generateForgeDraft();
  renderPresetLab();
}

function layoutOption(label, value) {
  return option(label, value);
}

function currentStyleId() {
  return els.styleSelect.value || Object.keys((state.app && state.app.styles) || {})[0] || "";
}

function currentStyle() {
  const styles = (state.app && state.app.styles) || {};
  return styles[currentStyleId()] || {};
}

function styleDefaults(style = currentStyle()) {
  return {...DEFAULT_STYLE_DEFAULTS, ...((style && style.defaults) || {})};
}

function applyStyleDefaults(styleId) {
  if (!state.app || !styleId || !state.app.styles[styleId]) return;
  const defaults = styleDefaults(state.app.styles[styleId]);
  els.countInput.value = String(defaults.count || DEFAULT_STYLE_DEFAULTS.count);
  setRangeValue(els.energyInput, defaults.energy);
  setRangeValue(els.variationInput, defaults.variation);
  setRangeValue(els.brightnessInput, defaults.brightness);
  setRangeValue(els.movementInput, defaults.movement);
  setRangeValue(els.audioResponseInput, defaults.audio_response);
  setRangeValue(els.densityInput, defaults.density);
  setRangeValue(els.flashInput, defaults.flash);
  if ([...els.layoutSelect.options].some((item) => item.value === defaults.layout)) {
    els.layoutSelect.value = defaults.layout;
  } else {
    els.layoutSelect.value = "auto";
  }
  renderLayoutDescription();
}

function setRangeValue(input, value) {
  const percent = Math.round(Number(value || 0) * 100);
  input.value = String(Math.max(0, Math.min(100, percent)));
  input.dispatchEvent(new Event("input"));
}

function renderStyleDescription() {
  const style = currentStyle();
  const defaults = styleDefaults(style);
  const pieces = [];
  if (style.description) pieces.push(style.description);
  pieces.push(
    `Defaults: ${Math.round(defaults.energy * 100)}% energy, ${Math.round(defaults.variation * 100)}% variation, ${Math.round(defaults.movement * 100)}% movement, ${Math.round(defaults.flash * 100)}% flash.`,
  );
  const text = pieces.join(" ");
  els.styleDescription.textContent = text;
  if (els.styleInfoButton) els.styleInfoButton.dataset.tooltip = text;
  els.deleteStyleButton.disabled = Object.keys((state.app && state.app.styles) || {}).length <= 1;
}

function renderLayoutDescription() {
  const value = els.layoutSelect.value || "auto";
  const text = layoutDescriptionText(value);
  els.layoutDescription.textContent = text;
  if (els.layoutInfoButton) {
    els.layoutInfoButton.dataset.tooltip = layoutGuideText(value);
  }
}

function layoutDescriptionText(value) {
  const descriptions = (state.app && state.app.layout_descriptions) || {};
  return (descriptions[value] || "Choose how selected Devices share roles across the generated scene.")
    .replaceAll("Virtuals", "Devices")
    .replaceAll("Virtual", "Device");
}

function layoutGuideText(selectedValue = "auto") {
  const descriptions = (state.app && state.app.layout_descriptions) || {};
  const values = ["auto", ...(((state.app && state.app.layouts) || []).map((layout) => (
    typeof layout === "string" ? layout : layout.id
  )))];
  const unique = [...new Set(values)];
  return unique
    .map((value) => {
      const label = value[0].toUpperCase() + value.slice(1);
      const selected = value === selectedValue ? "Current: " : "";
      const text = (descriptions[value] || layoutDescriptionText(value))
        .replaceAll("Virtuals", "Devices")
        .replaceAll("Virtual", "Device");
      return `${selected}${label} - ${text}`;
    })
    .join("\n");
}

function renderPresetLab() {
  if (!state.app || !els.presetEffectSelect) return;
  renderPresetEffectOptions();
  renderPresetBaseOptions();
  renderPresetPaletteOptions();
  renderPresetDeviceOptions();
  renderPresetDrafts();
  renderPresetLibrary();
  renderPresetPalettePreview();
}

function renderPresetEffectOptions() {
  const effectTypes = availableEffectTypes();
  const previous = state.activePresetEffect || els.presetEffectSelect.value;
  const byEffect = (state.app && state.app.presets && state.app.presets.by_effect) || {};
  els.presetEffectSelect.innerHTML = "";
  effectTypes.forEach((effectType) => {
    const count = (byEffect[effectType] || []).length;
    els.presetEffectSelect.append(option(count ? `${effectType} (${count} presets)` : effectType, effectType));
  });
  if (previous && effectTypes.includes(previous)) {
    els.presetEffectSelect.value = previous;
  } else if (effectTypes.some((effectType) => (byEffect[effectType] || []).length)) {
    els.presetEffectSelect.value = effectTypes.find((effectType) => (byEffect[effectType] || []).length);
  } else if (effectTypes.length) {
    els.presetEffectSelect.value = effectTypes[0];
  }
  state.activePresetEffect = els.presetEffectSelect.value;
}

function renderPresetBaseOptions() {
  const effectType = els.presetEffectSelect.value;
  const current = els.presetBaseSelect.value;
  els.presetBaseSelect.innerHTML = "";
  els.presetBaseSelect.append(option("Default config", "__default__"));
  presetsForEffect(effectType).forEach((preset) => {
    els.presetBaseSelect.append(option(`${preset.name || preset.id} (${preset.source})`, presetValue(preset)));
  });
  if ([...els.presetBaseSelect.options].some((item) => item.value === current)) {
    els.presetBaseSelect.value = current;
  }
}

function renderPresetPaletteOptions() {
  els.presetPaletteSelect.innerHTML = "";
  els.presetPaletteSelect.append(option("Auto", "auto"));
  ((state.app && state.app.palettes) || []).forEach((palette) => {
    els.presetPaletteSelect.append(option(palette.name || palette.id, palette.id));
  });
  syncPresetPaletteSelection(selectedPresetPaletteIds());
  renderPresetPalettePreview();
  renderPresetPalettePicker();
}

function renderPresetPalettePreview() {
  if (!els.presetPalettePreview) return;
  const paletteIds = selectedPresetPaletteIds();
  els.presetPalettePreview.innerHTML = "";
  const strips = document.createElement("span");
  strips.className = "select-gradient-strips";
  paletteIds.slice(0, 4).forEach((paletteId) => {
    const strip = document.createElement("span");
    strip.className = "select-gradient-strip";
    strip.style.background = presetPaletteBackground(paletteId);
    strips.append(strip);
  });
  const label = document.createElement("span");
  if (paletteIds.includes("auto")) {
    label.textContent = "Auto palette blend";
  } else {
    const names = paletteIds.map((paletteId) => paletteById(paletteId)?.name || paletteId);
    label.textContent = `${paletteIds.length} selected: ${names.join(", ")}`;
  }
  els.presetPalettePreview.append(strips, label);
}

function presetPaletteBackground(paletteId) {
  if (paletteId === "auto") {
    return "linear-gradient(90deg, #000000 0%, #163b00 24%, #006dff 50%, #ff3bbd 76%, #ffd166 100%)";
  }
  const palette = paletteById(paletteId);
  if (!palette) return "linear-gradient(90deg, #000000, #444444)";
  return palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS);
}

function renderPresetPalettePicker() {
  if (!els.presetPalettePicker || !els.presetPaletteSelect) return;
  const selected = selectedPresetPaletteIds();
  const choices = [
    {id: "auto", name: "Auto", note: "style weighted"},
    ...(((state.app && state.app.palettes) || []).map((palette) => ({
      id: palette.id,
      name: palette.name || palette.id,
      note: palette.id,
    }))),
  ];
  els.presetPalettePicker.innerHTML = "";
  choices.forEach((choice) => {
    const item = document.createElement("label");
    item.className = `mini-palette-choice ${selected.includes(String(choice.id)) ? "active" : ""}`;
    item.dataset.paletteId = choice.id;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = selected.includes(String(choice.id));

    const copy = document.createElement("span");
    copy.className = "mini-palette-copy";
    const title = document.createElement("strong");
    title.textContent = choice.name;
    const note = document.createElement("small");
    note.textContent = choice.note;
    copy.append(title, note);

    const strip = document.createElement("span");
    strip.className = "mini-palette-strip";
    strip.style.background = presetPaletteBackground(choice.id);

    input.addEventListener("change", () => {
      togglePresetPaletteChoice(choice.id, input.checked);
      renderPresetPalettePreview();
      renderPresetPalettePicker();
    });
    item.append(input, copy, strip);
    els.presetPalettePicker.append(item);
  });
}

function selectedPresetPaletteIds() {
  const available = new Set(["auto", ...(((state.app && state.app.palettes) || []).map((palette) => String(palette.id)))]);
  const clean = (state.selectedPresetPaletteIds || [])
    .map((id) => String(id))
    .filter((id, index, list) => available.has(id) && list.indexOf(id) === index);
  const result = clean.length ? clean : ["auto"];
  syncPresetPaletteSelection(result);
  return result;
}

function syncPresetPaletteSelection(ids) {
  state.selectedPresetPaletteIds = ids && ids.length ? ids : ["auto"];
  if (els.presetPaletteSelect) {
    els.presetPaletteSelect.value = state.selectedPresetPaletteIds[0] || "auto";
  }
}

function togglePresetPaletteChoice(id, checked) {
  const paletteId = String(id);
  if (paletteId === "auto") {
    syncPresetPaletteSelection(["auto"]);
    return;
  }
  let next = selectedPresetPaletteIds().filter((item) => item !== "auto");
  if (checked) {
    if (!next.includes(paletteId)) next.push(paletteId);
  } else {
    next = next.filter((item) => item !== paletteId);
  }
  syncPresetPaletteSelection(next.length ? next : ["auto"]);
}

function renderPresetDeviceOptions() {
  const current = els.presetDeviceSelect.value;
  els.presetDeviceSelect.innerHTML = "";
  ((state.app && state.app.virtuals) || []).forEach((virtual) => {
    els.presetDeviceSelect.append(option(`${virtual.name || virtual.id} (${virtual.id})`, virtual.id));
  });
  if ([...els.presetDeviceSelect.options].some((item) => item.value === current)) {
    els.presetDeviceSelect.value = current;
  } else {
    const preferred = ((state.app && state.app.default_virtual_ids) || [])[0];
    if (preferred && [...els.presetDeviceSelect.options].some((item) => item.value === preferred)) {
      els.presetDeviceSelect.value = preferred;
    }
  }
}

function renderPresetLibrary() {
  const effectType = els.presetEffectSelect.value;
  const presets = presetsForEffect(effectType);
  els.presetList.innerHTML = "";
  els.presetSummary.textContent = effectType
    ? `${presets.length} presets for ${effectType}`
    : "No effect selected.";
  if (!presets.length) {
    els.presetList.append(emptyNote("No presets for this effect yet."));
    return;
  }
  presets.forEach((preset) => {
    const row = document.createElement("article");
    row.className = `preset-row ${preset.editable ? "is-user" : ""}`;
    const main = document.createElement("div");
    main.className = "preset-row-main";
    const title = document.createElement("strong");
    title.textContent = preset.name || preset.id;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.append(
      pill(preset.source || preset.category),
      pill(`${preset.param_count || Object.keys(preset.config || {}).length} params`),
      pill(preset.id),
    );
    main.append(title, meta);
    const preview = presetColorPreview(preset);
    if (preview) main.append(preview);
    const actions = document.createElement("div");
    actions.className = "preset-row-actions";
    actions.append(actionButton("Preview", () => previewPreset(preset)));
    if (preset.editable) {
      actions.append(
        actionButton("Edit", () => openPresetEditor(preset)),
        actionButton("Delete", () => deleteUserPreset(preset), false, "danger"),
      );
    } else {
      actions.append(pill("Locked", "tag-pill"));
    }
    row.append(main, actions);
    els.presetList.append(row);
  });
}

function renderPresetDrafts() {
  if (!els.presetDraftList || !els.presetDraftSummary) return;
  const drafts = state.presetDrafts || [];
  els.presetDraftList.innerHTML = "";
  els.presetDraftSummary.textContent = drafts.length
    ? `${drafts.length} local drafts, not sent yet`
    : "No drafts yet.";
  if (els.sendPresetDraftsButton) els.sendPresetDraftsButton.disabled = !drafts.length;
  if (els.clearPresetDraftsButton) els.clearPresetDraftsButton.disabled = !drafts.length;
  if (!drafts.length) {
    els.presetDraftList.append(emptyNote("Generate drafts here, edit them, then send them to LedFx when ready."));
    return;
  }
  drafts.forEach((preset) => {
    const row = document.createElement("article");
    row.className = "preset-row is-draft";
    const main = document.createElement("div");
    main.className = "preset-row-main";
    const title = document.createElement("strong");
    title.textContent = preset.name || preset.id;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.append(
      pill("Draft"),
      pill(preset.effect_type),
      pill(`${preset.param_count || Object.keys(preset.config || {}).length} params`),
    );
    if (preset.palette_name) meta.append(pill(preset.palette_name));
    main.append(title, meta);
    const preview = presetColorPreview(preset);
    if (preview) main.append(preview);

    const actions = document.createElement("div");
    actions.className = "preset-row-actions";
    actions.append(
      actionButton("Preview", () => previewPreset(preset)),
      actionButton("Edit", () => openPresetEditor(preset)),
      actionButton("Delete", () => deletePresetDraft(preset), false, "danger"),
    );
    row.append(main, actions);
    els.presetDraftList.append(row);
  });
}

function presetsForEffect(effectType) {
  const byEffect = state.app && state.app.presets && state.app.presets.by_effect;
  return byEffect && byEffect[effectType] ? byEffect[effectType] : [];
}

function presetValue(preset) {
  return `${preset.category || ""}::${preset.id || ""}`;
}

function presetIdFromName(name) {
  return String(name || "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") || "preset";
}

function parsePresetValue(value) {
  const [category, ...rest] = String(value || "").split("::");
  return {category, id: rest.join("::")};
}

function findPreset(effectType, value) {
  const {category, id} = parsePresetValue(value);
  if (!id) return null;
  return presetsForEffect(effectType).find(
    (preset) => preset.id === id && (!category || preset.category === category),
  ) || null;
}

function presetColorPreview(preset) {
  const config = preset && preset.config;
  if (!config || typeof config !== "object") return null;
  const gradient = Object.values(config).find(
    (value) => typeof value === "string" && value.includes("linear-gradient"),
  );
  const colors = Object.values(config).filter(
    (value) => typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value),
  );
  if (!gradient && !colors.length) return null;
  const strip = document.createElement("span");
  strip.className = "preset-color-preview";
  strip.style.background = gradient || `linear-gradient(90deg, ${colors.slice(0, 6).join(", ")})`;
  return strip;
}

function paletteById(paletteId) {
  return ((state.app && state.app.palettes) || []).find((palette) => String(palette.id) === String(paletteId)) || null;
}

function openPresetEditor(preset) {
  if (!preset || !preset.editable) return;
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingPreset = JSON.parse(JSON.stringify(preset));
  if (els.styleEditor) els.styleEditor.hidden = true;
  if (els.paletteEditor) els.paletteEditor.hidden = true;
  if (els.playlistEditor) els.playlistEditor.hidden = true;
  if (els.tabsGuidePanel) els.tabsGuidePanel.hidden = true;
  if (els.sceneEditorHost) {
    els.sceneEditorHost.innerHTML = "";
    els.sceneEditorHost.hidden = true;
  }
  renderPresetEditor();
  openModal("Edit Preset");
}

function closePresetEditor() {
  state.editingPreset = null;
  renderPresetEditor();
  hideModal();
}

function renderPresetEditor() {
  if (!els.presetEditor) return;
  const preset = state.editingPreset;
  if (!preset) {
    els.presetEditor.hidden = true;
    return;
  }
  els.presetEditor.hidden = false;
  els.presetEditNameInput.value = preset.name || preset.id;
  const isDraft = Boolean(preset.draft);
  els.presetEditStatus.textContent = isDraft
    ? `${preset.effect_type} | local draft, not sent to LedFx yet`
    : `${preset.effect_type} | user preset: ${preset.id}`;
  if (els.presetEditDeviceField) els.presetEditDeviceField.hidden = isDraft;
  if (els.savePresetEditButton) els.savePresetEditButton.textContent = isDraft ? "Save Draft" : "Save Preset";
  renderPresetEditDeviceOptions();
  els.presetParamFields.innerHTML = "";
  const entries = Object.entries(preset.config || {});
  if (!entries.length) {
    els.presetParamFields.append(emptyNote("No editable parameters for this preset."));
    return;
  }
  entries
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .forEach(([key, value]) => {
      const field = paramField({effect_type: preset.effect_type}, 0, key, value);
      const input = field.querySelector("[data-param-key]");
      if (input) input.dataset.presetParam = "true";
      els.presetParamFields.append(field);
    });
}

function renderPresetEditDeviceOptions() {
  const current = els.presetEditDeviceSelect.value;
  els.presetEditDeviceSelect.innerHTML = "";
  ((state.app && state.app.virtuals) || []).forEach((virtual) => {
    els.presetEditDeviceSelect.append(option(`${virtual.name || virtual.id} (${virtual.id})`, virtual.id));
  });
  if ([...els.presetEditDeviceSelect.options].some((item) => item.value === current)) {
    els.presetEditDeviceSelect.value = current;
  } else {
    const preferred = els.presetDeviceSelect.value || ((state.app && state.app.default_virtual_ids) || [])[0];
    if (preferred && [...els.presetEditDeviceSelect.options].some((item) => item.value === preferred)) {
      els.presetEditDeviceSelect.value = preferred;
    }
  }
}

function collectPresetEditConfig() {
  const config = {};
  els.presetParamFields.querySelectorAll("[data-preset-param]").forEach((input) => {
    config[input.dataset.paramKey] = parseParamInput(input);
  });
  return config;
}

function presetPreviewDeviceName(virtualId) {
  const virtual = ((state.app && state.app.virtuals) || []).find((item) => item.id === virtualId);
  return virtual ? (virtual.name || virtual.id) : (virtualId || "selected device");
}

async function previewPreset(preset, configOverride = null, virtualId = "") {
  if (!preset) return;
  const targetVirtualId = virtualId || (els.presetDeviceSelect && els.presetDeviceSelect.value) || "";
  if (!targetVirtualId) {
    showToast("Choose a Preview Device first.");
    return;
  }
  const config = configOverride || preset.config || {};
  try {
    await api("/api/presets/preview", {
      method: "POST",
      body: JSON.stringify({
        virtual_id: targetVirtualId,
        effect_type: preset.effect_type,
        preset_id: preset.draft ? "" : preset.id,
        category: preset.draft ? "" : preset.category,
        name: preset.name || preset.id,
        config,
      }),
    });
    state.selectedSceneId = null;
    await refreshTopDevicePreviewState();
    renderScenes();
    showToast(`Previewing ${preset.name || preset.id} on ${presetPreviewDeviceName(targetVirtualId)}.`);
  } catch (error) {
    showToast(error.message);
  }
}

async function previewEditingPreset() {
  const preset = state.editingPreset;
  if (!preset) return;
  const name = els.presetEditNameInput.value.trim() || preset.name || preset.id;
  const previewPresetData = {
    ...preset,
    name,
    config: collectPresetEditConfig(),
  };
  const virtualId = preset.draft
    ? (els.presetDeviceSelect && els.presetDeviceSelect.value)
    : (els.presetEditDeviceSelect && els.presetEditDeviceSelect.value);
  await previewPreset(previewPresetData, previewPresetData.config, virtualId);
}

async function savePresetEdit() {
  const preset = state.editingPreset;
  if (!preset) return;
  els.savePresetEditButton.disabled = true;
  els.savePresetEditButton.textContent = "Saving...";
  try {
    const config = collectPresetEditConfig();
    if (preset.draft) {
      const draftId = preset.draft_id;
      const index = state.presetDrafts.findIndex((item) => item.draft_id === draftId);
      if (index === -1) throw new Error("This draft no longer exists.");
      const name = els.presetEditNameInput.value.trim();
      if (!name) throw new Error("Preset name is required.");
      state.presetDrafts[index] = {
        ...state.presetDrafts[index],
        id: presetIdFromName(name),
        name,
        config,
        param_count: Object.keys(config).length,
      };
      state.editingPreset = JSON.parse(JSON.stringify(state.presetDrafts[index]));
      renderPresetLab();
      renderPresetEditor();
      showToast("Draft saved.");
      return;
    }
    const data = await api("/api/presets/update", {
      method: "POST",
      body: JSON.stringify({
        effect_type: preset.effect_type,
        preset_id: preset.id,
        category: preset.category,
        name: els.presetEditNameInput.value.trim(),
        virtual_id: els.presetEditDeviceSelect.value,
        config,
      }),
    });
    state.app.presets = data.catalog || state.app.presets;
    const nextPresetId = data.preset_id || preset.id;
    state.editingPreset = findPreset(preset.effect_type, `user_presets::${nextPresetId}`);
    renderPresetLab();
    renderPresetEditor();
    showToast("Preset saved.");
  } catch (error) {
    showToast(error.message);
  } finally {
    els.savePresetEditButton.disabled = false;
    els.savePresetEditButton.textContent = state.editingPreset && state.editingPreset.draft ? "Save Draft" : "Save Preset";
  }
}

async function generatePresets() {
  if (!state.app) return;
  const effectType = els.presetEffectSelect.value;
  if (!effectType) {
    showToast("Choose an effect first.");
    return;
  }
  const {category, id} = parsePresetValue(els.presetBaseSelect.value);
  const paletteIds = selectedPresetPaletteIds();
  const payload = {
    effect_type: effectType,
    base_preset_id: id || "",
    base_preset_category: category || "",
    palette_id: paletteIds[0] || "auto",
    palette_ids: paletteIds,
    virtual_id: els.presetDeviceSelect.value,
    count: Number(els.presetCountInput.value) || 1,
    name_prefix: els.presetNamePrefixInput.value.trim() || "SLP",
    energy: Number(els.presetEnergyInput.value) / 100,
    variation: Number(els.presetVariationInput.value) / 100,
    seed: els.presetSeedInput.value.trim(),
  };
  els.generatePresetButton.disabled = true;
  els.generatePresetButton.textContent = "Generating...";
  try {
    const data = await api("/api/presets/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    state.presetDrafts = data.presets || [];
    renderPresetLab();
    const errors = (data.errors || []).length;
    showToast(`Generated ${(data.presets || []).length} draft presets${errors ? `, ${errors} failed` : ""}.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    els.generatePresetButton.disabled = false;
    els.generatePresetButton.textContent = "Generate Drafts";
  }
}

async function sendPresetDrafts() {
  if (!state.presetDrafts.length) {
    showToast("No preset drafts to send.");
    return;
  }
  els.sendPresetDraftsButton.disabled = true;
  els.sendPresetDraftsButton.textContent = "Sending...";
  try {
    const data = await api("/api/presets/send", {
      method: "POST",
      body: JSON.stringify({
        virtual_id: els.presetDeviceSelect.value,
        presets: state.presetDrafts,
      }),
    });
    const sentDraftIds = new Set((data.presets || []).map((preset) => preset.draft_id).filter(Boolean));
    const sentNames = new Set((data.presets || []).map((preset) => preset.name));
    if (sentDraftIds.size) {
      state.presetDrafts = state.presetDrafts.filter((draft) => !sentDraftIds.has(draft.draft_id));
    } else if (sentNames.size) {
      state.presetDrafts = state.presetDrafts.filter((draft) => !sentNames.has(draft.name));
    }
    state.app.presets = data.catalog || state.app.presets;
    renderPresetLab();
    const errors = (data.errors || []).length;
    showToast(`Sent ${(data.presets || []).length} presets to LedFx${errors ? `, ${errors} failed` : ""}.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    els.sendPresetDraftsButton.disabled = !state.presetDrafts.length;
    els.sendPresetDraftsButton.textContent = "Send to LedFx";
  }
}

function clearPresetDrafts() {
  if (!state.presetDrafts.length) return;
  const ok = window.confirm("Clear generated preset drafts?");
  if (!ok) return;
  state.presetDrafts = [];
  if (state.editingPreset && state.editingPreset.draft) {
    state.editingPreset = null;
    hideModal();
  }
  renderPresetLab();
}

function deletePresetDraft(preset) {
  if (!preset || !preset.draft_id) return;
  state.presetDrafts = state.presetDrafts.filter((draft) => draft.draft_id !== preset.draft_id);
  if (state.editingPreset && state.editingPreset.draft_id === preset.draft_id) {
    state.editingPreset = null;
    hideModal();
  }
  renderPresetLab();
}

async function deleteUserPreset(preset) {
  if (!preset || !preset.editable) return;
  const ok = window.confirm(`Delete user preset "${preset.name || preset.id}"?`);
  if (!ok) return;
  try {
    const data = await api("/api/presets/delete", {
      method: "POST",
      body: JSON.stringify({
        effect_type: preset.effect_type,
        preset_id: preset.id,
        category: preset.category,
      }),
    });
    state.app.presets = data.catalog || state.app.presets;
    renderPresetLab();
    showToast("Preset deleted.");
  } catch (error) {
    showToast(error.message);
  }
}

function editCurrentStyle() {
  const styleId = currentStyleId();
  if (!styleId) return;
  state.editingPreset = null;
  state.editingStyle = {id: styleId, source_style: styleId, isNew: false};
  renderPresetEditor();
  renderStyleEditor();
  openModal("Edit Style");
}

function newStyle() {
  const sourceStyle = currentStyleId();
  const source = currentStyle();
  state.editingPreset = null;
  state.editingStyle = {id: "", source_style: sourceStyle, isNew: true};
  renderPresetEditor();
  renderStyleEditor({
    name: `Custom ${source.name || sourceStyle || "Style"}`,
    description: source.description || "",
    defaults: collectCurrentDefaults(),
  });
  openModal("New Style");
}

function closeStyleEditor() {
  state.editingStyle = null;
  renderStyleEditor();
  hideModal();
}

function renderStyleEditor(seedStyle = null) {
  if (!state.editingStyle) {
    els.styleEditor.hidden = true;
    els.styleDefaultFields.innerHTML = "";
    return;
  }
  const style = seedStyle || (state.app.styles[state.editingStyle.id] || currentStyle());
  const defaults = styleDefaults(style);
  els.styleEditor.hidden = false;
  els.styleNameInput.value = style.name || "";
  els.styleDescriptionInput.value = style.description || "";
  els.styleDefaultFields.innerHTML = "";
  STYLE_DEFAULT_FIELDS.forEach((field) => {
    els.styleDefaultFields.append(styleDefaultField(field, defaults[field.key]));
  });
}

function styleDefaultField(field, value) {
  const label = document.createElement("label");
  label.className = "style-default-field";
  const description = field.key === "layout"
    ? layoutGuideText(value || "auto")
    : CONTROL_DESCRIPTIONS[field.key];
  label.append(fieldTitle(field.label, description));
  if (field.type === "layout") {
    const select = document.createElement("select");
    select.dataset.styleDefault = field.key;
    select.append(layoutOption("Auto", "auto"));
    ((state.app && state.app.layouts) || []).forEach((layout) => {
      const layoutId = typeof layout === "string" ? layout : layout.id;
      const labelText = typeof layout === "string" ? layout : layout.label || layout.id;
      select.append(layoutOption(labelText[0].toUpperCase() + labelText.slice(1), layoutId));
    });
    select.value = value || "auto";
    select.addEventListener("change", () => {
      const info = label.querySelector(".info-button");
      if (info) info.dataset.tooltip = layoutGuideText(select.value);
    });
    label.append(select);
    return label;
  }
  const input = document.createElement("input");
  input.dataset.styleDefault = field.key;
  input.type = field.type === "number" ? "number" : "range";
  if (field.type === "number") {
    input.min = String(field.min);
    input.max = String(field.max);
    input.step = String(field.step);
    input.value = String(value ?? DEFAULT_STYLE_DEFAULTS[field.key]);
  } else {
    input.min = "0";
    input.max = "100";
    input.value = String(Math.round(Number(value ?? 0) * 100));
    const output = document.createElement("strong");
    output.className = "range-value";
    const update = () => {
      output.textContent = `${input.value}%`;
    };
    input.addEventListener("input", update);
    update();
    label.append(input, output);
    return label;
  }
  label.append(input);
  return label;
}

function collectCurrentDefaults() {
  return {
    count: Number(els.countInput.value) || DEFAULT_STYLE_DEFAULTS.count,
    energy: Number(els.energyInput.value) / 100,
    variation: Number(els.variationInput.value) / 100,
    brightness: Number(els.brightnessInput.value) / 100,
    movement: Number(els.movementInput.value) / 100,
    audio_response: Number(els.audioResponseInput.value) / 100,
    density: Number(els.densityInput.value) / 100,
    flash: Number(els.flashInput.value) / 100,
    layout: els.layoutSelect.value || "auto",
  };
}

function collectStyleEditorDefaults() {
  const defaults = {};
  els.styleDefaultFields.querySelectorAll("[data-style-default]").forEach((input) => {
    const key = input.dataset.styleDefault;
    if (key === "layout") {
      defaults[key] = input.value || "auto";
    } else if (key === "count") {
      defaults[key] = Number(input.value) || DEFAULT_STYLE_DEFAULTS.count;
    } else {
      defaults[key] = Number(input.value) / 100;
    }
  });
  return defaults;
}

async function saveStyle() {
  if (!state.editingStyle) return;
  const name = els.styleNameInput.value.trim();
  if (!name) {
    showToast("Style name is required.");
    return;
  }
  els.saveStyleButton.disabled = true;
  try {
    const data = await api("/api/styles/save", {
      method: "POST",
      body: JSON.stringify({
        id: state.editingStyle.id,
        source_style: state.editingStyle.source_style,
        name,
        description: els.styleDescriptionInput.value.trim(),
        defaults: collectStyleEditorDefaults(),
      }),
    });
    state.app.styles = data.styles || state.app.styles;
    const styleId = data.style_id || state.editingStyle.id;
    state.editingStyle = null;
    renderControls();
    if (styleId && state.app.styles[styleId]) {
      els.styleSelect.value = styleId;
      applyStyleDefaults(styleId);
      renderStyleDescription();
    }
    renderStyleEditor();
    hideModal();
    showToast("Style saved.");
  } catch (error) {
    showToast(error.message);
  } finally {
    els.saveStyleButton.disabled = false;
  }
}

async function deleteCurrentStyle() {
  const styleId = currentStyleId();
  const style = currentStyle();
  if (!styleId) return;
  const ok = window.confirm(`Delete style "${style.name || styleId}"?`);
  if (!ok) return;
  try {
    const data = await api("/api/styles/delete", {
      method: "POST",
      body: JSON.stringify({style_id: styleId}),
    });
    state.app.styles = data.styles || state.app.styles;
    state.editingStyle = null;
    renderControls();
    renderStyleEditor();
    hideModal();
    showToast("Style deleted.");
  } catch (error) {
    showToast(error.message);
  }
}

function renderPaletteControls(selectedIds = ["auto"]) {
  const app = state.app;
  if (!app) return;
  const selected = normalizePaletteIds(selectedIds);
  els.paletteSelect.innerHTML = "";
  const autoOption = option("Auto", "auto");
  autoOption.selected = selected.has("auto");
  els.paletteSelect.append(autoOption);
  app.palettes.forEach((palette) => {
    const node = option(palette.name || palette.id, palette.id);
    node.selected = selected.has(palette.id);
    els.paletteSelect.append(node);
  });
  if (![...els.paletteSelect.selectedOptions].length) {
    els.paletteSelect.querySelector("option[value='auto']").selected = true;
  }
  updatePalettePreview();
}

function updatePalettePreview() {
  const app = state.app;
  if (!app) return;
  reconcilePaletteSelect();
  const ids = selectedPaletteIds();
  const palettes = selectedPalettes();
  renderPaletteSelectionSummary(ids, palettes);
  els.palettePreview.innerHTML = "";
  if (ids.includes("auto")) {
    const note = document.createElement("span");
    note.className = "palette-preview-note";
    note.textContent = "Auto";
    els.palettePreview.append(note);
  }
  palettes.slice(0, 3).forEach((palette) => {
    const gradient = document.createElement("span");
    gradient.className = "gradient-preview";
    gradient.style.background = palette.gradient || paletteGradient(palette.colors || {});
    els.palettePreview.append(gradient);
  });
  if (palettes.length > 3) {
    const extra = document.createElement("span");
    extra.className = "palette-preview-note";
    extra.textContent = `+${palettes.length - 3}`;
    els.palettePreview.append(extra);
  }
  renderPaletteList();
}

function renderPaletteSelectionSummary(ids, palettes) {
  if (!els.paletteSelectionSummary) return;
  els.paletteSelectionSummary.innerHTML = "";
  if (ids.includes("auto")) {
    const label = document.createElement("span");
    label.textContent = "Auto - style weighted";
    els.paletteSelectionSummary.append(label);
    return;
  }
  const stripGroup = document.createElement("span");
  stripGroup.className = "palette-summary-strips";
  palettes.slice(0, 3).forEach((palette) => {
    const strip = document.createElement("span");
    strip.className = "gradient-preview";
    strip.style.background = palette.gradient || paletteGradient(palette.colors || {});
    stripGroup.append(strip);
  });
  const names = palettes.map((palette) => palette.name || palette.id).join(", ");
  const text = document.createElement("span");
  text.textContent = `${palettes.length} selected${names ? `: ${names}` : ""}`;
  els.paletteSelectionSummary.append(stripGroup, text);
}

function collectOptions() {
  const paletteIds = selectedPaletteIds();
  return {
    style: els.styleSelect.value,
    count: Number(els.countInput.value),
    effect_mode: els.effectModeSelect.value,
    preset_mode: els.presetModeSelect.value,
    energy: Number(els.energyInput.value) / 100,
    variation: Number(els.variationInput.value) / 100,
    brightness: Number(els.brightnessInput.value) / 100,
    movement: Number(els.movementInput.value) / 100,
    audio_response: Number(els.audioResponseInput.value) / 100,
    density: Number(els.densityInput.value) / 100,
    flash: Number(els.flashInput.value) / 100,
    palette_id: paletteIds[0],
    palette_ids: paletteIds,
    layout: els.layoutSelect.value,
    name_prefix: els.namePrefixInput.value,
    start_index: Number(els.startIndexInput.value) || 1,
    generation_tags: parseTagInput(els.generationTagsInput.value),
    seed: els.seedInput.value.trim(),
    scene_types: checkedValues(els.sceneTypeList, "scene_type"),
    virtual_ids: checkedValues(els.virtualList, "virtual"),
    all_virtual_ids: allDeviceIds(),
  };
}

function allDeviceIds() {
  return [...els.virtualList.querySelectorAll('input[name="virtual"]')].map((input) => input.value);
}

function renderPaletteList() {
  const app = state.app;
  if (!app || !els.paletteList) return;
  const selected = normalizePaletteIds(selectedPaletteIds());
  els.paletteList.innerHTML = "";
  els.paletteList.append(autoPaletteCard(selected.has("auto")));
  app.palettes.forEach((palette) => {
    els.paletteList.append(paletteManagementCard(palette, selected.has(palette.id)));
  });
}

function selectAllPalettes() {
  if (!state.app) return;
  const ids = (state.app.palettes || []).map((palette) => palette.id);
  setSelectedPalettes(ids.length ? ids : ["auto"]);
}

function unselectAllPalettes() {
  setSelectedPalettes(["auto"]);
}

function autoPaletteCard(selected) {
  const card = document.createElement("div");
  card.className = `palette-card palette-select-card ${selected ? "active" : ""}`;
  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "palette-select-check";
  check.checked = selected;
  check.addEventListener("change", () => setSelectedPalettes(["auto"]));
  const pick = document.createElement("button");
  pick.type = "button";
  pick.className = "palette-pick";
  const text = document.createElement("span");
  text.className = "palette-card-copy";
  const name = document.createElement("span");
  name.className = "palette-card-name";
  name.textContent = "Auto - style weighted";
  const note = document.createElement("span");
  note.className = "palette-card-note";
  note.textContent = "uses style palette bias";
  text.append(name, note);
  pick.append(text);
  pick.addEventListener("click", () => setSelectedPalettes(["auto"]));
  const strip = document.createElement("span");
  strip.className = "palette-strip auto-strip";
  strip.setAttribute("aria-hidden", "true");
  card.append(check, pick, strip);
  return card;
}

function paletteManagementCard(palette, selected) {
  const card = document.createElement("div");
  card.className = `palette-card palette-select-card ${selected ? "active" : ""}`;
  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "palette-select-check";
  check.checked = selected;
  check.addEventListener("change", () => togglePalette(palette.id));
  const pick = document.createElement("button");
  pick.type = "button";
  pick.className = "palette-pick";
  pick.append(paletteName(palette));
  pick.addEventListener("click", () => togglePalette(palette.id));
  const actions = document.createElement("div");
  actions.className = "palette-card-actions";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "palette-edit";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => editPalette(palette));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "palette-edit danger";
  remove.textContent = "Delete";
  remove.addEventListener("click", () => deletePalette(palette));
  actions.append(edit, remove);
  card.append(check, pick, actions, colorStrip(palette));
  return card;
}

function colorStrip(palette) {
  const strip = document.createElement("span");
  strip.className = "palette-strip";
  if (palette && palette.gradient) {
    strip.style.background = palette.gradient;
    return strip;
  }
  PALETTE_ROLES.map((role) => (palette && palette.colors && palette.colors[role]) || "#000000").forEach((color) => {
    const swatch = document.createElement("span");
    swatch.style.background = color;
    strip.append(swatch);
  });
  return strip;
}

function paletteName(palette) {
  const name = document.createElement("span");
  name.className = "palette-card-name";
  name.textContent = palette.name || palette.id;
  return name;
}

function selectPalette(paletteId) {
  setSelectedPalettes([paletteId]);
}

function selectedPaletteIds() {
  const ids = [...els.paletteSelect.selectedOptions].map((item) => item.value);
  const specific = ids.filter((id) => id !== "auto");
  return specific.length ? specific : ["auto"];
}

function selectedPalettes() {
  const app = state.app;
  if (!app) return [];
  const ids = selectedPaletteIds().filter((id) => id !== "auto");
  return app.palettes.filter((palette) => ids.includes(palette.id));
}

function normalizePaletteIds(ids) {
  const values = Array.isArray(ids) ? ids : [ids];
  const specific = values.map(String).filter((id) => id && id !== "auto");
  return new Set(specific.length ? specific : ["auto"]);
}

function setSelectedPalettes(ids) {
  const selected = normalizePaletteIds(ids);
  [...els.paletteSelect.options].forEach((item) => {
    item.selected = selected.has(item.value);
  });
  updatePalettePreview();
}

function togglePalette(paletteId) {
  const selected = normalizePaletteIds(selectedPaletteIds());
  selected.delete("auto");
  if (selected.has(paletteId)) {
    selected.delete(paletteId);
  } else {
    selected.add(paletteId);
  }
  setSelectedPalettes([...selected]);
}

function reconcilePaletteSelect() {
  const specific = [...els.paletteSelect.selectedOptions].filter((item) => item.value !== "auto");
  const auto = els.paletteSelect.querySelector("option[value='auto']");
  if (specific.length && auto) auto.selected = false;
  if (!specific.length && auto && !auto.selected) auto.selected = true;
}

function editPalette(palette) {
  state.editingPreset = null;
  state.editingPalette = JSON.parse(JSON.stringify(palette));
  renderPresetEditor();
  renderPaletteEditor();
  openModal("Edit Palette");
}

function newPalette() {
  const base = currentPalette() || state.app.palettes[0];
  const colors = {...((base && base.colors) || {})};
  PALETTE_ROLES.forEach((role) => {
    colors[role] = colors[role] || (role === "strobe" ? "#ffffff" : "#000000");
  });
  state.editingPalette = {
    id: "",
    name: "Custom Palette",
    colors,
    gradient: "",
    positions: {...DEFAULT_GRADIENT_POSITIONS},
    black_start: true,
  };
  state.editingPreset = null;
  renderPresetEditor();
  renderPaletteEditor();
  openModal("New Palette");
}

function randomizePaletteGradient() {
  if (!state.editingPalette) return;
  state.editingPalette.black_start = els.paletteBlackStartInput.checked;
  state.editingPalette.colors = randomPaletteColors(paletteBlackStart(state.editingPalette));
  state.editingPalette.positions = randomGradientPositions();
  renderPaletteEditor();
  showToast("Random palette generated.");
}

function randomGradientPositions() {
  const jitter = (base, amount) => Math.round(base + (Math.random() * 2 - 1) * amount);
  const positions = {
    background: 0,
    dark: clampNumber(jitter(16, 8), 8, 28),
    low: clampNumber(jitter(38, 10), 26, 50),
    mid: clampNumber(jitter(62, 10), 50, 74),
    high: clampNumber(jitter(84, 8), 72, 92),
    accent: 100,
  };
  EDITABLE_GRADIENT_ROLES.forEach((role) => {
    positions[role] = clampGradientPosition(role, positions[role], positions);
  });
  return positions;
}

function randomPaletteColors(blackStart = true) {
  const hue = Math.floor(Math.random() * 360);
  const mode = Math.random();
  const offsets =
    mode < 0.34
      ? [0, 18, 42, 68, 96]
      : mode < 0.67
        ? [0, 40, 130, 170, 210]
        : [0, 80, 155, 205, 260];
  const saturation = 72 + Math.floor(Math.random() * 20);
  return {
    background: blackStart ? "#000000" : hslToHex(hue - 24, saturation, 5 + Math.floor(Math.random() * 14)),
    dark: hslToHex(hue + offsets[0], saturation, 8 + Math.floor(Math.random() * 8)),
    low: hslToHex(hue + offsets[1], saturation, 24 + Math.floor(Math.random() * 12)),
    mid: hslToHex(hue + offsets[2], saturation + 6, 46 + Math.floor(Math.random() * 12)),
    high: hslToHex(hue + offsets[3], saturation + 8, 58 + Math.floor(Math.random() * 12)),
    accent: hslToHex(hue + offsets[4], saturation + 10, 66 + Math.floor(Math.random() * 10)),
    strobe: hslToHex(hue + offsets[4], 25 + Math.floor(Math.random() * 20), 88 + Math.floor(Math.random() * 8)),
  };
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, Number(value)));
}

function hslToHex(hue, saturation, lightness) {
  const h = ((Number(hue) % 360) + 360) % 360;
  const s = Math.max(0, Math.min(100, Number(saturation))) / 100;
  const l = Math.max(0, Math.min(100, Number(lightness))) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return [r, g, b]
    .map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, "0"))
    .join("")
    .replace(/^/, "#");
}

function currentPalette() {
  const ids = selectedPaletteIds().filter((id) => id !== "auto");
  return state.app.palettes.find((palette) => palette.id === ids[0]);
}

function paletteBlackStart(palette) {
  return !palette || palette.black_start !== false;
}

function updatePaletteBlackStart() {
  if (!state.editingPalette) return;
  state.editingPalette.black_start = els.paletteBlackStartInput.checked;
  if (paletteBlackStart(state.editingPalette)) {
    state.editingPalette.colors = {...(state.editingPalette.colors || {}), background: "#000000"};
  }
  renderPaletteEditor();
}

function renderPaletteEditor() {
  const palette = state.editingPalette;
  els.paletteEditor.hidden = !palette;
  if (!palette) return;
  els.paletteNameInput.value = palette.name || "";
  els.paletteBlackStartInput.checked = paletteBlackStart(palette);
  els.paletteColorFields.innerHTML = "";
  ensurePaletteColors(palette);
  ensurePalettePositions(palette);
  const blackStart = paletteBlackStart(palette);
  PALETTE_ROLES.forEach((role) => {
    const item = document.createElement("label");
    item.className = "gradient-stop";
    const input = document.createElement("input");
    input.type = "color";
    input.dataset.role = role;
    input.value = palette.colors[role];
    input.disabled = role === "background" && blackStart;
    input.addEventListener("input", () => {
      state.editingPalette.colors[role] = input.value;
      updatePaletteGradientPreview();
    });
    const text = document.createElement("span");
    text.className = "gradient-stop-text";
    const title = document.createElement("strong");
    title.textContent = PALETTE_ROLE_META[role].label;
    const description = document.createElement("small");
    const position = document.createElement("span");
    position.className = "gradient-stop-position";
    position.dataset.role = role;
    position.textContent = role === "strobe" ? PALETTE_ROLE_META[role].stop : `${palette.positions[role]}%`;
    description.append(position, ` | ${PALETTE_ROLE_META[role].description}`);
    text.append(title, description);
    item.append(input, text);
    els.paletteColorFields.append(item);
  });
  renderPaletteEditorPreview();
}

function ensurePaletteColors(palette) {
  palette.colors = {...(palette.colors || {})};
  PALETTE_ROLES.forEach((role) => {
    palette.colors[role] = palette.colors[role] || (role === "strobe" ? "#ffffff" : "#000000");
  });
  if (paletteBlackStart(palette)) palette.colors.background = "#000000";
}

function ensurePalettePositions(palette) {
  palette.positions = {...DEFAULT_GRADIENT_POSITIONS, ...((palette && palette.positions) || {})};
  palette.positions.background = 0;
  GRADIENT_ROLES.forEach((role) => {
    const value = Number(palette.positions[role]);
    palette.positions[role] = Number.isFinite(value) ? Math.round(value) : DEFAULT_GRADIENT_POSITIONS[role];
  });
  EDITABLE_GRADIENT_ROLES.forEach((role) => {
    palette.positions[role] = clampGradientPosition(role, palette.positions[role], palette.positions);
  });
  return palette.positions;
}

function renderPaletteEditorPreview() {
  if (!state.editingPalette) return;
  ensurePaletteColors(state.editingPalette);
  ensurePalettePositions(state.editingPalette);
  const colors = state.editingPalette.colors;
  els.paletteGradientPreview.innerHTML = "";
  GRADIENT_ROLES.forEach((role) => {
    els.paletteGradientPreview.append(gradientMarker(role, colors[role]));
  });
  updatePaletteGradientPreview();
}

function updatePaletteGradientPreview() {
  if (!state.editingPalette) return;
  ensurePaletteColors(state.editingPalette);
  const positions = ensurePalettePositions(state.editingPalette);
  const colors = state.editingPalette.colors;
  const gradient = paletteGradient(colors, positions);
  state.editingPalette.gradient = gradient;
  els.paletteGradientPreview.style.background = gradient;
  GRADIENT_ROLES.forEach((role) => {
    const marker = els.paletteGradientPreview.querySelector(`.gradient-marker[data-role="${role}"]`);
    const dot = marker && marker.querySelector(".gradient-marker-dot");
    if (marker) placeGradientMarker(marker, role, positions[role]);
    if (dot) dot.style.background = colors[role];
    const positionLabel = els.paletteColorFields.querySelector(`.gradient-stop-position[data-role="${role}"]`);
    if (positionLabel && role !== "strobe") positionLabel.textContent = `${positions[role]}%`;
  });
}

function paletteGradient(colors, positions = DEFAULT_GRADIENT_POSITIONS) {
  return [
    "linear-gradient(90deg",
    `${colors.background || "#000000"} ${positions.background || 0}%`,
    `${colors.dark || "#000000"} ${positions.dark ?? 18}%`,
    `${colors.low || "#000000"} ${positions.low ?? 38}%`,
    `${colors.mid || "#000000"} ${positions.mid ?? 62}%`,
    `${colors.high || "#000000"} ${positions.high ?? 84}%`,
    `${colors.accent || "#ffffff"} ${positions.accent ?? 100}%)`,
  ].join(", ");
}

function gradientMarker(role, color) {
  const marker = document.createElement("div");
  const isLockedStart = role === "background" && paletteBlackStart(state.editingPalette);
  marker.className = `gradient-marker ${role === "background" ? "edge-start" : ""} ${isLockedStart ? "is-locked" : ""}`.trim();
  marker.dataset.role = role;
  placeGradientMarker(marker, role, gradientPosition(role));

  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "gradient-marker-dot";
  dot.style.background = color;
  dot.disabled = isLockedStart;
  dot.setAttribute(
    "aria-label",
    isLockedStart
      ? "Black start is fixed"
      : role === "background"
        ? "Edit start color; position stays fixed"
        : `Move ${PALETTE_ROLE_META[role].label} stop; click to edit color`,
  );
  dot.addEventListener("pointerdown", (event) => startGradientMarkerDrag(event, role));
  const label = document.createElement("span");
  label.className = "gradient-marker-label";
  label.textContent = PALETTE_ROLE_META[role].label;
  marker.append(dot, label);
  return marker;
}

function gradientPosition(role) {
  if (!state.editingPalette) return DEFAULT_GRADIENT_POSITIONS[role];
  return ensurePalettePositions(state.editingPalette)[role];
}

function placeGradientMarker(marker, role, position) {
  marker.classList.toggle("edge-end", role === "accent" && position >= 99);
  if (role === "background") {
    marker.style.left = "14px";
  } else if (role === "accent" && position >= 99) {
    marker.style.left = "calc(100% - 14px)";
  } else {
    marker.style.left = `${position}%`;
  }
}

function startGradientMarkerDrag(event, role) {
  if (!state.editingPalette) return;
  if (role === "background") {
    if (!paletteBlackStart(state.editingPalette)) openGradientColor(role);
    return;
  }
  event.preventDefault();
  const rect = els.paletteGradientPreview.getBoundingClientRect();
  const drag = {
    role,
    rect,
    startX: event.clientX,
    moved: false,
  };
  state.gradientDrag = drag;

  const onMove = (moveEvent) => {
    const distance = Math.abs(moveEvent.clientX - drag.startX);
    if (distance > 3) drag.moved = true;
    const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
    moveGradientStop(role, percent);
  };
  const onUp = () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    const didMove = state.gradientDrag && state.gradientDrag.moved;
    state.gradientDrag = null;
    if (!didMove) openGradientColor(role);
  };

  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onUp, {once: true});
}

function moveGradientStop(role, percent) {
  if (!state.editingPalette) return;
  const positions = ensurePalettePositions(state.editingPalette);
  positions[role] = clampGradientPosition(role, percent, positions);
  updatePaletteGradientPreview();
}

function clampGradientPosition(role, percent, positions) {
  const index = GRADIENT_ROLES.indexOf(role);
  if (index <= 0) return 0;
  const previousRole = GRADIENT_ROLES[index - 1];
  const nextRole = GRADIENT_ROLES[index + 1];
  const min = Number(positions[previousRole] ?? DEFAULT_GRADIENT_POSITIONS[previousRole]) + GRADIENT_MIN_GAP;
  const max = nextRole
    ? Number(positions[nextRole] ?? DEFAULT_GRADIENT_POSITIONS[nextRole]) - GRADIENT_MIN_GAP
    : 100;
  return Math.round(Math.max(min, Math.min(max, Number(percent))));
}

function openGradientColor(role) {
  const input = els.paletteColorFields.querySelector(`input[data-role="${role}"]`);
  if (input && !input.disabled) input.click();
}

function openGradientStopFromBar(event) {
  if (!state.editingPalette || event.target.closest(".gradient-marker")) return;
  const rect = els.paletteGradientPreview.getBoundingClientRect();
  const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
  const nearest = EDITABLE_GRADIENT_ROLES.reduce((best, role) => {
    const distance = Math.abs(gradientPosition(role) - percent);
    return distance < best.distance ? {role, distance} : best;
  }, {role: "dark", distance: Infinity}).role;
  openGradientColor(nearest);
}

async function savePalette() {
  if (!state.editingPalette) return;
  ensurePalettePositions(state.editingPalette);
  const colors = {};
  els.paletteColorFields.querySelectorAll("input[type='color']").forEach((input) => {
    colors[input.dataset.role] = input.value;
  });
  const payload = {
    id: state.editingPalette.id,
    name: els.paletteNameInput.value.trim() || "Custom Palette",
    colors,
    black_start: els.paletteBlackStartInput.checked,
    positions: state.editingPalette.positions,
    gradient: state.editingPalette.gradient,
  };
  try {
    const data = await api("/api/palettes/save", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    state.app.palettes = data.palettes || state.app.palettes;
    renderPaletteControls([data.palette.id]);
    state.editingPalette = null;
    renderPaletteEditor();
    hideModal();
    showToast("Palette saved.");
  } catch (error) {
    showToast(error.message);
  }
}

async function deletePalette(palette) {
  if (!palette) return;
  if ((state.app.palettes || []).length <= 1) {
    showToast("At least one palette is required.");
    return;
  }
  const ok = window.confirm(`Delete palette "${palette.name || palette.id}"?`);
  if (!ok) return;
  const nextSelected = selectedPaletteIds().filter((id) => id !== palette.id);
  try {
    const data = await api("/api/palettes/delete", {
      method: "POST",
      body: JSON.stringify({palette_id: palette.id}),
    });
    state.app.palettes = data.palettes || state.app.palettes;
    if (state.editingPalette && state.editingPalette.id === palette.id) {
      state.editingPalette = null;
      renderPaletteEditor();
      hideModal();
    }
    renderPaletteControls(nextSelected.length ? nextSelected : ["auto"]);
    showToast("Palette deleted.");
  } catch (error) {
    showToast(error.message);
  }
}

function closePaletteEditor() {
  state.editingPalette = null;
  renderPaletteEditor();
  hideModal();
}

function sceneSummary(scene) {
  const kept = state.scenes.filter((item) => item.kept && !item.deleted).length;
  const saved = state.scenes.filter((item) => item.saved).length;
  const total = state.scenes.filter((item) => !item.deleted).length;
  els.queueSummary.textContent =
    total === 0
      ? "No generated scenes yet."
      : `${kept} approved | ${saved} saved | ${total} visible`;
}

function renderSimilarityReport() {
  const host = els.similarityReport;
  if (!host) return;
  host.innerHTML = "";
  const report = state.similarityReport;
  if (!report || !state.scenes.length || Number(report.pair_count || 0) === 0) {
    host.hidden = true;
    return;
  }
  host.hidden = false;
  const summary = document.createElement("div");
  summary.className = "similarity-summary";
  const risk = String(report.risk || "low");
  const riskLabel = risk === "high" ? "High overlap" : risk === "medium" ? "Moderate overlap" : "Low overlap";
  summary.append(
    pill(riskLabel, `similarity-${risk}`),
    metricPill("Average similarity", report.average_similarity),
    metricPill("Highest pair", report.max_similarity),
    metricPill("Uniqueness", report.uniqueness),
  );
  host.append(summary);

  const pairs = (report.pairs || []).filter((pair) => Number(pair.score || 0) >= 0.34).slice(0, 4);
  if (!pairs.length) return;
  const details = document.createElement("details");
  details.className = "similarity-details";
  const title = document.createElement("summary");
  title.textContent = "Most similar scenes";
  details.append(title);
  pairs.forEach((pair) => {
    const row = document.createElement("div");
    row.className = "similarity-pair";
    const names = document.createElement("strong");
    names.textContent = `${pair.left_name} <-> ${pair.right_name}`;
    const score = document.createElement("span");
    score.textContent = `${Math.round(Number(pair.score || 0) * 100)}% similar`;
    const reasons = document.createElement("small");
    reasons.textContent = (pair.shared || []).slice(0, 5).join(", ") || "shared fingerprint traits";
    row.append(names, score, reasons);
    details.append(row);
  });
  host.append(details);
}

function metricPill(label, value) {
  const numeric = Number(value || 0);
  return pill(`${label}: ${Math.round(numeric * 100)}%`);
}

function renderScenes() {
  els.sceneList.innerHTML = "";
  state.scenes.forEach((scene) => {
    const row = document.createElement("article");
    row.className = "scene-row";
    if (scene.id === state.selectedSceneId) row.classList.add("is-selected");
    if (scene.deleted) row.classList.add("is-deleted");
    if (scene.saved) row.classList.add("is-saved");

    const body = document.createElement("div");
    const title = document.createElement("div");
    title.className = "scene-title";
    const name = document.createElement("strong");
    name.textContent = scene.name;
    title.append(name);
    title.append(scenePalettePreview(scene));
    if (scene.kept && !scene.deleted) title.append(pill("APPROVED", "approved"));
    if (scene.saved) title.append(pill("SAVED", "keep"));
    body.append(title);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.append(
      pill(scene.scene_type, "hot"),
      pill(scene.layout),
      pill(`${Math.round(scene.energy * 100)}% energy`),
      pill(scenePaletteDisplayName(scene)),
    );
    body.append(meta);

    const tags = document.createElement("div");
    tags.className = "meta scene-tags";
    (scene.tags || []).forEach((tag) => {
      tags.append(pill(tag, String(tag).startsWith("palette-") ? "palette-pill" : "tag-pill"));
    });
    if (tags.children.length) body.append(tags);

    const assignments = document.createElement("div");
    assignments.className = "assignments";
    const activeAssignments = (scene.assignments || []).filter((assignment) => assignment.effect_type);
    const ignoredCount = (scene.assignments || []).filter((assignment) => !assignment.effect_type && assignment.action === "ignore").length;
    activeAssignments.forEach((assignment) => {
      const preset = assignment.preset ? ` / ${assignment.preset}` : "";
      const action = assignment.action === "ignore" ? "Ignore" : "Active";
      assignments.append(pill(`${assignment.virtual_id}: ${action} ${assignment.effect_type}${preset}`));
    });
    if (ignoredCount) assignments.append(pill(`${ignoredCount} ignored devices`));
    body.append(assignments);

    const actions = document.createElement("div");
    actions.className = "scene-actions";
    actions.append(
      actionButton("Preview", () => previewScene(scene.id), scene.deleted),
      actionButton(scene.kept ? "Unapprove" : "Approve", () => keepScene(scene.id, !scene.kept), scene.deleted),
      actionButton("Edit", () => openSceneEditor(scene.id), scene.deleted),
      actionButton("Regenerate", () => regenerateScene(scene.id)),
      actionButton("Delete", () => deleteScene(scene.id), scene.deleted, "danger"),
    );

    row.append(body, actions);
    els.sceneList.append(row);
  });
  sceneSummary();
  const activeScenes = state.scenes.filter((scene) => !scene.deleted);
  els.approveAllButton.disabled = !activeScenes.some((scene) => !scene.kept);
  els.unapproveAllButton.disabled = !activeScenes.some((scene) => scene.kept);
  els.saveButton.disabled = !state.scenes.some((scene) => scene.kept && !scene.deleted && !scene.saved);
  renderSimilarityReport();
}

function scenePalette(scene) {
  const palettes = (state.app && state.app.palettes) || [];
  if (!palettes.length || !scene) return null;
  const candidates = [
    scene.palette_id,
    scene.palette_name,
    ...sceneTags(scene)
      .filter((tag) => String(tag).toLowerCase().startsWith("palette-"))
      .map((tag) => String(tag).replace(/^palette[-_:]/i, "")),
  ]
    .filter(Boolean)
    .map(normalizePaletteToken);
  const exact = palettes.find((palette) => {
    const id = normalizePaletteToken(palette.id);
    const name = normalizePaletteToken(palette.name);
    return candidates.includes(id) || candidates.includes(name);
  });
  if (exact) return exact;

  const sceneName = normalizePaletteToken(scene.name || "");
  return [...palettes]
    .sort((a, b) => String(b.name || b.id).length - String(a.name || a.id).length)
    .find((palette) => {
      const id = normalizePaletteToken(palette.id);
      const name = normalizePaletteToken(palette.name);
      return (name && sceneName.includes(name)) || (id && sceneName.includes(id));
    }) || null;
}

function sceneGradientEntries(scene) {
  const entries = [];
  const seen = new Set();
  ((scene && scene.assignments) || []).forEach((assignment) => {
    if (!assignment.effect_type || assignment.action === "ignore") return;
    const config = assignment.config || {};
    Object.entries(config).forEach(([key, value]) => {
      if (!isSceneGradientField(key, value)) return;
      const normalized = normalizeGradientValue(value);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      const palette = paletteForGradientValue(value);
      const label = (palette && (palette.name || palette.id))
        || usableGradientName(config.gradient_name)
        || "Custom gradient";
      entries.push({
        gradient: value,
        palette,
        label,
      });
    });
  });
  return entries;
}

function isSceneGradientField(key, value) {
  return (
    typeof value === "string" &&
    value.includes("linear-gradient") &&
    String(key || "").toLowerCase().includes("gradient")
  );
}

function usableGradientName(value) {
  const clean = String(value || "").trim();
  if (!clean || /^current gradient$/i.test(clean)) return "";
  return clean;
}

function paletteForGradientValue(value) {
  const target = normalizeGradientValue(value);
  if (!target) return null;
  return ((state.app && state.app.palettes) || [])
    .find((palette) => {
      const gradient = palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS);
      return normalizeGradientValue(gradient) === target;
    }) || null;
}

function normalizePaletteToken(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function scenePalettePreview(scene, options = {}) {
  const fallback = options.fallback !== false;
  const compact = Boolean(options.compact);
  const gradients = sceneGradientEntries(scene);
  const palette = scenePalette(scene);
  if (!gradients.length && !palette && !fallback) return null;
  const preview = document.createElement("span");
  preview.className = `scene-palette-preview${compact ? " compact" : ""}${gradients.length > 1 ? " multi" : ""}`;
  const labelText = scenePaletteLabel(scene, gradients, palette);
  preview.title = `Palette: ${labelText}`;

  const stripGroup = document.createElement("span");
  stripGroup.className = "scene-palette-strip-group";
  if (gradients.length) {
    gradients.slice(0, compact ? 2 : 3).forEach((entry) => {
      const strip = document.createElement("span");
      strip.className = "scene-palette-strip";
      strip.style.background = entry.gradient;
      stripGroup.append(strip);
    });
    if (gradients.length > (compact ? 2 : 3)) {
      const more = document.createElement("span");
      more.className = "scene-palette-more";
      more.textContent = `+${gradients.length - (compact ? 2 : 3)}`;
      stripGroup.append(more);
    }
  } else if (palette) {
    const strip = document.createElement("span");
    strip.className = "scene-palette-strip";
    strip.style.background = palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS);
    stripGroup.append(strip);
  } else {
    const strip = document.createElement("span");
    strip.className = "scene-palette-strip";
    strip.style.background = "linear-gradient(90deg, #000000, #444444)";
    stripGroup.append(strip);
  }

  const label = document.createElement("span");
  label.className = "scene-palette-name";
  label.textContent = labelText;
  preview.append(stripGroup, label);
  return preview;
}

function scenePaletteLabel(scene, gradients, palette) {
  if (gradients.length > 1) {
    const labels = gradients
      .map((entry) => entry.label)
      .filter(Boolean)
      .filter((label, index, all) => all.indexOf(label) === index);
    return labels.length > 1 ? `${labels.length} gradients` : labels[0] || "Mixed gradients";
  }
  if (gradients.length === 1) return gradients[0].label;
  return scene.palette_name || (palette && palette.name) || scene.palette_id || "Palette";
}

function scenePaletteDisplayName(scene) {
  return scenePaletteLabel(scene, sceneGradientEntries(scene), scenePalette(scene));
}

function playlistPalettePreview(playlist) {
  const sceneById = new Map(state.ledfxLibrary.scenes.map((scene) => [scene.id, scene]));
  const palettes = [];
  (playlist.items || []).forEach((item) => {
    const scene = sceneById.get(item.scene_id);
    const palette = scenePalette(scene);
    if (palette && !palettes.some((known) => known.id === palette.id)) {
      palettes.push(palette);
    }
  });
  if (!palettes.length) return null;
  const preview = document.createElement("span");
  preview.className = "playlist-palette-preview";
  preview.title = `Playlist palettes: ${palettes.map((palette) => palette.name || palette.id).join(", ")}`;
  palettes.slice(0, 5).forEach((palette) => {
    const strip = document.createElement("span");
    strip.className = "scene-palette-strip";
    strip.style.background = palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS);
    preview.append(strip);
  });
  if (palettes.length > 5) {
    const more = document.createElement("span");
    more.className = "playlist-palette-more";
    more.textContent = `+${palettes.length - 5}`;
    preview.append(more);
  }
  return preview;
}

function pill(text, extraClass = "") {
  const item = document.createElement("span");
  item.className = `pill ${extraClass}`.trim();
  item.textContent = text;
  return item;
}

function actionButton(text, handler, disabled = false, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.disabled = disabled;
  if (className) button.classList.add(className);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    handler(event);
  });
  return button;
}

function openSceneEditor(sceneId) {
  state.editingPreset = null;
  state.editingSceneId = sceneId;
  renderPresetEditor();
  renderSceneEditorModal();
  renderScenes();
}

function renderSceneEditorModal() {
  els.sceneEditorHost.innerHTML = "";
  els.sceneEditorHost.hidden = true;
  if (!state.editingSceneId) return;
  const scene = state.scenes.find((item) => item.id === state.editingSceneId && !item.deleted);
  if (!scene) {
    state.editingSceneId = null;
    return;
  }
  els.sceneEditorHost.hidden = false;
  els.sceneEditorHost.append(renderSceneEditor(scene));
  openModal("Edit Scene");
}

function closeSceneEditor() {
  state.editingSceneId = null;
  renderSceneEditorModal();
  hideModal();
  renderScenes();
}

function renderSceneEditor(scene) {
  const editor = document.createElement("div");
  editor.className = "scene-editor";
  editor.dataset.sceneId = scene.id;

  const head = document.createElement("div");
  head.className = "scene-editor-head";
  const title = document.createElement("strong");
  title.textContent = "Scene parameters";
  const note = document.createElement("span");
  note.textContent = "Edit generated config before preview or save";
  head.append(title, note);

  const nameLabel = document.createElement("label");
  nameLabel.className = "scene-name-field";
  const nameText = document.createElement("span");
  nameText.textContent = "Scene name";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = scene.name;
  nameInput.dataset.sceneName = "true";
  nameLabel.append(nameText, nameInput);

  editor.append(head, nameLabel);

  editor.append(sceneDeviceTable(scene.assignments), sceneParameterSections(scene.assignments));

  const actions = document.createElement("div");
  actions.className = "scene-editor-actions";
  actions.append(
    actionButton("Apply Params", () => applySceneEdits(scene.id)),
    actionButton("Apply + Preview", () => applySceneEdits(scene.id, true)),
    actionButton("Close", closeSceneEditor),
  );
  editor.append(actions);
  return editor;
}

function sceneDeviceTable(assignments) {
  const table = document.createElement("div");
  table.className = "scene-device-table";

  const header = document.createElement("div");
  header.className = "scene-device-row scene-device-header";
  ["Device", "Effect", "Preset", "Action"].forEach((label) => {
    const cell = document.createElement("span");
    cell.textContent = label;
    header.append(cell);
  });
  table.append(header);

  assignments.forEach((assignment, assignmentIndex) => {
    const ignored = assignment.action === "ignore" || !assignment.effect_type;
    const row = document.createElement("div");
    row.className = `scene-device-row ${ignored ? "is-ignore" : "is-active"}`;

    row.append(
      deviceCell(assignment.virtual_id),
      sceneEffectCell(assignment, assignmentIndex, assignments),
      scenePresetCell(assignment, assignmentIndex),
      sceneActionCell(assignment, assignmentIndex),
    );
    table.append(row);
  });
  return table;
}

function deviceCell(virtualId) {
  const cell = document.createElement("div");
  cell.className = "scene-device-cell scene-device-name";
  const virtual = ((state.app && state.app.virtuals) || []).find((item) => item.id === virtualId);
  const name = virtual ? virtual.name || virtual.id : virtualId;
  const main = document.createElement("strong");
  main.textContent = name;
  cell.append(main);
  if (name !== virtualId) {
    const id = document.createElement("small");
    id.textContent = virtualId;
    cell.append(id);
  }
  return cell;
}

function sceneDeviceTextCell(text, muted = false) {
  const cell = document.createElement("div");
  cell.className = `scene-device-cell ${muted ? "is-muted" : ""}`.trim();
  cell.textContent = text;
  return cell;
}

function sceneActionCell(assignment, assignmentIndex) {
  const cell = document.createElement("div");
  cell.className = "scene-device-cell scene-device-action";
  const select = document.createElement("select");
  select.dataset.assignmentIndex = String(assignmentIndex);
  select.dataset.assignmentAction = "true";
  select.append(option("Activate", "activate"), option("Ignore", "ignore"));
  select.value = assignment.action === "ignore" ? "ignore" : "activate";
  select.addEventListener("change", () => {
    updateSceneAssignmentDraft(assignmentIndex, {action: select.value});
  });
  cell.append(select);
  return cell;
}

function sceneEffectCell(assignment, assignmentIndex, assignments) {
  const cell = document.createElement("div");
  cell.className = "scene-device-cell scene-device-effect";
  const select = document.createElement("select");
  select.dataset.assignmentIndex = String(assignmentIndex);
  select.dataset.assignmentEffect = "true";
  select.append(option("No effect", ""));
  availableEffectTypes(assignments).forEach((effectType) => {
    select.append(option(effectType, effectType));
  });
  select.value = assignment.effect_type || "";
  select.disabled = assignment.action === "ignore";
  select.addEventListener("change", () => {
    updateSceneAssignmentDraft(assignmentIndex, {
      action: select.value ? "activate" : "ignore",
      effect_type: select.value,
    });
  });
  cell.append(select);
  return cell;
}

function scenePresetCell(assignment, assignmentIndex) {
  const cell = document.createElement("div");
  cell.className = "scene-device-cell scene-device-preset";
  const select = document.createElement("select");
  select.dataset.assignmentIndex = String(assignmentIndex);
  select.dataset.assignmentPreset = "true";
  select.append(option(assignment.effect_type ? "Custom/current config" : "-", ""));
  presetsForEffect(assignment.effect_type).forEach((preset) => {
    select.append(option(`${preset.name || preset.id} (${preset.source})`, presetValue(preset)));
  });
  const currentValue = assignment.preset
    ? presetValue({id: assignment.preset, category: assignment.preset_category || "ledfx_presets"})
    : "";
  if (currentValue && ![...select.options].some((item) => item.value === currentValue)) {
    select.append(option(`${assignment.preset} (missing)`, currentValue));
  }
  select.value = currentValue;
  select.disabled = assignment.action === "ignore" || !assignment.effect_type;
  select.addEventListener("change", () => {
    updateSceneAssignmentDraft(assignmentIndex, {preset_key: select.value});
  });
  cell.append(select);
  return cell;
}

function availableEffectTypes(assignments = []) {
  const schemas = (state.app && state.app.effect_schemas) || {};
  const names = new Set(Object.keys(schemas));
  assignments.forEach((assignment) => {
    if (assignment.effect_type) names.add(assignment.effect_type);
  });
  return [...names].sort((left, right) => left.localeCompare(right));
}

function defaultSceneEffectType(assignments = []) {
  const active = assignments.find((assignment) => assignment.effect_type);
  if (active) return active.effect_type;
  return availableEffectTypes(assignments)[0] || "";
}

function defaultEffectConfig(effectType) {
  const props =
    state.app &&
    state.app.effect_schemas &&
    state.app.effect_schemas[effectType] &&
    state.app.effect_schemas[effectType].properties;
  if (!props) return {};
  const config = {};
  Object.entries(props).forEach(([key, spec]) => {
    if (!spec || typeof spec !== "object" || !Object.prototype.hasOwnProperty.call(spec, "default")) {
      return;
    }
    config[key] = cloneDefaultValue(spec.default);
  });
  return config;
}

function cloneDefaultValue(value) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return JSON.parse(JSON.stringify(value));
  }
  return value;
}

function updateSceneAssignmentDraft(assignmentIndex, patch) {
  const editor = currentSceneEditorElement();
  const assignments = currentEditorAssignments();
  if (!editor || !assignments || !assignments[assignmentIndex]) return;
  syncSceneParamDraft(editor, assignments);
  const assignment = assignments[assignmentIndex];
  if (patch.effect_type !== undefined && patch.effect_type !== assignment.effect_type) {
    assignment.effect_type = patch.effect_type;
    assignment.preset = null;
    assignment.preset_category = null;
    assignment.config = patch.effect_type ? defaultEffectConfig(patch.effect_type) : {};
  }
  if (patch.preset_key !== undefined) {
    const preset = findPreset(assignment.effect_type, patch.preset_key);
    if (preset) {
      assignment.preset = preset.id;
      assignment.preset_category = preset.category;
      assignment.config = cloneDefaultValue(preset.config || {});
    } else {
      assignment.preset = null;
      assignment.preset_category = null;
    }
  }
  if (patch.action) {
    assignment.action = patch.action;
  }
  if (assignment.action === "activate" && !assignment.effect_type) {
    assignment.effect_type = defaultSceneEffectType(assignments);
    assignment.preset = null;
    assignment.preset_category = null;
    assignment.config = assignment.effect_type ? defaultEffectConfig(assignment.effect_type) : {};
  }
  if (!assignment.effect_type) {
    assignment.action = "ignore";
    assignment.config = {};
  }
  refreshSceneDeviceEditor(editor, assignments);
}

function currentSceneEditorElement() {
  if (state.editingPublishedSceneId) {
    return els.sceneEditorHost.querySelector(".published-scene-editor");
  }
  if (state.editingSceneId) {
    return els.sceneEditorHost.querySelector(".scene-editor");
  }
  return null;
}

function currentEditorAssignments() {
  if (state.editingPublishedSceneId) {
    const scene = state.ledfxLibrary.scenes.find((item) => item.id === state.editingPublishedSceneId);
    return scene && scene.assignments;
  }
  if (state.editingSceneId) {
    const scene = state.scenes.find((item) => item.id === state.editingSceneId);
    return scene && scene.assignments;
  }
  return null;
}

function syncSceneParamDraft(editor, assignments) {
  editor.querySelectorAll("[data-param-key]").forEach((input) => {
    const index = Number(input.dataset.assignmentIndex);
    if (!assignments[index]) return;
    try {
      assignments[index].config[input.dataset.paramKey] = parseParamInput(input);
    } catch (error) {
      // Keep the last valid value while the user is still editing an incomplete input.
    }
  });
}

function refreshSceneDeviceEditor(editor, assignments) {
  const nextTable = sceneDeviceTable(assignments);
  const nextParams = sceneParameterSections(assignments);
  const table = editor.querySelector(".scene-device-table");
  const params = editor.querySelector(".scene-param-sections");
  if (table) table.replaceWith(nextTable);
  if (params) params.replaceWith(nextParams);
}

function sceneParameterSections(assignments) {
  const wrap = document.createElement("div");
  wrap.className = "scene-param-sections";
  const effectAssignments = assignments
    .map((assignment, index) => ({assignment, index}))
    .filter((item) => item.assignment.effect_type && item.assignment.action !== "ignore");
  if (!effectAssignments.length) {
    wrap.append(emptyNote("No editable effect parameters."));
    return wrap;
  }
  const title = document.createElement("h3");
  title.textContent = "Effect parameters";
  wrap.append(title);
  effectAssignments.forEach(({assignment, index}) => {
    const section = document.createElement("section");
    section.className = "assignment-editor";

    const assignmentTitle = document.createElement("div");
    assignmentTitle.className = "assignment-editor-title";
    const main = document.createElement("strong");
    main.textContent = `${assignment.virtual_id}: ${assignment.effect_type}`;
    assignmentTitle.append(main, assignmentStatusPill(assignment));
    if (assignment.preset) {
      const preset = document.createElement("span");
      preset.textContent = assignment.preset;
      assignmentTitle.append(preset);
    }

    const grid = document.createElement("div");
    grid.className = "param-grid";
    const entries = Object.entries(assignment.config || {});
    entries
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .forEach(([key, value]) => {
        grid.append(paramField(assignment, index, key, value));
      });

    section.append(assignmentTitle);
    if (entries.length) {
      section.append(grid);
    } else {
      section.append(emptyNote("No editable parameters for this effect."));
    }
    section.querySelectorAll("[data-gradient-preview='true']").forEach((input) => {
      syncGradientNameInput(input, true);
    });
    wrap.append(section);
  });
  return wrap;
}

function assignmentStatusPill(assignment) {
  const ignored = assignment.action === "ignore" || !assignment.effect_type;
  return pill(ignored ? "Ignore" : "Active", ignored ? "ignore" : "active");
}

function assertUniqueAssignmentTargets(assignments) {
  const seen = new Set();
  for (const assignment of assignments) {
    if (!assignment.effect_type && assignment.action === "ignore") {
      continue;
    }
    const target = assignment.target_virtual_id || assignment.virtual_id;
    if (!target) throw new Error("Select a target device for each effect.");
    if (seen.has(target)) {
      throw new Error(`Target device "${target}" is used more than once in this scene.`);
    }
    seen.add(target);
  }
}

function paramField(assignment, assignmentIndex, key, value) {
  const label = document.createElement("label");
  label.className = "param-field";
  const text = document.createElement("span");
  text.textContent = key;
  const input = paramInput(assignment, assignmentIndex, key, value);
  label.append(text, input);
  if (input.dataset.gradientPreview === "true") {
    const preview = document.createElement("span");
    preview.className = "param-gradient-preview";
    const update = () => {
      preview.style.background = input.value || "linear-gradient(90deg, #000000, #444444)";
    };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
    update();
    label.append(preview);
  }
  return label;
}

function paramInput(assignment, assignmentIndex, key, value) {
  const spec = effectParamSpec(assignment.effect_type, key);
  const type = paramValueType(value);
  const enumValues = Array.isArray(spec.enum) ? spec.enum : [];
  const isPaletteGradient = isGradientParam(key, value, spec);
  const input =
    enumValues.length || isPaletteGradient
      ? document.createElement("select")
      : type === "json"
        ? document.createElement("textarea")
        : document.createElement("input");
  input.dataset.assignmentIndex = String(assignmentIndex);
  input.dataset.paramKey = key;
  input.dataset.valueType = type;

  if (enumValues.length) {
    addSelectOptions(input, enumValues, value);
    input.value = String(value);
  } else if (isPaletteGradient) {
    addGradientOptions(input, value);
    input.value = String(value);
    input.dataset.gradientPreview = "true";
    input.addEventListener("change", () => syncGradientNameInput(input));
  } else if (type === "boolean") {
    input.type = "checkbox";
    input.checked = Boolean(value);
  } else if (type === "integer" || type === "number") {
    input.type = "number";
    input.step = type === "integer" ? "1" : "0.001";
    if (spec.minimum !== undefined) input.min = String(spec.minimum);
    if (spec.maximum !== undefined) input.max = String(spec.maximum);
    input.value = String(value);
  } else if (type === "color") {
    input.type = "color";
    input.value = value;
  } else if (type === "json") {
    input.rows = 4;
    input.spellcheck = false;
    input.value = JSON.stringify(value, null, 2);
  } else {
    input.type = "text";
    input.value = value === null || value === undefined ? "" : String(value);
  }
  return input;
}

function effectParamSpec(effectType, key) {
  return (
    state.app &&
    state.app.effect_schemas &&
    state.app.effect_schemas[effectType] &&
    state.app.effect_schemas[effectType].properties &&
    state.app.effect_schemas[effectType].properties[key]
  ) || {};
}

function addSelectOptions(select, values, currentValue) {
  const seen = new Set();
  values.forEach((value) => {
    const stringValue = String(value);
    seen.add(stringValue);
    select.append(option(stringValue, stringValue));
  });
  const current = String(currentValue);
  if (!seen.has(current)) {
    select.prepend(option(current, current));
  }
}

function isGradientParam(key, value, spec) {
  return (
    typeof value === "string" &&
    (spec.gradient || key.toLowerCase().includes("gradient")) &&
    value.includes("linear-gradient")
  );
}

function addGradientOptions(select, currentValue) {
  const currentPaletteName = paletteNameForGradientValue(currentValue);
  const current = option(currentPaletteName ? `${currentPaletteName} (current)` : "Current gradient", currentValue);
  current.dataset.gradientName = currentPaletteName || "Current gradient";
  select.append(current);
  const palettes = selectedPalettes().length ? selectedPalettes() : (state.app && state.app.palettes) || [];
  palettes.forEach((palette) => {
    const value = palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS);
    const label = palette.name || palette.id;
    if (![...select.options].some((item) => item.value === value)) {
      const item = option(label, value);
      item.dataset.gradientName = label;
      select.append(item);
    }
  });
}

function syncGradientNameInput(gradientInput, onlyIfPaletteMatch = false) {
  const editor = gradientInput.closest(".scene-editor");
  if (!editor) return;
  const index = gradientInput.dataset.assignmentIndex;
  const nameInput = editor.querySelector(
    `[data-param-key="gradient_name"][data-assignment-index="${index}"]`,
  );
  if (!nameInput) return;
  const matchedPalette = paletteNameForGradientValue(gradientInput.value);
  if (onlyIfPaletteMatch && !matchedPalette) return;
  const selected = gradientInput.selectedOptions && gradientInput.selectedOptions[0];
  const gradientName = selected && selected.dataset.gradientName
    ? selected.dataset.gradientName
    : selected && selected.textContent
      ? selected.textContent
      : "Current gradient";
  nameInput.value = matchedPalette || gradientName || "Current gradient";
}

function paletteNameForGradientValue(value) {
  const palette = paletteForGradientValue(value);
  return palette ? palette.name || palette.id || "" : "";
}

function normalizeGradientValue(value) {
  return String(value || "").replace(/\s+/g, "").toLowerCase();
}

function paramValueType(value) {
  if (typeof value === "boolean") return "boolean";
  if (Number.isInteger(value)) return "integer";
  if (typeof value === "number") return "number";
  if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) return "color";
  if (Array.isArray(value) || (value && typeof value === "object")) return "json";
  return "string";
}

function collectSceneEditorPayload(sceneId) {
  const editor = [...document.querySelectorAll(".scene-editor")].find(
    (node) => node.dataset.sceneId === sceneId,
  );
  const scene = state.scenes.find((item) => item.id === sceneId);
  if (!editor || !scene) throw new Error("Scene editor is not open.");

  const assignments = scene.assignments.map((assignment, index) => ({
    assignment_index: index,
    virtual_id: assignment.virtual_id,
    effect_type: editor.querySelector(`[data-assignment-effect][data-assignment-index="${index}"]`)?.value || assignment.effect_type || "",
    ...assignmentPresetPayload(editor, index),
    target_virtual_id: assignment.virtual_id,
    action: editor.querySelector(`[data-assignment-action][data-assignment-index="${index}"]`)?.value || assignment.action || "activate",
    config: {},
  }));
  editor.querySelectorAll("[data-param-key]").forEach((input) => {
    const index = Number(input.dataset.assignmentIndex);
    assignments[index].config[input.dataset.paramKey] = parseParamInput(input);
  });

  const nameInput = editor.querySelector("[data-scene-name]");
  assertUniqueAssignmentTargets(assignments);
  return {
    scene_id: sceneId,
    name: nameInput.value.trim() || scene.name,
    assignments,
  };
}

function assignmentPresetPayload(editor, index) {
  const value = editor.querySelector(`[data-assignment-preset][data-assignment-index="${index}"]`)?.value || "";
  const {category, id} = parsePresetValue(value);
  return {
    preset: id || "",
    preset_category: category || "",
  };
}

function parseParamInput(input) {
  const key = input.dataset.paramKey;
  if (input.dataset.valueType === "boolean") return input.checked;
  if (input.dataset.valueType === "integer") {
    const value = Number(input.value);
    if (!Number.isFinite(value)) throw new Error(`Invalid number: ${key}`);
    return Math.round(value);
  }
  if (input.dataset.valueType === "number") {
    const value = Number(input.value);
    if (!Number.isFinite(value)) throw new Error(`Invalid number: ${key}`);
    return value;
  }
  if (input.dataset.valueType === "json") {
    try {
      return JSON.parse(input.value);
    } catch (error) {
      throw new Error(`Invalid JSON: ${key}`);
    }
  }
  return input.value;
}

async function applySceneEdits(sceneId, previewAfter = false) {
  try {
    const payload = collectSceneEditorPayload(sceneId);
    const data = await api("/api/update-scene", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    replaceScene(data.scene);
    if (previewAfter) {
      await previewScene(sceneId);
      renderSceneEditorModal();
    } else {
      renderScenes();
      renderSceneEditorModal();
      showToast("Scene parameters updated.");
    }
  } catch (error) {
    showToast(error.message);
  }
}

async function generate(event) {
  event.preventDefault();
  const options = collectOptions();
  if (options.virtual_ids.length === 0) {
    showToast("Select at least one Device.");
    return;
  }
  els.generateButton.disabled = true;
  els.generateButton.textContent = "Generating...";
  try {
    const data = await api("/api/generate", {
      method: "POST",
      body: JSON.stringify(options),
    });
    state.scenes = data.scenes || [];
    state.similarityReport = data.similarity_report || null;
    state.selectedSceneId = null;
    state.editingSceneId = null;
    renderScenes();
    showToast(`Generated ${state.scenes.length} scenes. Use Send to LedFx to publish approved scenes.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    els.generateButton.disabled = false;
    els.generateButton.textContent = "Generate";
  }
}

async function previewScene(sceneId) {
  try {
    await api("/api/preview", {
      method: "POST",
      body: JSON.stringify({scene_id: sceneId}),
    });
    state.selectedSceneId = sceneId;
    await refreshTopDevicePreviewState();
    renderScenes();
    showToast("Preview applied in LedFx.");
  } catch (error) {
    showToast(error.message);
  }
}

async function restorePreview() {
  try {
    await api("/api/preview/restore", {method: "POST", body: "{}"});
    state.selectedSceneId = null;
    await refreshTopDevicePreviewState();
    renderScenes();
    showToast("Preview restored.");
  } catch (error) {
    showToast(error.message);
  }
}

async function keepScene(sceneId, kept) {
  try {
    const data = await api("/api/keep", {
      method: "POST",
      body: JSON.stringify({scene_id: sceneId, kept}),
    });
    replaceScene(data.scene);
    if (state.editingSceneId === sceneId && data.scene.deleted) {
      state.editingSceneId = null;
    }
    renderScenes();
  } catch (error) {
    showToast(error.message);
  }
}

async function setAllSceneApproval(approved) {
  const targets = state.scenes.filter((scene) => !scene.deleted && scene.kept !== approved);
  if (!targets.length) {
    showToast(approved ? "All visible scenes are already approved." : "No approved scenes to unapprove.");
    return;
  }
  els.approveAllButton.disabled = true;
  els.unapproveAllButton.disabled = true;
  try {
    let changed = 0;
    for (const scene of targets) {
      const data = await api("/api/keep", {
        method: "POST",
        body: JSON.stringify({scene_id: scene.id, kept: approved}),
      });
      replaceScene(data.scene);
      changed += 1;
    }
    renderScenes();
    showToast(`${approved ? "Approved" : "Unapproved"} ${changed} scenes.`);
  } catch (error) {
    renderScenes();
    showToast(error.message);
  }
}

async function deleteScene(sceneId) {
  try {
    const data = await api("/api/delete-scene", {
      method: "POST",
      body: JSON.stringify({scene_id: sceneId}),
    });
    replaceScene(data.scene);
    if (state.editingSceneId === sceneId) {
      closeSceneEditor();
    }
    renderScenes();
  } catch (error) {
    showToast(error.message);
  }
}

async function regenerateScene(sceneId) {
  try {
    const data = await api("/api/regenerate", {
      method: "POST",
      body: JSON.stringify({scene_id: sceneId, options: collectOptions()}),
    });
    const index = state.scenes.findIndex((scene) => scene.id === sceneId);
    if (index >= 0) {
      state.scenes.splice(index, 1, data.scene);
    } else {
      state.scenes.push(data.scene);
    }
    state.similarityReport = data.similarity_report || null;
    state.selectedSceneId = null;
    if (state.editingSceneId === sceneId) {
      state.editingSceneId = data.scene.id;
      renderSceneEditorModal();
    }
    renderScenes();
    showToast("Scene regenerated. Use Send to LedFx to publish approved scenes.");
  } catch (error) {
    showToast(error.message);
  }
}

async function saveBatch() {
  const sceneIds = state.scenes
    .filter((scene) => scene.kept && !scene.deleted && !scene.saved)
    .map((scene) => scene.id);
  if (sceneIds.length === 0) return;
  els.saveButton.disabled = true;
  els.saveButton.textContent = "Sending...";
  try {
    const data = await api("/api/save-batch", {
      method: "POST",
      body: JSON.stringify({scene_ids: sceneIds}),
    });
    const savedIds = new Set((data.saved || []).map((item) => item.id));
    const savedById = new Map((data.saved || []).map((item) => [item.id, item]));
    state.scenes.forEach((scene) => {
      if (savedIds.has(scene.id)) {
        scene.saved = true;
        scene.ledfx_scene_id = savedById.get(scene.id).ledfx_scene_id || scene.ledfx_scene_id;
      }
    });
    await loadLedFxLibrary(false);
    if (els.presetModeSelect.value !== "existing") {
      await refreshAppCatalog();
    }
    renderScenes();
    const firstError = data.errors && data.errors[0] ? `: ${data.errors[0].error}` : "";
    const errorText = data.errors && data.errors.length ? `, ${data.errors.length} failed${firstError}` : "";
    const presetErrors = (data.preset_errors || []).length;
    const presetText = presetErrors ? `, ${presetErrors} preset errors` : "";
    showToast(`Saved ${savedIds.size} scenes${presetText}${errorText}.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    els.saveButton.textContent = "Send to LedFX";
    renderScenes();
  }
}

function replaceScene(scene) {
  const index = state.scenes.findIndex((item) => item.id === scene.id);
  if (index >= 0) {
    state.scenes.splice(index, 1, scene);
  }
}

els.form.addEventListener("submit", generate);
els.closeModalButton.addEventListener("click", closeModal);
els.modalBackdrop.addEventListener("click", (event) => {
  if (event.target === els.modalBackdrop) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.modalBackdrop.hidden) closeModal();
});
document.addEventListener("pointerover", (event) => {
  const button = event.target.closest && event.target.closest(".info-button");
  if (button) showInfoTooltip(button);
});
document.addEventListener("pointermove", (event) => {
  const button = event.target.closest && event.target.closest(".info-button");
  if (button) positionInfoTooltip(button);
});
document.addEventListener("pointerout", (event) => {
  const button = event.target.closest && event.target.closest(".info-button");
  if (!button) return;
  if (event.relatedTarget && button.contains(event.relatedTarget)) return;
  hideInfoTooltip();
});
document.addEventListener("focusin", (event) => {
  const button = event.target.closest && event.target.closest(".info-button");
  if (button) showInfoTooltip(button);
});
document.addEventListener("focusout", (event) => {
  const button = event.target.closest && event.target.closest(".info-button");
  if (button) hideInfoTooltip();
});
window.addEventListener("resize", hideInfoTooltip);
window.addEventListener("scroll", hideInfoTooltip, true);
els.factoryTabButton.addEventListener("click", () => setAppView("factory"));
els.presetLabTabButton.addEventListener("click", () => setAppView("presets"));
els.effectForgeTabButton.addEventListener("click", () => setAppView("forge"));
els.midiMapperTabButton.addEventListener("click", () => setAppView("midi"));
if (els.forgeGenerateButton) {
  els.forgeGenerateButton.addEventListener("click", generateForgeDraft);
}
els.forgeRandomizeButton.addEventListener("click", randomizeForgeDraft);
els.forgeSaveAsButton.addEventListener("click", saveForgeDraft);
els.forgeBehaviorSelect.addEventListener("change", updateForgeBehaviorDefaults);
[
  els.forgeEffectNameInput,
  els.forgeReactivitySelect,
  els.forgeFrequencySelect,
  els.forgeIntensityInput,
  els.forgeMotionInput,
  els.forgeDetailInput,
  els.forgeDecayInput,
  els.forgeFlashInput,
].forEach((input) => {
  input.addEventListener("input", generateForgeDraft);
  input.addEventListener("change", generateForgeDraft);
});
els.copyForgeCodeButton.addEventListener("click", () => copyForgeOutput(els.forgeCodeOutput, "Code"));
els.copyForgeProfileButton.addEventListener("click", () => copyForgeOutput(els.forgeProfileOutput, "Profile"));
els.copyForgeInstructionsButton.addEventListener("click", () => copyForgeOutput(els.forgeInstructionsOutput, "Instructions"));
els.midiConnectButton.addEventListener("click", connectMidi);
els.midiRefreshLibraryButton.addEventListener("click", () => loadLedFxLibrary(true));
els.midiInputSelect.addEventListener("change", () => {
  selectMidiInput(els.midiInputSelect.value);
  renderMidiMapper();
});
els.midiStopButton.addEventListener("click", () => controlPlaylist("stop"));
els.midiPrevButton.addEventListener("click", () => controlPlaylist("prev"));
els.midiNextButton.addEventListener("click", () => controlPlaylist("next"));
els.midiMapStopButton.addEventListener("click", () => startMidiLearn(midiTransportTarget("stop")));
els.midiMapPrevButton.addEventListener("click", () => startMidiLearn(midiTransportTarget("prev")));
els.midiMapNextButton.addEventListener("click", () => startMidiLearn(midiTransportTarget("next")));
els.midiClearMappingsButton.addEventListener("click", clearMidiMappings);
els.saveConnectionButton.addEventListener("click", saveConnection);
els.topPreviewDeviceSelect.addEventListener("change", () => {
  state.topPreviewDeviceId = els.topPreviewDeviceSelect.value;
  localStorage.setItem("lsf.top_preview_device", state.topPreviewDeviceId);
  const virtual = ((state.app && state.app.virtuals) || []).find((item) => item.id === state.topPreviewDeviceId);
  updateTopDevicePreview(virtual);
  connectTopPreviewStream();
});
els.appGuideButton.addEventListener("click", openTabsGuide);
els.refreshButton.addEventListener("click", loadAppState);
els.restoreButton.addEventListener("click", restorePreview);
els.approveAllButton.addEventListener("click", () => setAllSceneApproval(true));
els.unapproveAllButton.addEventListener("click", () => setAllSceneApproval(false));
els.saveButton.addEventListener("click", saveBatch);
els.refreshPresetButton.addEventListener("click", loadAppState);
els.restorePresetPreviewButton.addEventListener("click", restorePreview);
els.generatePresetButton.addEventListener("click", generatePresets);
els.sendPresetDraftsButton.addEventListener("click", sendPresetDrafts);
els.clearPresetDraftsButton.addEventListener("click", clearPresetDrafts);
els.presetEffectSelect.addEventListener("change", () => {
  state.activePresetEffect = els.presetEffectSelect.value;
  renderPresetLab();
});
els.presetPaletteSelect.addEventListener("change", renderPresetPalettePreview);
els.previewPresetEditButton.addEventListener("click", previewEditingPreset);
els.savePresetEditButton.addEventListener("click", savePresetEdit);
els.closePresetEditorButton.addEventListener("click", closePresetEditor);
els.refreshLibraryButton.addEventListener("click", () => loadLedFxLibrary(true));
els.shortenLsfButton.addEventListener("click", shortenLsfNames);
els.selectAllLibraryScenesButton.addEventListener("click", selectAllLibraryScenes);
els.selectFilteredLibraryScenesButton.addEventListener("click", selectFilteredLibraryScenes);
els.clearLibrarySelectionButton.addEventListener("click", clearLibrarySelection);
els.tagSelectedScenesButton.addEventListener("click", tagSelectedLibraryScenes);
els.deleteSelectedScenesButton.addEventListener("click", deleteSelectedLibraryScenes);
els.newPlaylistButton.addEventListener("click", newPlaylist);
els.selectLsfScenesButton.addEventListener("click", selectLsfScenes);
els.selectFilteredScenesButton.addEventListener("click", selectFilteredScenes);
els.clearPlaylistScenesButton.addEventListener("click", clearPlaylistScenes);
els.savePlaylistButton.addEventListener("click", savePlaylist);
els.stopPlaylistButton.addEventListener("click", () => controlPlaylist("stop"));
els.prevPlaylistButton.addEventListener("click", () => controlPlaylist("prev"));
els.nextPlaylistButton.addEventListener("click", () => controlPlaylist("next"));
els.libraryTagFilterInput.addEventListener("input", renderLedFxLibrary);
els.playlistTagFilterInput.addEventListener("input", renderPlaylistScenePicker);
bindRangeValue(els.energyInput, els.energyValue);
bindRangeValue(els.variationInput, els.variationValue);
bindRangeValue(els.brightnessInput, els.brightnessValue);
bindRangeValue(els.movementInput, els.movementValue);
bindRangeValue(els.audioResponseInput, els.audioResponseValue);
bindRangeValue(els.densityInput, els.densityValue);
bindRangeValue(els.flashInput, els.flashValue);
bindRangeValue(els.presetEnergyInput, els.presetEnergyValue);
bindRangeValue(els.presetVariationInput, els.presetVariationValue);
bindRangeValue(els.forgeIntensityInput, els.forgeIntensityValue);
bindRangeValue(els.forgeMotionInput, els.forgeMotionValue);
bindRangeValue(els.forgeDetailInput, els.forgeDetailValue);
bindRangeValue(els.forgeDecayInput, els.forgeDecayValue);
bindRangeValue(els.forgeFlashInput, els.forgeFlashValue);
els.styleSelect.addEventListener("change", () => {
  applyStyleDefaults(els.styleSelect.value);
  renderStyleDescription();
});
els.layoutSelect.addEventListener("change", renderLayoutDescription);
els.editStyleButton.addEventListener("click", editCurrentStyle);
els.newStyleButton.addEventListener("click", newStyle);
els.deleteStyleButton.addEventListener("click", deleteCurrentStyle);
els.saveStyleButton.addEventListener("click", saveStyle);
els.closeStyleEditorButton.addEventListener("click", closeStyleEditor);
els.paletteSelect.addEventListener("change", updatePalettePreview);
els.paletteGradientPreview.addEventListener("click", openGradientStopFromBar);
els.selectAllPalettesButton.addEventListener("click", selectAllPalettes);
els.unselectAllPalettesButton.addEventListener("click", unselectAllPalettes);
els.newPaletteButton.addEventListener("click", newPalette);
els.randomPaletteButton.addEventListener("click", randomizePaletteGradient);
els.paletteBlackStartInput.addEventListener("change", updatePaletteBlackStart);
els.savePaletteButton.addEventListener("click", savePalette);
els.closePaletteEditorButton.addEventListener("click", closePaletteEditor);
els.selectAllSceneTypesButton.addEventListener("click", () => setCheckedValues(els.sceneTypeList, "scene_type", true));
els.unselectAllSceneTypesButton.addEventListener("click", () => setCheckedValues(els.sceneTypeList, "scene_type", false));

initializeAppView();
renderForgeBehaviorOptions();
generateForgeDraft();
loadAppState();
