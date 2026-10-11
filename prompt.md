# Hero Section Generator Prompt: Red 3D Ball Digital Experiences Hero Section

Use the detailed prompt below with AI coding models (Gemini, Claude, GPT-4, Cursor, etc.) to recreate the exact same high-end, responsive hero section.

---

### PROMPT INSTRUCTIONS

```text
Create a stunning, high-end, responsive HTML5 digital agency hero section featuring a morphing 3D red wavy sphere background video, smooth radial vignette lighting, bold uppercase typography, and interactive particle canvas elements.

### 1. TECH STACK & REQUIREMENTS
- Core: HTML5, CSS3, JavaScript (ES6+)
- Styling: Tailwind CSS CDN (v3) + Custom CSS variables/animations
- Typography: Google Fonts ("Outfit" / "Plus Jakarta Sans" for display headlines & body text)
- Icons: Lucide Icons CDN (`https://unpkg.com/lucide@latest`)
- Assets: Background Video URL: `https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/bg-red-ball.mp4`

---

### 2. DESIGN AESTHETICS & PALETTE
- Base Background: Deep dark crimson/black `#080104`
- Primary Accent: Neon Hot Pink `#ff1053` & Glowing Red `#e6004c`
- Text Colors: White `#ffffff` (Headings) and Translucent White `rgba(255, 255, 255, 0.75)` (Subtext)
- Glassmorphism & Atmosphere: 
  - Smooth organic radial vignette (`radial-gradient(ellipse 68% 68% at 50% 50%, transparent 22%, rgba(8, 1, 4, 0.4) 50%, rgba(8, 1, 4, 0.8) 75%, rgba(8, 1, 4, 0.98) 100%)`).
  - Glass pill outline buttons with `backdrop-filter: blur(10px)` and hover glow borders.
  - Dynamic HTML5 Canvas floating illuminated dust particle overlay.

---

### 3. LAYOUT BREAKDOWN & CONTENT STRUCTURE

#### A. Header / Top Navigation (`<header>`)
- Left: Stylized 'N' mark inside a rounded square glass container (`w-11 h-11 rounded-xl border-2 border-white/90 bg-black/30`).
- Center: Horizontal navigation menu with tracking `HOME` (active with a glowing red underline bar), `WORK`, `ABOUT`, `SERVICES`, `INSIGHTS`, `CONTACT`.
- Right: Outline glass pill CTA button `"LET'S TALK"`.
- Mobile: Hamburger toggle icon opening a full-screen blurred dark overlay navigation drawer.

#### B. Background & Atmosphere Layer
- `<video>` tag set to `autoplay`, `loop`, `muted`, `playsinline`, `object-cover` centered at opacity 100%.
- Organic radial vignette overlay and subtle top/bottom gradient shadows to ensure contrast without boxy lines.
- HTML5 Canvas particle generator spawning 65 floating illuminated pink and white dust motes.

#### C. Main Hero Content Grid (`<main>` 12-Column Layout)
- **Left Column (5 cols)**:
  - Sub-tag: `WE DESIGN` in crimson tracking text (`text-xs sm:text-sm font-bold tracking-[0.3em] text-[#e6004c]`).
  - Headline: Large display text `DIGITAL EXPERIENCES` (`text-5xl sm:text-7xl lg:text-[80px] font-black text-white leading-[0.96] uppercase`).
  - Subtitle: *"We craft immersive digital experiences that drive engagement, inspire creativity and deliver results."*
  - CTA Button: Rounded glass pill button `"EXPLORE OUR WORK ↗"` with diagonal arrow icon.
- **Center Spacer (3 cols)**:
  - Clear spacer zone preserving complete visibility of the central morphing 3D red ball in the background video.
- **Right Column (4 cols)**:
  - Numbered feature card stack (`01`, `02`, `03`) separated by subtle divider lines:
    - **01**: `CREATIVE DESIGN` - *"Designing visuals that connect and inspire."*
    - **02**: `BRAND STRATEGY` - *"Building brands that stand out and stand for something."*
    - **03**: `DIGITAL SOLUTIONS` - *"Delivering digital products that drive real impact."*

---

### 4. INTERACTIVE FEATURES & JAVASCRIPT LOGIC
1. Audio & Modal Controls: Video player controls, play reel triggers, and sound toggles.
2. Mobile Drawer Navigation: Smooth slide-in menu for mobile viewports.
3. Particle Canvas: Dynamic HTML5 Canvas rendering glowing red/white floating dust particles moving at subtle speeds.
```
