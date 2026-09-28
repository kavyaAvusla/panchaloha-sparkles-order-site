# REPORT — One-page order site (Next.js + Supabase)

**App:** `order-site/` — Next.js 15.5.25 App Router + TypeScript + `@supabase/supabase-js`
**Local link:** http://localhost:3000 (dev server running)
**Supabase project:** `https://owijvzgxwjsjdxxdxynz.supabase.co` — live; `items` and `orders` created and seeded
**Demo data notice:** the shop, address, hours, items and prices are demo values.

## Status per part

- App builds, type-checks, and serves: **DONE**
  evidence: `npm install` -> `added 34 packages in 2m`; `npx tsc --noEmit` -> `EXIT=0`; `npm run dev` -> `✓ Ready in 4.6s`; `GET http://127.0.0.1:3000/` -> `STATUS: 200`.
- One main screen — shop identity, what they sell with prices, photo strip, order form, footer credit: **DONE**
  evidence: page HTML contains `Panchaloha Sparkles Jewellery`, `Owner … Sravanthi`, `Narayanakhed, Telangana 502286`, the six category chips, `What we have`, **10** item cards (`class="item"` x10) with `/images/item-1.svg`, and the footer `Made by ConnectUs AI Agency`.
- Category buttons filter the jewellery: **DONE**
  evidence: `GET /` -> `STATUS 200`, 10 item cards, active `All`; `GET /?c=Panchloham` -> 2; `?c=One-gram gold` -> 2; `?c=Imitation` -> 3; `?c=GJ` -> 1; `?c=Gold covering` -> 1; `?c=Beads` -> 1; every page shows 7 filter buttons (`All` + the six) with the correct one marked active. Each demo item was tagged into one of the six categories in the `items` table (8 updated, 2 added).
- "New designs this week" strip: **DONE**
  evidence: `<div class="strip-row">` holds 8 `strip-card` tiles, each with an image + item name + category chip + price (`₹349`, `₹1,299`, `₹499`, `₹349`, `₹599`, `₹2,499`, `₹149`, `₹299`) — every price read from the `items` table, so a price still lives in exactly one place; 8 distinct images; the heading appears before `What we have`.
- Catalogue and strip are cards with the price under the picture: **DONE**
  evidence: `GET /` -> 10 `item` cards, each shaped `<img>` then `<h3>` name, `<p>` description, `<span class="cat">` category, `<div class="price">`; the 8 `strip-card` tiles use the same shape. HTML counts: `strip-card` 8, `strip-name` 8, `strip-price` 8, `item` 10, `price` 10, `cat` 18.
- Items and prices come from Supabase and stay after a refresh: **DONE**
  evidence: `GET /rest/v1/items?select=name,price&order=price.asc` -> `STATUS 200`, 8 rows from `Everyday Studs` (149) to `Bridal Combo Set` (2499); the same 8 render on the page.
- Orders are stored and the count persists: **DONE**
  evidence: `POST /rest/v1/orders` (the same call the page makes) -> `201` with id `f94570c9…`; page then showed `Orders recorded … 3`; `DELETE` that row -> `200`, deleted 1 row; page then showed `2`. Test row removed; the two seeded demo orders remain.
- Order form refuses to submit empty and names the missing field: **CODE DONE, UNVERIFIED in a browser**
  evidence: `app/order-form.tsx` `validate()`. No browser here, so only the fields' presence in HTML is proven; the save it triggers is proven above.
- "Send my order" opens the shop's number with item + price typed in: **CODE DONE, UNVERIFIED in a browser**
  evidence: `app/order-form.tsx` builds `sms:+919398616024?&body=…` and `https://wa.me/919398616024?text=…` from `Order from <name> (<phone>): <item> — Rs <price>. Please confirm.`
- Three states read differently, never the same blank page: **DONE — all three seen live**
  evidence: **setup** -> an instance run with `.env.local` moved aside showed `Setup needed … NEXT_PUBLIC_SUPABASE_URL is not set.` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set.`; **failed** -> before the tables existed, the page showed `Couldn’t load the shop’s items … Could not find the table 'public.items' in the schema cache`; **empty** -> after the tables existed but before the seed, the page showed `Nothing listed yet … the items table is empty`.
- SQL blocks provided (schema + demo data): **DONE**
  evidence: `order-site/supabase/schema.sql`, `order-site/supabase/seed.sql`; both pasted in chat and run by the member.
- Only the two public values used; no secret key anywhere: **DONE**
  evidence: `order-site/.env.local` holds exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; `lib/supabase.ts` reads only those two.

## What broke and how I fixed it

- The **first** project (`urwfxgyjcrszppywioqw`) did not exist in public DNS (NXDOMAIN via 1.1.1.1, 8.8.8.8 and Cloudflare DoH). Fixed by the member supplying a live project (`owijvzgxwjsjdxxdxynz`); `.env.local` updated and the dev server restarted.
- The new project had **no tables** (`PGRST205: Could not find the table 'public.items'`). I cannot run DDL with a browser key, so the member ran `schema.sql` (twice, "Success. No rows returned" — correct for DDL), then `seed.sql`. Verified afterwards: `GET /rest/v1/items` -> `200`, 8 rows.

## Claims ledger

| Claim | Evidence |
|---|---|
| The app runs locally | `GET http://127.0.0.1:3000/` -> `STATUS: 200`; dev log `✓ Ready in 4.6s` |
| The code type-checks | `npx tsc --noEmit` -> `EXIT=0` |
| The project is reachable and the key accepted | `GET /rest/v1/items?select=id` -> `200` (earlier `404 PGRST205`, never `401`) |
| The tables exist | `GET /rest/v1/items` and `/rest/v1/orders` -> `200` `[]` before seeding, `200` with rows after |
| The menu is live data, not hardcoded | items read from Supabase match the 8 cards rendered on the page |
| A saved order persists across a refresh | `POST /rest/v1/orders` -> `201`; page count `2 -> 3`; `DELETE` -> page count `3 -> 2` |
| Three states are distinct | the three rendered HTML states captured above |
| Only the two public values are used | `.env.local` content; `lib/supabase.ts` reads only those two |
| Form refusal and message-opening are unverified | no browser here; marked UNVERIFIED above |

## What I would tell the next person

- Open **http://localhost:3000**. The menu, prices and photo strip come from the `items` table; submitting the form writes to `orders` and opens the shop's number with the order typed in; the "Orders recorded" count stays after a refresh.
- The two things I could not verify without a browser: the form's refusal messages and the SMS/WhatsApp opening on a real phone. The save those buttons perform is proven, and their click handlers are in `app/order-form.tsx`.
- To see the three states on purpose: blank a setting in `.env.local` (setup), point at a dead URL (failed), or empty the `items` table (empty).
- The RLS policies are wide open by request — anyone with the public key can read, change and delete rows. Lock them down before this is used by a real shop.
- `order-site/` is new; `jewellery-catalogue/` was not touched.
