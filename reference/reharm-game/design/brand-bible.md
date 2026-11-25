# REHARM — Brand Identity & Art Direction Bible

> **Tagline:** *Four bars. One melody. Endless harmony.*  
> **Design Thesis:** Tactile studio hardware (**Teenage Engineering OP-1 / midnight Fender Rhodes Stage Mk II**) meets **NYT Games** editorial daily-puzzle restraint.

---

## 1. Visual Philosophy & Aesthetic Pillars

REHARM sits at the intersection of two beloved daily rituals: sitting down at a warm electric piano in a dimly lit studio and opening a crisp morning word puzzle. Neither sterile conservatory software nor neon synthwave arcade.

1. **Machined Tactility, Not Skeuomorphic Clutter**
   - Surfaces feel like brushed matte anodized aluminum (`#191B20`) with crisp `1px` machined hairlines (`#2B2F3A`), recessed OLED wells (`#0C0D10`), and beveled hardware keycaps with a subtle `1px` top specular highlight and `2px` bottom press lip.
   - Zero noisy drop-shadows, zero blurry glassmorphism rainbows, zero generic purple SaaS gradients.
2. **NYT Games Editorial Calm**
   - Generous negative space around the 4-bar studio frame.
   - Strictly **zero staff notation or conservatory jargon gates**. Melody notes appear as clean pitch-contour pills on a dark OLED timeline well; chord symbols render in tabular monospace (`CMaj7`, `AbMaj7`, `Db7#11`) with unambiguous brass locks and Spice Tier indicators.
3. **Warm Hardware Feedback Over Punishing Red Errors**
   - Even a dissonant harmonic clash (`C` melody note against `BMaj7`) feels like a friendly studio engineer tapping the glass (`#2E1618` warm umber-rose with `#FCA5A5` readable copy) rather than a harsh "WRONG ANSWER" alarm.
4. **Dual-Coding Everything (Color + Shape + Label)**
   - Every Harmonic Spice Tier and bar state pairs its color with a distinct geometric icon or border pattern so color-vision-deficient players can read the board instantaneously.

---

## 2. Color System & Verified WCAG AA Contrast Matrix

### 2.1 Dark Theme — *"Midnight Studio"* (Default)

| Role | Token | Hex / Value | Usage |
| :--- | :--- | :--- | :--- |
| Canvas | `--bg-canvas` | `#111215` | Deep matte studio chassis |
| Surface | `--bg-surface` | `#191B20` | Primary hardware cards, bottom input drawer, modals |
| Elevated | `--bg-elevated` | `#22252C` | Interactive keycaps, root/quality buttons, pills |
| Well (Recessed) | `--bg-well` | `#0C0D10` | Melody OLED timeline display, meter tracks, share card box |
| Border Subtle | `--border-subtle` | `#2B2F3A` | Machined hairline dividers |
| Border Strong | `--border-strong` | `#3E4454` | Active focus frames, hovered hardware keys |
| Ink Primary | `--text-primary` | `#F4F1EA` | Warm silkscreened ivory (`15.27:1` on surface) |
| Ink Secondary | `--text-secondary` | `#B2B6C2` | Brushed aluminum copy, subtitles (`8.50:1` on surface) |
| Ink Muted | `--text-muted` | `#8D93A3` | Bar numbers, timestamps, secondary hints (`4.99:1` on elevated) |
| Primary Hardware | `--accent-primary` | `#E8A849` | Warm Rhodes amber: active selection, playhead, primary CTAs |
| Primary Ink | `--accent-primary-ink` | `#14120E` | Ink inside amber hardware buttons (`9.02:1`) |
| Anchored Brass | `--accent-brass` | `#D8AD66` | Locked/anchored bar badge & brass chassis frame (`#1C1A16` bg) |

### 2.2 Light Theme — *"Daylight Studio"* (Optional Theme)

Warm stone studio paper (`#F4F1EA`) inspired by NYT Games newsprint and silver Braun/TE hardware:

