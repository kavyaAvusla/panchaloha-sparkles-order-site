# DRAFT — Product Requirements Document

**Product:** One-page order page for a local shop
**Client:** A local shop — a sweet house, a home kitchen, or a jewellery shop (name not yet confirmed)
**Status:** DRAFT — written from an unsigned prospect's interview answers, not from a signed brief
**Author:** [Consultant]
**Date:** 2026-09-26

> **READ THE CONTRADICTIONS FIRST.** Section 2 lists the places where what the client asked for cannot all be true at once. I have not picked a side for you. Every one of those needs a decision from you (or the client) before any building starts. Everything after Section 2 is written assuming you will come back and confirm them.

**Assumptions.** Anything I had to fill in because no real client told us is tagged inline as `[A#]` and listed in full in **Assumptions** at the end. If an assumption is wrong, the section it sits in may be wrong too.

---

## 1. What was said, and what it means for the build

The client's own phrases, quoted, and what each one actually costs to honour.

### "One page order site for a local shop"

- **Means:** a single page at one address. No menu, no second screen, no navigation.
- **Costs:** a single page forces every item into a priority order — someone must choose what sits at the top and what gets cut. It also means the whole thing stands or falls together: there is no "we'll fix that part later." `[A1]`
- **Implies:** one artifact, one approval, one launch.

### "a sweet house, home kitchen or jewellery shop"

- **Means:** the page is meant to fit three very different kinds of shop.
- **Costs:** a sweet house sells a short, seasonal list by box or weight; a home kitchen sells a small daily list; a jewellery shop sells categories with changing metal rates and a making charge on top. One page built to "fit all three" is likely to fit none of them well. `[A2]`
- **Implies:** a decision on one shared shape versus a shape per shop type (C1).

### "what they sell, prices, and a small photo strip"

- **Means:** a list of what the shop sells, a price beside it, and a short row of real photographs.
- **Costs:** "prices" is the most dangerous word in the brief. A sweet price changes with the season; a jewellery price changes with the day's metal rate and the making charge. A page showing a stale price is a promise the counter has to break. "Small" is undefined, and the photo count is the single biggest lever on how fast the page opens on a weak connection. `[A3]` `[A4]`
- **Implies:** a written pricing policy from the shop, a named owner who keeps it current, a photo budget, and the shop's permission to use the photographs.

### "The order form asks for name, phone and item and refuses to submit empty"

- **Means:** three fields, and the page will not send a form that is missing any of them. It says clearly which one is missing.
- **Costs:** three fields may be too few to describe a real order — a festival sweet box needs a date and a count; a jewellery order needs a size or specification; a home kitchen needs a delivery time. And "refuses empty" only guarantees the fields are filled, not that the person is real or reachable. `[A9]`
- **Implies:** a decision on the exact field list, and on how hard the refusal is (C3).

### "A Send my order button opens the shop's number with the item and price already typed in"

- **Means:** the customer's final action opens a written message to the shop with the item and the price already written in.
- **Costs:** this is the sentence with the most hidden weight. If the order leaves as a message to the shop's number, nothing is kept anywhere — the shop still has to read it, note it and remember it by hand, which is the very failure the page is meant to fix. The pre-typed price must match both the page and the counter, or it becomes a dispute. It also assumes the shop's number can receive written orders at all, that someone is watching it, and that the customer's own phone can open that number with the order already written in. `[A5]` `[A6]` `[A7]` `[A14]` `[A15]`
- **Implies:** a decision on whether the page is a hand-off only or the shop keeps a record, and exactly which number receives the order and who owns it (C4, C5).

### "Your name, Manikanta fairGold jewels, sits small in the footer"

- **Means:** every page carries a small credit to the maker in the footer.
- **Costs:** a page for a sweet house carrying another business's name — and a name that contains "jewels" — can confuse a customer about whose shop they are ordering from. The credit serves the maker's reach, not the shop's sale. `[A8]` `[A16]`
- **Implies:** an agreement with the shop on how visible the credit is, and whether a sweets shop will accept a "jewels" name on its page (C6).

---

## 2. What does not add up

Unresolved. Each needs a decision. I am not choosing for you.

