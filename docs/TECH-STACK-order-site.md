# DRAFT — Tech Stack

**Product:** One-page order page for a local shop
**Inputs:** `PRD-order-site.md` (DRAFT, 2026-09-26) · **Scale: 100 users. Not a million. That number.**
**Status:** DRAFT — depends on the PRD's C1–C9 being decided. Where a choice is blocked by one of those, this document says so instead of guessing.
**Author:** [Consultant]
**Date:** 2026-09-26

> **OVERRIDE (2026-09-28) — the client changed the brief.** On the client's explicit instruction the build uses **Next.js 15 (App Router) + TypeScript** and **Supabase** with `@supabase/supabase-js` (two tables, `items` and `orders`). This supersedes §1 (frontend framework), §3–§4 (no server, no database) and §5 (no auth) in this document. The reasoning is unchanged in spirit: the public address/host remains the most expensive choice to reverse (§9), and the record-or-hand-off question (§9, runner-up) is now resolved toward **record** — every order is stored. The app lives in `order-site/`; see `order-site/REPORT.md`.

> This stack is written against `PRD-order-site.md`. The older `TECH-STACK.md` in this folder answers a different product (the jewellery catalogue) and is not touched by this document.

> **Free-tier figures are UNVERIFIED.** Published plan limits and terms change without notice. Every number here is a shape, not a promise: verify the current terms at signup before trusting them. The *reasoning* is stable; the *numbers* are not.

---

## 0. The scale budget: what 100 users actually buys

Put the real numbers on the table first, because they are the constraint that forces every decision below.

| Quantity | Realistic value at this scale | Note |
|---|---|---|
| Visitors, total | ~100 | The stated number. |
| Worst-case simultaneous | ~10–15 | Only if the link is opened by a group at once. |
| Page loads | ~100 + cached repeat visits | Trivial. |
| Transfer, month 1 | Tens of MB if photos are optimised | The one place cheap choices get expensive. |
| Orders | A few a month; budget 20 | PRD §7. |
| Rows of data to store | Zero if the order is a hand-off; a few dozen if a record is kept | Decided by PRD C4. |
| Storage | Photos only; under ~100 MB if curated | The photo budget decides this. |
| Uptime needed | "Up when someone taps the link", no SLA | Free hosts are adequate. |

**Conclusion.** Scale is not the binding constraint and will not be for years. The binding constraints are:

1. **Zero operating cost** (the page is sold once, not run as a service), until a real limit forces otherwise.
2. **Speed on a weak phone connection** (PRD A10: the link lives in a status or a group; the visitor gives it five seconds).
3. **Terms that permit a client's commercial site** — a free tier can refuse a business even at zero traffic. This is the only "limit" that can force a choice at MVP.
4. **Repeatability across shops.** The maker sells the same page to many shops (PRD §3). At this scale that is a *labour* problem, not a scale problem — so the stack must make "copy the page, swap the content" cheap, and must not be a multi-tenant platform built to avoid a copy-paste.

Design to those four. Everything below is the cheapest thing that satisfies them.

---

## 1. Frontend framework

**Decision (MVP): no framework.** One hand-written page: a single markup file, one stylesheet, and a small amount of plain browser code used *only* for two things — the order form's immediate feedback, and composing the pre-filled message to the shop's number.

**The constraint that forced it.** PRD §1 "one page"; §4.10 and A10 mobile-first and fast on a weak connection; the send action (PRD §1) is a client-side hand-off, not a live data view. The product has no login, no routing, no personalisation and no live data binding — the four things a component framework exists to solve. Paying a first-load script cost to render text, photos and one form directly attacks the constraint that matters most.

**Rejected, and why:**

| Rejected | Why |
|---|---|
| React / Vue / Svelte single-page app | Ships a runtime and a bundle to display a static page and one form; slowest on exactly the cheap phones the PRD names. A build toolchain to maintain for one screen. |
| Next.js / Remix | Brings a server runtime and routing the page does not need. If a record is later wanted (C4), one small function beside the page is still enough, so this never becomes right. |
| Astro / Eleventy | The correct choice *later* if the number of shops grows (zero script by default), rejected now because one page does not amortise a build pipeline. Trigger to adopt: the maker is maintaining enough shops that a shared template beats copy-paste. |
| Tailwind / a component kit | A toolchain and a dependency for a design that fits in one stylesheet. |
| WordPress or a site builder | A running system to host, patch and secure, plus a plugin ecosystem and an admin surface, to produce one static page. Overkill at 100 users, and it drags in the auth problem (§5) for free. |

