document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== HEADER SCROLL EFFECT ====================
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
    
    // ==================== MOBILE MENU TOGGLE ====================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ==================== REVEAL ANIMATIONS ====================
    const revealElements = document.querySelectorAll('.members-grid, .music-container, .video-container, .subscribe-card, .section-title');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
    
    // Member cards staggered reveal
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        card.classList.add('reveal', `reveal-delay-${(index % 4) + 1}`);
    });
    
    const memberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    memberCards.forEach(card => memberObserver.observe(card));
    
    // ==================== PARALLAX EFFECT ====================
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');
                const heroBg = document.querySelector('.hero-bg');
                
                if (hero) {
                    hero.style.setProperty('--scroll-offset', `${scrolled * 0.3}px`);
                }
                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // ==================== ACTIVE NAV LINK ====================
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
    
    // ==================== SUBSCRIBE FORM ====================
    const form = document.querySelector('.subscribe-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = form.querySelector('.btn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Joining...';
            btn.style.opacity = '0.7';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Welcome to BLINK';
                btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                
                setTimeout(() => {
                    form.reset();
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 2500);
            }, 1200);
        });
    }
    
    // ==================== MOUSE MOVE HERO EFFECT ====================
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.addEventListener('mousemove', function(e) {
            const rect = heroContent.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroContent.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
        });
        
        heroContent.addEventListener('mouseleave', function() {
            heroContent.style.transform = 'translate(0, 0)';
        });
    }
    
    // ==================== BUTTON HOVER PARTICLES ====================
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function(e) {
            createParticles(this);
        });
    });
    
    function createParticles(button) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('span');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--pink-light);
                border-radius: 50%;
                pointer-events: none;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
            
            button.appendChild(particle);
        }
    }
    
    // ==================== SMOOTH SCROLLBAR ====================
    let scrollProgress = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = (scrollTop / docHeight) * 100;
        
        // Add progress indicator
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 2px;
                background: linear-gradient(90deg, var(--pink-dark), var(--pink-primary));
                z-index: 9999;
                transition: width 0.1s;
            `;
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = `${scrollProgress}%`;
    }, { passive: true });
    
    // ==================== PREFERS REDUCED MOTION ====================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('active');
        });
    }
    
    // ==================== KEYBOARD ACCESSIBILITY ====================
    menuToggle?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menuToggle.click();
        }
    });
    
    // ESC key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ==================== HERO PARTICLE ANIMATION ====================
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.animationDelay = `${index * 1.5 + Math.random() * 2}s`;
            particle.style.animationDuration = `${12 + Math.random() * 8}s`;
        });
    }
});