| Role | Token | Hex / Value | Usage |
| :--- | :--- | :--- | :--- |
| Canvas | `--bg-canvas` | `#F4F1EA` | Warm studio newsprint |
| Surface | `--bg-surface` | `#FFFFFF` | Crisp white hardware modules & drawers |
| Elevated | `--bg-elevated` | `#EAE5DB` | Tactile light keycaps & secondary controls |
| Well (Recessed) | `--bg-well` | `#E5E0D5` | Recessed daylight timeline well |
| Ink Primary | `--text-primary` | `#18191D` | Deep charcoal ink (`17.56:1` on surface) |
| Ink Secondary | `--text-secondary` | `#4B4E59` | Subtitles & metadata (`8.29:1` on surface) |
| Ink Muted | `--text-muted` | `#5C606D` | Bar indices & hints (`5.00:1` on elevated) |
| Primary Hardware | `--accent-primary` | `#9F5807` | High-contrast burnished amber for text & outline accents |
| Primary Solid CTA | `--accent-primary-solid-bg` | `#E8A849` | Warm amber button fill paired with `#18191D` ink (`8.47:1`) |
| Anchored Brass | `--accent-brass` | `#7E5716` | Locked bar label on `#FAF3E3` warm parchment (`5.82:1`) |

### 2.3 Harmonic Spice Tiers (Semantic Progression Spectrum)

| Tier | Name | Shape Glyph | Dark Theme (`fg` / `bg`) | Light Theme (`fg` / `bg`) | Harmonic Meaning |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Radio Safe** | `●` Circle | `#5EC2B7` / `rgba(94,194,183,0.14)` | `#0B5D56` / `rgba(11,93,86,0.10)` | Diatonic triads & clean pop moves (`IV → V → I`) |
| **2** | **Jazz Standard** | `◆` Diamond | `#E8B24A` / `rgba(232,178,74,0.14)` | `#7D4704` / `rgba(125,71,4,0.10)` | Seventh chords, `ii7 → V7`, secondary dominants |
| **3** | **Modal Interchange** | `◐` Crescent | `#C084FC` / `rgba(192,132,252,0.15)` | `#7E22CE` / `rgba(126,34,206,0.10)` | Borrowed `bVI`, `iv`, `bIII`, modal color shifts |
| **4** | **Deep Reharm** | `▲` Flame | `#FF7A5C` / `rgba(255,107,74,0.16)` | `#A8270D` / `rgba(168,39,13,0.10)` | Tritone Sub (`bII7`), Backdoor (`bVII7`), Chromatic Mediant, `#11` |

### 2.4 Bar & Live Feedback Semantic States

| State | Visual Cue | Dark (`fg` / `bg` / `border`) | Light (`fg` / `bg` / `border`) |
| :--- | :--- | :--- | :--- |
| **Anchored / Locked** | Brass padlock badge + `#1C1A16` / `#FAF3E3` well | `#D8AD66` / `#1C1A16` / `#8A6C3B` | `#7E5716` / `#FAF3E3` / `#C49A52` |
| **Queued Swap** | Dashed amber ring + gentle beat pulse | `#E8A849` / `rgba(232,168,73,0.18)` / `#E8A849` | `#824505` / `rgba(232,168,73,0.22)` / `#A85E08` |
| **Legal Snap** | Check pulse + crisp emerald flash | `#4ADE80` / `rgba(74,222,128,0.14)` / `rgba(74,222,128,0.45)` | `#116330` / `rgba(17,99,48,0.10)` / `rgba(17,99,48,0.38)` |
| **Dissonant Clash** | Horizontal hardware shake + soft warning chip | `#FCA5A5` / `#2E1618` / `#F87171` | `#B91C1C` / `#FEE2E2` / `#DC2626` |
| **Consonant Helper** | `6px` teal LED pip on safe diatonic buttons | `#5EC2B7` (`4.36:1+` non-text glow) | `#0B5D56` |

### 2.5 Verified WCAG 2.1 Contrast Matrix

Every foreground/background pair (including alpha-composited tints over both `--bg-surface` and `--bg-elevated`) was verified programmatically against WCAG 2.1 thresholds (`>= 4.5:1` normal text, `>= 3.0:1` UI graphics):

