(/* Darkio Fonty Fun V5 — classic/Vendetta-compatible plugin with Revenge API support.
 * Local-only display styling. No token access, network calls, or profile edits.
 */
globalThis.plugin = (() => {
  "use strict";
  // Revenge Classic/Bunny/Vendetta expose slightly different global API surfaces.
  // Prefer the legacy-compatible UI when running from the classic manifest, while
  // keeping each lookup independent so a partial shim cannot mask a working API.
  const safeRead = getter => { try { return getter(); } catch (_) { return undefined; } };
  // Revenge's evaluator injects its API as the `revenge` argument. Older builds
  // only checked globals, which can be absent when the loader injects the API.
  const injectedRevenge = safeRead(() => (typeof revenge !== 'undefined' ? revenge : undefined));
  const injectedBunny = safeRead(() => (typeof bunny !== 'undefined' ? bunny : undefined));
  const injectedVendetta = safeRead(() => (typeof vendetta !== 'undefined' ? vendetta : undefined));
  const revengeApi = injectedRevenge || safeRead(() => globalThis.revenge) || injectedBunny || safeRead(() => globalThis.bunny);
  const legacy = injectedVendetta || safeRead(() => globalThis.vendetta);
  const runtime = revengeApi || legacy || injectedBunny || injectedVendetta;

  // Resolve each capability independently. A partial compatibility shim should
  // not mask a complete API supplied through the loader.
  const React = safeRead(() => revengeApi?.metro?.common?.React)
    || safeRead(() => legacy?.metro?.common?.React)
    || safeRead(() => injectedBunny?.metro?.common?.React)
    || safeRead(() => runtime?.metro?.common?.React)
    || safeRead(() => revengeApi?.metro?.findByProps?.('createElement', 'useState'))
    || safeRead(() => legacy?.metro?.findByProps?.('createElement', 'useState'))
    || safeRead(() => globalThis.React);
  const RN = safeRead(() => revengeApi?.metro?.common?.ReactNative)
    || safeRead(() => legacy?.metro?.common?.ReactNative)
    || safeRead(() => injectedBunny?.metro?.common?.ReactNative)
    || safeRead(() => runtime?.metro?.common?.ReactNative)
    || safeRead(() => revengeApi?.metro?.findByProps?.('View', 'Text', 'ScrollView'))
    || safeRead(() => legacy?.metro?.findByProps?.('View', 'Text', 'ScrollView'))
    || safeRead(() => globalThis.ReactNative);
  const Forms = safeRead(() => revengeApi?.ui?.components?.Forms)
    || safeRead(() => legacy?.ui?.components?.Forms)
    || safeRead(() => injectedBunny?.ui?.components?.Forms)
    || safeRead(() => runtime?.ui?.components?.Forms)
    || safeRead(() => revengeApi?.ui?.components)
    || safeRead(() => legacy?.ui?.components);
  const logger = safeRead(() => revengeApi?.plugin?.logger)
    || safeRead(() => legacy?.logger)
    || safeRead(() => runtime?.logger)
    || safeRead(() => runtime?.plugin?.logger);
  const patcher = safeRead(() => revengeApi?.api?.patcher)
    || safeRead(() => revengeApi?.patcher)
    || safeRead(() => legacy?.patcher)
    || safeRead(() => injectedBunny?.patcher);
  const findByProps = safeRead(() => revengeApi?.metro?.findByPropsLazy)
    || safeRead(() => revengeApi?.metro?.findByProps)
    || safeRead(() => legacy?.metro?.findByPropsLazy)
    || safeRead(() => legacy?.metro?.findByProps)
    || safeRead(() => injectedBunny?.metro?.findByProps);
const h = React?.createElement?.bind(React);
const Animated = RN?.Animated;
const Text = RN?.Text;
const View = RN?.View;
const ScrollView = RN?.ScrollView;
const TextInput = RN?.TextInput;
const Switch = RN?.Switch;
const Pressable = RN?.Pressable || RN?.TouchableOpacity || RN?.Button;

const DEFAULT_SETTINGS = {
  enabled: false,
  targetName: '',
  fontStyle: 'medieval',
  colorEnabled: true,
  color: '#B69CFF',
  colorMode: 'solid',
  animationSpeed: 'normal',
  targetMatchMode: 'exact',
  caseSensitive: true,
  bold: false,
  italic: false,
  letterSpacing: 'normal',
  secondaryColor: '#55D6BE',
  reduceMotion: false,
  reverseAnimation: false,
};

const COLOR_MODE_OPTIONS = [
  { id: 'solid', label: 'Solid', sample: '●' },
  { id: 'rainbow', label: 'Prism / Rainbow', sample: '🌈' },
  { id: 'ocean', label: 'Ocean', sample: '🌊' },
  { id: 'sunset', label: 'Sunset', sample: '🌅' },
  { id: 'aurora', label: 'Aurora', sample: '✨' },
  { id: 'neon-pulse', label: 'Neon Pulse', sample: '💜' },
  { id: 'gummy', label: 'Gummy', sample: '🍬' },
  { id: 'fire', label: 'Fire', sample: '🔥' },
  { id: 'ice', label: 'Ice', sample: '🧊' },
  { id: 'rose', label: 'Rose', sample: '🌹' },
  { id: 'mint', label: 'Mint', sample: '🌿' },
  { id: 'cosmic', label: 'Cosmic', sample: '🌌' },
  { id: 'custom-cycle', label: 'Custom cycle', sample: '🎨' },
];
const SPEED_OPTIONS = [
  { id: 'very-slow', label: 'Very slow' },
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
];
const MATCH_MODE_OPTIONS = [
  { id: 'exact', label: 'Exact match', note: 'Safest: only the whole text must match.' },
  { id: 'contains', label: 'Contains', note: 'Styles only the matching name inside longer text.' },
  { id: 'starts-with', label: 'Starts with', note: 'Styles the starting part that matches your name.' },
];
const SPACING_OPTIONS = [
  { id: 'normal', label: 'Normal' },
  { id: 'loose', label: 'Loose' },
  { id: 'wide', label: 'Wide' },
];
const ANIMATION_DURATIONS = { 'very-slow': 16000, slow: 10000, normal: 6200, fast: 3400 };
const COLOR_PALETTES = {
  rainbow: { inputRange: [0,1,2,3,4,5,6], outputRange: ['#FF4D6D','#FFB84D','#F9F871','#55E6A5','#49C6FF','#A78BFA','#FF4D6D'] },
  ocean: { inputRange: [0,2,4,6], outputRange: ['#22D3EE','#38BDF8','#6366F1','#22D3EE'] },
  sunset: { inputRange: [0,2,4,6], outputRange: ['#FB7185','#F97316','#FACC15','#FB7185'] },
  aurora: { inputRange: [0,2,4,6], outputRange: ['#5EEAD4','#60A5FA','#C084FC','#5EEAD4'] },
  gummy: { inputRange: [0,1.5,3,4.5,6], outputRange: ['#FF8FAB','#F9A8D4','#C4B5FD','#93C5FD','#FF8FAB'] },
  fire: { inputRange: [0,2,4,6], outputRange: ['#FFD166','#FF7B00','#EF233C','#FFD166'] },
  ice: { inputRange: [0,2,4,6], outputRange: ['#D9F7FF','#67E8F9','#3B82F6','#D9F7FF'] },
  rose: { inputRange: [0,2,4,6], outputRange: ['#FDA4AF','#F472B6','#C084FC','#FDA4AF'] },
  mint: { inputRange: [0,2,4,6], outputRange: ['#BBF7D0','#34D399','#2DD4BF','#BBF7D0'] },
  cosmic: { inputRange: [0,2,4,6], outputRange: ['#7C3AED','#EC4899','#38BDF8','#7C3AED'] },
};

const FONT_OPTIONS = [
  {
    "id": "gg-sans",
    "label": "gg sans",
    "sample": "Darkio",
    "note": "Classic / unchanged text"
  },
  {
    "id": "tempo",
    "label": "Tempo",
    "sample": "𝗗𝗮𝗿𝗸𝗶𝗼",
    "note": "Bold sans approximation"
  },
  {
    "id": "sakura",
    "label": "Sakura",
    "sample": "𝒟𝒶𝓇𝓀𝒾𝑜",
    "note": "Script approximation"
  },
  {
    "id": "jellybean",
    "label": "Jellybean",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Double-struck approximation"
  },
  {
    "id": "modern",
    "label": "Modern",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Sans italic approximation"
  },
  {
    "id": "medieval",
    "label": "Medieval",
    "sample": "𝔇𝔞𝔯𝔨𝔦𝔬",
    "note": "Fraktur / blackletter"
  },
  {
    "id": "8bit",
    "label": "8Bit",
    "sample": "🄳🄰🅁🄺🄸🄾",
    "note": "Squared characters"
  },
  {
    "id": "vampyre",
    "label": "Vampyre",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Bold blackletter approximation"
  },
  {
    "id": "monkey-bars",
    "label": "Monkey Bars",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Circled / bubble approximation"
  },
  {
    "id": "mainframe",
    "label": "Mainframe",
    "sample": "𝙳𝚊𝚛𝚔𝚒𝚘",
    "note": "Monospace characters"
  },
  {
    "id": "headbang",
    "label": "Headbang",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Bold italic approximation"
  },
  {
    "id": "journal",
    "label": "Journal",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Italic serif approximation"
  },
  {
    "id": "bold-serif",
    "label": "Bold Serif",
    "sample": "𝐃𝐚𝐫𝐤𝐢𝐨",
    "note": "Extra style"
  },
  {
    "id": "italic-serif",
    "label": "Italic Serif",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Extra style"
  },
  {
    "id": "bold-italic",
    "label": "Bold Italic",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Extra style"
  },
  {
    "id": "bold-fraktur",
    "label": "Bold Fraktur",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Extra style"
  },
  {
    "id": "double-struck",
    "label": "Double-Struck",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Extra style"
  },
  {
    "id": "small-caps",
    "label": "Small Caps",
    "sample": "ᴅᴀʀᴋɪᴏ",
    "note": "Extra style"
  },
  {
    "id": "fullwidth",
    "label": "Fullwidth",
    "sample": "Ｄａｒｋｉｏ",
    "note": "Extra style"
  },
  {
    "id": "sans-italic",
    "label": "Sans Italic",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Extra style"
  },
  {
    "id": "bubble",
    "label": "Bubble Letters",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Extra style"
  }
];
const FONT_ALPHABET = {
  "gg-sans": "plain",
  "tempo": "bold-sans",
  "sakura": "script",
  "jellybean": "double-struck",
  "modern": "sans-italic",
  "medieval": "fraktur",
  "8bit": "squared",
  "vampyre": "bold-fraktur",
  "monkey-bars": "circled",
  "mainframe": "monospace",
  "headbang": "bold-italic",
  "journal": "italic-serif",
  "double-struck": "double-struck",
  "small-caps": "small-caps",
  "fullwidth": "fullwidth",
  "bold-serif": "bold-serif",
  "italic-serif": "italic-serif",
  "bold-italic": "bold-italic",
  "bold-fraktur": "bold-fraktur",
  "sans-italic": "sans-italic",
  "bubble": "bubble"
};
const ALPHABETS = {
  "plain": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]
  },
  "fraktur": {
    "upper": [
      "𝔄",
      "𝔅",
      "ℭ",
      "𝔇",
      "𝔈",
      "𝔉",
      "𝔊",
      "ℌ",
      "ℑ",
      "𝔍",
      "𝔎",
      "𝔏",
      "𝔐",
      "𝔑",
      "𝔒",
      "𝔓",
      "𝔔",
      "ℜ",
      "𝔖",
      "𝔗",
      "𝔘",
      "𝔙",
      "𝔚",
      "𝔛",
      "𝔜",
      "ℨ"
    ],
    "lower": [
      "𝔞",
      "𝔟",
      "𝔠",
      "𝔡",
      "ℯ",
      "𝔣",
      "ℊ",
      "𝔥",
      "𝔦",
      "𝔧",
      "𝔨",
      "𝔩",
      "𝔪",
      "𝔫",
      "ℴ",
      "𝔭",
      "𝔮",
      "𝔯",
      "𝔰",
      "𝔱",
      "𝔲",
      "𝔳",
      "𝔴",
      "𝔵",
      "𝔶",
      "𝔷"
    ]
  },
  "script": {
    "upper": [
      "𝒜",
      "ℬ",
      "𝒞",
      "𝒟",
      "ℰ",
      "ℱ",
      "𝒢",
      "ℋ",
      "ℐ",
      "𝒥",
      "𝒦",
      "ℒ",
      "ℳ",
      "𝒩",
      "𝒪",
      "𝒫",
      "𝒬",
      "ℛ",
      "𝒮",
      "𝒯",
      "𝒰",
      "𝒱",
      "𝒲",
      "𝒳",
      "𝒴",
      "𝒵"
    ],
    "lower": [
      "𝒶",
      "𝒷",
      "𝒸",
      "𝒹",
      "ℯ",
      "𝒻",
      "ℊ",
      "𝒽",
      "𝒾",
      "𝒿",
      "𝓀",
      "𝓁",
      "𝓂",
      "𝓃",
      "ℴ",
      "𝓅",
      "𝓆",
      "𝓇",
      "𝓈",
      "𝓉",
      "𝓊",
      "𝓋",
      "𝓌",
      "𝓍",
      "𝓎",
      "𝓏"
    ]
  },
  "double-struck": {
    "upper": [
      "𝔸",
      "𝔹",
      "ℂ",
      "𝔻",
      "𝔼",
      "𝔽",
      "𝔾",
      "ℍ",
      "𝕀",
      "𝕁",
      "𝕂",
      "𝕃",
      "𝕄",
      "ℕ",
      "𝕆",
      "ℙ",
      "ℚ",
      "ℝ",
      "𝕊",
      "𝕋",
      "𝕌",
      "𝕍",
      "𝕎",
      "𝕏",
      "𝕐",
      "ℤ"
    ],
    "lower": [
      "𝕒",
      "𝕓",
      "𝕔",
      "𝕕",
      "𝕖",
      "𝕗",
      "𝕘",
      "𝕙",
      "𝕚",
      "𝕛",
      "𝕜",
      "𝕝",
      "𝕞",
      "𝕟",
      "𝕠",
      "𝕡",
      "𝕢",
      "𝕣",
      "𝕤",
      "𝕥",
      "𝕦",
      "𝕧",
      "𝕨",
      "𝕩",
      "𝕪",
      "𝕫"
    ],
    "digits": [
      "𝟘",
      "𝟙",
      "𝟚",
      "𝟛",
      "𝟜",
      "𝟝",
      "𝟞",
      "𝟟",
      "𝟠",
      "𝟡"
    ]
  },
  "monospace": {
    "upper": [
      "𝙰",
      "𝙱",
      "𝙲",
      "𝙳",
      "𝙴",
      "𝙵",
      "𝙶",
      "𝙷",
      "𝙸",
      "𝙹",
      "𝙺",
      "𝙻",
      "𝙼",
      "𝙽",
      "𝙾",
      "𝙿",
      "𝚀",
      "𝚁",
      "𝚂",
      "𝚃",
      "𝚄",
      "𝚅",
      "𝚆",
      "𝚇",
      "𝚈",
      "𝚉"
    ],
    "lower": [
      "𝚊",
      "𝚋",
      "𝚌",
      "𝚍",
      "𝚎",
      "𝚏",
      "𝚐",
      "𝚑",
      "𝚒",
      "𝚓",
      "𝚔",
      "𝚕",
      "𝚖",
      "𝚗",
      "𝚘",
      "𝚙",
      "𝚚",
      "𝚛",
      "𝚜",
      "𝚝",
      "𝚞",
      "𝚟",
      "𝚠",
      "𝚡",
      "𝚢",
      "𝚣"
    ],
    "digits": [
      "𝟶",
      "𝟷",
      "𝟸",
      "𝟹",
      "𝟺",
      "𝟻",
      "𝟼",
      "𝟽",
      "𝟾",
      "𝟿"
    ]
  },
  "small-caps": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "ᴀ",
      "ʙ",
      "ᴄ",
      "ᴅ",
      "ᴇ",
      "ꜰ",
      "ɢ",
      "ʜ",
      "ɪ",
      "ᴊ",
      "ᴋ",
      "ʟ",
      "ᴍ",
      "ɴ",
      "ᴏ",
      "ᴘ",
      "ǫ",
      "ʀ",
      "ꜱ",
      "ᴛ",
      "ᴜ",
      "ᴠ",
      "ᴡ",
      "x",
      "ʏ",
      "ᴢ"
    ]
  },
  "fullwidth": {
    "upper": [
      "Ａ",
      "Ｂ",
      "Ｃ",
      "Ｄ",
      "Ｅ",
      "Ｆ",
      "Ｇ",
      "Ｈ",
      "Ｉ",
      "Ｊ",
      "Ｋ",
      "Ｌ",
      "Ｍ",
      "Ｎ",
      "Ｏ",
      "Ｐ",
      "Ｑ",
      "Ｒ",
      "Ｓ",
      "Ｔ",
      "Ｕ",
      "Ｖ",
      "Ｗ",
      "Ｘ",
      "Ｙ",
      "Ｚ"
    ],
    "lower": [
      "ａ",
      "ｂ",
      "ｃ",
      "ｄ",
      "ｅ",
      "ｆ",
      "ｇ",
      "ｈ",
      "ｉ",
      "ｊ",
      "ｋ",
      "ｌ",
      "ｍ",
      "ｎ",
      "ｏ",
      "ｐ",
      "ｑ",
      "ｒ",
      "ｓ",
      "ｔ",
      "ｕ",
      "ｖ",
      "ｗ",
      "ｘ",
      "ｙ",
      "ｚ"
    ],
    "digits": [
      "０",
      "１",
      "２",
      "３",
      "４",
      "５",
      "６",
      "７",
      "８",
      "９"
    ]
  },
  "bold-serif": {
    "upper": [
      "𝐀",
      "𝐁",
      "𝐂",
      "𝐃",
      "𝐄",
      "𝐅",
      "𝐆",
      "𝐇",
      "𝐈",
      "𝐉",
      "𝐊",
      "𝐋",
      "𝐌",
      "𝐍",
      "𝐎",
      "𝐏",
      "𝐐",
      "𝐑",
      "𝐒",
      "𝐓",
      "𝐔",
      "𝐕",
      "𝐖",
      "𝐗",
      "𝐘",
      "𝐙"
    ],
    "lower": [
      "𝐚",
      "𝐛",
      "𝐜",
      "𝐝",
      "𝐞",
      "𝐟",
      "𝐠",
      "𝐡",
      "𝐢",
      "𝐣",
      "𝐤",
      "𝐥",
      "𝐦",
      "𝐧",
      "𝐨",
      "𝐩",
      "𝐪",
      "𝐫",
      "𝐬",
      "𝐭",
      "𝐮",
      "𝐯",
      "𝐰",
      "𝐱",
      "𝐲",
      "𝐳"
    ],
    "digits": [
      "𝟎",
      "𝟏",
      "𝟐",
      "𝟑",
      "𝟒",
      "𝟓",
      "𝟔",
      "𝟕",
      "𝟖",
      "𝟗"
    ]
  },
  "italic-serif": {
    "upper": [
      "𝐴",
      "𝐵",
      "𝐶",
      "𝐷",
      "𝐸",
      "𝐹",
      "𝐺",
      "𝐻",
      "𝐼",
      "𝐽",
      "𝐾",
      "𝐿",
      "𝑀",
      "𝑁",
      "𝑂",
      "𝑃",
      "𝑄",
      "𝑅",
      "𝑆",
      "𝑇",
      "𝑈",
      "𝑉",
      "𝑊",
      "𝑋",
      "𝑌",
      "𝑍"
    ],
    "lower": [
      "𝑎",
      "𝑏",
      "𝑐",
      "𝑑",
      "𝑒",
      "𝑓",
      "𝑔",
      "ℎ",
      "𝑖",
      "𝑗",
      "𝑘",
      "𝑙",
      "𝑚",
      "𝑛",
      "𝑜",
      "𝑝",
      "𝑞",
      "𝑟",
      "𝑠",
      "𝑡",
      "𝑢",
      "𝑣",
      "𝑤",
      "𝑥",
      "𝑦",
      "𝑧"
    ]
  },
  "bold-italic": {
    "upper": [
      "𝑨",
      "𝑩",
      "𝑪",
      "𝑫",
      "𝑬",
      "𝑭",
      "𝑮",
      "𝑯",
      "𝑰",
      "𝑱",
      "𝑲",
      "𝑳",
      "𝑴",
      "𝑵",
      "𝑶",
      "𝑷",
      "𝑸",
      "𝑹",
      "𝑺",
      "𝑻",
      "𝑼",
      "𝑽",
      "𝑾",
      "𝑿",
      "𝒀",
      "𝒁"
    ],
    "lower": [
      "𝒂",
      "𝒃",
      "𝒄",
      "𝒅",
      "𝒆",
      "𝒇",
      "𝒈",
      "𝒉",
      "𝒊",
      "𝒋",
      "𝒌",
      "𝒍",
      "𝒎",
      "𝒏",
      "𝒐",
      "𝒑",
      "𝒒",
      "𝒓",
      "𝒔",
      "𝒕",
      "𝒖",
      "𝒗",
      "𝒘",
      "𝒙",
      "𝒚",
      "𝒛"
    ]
  },
  "bold-sans": {
    "upper": [
      "𝗔",
      "𝗕",
      "𝗖",
      "𝗗",
      "𝗘",
      "𝗙",
      "𝗚",
      "𝗛",
      "𝗜",
      "𝗝",
      "𝗞",
      "𝗟",
      "𝗠",
      "𝗡",
      "𝗢",
      "𝗣",
      "𝗤",
      "𝗥",
      "𝗦",
      "𝗧",
      "𝗨",
      "𝗩",
      "𝗪",
      "𝗫",
      "𝗬",
      "𝗭"
    ],
    "lower": [
      "𝗮",
      "𝗯",
      "𝗰",
      "𝗱",
      "𝗲",
      "𝗳",
      "𝗴",
      "𝗵",
      "𝗶",
      "𝗷",
      "𝗸",
      "𝗹",
      "𝗺",
      "𝗻",
      "𝗼",
      "𝗽",
      "𝗾",
      "𝗿",
      "𝘀",
      "𝘁",
      "𝘂",
      "𝘃",
      "𝘄",
      "𝘅",
      "𝘆",
      "𝘇"
    ],
    "digits": [
      "𝟬",
      "𝟭",
      "𝟮",
      "𝟯",
      "𝟰",
      "𝟱",
      "𝟲",
      "𝟳",
      "𝟴",
      "𝟵"
    ]
  },
  "bold-fraktur": {
    "upper": [
      "𝕬",
      "𝕭",
      "𝕮",
      "𝕯",
      "𝕰",
      "𝕱",
      "𝕲",
      "𝕳",
      "𝕴",
      "𝕵",
      "𝕶",
      "𝕷",
      "𝕸",
      "𝕹",
      "𝕺",
      "𝕻",
      "𝕼",
      "𝕽",
      "𝕾",
      "𝕿",
      "𝖀",
      "𝖁",
      "𝖂",
      "𝖃",
      "𝖄",
      "𝖅"
    ],
    "lower": [
      "𝖆",
      "𝖇",
      "𝖈",
      "𝖉",
      "𝖊",
      "𝖋",
      "𝖌",
      "𝖍",
      "𝖎",
      "𝖏",
      "𝖐",
      "𝖑",
      "𝖒",
      "𝖓",
      "𝖔",
      "𝖕",
      "𝖖",
      "𝖗",
      "𝖘",
      "𝖙",
      "𝖚",
      "𝖛",
      "𝖜",
      "𝖝",
      "𝖞",
      "𝖟"
    ]
  },
  "sans-italic": {
    "upper": [
      "𝘈",
      "𝘉",
      "𝘊",
      "𝘋",
      "𝘌",
      "𝘍",
      "𝘎",
      "𝘏",
      "𝘐",
      "𝘑",
      "𝘒",
      "𝘓",
      "𝘔",
      "𝘕",
      "𝘖",
      "𝘗",
      "𝘘",
      "𝘙",
      "𝘚",
      "𝘛",
      "𝘜",
      "𝘝",
      "𝘞",
      "𝘟",
      "𝘠",
      "𝘡"
    ],
    "lower": [
      "𝘢",
      "𝘣",
      "𝘤",
      "𝘥",
      "𝘦",
      "𝘧",
      "𝘨",
      "𝘩",
      "𝘪",
      "𝘫",
      "𝘬",
      "𝘭",
      "𝘮",
      "𝘯",
      "𝘰",
      "𝘱",
      "𝘲",
      "𝘳",
      "𝘴",
      "𝘵",
      "𝘶",
      "𝘷",
      "𝘸",
      "𝘹",
      "𝘺",
      "𝘻"
    ]
  },
  "circled": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "squared": {
    "upper": [
      "🄰",
      "🄱",
      "🄲",
      "🄳",
      "🄴",
      "🄵",
      "🄶",
      "🄷",
      "🄸",
      "🄹",
      "🄺",
      "🄻",
      "🄼",
      "🄽",
      "🄾",
      "🄿",
      "🅀",
      "🅁",
      "🅂",
      "🅃",
      "🅄",
      "🅅",
      "🅆",
      "🅇",
      "🅈",
      "🅉"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "bubble": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  }
};

