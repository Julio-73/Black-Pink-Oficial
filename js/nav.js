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
    const scrolled = window.pageYOffset > 50;
    header.classList.toggle('scrolled', scrolled);
}

function setupFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScroll(targetY, duration, onComplete) {
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const pct = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(pct);
        window.scrollTo(0, startY + diff * eased);
        if (pct < 1) {
            requestAnimationFrame(step);
        } else if (onComplete) {
            onComplete();
        }
    }
    requestAnimationFrame(step);
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const fn = function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerHeight = header ? header.offsetHeight : 64;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            const dist = Math.abs(top - window.pageYOffset);
            const duration = Math.min(Math.max(dist * 0.6, 400), 1200);

            if (mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle?.classList.remove('active');
                menuToggle?.setAttribute('aria-expanded', 'false');
            }
            e.stopPropagation();
            animateScroll(top, duration, () => {
                document.body.style.overflow = '';
            });
        };
        anchor.addEventListener('click', fn);
        _anchorListeners.push({ el: anchor, fn });
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
            background: linear-gradient(90deg, #c94b7c, #ff6b9d, #ffcce0);
            z-index: 9999;
            width: 0%;
            transition: width 0.2s cubic-bezier(0.22, 1, 0.36, 1);
            box-shadow: 0 0 8px rgba(255, 107, 157, 0.3);
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
        if (target) {
            const headerHeight = header ? header.offsetHeight : 64;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            const dist = Math.abs(top - window.pageYOffset);
            const duration = Math.min(Math.max(dist * 0.6, 400), 1200);
            animateScroll(top, duration);
        }
    }
};

export { openMobileMenu, closeMobileMenu };
