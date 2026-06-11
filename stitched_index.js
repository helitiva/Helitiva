import os
import json
import re

transcripts = [
    "/Users/huy/.gemini/antigravity/brain/fb866933-9be7-4051-aa42-fef4dbdc4f55/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/3413c196-a1cd-4e48-9062-5bbd404d4f6b/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/70c9e403-353f-4519-ad4e-1e29a59c4c1f/.system_generated/logs/transcript.jsonl",
    "/Users/huy/.gemini/antigravity/brain/21ab0eb8-2c70-4858-a955-b6d96ef6fd5a/.system_generated/logs/transcript.jsonl"
]

for t in transcripts:
    if not os.path.exists(t):
        print(f"Skipping {t}: not found")
        continue
    
    print(f"\nScanning transcript: {t}")
    with open(t, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f):
            try:
                step = json.loads(line)
                
                # Check VIEW_FILE content
                if step.get("type") == "VIEW_FILE" and "content" in step:
                    content = step["content"]
                    # check if it looks like the index files
                    for filename in ["index.html", "index.js", "index.css"]:
                        if filename in content and len(content) > 1000:
                            print(f"  [VIEW_FILE] Line {line_num}: Found potential {filename} view, length: {len(content)}")
                            
                # Check tool calls
                for tool in step.get("tool_calls", []):
                    name = tool.get("name")
                    args = tool.get("args", {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    
                    target_file = args.get("TargetFile")
                    if target_file and any(f in target_file for f in ["index.html", "index.js", "index.css"]):
                        code = args.get("CodeContent")
                        if code:
                            print(f"  [TOOL_CALL {name}] Line {line_num}: Target: {target_file}, CodeContent length: {len(code)}")
            except Exception as e:
                pass

                                        "path": target_file,
                                        "log": path
                                    }
                except:
                    pass
    except Exception as e:
        print(f"Error reading {path}: {e}")

# Save the restored files
for filename, info in files_by_time.items():
    print(f"Restoring {filename} from {info['time']} (log: {info['log']})")
    out_path = f"restore_{filename}"
    with open(out_path, "w", encoding="utf-8") as out_f:
        out_f.write(info["content"])
    print(f"Saved to {out_path} ({len(info['content'])} chars)")

*   **Revamp:** Structure pricing sprint tiers with clean carbon cards, hover glowing borders, and smooth button overlays.

#### `Cases` (Featured Builds)
*   **Revamp:** Display case studies using **Code Hover Cards** showing performance snapshot metrics (Response latency, checkout conversions, traffic uplift).

#### `FAQ` Section
*   **Revamp:** Use the Lightswind **FAQ Accordion** component with smooth slide-down and rotation transitions.

#### `Estimator Form` Section
*   **Revamp:** Build a multi-step project scoping estimator in React, validating choices per-step with custom visual progress bars and dynamic cost range calculations.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure successful TypeScript compilation and bundle packaging.
- Check bundle sizes and compile logs.

### Manual Verification
- **Aesthetic Check:** Confirm dark Cyber Lab colors, glassmorphism blur headers, responsive scaling, and smooth hover translations.
- **Language Switch:** Verify that clicking the language switcher instantly updates headings, body texts, buttons, simulator placeholders, and estimator steps.
- **Form & Estimator:** Validate that form responses can be submitted, step validation alerts show correctly, and budget sliders function dynamically.
























            step3_desc: "Fixed product milestones. You pay for software shipped, not open-ended developer hours.",
            step4_title: "Full IP Transfer",
            step4_desc: "You own every single line of code, database schema, and LLM configuration we draft."
        },
        steps: {
            tag: "Development Pipeline",
            title: "Four steps. Full transparency.",
            desc: "From blueprinting to launching — how we deliver products with structural speed.",
            step1: "Scope & Architect",
            step1_desc: "We map system schemas, sequence flowcharts, and technical API constraints.",
            step2: "Build Prototype",
            step2_desc: "Our engineers ship a functioning v1.0 within 14 days, connecting all critical databases.",
            step3: "Code Audit",
            step3_desc: "Automatic security scans and testing models run to clean vulnerabilities.",
            step4: "Deploy & Transfer",
            step4_desc: "We publish to production and sign over 100% IP ownership and git repositories."
        },
        pricing: {
            tag: "Sprints pricing",
            title: "Flat-rate sprints. No estimates padding.",
            desc: "Simple, predictable plans. We deliver increments of code weekly.",
            plan1_title: "Prototype Sprint",
            plan1_desc: "Perfect for testing ideas, raising capital, or building small micro-automations.",
            plan1_price: "$8,500",
            plan1_time: "1-2 Weeks",
            plan1_item1: "Functional Prototype v1.0",
            plan1_item2: "Standard DB & API setup",
            plan1_item3: "100% Source code transfer",
            plan2_title: "MVP Sprint",
            plan2_desc: "Best for custom SaaS platforms, fully loaded AI agents, or automated database products.",
            plan2_price: "$18,500",
            plan2_time: "3-4 Weeks",
            plan2_item1: "Production-ready Web App",
            plan2_item2: "Multi-model LLM / Agent flow",
            plan2_item3: "Full payment integration",
            plan2_item4: "Secure User Auth & Dashboards",
            plan3_title: "Scale Sprint",
            plan3_desc: "Designed for enterprise automation, SEO tooling platforms, or complex data integrations.",
            plan3_price: "$32,000+",
            plan3_time: "5+ Weeks",
            plan3_item1: "Multi-tenant architecture",
            plan3_item2: "Advanced SEO audit & reporting suite",
            plan3_item3: "Large-scale data pipelines & integrations",
            plan3_item4: "Custom serverless infrastructure",
            cta: "Select this tier"
        },
        cases: {
            tag: "Case Studies",
            title: "Featured builds.",
            desc: "Real products shipped to production with measurable business metrics.",
            card1_tag: "Webapp + SaaS",
            card1_time: "Shipped in 4 weeks",
            card1_title: "FlowSaaS Billing",
            card1_desc: "A multi-tenant SaaS subscription manager with dynamic seat billing, webhook synchronization, and tax calculations.",
            card1_metric_label: 
















            q2: "How fast can we launch a working prototype?",
            a2: "Our sprint model ensures a functional, deployable v1.0 prototype within 10 to 14 days of kicking off development. We prioritize engineering core pathways first, leaving secondary aesthetics for active user testing.",
            q3: "How do we coordinate sprints and communicate?",
            a3: "We work asynchronously via a dedicated Slack channel and hold brief milestone demonstrations. We skip useless daily meetings to maximize writing code, sending weekly video walkthroughs instead.",
            q4: "Can we modify project requirements midway?",
            a4: "Yes! Since we operate on weekly sprint structures, you can reprioritize the upcoming sprint backlog. We adjust tasks instantly without charging change order penalty fees.",
            q5: "Do you offer post-launch system maintenance?",
            a5: "Yes. Every shipped MVP includes 30 days of free bug-squashing and technical support. Afterwards, you can book ad-hoc maintenance sprints or hire us to transition the code to your in-house engineers.",
            q6: "What tech stack do you recommend?",
            a6: "We build using Next.js/Tailwind for SaaS interfaces, Node.js or FastAPI (Python) for processing pipelines, PostgreSQL/Redis for databases, and LangChain/LlamaIndex for LLM agent configurations."
        },
        form: {
            tag: "Start Building",
            title: "Scope your project.",
            desc: "Get an engineering estimate and timeline in under 12 hours.",
            step: "Step {num} of 3",
            step1_title: "Select the services your project requires:",
            step1_err: "Please select at least one service to proceed.",







































































































































































































            step2_opt3_desc: "Hệ thống mở rộng quy mô lớn",
            step3_title: "Chia sẻ về dự án của bạn:",
            step3_placeholder: "Mô tả những gì bạn muốn xây dựng (ví dụ: Một ứng dụng SaaS hỗ trợ theo dõi thứ hạng bằng AI)...",
            q3: "Chúng ta sẽ làm việc và báo cáo tiến độ thế nào?",
            a3: "Chúng ta sẽ trao đổi bất đồng bộ qua kênh Slack riêng và chạy các bản demo trực quan. Chúng tôi hạn chế tối đa các cuộc họp daily vô ích để tập trung viết code, thay vào đó sẽ gửi video báo cáo cuối tuần.",
            q4: "Tôi có thể thay đổi yêu cầu giữa chừng không?",
            a4: "Có thể! Vì chúng tôi chia nhỏ dự án thành các sprint hàng tuần, bạn có thể tái cấu trúc thứ tự ưu tiên cho sprint tiếp theo. Chúng tôi sẽ điều chỉnh nhiệm vụ mà không tính phí phạt đổi yêu cầu.",
            q5: "Helitiva có hỗ trợ bảo trì sau khi bàn giao không?",
            a5: "Có. Mọi sản phẩm MVP hoàn tất đều nhận được 30 ngày hỗ trợ vá lỗi kỹ thuật miễn phí. Sau đó, bạn có thể mua thêm sprint bảo trì hoặc chúng tôi sẽ bàn giao hoàn toàn cho đội ngũ kỹ sư nội bộ của bạn.",
            q6: "Công nghệ nào được khuyên dùng nhất hiện tại?",
            a6: "Chúng tôi ưu tiên Next.js/Tailwind cho giao diện người dùng SaaS, Node.js hoặc FastAPI (Python) cho hệ thống xử lý tác vụ, PostgreSQL/Redis cho cơ sở dữ liệu và LangChain cho cấu hình Agentic AI."
        },
        form: {
            tag: "Bắt đầu hợp tác",
            title: "Thiết lập quy mô dự án.",
            desc: "Nhận ước tính kỹ thuật và tiến độ bàn giao trong vòng 12 giờ.",
let currentLang = localStorage.getItem('lang') || 'en';

// ==========================================================================
// 2. TRANSLATION ENGINE DOM INJECTION
// ==========================================================================
function updateLanguageDOM() {
    const langData = translations[currentLang];
    if (!langData) return;

    // 1. Update text nodes with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const path = el.getA






















































        if (!step.classList.contains('hidden')) currentStepIdx = idx;
    });

    const template = translations[currentLang].form.step;
    statusText.innerText = template.replace('{num}', currentStepIdx + 1);
}