| Token Pair | Dark Ratio | Light Ratio | Standard |
| :--- | :---: | :---: | :---: |
| `text.primary` / `surface.canvas` | **16.60:1** | **15.57:1** | AA / AAA Pass |
| `text.primary` / `surface.surface` | **15.27:1** | **17.56:1** | AA / AAA Pass |
| `text.secondary` / `surface.elevated` | **7.57:1** | **6.60:1** | AA / AAA Pass |
| `text.muted` / `surface.elevated` | **4.99:1** | **5.00:1** | AA Pass |
| `accent.primarySolidInk` / `accent.primarySolidBg` | **9.02:1** | **8.47:1** | AA / AAA Pass |
| `accent.brass` / `accent.brassBg` | **8.35:1** | **5.82:1** | AA Pass |
| `spice.radioSafe.fg` / blended elevated | **5.49:1** | **5.32:1** | AA Pass |
| `spice.jazzStandard.fg` / blended elevated | **5.97:1** | **5.22:1** | AA Pass |
| `spice.modalInterchange.fg` / blended elevated | **4.52:1** | **4.76:1** | AA Pass |
| `spice.deepReharm.fg` / blended elevated | **4.75:1** | **4.84:1** | AA Pass |
| `semantic.legal.fg` / blended elevated | **6.50:1** | **5.08:1** | AA Pass |
| `semantic.queued.fg` / blended elevated | **5.16:1** | **5.34:1** | AA Pass |
| `semantic.clash.fg` / blended surface | **8.89:1** | **5.30:1** | AA Pass |
| `playhead.pillActive` / `surface.well` (UI graphic) | **9.37:1** | **3.74:1** | AA UI (>= 3.0:1) |

---

## 3. Typography System (Open-Source Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
```

1. **Display & Reveal Scores — `Space Grotesk` (`600`, `700`)**
   - Geometric, crisp industrial terminals reminiscent of synth faceplate silkscreen printing (`REHARM`, `91`, `Top 4% Spice`).
   - Always use `letter-spacing: -0.02em` on large titles and `font-variant-numeric: tabular-nums` on animated scores.
2. **UI Copy & Explanations — `Plus Jakarta Sans` (`400`, `500`, `600`, `700`)**
   - High x-height, friendly clarity at `12px–16px` on mobile OLED screens. Used for clash guidance, how-to-play instructions, and button labels.
3. **Chords, Bar Indices, BPM & Meter Readouts — `JetBrains Mono` (`500`, `600`, `700`)**
   - Essential for harmonic clarity: `CMaj7`, `AbMaj7`, `Db7#11`, `Eø7`, `96 BPM`, `46/50`.
   - Always apply `font-variant-numeric: tabular-nums` so numbers (`00`–`100`) and bar indicators never jitter horizontally during count-up animations or chord swaps.
   - **Typographic Note on Accidentals & Extensions:** Use clean ASCII `#` and `b` or crisp Unicode `ø` (`F#m7`, `Db7#11`, `Eø7`) inside `JetBrains Mono` at `font-weight: 600` (`18px–22px` inside active bar slots, `14px` in compact compare rows). Extensions (`Maj7`, `#11`) remain at full baseline or subtle `0.85em` weight-matched scale so `Db7#11` fits inside an `86px`-wide mobile bar slot without ellipsis truncation.

---

## 4. Brand Mark, Iconography & Badge Art Direction

- **Logo & App Icon (`assets/brand/`):** Four vertical stepped chord columns inside a matte obsidian chassis—Bar 1 anchored in warm brushed brass (`#D8AD66`), Bars 2–4 stepping upward in Warm Amber (`#E8A849`), Twilight Lavender (`#C084FC`), and Ember Coral (`#FF7A5C`). Instantly communicates *"4-bar harmonic escalation"* with zero words.
- **UI Iconography (`assets/icons/`):** Consistent `24×24` grid, `1.75px` rounded stroke (`currentColor`), minimal geometric silhouettes matching hardware panel engraving.
- **Harmonic Flavor Badges (`assets/badges/`):** Modeled after **collectible matte-enamel studio hardware pins** seated on brushed dark anodized aluminum medallions (`#111215` background). Each badge uses a distinct silhouette so it stays unmistakable at `32px` inside a share card or `64px` in the trophy drawer, backed by matching inline vector SVGs (`badge-frame.svg` + `*.svg`).
