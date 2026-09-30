# Implementation Plan

**Product:** One-page order page for a local shop
**Inputs:** `PRD-order-site.md` (DRAFT, 2026-09-26) · `TECH-STACK-order-site.md` (DRAFT, 2026-09-26) · **Target: one week of half days (~10 available)**
**Status:** DRAFT — every gate named per step. This plan does not invent a decision; it puts each unresolved decision at the step where it first blocks progress, so it is made cheaply instead of discovered late.
**Author:** [Consultant]
**Date:** 2026-09-26

> **OVERRIDE (2026-09-28) — the client changed the brief.** The build uses **Next.js** and **Supabase** (a store), on the client's explicit instruction. The step order still holds, with two changes: Step 1's "no framework" and the "hand-off or record" gate before Step 6 are both settled — the shop **keeps a record**, so Step 6 carries the store from the start, and the app is a Next.js project at `order-site/` rather than a hand-written page. Everything else in this plan (the phone-visible ending per step, the tests, the cut order) is unchanged. See `order-site/REPORT.md`.
>
> The older `PRD.md` / `TECH-STACK.md` / `IMPLEMENTATION-PLAN.md` in this folder answer a different product (the jewellery catalogue) and are not touched by this document.

> **The ordering rule, which overrides everything else.** Every step ends with something openable on a phone and lookable-at. Not "the store is set up." A page on a phone screen. If a step cannot end that way, it is two steps, or it is in the wrong place.

**The other rule.** A step is not done when it is built. It is done when its **Test** line has run and the real output is pasted into `WORKLOG.md`. No test, no tick. No evidence, no claim.

**Time unit.** One half day ≈ 4 focused hours. Estimates assume the client's content is not the bottleneck; where a step waits on the client, the wait is named and is *not* counted in the estimate.

**Why this order.** A mistake at Step 2 is a content fix. The same mistake found at Step 9 means unwinding the page, the form, the content and the launch. So the three most expensive-to-reverse decisions are made early and in this order: the **public address and host** (Step 1, before one link is shared), the meaning of **the field list and "refuses"** (Step 5, as a screen, before the send action is wired), and **whether the shop keeps a record** (the gate before Step 6, before the first real order arrives).

---

## Phase A — Prove the pipe (the page, on the shop's real address)

Everything in Phase A ships and is useful even if the order form is never built. This is PRD Phase 1.

### Step 1 — Host, address, and the thinnest possible live page
**Built:** a free host that permits a commercial site is chosen (tech stack §2); the page is named, which fixes the public address; a skeleton page containing only the shop's name and a "page being prepared" line is live.
**Time:** 0.5 half day.
**What I can see on a phone:** the real address, opened on a real phone over mobile data (not office Wi-Fi), showing the shop's name, loading quickly.
**Catches:** a host whose free terms forbid a commercial site — the one limit that can force a decision at MVP (tech stack §2, §8) — and the shop's reaction to a provider-named free address *before* any content exists to rebuild. Also fixes the host's function and static-file model while it is still trivial to change.
**Test (must pass before this step is done):** fetch the live address with a real request and paste the status line; open it on the phone and confirm the name renders and the page is fast; paste both. If the address decision resolves to the shop's own name, register it now and attach it while the free address still resolves. Write the final address into `PRD-order-site.md` open dependency 2.
**Blocked by:** **the address question** (PRD C6 and open dependency 2). First question asked; must be answered before the page is shown to anyone.

### Step 2 — The shop's real identity block
**Built:** shop name, one line about the shop, opening hours, a number that taps to call, the full address, and a way to open the address so the customer can find the shop (tech stack §6, PRD §4.2). Real details from the client, not placeholders.
**Time:** 0.5 half day.
**What I can see on a phone:** the real shop identity, with a number that dials when tapped and an address that opens at the right place.
**Catches:** a wrong or half-right phone number or address — the cheapest possible place to find it out, before photos, prices and the order form sit on top of it.
**Test:** on a phone, tap the number and confirm it dials the correct one; tap the address and confirm it opens the right place; check every character against the client's written confirmation; screenshot both.
**Blocked by:** the client's confirmed identity and contact details (open dependencies 1–2).

