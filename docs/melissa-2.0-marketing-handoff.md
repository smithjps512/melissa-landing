# Melissa 2.0 — Marketing / Landing-Page Cutover Handoff

**For a fresh session working on the public marketing/landing site.** This is the
final step of the Melissa 2.0 launch (spec Gate 8, the cross-repo cutover). The
**app is done and live**; your job is to make the public site match it and launch
to the public with updated messaging and payments.

> **Do not change app behavior.** The app repo (`smithjps512/melissa-platform`,
> live at `app.melissaforeducators.ai`) is complete. This session edits the
> **marketing/landing site** (the Vercel project serving `melissaforeducators.ai`
> + `www` — the `melissa-landing` project). If that site is a separate repo, work
> there; this document is the source of truth for what to say.

---

## 1. What Melissa 2.0 is now (what to advertise) — all LIVE in production

**Freemium. No free trial, no credit card to start.** Two teacher tiers (Free,
Pro) plus School/District.

- **Free forever:** unlimited lessons, worksheets, quizzes, **puzzles**, and chat.
  Presentations are capped at **5 finished decks/month** (resets on the 1st in the
  teacher's local time) — and even at the cap the teacher still gets the outline,
  slide text, and speaker notes (nothing is lost; the anti-gotcha promise).
- **Pro:** everything unlimited, **AI image generation**, and Save-to-Google-Drive
  / native export.
- **School/District:** custom pricing.

**Puzzles** (free, unlimited, print-ready): crossword, word search, vocabulary
matching, fill-in-the-blank, bingo (unique card per student + call sheet), card
sort. Clean B/W printing, separate answer keys.

**Presentations — the headline upgrade.** Melissa drafts an outline you approve,
then builds the slides **with real images**, not empty placeholders:
- **Diagrams & charts** drawn deterministically from your content (accurate — no
  hallucinated labels).
- **Licensed stock photos** (Pexels), with credit attached automatically.
- **Custom AI illustrations** on Pro.
Free decks come out **complete and shareable** (diagrams + photos included);
AI illustration is the visible Pro unlock.

---

## 2. Lead with image generation — it's the differentiator

This is the strongest new story. Frame it plainly:

> "Melissa doesn't just mark where a picture should go — she **creates and places
> it**: accurate charts and diagrams built from your lesson, licensed photos with
> credit, and safe, classroom-ready AI illustrations on Pro."

**The guardrails are a selling point, not fine print** (safe for K-12):
- No readable text baked into generated images.
- No real or identifiable people.
- No human figures by default.
- Requests that conflict with safety are declined.

Provider is **OpenAI** (carries IP indemnification), counsel-reviewed, and the
Terms already include an **"AI Image Generation"** section (live at
`app.melissaforeducators.ai/terms`). Marketing claims must stay consistent with
that section: images are **illustrative**, teachers should **review** them, and we
don't promise uniqueness or factual accuracy.

---

## 3. Pricing & payments to reflect

- **Melissa Pro: $149/year** (annual). A **$99/year founding price** exists for
  early adopters and is **grandfathered** (a founding subscriber keeps $99 on
  renewal; `is_founding_member` is permanent).
  - **OWNER DECISION TO CONFIRM before the page ships:** advertise **$149 now**,
    or keep marketing the **$99 founding** price for a window? The owner has
    leaned toward **$149 now**. Confirm, and price the page to match whatever
    `STRIPE_PRICE_YEARLY` is set to in production.
- **Checkout is Stripe.** No trials anywhere in copy or flow.
- **Promo codes** exist (`BETATESTER` / `FOUNDERS100` grant complimentary Pro) —
  see `docs/promo-codes.md`. Coordinate any launch promo with the owner.
- **District/School:** "contact us" / custom pricing.

Details + the cutover runbook: `docs/billing-cutover.md`.

---

## 4. The cutover sequence — STRICT (spec §8)

Ordering is non-negotiable, to avoid advertising a tier the app can't serve:

1. **Verify in production** that a brand-new signup lands on the **Free** tier
   with free entitlements (no trial created). The app is deployed — confirm this
   first.
2. **Only then** ship the marketing-site changes (pricing page, messaging).
3. If the app must roll back after the site ships, **roll the marketing site back
   in the same window.**

---

## 5. Things NOT to advertise

- No **free trial** (it was removed — "Free forever, no credit card" is the line).
- Nothing from **2.1** (e.g., the semester/curriculum planner) — not built.
- Don't imply generated images are unique, factual, or depict real people/events.
- Don't advertise video generation — the pipeline is images-only.

---

## 6. Repos, docs, and where things live

- **App (done, don't touch):** `smithjps512/melissa-platform` → `app.melissaforeducators.ai`.
- **Marketing/landing (your work):** the `melissa-landing` Vercel project →
  `melissaforeducators.ai` + `www`. DNS is on Vercel nameservers (registrar is
  GoDaddy); the app's `/terms` and `/privacy` live in the app repo.
- **Terms sync:** if the landing site hosts its *own* copy of the Terms, port the
  **"AI Image Generation"** section from the app's `src/app/terms/page.tsx`. If it
  just links to `app.melissaforeducators.ai/terms`, you're already covered.

Reference docs (in the app repo, all current):
- `melissa-2.0-freemium-spec.md` — the canonical product spec
- `melissa-2.0-launch-checklist.md` — owner tasks, tester scripts, blockers
- `melissa-2.0-tier-contract.md` — tier names/entitlements (source of truth for both repos)
- `billing-cutover.md`, `promo-codes.md` — pricing/promo ops
- `presentation-image-generation-gate5.md`, `gate-5-bakeoff-results.md` — the image feature + why OpenAI

---

## 7. Open decisions for the owner before the site goes public

1. **$149 now vs. hold the $99 founding window** (§3). Set the page price to match production Stripe.
2. **Tier display name** — "Melissa Pro" vs "Teacher Pro" (settle in `melissa-2.0-tier-contract.md`, then both repos use it).
3. **Launch promo** (if any), and whether to feature founding pricing.
4. **Sweepstakes / entry mechanic** (if used) — the trial-based entry is gone; confirm the replacement with counsel (spec §10.3).

---

## 8. Status at handoff

Gates 1–7 built and merged; **Gate 5 (AI images) is live**. Final image-UX polish
is in open PRs on the app repo — **#115** (create-form copy) and **#116** (preview
renders images + generated-image persistence) — merge those to complete the app
side. After that, **Gate 8 (this handoff) is the only remaining work**: update the
public site's messaging + pricing and run the cutover in §4.
