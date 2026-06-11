# Helitiva Labs — Content Plan (landing page mới)

## 1. Định vị (positioning)

**Helitiva Labs = applied technology lab.** Không phải agency, không phải viện nghiên cứu.
Một lab thử nghiệm công nghệ mới (AI agents, realtime web, automation) và biến thứ nào
sống sót qua thực tế thành sản phẩm chạy production cho đối tác.

- Câu định vị nội bộ: *"We test what's next, and ship what survives."*
- Khác biệt so với product studio cũ: bán "khả năng khám phá + tốc độ prototype",
  không chỉ bán "build theo spec".
- Giọng văn: tự tin, cụ thể, hơi contrarian. Cấm buzzword (elevate, seamless,
  revolutionize), cấm số liệu bịa, cấm em-dash.

## 2. Cấu trúc trang (one-page, 7 khối)

### 2.1 Hero — manifesto style
- Headline (chọn 1):
  - A. **"We build what's next, before it's obvious."**
  - B. "New tech, proven in production."
  - C. "Where unproven tech becomes working product."
- Sub (≤20 từ): *"Helitiva is an applied technology lab. We prototype with emerging
  tech and ship what survives contact with reality."*
- Badge: "Lab is open · accepting partners" (1 dot semantic duy nhất của trang)
- CTA chính: **"Work with the lab"** → contact. CTA phụ: "See experiments".
- Visual: giữ globe Three.js hoặc một visual lab-feel (particle/mesh) — quyết sau.

### 2.2 Now in the lab — các hướng đang khám phá
4 hướng, mỗi hướng 1 câu + trạng thái (Exploring / Incubating / Shipped):
1. **Agentic systems** — agents with tool access that do real work, with evals attached.
2. **OSINT system** — open-source intelligence pipelines that turn scattered public data into verified, searchable signals.
3. **Local & edge AI** — models that run where the data lives, not where the GPU bill lives.
4. **Automation infrastructure** — pipelines that survive retries, failures, and Mondays.

### 2.3 Experiments — selected work
3-4 card: tên experiment, nó chứng minh điều gì, stack, kết quả.
⚠️ CẦN INPUT THẬT từ user — không bịa client/projects. Nếu chưa có,
dùng placeholder có đánh dấu rõ và liệt kê những gì cần cung cấp.

### 2.4 From lab to product — cách hợp tác (3 phase)
1. **Probe** (tuần 1): cùng xác định câu hỏi cần trả lời, ranh giới kỹ thuật, tiêu chí thành công.
2. **Prototype** (14 ngày): demo chạy được, falsifiable, deploy staging. Giữ hoặc bỏ, có dữ liệu để quyết.
3. **Production**: thứ gì qua được prototype thì được engineer tử tế: tests, security, handover.
Giữ lời hứa cũ: 100% IP ownership, full source handover, 30 ngày support.

### 2.5 Principles — manifesto strip (4 câu, typography lớn)
- "Working code over slide decks."
- "Two weeks to a falsifiable demo."
- "Boring tech where it counts, new tech where it pays."
- "Everything we build, you own."

### 2.6 Notes (tùy chọn — chỉ làm nếu user sẽ viết thật)
Log ngắn từ lab: 2-3 bài. Nếu không có nội dung thật → bỏ section này.

### 2.7 Contact
- Headline: **"Bring us a hard problem."**
- Sub: *"We reply within one business day: what we'd try first, what it costs, and whether the lab is the right fit."*
- Form: name, email, "What should we explore?" (textarea) + mailto fallback.
- Submit: "Send it to the lab".

### Footer
Wordmark + tagline "An applied technology lab." + links + email. Không version number, không locale strip.

## 3. Ghi chú thực thi
- Tái dùng nền React + Vite + Tailwind v4 + lazy-ui đã setup (chỉ swap sections trong `src/landing/`).
- Brand: đề xuất giữ dark + emerald (đã nhận diện), tăng chất "lab" bằng mono font cho status/labels.
- CTA dedup: "Work with the lab" dùng thống nhất nav + hero.
- Eyebrow ≤ 2 cho cả trang; không đánh số section.

## 4. Quyết định đã chốt (2026-06-11)
- Experiments: dùng các dự án lab hư cấu do AI đề xuất (hướng: simulation engine kiểu colix.ai, quant trading AI, agent ops, knowledge AI).
- Notes section: BỎ.
- User sẽ gửi design.md riêng cho art direction; content + layout chốt trước.

---

# FINAL CONTENT DRAFT v1

