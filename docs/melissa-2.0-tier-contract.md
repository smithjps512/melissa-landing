# Melissa 2.0 Tier Contract

Canonical source of truth for tier names, prices, and feature lists.

This file is consumed by two separate repositories with two separate Vercel deployments:

- **Application repo.** Spec: `melissa-2.0-freemium-spec.md`
- **Marketing site repo.** Spec: `melissa-2.0-marketing-site-brief.md`

Neither Claude Code session can see the other repo. If a tier name, price, or feature list changes, it changes here first, and both sessions are re-pointed at the updated file. Do not restate these values from memory in either repo.

House style: no em dashes. Sentence case for UI labels.

---

## Tier names

| Internal key | Display name | Notes |
|---|---|---|
| `free` | Melissa Free | Naming pending James's final call |
| `pro` | Melissa Pro | Alternative under consideration: Teacher Pro |
| `school` | Melissa for Schools | |

Both repos must use the same display strings. Never write "Free plan" in one place and "Melissa Free" in another.

---

## Prices

| Tier | Launch price | Post transition price |
|---|---|---|
| Melissa Free | $0 | $0 |
| Melissa Pro | $99 per year | $149 per year |
| Melissa for Schools | $3,500 per year | $3,500 per year |

**Founding window.** $99 holds through back to school and ends when the 2.1 semester planner ships. Marketing may describe $99 as a founding teacher price that ends when semester planning launches. This is a real deadline, not a manufactured one, and copy should not imply otherwise.

**Grandfathering.** Every subscriber at $99 keeps $99 permanently. Marketing may state this plainly. It is a genuine trust signal and it is true.

No monthly billing option. Annual only. Teachers churn in June and return in August, and monthly makes that trivially easy.

---

## Feature lists

These strings are what both repos display. The app enforces them, the marketing site advertises them, and they must match word for word.

### Melissa Free

- Unlimited lesson plans
- Unlimited worksheets, handouts, and materials
- Unlimited quizzes and assessments
- Unlimited puzzles and classroom games
- Chat with Melissa
- Standards alignment on every lesson
- 5 presentations per month
- Charts, diagrams, and photography included in presentations
- PDF and PowerPoint download, print ready
- Made with Melissa footer on output

### Melissa Pro

Everything in Free, plus:

- Unlimited presentations
- AI generated illustrations
- No Melissa footer
- Export to Google Slides, Google Docs, and OneDrive
- Per slide image control and regeneration
- Priority generation
- Multi day, unit, grading period, and semester planning (2.1)
- Sub plan packets (2.1)

### Melissa for Schools

Everything in Pro for every teacher in the school or district, plus:

- Standards coverage documentation and reporting
- Shared department planning (2.1)
- Admin dashboard and usage analytics
- District AI policy controls
- Priority support

---

## Copy rules

**Never say "free trial."** The trial is retired. There is no trial anywhere in this product. Free is permanent.

**Never say "limited" about the free tier.** It is a real plan, not a sample. Free tier language should read as a genuine offer, because it is one.

**Explain the presentation cap when it appears.** Presentations are the most expensive thing Melissa creates, which is why free accounts get five each month. Teachers accept a limit they understand and resent one they do not. Both repos use this framing.

**Do not describe AI generated illustration as the only imagery.** Free tier decks include charts, diagrams, and real photography. Generated illustration is an upgrade, not the difference between having images and not having them. Copy that implies free decks are imageless is inaccurate and undersells the free tier.

---

## Shared routes

| Purpose | Destination | Owner |
|---|---|---|
| Primary CTA, all surfaces | app signup, free path | App repo |
| Pro purchase | app checkout, Stripe | App repo |
| Schools inquiry | contact form or mailto | Marketing repo |
| Login | app login | App repo |

Primary CTA label across both repos: **"Start free"**

The app must continue accepting inbound traffic on any legacy signup paths referenced by existing marketing links, ads, book back matter, and the video series. Do not break inbound links during the transition.

---

## Deploy ordering

Strict. The app ships first and is verified in production before the marketing site ships. The marketing site must never advertise a tier the app cannot serve.

Detail in the app spec, Gate 8.
