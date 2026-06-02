// Header scroll effect, mobile menu, smooth scroll, footer year, scroll progress
let header;
let menuToggle;
let mobileMenu;

function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    menuToggle?.classList.add('active');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function handleHeaderScroll() {
    if (!header) return;
    if (window.pageYOffset > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
}

function setupFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 64;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileMenu();
        });
    });
}

function setupScrollProgress() {
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #c94b7c, #ff6b9d);
            z-index: 9999;
            width: 0%;
            transition: width 0.08s linear;
        `;
        document.body.appendChild(progressBar);
    }
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${pct}%`;
    }, { passive: true });
}

export function init() {
    header = document.getElementById('header');
    menuToggle = document.querySelector('.menu-toggle');
    mobileMenu = document.getElementById('mobileMenu');

    setupFooterYear();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'mobileMenu');
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu?.classList.contains('active')) closeMobileMenu();
            else openMobileMenu();
        });
    }

    setupSmoothScroll();
    setupScrollProgress();
}

export const actions = {
    'open-mobile-menu': () => openMobileMenu(),
    'close-mobile-menu': () => closeMobileMenu(),
    'scroll-to': (el) => {
        const target = document.querySelector(el.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
};

export { openMobileMenu, closeMobileMenu };
