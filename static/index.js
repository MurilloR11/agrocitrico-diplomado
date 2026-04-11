// ── Hamburger menu ─────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

function openMenu() {
    toggle.classList.add('is-open');
    navMenu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    toggle.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
    navMenu.classList.contains('is-open') ? closeMenu() : openMenu();
});

// Cierra el menú al hacer clic en cualquier enlace
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Cierra el menú al cambiar a desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
});

// ── Scroll spy (nav activo por sección) ───────
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => spyObserver.observe(section));

// ── Scroll reveal ──────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Contador animado (stats "Nosotros") ────────
function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

const statsEl = document.querySelector('.about-stats');
if (statsEl) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const strongs = entry.target.querySelectorAll('strong');
                strongs.forEach(strong => {
                    const raw = strong.textContent.trim();
                    if (raw === '3')    animateCounter(strong, 3,   '');
                    if (raw === '24h')  animateCounter(strong, 24,  'h');
                    if (raw === '100%') animateCounter(strong, 100, '%');
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsEl);
}
