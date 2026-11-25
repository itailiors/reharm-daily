# Daily Music Theory "-dle" Game — Deep Market Research & Ideation Report

> **Date:** 2026-11-25  
> **Scope:** Market & Competitor Audit, Accessibility-Depth Bridges, Zero-Copyright Web Audio Strategy, 6 Original Daily Game Concepts, and Top 2 Prototype Recommendations

---

## 1. Market & Gap Summary

### Audit of Existing Music & Music-Theory Daily Games

The current music "-dle" landscape splits sharply into **two disconnected buckets**—high-virality pop-culture trivia games (burdened by licensing/curation) and low-virality academic Wordle clones:

| Category | Notable Live / Past Titles | Core Mechanic | What Worked vs. Why Others Failed / Stalled |
| :--- | :--- | :--- | :--- |
| **Pop-Song & Trivia -dles** | **Bandle** (`bandle.app`), **Heardle** *(shut down May 2023)*, **Musicle** (`musicle.app`), **Spotle** (`spotle.io`), **Harmonies** (`harmonies.io`), **Audio Connections** (`connections.audio`), **FourChords** | Identify popular songs, artists, or lyrics from progressive audio stems, intros, or Connections grids. | **Bandle thrived** because peeling instruments layer-by-layer creates a rewarding *"aha!"* puzzle, MIDI covers avoid master-recording takedowns, and indie agility fueled streamer adoption (e.g., Northernlion). **Heardle died** after Spotify bought and shut it down when casual 30-second players didn't convert into paid streams; clones continually break from API/licensing walls. **All still rely on copyrighted compositions** (even Bandle sits in a publishing/mechanical-license gray area and requires hand-arranged MIDI files). |
| **Chord & Progression -dles** | **Chordle** (`chordle.synthase.cc`), **Kordle** (`kordle.co.uk`), **ChordDaily** (`chorddaily.com`) | Guess a single hidden 4-note diatonic 7th chord (*Chordle* / *Kordle*) or a 4-chord Roman-numeral progression (*ChordDaily*) via Wordle green/yellow feedback. | **Stalled in a tiny academic niche.** *Chordle* doesn't even play the target chord upfront (making it a dry chord-spelling logic test), while *Kordle* and *ChordDaily* feel like conservatory ear-training homework—too intimidating for casuals, too rigid for trained musicians. |
| **Melody & Drum Transcription -dles** | **Melodle** (`melodle.yesmeno.com`), **Daily Jingle**, **Pitchd** (`pitchd.net`), **Notle**, **Beatdle** (`beatdle.fun`), **Pitchle** (`pitchle.app`) | Listen to a daily melody (*Melodle/Jingle*) or 16-step 4/4 drum beat (*Beatdle*) and transcribe it back into a Wordle color grid. | **Single-answer transcription fatigue.** Players without trained relative pitch hit a brick wall on Day 1 and churn; experienced musicians solve them mechanically with zero room for creativity or self-expression. |
| **Daily Theory Drills & SaaS** | **Etudle** (`etudle.com`), **Daily Theory** (`music-theory-practice.com`), **ToneGym** / **SoundGym** | Timed flashcards on key signatures, intervals, and chord spelling (*Etudle/Daily Theory*) or 10–15 min login-gated ear workouts (*ToneGym*). | **Zero viral puzzle joy.** Flashcard quizzes trigger "music exam" anxiety, produce forgettable share cards, and require reading fluency that excludes intuitive musicians. |

---

### Why Most Music-Theory -dles Fail to Retain Players

1. **Copy-Paste Wordle Transcription Fatigue:** Almost every theory -dle (`Chordle`, `Kordle`, `Melodle`, `ChordDaily`, `Beatdle`) uses the exact same loop: *hear X → transcribe X into a green/yellow grid*. Binary transcription has a brutal failure cliff and a flat skill ceiling.
2. **Zero Creative Agency or "Flex" Ceiling:** Because there is only one rigid answer, a beginner fails outright while a jazz pianist gets the same flat `🟩🟩🟩🟩` as everyone else. Nobody has captured **Krillion's open-ended magic**—where beginners pass safely with obvious answers while theory nerds flex with rare, deep solutions.
3. **The Notation Wall Excludes "Intuitive Musicians":** Millions of bedroom producers (FL Studio/Ableton piano-roll users), guitarists, singers, and casual tinkerers *feel* tension, mood, and groove instinctively, yet immediately bounce off staff notation or academic prompts like *"Spell an F# half-diminished 7th in second inversion."*
4. **Silent-Phone Hostility (The Mobile Killer):** Wordle and Connections thrive on commutes, couches, and quick work breaks with phones muted. Audio-only ear games lose half their mobile sessions immediately—compounded by **iOS Safari's physical silent switch**, which mutes standard Web Audio `AudioContext` output silently even at max media volume.

---

### The Clearest White-Space Opportunities

1. **Open-Ended "Krillion" Theory Scoring (Zero Live Competitors):** Music theory's rarity, functional tension, and harmonic complexity are **mathematically computable client-side** (unlike trivia, which requires manual editorial tagging). Any valid answer passes; spicier/rarer answers score higher.
2. **Creative Playback Share Cards:** Letting players encode their own daily musical solution in a tiny zero-backend URL hash (`#42:Cmaj7-Abmaj7-Db7-Cmaj9`) so friends can click and *hear* each other's answers turns passive emoji grids into interactive Discord/TikTok conversation starters.
3. **Harmonic Transformation & Voice Leading (Silent-Capable Logic):** Navigating chord space via stepwise voice leading (like *Weaver* for harmony) is tactile, visually intuitive, playable completely silent *or* with lush synth audio, and infinitely procedurally verifiable.
4. **Active "Musical Surgery" & Embodied Odd-Meter Rhythm:** Flipping passive transcription into *fixing* a broken multi-layer groove (high casual appeal—everyone hears a sour note!) or *feeling* odd meters/polyrhythms with one-thumb Beat-1 tapping fills completely untouched gaps.

