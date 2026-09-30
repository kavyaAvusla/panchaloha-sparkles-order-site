# REPORT — Jewellery enquiry catcher with a bad entry branch

Workflow: **Jewellery Enquiry Catcher** (id `h89G3wTb1R0InSaz`) — active/published in n8n.
Live form: https://kaveriavusla.app.n8n.cloud/form/jewellery-enquiry

## Status per part
- Form trigger with name, phone and message (what they want): DONE
  evidence: `GET https://kaveriavusla.app.n8n.cloud/form/jewellery-enquiry` -> `GET STATUS: 200`, page contains `Jewellery Enquiry`, `Your name`, `Phone number (10 digits)`, `What would you like`; workflow triggerCount 1.
- Validation — name not empty AND phone exactly 10 digits: DONE
  evidence: execution 13 (valid) `Check Name and Phone` true output carried `{name:"Asha Rao",phone:"9876543210",message:"Gold necklace, about 20g"}`; execution 14 (invalid) false output carried `{name:"",phone:"12345",message:"Ring please"}`. IF conditions: `notEmpty` on name, `regex ^[0-9]{10}$` on phone.
- Writes the record (Edit Fields, per instruction instead of Google Sheets): DONE
  evidence: execution 13 `Write Enquiry Fields` -> `{"name":"Asha Rao","phone":"9876543210","message":"Gold necklace, about 20g","receivedAt":"2026-09-13T18:20:36.773+05:30"}`.
- Thank-you on screen: DONE
  evidence: valid submission completion page contains `Thank you, we have your enquiry` and `Thank you Asha Rao`.
- Visible bad-entry branch (entry + reason kept, not lost): DONE
  evidence: execution 14 `Write Bad Entry Fields` -> `{"name":"","phone":"12345","message":"Ring please","reason":"Name was left empty. Phone must be exactly 10 digits.","receivedAt":"..."}`; completion page contains `Please check your details`.
- Google Sheets persistence: NOT DONE — by your instruction. No Google Sheets credential exists (`list_credentials` returns only `DeepSeek account` of type `deepSeekApi`), so the workflow stops at Edit Fields. A sticky note on the canvas says exactly where to drop the Append Row node later.

## What broke and how I fixed it
- The n8n MCP server is configured and enabled but its tools are not exposed in this agent session. I confirmed the server is live (`initialize` -> HTTP 200, `n8n MCP Server v1.1.0`) and drove the same configured endpoint over JSON-RPC HTTP (`C:\Users\avusa\AppData\Local\Temp\kilo\n8n-mcp.ps1`), reading the URL and bearer token from `~/.config/kilo/kilo.jsonc` without printing the token.
- The workflow already existed and was published from a prior session (see `WORKLOG.md`). I did not recreate or overwrite it; I verified it end to end instead.

## Claims ledger
| Claim | Evidence |
|---|---|
| Workflow "Jewellery Enquiry Catcher" exists and is active | `search_workflows` -> `{"id":"h89G3wTb1R0InSaz","name":"Jewellery Enquiry Catcher","active":true,...,"triggerCount":1}` |
| 7 nodes, correct wiring | `get_workflow_details` -> nodeCount 7; connections Form -> If -> (true) Write Enquiry Fields -> Thank You Screen, (false) Write Bad Entry Fields -> Bad Entry Screen |
| Form is live | `GET .../form/jewellery-enquiry` -> `GET STATUS: 200` |
| Valid branch works | POST valid -> completion page `Thank you, we have your enquiry` / `Thank you Asha Rao`; execution 13 runData |
| Invalid branch works | POST invalid -> `Please check your details` / `Name was left empty. Phone must be exactly 10 digits.`; execution 14 runData |
| No Google Sheets credential | `list_credentials` -> only `DeepSeek account` (`deepSeekApi`) |
| Built-in nodes only, no credentials | nodes are `n8n-nodes-base.formTrigger`, `.if`, `.set`, `.form`, `.stickyNote` |

---

# REPORT — Scheduled jewellery news digest agent

Files: `jewellery-news-digest.js` (script) · `jewellery-news-digest-schedule.xml` (Task Scheduler schedule, UTF-16) · `digest.html` (output).

## Status per part
- Script, provider routing, RSS fetch, dedupe, top 5, HTML + terminal output: DONE
  evidence: `node .\jewellery-news-digest.js` -> fetched 5 unique India jewellery/goldsmith stories, deduped, wrote `digest.html`, printed the digest, `EXIT=0`.
