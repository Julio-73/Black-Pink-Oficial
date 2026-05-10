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

    // ==================== CONTENT ADDED: HERO BANNER SLIDER ====================
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const bannerDots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        bannerSlides.forEach(slide => slide.classList.remove('active'));
        bannerDots.forEach(dot => dot.classList.remove('active'));
        bannerSlides[index].classList.add('active');
        bannerDots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % bannerSlides.length;
        showSlide(currentSlide);
    }

    if (bannerSlides.length > 0) {
        setInterval(nextSlide, 5000);

        bannerDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }

    // ==================== CONTENT ADDED: COUNTDOWN TIMER ====================
    const targetDate = new Date('June 15, 2026 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }
    }

    if (document.getElementById('days')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ==================== CONTENT ADDED: VIDEO TABS ====================
    const videoTabs = document.querySelectorAll('.video-tab');
    const videoContents = document.querySelectorAll('.video-tab-content');
    const yearFilter = document.getElementById('year-filter');

    videoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            videoTabs.forEach(t => t.classList.remove('active'));
            videoContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    if (yearFilter) {
        yearFilter.addEventListener('change', function() {
            const selectedYear = this.value;
            const videoCards = document.querySelectorAll('.video-card');

            videoCards.forEach(card => {
                if (selectedYear === 'all' || card.getAttribute('data-year') === selectedYear) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ==================== CONTENT ADDED: VIDEO PLAY BUTTONS ====================
    const videoPlayBtns = document.querySelectorAll('.video-play-btn');
    videoPlayBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video');
            const thumbnail = this.parentElement;
            const iframe = document.createElement('iframe');
            iframe.src = videoUrl + '?autoplay=1';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            thumbnail.innerHTML = '';
            thumbnail.appendChild(iframe);
        });
    });

    // ==================== CONTENT ADDED: MEMBER MODALS ====================
    const memberData = {
        jisoo: {
            funFact: "Jisoo loves playing guitar and has been playing since she was 13. She's also an amazing painter!",
            video: "https://www.youtube.com/embed/IKh3hHaJJPk"
        },
        jennie: {
            funFact: "Jennie lived in New Zealand and Japan before becoming a trainee. She speaks Korean, English, and Japanese fluently!",
            video: "https://www.youtube.com/embed/kPoptr_k2z8"
        },
        rose: {
            funFact: "Rosé was the last member to join YG Entertainment. She learned Korean in just 6 months!",
            video: "https://www.youtube.com/embed/2_VLdL7alJU"
        },
        lisa: {
            funFact: "Lisa speaks 4 languages: Thai, Korean, English, and Japanese. She started dancing at age 5!",
            video: "https://www.youtube.com/embed/emoZ_4iWthU"
        }
    };

    const memberProfileBtns = document.querySelectorAll('.member-profile-btn');
    const memberModal = document.getElementById('memberModal');
    const modalClose = document.querySelector('.modal-close');
    const funFactText = document.querySelector('.fun-fact-text');
    const videoEmbed = document.querySelector('.video-embed iframe');

    memberProfileBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const member = this.getAttribute('data-member');
            if (memberData[member]) {
                funFactText.textContent = memberData[member].funFact;
                videoEmbed.src = memberData[member].video;
                memberModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            memberModal.classList.remove('active');
            document.body.style.overflow = '';
            videoEmbed.src = '';
        });
    }

    if (memberModal) {
        memberModal.addEventListener('click', function(e) {
            if (e.target === memberModal) {
                memberModal.classList.remove('active');
                document.body.style.overflow = '';
                videoEmbed.src = '';
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && memberModal?.classList.contains('active')) {
            memberModal.classList.remove('active');
            document.body.style.overflow = '';
            if (videoEmbed) videoEmbed.src = '';
        }
    });

    // ==================== CONTENT ADDED: TOUR MAP (LEAFLET) ====================
    const tourMapElement = document.getElementById('tour-map');
    if (tourMapElement && typeof L !== 'undefined') {
        const map = L.map('tour-map').setView([20, 100], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            maxZoom: 19
        }).addTo(map);

        const tourCities = [
            { city: 'Seoul', lat: 37.5665, lng: 126.9780, info: 'Oct 2022 — Seoul Olympic Stadium — 50,000 fans!' },
            { city: 'Bangkok', lat: 13.7563, lng: 100.5018, info: 'Nov 2022 — Rajamangala Stadium — 45,000 fans!' },
            { city: 'Hong Kong', lat: 22.3193, lng: 114.1694, info: 'Dec 2022 — Central Harbourfront — 40,000 fans!' },
            { city: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, info: 'Jan 2023 — Etihad Arena — 35,000 fans!' },
            { city: 'Atlanta', lat: 33.7490, lng: -84.3880, info: 'Aug 2023 — Mercedes-Benz Stadium — 55,000 fans!' },
            { city: 'Chicago', lat: 41.8781, lng: -87.6298, info: 'Aug 2023 — Soldier Field — 50,000 fans!' },
            { city: 'London', lat: 51.5074, lng: -0.1278, info: 'Aug 2023 — Wembley Stadium — 70,000 fans!' },
            { city: 'Paris', lat: 48.8566, lng: 2.3522, info: 'Sept 2023 — Stade de France — 60,000 fans!' },
            { city: 'Sydney', lat: -33.8688, lng: 151.2093, info: 'Jan 2024 — Accor Stadium — 50,000 fans!' },
            { city: 'Auckland', lat: -36.8485, lng: 174.7633, info: 'Jan 2024 — Eden Park — 40,000 fans!' }
        ];

        tourCities.forEach(location => {
            const marker = L.marker([location.lat, location.lng]).addTo(map);
            marker.bindPopup(`<strong>${location.city}</strong><br>${location.info}`);
        });
    }

    // ==================== CONTENT ADDED: SUBSCRIBE FORM ENHANCED ====================
    const enhancedForm = document.querySelector('.subscribe-form');
    if (enhancedForm) {
        enhancedForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nameInput = this.querySelector('input[type="text"]');
            const name = nameInput ? nameInput.value : 'BLINK';

            const btn = this.querySelector('.btn');
            const originalText = btn.textContent;

            btn.textContent = 'Joining...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                const randomNumber = Math.floor(Math.random() * 90000) + 10000;
                btn.textContent = `Welcome, ${name}! You're BLINK #${randomNumber} 🎉`;
                btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

                setTimeout(() => {
                    this.reset();
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 4000);
            }, 1500);
        });
    }

    // ==================== CONTENT ADDED: MERCH CART BUTTONS ====================
    const merchBtns = document.querySelectorAll('.merch-btn');
    merchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Added! ✓';
            this.style.background = 'var(--pink-primary)';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 1500);
        });
    });

    // ==================== CONTENT ADDED: MEMBER DETAILS TOGGLE ====================
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const details = this.querySelector('.member-details');
            if (details) {
                details.style.display = 'block';
            }
        });
        card.addEventListener('mouseleave', function() {
            const details = this.querySelector('.member-details');
            if (details) {
                details.style.display = 'none';
            }
        });
    });
});