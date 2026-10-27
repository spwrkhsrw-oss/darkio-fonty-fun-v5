# Darkio Fonty Fun V5 — 5.0.0

V5 replaces the unreliable tap-to-select rows with **five text inputs**. Type values into the bars; valid values apply as you type. The settings page prioritizes native React Native inputs before any classic Forms fallback, because some Revenge Classic builds display `FormRow` items but do not fire their `onPress` handlers.

## Install with GitHub Pages

1. Extract this ZIP and upload the contents of `darkio-fonty-fun-v5/` to the root of your existing repository, replacing old files at the same paths.
2. In GitHub, open **Settings → Pages** and enable deployment from branch `main`, folder `/(root)`.
3. Open the published Pages URL. Use the site base URL or manifest URL according to what the Revenge Classic repository-import screen asks for.
4. Refresh/update the plugin in Revenge Classic.

GitHub Pages changes where the files are hosted; compatibility still depends on the API exposed by the installed Revenge Classic version.

## V5 settings: exactly five input bars

1. **Enable styling** — `0 = off`, `1 = on`. The plugin must also be enabled in Revenge's plugin list.
2. **Display name** — exact name to match (the matching mode remains exact to avoid changing unrelated text).
3. **Unicode font number** — choose one from the list below.
4. **Color number or hex color** — enter a palette/effect ID from the list below, or a hex color such as `#B69CFF` to use a custom solid color.
5. **Animation number** — choose a speed/motion mode from the list below.

### Unicode font numbers (0–20)

| Number | Font | Number | Font |
|---:|---|---:|---|
| 0 | gg sans / unchanged | 11 | Journal |
| 1 | Tempo (bold sans) | 12 | Bold Serif |
| 2 | Sakura (script) | 13 | Italic Serif |
| 3 | Jellybean (double-struck) | 14 | Bold Italic |
| 4 | Modern (sans italic) | 15 | Bold Fraktur |
| 5 | Medieval (Fraktur) | 16 | Double-Struck |
| 6 | 8Bit (squared) | 17 | Small Caps |
| 7 | Vampyre (bold blackletter) | 18 | Fullwidth |
| 8 | Monkey Bars (circled) | 19 | Sans Italic |
| 9 | Mainframe (monospace) | 20 | Bubble Letters |
| 10 | Headbang (bold italic) |  |  |

### Color numbers (0–12)

| Number | Color/effect |
|---:|---|
| 0 | Solid custom color (or enter `#RRGGBB`) |
| 1 | Rainbow |
| 2 | Ocean |
| 3 | Sunset |
| 4 | Aurora |
| 5 | Neon Pulse |
| 6 | Gummy |
| 7 | Fire |
| 8 | Ice |
| 9 | Rose |
| 10 | Mint |
| 11 | Cosmic |
| 12 | Custom Cycle (primary color + built-in secondary color) |

### Animation numbers (0–4)

| Number | Animation setting |
|---:|---|
| 0 | Off / reduce motion |
| 1 | Very slow |
| 2 | Slow |
| 3 | Normal |
| 4 | Fast |

If an ID is out of range, the text bar still allows editing, but the last valid setting remains applied until a valid value is entered. Color palette IDs only animate if animation is not set to `0`.

## Privacy and limitations

- Styling is local rendering only. It does not change the account's public Discord profile name.
- Unicode look-alikes vary across operating systems and fonts.
- This plugin does not read authentication tokens or make network requests.
- The bundle has been syntax-checked and mock-tested for five-input settings rendering. It has not been live-tested on every Revenge Classic version or device.
