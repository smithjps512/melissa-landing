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

### Daily sign-up query (confirmed against the app's Supabase)

- **Project:** `Melissa-Platform` (ref `fwmdaepypirducucqiyx`).
- **Table:** `public.users` (one row per teacher account, linked to `auth.users`).
  `created_at` is the sign-up time; `tier` is `free` / `pro` / `school`;
  `is_founding_member` flags the grandfathered $99 cohort.

Headline numbers (today in Central time, plus 7- and 30-day):

```sql
select
  (select count(*) from public.users) as total_teachers,
  (select count(*) from public.users
     where created_at >= date_trunc('day', now() at time zone 'America/Chicago')) as signups_today,
  (select count(*) from public.users where created_at >= now() - interval '7 days')  as signups_last_7d,
  (select count(*) from public.users where created_at >= now() - interval '30 days') as signups_last_30d;
```

New accounts per day, last 30 days:

```sql
select (created_at at time zone 'America/Chicago')::date as day,
       count(*) as new_signups
from public.users
where created_at >= now() - interval '30 days'
group by 1
order by 1 desc;
```

Tier split (and how many are grandfathered founders):

```sql
select coalesce(tier,'(null)') as tier,
       count(*) as teachers,
       count(*) filter (where is_founding_member) as founding
from public.users
group by tier
order by teachers desc;
```

> `public.users` counts teacher accounts. `public.students` is a separate,
> COPPA-compliant student table and is not a sign-up in the marketing sense.

### Logins / active users

`public.users.last_login_at` holds each teacher's **most recent** login.

```sql
select
  (select count(*) from public.users
     where last_login_at >= date_trunc('day', now() at time zone 'America/Chicago')) as active_today,
  (select count(*) from public.users where last_login_at >= now() - interval '7 days')  as active_7d,
  (select count(*) from public.users where last_login_at >= now() - interval '30 days') as active_30d;
```

> **Limitation.** Because `last_login_at` stores only the latest login, these are
> **daily / weekly active users** (distinct teachers who have logged in), not a
> count of login *events* and not a reconstructable per-day history. A true login
> time-series would need the app to write a row per login (the `activity_logs`
> table exists but is empty). That is an app-side change, out of scope for this
> repo.

### What they did (tool usage)

Each tool writes to its own table with `teacher_id` and `created_at`. Count of
items created in the last 7 days, by tool:

```sql
select
  (select count(*) from public.presentations where created_at >= now() - interval '7 days') as presentations,
  (select count(*) from public.lessons        where created_at >= now() - interval '7 days') as lessons,
  (select count(*) from public.materials      where created_at >= now() - interval '7 days') as materials,
  (select count(*) from public.puzzles        where created_at >= now() - interval '7 days') as puzzles,
  (select count(*) from public.assignments    where created_at >= now() - interval '7 days') as assignments,
  (select count(*) from public.conversations  where created_at >= now() - interval '7 days') as chats;
```

Materials break down by kind via `public.materials.type` (e.g. `worksheet`,
`handout`, `exit_ticket`):

```sql
select type, count(*) as made_last_7d
from public.materials
where created_at >= now() - interval '7 days'
group by type
order by made_last_7d desc;
```

Per-teacher usage (who is doing what), last 7 days:

```sql
select u.email,
       (select count(*) from public.presentations p where p.teacher_id = u.id and p.created_at >= now() - interval '7 days') as presentations,
       (select count(*) from public.materials     m where m.teacher_id = u.id and m.created_at >= now() - interval '7 days') as materials,
       (select count(*) from public.puzzles       z where z.teacher_id = u.id and z.created_at >= now() - interval '7 days') as puzzles,
       (select count(*) from public.conversations c where c.teacher_id = u.id and c.created_at >= now() - interval '7 days') as chats
from public.users u
order by presentations desc, materials desc;
```

## The funnel, end to end

1. **Visits** (Vercel page views) — how many people reached the site.
2. **Engagement** (`section_view`) — what they read, how far they scrolled.
3. **Intent** (`cta_click`) — how many clicked through to sign up.
4. **Sign-ups** (Supabase `auth.users`) — how many actually created an account.

Steps 1–3 are in the Vercel dashboard. Step 4 is the Supabase query above.

## Automated daily digest

A scheduled Routine, **"Melissa daily digest (sign-ups, logins, tool usage)"**,
runs every morning at about 8am Central. It reads the Supabase numbers below
(read-only) and sends the owner a push + email in this shape:

```
Melissa daily digest

Sign-ups
- Today: N
- Last 7 days: N
- Total teachers: N (Free N / Pro N / School N)

Activity
- Logged in today: N
- Active last 7 days: N

Tools used (last 7 days)
- Presentations: N
- Lessons: N
- Materials: N
- Puzzles: N
- Assignments: N
- Chats: N
```

Notes:

- It only reports; it never modifies data and never touches this repo.
- The digest covers sign-ups (Supabase). Visits, section views, and CTA-click
  intent are in the Vercel Analytics dashboard; the two together are the full
  funnel.
- If a morning run reports that it could not reach Supabase, the fired session
  did not inherit the Supabase connection. Fix: recreate the Routine from the
  claude.ai Routines UI with the Supabase connector attached, or bind it to a
  session that already holds Supabase access.

To change the time, pause it, or delete it, use the Routines UI (trigger id
`trig_011632vaU28Q8LDeXahCwpoQ`).