function initLanguageManager() {
    const enSwitch = document.getElementById('lang-switch-en');
    const viSwitch = document.getElementById('lang-switch-vi');

    const setLang = (lang) => {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        updateLanguageDOM();
    };

    if (enSwitch) enSwitch.addEventListener('click', (e) => { e.preventDefault(); setLang('en'); });
    if (viSwitch) viSwitch.addEventListener('click', (e) => { e.preventDefault(); setLang('vi'); });

    // Initial translation run
    updateLanguageDOM();
}

// ==========================================================================
// 3. ACTIVE TERMINAL EMULATOR LOGIC
// ==========================================================================
function initTerminalEmulator() {
    const terminalBody = document.getElementById('terminal-logs');
    if (!terminalBody) return;

    const logs = [
        { text: "helitiva-labs --deploy --target=production", type: "cmd" },
        { text: "[INIT] Starting product engineering pipelines...", type: "info" },
        { text: "[BUILD] Compiling SaaS core components... OK", type: "success" },
        { text: "[DATABASE] Sync complete: 34 relational tables mapped.", type: "success" },
        { text: "[AI] Injecting agent RAG vectors into LLM context...", type: "info" },
        { text: "[AI] Fine-tuning model configuration. Latency: 0.8s", type: "success" },




























































    // Begin typing sequence after 800ms
    setTimeout(renderNextLogLine, 800);
}

// ==========================================================================
// 4. SaaS BILLING CALCULATOR (Webapp Showcase - Sky Theme)
// ==========================================================================
function initSaaSCalculator() {
    const slider = document.getElementById('webapp-users-slider');
    const userCountText = document.getElementById('webapp-user-count');
    const costText = document.getElementById('webapp-monthly-cost');
    const apiText = document.getElementById('webapp-api-calls');
    const dbRowsText = document.getElementById('webapp-db-rows');

    if (!slider || !costText) return;

    const updateCalculator = () => {
        const users = parseInt(slider.value, 10);
        userCountText.innerText = users.toLocaleString();

        let monthlyCost = 0;
        let apiCalls = '0';
        let dbRows = '0';

        if (users <= 5000) {
            monthlyCost = 49;
            apiCalls = (users * 25).toLocaleString();
            dbRows = (users * 4).toLocaleString();
        } else if (users <= 25000) {
            monthlyCost = 149;
            apiCalls = (users * 40).toLocaleString();
            dbRows = (users * 8).toLocaleString();
        } else {
            monthlyCost = Math.round(149 + (users - 25000) * 0.005);
            apiCalls = (users * 60).toLocaleString


















































            : `<div class="w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center text-[10px] font-bold"><i class="fas fa-robot text-[10px]"></i></div>`;

        const senderLabel = isUser ? (currentLang === 'en' ? 'You' : 'Bạn') : 'Helitiva AI';

        messageDiv.innerHTML = `
            ${avatar}
            <div class="flex-grow min-w-0 ${isUser ? 'order-1' : ''}">
                <div class="text-[12px] font-semibold text-text-primary ${isUser ? 'text-right' : ''}">${senderLabel}</div>
                <div class="text-[12px] text-text-secondary mt-0.5 whitespace-pre-line leading-relaxed">${text}</div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    };

    const handleSend = () => {
        const rawText = chatInput.value.trim();
        if (!rawText) return;

        addMessage(rawText, true);
        chatInput.value = '';

        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex items-center gap-1.5 p-3 text-[11px] text-text-muted transition-opacity duration-300';
        typingDiv.id = 'ai-typing-indicator';
        typingDiv.innerHTML = `<i class="fas fa-spinner animate-spin mr-1 text-violet-400"></i> ${aiResponses[currentLang].thinking}`;
        chatContainer.appendChild(typingDiv);
        scrollToBottom();

        setTimeout(() => {
            const indicator = document.getElementById('ai-typing-indicator');
            if (indicator) indicator.remove();

            let matchedText = aiResponses[currentLang].default;
            const query = rawText.toLowerCase();
            
            if (query.includes('email') || query.includes('marketing')) {
                matchedText = aiResponses[currentLang].hook;
            } else if (query.includes('api') || query.includes('handler')) {
                matchedText = aiResponses[currentLang].api;
            } else if (query.includes('price') || query.includes('giá') || query.includes('cost')) {
                matchedText = aiResponses[currentLang].price;
            } else if (query.includes('hello') || query.includes('hi') || query.includes('chào')) {
                matchedText = currentLang === 'en' 
                    ? 'Hello! Ask me about "api handler" or "marketing email" to see mock outputs.'
                    : 'Xin chào! Hãy hỏi tôi về "api handler" hoặc "marketing email" để chạy bản mẫu.';
            }

            addMessage(matchedText, false);
        }, 1000);
    };

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });
}

// ==========================================================================
// 6. MARKETING SCHEDULER (Marketing App Showcase - Rose Theme)
// ====================================================


























function initSEOSparkline() {
    const slider = document.getElementById('seo-content-slider');
    const trafficCount = document.getElementById('seo-traffic-projected');
    const sparkline = document.getElementById('seo-svg-path');

    if (!slider || !trafficCount || !sparkline) return;

    const paths = {
        1: 'M0,18 L12,16 L25,17 L38,15 L50,16 L62,14 L75,15 L88,13 L100,12',
        2: 'M0,18 L12,15 L25,16 L38,11 L50,13 L62,9 L75,10 L88,7 L100,5',
        3: 'M0,18 L12,14 L25,13 L38,8 L50,9 L62,4 L75,5 L88,2 L100,1'
    };

    const updateSEO = () => {
        const level = parseInt(slider.value, 10);
        let traffic = 0;

        if (level === 1) {
            traffic = 12400;
        } else if (level === 2) {
            traffic = 48200;
        } else {
            traffic = 156000;
        }

        sparkline.setAttribute('d', paths[level]);
        animateValue(trafficCount, parseInt(trafficCount.innerText.replace(/[^0-9]/g, '') || '0', 10), traffic, 200, '');
    };

    slider.addEventListener('input', updateSEO);
    updateSEO();
}

// ==========================================================================
// 8. FAQ ACCORDION INTERACTIVITY
// ==========================================================================
function initFAQAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close other accordions
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// 9. MULTI-STEP PROJECT ESTIMATOR
// ==========================================================================
function initProjectEstimator() {
    const form = document.getElementById('estimator-form');
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const nextBtns = form.querySelectorAll('.next-step-btn');
    const prevBtns = form.querySelectorAll('.prev-step-btn');
    const progressFill = document.getElementById('estimator-progress');

    let currentStep = 0;

    const updateFormState = () => {
        steps.forEach((step, idx) => {
            if (idx === currentStep) {
                step.classList.remove('hidden');
                step.classList.add('block');
            } else {
                step.classList.remove('block');
                step.classList.add('hidden');
            }
        });

        const progressPct = ((currentStep) / (steps.length - 1)) * 100;
        if (progressFill) {
            progressFill.style.width = `${progressPct}%`;
        }

        updateEstimatorStatusLabel();
    };














































        if (submitBtn) submitBtn.disabled = true;

        setTimeout(() => {
            form.classList.add('hidden');
            if (successPane) {
                successPane.classList.remove('hidden');
                successPane.classList.add('block');
            }
        }, 800);
    });

    const budgetOptions = form.querySelectorAll('.budget-option');
    const budgetInput = document.getElementById('selected-budget');
    budgetOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            budgetOptions.forEach(o => o.classList.remove('border-accent', 'bg-accent-soft', 'text-accent'));
            opt.classList.add('border-accent', 'bg-accent-soft', 'text-accent');
            if (budgetInput) {
                budgetInput.value = opt.getAttribute('data-value');
            }
        });
    });
}

// ==========================================================================
// UTILITY HELPERS
// ==========================================================================
function animateValue(obj, start, end, duration, prefix = '') {
    if (start === end) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const val = Math.floor(progress * (end - start) + start);
        obj.innerText = prefix + val.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ==========================================================================
// 10. CYBER LOGO ANIMATION (HTML5 Canvas)
// ==========================================================================
function initLogoAnimation() {
    const headerCanvas = document.getElementById('helitiva-header-logo');
    const footerCanvas = document.getElementById('helitiva-footer-logo');
    const heroCanvas = document.getElementById('helitiva-hero-logo');

    const canvases = [];
    if (headerCanvas) canvases.push({ el: headerCanvas, size: 64, isHeader: true });
    if (footerCanvas) canvases.push({ el: footerCanvas, size: 64, isHeader: false });
    if (heroCanvas) canvases.push({ el: heroCanvas, size: 128, isHeader: false });

    canvases.forEach(item => {
        const canvas = item.el;
        canvas.width = item.size;
        canvas.height = item.size;

        let scanY = 0;
                            <button type="button" data-i18n="form.btn_back" class="prev-step-btn px-5 py-2.5 bg-panel-strong border border-white-6 rounded-lg text-[13px] font-semibold text-text-primary hover:bg-panel-soft transition-colors">
                                Back
                            </button>
                            <button type="button" data-i18n="form.btn_next" class="next-step-btn px-6 py-2.5 bg-accent hover:bg-accent-strong text-[#030303] rounded-lg text-[13px] font-bold transition-all">
                                Next Step
                            </button>
                        </div>
                    </div>

                    <!-- STEP 3: Details & Contact -->
                    <div class="form-step space-y-4 hidden">
                        <label class="block text-[14px] font-bold text-text-primary mb-1" data-i18n="form.step3_title">Tell us about your project:</label>
                        <textarea name="description" required data-i18n-placeholder="form.step3_placeholder" placeholder="Describe what you want to build (e.g., An AI-driven SaaS app for rank tracking)..." rows="4"
                                  class="w-full p-3 bg-panel-strong border border-white-6 rounded-xl text-[13px] focus:outline-none focus:border-accent/50 text-text-primary placeholder:text-text-muted"></textarea>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                       





















































































                        <li><a href="#" class="text-text-muted hover:text-text-primary">About Us</a></li>
                        <li><a href="#cases" class="text-text-muted hover:text-text-primary">Case Studies</a></li>
                        <li><a href="#contact" class="text-text-muted hover:text-text-primary">Contact</a></li>
                        <li><a href="#" class="text-text-muted hover:text-text-primary">Privacy Policy</a></li>
                    </ul>
                </div>

            </div>

            <div class="pt-6 border-t border-white-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div class="text-[11px] text-text-muted" data-i18n="footer.copyright">
                    © 2026 Helitiva Labs · All rights reserved · 100% IP ownership guaranteed
                </div>
                <div class="flex gap-4 text-[11px]">
                    <a href="#" class="text-text-muted hover:text-text-primary" data-i18n="footer.privacy">Privacy</a>
                    <a href="#" class="text-text-muted hover:text-text-primary" data-i18n="footer.terms">Terms</a>
                    <a href="#" class="text-text-muted hover:text-text-primary" data-i18n="footer.sitemap">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>

    <script src="index.js"></script>
    <script>
        // Setup initial services and state manager
        document.addEventListener('DOMContentLoaded', () => {
            initLanguageManager();
            initTerminalEmulator();
            initFAQAccordions();
        });
    </script>
</body>
</html>

                });
                ctx.restore();
            }
                ctx.stroke();

                scanY += w * 0.03;
                if (scanY > cy + R) {
                    scanY = cy - R;
                }

                if (Math.random() < 0.3) {
                    particles.push({
                        x: cx + (Math.random() - 0.5) * G,
                        y: Math.random() < 0.5 ? y_top : y_bottom,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5,
                        alpha: 1,
                        size: Math.random() * 2 + 1
                    });
                }
            }

            // Draw and update active particles
            if (particles.length > 0) {
                ctx.save();
                ctx.fillStyle = '#00d9f5';
                particles.forEach((p, idx) => {
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();

                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha -= 0.03;

                    if (p.alpha <= 0) {
                        particles.splice(idx, 1);
                    }
                });
                ctx.restore();
            }
            requestAnimationFrame(draw);
        };

        canvas.addEventListener('mouseenter', () => {
            isHovered = true;
            scanY = cy - R;
        });

        canvas.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        draw();
    });
}

// ==========================================================================
// 11. SCROLL REVEAL - fade/slide sections into view
// ==========================================================================
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;





























        const duration = 1400;
        let startTs = null;
        const step = (ts) => {
            if (!startTs) startTs = ts;
            const p = Math.min((ts - startTs) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.innerText = prefix + Math.floor(eased * target).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.innerText = prefix + target.toLocaleString() + suffix;
        };
        requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) { counters.forEach(run); return; }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));
}

// ==========================================================================
// 13. ANIMATED PARTICLE / CONSTELLATION BACKGROUND
// ==========================================================================
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const palette = [
        [16, 185, 129],   // eme
        [129, 140, 248],  // indigo
        [34, 211, 238],   // cyan
        [232, 121, 249],  // fuchsia
    ];

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    const mouse = { x: -9999, y: -9999 };

    const isMobile = () => window.innerWidth < 768;

    const resize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const density = isMobile() ? 15000 : 8000;
        const count = Math.min(120, Math.floor((w * h) / density));
        particles = [];
        for (let i = 0; i < count; i++) {
            const c = palette[i % palette.length];
            const size = Math.random() * 4 + 2.5; // radius between 2.5px and 6.5px
            const x = Math.random() * w;
            const y = Math.random() * h;
            particles.push({
                x: x,
                y: y,
                spawnX: x,
                spawnY: y,
                baseX: x,
                baseY: y,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                size: size,
                c: c,
                alpha: Math.random() * 0.35 + 0.15, // opacity between 0.15 and 0.5
                angleX: Math.random() * Math.PI * 2,
                angleY: Math.random() * Math.PI * 2,
                speedX: Math.random() * 0.01 + 0.002,
                speedY: Math.random() * 0.01 + 0.002,
                amp: Math.random() * 12 + 6 // wave amplitude
            });
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // 1. Move base position slowly
            p.spawnX += p.vx;
            p.spawnY += p.vy;

            // Wrap around screen boundaries
            if (p.spawnX < -20) p.spawnX = w + 20;
            if (p.spawnX > w + 20) p.spawnX = -20;
            if (p.spawnY < -20) p.spawnY = h + 20;
            if (p.spawnY > h + 20) p.spawnY = -20;

            // Return force to spawn point (elastic link)
            p.baseX += (p.spawnX - p.baseX) * 0.03;
            p.baseY += (p.spawnY - p.baseY) * 0.03;

            // 2. Mouse push (repulsion)
            if (mouse.x !== -9999) {
                const dx = p.baseX - mouse.x;
                const dy = p.baseY - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 130) {
                    const force = (130 - dist) / 130;
                    // Push baseX/baseY away from mouse
                    p.baseX += (dx / (dist || 1)) * force * 3;
                    p.baseY += (dy / (dist || 1)) * force * 3;
                }
            }

            // 3. Update wave animation
            p.angleX += p.speedX;
            p.angleY += p.speedY;

            p.x = p.baseX + Math.sin(p.angleX) * p.amp;
            p.y = p.baseY + Math.cos(p.angleY) * p.amp;

            // 4. Draw soft glowing particle
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            grad.addColorStop(0,
}
            grad.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`);

            ctx.beginPath();
            ctx.fillStyle = grad;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    };

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    });
    window.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('pointerout', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    resize();
    requestAnimationFrame(draw);
}