### Technical & Audio Baseline (Applies Across All 6 Concepts)

* **Zero Copyright Risk:** 100% client-side synthesized audio via Web Audio API / `Tone.js` (e.g., warm Rhodes FM/poly-synth, plucked bass, marimba, filtered noise drums) + deterministic daily PRNGs seeded by UTC date. Zero licensing risk, zero server cost, infinite runtime.
* **Critical Mobile Safari Workarounds (Mandatory for Every Concept):**
  * **iOS Silent-Switch Trap:** Web Audio routes to iOS's *Ambient/Ringer* channel and goes dead when the hardware mute switch is flipped. Fix on the very first user tap (`Tap to Start`): set `navigator.audioSession.type = 'playback'` (modern iOS) *and* play a looping silent base64 HTML5 `<audio>` fallback to force iOS into the *Media* channel.
  * **Lifecycle & GC:** Pre-allocate synth pools at startup (avoid creating Tone nodes mid-game to prevent GC audio glitches), and hook `visibilitychange` to cleanly `resume()` suspended/interrupted `AudioContext` instances after app switches.

---

## 2. Six Distinct Game Concepts

*(2 Krillion-style, 2 Deduction/Logic, 2 Interactive Ear/Harmony/Rhythm)*

---

### Concept 1: **CHORD TRENCH** *(Krillion-Style #1 — Timed Open-Ended Harmonic Dive)*

* **Archetype:** Krillion-style (Open-Ended, Timed Rarity & Depth Scoring)
* **Pitch & Core Loop:**
  *Krillion played on an interactive electric piano.* Every day, players dive through **6 timed (25-second) open-ended harmonic constraints**. Any valid chord keeps your dive alive, but obvious pop triads stay near the surface (`15–25m`), while rarer, spicier valid voicings plunge you toward the **Jazz Trench (`85–100m` per round, `600m` max)**:
  1. **Tap "Dive" (unlocks AudioContext):** Round 1 appears for a 3-second read window before the 25-second countdown starts (exact Krillion pacing).
  2. **The Daily Constraints (6 Escalating Rounds):**
     * *R1 (Melody Anchor):* Held note `E4` pulses in warm Rhodes. *"Build ANY chord containing `E`."*
     * *R2 (Scale Box):* *"Build ANY 4-note chord using ONLY notes from `D Dorian`."*
     * *R3 (Common-Tone Bridge):* *"Build ANY chord sharing 2 notes with `G Major` that also includes `Bb`."*
     * *R4 (Interval Rule):* *"Build ANY chord containing a tritone (6 semitones)."*
     * *R5 (Bass Lock):* *"Build ANY chord with `F` in the bass and NO `A`."*
     * *R6 (Boss Resolution):* *"Build ANY chord that leads smoothly into `C Major` (contains `B` or `Ab/Db`)."*
  3. **Live Audition & Validation:** Tap keys on a crisp 2-octave keyboard (or optional chord-symbol quick-pad). Every tap sounds instantly and displays a live chord identifier (`C Maj` → add `B` → `Cmaj7` → add `F#` → `Cmaj7#11`). Random keyboard mashing (`C–C#–D–D#`) is softly rejected as *"Unrecognized cluster"* without ending your round.
  4. **Anti-Cheese "No-Repeat Quality" Rule:** Once you use a chord quality (e.g., `7#9` or `ø7`), that quality locks out for the remaining rounds—preventing players from spamming one obscure chord 6 times.
  5. **Rarity Splash & Post-Dive:** Your submarine/diver drops to a depth tier (*Pop Shallows → Indie Reef → Neo-Soul Shelf → Twilight Altered → Jazz Trench*), and at the end you can tap to hear the "Deepest Possible Chord" for any round.
* **Music Theory Scope:**
  Tests chord construction, inversions, scale/mode membership, common tones, intervals, and harmonic tension. **Beginners** survive all 6 rounds by poking pleasant 3-note triads by ear (`C–E–G`, `Dm`), learning chord names passively from the live labeler (plus an optional *"Show Scale Keys"* assist toggle). **Advanced musicians** strategize which rare extensions (`m(maj7)`, `maj7#5`, `13sus4`, `7b9#5`, `ø7`, quartal voicings) to deploy against each constraint before the 25s clock runs dry.
* **The Viral Hook & Share Card:**
  Pure Krillion-style bragging rights around **depth** and **harmonic spice** without spoiling any chords:
  ```text
  🎹 CHORD TRENCH #104 — 468m / 600m 🌊
  R1 🟦🟦⬜⬜⬜  28m (Pop Shallows)
  R2 🟦🟦🟦⬜⬜  56m (Neo-Soul)
  R3 🟦🟦🟦🟦⬜  82m (Altered Deep)
  R4 🟦🟦🟦🟦🟦  98m 🦑 TRENCH!
  R5 🟦🟦🟦🟦⬜  86m (Altered Deep)
  R6 🟦🟦🟦🟦🟦  96m 🦑 TRENCH!
  Qualities burned: 6 unique | Streak: 🔥 9
  ```