## NAV (64px)
Logo "Helitiva Labs_" | Research · Experiments · Method | CTA: **Work with the lab**

## 1. HERO — editorial manifesto, full-width
Layout: căn trái, type lớn chiếm 8/12 cột, background là particle/agent simulation
canvas rất nhẹ (tự demo năng lực simulation của lab). Không split hero.

- Status (mono, 1 dot semantic duy nhất): `● LAB IS OPEN · ACCEPTING PARTNERS`
- H1 (2 dòng): **"We build what's next, before it's obvious."**
- Sub (20 từ): "Helitiva is an applied AI lab. We prototype with frontier tech,
  measure everything, and ship what survives contact with reality."
- CTA: **Work with the lab** (primary) · **See experiments** (ghost)

## 2. NOW IN THE LAB — research board
Layout: KHÔNG dùng card. Danh sách 4 hàng kiểu "bảng nghiên cứu": tên lớn bên trái,
mô tả giữa, status tag mono bên phải (Exploring / Incubating / Shipped).
Hover: hàng sáng lên nhẹ. Khác hẳn family card của section Experiments.

| Hướng | Status | Mô tả 1 câu |
|---|---|---|
| Scenario simulation | INCUBATING | Multi-agent engines that turn a written scenario into probabilities you can defend. |
| Quantitative trading systems | EXPLORING | LLM-assisted factor research with walk-forward validation, not curve-fit backtests. |
| Autonomous operations | INCUBATING | Agents with tool access that close tickets, reconcile books, and log every step. |
| OSINT system | SHIPPED | Open-source intelligence pipelines that turn scattered public data into verified, searchable signals. |

## 3. EXPERIMENTS — selected work (bento: 1 featured lớn + 3 nhỏ)
Layout: grid 2 cột; card đầu chiếm full chiều cao cột trái (featured), 3 card còn lại
xếp dọc cột phải. BorderGlow cursor-mode. Mỗi card: tên + tagline + mô tả + chips + status.

### Featured: Mirrorfield — scenario simulation engine [INCUBATING]
"Write a scenario in plain language. Mirrorfield convenes a panel of independent
analyst agents, runs the debate thousands of times, and returns calibrated
probabilities with confidence bands."
Điểm chứng minh: "Hallucination-controlled by deterministic validators. Calibration
tracked with Brier scores, so the engine knows when it doesn't know."
Chips: Multi-agent · Monte Carlo · Calibration · Deterministic validators
(Featured card có visual: mô phỏng nhỏ probability distribution / agent network)

### Signalbench — quant research copilot [EXPLORING]
"A research bench where an LLM proposes trading factors and a ruthless backtester
kills most of them. Walk-forward only. Surviving signals earn paper-trading."
Chips: Factor research · Walk-forward · Risk limits

### Nightdesk — autonomous back office [INCUBATING]
"An operations agent that reconciles invoices and answers tier-1 tickets overnight,
with an audit trail for every single action it takes."
Chips: Tool use · Audit trail · Human handoff

### Citetrace — verifiable knowledge engine [SHIPPED]
"Retrieval that shows its work: every answer carries citations a reviewer can click,
check, and challenge."
Chips: RAG · Citations · Eval suite

⚠️ Các experiment là fiction theo yêu cầu user; không gắn tên khách hàng, không số liệu
%. Status tag là semantic state hợp lệ.

## 4. METHOD — from lab to product (3 cột ngang + connector)
Title: **"From lab to product."** Sub: "Curiosity is free. Engineering is disciplined."
1. **Probe** (week 1): "We frame the question, the constraints, and what a win looks
   like. You get a written plan before any code."
2. **Prototype** (14 days): "A falsifiable demo on a staging URL. Keep it or kill it,
   with data either way."
3. **Production**: "What survives gets engineered properly: tests, security, handover.
   Your repo, your infra, your IP."
Guarantee strip: "Every engagement ends with full source handover and 30 days of
post-launch support."

## 5. PRINCIPLES — manifesto strip (typography lớn, full-width, stagger reveal)
- "Working code over slide decks."
- "Two weeks to a falsifiable demo."
- "Boring tech where it counts, new tech where it pays."
- "Everything we build, you own."

## 6. CONTACT — panel (AuroraMesh nền + scrim)
- H2: **"Bring us a hard problem."**
- Sub: "We reply within one business day: what we'd try first, what it costs, and
  whether the lab is the right fit."
- Form: Name · Work email · "What should we explore?" (textarea)
- Submit: **Send it to the lab** · fallback: hello@helitiva.com

