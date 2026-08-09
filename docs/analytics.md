# Landing site analytics

How to see, daily, who visits the marketing site, what they look at, and how
many move toward signing up.

## What is set up

The site uses **Vercel Web Analytics** (cookieless, privacy friendly, no consent
banner needed). It ships in `index.html`:

- A small loader in `<head>` (`/_vercel/insights/script.js`).
- Custom events fired from the page script at the bottom of `index.html`.

### One-time setup (owner)

Vercel Web Analytics has to be turned on for the project once:

1. Vercel dashboard → the `melissa-landing` project → **Analytics** tab → **Enable**.
2. Redeploy (merging the PR does this).

Until it is enabled, the loader script returns 404 and the custom events simply
no-op. Nothing on the page breaks.

> Custom events (the `cta_click` and `section_view` below) require a plan that
> includes Web Analytics events. Page views work on every plan. If events are
> not available on the current plan, you still get visits, top pages, referrers,
> devices, and countries.

## What you can see daily

In the Vercel **Analytics** tab:

- **Who visits** — visitors and page views over time, referrers (where they came
  from), devices, and countries.
- **What they look at** — the `section_view` custom event, broken down by
  `section`: `features`, `images`, `why-melissa`, `tia`, `pricing`. Each fires
  once per visit when the section scrolls into view, so you can see how far down
  the page people get and which sections hold attention.
- **Sign-up intent** — the `cta_click` custom event, with:
  - `location`: where the click happened (`nav`, `hero`, `pricing`, `final-cta`, etc.)
  - `label`: the button text (`Start free`, `Get Melissa Pro`, `Contact us`).

## Sign-up intent vs. real sign-ups

Important distinction:

- **This site can only measure intent** — clicks on "Start free" / "Get Melissa
  Pro" (`cta_click`). It cannot see whether someone finished creating an account,
  because sign-up completes on the **app** (`app.melissaforeducators.ai`), not here.
- **The true daily sign-up number lives in the app's Supabase database.** The
  marketing repo intentionally does not touch the app.

### Daily new-accounts query (run against the app's Supabase project)

New accounts created per day, last 30 days:

```sql
select date_trunc('day', created_at)::date as day,
       count(*) as new_signups
from auth.users
where created_at >= now() - interval '30 days'
group by 1
order by 1 desc;
```

Today's sign-ups only:

```sql
select count(*) as signups_today
from auth.users
where created_at >= date_trunc('day', now());
```

> If the app records the tier on a `profiles` table, join to it to split Free vs.
> Pro. Confirm the exact table/column names against the app schema before relying
> on this.

## The funnel, end to end

1. **Visits** (Vercel page views) — how many people reached the site.
2. **Engagement** (`section_view`) — what they read, how far they scrolled.
3. **Intent** (`cta_click`) — how many clicked through to sign up.
4. **Sign-ups** (Supabase `auth.users`) — how many actually created an account.

Steps 1–3 are in the Vercel dashboard. Step 4 is the Supabase query above.

## Possible next step (not built here)

A single daily digest (for example, an email or Slack message at 8am with
"visits, top section, CTA clicks, new sign-ups") would need the app's Supabase
number combined with the Vercel figures. That crosses into the app side, so it is
left as a follow-up to set up deliberately with the owner.