**MVP → production.** If the shop count grows, adopting a small static template/generator is a **rewrite of the build/templating** (the page content survives). Adopting a client-side framework would be a **rewrite of the page** and still wrong. Neither touches the address or the order path.

---

## 2. Hosting and the public address

**Decision (MVP): free static hosting with a free provider subdomain, on a host that permits commercial use and includes functions alongside the static files.** Named pick: **Cloudflare Pages** (`<project>.pages.dev`). *(Confirmed as the pick; the free-tier terms and limits below are UNVERIFIED.)*

**The constraint that forced it.** PRD C6 and the address decision require a free address under a provider's name; §4.11 needs a link that previews well; A10 needs a network close enough to a small town to feel fast; and if C4 ever resolves to "keep a record", Phase 3 needs a small function beside the page. The site is a real shop's public face, so the free tier's terms must allow a commercial site.

**One decision, many addresses.** The maker picks the host once, but every shop's page sits on it and every shop shares its own link (PRD §4.11). So the host choice is made once and touches every shop at the same time. That is why it is the most expensive choice here (§9).

**Rejected, and why:**

| Rejected | Why |
|---|---|
| Vercel Hobby (free) | UNVERIFIED: the free tier is intended for personal/non-commercial use, and this is a shop's business page. It can breach terms independent of traffic. Verify current terms before ever choosing it. |
| GitHub Pages | UNVERIFIED: its terms discourage using it as free hosting for a business, and it has no first-party serverless function, so the record path (if chosen) needs a second provider. Fast and free, wrong on terms and on the function. |
| Netlify free | A valid runner-up and it permits commercial use, but its free function/transfer allowances are tighter than Cloudflare's and it adds nothing here. Keep as the fallback. |
| A rented server (VPS) | An always-on machine to patch, secure, monitor and pay for, in order to serve ~100 visitors and a handful of orders. Pure overhead. |
| A paid static host | Nothing at this scale requires it. |

**The limit that would force you off free:** *not traffic.* At 100 users per shop you will not approach any volume allowance. The forces are:
- **Terms, not volume** — if the host's free tier forbids a commercial site, that forces a change regardless of load (above).
- **A shop-named address** — if a shop (C6) wants its link under its own name, that forces a domain purchase (a small annual fee); hosting stays free.

**MVP → production.** Free subdomain → a shop's own domain is a **config/DNS change plus an annual fee**, not a rewrite — but note it changes that shop's *address*, and addresses already shared cannot be recalled (§9). Changing hosts is a **re-deploy**, not an app rewrite, because every page is static files and at most one function.

---

## 3. Server functions (the order path)

**Decision (MVP): none.** The PRD's send action opens the shop's number with the item and the price already written in (PRD §1). Nothing is saved by the page, so there is nothing for a server to do. The stack has **no backend at MVP**.

**The constraint that forced it.** PRD C4 is unresolved, and the shape the client described — a message to the shop's number — is a hand-off. A server exists to *save* or to *send on the shop's behalf*; the hand-off needs neither. Adding a server now would be building for a decision the client has not made.

**The honest limitation to say out loud.** With no store and no server, the page's checks are the only guard. That is enough when the record *is* the customer's own message, because there is nothing to save wrongly. It is **not** enough once anything is stored: a save can be reached without the page, so the server must own the check and invalid input must save nothing (PRD C8). Do not carry "browser-only is fine" across that line.

**Rejected, and why:**

| Rejected | Why |
|---|---|
| A standalone application server (Express/Django/Rails on a VPS) | A process to run, patch and pay for, to place zero orders a month. |
| A third-party form service as the *design* | Fastest to start, but the orders sit inside a vendor's free tier, and any change of destination or record-keeping forces a migration anyway. Acceptable as a one-day stopgap; rejected as the architecture. |
| Browser-only validation *for a record* | Bypassed in one line. Valid only for the hand-off, where nothing is stored (§ above). |
| Sending the order from the page with a credential | No credential may reach the customer's page. If orders are ever sent by the shop's own account, the secret lives in a server function, not in the page. |