## FOOTER
Wordmark + "An applied AI lab." · cột links (Research/Experiments/Method/Contact)
· © 2026 Helitiva · email. Không version number, không locale strip.

## Layout families (chống lặp):
hero manifesto → board rows → bento 1+3 → 3-col steps → big-type strip → form panel.
6 families khác nhau, không zigzag, eyebrow tổng = 1 (status hero).

---

# EXPANSION PACK v2 (2026-06-11) — 6 section mới

Thứ tự trang đề xuất sau khi thêm:
Hero → **Stats strip** → Now in the lab → Experiments → **Lab log** → Method
→ **Engagement models** → **Who it's for** → Toolbench → **How the lab runs**
→ Principles → FAQ → **Dispatch** → Contact → Footer

## A. STATS STRIP (ngay dưới hero)
4 con số cam kết (Counter wheel-effect khi vào view, đã có component):
- **14** days to a falsifiable demo
- **100%** IP and source ownership
- **30** days post-launch support
- **2** partner slots per quarter (tạo khan hiếm thật, user xác nhận con số)
Layout: 1 hàng 4 cột, không card. Animation: counter quay + fade stagger.

## B. LAB LOG — "The lab log."
Sub: "What graduated, what died, and why. We publish both."
Layout: timeline dọc, mốc quý (không ngày giả), status tag 3 màu:
GRADUATED (emerald) / KILLED (đỏ rose) / STARTED (xanh sky).
Animation: line dọc tự vẽ khi scroll, entries trượt vào từng cái, dot pulse ở entry mới nhất.
Entries (fiction, không tên khách):
- 2026 Q2 · GRADUATED — Citetrace moved to production with a compliance team.
- 2026 Q2 · STARTED — Mirrorfield calibration harness v2.
- 2026 Q1 · GRADUATED — Nightdesk pilot promoted to nightly production runs.
- 2026 Q1 · KILLED — Voice agent for field technicians. Latency never met the bar. Post-mortem delivered.
- 2025 Q4 · STARTED — Signalbench walk-forward engine.
- 2025 Q4 · KILLED — On-device receipt OCR. Accuracy plateaued below useful.
Giá trị: chứng minh ethos "killing is a result" bằng bằng chứng, không chỉ tuyên ngôn.

## C. ENGAGEMENT MODELS — "Ways to work with the lab."
3 card (giữa nổi bật hơn, border emerald 2px):
1. **Probe Week** — "One week, one question. A written answer: architecture, risk map,
   and a fixed quote for the next step." Gồm: scope call · written probe report · go/no-go rec.
2. **Prototype Sprint** ★ most engagements — "14 days to a falsifiable demo on a staging
   URL. Keep it or kill it, with data either way." Gồm: working demo · eval numbers · source from day one.
3. **Lab Residency** — "The lab embeds month to month. Research, prototypes, and
   production support on a rolling agenda." Gồm: rolling agenda · weekly demos · priority queue.
Không giá fake; chốt section: "Every model starts with the same 30-minute call."
Không CTA riêng từng card (tránh trùng intent), animation: 3 card stagger + hover lift.

## D. WHO IT'S FOR — "Built for people with real stakes."
3 persona, layout 3 cột text-first (không card, chỉ icon + đường kẻ trên):
- **Founders** — "You have a bet to validate before the next round. We make it
  demoable in two weeks."
- **Operating teams** — "Your back office eats hours. We automate the boring parts
  and audit the risky ones."
- **Funds & analysts** — "You want simulations and signals you can defend to a
  committee. Not a black box."

## E. HOW THE LAB RUNS — "The operating system."
4 ritual (khác Method: Method = phase per engagement, đây = nhịp sống lab):
- **Evals before vibes** — every model choice is a measured choice.
- **Demo Friday** — working software every week. No slideware.
- **Kill review** — experiments die in a meeting, not in a drawer.
- **Docs as deliverable** — if it isn't written down, it didn't ship.
Layout: 2x2 grid với icon, hoặc hàng ngang scramble-in. Animation: TextScramble tên ritual.

## F. DISPATCH (trước Contact) — "The dispatch."
"One email when something graduates or dies. No drip campaigns."
Form 1 input email + nút "Subscribe". Layout: 1 hàng gọn, nền tint emerald nhẹ.
(Email capture intent riêng, không đụng CTA "Work with the lab".)

Ưu tiên nếu không làm hết: **B (Lab log) > C (Engagement models) > A (Stats) > D > E > F**.
