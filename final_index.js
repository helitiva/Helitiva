import os
import json
import re


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
                for tool in step.get("tool_calls", [





















































































































































































































































































































































































































































































































































































































































































































































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

        updateEstimatorStatu






























































































































































































































































































































































































































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














































