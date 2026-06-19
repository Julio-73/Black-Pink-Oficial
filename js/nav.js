// Header scroll effect, mobile menu, smooth scroll, footer year, scroll progress
let header;
let menuToggle;
let mobileMenu;
let _headerScrollHandler = null;
let _progressScrollHandler = null;
let _menuClickHandler = null;
let _anchorListeners = [];
let _progressBar = null;

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
    _progressBar = document.querySelector('.scroll-progress');
    if (!_progressBar) {
        _progressBar = document.createElement('div');
        _progressBar.className = 'scroll-progress';
        _progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #c94b7c, #ff6b9d);
            z-index: 9999;
            width: 0%;
            transition: width 0.08s linear;
        `;
        document.body.appendChild(_progressBar);
    }
    _progressScrollHandler = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        _progressBar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', _progressScrollHandler, { passive: true });
}

export function init() {
    header = document.getElementById('header');
    menuToggle = document.querySelector('.menu-toggle');
    mobileMenu = document.getElementById('mobileMenu');

    setupFooterYear();
    _headerScrollHandler = handleHeaderScroll;
    window.addEventListener('scroll', _headerScrollHandler, { passive: true });
    handleHeaderScroll();

    if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'mobileMenu');
        _menuClickHandler = (e) => {
            e.stopPropagation();
            if (mobileMenu?.classList.contains('active')) closeMobileMenu();
            else openMobileMenu();
        };
        menuToggle.addEventListener('click', _menuClickHandler);
    }

    setupSmoothScroll();
    setupScrollProgress();
}

export function destroy() {
    if (_headerScrollHandler) window.removeEventListener('scroll', _headerScrollHandler);
    if (_progressScrollHandler) window.removeEventListener('scroll', _progressScrollHandler);
    if (menuToggle && _menuClickHandler) menuToggle.removeEventListener('click', _menuClickHandler);
    _anchorListeners.forEach(({ el, fn }) => el.removeEventListener('click', fn));
    _anchorListeners = [];
    if (_progressBar && _progressBar.parentNode) _progressBar.parentNode.removeChild(_progressBar);
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