let apiStorage = null;
function readSettings() {
  const out = { ...DEFAULT_SETTINGS };
  const apiCache = safeRead(() => apiStorage?.cache);
  const source = { ...(apiCache && typeof apiCache === 'object' ? apiCache : {}), ...(storage || {}) };
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (source[key] !== undefined && source[key] !== null) out[key] = source[key];
  }
  if (!FONT_ALPHABET[out.fontStyle]) out.fontStyle = DEFAULT_SETTINGS.fontStyle;
  if (!COLOR_MODE_OPTIONS.some(x => x.id === out.colorMode)) out.colorMode = DEFAULT_SETTINGS.colorMode;
  if (!SPEED_OPTIONS.some(x => x.id === out.animationSpeed)) out.animationSpeed = DEFAULT_SETTINGS.animationSpeed;
  if (!MATCH_MODE_OPTIONS.some(x => x.id === out.targetMatchMode)) out.targetMatchMode = DEFAULT_SETTINGS.targetMatchMode;
  if (!SPACING_OPTIONS.some(x => x.id === out.letterSpacing)) out.letterSpacing = DEFAULT_SETTINGS.letterSpacing;
  if (!validHexColor(out.color)) out.color = DEFAULT_SETTINGS.color;
  if (!validHexColor(out.secondaryColor)) out.secondaryColor = DEFAULT_SETTINGS.secondaryColor;
  out.enabled = !!out.enabled;
  out.caseSensitive = !!out.caseSensitive;
  out.colorEnabled = !!out.colorEnabled;
  out.bold = !!out.bold;
  out.italic = !!out.italic;
  out.reduceMotion = !!out.reduceMotion;
  out.reverseAnimation = !!out.reverseAnimation;
  out.targetName = typeof out.targetName === 'string' ? out.targetName : '';
  return out;
}
function writeSettings(partial) {
  if (storage) for (const [key, value] of Object.entries(partial)) storage[key] = value;
  const next = { ...readSettings(), ...partial };
  if (storage) for (const [key, value] of Object.entries(next)) storage[key] = value;
  // Spec-3 storage is supported when a host passes it through, but the primary
  // build deliberately exports the Classic/Vendetta plugin shape.
  try { const pending = apiStorage?.set?.(next); pending?.catch?.(() => {}); } catch (_) {}
  syncAnimation(next);
}
function validHexColor(value) { return /^#[0-9a-fA-F]{6}$/.test(value || ''); }
function lightenHex(hex, amount) {
  if (!validHexColor(hex)) hex = '#B69CFF';
  const values = [1,3,5].map(i => parseInt(hex.slice(i, i+2), 16));
  return '#' + values.map(v => Math.round(v + (255-v)*(amount ?? 0.42)).toString(16).padStart(2,'0')).join('');
}
function mapText(input, style) {
  const map = ALPHABETS[FONT_ALPHABET[style]] || ALPHABETS.fraktur;
  return Array.from(input, char => {
    const code = char.codePointAt(0);
    if (style === '8bit') {
      const up = char.toUpperCase().codePointAt(0);
      if (up >= 65 && up <= 90) return map.upper[up - 65] || char;
      return char;
    }
    if (code >= 65 && code <= 90) return map.upper[code - 65] || char;
    if (code >= 97 && code <= 122) return map.lower[code - 97] || char;
    if (code >= 48 && code <= 57 && map.digits) return map.digits[code - 48] || char;
    return char;
  }).join('');
}

let storage = Object.create(null);
let colorProgress;
let colorLoop;
let colorLoopKey = '';
const unpatches = [];
function getProgress() {
  if (!colorProgress && Animated?.Value) colorProgress = new Animated.Value(0);
  return colorProgress;
}
function stopAnimation() {
  try { colorLoop?.stop?.(); } catch (_) {}
  colorLoop = null;
  colorLoopKey = '';
  try { colorProgress?.setValue?.(0); } catch (_) {}
}
function syncAnimation(settings) {
  const shouldAnimate = !!Animated && settings.enabled && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid';
  if (!shouldAnimate) { if (colorLoop) stopAnimation(); return; }
  const key = settings.colorMode + ':' + settings.animationSpeed + ':' + !!settings.reverseAnimation + ':' + settings.color + ':' + settings.secondaryColor;
  if (colorLoop && colorLoopKey === key) return;
  try { colorLoop?.stop?.(); } catch (_) {}
  const progress = getProgress();
  if (!progress) return;
  progress.setValue(0);
  const duration = ANIMATION_DURATIONS[settings.animationSpeed] || ANIMATION_DURATIONS.normal;
  const forward = Animated.timing(progress, { toValue: 6, duration, useNativeDriver: false, isInteraction: false });
  const animation = settings.reverseAnimation && typeof Animated.sequence === 'function'
    ? Animated.sequence([forward, Animated.timing(progress, { toValue: 0, duration, useNativeDriver: false, isInteraction: false })])
    : forward;
  colorLoop = Animated.loop(animation);
  colorLoopKey = key;
  colorLoop.start();
}
function colorValue(settings) {
  if (!settings.colorEnabled) return undefined;
  const safeCustom = validHexColor(settings.color) ? settings.color : '#B69CFF';
  if (settings.colorMode === 'solid' || settings.reduceMotion) return safeCustom;
  const progress = getProgress();
  if (!progress) return safeCustom;
  if (settings.colorMode === 'neon-pulse') return progress.interpolate({
    inputRange: [0,3,6], outputRange: [lightenHex(safeCustom), safeCustom, lightenHex(safeCustom)], extrapolate: 'clamp'
  });
  if (settings.colorMode === 'custom-cycle') {
    const second = validHexColor(settings.secondaryColor) ? settings.secondaryColor : '#55D6BE';
    return progress.interpolate({ inputRange: [0,3,6], outputRange: [safeCustom, second, safeCustom], extrapolate: 'clamp' });
  }
  const palette = COLOR_PALETTES[settings.colorMode] || COLOR_PALETTES.rainbow;
  return progress.interpolate({ inputRange: palette.inputRange, outputRange: palette.outputRange, extrapolate: 'clamp' });
}
function transformTextForSettings(input, settings) {
  const target = (settings.targetName || '').trim();
  if (!target) return input;
  const normalize = value => settings.caseSensitive ? value : value.toLocaleLowerCase();
  const haystack = normalize(input);
  const needle = normalize(target);
  const mode = settings.targetMatchMode || 'exact';
  if (mode === 'exact') return haystack.trim() === needle ? mapText(input, settings.fontStyle) : input;
  if (mode === 'starts-with') {
    const leading = input.length - input.trimStart().length;
    const visible = input.slice(leading);
    if (!normalize(visible).startsWith(needle)) return input;
    return input.slice(0, leading) + mapText(visible.slice(0, target.length), settings.fontStyle) + visible.slice(target.length);
  }
  // Replace all exact occurrences while leaving adjacent text and punctuation alone.
  let result = '';
  let cursor = 0;
  let found = haystack.indexOf(needle, cursor);
  if (found < 0) return input;
  while (found >= 0) {
    result += input.slice(cursor, found) + mapText(input.slice(found, found + target.length), settings.fontStyle);
    cursor = found + target.length;
    found = haystack.indexOf(needle, cursor);
  }
  return result + input.slice(cursor);
}
function textMatchesSettings(input, settings) {
  const target = (settings.targetName || '').trim();
  if (!target || typeof input !== 'string') return false;
  const normalize = value => settings.caseSensitive ? value : value.toLocaleLowerCase();
  const source = normalize(input.trim());
  const needle = normalize(target);
  if (settings.targetMatchMode === 'contains') return source.includes(needle);
  if (settings.targetMatchMode === 'starts-with') return source.startsWith(needle);
  return source === needle;
}
function patchElementArgs(_thisObject, args) {
  // Bunny/Revenge Classic's before() callback receives (thisObject, args).
  // The argument array must be mutated; returning a replacement array is ignored.
  try {
    if (!Array.isArray(args) || args.length < 2) return;
    const settings = readSettings();
    const type = args[0];
    const props = args[1];
    if (!settings.enabled || !settings.targetName?.trim() || !props || typeof props !== 'object') return;
    const children = props.children;
    if (typeof children !== 'string' || !textMatchesSettings(children, settings)) return;

    const typeName = type?.displayName || type?.name || type?.render?.displayName || type?.render?.name || '';
    const isKnownText = type === Text || type === RN?.Text || type === Animated?.Text;
    const looksLikeText = typeof typeName === 'string' && /text/i.test(typeName);
    // Discord may render usernames through custom Text wrappers. Exact-string matching
    // plus a style prop lets these wrappers pass through while keeping other content alone.
    if (!isKnownText && !looksLikeText && props.style === undefined) return;

    const nextProps = { ...props, children: transformTextForSettings(children, settings) };
    const nextColor = colorValue(settings);
    const stylePatch = {};
    if (nextColor !== undefined) stylePatch.color = nextColor;
    if (settings.bold) stylePatch.fontWeight = '700';
    if (settings.italic) stylePatch.fontStyle = 'italic';
    if (settings.letterSpacing === 'loose') stylePatch.letterSpacing = 0.35;
    if (settings.letterSpacing === 'wide') stylePatch.letterSpacing = 0.8;
    if (Object.keys(stylePatch).length) nextProps.style = [props.style, stylePatch];

    // Animated.Text is only substituted for native Text; preserve custom Discord wrappers.
    const nativeText = type === Text || type === RN?.Text;
    const useAnimated = nativeText && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid' && !!Animated?.Text;
    args[0] = useAnimated ? Animated.Text : type;
    args[1] = nextProps;
  } catch (e) {
    logger?.warn?.('Could not transform a matching text element', e);
  }
}
function addPatcher(target, method) {
  if (!target || typeof target[method] !== 'function' || !patcher?.before) return;
  try {
    // Correct API order: before(targetObject, methodName, callback).
    const unpatch = patcher.before(target, method, patchElementArgs);
    if (typeof unpatch === 'function') unpatches.push(unpatch);
  } catch (e) { logger?.warn?.('Could not patch ' + method, e); }
}

function rowLabel(label, note) {
  return h(View, { style: { gap: 3, marginTop: 5 } },
    h(Text, { style: { color: '#F4F0FF', fontWeight: '700' } }, label),
    note ? h(Text, { style: { color: '#AAA7B5', fontSize: 12 } }, note) : null
  );
}
function choiceButton(label, active, onPress, sample) {
  return h(Pressable, {
    onPress,
    style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 10, padding: 11, marginBottom: 7, gap: 4 }
  },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '500' } }, label + (active ? '  ✓' : '')),
    sample ? h(Text, { style: { color: '#F5F2FF', fontSize: 18 } }, sample) : null
  );
}
function chip(label, active, onPress) {
  return h(Pressable, { onPress, style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 11, marginRight: 7, marginBottom: 7 } },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '400' } }, label + (active ? ' ✓' : ''))
  );
}
function toggleControl(value, onValueChange) {
  if (Switch) return h(Switch, { value: !!value, onValueChange });
  return h(Pressable, {
    onPress: () => onValueChange(!value),
    style: { borderWidth: 1, borderColor: value ? '#B69CFF' : '#4A4857', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 12 }
  }, h(Text, { style: { color: '#F5F2FF', fontWeight: '700' } }, value ? 'ON' : 'OFF'));
}
function SettingsComponent(props = {}) {
  if (!React || !h || typeof React.useState !== 'function') {
    return h && Forms?.FormSection && Forms?.FormRow
      ? h(Forms.FormSection, { title: 'Darkio Fonty Fun · V5' }, h(Forms.FormRow, { label: 'Settings unavailable', subLabel: 'This client did not expose the React settings runtime.' }))
      : null;
  }

  // V5 deliberately removes tap-to-select rows. Every control is a text input,
  // because the older Classic FormRow implementation shown in some clients
  // renders rows but ignores the onPress prop.
  const suppliedStorage = safeRead(() => props?.api?.jsonStorage) || safeRead(() => props?.jsonStorage);
  if (suppliedStorage && typeof suppliedStorage === 'object') apiStorage = suppliedStorage;
  const liveSettings = safeRead(() => suppliedStorage?.use?.());
  if (liveSettings && typeof liveSettings === 'object') {
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (storage[key] === undefined && liveSettings[key] !== undefined) storage[key] = liveSettings[key];
    }
  }
  const settings = readSettings();
  const [enabledDraft, setEnabledDraft] = React.useState(settings.enabled ? '1' : '0');
  const [nameDraft, setNameDraft] = React.useState(settings.targetName || '');
  const [fontDraft, setFontDraft] = React.useState(String(Math.max(0, FONT_OPTIONS.findIndex(option => option.id === settings.fontStyle))));
  const colorIndex = Math.max(0, COLOR_MODE_OPTIONS.findIndex(option => option.id === settings.colorMode));
  const [colorDraft, setColorDraft] = React.useState(settings.colorMode === 'solid' ? settings.color : String(colorIndex));
  const animationIndex = settings.reduceMotion ? 0 : ({ 'very-slow': 1, slow: 2, normal: 3, fast: 4 }[settings.animationSpeed] || 3);
  const [animationDraft, setAnimationDraft] = React.useState(String(animationIndex));

  const update = partial => writeSettings(partial);
  const validNumber = (value, min, max) => /^\d+$/.test(String(value).trim()) && Number(value) >= min && Number(value) <= max;
  const onEnabled = value => {
    setEnabledDraft(value);
    if (value === '0' || value === '1') update({ enabled: value === '1' });
  };
  const onName = value => { setNameDraft(value); update({ targetName: value }); };
  const onFont = value => {
    setFontDraft(value);
    if (validNumber(value, 0, FONT_OPTIONS.length - 1)) update({ fontStyle: FONT_OPTIONS[Number(value)].id });
  };
  const onColor = value => {
    setColorDraft(value);
    if (validNumber(value, 0, COLOR_MODE_OPTIONS.length - 1)) {
      update({ colorMode: COLOR_MODE_OPTIONS[Number(value)].id, colorEnabled: true });
    } else if (validHexColor(String(value).trim())) {
      update({ color: String(value).trim().toUpperCase(), colorMode: 'solid', colorEnabled: true, reduceMotion: true });
    }
  };
  const onAnimation = value => {
    setAnimationDraft(value);
    if (validNumber(value, 0, 4)) {
      const id = Number(value);
      const speed = ({ 1: 'very-slow', 2: 'slow', 3: 'normal', 4: 'fast' })[id] || 'normal';
      update({ reduceMotion: id === 0, animationSpeed: speed });
    }
  };

  const titleStyle = { color: '#F4F0FF', fontWeight: '700', fontSize: 15, marginBottom: 5 };
  const noteStyle = { color: '#AAA7B5', fontSize: 12, lineHeight: 17, marginBottom: 6 };
  const inputStyle = { borderWidth: 1, borderColor: '#4A4857', borderRadius: 10, paddingVertical: 11, paddingHorizontal: 12, color: '#F5F2FF', backgroundColor: '#1C1B24', marginBottom: 13, minHeight: 44 };
  const textStyle = { color: '#E5E0F1', fontSize: 12, lineHeight: 18 };
  const headingStyle = { color: '#B69CFF', fontWeight: '800', fontSize: 13, marginTop: 13, marginBottom: 5, letterSpacing: 0.5 };
  const fontsList = FONT_OPTIONS.map((option, index) => `${index} = ${option.label} · ${option.sample}`).join('\n');
  const colorsList = COLOR_MODE_OPTIONS.map((option, index) => `${index} = ${option.label}`).join('\n');
  const animationsList = '0 = Off (static color)\n1 = Very slow\n2 = Slow\n3 = Normal\n4 = Fast';
  const target = settings.targetName || 'Darkio';
  const preview = mapText(target, settings.fontStyle);
  const previewColor = colorValue(settings) || '#FFFFFF';

  const inputField = (key, label, note, value, placeholder, onChange, keyboardType = 'default', autoCapitalize = 'none') => {
    const commonProps = { key, value, placeholder, onChange, title: label, subLabel: note, autoCapitalize, autoCorrect: false, keyboardType };
    if (TextInput) {
      return h(View, { key: key + '-field', style: { marginBottom: 4 } },
        h(Text, { style: titleStyle }, label),
        h(Text, { style: noteStyle }, note),
        h(TextInput, { value, onChangeText: onChange, placeholder, placeholderTextColor: '#8A8795', autoCapitalize, autoCorrect: false, keyboardType, style: inputStyle })
      );
    }
    if (Forms?.FormInput) return h(Forms.FormInput, commonProps);
    return h(Forms?.FormRow || Text, { key, label, subLabel: note + ' Input controls are not exposed by this client.' });
  };
  const legend = (key, title, content) => h(View, { key, style: { marginTop: 6, padding: 11, borderRadius: 10, backgroundColor: '#1B1924', borderWidth: 1, borderColor: '#343044' } },
    h(Text, { style: headingStyle }, title),
    h(Text, { selectable: true, style: textStyle }, content)
  );

  const nativeAvailable = !!(View && Text && (TextInput || Forms?.FormInput));
  if (nativeAvailable) {
    const Container = ScrollView || View;
    return h(Container, { style: { flex: 1, backgroundColor: '#232229' }, contentContainerStyle: { padding: 16, paddingBottom: 28, gap: 2 }, keyboardShouldPersistTaps: 'handled' },
      h(Text, { style: { color: '#AAA7B5', fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 8 } }, 'DARKIO FONTY FUN · V5'),
      h(Text, { style: { color: '#F5F2FF', fontSize: 21, fontWeight: '800', marginBottom: 4 } }, 'Simple controls · No dead buttons'),
      h(Text, { style: { color: '#AAA7B5', fontSize: 13, lineHeight: 19, marginBottom: 12 } }, 'Type a number or value in each bar. Valid values apply automatically. You do not need to tap font, color, or animation choices.'),
      inputField('enabled', '1. Enable styling (0 or 1)', '1 = on · 0 = off. The plugin must also be enabled in Revenge.', enabledDraft, '1', onEnabled, 'numeric'),
      inputField('display-name', '2. Display name', 'Enter the name to match in Discord. Exact match is the default.', nameDraft, 'Your display name', onName),
      inputField('font-id', '3. Unicode font number', 'Enter 0–20. See the FONT NUMBERS list below.', fontDraft, 'For example: 5', onFont, 'numeric'),
      inputField('color-id', '4. Color number or hex color', 'Enter color/effect ID 0–12, or a hex color such as #B69CFF. See COLOR NUMBERS below.', colorDraft, 'For example: 1 or #B69CFF', onColor, 'default', 'characters'),
      inputField('animation-id', '5. Animation number', 'Enter 0–4. 0 stops motion; 1–4 choose the speed.', animationDraft, 'For example: 3', onAnimation, 'numeric'),
      h(View, { style: { borderRadius: 12, backgroundColor: '#1B1924', padding: 14, marginTop: 2, marginBottom: 8 } },
        h(Text, { style: headingStyle }, 'LIVE PREVIEW'),
        Animated?.Text && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid'
          ? h(Animated.Text, { style: { fontSize: 25, fontWeight: settings.bold ? '800' : '700', fontStyle: settings.italic ? 'italic' : 'normal', color: previewColor } }, preview)
          : h(Text, { style: { fontSize: 25, fontWeight: settings.bold ? '800' : '700', fontStyle: settings.italic ? 'italic' : 'normal', color: typeof previewColor === 'string' ? previewColor : '#B69CFF' } }, preview),
        h(Text, { style: { color: '#AAA7B5', fontSize: 11, marginTop: 4 } }, settings.enabled ? 'Styling is ON' : 'Styling is OFF')
      ),
      legend('font-numbers', 'FONT NUMBERS · 0–20', fontsList),
      legend('color-numbers', 'COLOR NUMBERS · 0–12', colorsList),
      legend('animation-numbers', 'ANIMATION NUMBERS · 0–4', animationsList),
      h(Text, { style: { color: '#918C9F', fontSize: 11, lineHeight: 16, marginTop: 12 } }, 'Local-only display styling. This does not change your public Discord profile name. If a number is outside the listed range, the previous valid setting remains active.')
    );
  }

  // Conservative legacy fallback: every interactive setting remains a text input;
  // do not render FormRow items with onPress, because some Classic builds ignore it.
  if (Forms?.FormSection && (Forms?.FormInput || Forms?.FormRow)) {
    return h(Forms.FormSection, { title: 'Darkio Fonty Fun · V5' },
      h(Text, { style: { color: '#AAA7B5' } }, 'Enter values in the five text fields. Numeric mappings are listed below each field.'),
      inputField('enabled', '1. Enable styling (0 or 1)', '1 = on · 0 = off', enabledDraft, '1', onEnabled, 'numeric'),
      inputField('display-name', '2. Display name', 'Name to match', nameDraft, 'Your display name', onName),
      inputField('font-id', '3. Unicode font number', fontsList, fontDraft, '0–20', onFont, 'numeric'),
      inputField('color-id', '4. Color number or hex', colorsList, colorDraft, '0–12 or #RRGGBB', onColor),
      inputField('animation-id', '5. Animation number', animationsList, animationDraft, '0–4', onAnimation, 'numeric')
    );
  }
  return h && Text ? h(Text, null, 'Darkio Fonty Fun requires a settings runtime with text inputs. The previous tap-to-select controls have been removed in V5.') : null;
}