**C1 — "One page" versus three different shop types.**
One page is cheap; three shop types are not the same shape. A home kitchen's short daily list, a sweet house's seasonal boxes and a jewellery shop's categories, rates and making charges do not compress into the same one-page design without something being cut.
**You have to decide:** one shared page that fits all three shop types, or a tailored page per type — and if tailored, which type ships first.

**C2 — Prices that move versus a page nobody updates daily.**
Sweet prices move with the season; jewellery prices move daily and carry a making charge. A page showing last month's number is worse than a page showing no number, because the customer treats it as a promise.
**You have to decide:** show a real number and name who keeps it true and how often, or show no number and a clear rule ("ask for today's price"), or a mix per shop type.

**C3 — "Refuses to submit empty" versus a hurried customer, and three fields versus a real order.**
A hard refusal protects the shop from empty messages, but it also turns away the shy or rushed customer who wanted to ask one thing. And three fields — name, phone, item — may not be enough to actually place the order (no date, no count, no size, no delivery time).
**You have to decide:** the exact field list, and whether the refusal is a hard block or a firm prompt.

**C4 — "Send my order" versus the shop keeping a record.**
If the order leaves as a message to the shop's number, nothing is stored. The customer believes they ordered; the shop still has only a message it must remember — exactly the problem the idea exists to solve. This is the most expensive decision in the brief to reverse.
**You have to decide:** is this a hand-off only, or does the shop end up with one clean record of each order? Decide now, before the first real order, not after.
**Resolved (client, 2026-09-28): the shop keeps a record.** The page saves each order as it is sent, so the shop ends up with one clean record of every order, still there after a refresh.

**C5 — "Opens the shop's number" versus a number that can actually take an order.**
The number may be a landline that cannot receive written messages, or one family phone used by several people, or simply unanswered outside opening hours. The pre-typed price must match what the counter charges.
**You have to decide:** which number receives orders, who watches it, during what hours, and what the customer is told to expect.

**C6 — The footer credit versus the shop's own face.**
A small "Manikanta fairGold jewels" credit on a sweet house's page can read as if the page belongs to someone else — and "jewels" on a sweets page reads oddly. The credit was asked for by the maker, not by the shop.
**You have to decide:** how visible the credit is, whether every shop accepts it, and what it says for a non-jewellery shop.

**C7 — "One page" times three shop types versus no date at all.**
The word "page" sounds quick and cheap. Three shop types, real prices, real photos and a working send action is not one sitting. No timeline and no acceptance date were stated anywhere. `[A11]`
**You have to decide:** the date you commit to, and what the client commits to (content, photos, prices) before that date.

**C8 — "Every order arrives" versus what a page can guarantee.**
The page can guarantee that the three fields are filled. It cannot guarantee the person is real, the number is reachable, or that the customer actually sends the message after the button opens.
**You have to decide:** what the page promises (completeness) and what it must never imply (a verified, reachable, genuine buyer) — and what the customer is told on screen.

**C9 — Who owns and updates the page after launch.**
No one was named to keep prices, photos and shop details current after it goes live. A page with a stale price is worse than no page.
**You have to decide:** who updates it, how often, and whether that is you or the shop — and at what point that becomes paid work.

---

## 3. Who this is for

The humans who will actually open this, and what each is trying to get done.

**The shop owner (the buyer and approver).**
Runs the shop the way it has always run. Wants more orders and wants to look modern without effort. Judges the page by whether it brings a real paying order. Not interested in tools, and will be upset by anything that looks broken to a customer. One named person makes the decisions and supplies the content. `[A2]` `[A13]`