* **Tech & Content Feasibility:**
  * **100% Client-Side Day 1:** Uses a pitch-class chord recognizer (like `tonal` or a custom ~200-line bitmask dictionary covering ~45 valid chord qualities × 12 roots × inversions). Rarity depth scores are computed deterministically from an empirical chord-frequency table (major/minor triads = Tier 1, sus/6 = Tier 2, diatonic 7ths = Tier 3, 9/11/13/dim/aug = Tier 4, altered/slash/polychords = Tier 5) weighted by prompt fit. *(Optional Day-30 upgrade: add a free Cloudflare KV tally to display live crowd-rarity % like `"Only 0.7% of players voiced Db7#9!"`)*
  * **Mobile UX Hurdle:** Playing 4–5 note chords on a tiny phone keyboard under a 25s timer causes fat-finger frustration. **Fix:** Use **sticky toggle-keys** (tap to toggle a note on/off rather than holding multitouch), a **1.5-octave pitch-class keyboard** with generous 44px+ hit targets, and a 1-tap `Clear` button.
* **Biggest Risk & Mitigation:**
  * **Risk:** Power users memorize 6 ultra-obscure chord shapes (e.g., `maj7#5`, `7b9#11`) and robotically transpose them every day regardless of musicality.
  * **Mitigation:** Rotate **note-count caps** (*"Exactly 3 notes only"* — forcing players to find rare *triads* like `aug`, `dim`, `sus2`, `lydian triad`), **forbidden-note masks**, and **scale-box limits** so no memorized macro works across days.
* **Closest Existing Competitor:** **Krillion** (`krillion.to` — timed open-ended *text trivia* rarity game, with pop-music trivia packs but zero theory or playable instrument) and **Chordle** (`chordle.synthase.cc` — single fixed-answer chord deduction). No live daily game combining Krillion-style timed rarity scoring with open-ended chord construction found after searching `("rare chord" OR "obscure chord" OR "rarest" OR "Krillion") "music theory" game daily browser`, `r/musictheory`, GitHub, and itch.io.

---

### Concept 2: **REHARM** *(Krillion-Style #2 — Daily 4-Bar Melody Reharmonization Studio)*

* **Archetype:** Krillion-style (Open-Ended Creativity / Rarity & Functional Device Scoring)
* **Pitch & Core Loop:**
  *Everyone gets the exact same 4-bar melody today—compose the tastiest, rarest chord progression underneath it, and share a 1-click playable link so friends can hear your mix.*
  1. **Hear Today's Hook:** Tap **Play** to loop a crisp, musical 4-bar synthesized melody (flute/bell lead over a soft lo-fi drum pulse). Bar 1 (or Bar 4) is anchored (e.g., *"Must end on `C Major`"*), leaving **3 open chord bars** beneath the melody.
  2. **Build Your Harmony (2–3 min, live looping):** Tap any bar to drop in a chord using a fast **2-tap Chord Palette** (Root `C–B` + Quality `Maj / m / 7 / maj7 / m7 / ø7 / dim / sus / aug / alt` + optional Slash Bass) OR switch to **Piano Mode** to voice custom notes. Every change updates the live loop on the next beat so you groove while experimenting.
  3. **Live Harmonic Legality Check:** The engine checks each bar's accented melody notes against your chord—allowing chord tones (`1, 3, 5, 7`) and consonant color tones (`9, #11, 13`), while flagging accidental harsh minor-9th clashes (`C` melody over `B Major` unless voiced as a legal dominant/altered cadence).
  4. **Lock Mix & Receive Krillion-Style Rarity Breakdown (0–100 pts):**
     * **Harmonic Rarity (50 pts):** Analyzes chord-to-chord functional moves and awards named rarity tiers—e.g., `IV → V → I` (*Radio Safe*, 15 pts), `ii7 → V7` (*Jazz Standard*, 26 pts), Borrowed `bVI` / `iv` (*Modal Interchange*, 38 pts), or **Tritone Sub (`bII7 → I`)**, **Backdoor Dominant (`bVII7 → I`)**, **Chromatic Mediant (`I → bVI / III`)** (*Deep Reharm*, 46–50 pts).
     * **Melody Color (25 pts):** Scores higher when melody notes land on lush upper structures (`7th`, `9th`, `#11`) rather than doubling the chord root on every bar (e.g., harmonizing a held `G` with `Db7#11` where `G` becomes the `#11`!).
     * **Voice-Leading & Bass Flow (25 pts):** Rewards stepwise/chromatic bass motion (`C → B → Bb → A`) and smooth inner-voice retention.
  5. **Playable Share Link:** Your progression encodes into a tiny zero-backend URL fragment (`reharm.app/#42:Cmaj7.Abmaj7.Db7s11.Cmaj9`) so anyone clicking your Discord post hears *your exact 4-bar arrangement* in 3 seconds.
* **Music Theory Scope:**
  Functional harmony, modal interchange, secondary dominants, tritone substitutions, chromatic mediants, chord-tone vs. extension color, and bass voice leading. **Beginners** get an optional **"Consonant Helper"** (soft dots highlighting safe diatonic chords under each bar) so anyone can craft a genuinely pretty pop progression (`F → G → C`) and feel like a producer in 60 seconds. **Advanced musicians & YouTube/TikTok creators** hunt 95+ scores and debate whose daily reharm *actually grooves hardest*.
