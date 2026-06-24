const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let _scrollRafId = null;
let _resizeHandler = null;
let _scrollHandler = null;
let _parallaxTicking = false;
let _observer = null;
let _sectionObserver = null;
let _particleRafId = null;
let _particleResizeHandler = null;
let _heroMouseHandler = null;
let _heroLeaveHandler = null;
let _heroParticleHandler = null;
let _bgScrollHandler = null;

function setupReveal() {
    _observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.members-grid, .music-container, .video-container, .subscribe-card, .section-title, .quiz-container'
    ).forEach(el => {
        el.classList.add('reveal');
        _observer.observe(el);
    });

    document.querySelectorAll('.member-card').forEach((card, i) => {
        card.classList.add('reveal', `reveal-delay-${(i % 4) + 1}`);
        _observer.observe(card);
    });

    document.querySelectorAll('.album-card-link').forEach((el, i) => {
        el.classList.add('reveal-scale', `reveal-delay-${(i % 4) + 1}`);
        _observer.observe(el);
    });

    document.querySelectorAll('.product-card').forEach((el, i) => {
        el.classList.add('reveal-scale', `reveal-delay-${(i % 4) + 1}`);
        _observer.observe(el);
    });

    document.querySelectorAll('.video-card').forEach((el, i) => {
        el.classList.add(i % 2 === 0 ? 'reveal-glide' : 'reveal-glide-right', `reveal-delay-${(i % 4) + 1}`);
        _observer.observe(el);
    });
}

function setupSectionGlow() {
    if (REDUCED_MOTION) return;
    _sectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-glow-active');
            }
        }
    }, { threshold: 0.15 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-glow');
        _sectionObserver.observe(section);
    });
}

function setupParallax() {
    if (REDUCED_MOTION) return;
    _parallaxTicking = false;
    _scrollHandler = () => {
        if (_parallaxTicking) return;
        _parallaxTicking = true;
        _scrollRafId = requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const viewportH = window.innerHeight;

            const heroBg = document.querySelector('.hero-bg');
            const heroVideo = document.querySelector('.hero-video-bg');
            if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
            if (heroVideo) heroVideo.style.transform = `translateY(${scrolled * 0.1}px)`;

            document.querySelectorAll('.member-card').forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                if (rect.top < viewportH && rect.bottom > 0) {
                    const offset = (viewportH - rect.top) * 0.03;
                    card.style.setProperty('--float-offset', `${Math.min(offset, 20)}px`);
                }
            });

            _parallaxTicking = false;
        });
    };
    window.addEventListener('scroll', _scrollHandler, { passive: true });
}

function setupScrollGradient() {
    if (REDUCED_MOTION) return;
    _bgScrollHandler = () => {
        const scrolled = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrolled / docHeight : 0;
        document.documentElement.style.setProperty('--scroll-pct', pct);
    };
    window.addEventListener('scroll', _bgScrollHandler, { passive: true });
    _bgScrollHandler();
}

function setupHeroHover() {
    if (REDUCED_MOTION) return;
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    _heroMouseHandler = (e) => {
        const rect = heroContent.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroContent.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    };
    _heroLeaveHandler = () => {
        heroContent.style.transform = 'translate(0, 0)';
    };
    heroContent.addEventListener('mousemove', _heroMouseHandler);
    heroContent.addEventListener('mouseleave', _heroLeaveHandler);
}

function setupButtonParticles() {
    if (REDUCED_MOTION) return;
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => createBtnParticles(btn));
    });
}