**The person who receives the orders (counter staff, or the family member holding the shop's phone).**
Their day is interrupted by half-finished messages. They are the ones this page is really protecting. They need every order to arrive in one place, clearly, with a name and a number they can act on. They will quietly reject the page if it floods them with junk or if orders arrive somewhere awkward.

**The local customer, on a phone, on a weak connection.**
Often ordering on behalf of a family member. Wants three things fast: what is there, roughly what it costs, and how to order it. Will not read a long page and will leave if it is slow or confusing. `[A10]`

**The person who sees the link in a status or a group.**
Did not come looking. Gives it a few seconds. Decides from the shop's name, one or two photographs, the number and the address whether to go further. `[A10]`

**The maker (you).**
Wants a small, repeatable page that proves value quickly, needs no daily babysitting, and carries a footer credit that brings the next shop.

---

## 4. Scope, locked

What is in, for the first version.

1. **One public page per shop.** A single shareable address. No navigation, no second page.
2. **Shop identity block.** Shop name, one line about the shop, opening hours, a number that can be tapped to call, the full address, and a way to open the address so the customer can find the shop. `[A2]`
3. **What the shop sells.** The shop's own list, in the shop's own words.
4. **Prices.** Presented according to the policy decided in C2. `[A3]`
5. **A small photo strip.** A curated set of real shop photographs, within the budget decided under the photo question. `[A4]`
6. **Order form.** Name, phone and item — plus whatever C3 adds — which refuses to send with a required field empty and says clearly which field is missing.
7. **The send action.** A "Send my order" button that opens the shop's number with the item and price already written in. `[A5]` `[A7]`
8. **A confirmation.** A clear line on screen telling the customer what happens next (per C5).
9. **A footer credit.** "Manikanta fairGold jewels", small, in the footer. `[A16]`
10. **Mobile-first, fast on a weak connection.** The customer's phone on a weak connection is the target; a large-screen view is a bonus. `[A10]`
11. **A shareable link.** Suitable for pasting into a status or a group, showing the shop clearly when it appears. `[A10]`

Not listed here means not in scope. See Section 5.

---

## 5. Not building, and why

Out of scope, each with the reason I will read back to the client.

| Not building | Reason |
|---|---|
| Payment or checkout through the page | The shop sells at the counter. Taking money through the page brings disputes, refunds and responsibility the shop did not ask for. |
| Customer accounts or logins | Nobody asked, and they add a reason for a customer to give up. |
| Stock levels or "available today" markers | Keeping them true is a daily job. A wrong label sends a customer on a wasted trip. |
| Automatic price calculation (weight, metal rate, making charge) | This is a counter conversation, not a formula. A wrong auto-total becomes a dispute. |
| Order tracking or status | Needs somewhere to keep the status and someone to update it; no process was described. |
| A stored order record or an admin view | Not in by default — this is exactly what C4 must decide. Until it is decided, the page is a hand-off. |
| A multi-page catalogue, search or filters | Directly contradicts "one page" (C1). If the shop later wants this, it is new scope. |
| Self-serve editing by the shop | Adds a surface nobody was named to run (C9) and drags in much more than one page. |
| Reviews, ratings or testimonials | Needs moderation and risks content the shop cannot control. |
| Automatic replies or reminders | The customer wrote to a human; an automated reply makes the shop look absent. |
| A page in a second language | Waits for the language decision (open dependency 7). |
| Analytics beyond simple counts | Enough to prove value in Section 7, no more, until the shop asks. |
| A paid address in the shop's own name | Held until the address decision is confirmed. |

---

## 6. Phasing

What ships first, what waits. Each phase is usable on its own; nothing later is required for something earlier to work.

**Phase 1 — The shop, reachable.**
Shop identity, the number, the address, opening hours, what they sell, and the first real photographs. Ships first because it delivers value without depending on prices or the order form, and it can go live while C1, C2 and C4 are still being decided.

**Phase 2 — Prices.**
The pricing presentation decided in C2, and the photo budget. This content is the most likely to be wrong if rushed, so it follows the page rather than leading it. Blocked on the shop's written pricing policy.

**Phase 3 — The order form and the send action.**
The form, the refusal and the send button, built to the field list and the send destination decided in C3, C4 and C5. This is the phase with the most unresolved decisions, which is why it ships after them.

**Phase 4 — Launch and steady state.**
The update and ownership routine from C9, plus any corrections the shop finds once real customers use it.

**Gated on decisions, not time:** C1 (one page or per type), C2 (prices), C3 (fields and strictness), C4 (record or hand-off), C5 (which number and who watches it), C6 (footer credit), C7 (date), C8 (what is promised), C9 (ownership).

---

## 7. Success metrics

How we will know it worked, in numbers. Targets are proposals and are assumptions until the client agrees. `[A12]`

- **Orders started.** Target: at least N per month.
- **Orders the shop confirms were genuine and reachable.** Target: at least X% of all orders started. This is the honest version of "every order arrives."
- **Empty-field attempts blocked.** Should be greater than zero — a guard that never fires may be broken or unused — but not so high that the form is a wall for real customers.
- **Orders that arrived with a name and a number the shop could reach.** Target: at least Y%.
- **Calls started from the page.** Tracked as a count, since calling is still a main way shops work.
- **Time to open the page on a mid-range phone and a weak connection.** Target: fast enough that a five-second visitor sees the shop's name, number and what it sells. The exact threshold is set with the client.
- **Orders answered within the shop's stated window.** Target: at least Z% answered within the hours agreed in C5.
- **The link shows the shop clearly when shared.** Yes or no — checked by pasting it into a real conversation.
- **Page accuracy over time.** Target: no customer complaint about a wrong price over the first quarter. One complaint here means C2 or C9 is unresolved in practice.

---

## 8. Open dependencies

What I am waiting on from someone else. Nothing here is a build task; all of it is a blocker until answered.

1. **The shop's confirmed identity.** Exact trading name, spelling, one-line description, opening hours.
2. **Contact details.** The number that receives orders, the full address, and how the address should open.
3. **What they sell, and prices.** The shop's own list, plus the pricing-and-upkeep policy from C2.
4. **Photographs.** A usable set of real photographs, with the shop's confirmation that it owns the right to use them. `[A4]`
5. **The order field list and the refusal rule.** The client's answer to C3, in their own words.
6. **The send destination and its owner.** Which number receives the order, who watches it, in what hours, and the answer to the record-or-hand-off question (C4, C5).
7. **Language and tone.** The language and register the shop's customers actually use. `[A10]`
8. **The footer credit agreement.** How visible the credit is, and that the shop accepts it (C6).
9. **"Real" and "refuses."** The client's answers to C3 and C8, so the page matches what they expect.
10. **The date and the signature.** The client's answer to C7, and the signature that turns this DRAFT into a brief.

---

## Assumptions

Every place I filled a gap that a real client would have filled. If any one of these is wrong, the sections that cite it may need to change. I will correct them in the same document, in the same change.

- **A1 — "One page" means one address**, not literally one screen of content. → Section 1, C1.
- **A2 — The shop is a single physical location with a known owner** who can approve the content and speak for the business. → Sections 1, 3, 4.
- **A3 — "Prices" means numbers the shop is prepared to state publicly**, not private internal costs, and a named person can keep them current. → Section 1, C2.
- **A4 — The shop can supply real photographs and owns the right to use them.** No photo shoot is in scope unless separately agreed. → Sections 1, 4, 8.
- **A5 — The shop's number can receive written orders**, not only voice calls. → Section 1, C4, C5.
- **A6 — Someone at the shop watches that number during the stated hours.** → Section 1, C5.
- **A7 — The price written into the message is the same price shown on the page and charged at the counter** (one source of truth). → Section 1, 4.
- **A8 — The footer credit is the maker's own brand**, and the shop accepts a small credit on its page. → Section 1, C6.
- **A9 — "Refuses empty" means the fields are complete**, not that the buyer is verified or genuine. → Section 1, C3, C8.
- **A10 — The shop's customers read in the local language and mostly on phones**, often on a weak connection. → Sections 3, 4, 8.
- **A11 — There is no fixed deadline**, and the client's own supplied content is the main schedule risk. → C7.
- **A12 — All numeric targets in Section 7 are proposals**, not client commitments.
- **A13 — The client will make one named person available for decisions and content**, rather than decisions arriving from several people at once. → Sections 3, 8, C9.
- **A14 — The customer's own phone can open the shop's number with the order already written in.** → Section 1, 4.
- **A15 — The shop welcomes written orders from strangers**, rather than operating on voice calls alone. → Section 1, C5.
- **A16 — "Manikanta fairGold jewels" is the maker's own name**, not the shop's, and it is the credit that appears in the footer. → Section 1, C6.

---

*End of DRAFT. Unresolved contradictions are in Section 2; read those before acting on anything in Sections 3–8.*