**MVP → production (if C4 resolves to "keep a record").** One serverless function beside the static page on the same host: it re-validates the fields, refuses anything incomplete, and writes the order (name, phone, item, price, and the time it arrived) to the store in §4. Adding this is a **rewrite of the order path**, not a config switch — the page gains a submit destination, a store must exist, and a view must exist.

---

## 4. Database

**Decision (MVP): none.** The pre-filled message the shop's number receives *is* the record, and the shop's own message history is where it lives. Nothing else is kept.

**The constraint that forced it.** Scale 100 per shop; a few orders a month; no admin view in scope; and C4 unresolved. The cheapest thing that genuinely serves the stated scale is *no datastore at all*.

**Rejected, and why:**

| Rejected | Why |
|---|---|
| Managed Postgres / MySQL (Neon, Supabase, RDS) | A database server, connection management, backups and a bill, to hold at most a few dozen rows. |
| MongoDB / DynamoDB | The same overhead, with schema flexibility the product has no use for. |
| Supabase / Firebase as a bundle | Attractive only because it bundles auth + database + dashboard. There are no authenticated users and no dashboard in scope, so it is a large surface for an empty problem. |
| A spreadsheet as the *system of record* | Fine as a *destination* for orders, but making it the store gives the shop's data a second home to keep true, and a live dependency for a hand-off that needs none. |

**The trigger to add one:** C4 resolves to "the shop keeps a record", or C9 resolves toward "someone other than the phone-holder must see orders".

**MVP → production (if forced).** An edge SQLite-class store co-located with the function (Cloudflare D1) or a free Postgres (Neon). At 100 users, SQLite-class is more than enough; Postgres is overkill. Adding it is a **rewrite of the order path**, and if the shop is to *view* the stored orders it drags in authentication (§5).

---

## 5. Authentication

**Decision (MVP): none of ours.** The public page has no accounts (PRD §5). The order leaves as a message to the shop's number, protected by the shop's own device lock — a credential we did not build and do not store. No customer login, no shop login, no password database.

**The constraint that forced it.** A page with no protected content has nothing to authenticate. Anything we built here would be the largest piece of code in the project with nothing behind it.

**Rejected, and why:**

| Rejected | Why |
|---|---|
| Customer accounts, social login, one-time codes | Nobody asked; adds a reason for a customer to abandon the order; creates personal data we would then be obliged to protect. |
| A shop login at MVP | There is no admin surface to protect until a database or a view exists (§4). |
| A hosted identity service (Clerk, Auth0, Supabase Auth) | No users to authenticate; a vendor and a cost with an empty gate. |
| Rolling our own password auth, ever | Disproportionate liability for this project. |

**The trap to name out loud:** the moment a shop wants to edit its own page (PRD C9), or wants to see its stored orders (PRD C4), that is an authenticated admin surface — and it is the thing that drags in a database, an identity system and possibly a different host. Until C4 and C9 are decided, do not build it.

**MVP → production.** Introducing auth is **not a config switch**. It is a new subsystem (identity, session, a protected view), and it arrives together with the database change in §4. It does not disturb the public page.

---

## 6. The PRD's features that demand a specific choice

### 6.1 Photos (PRD §4.5, C8, A4)
**Decision:** pre-optimised image files, cropped and sized for phone screens, served from the host's CDN; a small set of representative photos, not every item.
**Constraint:** the photo budget is unresolved (C8) and the visitor is on a weak connection (A10), making the photo count the single biggest lever on how fast the page opens. PRD §7 measures that time.
**Rejected:** full-resolution originals (the fastest way to make the page unusable on a weak connection); an image-transformation service at MVP (a vendor and an integration for a small, stable set of images); a gallery library (more script for a handful of images).
**MVP → production:** adding on-the-fly image transformation later is **config plus an address change**; changing the photo count is content.

