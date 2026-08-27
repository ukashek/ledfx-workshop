const MIDI_MAPPINGS_KEY = "lsf.midi_mappings";
const MIDI_CONTROLLER_KEY = "lsf.midi_controller_settings";
const MIDI_PROFILES_KEY = "lsf.midi_profiles";
const MIDI_SELECTED_PROFILE_KEY = "lsf.midi_profile";
const MIDI_LAYOUT_KEY = "lsf.midi_layout";
const MIDI_LAYOUT_CUSTOM_TEMPLATES_KEY = "lsf.midi_layout_templates";
const MIDI_LAYOUT_ACTIVITY_MS = 900;
const MIDI_LAYOUT_ZOOM_KEY = "lsf.midi_layout_zoom";

const DEFAULT_MIDI_CONTROLLER = {
  colorOn: 87,
  colorOff: 0,
  feedbackMode: "latch",
  ledProtocol: "akai_apc_mini_mk2",
  colorTable: "apc_mk2",
  restoreBrightness: 1,
};

const MIDI_COLOR_OPTIONS = [
  {label: "Black", value: 0, hex: "#000000"},
  {label: "Dim gray", value: 1, hex: "#1E1E1E"},
  {label: "Gray", value: 2, hex: "#7F7F7F"},
  {label: "White", value: 3, hex: "#FFFFFF"},
  {label: "Light red", value: 4, hex: "#FF4C4C"},
  {label: "Red", value: 5, hex: "#FF0000"},
  {label: "Dark red", value: 6, hex: "#590000"},
  {label: "Deep red", value: 7, hex: "#190000"},
  {label: "Peach", value: 8, hex: "#FFBD6C"},
  {label: "Orange", value: 9, hex: "#FF5400"},
  {label: "Burnt orange", value: 10, hex: "#591D00"},
  {label: "Dark amber", value: 11, hex: "#271B00"},
  {label: "Pale yellow", value: 12, hex: "#FFFF4C"},
  {label: "Yellow", value: 13, hex: "#FFFF00"},
  {label: "Olive", value: 14, hex: "#595900"},
  {label: "Dark olive", value: 15, hex: "#191900"},
  {label: "Lime", value: 16, hex: "#88FF4C"},
  {label: "Neon green", value: 17, hex: "#54FF00"},
  {label: "Forest green", value: 18, hex: "#1D5900"},
  {label: "Dark green", value: 19, hex: "#142B00"},
  {label: "Light green", value: 20, hex: "#4CFF4C"},
  {label: "Green", value: 21, hex: "#00FF00"},
  {label: "Deep green", value: 22, hex: "#005900"},
  {label: "Near black green", value: 23, hex: "#001900"},
  {label: "Mint green", value: 24, hex: "#4CFF5E"},
  {label: "Spring green", value: 25, hex: "#00FF19"},
  {label: "Dark spring green", value: 26, hex: "#00590D"},
  {label: "Deep spring green", value: 27, hex: "#001902"},
  {label: "Seafoam", value: 28, hex: "#4CFF88"},
  {label: "Aqua green", value: 29, hex: "#00FF55"},
  {label: "Deep teal green", value: 30, hex: "#00591D"},
  {label: "Dark teal green", value: 31, hex: "#001F12"},
  {label: "Turquoise", value: 32, hex: "#4CFFB7"},
  {label: "Bright teal", value: 33, hex: "#00FF99"},
  {label: "Deep teal", value: 34, hex: "#005935"},
  {label: "Dark teal", value: 35, hex: "#001912"},
  {label: "Sky blue", value: 36, hex: "#4CC3FE"},
  {label: "Cyan blue", value: 37, hex: "#00A9FF"},
  {label: "Dark cyan blue", value: 38, hex: "#004152"},
  {label: "Deep cyan blue", value: 39, hex: "#001019"},
  {label: "Light blue", value: 40, hex: "#4C88FF"},
  {label: "Blue", value: 41, hex: "#0055FF"},
  {label: "Deep blue", value: 42, hex: "#001D59"},
  {label: "Near black blue", value: 43, hex: "#000819"},
  {label: "Light royal blue", value: 44, hex: "#4C4CFF"},
  {label: "Pure blue", value: 45, hex: "#0000FF"},
  {label: "Dark blue", value: 46, hex: "#000059"},
  {label: "Deep navy", value: 47, hex: "#000019"},
  {label: "Violet", value: 48, hex: "#874CFF"},
  {label: "Purple blue", value: 49, hex: "#5400FF"},
  {label: "Dark violet", value: 50, hex: "#190064"},
  {label: "Deep violet", value: 51, hex: "#0F0030"},
  {label: "Light magenta", value: 52, hex: "#FF4CFF"},
  {label: "Magenta", value: 53, hex: "#FF00FF"},
  {label: "Dark magenta", value: 54, hex: "#590059"},
  {label: "Deep magenta", value: 55, hex: "#190019"},
  {label: "Hot pink", value: 56, hex: "#FF4C87"},
  {label: "Pink red", value: 57, hex: "#FF0054"},
  {label: "Dark pink red", value: 58, hex: "#59001D"},
  {label: "Deep pink red", value: 59, hex: "#220013"},
  {label: "Red orange", value: 60, hex: "#FF1500"},
  {label: "Brown orange", value: 61, hex: "#993500"},
  {label: "Mustard brown", value: 62, hex: "#795100"},
  {label: "Moss", value: 63, hex: "#436400"},
  {label: "Dark moss", value: 64, hex: "#033900"},
  {label: "Deep sea green", value: 65, hex: "#005735"},
  {label: "Deep cyan", value: 66, hex: "#00547F"},
  {label: "Pure blue", value: 67, hex: "#0000FF"},
  {label: "Blue teal", value: 68, hex: "#00454F"},
  {label: "Electric violet", value: 69, hex: "#2500CC"},
  {label: "Gray", value: 70, hex: "#7F7F7F"},
  {label: "Charcoal", value: 71, hex: "#202020"},
  {label: "Red", value: 72, hex: "#FF0000"},
  {label: "Acid yellow", value: 73, hex: "#BDFF2D"},
  {label: "Laser yellow", value: 74, hex: "#AFED06"},
  {label: "Lime green", value: 75, hex: "#64FF09"},
  {label: "Grass green", value: 76, hex: "#108B00"},
  {label: "Mint", value: 77, hex: "#00FF87"},
  {label: "Cyan", value: 78, hex: "#00A9FF"},
  {label: "Deep azure", value: 79, hex: "#002AFF"},
  {label: "Electric blue", value: 80, hex: "#3F00FF"},
  {label: "Electric purple", value: 81, hex: "#7A00FF"},
  {label: "Plum", value: 82, hex: "#B21A7D"},
  {label: "Brown", value: 83, hex: "#402100"},
  {label: "Hot orange", value: 84, hex: "#FF4A00"},
  {label: "Chartreuse", value: 85, hex: "#88E106"},
  {label: "Bright lime", value: 86, hex: "#72FF15"},
  {label: "Green alt", value: 87, hex: "#00FF00"},
  {label: "Bright green", value: 88, hex: "#3BFF26"},
  {label: "Pastel green", value: 89, hex: "#59FF71"},
  {label: "Aqua", value: 90, hex: "#38FFCC"},
  {label: "Soft blue", value: 91, hex: "#5B8AFF"},
  {label: "Slate blue", value: 92, hex: "#3151C6"},
  {label: "Lavender blue", value: 93, hex: "#877FE9"},
  {label: "Electric magenta", value: 94, hex: "#D31DFF"},
  {label: "Bright pink", value: 95, hex: "#FF005D"},
  {label: "Amber", value: 96, hex: "#FF7F00"},
  {label: "Yellow olive", value: 97, hex: "#B9B000"},
  {label: "Neon lime", value: 98, hex: "#90FF00"},
  {label: "Bronze", value: 99, hex: "#835D07"},
  {label: "Dark bronze", value: 100, hex: "#392B00"},
  {label: "Forest", value: 101, hex: "#144C10"},
  {label: "Dark teal", value: 102, hex: "#0D5038"},
  {label: "Midnight violet", value: 103, hex: "#15152A"},
  {label: "Midnight blue", value: 104, hex: "#16205A"},
  {label: "Copper brown", value: 105, hex: "#693C1C"},
  {label: "Dark crimson", value: 106, hex: "#A8000A"},
  {label: "Salmon red", value: 107, hex: "#DE513D"},
  {label: "Burnt orange", value: 108, hex: "#D86A1C"},
  {label: "Warm yellow", value: 109, hex: "#FFE126"},
  {label: "Soft lime", value: 110, hex: "#9EE12F"},
  {label: "Olive green", value: 111, hex: "#67B50F"},
  {label: "Blue gray", value: 112, hex: "#1E1E30"},
  {label: "Pale lime", value: 113, hex: "#DCFF6B"},
  {label: "Pale mint", value: 114, hex: "#80FFBD"},
  {label: "Periwinkle", value: 115, hex: "#9A99FF"},
  {label: "Soft violet", value: 116, hex: "#8E66FF"},
  {label: "Dark gray", value: 117, hex: "#404040"},
  {label: "Medium gray", value: 118, hex: "#757575"},
  {label: "Ice white", value: 119, hex: "#E0FFFF"},
  {label: "Blood red", value: 120, hex: "#A00000"},
  {label: "Maroon", value: 121, hex: "#350000"},
  {label: "Strong green", value: 122, hex: "#1AD000"},
  {label: "Deep green", value: 123, hex: "#074200"},
  {label: "Yellow olive", value: 124, hex: "#B9B000"},
  {label: "Dark yellow brown", value: 125, hex: "#3F3100"},
  {label: "Rust orange", value: 126, hex: "#B35F00"},
  {label: "Deep brown", value: 127, hex: "#4B1502"},
];

const MIDI_COLOR_BY_VALUE = new Map(MIDI_COLOR_OPTIONS.map((item) => [item.value, item]));
const MIDI_MAPPING_ACTIONS = new Set(["start", "stop", "prev", "next", "blackout"]);
const MIDI_LAYOUT_ACTIONS = new Set(["empty", ...MIDI_MAPPING_ACTIONS]);
const MIDI_LAYOUT_CONTROL_TYPES = new Set(["pad", "button", "knob", "fader"]);
const MIDI_LED_PROTOCOLS = new Set(["generic", "akai_apc_mini_mk2"]);
const MIDI_FEEDBACK_TYPES = new Set(["rgb", "single", "none"]);
const MIDI_COLOR_TABLE = "apc_mk2";
const MIDI_LAYOUT_GRID_SIZE_OPTIONS = [4, 8, 12, 16];
const MIDI_LAYOUT_ZOOM_MIN = 0.5;
const MIDI_LAYOUT_ZOOM_MAX = 1.5;
const MIDI_LAYOUT_ZOOM_STEP = 0.1;
const MIDI_ACTION_FEEDBACK_DEFAULTS = {
  blackout: {colorOn: 5, colorOff: 0, feedbackMode: "latch"},
  stop: {colorOn: 96, colorOff: 0, feedbackMode: "momentary"},
  prev: {colorOn: 78, colorOff: 0, feedbackMode: "momentary"},
  next: {colorOn: 87, colorOff: 0, feedbackMode: "momentary"},
};
const APC_MINI_MK2_BUTTONS = [
  ...Array.from({length: 8}, (_, index) => ({
    label: `Track ${index + 1}`,
    role: "track",
    messageType: "note",
    number: 100 + index,
    lit: true,
    feedbackType: "single",
  })),
  ...Array.from({length: 8}, (_, index) => ({
    label: `Scene ${index + 1}`,
    role: "scene",
    messageType: "note",
    number: 112 + index,
    lit: true,
    feedbackType: "single",
  })),
  {
    label: "Shift",
    role: "shift",
    messageType: "note",
    number: 122,
    lit: false,
    feedbackType: "none",
  },
];
const APC_MINI_MK2_FULL_RESET_NOTES = [
  ...Array.from({length: 64}, (_, index) => index),
  ...APC_MINI_MK2_BUTTONS.map((button) => button.number),
];
const LAUNCHPAD_MINI_MK3_BUTTONS = [
  ...["Up", "Down", "Left", "Right", "Session", "Drums", "Keys", "User"].map((label, index) => ({
    label,
    role: "top",
    messageType: "cc",
    number: 91 + index,
    lit: true,
    feedbackType: "single",
  })),
  ...Array.from({length: 8}, (_, index) => ({
    label: `Scene ${index + 1}`,
    role: "scene",
    messageType: "cc",
    number: 89 - (index * 10),
    lit: true,
    feedbackType: "single",
  })),
];
const LAUNCHKEY_MINI_MK3_BUTTONS = [
  ["Track Left", "cc", 104],
  ["Track Right", "cc", 105],
  ["Scene Down", "cc", 106],
  ["Scene Up", "cc", 107],
  ["Stop/Solo/Mute", "cc", 108],
  ["Play", "cc", 109],
  ["Record", "cc", 110],
  ["Shift", "cc", 111],
].map(([label, messageType, number]) => ({
  label,
  role: "utility",
  messageType,
  number,
  lit: true,
  feedbackType: "single",
}));
const ARTURIA_MINILAB3_BUTTONS = [
  ["Shift", 112],
  ["Hold", 113],
  ["Chord", 114],
  ["Octave", 115],
].map(([label, number]) => ({
  label,
  role: "utility",
  messageType: "cc",
  number,
  lit: true,
  feedbackType: "single",
}));
const MIDI_LAYOUT_TEMPLATES = [
  {
    id: "akai_apc_mini_mk2",
    label: "Akai APC Mini MK2",
    rows: 8,
    cols: 8,
    buttons: 17,
    knobs: 0,
    faders: 9,
    noteStart: 0,
    buttonMessageType: "note",
    ccStart: 16,
    faderCcStart: 48,
    noteDirection: "forward",
    padOrder: "bottom-to-top",
    physicalLayout: "akai_apc_mini_mk2",
    ledProtocol: "akai_apc_mini_mk2",
    buttonDefinitions: APC_MINI_MK2_BUTTONS,
    description: "64 RGB pads, eight Track buttons below the pad matrix, eight Scene Launch buttons on the right, Shift and nine CC faders. Faders have no LED feedback.",
  },
  {
    id: "novation_launchpad_mini_mk3",
    label: "Novation Launchpad Mini MK3",
    rows: 8,
    cols: 8,
    buttons: 16,
    knobs: 0,
    faders: 0,
    noteStart: 11,
    buttonNoteStart: 91,
    buttonMessageType: "cc",
    ccStart: 48,
    faderCcStart: 48,
    noteDirection: "forward",
    physicalLayout: "novation_launchpad_mini_mk3",
    padLabels: Array.from({length: 64}, (_, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      return `${8 - row}${col + 1}`;
    }),
    buttonDefinitions: LAUNCHPAD_MINI_MK3_BUTTONS,
    ledProtocol: "generic",
    description: "8x8 pad grid with top navigation/mode buttons and a right-hand scene column. Use Learn if your browser exposes a different MIDI mode.",
  },
  {
    id: "novation_launchkey_mini_mk3",
    label: "Novation Launchkey Mini MK3",
    rows: 2,
    cols: 8,
    buttons: 8,
    knobs: 8,
    faders: 0,
    noteStart: 36,
    buttonCcStart: 104,
    buttonMessageType: "cc",
    ccStart: 21,
    faderCcStart: 48,
    noteDirection: "forward",
    physicalLayout: "novation_launchkey_mini_mk3",
    padLabels: Array.from({length: 16}, (_, index) => `Pad ${index + 1}`),
    buttonDefinitions: LAUNCHKEY_MINI_MK3_BUTTONS,
    ledProtocol: "generic",
    description: "16 RGB pads, eight rotary controls and compact transport/utility buttons.",
  },
  {
    id: "akai_mpk_mini_mk3",
    label: "Akai MPK Mini MK3",
    rows: 2,
    cols: 4,
    buttons: 0,
    knobs: 8,
    faders: 0,
    noteStart: 36,
    ccStart: 70,
    faderCcStart: 48,
    noteDirection: "forward",
    physicalLayout: "akai_mpk_mini_mk3",
    padLabels: Array.from({length: 8}, (_, index) => `Pad ${index + 1}`),
    ledProtocol: "generic",
    description: "Eight pads and eight rotary encoders. Useful for small playlist banks and effect controls.",
  },
  {
    id: "arturia_minilab_3",
    label: "Arturia MiniLab 3",
    rows: 2,
    cols: 4,
    buttons: 4,
    knobs: 8,
    faders: 4,
    noteStart: 36,
    buttonCcStart: 112,
    buttonMessageType: "cc",
    ccStart: 74,
    faderCcStart: 18,
    noteDirection: "forward",
    physicalLayout: "arturia_minilab_3",
    padLabels: Array.from({length: 8}, (_, index) => `Pad ${index + 1}`),
    buttonDefinitions: ARTURIA_MINILAB3_BUTTONS,
    ledProtocol: "generic",
    description: "Compact keyboard layout with pads, encoders, control buttons and four slider placeholders.",
  },
  {
    id: "generic_8x8_pads",
    label: "Generic 8x8 Pad Controller",
    rows: 8,
    cols: 8,
    buttons: 0,
    knobs: 0,
    faders: 0,
    noteStart: 0,
    ccStart: 16,
    faderCcStart: 48,
    noteDirection: "forward",
    ledProtocol: "generic",
    description: "Safe fallback for 64-pad controllers. Use Learn to replace guessed notes with exact messages.",
  },
  {
    id: "generic_4x4_pads",
    label: "Generic 4x4 Pad Controller",
    rows: 4,
    cols: 4,
    buttons: 0,
    knobs: 0,
    faders: 0,
    noteStart: 0,
    ccStart: 16,
    faderCcStart: 48,
    noteDirection: "forward",
    ledProtocol: "generic",
    description: "Small 16-pad setup for quick playlist launch pages and test rigs.",
  },
  {
    id: "generic_4x4_knobs_faders",
    label: "Generic 4x4 + Knobs/Faders",
    rows: 4,
    cols: 4,
    buttons: 4,
    knobs: 8,
    faders: 8,
    noteStart: 0,
    buttonCcStart: 32,
    buttonMessageType: "cc",
    ccStart: 16,
    faderCcStart: 48,
    noteDirection: "forward",
    physicalLayout: "generic_hybrid",
    ledProtocol: "generic",
    description: "Hybrid controller template with pads, utility buttons, knobs and faders.",
  },
  {
    id: "custom",
    label: "Custom Controller",
    rows: 8,
    cols: 8,
    surfaceRows: 16,
    surfaceCols: 16,
    buttons: 0,
    knobs: 0,
    faders: 0,
    noteStart: 0,
    buttonCcStart: 32,
    buttonMessageType: "cc",
    ccStart: 16,
    faderCcStart: 48,
    noteDirection: "forward",
    custom: true,
    ledProtocol: "generic",
    description: "Editable rows, columns, buttons, knobs and faders for controllers that do not match a preset.",
  },
];
const MIDI_LAYOUT_DEFAULT_TEMPLATE = MIDI_LAYOUT_TEMPLATES[0].id;
const MIDI_LAYOUT_TEMPLATE_ALIASES = new Map([
  ["apc_8x8", "akai_apc_mini_mk2"],
  ["generic_8x8", "generic_8x8_pads"],
  ["compact_4x4", "generic_4x4_pads"],
  ["hybrid_4x4_controls", "generic_4x4_knobs_faders"],
]);
const MIDI_LAYOUT_COLOR_SEQUENCE = [87, 96, 78, 94, 13, 17, 90, 45, 72, 85, 80, 52, 109, 114, 95, 3];
const LEGACY_MIDI_COLOR_MAP = new Map([
  [1, 21],
  [2, 21],
  [3, 5],
  [4, 5],
  [5, 13],
  [6, 13],
  [9, 96],
  [49, 78],
  [57, 3],
  [96, 72],
  [127, 13],
]);

const state = {
  app: null,
  scenes: [],
  similarityReport: null,
  compareSceneIds: new Set(),
  selectedSceneId: null,
  editingSceneId: null,
  activePresetEffect: "",
  selectedPresetPaletteIds: ["auto"],
  presetDrafts: [],
  editingPreset: null,
  editingPresetBankItem: null,
  editingPalette: null,
  ledfxLibrary: {scenes: [], playlists: [], playlist_state: {}},
  librarySceneOrder: [],
  playlistSceneIds: new Set(),
  selectedLibrarySceneIds: new Set(),
  activeLibrarySceneId: null,
  editingPlaylistId: null,
  editingPublishedSceneId: null,
  editingMidiMappingId: null,
  editingMidiLayoutPadId: null,
  gradientDrag: null,
  editingStyle: null,
  forgePreview: {
    running: true,
    requestId: 0,
    phase: 0,
    lastTime: 0,
    paramsByBehavior: {},
  },
  topPreviewDeviceId: localStorage.getItem("lsf.top_preview_device") || "",
  topPreviewSocket: null,
  topPreviewStreamKey: "",
  topPreviewLastFrameAt: 0,
  topPreviewFallbackTimer: null,
  topPreviewReconnectTimer: null,
  midi: {
    access: null,
    inputs: [],
    outputs: [],
    selectedInputId: localStorage.getItem("lsf.midi_input") || "",
    selectedOutputId: localStorage.getItem("lsf.midi_output") || "",
    controller: loadMidiControllerSettings(),
    mappings: loadMidiMappings(),
    layout: loadMidiLayout(),
    profiles: loadMidiProfiles(),
    selectedProfileId: localStorage.getItem(MIDI_SELECTED_PROFILE_KEY) || "",
    learn: null,
    layoutActivity: null,
    layoutActivityTimer: null,
    layoutPositionMode: false,
    layoutDragId: "",
    layoutDragIds: [],
    layoutSuppressClickUntil: 0,
    layoutSelectedIds: new Set(),
    layoutZoom: loadMidiLayoutZoom(),
    lastTrigger: {},
    globalBrightnessRequestId: 0,
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
    description: "Clocked strobe gating. Non-sound mode is free-running; sound mode gates the strobe with audio.",
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
  sound: "Music-reactive mode. The draft uses audio input, either through a broad level follower or frequency/beat-driven behavior.",
  non_sound: "No audio dependency. Use for free-running gradients, dimmers, timed strobes or utility looks.",
};
const FORGE_FREQUENCIES = {
  Beat: "Beat/tempo cue from LedFx frequency_range enum. Best for pulse and timed strobe ideas.",
  Bass: "Bass-only LedFx frequency_range value for low-end pressure and bass strobes.",
  "Lows (beat+bass)": "Kick and bass together. This is the safest default for dance-floor reactive effects.",
  Mids: "LedFx mids value for central musical body such as snares, chords and main synth phrases.",
  High: "LedFx high-frequency value for hi-hats, clicks and bright accents.",
};
const FORGE_PREVIEW_DEFAULT_PARAMS = [
  {key: "scale", label: "Shape scale", defaultValue: 55, tooltip: "Controls pattern size, repeat count or how much space the core shape occupies."},
  {key: "curve", label: "Response curve", defaultValue: 58, tooltip: "Changes how quickly the preview opens from quiet signal to full output."},
  {key: "accent", label: "Accent gain", defaultValue: 48, tooltip: "Pushes hits, edges, flashes and high-energy accents inside the local preview."},
  {key: "smooth", label: "Smoothing", defaultValue: 46, tooltip: "Softens transitions, tails and visual falloff."},
];
const FORGE_PREVIEW_PARAM_SETS = {
  static: [
    {key: "scale", label: "Breathing", defaultValue: 32, tooltip: "Adds slow movement to an otherwise solid layer."},
    {key: "curve", label: "Color hold", defaultValue: 64, tooltip: "Higher keeps the preview closer to one color region of the palette."},
    {key: "accent", label: "Lift", defaultValue: 22, tooltip: "Raises the visible floor for dimmer or utility looks."},
    {key: "smooth", label: "Softness", defaultValue: 72, tooltip: "Smooths the modulation so it feels less flickery."},
  ],
  gradient: [
    {key: "scale", label: "Repeat scale", defaultValue: 48, tooltip: "Controls how many gradient waves are visible at once."},
    {key: "curve", label: "Blend curve", defaultValue: 62, tooltip: "Higher makes the gradient open brighter and more evenly."},
    {key: "accent", label: "Contrast", defaultValue: 44, tooltip: "Increases color separation and bright edges."},
    {key: "smooth", label: "Blend softness", defaultValue: 68, tooltip: "Softens transitions between color bands."},
  ],
  melt: [
    {key: "scale", label: "Smear size", defaultValue: 66, tooltip: "Sets how wide the melting movement feels."},
    {key: "curve", label: "Audio bend", defaultValue: 58, tooltip: "Controls how strongly signal pressure bends the shape."},
    {key: "accent", label: "Edge lift", defaultValue: 32, tooltip: "Adds brighter edges inside the smear."},
    {key: "smooth", label: "Tail", defaultValue: 76, tooltip: "Higher leaves a longer, softer falloff."},
  ],
  scroll: [
    {key: "scale", label: "Lane count", defaultValue: 68, tooltip: "Controls chase density and number of visible lanes."},
    {key: "curve", label: "Gate curve", defaultValue: 52, tooltip: "Shapes how strongly lanes open with audio pressure."},
    {key: "accent", label: "Chase punch", defaultValue: 58, tooltip: "Adds brighter leading edges to the chase."},
    {key: "smooth", label: "Trail", defaultValue: 42, tooltip: "Controls how much tail follows moving lanes."},
  ],
  energy: [
    {key: "scale", label: "Body fill", defaultValue: 62, tooltip: "Controls how full the wash feels across the strip."},
    {key: "curve", label: "Compression", defaultValue: 56, tooltip: "Higher keeps more visible body at medium audio levels."},
    {key: "accent", label: "Accent edge", defaultValue: 54, tooltip: "Pushes transient highlights and sharper peaks."},
    {key: "smooth", label: "Blend", defaultValue: 48, tooltip: "Smooths the wash between darker and brighter regions."},
  ],
  rain: [
    {key: "scale", label: "Drop density", defaultValue: 70, tooltip: "Controls how many drops and trails appear."},
    {key: "curve", label: "Drop gate", defaultValue: 46, tooltip: "Controls when drops become visible."},
    {key: "accent", label: "Sparkle", defaultValue: 42, tooltip: "Adds brighter tip accents to drops."},
    {key: "smooth", label: "Trail length", defaultValue: 66, tooltip: "Higher leaves longer rain trails."},
  ],
  bar: [
    {key: "scale", label: "Meter width", defaultValue: 58, tooltip: "Controls how quickly the bar fills across the strip."},
    {key: "curve", label: "Meter curve", defaultValue: 52, tooltip: "Shapes low versus high signal response."},
    {key: "accent", label: "Peak boost", defaultValue: 56, tooltip: "Makes strong hits fill harder."},
    {key: "smooth", label: "Edge softness", defaultValue: 38, tooltip: "Softens the edge of the filled bar."},
  ],
  multibar: [
    {key: "scale", label: "Layer count", defaultValue: 70, tooltip: "Controls how many bar layers are visible."},
    {key: "curve", label: "Bounce curve", defaultValue: 54, tooltip: "Shapes how bars rise at medium signal."},
    {key: "accent", label: "Peak gain", defaultValue: 62, tooltip: "Pushes stronger layers during peaks."},
    {key: "smooth", label: "Offset spread", defaultValue: 44, tooltip: "Controls how separated the bar layers feel."},
  ],
  equalizer: [
    {key: "scale", label: "Band count", defaultValue: 72, tooltip: "Controls the number of visible frequency blocks."},
    {key: "curve", label: "Band curve", defaultValue: 50, tooltip: "Shapes how bands open from quiet to loud."},
    {key: "accent", label: "High lift", defaultValue: 48, tooltip: "Raises bright upper-band accents."},
    {key: "smooth", label: "Peak hold", defaultValue: 42, tooltip: "Adds persistence to stepped levels."},
  ],
  pulse: [
    {key: "scale", label: "Pulse width", defaultValue: 52, tooltip: "Controls how wide each beat-centered pulse appears."},
    {key: "curve", label: "Hit curve", defaultValue: 60, tooltip: "Shapes how quickly the pulse opens on beat and volume changes."},
    {key: "accent", label: "Beat punch", defaultValue: 68, tooltip: "Boosts the center hit and makes each pulse feel more percussive."},
    {key: "smooth", label: "Release", defaultValue: 42, tooltip: "Controls how quickly the pulse falls back after each hit."},
  ],
  bands: [
    {key: "scale", label: "Band density", defaultValue: 66, tooltip: "Controls how many moving spectrum bands are visible."},
    {key: "curve", label: "Band gate", defaultValue: 48, tooltip: "Controls how selective the bands are at lower signal levels."},
    {key: "accent", label: "Color punch", defaultValue: 58, tooltip: "Increases contrast and brightness on louder band movement."},
    {key: "smooth", label: "Hold", defaultValue: 46, tooltip: "Adds persistence so bands feel less jumpy."},
  ],
  wave: [
    {key: "scale", label: "Wave scale", defaultValue: 58, tooltip: "Controls the visible size and repeat of the gradient wave."},
    {key: "curve", label: "Flow curve", defaultValue: 56, tooltip: "Shapes how evenly the wave reacts from quiet to loud input."},
    {key: "accent", label: "Crest gain", defaultValue: 50, tooltip: "Brightens wave crests and stronger audio peaks."},
    {key: "smooth", label: "Flow smooth", defaultValue: 64, tooltip: "Softens wave motion and gradient transitions."},
  ],
  concentric: [
    {key: "scale", label: "Ring count", defaultValue: 64, tooltip: "Controls how many center-out rings are visible."},
    {key: "curve", label: "Pulse curve", defaultValue: 58, tooltip: "Shapes how hard rings open on hits."},
    {key: "accent", label: "Ring edge", defaultValue: 58, tooltip: "Sharpens bright ring edges."},
    {key: "smooth", label: "Falloff", defaultValue: 44, tooltip: "Controls how quickly rings fade toward the sides."},
  ],
  sparkle: [
    {key: "scale", label: "Spark count", defaultValue: 76, tooltip: "Controls how many transient sparkles appear."},
    {key: "curve", label: "Trigger gate", defaultValue: 44, tooltip: "Controls how selective the sparkle trigger is."},
    {key: "accent", label: "Flash gain", defaultValue: 76, tooltip: "Pushes sparkle brightness during strong hits."},
    {key: "smooth", label: "Afterglow", defaultValue: 32, tooltip: "Adds tail after each sparkle."},
  ],
  sub_swell: [
    {key: "scale", label: "Swell width", defaultValue: 62, tooltip: "Controls how broad the low-end bloom is."},
    {key: "curve", label: "Bass curve", defaultValue: 68, tooltip: "Shapes how much quiet bass opens the swell."},
    {key: "accent", label: "Pressure lift", defaultValue: 38, tooltip: "Adds weight during heavy bass moments."},
    {key: "smooth", label: "Release", defaultValue: 78, tooltip: "Higher releases more slowly into black."},
  ],
  tunnel: [
    {key: "scale", label: "Tunnel rings", defaultValue: 70, tooltip: "Controls ring density inside the tunnel."},
    {key: "curve", label: "Depth curve", defaultValue: 60, tooltip: "Shapes the center-to-edge depth."},
    {key: "accent", label: "Kick push", defaultValue: 64, tooltip: "Makes kicks drive the tunnel harder."},
    {key: "smooth", label: "Focus", defaultValue: 46, tooltip: "Controls how tightly the tunnel stays centered."},
  ],
  laser_gate: [
    {key: "scale", label: "Beam count", defaultValue: 62, tooltip: "Controls how many narrow beams appear."},
    {key: "curve", label: "Gate curve", defaultValue: 42, tooltip: "Controls how abruptly beams open."},
    {key: "accent", label: "Beam punch", defaultValue: 82, tooltip: "Pushes sharp laser-like accents."},
    {key: "smooth", label: "Hold", defaultValue: 28, tooltip: "Adds a little persistence after the gate opens."},
  ],
  shimmer: [
    {key: "scale", label: "Particle count", defaultValue: 78, tooltip: "Controls the density of fine shimmer particles."},
    {key: "curve", label: "High gate", defaultValue: 48, tooltip: "Shapes how easily high-frequency accents appear."},
    {key: "accent", label: "Glitter gain", defaultValue: 66, tooltip: "Boosts bright transient detail."},
    {key: "smooth", label: "Air", defaultValue: 52, tooltip: "Softens the shimmer into a wider halo."},
  ],
  shadow_gap: [
    {key: "scale", label: "Gap width", defaultValue: 52, tooltip: "Controls the size of dark negative-space movement."},
    {key: "curve", label: "Dark gate", defaultValue: 34, tooltip: "Controls how rarely accents break through black."},
    {key: "accent", label: "Accent leak", defaultValue: 24, tooltip: "Adds restrained light inside the dark pattern."},
    {key: "smooth", label: "Fade", defaultValue: 74, tooltip: "Softens transitions back into black."},
  ],
  riser: [
    {key: "scale", label: "Ramp width", defaultValue: 58, tooltip: "Controls how wide the rising band becomes."},
    {key: "curve", label: "Build curve", defaultValue: 70, tooltip: "Shapes how quickly tension accumulates."},
    {key: "accent", label: "Peak push", defaultValue: 62, tooltip: "Adds brightness near the end of the rise."},
    {key: "smooth", label: "Sweep softness", defaultValue: 44, tooltip: "Softens the leading edge of the riser."},
  ],
  call_response: [
    {key: "scale", label: "Zone count", defaultValue: 54, tooltip: "Controls how many alternating response zones appear."},
    {key: "curve", label: "Reply curve", defaultValue: 54, tooltip: "Shapes the quieter side of the call-response motion."},
    {key: "accent", label: "Call punch", defaultValue: 56, tooltip: "Boosts the currently active zone."},
    {key: "smooth", label: "Crossfade", defaultValue: 52, tooltip: "Softens switches between zones."},
  ],
  ripple: [
    {key: "scale", label: "Ripple count", defaultValue: 68, tooltip: "Controls how many ripples spread after a hit."},
    {key: "curve", label: "Impact curve", defaultValue: 64, tooltip: "Shapes how hard impact opens the ripple."},
    {key: "accent", label: "Impact edge", defaultValue: 64, tooltip: "Sharpens the leading ripple."},
    {key: "smooth", label: "Damping", defaultValue: 48, tooltip: "Controls how quickly ripples decay."},
  ],
  blade: [
    {key: "scale", label: "Blade width", defaultValue: 50, tooltip: "Controls the width of the moving power blade."},
    {key: "curve", label: "Power curve", defaultValue: 66, tooltip: "Shapes how hard bass pressure opens the blade."},
    {key: "accent", label: "Edge gain", defaultValue: 72, tooltip: "Sharpens and brightens the blade edge."},
    {key: "smooth", label: "Drag", defaultValue: 34, tooltip: "Controls how much the blade smears behind motion."},
  ],
  bpm_strobe: [
    {key: "scale", label: "Rate range", defaultValue: 62, tooltip: "Controls the preview strobe timing range."},
    {key: "curve", label: "Gate width", defaultValue: 38, tooltip: "Controls how long each strobe pulse stays open."},
    {key: "accent", label: "Flash power", defaultValue: 86, tooltip: "Sets how aggressive the strobe flash feels."},
    {key: "smooth", label: "Afterimage", defaultValue: 18, tooltip: "Adds a small residual glow after flashes."},
  ],
  bass_strobe: [
    {key: "scale", label: "Bass window", defaultValue: 58, tooltip: "Controls how broad the bass-triggered flash area is."},
    {key: "curve", label: "Hit threshold", defaultValue: 44, tooltip: "Controls how selective the bass gate is."},
    {key: "accent", label: "Flash power", defaultValue: 84, tooltip: "Sets strobe brightness during bass hits."},
    {key: "smooth", label: "Release", defaultValue: 24, tooltip: "Adds short tail after bass-triggered flashes."},
  ],
};
const MIDI_ACTION_LABELS = {
  start: "Start playlist",
  stop: "Stop",
  prev: "Previous scene",
  next: "Next scene",
  blackout: "Blackout",
};

const els = {
  factoryView: document.querySelector("#factoryView"),
  presetLabView: document.querySelector("#presetLabView"),
  liveModeView: document.querySelector("#liveModeView"),
  effectForgeView: document.querySelector("#effectForgeView"),
  midiMapperView: document.querySelector("#midiMapperView"),
  midiLayoutView: document.querySelector("#midiLayoutView"),
  factoryTabButton: document.querySelector("#factoryTabButton"),
  presetLabTabButton: document.querySelector("#presetLabTabButton"),
  liveModeTabButton: document.querySelector("#liveModeTabButton"),
  effectForgeTabButton: document.querySelector("#effectForgeTabButton"),
  midiMapperTabButton: document.querySelector("#midiMapperTabButton"),
  midiLayoutTabButton: document.querySelector("#midiLayoutTabButton"),
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
  exportShowPackButton: document.querySelector("#exportShowPackButton"),
  importShowPackButton: document.querySelector("#importShowPackButton"),
  importShowPackInput: document.querySelector("#importShowPackInput"),
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
  styleSceneWeightFields: document.querySelector("#styleSceneWeightFields"),
  styleEffectBiasFields: document.querySelector("#styleEffectBiasFields"),
  stylePaletteBiasFields: document.querySelector("#stylePaletteBiasFields"),
  saveStyleButton: document.querySelector("#saveStyleButton"),
  closeStyleEditorButton: document.querySelector("#closeStyleEditorButton"),
  countInput: document.querySelector("#countInput"),
  effectModeSelect: document.querySelector("#effectModeSelect"),
  presetModeSelect: document.querySelector("#presetModeSelect"),
  presetBankModeSelect: document.querySelector("#presetBankModeSelect"),
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
  compareScenesButton: document.querySelector("#compareScenesButton"),
  smartDiversifyButton: document.querySelector("#smartDiversifyButton"),
  newManualSceneButton: document.querySelector("#newManualSceneButton"),
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
  playlistFromSelectionButton: document.querySelector("#playlistFromSelectionButton"),
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
  presetBankSummary: document.querySelector("#presetBankSummary"),
  presetBankList: document.querySelector("#presetBankList"),
  presetBankEditor: document.querySelector("#presetBankEditor"),
  presetBankNameInput: document.querySelector("#presetBankNameInput"),
  presetBankTagInput: document.querySelector("#presetBankTagInput"),
  presetBankEditStatus: document.querySelector("#presetBankEditStatus"),
  presetBankParamFields: document.querySelector("#presetBankParamFields"),
  previewPresetBankButton: document.querySelector("#previewPresetBankButton"),
  savePresetBankButton: document.querySelector("#savePresetBankButton"),
  closePresetBankEditorButton: document.querySelector("#closePresetBankEditorButton"),
  tabsGuidePanel: document.querySelector("#tabsGuidePanel"),
  liveRefreshButton: document.querySelector("#liveRefreshButton"),
  liveBlackoutButton: document.querySelector("#liveBlackoutButton"),
  liveStopButton: document.querySelector("#liveStopButton"),
  livePrevButton: document.querySelector("#livePrevButton"),
  liveNextButton: document.querySelector("#liveNextButton"),
  liveNowPlaying: document.querySelector("#liveNowPlaying"),
  livePlaylistSummary: document.querySelector("#livePlaylistSummary"),
  livePlaylistList: document.querySelector("#livePlaylistList"),
  liveSceneSummary: document.querySelector("#liveSceneSummary"),
  liveSceneList: document.querySelector("#liveSceneList"),
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
  forgePreviewPauseButton: document.querySelector("#forgePreviewPauseButton"),
  forgePreviewCanvas: document.querySelector("#forgePreviewCanvas"),
  forgePreviewEffect: document.querySelector("#forgePreviewEffect"),
  forgePreviewStatus: document.querySelector("#forgePreviewStatus"),
  forgePreviewPaletteSelect: document.querySelector("#forgePreviewPaletteSelect"),
  forgePreviewDriveInput: document.querySelector("#forgePreviewDriveInput"),
  forgePreviewDriveValue: document.querySelector("#forgePreviewDriveValue"),
  forgePreviewDemoInput: document.querySelector("#forgePreviewDemoInput"),
  forgePreviewParamDescription: document.querySelector("#forgePreviewParamDescription"),
  forgePreviewParamFields: document.querySelector("#forgePreviewParamFields"),
  forgePreviewResetParamsButton: document.querySelector("#forgePreviewResetParamsButton"),
  forgeCodeOutput: document.querySelector("#forgeCodeOutput"),
  forgeProfileOutput: document.querySelector("#forgeProfileOutput"),
  forgeInstructionsOutput: document.querySelector("#forgeInstructionsOutput"),
  copyForgeCodeButton: document.querySelector("#copyForgeCodeButton"),
  copyForgeProfileButton: document.querySelector("#copyForgeProfileButton"),
  copyForgeInstructionsButton: document.querySelector("#copyForgeInstructionsButton"),
  midiConnectButton: document.querySelector("#midiConnectButton"),
  midiRefreshLibraryButton: document.querySelector("#midiRefreshLibraryButton"),
  midiRefreshMappingsButton: document.querySelector("#midiRefreshMappingsButton"),
  midiResetAllButton: document.querySelector("#midiResetAllButton"),
  midiInputSelect: document.querySelector("#midiInputSelect"),
  midiOutputSelect: document.querySelector("#midiOutputSelect"),
  midiStatus: document.querySelector("#midiStatus"),
  midiPrevButton: document.querySelector("#midiPrevButton"),
  midiNextButton: document.querySelector("#midiNextButton"),
  midiMapPrevButton: document.querySelector("#midiMapPrevButton"),
  midiMapNextButton: document.querySelector("#midiMapNextButton"),
  midiColorOnSelect: document.querySelector("#midiColorOnSelect"),
  midiColorOffSelect: document.querySelector("#midiColorOffSelect"),
  midiFeedbackModeSelect: document.querySelector("#midiFeedbackModeSelect"),
  midiLedProtocolSelect: document.querySelector("#midiLedProtocolSelect"),
  midiBlackoutButton: document.querySelector("#midiBlackoutButton"),
  midiMapBlackoutButton: document.querySelector("#midiMapBlackoutButton"),
  midiPlaylistSummary: document.querySelector("#midiPlaylistSummary"),
  midiPlaylistMapList: document.querySelector("#midiPlaylistMapList"),
  midiClearMappingsButton: document.querySelector("#midiClearMappingsButton"),
  midiMappingList: document.querySelector("#midiMappingList"),
  midiMappingEditor: document.querySelector("#midiMappingEditor"),
  midiMappingEditStatus: document.querySelector("#midiMappingEditStatus"),
  midiEditActionSelect: document.querySelector("#midiEditActionSelect"),
  midiEditPlaylistSelect: document.querySelector("#midiEditPlaylistSelect"),
  midiEditMessageInput: document.querySelector("#midiEditMessageInput"),
  midiEditColorOnSelect: document.querySelector("#midiEditColorOnSelect"),
  midiEditColorOffSelect: document.querySelector("#midiEditColorOffSelect"),
  midiEditFeedbackModeSelect: document.querySelector("#midiEditFeedbackModeSelect"),
  midiEditLedProtocolSelect: document.querySelector("#midiEditLedProtocolSelect"),
  midiEditFeedbackNote: document.querySelector("#midiEditFeedbackNote"),
  midiProfileSelect: document.querySelector("#midiProfileSelect"),
  midiProfileNameInput: document.querySelector("#midiProfileNameInput"),
  midiSaveProfileButton: document.querySelector("#midiSaveProfileButton"),
  midiLoadProfileButton: document.querySelector("#midiLoadProfileButton"),
  midiDeleteProfileButton: document.querySelector("#midiDeleteProfileButton"),
  saveMidiMappingEditButton: document.querySelector("#saveMidiMappingEditButton"),
  testMidiMappingEditButton: document.querySelector("#testMidiMappingEditButton"),
  closeMidiMappingEditorButton: document.querySelector("#closeMidiMappingEditorButton"),
  midiLayoutConnectButton: document.querySelector("#midiLayoutConnectButton"),
  midiLayoutAutoMapButton: document.querySelector("#midiLayoutAutoMapButton"),
  midiLayoutRefreshMappingsButton: document.querySelector("#midiLayoutRefreshMappingsButton"),
  midiLayoutClearButton: document.querySelector("#midiLayoutClearButton"),
  midiLayoutResetAllButton: document.querySelector("#midiLayoutResetAllButton"),
  midiLayoutTemplateSelect: document.querySelector("#midiLayoutTemplateSelect"),
  midiLayoutCustomEditor: document.querySelector("#midiLayoutCustomEditor"),
  midiLayoutCustomNameInput: document.querySelector("#midiLayoutCustomNameInput"),
  midiLayoutGridSizeSelect: document.querySelector("#midiLayoutGridSizeSelect"),
  midiLayoutRowsInput: document.querySelector("#midiLayoutRowsInput"),
  midiLayoutColsInput: document.querySelector("#midiLayoutColsInput"),
  midiLayoutKnobsInput: document.querySelector("#midiLayoutKnobsInput"),
  midiLayoutButtonsInput: document.querySelector("#midiLayoutButtonsInput"),
  midiLayoutFadersInput: document.querySelector("#midiLayoutFadersInput"),
  midiLayoutApplyCustomButton: document.querySelector("#midiLayoutApplyCustomButton"),
  midiLayoutSaveCustomButton: document.querySelector("#midiLayoutSaveCustomButton"),
  midiLayoutAddButtonButton: document.querySelector("#midiLayoutAddButtonButton"),
  midiLayoutAddKnobButton: document.querySelector("#midiLayoutAddKnobButton"),
  midiLayoutAddFaderButton: document.querySelector("#midiLayoutAddFaderButton"),
  midiLayoutInputSelect: document.querySelector("#midiLayoutInputSelect"),
  midiLayoutOutputSelect: document.querySelector("#midiLayoutOutputSelect"),
  midiLayoutStatus: document.querySelector("#midiLayoutStatus"),
  midiLayoutSummary: document.querySelector("#midiLayoutSummary"),
  midiLayoutZoomOutButton: document.querySelector("#midiLayoutZoomOutButton"),
  midiLayoutZoomInButton: document.querySelector("#midiLayoutZoomInButton"),
  midiLayoutZoomValue: document.querySelector("#midiLayoutZoomValue"),
  midiLayoutClearSelectionButton: document.querySelector("#midiLayoutClearSelectionButton"),
  midiLayoutPositionButton: document.querySelector("#midiLayoutPositionButton"),
  midiLayoutGrid: document.querySelector("#midiLayoutGrid"),
  midiLayoutPadEditor: document.querySelector("#midiLayoutPadEditor"),
  midiLayoutPadEditStatus: document.querySelector("#midiLayoutPadEditStatus"),
  midiLayoutPadLabelInput: document.querySelector("#midiLayoutPadLabelInput"),
  midiLayoutPadTypeInput: document.querySelector("#midiLayoutPadTypeInput"),
  midiLayoutPadActionSelect: document.querySelector("#midiLayoutPadActionSelect"),
  midiLayoutPadPlaylistSelect: document.querySelector("#midiLayoutPadPlaylistSelect"),
  midiLayoutPadMessageInput: document.querySelector("#midiLayoutPadMessageInput"),
  midiLayoutPadColorOnSelect: document.querySelector("#midiLayoutPadColorOnSelect"),
  midiLayoutPadColorOffSelect: document.querySelector("#midiLayoutPadColorOffSelect"),
  midiLayoutPadFeedbackModeSelect: document.querySelector("#midiLayoutPadFeedbackModeSelect"),
  midiLayoutPadLedProtocolSelect: document.querySelector("#midiLayoutPadLedProtocolSelect"),
  midiLayoutPadFeedbackNote: document.querySelector("#midiLayoutPadFeedbackNote"),
  saveMidiLayoutPadButton: document.querySelector("#saveMidiLayoutPadButton"),
  learnMidiLayoutPadButton: document.querySelector("#learnMidiLayoutPadButton"),
  testMidiLayoutPadButton: document.querySelector("#testMidiLayoutPadButton"),
  clearMidiLayoutPadButton: document.querySelector("#clearMidiLayoutPadButton"),
  closeMidiLayoutPadEditorButton: document.querySelector("#closeMidiLayoutPadEditorButton"),
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

function showToast(message, timeout = 3600) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), timeout);
}

function formatLedFxWarnings(report, limit = 4) {
  const warnings = (report && Array.isArray(report.warnings) ? report.warnings : [])
    .filter((warning) => warning && warning.message);
  if (!warnings.length) return "";
  const visible = warnings.slice(0, limit).map((warning) => {
    const scene = warning.scene ? `${warning.scene}: ` : "";
    const field = warning.field ? `[${warning.field}] ` : "";
    return `${scene}${field}${warning.message}`;
  });
  const remaining = warnings.length - visible.length;
  if (remaining > 0) {
    visible.push(`...and ${remaining} more warning(s).`);
  }
  return visible.join("\n");
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

function stableSelectedFirst(items, isSelected, getId) {
  return [...items]
    .map((item, index) => ({item, index, selected: Boolean(isSelected(item)), id: String(getId(item))}))
    .sort((left, right) => {
      if (left.selected !== right.selected) return left.selected ? -1 : 1;
      return left.index - right.index;
    })
    .map((entry) => entry.item);
}

function sceneTypeId(item) {
  return typeof item === "string" ? item : item.id;
}

function sceneTypeCheckbox(item, checked = true) {
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
  input.checked = checked;
  input.addEventListener("change", () => {
    renderSceneTypeList(checkedValues(els.sceneTypeList, "scene_type"), {preserveScroll: true});
  });

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
  if (els.presetBankEditor) els.presetBankEditor.hidden = true;
  if (els.playlistEditor) els.playlistEditor.hidden = true;
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
  if (els.midiLayoutPadEditor) els.midiLayoutPadEditor.hidden = true;
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
  state.editingPresetBankItem = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingMidiMappingId = null;
  state.editingMidiLayoutPadId = null;
  hideModalPanels();
  if (els.tabsGuidePanel) els.tabsGuidePanel.hidden = false;
  openModal("Workshop Guide");
}

function closeModal() {
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingPresetBankItem = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingMidiMappingId = null;
  state.editingMidiLayoutPadId = null;
  state.playlistSceneIds = new Set();
  hideModalPanels();
  renderStyleEditor();
  renderPaletteEditor();
  renderPresetEditor();
  renderPresetBankEditor();
  renderSceneEditorModal();
  renderPublishedSceneEditorModal();
  hideModal();
  renderScenes();
  renderLedFxLibrary();
  renderMidiLayoutDesigner();
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

function setSceneTypesChecked(checked) {
  const selected = checked
    ? ((state.app && state.app.scene_types) || []).map((item) => String(sceneTypeId(item)))
    : [];
  renderSceneTypeList(selected);
}

function bindRangeValue(input, output) {
  if (!input || !output) return;
  const update = () => {
    output.textContent = `${input.value}%`;
  };
  input.addEventListener("input", update);
  update();
}

function scheduleGenerationPanelSync() {
  if (scheduleGenerationPanelSync.frame) {
    cancelAnimationFrame(scheduleGenerationPanelSync.frame);
  }
  scheduleGenerationPanelSync.frame = requestAnimationFrame(syncGenerationPanelHeights);
}

function syncGenerationPanelHeights() {
  const grid = document.querySelector(".generation-grid");
  const source = document.querySelector(".main-settings");
  if (!grid || !source) return;
  grid.style.setProperty("--generation-panel-height", "auto");
  if ((els.factoryView && els.factoryView.hidden) || window.innerWidth < 1181) return;
  const height = Math.ceil(source.getBoundingClientRect().height);
  if (height > 0) {
    grid.style.setProperty("--generation-panel-height", `${height}px`);
  }
}

function setAppView(view) {
  const activeView = ["factory", "presets", "midi", "layout", "live", "forge"].includes(view) ? view : "factory";
  if (els.factoryView) els.factoryView.hidden = activeView !== "factory";
  if (els.presetLabView) els.presetLabView.hidden = activeView !== "presets";
  if (els.liveModeView) els.liveModeView.hidden = activeView !== "live";
  if (els.effectForgeView) els.effectForgeView.hidden = activeView !== "forge";
  if (els.midiMapperView) els.midiMapperView.hidden = activeView !== "midi";
  if (els.midiLayoutView) els.midiLayoutView.hidden = activeView !== "layout";
  if (els.factoryTabButton) els.factoryTabButton.classList.toggle("active", activeView === "factory");
  if (els.presetLabTabButton) els.presetLabTabButton.classList.toggle("active", activeView === "presets");
  if (els.liveModeTabButton) els.liveModeTabButton.classList.toggle("active", activeView === "live");
  if (els.effectForgeTabButton) els.effectForgeTabButton.classList.toggle("active", activeView === "forge");
  if (els.midiMapperTabButton) els.midiMapperTabButton.classList.toggle("active", activeView === "midi");
  if (els.midiLayoutTabButton) els.midiLayoutTabButton.classList.toggle("active", activeView === "layout");
  if (els.factoryTabButton) els.factoryTabButton.setAttribute("aria-selected", String(activeView === "factory"));
  if (els.presetLabTabButton) els.presetLabTabButton.setAttribute("aria-selected", String(activeView === "presets"));
  if (els.liveModeTabButton) els.liveModeTabButton.setAttribute("aria-selected", String(activeView === "live"));
  if (els.effectForgeTabButton) els.effectForgeTabButton.setAttribute("aria-selected", String(activeView === "forge"));
  if (els.midiMapperTabButton) els.midiMapperTabButton.setAttribute("aria-selected", String(activeView === "midi"));
  if (els.midiLayoutTabButton) els.midiLayoutTabButton.setAttribute("aria-selected", String(activeView === "layout"));
  if (activeView === "presets") renderPresetLab();
  if (activeView === "midi") renderMidiMapper();
  if (activeView === "layout") renderMidiLayoutDesigner();
  if (activeView === "live") renderLiveMode();
  if (activeView === "forge") {
    renderForgePreviewParamFields();
    generateForgeDraft();
    startForgePreview();
  } else {
    stopForgePreview();
  }
  scheduleGenerationPanelSync();
  localStorage.setItem("lsf.active_view", activeView);
}

function initializeAppView() {
  const requestedView = new URLSearchParams(window.location.search).get("view");
  setAppView(requestedView || localStorage.getItem("lsf.active_view") || "factory");
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
    previewParams: collectForgePreviewParams(behavior),
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
  refreshForgePreview();
}

function renderForgePreviewPaletteOptions() {
  const select = els.forgePreviewPaletteSelect;
  if (!select) return;
  const current = select.value || "auto";
  select.innerHTML = "";
  select.append(option("Auto - selected palettes", "auto"));
  ((state.app && state.app.palettes) || []).forEach((palette) => {
    select.append(option(palette.name || palette.id, palette.id));
  });
  select.value = [...select.options].some((item) => item.value === current) ? current : "auto";
}

function forgePreviewSchemaForBehavior(behavior) {
  const meta = FORGE_BEHAVIORS[behavior] || FORGE_BEHAVIORS.energy;
  const schema = meta.ledfxEffect ? forgeBaseEffectSchema(meta.ledfxEffect) : null;
  const properties = schema && schema.properties && Object.keys(schema.properties).length
    ? schema.properties
    : forgeWorkshopPreviewProperties(behavior);
  return {
    effectType: meta.ledfxEffect || "Workshop draft",
    source: meta.ledfxEffect && schema && schema.properties ? "LedFx schema" : "Workshop draft schema",
    properties,
  };
}

function forgeWorkshopPreviewProperties(behavior) {
  const semantic = forgeSemanticParamDefaults(behavior);
  return {
    background_color: {type: "string", default: "#000000"},
    gradient: {type: "string", gradient: true, default: defaultForgeGradientValue()},
    gradient_name: {type: "string", default: defaultForgeGradientName()},
    brightness: {type: "number", minimum: 0, maximum: 1, default: Number(els.forgeIntensityInput.value || 70) / 100},
    speed: {type: "number", minimum: 0, maximum: 1, default: Number(els.forgeMotionInput.value || 58) / 100},
    detail: {type: "number", minimum: 0, maximum: 1, default: Number(els.forgeDetailInput.value || 52) / 100},
    decay: {type: "number", minimum: 0, maximum: 1, default: Number(els.forgeDecayInput.value || 46) / 100},
    flash: {type: "number", minimum: 0, maximum: 1, default: Number(els.forgeFlashInput.value || 35) / 100},
    shape_scale: {type: "number", minimum: 0, maximum: 1, default: semantic.scale},
    response_curve: {type: "number", minimum: 0, maximum: 1, default: semantic.curve},
    accent_gain: {type: "number", minimum: 0, maximum: 1, default: semantic.accent},
    smoothing: {type: "number", minimum: 0, maximum: 1, default: semantic.smooth},
    frequency_range: {type: "string", enum: forgeAllowedFrequencies(null), default: els.forgeFrequencySelect.value || "Lows (beat+bass)"},
  };
}

function forgePreviewParamDefinitions(behavior) {
  const schema = forgePreviewSchemaForBehavior(behavior);
  return Object.entries(schema.properties)
    .map(([key, spec]) => ({
      key,
      label: key,
      spec: spec && typeof spec === "object" ? spec : {},
      tooltip: forgePreviewParamTooltip(key, spec),
    }))
    .sort((left, right) => forgePreviewParamRank(left.key) - forgePreviewParamRank(right.key) || left.key.localeCompare(right.key));
}

function forgePreviewParamRank(key) {
  const order = [
    "gradient",
    "gradient_name",
    "color",
    "color_scan",
    "strobe_color",
    "background_color",
    "brightness",
    "background_brightness",
    "speed",
    "reactivity",
    "frequency_range",
    "blur",
    "detail",
    "decay",
    "flash",
    "strobe_width",
    "bass_threshold",
    "multiplier",
    "power_multiplier",
    "gradient_roll",
    "gradient_repeat",
    "mirror",
    "flip",
    "diag",
  ];
  const index = order.indexOf(key);
  if (index !== -1) return index;
  if (key.includes("gradient")) return 28;
  if (key.includes("color")) return 29;
  return 50;
}

const FORGE_PREVIEW_PARAM_HELP = {
  gradient: {
    what: "The main color ramp used by gradient-aware LedFx effects.",
    tune: "Choose a Workshop palette when you want the exported effect and scene to keep the same color language.",
  },
  gradient_name: {
    what: "A readable name LedFx stores beside the gradient value.",
    tune: "Keep it short and close to the selected palette name so scene lists stay easy to scan.",
  },
  background_color: {
    what: "The idle or empty-space color behind the active effect.",
    tune: "Black keeps contrast high; a dim color can fill quiet moments without overpowering hits.",
  },
  bg_color: {
    what: "The idle or empty-space color behind the active effect.",
    tune: "Black keeps contrast high; a dim color can fill quiet moments without overpowering hits.",
  },
  color: {
    what: "The main single-color accent used when the effect is not drawing from a gradient.",
    tune: "Use it for sharp hits or simple looks; use gradient when the effect should travel through a palette.",
  },
  color_scan: {
    what: "The scan or sweep color for moving bars, lines or highlights.",
    tune: "Brighter values make movement easier to read; darker values keep it subtle.",
  },
  color_lows: {
    what: "Color assigned to low-frequency content such as kick and bass.",
    tune: "Pick a grounded color from the lower part of the palette for weight and rhythm.",
  },
  color_low: {
    what: "Color assigned to low-frequency content such as kick and bass.",
    tune: "Pick a grounded color from the lower part of the palette for weight and rhythm.",
  },
  color_mids: {
    what: "Color assigned to mid-frequency content such as snares, chords and synth body.",
    tune: "Use a clear mid-palette color so groove information stays visible.",
  },
  color_mid: {
    what: "Color assigned to mid-frequency content such as snares, chords and synth body.",
    tune: "Use a clear mid-palette color so groove information stays visible.",
  },
  color_high: {
    what: "Color assigned to high-frequency accents such as hats, clicks and transients.",
    tune: "Use a bright or contrasting color for detail; lower brightness if it feels too busy.",
  },
  color_dark: {
    what: "A darker support color used for shadows, gaps or low-intensity states.",
    tune: "Keep this close to black for cleaner negative space.",
  },
  color_accent: {
    what: "Accent color used for emphasis, drops and stronger musical hits.",
    tune: "Choose a high-contrast color from the end of the palette for readable accents.",
  },
  strobe_color: {
    what: "Flash color used by strobe or peak moments.",
    tune: "White is strongest; palette accents are more comfortable for longer sets.",
  },
  flash_color: {
    what: "Flash color used by strobe or peak moments.",
    tune: "White is strongest; palette accents are more comfortable for longer sets.",
  },
  brightness: {
    what: "Overall visible intensity for this effect.",
    tune: "Lower values blend into a scene; higher values push the effect forward. Avoid max values when several devices stack.",
  },
  background_brightness: {
    what: "How much light remains in the background while the main effect is active.",
    tune: "Low values leave clean darkness; higher values create a fuller wash between hits.",
  },
  speed: {
    what: "How fast the effect moves or cycles.",
    tune: "Lower values feel slow and stable; higher values feel more urgent and energetic.",
  },
  idle_speed: {
    what: "Movement speed when the audio input is quiet.",
    tune: "Use low values for calm gaps; increase it if the scene should keep moving between hits.",
  },
  reactivity: {
    what: "How strongly the effect follows incoming audio.",
    tune: "Lower values are steadier; higher values catch more detail and can feel sharper.",
  },
  sensitivity: {
    what: "How easily the effect reacts to quieter audio.",
    tune: "Lower values wait for stronger hits; higher values respond to smaller details.",
  },
  gain: {
    what: "Input boost before the effect reacts to audio.",
    tune: "Raise it if the effect feels sleepy; lower it if it is always fully open.",
  },
  multiplier: {
    what: "Extra strength applied to the effect response.",
    tune: "Small changes can be dramatic; increase carefully when chasing more punch.",
  },
  power_multiplier: {
    what: "Extra intensity applied to stronger peaks.",
    tune: "Good for drops and peak scenes; keep it lower for warmup or ambient looks.",
  },
  bass_multiplier: {
    what: "Extra emphasis for bass-driven movement or flashes.",
    tune: "Raise for kick-heavy music; reduce if bass hits dominate the whole scene.",
  },
  frequency_range: {
    what: "Which part of the music the effect listens to.",
    tune: "Use lows for kick and bass, mids for groove/body, highs for hats and bright details.",
  },
  detail: {
    what: "How much fine structure the preview or generated effect draws.",
    tune: "Lower values are cleaner and wider; higher values add texture and visual complexity.",
  },
  bands: {
    what: "Number of frequency bands or visual slices.",
    tune: "Fewer bands look bold and simple; more bands show more audio detail.",
  },
  count: {
    what: "Number of repeated elements, blocks or particles.",
    tune: "Lower values feel spacious; higher values fill more of the strip.",
  },
  block_count: {
    what: "Number of visible blocks in the pattern.",
    tune: "Use fewer blocks for readable stage shapes; more blocks for dense texture.",
  },
  blur: {
    what: "Softens hard edges and blends neighboring pixels.",
    tune: "Lower values keep sharp shapes; higher values create glow and smoother trails.",
  },
  blur_decay: {
    what: "How quickly blur trails fade away.",
    tune: "Lower values snap back quickly; higher values leave longer afterglow.",
  },
  decay: {
    what: "How long the effect takes to fall back after a hit.",
    tune: "Short decay is tight and percussive; long decay leaves smoother tails.",
  },
  strobe_decay_rate: {
    what: "How quickly strobe flashes fade after triggering.",
    tune: "Lower values leave longer flash tails; higher values make flashes shorter and tighter.",
  },
  bass_strobe_decay_rate: {
    what: "How quickly bass-triggered flashes fade after low-end hits.",
    tune: "Lower values smear bass flashes; higher values make kick hits cleaner.",
  },
  smoothing: {
    what: "Smooths rapid changes in the audio response.",
    tune: "Lower values feel snappy; higher values feel calmer and less jittery.",
  },
  center_smoothing: {
    what: "Smooths movement around the center of a pattern.",
    tune: "Increase when centered effects shake too much; decrease for sharper movement.",
  },
  flash: {
    what: "How often drop, peak and strobe moments become visually aggressive.",
    tune: "Lower values keep flashes rare; higher values make transitions and peaks more explosive.",
  },
  strobe_width: {
    what: "How much of the strip is covered by a strobe hit.",
    tune: "Narrow flashes feel precise; wide flashes feel bigger and more intense.",
  },
  scan_width: {
    what: "Width of a moving scan or sweep.",
    tune: "Narrow scans read as sharp lines; wider scans become washes.",
  },
  width: {
    what: "Visible width of the main shape.",
    tune: "Reduce for precise lines; increase for broader blocks or fills.",
  },
  shape_scale: {
    what: "Size of the main generated shape.",
    tune: "Lower values leave more black space; higher values fill more of the device.",
  },
  scale: {
    what: "Size or spread of repeated visual elements.",
    tune: "Lower values keep the effect compact; higher values make it occupy more space.",
  },
  response_curve: {
    what: "How the visual response ramps from quiet audio to full output.",
    tune: "Lower values are more linear; higher values hold back quiet signal and emphasize peaks.",
  },
  accent_gain: {
    what: "Extra push for accents, edges and stronger hits.",
    tune: "Raise it for stronger punctuation; reduce it when scenes feel too jumpy.",
  },
  rotate: {
    what: "Rotates the pattern direction or gradient angle.",
    tune: "Use small changes to separate similar presets without changing their energy.",
  },
  spin: {
    what: "Adds rotating motion to circular or swept patterns.",
    tune: "Lower values feel stable; higher values add motion and tension.",
  },
  ring: {
    what: "Controls ring-like shape emphasis where the effect supports it.",
    tune: "Use lower values for softer centers and higher values for stronger outlines.",
  },
  gradient_roll: {
    what: "Moves the gradient along the pixels over time.",
    tune: "Zero keeps colors locked; higher values make the palette travel across the device.",
  },
  gradient_speed: {
    what: "Speed of gradient movement.",
    tune: "Lower values are calmer; higher values create faster color travel.",
  },
  gradient_roll_rate: {
    what: "Rate at which the gradient shifts along the strip.",
    tune: "Use low rates for slow drift; high rates for energetic rolling color.",
  },
  gradient_repeat: {
    what: "How many times the gradient repeats across the device.",
    tune: "One repeat gives one long color sweep; more repeats create stripes and busier looks.",
  },
  color_step: {
    what: "Step size used when moving through colors.",
    tune: "Smaller steps are smoother; larger steps make more obvious color jumps.",
  },
  bass_threshold: {
    what: "How strong bass must be before this effect triggers.",
    tune: "Lower values trigger more often; higher values reserve movement for bigger kick or bass hits.",
  },
  threshold: {
    what: "Minimum signal level needed before the parameter reacts.",
    tune: "Lower values are sensitive; higher values ignore quiet parts.",
  },
  min_volume: {
    what: "Lowest input level that still counts as active signal.",
    tune: "Raise it to stop noise from moving the effect during silence.",
  },
  contrast: {
    what: "Difference between dark and bright parts of the effect.",
    tune: "Lower contrast is softer; higher contrast makes shapes pop.",
  },
  saturation: {
    what: "Color intensity before output.",
    tune: "Lower values are muted; higher values are richer and more vivid.",
  },
  mirror: {
    what: "Mirrors the effect around the center of the device.",
    tune: "Turn on for symmetrical stage looks; turn off for one-direction travel.",
  },
  flip: {
    what: "Reverses the pixel direction of the effect.",
    tune: "Use it to match physical LED wiring or to make paired devices move opposite ways.",
  },
  diag: {
    what: "Skews the pattern diagonally on matrix or multi-zone layouts.",
    tune: "Useful on panels and grids; on a simple strip the change can be subtle.",
  },
  solid_color: {
    what: "Locks the effect to a single color instead of travelling through the palette.",
    tune: "Turn on for simple accents; leave off for gradient movement.",
  },
  color_cycler: {
    what: "Cycles through palette colors automatically.",
    tune: "Turn on for evolving color; turn off when the scene should stay locked to one palette position.",
  },
  color_correction: {
    what: "Applies LedFx color correction before output.",
    tune: "Usually leave this enabled unless colors look wrong on a specific device.",
  },
  fix_hues: {
    what: "Keeps hue handling more stable when the effect modifies colors.",
    tune: "Enable if colors drift strangely; disable if you want more color variation.",
  },
};

const FORGE_PREVIEW_ENUM_HELP = {
  frequency_range: {
    Beat: "beat and tempo pulse",
    Bass: "sub and kick pressure",
    "Lows (beat+bass)": "kick plus bass, safest dance default",
    Mids: "snare, chords and synth body",
    High: "hats, clicks and bright transients",
  },
  ease_method: {
    linear: "constant movement",
    ease_in: "starts gently, ends faster",
    ease_out: "starts fast, settles gently",
    ease_in_out: "slow start and slow finish",
  },
  easing: {
    linear: "constant movement",
    ease_in: "starts gently, ends faster",
    ease_out: "starts fast, settles gently",
    ease_in_out: "slow start and slow finish",
  },
  mode: {
    wipe: "one sweep replaces the previous pixels",
    add: "adds light on top of the current image",
    subtract: "removes light from the current image",
    overlay: "blends the effect over the current image",
    pulse: "pushes out from audio hits",
    scroll: "moves continuously across the device",
  },
};

function normalizeForgeParamKey(key) {
  return String(key || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function forgePreviewParamTooltip(key, spec = {}) {
  const type = forgeParamType(
    spec,
    Object.prototype.hasOwnProperty.call(spec, "default") ? spec.default : undefined
  );
  const parts = [];
  const what = forgePreviewParamHumanHelp(key, spec, type);
  const tuning = forgePreviewParamTuningHint(key, spec, type);
  const enumHelp = forgePreviewParamEnumHelp(key, spec);
  const schema = forgePreviewParamSchemaDetails(key, spec);

  if (what) parts.push(`What it changes: ${what}`);
  if (tuning) parts.push(`Tuning: ${tuning}`);
  if (enumHelp) parts.push(enumHelp);
  if (schema.length) parts.push(`Schema: ${schema.join(" | ")}`);
  return parts.join("\n\n");
}

function forgePreviewParamHumanHelp(key, spec = {}, type = "string") {
  const normalized = normalizeForgeParamKey(key);
  const direct = FORGE_PREVIEW_PARAM_HELP[normalized];
  if (direct) return direct.what;
  if (spec.gradient || normalized.includes("gradient")) {
    return "A gradient-aware color control. It can be overwritten by Workshop palette choices before export or scene save.";
  }
  if (normalized.includes("background") && normalized.includes("color")) {
    return "The color used for quiet areas or empty space behind the main animation.";
  }
  if (normalized.includes("strobe") || normalized.includes("flash")) {
    return "A flash or peak-related control used to make drops, accents and strobes stronger or softer.";
  }
  if (normalized.includes("color")) {
    return "A color input used by this effect for one musical layer or visual accent.";
  }
  if (normalized.includes("brightness") || normalized.includes("intensity")) {
    return "A light output control that changes how dominant this effect feels in the scene.";
  }
  if (normalized.includes("speed") || normalized.includes("roll") || normalized.includes("spin") || normalized.includes("rotate")) {
    return "A motion control that changes how fast or in which direction the visual pattern moves.";
  }
  if (normalized.includes("decay") || normalized.includes("smooth") || normalized.includes("blur")) {
    return "A transition control that changes how soft, sharp or long-lived the movement feels.";
  }
  if (normalized.includes("threshold") || normalized.includes("gate")) {
    return "A trigger threshold that decides how much signal is needed before the effect reacts.";
  }
  if (normalized.includes("count") || normalized.includes("bands") || normalized.includes("blocks")) {
    return "A density control for how many visual elements or audio bands the effect draws.";
  }
  if (type === "boolean") {
    return "A LedFx on/off option for this effect behavior.";
  }
  if (Array.isArray(spec.enum) && spec.enum.length) {
    return "A LedFx choice field that changes the internal behavior of this effect.";
  }
  if (type === "number" || type === "integer") {
    return "A numeric LedFx parameter exposed by the installed effect schema.";
  }
  return "A LedFx effect setting used by the local preview and by exported defaults.";
}

function forgePreviewParamTuningHint(key, spec = {}, type = "string") {
  const normalized = normalizeForgeParamKey(key);
  const direct = FORGE_PREVIEW_PARAM_HELP[normalized];
  if (direct) return direct.tune;
  if (Array.isArray(spec.enum) && spec.enum.length) {
    return "Pick from the list; Workshop writes the selected value exactly into the LedFx config.";
  }
  if (type === "boolean") {
    return "Off keeps the base behavior; On enables the extra transform or option for preview and export.";
  }
  if (spec.gradient || normalized.includes("gradient")) {
    return "Use a Workshop palette to keep color language consistent across generated scenes and presets.";
  }
  if (normalized.includes("color")) {
    return "Use palette-related colors for consistency, or choose a contrasting color for clearer accents.";
  }
  if (normalized.includes("threshold") || normalized.includes("gate")) {
    return "Move lower for more frequent reactions and higher for only the strongest musical moments.";
  }
  if (normalized.includes("decay") || normalized.includes("smooth") || normalized.includes("blur")) {
    return "Move lower for tighter response and higher for smoother tails or glow.";
  }
  if (normalized.includes("speed") || normalized.includes("roll") || normalized.includes("spin") || normalized.includes("rotate")) {
    return "Lower values are steadier; higher values create more movement and urgency.";
  }
  if (normalized.includes("brightness") || normalized.includes("intensity")) {
    return "Lower values sit behind other effects; higher values become more dominant on stage.";
  }
  if (normalized.includes("count") || normalized.includes("bands") || normalized.includes("blocks")) {
    return "Lower values are simpler and bolder; higher values are denser and more detailed.";
  }
  if (type === "number" || type === "integer") {
    return forgePreviewNumericHint(spec);
  }
  return "Adjust in small steps, then use the internal preview or LedFx preview device to check the result.";
}

function forgePreviewNumericHint(spec = {}) {
  const min = Number(spec.minimum);
  const max = Number(spec.maximum);
  if (Number.isFinite(min) && Number.isFinite(max)) {
    if (min === 0 && max === 1) return "0 is minimal, 1 is full strength. Values around 0.3-0.8 are usually the useful range.";
    if (min === 0 && max === 100) return "0% is minimal, 100% is full strength. Start in the middle and adjust by feel.";
    return `Use the LedFx range from ${formatParamDisplay(spec.minimum)} to ${formatParamDisplay(spec.maximum)}; start near the middle for safer drafts.`;
  }
  return "Use small changes first, because LedFx effects can react strongly to numeric jumps.";
}

function forgePreviewParamEnumHelp(key, spec = {}) {
  const values = Array.isArray(spec.enum) ? spec.enum.map(String) : [];
  if (!values.length) return "";
  const normalized = normalizeForgeParamKey(key);
  const descriptions = FORGE_PREVIEW_ENUM_HELP[normalized] || {};
  const visible = values.slice(0, 8);
  const explained = visible.map((value) => {
    const description = descriptions[value];
    return description ? `${value}: ${description}` : value;
  });
  const suffix = values.length > visible.length ? `, +${values.length - visible.length} more` : "";
  return `Choices: ${explained.join("; ")}${suffix}`;
}

function forgePreviewParamSchemaDetails(key, spec = {}) {
  const details = [`LedFx key ${key}`];
  const enumValues = Array.isArray(spec.enum) ? spec.enum : [];
  if (enumValues.length) details.push(`${enumValues.length} allowed values`);
  if (spec.minimum !== undefined || spec.maximum !== undefined) {
    details.push(`range ${formatParamDisplay(spec.minimum ?? "-infinity")} to ${formatParamDisplay(spec.maximum ?? "infinity")}`);
  }
  if (Object.prototype.hasOwnProperty.call(spec, "default")) {
    details.push(`default ${formatParamDisplay(spec.default)}`);
  }
  return details;
}

function forgePreviewDefaultParams(behavior) {
  const params = {};
  forgePreviewParamDefinitions(behavior).forEach((definition) => {
    params[definition.key] = forgeDefaultParamValue(behavior, definition.key, definition.spec);
  });
  return params;
}

function forgeDefaultParamValue(behavior, key, spec = {}) {
  const paletteDefaults = forgePaletteParamDefaults();
  if (Object.prototype.hasOwnProperty.call(paletteDefaults, key)) return paletteDefaults[key];

  const sliderDefaults = forgeSliderParamDefaults(behavior);
  if (Object.prototype.hasOwnProperty.call(sliderDefaults, key)) {
    return clampSchemaValue(sliderDefaults[key], spec);
  }

  if (Object.prototype.hasOwnProperty.call(spec, "default")) {
    return cloneDefaultValue(spec.default);
  }

  const type = forgeParamType(spec, undefined);
  if (Array.isArray(spec.enum) && spec.enum.length) return String(spec.enum[0]);
  if (type === "boolean") return false;
  if (type === "integer") return Math.round(Number(spec.minimum ?? 0));
  if (type === "number") return Number(spec.minimum ?? 0);
  if (type === "color") return "#000000";
  if (type === "json") return {};
  return "";
}

function forgePaletteParamDefaults() {
  const palette = currentForgePreviewPalette(0) || selectedPalettes()[0] || (((state.app && state.app.palettes) || [])[0]);
  const colors = (palette && palette.colors) || {};
  const gradient = palette
    ? palette.gradient || paletteGradient(colors, palette.positions || DEFAULT_GRADIENT_POSITIONS)
    : defaultForgeGradientValue();
  return {
    gradient,
    gradient_name: palette ? palette.name || palette.id || "Current gradient" : "Current gradient",
    background_color: colors.background || "#000000",
    color: colors.accent || colors.high || colors.mid || "#ffffff",
    color_scan: colors.accent || colors.high || colors.mid || "#ffffff",
    color_lows: colors.low || colors.mid || colors.accent || "#ffffff",
    color_low: colors.low || colors.mid || colors.accent || "#ffffff",
    color_mids: colors.mid || colors.low || colors.accent || "#ffffff",
    color_mid: colors.mid || colors.low || colors.accent || "#ffffff",
    color_high: colors.high || colors.accent || colors.mid || "#ffffff",
    color_dark: colors.dark || colors.background || "#000000",
    color_accent: colors.accent || colors.high || "#ffffff",
    strobe_color: colors.strobe || colors.accent || "#ffffff",
  };
}

function defaultForgeGradientValue() {
  const palette = currentForgePreviewPalette(0) || selectedPalettes()[0] || (((state.app && state.app.palettes) || [])[0]);
  if (palette) {
    return palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS);
  }
  return "linear-gradient(90deg, #000000 0%, #001d59 24%, #0055ff 52%, #ff3bbd 78%, #ffd166 100%)";
}

function defaultForgeGradientName() {
  const palette = currentForgePreviewPalette(0) || selectedPalettes()[0] || (((state.app && state.app.palettes) || [])[0]);
  return palette ? palette.name || palette.id || "Current gradient" : "Current gradient";
}

function forgeSliderParamDefaults(behavior) {
  const semantic = forgeSemanticParamDefaults(behavior);
  const intensity = Number(els.forgeIntensityInput.value || 70) / 100;
  const motion = Number(els.forgeMotionInput.value || 58) / 100;
  const detail = Number(els.forgeDetailInput.value || 52) / 100;
  const decay = Number(els.forgeDecayInput.value || 46) / 100;
  const flash = Number(els.forgeFlashInput.value || 35) / 100;
  return {
    brightness: intensity,
    background_brightness: clampNumber(intensity * 0.42, 0, 1),
    speed: motion,
    idle_speed: motion,
    gradient_roll: Number((motion * 3.5).toFixed(2)),
    detail,
    decay,
    reactivity: clampNumber((intensity + detail) / 2, 0, 1),
    flash,
    shape_scale: semantic.scale,
    response_curve: semantic.curve,
    accent_gain: semantic.accent,
    smoothing: semantic.smooth,
    frequency_range: els.forgeFrequencySelect.value || "Lows (beat+bass)",
  };
}

function forgeSemanticParamDefaults(behavior) {
  const defaults = {};
  const custom = FORGE_PREVIEW_PARAM_SETS[behavior] || [];
  FORGE_PREVIEW_DEFAULT_PARAMS.forEach((fallback, index) => {
    const definition = {...fallback, ...(custom[index] || {})};
    defaults[definition.key] = clampNumber(Number(definition.defaultValue) / 100, 0, 1);
  });
  return defaults;
}

function clampSchemaValue(value, spec = {}) {
  if (typeof value !== "number") return value;
  let next = value;
  if (spec.minimum !== undefined) next = Math.max(Number(spec.minimum), next);
  if (spec.maximum !== undefined) next = Math.min(Number(spec.maximum), next);
  return next;
}

function ensureForgePreviewParams(behavior = (els.forgeBehaviorSelect && els.forgeBehaviorSelect.value) || "energy") {
  const key = behavior || "energy";
  const defaults = forgePreviewDefaultParams(key);
  const current = state.forgePreview.paramsByBehavior[key] || {};
  const next = {...defaults};
  Object.keys(defaults).forEach((paramKey) => {
    if (Object.prototype.hasOwnProperty.call(current, paramKey)) {
      next[paramKey] = cloneDefaultValue(current[paramKey]);
    }
  });
  state.forgePreview.paramsByBehavior[key] = next;
  return next;
}

function collectForgePreviewParams(behavior = (els.forgeBehaviorSelect && els.forgeBehaviorSelect.value) || "energy") {
  return cloneDefaultValue(ensureForgePreviewParams(behavior));
}

function renderForgePreviewParamFields() {
  const container = els.forgePreviewParamFields;
  if (!container) return;
  const behavior = (els.forgeBehaviorSelect && els.forgeBehaviorSelect.value) || "energy";
  const schema = forgePreviewSchemaForBehavior(behavior);
  const definitions = forgePreviewParamDefinitions(behavior);
  const values = ensureForgePreviewParams(behavior);
  container.innerHTML = "";
  if (els.forgePreviewParamDescription) {
    els.forgePreviewParamDescription.textContent = `${schema.source}: ${schema.effectType}. ${definitions.length} editable LedFx fields drive the internal preview and exported defaults. Hover the info icons for practical tuning notes and schema limits.`;
  }
  definitions.forEach((definition) => {
    container.append(forgePreviewConfigField(behavior, definition, values[definition.key]));
  });
}

function forgePreviewConfigField(behavior, definition, value) {
  const field = document.createElement("label");
  field.className = "param-field forge-preview-param-field";

  const title = document.createElement("span");
  title.className = "field-title";
  const titleText = document.createElement("span");
  titleText.textContent = definition.label;
  const info = document.createElement("button");
  info.className = "info-button";
  info.type = "button";
  info.dataset.tooltip = definition.tooltip;
  info.textContent = "i";
  title.append(titleText, info);
  field.append(title);

  const control = forgePreviewParamControl(behavior, definition, value);
  field.append(control);
  if (control.dataset && control.dataset.gradientPreview === "true") {
    field.append(forgeGradientPreviewNode(control.value));
  } else if (control.dataset && control.dataset.colorPreview === "true") {
    field.append(forgeColorPreviewNode(control.value));
  }
  return field;
}

function forgePreviewParamControl(behavior, definition, value) {
  const spec = definition.spec || {};
  const enumValues = Array.isArray(spec.enum) ? spec.enum : [];
  const type = forgeParamType(spec, value);
  const isPaletteGradient = isGradientParam(definition.key, value, spec);

  if (enumValues.length || isPaletteGradient) {
    const select = document.createElement("select");
    select.dataset.forgeParamKey = definition.key;
    select.dataset.valueType = type;
    if (isPaletteGradient) {
      addGradientOptions(select, value);
      select.dataset.gradientPreview = "true";
    } else {
      addSelectOptions(select, enumValues, value);
    }
    select.value = String(value);
    select.addEventListener("change", () => {
      setForgePreviewParamValue(behavior, definition.key, select.value, {syncGradientName: isPaletteGradient, rerender: isPaletteGradient});
    });
    return select;
  }

  if (type === "number" || type === "integer") {
    return forgePreviewNumberControl(behavior, definition, value, type);
  }

  if (type === "boolean") {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(value);
    input.dataset.forgeParamKey = definition.key;
    input.dataset.valueType = type;
    input.addEventListener("change", () => setForgePreviewParamValue(behavior, definition.key, input.checked));
    return input;
  }

  if (type === "color") {
    const input = document.createElement("input");
    input.type = "color";
    input.value = value || "#000000";
    input.dataset.forgeParamKey = definition.key;
    input.dataset.valueType = type;
    input.dataset.colorPreview = "true";
    input.addEventListener("input", () => {
      setForgePreviewParamValue(behavior, definition.key, input.value);
      syncForgeColorPreview(input);
    });
    return input;
  }

  if (type === "json") {
    const textarea = document.createElement("textarea");
    textarea.rows = 3;
    textarea.spellcheck = false;
    textarea.value = JSON.stringify(value || {}, null, 2);
    textarea.dataset.forgeParamKey = definition.key;
    textarea.dataset.valueType = type;
    textarea.addEventListener("change", () => {
      try {
        setForgePreviewParamValue(behavior, definition.key, JSON.parse(textarea.value));
      } catch (error) {
        showToast(`Invalid JSON: ${definition.key}`);
      }
    });
    return textarea;
  }

  const input = document.createElement("input");
  input.type = "text";
  input.value = value === null || value === undefined ? "" : String(value);
  input.dataset.forgeParamKey = definition.key;
  input.dataset.valueType = type;
  input.addEventListener("input", () => setForgePreviewParamValue(behavior, definition.key, input.value));
  return input;
}

function forgePreviewNumberControl(behavior, definition, value, type) {
  const spec = definition.spec || {};
  const wrap = document.createElement("span");
  wrap.className = "forge-number-control";
  const numeric = Number(value);
  const safeValue = Number.isFinite(numeric) ? numeric : Number(spec.default ?? spec.minimum ?? 0);
  const min = Number(spec.minimum);
  const max = Number(spec.maximum);
  const bounded = Number.isFinite(min) && Number.isFinite(max) && max > min;
  const step = forgeNumberStep(type, min, max);

  if (bounded) {
    const range = document.createElement("input");
    range.type = "range";
    range.min = String(min);
    range.max = String(max);
    range.step = String(step);
    range.value = String(clampNumber(safeValue, min, max));
    wrap.append(range);
  }

  const input = document.createElement("input");
  input.type = "number";
  input.step = String(step);
  if (Number.isFinite(min)) input.min = String(min);
  if (Number.isFinite(max)) input.max = String(max);
  input.value = formatParamInputValue(bounded ? clampNumber(safeValue, min, max) : safeValue, type);
  input.dataset.forgeParamKey = definition.key;
  input.dataset.valueType = type;
  wrap.append(input);

  const update = (rawValue, source) => {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return;
    const next = type === "integer" ? Math.round(parsed) : parsed;
    const clamped = bounded ? clampNumber(next, min, max) : next;
    [...wrap.querySelectorAll("input")].forEach((node) => {
      if (node === source) return;
      node.value = formatParamInputValue(clamped, type);
    });
    setForgePreviewParamValue(behavior, definition.key, clamped);
  };
  wrap.querySelectorAll("input").forEach((node) => {
    node.addEventListener("input", () => update(node.value, node));
    node.addEventListener("change", () => update(node.value, node));
  });
  return wrap;
}

function forgeNumberStep(type, min, max) {
  if (type === "integer") return 1;
  if (Number.isFinite(min) && Number.isFinite(max)) {
    const range = Math.abs(max - min);
    if (range <= 2) return 0.001;
    if (range <= 20) return 0.01;
    return 0.1;
  }
  return 0.001;
}

function formatParamInputValue(value, type) {
  if (type === "integer") return String(Math.round(Number(value) || 0));
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return String(Number(number.toFixed(3)));
}

function formatParamDisplay(value) {
  if (Array.isArray(value) || (value && typeof value === "object")) return JSON.stringify(value);
  return String(value);
}

function forgeParamType(spec = {}, value) {
  const schemaType = Array.isArray(spec.type) ? spec.type.find((item) => item !== "null") : spec.type;
  if (schemaType === "boolean") return "boolean";
  if (schemaType === "integer" || schemaType === "int") return "integer";
  if (schemaType === "number") return "number";
  if (schemaType === "array" || schemaType === "object") return "json";
  if (typeof value === "boolean") return "boolean";
  if (Number.isInteger(value)) return "integer";
  if (typeof value === "number") return "number";
  if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) return "color";
  if (Array.isArray(value) || (value && typeof value === "object")) return "json";
  if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(spec.default || "")) return "color";
  return "string";
}

function forgeGradientPreviewNode(value) {
  const preview = document.createElement("span");
  preview.className = "param-gradient-preview";
  preview.style.background = value || "linear-gradient(90deg, #000000, #444444)";
  return preview;
}

function forgeColorPreviewNode(value) {
  const preview = document.createElement("span");
  preview.className = "midi-color-preview forge-color-preview";
  const swatch = document.createElement("span");
  swatch.className = "midi-color-swatch";
  swatch.style.background = value || "#000000";
  const text = document.createElement("span");
  text.textContent = value || "#000000";
  preview.append(swatch, text);
  return preview;
}

function syncForgeColorPreview(input) {
  const preview = input.closest(".forge-preview-param-field")?.querySelector(".forge-color-preview");
  if (!preview) return;
  const color = input.value || "#000000";
  const swatch = preview.querySelector(".midi-color-swatch");
  const text = preview.querySelector("span:last-child");
  if (swatch) swatch.style.background = color;
  if (text) text.textContent = color;
}

function setForgePreviewParamValue(behavior, key, value, options = {}) {
  const params = ensureForgePreviewParams(behavior);
  params[key] = cloneDefaultValue(value);
  if (options.syncGradientName) syncForgePreviewGradientName(behavior, value);
  generateForgeDraft();
  if (options.rerender) renderForgePreviewParamFields();
}

function syncForgePreviewGradientName(behavior, gradientValue) {
  const params = ensureForgePreviewParams(behavior);
  if (!Object.prototype.hasOwnProperty.call(params, "gradient_name")) return;
  const matched = paletteNameForGradientValue(gradientValue);
  params.gradient_name = matched || "Current gradient";
}

function applyForgePaletteToPreviewConfig() {
  const behavior = (els.forgeBehaviorSelect && els.forgeBehaviorSelect.value) || "energy";
  const params = ensureForgePreviewParams(behavior);
  const defaults = forgePaletteParamDefaults();
  Object.keys(defaults).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      params[key] = defaults[key];
    }
  });
  renderForgePreviewParamFields();
  generateForgeDraft();
}

function resetForgePreviewParams() {
  const behavior = (els.forgeBehaviorSelect && els.forgeBehaviorSelect.value) || "energy";
  delete state.forgePreview.paramsByBehavior[behavior];
  renderForgePreviewParamFields();
  generateForgeDraft();
  showToast("Preview config reset.");
}

function randomizeForgePreviewParams(behavior) {
  const params = {};
  forgePreviewParamDefinitions(behavior).forEach((definition) => {
    params[definition.key] = randomForgePreviewValue(behavior, definition);
  });
  state.forgePreview.paramsByBehavior[behavior] = params;
  renderForgePreviewParamFields();
}

function randomForgePreviewValue(behavior, definition) {
  const key = definition.key;
  const spec = definition.spec || {};
  const defaults = forgePreviewDefaultParams(behavior);
  const current = defaults[key];
  if (Array.isArray(spec.enum) && spec.enum.length) return randomChoice(spec.enum);
  if (isGradientParam(key, current, spec)) {
    const palettes = selectedPalettes().length ? selectedPalettes() : ((state.app && state.app.palettes) || []);
    const palette = palettes.length ? randomChoice(palettes) : null;
    return palette ? palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS) : current;
  }
  const type = forgeParamType(spec, current);
  if (type === "boolean") return Math.random() > 0.5;
  if (type === "color") {
    const paletteDefaults = forgePaletteParamDefaults();
    return paletteDefaults[key] || paletteDefaults.color || current || "#ffffff";
  }
  if (type === "number" || type === "integer") {
    const min = Number.isFinite(Number(spec.minimum)) ? Number(spec.minimum) : 0;
    const max = Number.isFinite(Number(spec.maximum)) ? Number(spec.maximum) : (Number(current) > 1 ? Number(current) * 1.4 : 1);
    const value = min + Math.random() * Math.max(0, max - min);
    return type === "integer" ? Math.round(value) : Number(value.toFixed(3));
  }
  return current;
}

function forgeDerivedPreviewParams(options) {
  const defaults = forgeSemanticParamDefaults(options.behavior);
  return {
    brightness: forgeNormalizedConfigNumber(options, ["brightness"], options.intensity),
    motion: forgeNormalizedConfigNumber(options, ["speed", "idle_speed", "gradient_roll", "gradient_roll_rate", "gradient_speed", "rotate", "spin", "roll"], options.motion),
    detail: forgeNormalizedConfigNumber(options, ["detail", "gradient_scale", "block_count", "count", "bands", "scan_width", "strobe_width", "shape_scale", "ring", "width"], options.detail),
    decay: forgeNormalizedConfigNumber(options, ["decay", "strobe_decay_rate", "bass_strobe_decay_rate", "decay_rate", "smoothing", "center_smoothing", "blur", "blur_decay"], options.decay),
    flash: forgeNormalizedConfigNumber(options, ["flash", "strobe_width", "accent_gain", "power_multiplier", "multiplier", "bass_multiplier", "sparks"], options.flash),
    curve: forgeNormalizedConfigNumber(options, ["response_curve", "reactivity", "power_multiplier", "multiplier", "bass_threshold", "sensitivity", "gain"], defaults.curve),
    scale: forgeNormalizedConfigNumber(options, ["shape_scale", "detail", "gradient_scale", "block_count", "count", "bands", "scan_width", "ring", "width"], defaults.scale),
    accent: forgeNormalizedConfigNumber(options, ["accent_gain", "flash", "strobe_width", "power_multiplier", "multiplier", "bass_multiplier", "sparks"], defaults.accent),
    smooth: forgeNormalizedConfigNumber(options, ["smoothing", "decay", "strobe_decay_rate", "bass_strobe_decay_rate", "blur", "center_smoothing", "blur_decay"], defaults.smooth),
  };
}

function forgeNormalizedConfigNumber(options, keys, fallback) {
  const config = (options && options.previewParams) || {};
  const schema = forgePreviewSchemaForBehavior((options && options.behavior) || "energy").properties || {};
  const match = forgeConfigValueForKeys(config, keys);
  if (!match) return clampNumber(fallback, 0, 1);
  const raw = match.value;
  if (raw === "" || raw === null || raw === undefined || typeof raw === "boolean") return clampNumber(fallback, 0, 1);
  const number = Number(raw);
  if (!Number.isFinite(number)) return clampNumber(fallback, 0, 1);
  const spec = schema[match.key] || {};
  const min = Number(spec.minimum);
  const max = Number(spec.maximum);
  if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
    return clampNumber((number - min) / (max - min), 0, 1);
  }
  if (number >= 0 && number <= 1) return number;
  return clampNumber(number / Math.max(1, Math.abs(number), 10), 0, 1);
}

function forgeConfigValueForKeys(config, keys) {
  const entries = Object.entries(config || {});
  if (!entries.length) return null;
  const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      return {key, value: config[key]};
    }
  }
  const normalizedEntries = entries.map(([key, value]) => ({key, value, normalized: normalize(key)}));
  for (const wanted of keys.map(normalize)) {
    const exact = normalizedEntries.find((entry) => entry.normalized === wanted);
    if (exact) return exact;
  }
  for (const wanted of keys.map(normalize)) {
    const partial = normalizedEntries.find((entry) => wanted && entry.normalized.includes(wanted));
    if (partial) return partial;
  }
  return null;
}

function forgeGeneratedModuleDefaults(options) {
  const derived = forgeDerivedPreviewParams(options);
  const params = (options && options.previewParams) || {};
  return {
    brightness: derived.brightness,
    speed: derived.motion,
    detail: derived.detail,
    decay: derived.decay,
    flash: derived.flash,
    shape_scale: derived.scale,
    response_curve: derived.curve,
    accent_gain: derived.accent,
    smoothing: derived.smooth,
    mirror: forgeBooleanConfigValue(params, ["mirror"]),
    flip: forgeBooleanConfigValue(params, ["flip", "reverse"]),
    diag: forgeBooleanConfigValue(params, ["diag", "diagonal", "deep_diag"]),
    solid_color: forgeBooleanConfigValue(params, ["solid_color", "solid"]),
    color_cycler: forgeBooleanConfigValue(params, ["color_cycler", "color_cycle", "cycle_colors"]),
  };
}

function syncForgeMainControlToPreviewParams(kind) {
  const behavior = (els.forgeBehaviorSelect && els.forgeBehaviorSelect.value) || "energy";
  const params = ensureForgePreviewParams(behavior);
  const schema = forgePreviewSchemaForBehavior(behavior).properties || {};
  const sliderDefaults = forgeSliderParamDefaults(behavior);
  const unitValues = {
    intensity: Number(els.forgeIntensityInput.value || 70) / 100,
    motion: Number(els.forgeMotionInput.value || 58) / 100,
    detail: Number(els.forgeDetailInput.value || 52) / 100,
    decay: Number(els.forgeDecayInput.value || 46) / 100,
    flash: Number(els.forgeFlashInput.value || 35) / 100,
  };
  const groups = {
    intensity: ["brightness", "background_brightness", "reactivity", "sensitivity", "gain"],
    motion: ["speed", "idle_speed", "gradient_roll", "gradient_roll_rate", "gradient_speed", "rotate", "spin", "roll"],
    detail: ["detail", "gradient_scale", "block_count", "count", "bands", "scan_width", "shape_scale", "ring", "width"],
    decay: ["decay", "strobe_decay_rate", "bass_strobe_decay_rate", "decay_rate", "smoothing", "center_smoothing", "blur", "blur_decay"],
    flash: ["flash", "strobe_width", "accent_gain", "power_multiplier", "multiplier", "bass_multiplier", "sparks"],
    frequency: ["frequency_range"],
  };
  const keys = groups[kind] || [];
  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(params, key)) return;
    if (kind === "frequency") {
      params[key] = els.forgeFrequencySelect.value || sliderDefaults.frequency_range;
      return;
    }
    const spec = schema[key] || {};
    const unit = unitValues[kind] ?? 0.5;
    const value = Object.prototype.hasOwnProperty.call(sliderDefaults, key)
      ? sliderDefaults[key]
      : forgeSchemaValueFromUnit(unit, spec);
    params[key] = clampSchemaValue(value, spec);
  });
  renderForgePreviewParamFields();
  generateForgeDraft();
}

function forgeSchemaValueFromUnit(unit, spec = {}) {
  const type = forgeParamType(spec, undefined);
  const normalized = clampNumber(unit, 0, 1);
  const min = Number(spec.minimum);
  const max = Number(spec.maximum);
  if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
    const value = min + normalized * (max - min);
    return type === "integer" ? Math.round(value) : Number(value.toFixed(3));
  }
  return type === "integer" ? Math.round(normalized * 100) : normalized;
}

function refreshForgePreview() {
  if (!els.forgePreviewCanvas) return;
  drawForgePreviewFrame(performance.now(), true);
}

function startForgePreview() {
  if (!els.forgePreviewCanvas || (els.effectForgeView && els.effectForgeView.hidden)) return;
  syncForgePreviewPauseButton();
  refreshForgePreview();
  if (!state.forgePreview.running || state.forgePreview.requestId) return;
  state.forgePreview.requestId = requestAnimationFrame(animateForgePreview);
}

function stopForgePreview() {
  if (!state.forgePreview.requestId) return;
  cancelAnimationFrame(state.forgePreview.requestId);
  state.forgePreview.requestId = 0;
  state.forgePreview.lastTime = 0;
}

function toggleForgePreview() {
  state.forgePreview.running = !state.forgePreview.running;
  syncForgePreviewPauseButton();
  if (state.forgePreview.running) {
    startForgePreview();
  } else {
    stopForgePreview();
    refreshForgePreview();
  }
}

function syncForgePreviewPauseButton() {
  if (els.forgePreviewPauseButton) {
    els.forgePreviewPauseButton.textContent = state.forgePreview.running ? "Pause" : "Play";
  }
}

function animateForgePreview(time) {
  state.forgePreview.requestId = 0;
  drawForgePreviewFrame(time);
  if (state.forgePreview.running && (!els.effectForgeView || !els.effectForgeView.hidden)) {
    state.forgePreview.requestId = requestAnimationFrame(animateForgePreview);
  }
}

function drawForgePreviewFrame(time, force = false) {
  const canvas = els.forgePreviewCanvas;
  if (!canvas) return;
  if (!force && (!state.forgePreview.running || (els.effectForgeView && els.effectForgeView.hidden))) return;
  const width = Math.max(280, Math.floor(canvas.clientWidth || canvas.width || 640));
  const height = Math.max(96, Math.floor(canvas.clientHeight || canvas.height || 128));
  const ratio = window.devicePixelRatio || 1;
  const pixelWidth = Math.floor(width * ratio);
  const pixelHeight = Math.floor(height * ratio);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const options = collectForgeOptions();
  const previewSource = forgePreviewPaletteSource(options, time);
  const stops = previewSource.stops;
  const signals = forgePreviewSignals(time, options);
  const transformFlags = forgePreviewTransformFlags(options);
  updateForgePreviewMeta(options, previewSource, signals);

  const lastTime = state.forgePreview.lastTime || time;
  const delta = Math.min(0.06, Math.max(0.001, (time - lastTime) / 1000));
  if (state.forgePreview.running || force) {
    const tuning = signals.tuning || forgeDerivedPreviewParams(options);
    state.forgePreview.phase = wrap01(
      state.forgePreview.phase + delta * (0.08 + tuning.motion * 0.42 + tuning.flash * 0.08),
    );
  }
  state.forgePreview.lastTime = time;

  ctx.fillStyle = "#020405";
  ctx.fillRect(0, 0, width, height);
  const bars = Math.max(48, Math.min(180, Math.floor(width / 5)));
  const gap = width > 460 ? 1 : 0;
  const barWidth = width / bars;
  for (let index = 0; index < bars; index += 1) {
    const rawX = (index + 0.5) / bars;
    const x = forgePreviewPatternPosition(rawX, index, bars, transformFlags);
    const level = forgePreviewLevelAt(options.behavior, x, options, signals, index);
    const colorT = forgePreviewColorAt(options.behavior, x, options, signals, index, transformFlags);
    const rgb = sampleForgeGradient(stops, colorT);
    const glow = Math.pow(level, 0.78);
    ctx.fillStyle = `rgb(${Math.round(rgb.r * glow)}, ${Math.round(rgb.g * glow)}, ${Math.round(rgb.b * glow)})`;
    ctx.fillRect(index * barWidth, 0, Math.max(1, barWidth - gap), height);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let line = 0; line <= 24; line += 1) {
    const x = Math.round((line / 24) * width) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(37, 199, 217, 0.18)";
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
}

function forgePreviewTransformFlags(options) {
  const params = (options && options.previewParams) || {};
  return {
    mirror: forgeBooleanConfigValue(params, ["mirror"]),
    flip: forgeBooleanConfigValue(params, ["flip", "reverse"]),
    diag: forgeBooleanConfigValue(params, ["diag", "diagonal", "deep_diag"]),
    solidColor: forgeBooleanConfigValue(params, ["solid_color", "solid"]),
    colorCycler: forgeBooleanConfigValue(params, ["color_cycler", "color_cycle", "cycle_colors"]),
  };
}

function forgeBooleanConfigValue(params, keys) {
  const match = forgeConfigValueForKeys(params || {}, keys);
  if (!match) return false;
  const value = match.value;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "yes", "on", "enabled"].includes(normalized);
  }
  return Boolean(value);
}

function forgePreviewPatternPosition(rawX, index, bars, flags) {
  let x = clampNumber(rawX, 0, 1);
  if (flags.flip) x = 1 - x;
  if (flags.mirror) x = x <= 0.5 ? x * 2 : (1 - x) * 2;
  if (flags.diag) {
    const lane = index / Math.max(1, bars - 1);
    x = wrap01(x + lane * 0.22 + state.forgePreview.phase * 0.16);
  }
  return clampNumber(x, 0, 1);
}

function currentForgePreviewPalette(time = 0) {
  const selected = els.forgePreviewPaletteSelect ? els.forgePreviewPaletteSelect.value : "auto";
  const palettes = ((state.app && state.app.palettes) || []);
  if (selected && selected !== "auto") {
    return palettes.find((palette) => palette.id === selected) || null;
  }
  const chosen = state.app ? selectedPalettes() : [];
  const candidates = chosen.length ? chosen : palettes;
  if (!candidates.length) return null;
  const index = Math.floor((time / 1000) / 4) % candidates.length;
  return candidates[index];
}

function forgePreviewPaletteSource(options, time = 0) {
  const params = (options && options.previewParams) || {};
  const gradient = forgePreviewGradientParam(params);
  if (gradient) {
    return {
      label: forgePreviewGradientLabel(params, gradient),
      stops: forgeStopsFromGradientCss(gradient),
    };
  }
  const colorStops = forgePreviewColorParamStops(params);
  if (colorStops) {
    return {
      label: "Preview config colors",
      stops: colorStops,
    };
  }
  const palette = currentForgePreviewPalette(time);
  return {
    label: palette ? (palette.name || palette.id) : "Fallback gradient",
    stops: forgePreviewPaletteStops(palette),
  };
}

function forgePreviewGradientParam(params) {
  const entries = Object.entries(params || {});
  const priority = ["gradient", "color_gradient", "gradient_color"];
  for (const key of priority) {
    const value = params[key];
    if (typeof value === "string" && value.includes("linear-gradient")) return value;
  }
  const match = entries.find(([key, value]) => (
    typeof value === "string" &&
    value.includes("linear-gradient") &&
    key.toLowerCase().includes("gradient") &&
    !key.toLowerCase().includes("name")
  ));
  return match ? match[1] : "";
}

function forgePreviewGradientLabel(params, gradient) {
  const name = String((params && params.gradient_name) || "").trim();
  if (name) return name;
  return paletteNameForGradientValue(gradient) || "Preview config gradient";
}

function forgePreviewColorParamStops(params) {
  const colors = {
    background: forgePreviewColorParam(params, ["background_color", "bg_color", "bg"]),
    dark: forgePreviewColorParam(params, ["dark_color", "color_dark", "shadow_color"]),
    low: forgePreviewColorParam(params, ["color_lows", "color_low", "low_color", "bass_color", "color_scan"]),
    mid: forgePreviewColorParam(params, ["color_mids", "color_mid", "mid_color", "mids_color", "color"]),
    high: forgePreviewColorParam(params, ["color_high", "high_color", "treble_color", "strobe_color"]),
    accent: forgePreviewColorParam(params, ["accent_color", "color_accent", "strobe_color", "flash_color", "color"]),
  };
  const hasColor = ["dark", "low", "mid", "high", "accent"].some((role) => colors[role]);
  if (!hasColor) return null;
  const resolved = {
    background: colors.background || "#000000",
    dark: colors.dark || colors.background || "#000000",
    low: colors.low || colors.mid || colors.accent || "#ffffff",
    mid: colors.mid || colors.low || colors.accent || "#ffffff",
    high: colors.high || colors.mid || colors.accent || "#ffffff",
    accent: colors.accent || colors.high || colors.mid || "#ffffff",
  };
  return GRADIENT_ROLES.map((role) => ({
    position: clampNumber(Number(DEFAULT_GRADIENT_POSITIONS[role]) / 100, 0, 1),
    rgb: forgeHexToRgb(resolved[role]),
  })).sort((left, right) => left.position - right.position);
}

function forgePreviewColorParam(params, keys) {
  for (const key of keys) {
    const value = forgeNormalizeHexColor(params && params[key]);
    if (value) return value;
  }
  const wanted = new Set(keys.map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, "")));
  const entries = Object.entries(params || {});
  for (const [key, rawValue] of entries) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!wanted.has(normalized)) continue;
    const value = forgeNormalizeHexColor(rawValue);
    if (value) return value;
  }
  return "";
}

function forgeNormalizeHexColor(value) {
  let clean = String(value || "").trim();
  if (!clean.startsWith("#")) return "";
  clean = clean.replace("#", "");
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    clean = clean.split("").map((char) => `${char}${char}`).join("");
  }
  return /^[0-9a-fA-F]{6}$/.test(clean) ? `#${clean.toLowerCase()}` : "";
}

function forgeStopsFromGradientCss(value) {
  const matches = [...String(value || "").matchAll(/(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})(?:\s+([0-9.]+)%?)?/g)];
  if (!matches.length) return forgePreviewPaletteStops(null);
  const lastIndex = Math.max(1, matches.length - 1);
  return matches.map((match, index) => ({
    position: clampNumber(match[2] !== undefined ? Number(match[2]) / 100 : index / lastIndex, 0, 1),
    rgb: forgeHexToRgb(match[1]),
  })).sort((left, right) => left.position - right.position);
}

function forgePreviewPaletteStops(palette) {
  if (!palette) {
    return [
      {position: 0, rgb: forgeHexToRgb("#000000")},
      {position: 0.22, rgb: forgeHexToRgb("#001d59")},
      {position: 0.48, rgb: forgeHexToRgb("#0055ff")},
      {position: 0.72, rgb: forgeHexToRgb("#ff3bbd")},
      {position: 1, rgb: forgeHexToRgb("#ffd166")},
    ];
  }
  const colors = palette.colors || {};
  const positions = {...DEFAULT_GRADIENT_POSITIONS, ...((palette && palette.positions) || {})};
  return GRADIENT_ROLES.map((role) => ({
    position: clampNumber(Number(positions[role] ?? DEFAULT_GRADIENT_POSITIONS[role]) / 100, 0, 1),
    rgb: forgeHexToRgb(colors[role] || (role === "accent" ? "#ffffff" : "#000000")),
  })).sort((left, right) => left.position - right.position);
}

function forgeHexToRgb(hex) {
  let clean = String(hex || "").trim().replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((char) => `${char}${char}`).join("");
  }
  const value = parseInt(clean, 16);
  if (!Number.isFinite(value)) return {r: 255, g: 255, b: 255};
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function sampleForgeGradient(stops, position) {
  const t = clampNumber(position, 0, 1);
  const sorted = stops.length ? stops : forgePreviewPaletteStops(null);
  let previous = sorted[0];
  for (let index = 1; index < sorted.length; index += 1) {
    const next = sorted[index];
    if (t <= next.position) {
      const span = Math.max(0.001, next.position - previous.position);
      const local = clampNumber((t - previous.position) / span, 0, 1);
      return mixRgb(previous.rgb, next.rgb, local);
    }
    previous = next;
  }
  return sorted[sorted.length - 1].rgb;
}

function mixRgb(left, right, amount) {
  const t = clampNumber(amount, 0, 1);
  return {
    r: left.r + (right.r - left.r) * t,
    g: left.g + (right.g - left.g) * t,
    b: left.b + (right.b - left.b) * t,
  };
}

function forgePreviewSignals(time, options) {
  const seconds = time / 1000;
  const drive = clampNumber(Number((els.forgePreviewDriveInput && els.forgePreviewDriveInput.value) || 65) / 100, 0, 1);
  const auto = !els.forgePreviewDemoInput || els.forgePreviewDemoInput.checked;
  const tuning = forgeDerivedPreviewParams(options);
  const curve = Math.max(0.35, 1.65 - clampNumber(tuning.curve ?? 0.58, 0, 1) * 1.15);
  const shapeSignal = (value) => Math.pow(clampNumber(value, 0, 1), curve);
  if (!auto) {
    return {drive, level: shapeSignal(drive), bass: shapeSignal(drive), mids: shapeSignal(drive * 0.72), highs: shapeSignal(drive * 0.55), beat: drive, tuning};
  }
  const beatWave = sin01(seconds * 2.0);
  const beat = Math.pow(Math.max(0, (beatWave - 0.48) / 0.52), 2.4);
  const bass = clampNumber(0.18 + drive * (beat * 0.86 + sin01(seconds * 0.7) * 0.24), 0, 1);
  const mids = clampNumber(0.16 + drive * (sin01(seconds * 1.1 + 0.18) * 0.72 + beat * 0.16), 0, 1);
  const highs = clampNumber(0.08 + drive * (Math.pow(sin01(seconds * 6.7 + 0.4), 5) * 0.82 + beat * 0.18), 0, 1);
  const level = options.reactivity === "non_sound"
    ? clampNumber(0.25 + drive * 0.35, 0, 1)
    : clampNumber(bass * 0.5 + mids * 0.28 + highs * 0.22, 0, 1);
  return {
    drive,
    level: shapeSignal(level),
    bass: shapeSignal(bass),
    mids: shapeSignal(mids),
    highs: shapeSignal(highs),
    beat,
    tuning,
  };
}

function forgePreviewLevelAt(behavior, x, options, signals, index) {
  const p = state.forgePreview.phase;
  const tuning = signals.tuning || forgeDerivedPreviewParams(options);
  const brightness = clampNumber((0.16 + tuning.brightness * 0.88) * (0.86 + clampNumber(tuning.curve ?? 0.58, 0, 1) * 0.28), 0, 1.15);
  const detail = clampNumber(tuning.detail * 0.72 + clampNumber(tuning.scale ?? 0.55, 0, 1) * 0.42, 0, 1);
  const decay = clampNumber(tuning.decay * 0.68 + clampNumber(tuning.smooth ?? 0.46, 0, 1) * 0.36, 0, 1);
  const flash = clampNumber(tuning.flash * 0.72 + clampNumber(tuning.accent ?? 0.48, 0, 1) * 0.46, 0, 1);
  const motion = clampNumber(tuning.motion * 0.82 + clampNumber(tuning.scale ?? 0.55, 0, 1) * 0.18, 0, 1);
  const level = signals.level;
  switch (behavior) {
    case "static":
      return clampNumber(brightness * (0.68 + sin01(p * 0.65) * 0.16) * (options.reactivity === "non_sound" ? 1 : 0.55 + level * 0.55), 0, 1);
    case "gradient":
    case "wave":
      return clampNumber(brightness * (0.22 + sin01(x * (1.3 + detail * 3.8) + p * (0.6 + motion * 1.8)) * (0.48 + level * 0.42)), 0, 1);
    case "melt":
      return clampNumber(brightness * (0.2 + level * 0.86) * sin01(Math.sin(x * (1.4 + detail * 4.0) + p * 4.0) + level), 0, 1);
    case "scroll":
      return clampNumber(Math.pow(sin01((x + p) * (3.0 + detail * 15.0)), 4.6) * brightness * (0.2 + level + flash * 0.3), 0, 1);
    case "energy":
      return clampNumber(Math.max(sin01((x + p) * 1.4), sin01(x * (7.0 + detail * 12.0) - p * 5.0) * detail) * brightness * (0.25 + level + flash * 0.22), 0, 1);
    case "rain":
      return clampNumber((Math.pow(sin01(x * (16 + detail * 28) - p * (4 + motion * 8)), 12) + sin01(x * 5 - p * 2) * 0.2) * brightness * (0.2 + level + flash * 0.12), 0, 1);
    case "bar": {
      const fill = clampNumber(level * (0.55 + brightness + flash * 0.28), 0.04, 1);
      const edge = Math.max(0.01, 0.09 - detail * 0.06);
      return clampNumber((1 - clampNumber((x - fill) / edge, 0, 1)) * brightness, 0, 1);
    }
    case "multibar":
      return clampNumber(Math.pow(sin01(x * (4 + detail * 18)), 5.5) * (0.65 + 0.35 * sin01(x * 2 + p)) * brightness * (0.26 + level + flash * 0.18), 0, 1);
    case "equalizer": {
      const step = Math.floor(x * (6 + detail * 22));
      return clampNumber((0.35 + 0.65 * sin01(step * 0.31 + p * (1.8 + motion * 4.8))) * brightness * (0.22 + level + flash * 0.15), 0, 1);
    }
    case "concentric": {
      const distance = Math.abs(x - 0.5) * 2;
      const rings = Math.pow(sin01(distance * (3 + detail * 13) - p * (2 + motion * 4)), 2);
      return clampNumber(rings * brightness * (signals.beat * 0.35 + level + flash * 0.22) * (1 - decay * 0.22), 0, 1);
    }
    case "pulse": {
      const center = wrap01(p * (0.8 + motion));
      const distance = Math.min(Math.abs(x - center), 1 - Math.abs(x - center));
      const width = Math.max(0.025, 0.16 - detail * 0.1);
      return clampNumber(Math.exp(-(distance * distance) / width) * brightness * (0.35 + level + signals.beat * 0.45), 0, 1);
    }
    case "bands":
      return clampNumber(Math.pow(sin01(x * (4 + detail * 18) + p * 2), 2) * brightness * (0.2 + level + flash * 0.3), 0, 1);
    case "sparkle": {
      const noise = forgePreviewNoise(index * 0.17, Math.floor(p * 72));
      const threshold = 0.72 - detail * 0.24 - flash * 0.1;
      return noise > threshold ? clampNumber(brightness * (0.45 + signals.highs + flash * 0.4), 0, 1) : 0;
    }
    case "sub_swell":
      return clampNumber(Math.pow(sin01(x * (0.7 + detail * 1.8) + p * 0.8), 1.4 + decay * 2.2) * brightness * (0.14 + signals.bass * 0.95), 0, 1);
    case "tunnel": {
      const distance = Math.abs(x - 0.5) * 2;
      const rings = Math.pow(sin01(distance * (2 + detail * 15) - p * (2 + motion * 4 + flash * 2)), 2);
      const focus = clampNumber(1 - distance * (0.4 + decay * 0.55), 0, 1);
      return clampNumber(rings * focus * brightness * (0.32 + signals.bass + flash * 0.18), 0, 1);
    }
    case "laser_gate": {
      const beams = Math.pow(sin01(x * (1 + detail * 8) + p * (0.6 + motion * 2 + flash)), 18);
      const gate = options.reactivity === "non_sound" ? 0.65 + flash * 0.35 : clampNumber(level + flash * 0.55, 0, 1);
      return clampNumber(beams * gate * brightness * 1.18, 0, 1);
    }
    case "shimmer": {
      const fine = Math.pow(sin01(x * (24 + detail * 56) + p * (7 + motion * 8)), 10);
      return clampNumber(fine * brightness * (0.16 + signals.highs + flash * 0.34), 0, 1);
    }
    case "shadow_gap": {
      const gap = sin01(x * (1.2 + detail * 5.5) + p * 0.9);
      return gap > 0.72 - detail * 0.18 ? clampNumber(brightness * level * (0.16 + flash * 0.38), 0, 0.72) : 0;
    }
    case "riser": {
      const ramp = p;
      const band = clampNumber((x - (1 - ramp)) / Math.max(0.04, 0.34 - detail * 0.22), 0, 1);
      return clampNumber(band * (0.45 + 0.55 * sin01(x * (3 + detail * 18) + ramp * 4)) * brightness * (ramp * 0.5 + level * 0.7 + flash * 0.25), 0, 1);
    }
    case "call_response": {
      const zones = Math.floor(x * (2 + detail * 8));
      const side = (zones + Math.floor(p * (2 + flash * 6))) % 2;
      const active = side === 0 ? 1 : 0.24 + level * 0.4;
      return clampNumber(active * Math.pow(sin01(x * (1 + detail * 4) - p * 2), 2) * brightness * (0.25 + level + flash * 0.18), 0, 1);
    }
    case "ripple": {
      const origin = 0.5 + 0.2 * Math.sin(p * Math.PI * 2);
      const distance = Math.abs(x - origin);
      const ripples = Math.pow(sin01(distance * (10 + detail * 24) - p * (3 + motion * 5 + flash * 4)), 2);
      return clampNumber(ripples * Math.exp(-distance * (2 + decay * 5)) * brightness * (0.32 + level + flash * 0.25), 0, 1);
    }
    case "blade": {
      const edge = Math.max(0, 1 - Math.abs((x - p) * 2 - 1));
      return clampNumber(Math.pow(edge, Math.max(1, 6 - detail * 4)) * brightness * (0.28 + level + flash * 0.18), 0, 1);
    }
    case "bpm_strobe": {
      const threshold = 0.82 - flash * 0.34;
      const timed = sin01(p * (2 + detail * 6)) > threshold ? 1 : 0;
      const audioGate = options.reactivity === "non_sound" ? 1 : clampNumber(0.35 + signals.beat * 0.8, 0, 1);
      return timed * audioGate * brightness;
    }
    case "bass_strobe": {
      const gate = signals.bass + flash > 0.78 ? 1 : 0;
      return clampNumber((0.65 + 0.35 * sin01(x * (2 + detail * 10) + p * 4)) * gate * brightness * (1 - decay * 0.2), 0, 1);
    }
    default:
      return clampNumber(Math.pow(sin01(x * (2 + detail * 8) + p * 2), 2) * brightness * (0.24 + level), 0, 1);
  }
}

function forgePreviewColorAt(behavior, x, options, signals, index, flags = forgePreviewTransformFlags(options)) {
  const p = state.forgePreview.phase;
  const tuning = signals.tuning || forgeDerivedPreviewParams(options);
  const flash = clampNumber(tuning.flash ?? options.flash, 0, 1);
  const motion = clampNumber(tuning.motion ?? options.motion, 0, 1);
  let colorT;
  if (flags.solidColor) {
    colorT = 0.84;
  } else if (["static", "shadow_gap"].includes(behavior)) {
    colorT = clampNumber(0.35 + signals.level * 0.42, 0, 1);
  } else if (["bar", "equalizer", "bands"].includes(behavior)) {
    colorT = clampNumber(x * 0.72 + signals.level * 0.24, 0, 1);
  } else if (["bpm_strobe", "bass_strobe", "sparkle", "laser_gate", "shimmer"].includes(behavior)) {
    colorT = clampNumber(0.74 + flash * 0.24, 0, 1);
  } else if (["concentric", "tunnel", "ripple"].includes(behavior)) {
    colorT = wrap01(Math.abs(x - 0.5) * 1.8 + p * 0.35);
  } else if (behavior === "rain") {
    colorT = wrap01(x * 0.45 + p * 0.75 + index * 0.01);
  } else {
    colorT = wrap01(x + p * (0.18 + motion * 0.45));
  }
  if (flags.colorCycler) {
    colorT = wrap01(colorT + p * (0.45 + motion * 0.85));
  }
  if (flags.diag) {
    colorT = wrap01(colorT + index * 0.006);
  }
  return clampNumber(colorT, 0, 1);
}

function updateForgePreviewMeta(options, previewSource, signals) {
  if (els.forgePreviewEffect) {
    els.forgePreviewEffect.textContent = `${options.name || "Custom Effect"} - ${options.behaviorMeta.label}`;
  }
  if (els.forgePreviewStatus) {
    const paletteName = previewSource && previewSource.label ? previewSource.label : "Fallback gradient";
    const mode = options.reactivity === "non_sound" ? "timed" : "music-reactive";
    els.forgePreviewStatus.textContent = `${mode} preview | ${paletteName} | drive ${Math.round(signals.drive * 100)}%`;
  }
}

function sin01(value) {
  return 0.5 + 0.5 * Math.sin(value * Math.PI * 2);
}

function wrap01(value) {
  const wrapped = Number(value) % 1;
  return wrapped < 0 ? wrapped + 1 : wrapped;
}

function forgePreviewNoise(x, seed) {
  const value = Math.sin((x * 127.1 + seed * 311.7) * 43758.5453);
  return value - Math.floor(value);
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
  const moduleDefaults = forgeGeneratedModuleDefaults(options);
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
    `        vol.Optional("brightness", default=${formatFloat(moduleDefaults.brightness)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("speed", default=${formatFloat(moduleDefaults.speed)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("detail", default=${formatFloat(moduleDefaults.detail)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("decay", default=${formatFloat(moduleDefaults.decay)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("flash", default=${formatFloat(moduleDefaults.flash)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("shape_scale", default=${formatFloat(moduleDefaults.shape_scale)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("response_curve", default=${formatFloat(moduleDefaults.response_curve)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("accent_gain", default=${formatFloat(moduleDefaults.accent_gain)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("smoothing", default=${formatFloat(moduleDefaults.smoothing)}): vol.All(vol.Coerce(float), vol.Range(min=0.0, max=1.0)),`,
    `        vol.Optional("frequency_range", default="${options.frequency}"): vol.In(${JSON.stringify(options.frequencyChoices)}),`,
    `        vol.Optional("mirror", default=${formatPythonBool(moduleDefaults.mirror)}): bool,`,
    `        vol.Optional("flip", default=${formatPythonBool(moduleDefaults.flip)}): bool,`,
    `        vol.Optional("diag", default=${formatPythonBool(moduleDefaults.diag)}): bool,`,
    `        vol.Optional("solid_color", default=${formatPythonBool(moduleDefaults.solid_color)}): bool,`,
    `        vol.Optional("color_cycler", default=${formatPythonBool(moduleDefaults.color_cycler)}): bool,`,
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
    "        shape_scale = float(self.config.get(\"shape_scale\", 0.55))",
    "        response_curve = float(self.config.get(\"response_curve\", 0.58))",
    "        accent_gain = float(self.config.get(\"accent_gain\", 0.48))",
    "        smoothing = float(self.config.get(\"smoothing\", 0.46))",
    "        mirror = bool(self.config.get(\"mirror\", False))",
    "        flip = bool(self.config.get(\"flip\", False))",
    "        diag = bool(self.config.get(\"diag\", False))",
    "        solid_color = bool(self.config.get(\"solid_color\", False))",
    "        color_cycler = bool(self.config.get(\"color_cycler\", False))",
    "        detail = float(np.clip(detail * 0.72 + shape_scale * 0.42, 0.0, 1.0))",
    "        decay = float(np.clip(decay * 0.68 + smoothing * 0.36, 0.0, 1.0))",
    "        flash = float(np.clip(flash * 0.72 + accent_gain * 0.46, 0.0, 1.0))",
    "        brightness = float(np.clip(brightness * (0.86 + response_curve * 0.28), 0.0, 1.0))",
    "        self._phase = (self._phase + 0.01 + speed * 0.06) % 1.0",
    "        sample_x = self._transform_x(x, mirror, flip, diag)",
    `        level = self._shape_${options.behavior}(sample_x, brightness, detail, decay, flash)`,
    "        curve = max(0.35, 1.65 - response_curve * 1.15)",
    "        level = np.clip(level ** curve, 0.0, 1.0)",
    "        if solid_color:",
    "            gradient_points = np.ones_like(sample_x) * 0.84",
    "        else:",
    "            gradient_points = sample_x",
    "        gradient_points = (gradient_points + self._phase * (0.2 + (0.65 if color_cycler else 0.0))) % 1.0",
    "        colors = self.get_gradient_color_vectorized1d(gradient_points)",
    "        self.pixels = np.clip(colors * level[:, None], 0, 255)",
    "        self.roll_gradient()",
    "",
    "    def _transform_x(self, x, mirror, flip, diag):",
    "        sample_x = 1.0 - x if flip else x.copy()",
    "        if mirror:",
    "            sample_x = np.where(sample_x <= 0.5, sample_x * 2.0, (1.0 - sample_x) * 2.0)",
    "        if diag:",
    "            sample_x = (sample_x + x * 0.22 + self._phase * 0.16) % 1.0",
    "        return np.clip(sample_x, 0.0, 1.0)",
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
  const moduleDefaults = forgeGeneratedModuleDefaults(options);
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
      shape_scale: {range: [0.0, 1.0], variation: "direct", spread: 0.18},
      response_curve: {range: [0.0, 1.0], energy: "direct", spread: 0.14},
      accent_gain: {range: [0.0, 1.0], energy: "direct", spread: 0.16},
      smoothing: {range: [0.0, 1.0], energy: "inverse", spread: 0.12},
      gradient_roll: {range: [0, Math.max(0.4, Number((options.motion * 3.5).toFixed(2)))], energy: "direct", spread: 0.16},
    },
    palette_keys: forgePaletteKeys(options.behaviorMeta.paletteMode),
    defaults: {
      frequency_range: options.frequency,
      shape_scale: Number(moduleDefaults.shape_scale.toFixed(2)),
      response_curve: Number(moduleDefaults.response_curve.toFixed(2)),
      accent_gain: Number(moduleDefaults.accent_gain.toFixed(2)),
      smoothing: Number(moduleDefaults.smoothing.toFixed(2)),
      mirror: Boolean(moduleDefaults.mirror),
      flip: Boolean(moduleDefaults.flip),
      diag: Boolean(moduleDefaults.diag),
      solid_color: Boolean(moduleDefaults.solid_color),
      color_cycler: Boolean(moduleDefaults.color_cycler),
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
  if (["bass_strobe", "bpm_strobe"].includes(els.forgeBehaviorSelect.value) && els.forgeReactivitySelect.value === "non_sound") {
    els.forgeReactivitySelect.value = "sound";
  }
  renderForgePreviewParamFields();
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

function formatPythonBool(value) {
  return value ? "True" : "False";
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

  if (behaviorId === "static" || behaviorId === "gradient") {
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
  randomizeForgePreviewParams(behaviorId);

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

async function downloadShowPack() {
  if (!els.exportShowPackButton) return;
  els.exportShowPackButton.disabled = true;
  els.exportShowPackButton.textContent = "Exporting...";
  try {
    const response = await fetch("/api/show-pack/export");
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Export failed: ${response.status}`);
    }
    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/i);
    const fileName = match ? match[1] : "ledfx-workshop-show-pack.zip";
    downloadBlobAs(fileName, blob);
    showToast("Show Pack exported.");
  } catch (error) {
    showToast(error.message);
  } finally {
    els.exportShowPackButton.disabled = false;
    els.exportShowPackButton.textContent = "Export Show Pack";
  }
}

function chooseShowPackImport() {
  if (!els.importShowPackInput) return;
  els.importShowPackInput.value = "";
  els.importShowPackInput.click();
}

async function importShowPackFromFile(file) {
  if (!file) return;
  els.importShowPackButton.disabled = true;
  els.importShowPackButton.textContent = "Importing...";
  try {
    const archive = await readFileAsDataUrl(file);
    const data = await api("/api/show-pack/import", {
      method: "POST",
      body: JSON.stringify({archive, import_profiles: true, import_queue: true}),
    });
    state.scenes = data.scenes || [];
    state.similarityReport = data.similarity_report || null;
    await refreshAppCatalog();
    renderControls();
    renderScenes();
    showToast(`Imported Show Pack: ${data.generated_scene_count || 0} queued scenes.`);
  } catch (error) {
    showToast(error.message);
  } finally {
    els.importShowPackButton.disabled = false;
    els.importShowPackButton.textContent = "Import Show Pack";
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error || new Error("Could not read file.")));
    reader.readAsDataURL(file);
  });
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
  renderBlackoutControls();
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
        setTopPreviewStatus(state.topPreviewLastFrameAt ? "Stream reconnecting" : "Waiting stream", true);
        scheduleTopPreviewReconnect(virtualId, source, state.topPreviewLastFrameAt ? 2200 : 1000);
      }
    });
  } catch (error) {
    setTopPreviewStatus("Waiting stream", true);
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
    setTopPreviewStatus("Stream reconnecting", true);
    scheduleTopPreviewReconnect(virtualId, socket, 1200);
    return;
  }
  if (message && message.stream_error) {
    setTopPreviewStatus("Stream reconnecting", true);
    scheduleTopPreviewReconnect(virtualId, socket, 1200);
    return;
  }
  if (message && message.stream_status === "waiting") {
    setTopPreviewStatus(state.topPreviewLastFrameAt ? "Stream connected" : "Waiting stream", !state.topPreviewLastFrameAt);
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
  if (state.topPreviewReconnectTimer) {
    clearTimeout(state.topPreviewReconnectTimer);
    state.topPreviewReconnectTimer = null;
  }
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
      scheduleTopPreviewReconnect(virtual.id, state.topPreviewSocket, 1800);
    }
  }, 2400);
}

function scheduleTopPreviewReconnect(virtualId, socket, delay = 1400) {
  if (!virtualId || state.topPreviewSocket !== socket) return;
  if (state.topPreviewReconnectTimer) clearTimeout(state.topPreviewReconnectTimer);
  state.topPreviewReconnectTimer = setTimeout(() => {
    if (state.topPreviewSocket !== socket) return;
    closeTopPreviewStream(false);
    state.topPreviewStreamKey = "";
    state.topPreviewDeviceId = virtualId;
    connectTopPreviewStream();
  }, delay);
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

function stableSceneSortKey(scene) {
  const lsfRank = scene && scene.is_scene_factory ? "0" : "1";
  return `${lsfRank}|${String(scene && scene.name ? scene.name : "").toLowerCase()}|${scene && scene.id ? scene.id : ""}`;
}

function stabilizeLibraryScenes(nextScenes) {
  const incoming = Array.isArray(nextScenes) ? [...nextScenes] : [];
  const previousOrder = new Map((state.librarySceneOrder || []).map((id, index) => [id, index]));
  const hasPreviousOrder = previousOrder.size > 0;
  incoming.sort((left, right) => {
    const leftOrder = previousOrder.has(left.id) ? previousOrder.get(left.id) : Number.POSITIVE_INFINITY;
    const rightOrder = previousOrder.has(right.id) ? previousOrder.get(right.id) : Number.POSITIVE_INFINITY;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return stableSceneSortKey(left).localeCompare(stableSceneSortKey(right), undefined, {numeric: true});
  });
  if (!hasPreviousOrder) {
    incoming.sort((left, right) => stableSceneSortKey(left).localeCompare(stableSceneSortKey(right), undefined, {numeric: true}));
  }
  state.librarySceneOrder = incoming.map((scene) => scene.id);
  return incoming;
}

function playlistItemSceneId(item) {
  if (item && typeof item === "object") {
    return String(item.scene_id || item.id || item.scene || "").trim();
  }
  return String(item || "").trim();
}

function normalizeLibraryPlaylists(playlists, availableSceneIds) {
  const available = availableSceneIds instanceof Set ? availableSceneIds : new Set();
  return (Array.isArray(playlists) ? playlists : []).map((playlist) => {
    const rawItems = Array.isArray(playlist.items) ? playlist.items : [];
    const items = rawItems.filter((item) => available.has(playlistItemSceneId(item)));
    return {
      ...playlist,
      items,
      item_count: items.length,
      raw_item_count: Number.isFinite(Number(playlist.raw_item_count))
        ? Number(playlist.raw_item_count)
        : rawItems.length,
      missing_item_count: Number.isFinite(Number(playlist.missing_item_count))
        ? Number(playlist.missing_item_count)
        : Math.max(0, rawItems.length - items.length),
    };
  });
}

async function loadLedFxLibrary(toastOnSuccess = true) {
  try {
    const data = await api("/api/ledfx-library");
    const scenes = stabilizeLibraryScenes(data.scenes || []);
    const available = new Set(scenes.map((scene) => scene.id));
    state.ledfxLibrary = {
      scenes,
      playlists: normalizeLibraryPlaylists(data.playlists || [], available),
      playlist_state: data.playlist_state || {},
    };
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
  renderMidiLayoutDesigner();
  renderLiveMode();
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
    ...(scene.mood_tags || []),
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

function activePlaylist() {
  const activeId = activePlaylistId();
  if (!activeId) return null;
  return (state.ledfxLibrary.playlists || []).find((playlist) => playlist.id === activeId) || null;
}

function playlistSceneIds(playlist) {
  const ids = (playlist && Array.isArray(playlist.items) ? playlist.items : [])
    .map((item) => playlistItemSceneId(item))
    .filter(Boolean);
  const available = new Set((state.ledfxLibrary.scenes || []).map((scene) => scene.id));
  return available.size ? ids.filter((sceneId) => available.has(sceneId)) : ids;
}

function sceneForId(sceneId) {
  return (state.ledfxLibrary.scenes || []).find((scene) => scene.id === sceneId) || null;
}

function renderLiveMode() {
  if (!els.liveModeView) return;
  const playlists = state.ledfxLibrary.playlists || [];
  const currentPlaylist = activePlaylist();
  const activeScene = (state.ledfxLibrary.scenes || []).find((scene) => isLibrarySceneActive(scene)) || null;

  if (els.livePlaylistSummary) {
    const activeText = currentPlaylist ? `Active: ${currentPlaylist.name}` : "No active playlist.";
    els.livePlaylistSummary.textContent = `${playlists.length} playlists | ${activeText}`;
  }
  if (els.liveSceneSummary) {
    const count = currentPlaylist ? playlistSceneIds(currentPlaylist).length : 0;
    els.liveSceneSummary.textContent = currentPlaylist
      ? `${count} scenes in active playlist`
      : "Start a playlist to browse scenes.";
  }

  renderLiveNowPlaying(currentPlaylist, activeScene);
  renderLivePlaylistList(currentPlaylist);
  renderLiveSceneList(currentPlaylist, activeScene);
}

function renderLiveNowPlaying(playlist, activeScene) {
  if (!els.liveNowPlaying) return;
  els.liveNowPlaying.innerHTML = "";
  if (!playlist) {
    els.liveNowPlaying.append(emptyNote("No active playlist. Start one from the playlist list below."));
    return;
  }
  const title = document.createElement("strong");
  title.textContent = playlist.name;
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.append(
    pill("ACTIVE", "hot"),
    pill(playlist.mode || "sequence"),
    pill(`${playlistSceneIds(playlist).length} scenes`),
  );
  const sceneLine = document.createElement("div");
  sceneLine.className = "live-active-scene";
  if (activeScene) {
    const preview = scenePalettePreview(activeScene, {fallback: false, compact: true});
    const sceneName = document.createElement("span");
    sceneName.textContent = activeScene.name;
    sceneLine.append(document.createTextNode("Current scene: "), sceneName);
    if (preview) sceneLine.append(preview);
  } else {
    sceneLine.textContent = "Current scene could not be detected from LedFx state.";
  }
  els.liveNowPlaying.append(title, meta, sceneLine);
}

function renderLivePlaylistList(currentPlaylist) {
  if (!els.livePlaylistList) return;
  els.livePlaylistList.innerHTML = "";
  const playlists = state.ledfxLibrary.playlists || [];
  if (!playlists.length) {
    els.livePlaylistList.append(emptyNote("No playlists loaded."));
    return;
  }
  playlists.forEach((playlist) => {
    const row = document.createElement("article");
    row.className = "live-row";
    if (currentPlaylist && currentPlaylist.id === playlist.id) row.classList.add("is-active");
    const copy = document.createElement("div");
    copy.className = "live-row-copy";
    const title = document.createElement("strong");
    title.textContent = playlist.name;
    const preview = playlistPalettePreview(playlist);
    const meta = document.createElement("small");
    meta.textContent = `${playlist.mode || "sequence"} | ${playlistSceneIds(playlist).length} scenes`;
    copy.append(title);
    if (preview) copy.append(preview);
    copy.append(meta);
    const actions = document.createElement("div");
    actions.className = "live-row-actions";
    actions.append(actionButton("Start", () => controlPlaylist("start", playlist.id, playlist.mode)));
    row.append(copy, actions);
    els.livePlaylistList.append(row);
  });
}

function renderLiveSceneList(playlist, activeScene) {
  if (!els.liveSceneList) return;
  els.liveSceneList.innerHTML = "";
  if (!playlist) {
    els.liveSceneList.append(emptyNote("Start a playlist to show its scenes here."));
    return;
  }
  const ids = playlistSceneIds(playlist);
  if (!ids.length) {
    els.liveSceneList.append(emptyNote("The active playlist has no scenes."));
    return;
  }
  ids.forEach((sceneId, index) => {
    const scene = sceneForId(sceneId);
    const row = document.createElement("article");
    row.className = "live-row";
    if (scene && activeScene && scene.id === activeScene.id) row.classList.add("is-active");
    const copy = document.createElement("div");
    copy.className = "live-row-copy";
    const title = document.createElement("strong");
    title.textContent = scene ? scene.name : sceneId;
    const preview = scene ? scenePalettePreview(scene, {fallback: false, compact: true}) : null;
    const tags = document.createElement("small");
    tags.textContent = scene ? sceneTags(scene).join(", ") : "Scene not found in current library.";
    copy.append(pill(`#${index + 1}`), title);
    if (preview) copy.append(preview);
    if (tags.textContent) copy.append(tags);
    const actions = document.createElement("div");
    actions.className = "live-row-actions";
    if (scene) actions.append(actionButton("Activate", () => activateLibraryScene(scene.id)));
    row.append(copy, actions);
    els.liveSceneList.append(row);
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
  state.editingPresetBankItem = null;
  state.editingMidiMappingId = null;
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
  if (els.presetBankEditor) els.presetBankEditor.hidden = true;
  if (els.playlistEditor) els.playlistEditor.hidden = true;
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
  if (els.tabsGuidePanel) els.tabsGuidePanel.hidden = true;
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
  const previewSlot = document.createElement("span");
  previewSlot.className = "editor-palette-preview-slot";
  previewSlot.dataset.editorPalettePreview = "true";
  if (preview) previewSlot.append(preview);
  details.append(previewSlot);
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

function createPlaylistFromSelection() {
  const selectedIds = [...state.selectedLibrarySceneIds].filter((sceneId) => (
    state.ledfxLibrary.scenes.some((scene) => scene.id === sceneId)
  ));
  if (!selectedIds.length) {
    showToast("Select published scenes first.");
    return;
  }
  state.editingPlaylistId = null;
  els.playlistNameInput.value = "Workshop Selection";
  els.playlistModeSelect.value = "sequence";
  els.playlistDurationInput.value = "30";
  els.playlistTagFilterInput.value = "";
  state.playlistSceneIds = new Set(selectedIds);
  openPlaylistEditor("New Playlist From Selection");
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
  state.editingPresetBankItem = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingMidiMappingId = null;
  els.styleEditor.hidden = true;
  els.paletteEditor.hidden = true;
  if (els.presetEditor) els.presetEditor.hidden = true;
  if (els.presetBankEditor) els.presetBankEditor.hidden = true;
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
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
  state.playlistSceneIds = new Set(playlistSceneIds(playlist));
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

function activePlaylistId() {
  const playlistState = (state.ledfxLibrary && state.ledfxLibrary.playlist_state) || {};
  return String(
    playlistState.active_playlist ||
      playlistState.active_playlist_id ||
      playlistState.playlist_id ||
      playlistState.id ||
      "",
  ).trim();
}

async function controlPlaylist(action, playlistId = null, mode = null) {
  const sceneTransport = ["next", "prev"].includes(action);
  const activeTransport = ["next", "prev", "stop"].includes(action);
  const targetPlaylistId = activeTransport ? (playlistId || activePlaylistId()) : playlistId;
  if (sceneTransport && !targetPlaylistId) {
    showToast("Start a LedFx playlist before using Previous or Next scene.");
    return;
  }
  try {
    await api("/api/playlists/control", {
      method: "POST",
      body: JSON.stringify({action, playlist_id: targetPlaylistId, mode}),
    });
    await loadLedFxLibrary(false);
    refreshMidiFeedback();
    const labels = {
      start: "Playlist started.",
      stop: "Active playlist stopped.",
      prev: "Previous scene in active playlist.",
      next: "Next scene in active playlist.",
    };
    showToast(labels[action] || `Playlist ${action}.`);
  } catch (error) {
    showToast(error.message);
  }
}

function loadMidiMappings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MIDI_MAPPINGS_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeMidiMapping).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function sanitizeMidiMapping(item) {
  if (!item || !item.message || !MIDI_MAPPING_ACTIONS.has(item.action)) return null;
  const message = sanitizeMidiMessage(item.message);
  if (!message) return null;
  const playlistId = item.action === "start" ? (item.playlistId || "active") : "active";
  return {
    id: midiMappingId(item.action, playlistId, message),
    action: item.action,
    playlistId,
    playlistName: item.action === "start" ? (item.playlistName || "Active playlist") : "Active playlist",
    mode: item.mode || null,
    message,
    colorOn: item.colorOn === undefined || item.colorOn === null
      ? null
      : normalizeMidiColorValue(item.colorOn, item.colorTable !== MIDI_COLOR_TABLE),
    colorOff: item.colorOff === undefined || item.colorOff === null
      ? null
      : normalizeMidiColorValue(item.colorOff, item.colorTable !== MIDI_COLOR_TABLE),
    feedbackMode: validMidiFeedbackMode(item.feedbackMode),
    ledProtocol: validMidiLedProtocol(item.ledProtocol),
    colorTable: MIDI_COLOR_TABLE,
    layoutPadId: item.layoutPadId ? String(item.layoutPadId) : null,
    layoutControlType: MIDI_LAYOUT_CONTROL_TYPES.has(item.layoutControlType) ? item.layoutControlType : null,
    supportsFeedback: item.supportsFeedback === false ? false : true,
    feedbackType: validMidiFeedbackType(item.feedbackType) || (item.supportsFeedback === false ? "none" : "rgb"),
  };
}

function sanitizeMidiMessage(message) {
  if (!message || !["note", "cc", "program"].includes(message.type)) return null;
  const channel = Math.max(1, Math.min(16, Math.round(Number(message.channel) || 1)));
  const number = clampMidiValue(message.number);
  const value = clampMidiValue(message.value);
  return {type: message.type, channel, number, value};
}

function validMidiFeedbackMode(value) {
  return ["latch", "momentary", "off"].includes(value) ? value : null;
}

function validMidiLedProtocol(value) {
  return MIDI_LED_PROTOCOLS.has(value) ? value : null;
}

function validMidiFeedbackType(value) {
  return MIDI_FEEDBACK_TYPES.has(value) ? value : null;
}

function midiMappingId(action, playlistId, message) {
  const cleanPlaylistId = action === "start" ? (playlistId || "active") : "active";
  return `${action}:${cleanPlaylistId}:${message.type}:${message.channel}:${message.number}`;
}

function loadMidiControllerSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MIDI_CONTROLLER_KEY) || "{}");
    if (!parsed || typeof parsed !== "object") return {...DEFAULT_MIDI_CONTROLLER};
    return {
      ...DEFAULT_MIDI_CONTROLLER,
      colorOn: parsed.colorOn === undefined || parsed.colorOn === null
        ? DEFAULT_MIDI_CONTROLLER.colorOn
        : normalizeMidiColorValue(parsed.colorOn, parsed.colorTable !== MIDI_COLOR_TABLE),
      colorOff: parsed.colorOff === undefined || parsed.colorOff === null
        ? DEFAULT_MIDI_CONTROLLER.colorOff
        : normalizeMidiColorValue(parsed.colorOff, parsed.colorTable !== MIDI_COLOR_TABLE),
      feedbackMode: ["latch", "momentary", "off"].includes(parsed.feedbackMode)
        ? parsed.feedbackMode
        : DEFAULT_MIDI_CONTROLLER.feedbackMode,
      ledProtocol: validMidiLedProtocol(parsed.ledProtocol) || DEFAULT_MIDI_CONTROLLER.ledProtocol,
      colorTable: MIDI_COLOR_TABLE,
      restoreBrightness: Math.max(0.01, Math.min(1, Number(parsed.restoreBrightness) || DEFAULT_MIDI_CONTROLLER.restoreBrightness)),
    };
  } catch (error) {
    return {...DEFAULT_MIDI_CONTROLLER};
  }
}

function saveMidiControllerSettings() {
  localStorage.setItem(MIDI_CONTROLLER_KEY, JSON.stringify(state.midi.controller));
}

function saveMidiMappings() {
  localStorage.setItem(MIDI_MAPPINGS_KEY, JSON.stringify(state.midi.mappings));
}

function loadMidiLayout() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MIDI_LAYOUT_KEY) || "{}");
    return sanitizeMidiLayout(parsed);
  } catch (error) {
    return sanitizeMidiLayout({});
  }
}

function saveMidiLayout() {
  localStorage.setItem(MIDI_LAYOUT_KEY, JSON.stringify(state.midi.layout));
}

function normalizeMidiLayoutZoom(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1;
  return Math.round(Math.max(MIDI_LAYOUT_ZOOM_MIN, Math.min(MIDI_LAYOUT_ZOOM_MAX, number)) * 100) / 100;
}

function loadMidiLayoutZoom() {
  return normalizeMidiLayoutZoom(localStorage.getItem(MIDI_LAYOUT_ZOOM_KEY) || "1");
}

function saveMidiLayoutZoom() {
  localStorage.setItem(MIDI_LAYOUT_ZOOM_KEY, String(normalizeMidiLayoutZoom(state.midi.layoutZoom)));
}

function loadCustomMidiLayoutTemplates() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MIDI_LAYOUT_CUSTOM_TEMPLATES_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeCustomMidiLayoutTemplate).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function saveCustomMidiLayoutTemplates(templates) {
  const cleanTemplates = (Array.isArray(templates) ? templates : [])
    .map(sanitizeCustomMidiLayoutTemplate)
    .filter(Boolean);
  localStorage.setItem(MIDI_LAYOUT_CUSTOM_TEMPLATES_KEY, JSON.stringify(cleanTemplates));
}

function allMidiLayoutTemplates() {
  return [...MIDI_LAYOUT_TEMPLATES, ...loadCustomMidiLayoutTemplates()];
}

function sanitizeCustomMidiLayoutTemplate(item) {
  if (!item || typeof item !== "object") return null;
  const label = String(item.label || item.name || "").trim().slice(0, 48);
  if (!label) return null;
  const id = String(item.id || `custom_${snakeCase(label) || Date.now().toString(36)}`).trim();
  if (!id || MIDI_LAYOUT_TEMPLATES.some((template) => template.id === id)) return null;
  const fallback = MIDI_LAYOUT_TEMPLATES.find((template) => template.id === "custom") || {
    rows: 8,
    cols: 8,
    buttons: 0,
    knobs: 0,
    faders: 0,
    noteStart: 0,
    buttonCcStart: 32,
    ccStart: 16,
    faderCcStart: 48,
  };
  const rows = midiLayoutNumber(item.rows, 1, 16, fallback.rows);
  const cols = midiLayoutNumber(item.cols, 1, 16, fallback.cols);
  const surfaceRows = midiLayoutNumber(item.surfaceRows ?? item.canvasRows, 1, 32, fallback.surfaceRows || rows);
  const surfaceCols = midiLayoutNumber(item.surfaceCols ?? item.canvasCols, 1, 32, fallback.surfaceCols || cols);
  const buttons = midiLayoutNumber(item.buttons, 0, 48, fallback.buttons || 0);
  const knobs = midiLayoutNumber(item.knobs, 0, 32, fallback.knobs || 0);
  const faders = midiLayoutNumber(item.faders, 0, 32, fallback.faders || 0);
  const defaultControls = Array.isArray(item.defaultControls)
    ? item.defaultControls.map((control) => sanitizeMidiLayoutTemplateControl(control)).filter(Boolean)
    : [];
  return {
    id,
    label,
    sourceTemplate: String(item.sourceTemplate || item.baseTemplate || "").trim(),
    physicalLayout: String(item.physicalLayout || "").trim(),
    layoutRepairVersion: String(item.layoutRepairVersion || "").trim(),
    rows,
    cols,
    surfaceRows,
    surfaceCols,
    buttons,
    knobs,
    faders,
    noteStart: midiLayoutNumber(item.noteStart, 0, 127, fallback.noteStart || 0),
    buttonCcStart: midiLayoutNumber(item.buttonCcStart, 0, 127, fallback.buttonCcStart || 32),
    buttonMessageType: item.buttonMessageType === "note" ? "note" : "cc",
    ccStart: midiLayoutNumber(item.ccStart, 0, 127, fallback.ccStart || 16),
    faderCcStart: midiLayoutNumber(item.faderCcStart, 0, 127, fallback.faderCcStart || 48),
    noteDirection: item.noteDirection === "reverse" ? "reverse" : "forward",
    padOrder: item.padOrder === "bottom-to-top" ? "bottom-to-top" : "top-to-bottom",
    ledProtocol: validMidiLedProtocol(item.ledProtocol) || "generic",
    custom: true,
    savedCustom: true,
    defaultControls,
    description: String(item.description || "Saved custom controller model with learned labels and MIDI messages.").trim(),
  };
}

function sanitizeMidiLayoutTemplateControl(control) {
  if (!control || typeof control !== "object" || !control.id) return null;
  const controlType = MIDI_LAYOUT_CONTROL_TYPES.has(control.controlType || control.type)
    ? (control.controlType || control.type)
    : "pad";
  return {
    id: String(control.id),
    index: Math.max(0, Math.round(Number(control.index) || 0)),
    row: midiLayoutCoordinate(control.row, 0),
    col: midiLayoutCoordinate(control.col, 0),
    controlType,
    type: controlType,
    label: String(control.label || "Control").trim().slice(0, 28) || "Control",
    role: String(control.role || "").trim(),
    lit: controlType === "fader" ? false : control.lit !== false,
    feedbackType: validMidiFeedbackType(control.feedbackType) || (controlType === "fader" ? "none" : "rgb"),
    message: sanitizeMidiMessage(control.message),
    colorTable: MIDI_COLOR_TABLE,
  };
}

function midiLayoutTemplate(templateId = null) {
  const normalizedId = MIDI_LAYOUT_TEMPLATE_ALIASES.get(templateId) || templateId;
  const templates = allMidiLayoutTemplates();
  return templates.find((template) => template.id === normalizedId)
    || templates.find((template) => template.id === MIDI_LAYOUT_DEFAULT_TEMPLATE)
    || templates[0];
}

function midiLayoutNumber(value, min, max, fallback) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function midiLayoutCoordinate(value, fallback = 0) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return Math.max(0, Math.round(Number(fallback) || 0));
  return Math.max(0, Math.min(31, number));
}

function midiLayoutDimensions(source, template) {
  const isCustom = Boolean(template.custom);
  return {
    rows: isCustom ? midiLayoutNumber(source.rows, 1, 16, template.rows) : template.rows,
    cols: isCustom ? midiLayoutNumber(source.cols, 1, 16, template.cols) : template.cols,
    buttons: isCustom ? midiLayoutNumber(source.buttons, 0, 48, template.buttons || 0) : (template.buttons || 0),
    knobs: isCustom ? midiLayoutNumber(source.knobs, 0, 32, template.knobs || 0) : (template.knobs || 0),
    faders: isCustom ? midiLayoutNumber(source.faders, 0, 32, template.faders || 0) : (template.faders || 0),
  };
}

function midiLayoutSurfaceDimensions(source, template, dimensions) {
  const isCustom = Boolean(template.custom);
  const fallbackRows = midiLayoutNumber(template.surfaceRows, 1, 32, dimensions.rows);
  const fallbackCols = midiLayoutNumber(template.surfaceCols, 1, 32, dimensions.cols);
  return {
    surfaceRows: isCustom ? midiLayoutNumber(source.surfaceRows ?? source.canvasRows, 1, 32, fallbackRows) : dimensions.rows,
    surfaceCols: isCustom ? midiLayoutNumber(source.surfaceCols ?? source.canvasCols, 1, 32, fallbackCols) : dimensions.cols,
  };
}

function sanitizeMidiLayout(layout) {
  const source = layout && typeof layout === "object" ? layout : {};
  const template = midiLayoutTemplate(source.template || source.templateId);
  const dimensions = midiLayoutDimensions(source, template);
  let surface = midiLayoutSurfaceDimensions(source, template, dimensions);
  let sourceTemplate = String(source.sourceTemplate || template.sourceTemplate || source.baseTemplate || "");
  let physicalLayout = String(source.physicalLayout || template.physicalLayout || "");
  let layoutRepairVersion = String(source.layoutRepairVersion || template.layoutRepairVersion || "");
  const savedControls = [
    ...(Array.isArray(template.defaultControls) ? template.defaultControls : []),
    ...(Array.isArray(source.controls) ? source.controls : []),
    ...(Array.isArray(source.pads) ? source.pads : []),
  ];
  const controlsById = new Map(
    savedControls
      .filter((control) => control && control.id)
      .map((control) => [String(control.id), control]),
  );
  const controls = [];
  const padCount = dimensions.rows * dimensions.cols;
  for (let index = 0; index < padCount; index += 1) {
    const base = defaultMidiLayoutPad(index, {...template, ...dimensions}, "pad");
    controls.push(sanitizeMidiLayoutPad(controlsById.get(base.id), base));
  }
  for (let index = 0; index < dimensions.buttons; index += 1) {
    const base = defaultMidiLayoutPad(index, {...template, ...dimensions}, "button");
    controls.push(sanitizeMidiLayoutPad(controlsById.get(base.id), base));
  }
  for (let index = 0; index < dimensions.knobs; index += 1) {
    const base = defaultMidiLayoutPad(index, {...template, ...dimensions}, "knob");
    controls.push(sanitizeMidiLayoutPad(controlsById.get(base.id), base));
  }
  for (let index = 0; index < dimensions.faders; index += 1) {
    const base = defaultMidiLayoutPad(index, {...template, ...dimensions}, "fader");
    controls.push(sanitizeMidiLayoutPad(controlsById.get(base.id), base));
  }
  const positionedControls = template.custom
    ? normalizeMidiLayoutPositions(controls, {rows: surface.surfaceRows, cols: surface.surfaceCols})
    : controls;
  let finalControls = positionedControls;
  if (template.custom && midiLayoutNeedsApcMiniMk2PositionRepair(source, dimensions, finalControls)) {
    const apcTemplate = midiLayoutTemplate("akai_apc_mini_mk2");
    finalControls = normalizeMidiLayoutPositions(
      midiLayoutControlsForPositionEditor({pads: finalControls}, apcTemplate),
      {rows: 10, cols: 9},
    );
    surface = {surfaceRows: 10, surfaceCols: 9};
    sourceTemplate = "akai_apc_mini_mk2";
    physicalLayout = "akai_apc_mini_mk2";
    layoutRepairVersion = "apc_mini_mk2_positions_v2";
  }
  return {
    template: template.id,
    sourceTemplate,
    physicalLayout,
    layoutRepairVersion,
    rows: dimensions.rows,
    cols: dimensions.cols,
    surfaceRows: surface.surfaceRows,
    surfaceCols: surface.surfaceCols,
    buttons: dimensions.buttons,
    knobs: dimensions.knobs,
    faders: dimensions.faders,
    pads: finalControls,
    controls: finalControls,
  };
}

function normalizeMidiLayoutPositions(controls, dimensions) {
  const sourceControls = Array.isArray(controls) ? controls : [];
  const cols = Math.max(1, midiLayoutNumber(dimensions.cols, 1, 32, 8));
  const minRows = Math.max(1, midiLayoutNumber(dimensions.rows, 1, 32, 8));
  let rows = Math.max(
    minRows,
    Math.ceil(Math.max(1, sourceControls.length) / cols),
    sourceControls.reduce((max, control) => {
      const row = midiLayoutCoordinate(control.row, 0);
      const col = midiLayoutCoordinate(control.col, 0);
      return Math.max(max, Math.floor(((row * cols) + col) / cols) + 1);
    }, 1),
  );
  const used = new Set();
  const nextFreePosition = (preferredRow, preferredCol) => {
    const preferredIndex = Math.max(0, (preferredRow * cols) + preferredCol);
    const maxSlots = Math.max(rows * cols, sourceControls.length + preferredIndex + 1);
    for (let index = preferredIndex; index < maxSlots; index += 1) {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const key = `${row}:${col}`;
      if (!used.has(key)) {
        rows = Math.max(rows, row + 1);
        used.add(key);
        return {row, col};
      }
    }
    const row = rows;
    const col = 0;
    rows += 1;
    used.add(`${row}:${col}`);
    return {row, col};
  };
  return sourceControls.map((control) => {
    const desiredRow = midiLayoutCoordinate(control.row, 0);
    const rawCol = midiLayoutCoordinate(control.col, 0);
    const desiredRowWithOverflow = desiredRow + Math.floor(rawCol / cols);
    const desiredCol = rawCol % cols;
    const desiredKey = `${desiredRowWithOverflow}:${desiredCol}`;
    if (!used.has(desiredKey)) {
      used.add(desiredKey);
      return {...control, row: desiredRowWithOverflow, col: desiredCol};
    }
    return {...control, ...nextFreePosition(desiredRowWithOverflow, desiredCol)};
  });
}

function sanitizeMidiLayoutPad(item, base = null) {
  const fallback = base || defaultMidiLayoutPad(0, midiLayoutTemplate());
  const source = item && typeof item === "object" ? item : {};
  const action = MIDI_LAYOUT_ACTIONS.has(source.action) ? source.action : "empty";
  const playlistId = action === "start" ? String(source.playlistId || fallback.playlistId || "active") : "active";
  const sourceType = source.controlType || source.type || fallback.controlType || "pad";
  const controlType = MIDI_LAYOUT_CONTROL_TYPES.has(sourceType) ? sourceType : "pad";
  const label = String(source.label || fallback.label || "Control").trim().slice(0, 28) || fallback.label || "Control";
  const role = String(source.role || fallback.role || "").trim();
  const lit = controlType === "fader"
    ? false
    : (source.lit === undefined ? fallback.lit !== false : source.lit !== false);
  const fallbackFeedbackType = validMidiFeedbackType(fallback.feedbackType) || (lit ? "rgb" : "none");
  const feedbackType = !lit || controlType === "fader"
    ? "none"
    : validMidiFeedbackType(source.feedbackType) || fallbackFeedbackType;
  const feedbackSupported = controlType !== "fader" && lit && feedbackType !== "none";
  const colorFeedbackSupported = feedbackSupported && feedbackType === "rgb";
  const sourceMessage = sanitizeMidiMessage(source.message);
  const fallbackMessage = sanitizeMidiMessage(fallback.message);
  const message = shouldReplaceLegacyMidiLayoutMessage(sourceMessage, fallback, source, controlType)
    ? fallbackMessage
    : sourceMessage || fallbackMessage;
  return {
    id: String(source.id || fallback.id),
    templateId: String(fallback.templateId || source.templateId || ""),
    index: Number.isFinite(Number(fallback.index)) ? Number(fallback.index) : Number(source.index) || 0,
    row: source.row === undefined || source.row === null
      ? midiLayoutCoordinate(fallback.row, 0)
      : midiLayoutCoordinate(source.row, fallback.row),
    col: source.col === undefined || source.col === null
      ? midiLayoutCoordinate(fallback.col, 0)
      : midiLayoutCoordinate(source.col, fallback.col),
    controlType,
    type: controlType,
    label,
    role,
    lit,
    feedbackType,
    action,
    playlistId,
    playlistName: action === "start" ? String(source.playlistName || "") : "Active playlist",
    mode: action === "start" ? source.mode || null : null,
    message,
    colorOn: !colorFeedbackSupported || source.colorOn === undefined || source.colorOn === null
      ? null
      : normalizeMidiColorValue(source.colorOn, source.colorTable !== MIDI_COLOR_TABLE),
    colorOff: !colorFeedbackSupported || source.colorOff === undefined || source.colorOff === null
      ? null
      : normalizeMidiColorValue(source.colorOff, source.colorTable !== MIDI_COLOR_TABLE),
    feedbackMode: feedbackSupported ? validMidiFeedbackMode(source.feedbackMode) : "off",
    ledProtocol: feedbackSupported ? validMidiLedProtocol(source.ledProtocol) : null,
    colorTable: MIDI_COLOR_TABLE,
  };
}

function shouldReplaceLegacyMidiLayoutMessage(message, fallback, source, controlType) {
  if (!message || fallback.templateId !== "akai_apc_mini_mk2") return false;
  const index = Number.isFinite(Number(fallback.index)) ? Number(fallback.index) : Number(source.index);
  if (!Number.isFinite(index) || message.channel !== 1) return false;
  if (controlType === "pad" && message.type === "note") {
    return message.number === index && message.number !== fallback.message.number;
  }
  if (controlType === "button" && message.type === "note") {
    return message.number === 64 + index && message.number !== fallback.message.number;
  }
  return false;
}

function defaultMidiLayoutPad(index, template = midiLayoutTemplate(), controlType = "pad") {
  const type = MIDI_LAYOUT_CONTROL_TYPES.has(controlType) ? controlType : "pad";
  const cols = Math.max(1, Number(template.cols) || 1);
  const padRows = Math.max(1, Number(template.rows) || 1);
  const buttonRows = Math.ceil(Number(template.buttons || 0) / cols);
  const knobRows = Math.ceil(Number(template.knobs || 0) / cols);
  const row = Math.floor(index / cols);
  const col = index % cols;
  const extraRowBase = type === "button"
    ? padRows
    : type === "knob"
      ? padRows + buttonRows
      : padRows + buttonRows + knobRows;
  const idPrefix = type === "pad" ? "pad" : type;
  const buttonDefinition = type === "button" && Array.isArray(template.buttonDefinitions)
    ? template.buttonDefinitions[index]
    : null;
  const padLabel = type === "pad" && Array.isArray(template.padLabels) ? template.padLabels[index] : "";
  const buttonLabel = Array.isArray(template.buttonLabels) ? template.buttonLabels[index] : "";
  const label = type === "pad"
    ? (padLabel || `${String.fromCharCode(65 + row)}${col + 1}`)
    : type === "button"
      ? (buttonDefinition?.label || buttonLabel || `B${index + 1}`)
      : `${type === "knob" ? "K" : "F"}${index + 1}`;
  const lit = type === "fader"
    ? false
    : buttonDefinition?.lit === undefined
      ? true
      : buttonDefinition.lit !== false;
  const feedbackType = !lit || type === "fader"
    ? "none"
    : validMidiFeedbackType(buttonDefinition?.feedbackType) || "rgb";
  return {
    id: `${idPrefix}-${index + 1}`,
    templateId: template.id,
    index,
    row: type === "pad" ? row : extraRowBase + Math.floor(index / cols),
    col,
    controlType: type,
    type,
    label,
    role: buttonDefinition?.role || "",
    lit,
    feedbackType,
    action: "empty",
    playlistId: "active",
    playlistName: "",
    mode: null,
    message: midiLayoutDefaultMessage(index, template, type),
    colorOn: null,
    colorOff: null,
    feedbackMode: null,
    ledProtocol: null,
    colorTable: MIDI_COLOR_TABLE,
  };
}

function midiLayoutDefaultMessage(index, template = midiLayoutTemplate(), controlType = "pad") {
  if (controlType === "pad" && template.physicalLayout === "novation_launchpad_mini_mk3") {
    const cols = Math.max(1, Number(template.cols) || 8);
    const rows = Math.max(1, Number(template.rows) || 8);
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      type: "note",
      channel: 1,
      number: clampMidiValue(((rows - row) * 10) + col + 1),
      value: 127,
    };
  }
  if (controlType === "knob") {
    return {
      type: "cc",
      channel: 1,
      number: clampMidiValue(Number(template.ccStart || 16) + index),
      value: 0,
    };
  }
  if (controlType === "fader") {
    return {
      type: "cc",
      channel: 1,
      number: clampMidiValue(Number(template.faderCcStart || template.ccStart || 48) + index),
      value: 0,
    };
  }
  if (controlType === "button") {
    const buttonDefinition = Array.isArray(template.buttonDefinitions) ? template.buttonDefinitions[index] : null;
    if (buttonDefinition && Number.isFinite(Number(buttonDefinition.number))) {
      const messageType = buttonDefinition.messageType === "cc" ? "cc" : "note";
      return {
        type: messageType,
        channel: Math.max(1, Math.min(16, Number(buttonDefinition.channel) || 1)),
        number: clampMidiValue(buttonDefinition.number),
        value: messageType === "note" ? 127 : 0,
      };
    }
    const messageType = template.buttonMessageType === "note" ? "note" : "cc";
    const numberStart = messageType === "note"
      ? Number(template.buttonNoteStart || (Number(template.noteStart || 0) + (template.rows || 0) * (template.cols || 0)))
      : Number(template.buttonCcStart || template.ccStart || 32);
    return {
      type: messageType,
      channel: 1,
      number: clampMidiValue(numberStart + index),
      value: messageType === "note" ? 127 : 0,
    };
  }
  const offset = midiLayoutPadMessageOffset(index, template);
  return {
    type: "note",
    channel: 1,
    number: clampMidiValue(Number(template.noteStart || 0) + offset),
    value: 127,
  };
}

function midiLayoutPadMessageOffset(index, template = midiLayoutTemplate()) {
  const rows = Math.max(1, Number(template.rows) || 1);
  const cols = Math.max(1, Number(template.cols) || 1);
  const row = Math.floor(index / cols);
  const col = index % cols;
  if (template.padOrder === "bottom-to-top") {
    return ((rows - 1 - row) * cols) + col;
  }
  if (template.noteDirection === "reverse") {
    return rows * cols - 1 - index;
  }
  return index;
}

function midiLayoutNeedsApcMiniMk2PositionRepair(source, dimensions, controls) {
  if (String(source?.layoutRepairVersion || "") === "apc_mini_mk2_positions_v2") return false;
  if (dimensions.rows !== 8 || dimensions.cols !== 8 || dimensions.buttons < 17 || dimensions.faders < 9) return false;
  const list = Array.isArray(controls) ? controls : [];
  const pads = list.filter((control) => control.controlType === "pad");
  const trackButtons = list.filter((control) => control.controlType === "button" && control.role === "track");
  const sceneButtons = list.filter((control) => control.controlType === "button" && control.role === "scene");
  const shiftButton = list.find((control) => control.controlType === "button" && control.role === "shift");
  const faders = list.filter((control) => control.controlType === "fader");
  if (pads.length < 64 || trackButtons.length < 8 || sceneButtons.length < 8 || !shiftButton || faders.length < 9) {
    return false;
  }
  return faders.some((control) => midiLayoutCoordinate(control.row, 0) < 9)
    || trackButtons.some((control) => midiLayoutCoordinate(control.row, 0) !== 8)
    || sceneButtons.some((control) => midiLayoutCoordinate(control.col, 0) !== 8)
    || midiLayoutCoordinate(shiftButton.row, 0) !== 8
    || midiLayoutCoordinate(shiftButton.col, 0) !== 8;
}

function midiLayoutControlsForPositionEditor(layout, template) {
  const controls = Array.isArray(layout?.pads) ? layout.pads : [];
  if (template?.physicalLayout) {
    return controls.map((control) => ({
      ...control,
      templateId: "custom",
      ...midiLayoutPhysicalEditPosition(control, template),
    }));
  }
  return controls.map((control) => ({
    ...control,
    templateId: "custom",
    row: midiLayoutCoordinate(control.row, 0),
    col: midiLayoutCoordinate(control.col, 0),
  }));
}

function midiLayoutEditorSurfaceForControls(layout, template, controls) {
  const safeControls = Array.isArray(controls) ? controls : [];
  const maxRow = safeControls.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.row, 0)), 0);
  const maxCol = safeControls.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.col, 0)), 0);
  const physicalMinimum = midiLayoutPhysicalSurfaceMinimum(template, layout);
  return {
    surfaceRows: Math.max(1, Math.min(32, Math.max(physicalMinimum.rows, maxRow + 1))),
    surfaceCols: Math.max(1, Math.min(32, Math.max(physicalMinimum.cols, maxCol + 1))),
  };
}

function midiLayoutPhysicalSurfaceMinimum(template, layout = {}) {
  switch (template?.physicalLayout) {
    case "akai_apc_mini_mk2":
      return {rows: 10, cols: 9};
    case "novation_launchpad_mini_mk3":
      return {rows: 9, cols: 9};
    case "novation_launchkey_mini_mk3":
      return {rows: 4, cols: 8};
    case "akai_mpk_mini_mk3":
      return {rows: 2, cols: 8};
    case "arturia_minilab_3":
      return {rows: 4, cols: 8};
    case "generic_hybrid":
      return {rows: 5, cols: 8};
    default:
      return {
        rows: layout.surfaceRows || layout.rows || 8,
        cols: layout.surfaceCols || layout.cols || 8,
      };
  }
}

function midiLayoutPhysicalEditPosition(control, template) {
  switch (template?.physicalLayout) {
    case "akai_apc_mini_mk2":
      return midiLayoutApcMiniMk2EditPosition(control);
    case "novation_launchpad_mini_mk3":
      return midiLayoutLaunchpadMiniMk3EditPosition(control);
    case "novation_launchkey_mini_mk3":
      return midiLayoutLaunchkeyMiniMk3EditPosition(control);
    case "akai_mpk_mini_mk3":
      return midiLayoutMpkMiniMk3EditPosition(control);
    case "arturia_minilab_3":
      return midiLayoutMiniLab3EditPosition(control);
    case "generic_hybrid":
      return midiLayoutGenericHybridEditPosition(control);
    default:
      return {
        row: midiLayoutCoordinate(control?.row, 0),
        col: midiLayoutCoordinate(control?.col, 0),
      };
  }
}

function midiLayoutApcMiniMk2EditPosition(control) {
  const index = Math.max(0, Math.round(Number(control?.index) || 0));
  const role = String(control?.role || "");
  if (control?.controlType === "pad") {
    return {
      row: Math.floor(index / 8),
      col: index % 8,
    };
  }
  if (control?.controlType === "button") {
    if (role === "scene") {
      return {
        row: Math.max(0, Math.min(7, index - 8)),
        col: 8,
      };
    }
    if (role === "track") {
      return {
        row: 8,
        col: Math.max(0, Math.min(7, index)),
      };
    }
    if (role === "shift") {
      return {
        row: 8,
        col: 8,
      };
    }
    return {
      row: 10 + Math.floor(index / 9),
      col: index % 9,
    };
  }
  if (control?.controlType === "fader") {
    return {
      row: 9,
      col: Math.max(0, Math.min(8, index)),
    };
  }
  if (control?.controlType === "knob") {
    return {
      row: 10 + Math.floor(index / 9),
      col: index % 9,
    };
  }
  return {
    row: midiLayoutCoordinate(control?.row, 0),
    col: midiLayoutCoordinate(control?.col, 0),
  };
}

function midiLayoutLaunchpadMiniMk3EditPosition(control) {
  const index = Math.max(0, Math.round(Number(control?.index) || 0));
  if (control?.controlType === "pad") {
    return {
      row: Math.floor(index / 8) + 1,
      col: index % 8,
    };
  }
  if (control?.controlType === "button") {
    if (control.role === "scene") {
      return {
        row: Math.max(1, Math.min(8, index - 8 + 1)),
        col: 8,
      };
    }
    return {
      row: 0,
      col: Math.max(0, Math.min(7, index)),
    };
  }
  return {
    row: midiLayoutCoordinate(control?.row, 0),
    col: midiLayoutCoordinate(control?.col, 0),
  };
}

function midiLayoutLaunchkeyMiniMk3EditPosition(control) {
  const index = Math.max(0, Math.round(Number(control?.index) || 0));
  if (control?.controlType === "knob") {
    return {
      row: 0,
      col: index % 8,
    };
  }
  if (control?.controlType === "button") {
    return {
      row: 1,
      col: index % 8,
    };
  }
  if (control?.controlType === "pad") {
    return {
      row: index < 8 ? 3 : 2,
      col: index < 8 ? index : index - 8,
    };
  }
  if (control?.controlType === "fader") {
    return {
      row: 1,
      col: index % 8,
    };
  }
  return {
    row: midiLayoutCoordinate(control?.row, 0),
    col: midiLayoutCoordinate(control?.col, 0),
  };
}

function midiLayoutMpkMiniMk3EditPosition(control) {
  const index = Math.max(0, Math.round(Number(control?.index) || 0));
  if (control?.controlType === "pad") {
    return {
      row: index < 4 ? 1 : 0,
      col: index < 4 ? index : index - 4,
    };
  }
  if (control?.controlType === "knob") {
    return {
      row: Math.floor(index / 4),
      col: 4 + (index % 4),
    };
  }
  if (control?.controlType === "button") {
    return {
      row: 2 + Math.floor(index / 8),
      col: index % 8,
    };
  }
  if (control?.controlType === "fader") {
    return {
      row: 2 + Math.floor(index / 8),
      col: index % 8,
    };
  }
  return {
    row: midiLayoutCoordinate(control?.row, 0),
    col: midiLayoutCoordinate(control?.col, 0),
  };
}

function midiLayoutMiniLab3EditPosition(control) {
  const index = Math.max(0, Math.round(Number(control?.index) || 0));
  if (control?.controlType === "knob") {
    return {
      row: 0,
      col: index % 8,
    };
  }
  if (control?.controlType === "fader") {
    return {
      row: 1,
      col: index % 4,
    };
  }
  if (control?.controlType === "button") {
    return {
      row: 1,
      col: 4 + (index % 4),
    };
  }
  if (control?.controlType === "pad") {
    return {
      row: index < 4 ? 3 : 2,
      col: index < 4 ? index : index - 4,
    };
  }
  return {
    row: midiLayoutCoordinate(control?.row, 0),
    col: midiLayoutCoordinate(control?.col, 0),
  };
}

function midiLayoutGenericHybridEditPosition(control) {
  const index = Math.max(0, Math.round(Number(control?.index) || 0));
  if (control?.controlType === "pad") {
    return {
      row: Math.floor(index / 4),
      col: index % 4,
    };
  }
  if (control?.controlType === "knob") {
    return {
      row: Math.floor(index / 4),
      col: 4 + (index % 4),
    };
  }
  if (control?.controlType === "fader") {
    return {
      row: 2 + Math.floor(index / 4),
      col: 4 + (index % 4),
    };
  }
  if (control?.controlType === "button") {
    return {
      row: 4 + Math.floor(index / 8),
      col: index % 8,
    };
  }
  return {
    row: midiLayoutCoordinate(control?.row, 0),
    col: midiLayoutCoordinate(control?.col, 0),
  };
}

function midiLayoutControlSupportsFeedback(control) {
  if (!control) return true;
  return control.controlType !== "fader" && control.lit !== false && midiLayoutControlFeedbackType(control) !== "none";
}

function midiLayoutControlSupportsColorFeedback(control) {
  return midiLayoutControlSupportsFeedback(control) && midiLayoutControlFeedbackType(control) === "rgb";
}

function midiLayoutControlFeedbackType(control) {
  if (!control || control.controlType === "fader" || control.lit === false) return "none";
  return validMidiFeedbackType(control.feedbackType) || "rgb";
}

function midiLayoutTemplateLedProtocol(template) {
  return validMidiLedProtocol(template && template.ledProtocol) || null;
}

function midiLayoutFeedbackPatch(control, template, colorOn, colorOff, feedbackMode = "latch") {
  if (!midiLayoutControlSupportsFeedback(control)) {
    return {
      colorOn: null,
      colorOff: null,
      feedbackMode: "off",
      ledProtocol: null,
      feedbackType: "none",
    };
  }
  const feedbackType = midiLayoutControlFeedbackType(control);
  return {
    colorOn: feedbackType === "rgb" ? clampMidiValue(colorOn) : null,
    colorOff: feedbackType === "rgb" ? clampMidiValue(colorOff) : null,
    feedbackMode,
    ledProtocol: midiLayoutTemplateLedProtocol(template),
    feedbackType,
  };
}

function midiActionFeedbackDefaults(action, source = {}, options = {}) {
  const defaults = MIDI_ACTION_FEEDBACK_DEFAULTS[action] || {};
  const preserveExisting = options.preserveExisting !== false;
  const colorOn = defaults.colorOn !== undefined
    ? defaults.colorOn
    : preserveExisting && source.colorOn !== undefined && source.colorOn !== null
      ? source.colorOn
      : state.midi.controller.colorOn;
  const colorOff = defaults.colorOff !== undefined
    ? defaults.colorOff
    : preserveExisting && source.colorOff !== undefined && source.colorOff !== null
      ? source.colorOff
      : state.midi.controller.colorOff;
  const feedbackMode = defaults.feedbackMode
    || (preserveExisting ? validMidiFeedbackMode(source.feedbackMode) : null)
    || state.midi.controller.feedbackMode
    || DEFAULT_MIDI_CONTROLLER.feedbackMode;
  return {
    colorOn: clampMidiValue(colorOn),
    colorOff: clampMidiValue(colorOff),
    feedbackMode,
    ledProtocol: validMidiLedProtocol(source.ledProtocol)
      || state.midi.controller.ledProtocol
      || DEFAULT_MIDI_CONTROLLER.ledProtocol,
  };
}

function midiActionDefaultColor(action, key) {
  const defaults = MIDI_ACTION_FEEDBACK_DEFAULTS[action];
  if (!defaults || defaults[key] === undefined) return null;
  return clampMidiValue(defaults[key]);
}

function setMidiColorSelectValue(select, value) {
  if (!select) return;
  const nextValue = String(clampMidiValue(value));
  if (![...select.options].some((item) => item.value === nextValue)) {
    renderMidiColorSelect(select, nextValue);
    return;
  }
  select.value = nextValue;
  updateMidiColorPicker(select, true);
  updateMidiColorPreview(select);
}

function applyMidiActionFeedbackToEditor(scope, action, source) {
  const isLayoutPad = scope === "midiLayoutPad";
  const feedbackSupported = isLayoutPad
    ? midiLayoutControlSupportsFeedback(source)
    : midiMappingSupportsFeedback(source);
  const colorFeedbackSupported = isLayoutPad
    ? midiLayoutControlSupportsColorFeedback(source)
    : midiMappingSupportsColorFeedback(source);
  const fields = isLayoutPad
    ? {
      colorOn: els.midiLayoutPadColorOnSelect,
      colorOff: els.midiLayoutPadColorOffSelect,
      feedbackMode: els.midiLayoutPadFeedbackModeSelect,
      ledProtocol: els.midiLayoutPadLedProtocolSelect,
    }
    : {
      colorOn: els.midiEditColorOnSelect,
      colorOff: els.midiEditColorOffSelect,
      feedbackMode: els.midiEditFeedbackModeSelect,
      ledProtocol: els.midiEditLedProtocolSelect,
    };
  if (!feedbackSupported) return;
  const defaults = midiActionFeedbackDefaults(action, source, {preserveExisting: false});
  if (colorFeedbackSupported) {
    setMidiColorSelectValue(fields.colorOn, defaults.colorOn);
    setMidiColorSelectValue(fields.colorOff, defaults.colorOff);
  }
  if (fields.feedbackMode) fields.feedbackMode.value = defaults.feedbackMode;
  if (fields.ledProtocol) fields.ledProtocol.value = defaults.ledProtocol;
}

function setMidiLayoutTemplate(templateId) {
  const previous = sanitizeMidiLayout(state.midi.layout);
  const nextTemplate = midiLayoutTemplate(templateId);
  const keepCurrentShape = nextTemplate.id === "custom";
  clearMidiLayoutSelection({render: false});
  state.midi.layoutPositionMode = false;
  state.midi.layoutDragId = "";
  state.midi.layoutDragIds = [];
  state.midi.layout = sanitizeMidiLayout({
    template: nextTemplate.id,
    rows: keepCurrentShape ? previous.rows : nextTemplate.rows,
    cols: keepCurrentShape ? previous.cols : nextTemplate.cols,
    surfaceRows: keepCurrentShape ? (nextTemplate.surfaceRows || 16) : nextTemplate.surfaceRows,
    surfaceCols: keepCurrentShape ? (nextTemplate.surfaceCols || 16) : nextTemplate.surfaceCols,
    buttons: keepCurrentShape ? previous.buttons : nextTemplate.buttons,
    knobs: keepCurrentShape ? previous.knobs : nextTemplate.knobs,
    faders: keepCurrentShape ? previous.faders : nextTemplate.faders,
    pads: keepCurrentShape ? previous.pads : (nextTemplate.defaultControls || []),
  });
  saveMidiLayout();
  syncMidiLayoutMappings();
  renderMidiLayoutDesigner();
}

function midiLayoutPad(padId) {
  const layout = sanitizeMidiLayout(state.midi.layout);
  state.midi.layout = layout;
  return layout.pads.find((pad) => pad.id === padId) || null;
}

function setMidiLayoutPad(nextPad, options = {}) {
  const layout = sanitizeMidiLayout(state.midi.layout);
  const index = layout.pads.findIndex((pad) => pad.id === nextPad.id);
  if (index < 0) return null;
  layout.pads[index] = sanitizeMidiLayoutPad(nextPad, layout.pads[index]);
  state.midi.layout = layout;
  saveMidiLayout();
  persistActiveMidiLayoutTemplate();
  if (options.syncMapping !== false) syncMidiLayoutPadMapping(layout.pads[index]);
  return layout.pads[index];
}

function clearMidiLayoutPad(padId, options = {}) {
  const pad = midiLayoutPad(padId);
  if (!pad) return;
  setMidiLayoutPad({
    ...pad,
    action: "empty",
    playlistId: "active",
    playlistName: "",
    mode: null,
    message: options.keepMessage ? pad.message : null,
    colorOn: null,
    colorOff: null,
    feedbackMode: null,
    ledProtocol: null,
  });
}

function midiLayoutPadToMapping(pad) {
  if (!pad || !MIDI_MAPPING_ACTIONS.has(pad.action) || !pad.message) return null;
  const action = pad.action;
  const playlistId = action === "start" ? (pad.playlistId || "active") : "active";
  const playlist = state.ledfxLibrary.playlists.find((item) => item.id === playlistId);
  const feedbackSupported = midiLayoutControlSupportsFeedback(pad);
  return {
    id: midiMappingId(action, playlistId, pad.message),
    action,
    playlistId,
    playlistName: action === "start" ? (playlist?.name || pad.playlistName || "Active playlist") : "Active playlist",
    mode: action === "start" ? (playlist?.mode || pad.mode || null) : null,
    message: sanitizeMidiMessage(pad.message),
    colorOn: feedbackSupported && pad.colorOn !== undefined && pad.colorOn !== null ? clampMidiValue(pad.colorOn) : null,
    colorOff: feedbackSupported && pad.colorOff !== undefined && pad.colorOff !== null ? clampMidiValue(pad.colorOff) : null,
    feedbackMode: feedbackSupported ? validMidiFeedbackMode(pad.feedbackMode) : "off",
    ledProtocol: feedbackSupported ? validMidiLedProtocol(pad.ledProtocol) : null,
    colorTable: MIDI_COLOR_TABLE,
    layoutPadId: pad.id,
    layoutControlType: pad.controlType,
    supportsFeedback: feedbackSupported,
    feedbackType: midiLayoutControlFeedbackType(pad),
  };
}

function syncMidiLayoutPadMapping(pad) {
  const previous = state.midi.mappings.filter((mapping) => mapping.layoutPadId === pad.id);
  previous.forEach((mapping) => sendMidiFeedback(mapping, false));
  state.midi.mappings = state.midi.mappings.filter((mapping) => mapping.layoutPadId !== pad.id);
  const mapping = midiLayoutPadToMapping(pad);
  if (mapping) {
    removeMidiMessageConflicts(mapping.message, {keepMappingId: mapping.id, keepLayoutPadId: pad.id});
    state.midi.mappings.push(mapping);
  }
  saveMidiMappings();
  refreshMidiFeedback();
}

function syncMidiLayoutMappings() {
  const layout = sanitizeMidiLayout(state.midi.layout);
  state.midi.layout = layout;
  state.midi.mappings
    .filter((mapping) => mapping.layoutPadId && !layout.pads.some((pad) => pad.id === mapping.layoutPadId))
    .forEach((mapping) => sendMidiFeedback(mapping, false));
  state.midi.mappings = state.midi.mappings.filter(
    (mapping) => !mapping.layoutPadId || layout.pads.some((pad) => pad.id === mapping.layoutPadId),
  );
  [...layout.pads].forEach((pad) => {
    const current = midiLayoutPad(pad.id);
    if (current) syncMidiLayoutPadMapping(current);
  });
  saveMidiMappings();
  refreshMidiFeedback();
}

function syncMidiLayoutPadFromMapping(mapping) {
  if (!mapping || !mapping.layoutPadId) return;
  const pad = midiLayoutPad(mapping.layoutPadId);
  if (!pad) return;
  setMidiLayoutPad({
    ...pad,
    action: mapping.action,
    playlistId: mapping.playlistId,
    playlistName: mapping.playlistName,
    mode: mapping.mode,
    message: mapping.message,
    colorOn: mapping.colorOn,
    colorOff: mapping.colorOff,
    feedbackMode: mapping.feedbackMode,
    ledProtocol: mapping.ledProtocol,
    feedbackType: mapping.feedbackType,
  }, {syncMapping: false});
}

function attachMidiMappingToLayoutControl(mapping) {
  const cleanMapping = sanitizeMidiMapping(mapping);
  if (!cleanMapping) return null;
  const layout = sanitizeMidiLayout(state.midi.layout);
  state.midi.layout = layout;
  const linked = cleanMapping.layoutPadId
    ? layout.pads.find((pad) => pad.id === cleanMapping.layoutPadId)
    : layout.pads.find((pad) => midiMessagesMatch(pad.message, cleanMapping.message));
  if (!linked) return cleanMapping;
  return sanitizeMidiMapping({
    ...cleanMapping,
    layoutPadId: linked.id,
    layoutControlType: linked.controlType,
    supportsFeedback: midiLayoutControlSupportsFeedback(linked),
    feedbackType: midiLayoutControlFeedbackType(linked),
  });
}

function removeMidiMessageConflicts(message, options = {}) {
  const cleanMessage = sanitizeMidiMessage(message);
  if (!cleanMessage) return;
  const keepMappingId = options.keepMappingId || "";
  const keepLayoutPadId = options.keepLayoutPadId || "";
  const conflicts = state.midi.mappings.filter((mapping) => (
    mapping.id !== keepMappingId &&
    (!keepLayoutPadId || mapping.layoutPadId !== keepLayoutPadId) &&
    midiMessagesMatch(mapping.message, cleanMessage)
  ));
  conflicts.forEach((mapping) => sendMidiFeedback(mapping, false));
  if (conflicts.length) {
    const conflictIds = new Set(conflicts.map((mapping) => mapping.id));
    state.midi.mappings = state.midi.mappings.filter((mapping) => !conflictIds.has(mapping.id));
  }
  const conflictLayoutIds = new Set(conflicts.map((mapping) => mapping.layoutPadId).filter(Boolean));
  state.midi.layout = sanitizeMidiLayout(state.midi.layout);
  let layoutChanged = false;
  state.midi.layout.pads = state.midi.layout.pads.map((pad) => {
    const isSameMessage = midiMessagesMatch(pad.message, cleanMessage);
    if (
      pad.id !== keepLayoutPadId &&
      pad.action !== "empty" &&
      (conflictLayoutIds.has(pad.id) || isSameMessage)
    ) {
      layoutChanged = true;
      return sanitizeMidiLayoutPad({
        ...pad,
        action: "empty",
        playlistId: "active",
        playlistName: "",
        mode: null,
        colorOn: null,
        colorOff: null,
        feedbackMode: null,
        ledProtocol: null,
      }, pad);
    }
    return pad;
  });
  state.midi.layout.controls = state.midi.layout.pads;
  if (layoutChanged) saveMidiLayout();
  if (conflicts.length) saveMidiMappings();
}

function renderMidiLayoutDesigner() {
  if (!els.midiLayoutView) return;
  const previousRepairVersion = state.midi.layout?.layoutRepairVersion || "";
  state.midi.layout = sanitizeMidiLayout(state.midi.layout);
  if ((state.midi.layout?.layoutRepairVersion || "") !== previousRepairVersion) {
    saveMidiLayout();
  }
  pruneMidiLayoutSelection(state.midi.layout);
  renderMidiLayoutTemplateSelect();
  renderMidiLayoutCustomEditor();
  renderMidiLayoutPortSelects();
  renderMidiLayoutGrid();
  renderMidiLayoutSummary();
  renderMidiLayoutZoomControls();
}

function renderMidiLayoutTemplateSelect() {
  if (!els.midiLayoutTemplateSelect) return;
  const current = state.midi.layout.template;
  els.midiLayoutTemplateSelect.innerHTML = "";
  const builtInGroup = document.createElement("optgroup");
  builtInGroup.label = "Built-in controllers";
  MIDI_LAYOUT_TEMPLATES.forEach((template) => {
    const node = option(template.label, template.id);
    node.title = template.description;
    builtInGroup.append(node);
  });
  els.midiLayoutTemplateSelect.append(builtInGroup);
  const customTemplates = loadCustomMidiLayoutTemplates();
  if (customTemplates.length) {
    const customGroup = document.createElement("optgroup");
    customGroup.label = "Saved custom models";
    customTemplates.forEach((template) => {
      const node = option(template.label, template.id);
      node.title = template.description;
      customGroup.append(node);
    });
    els.midiLayoutTemplateSelect.append(customGroup);
  }
  els.midiLayoutTemplateSelect.value = allMidiLayoutTemplates().some((template) => template.id === current)
    ? current
    : MIDI_LAYOUT_DEFAULT_TEMPLATE;
}

function renderMidiLayoutCustomEditor() {
  if (!els.midiLayoutCustomEditor) return;
  const layout = sanitizeMidiLayout(state.midi.layout);
  const template = midiLayoutTemplate(layout.template);
  const isCustom = Boolean(template.custom);
  els.midiLayoutCustomEditor.hidden = !isCustom;
  if (els.midiLayoutCustomNameInput && !document.activeElement?.isSameNode(els.midiLayoutCustomNameInput)) {
    els.midiLayoutCustomNameInput.value = template.id !== "custom"
      ? template.label
      : defaultMidiCustomModelName(layout);
  }
  syncMidiLayoutGridSizeSelect(layout);
  if (els.midiLayoutRowsInput) els.midiLayoutRowsInput.value = layout.rows;
  if (els.midiLayoutColsInput) els.midiLayoutColsInput.value = layout.cols;
  if (els.midiLayoutButtonsInput) els.midiLayoutButtonsInput.value = layout.buttons || 0;
  if (els.midiLayoutKnobsInput) els.midiLayoutKnobsInput.value = layout.knobs;
  if (els.midiLayoutFadersInput) els.midiLayoutFadersInput.value = layout.faders;
}

function midiLayoutGridSizeValue(layout) {
  const surfaceRows = midiLayoutNumber(layout && layout.surfaceRows, 1, 32, layout?.rows || 8);
  const surfaceCols = midiLayoutNumber(layout && layout.surfaceCols, 1, 32, layout?.cols || 8);
  if (surfaceRows === surfaceCols && MIDI_LAYOUT_GRID_SIZE_OPTIONS.includes(surfaceRows)) {
    return String(surfaceRows);
  }
  return "custom";
}

function syncMidiLayoutGridSizeSelect(layout) {
  if (!els.midiLayoutGridSizeSelect) return;
  els.midiLayoutGridSizeSelect.value = midiLayoutGridSizeValue(layout);
}

function selectedMidiLayoutSurfaceDimensions(current) {
  const fallbackRows = midiLayoutNumber(current && current.surfaceRows, 1, 32, current?.rows || 8);
  const fallbackCols = midiLayoutNumber(current && current.surfaceCols, 1, 32, current?.cols || 8);
  const selected = Number(els.midiLayoutGridSizeSelect?.value);
  if (MIDI_LAYOUT_GRID_SIZE_OPTIONS.includes(selected)) {
    return {surfaceRows: selected, surfaceCols: selected};
  }
  return {surfaceRows: fallbackRows, surfaceCols: fallbackCols};
}

function applyMidiLayoutGridSizePreset() {
  const current = sanitizeMidiLayout(state.midi.layout);
  const selected = Number(els.midiLayoutGridSizeSelect?.value);
  if (!MIDI_LAYOUT_GRID_SIZE_OPTIONS.includes(selected)) {
    syncMidiLayoutGridSizeSelect(current);
    return;
  }
  state.midi.layout = sanitizeMidiLayout({
    ...current,
    template: "custom",
    surfaceRows: selected,
    surfaceCols: selected,
    pads: current.pads,
  });
  saveMidiLayout();
  persistActiveMidiLayoutTemplate();
  renderMidiLayoutDesigner();
  renderMidiMapper();
  showToast(`Position grid set to ${selected}x${selected}.`);
}

function renderMidiLayoutPortSelects() {
  renderMidiLayoutPortSelect(els.midiLayoutInputSelect, state.midi.inputs, state.midi.selectedInputId, "No MIDI input connected");
  renderMidiLayoutPortSelect(els.midiLayoutOutputSelect, state.midi.outputs, state.midi.selectedOutputId, "No MIDI output connected");
  if (!els.midiLayoutStatus) return;
  const input = state.midi.inputs.find((item) => item.id === state.midi.selectedInputId);
  const output = state.midi.outputs.find((item) => item.id === state.midi.selectedOutputId);
  if (!state.midi.access) {
    els.midiLayoutStatus.textContent = "MIDI not connected. Use Connect MIDI, then click a pad and Learn if needed.";
  } else {
    els.midiLayoutStatus.textContent = `Input: ${input?.name || "none"} | Output: ${output?.name || "none"}${state.midi.learn ? " | Learning..." : ""}`;
  }
}

function renderMidiLayoutPortSelect(select, ports, currentId, emptyLabel) {
  if (!select) return;
  const current = currentId || select.value;
  select.innerHTML = "";
  if (!ports.length) {
    select.append(option(emptyLabel, ""));
    select.disabled = true;
    return;
  }
  ports.forEach((port) => {
    const direction = select === els.midiLayoutOutputSelect ? "output" : "input";
    select.append(option(midiPortOptionLabel(port, direction), port.id));
  });
  select.disabled = false;
  select.value = ports.some((port) => port.id === current) ? current : ports[0].id;
}

function midiPortOptionLabel(port, direction = "input") {
  const name = port?.name || port?.id || "MIDI port";
  const normalized = name.toLowerCase();
  if (normalized.includes("note")) {
    return `${name} - pads/buttons${direction === "output" ? "/LEDs" : ""}`;
  }
  if (normalized.includes("control")) {
    return `${name} - knobs/faders/CC`;
  }
  return name;
}

function midiLayoutSelectionSet() {
  if (!(state.midi.layoutSelectedIds instanceof Set)) {
    state.midi.layoutSelectedIds = new Set();
  }
  return state.midi.layoutSelectedIds;
}

function pruneMidiLayoutSelection(layout) {
  const validIds = new Set((layout?.pads || []).map((pad) => pad.id));
  state.midi.layoutSelectedIds = new Set([...midiLayoutSelectionSet()].filter((id) => validIds.has(id)));
}

function toggleMidiLayoutControlSelection(controlId) {
  if (!state.midi.layoutPositionMode || !controlId) return;
  if (Date.now() < (state.midi.layoutSuppressClickUntil || 0)) return;
  const layout = sanitizeMidiLayout(state.midi.layout);
  if (!layout.pads.some((control) => control.id === controlId)) return;
  const selected = new Set(midiLayoutSelectionSet());
  if (selected.has(controlId)) {
    selected.delete(controlId);
  } else {
    selected.add(controlId);
  }
  state.midi.layoutSelectedIds = selected;
  renderMidiLayoutGrid();
  renderMidiLayoutSummary();
}

function clearMidiLayoutSelection(options = {}) {
  state.midi.layoutSelectedIds = new Set();
  state.midi.layoutDragIds = [];
  state.midi.layoutDragId = "";
  if (options.render !== false) {
    renderMidiLayoutGrid();
    renderMidiLayoutSummary();
  }
}

function changeMidiLayoutZoom(delta) {
  state.midi.layoutZoom = normalizeMidiLayoutZoom((state.midi.layoutZoom || 1) + delta);
  saveMidiLayoutZoom();
  renderMidiLayoutGrid();
  renderMidiLayoutZoomControls();
}

function renderMidiLayoutZoomControls() {
  const zoom = normalizeMidiLayoutZoom(state.midi.layoutZoom);
  if (els.midiLayoutZoomValue) els.midiLayoutZoomValue.textContent = `${Math.round(zoom * 100)}%`;
  if (els.midiLayoutZoomOutButton) els.midiLayoutZoomOutButton.disabled = zoom <= MIDI_LAYOUT_ZOOM_MIN;
  if (els.midiLayoutZoomInButton) els.midiLayoutZoomInButton.disabled = zoom >= MIDI_LAYOUT_ZOOM_MAX;
  if (els.midiLayoutClearSelectionButton) {
    const selectedCount = midiLayoutSelectionSet().size;
    els.midiLayoutClearSelectionButton.hidden = !state.midi.layoutPositionMode || selectedCount === 0;
    els.midiLayoutClearSelectionButton.textContent = selectedCount > 1
      ? `Clear ${selectedCount} Selected`
      : "Clear Selection";
  }
}

function renderMidiLayoutGrid() {
  if (!els.midiLayoutGrid) return;
  const layout = sanitizeMidiLayout(state.midi.layout);
  const template = midiLayoutTemplate(layout.template);
  els.midiLayoutGrid.style.setProperty("--midi-layout-cols", String(layout.cols));
  els.midiLayoutGrid.style.setProperty("--midi-layout-zoom", String(normalizeMidiLayoutZoom(state.midi.layoutZoom)));
  els.midiLayoutGrid.innerHTML = "";
  const pads = layout.pads.filter((control) => control.controlType === "pad");
  const buttons = layout.pads.filter((control) => control.controlType === "button");
  const knobs = layout.pads.filter((control) => control.controlType === "knob");
  const faders = layout.pads.filter((control) => control.controlType === "fader");
  if (template.custom) {
    els.midiLayoutGrid.append(renderMidiCustomLayoutSurface(layout));
    return;
  }
  if (template.physicalLayout === "akai_apc_mini_mk2") {
    els.midiLayoutGrid.append(renderApcMiniMk2Layout(layout, pads, buttons, faders));
    if (knobs.length) {
      const extras = document.createElement("div");
      extras.className = "midi-layout-extra-controls";
      extras.append(midiLayoutControlBank("Knobs", knobs));
      els.midiLayoutGrid.append(extras);
    }
    return;
  }
  if (template.physicalLayout) {
    els.midiLayoutGrid.append(renderMidiPhysicalLayoutSurface(layout, template));
    return;
  }
  const padMatrix = document.createElement("div");
  padMatrix.className = "midi-layout-pad-matrix";
  padMatrix.style.setProperty("--midi-layout-cols", String(layout.cols));
  pads.forEach((pad) => padMatrix.append(midiLayoutControlButton(pad)));
  els.midiLayoutGrid.append(padMatrix);
  if (buttons.length || knobs.length || faders.length) {
    const extras = document.createElement("div");
    extras.className = "midi-layout-extra-controls";
    if (buttons.length) extras.append(midiLayoutControlBank("Buttons", buttons));
    if (knobs.length) extras.append(midiLayoutControlBank("Knobs", knobs));
    if (faders.length) extras.append(midiLayoutControlBank("Faders", faders));
    els.midiLayoutGrid.append(extras);
  }
}

function renderMidiPhysicalLayoutSurface(layout, template) {
  const controls = midiLayoutControlsForPositionEditor(layout, template);
  const surface = midiLayoutEditorSurfaceForControls(layout, template, controls);
  const positionedControls = normalizeMidiLayoutPositions(controls, {
    rows: surface.surfaceRows,
    cols: surface.surfaceCols,
  });
  return renderMidiCustomLayoutSurface({
    ...layout,
    surfaceRows: surface.surfaceRows,
    surfaceCols: surface.surfaceCols,
    pads: positionedControls,
    controls: positionedControls,
  });
}

function renderMidiCustomLayoutSurface(layout) {
  const surface = document.createElement("div");
  surface.className = "midi-layout-free-surface";
  surface.classList.toggle("is-editing", state.midi.layoutPositionMode);
  const sortedControls = [...layout.pads].sort(midiLayoutPositionSort);
  const maxControlRow = sortedControls.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.row, 0)), 0);
  const maxControlCol = sortedControls.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.col, 0)), 0);
  const rows = Math.max(layout.surfaceRows || layout.rows, maxControlRow + 1);
  const cols = Math.max(layout.surfaceCols || layout.cols, maxControlCol + 1);
  const controlsByCell = new Map(sortedControls.map((control) => [
    `${midiLayoutCoordinate(control.row, 0)}:${midiLayoutCoordinate(control.col, 0)}`,
    control,
  ]));
  surface.style.setProperty("--midi-layout-cols", String(cols));
  surface.style.setProperty("--midi-layout-rows", String(rows));

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cell = document.createElement("div");
      cell.className = "midi-layout-grid-cell";
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.addEventListener("dragover", handleMidiLayoutDragOver);
      cell.addEventListener("drop", handleMidiLayoutDrop);
      const control = controlsByCell.get(`${row}:${col}`);
      if (control) {
        cell.classList.add("has-control");
        cell.classList.toggle("has-selected-control", midiLayoutSelectionSet().has(control.id));
        cell.append(midiLayoutControlButton(control, {
          draggable: state.midi.layoutPositionMode,
        }));
      }
      surface.append(cell);
    }
  }
  return surface;
}

function midiLayoutPositionSort(a, b) {
  return (midiLayoutCoordinate(a.row, 0) - midiLayoutCoordinate(b.row, 0))
    || (midiLayoutCoordinate(a.col, 0) - midiLayoutCoordinate(b.col, 0))
    || ((a.controlType || "").localeCompare(b.controlType || ""))
    || ((Number(a.index) || 0) - (Number(b.index) || 0));
}

function renderApcMiniMk2Layout(layout, pads, buttons, faders) {
  const surface = document.createElement("div");
  surface.className = "midi-layout-apc";
  surface.style.setProperty("--midi-layout-cols", String(layout.cols));

  const padMatrix = document.createElement("div");
  padMatrix.className = "midi-layout-pad-matrix midi-layout-apc-pads";
  padMatrix.style.setProperty("--midi-layout-cols", String(layout.cols));
  pads.forEach((pad) => padMatrix.append(midiLayoutControlButton(pad)));

  const sceneButtons = buttons.filter((button) => button.role === "scene");
  const trackButtons = buttons.filter((button) => button.role === "track");
  const shiftButton = buttons.find((button) => button.role === "shift");
  const otherButtons = buttons.filter((button) => !["scene", "track", "shift"].includes(button.role));

  const top = document.createElement("div");
  top.className = "midi-layout-apc-top";
  top.append(padMatrix);
  if (sceneButtons.length) {
    const side = document.createElement("div");
    side.className = "midi-layout-apc-scene-buttons";
    sceneButtons.forEach((button) => side.append(midiLayoutControlButton(button)));
    top.append(side);
  }
  surface.append(top);

  const trackRow = document.createElement("div");
  trackRow.className = "midi-layout-apc-track-row";
  trackButtons.forEach((button) => trackRow.append(midiLayoutControlButton(button)));
  if (shiftButton) trackRow.append(midiLayoutControlButton(shiftButton));
  surface.append(trackRow);

  if (faders.length) {
    const faderRow = document.createElement("div");
    faderRow.className = "midi-layout-apc-fader-row";
    faders.forEach((fader) => faderRow.append(midiLayoutControlButton(fader)));
    surface.append(faderRow);
  }

  if (otherButtons.length) {
    surface.append(midiLayoutControlBank("Buttons", otherButtons));
  }
  return surface;
}

function midiLayoutControlBank(title, controls) {
  const bank = document.createElement("section");
  bank.className = `midi-layout-control-bank is-${controls[0]?.controlType || "pad"}`;
  const label = document.createElement("strong");
  label.textContent = title;
  const grid = document.createElement("div");
  grid.className = "midi-layout-control-row";
  controls.forEach((control) => grid.append(midiLayoutControlButton(control)));
  bank.append(label, grid);
  return bank;
}

function midiLayoutControlButton(pad, options = {}) {
  const mapped = pad.action !== "empty";
  const feedbackSupported = midiLayoutControlSupportsFeedback(pad);
  const colorFeedbackSupported = midiLayoutControlSupportsColorFeedback(pad);
  const touched = midiLayoutPadWasTouched(pad);
  const title = `${pad.label} - ${mapped ? midiLayoutPadTitle(pad) : `Empty ${midiLayoutControlTypeLabel(pad.controlType).toLowerCase()}`}`;
  const tile = document.createElement("div");
  tile.className = `midi-layout-control-tile is-${pad.controlType || "pad"}`;
  tile.dataset.padId = pad.id;
  tile.dataset.row = String(midiLayoutCoordinate(pad.row, 0));
  tile.dataset.col = String(midiLayoutCoordinate(pad.col, 0));
  tile.classList.toggle("is-mapped", mapped);
  tile.classList.toggle("is-active", midiLayoutPadIsActive(pad));
  tile.classList.toggle("is-touched", touched);
  tile.classList.toggle("is-unlit", !feedbackSupported);
  tile.classList.toggle("is-selected", midiLayoutSelectionSet().has(pad.id));
  if (options.draggable) {
    tile.draggable = true;
    tile.classList.add("is-draggable");
    tile.addEventListener("dragstart", (event) => {
      if (!midiLayoutSelectionSet().has(pad.id)) {
        state.midi.layoutSelectedIds = new Set([pad.id]);
      }
      state.midi.layoutDragId = pad.id;
      state.midi.layoutDragIds = [...midiLayoutSelectionSet()];
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", pad.id);
      requestAnimationFrame(() => {
        tile.classList.add("is-dragging");
        tile.classList.add("is-selected");
      });
    });
    tile.addEventListener("dragover", handleMidiLayoutDragOver);
    tile.addEventListener("drop", handleMidiLayoutDrop);
    tile.addEventListener("dragend", () => {
      state.midi.layoutDragId = "";
      state.midi.layoutDragIds = [];
      state.midi.layoutSuppressClickUntil = Date.now() + 250;
      tile.classList.remove("is-dragging");
    });
  }

  const button = document.createElement("button");
  button.type = "button";
  button.draggable = false;
  button.className = `midi-layout-pad midi-layout-${pad.controlType || "pad"}`;
  button.classList.toggle("is-mapped", mapped);
  button.classList.toggle("is-active", midiLayoutPadIsActive(pad));
  button.classList.toggle("is-touched", touched);
  button.classList.toggle("is-unlit", !feedbackSupported);
  button.classList.toggle("is-selected", midiLayoutSelectionSet().has(pad.id));
  button.classList.toggle("is-single-led", feedbackSupported && !colorFeedbackSupported);
  button.style.setProperty("--pad-on-color", midiColorInfo(midiMappingColor(pad, "colorOn")).hex);
  button.style.setProperty("--pad-off-color", midiColorInfo(midiMappingColor(pad, "colorOff")).hex);
  button.setAttribute("aria-label", title);

  const number = document.createElement("span");
  number.className = "midi-layout-pad-number";
  number.textContent = pad.label;
  button.append(number);
  if (colorFeedbackSupported) {
    const colors = document.createElement("span");
    colors.className = "midi-layout-pad-colors";
    colors.setAttribute("aria-hidden", "true");
    const off = document.createElement("span");
    off.style.background = midiColorInfo(midiMappingColor(pad, "colorOff")).hex;
    const on = document.createElement("span");
    on.style.background = midiColorInfo(midiMappingColor(pad, "colorOn")).hex;
    colors.append(off, on);
    button.append(colors);
  } else if (feedbackSupported) {
    const led = document.createElement("span");
    led.className = "midi-layout-single-led";
    led.textContent = "LED";
    button.append(led);
  }
  button.addEventListener("click", (event) => {
    if (state.midi.layoutPositionMode) {
      event.preventDefault();
      event.stopPropagation();
      toggleMidiLayoutControlSelection(pad.id);
      return;
    }
    openMidiLayoutPadEditor(pad.id);
  });

  const caption = document.createElement("div");
  caption.className = "midi-layout-control-caption";
  const action = document.createElement("strong");
  action.textContent = mapped ? MIDI_ACTION_LABELS[pad.action] || pad.action : midiLayoutControlTypeLabel(pad.controlType);
  const target = document.createElement("span");
  target.className = "midi-layout-pad-target";
  target.textContent = mapped ? midiLayoutPadTargetLabel(pad) : midiCompactMessageLabel(pad.message);
  caption.append(action, target);

  tile.append(button, caption);
  return tile;
}

function handleMidiLayoutDragOver(event) {
  if (!state.midi.layoutPositionMode) return;
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = "move";
}

function handleMidiLayoutDrop(event) {
  if (!state.midi.layoutPositionMode) return;
  event.preventDefault();
  event.stopPropagation();
  const draggedId = event.dataTransfer.getData("text/plain") || state.midi.layoutDragId;
  const target = event.currentTarget;
  const row = midiLayoutCoordinate(target.dataset.row, 0);
  const col = midiLayoutCoordinate(target.dataset.col, 0);
  moveMidiLayoutControl(draggedId, row, col);
}

function moveMidiLayoutControl(controlId, row, col) {
  if (!controlId) return;
  const layout = sanitizeMidiLayout(state.midi.layout);
  const sourceIndex = layout.pads.findIndex((control) => control.id === controlId);
  if (sourceIndex < 0) return;
  const source = layout.pads[sourceIndex];
  const targetRow = midiLayoutCoordinate(row, source.row);
  const targetCol = midiLayoutCoordinate(col, source.col);
  const selectedIds = new Set(
    (state.midi.layoutDragIds && state.midi.layoutDragIds.length)
      ? state.midi.layoutDragIds
      : (midiLayoutSelectionSet().has(controlId) ? [...midiLayoutSelectionSet()] : [controlId]),
  );
  selectedIds.add(controlId);
  const selectedControls = layout.pads.filter((control) => selectedIds.has(control.id));
  if (selectedControls.length > 1) {
    moveMidiLayoutControlGroup(layout, source, selectedControls, targetRow, targetCol);
    return;
  }
  if (source.row === targetRow && source.col === targetCol) return;
  const targetIndex = layout.pads.findIndex((control) => (
    control.id !== source.id &&
    midiLayoutCoordinate(control.row, 0) === targetRow &&
    midiLayoutCoordinate(control.col, 0) === targetCol
  ));
  const nextPads = layout.pads.map((control, index) => {
    if (index === sourceIndex) return {...control, row: targetRow, col: targetCol};
    if (index === targetIndex) return {...control, row: source.row, col: source.col};
    return control;
  });
  state.midi.layout = sanitizeMidiLayout({
    ...layout,
    pads: nextPads,
    controls: nextPads,
  });
  saveMidiLayout();
  persistActiveMidiLayoutTemplate();
  renderMidiLayoutDesigner();
  renderMidiMapper();
  if (els.midiLayoutStatus) {
    els.midiLayoutStatus.textContent = targetIndex >= 0
      ? `Moved ${source.label} and swapped with ${layout.pads[targetIndex].label}.`
      : `Moved ${source.label}.`;
  }
}

function moveMidiLayoutControlGroup(layout, source, selectedControls, targetRow, targetCol) {
  let deltaRow = targetRow - midiLayoutCoordinate(source.row, 0);
  let deltaCol = targetCol - midiLayoutCoordinate(source.col, 0);
  const minRow = selectedControls.reduce((min, control) => Math.min(min, midiLayoutCoordinate(control.row, 0)), Infinity);
  const minCol = selectedControls.reduce((min, control) => Math.min(min, midiLayoutCoordinate(control.col, 0)), Infinity);
  const maxRow = selectedControls.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.row, 0)), 0);
  const maxCol = selectedControls.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.col, 0)), 0);
  const surfaceRows = Math.max(
    layout.surfaceRows || layout.rows,
    layout.pads.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.row, 0) + 1), 1),
  );
  const surfaceCols = Math.max(
    layout.surfaceCols || layout.cols,
    layout.pads.reduce((max, control) => Math.max(max, midiLayoutCoordinate(control.col, 0) + 1), 1),
  );
  deltaRow = Math.max(-minRow, Math.min(surfaceRows - 1 - maxRow, deltaRow));
  deltaCol = Math.max(-minCol, Math.min(surfaceCols - 1 - maxCol, deltaCol));
  if (deltaRow === 0 && deltaCol === 0) return;

  const selectedIds = new Set(selectedControls.map((control) => control.id));
  const proposedCells = new Set(selectedControls.map((control) => (
    `${midiLayoutCoordinate(control.row, 0) + deltaRow}:${midiLayoutCoordinate(control.col, 0) + deltaCol}`
  )));
  const blockedBy = layout.pads.find((control) => (
    !selectedIds.has(control.id) &&
    proposedCells.has(`${midiLayoutCoordinate(control.row, 0)}:${midiLayoutCoordinate(control.col, 0)}`)
  ));
  if (blockedBy) {
    showToast(`Selection blocked by ${blockedBy.label}. Move to empty cells or move that control too.`);
    return;
  }

  const nextPads = layout.pads.map((control) => (
    selectedIds.has(control.id)
      ? {
        ...control,
        row: midiLayoutCoordinate(control.row, 0) + deltaRow,
        col: midiLayoutCoordinate(control.col, 0) + deltaCol,
      }
      : control
  ));
  state.midi.layout = sanitizeMidiLayout({
    ...layout,
    pads: nextPads,
    controls: nextPads,
  });
  state.midi.layoutSelectedIds = selectedIds;
  saveMidiLayout();
  persistActiveMidiLayoutTemplate();
  renderMidiLayoutDesigner();
  renderMidiMapper();
  if (els.midiLayoutStatus) {
    els.midiLayoutStatus.textContent = `Moved ${selectedControls.length} selected controls.`;
  }
}

function toggleMidiLayoutPositionMode() {
  const layout = sanitizeMidiLayout(state.midi.layout);
  const template = midiLayoutTemplate(layout.template);
  if (!template.custom) {
    const customControls = midiLayoutControlsForPositionEditor(layout, template);
    const surface = midiLayoutEditorSurfaceForControls(layout, template, customControls);
    state.midi.layout = sanitizeMidiLayout({
      ...layout,
      template: "custom",
      sourceTemplate: template.id,
      physicalLayout: template.physicalLayout || "",
      layoutRepairVersion: template.physicalLayout === "akai_apc_mini_mk2"
        ? "apc_mini_mk2_positions_v2"
        : "",
      surfaceRows: surface.surfaceRows,
      surfaceCols: surface.surfaceCols,
      pads: customControls,
      controls: customControls,
    });
    state.midi.layoutPositionMode = true;
    saveMidiLayout();
    renderMidiLayoutDesigner();
    showToast("Converted current surface to Custom. Drag controls to rearrange it, then Save Model.");
    return;
  }
  state.midi.layoutPositionMode = !state.midi.layoutPositionMode;
  if (!state.midi.layoutPositionMode) clearMidiLayoutSelection({render: false});
  renderMidiLayoutDesigner();
}

function persistActiveMidiLayoutTemplate() {
  const layout = sanitizeMidiLayout(state.midi.layout);
  const template = midiLayoutTemplate(layout.template);
  if (!template.savedCustom) return false;
  const existingTemplates = loadCustomMidiLayoutTemplates();
  const nextTemplate = sanitizeCustomMidiLayoutTemplate({
    ...template,
    sourceTemplate: layout.sourceTemplate,
    physicalLayout: layout.physicalLayout,
    layoutRepairVersion: layout.layoutRepairVersion,
    rows: layout.rows,
    cols: layout.cols,
    surfaceRows: layout.surfaceRows,
    surfaceCols: layout.surfaceCols,
    buttons: layout.buttons,
    knobs: layout.knobs,
    faders: layout.faders,
    defaultControls: layout.pads.map(midiLayoutTemplateControlFromPad),
  });
  if (!nextTemplate) return false;
  saveCustomMidiLayoutTemplates([
    ...existingTemplates.filter((item) => item.id !== template.id),
    nextTemplate,
  ]);
  return true;
}

function renderMidiLayoutSummary() {
  if (!els.midiLayoutSummary) return;
  const layout = sanitizeMidiLayout(state.midi.layout);
  const mapped = layout.pads.filter((pad) => pad.action !== "empty").length;
  const pads = layout.rows * layout.cols;
  const extras = [
    layout.buttons ? `${layout.buttons} buttons` : "",
    layout.knobs ? `${layout.knobs} knobs` : "",
    layout.faders ? `${layout.faders} faders` : "",
  ].filter(Boolean).join(" | ");
  const surface = layout.surfaceRows === layout.rows && layout.surfaceCols === layout.cols
    ? ""
    : ` | edit grid ${layout.surfaceRows}x${layout.surfaceCols}`;
  const selected = state.midi.layoutPositionMode && midiLayoutSelectionSet().size
    ? ` | ${midiLayoutSelectionSet().size} selected`
    : "";
  els.midiLayoutSummary.textContent = `${mapped} mapped | ${pads} pads${extras ? ` | ${extras}` : ""}${surface}${selected}`;
  const template = midiLayoutTemplate(layout.template);
  if (els.midiLayoutPositionButton) {
    els.midiLayoutPositionButton.hidden = false;
    els.midiLayoutPositionButton.classList.toggle("is-active", state.midi.layoutPositionMode);
    els.midiLayoutPositionButton.textContent = template.custom
      ? (state.midi.layoutPositionMode ? "Done Moving" : "Edit Positions")
      : "Customize Positions";
  }
  renderMidiLayoutZoomControls();
}

function midiLayoutControlTypeLabel(controlType) {
  if (controlType === "button") return "Button";
  if (controlType === "knob") return "Knob";
  if (controlType === "fader") return "Fader";
  return "Pad";
}

function applyMidiLayoutCustomSettings() {
  const current = sanitizeMidiLayout(state.midi.layout);
  const rows = midiLayoutNumber(els.midiLayoutRowsInput?.value, 1, 16, current.rows || 8);
  const cols = midiLayoutNumber(els.midiLayoutColsInput?.value, 1, 16, current.cols || 8);
  const buttons = midiLayoutNumber(els.midiLayoutButtonsInput?.value, 0, 48, current.buttons || 0);
  const knobs = midiLayoutNumber(els.midiLayoutKnobsInput?.value, 0, 32, current.knobs || 0);
  const faders = midiLayoutNumber(els.midiLayoutFadersInput?.value, 0, 32, current.faders || 0);
  const surface = selectedMidiLayoutSurfaceDimensions(current);
  state.midi.layout = sanitizeMidiLayout({
    ...current,
    template: "custom",
    rows,
    cols,
    surfaceRows: surface.surfaceRows,
    surfaceCols: surface.surfaceCols,
    buttons,
    knobs,
    faders,
    pads: current.pads,
  });
  saveMidiLayout();
  syncMidiLayoutMappings();
  renderMidiLayoutDesigner();
  renderMidiMapper();
  showToast(`Custom layout applied: ${rows}x${cols}, ${buttons} buttons, ${knobs} knobs, ${faders} faders.`);
}

function defaultMidiCustomModelName(layout) {
  const cleanLayout = sanitizeMidiLayout(layout);
  const gridLabel = cleanLayout.surfaceRows === cleanLayout.rows && cleanLayout.surfaceCols === cleanLayout.cols
    ? ""
    : ` on ${cleanLayout.surfaceRows}x${cleanLayout.surfaceCols} grid`;
  const extras = [
    cleanLayout.buttons ? `${cleanLayout.buttons} buttons` : "",
    cleanLayout.knobs ? `${cleanLayout.knobs} knobs` : "",
    cleanLayout.faders ? `${cleanLayout.faders} faders` : "",
  ].filter(Boolean).join(", ");
  return `Custom ${cleanLayout.rows}x${cleanLayout.cols}${gridLabel}${extras ? ` + ${extras}` : ""}`;
}

function midiLayoutTemplateControlFromPad(pad) {
  const cleanPad = sanitizeMidiLayoutPad(pad);
  return {
    id: cleanPad.id,
    index: cleanPad.index,
    row: cleanPad.row,
    col: cleanPad.col,
    controlType: cleanPad.controlType,
    type: cleanPad.controlType,
    label: cleanPad.label,
    role: cleanPad.role,
    lit: cleanPad.lit,
    feedbackType: cleanPad.feedbackType,
    message: cleanPad.message,
    colorTable: MIDI_COLOR_TABLE,
  };
}

function saveMidiLayoutCustomModel() {
  const current = sanitizeMidiLayout(state.midi.layout);
  const rows = midiLayoutNumber(els.midiLayoutRowsInput?.value, 1, 16, current.rows || 8);
  const cols = midiLayoutNumber(els.midiLayoutColsInput?.value, 1, 16, current.cols || 8);
  const buttons = midiLayoutNumber(els.midiLayoutButtonsInput?.value, 0, 48, current.buttons || 0);
  const knobs = midiLayoutNumber(els.midiLayoutKnobsInput?.value, 0, 32, current.knobs || 0);
  const faders = midiLayoutNumber(els.midiLayoutFadersInput?.value, 0, 32, current.faders || 0);
  const surface = selectedMidiLayoutSurfaceDimensions(current);
  const appliedLayout = sanitizeMidiLayout({
    ...current,
    template: "custom",
    rows,
    cols,
    surfaceRows: surface.surfaceRows,
    surfaceCols: surface.surfaceCols,
    buttons,
    knobs,
    faders,
    pads: current.pads,
  });
  const requestedName = (els.midiLayoutCustomNameInput?.value || "").trim();
  const label = (requestedName || defaultMidiCustomModelName(appliedLayout)).slice(0, 48);
  const existingTemplates = loadCustomMidiLayoutTemplates();
  const activeTemplate = midiLayoutTemplate(current.template);
  const existingId = activeTemplate.savedCustom
    ? activeTemplate.id
    : existingTemplates.find((template) => template.label.toLowerCase() === label.toLowerCase())?.id;
  const id = existingId || uniqueMidiLayoutTemplateId(label, existingTemplates);
  const template = sanitizeCustomMidiLayoutTemplate({
    id,
    label,
    sourceTemplate: appliedLayout.sourceTemplate,
    physicalLayout: appliedLayout.physicalLayout,
    layoutRepairVersion: appliedLayout.layoutRepairVersion,
    rows: appliedLayout.rows,
    cols: appliedLayout.cols,
    surfaceRows: appliedLayout.surfaceRows,
    surfaceCols: appliedLayout.surfaceCols,
    buttons: appliedLayout.buttons,
    knobs: appliedLayout.knobs,
    faders: appliedLayout.faders,
    ledProtocol: state.midi.controller.ledProtocol || "generic",
    defaultControls: appliedLayout.pads.map(midiLayoutTemplateControlFromPad),
    description: "Saved custom controller model with learned labels and MIDI messages.",
  });
  if (!template) return;
  saveCustomMidiLayoutTemplates([
    ...existingTemplates.filter((item) => item.id !== id),
    template,
  ]);
  state.midi.layout = sanitizeMidiLayout({
    ...appliedLayout,
    template: id,
    pads: appliedLayout.pads,
  });
  saveMidiLayout();
  renderMidiLayoutDesigner();
  showToast(`Saved controller model "${label}".`);
}

function uniqueMidiLayoutTemplateId(label, templates) {
  const used = new Set([
    ...MIDI_LAYOUT_TEMPLATES.map((template) => template.id),
    ...(templates || []).map((template) => template.id),
  ]);
  const base = `custom_${snakeCase(label) || "controller"}`;
  if (!used.has(base)) return base;
  let index = 2;
  while (used.has(`${base}_${index}`)) index += 1;
  return `${base}_${index}`;
}

function addMidiLayoutCustomControl(controlType) {
  const current = sanitizeMidiLayout(state.midi.layout);
  const rows = midiLayoutNumber(els.midiLayoutRowsInput?.value, 1, 16, current.rows || 8);
  const cols = midiLayoutNumber(els.midiLayoutColsInput?.value, 1, 16, current.cols || 8);
  const buttons = midiLayoutNumber(els.midiLayoutButtonsInput?.value, 0, 48, current.buttons || 0);
  const knobs = midiLayoutNumber(els.midiLayoutKnobsInput?.value, 0, 32, current.knobs || 0);
  const faders = midiLayoutNumber(els.midiLayoutFadersInput?.value, 0, 32, current.faders || 0);
  const surface = selectedMidiLayoutSurfaceDimensions(current);
  const next = {
    ...current,
    template: "custom",
    rows,
    cols,
    surfaceRows: surface.surfaceRows,
    surfaceCols: surface.surfaceCols,
    buttons,
    knobs,
    faders,
    pads: current.pads,
  };
  if (controlType === "button") next.buttons = midiLayoutNumber(next.buttons + 1, 0, 48, next.buttons);
  if (controlType === "knob") next.knobs = midiLayoutNumber(next.knobs + 1, 0, 32, next.knobs);
  if (controlType === "fader") next.faders = midiLayoutNumber(next.faders + 1, 0, 32, next.faders);
  state.midi.layout = sanitizeMidiLayout(next);
  saveMidiLayout();
  syncMidiLayoutMappings();
  renderMidiLayoutDesigner();
  renderMidiMapper();
  showToast(`${midiLayoutControlTypeLabel(controlType)} added to Custom layout.`);
}

function midiLayoutPadIsActive(pad) {
  if (!pad || pad.action === "empty") return false;
  if (pad.action === "blackout") return ledfxGlobalBrightness() <= 0.01;
  return pad.action === "start" && pad.playlistId && pad.playlistId === activePlaylistId();
}

function midiLayoutPadWasTouched(pad) {
  const activity = state.midi.layoutActivity;
  if (!pad || !activity || !activity.message) return false;
  if (Date.now() - activity.time > MIDI_LAYOUT_ACTIVITY_MS) return false;
  return midiMessagesMatch(pad.message, activity.message);
}

function markMidiLayoutActivity(message) {
  if (!message) return;
  const layout = sanitizeMidiLayout(state.midi.layout);
  const matched = layout.pads.find((pad) => midiMessagesMatch(pad.message, message));
  state.midi.layoutActivity = {
    message,
    value: message.value,
    time: Date.now(),
    padId: matched?.id || "",
  };
  clearTimeout(state.midi.layoutActivityTimer);
  state.midi.layoutActivityTimer = setTimeout(() => {
    state.midi.layoutActivity = null;
    if (els.midiLayoutView && !els.midiLayoutView.hidden) renderMidiLayoutGrid();
  }, MIDI_LAYOUT_ACTIVITY_MS);
  if (els.midiLayoutStatus && els.midiLayoutView && !els.midiLayoutView.hidden) {
    const valueLabel = message.type === "cc" ? ` | value ${message.value}` : "";
    els.midiLayoutStatus.textContent = matched
      ? `Last input: ${matched.label} | ${midiMessageLabel(message)}${valueLabel}`
      : `Last input did not match the current surface | ${midiMessageLabel(message)}${valueLabel}`;
  }
  if (els.midiLayoutView && !els.midiLayoutView.hidden) renderMidiLayoutGrid();
}

function midiLayoutPadTitle(pad) {
  if (!pad || pad.action === "empty") return "Empty pad";
  return `${MIDI_ACTION_LABELS[pad.action] || pad.action}: ${midiLayoutPadTargetLabel(pad)}`;
}

function midiLayoutPadTargetLabel(pad) {
  if (!pad) return "No target";
  if (pad.action === "start") return pad.playlistName || playlistNameById(pad.playlistId) || "Active playlist";
  if (pad.action === "blackout") return "Global output";
  if (["prev", "next", "stop"].includes(pad.action)) return "Active playlist";
  return "No target";
}

function playlistNameById(playlistId) {
  return (state.ledfxLibrary.playlists.find((playlist) => playlist.id === playlistId) || {}).name || "";
}

function openMidiLayoutPadEditor(padId) {
  const pad = midiLayoutPad(padId);
  if (!pad || !els.midiLayoutPadEditor) return;
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingPresetBankItem = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingMidiMappingId = null;
  state.editingMidiLayoutPadId = padId;
  hideModalPanels();
  renderMidiLayoutPadEditor(pad);
  els.midiLayoutPadEditor.hidden = false;
  openModal(`Edit MIDI ${midiLayoutControlTypeLabel(pad.controlType)} ${pad.label}`);
}

function closeMidiLayoutPadEditor() {
  state.editingMidiLayoutPadId = null;
  if (els.midiLayoutPadEditor) els.midiLayoutPadEditor.hidden = true;
  hideModal();
  renderMidiLayoutDesigner();
  renderMidiMapper();
}

function renderMidiLayoutPadEditor(pad = null) {
  if (!els.midiLayoutPadEditor) return;
  const current = pad || midiLayoutPad(state.editingMidiLayoutPadId);
  if (!current) {
    els.midiLayoutPadEditor.hidden = true;
    return;
  }
  if (els.midiLayoutPadEditStatus) {
    els.midiLayoutPadEditStatus.textContent = `${current.label} | ${midiLayoutPadTitle(current)} | ${midiMessageLabel(current.message)}`;
  }
  if (els.midiLayoutPadLabelInput) els.midiLayoutPadLabelInput.value = current.label || "";
  if (els.midiLayoutPadTypeInput) els.midiLayoutPadTypeInput.value = midiLayoutControlTypeLabel(current.controlType);
  if (els.saveMidiLayoutPadButton) els.saveMidiLayoutPadButton.textContent = `Save ${midiLayoutControlTypeLabel(current.controlType)}`;
  if (els.clearMidiLayoutPadButton) els.clearMidiLayoutPadButton.textContent = `Clear ${midiLayoutControlTypeLabel(current.controlType)}`;
  if (els.midiLayoutPadActionSelect) els.midiLayoutPadActionSelect.value = current.action || "empty";
  renderMidiLayoutPadPlaylistOptions(current.action, current.playlistId);
  if (els.midiLayoutPadMessageInput) els.midiLayoutPadMessageInput.value = midiMessageLabel(current.message);
  const feedbackSupported = midiLayoutControlSupportsFeedback(current);
  const colorFeedbackSupported = midiLayoutControlSupportsColorFeedback(current);
  setMidiFeedbackFieldsEnabled("midiLayoutPad", feedbackSupported, {
    colorEnabled: colorFeedbackSupported,
    singleFeedback: feedbackSupported && !colorFeedbackSupported,
  });
  if (colorFeedbackSupported) {
    renderMidiColorSelect(els.midiLayoutPadColorOnSelect, midiMappingColor(current, "colorOn"));
    renderMidiColorSelect(els.midiLayoutPadColorOffSelect, midiMappingColor(current, "colorOff"));
  }
  if (feedbackSupported) {
    if (els.midiLayoutPadFeedbackModeSelect) {
      els.midiLayoutPadFeedbackModeSelect.value = validMidiFeedbackMode(current.feedbackMode) || "inherit";
    }
    if (els.midiLayoutPadLedProtocolSelect) {
      els.midiLayoutPadLedProtocolSelect.value = validMidiLedProtocol(current.ledProtocol) || "inherit";
    }
  }
  const canTest = Boolean(current.message && MIDI_MAPPING_ACTIONS.has(current.action));
  if (els.testMidiLayoutPadButton) els.testMidiLayoutPadButton.disabled = !canTest;
}

function setMidiFeedbackFieldsEnabled(scope, enabled, options = {}) {
  const colorEnabled = enabled && options.colorEnabled !== false;
  const singleFeedback = enabled && options.singleFeedback === true;
  const fields = scope === "midiLayoutPad"
    ? {
      colors: [els.midiLayoutPadColorOnSelect, els.midiLayoutPadColorOffSelect],
      settings: [els.midiLayoutPadFeedbackModeSelect, els.midiLayoutPadLedProtocolSelect],
      note: els.midiLayoutPadFeedbackNote,
    }
    : {
      colors: [els.midiEditColorOnSelect, els.midiEditColorOffSelect],
      settings: [els.midiEditFeedbackModeSelect, els.midiEditLedProtocolSelect],
      note: els.midiEditFeedbackNote,
    };
  fields.colors.forEach((select) => {
    if (!select) return;
    select.disabled = !colorEnabled;
    const picker = midiColorPickerFor(select);
    if (picker) {
      picker.hidden = !colorEnabled;
      if (!colorEnabled) closeMidiColorMenu(picker);
    }
    const preview = (picker || select).nextElementSibling;
    if (preview && preview.classList.contains("midi-color-preview")) preview.hidden = !colorEnabled;
    const field = select.closest("label");
    if (field) field.hidden = !colorEnabled;
  });
  fields.settings.forEach((select) => {
    if (!select) return;
    select.disabled = !enabled;
    const field = select.closest("label");
    if (field) field.hidden = !enabled;
  });
  if (fields.note) {
    fields.note.hidden = enabled && !singleFeedback;
    fields.note.textContent = singleFeedback
      ? "This hardware button has a fixed single-color LED. Workshop sends ON/OFF feedback only; color pickers are hidden because the controller does not expose RGB here."
      : "This control does not expose LED feedback, so color and feedback settings are disabled.";
  }
}

function renderMidiLayoutPadPlaylistOptions(action, currentValue = "active") {
  if (!els.midiLayoutPadPlaylistSelect) return;
  els.midiLayoutPadPlaylistSelect.innerHTML = "";
  if (action === "start") {
    if (!state.ledfxLibrary.playlists.length) {
      els.midiLayoutPadPlaylistSelect.append(option("Active playlist", "active"));
    } else {
      state.ledfxLibrary.playlists.forEach((playlist) => {
        els.midiLayoutPadPlaylistSelect.append(option(playlist.name, playlist.id));
      });
      if (currentValue && !state.ledfxLibrary.playlists.some((playlist) => playlist.id === currentValue)) {
        els.midiLayoutPadPlaylistSelect.append(option(`Current missing playlist (${currentValue})`, currentValue));
      }
    }
    els.midiLayoutPadPlaylistSelect.disabled = false;
  } else {
    els.midiLayoutPadPlaylistSelect.append(option("Active playlist", "active"));
    els.midiLayoutPadPlaylistSelect.disabled = true;
  }
  els.midiLayoutPadPlaylistSelect.value = [...els.midiLayoutPadPlaylistSelect.options].some((item) => item.value === currentValue)
    ? currentValue
    : els.midiLayoutPadPlaylistSelect.options[0]?.value || "active";
}

function currentMidiLayoutPadDraft() {
  const current = midiLayoutPad(state.editingMidiLayoutPadId);
  if (!current) return null;
  const action = MIDI_LAYOUT_ACTIONS.has(els.midiLayoutPadActionSelect.value)
    ? els.midiLayoutPadActionSelect.value
    : current.action;
  const selectedPlaylistId = action === "start"
    ? (els.midiLayoutPadPlaylistSelect.value || current.playlistId || "active")
    : "active";
  const playlist = state.ledfxLibrary.playlists.find((item) => item.id === selectedPlaylistId);
  const feedbackSupported = midiLayoutControlSupportsFeedback(current);
  const colorFeedbackSupported = midiLayoutControlSupportsColorFeedback(current);
  const feedbackModeValue = feedbackSupported ? els.midiLayoutPadFeedbackModeSelect.value : "off";
  const ledProtocolValue = feedbackSupported ? els.midiLayoutPadLedProtocolSelect.value : "inherit";
  return {
    ...current,
    label: (els.midiLayoutPadLabelInput?.value || current.label || "").trim().slice(0, 28) || current.label,
    action,
    playlistId: selectedPlaylistId,
    playlistName: action === "start" ? (playlist?.name || current.playlistName || "Active playlist") : "Active playlist",
    mode: action === "start" ? (playlist?.mode || current.mode || null) : null,
    colorOn: colorFeedbackSupported ? clampMidiValue(els.midiLayoutPadColorOnSelect.value) : null,
    colorOff: colorFeedbackSupported ? clampMidiValue(els.midiLayoutPadColorOffSelect.value) : null,
    feedbackMode: feedbackSupported && feedbackModeValue === "inherit" ? null : validMidiFeedbackMode(feedbackModeValue),
    ledProtocol: feedbackSupported && ledProtocolValue === "inherit" ? null : validMidiLedProtocol(ledProtocolValue),
    feedbackType: midiLayoutControlFeedbackType(current),
    colorTable: MIDI_COLOR_TABLE,
  };
}

function saveMidiLayoutPad() {
  const draft = currentMidiLayoutPadDraft();
  if (!draft) return;
  const saved = setMidiLayoutPad(draft);
  if (saved) {
    closeMidiLayoutPadEditor();
    showToast(`${saved.label} saved.`);
  }
}

function learnMidiLayoutPad() {
  const draft = currentMidiLayoutPadDraft();
  if (!draft) return;
  setMidiLayoutPad(draft);
  startMidiLearn({
    action: draft.action,
    playlistId: draft.playlistId,
    playlistName: draft.playlistName,
    mode: draft.mode,
    colorOn: draft.colorOn,
    colorOff: draft.colorOff,
    feedbackMode: draft.feedbackMode,
    ledProtocol: draft.ledProtocol,
    feedbackType: draft.feedbackType,
    layoutPadId: draft.id,
    layoutControlType: draft.controlType,
    supportsFeedback: midiLayoutControlSupportsFeedback(draft),
    padLabel: draft.label,
  });
  renderMidiLayoutPadEditor(draft);
}

function testMidiLayoutPad() {
  const draft = currentMidiLayoutPadDraft();
  const mapping = midiLayoutPadToMapping(draft);
  if (!mapping) {
    showToast("Choose an action before testing this pad.");
    return;
  }
  executeMidiMapping(mapping).catch((error) => showToast(error.message));
}

function clearCurrentMidiLayoutPad() {
  const pad = midiLayoutPad(state.editingMidiLayoutPadId);
  if (!pad) return;
  clearMidiLayoutPad(pad.id);
  closeMidiLayoutPadEditor();
  showToast(`${pad.label} cleared.`);
}

function autoMapMidiLayout() {
  const layout = sanitizeMidiLayout(state.midi.layout);
  const template = midiLayoutTemplate(layout.template);
  const controls = layout.pads.map((pad) => ({
    ...pad,
    action: "empty",
    playlistId: "active",
    playlistName: "",
    mode: null,
    colorOn: null,
    colorOff: null,
    feedbackMode: null,
    ledProtocol: null,
  }));
  const padControls = controls.filter((pad) => pad.controlType === "pad");
  const buttonControls = controls.filter((pad) => pad.controlType === "button" && pad.role !== "shift");
  const updateControl = (controlId, patch) => {
    const index = controls.findIndex((item) => item.id === controlId);
    if (index >= 0) controls[index] = {...controls[index], ...patch};
  };
  const transportActions = ["blackout", "prev", "next", "stop"];
  const transportControls = buttonControls.length >= transportActions.length
    ? buttonControls.slice(-transportActions.length)
    : padControls.slice(Math.max(0, padControls.length - transportActions.length));
  const transportIds = new Set(transportControls.map((control) => control.id));
  const playlistControls = padControls.filter((control) => !transportIds.has(control.id));
  const playlistSlots = playlistControls.length;
  state.ledfxLibrary.playlists.slice(0, playlistSlots).forEach((playlist, index) => {
    const target = playlistControls[index];
    updateControl(target.id, {
      action: "start",
      playlistId: playlist.id,
      playlistName: playlist.name,
      mode: playlist.mode,
      ...midiLayoutFeedbackPatch(target, template, MIDI_LAYOUT_COLOR_SEQUENCE[index % MIDI_LAYOUT_COLOR_SEQUENCE.length], 0, "latch"),
    });
  });
  transportActions.forEach((action, offset) => {
    const target = transportControls[offset];
    if (!target) return;
    updateControl(target.id, {
      action,
      playlistId: "active",
      playlistName: "Active playlist",
      mode: null,
      ...midiLayoutFeedbackPatch(
        target,
        template,
        action === "blackout" ? 5 : MIDI_LAYOUT_COLOR_SEQUENCE[(playlistSlots + offset) % MIDI_LAYOUT_COLOR_SEQUENCE.length],
        0,
        action === "blackout" ? "latch" : "momentary",
      ),
    });
  });
  state.midi.layout = sanitizeMidiLayout({
    template: template.id,
    rows: layout.rows,
    cols: layout.cols,
    surfaceRows: layout.surfaceRows,
    surfaceCols: layout.surfaceCols,
    buttons: layout.buttons,
    knobs: layout.knobs,
    faders: layout.faders,
    pads: controls,
  });
  saveMidiLayout();
  syncMidiLayoutMappings();
  renderMidiLayoutDesigner();
  renderMidiMapper();
  showToast(`Mapped ${Math.min(state.ledfxLibrary.playlists.length, playlistSlots)} playlists plus transport pads.`);
}

function clearMidiLayout() {
  if (!window.confirm("Clear the visual MIDI layout and its linked mappings?")) return;
  const layout = sanitizeMidiLayout(state.midi.layout);
  clearMidiLayoutSelection({render: false});
  state.midi.mappings
    .filter((mapping) => mapping.layoutPadId)
    .forEach((mapping) => sendMidiFeedback(mapping, false));
  state.midi.mappings = state.midi.mappings.filter((mapping) => !mapping.layoutPadId);
  state.midi.layout = sanitizeMidiLayout({
    template: layout.template,
    rows: layout.rows,
    cols: layout.cols,
    surfaceRows: layout.surfaceRows,
    surfaceCols: layout.surfaceCols,
    buttons: layout.buttons,
    knobs: layout.knobs,
    faders: layout.faders,
    pads: [],
  });
  saveMidiLayout();
  saveMidiMappings();
  renderMidiLayoutDesigner();
  renderMidiMapper();
  refreshMidiFeedback();
  showToast("MIDI layout cleared.");
}

function refreshMidiMappingsFromStorage() {
  state.midi.controller = loadMidiControllerSettings();
  state.midi.mappings = loadMidiMappings();
  state.midi.layout = loadMidiLayout();
  state.midi.profiles = loadMidiProfiles();
  const selectedProfileId = localStorage.getItem(MIDI_SELECTED_PROFILE_KEY) || "";
  state.midi.selectedProfileId = state.midi.profiles.some((profile) => profile.id === selectedProfileId)
    ? selectedProfileId
    : "";
  state.midi.learn = null;
  state.midi.layoutPositionMode = false;
  state.midi.layoutDragId = "";
  clearMidiLayoutSelection({render: false});
  state.editingMidiMappingId = null;
  state.editingMidiLayoutPadId = null;
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
  if (els.midiLayoutPadEditor) els.midiLayoutPadEditor.hidden = true;
  state.midi.mappings.forEach(syncMidiLayoutPadFromMapping);
  renderMidiMapper();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
  showToast(`Refreshed ${state.midi.mappings.length} MIDI mapping${state.midi.mappings.length === 1 ? "" : "s"}.`);
}

function resetAllMidiMappings() {
  if (!window.confirm("Reset all MIDI mappings, controller feedback settings and visual layout to factory defaults?")) return;
  const hardwareReset = resetMidiHardwareFeedback();
  state.midi.controller = {...DEFAULT_MIDI_CONTROLLER};
  state.midi.mappings = [];
  state.midi.layout = sanitizeMidiLayout({template: MIDI_LAYOUT_DEFAULT_TEMPLATE, pads: []});
  state.midi.learn = null;
  state.midi.lastTrigger = {};
  state.midi.selectedProfileId = "";
  clearMidiLayoutSelection({render: false});
  state.editingMidiMappingId = null;
  state.editingMidiLayoutPadId = null;
  localStorage.removeItem(MIDI_SELECTED_PROFILE_KEY);
  saveMidiControllerSettings();
  saveMidiMappings();
  saveMidiLayout();
  if (els.midiProfileNameInput) els.midiProfileNameInput.value = "";
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
  if (els.midiLayoutPadEditor) els.midiLayoutPadEditor.hidden = true;
  renderMidiMapper();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
  showToast(hardwareReset
    ? "MIDI mappings reset and controller LEDs cleared."
    : "MIDI controller mappings reset to factory defaults.");
}

function resetMidiHardwareFeedback() {
  const output = selectedMidiOutput();
  if (!output) {
    state.midi.mappings.forEach((mapping) => sendMidiFeedback(mapping, false));
    return false;
  }
  const template = midiLayoutTemplate(state.midi.layout?.template);
  const shouldResetApc = template.id === "akai_apc_mini_mk2"
    || state.midi.controller.ledProtocol === "akai_apc_mini_mk2";
  if (shouldResetApc) {
    APC_MINI_MK2_FULL_RESET_NOTES.forEach((note) => {
      output.send([0x90, clampMidiValue(note), 0]);
      output.send([0x96, clampMidiValue(note), 0]);
    });
    return true;
  }
  state.midi.mappings.forEach((mapping) => sendMidiFeedback(mapping, false));
  return true;
}

function loadMidiProfiles() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MIDI_PROFILES_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeMidiProfile).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function sanitizeMidiProfile(profile) {
  if (!profile || typeof profile !== "object") return null;
  const name = String(profile.name || "").trim();
  if (!name) return null;
  const id = String(profile.id || snakeCase(name) || `profile-${Date.now()}`);
  const controller = sanitizeMidiController(profile.controller || {});
  const mappings = Array.isArray(profile.mappings)
    ? profile.mappings.map(sanitizeMidiMapping).filter(Boolean)
    : [];
  const layout = profile.layout ? sanitizeMidiLayout(profile.layout) : null;
  return {id, name, controller, mappings, layout};
}

function sanitizeMidiController(controller) {
  return {
    ...DEFAULT_MIDI_CONTROLLER,
    colorOn: controller.colorOn === undefined || controller.colorOn === null
      ? DEFAULT_MIDI_CONTROLLER.colorOn
      : normalizeMidiColorValue(controller.colorOn, controller.colorTable !== MIDI_COLOR_TABLE),
    colorOff: controller.colorOff === undefined || controller.colorOff === null
      ? DEFAULT_MIDI_CONTROLLER.colorOff
      : normalizeMidiColorValue(controller.colorOff, controller.colorTable !== MIDI_COLOR_TABLE),
    feedbackMode: validMidiFeedbackMode(controller.feedbackMode) || DEFAULT_MIDI_CONTROLLER.feedbackMode,
    ledProtocol: validMidiLedProtocol(controller.ledProtocol) || DEFAULT_MIDI_CONTROLLER.ledProtocol,
    colorTable: MIDI_COLOR_TABLE,
    restoreBrightness: Math.max(0.01, Math.min(1, Number(controller.restoreBrightness) || DEFAULT_MIDI_CONTROLLER.restoreBrightness)),
  };
}

function saveMidiProfiles() {
  localStorage.setItem(MIDI_PROFILES_KEY, JSON.stringify(state.midi.profiles));
}

function renderMidiMapper() {
  if (!els.midiMapperView) return;
  renderMidiInputs();
  renderMidiOutputs();
  renderMidiControllerSettings();
  renderMidiProfiles();
  renderMidiPlaylistMapList();
  renderMidiMappingList();
  if (els.midiLayoutView && !els.midiLayoutView.hidden) renderMidiLayoutDesigner();
}

async function connectMidi() {
  if (!navigator.requestMIDIAccess) {
    els.midiStatus.textContent = "Web MIDI is not available in this browser.";
    if (els.midiLayoutStatus) els.midiLayoutStatus.textContent = "Web MIDI is not available in this browser.";
    showToast("Web MIDI is not available in this browser.");
    return;
  }
  const buttons = [els.midiConnectButton, els.midiLayoutConnectButton].filter(Boolean);
  buttons.forEach((button) => {
    button.disabled = true;
    button.textContent = "Connecting...";
  });
  try {
    state.midi.access = await navigator.requestMIDIAccess({sysex: false});
    state.midi.access.onstatechange = refreshMidiInputs;
    refreshMidiInputs();
    showToast("MIDI connected.");
  } catch (error) {
    els.midiStatus.textContent = `MIDI unavailable: ${error.message}`;
    if (els.midiLayoutStatus) els.midiLayoutStatus.textContent = `MIDI unavailable: ${error.message}`;
    showToast(error.message);
  } finally {
    buttons.forEach((button) => {
      button.disabled = false;
      button.textContent = "Connect MIDI";
    });
  }
}

function refreshMidiInputs() {
  const access = state.midi.access;
  state.midi.inputs = access ? [...access.inputs.values()] : [];
  state.midi.outputs = access ? [...access.outputs.values()] : [];
  if (!state.midi.inputs.some((input) => input.id === state.midi.selectedInputId)) {
    state.midi.selectedInputId = state.midi.inputs[0] ? state.midi.inputs[0].id : "";
  }
  if (!state.midi.outputs.some((output) => output.id === state.midi.selectedOutputId)) {
    state.midi.selectedOutputId = state.midi.outputs[0] ? state.midi.outputs[0].id : "";
  }
  selectMidiInput(state.midi.selectedInputId);
  selectMidiOutput(state.midi.selectedOutputId);
  renderMidiMapper();
  refreshMidiFeedback();
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
      els.midiInputSelect.append(option(midiPortOptionLabel(input, "input"), input.id));
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

function renderMidiOutputs() {
  if (!els.midiOutputSelect) return;
  const current = state.midi.selectedOutputId || els.midiOutputSelect.value;
  els.midiOutputSelect.innerHTML = "";
  if (!state.midi.outputs.length) {
    els.midiOutputSelect.append(option("No MIDI output connected", ""));
    els.midiOutputSelect.disabled = true;
    return;
  }
  state.midi.outputs.forEach((output) => {
    els.midiOutputSelect.append(option(midiPortOptionLabel(output, "output"), output.id));
  });
  els.midiOutputSelect.disabled = false;
  els.midiOutputSelect.value = state.midi.outputs.some((output) => output.id === current)
    ? current
    : state.midi.outputs[0].id;
}

function selectMidiInput(inputId) {
  state.midi.selectedInputId = inputId || "";
  localStorage.setItem("lsf.midi_input", state.midi.selectedInputId);
  state.midi.inputs.forEach((input) => {
    input.onmidimessage = input.id === state.midi.selectedInputId ? handleMidiMessage : null;
  });
}

function selectMidiOutput(outputId) {
  state.midi.selectedOutputId = outputId || "";
  localStorage.setItem("lsf.midi_output", state.midi.selectedOutputId);
}

function renderMidiControllerSettings() {
  renderMidiColorSelect(els.midiColorOnSelect, state.midi.controller.colorOn);
  renderMidiColorSelect(els.midiColorOffSelect, state.midi.controller.colorOff);
  if (els.midiFeedbackModeSelect) {
    els.midiFeedbackModeSelect.value = state.midi.controller.feedbackMode;
  }
  if (els.midiLedProtocolSelect) {
    els.midiLedProtocolSelect.value = state.midi.controller.ledProtocol || DEFAULT_MIDI_CONTROLLER.ledProtocol;
  }
  renderBlackoutControls();
}

function renderMidiProfiles() {
  if (!els.midiProfileSelect) return;
  const profiles = state.midi.profiles || [];
  const current = state.midi.selectedProfileId || els.midiProfileSelect.value;
  els.midiProfileSelect.innerHTML = "";
  els.midiProfileSelect.append(option("No saved profile", ""));
  profiles.forEach((profile) => {
    els.midiProfileSelect.append(option(profile.name, profile.id));
  });
  els.midiProfileSelect.value = profiles.some((profile) => profile.id === current) ? current : "";
  state.midi.selectedProfileId = els.midiProfileSelect.value;
  if (els.midiProfileNameInput && !els.midiProfileNameInput.value.trim()) {
    const profile = profiles.find((item) => item.id === state.midi.selectedProfileId);
    els.midiProfileNameInput.value = profile ? profile.name : "";
  }
  if (els.midiLoadProfileButton) els.midiLoadProfileButton.disabled = !state.midi.selectedProfileId;
  if (els.midiDeleteProfileButton) els.midiDeleteProfileButton.disabled = !state.midi.selectedProfileId;
}

function saveCurrentMidiProfile() {
  const name = (els.midiProfileNameInput && els.midiProfileNameInput.value.trim())
    || (state.midi.selectedProfileId && (state.midi.profiles.find((profile) => profile.id === state.midi.selectedProfileId) || {}).name)
    || "Workshop MIDI Profile";
  const existingId = state.midi.selectedProfileId;
  const id = existingId || uniqueMidiProfileId(name);
  const profile = {
    id,
    name,
    controller: sanitizeMidiController(state.midi.controller),
    mappings: state.midi.mappings.map((mapping) => ({...mapping})),
    layout: sanitizeMidiLayout(state.midi.layout),
  };
  state.midi.profiles = state.midi.profiles.filter((item) => item.id !== id);
  state.midi.profiles.push(profile);
  state.midi.selectedProfileId = id;
  localStorage.setItem(MIDI_SELECTED_PROFILE_KEY, id);
  saveMidiProfiles();
  renderMidiProfiles();
  showToast(`Saved MIDI profile "${name}".`);
}

function uniqueMidiProfileId(name) {
  const base = snakeCase(name) || "midi_profile";
  const used = new Set((state.midi.profiles || []).map((profile) => profile.id));
  if (!used.has(base)) return base;
  let index = 2;
  while (used.has(`${base}_${index}`)) index += 1;
  return `${base}_${index}`;
}

function loadSelectedMidiProfile() {
  const profile = state.midi.profiles.find((item) => item.id === state.midi.selectedProfileId);
  if (!profile) return;
  state.midi.controller = sanitizeMidiController(profile.controller);
  state.midi.mappings = (profile.mappings || []).map(sanitizeMidiMapping).filter(Boolean);
  if (profile.layout) {
    state.midi.layout = sanitizeMidiLayout(profile.layout);
    saveMidiLayout();
  }
  saveMidiControllerSettings();
  saveMidiMappings();
  renderMidiMapper();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
  showToast(`Loaded MIDI profile "${profile.name}".`);
}

function deleteSelectedMidiProfile() {
  const profile = state.midi.profiles.find((item) => item.id === state.midi.selectedProfileId);
  if (!profile) return;
  if (!window.confirm(`Delete MIDI profile "${profile.name}"?`)) return;
  state.midi.profiles = state.midi.profiles.filter((item) => item.id !== profile.id);
  state.midi.selectedProfileId = "";
  localStorage.removeItem(MIDI_SELECTED_PROFILE_KEY);
  if (els.midiProfileNameInput) els.midiProfileNameInput.value = "";
  saveMidiProfiles();
  renderMidiProfiles();
  showToast("MIDI profile deleted.");
}

function renderMidiColorSelect(select, currentValue) {
  if (!select) return;
  const current = String(currentValue);
  select.classList.add("midi-color-select");
  select.hidden = true;
  if (select.options.length !== MIDI_COLOR_OPTIONS.length) {
    select.innerHTML = "";
    MIDI_COLOR_OPTIONS.forEach((item) => {
      const node = option(midiColorOptionLabel(item), String(item.value));
      node.dataset.hex = item.hex;
      node.title = `${item.label} / velocity ${item.value} / ${item.hex}`;
      node.style.backgroundColor = item.hex;
      node.style.color = readableTextColor(item.hex);
      select.append(node);
    });
  }
  select.value = [...select.options].some((item) => item.value === current)
    ? current
    : String(DEFAULT_MIDI_CONTROLLER.colorOff);
  ensureMidiColorPicker(select);
  updateMidiColorPicker(select);
  updateMidiColorPreview(select);
}

function ensureMidiColorPicker(select) {
  let picker = select.nextElementSibling;
  if (picker && picker.classList.contains("midi-color-picker")) return picker;
  picker = document.createElement("div");
  picker.className = "midi-color-picker";
  picker.dataset.selectId = select.id || "";

  const input = document.createElement("input");
  input.className = "midi-color-search";
  input.type = "search";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.placeholder = "Search color, velocity or hex";
  input.setAttribute("aria-label", "Search MIDI color");

  const toggle = document.createElement("button");
  toggle.className = "midi-color-toggle";
  toggle.type = "button";
  toggle.textContent = "Show";

  const menu = document.createElement("div");
  menu.className = "midi-color-menu";
  menu.hidden = true;

  input.addEventListener("focus", () => openMidiColorMenu(select, input.value));
  input.addEventListener("input", () => openMidiColorMenu(select, input.value));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMidiColorMenu(picker);
      updateMidiColorPicker(select);
      input.blur();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const first = menu.querySelector(".midi-color-option");
      if (first) first.click();
    }
  });
  toggle.addEventListener("click", () => {
    if (menu.hidden) {
      input.focus();
      openMidiColorMenu(select, "");
    } else {
      closeMidiColorMenu(picker);
    }
  });
  picker.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!picker.contains(document.activeElement)) {
        closeMidiColorMenu(picker);
        updateMidiColorPicker(select);
      }
    }, 80);
  });

  picker.append(input, toggle, menu);
  select.insertAdjacentElement("afterend", picker);
  return picker;
}

function midiColorPickerFor(select) {
  const next = select && select.nextElementSibling;
  return next && next.classList.contains("midi-color-picker") ? next : null;
}

function midiColorSearchValue(item) {
  return `${item.value} ${String(item.value).padStart(3, "0")} ${item.label} ${item.hex}`.toLowerCase();
}

function openMidiColorMenu(select, query = "") {
  const picker = ensureMidiColorPicker(select);
  const menu = picker.querySelector(".midi-color-menu");
  const input = picker.querySelector(".midi-color-search");
  const cleanQuery = String(query || "").trim().toLowerCase();
  const matches = cleanQuery
    ? MIDI_COLOR_OPTIONS.filter((item) => midiColorSearchValue(item).includes(cleanQuery))
    : MIDI_COLOR_OPTIONS;
  menu.innerHTML = "";
  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "midi-color-empty";
    empty.textContent = "No matching colors";
    menu.append(empty);
  } else {
    matches.forEach((item) => menu.append(midiColorOptionButton(select, item)));
  }
  menu.hidden = false;
  picker.classList.add("is-open");
  input.setAttribute("aria-expanded", "true");
}

function closeMidiColorMenu(picker) {
  const menu = picker && picker.querySelector(".midi-color-menu");
  const input = picker && picker.querySelector(".midi-color-search");
  if (menu) menu.hidden = true;
  if (input) input.setAttribute("aria-expanded", "false");
  if (picker) picker.classList.remove("is-open");
}

function closeAllMidiColorMenus(except = null) {
  document.querySelectorAll(".midi-color-picker").forEach((picker) => {
    if (picker !== except) closeMidiColorMenu(picker);
  });
}

function midiColorOptionButton(select, item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "midi-color-option";
  if (String(select.value) === String(item.value)) button.classList.add("is-selected");
  const swatch = document.createElement("span");
  swatch.className = "midi-color-swatch";
  swatch.style.background = item.hex;
  swatch.style.borderColor = readableTextColor(item.hex) === "#071014"
    ? "rgba(0, 0, 0, 0.45)"
    : "rgba(255, 255, 255, 0.62)";
  const label = document.createElement("span");
  label.className = "midi-color-option-name";
  label.textContent = item.label;
  const meta = document.createElement("span");
  meta.className = "midi-color-option-meta";
  meta.textContent = `${String(item.value).padStart(3, "0")} · ${item.hex}`;
  button.append(swatch, label, meta);
  button.addEventListener("click", () => {
    selectMidiColor(select, item.value);
    closeMidiColorMenu(midiColorPickerFor(select));
  });
  return button;
}

function selectMidiColor(select, value) {
  if (!select) return;
  const nextValue = String(clampMidiValue(value));
  if (select.value !== nextValue) {
    select.value = nextValue;
    select.dispatchEvent(new Event("change", {bubbles: true}));
  } else {
    updateMidiColorPreview(select);
  }
  updateMidiColorPicker(select, true);
}

function updateMidiColorPicker(select, force = false) {
  const picker = midiColorPickerFor(select);
  if (!picker) return;
  const item = midiColorInfo(select.value);
  const input = picker.querySelector(".midi-color-search");
  if (input && (force || !picker.classList.contains("is-open"))) {
    input.value = midiColorOptionLabel(item);
  }
  picker.style.setProperty("--midi-color-accent", item.hex);
}

function midiColorInfo(value) {
  return MIDI_COLOR_BY_VALUE.get(clampMidiValue(value)) || MIDI_COLOR_BY_VALUE.get(0);
}

function midiColorOptionLabel(item) {
  return `${String(item.value).padStart(3, "0")} | ${item.label} | ${item.hex}`;
}

function readableTextColor(hex) {
  const clean = String(hex || "").replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (![r, g, b].every(Number.isFinite)) return "#eef3f5";
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#071014" : "#eef3f5";
}

function updateMidiColorPreview(select) {
  if (!select) return;
  const item = midiColorInfo(select.value);
  const anchor = midiColorPickerFor(select) || select;
  let preview = anchor.nextElementSibling;
  if (!preview || !preview.classList.contains("midi-color-preview")) {
    preview = document.createElement("span");
    preview.className = "midi-color-preview";
    anchor.insertAdjacentElement("afterend", preview);
  }
  preview.innerHTML = "";
  const swatch = document.createElement("span");
  swatch.className = "midi-color-swatch";
  swatch.style.background = item.hex;
  swatch.style.borderColor = readableTextColor(item.hex) === "#071014"
    ? "rgba(0, 0, 0, 0.45)"
    : "rgba(255, 255, 255, 0.62)";
  const text = document.createElement("span");
  text.textContent = `${item.label} · velocity ${item.value} · ${item.hex}`;
  preview.append(swatch, text);
  select.style.setProperty("--midi-color-accent", item.hex);
}

function ledfxGlobalBrightness() {
  const value = state.app && Number.isFinite(Number(state.app.global_brightness))
    ? Number(state.app.global_brightness)
    : 1;
  return Math.max(0, Math.min(1, value));
}

function renderBlackoutControls() {
  const percent = Math.round(ledfxGlobalBrightness() * 100);
  if (els.midiBlackoutButton) {
    els.midiBlackoutButton.textContent = percent <= 0 ? "Restore Output" : "Blackout";
  }
  if (els.liveBlackoutButton) {
    els.liveBlackoutButton.textContent = percent <= 0 ? "Restore Output" : "Blackout";
  }
}

function clampMidiValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(127, Math.round(number)));
}

function normalizeMidiColorValue(value, useLegacyMap = false) {
  const clean = clampMidiValue(value);
  return useLegacyMap && LEGACY_MIDI_COLOR_MAP.has(clean)
    ? LEGACY_MIDI_COLOR_MAP.get(clean)
    : clean;
}

function midiMappingColor(mapping, key) {
  const ownValue = mapping && mapping[key];
  if (ownValue !== undefined && ownValue !== null) return clampMidiValue(ownValue);
  const actionDefault = midiActionDefaultColor(mapping && mapping.action, key);
  if (actionDefault !== null) return actionDefault;
  return clampMidiValue(state.midi.controller[key]);
}

function midiMappingSupportsFeedback(mapping) {
  if (!mapping) return true;
  const linkedControl = mapping.layoutPadId ? midiLayoutPad(mapping.layoutPadId) : null;
  if (linkedControl) return midiLayoutControlSupportsFeedback(linkedControl);
  if (mapping.supportsFeedback === false || mapping.layoutControlType === "fader") return false;
  if (validMidiFeedbackType(mapping.feedbackType) === "none") return false;
  return true;
}

function midiMappingSupportsColorFeedback(mapping) {
  return midiMappingSupportsFeedback(mapping) && midiMappingFeedbackType(mapping) === "rgb";
}

function midiMappingFeedbackType(mapping) {
  if (!midiMappingSupportsFeedback(mapping)) return "none";
  const linkedControl = mapping && mapping.layoutPadId ? midiLayoutPad(mapping.layoutPadId) : null;
  if (linkedControl) return midiLayoutControlFeedbackType(linkedControl);
  return validMidiFeedbackType(mapping && mapping.feedbackType) || "rgb";
}

function midiMappingFeedbackMode(mapping) {
  if (!midiMappingSupportsFeedback(mapping)) return "off";
  return validMidiFeedbackMode(mapping && mapping.feedbackMode)
    || MIDI_ACTION_FEEDBACK_DEFAULTS[mapping && mapping.action]?.feedbackMode
    || state.midi.controller.feedbackMode
    || DEFAULT_MIDI_CONTROLLER.feedbackMode;
}

function midiMappingLedProtocol(mapping) {
  return validMidiLedProtocol(mapping && mapping.ledProtocol) || state.midi.controller.ledProtocol || DEFAULT_MIDI_CONTROLLER.ledProtocol;
}

function selectedMidiOutput() {
  return state.midi.outputs.find((output) => output.id === state.midi.selectedOutputId) || null;
}

function sendMidiFeedback(mapping, isOn) {
  if (!mapping || !mapping.message) return;
  const feedbackMode = midiMappingFeedbackMode(mapping);
  if (feedbackMode === "off") return;
  const output = selectedMidiOutput();
  if (!output || !["note", "cc"].includes(mapping.message.type)) return;
  if (midiMappingFeedbackType(mapping) === "single") {
    const baseChannel = Math.max(1, Math.min(16, Number(mapping.message.channel) || 1));
    const command = mapping.message.type === "cc" ? 0xb0 : 0x90;
    output.send([
      command + baseChannel - 1,
      clampMidiValue(mapping.message.number),
      isOn ? 1 : 0,
    ]);
    return;
  }
  const channel = midiFeedbackChannel(mapping, isOn);
  const command = mapping.message.type === "cc" ? 0xb0 : 0x90;
  const status = command + channel - 1;
  const value = isOn ? midiMappingColor(mapping, "colorOn") : midiMappingColor(mapping, "colorOff");
  output.send([status, clampMidiValue(mapping.message.number), clampMidiValue(value)]);
}

function midiFeedbackChannel(mapping, isOn = true) {
  const baseChannel = Math.max(1, Math.min(16, Number(mapping.message.channel) || 1));
  const protocol = midiMappingLedProtocol(mapping);
  const note = Number(mapping.message.number);
  if (
    protocol === "akai_apc_mini_mk2" &&
    mapping.message.type === "note" &&
    midiMappingFeedbackType(mapping) === "rgb" &&
    Number.isFinite(note)
  ) {
    return isOn ? 7 : 1;
  }
  return baseChannel;
}

function flashMidiFeedback(mapping) {
  if (midiMappingFeedbackMode(mapping) !== "momentary") return;
  sendMidiFeedback(mapping, true);
  window.setTimeout(() => sendMidiFeedback(mapping, false), 160);
}

function refreshMidiFeedback() {
  const activeId = activePlaylistId();
  const blackoutActive = ledfxGlobalBrightness() <= 0.01;
  state.midi.mappings.forEach((mapping) => {
    if (midiMappingFeedbackMode(mapping) !== "latch") return;
    const active =
      (mapping.action === "start" && mapping.playlistId === activeId) ||
      (mapping.action === "blackout" && blackoutActive);
    sendMidiFeedback(mapping, active);
  });
}

async function setLedFxGlobalBrightness(value, toastOnSuccess = false) {
  const clean = Math.max(0, Math.min(1, Number(value) || 0));
  const requestId = ++state.midi.globalBrightnessRequestId;
  if (clean > 0.01) {
    state.midi.controller.restoreBrightness = clean;
    saveMidiControllerSettings();
  }
  const data = await api("/api/ledfx/global-brightness", {
    method: "POST",
    body: JSON.stringify({global_brightness: clean}),
  });
  if (requestId !== state.midi.globalBrightnessRequestId) return;
  const returnedValue = Number(data.global_brightness);
  const actual = Number.isFinite(returnedValue)
    ? Math.max(0, Math.min(1, returnedValue))
    : clean;
  if (state.app) state.app.global_brightness = actual;
  renderBlackoutControls();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
  const requested = Number(data.requested_global_brightness ?? clean);
  if (Math.abs(actual - requested) > 0.02) {
    showToast(`LedFx reported brightness ${Math.round(actual * 100)}% after update.`);
  } else if (toastOnSuccess) {
    showToast(`LedFx brightness ${Math.round(actual * 100)}%.`);
  }
}

async function toggleLedFxBlackout() {
  const current = ledfxGlobalBrightness();
  if (current > 0.01) {
    state.midi.controller.restoreBrightness = current;
    saveMidiControllerSettings();
    await setLedFxGlobalBrightness(0, true);
    return;
  }
  await setLedFxGlobalBrightness(state.midi.controller.restoreBrightness || 1, true);
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
    if (midiMappingSupportsColorFeedback(mapping)) {
      meta.append(midiMappingColorPreview(mapping));
    } else if (midiMappingFeedbackType(mapping) === "single") {
      meta.append(pill("Single LED on/off"));
    } else {
      meta.append(pill("No LED feedback"));
    }
    main.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "midi-row-actions";
    actions.append(
      actionButton("Test", () => executeMidiMapping(mapping)),
      actionButton("Edit", () => openMidiMappingEditor(mapping.id)),
      actionButton("Delete", () => deleteMidiMapping(mapping.id), false, "danger"),
    );
    row.append(main, actions);
    els.midiMappingList.append(row);
  });
}

function midiMappingColorPreview(mapping) {
  const wrap = document.createElement("span");
  wrap.className = "midi-led-preview-pair";
  wrap.append(
    midiColorChip("On", midiMappingColor(mapping, "colorOn")),
    midiColorChip("Off", midiMappingColor(mapping, "colorOff")),
  );
  return wrap;
}

function midiColorChip(label, value) {
  const item = midiColorInfo(value);
  const chip = document.createElement("span");
  chip.className = "midi-led-chip";
  const swatch = document.createElement("span");
  swatch.className = "midi-color-swatch midi-color-swatch-tiny";
  swatch.style.background = item.hex;
  swatch.style.borderColor = readableTextColor(item.hex) === "#071014"
    ? "rgba(0, 0, 0, 0.45)"
    : "rgba(255, 255, 255, 0.62)";
  const text = document.createElement("span");
  text.textContent = `${label}: ${item.label} ${item.value}`;
  chip.append(swatch, text);
  return chip;
}

function openMidiMappingEditor(mappingId) {
  const mapping = state.midi.mappings.find((item) => item.id === mappingId);
  if (!mapping || !els.midiMappingEditor) return;
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingPresetBankItem = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingMidiLayoutPadId = null;
  state.editingMidiMappingId = mappingId;
  hideModalPanels();
  renderMidiMappingEditor(mapping);
  els.midiMappingEditor.hidden = false;
  openModal("Edit MIDI Mapping");
}

function closeMidiMappingEditor() {
  state.editingMidiMappingId = null;
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
  hideModal();
  renderMidiMapper();
}

function renderMidiMappingEditor(mapping = null) {
  if (!els.midiMappingEditor) return;
  const current = mapping || state.midi.mappings.find((item) => item.id === state.editingMidiMappingId);
  if (!current) {
    els.midiMappingEditor.hidden = true;
    return;
  }
  if (els.midiMappingEditStatus) {
    els.midiMappingEditStatus.textContent = `${midiMappingTitle(current)} mapped to ${midiMessageLabel(current.message)}`;
  }
  if (els.midiEditActionSelect) els.midiEditActionSelect.value = current.action;
  renderMidiEditPlaylistOptions(current.action, current.playlistId);
  if (els.midiEditMessageInput) els.midiEditMessageInput.value = midiMessageLabel(current.message);
  const feedbackSupported = midiMappingSupportsFeedback(current);
  const colorFeedbackSupported = midiMappingSupportsColorFeedback(current);
  setMidiFeedbackFieldsEnabled("midiEdit", feedbackSupported, {
    colorEnabled: colorFeedbackSupported,
    singleFeedback: feedbackSupported && !colorFeedbackSupported,
  });
  if (colorFeedbackSupported) {
    renderMidiColorSelect(els.midiEditColorOnSelect, midiMappingColor(current, "colorOn"));
    renderMidiColorSelect(els.midiEditColorOffSelect, midiMappingColor(current, "colorOff"));
  }
  if (feedbackSupported) {
    if (els.midiEditFeedbackModeSelect) {
      els.midiEditFeedbackModeSelect.value = validMidiFeedbackMode(current.feedbackMode) || "inherit";
    }
    if (els.midiEditLedProtocolSelect) {
      els.midiEditLedProtocolSelect.value = validMidiLedProtocol(current.ledProtocol) || "inherit";
    }
  }
}

function renderMidiEditPlaylistOptions(action, currentValue = "active") {
  if (!els.midiEditPlaylistSelect) return;
  els.midiEditPlaylistSelect.innerHTML = "";
  if (action === "start") {
    if (!state.ledfxLibrary.playlists.length) {
      els.midiEditPlaylistSelect.append(option("Active playlist", "active"));
    } else {
      state.ledfxLibrary.playlists.forEach((playlist) => {
        els.midiEditPlaylistSelect.append(option(playlist.name, playlist.id));
      });
      if (currentValue && !state.ledfxLibrary.playlists.some((playlist) => playlist.id === currentValue)) {
        els.midiEditPlaylistSelect.append(option(`Current missing playlist (${currentValue})`, currentValue));
      }
    }
    els.midiEditPlaylistSelect.disabled = false;
  } else {
    els.midiEditPlaylistSelect.append(option("Active playlist", "active"));
    els.midiEditPlaylistSelect.disabled = true;
  }
  els.midiEditPlaylistSelect.value = [...els.midiEditPlaylistSelect.options].some((item) => item.value === currentValue)
    ? currentValue
    : els.midiEditPlaylistSelect.options[0]?.value || "active";
}

function currentMidiMappingDraft() {
  const current = state.midi.mappings.find((item) => item.id === state.editingMidiMappingId);
  if (!current) return null;
  const action = MIDI_MAPPING_ACTIONS.has(els.midiEditActionSelect.value)
    ? els.midiEditActionSelect.value
    : current.action;
  const selectedPlaylistId = action === "start"
    ? (els.midiEditPlaylistSelect.value || current.playlistId || "active")
    : "active";
  const playlist = state.ledfxLibrary.playlists.find((item) => item.id === selectedPlaylistId);
  const feedbackSupported = midiMappingSupportsFeedback(current);
  const colorFeedbackSupported = midiMappingSupportsColorFeedback(current);
  const feedbackModeValue = feedbackSupported ? els.midiEditFeedbackModeSelect.value : "off";
  const ledProtocolValue = feedbackSupported ? els.midiEditLedProtocolSelect.value : "inherit";
  return {
    ...current,
    action,
    playlistId: selectedPlaylistId,
    playlistName: action === "start" ? (playlist?.name || current.playlistName || "Active playlist") : "Active playlist",
    mode: action === "start" ? (playlist?.mode || current.mode || null) : null,
    colorOn: colorFeedbackSupported ? clampMidiValue(els.midiEditColorOnSelect.value) : null,
    colorOff: colorFeedbackSupported ? clampMidiValue(els.midiEditColorOffSelect.value) : null,
    feedbackMode: feedbackSupported && feedbackModeValue === "inherit" ? null : validMidiFeedbackMode(feedbackModeValue),
    ledProtocol: feedbackSupported && ledProtocolValue === "inherit" ? null : validMidiLedProtocol(ledProtocolValue),
    colorTable: MIDI_COLOR_TABLE,
    layoutPadId: current.layoutPadId || null,
    layoutControlType: current.layoutControlType || null,
    supportsFeedback: feedbackSupported,
    feedbackType: midiMappingFeedbackType(current),
    id: midiMappingId(action, selectedPlaylistId, current.message),
  };
}

function saveMidiMappingEdit() {
  const currentIndex = state.midi.mappings.findIndex((item) => item.id === state.editingMidiMappingId);
  let draft = currentMidiMappingDraft();
  draft = attachMidiMappingToLayoutControl(draft);
  if (currentIndex < 0 || !draft) return;
  const previous = state.midi.mappings[currentIndex];
  sendMidiFeedback(previous, false);
  const replacedMappings = state.midi.mappings.filter((item, index) => (
    index !== currentIndex &&
    (item.id === draft.id || (draft.layoutPadId && item.layoutPadId === draft.layoutPadId))
  ));
  replacedMappings.forEach((mapping) => sendMidiFeedback(mapping, false));
  const nextMappings = state.midi.mappings.filter((item, index) => (
    index !== currentIndex &&
    item.id !== draft.id &&
    (!draft.layoutPadId || item.layoutPadId !== draft.layoutPadId)
  ));
  nextMappings.splice(Math.min(currentIndex, nextMappings.length), 0, draft);
  state.midi.mappings = nextMappings;
  removeMidiMessageConflicts(draft.message, {keepMappingId: draft.id, keepLayoutPadId: draft.layoutPadId || ""});
  saveMidiMappings();
  syncMidiLayoutPadFromMapping(draft);
  state.editingMidiMappingId = draft.id;
  closeMidiMappingEditor();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
  showToast("MIDI mapping saved.");
}

function testMidiMappingEdit() {
  const draft = currentMidiMappingDraft();
  if (!draft) return;
  executeMidiMapping(draft).catch((error) => showToast(error.message));
}

function startMidiLearn(target) {
  if (!state.midi.selectedInputId) {
    showToast("Connect and select a MIDI input first.");
    return;
  }
  state.midi.learn = target;
  renderMidiMapper();
  renderMidiLayoutDesigner();
  const label = target.layoutPadId
    ? `pad ${target.padLabel || target.layoutPadId}`
    : MIDI_ACTION_LABELS[target.action] || target.action;
  showToast(`Learning ${label}. Press a MIDI control.`);
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
  markMidiLayoutActivity(message);
  if (state.midi.learn) {
    const target = state.midi.learn;
    state.midi.learn = null;
    if (target.layoutPadId) {
      const pad = midiLayoutPad(target.layoutPadId);
      if (pad) {
        const saved = setMidiLayoutPad({
          ...pad,
          action: target.action,
          playlistId: target.action === "start" ? (target.playlistId || "active") : "active",
          playlistName: target.action === "start" ? (target.playlistName || "Active playlist") : "Active playlist",
          mode: target.mode || null,
          message,
          controlType: target.layoutControlType || pad.controlType,
          type: target.layoutControlType || pad.controlType,
          colorOn: target.colorOn === undefined || target.colorOn === null ? pad.colorOn : target.colorOn,
          colorOff: target.colorOff === undefined || target.colorOff === null ? pad.colorOff : target.colorOff,
          feedbackMode: target.feedbackMode === undefined ? pad.feedbackMode : target.feedbackMode,
          ledProtocol: target.ledProtocol === undefined ? pad.ledProtocol : target.ledProtocol,
          feedbackType: target.feedbackType === undefined ? pad.feedbackType : target.feedbackType,
        });
        renderMidiMapper();
        renderMidiLayoutDesigner();
        if (state.editingMidiLayoutPadId === target.layoutPadId) renderMidiLayoutPadEditor(saved);
        showToast(`Mapped ${saved.label} to ${midiMessageLabel(message)}.`);
      }
      return;
    }
    const playlistId = target.action === "start" ? (target.playlistId || "active") : "active";
    const feedbackDefaults = midiActionFeedbackDefaults(target.action, target, {preserveExisting: false});
    upsertMidiMapping({
      id: midiMappingId(target.action, playlistId, message),
      action: target.action,
      playlistId,
      playlistName: target.action === "start" ? (target.playlistName || "Active playlist") : "Active playlist",
      mode: target.mode || null,
      message,
      colorOn: feedbackDefaults.colorOn,
      colorOff: feedbackDefaults.colorOff,
      feedbackMode: feedbackDefaults.feedbackMode,
      ledProtocol: feedbackDefaults.ledProtocol,
      colorTable: MIDI_COLOR_TABLE,
      feedbackType: "rgb",
    });
    renderMidiMapper();
    renderMidiLayoutDesigner();
    showToast(`Mapped ${midiMappingTitle(target)} to ${midiMessageLabel(message)}.`);
    return;
  }
  const mapping = state.midi.mappings.find((item) => midiMessagesMatch(item.message, message));
  if (mapping) executeMidiMapping(mapping, message);
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
  const cleanMapping = attachMidiMappingToLayoutControl(mapping);
  if (!cleanMapping) return;
  const replacedMappings = state.midi.mappings.filter((item) => (
    item.id === cleanMapping.id ||
    (cleanMapping.layoutPadId && item.layoutPadId === cleanMapping.layoutPadId)
  ));
  replacedMappings.forEach((mapping) => sendMidiFeedback(mapping, false));
  removeMidiMessageConflicts(cleanMapping.message, {
    keepMappingId: cleanMapping.id,
    keepLayoutPadId: cleanMapping.layoutPadId || "",
  });
  state.midi.mappings = state.midi.mappings.filter((item) => (
    item.id !== cleanMapping.id &&
    (!cleanMapping.layoutPadId || item.layoutPadId !== cleanMapping.layoutPadId)
  ));
  state.midi.mappings.push(cleanMapping);
  syncMidiLayoutPadFromMapping(cleanMapping);
  saveMidiMappings();
  sendMidiFeedback(cleanMapping, false);
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
}

async function executeMidiMapping(mapping, incomingMessage = null) {
  const key = mapping.id;
  const now = Date.now();
  const debounceMs = 260;
  if (state.midi.lastTrigger[key] && now - state.midi.lastTrigger[key] < debounceMs) return;
  state.midi.lastTrigger[key] = now;
  flashMidiFeedback(mapping);
  if (mapping.action === "blackout") {
    try {
      await toggleLedFxBlackout();
      if (midiMappingFeedbackMode(mapping) === "latch") {
        sendMidiFeedback(mapping, ledfxGlobalBrightness() <= 0.01);
      }
    } catch (error) {
      showToast(error.message);
    }
    return;
  }
  const activeOnly = ["next", "prev", "stop"].includes(mapping.action);
  const playlistId = activeOnly
    ? activePlaylistId()
    : (mapping.playlistId === "active" ? null : mapping.playlistId);
  await controlPlaylist(mapping.action, playlistId, mapping.mode);
}

function deleteMidiMapping(mappingId) {
  const mapping = state.midi.mappings.find((item) => item.id === mappingId);
  if (mapping) sendMidiFeedback(mapping, false);
  state.midi.mappings = state.midi.mappings.filter((mapping) => mapping.id !== mappingId);
  if (mapping && mapping.layoutPadId) {
    clearMidiLayoutPad(mapping.layoutPadId, {keepMessage: false});
  }
  saveMidiMappings();
  renderMidiMapper();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
}

function clearMidiMappings() {
  if (!state.midi.mappings.length) return;
  if (!window.confirm("Clear all MIDI mappings?")) return;
  state.midi.mappings.forEach((mapping) => sendMidiFeedback(mapping, false));
  state.midi.mappings = [];
  const layout = sanitizeMidiLayout(state.midi.layout);
  clearMidiLayoutSelection({render: false});
  state.midi.layout = sanitizeMidiLayout({
    template: layout.template,
    rows: layout.rows,
    cols: layout.cols,
    surfaceRows: layout.surfaceRows,
    surfaceCols: layout.surfaceCols,
    buttons: layout.buttons,
    knobs: layout.knobs,
    faders: layout.faders,
    pads: [],
  });
  saveMidiLayout();
  saveMidiMappings();
  renderMidiMapper();
  renderMidiLayoutDesigner();
}

function midiMappingTitle(mapping) {
  const label = MIDI_ACTION_LABELS[mapping.action] || mapping.action;
  return mapping.action === "start" ? `${label}: ${mapping.playlistName || mapping.playlistId}` : label;
}

function midiMappingPlaylistLabel(mapping) {
  if (mapping.action === "blackout") return "Global blackout";
  return ["next", "prev", "stop"].includes(mapping.action)
    ? "Active playlist"
    : (mapping.playlistName || "Active playlist");
}

function midiMessageLabel(message) {
  if (!message) return "No MIDI message";
  const type = message.type === "cc" ? "CC" : message.type === "program" ? "Program" : "Note";
  return `${type} ${message.number} / ch ${message.channel}`;
}

function midiCompactMessageLabel(message) {
  if (!message) return "No MIDI";
  const type = message.type === "cc" ? "CC" : message.type === "program" ? "PGM" : "N";
  return `${type}${message.number} / ch${message.channel}`;
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

  renderSceneTypeList();

  els.virtualList.innerHTML = "";
  const defaults = new Set(app.default_virtual_ids || []);
  app.virtuals.forEach((virtual) => {
    const label = `${virtual.name} (${virtual.id})`;
    const item = checkbox("virtual", virtual.id, label, defaults.has(virtual.id));
    item.classList.add("device-option");
    els.virtualList.append(item);
  });
  renderForgeBehaviorOptions();
  renderForgePreviewPaletteOptions();
  renderForgePreviewParamFields();
  generateForgeDraft();
  renderPresetLab();
  scheduleGenerationPanelSync();
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
  renderPresetBank();
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
  presetBaseSourcesForEffect(effectType).forEach((preset) => {
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
    actions.append(
      actionButton("Preview", () => previewPreset(preset)),
      actionButton("Bank", () => savePresetToBank(preset)),
    );
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
      actionButton("Bank", () => savePresetToBank(preset)),
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

function presetBankItems() {
  const bank = state.app && state.app.preset_bank;
  return bank && Array.isArray(bank.items) ? bank.items : [];
}

function bankPresetsForEffect(effectType) {
  return presetBankItems()
    .filter((item) => item && item.enabled !== false && item.effect_type === effectType)
    .map((item) => ({
      ...item,
      category: "preset_bank",
      source: "Preset Bank",
      editable: true,
      bank: true,
      param_count: item.param_count || Object.keys(item.config || {}).length,
    }));
}

function presetBaseSourcesForEffect(effectType) {
  return [...presetsForEffect(effectType), ...bankPresetsForEffect(effectType)];
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
  return presetBaseSourcesForEffect(effectType).find(
    (preset) => preset.id === id && (!category || preset.category === category),
  ) || null;
}

function renderPresetBank() {
  if (!els.presetBankList || !els.presetBankSummary) return;
  const effectType = els.presetEffectSelect ? els.presetEffectSelect.value : "";
  const allItems = presetBankItems();
  const visible = effectType
    ? allItems.filter((item) => item.effect_type === effectType)
    : allItems;
  els.presetBankList.innerHTML = "";
  els.presetBankSummary.textContent = allItems.length
    ? `${allItems.length} banked presets${effectType ? `, ${visible.length} for ${effectType}` : ""}`
    : "No banked presets.";
  if (!visible.length) {
    els.presetBankList.append(emptyNote("Use Bank on a generated draft or LedFx preset to save a reusable local base."));
    return;
  }
  visible.forEach((item) => {
    const preset = {
      ...item,
      category: "preset_bank",
      source: "Preset Bank",
      editable: true,
      bank: true,
    };
    const row = document.createElement("article");
    row.className = "preset-row is-bank";
    const main = document.createElement("div");
    main.className = "preset-row-main";
    const title = document.createElement("strong");
    title.textContent = preset.name || preset.id;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.append(
      pill("Bank"),
      pill(preset.effect_type),
      pill(`${preset.param_count || Object.keys(preset.config || {}).length} params`),
    );
    if (preset.palette_name) meta.append(pill(preset.palette_name, "palette-pill"));
    (preset.tags || []).slice(0, 4).forEach((tag) => meta.append(pill(tag, "tag-pill")));
    main.append(title, meta);
    const preview = presetColorPreview(preset);
    if (preview) main.append(preview);

    const actions = document.createElement("div");
    actions.className = "preset-row-actions";
    actions.append(
      actionButton("Preview", () => previewPreset(preset)),
      actionButton("Edit", () => openPresetBankEditor(preset)),
      actionButton("Delete", () => deletePresetBankItem(preset), false, "danger"),
    );
    row.append(main, actions);
    els.presetBankList.append(row);
  });
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

async function savePresetToBank(preset) {
  if (!preset || !preset.effect_type || !preset.config) return;
  try {
    const data = await api("/api/preset-bank/save", {
      method: "POST",
      body: JSON.stringify({
        name: preset.name || preset.id,
        effect_type: preset.effect_type,
        config: preset.config,
        palette_id: preset.palette_id || "",
        palette_name: preset.palette_name || "",
        tags: ["preset-bank", preset.effect_type, preset.palette_id ? `palette-${preset.palette_id}` : ""].filter(Boolean),
        preset_id: preset.draft ? "" : preset.id,
        preset_category: preset.draft ? "" : preset.category,
        source: preset.draft ? "Draft" : (preset.source || "Preset"),
      }),
    });
    state.app.preset_bank = data.preset_bank || state.app.preset_bank;
    renderPresetLab();
    showToast(`Added "${(data.item && data.item.name) || preset.name || preset.id}" to Preset Bank.`);
  } catch (error) {
    showToast(error.message);
  }
}

function openPresetBankEditor(item) {
  if (!item) return;
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingMidiMappingId = null;
  state.editingPresetBankItem = JSON.parse(JSON.stringify(item));
  hideModalPanels();
  renderPresetBankEditor();
  openModal("Edit Bank Preset");
}

function closePresetBankEditor() {
  state.editingPresetBankItem = null;
  renderPresetBankEditor();
  hideModal();
}

function renderPresetBankEditor() {
  if (!els.presetBankEditor) return;
  const item = state.editingPresetBankItem;
  if (!item) {
    els.presetBankEditor.hidden = true;
    return;
  }
  els.presetBankEditor.hidden = false;
  els.presetBankNameInput.value = item.name || item.id || "";
  els.presetBankTagInput.value = (item.tags || []).join(", ");
  els.presetBankEditStatus.textContent = `${item.effect_type} | local bank item: ${item.id || "new"}`;
  els.presetBankParamFields.innerHTML = "";
  const entries = Object.entries(item.config || {});
  if (!entries.length) {
    els.presetBankParamFields.append(emptyNote("No editable parameters in this bank preset."));
    return;
  }
  entries
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .forEach(([key, value]) => {
      const field = paramField({effect_type: item.effect_type}, 0, key, value);
      const input = field.querySelector("[data-param-key]");
      if (input) input.dataset.bankPresetParam = "true";
      els.presetBankParamFields.append(field);
    });
}

function collectPresetBankEditConfig() {
  const config = {};
  els.presetBankParamFields.querySelectorAll("[data-bank-preset-param]").forEach((input) => {
    config[input.dataset.paramKey] = parseParamInput(input);
  });
  return config;
}

async function previewEditingPresetBank() {
  const item = state.editingPresetBankItem;
  if (!item) return;
  const config = collectPresetBankEditConfig();
  await previewPreset(
    {
      ...item,
      name: els.presetBankNameInput.value.trim() || item.name || item.id,
      category: "preset_bank",
      source: "Preset Bank",
      config,
    },
    config,
    els.presetDeviceSelect ? els.presetDeviceSelect.value : "",
  );
}

async function savePresetBankEdit() {
  const item = state.editingPresetBankItem;
  if (!item) return;
  const name = els.presetBankNameInput.value.trim();
  if (!name) {
    showToast("Bank preset name is required.");
    return;
  }
  if (els.savePresetBankButton) {
    els.savePresetBankButton.disabled = true;
    els.savePresetBankButton.textContent = "Saving...";
  }
  try {
    const data = await api("/api/preset-bank/save", {
      method: "POST",
      body: JSON.stringify({
        ...item,
        name,
        tags: parseTagInput(els.presetBankTagInput.value),
        config: collectPresetBankEditConfig(),
      }),
    });
    state.app.preset_bank = data.preset_bank || state.app.preset_bank;
    state.editingPresetBankItem = JSON.parse(JSON.stringify(data.item || item));
    renderPresetLab();
    renderPresetBankEditor();
    showToast("Bank preset saved.");
  } catch (error) {
    showToast(error.message);
  } finally {
    if (els.savePresetBankButton) {
      els.savePresetBankButton.disabled = false;
      els.savePresetBankButton.textContent = "Save Bank Preset";
    }
  }
}

async function deletePresetBankItem(item) {
  if (!item || !item.id) return;
  const ok = window.confirm(`Delete bank preset "${item.name || item.id}"?`);
  if (!ok) return;
  try {
    const data = await api("/api/preset-bank/delete", {
      method: "POST",
      body: JSON.stringify({id: item.id}),
    });
    state.app.preset_bank = data.preset_bank || state.app.preset_bank;
    if (state.editingPresetBankItem && state.editingPresetBankItem.id === item.id) {
      state.editingPresetBankItem = null;
      hideModal();
    }
    renderPresetLab();
    showToast("Bank preset deleted.");
  } catch (error) {
    showToast(error.message);
  }
}

function paletteById(paletteId) {
  return ((state.app && state.app.palettes) || []).find((palette) => String(palette.id) === String(paletteId)) || null;
}

function openPresetEditor(preset) {
  if (!preset || !preset.editable) return;
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPresetBankItem = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingMidiMappingId = null;
  state.editingPreset = JSON.parse(JSON.stringify(preset));
  if (els.styleEditor) els.styleEditor.hidden = true;
  if (els.paletteEditor) els.paletteEditor.hidden = true;
  if (els.presetBankEditor) els.presetBankEditor.hidden = true;
  if (els.playlistEditor) els.playlistEditor.hidden = true;
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
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
  state.editingPresetBankItem = null;
  state.editingMidiMappingId = null;
  state.editingStyle = {id: styleId, source_style: styleId, isNew: false};
  hideModalPanels();
  renderPresetEditor();
  renderStyleEditor();
  openModal("Edit Style");
}

function newStyle() {
  const sourceStyle = currentStyleId();
  const source = currentStyle();
  state.editingPreset = null;
  state.editingPresetBankItem = null;
  state.editingMidiMappingId = null;
  state.editingStyle = {id: "", source_style: sourceStyle, isNew: true};
  hideModalPanels();
  renderPresetEditor();
  renderStyleEditor({
    name: `Custom ${source.name || sourceStyle || "Style"}`,
    description: source.description || "",
    defaults: collectCurrentDefaults(),
    scene_type_weights: {...(source.scene_type_weights || {})},
    effect_bias: {...(source.effect_bias || {})},
    palette_bias: {...(source.palette_bias || {})},
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
    if (els.styleSceneWeightFields) els.styleSceneWeightFields.innerHTML = "";
    if (els.styleEffectBiasFields) els.styleEffectBiasFields.innerHTML = "";
    if (els.stylePaletteBiasFields) els.stylePaletteBiasFields.innerHTML = "";
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
  renderStyleWeightFields(
    els.styleSceneWeightFields,
    styleWeightItemsForSceneTypes(),
    style.scene_type_weights || {},
    "scene",
  );
  renderStyleWeightFields(
    els.styleEffectBiasFields,
    styleWeightItemsForEffects(),
    style.effect_bias || {},
    "effect",
  );
  renderStyleWeightFields(
    els.stylePaletteBiasFields,
    styleWeightItemsForPalettes(),
    style.palette_bias || {},
    "palette",
  );
}

function styleWeightItemsForSceneTypes() {
  return ((state.app && state.app.scene_types) || []).map((item) => ({
    id: item.id,
    label: item.label || item.id,
    description: item.description || "",
  }));
}

function styleWeightItemsForEffects() {
  const profiles = (state.app && state.app.effect_profiles) || {};
  const schemas = (state.app && state.app.effect_schemas) || {};
  const ids = new Set([...Object.keys(profiles), ...Object.keys(schemas)]);
  return [...ids].sort((left, right) => left.localeCompare(right)).map((id) => {
    const profile = profiles[id] || {};
    const modes = [
      profile.audio_reactive ? "music-reactive" : "non-reactive",
      profile.reactivity_mode,
    ].filter(Boolean).join(", ");
    return {
      id,
      label: profile.name || id,
      description: [modes, (profile.scene_types || []).slice(0, 5).join(", ")].filter(Boolean).join(" | "),
    };
  });
}

function styleWeightItemsForPalettes() {
  return ((state.app && state.app.palettes) || []).map((palette) => ({
    id: palette.id,
    label: palette.name || palette.id,
    description: palette.id,
    gradient: palette.gradient || paletteGradient(palette.colors || {}, palette.positions || DEFAULT_GRADIENT_POSITIONS),
  }));
}

function renderStyleWeightFields(container, items, weights, scope) {
  if (!container) return;
  container.innerHTML = "";
  if (!items.length) {
    container.append(emptyNote("No options loaded yet."));
    return;
  }
  items.forEach((item) => {
    const row = document.createElement("label");
    row.className = "style-weight-row";
    const text = document.createElement("span");
    text.className = "style-weight-copy";
    const name = document.createElement("strong");
    name.textContent = item.label || item.id;
    text.append(name);
    if (item.description) {
      const small = document.createElement("small");
      small.textContent = item.description;
      text.append(small);
    }
    if (item.gradient) {
      const strip = document.createElement("span");
      strip.className = "style-weight-gradient";
      strip.style.background = item.gradient;
      text.append(strip);
    }
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "3";
    input.step = "0.05";
    input.value = String(Number(weights[item.id] ?? 1));
    input.dataset.styleWeightScope = scope;
    input.dataset.styleWeightKey = item.id;
    row.append(text, input);
    container.append(row);
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

function collectStyleEditorWeights(scope) {
  const weights = {};
  els.styleEditor.querySelectorAll(`[data-style-weight-scope="${scope}"]`).forEach((input) => {
    const key = input.dataset.styleWeightKey;
    if (!key) return;
    const value = Number(input.value);
    if (!Number.isFinite(value) || value < 0) return;
    weights[key] = Math.round(value * 100) / 100;
  });
  return weights;
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
        scene_type_weights: collectStyleEditorWeights("scene"),
        effect_bias: collectStyleEditorWeights("effect"),
        palette_bias: collectStyleEditorWeights("palette"),
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

function updatePalettePreview(options = {}) {
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
  renderPaletteList({preserveScroll: Boolean(options.preservePaletteScroll)});
  refreshForgePreview();
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
    preset_bank_mode: els.presetBankModeSelect ? els.presetBankModeSelect.value : "assist",
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

function currentSceneTypeSelection() {
  const sceneTypes = (state.app && state.app.scene_types) || [];
  const rendered = els.sceneTypeList ? els.sceneTypeList.querySelectorAll('input[name="scene_type"]') : [];
  if (!rendered.length) {
    return new Set(sceneTypes.map((item) => String(sceneTypeId(item))));
  }
  return new Set(checkedValues(els.sceneTypeList, "scene_type"));
}

function renderSceneTypeList(selectedIds = null, options = {}) {
  const app = state.app;
  if (!app || !els.sceneTypeList) return;
  const selected = selectedIds ? new Set(selectedIds.map(String)) : currentSceneTypeSelection();
  const previousScrollTop = options.preserveScroll ? els.sceneTypeList.scrollTop : 0;
  const ordered = stableSelectedFirst(
    app.scene_types || [],
    (item) => selected.has(String(sceneTypeId(item))),
    sceneTypeId,
  );
  els.sceneTypeList.innerHTML = "";
  ordered.forEach((type) => {
    const id = String(sceneTypeId(type));
    els.sceneTypeList.append(sceneTypeCheckbox(type, selected.has(id)));
  });
  if (options.preserveScroll) restoreScrollTop(els.sceneTypeList, previousScrollTop);
  scheduleGenerationPanelSync();
}

function restoreScrollTop(container, scrollTop) {
  if (!container) return;
  const apply = () => {
    const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
    container.scrollTop = Math.min(scrollTop, maxScroll);
  };
  const schedule = typeof requestAnimationFrame === "function"
    ? requestAnimationFrame
    : (callback) => setTimeout(callback, 0);
  apply();
  schedule(() => {
    apply();
    schedule(apply);
  });
  setTimeout(apply, 0);
}

function renderPaletteList(options = {}) {
  const app = state.app;
  if (!app || !els.paletteList) return;
  const selected = normalizePaletteIds(selectedPaletteIds());
  const previousScrollTop = options.preserveScroll ? els.paletteList.scrollTop : 0;
  const entries = [
    {type: "auto", id: "auto"},
    ...app.palettes.map((palette) => ({type: "palette", id: palette.id, palette})),
  ];
  const ordered = stableSelectedFirst(entries, (entry) => selected.has(entry.id), (entry) => entry.id);
  els.paletteList.innerHTML = "";
  ordered.forEach((entry) => {
    if (entry.type === "auto") {
      els.paletteList.append(autoPaletteCard(selected.has("auto")));
      return;
    }
    els.paletteList.append(paletteManagementCard(entry.palette, selected.has(entry.id)));
  });
  if (options.preserveScroll) restoreScrollTop(els.paletteList, previousScrollTop);
  scheduleGenerationPanelSync();
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

function setSelectedPalettes(ids, options = {}) {
  const selected = normalizePaletteIds(ids);
  [...els.paletteSelect.options].forEach((item) => {
    item.selected = selected.has(item.value);
  });
  updatePalettePreview(options);
}

function togglePalette(paletteId) {
  const selected = normalizePaletteIds(selectedPaletteIds());
  selected.delete("auto");
  if (selected.has(paletteId)) {
    selected.delete(paletteId);
  } else {
    selected.add(paletteId);
  }
  setSelectedPalettes([...selected], {preservePaletteScroll: true});
}

function reconcilePaletteSelect() {
  const specific = [...els.paletteSelect.selectedOptions].filter((item) => item.value !== "auto");
  const auto = els.paletteSelect.querySelector("option[value='auto']");
  if (specific.length && auto) auto.selected = false;
  if (!specific.length && auto && !auto.selected) auto.selected = true;
}

function editPalette(palette) {
  state.editingPreset = null;
  state.editingPresetBankItem = null;
  state.editingMidiMappingId = null;
  state.editingPalette = JSON.parse(JSON.stringify(palette));
  hideModalPanels();
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
  state.editingPresetBankItem = null;
  state.editingMidiMappingId = null;
  hideModalPanels();
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
    renderForgePreviewPaletteOptions();
    refreshForgePreview();
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
    renderForgePreviewPaletteOptions();
    refreshForgePreview();
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
  if (Number(report.high_pair_count || 0)) {
    summary.append(pill(`${report.high_pair_count} high-overlap pairs`, "similarity-high"));
  }
  if (Number(report.medium_pair_count || 0)) {
    summary.append(pill(`${report.medium_pair_count} medium-overlap pairs`, "similarity-medium"));
  }
  const candidates = (report.regenerate_candidate_ids || []).filter((id) =>
    state.scenes.some((scene) => scene.id === id && !scene.deleted),
  );
  if (candidates.length) {
    summary.append(actionButton(`Smart Diversify (${candidates.length})`, () => smartDiversify(candidates)));
  }
  host.append(summary);

  const details = document.createElement("details");
  details.className = "similarity-details";
  const title = document.createElement("summary");
  title.textContent = "Scene Diff details";
  details.append(title);

  const intro = document.createElement("p");
  intro.className = "similarity-intro";
  intro.textContent =
    "Scene Diff compares scene type, layout, palette/gradient, effects, presets, target Devices and key parameter values. Higher overlap means those scenes may feel too similar inside one batch.";
  details.append(intro);

  const pairs = (report.pairs || []).filter((pair) => Number(pair.score || 0) >= 0.34).slice(0, 4);
  if (!pairs.length) {
    const note = document.createElement("p");
    note.className = "similarity-recommendation";
    note.textContent = report.recommendation || "The batch looks varied enough for now.";
    details.append(note);
    host.append(details);
    return;
  }
  pairs.forEach((pair) => {
    const row = document.createElement("div");
    row.className = "similarity-pair";
    const names = document.createElement("strong");
    names.textContent = `${pair.left_name} <-> ${pair.right_name}`;
    const score = document.createElement("span");
    score.textContent = `${Math.round(Number(pair.score || 0) * 100)}% similar`;
    const shared = similarityList("Shared", pair.shared);
    const differences = similarityList("Different", pair.differences);
    const recommendation = document.createElement("small");
    recommendation.className = "similarity-recommendation";
    recommendation.textContent = pair.recommendation || report.recommendation || "";
    row.append(names, score, shared, differences);
    if (recommendation.textContent) row.append(recommendation);
    details.append(row);
  });
  host.append(details);
  if (report.recommendation) {
    const recommendation = document.createElement("p");
    recommendation.className = "similarity-recommendation";
    recommendation.textContent = report.recommendation;
    details.append(recommendation);
  }
  host.append(details);
}

function metricPill(label, value) {
  const numeric = Number(value || 0);
  return pill(`${label}: ${Math.round(numeric * 100)}%`);
}

function similarityList(label, values) {
  const item = document.createElement("small");
  item.className = "similarity-list";
  const cleanValues = (values || []).filter(Boolean);
  item.textContent = `${label}: ${cleanValues.length ? cleanValues.slice(0, 6).join(", ") : "none"}`;
  return item;
}

async function regenerateSimilarityCandidates(sceneIds) {
  const ids = [...new Set(sceneIds || [])].filter((sceneId) =>
    state.scenes.some((scene) => scene.id === sceneId && !scene.deleted),
  );
  if (!ids.length) return;
  try {
    for (const sceneId of ids) {
      await regenerateScene(sceneId);
    }
    showToast(`Regenerated ${ids.length} similar scene${ids.length === 1 ? "" : "s"}.`);
  } catch (error) {
    showToast(error.message);
  }
}

async function smartDiversify(sceneIds = null) {
  const requested = Array.isArray(sceneIds) && sceneIds.length
    ? sceneIds
    : [...state.compareSceneIds];
  const targetIds = [...new Set(requested)].filter((sceneId) =>
    state.scenes.some((scene) => scene.id === sceneId && !scene.deleted),
  );
  if (els.smartDiversifyButton) {
    els.smartDiversifyButton.disabled = true;
    els.smartDiversifyButton.textContent = "Diversifying...";
  }
  try {
    const data = await api("/api/diversify", {
      method: "POST",
      body: JSON.stringify({
        scene_ids: targetIds,
        options: collectOptions(),
      }),
    });
    state.scenes = data.scenes || state.scenes;
    state.similarityReport = data.similarity_report || state.similarityReport;
    state.compareSceneIds.clear();
    renderScenes();
    const count = (data.replaced || []).length;
    showToast(count ? `Smart Diversify replaced ${count} scene${count === 1 ? "" : "s"}.` : "No similar scenes needed replacement.");
  } catch (error) {
    showToast(error.message);
  } finally {
    if (els.smartDiversifyButton) {
      els.smartDiversifyButton.textContent = "Smart Diversify";
    }
    renderScenes();
  }
}

function renderScenes() {
  els.sceneList.innerHTML = "";
  const activeIds = new Set(state.scenes.filter((scene) => !scene.deleted).map((scene) => scene.id));
  state.compareSceneIds = new Set([...state.compareSceneIds].filter((sceneId) => activeIds.has(sceneId)));
  state.scenes.forEach((scene) => {
    const row = document.createElement("article");
    row.className = "scene-row";
    if (scene.id === state.selectedSceneId) row.classList.add("is-selected");
    if (state.compareSceneIds.has(scene.id)) row.classList.add("is-compare");
    if (scene.deleted) row.classList.add("is-deleted");
    if (scene.saved) row.classList.add("is-saved");

    const compare = document.createElement("label");
    compare.className = "scene-compare-toggle";
    const compareInput = document.createElement("input");
    compareInput.type = "checkbox";
    compareInput.checked = state.compareSceneIds.has(scene.id);
    compareInput.disabled = scene.deleted;
    compareInput.addEventListener("change", (event) => {
      toggleCompareScene(scene.id, event.target.checked);
    });
    const compareText = document.createElement("span");
    compareText.textContent = "A/B";
    compare.append(compareInput, compareText);

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
    [...new Set([...(scene.tags || []), ...(scene.mood_tags || [])])].forEach((tag) => {
      tags.append(pill(tag, sceneTagClass(tag)));
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

    row.append(compare, body, actions);
    els.sceneList.append(row);
  });
  sceneSummary();
  const activeScenes = state.scenes.filter((scene) => !scene.deleted);
  els.approveAllButton.disabled = !activeScenes.some((scene) => !scene.kept);
  els.unapproveAllButton.disabled = !activeScenes.some((scene) => scene.kept);
  if (els.compareScenesButton) els.compareScenesButton.disabled = state.compareSceneIds.size !== 2;
  if (els.smartDiversifyButton) els.smartDiversifyButton.disabled = activeScenes.length < 2;
  els.saveButton.disabled = !state.scenes.some((scene) => scene.kept && !scene.deleted && !scene.saved);
  renderSimilarityReport();
}

function sceneTagClass(tag) {
  const value = String(tag || "");
  if (value.startsWith("palette-")) return "palette-pill";
  if (value.startsWith("mood-")) return "mood-pill";
  return "tag-pill";
}

function toggleCompareScene(sceneId, checked) {
  if (checked) {
    if (!state.compareSceneIds.has(sceneId) && state.compareSceneIds.size >= 2) {
      const first = state.compareSceneIds.values().next().value;
      state.compareSceneIds.delete(first);
    }
    state.compareSceneIds.add(sceneId);
  } else {
    state.compareSceneIds.delete(sceneId);
  }
  renderScenes();
}

function openSceneCompare() {
  const ids = [...state.compareSceneIds];
  if (ids.length !== 2) {
    showToast("Select exactly two scenes for A/B compare.");
    return;
  }
  const left = state.scenes.find((scene) => scene.id === ids[0] && !scene.deleted);
  const right = state.scenes.find((scene) => scene.id === ids[1] && !scene.deleted);
  if (!left || !right) {
    showToast("One of the selected scenes is no longer available.");
    return;
  }
  state.editingStyle = null;
  state.editingPalette = null;
  state.editingPreset = null;
  state.editingPresetBankItem = null;
  state.editingSceneId = null;
  state.editingPublishedSceneId = null;
  state.editingPlaylistId = null;
  state.editingMidiMappingId = null;
  hideModalPanels();
  els.sceneEditorHost.hidden = false;
  els.sceneEditorHost.append(renderSceneCompare(left, right));
  openModal("Compare Scenes");
}

function renderSceneCompare(left, right) {
  const panel = document.createElement("div");
  panel.className = "scene-compare-panel";
  const summary = sceneCompareSummary(left, right);
  const intro = document.createElement("p");
  intro.className = "scene-compare-score";
  intro.textContent = `${Math.round(summary.score * 100)}% overlap. ${summary.text}`;
  panel.append(intro);

  const cards = document.createElement("div");
  cards.className = "scene-compare-cards";
  cards.append(sceneCompareCard("A", left), sceneCompareCard("B", right));
  panel.append(cards);

  const rows = document.createElement("div");
  rows.className = "scene-compare-rows";
  const leftTokens = sceneCompareTokens(left);
  const rightTokens = sceneCompareTokens(right);
  [
    ["Scene type", left.scene_type, right.scene_type],
    ["Layout", left.layout, right.layout],
    ["Palette", scenePaletteDisplayName(left), scenePaletteDisplayName(right)],
    ["Energy", `${Math.round(left.energy * 100)}%`, `${Math.round(right.energy * 100)}%`],
    ["Effects", leftTokens.effects.join(", "), rightTokens.effects.join(", ")],
    ["Presets", leftTokens.presets.join(", "), rightTokens.presets.join(", ")],
    ["Devices", leftTokens.devices.join(", "), rightTokens.devices.join(", ")],
    ["Mood tags", leftTokens.moods.join(", "), rightTokens.moods.join(", ")],
    ["Key params", leftTokens.params.join(", "), rightTokens.params.join(", ")],
  ].forEach(([label, leftValue, rightValue]) => {
    rows.append(compareRow(label, leftValue || "-", rightValue || "-"));
  });
  panel.append(rows);
  return panel;
}

function sceneCompareSummary(left, right) {
  const leftSet = new Set(sceneCompareFlatTokens(left));
  const rightSet = new Set(sceneCompareFlatTokens(right));
  const union = new Set([...leftSet, ...rightSet]);
  const shared = [...leftSet].filter((token) => rightSet.has(token));
  const score = union.size ? shared.length / union.size : 0;
  let text = "They should feel distinct enough inside one batch.";
  if (score >= 0.72) text = "These are very close; Smart Diversify one of them.";
  else if (score >= 0.5) text = "They share a noticeable shape; keep both only if that repetition is intentional.";
  return {score, text};
}

function sceneCompareCard(label, scene) {
  const card = document.createElement("article");
  card.className = "scene-compare-card";
  const title = document.createElement("strong");
  title.textContent = `${label}. ${scene.name}`;
  const preview = scenePalettePreview(scene, {compact: true});
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.append(
    pill(scene.scene_type, "hot"),
    pill(scene.layout),
    pill(`${Math.round(scene.energy * 100)}% energy`),
  );
  const actions = document.createElement("div");
  actions.className = "scene-compare-card-actions";
  actions.append(
    actionButton("Preview", () => previewScene(scene.id)),
    actionButton("Edit", () => openSceneEditor(scene.id)),
    actionButton("Diversify", () => smartDiversify([scene.id])),
  );
  card.append(title);
  if (preview) card.append(preview);
  card.append(meta, actions);
  return card;
}

function sceneCompareTokens(scene) {
  const activeAssignments = (scene.assignments || []).filter((assignment) => assignment.effect_type && assignment.action !== "ignore");
  const effects = activeAssignments.map((assignment) => assignment.effect_type);
  const presets = activeAssignments.map((assignment) =>
    assignment.source_preset_name || assignment.preset || "Custom/current",
  );
  const devices = activeAssignments.map((assignment) => `${assignment.virtual_id}:${assignment.effect_type}`);
  const moods = [...new Set([...(scene.mood_tags || []), ...(scene.tags || []).filter((tag) => String(tag).startsWith("mood-"))])];
  const params = [];
  activeAssignments.forEach((assignment) => {
    Object.entries(assignment.config || {})
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
      .slice(0, 8)
      .forEach(([key, value]) => {
        if (String(value).includes("linear-gradient")) return;
        params.push(`${assignment.effect_type}.${key}=${String(value).slice(0, 18)}`);
      });
  });
  return {
    effects: [...new Set(effects)].slice(0, 8),
    presets: [...new Set(presets)].slice(0, 8),
    devices: [...new Set(devices)].slice(0, 8),
    moods: moods.slice(0, 8),
    params: params.slice(0, 12),
  };
}

function sceneCompareFlatTokens(scene) {
  const tokens = [
    `type:${scene.scene_type}`,
    `layout:${scene.layout}`,
    `palette:${scenePaletteDisplayName(scene)}`,
    `energy:${Math.round(Number(scene.energy || 0) * 10)}`,
  ];
  const grouped = sceneCompareTokens(scene);
  Object.entries(grouped).forEach(([group, values]) => {
    values.forEach((value) => tokens.push(`${group}:${value}`));
  });
  return tokens;
}

function compareRow(label, left, right) {
  const row = document.createElement("div");
  row.className = `scene-compare-row ${left === right ? "is-same" : "is-different"}`;
  const labelNode = document.createElement("strong");
  labelNode.textContent = label;
  const leftNode = document.createElement("span");
  leftNode.textContent = left;
  const rightNode = document.createElement("span");
  rightNode.textContent = right;
  row.append(labelNode, leftNode, rightNode);
  return row;
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

function refreshEditorPalettePreview(anchor) {
  const editor = anchor && anchor.closest ? anchor.closest(".scene-editor, .published-scene-editor") : null;
  if (!editor) return;
  const slot = editor.querySelector("[data-editor-palette-preview]");
  if (!slot) return;
  const assignments = [];
  editor.querySelectorAll("[data-gradient-preview='true']").forEach((input) => {
    const index = input.dataset.assignmentIndex || String(assignments.length);
    const gradientKey = input.dataset.paramKey || "gradient";
    const nameInput = editor.querySelector(
      `[data-param-key="gradient_name"][data-assignment-index="${index}"]`,
    );
    assignments.push({
      action: "activate",
      effect_type: "editor",
      config: {
        [gradientKey]: input.value,
        gradient_name: nameInput ? nameInput.value : paletteNameForGradientValue(input.value),
      },
    });
  });
  slot.innerHTML = "";
  const preview = scenePalettePreview({assignments}, {fallback: false, compact: true});
  if (preview) slot.append(preview);
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
  state.editingPresetBankItem = null;
  state.editingMidiMappingId = null;
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
  if (els.styleEditor) els.styleEditor.hidden = true;
  if (els.paletteEditor) els.paletteEditor.hidden = true;
  if (els.presetEditor) els.presetEditor.hidden = true;
  if (els.presetBankEditor) els.presetBankEditor.hidden = true;
  if (els.playlistEditor) els.playlistEditor.hidden = true;
  if (els.midiMappingEditor) els.midiMappingEditor.hidden = true;
  if (els.tabsGuidePanel) els.tabsGuidePanel.hidden = true;
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

  const details = document.createElement("div");
  details.className = "published-scene-details";
  const previewSlot = document.createElement("span");
  previewSlot.className = "editor-palette-preview-slot";
  previewSlot.dataset.editorPalettePreview = "true";
  const preview = scenePalettePreview(scene, {fallback: false});
  if (preview) previewSlot.append(preview);
  details.append(
    previewSlot,
    pill(scene.scene_type || "scene"),
    pill(scene.layout || "layout"),
    pill(`${Math.round(Number(scene.energy || 0) * 100)}% energy`),
  );

  editor.append(head, nameLabel, details);

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
  presetBaseSourcesForEffect(assignment.effect_type).forEach((preset) => {
    select.append(option(`${preset.name || preset.id} (${preset.source})`, presetValue(preset)));
  });
  const currentValue = assignment.preset
    ? presetValue({id: assignment.preset, category: assignment.preset_category || "ledfx_presets"})
    : assignment.source_preset_id
      ? presetValue({id: assignment.source_preset_id, category: assignment.source_preset_category || "preset_bank"})
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
    assignment.source_preset_id = null;
    assignment.source_preset_name = null;
    assignment.source_preset_category = null;
    assignment.config = patch.effect_type ? defaultEffectConfig(patch.effect_type) : {};
  }
  if (patch.preset_key !== undefined) {
    const preset = findPreset(assignment.effect_type, patch.preset_key);
    if (preset) {
      if (preset.category === "preset_bank") {
        assignment.preset = null;
        assignment.preset_category = null;
      } else {
        assignment.preset = preset.id;
        assignment.preset_category = preset.category;
      }
      assignment.source_preset_id = preset.id;
      assignment.source_preset_name = preset.name || preset.id;
      assignment.source_preset_category = preset.category;
      assignment.config = cloneDefaultValue(preset.config || {});
    } else {
      assignment.preset = null;
      assignment.preset_category = null;
      assignment.source_preset_id = null;
      assignment.source_preset_name = null;
      assignment.source_preset_category = null;
    }
  }
  if (patch.action) {
    assignment.action = patch.action;
  }
  if (assignment.action === "activate" && !assignment.effect_type) {
    assignment.effect_type = defaultSceneEffectType(assignments);
    assignment.preset = null;
    assignment.preset_category = null;
    assignment.source_preset_id = null;
    assignment.source_preset_name = null;
    assignment.source_preset_category = null;
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
    const update = (syncName = false) => {
      if (syncName) syncGradientNameInput(input);
      preview.style.background = input.value || "linear-gradient(90deg, #000000, #444444)";
      refreshEditorPalettePreview(input);
    };
    input.addEventListener("input", () => update(true));
    input.addEventListener("change", () => update(true));
    update(false);
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
  const editor = gradientInput.closest(".scene-editor, .published-scene-editor");
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
    state.similarityReport = data.similarity_report || state.similarityReport;
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

async function createManualScene() {
  const options = collectOptions();
  if (options.virtual_ids.length === 0) {
    showToast("Select at least one Device.");
    return;
  }
  if (els.newManualSceneButton) {
    els.newManualSceneButton.disabled = true;
    els.newManualSceneButton.textContent = "Creating...";
  }
  try {
    const data = await api("/api/manual-scene", {
      method: "POST",
      body: JSON.stringify(options),
    });
    if (data.scene) {
      state.scenes.push(data.scene);
      state.editingSceneId = data.scene.id;
    }
    state.similarityReport = data.similarity_report || state.similarityReport;
    renderScenes();
    renderSceneEditorModal();
    showToast("Manual scene draft added.");
  } catch (error) {
    showToast(error.message);
  } finally {
    if (els.newManualSceneButton) {
      els.newManualSceneButton.disabled = false;
      els.newManualSceneButton.textContent = "Manual Scene";
    }
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
    state.compareSceneIds.clear();
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
    state.similarityReport = data.similarity_report || state.similarityReport;
    state.compareSceneIds.delete(sceneId);
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
    if (state.compareSceneIds.has(sceneId)) {
      state.compareSceneIds.delete(sceneId);
      if (data.scene && !data.scene.deleted && state.compareSceneIds.size < 2) {
        state.compareSceneIds.add(data.scene.id);
      }
    }
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
    const safety = await api("/api/validate-batch", {
      method: "POST",
      body: JSON.stringify({scene_ids: sceneIds}),
    });
    if (!safety.ok) {
      const first = (safety.errors || [])[0];
      throw new Error(first ? `LedFx safety check failed: ${first.message}` : "LedFx safety check failed.");
    }
    if (safety.warning_count) {
      const warningDetails = formatLedFxWarnings(safety, 6);
      const ok = window.confirm(
        [
          `LedFx safety check found ${safety.warning_count} warning(s):`,
          warningDetails,
          "",
          "Send approved scenes anyway?",
        ].filter(Boolean).join("\n"),
      );
      if (!ok) {
        showToast(`Send cancelled after safety warning:\n${warningDetails}`, 9000);
        return;
      }
    }
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
    const safetyWarningDetails = formatLedFxWarnings(data.safety_report, 3);
    const safetyWarnings = safetyWarningDetails
      ? `\nWarnings:\n${safetyWarningDetails}`
      : "";
    showToast(`Sent ${savedIds.size} scenes${presetText}${errorText}.${safetyWarnings}`, safetyWarningDetails ? 10000 : 3600);
  } catch (error) {
    showToast(error.message);
  } finally {
    els.saveButton.textContent = "Send to LedFX";
    renderScenes();
  }
}

function replaceScene(scene) {
  if (!scene || !scene.id) return;
  const index = state.scenes.findIndex((item) => item.id === scene.id);
  if (index >= 0) {
    state.scenes.splice(index, 1, scene);
  } else {
    state.scenes.push(scene);
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
document.addEventListener("pointerdown", (event) => {
  const picker = event.target.closest && event.target.closest(".midi-color-picker");
  closeAllMidiColorMenus(picker || null);
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
window.addEventListener("resize", () => {
  hideInfoTooltip();
  scheduleGenerationPanelSync();
});
window.addEventListener("scroll", hideInfoTooltip, true);
els.factoryTabButton.addEventListener("click", () => setAppView("factory"));
els.presetLabTabButton.addEventListener("click", () => setAppView("presets"));
els.liveModeTabButton.addEventListener("click", () => setAppView("live"));
els.effectForgeTabButton.addEventListener("click", () => setAppView("forge"));
els.midiMapperTabButton.addEventListener("click", () => setAppView("midi"));
els.midiLayoutTabButton.addEventListener("click", () => setAppView("layout"));
els.forgeRandomizeButton.addEventListener("click", randomizeForgeDraft);
els.forgeSaveAsButton.addEventListener("click", saveForgeDraft);
els.forgeBehaviorSelect.addEventListener("change", updateForgeBehaviorDefaults);
els.forgePreviewPauseButton.addEventListener("click", toggleForgePreview);
els.forgePreviewResetParamsButton.addEventListener("click", resetForgePreviewParams);
[
  els.forgeEffectNameInput,
  els.forgeReactivitySelect,
].forEach((input) => {
  input.addEventListener("input", generateForgeDraft);
  input.addEventListener("change", generateForgeDraft);
});
[
  [els.forgeFrequencySelect, "frequency"],
  [els.forgeIntensityInput, "intensity"],
  [els.forgeMotionInput, "motion"],
  [els.forgeDetailInput, "detail"],
  [els.forgeDecayInput, "decay"],
  [els.forgeFlashInput, "flash"],
].forEach(([input, kind]) => {
  input.addEventListener("input", () => syncForgeMainControlToPreviewParams(kind));
  input.addEventListener("change", () => syncForgeMainControlToPreviewParams(kind));
});
[
  els.forgePreviewDriveInput,
  els.forgePreviewDemoInput,
].forEach((input) => {
  input.addEventListener("input", refreshForgePreview);
  input.addEventListener("change", refreshForgePreview);
});
els.forgePreviewPaletteSelect.addEventListener("change", applyForgePaletteToPreviewConfig);
els.copyForgeCodeButton.addEventListener("click", () => copyForgeOutput(els.forgeCodeOutput, "Code"));
els.copyForgeProfileButton.addEventListener("click", () => copyForgeOutput(els.forgeProfileOutput, "Profile"));
els.copyForgeInstructionsButton.addEventListener("click", () => copyForgeOutput(els.forgeInstructionsOutput, "Instructions"));
els.midiConnectButton.addEventListener("click", connectMidi);
els.midiRefreshLibraryButton.addEventListener("click", () => loadLedFxLibrary(true));
els.midiRefreshMappingsButton.addEventListener("click", refreshMidiMappingsFromStorage);
els.midiResetAllButton.addEventListener("click", resetAllMidiMappings);
els.midiInputSelect.addEventListener("change", () => {
  selectMidiInput(els.midiInputSelect.value);
  renderMidiMapper();
});
els.midiOutputSelect.addEventListener("change", () => {
  selectMidiOutput(els.midiOutputSelect.value);
  refreshMidiFeedback();
});
els.midiProfileSelect.addEventListener("change", () => {
  state.midi.selectedProfileId = els.midiProfileSelect.value;
  localStorage.setItem(MIDI_SELECTED_PROFILE_KEY, state.midi.selectedProfileId);
  renderMidiProfiles();
});
els.midiSaveProfileButton.addEventListener("click", saveCurrentMidiProfile);
els.midiLoadProfileButton.addEventListener("click", loadSelectedMidiProfile);
els.midiDeleteProfileButton.addEventListener("click", deleteSelectedMidiProfile);
els.midiPrevButton.addEventListener("click", () => controlPlaylist("prev"));
els.midiNextButton.addEventListener("click", () => controlPlaylist("next"));
els.midiMapPrevButton.addEventListener("click", () => startMidiLearn(midiTransportTarget("prev")));
els.midiMapNextButton.addEventListener("click", () => startMidiLearn(midiTransportTarget("next")));
els.midiColorOnSelect.addEventListener("change", () => {
  state.midi.controller.colorOn = clampMidiValue(els.midiColorOnSelect.value);
  updateMidiColorPicker(els.midiColorOnSelect);
  updateMidiColorPreview(els.midiColorOnSelect);
  saveMidiControllerSettings();
  renderMidiMappingList();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
});
els.midiColorOffSelect.addEventListener("change", () => {
  state.midi.controller.colorOff = clampMidiValue(els.midiColorOffSelect.value);
  updateMidiColorPicker(els.midiColorOffSelect);
  updateMidiColorPreview(els.midiColorOffSelect);
  saveMidiControllerSettings();
  renderMidiMappingList();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
});
els.midiFeedbackModeSelect.addEventListener("change", () => {
  state.midi.controller.feedbackMode = els.midiFeedbackModeSelect.value;
  saveMidiControllerSettings();
  renderMidiMappingList();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
});
els.midiLedProtocolSelect.addEventListener("change", () => {
  state.midi.controller.ledProtocol = validMidiLedProtocol(els.midiLedProtocolSelect.value) || DEFAULT_MIDI_CONTROLLER.ledProtocol;
  saveMidiControllerSettings();
  renderMidiMappingList();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
});
els.midiBlackoutButton.addEventListener("click", () => {
  toggleLedFxBlackout().catch((error) => showToast(error.message));
});
els.midiMapBlackoutButton.addEventListener("click", () => startMidiLearn(midiTransportTarget("blackout")));
els.midiClearMappingsButton.addEventListener("click", clearMidiMappings);
els.midiEditActionSelect.addEventListener("change", () => {
  const mapping = state.midi.mappings.find((item) => item.id === state.editingMidiMappingId);
  const action = MIDI_MAPPING_ACTIONS.has(els.midiEditActionSelect.value)
    ? els.midiEditActionSelect.value
    : mapping?.action;
  renderMidiEditPlaylistOptions(action, mapping?.playlistId || "active");
  if (mapping && action) {
    applyMidiActionFeedbackToEditor("midiEdit", action, mapping);
    const draft = currentMidiMappingDraft();
    if (draft && els.midiMappingEditStatus) {
      els.midiMappingEditStatus.textContent = `${midiMappingTitle(draft)} mapped to ${midiMessageLabel(draft.message)}`;
    }
  }
});
els.midiEditColorOnSelect.addEventListener("change", () => {
  updateMidiColorPicker(els.midiEditColorOnSelect);
  updateMidiColorPreview(els.midiEditColorOnSelect);
});
els.midiEditColorOffSelect.addEventListener("change", () => {
  updateMidiColorPicker(els.midiEditColorOffSelect);
  updateMidiColorPreview(els.midiEditColorOffSelect);
});
els.saveMidiMappingEditButton.addEventListener("click", saveMidiMappingEdit);
els.testMidiMappingEditButton.addEventListener("click", testMidiMappingEdit);
els.closeMidiMappingEditorButton.addEventListener("click", closeMidiMappingEditor);
els.midiLayoutConnectButton.addEventListener("click", connectMidi);
els.midiLayoutAutoMapButton.addEventListener("click", autoMapMidiLayout);
els.midiLayoutRefreshMappingsButton.addEventListener("click", refreshMidiMappingsFromStorage);
els.midiLayoutClearButton.addEventListener("click", clearMidiLayout);
els.midiLayoutResetAllButton.addEventListener("click", resetAllMidiMappings);
els.midiLayoutTemplateSelect.addEventListener("change", () => setMidiLayoutTemplate(els.midiLayoutTemplateSelect.value));
els.midiLayoutGridSizeSelect.addEventListener("change", applyMidiLayoutGridSizePreset);
els.midiLayoutZoomOutButton.addEventListener("click", () => changeMidiLayoutZoom(-MIDI_LAYOUT_ZOOM_STEP));
els.midiLayoutZoomInButton.addEventListener("click", () => changeMidiLayoutZoom(MIDI_LAYOUT_ZOOM_STEP));
els.midiLayoutClearSelectionButton.addEventListener("click", () => clearMidiLayoutSelection());
els.midiLayoutApplyCustomButton.addEventListener("click", applyMidiLayoutCustomSettings);
els.midiLayoutSaveCustomButton.addEventListener("click", saveMidiLayoutCustomModel);
els.midiLayoutAddButtonButton.addEventListener("click", () => addMidiLayoutCustomControl("button"));
els.midiLayoutAddKnobButton.addEventListener("click", () => addMidiLayoutCustomControl("knob"));
els.midiLayoutAddFaderButton.addEventListener("click", () => addMidiLayoutCustomControl("fader"));
els.midiLayoutPositionButton.addEventListener("click", toggleMidiLayoutPositionMode);
els.midiLayoutInputSelect.addEventListener("change", () => {
  selectMidiInput(els.midiLayoutInputSelect.value);
  renderMidiMapper();
  renderMidiLayoutDesigner();
});
els.midiLayoutOutputSelect.addEventListener("change", () => {
  selectMidiOutput(els.midiLayoutOutputSelect.value);
  renderMidiMapper();
  renderMidiLayoutDesigner();
  refreshMidiFeedback();
});
els.midiLayoutPadActionSelect.addEventListener("change", () => {
  const current = midiLayoutPad(state.editingMidiLayoutPadId);
  const action = MIDI_LAYOUT_ACTIONS.has(els.midiLayoutPadActionSelect.value)
    ? els.midiLayoutPadActionSelect.value
    : current?.action;
  renderMidiLayoutPadPlaylistOptions(action, current?.playlistId || "active");
  if (current && MIDI_MAPPING_ACTIONS.has(action)) applyMidiActionFeedbackToEditor("midiLayoutPad", action, current);
  const pad = currentMidiLayoutPadDraft();
  if (pad && els.midiLayoutPadEditStatus) {
    els.midiLayoutPadEditStatus.textContent = `${pad.label} | ${midiLayoutPadTitle(pad)} | ${midiMessageLabel(pad.message)}`;
  }
  if (els.testMidiLayoutPadButton) {
    els.testMidiLayoutPadButton.disabled = !(pad && pad.message && MIDI_MAPPING_ACTIONS.has(pad.action));
  }
});
els.midiLayoutPadLabelInput.addEventListener("input", () => {
  const pad = currentMidiLayoutPadDraft();
  if (pad && els.midiLayoutPadEditStatus) {
    els.midiLayoutPadEditStatus.textContent = `${pad.label} | ${midiLayoutPadTitle(pad)} | ${midiMessageLabel(pad.message)}`;
  }
});
els.midiLayoutPadColorOnSelect.addEventListener("change", () => {
  updateMidiColorPicker(els.midiLayoutPadColorOnSelect);
  updateMidiColorPreview(els.midiLayoutPadColorOnSelect);
});
els.midiLayoutPadColorOffSelect.addEventListener("change", () => {
  updateMidiColorPicker(els.midiLayoutPadColorOffSelect);
  updateMidiColorPreview(els.midiLayoutPadColorOffSelect);
});
els.saveMidiLayoutPadButton.addEventListener("click", saveMidiLayoutPad);
els.learnMidiLayoutPadButton.addEventListener("click", learnMidiLayoutPad);
els.testMidiLayoutPadButton.addEventListener("click", testMidiLayoutPad);
els.clearMidiLayoutPadButton.addEventListener("click", clearCurrentMidiLayoutPad);
els.closeMidiLayoutPadEditorButton.addEventListener("click", closeMidiLayoutPadEditor);
els.saveConnectionButton.addEventListener("click", saveConnection);
els.topPreviewDeviceSelect.addEventListener("change", () => {
  state.topPreviewDeviceId = els.topPreviewDeviceSelect.value;
  localStorage.setItem("lsf.top_preview_device", state.topPreviewDeviceId);
  const virtual = ((state.app && state.app.virtuals) || []).find((item) => item.id === state.topPreviewDeviceId);
  updateTopDevicePreview(virtual);
  connectTopPreviewStream();
});
els.appGuideButton.addEventListener("click", openTabsGuide);
els.exportShowPackButton.addEventListener("click", downloadShowPack);
els.importShowPackButton.addEventListener("click", chooseShowPackImport);
els.importShowPackInput.addEventListener("change", () => importShowPackFromFile(els.importShowPackInput.files[0]));
els.refreshButton.addEventListener("click", loadAppState);
els.restoreButton.addEventListener("click", restorePreview);
els.liveRefreshButton.addEventListener("click", () => loadLedFxLibrary(true));
els.liveBlackoutButton.addEventListener("click", () => {
  toggleLedFxBlackout().catch((error) => showToast(error.message));
});
els.liveStopButton.addEventListener("click", () => controlPlaylist("stop"));
els.livePrevButton.addEventListener("click", () => controlPlaylist("prev"));
els.liveNextButton.addEventListener("click", () => controlPlaylist("next"));
els.approveAllButton.addEventListener("click", () => setAllSceneApproval(true));
els.unapproveAllButton.addEventListener("click", () => setAllSceneApproval(false));
els.compareScenesButton.addEventListener("click", openSceneCompare);
els.smartDiversifyButton.addEventListener("click", () => smartDiversify());
els.newManualSceneButton.addEventListener("click", createManualScene);
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
els.previewPresetBankButton.addEventListener("click", previewEditingPresetBank);
els.savePresetBankButton.addEventListener("click", savePresetBankEdit);
els.closePresetBankEditorButton.addEventListener("click", closePresetBankEditor);
els.refreshLibraryButton.addEventListener("click", () => loadLedFxLibrary(true));
els.shortenLsfButton.addEventListener("click", shortenLsfNames);
els.selectAllLibraryScenesButton.addEventListener("click", selectAllLibraryScenes);
els.selectFilteredLibraryScenesButton.addEventListener("click", selectFilteredLibraryScenes);
els.clearLibrarySelectionButton.addEventListener("click", clearLibrarySelection);
els.tagSelectedScenesButton.addEventListener("click", tagSelectedLibraryScenes);
els.deleteSelectedScenesButton.addEventListener("click", deleteSelectedLibraryScenes);
els.playlistFromSelectionButton.addEventListener("click", createPlaylistFromSelection);
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
bindRangeValue(els.forgePreviewDriveInput, els.forgePreviewDriveValue);
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
els.selectAllSceneTypesButton.addEventListener("click", () => setSceneTypesChecked(true));
els.unselectAllSceneTypesButton.addEventListener("click", () => setSceneTypesChecked(false));

saveMidiControllerSettings();
saveMidiMappings();
initializeAppView();
renderForgeBehaviorOptions();
generateForgeDraft();
loadAppState();
