// Visual effects: reveal-on-scroll, parallax, hero hover, particles, 3D tilt, button particles
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Reveal on scroll ----------
function setupReveal() {
    const revealEls = document.querySelectorAll(
        '.members-grid, .music-container, .video-container, .subscribe-card, .section-title, .quiz-container'
    );
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) entry.target.classList.add('active');
        }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    document.querySelectorAll('.member-card').forEach((card, i) => {
        card.classList.add('reveal', `reveal-delay-${(i % 4) + 1}`);
        observer.observe(card);
    });
}

// ---------- Parallax hero ----------
function setupParallax() {
    if (REDUCED_MOTION) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroBg = document.querySelector('.hero-bg');
            const heroVideo = document.querySelector('.hero-video-bg');
            if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
            if (heroVideo) heroVideo.style.transform = `translateY(${scrolled * 0.12}px)`;
            ticking = false;
        });
    }, { passive: true });
}

// ---------- Hero mouse follow ----------
function setupHeroHover() {
    if (REDUCED_MOTION) return;
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    heroContent.addEventListener('mousemove', (e) => {
        const rect = heroContent.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroContent.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    });
    heroContent.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
    });
}

// ---------- Button hover micro-particles ----------
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

// ---------- Hero particles canvas ----------
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

function setupHeroParticles() {
    if (REDUCED_MOTION) return;
    const heroSec = document.getElementById('home');
    const canvas = document.getElementById('hero-particles-canvas');
    if (!heroSec || !canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let rafId = null;

    function resize() {
        canvas.width = heroSec.clientWidth;
        canvas.height = heroSec.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        if (particles.length > 0) rafId = requestAnimationFrame(loop);
        else rafId = null;
    }

    heroSec.addEventListener('mousemove', (e) => {
        const rect = heroSec.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let i = 0; i < 2; i++) particles.push(new Particle(mx, my));
        if (!rafId) rafId = requestAnimationFrame(loop);
    });
}

// ---------- 3D tilt with glare ----------
function setupTilt() {
    if (REDUCED_MOTION) return;
    document.querySelectorAll('.member-card, .product-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
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
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            this.style.setProperty('--glare-x', '50%');
            this.style.setProperty('--glare-y', '50%');
        });
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
    setupParallax();
    setupHeroHover();
    setupButtonParticles();
    setupHeroParticles();
    setupTilt();
}