* **The Viral Hook & Share Card:**
  Combines Krillion rarity flexing with **playable user-generated music** (zero backend needed):
  ```text
  🎛️ REHARM #42 — 91/100 (Top 4% Spice 🌶️)
  Bar 1 🔒 | Bar 2 🟣 | Bar 3 🔥 | Bar 4 ✨
  Badges: 🌙 Modal Borrow · ⚡ Tritone Sub · 💎 #11 Melody
  Bassline Flow: 🧈 Smooth (3 semitones avg)
  ▶ Hear my mix: reharm.app/#42:C.AbM7.Db7s11.CM9
  ```
* **Tech & Content Feasibility:**
  * **Content Strategy (Hybrid Semi-Procedural):** Purely random melodies sound robotic. Instead, build a **motif-grammar generator** (30+ rhythmic/cadential contour templates × 12 keys × modes, guaranteeing strong beat targets that admit 6+ distinct harmonizations) — OR ship an MVP with **60 curated 4-bar JSON melodies** (~12 KB total!) before layering procedural generation. The harmonic device analyzer & legality checker are 100% deterministic pitch-class math.
  * **Mobile UX Hurdle:** Seamless live audio swapping without clicks/timing drift when changing chords mid-loop. **Fix:** Quantize chord swaps via `Tone.Transport` on bar/half-bar boundaries with a 15ms amplitude crossfade envelope.
* **Biggest Risk & Mitigation:**
  * **Risk:** "Gaming the rubric" produces ugly, unmusical jazz-salad (`C#dim7 → G7b9#5 → Ebaug`) that scores 98/100 purely by stacking altered chords.
  * **Mitigation:** Couple Rarity strictly to **recognized functional resolutions** (a `bII7` only awards Tritone Sub points if it actually resolves down a half-step to its tonic target!) and penalize disjointed root jumps/parallel harsh dissonances via the **Voice-Leading & Flow** sub-score.
* **Closest Existing Competitor:** **ChordDaily** (`chorddaily.com` — closed-ended Wordle transcription of one fixed 4-chord progression) and manual TikTok/Reddit "reharm challenge" videos. No live daily browser game for open-ended melody reharmonization with algorithmic device scoring found after searching `reharmonization OR "reharm" daily puzzle game music theory browser`, `r/musictheory`, GitHub, and itch.io.

---

### Concept 3: **STEPWISE** *(Deduction / Logic #1 — Neo-Riemannian Voice-Leading Ladder)*

* **Archetype:** Deduction / Logic (Wordle × Weaver Word-Ladder × Par Optimization)
* **Pitch & Core Loop:**
  *Weaver (Word Ladder) for musical harmony.* Morph a **Start Chord** into a **Target Chord** by sliding **exactly ONE voice by 1 or 2 semitones per step**, where every intermediate step must form a valid musical chord—beating **Par** (fewest steps & smallest total semitone distance):
  1. **See the Endpoints & Daily Rule:** Example puzzle: **`C Major` (`C–E–G`) → `F# Minor` (`F#–A–C#`)** | **Par: 3 moves (5 semitones)** (or Weekend Hard Mode: *"Half-steps ONLY (`±1` semitone) — Par: 5 moves"*).
  2. **Slide One Voice:** Your active chord sits on a clean, wrapping 12-semitone pitch-class track with 3 glowing note nodes (4 voices on weekend 7th-chord editions). Drag or tap a node `±1` or `±2` semitones:
     * Invalid cluster? Soft shake (*"Not a chord!"*)—no move wasted.
     * Valid chord? It snaps green, plays a silky voice-led synth glide connecting the common tones, and stamps the chord name onto your ladder!
     * *Example Standard Solve (3 moves / 5 semitones):* `C Maj {C,E,G}` → slide `G→A` → `Am {C,E,A}` → slide `C→C#` → `A Maj {C#,E,A}` → slide `E→F#` → `F#m {C#,F#,A}`!
     * *Example Half-Step-Only Solve (5 moves / 5 semitones):* `C Maj {C,E,G}` → `Csus4 {C,F,G}` → `Fm {C,F,Ab}` → `Db Maj {Db,F,Ab}` → `Dbsus4 {Db,Gb,Ab}` → `F#m {C#,F#,A}`!
  3. **Daily Twists (Mon–Sun Difficulty Curve):** Mon–Tue: Standard triads (`±1–2` semitones). Wed–Thu: **Lava Note** (one pitch class blocked, forcing a harmonic detour). Fri: **Checkpoint** (*"Must pass through a Diminished chord"*). Sat–Sun: **Half-Steps Only** or **4-Voice Seventh Chords**.
  4. **Musical Payoff:** Solving unlocks **"▶ Play My Ladder"** (plays your full smooth voice-led chord progression back as a mini cinematic piece) alongside the **Optimal Par Path** comparison.
* **Music Theory Scope:**
  Chord spelling, inversions, enharmonic equivalence (`Db = C#`), suspended/diminished/augmented pivots, and **parsimonious (Neo-Riemannian) voice leading**. **Beginners & silent commuters** need zero notation or audio—just nudge glowing blocks 1–2 notches and watch real chords light up intuitively. **Advanced musicians** mentally traverse Neo-Riemannian `P/L/R` graphs, enharmonic traps, and diminished bridges to score **Par** or **Eagle** with zero undos.