### Step 3 — What they sell, the first prices, and the first real photos
**Built:** the shop's own list of goods, in the shop's own words; the first cut of prices — a rule or a number, per the still-open C2; and a small representative set of real photos, pre-cropped and compressed for phone screens and served from the host's CDN (tech stack §6.1). No gallery library.
**Time:** 1.0 half day.
**What I can see on a phone:** the shop's list, the price wording and real photos, still loading fast on mobile data.
**Catches:** **C1** (one page versus per shop type) — if the real list and photos cannot fit a fast one-page design, that is discovered here, not after the form is wired in. It also forces the photo budget and gives C2 its first bite.
**Test:** load the page on a throttled/slow connection and measure the time to first meaningful paint; compare against the PRD's "five-second visitor" intent and paste the measurement. Confirm in writing that the photos are the shop's to use (A4). Paste both.
**Blocked by:** the client's list, photos and categories, and the **C1** and photo-budget decisions.

### Step 4 — Share preview and the first counts
**Built:** the static title, description and one preview image so a pasted link shows the shop clearly (tech stack §6.5); a lightweight, privacy-friendly page-view counter (tech stack §6.8).
**Time:** 0.5 half day.
**What I can see on a phone:** paste the live link into the real messaging app and see a proper preview card with the shop's name and a photo; open the counter's dashboard on a phone and see the visit.
**Catches:** a distribution link that renders as a bare address — the exact thing A10 says kills the five-second glance, and the entire distribution mechanism (PRD §4.11).
**Test:** actually paste the link in the real app and screenshot the preview; confirm the counter records the visit; paste both. This is the moment the page becomes shareable, and it is gated on Step 1's address decision being final.
**Blocked by:** the language/tone decision at least for the title and description (A10).

**Phase A exit criteria — tick each:**
- [ ] A real address opens on a phone over mobile data and shows the shop's name.
- [ ] The address decision is made, written down, and the address is final.
- [ ] The number dials correctly and the address opens the right place.
- [ ] The shop's list, price wording and real photos are live, and the page still loads fast on a slow connection.
- [ ] Pasting the link into the real messaging app produces a preview showing the shop.
- [ ] The page-view counter is recording.
- [ ] Every item above has a pasted real output in `WORKLOG.md` (status line, screenshots, measurement).

---

## Phase B — The order slip (the risky requirement)

This is PRD Phase 3, brought forward because it is the product's core promise. Its *meaning* is unresolved (C3), so the meaning is tested before the machinery is built.

### Step 5 — The order form's face and its refusal, with the send switched off
**Built:** the three fields (name, phone, item) plus whatever C3 adds, and the refusal: submitting with a required field empty does not send, and says clearly which field is missing. The Send button is deliberately **not** wired to anything yet.
**Time:** 0.5 half day.
**What I can see on a phone:** try to submit empty and get refused with a clear, specific message naming the missing field; fill all fields and nothing is sent (intentional for this one step).
**Catches:** the most valuable and cheapest catch in the plan — whether the field list and "refuses" (**C3**) mean what the client actually expects. A hard block that turns away a shy customer, or a three-field form that cannot describe a real order, is found here as a screen change, not as a rebuild of the send action.
**Test:** walk the client through it on a phone. Try each field empty in turn, confirm the named-field message, and record the client's yes/no on the field list and the strictness. Update `PRD-order-site.md` C3 with their answer **before Step 6**. Paste the client's written answer.
**Blocked by:** **C3**. If the client cannot answer, do not proceed to Step 6 on a guess — the form's promise *is* the product.

### Gate before Step 6 — decide now, do not defer
**Are orders stored, or is the message a hand-off only?** (PRD C4; tech stack §3–§4.)
- **Hand-off:** no server and no store. Step 6 is as written. This is the MVP default.
- **Record:** the store and a small, access-gated view are built **inside Step 6** (add 1 half day). Once anything is stored, the browser checks are no longer enough — the server must own the validation and save nothing invalid.

Deciding at this gate is cheap. Discovering it after launch has already lost every order it was meant to keep. This is the runner-up to the most expensive decision in the stack (tech stack §9).