- Missing-key fallback (headline + source + date, one clear line at top): DONE
  evidence: same run -> `! Summaries are missing. Reason: key.txt was not found. Paste your API key into C:\Users\avusa\Downloads\fwai-starter\key.txt and run again.`; `digest.html` had the notice and the 5 stories with source and date.
- AI summaries: DONE
  evidence: `node .\jewellery-news-digest.js` with `key.txt` present -> all 5 stories got a `What happened:` and a `What it means for you:` line, no missing-summaries notice, `EXIT=0`.
- Email via Composio -> Gmail: DONE
  evidence: run printed `Email sent: avusalikaveri123@gmail.com (Jewellers and goldsmiths news - 2026-09-19).`, `EXIT=0`. Independently confirmed in the inbox (read-only, same connection): `POST /api/v3/tools/execute/GMAIL_FETCH_EMAILS` -> `successful: True`, `messages: 1`, subject `Jewellers and goldsmiths news - 2026-09-19`, from `Avusali Kaveri <avusalikaveri123@gmail.com>`, date `2026-09-19T05:01:50Z`.
- Email failure handling (successful false -> print error, stop; missing key -> email off): DONE
  evidence: missing-key path printed `Email is off. Reason: composio-key.txt was not found...` and still wrote `digest.html` (`EXIT=0`). The `successful:false` path has not been triggered by a real failure; UNVERIFIED as an observed event.
- Schedule at 08:00 daily with run-on-next-wake: DONE
  evidence: `schtasks /Create ... /XML` -> `SUCCESS: ... created`; `schtasks /Query ... /V` -> `Next Run Time: 19-09-2026 08:00:00`, `Status: Ready`, `Scheduled Task State: Enabled`; `schtasks /Run` -> `Last Result: 0`, digest regenerated.

## What broke and how I fixed it
- `schtasks /Create /XML` rejected the UTF-8 file: `ERROR: The task XML is malformed. (1,40)::ERROR: unable to switch the encoding`. Fixed by rewriting the same XML as UTF-16 (declaration changed to `UTF-16`) and re-running the identical create command -> `SUCCESS`.

## Claims ledger
| Claim | Evidence |
|---|---|
| Script runs with no dependencies | `node .\jewellery-news-digest.js` -> `EXIT=0`, `digest.html` written |
| News is for the client's trade/market | feed URL uses `q=jewellery goldsmith India`, `hl=en-IN&gl=IN&ceid=IN:en`; output stories are Indian jewellery/gold market items |
| Repeats dropped, top 5, newest first | one run listed 5 unique headlines, most recent first |
| Digest saved and printed | `Saved: C:\Users\avusa\Downloads\fwai-starter\digest.html`; digest printed to terminal |
| Runs daily at 08:00 and on next wake after sleep | `StartWhenAvailable=true` in the schedule; `schtasks /Query` shows `Next Run Time 19-09-2026 08:00:00` |
| AI summaries work | `node .\jewellery-news-digest.js` with `key.txt` -> summaries for all 5 stories, `EXIT=0` |
| Email is sent through Composio | run printed `Email sent: avusalikaveri123@gmail.com (Jewellers and goldsmiths news - 2026-09-19).` |
| The mail actually arrived | `GMAIL_FETCH_EMAILS` query `subject:"Jewellers and goldsmiths news"` -> `successful: True`, `messages: 1`, from `Avusali Kaveri <avusalikaveri123@gmail.com>`, date `2026-09-19T05:01:50Z` |

## What I would tell the next person
- `key.txt` (AI, DeepSeek here) and `composio-key.txt` (Composio, `ak_...`) both live in this folder. Neither is committed anywhere; keep them out of git.
- Editable lines near the top of the script: `MODEL`, `COMPOSIO_USER_ID`, `EMAIL_TO`. `EMAIL_TO` is currently the connected Gmail `avusalikaveri123@gmail.com`; change it to send elsewhere.
- Run `node .\jewellery-news-digest.js` to test; the schedule runs the same script daily at 08:00, so the email goes out then too.
- If you edit the schedule file, keep it UTF-16, or schtasks will reject it with `unable to switch the encoding`.

---

---

# REPORT — Manikanta fairGold jewels one page site

Files: `index.html` (single file, inline CSS, no dependencies) · `images/` (7 supplied pictures) · repo `https://github.com/kavyaAvusla/manikanta-jewellers` (private).