* **The Viral Hook & Share Card:**
  Clean, ultra-readable Wordle/golf hybrid that works identically for silent commuters and audio players:
  ```text
  🪜 STEPWISE #88 (Half-Steps Only)
  C Maj ──▶ F# Min | Par 5
  ⬜⬜🟩  (+1)
  ⬜🟩⬜  (+1)
  🟩⬜⬜  (+1)
  ⬜🟩⬜  (+1)
  ⬜⬜🟩  (+1)
  Score: 5 moves · 5 semitones (⛳ PAR · 0 undos)
  ```
* **Tech & Content Feasibility:**
  * **Infinite Mathematically Verified Puzzles:** All valid 3-note pitch-class sets (`Maj, min, dim, aug, sus2, sus4`) form a tiny **52-node graph** (4-voice 7ths = ~84 nodes). A deterministic date-seeded PRNG picks `(Start, Target, Constraint)`, runs client-side **BFS / Dijkstra in <2ms** to guarantee solvability and exact `Par`, and needs **zero manual curation forever**.
  * **Mobile UX Hurdle:** Pitch-class wrapping (`B → C`) can confuse players on a linear piano roll. **Fix:** Show a centered 1.5-octave pitch-class track with subtle ghosted octave-duplicate indicators (or a circular 12-tone clock toggle) so sliding `B → C` feels seamless visually and acoustically (using smooth Shepard-like register centering during playback).