### Step 6 — The send action (and the record, if chosen)
**Built:** the "Send my order" action that opens the shop's number with the item and the price already written in, and the on-screen confirmation line telling the customer what happens next (PRD §4.7–4.8; tech stack §6.4). If C4 resolved to **record**: one server function beside the page that re-validates and writes the order to the store, plus the access-gated view.
**Time:** 0.5 half day (hand-off) / 1.5 half days (record).
**What I can see on a phone:** tap Send my order and see the shop's number open with the order written in; actually send it and receive it on the shop's phone, with the name and the number.
**Catches:** a number that cannot take written orders, a pre-filled price that disagrees with the counter (A7), and a send action that fails on a real phone. This is the core promise, tested before launch while order volume is one.
**Test:** from a phone, send a real order and confirm it arrives on the shop's phone with name, phone, item and price. Then bypass the page checks and post an incomplete order directly: with **no** store, there is nothing to save — state that plainly; if a record **exists**, confirm the server refuses the incomplete order and nothing is stored. Paste both outcomes.
**Blocked by:** **C4** (record or hand-off) and **C5** (which number receives orders, who watches it, and the hours).

**Phase B exit criteria — tick each:**
- [ ] The form refuses an empty required field, and names the missing field on screen.
- [ ] The field list and the strictness are the client's, confirmed in writing (C3).
- [ ] Tapping Send opens the shop's number with item and price already written in.
- [ ] A real order from a phone arrives on the shop's phone with a name and a reachable number.
- [ ] If a record is kept, an incomplete order is refused by the server and saves nothing.
- [ ] The C4 decision is written down; if "record", the store and its access gate exist.
- [ ] Each item above has a pasted real output in `WORKLOG.md`.

---

## Phase C — The content that can be wrong (prices and the footer credit)

This is PRD Phase 2 and C6. Blocked on the client's policy, and the place a wrong word becomes a counter dispute.

### Step 7 — The price wording and its owner (C2)
**Built:** either a current price the shop stands behind, with a named owner and an update routine; or an explicit rule ("ask for today's price"); or the mix per shop type (PRD C2; tech stack §6.2). Which one is **C2's** decision, not the builder's.
**Time:** 0.5 half day (longer if the shop wants a full price list).
**What I can see on a phone:** the price, or the rule, on the live page — and the same number written into a test order.
**Catches:** a stale number presented as a promise — the single most dangerous content risk (C2) — and the two copies of the price drifting apart (A7).
**Test:** the client confirms the exact words in writing. If a number is shown, confirm who updates it and how often, and that the owner accepts it; if no owner exists, show the rule instead and record why. Confirm the number shown on the page and the number written into the message are identical, and that the live page matches the confirmed words exactly. Paste both.
**Blocked by:** **C2** and the shop's written pricing policy.

### Step 8 — The footer credit (C6)
**Built:** the small "Manikanta fairGold jewels" credit, at the agreed size, and the shop's acceptance of it (PRD §4.9, C6).
**Time:** 0.5 half day.
**What I can see on a phone:** the credit, small, in the footer of the live page.
**Catches:** a shop that will not carry another brand on its page — and a "jewels" name on a sweets page (C6).
**Test:** the client confirms the wording and the shop confirms in writing that it accepts the credit; confirm the live footer matches character for character. If the shop refuses, record the reason and remove or adjust the credit — this is the designed fallback, not a failure.
**Blocked by:** **C6**.

**Phase C exit criteria — tick each:**
- [ ] The price wording is the client's, confirmed in writing; if a number is shown, its owner and routine are named; otherwise a rule is shown and the reason recorded.
- [ ] The number shown on the page and the number written into the message are the same.
- [ ] The footer credit is agreed, or removed, in writing.
- [ ] The live page matches both confirmations character for character.
- [ ] Outputs pasted into `WORKLOG.md`.

---

## Phase D — Launch and steady state

PRD Phase 4.

### Step 9 — Full verification, then share
**Built:** a final pass across the real audience's conditions, an accuracy review with the client, and then the link shared into the status and the group with the agreed tone and language.
**Time:** 0.5 half day.
**What I can see on a phone:** the finished page on at least two real phones and one slow connection; an order sent end to end and received; the link actually live in the status and the group.
**Catches:** anything that only breaks on a real device, and any content the client changes their mind about once it is public.
**Test:** fetch the live address now and paste the status line. Send one real order from a phone and paste the received message. Open the page on a second phone and confirm it looks right. Screenshot the link in the status and the group. Record the launch date and the **C9** owner for future updates.
**Blocked by:** the **C9** ownership decision, the date (**C7**), and the client's go-ahead to share.