// ==========================================================================
// 14. INTERACTIVE CARD TILT + CURSOR SPOTLIGHT
// ==========================================================================
function initCardInteractions() {
    const supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = document.querySelectorAll('.card-tilt, .preview-card');

    cards.forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            // spotlight position (always, cheap)
    initMetricCounters();
    initBackgroundCanvas();
    initCardInteractions();
});








































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































1236:         const count = Math.min(120, Math.floor((w * h) / density));
1237:         particles = [];
1238:         for (let i = 0; i < count; i++) {
1239:             const c = palette[i % palette.length];
1240:             const size = Math.random() * 4 + 2.5; // radius between 2.5px and 6.5px
1241:             const x = Math.random() * w;
1242:             const y = Math.random() * h;
1243:             particles.push({
1244:                 x: x,
1245:                 y: y,
1246:                 spawnX: x,
1247:                 spawnY: y,
1248:                 baseX: x,
1249:                 baseY: y,
1250:                 vx: (Math.random() - 0.5) * 0.15,
1251:                 vy: (Math.random() - 0.5) * 0.15,
1252:                 size: size,
1253:                 c: c,
1254:                 alpha: Math.random() * 0.35 + 0.15, // opacity between 0.15 and 0.5
1255:                 angleX: Math.random() * Math.PI * 2,
1256:                 angleY: Math.random() * Math.PI * 2,
1257:                 speedX: Math.random() * 0.01 + 0.002,
1258:                 speedY: Math.random() * 0.01 + 0.002,
1259:                 amp: Math.random() * 12 + 6 // wave amplitude
1260:             });
1261:         }
1262:     };
1263: 
1264:     const draw = () => {
1265:         ctx.clearRect(0, 0, w, h);
1266: 
1267:         for (let i = 0; i < particles.length; i++) {
1268: 






























































































































































































































































































































































































































































































































































































































































































































































44: 8.  **Logo Initialization Fix:** Confirmed `initLogoAnimation()` is registered in the main `DOMContentLoaded` listener in `index.js`, fixing the rendering failure.
45: 
46: 
47: 
The above content shows the entire, complete file contents of the requested file.


========================================
STEP 565 (type: VIEW_FILE)
========================================
Created At: 2026-06-05T10:54:02Z
Completed At: 2026-06-05T10:54:02Z
File Path: `file:///Users/huy/Desktop/Projects/Web2/Helitiva%20landing/restore_index.js`
Total Lines: 49
Total Bytes: 3222
Showing lines 1 to 49
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: /* ==========================================================================
2:    HELITIVA LABS - CYBER INTERACTIVE ENGINE & MULTILINGUAL SYSTEMS
3:    ========================================================================== */
4: 
5: // 1. TRANSLATION DICTIONARY (EN & VI)
6: const translations = {
7:     en: {
8:         nav: {
9:             services: "Services",
10:             why: "Why Labs",
11:             cases: "Case Studies",
12:             contact: "Hire Us",
13:             cta: "Scope Project"
14:         },
15:         hero: {
16:             indicator: "4 Active Builds This Week",