* **Biggest Risk & Mitigation:**
  * **Risk:** Without daily constraints, players could brute-force trial-and-error sliding random notes until they stumble into the target chord.
  * **Mitigation:** Limit total moves to **`Par + 3`** (hard fail if exceeded, just like Wordle's 6-guess tension!) and track **Undos / Invalid Taps** on the share card so thoughtful deduction beats random poking.
* **Closest Existing Competitor:** **Weaver** (`wordwormdormdork.com` — linguistic word ladder) and non-game **Tonnetz visualizers / Dijkstra voice-leading scripts** on GitHub/itch.io (`feldman4/tonnetz`, `poincare.itch.io/tonnetz-pad`). No live daily chord-ladder / voice-leading par puzzle game found after searching `("voice leading" OR "chord ladder" OR "chord weaver" OR "semitone") daily puzzle game`, `"tonnetz" OR "voice leading" puzzle game browser itch.io OR github`, and `r/musictheory`.

---

### Concept 4: **QUARTET** *(Deduction / Logic #2 — Audio-First Music Theory Connections)*

* **Archetype:** Deduction / Logic (NYT Connections-Style Pattern Grouping)
* **Pitch & Core Loop:**
  *NYT Connections built entirely from 16 playable synthesized music-theory snippets—zero pop trivia, zero copyrighted tracks.*
  1. **The 4×4 Sound Board:** 16 sleek interactive tiles (`01`–`16`). Tapping a tile immediately plays a crisp 1.5–2 second synthesized musical clip (chord, interval, scale fragment, cadence, or short rhythm motif). No text names are displayed by default.
  2. **Deduce the 4 Theory Families (4 Mistakes Allowed):** Select 4 tiles and tap **Submit** (or tap **"▶ Preview 4"** to hear your 4 selected tiles back-to-back!) to uncover four tiered musical categories:
     * 🟨 **Yellow (Instant Ear / Quality):** e.g., *"4 Diminished 7th Chords"* or *"4 Descending Perfect 5ths"*.
     * 🟩 **Green (Key / Functional):** e.g., *"4 Chords Diatonic to Eb Major"* or *"4 Plagal Cadences (`IV → I`)"*.
     * 🟦 **Blue (Hidden Structural Link):** e.g., *"4 Voicings Sharing the Exact Same Tritone (`F` & `B`: `G7`, `Db7`, `Bdim7`, `Dm6`)"* or *"4 Riffs in `5/4` Time"*.
     * 🟪 **Purple (The Theory Nerd "Aha!" Twist):** e.g., *"4 Clips Playing `I–V–vi–IV` Transposed to Different Keys & Timbres"*, *"4 Enharmonic Chord Twins (`C6=Am7`, `F6=Dm7`, `G6=Em7`, `Eb6=Cm7`)"*, or *"4 Modes of C Major (All White Keys, Different Roots)"*.
  3. **Prestige Assist Modes (Bridging Casuals, Silent Users & Pros):** Players can toggle at any time between **🎧 Pure Ear** (sound + abstract waveform only), **🎹 Key Silhouettes** (lit mini-piano outline on each tile, no note names), or **📝 Theory Notes** (shows note spellings—making the game 100% playable silently!). Your share card stamps which assist tier you solved in.
* **Music Theory Scope:**
  Intervals, chord qualities, inversions, common tones/tritones, diatonic key membership, modes, cadences, transposed Roman progressions, and meters. **Beginners** solve Yellow/Green intuitively by ear + Key Silhouettes (hearing sad vs. bright chords or spotting white-key shapes) and learn *why* Purple connects when the category name reveals. **Pros** chase pure **🎧 Ear-Only Perfect Solves** with 0 mistakes.
* **The Viral Hook & Share Card:**
  Proven NYT Connections grid psychology upgraded with a **listening-mode prestige badge**:
  ```text
  🎼 QUARTET #63 | Mode: 🎧 Pure Ear
  🟨🟨🟨🟨
  🟩🟩🟦🟩  (One away!)
  🟩🟩🟩🟩
  🟦🟦🟦🟦
  🟪🟪🟪🟪
  Mistakes: 1/4 | 🎧 No Visual Peeks!
  ```
* **Tech & Content Feasibility:**
  * **Procedural Category Engine + Unique-Partition Solver:** Build a library of ~60 parametric music-theory category generators (spanning intervals, chords, common tones, keys, modes, cadences, transposed progressions, meters). Each day's seeded generator selects 4 orthogonal templates, generates 16 musical objects, and runs an automated **Ambiguity/Red-Herring Validator** confirming 1–2 intentional red herrings while mathematically proving **only one unique 4×4 partition** solves the board.
  * **Mobile UX Hurdle:** Tapping 16 audio tiles rapidly causes muddy overlapping audio tails and memory overload (it's harder to hold 16 sounds in working memory than 16 printed words!). **Fix:** Implement strict **monophonic voice-stealing** (tapping a new tile cuts the prior clip in 15ms), allow **color-pinning/flagging tiles** while brainstorming, and include a **"Play Selected 4 in Sequence"** button.
* **Biggest Risk & Mitigation:**
  * **Risk:** Auditory working-memory overload—unlike words you can scan simultaneously with your eyes, listening to 16 blind tiles one-by-one can feel tedious after 60 seconds.
  * **Mitigation:** Pair every tile with a **glanceable non-spoiler visual glyph** (rhythm dot pattern, contour line, or mini-keyboard silhouette in Standard Mode) so players scan patterns visually *and* confirm by ear—keeping **Pure Ear 🎧** as an opt-in Hard Mode!
* **Closest Existing Competitor:** **Harmonies** (`harmonies.io` / DMC *Music Connect* — text-based pop-music & terminology trivia) and **Audio Connections** (`connections.audio` by Samuel Judson — audio-based Connections using curated pop songs and pop-culture themes). **Exact Mechanical Twist:** 100% zero-copyright synthesized music-theory objects (chords, intervals, transposed progressions, modes, meters) testing structural/aural theory patterns rather than song recognition, backed by a procedural partition solver and 3-tier Ear/Visual/Silent prestige modes.

---

### Concept 5: **MEND** *(Interactive Ear & Harmony #1 — Multi-Layer "Musical Surgery")*

* **Archetype:** Interactive Ear & Harmony (Bandle-Style Multi-Layer Escalation, Inverted into Active Repair)
* **Pitch & Core Loop:**
  *Bandle meets interactive musical surgery.* Every day, a catchy looping **4-bar synthesized groove** (drums + bass + chords + melody) arrives **sabotaged with 4 deliberate music-theory bugs**. Listen, locate each sour clash on a clean mini-DAW lane view, and fix each layer live until the track clicks into a polished beat:
  1. **Stage 1 — The Sour Note (Melody · Warmup):** A 4-bar groove loops smoothly, except one melody note is bent out of key (a painfully obvious chromatic clash). Tap the clashing note block on the melody lane and nudge it `±1–2` semitones until it snaps cleanly into scale.
  2. **Stage 2 — The Broken Chord (Harmony · Medium):** One bar's chord quality or root is sabotaged (e.g., `A Major` clashing a harsh `C#` against a held `C` melody note instead of `A Minor`). Tap the broken bar and flip its quality/root live while listening.
  3. **Stage 3 — The Bass Betrayal (Bass / Inversion · Medium-Hard):** One bar's bass note clashes or ruins the harmonic grounding (e.g., playing a dissonant non-chord root under the chord). Tap & lock the proper root or smooth bass inversion.
  4. **Stage 4 — The Cadence / Mode Polish (Final Fix · Hard):** The final bar misses today's harmonic flavor prompt (e.g., *"Fix Bar 4 for a dreamy **Lydian `#4`** lift"* or *"Restore the **Authentic `V → I`** resolution"*).
  5. **The Healing Payoff & Optional Theory Bonus:** After every fix, the looping track immediately sounds cleaner and groovier; completing Stage 4 triggers a celebratory full-groove playback! An optional 1-tap **"🎓 Theory Diagnosis"** card (*"What caused Stage 2's clash?"* → `Major vs. Minor 3rd`) awards a bonus ⭐ without gating casual wins.
* **Music Theory Scope:**
  Scale/key membership, major vs. minor chord quality, chord-melody consonance, bass inversions, cadential resolution, and modal signature notes (Lydian `#4`, Dorian `♮6`, Phrygian `b2`). **Unmatched low floor:** Humans instinctively recoil at a sour note or semitone chord clash—even non-musicians hear *"Ew, Bar 3 is cursed!"*, fix it by ear, and feel brilliant. **Advanced musicians** aim for **1-tap Clean Fixes** (no trial-and-error nudging) + **4/4 ⭐ Theory Diagnosis** aces.
* **The Viral Hook & Share Card:**
  Clean Bandle-adjacent multi-layer diagnostic card:
  ```text
  🩺 MEND #51 — Track Restored!
  🎵 Melody  🟢 (1 try)  ⭐ Out-of-Key b5
  🎹 Chords  🟢 (1 try)  ⭐ Wrong 3rd (Maj/min)
  🎸 Bass    🟡 (2 tries) ⭐ Missed Root
  ✨ Cadence 🟢 (1 try)  ⭐ Lydian #4
  Precision: 5/4 taps | Theory Aces: 4/4 ⭐
  ```
* **Tech & Content Feasibility:**
  * **Procedural Groove + Controlled Sabotage Engine:** A deterministic client-side generator constructs clean 4-bar grooves from curated musical building blocks (30+ functional progressions × melodic rhythm-contour rules × bass grooves × lo-fi/chiptune/jazz synth presets). The **Sabotage Engine** injects 4 mathematically verified bugs guaranteed to produce an unmistakable acoustic clash (e.g., forcing a direct minor-2nd/minor-9th rub against a simultaneous melody/chord tone in the same register).
  * **Mobile UX Hurdle:** Fitting 4 DAW-style lanes cleanly in portrait mode without tiny tap targets. **Fix:** Use a **staged accordion layout**—the active broken layer expands to 60% of the viewport with chunky, thumb-friendly note/chord blocks while the other 3 layers stay compact waveform strips showing live playhead progress.
* **Biggest Risk & Mitigation:**
  * **Risk:** "Jazz-ear ambiguity"—a trained musician hears a sabotaged `#4` or `b7` and thinks *"honestly, that sounds kind of cool,"* causing unfair misses.
  * **Mitigation:** Restrict Stages 1–3 strictly to **objectively grating clashes** (cross-relation `3` vs. `b3` in the same octave, `b2` against a held tonic root) and always display a clear musical target label for Stage 4 (*"Clean Major Resolution"* vs. *"Dreamy Lydian Lift"*).
* **Closest Existing Competitor:** **Voiceturi ("Find the Wrong Note")** (`voiceturi.eu` — non-daily quiz where nursery rhymes like *Twinkle Twinkle* have 1 altered note and you click its number; no interactive repair or harmony layers) and **Bandle** (`bandle.app` — multi-layer song guessing). No live daily multi-layer interactive music-repair puzzle found after searching `"wrong note" OR "spot the wrong note" OR "broken chord" music ear game browser`, `("wrong note" OR "sour note" OR "out of key" OR "fix the chord") daily music game`, `r/webgames`, and itch.io.

---

### Concept 6: **BARLINE** *(Interactive Ear & Rhythm #2 — Downbeat Tap & Odd-Meter Slicing)*

* **Archetype:** Interactive Rhythm / Meter Theory (One-Thumb Embodied Tap + Visual Geometry)
* **Pitch & Core Loop:**
  *The daily rhythm-theory game you actually feel in your thumb.* Across **4 escalating synthesized musical riffs** (real bass + melodic marimba/synth + percussion grooves—never dry metronome clicks), you lock into Beat 1 by tapping live, then slice the circular rhythm ring to reveal the meter and beat grouping:
  1. **4 Daily Riffs (2 min total):**
     * *R1 (Simple vs. Compound):* e.g., `3/4` (`2+2+2`) vs. `6/8` (`3+3`).
     * *R2 (Syncopated Backbeat Trap):* A groovy `4/4` or `6/8` riff with displaced accents designed to fake you out on Beat 1.
     * *R3 (Odd Meter Grouping):* `5/4` (`3+2` vs. `2+3`), `7/8` (`2+2+3` vs. `3+2+2`), or `9/8` (`2+2+2+3`).
     * *R4 (Boss — Polyrhythm / Mixed Meter):* A `3:2` or `4:3` polyrhythm (tap the slower counter-pulse!) or a `7/8 + 5/8` alternating riff.
  2. **Phase A — "LOCK BEAT 1" (Live One-Thumb Tap):** As the riff loops, a minimal circular ring rotates without showing where Beat 1 sits. Nod your head and **tap the center pad on Beat 1 for 3 consecutive bars**. The engine grades both **correct beat phase** (didn't get fooled by a syncopation!) and **millisecond pocket precision** (`±14ms · In the Pocket! 🎯`).
  3. **Phase B — "SLICE THE BAR" (Euclidean Rhythm Slicer):** Once Beat 1 locks at 12 o'clock, the ring displays every eighth-note/subdivision dot in the cycle. Tap between dots to drop **accent dividers** (e.g., slicing 7 dots into `2 + 2 + 3`) to identify the exact **Time Signature & Subdivision Grouping (`7/8 · 2+2+3`)**.
  4. **Live Groove Anatomy Reveal:** Solving lights up the sliced geometry in sync with the looping riff (`1-2 | 1-2 | 1-2-3`) so players instantly internalize odd meters.
* **Music Theory Scope:**
  Simple vs. compound meter (`3/4` vs. `6/8`), syncopation & downbeat perception, asymmetric/additive odd meters (`5/8`, `7/8`, `9/8`, `11/8`), and polyrhythms (`3:2`, `4:3`). **Casual players** nail Rounds 1–2 purely by tapping along with their thumb—zero notation reading required. **Drummers, bassists, prog/jazz fans, and rhythm gamers** obsess over cracking `7/8` groupings on Listen 1 and posting single-digit millisecond pocket scores (`±8ms`).
* **The Viral Hook & Share Card:**
  Combines clean round emojis with an addictive **millisecond timing flex** drummers and producers can't resist comparing:
  ```text
  🥁 BARLINE #77 | Pocket: 🎯 ±12ms
  R1 🟢 Locked · 6/8 (3+3)   ±9ms
  R2 🟢 Locked · 4/4 (Sync)  ±11ms
  R3 🟢 Locked · 7/8 (2+2+3) ±14ms
  R4 🟡 2 Tries · 4:3 Poly   ±15ms
  Streak: 🔥 14 | Tightest Beat: ±7ms
  ```
* **Tech & Content Feasibility:**
  * **100% Procedural Riff Engine:** Schedule riffs on the Web Audio hardware clock (`AudioContext.currentTime` lookahead scheduler) using a procedural groove generator parameterized by `(total_subdivisions, accent_grouping[], tempo, modal_bass_riff, melodic_motif)`—yielding thousands of distinct, genuinely musical odd-meter riffs client-side.
  * **Critical Mobile Audio Hurdle (Bluetooth & Touch Latency!):** Wireless earbuds introduce `120–250ms` of audio lag that would falsely fail every Beat-1 tap! **Fix:** (1) Grade Beat-1 correctness using **inter-tap periodicity + phase-compensated windowing** (if all 3 taps are consistently offset by `+180ms` relative to the audio clock, recognize Bluetooth latency rather than penalizing!), (2) provide an optional 3-second *"Tap with the Click"* Bluetooth offset calibrator saved in `localStorage`, and (3) compute Pocket Score from **tap-to-tap jitter (`σ` in ms)** so Bluetooth users still get fair, thrilling precision scores!
* **Biggest Risk & Mitigation:**
  * **Risk:** Bluetooth latency frustration OR casual players getting crushed by `7/8` and `4:3` polyrhythms and quitting after Day 2.
  * **Mitigation:** Solve Bluetooth via jitter-based pocket scoring + optional calibration; cap casual friction by keeping **Rounds 1–2 accessible (`4/4`, `3/4`, `6/8`)**, offering a **0.75× Slow-Mo Ear Lens** button (costs a small badge downgrade, never blocks completion), and making Round 4 an explicit **"Boss Round"** where failing still preserves your main 3-round daily clear!
* **Closest Existing Competitor:** **Beatdle** (`beatdle.fun` — static 16-step 4/4 drum-machine transcription), **Musicable** (`musicable.app` — static notation time-signature quiz), and non-daily itch.io arcade games (**Polyrhythmia**, **Polylylyrhythm**). No live daily browser game combining live Beat-1 downbeat tapping, millisecond pocket scoring, and interactive Euclidean odd-meter slicing found after searching `"time signature" OR "odd meter" guessing game daily OR web game music theory`, `("polyrhythm" OR "odd meter") daily game OR wordle github OR itch.io OR reddit`, and `r/musictheory`.

---

## 3. Top 2 Recommendations

### Side-by-Side Comparison

| Metric | **#1: REHARM** *(Krillion Melody Reharmonization)* | **#2: STEPWISE** *(Voice-Leading Harmonic Ladder)* |
| :--- | :---: | :---: |
| **Virality Potential** | **5 / 5** — Playable URL-hash share links let friends *hear* each other's daily mixes; tailor-made for Discord, TikTok, and YouTube Shorts music creators. | **4 / 5** — Crisp Wordle/Weaver golf card (`Par 3 · Eagle!`) with instant *"aha!"* progression playback; high shareability among puzzle & theory fans. |
| **Daily Retention** | **4.5 / 5** — Creative agency + chasing rare harmonic device badges keeps musicians returning daily; slight mobile friction when audio is muted. | **5 / 5** — 90-second crisp logic ritual that works **100% silently OR with audio**, capturing commuters and office-break sessions every day. |
| **Accessibility** | **4 / 5** — 2-tap Chord Palette + beginner consonant dots let casuals sound like producers in 60s; jazz/theory nerds get an infinite ceiling. | **4.5 / 5** — Zero music jargon needed ("slide 1 block up/down; green = valid chord"); beginners learn voice leading intuitively by touch. |
| **Solo-Dev Build Speed** | **3.5 / 5** (~2–3 weeks MVP: needs Tone.js seamless bar-quantized loop engine, harmonic-device scorer, URL serializer, and starter melodies). | **5 / 5** (~5–7 days MVP: tiny 52-node chord graph, 30-line BFS solver, smooth piano-roll slider, simple Web Audio synth). |
| **Content Sustainability** | **4 / 5** — Semi-procedural: best launched with 60–90 crisp JSON 4-bar hooks (~15 KB) paired with a parametric motif generator so melodies always feel genuinely catchy. | **5 / 5** — 100% algorithmic forever: deterministic PRNG + client-side BFS guarantees mathematically verified, solvable puzzles with exact Par indefinitely. |

---

### Which One Should We Prototype First?

**Prototype `REHARM` first—using a lean 30-melody JSON MVP to ship in ~2 weeks (with `STEPWISE` as an ideal 5-day follow-up or companion mode).**

Here is why **`REHARM`** is the highest-leverage bet to build first:

1. **Category-Creating Virality (Uncontested White Space):** Every existing music-theory -dle shares a static emoji grid of the *same* answer. **`REHARM`** is the only daily theory game where players **generate unique music from the same daily seed** and share a **1-click playable URL** with zero backend infrastructure. That taps directly into the proven viral energy of Bandle + Krillion + TikTok/YouTube reharm culture.
2. **True "Krillion" Accessibility-to-Depth Bridge:** Beginners can drop 3 basic major/minor chords under a catchy melody and walk away smiling at a legit-sounding loop, while producers and jazz theorists geek out over landing a `#11` melody note on a Tritone Sub or Backdoor Dominant.
3. **Easy MVP De-Risking:** Its only real risk—making sure daily melodies sound genuinely musical rather than robotic—is trivially solved for v1 by shipping **30–60 lightweight JSON melodies** (hand-curated or motif-assisted, <15 KB total) while focusing engineering time on the **harmonic legality/rarity engine**, **seamless live loop auditioning**, and **iOS mobile audio unlock**.

*(Note: If your top priority is validating distribution, mobile Web Audio reliability, and daily retention in **under 1 week** with zero melody curation and full **silent-mode** playability, swap the order and ship **`STEPWISE`** as a tight 5-day launchpad first—the exact same pitch-class theory engine and Web Audio Rhodes synth you build for `STEPWISE` carry straight over into `REHARM`!)*