### 6.2 Prices, and the price typed into the message (PRD §4.4, C2, A7)
**Decision:** the price lives in exactly one place in the page's own data, so the number the visitor sees and the number written into the message cannot disagree.
**Constraint:** prices move (C2) and the pre-filled price must equal the counter price (A7). A second copy of the price — a separate list the page reads, or a live feed — is a second thing to keep true, which is exactly how the two numbers drift apart.
**Rejected:** a live pricing feed (a vendor and a running system for a number the shop already knows); a separate price list read at run time (two sources of truth); showing no price at all (allowed by C2 only if the shop chooses the rule, not by default).
**MVP → production:** this is a **content and process** choice, not infrastructure. The real control is the named owner and the update routine from C2 and C9; no host or store change makes a stale price correct.

### 6.3 The order form and its refusal (PRD §4.6, C3, C8)
**Decision:** required-field checks in the browser, naming the missing field on screen. No CAPTCHA at MVP. A hidden honeypot field and simple per-visitor rate limiting go in **only if** the record path (§3) exists.
**Constraint:** PRD §1 "refuses to submit with empty name, phone or item"; C3 unresolved, so the *field list* and the *strictness* are pending while the *mechanism* is not. With no store, the browser is the only guard and that limitation is stated, not hidden.
**Rejected:** CAPTCHA at MVP (third-party script and friction for a five-second visitor, to solve abuse we have no evidence of); client-side-only checks *for a record* (one line to bypass — the guard must move to the server the moment anything is stored).

### 6.4 The send action (PRD §1, A5, A14, A15)
**Decision:** a plain pre-filled message composition that opens the shop's number with the item and price written in. No vendor, no server, no stored key.
**Constraint:** the client asked for exactly this hand-off; it needs nothing running, and any secret in the page would be exposed. What the page cannot promise is that the customer actually presses send (C8) — the confirmation line on screen (PRD §4.8) is what tells them what happens next.
**Rejected:** a messaging vendor (a dependency and a cost for a hand-off the phone already does); a short-link service (a vendor, a redirect dependency, and one more address that can be withdrawn).

### 6.5 Link preview when shared (PRD §4.11, A10)
**Decision:** static metadata on the page — title, one-line description, one preview image — so a pasted link shows the shop clearly.
**Constraint:** the product's entire distribution is a link pasted into a status or a group; a bare address kills the five-second glance (A10).
**Rejected:** relying on the provider's default preview; a link shortener (a vendor and a redirect for something the host already gives you).
**MVP → production:** content/config only.

### 6.6 Many shops and repeatability (PRD §1, §3)
**Decision (MVP): one page per shop**, its address fixed when the page is named; the page's content sits in its own files, and a new shop is a **copy with the content swapped**.
**Constraint:** the maker sells the same page repeatedly (§3), but each shop is still ~100 users. Building a multi-tenant platform now would be building a system to avoid a copy-paste — the exact enterprise reflex to resist.
**Rejected:** a single shared app with a database of shops at MVP (a platform, plus the database and auth of §4–§5, to serve shops that each need one page); a CMS (a running system and an admin surface for content that changes rarely).
**MVP → production:** if the shop count grows past what copy-paste can carry, a small template/generator — or a multi-tenant build — is a **rewrite of the build** (the per-shop content survives), and only once the count justifies it.

### 6.7 The footer credit (PRD §4.9, C6, A8, A16)
**Decision:** a small static line in the footer. Nothing architectural.
**Constraint:** the shop's acceptance is unresolved (C6), and what the credit says for a non-jewellery shop is a content decision, not a build one.
**Rejected:** anything dynamic or per-viewer for a fixed line of text.

### 6.8 Analytics (PRD §7)
**Decision:** a lightweight, privacy-friendly page-view counter, plus the order-start and call counts the page can already produce — exactly the PRD's metrics, no more.
**Constraint:** PRD §5 caps analytics at "simple counts"; §7 needs numbers to prove value; A10 forbids page weight.
**Rejected:** Google Analytics / Tag Manager (heavy, consent implications, far beyond the ask); a full product-analytics tool (no funnels, no product to analyse).

---

## 7. MVP vs production, at a glance

