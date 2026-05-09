document.addEventListener('DOMContentLoaded', () => {
    
    const srOptions = {
        reset: true,
        distance: '80px',
        duration: 1000,
        delay: 100,
        easing: 'ease-out'
    };

    const sr = ScrollReveal(srOptions);

    sr.reveal('.subscribe-title', { origin: 'top' });
    sr.reveal('.video-player', { origin: 'top' });
    sr.reveal('.listen-now', { origin: 'top' });
    sr.reveal('.album-cover', { origin: 'top' });
    sr.reveal('.logo-header', { origin: 'bottom' });
    sr.reveal('.nav-links a', { origin: 'left', interval: 100 });
    sr.reveal('.social-links a', { origin: 'right', interval: 100 });
    sr.reveal('.member-card', { origin: 'top', interval: 150 });
    sr.reveal('.tour-clip', { origin: 'bottom' });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const form = document.querySelector('.subscribe-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const country = document.getElementById('country').value;
            const signup = document.getElementById('signup').checked;
            
            if (email && country && signup) {
                alert('¡Gracias por suscribirte! Pronto recibirás noticias de Black Pink.');
                form.reset();
            }
        });
    }

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});