**Phase D exit criteria — tick each:**
- [ ] The live address is fetched now and the status line is pasted.
- [ ] A real order is received on the shop's phone and the message is pasted.
- [ ] The page is verified on a second real phone and on a slow connection.
- [ ] The link is live in the status and the group, screenshot pasted.
- [ ] The **C9** owner and update routine are written into `PRD-order-site.md`.
- [ ] `REPORT.md` is written per the harness.

---

## Decisions most expensive to reverse — and where in the order they happen

| Decision | Reversal cost | Where it happens | Why there |
|---|---|---|---|
| The public address and host | Highest — once shared in statuses it cannot be recalled, and one host choice pins every shop's link | **Step 1** | Made before any content exists and before anything is shared, while changing it costs minutes |
| Whether a record is kept (C4) | High — un-stored structured history cannot be recovered; reversing rewrites the order path, the store and the auth surface | **Gate before Step 6** | Decided before the first real order, so no order is lost to the wrong choice |
| The field list and "refuses" (C3) | High — it is the form's promise | **Step 5**, as a screen | Discovered as a screen change, not a rebuild of the send action |
| Prices (C2) | Business risk, not architectural — a stale number becomes a dispute | **Step 7** (first cut in Step 3) | Only after an owner for the number is named |
| One page versus per shop type (C1) | Moderate — a rebuild of the page's layout; content survives | **Step 3** | Forced into the open the moment the real list and photos are measured |
| The footer credit (C6) | Moderate — content, cheap to undo, but a refusal is best found early | **Step 8** | After the page works, before launch |
| The update owner (C9) | Moderate — a stale page | **Step 9** | Named before launch so the page does not rot |

The ordering is the point: the three decisions that hurt most are all made in Step 1 and Steps 5–6, before the expensive parts exist to unwind.

---

## What gets cut if the week slips

Decided now, in priority order, so nobody is choosing at 2am. **Cut from the bottom.**

1. **The page-view counter (Step 4).** If something must go, this goes first. The PRD metrics can start a week late; the page cannot be slow.
2. **The footer credit (Step 8).** Falls back to a plain line, or is removed outright if the shop refuses. It serves the maker, not the shop.
3. **The price detail (Step 7).** Falls back to a rule pointing to a call. **Never ship an unowned number.**
4. **The photo count (Step 3).** Fewer, better photos. This protects the one real risk — how fast it opens — and is already expected.
5. **The record path (the +1 half day in Step 6).** Falls back to hand-off only. **This cut loses the structured record** — if it is cut, say so in writing to the shop and revisit within a month; it is the runner-up irreversible decision.
6. **A second shop and the shared template (tech stack §6.6).** Waits. One shop first.

**Never cut, whatever the week does:**
- The address and host decision being final before the link is shared anywhere.
- The refusal naming the missing field — shipping a form that can be bypassed is shipping a false promise.
- The send action working end to end on a real phone.
- The number and address being exactly right.
- The share-preview metadata. It is the entire distribution mechanism.
- Honesty about what is *not* stored. The page must not imply a saved order when C4 chose a hand-off.

---

## Verification — how each step earns its tick

Written into every step above as its **Test** line, and governed by these standards:

- **Evidence is real output, now.** An address is fetched in this session and its status line pasted. A phone action is done on a phone and screenshotted. An order is received and the received message pasted. A measurement is taken and the number pasted.
- **Banned without evidence:** "should work", "should be live", "presumably". If it was not verified, it is marked `UNVERIFIED:`.
- **Built ≠ done.** A step is marked complete only after its Test line has run and its output is in `WORKLOG.md`. This applies per step, not per phase.
- **The failure mode this plan is built to resist:** a test that encodes the wrong requirement. Before trusting the form's test, ask whether it would fail if the form were wrong. A test that asserts an incomplete order is accepted is a wrong test. A "page loads fast" test run on office Wi-Fi when the audience is on mobile data is a wrong test. A hand-off that is quietly treated as a stored order is a wrong test.
- **Blocked steps are reported, not guessed:** a missing client decision or a wall is reported in the harness's `BLOCKED:` format, and the steps that do not depend on it carry on.

---

*End of DRAFT. This is a one-week order of work. The PRD's C1–C9 remain the brief, and each unresolved one is named as a gate at the step where it first blocks progress, not as a surprise at the end.*