const lifecycle = {
  start(context = {}) {
    const suppliedStorage = safeRead(() => context?.jsonStorage);
    if (suppliedStorage && typeof suppliedStorage === 'object') apiStorage = suppliedStorage;
    if (!React || !h) {
      logger?.error?.('Darkio Fonty Fun: React was not available; settings and rendering hooks could not be initialized.');
      return;
    }
    // createStorage is available in some Revenge Classic/Bunny builds too; do
    // not gate it on the newer spec-3 loader check.
    const persistentStorage = safeRead(() => legacy?.plugin?.storage)
      || safeRead(() => revengeApi?.plugin?.storage)
      || safeRead(() => legacy?.storage)
      || safeRead(() => revengeApi?.plugin?.createStorage?.());
    if (persistentStorage && typeof persistentStorage === 'object') storage = persistentStorage;
    else logger?.warn?.('Darkio Fonty Fun: persistent storage is unavailable; settings will last only for this session.');
    const savedApiSettings = safeRead(() => apiStorage?.cache);
    if (savedApiSettings && typeof savedApiSettings === 'object') {
      for (const [key, value] of Object.entries(savedApiSettings)) if (Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) storage[key] = value;
    }
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) if (storage[key] === undefined) storage[key] = value;
    if (apiStorage && !savedApiSettings) {
      try { const pending = apiStorage.set?.({ ...DEFAULT_SETTINGS }); pending?.catch?.(() => {}); } catch (_) {}
    }
    // React Native's classic JSX transform uses createElement. Some Discord builds use jsx/jsxs helpers.
    addPatcher(React, 'createElement');
    try {
      const jsxRuntime = findByProps?.('jsx', 'jsxs');
      if (jsxRuntime) { addPatcher(jsxRuntime, 'jsx'); addPatcher(jsxRuntime, 'jsxs'); if (typeof jsxRuntime.jsxDEV === 'function') addPatcher(jsxRuntime, 'jsxDEV'); }
    } catch (_) {}
    syncAnimation(readSettings());
    logger?.log?.('Darkio Fonty Fun started (local rendering only).');
  },
  stop() {
    stopAnimation();
    while (unpatches.length) { try { unpatches.pop()(); } catch (_) {} }
    logger?.log?.('Darkio Fonty Fun stopped.');
  },
  SettingsComponent,
};

  // Classic/Vendetta plugin shape, matching the known-working reference plugins.
  // The settings key is intentional: Classic's wrench invokes this function.
  return {
    // Classic Vendetta/Bunny lifecycle names.
    onLoad: lifecycle.start,
    onUnload: lifecycle.stop,
    settings: lifecycle.SettingsComponent,
    // Newer Revenge lifecycle aliases. Unknown fields are harmless to Classic.
    start: lifecycle.start,
    stop: lifecycle.stop,
    SettingsComponent: lifecycle.SettingsComponent,
  };
})())
