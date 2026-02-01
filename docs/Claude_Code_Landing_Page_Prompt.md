# Claude Code Prompt: Landing Page — New Sections

## Task

Add two new sections to the Melissa for Educators landing page and update the nav. All changes should match the existing design system exactly (colors, fonts, spacing, component patterns).

---

## Overview of Changes

### 1. Add nav link: "Why Melissa"
In the header nav (`<ul class="nav-links">`), add a new link BEFORE "Log In":

```html
<li><a href="#why-melissa">Why Melissa</a></li>
```

Nav order should be: Features | Why Melissa | Pricing | Log In | Start Free Trial

### 2. New Section: "Why Melissa Isn't Just Another AI Tool" (Comparison Chart)

**Placement:** AFTER the Features section (`<section class="features">`), BEFORE the AI Guardrails section (`<section class="guardrails">`)

This section includes:
- Section label: "Why We're Different"
- Headline: "ChatGPT writes lesson plans. Melissa builds teaching careers."
- Subtitle explaining the difference
- Comparison table showing features ChatGPT/Gemini have vs. what only Melissa does
- A visual divider row labeled "What only Melissa does" separating shared features from Melissa-only features
- Bottom tagline: "The complete AI teaching system that documents student growth and helps you earn TIA bonuses."

The comparison table should have:
- Light header row with Feature / ChatGPT-Gemini / Melissa columns
- The Melissa column should have a subtle gold highlight background
- Shared features (3 rows): Generate lesson plans, Create worksheets, Answer teaching questions — both get checkmarks
- Divider row with maroon background and gold text: "What only Melissa does"
- Melissa-only features (9 rows): Know students by name, Track progress, Personalize by interests, Apply accommodations, Students submit work, AI guardrails per assignment, Standards mastery tracking, Document growth for TIA bonuses, One-click export reports — ChatGPT gets X, Melissa gets checkmark
- ChatGPT checkmarks: gray circles with gray check
- Melissa checkmarks: maroon circles with white check
- ChatGPT X marks: transparent with gray X

### 3. New Section: "Turn Your Teaching Into a Bonus" (TIA Incentives)

**Placement:** AFTER the AI Guardrails section (`<section class="guardrails">`), BEFORE the Pricing section (`<section class="pricing">`)

This section includes:
- Maroon background (matches guardrails section style)
- Section label in gold: "Teacher Incentives"
- Headline: "Turn your teaching into a $32,000 bonus" ($32,000 in gold)
- Subtitle about Texas TIA
- Three bonus tier cards (glass-morphism style matching guardrails zone cards):
  - Recognized: $3,000 – $9,000 (Top 33%)
  - Exemplary: $6,000 – $18,000 (Top 20%)
  - Master: $12,000 – $32,000 (Top 5%) — this one gets a gold border highlight
- Four feature items (icon + text, 2x2 grid):
  - 📊 Student Growth Tracking
  - 📁 Student Portfolios
  - 🎯 Differentiation Documentation
  - 📄 One-Click Export
- ROI calculator box:
  - Left: "$99/year" (your investment)
  - Arrow: "→" in gold
  - Right: "30x – 320x" in gold (your potential return)
- CTA button: "See Pricing" with gold background and maroon text

---

## Design System Reference

Use the existing CSS variables — do NOT create new ones:
```css
--maroon: #6B1A1A;
--maroon-dark: #5a1515;
--gold: #FFB512;
--gold-light: #FFD54F;
--gold-pale: #FFF8E7;
--cream: #FFFDF9;
--gray-50 through --gray-900 (already defined)
--font-display: 'Source Serif 4', Georgia, serif;
--font-body: 'Inter', -apple-system, sans-serif;
```

Section pattern to follow:
- Padding: `6rem 2rem`
- Max-width containers: `900px` (comparison) or `1000px` (TIA)
- Section labels: `.section-label` class (already exists)
- Headings: `font-family: var(--font-display)`, `font-size: clamp(2rem, 4vw, 2.75rem)`
- Cards: `border-radius: 16px`, subtle shadows
- Transitions: `all 0.3s ease`, hover lifts with `translateY(-4px)`

---

## Responsive Requirements

At 900px:
- TIA tiers: stack to single column, max-width 400px centered
- TIA features: stack to single column
- TIA ROI: stack vertically, rotate arrow 90deg
- Comparison table: horizontal scroll wrapper

At 600px:
- Headline `<br>` tags hidden
- ROI font sizes reduced

---

## Files

The complete HTML for both sections and all CSS are provided in:
- `new-sections.html` — The HTML markup for both sections
- `new-sections.css` — All styles for both sections plus responsive rules

Integrate the CSS into the existing `<style>` block and the HTML into the correct positions in the page body.

---

## Final Section Order After Implementation

1. Hero
2. Reclaim Your Time
3. Features
4. **NEW: Comparison ("Why Melissa")**
5. AI Guardrails
6. **NEW: TIA Incentives**
7. Pricing
8. Final CTA
9. Footer

---

## Important Notes

- Do NOT modify any existing sections — only add the new ones and the nav link
- All new CSS should be appended to the existing `<style>` block
- The comparison section uses `id="why-melissa"` for the nav anchor
- The TIA section uses `id="tia"` 
- Test that smooth scrolling works for the new nav link
- Ensure the maroon-to-maroon transition between sections 4→5 (comparison → guardrails) doesn't clash — the comparison section uses cream background, so it provides good contrast before the guardrails maroon section
