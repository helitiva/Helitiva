/* ==========================================================================
   HELITIVA LABS - CYBER INTERACTIVE ENGINE & MULTILINGUAL SYSTEMS
   ========================================================================== */

// 1. TRANSLATION DICTIONARY (EN & VI)
const translations = {
    en: {
        nav: {
            services: "Services",
            why: "Why Labs",
            cases: "Case Studies",
            contact: "Hire Us",
            cta: "Scope Project"
        },
        hero: {
            indicator: "4 Active Builds This Week",
            title: "We build digital<br><span class=\"text-accent\">products.</span> <span class=\"text-text-muted\">Not just code.</span>",
            desc: "A software development lab engineering high-leverage products: Webapps, AI tools, marketing automations, and SEO scaling systems. Built with speed, scoped with data.",
            cta_estim: "Start Project Estimator",
            cta_demo: "Explore Our Demos"
        },
        stats: {
            shipped: "Products Shipped",
            ai: "AI Agents Built",
            automations: "Automations Active",
            traffic: "SEO Traffic Driven",
            growth: "100% Growth",
            deployed: "Deployed",
            uptime: "Jobs / Daily",
            daily: "340% Growth"
        },
        services: {
            subtitle: "Our Specialties",
            title: "Interact with our technology.",
            desc: "We don't do bori
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
            