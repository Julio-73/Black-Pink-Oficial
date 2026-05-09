document.addEventListener('DOMContentLoaded', () => {
    
    // Loader - hide after 1.5 seconds max (prevents stuck loader)
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) loader.classList.add('loaded');
    }, 1500);
    
    // Custom Cursor (only on desktop)
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    
    if (window.innerWidth > 992 && cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 6 + 'px';
            cursor.style.top = e.clientY - 6 + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX - 20 + 'px';
                cursorFollower.style.top = e.clientY - 20 + 'px';
            }, 100);
        });
    }
    
    // Header Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
    
    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    const animateStats = () => {
        if (statsAnimated) return;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            updateCount();
        });
        
        statsAnimated = true;
    };
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Subscribe Form
    const form = document.getElementById('subscribeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value;
            const country = document.getElementById('country')?.value;
            const consent = document.getElementById('consent')?.checked;
            
            if (email && country && consent) {
                showNotification('¡Bienvenido a BLINK! 💖<br>Pronto recibirás las últimas noticias de BLACKPINK.');
                form.reset();
            }
        });
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div class="toast-content">
                <i class='bx bxs-heart-circle'></i>
                <span>${message}</span>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification-toast { position: fixed; top: 100px; right: 20px; z-index: 10000; animation: slideInRight 0.4s ease-out; }
            .toast-content { background: linear-gradient(135deg, #ff6b9d 0%, #c94b7c 100%); color: white; padding: 1.2rem 1.8rem; border-radius: 20px; display: flex; align-items: center; gap: 0.8rem; box-shadow: 0 15px 40px rgba(255, 107, 157, 0.5); font-size: 0.95rem; max-width: 380px; }
            .toast-content i { font-size: 2rem; }
            @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
            @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100px); } }
        `;
        document.head.appendChild(style);
        notification.className = 'notification-toast';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease-out forwards';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }
    
    // Video Thumbnails
    document.querySelectorAll('.video-thumb').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelectorAll('.video-thumb').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Track Play Buttons
    document.querySelectorAll('.track-play').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('bx-play');
                icon.classList.toggle('bx-pause');
            }
        });
    });
    
    // ScrollReveal
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            reset: false,
            distance: '60px',
            duration: 1000,
            easing: 'ease-out'
        });
        
        sr.reveal('.section-header', { origin: 'top' });
        sr.reveal('.member-card', { origin: 'bottom', interval: 150 });
        sr.reveal('.music-showcase', { origin: 'left' });
        sr.reveal('.video-thumb', { origin: 'bottom', interval: 100 });
        sr.reveal('.subscribe-card', { origin: 'scale', scale: 0.9 });
    }
    
    // Fix stuck loader on slow connections
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader && !loader.classList.contains('loaded')) {
                loader.classList.add('loaded');
            }
        }, 500);
    });
});

// Force hide loader after 3 seconds max
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('loaded');
}, 3000);