function createBtnParticles(button) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('span');
        particle.style.cssText = `
            position: absolute;
            width: 5px;
            height: 5px;
            background: #ffcce0;
            border-radius: 50%;
            pointer-events: none;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
        `;
        const angle = Math.random() * 360 * (Math.PI / 180);
        const velocity = 40 + Math.random() * 40;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], { duration: 650, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' })
            .onfinish = () => particle.remove();
        button.appendChild(particle);
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3.5 + 1.2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.4 + 0.4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.15;
        this.alpha = 1;
        this.decay = Math.random() * 0.018 + 0.007;
        this.color = Math.random() > 0.45 ? '#ff6b9d' : '#ffcce0';
        this.sparkle = Math.random() > 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.sparkle) {
            this.size += (Math.random() - 0.5) * 0.4;
            if (this.size < 0.4) this.size = 0.4;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 2.2;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let _heroParticles = [];
let _heroSec = null;
let _canvas = null;

function setupHeroParticles() {
    if (REDUCED_MOTION) return;
    _heroSec = document.getElementById('home');
    _canvas = document.getElementById('hero-particles-canvas');
    if (!_heroSec || !_canvas) return;
    const ctx = _canvas.getContext('2d');

    _particleResizeHandler = () => {
        _canvas.width = _heroSec.clientWidth;
        _canvas.height = _heroSec.clientHeight;
    };
    window.addEventListener('resize', _particleResizeHandler);
    _particleResizeHandler();

    function loop() {
        ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        for (let i = 0; i < _heroParticles.length; i++) {
            _heroParticles[i].update();
            _heroParticles[i].draw(ctx);
            if (_heroParticles[i].alpha <= 0) {
                _heroParticles.splice(i, 1);
                i--;
            }
        }
        if (_heroParticles.length > 0) _particleRafId = requestAnimationFrame(loop);
        else _particleRafId = null;
    }

    _heroParticleHandler = (e) => {
        const rect = _heroSec.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let i = 0; i < 2; i++) _heroParticles.push(new Particle(mx, my));
        if (!_particleRafId) _particleRafId = requestAnimationFrame(loop);
    };
    _heroSec.addEventListener('mousemove', _heroParticleHandler);
}

let _tiltCards = [];

function setupTilt() {
    if (REDUCED_MOTION) return;
    _tiltCards = [];
    document.querySelectorAll('.member-card, .product-card').forEach(card => {
        const moveHandler = function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rx = -((y - cy) / cy) * 15;
            const ry = ((x - cx) / cx) * 15;
            this.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03, 1.03, 1.03)`;
            this.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
            this.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
            this.style.setProperty('--tilt-x', rx);
            this.style.setProperty('--tilt-y', ry);
        };
        const leaveHandler = function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            this.style.setProperty('--glare-x', '50%');
            this.style.setProperty('--glare-y', '50%');
            this.style.setProperty('--tilt-x', 0);
            this.style.setProperty('--tilt-y', 0);
        };
        card.addEventListener('mousemove', moveHandler);
        card.addEventListener('mouseleave', leaveHandler);
        _tiltCards.push({ el: card, move: moveHandler, leave: leaveHandler });
    });
}

export function triggerConfetti(container) {
    if (REDUCED_MOTION) return;
    const colors = ['#ff6b9d', '#ffcce0', '#ffffff', '#ffd2e5', '#ff99c8'];
    const host = container || document.body;
    const rect = host.getBoundingClientRect();
    const startX = rect.width / 2;
    const startY = rect.height / 2;

    for (let i = 0; i < 75; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 5 + Math.random() * 8;
        p.style.background = color;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${startX}px`;
        p.style.top = `${startY}px`;

        const angle = Math.random() * 360;
        const velocity = 80 + Math.random() * 200;
        const radians = angle * (Math.PI / 180);
        const tx = Math.cos(radians) * velocity;
        const ty = Math.sin(radians) * velocity - (50 + Math.random() * 50);

        host.appendChild(p);
        p.animate([
            { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 720}deg) scale(0.3)`, opacity: 0 }
        ], { duration: 1200 + Math.random() * 800, easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)' })
            .onfinish = () => p.remove();
    }
}

export function init() {
    setupReveal();
    setupSectionGlow();
    setupParallax();
    setupScrollGradient();
    setupHeroHover();
    setupButtonParticles();
    setupHeroParticles();
    setupTilt();
}

export function destroy() {
    if (_observer) _observer.disconnect();
    if (_sectionObserver) _sectionObserver.disconnect();
    if (_scrollHandler) window.removeEventListener('scroll', _scrollHandler);
    if (_bgScrollHandler) window.removeEventListener('scroll', _bgScrollHandler);
    if (_particleResizeHandler) window.removeEventListener('resize', _particleResizeHandler);
    if (_particleRafId) cancelAnimationFrame(_particleRafId);
    if (_scrollRafId) cancelAnimationFrame(_scrollRafId);

    const heroContent = document.querySelector('.hero-content');
    if (heroContent && _heroMouseHandler) {
        heroContent.removeEventListener('mousemove', _heroMouseHandler);
        heroContent.removeEventListener('mouseleave', _heroLeaveHandler);
    }
    if (_heroSec && _heroParticleHandler) {
        _heroSec.removeEventListener('mousemove', _heroParticleHandler);
    }
    _tiltCards.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
    });
    _tiltCards = [];
    _heroParticles = [];
}