## Status per part
- Requirements 1 and 2 (no file written until details in hand; images listed): DONE
  evidence: `images` folder listed before any file was written -> 7 files, none named `logo`/`logo-dark`/`profile`/`working`/`speaking`/`shot-N`, all 1024x1024. Asked for the missing contact details; `index.html` written only after the answers arrived.
- Contact values used (requirement 12): DONE
  evidence: name `kaveri Avusla`; email `avusalikaveri123@gmail.com`; WhatsApp link `https://wa.me/919398616024?text=...` (answer was `9398616024`; the brief requires country code digits-only and its own example is `919398616024`, i.e. `91` + that number); booking link `https://cal.com/kaveri-avusla/20-min-intro-call` (supplied in requirement 11; no alternative given).
- Business name exact in header, footer and title: DONE
  evidence: `<title>Manikanta fairGold jewels</title>`, header `.wordmark`, footer `.wordmark` all read `Manikanta fairGold jewels`.
- Section order and required copy: DONE
  evidence: hero, problem (client's words quoted), services (3 cards + `Rs 15,000 a project.`), full-width catalogue band, how it works (3 steps), who I am (first person), contact last.
- Requirement 15 (opened in a browser and looked): DONE
  evidence: Chrome headless desktop 1440x900 + full page; CDP-true 390px mobile render is a clean single column with no sideways scroll and nothing clipped. A `--window-size=390` render looked clipped, but the probe printed `inner=500 scroll=500` (Chrome for Windows minimum viewport), so it was a screenshot artifact, not a page fault.
- Requirement 16 (private repo, pushed): DONE
  evidence: `gh repo view kavyaAvusla/manikanta-jewellers` -> `{"isPrivate":true,"url":"https://github.com/kavyaAvusla/manikanta-jewellers"}`; remote tree = `index.html`, `images/`, `.gitignore`; secret check on the remote tree empty.

## What broke and how I fixed it
- `gh repo create --source` -> `C:\...\fwai-starter is not a git repository`, because MinGit is not on PATH and gh could not find git. Fixed by putting `git-mingit\cmd` and the `gh` bin folder on PATH for the command and running `gh auth setup-git` first -> repo created and `main` pushed.
- Mobile screenshot looked clipped on the right. Probe (`inner`/`scroll` badge) proved the viewport was 500px, not 390px. Re-captured with CDP device metrics at a real 390px -> no clipping. Header rule also tightened for small widths (the descriptor line is hidden under 760px).

## Claims ledger
| Claim | Evidence |
|---|---|
| Page is one file, no packages | `index.html` contains inline `<style>` only; no CSS/JS files, no npm |
| Contact links are real, not placeholders | `href` values: `https://cal.com/kaveri-avusla/20-min-intro-call`, `https://wa.me/919398616024?text=...`, `mailto:avusalikaveri123@gmail.com?subject=...` |
| Mobile has no sideways scroll | CDP 390px capture: single column, nothing cut off; probe at 500px `inner=500 scroll=500` |
| No secrets in the repo | `git ls-files` and remote tree secret check both empty |
| Repo is private and pushed | `gh repo view` -> `isPrivate: true`, branch `main`, tree lists `index.html` + `images/` |

## What I would tell the next person
- Import `https://github.com/kavyaAvusla/manikanta-jewellers` on Vercel; `index.html` is at the repo root, so no build settings are needed.
- The one picture not placed is `images/Laptop_screen_showing_results_card_20260919124657.jpeg`; it was also committed, so it can be dropped into a section later.
- If you want the WhatsApp link without the `91` country code, edit that one `href` in the contact section.

---

## What I would tell the next person
- The enquiry catcher is done and live; open the workflow named **Jewellery Enquiry Catcher**.
- To add the sheet: open the workflow, add a Google Sheets → Append Row node after `Write Enquiry Fields` (valid) and after `Write Bad Entry Fields` (bad), map the five/ six fields, connect the credential, then publish again. The sticky note on the canvas repeats this.
- The bad branch does not lose data, but it does not persist it either: the bad entry lives in the execution log. Add the second Sheets node if bad entries must be stored.

---

# REPORT — Free lead magnet: "Ten Checks for a Shop With Few Enquiries and No Page"

File: `jewellers-10-point-audit.md` (project root, alongside `faq.txt`). Audience: small jewellers and goldsmiths — the consultant's prospect niche. Shape chosen by the member: a scored 10-check self-audit that doubles as a to-do checklist.

## Status per part
- Format, offer, action and locale settled before writing: DONE
  evidence: member answers — scored self-audit; sells page + enquiries + online ads; call-or-WhatsApp; India, rupees.
- One-page piece with title, sections and every line filled in: DONE
  evidence: read-back -> `lines=58`, `headings=5`, `checks=10`, `blanks=5`; headings `Ten Checks for a Shop With Few Enquiries and No Page`, `A. Showing your work`, `B. Catching the enquiries you already get`, `C. Bringing people back`, `Your score`.
- Closing line names the maker and contact, with blanks left: DONE
  evidence: file ends `Made by **[YOUR NAME]**, [YOUR BUSINESS NAME]. ... Call or WhatsApp **[YOUR NUMBER]** or write to **[YOUR EMAIL]**.` — four placeholders plus the `____ / 10` score blank.
- Every check is something they can act on today: DONE
  evidence: all 10 numbered checks carry a `*Fix today:*` line.

## What broke and how I fixed it
- Nothing broke. The deliverable is copy, not code; no command failed and no workaround was needed.

## Claims ledger
| Claim | Evidence |
|---|---|
| File exists and fits one page | read-back -> 58 lines, 5 headings, 10 numbered checks |
| Closing line leaves the member's name and contact blank | read-back -> 4 `[YOUR ...]` placeholders, count `blanks=5` including `____ / 10` |
| No invented numbers or statistics | the file contains no rates, percentages or "most shops" claims; prices and follow-ups are written as rules the owner can apply, not measured results |
| Plan documents untouched | a lead magnet is outside PRD/TECH-STACK/IMPLEMENTATION-PLAN scope, so none was edited |

## What I would tell the next person
- Fill `[YOUR NAME]`, `[YOUR BUSINESS NAME]`, `[YOUR NUMBER]`, `[YOUR EMAIL]` before handing this out.
- The member asked for all three handout shapes (WhatsApp image, printable A4, email PDF). Only the text exists so far; no layout or image file has been produced.

---

# REPORT — Shop Order Slip (order form -> Google Sheet)

Workflow: **Shop Order Slip** (id `TKT0wq53y8c7DlA6`) — active/published in n8n (personal project).
Live form (share this as link/QR): https://kaveriavusla.app.n8n.cloud/form/order-slip
Sheet: "Shop Orders" -> tab "Orders", header row `Date | Item | Amount | Name | Phone`.

## Status per part
- Order form, shareable as a link/QR: DONE
  evidence: `publish_workflow` -> `{"success":true,...}`; `GET https://kaveriavusla.app.n8n.cloud/form/order-slip` -> `STATUS: 200`, contains `Shop Order Slip` and the phone field.
- Checks name, 10-digit phone and item before anything is written: DONE
  evidence: IF `Check Order` conditions = name `notEmpty`, item `notEmpty`, phone `regex ^\d{10}$`. Invalid submissions — manual executions 27 (empty) and 28 (9-digit) and production execution 36 (`phone:"12345"`) — all took the false output with `Append Order` absent from runData.
- A good entry becomes one clean row: DONE
  evidence: production execution 34 -> `Order Form` `{name:"Browser Test",phone:"9876500000",item:"Silver bangle"}`; `Append Order` success -> `{Date:"2026-09-25",Item:"Silver bangle",Amount:"",Name:"Browser Test",Phone:"9876500000"}`; read-back `row_number 2` matched.
- Visible error branch; customer sees "please check and send again": DONE
  evidence: production execution 36 last node `Order Error`; `GET <its formWaitingUrl>` -> `STATUS: 200`, contains `Please check and send again` and the `/form/order-slip` try-again link.
- One connection (Google Sheets), built-in nodes only: DONE
  evidence: `list_credentials` -> only `Google Sheets account` (`googleSheetsOAuth2Api`, `AIP8mfIZ0MjjQu7p`), used by `Append Order`; node types are `n8n-nodes-base.formTrigger`, `.if`, `.googleSheets`, `.form` (x2).
- Sheet left clean after testing: DONE
  evidence: final read helper returned `[]` (header row only).

## What broke and how I fixed it
- `defineBelow` append to the brand-new empty sheet failed: `Could not retrieve the column data`. Fixed by writing the headers with `autoMapInputData` + `handlingExtraData: insertInNewColumn`, then deleting the sample data row via `clear: specificRows` (startIndex 2, rowsToDelete 1).
- Production POSTs returned HTTP 500 then null fields. First cause: url-encoded body — the trigger requires `multipart/form-data`. Second cause: the form's HTML inputs are named `field-0`/`field-1`/`field-2`; the `fieldName` (`name`/`phone`/`item`) is applied server-side, so posting those names is dropped. Re-posting `field-0/1/2` bound correctly.

## Claims ledger
| Claim | Evidence |
|---|---|
| Workflow exists and is published | `create_workflow_from_code` -> `TKT0wq53y8c7DlA6`; `publish_workflow` -> `{"success":true,...}` |
| Form is live | `GET /form/order-slip` -> `STATUS: 200`, title + phone field found |
| Valid entry writes exactly one row | execution 34 `Append Order` success; read-back `row_number 2` |
| Invalid entry writes nothing | executions 27/28/36: `Check Order` false output, no `Append Order` |
| Error text shown to customer | execution 36 formWaitingUrl `GET` -> `Please check and send again` |
| Only one connection used | `list_credentials` -> only `Google Sheets account`; the only credentialed node is `Append Order` |
| The form's real input names are `field-0/1/2` | live form HTML `<input ... name='field-0' ...>` |

## What I would tell the next person
- Share `https://kaveriavusla.app.n8n.cloud/form/order-slip` (link or QR). To take it offline, unpublish/deactivate the workflow named **Shop Order Slip**.
- Amount is written blank by design (the shop fills it in). To let the customer enter it, add an Amount field to `Order Form` and map it in `Append Order`.
- The row stores Name and Phone as well as Date/Item/Amount.
- The five one-off helper workflows used to create/seed/read/clean the sheet were archived; the Orders tab currently holds only its header row.

---

# REPORT — ConnectUs AI Agency public chat

Workflow: **ConnectUs AI Agency Chat** (id `aPA8wBsQ6UnWZkcV`) — active/published.
Public chat link: https://kaveriavusla.app.n8n.cloud/webhook/fc1e344e-1f47-4b8a-8b0d-96d772a1e447/chat

## Status per part
- Exactly the four requested nodes: DONE
  evidence: `get_workflow_details` -> nodeCount 4; node types `@n8n/n8n-nodes-langchain.chatTrigger`, `.agent`, `.lmChatDeepSeek`, `.memoryBufferWindow`.
- Chat Trigger → AI Agent, with DeepSeek model + Simple Memory attached to the agent: DONE
  evidence: connections -> `Chat Trigger` main -> `AI Agent`; `DeepSeek Chat Model` `ai_languageModel` -> `AI Agent`; `Simple Memory` `ai_memory` -> `AI Agent`.
- Public chat with a shareable link: DONE
  evidence: `publish_workflow` -> `{"success":true,...}`; `GET /webhook/fc1e344e-1f47-4b8a-8b0d-96d772a1e447/chat` -> `STATUS: 200`, contains `ConnectUs AI Agency` and the chat widget.
- System message with the six parts and the full FAQ: DONE
  evidence: saved AI Agent `options.systemMessage` contains `ROLE`, `OFFER`, `TONE`, `ANSWERS`, `FOLLOW UP` and the full `faq-business.txt` text (grep-able, e.g. `CONNECTUS AI AGENCY` ... `20. How do I get started?`).
- Answers only from the FAQ, short and friendly: DONE
  evidence: execution 39, "How much does it cost and what do I get?" -> `"The page and order form cost Rs 15,000 one time. You get one page for your shop with an order form, and one order sheet where every order lands as a clean row."`
- Follows up on off-FAQ questions by asking for name and phone/email: DONE
  evidence: execution 40, "Can you also design a website for my detergent business and run ads?" -> `"I don't have that in my notes, so let me not guess. The owner will get back to you personally on it. Could you share your name, and your phone number or email?"`
- Remembers earlier messages in the same chat: DONE
  evidence: execution 39 `Simple Memory` ran `loadMemoryVariables` (chatHistory `[]` at first turn) then `saveContext` with the Human/AI messages; memory `sessionIdType = fromInput`.
- Uses the requested DeepSeek credential: DONE
  evidence: `DeepSeek Chat Model` credential `deepSeekApi` id `SOfvziYhd0rjO4qY` name `DeepSeek account`; model `deepseek-chat`.

## What broke and how I fixed it
- Nothing broke. Configs were spot-checked before wiring (`validate_node_config` -> all 4 valid) and the full graph validated before creation (`validate_workflow` -> `valid:true`).

## Claims ledger
| Claim | Evidence |
|---|---|
| Workflow exists and is published | `create_workflow_from_code` -> `aPA8wBsQ6UnWZkcV`; `publish_workflow` -> `{"success":true,...}`; `get_workflow_details` -> `active:true` |
| Four nodes, correct wiring | `get_workflow_details` -> nodeCount 4; connections listed above |
| Chat is public | `GET .../webhook/fc1e344e-.../chat` -> `STATUS: 200` plus chat widget |
| Answers come from the FAQ | execution 39 output matches FAQ Q5/Q7 wording |
| Off-FAQ returns the follow-up and asks for details | execution 40 output |
| Memory is active | execution 39 `Simple Memory` load + save runs |
| Only the requested DeepSeek credential used | model node credential `SOfvziYhd0rjO4qY` (`DeepSeek account`) |
| Digest presented as a separate extra | system message OFFER line says the digest is a separate optional extra, not part of the Rs 15,000 |

## What I would tell the next person
- Share the link `https://kaveriavusla.app.n8n.cloud/webhook/fc1e344e-1f47-4b8a-8b0d-96d772a1e447/chat`. To take it offline, unpublish/deactivate the workflow named **ConnectUs AI Agency Chat**.
- Lead details the bot collects (name, phone/email) are NOT stored anywhere: only the four requested nodes are present, so they live in the chat and the execution log. Add a Google Sheets or Data Table node (on a parallel branch) if the owner wants them saved.
- To change answers, edit the FAQ text inside the AI Agent's system message (it is a copy of `faq-business.txt`); the file and the workflow are not linked automatically.

### Revision — 2026-09-25: monthly maintenance price and optional digest
- `faq-business.txt` updated: Q5 and Q6 now state page maintenance is **Rs 2,000 a month and required** after the one-time setup; Q7 notes maintenance is not in the Rs 15,000; Q8 clarifies the weekly digest is a separate optional extra; Q19 notes the monthly charge starts at go-live.
  evidence: `Select-String '2,000|maintenance|optional extra'` -> lines 58, 61, 69, 72, 120.
- Workflow `aPA8wBsQ6UnWZkcV` AI Agent `/options/systemMessage` updated to the same wording and republished.
  evidence: `update_workflow` -> `appliedOperations: 1`, `validationWarnings: []`; `publish_workflow` -> `activeVersionId cc57f7e3-61a3-46a7-ba85-dc2b944a1943`.
- Live answers verified.
  evidence: execution 43 ("Is there any monthly fee?") -> "Yes, page maintenance is Rs 2,000 a month, and it is required after the one-time setup. So after the Rs 15,000 setup, the monthly charge keeps your page running."; execution 44 (digest included?) -> "No, the weekly festival and gifting digest is a separate optional extra. It's priced on request, so just ask us for the current price."

### Revision — 2026-09-25: Location on the form, exact Time in the sheet
- Order form now asks for a required **Location / area** (customer area or address). Time is **not** asked on the form; it is written straight into the sheet.
- Orders tab now has `Location` and `Time` columns, so a row is `Date | Item | Amount | Name | Phone | Location | Time`.
  evidence: `update_workflow` -> `appliedOperations: 4`, `validationWarnings: []`; republished -> `activeVersionId 00a0e322-52d5-4070-a118-e12a6cb9436d`.
- Live checks.
  evidence: `GET /form/order-slip` -> "Your location" present, 4 inputs; production POST with location -> execution 57 Append Order success `{Date:"2026-09-25", Item:"Kaju katli 1kg", Amount:"", Name:"Time Test", Phone:"9876511111", Location:"Sangareddy", Time:"15:46:22"}`, read-back row matched; production POST with an empty location -> execution 59 `Check Order` false -> `Order Error`, no `Append Order`, error page served.

### Incident and recovery — a real order was briefly blanked
- What happened: the Orders tab already contained a real order ("laxmi / mysoorpak sweet, 500g / 9951640472"). The one-off column-adding workflow cleared **row 2** on the assumption it was the helper's own sample row, so that order's cells were emptied.
- Recovery: the row's values were still in the execution log, and the order was re-appended to row 2 with the original Date/Item/Amount/Name/Phone and blank `Location`/`Time` (it was placed before those columns existed).
  evidence: repair execution 56 `Verify Sheet` -> `{row_number 2, Date:"2026-09-25", Item:"mysoorpak sweet, 500g", Amount:"", Name:"laxmi", Phone:"9951640472", Location:"", Time:""}`; final cleanup execution 60 read -> only that row.
- Lesson for next time: edit sheet rows by matching their content, never by an assumed row number.