| Layer | MVP (free) | Production (if and when) | Config switch or rewrite |
|---|---|---|---|
| Frontend | Hand-written static page | Small static template/generator if the shop count grows | Rewrite of the build; content survives |
| Address | Free provider subdomain | A shop's own domain | Config/DNS + annual fee — but the shared address changes |
| Host | Free commercial-use static host with functions | Same host + domain, or another host | Re-deploy, not app rewrite |
| Server function | None (the order is a hand-off) | One function: validate + store, if C4 says record | **Rewrite** (order path) |
| Database | None (the message is the record) | Edge SQLite-class, or free Postgres, if C4 says record | **Rewrite** (order path) |
| Auth | None | Hosted identity if an admin surface appears (C4/C9) | **New subsystem**, not config |
| Photos | Pre-optimised files on the CDN | Image transformation service | Config + address change |
| Prices | One source of truth in the page's data | Same | Content/process |
| Order send | Pre-filled message to the shop's number | Same | Content |
| Validation | Browser checks, named missing field | Add server-side check if a record is stored | Depends on C4 — rewrite if a record is added |
| Link preview | Static metadata | Same | Config/content |
| Analytics | Lightweight view + order/call counts | Same, or vendor swap | Config |
| Editing | The maker redeploys the page | Self-serve CMS | **New subsystem (rewrite+)** |

**The rewrites — the only rows that matter:** the order path (if a record is kept), the database (arrives with it), authentication (arrives with the database), self-serve editing (arrives on top of both), and the multi-shop platform (only if the shop count justifies it). Everything else on this page is a config change, a content change, or a re-deploy.

---

## 8. The free-tier exit triggers

Exactly which limit forces you off free, and what it is not:

1. **Commercial-use terms — the only one that can force a decision at MVP.** A free tier that forbids a business site is breached by the shop regardless of traffic. Settled by **host choice up front**, not by growth.
2. **Bandwidth / requests.** Cloudflare Pages' free tier has no fixed transfer cap (fair use, UNVERIFIED) — 100 users cannot approach it. On a host with a hard cap, only a genuinely viral share could; the fix is caching and smaller photos, and the trigger is "monthly transfer exceeds the free allowance."
3. **Function invocations per day.** Only exists on the record path (§3). Free allowances are large (UNVERIFIED); a bot flood, not 100 users, is the only path to them. Fix: rate limiting — **not** a paid tier.
4. **Email sends per day.** Only if orders are emailed. 1–5 orders/month never reaches it.
5. **Build minutes / deploy count.** Only if you redeploy constantly — and note that **one page per shop means one deploy per shop** (§6.6). This is the one trigger this product can actually reach as it grows: many shops, many deploys. Fix: a shared template or a build step, not payment.
6. **Static file count / site size.** Only hundreds of full-resolution photos would hit it. Fix: compression, not payment.
7. **A shop-named address.** Not a growth limit — it is the C6/address decision. Costs a small annual fee; **hosting stays free.**

**Bottom line.** At 100 users you will almost certainly never leave the free tier on volume. The realistic forced costs are: choosing a host whose terms permit a commercial site (free, decided up front); a domain name if a shop stops accepting a provider address; and, if the shop count grows, a build step rather than a bill for deploys.

---

## 9. The decision most expensive to reverse

**The public address — and the host behind it.**

The product's entire distribution is a link pasted into a status or a group (PRD §1, §4.11). Once it is out, it sits in people's message history permanently; there is no recall. The maker chooses the host **once**, but every shop's page sits on it and shares its own address — so one host decision is pinned to many public links at the same time. If that link is a provider-named free subdomain and a shop later wants its own name (C6) — or the provider changes terms or withdraws the free tier — every previously shared link either breaks or must keep resolving through a redirect you may not control.

**Runner-up — and the choice the PRD itself flags: whether the shop keeps a record (PRD C4).** Choosing "hand-off only" means the first months of real orders live only in the shop's own message history, and structured history you never stored cannot be recovered — reversing it later is a rewrite of the order path plus a database plus an auth surface. It is a close second, and the two are linked: decide C4 *before* a shop shares its link, so the link that goes out points at the page you actually intend to run.

**Mitigation, decided before launch, not after:** settle the host's commercial-use terms and the address question before any link is shared. If a shop-named address might matter within a year, register that shop's domain up front, even while the free address carries the traffic, and keep the free address alive as an alias so old links keep resolving.

---

*End of DRAFT. The stack is blocked on the PRD's C1–C9; the two that most change this document are C4 (record or hand-off, §3–§4) and the address decision (§2 and §9).*
