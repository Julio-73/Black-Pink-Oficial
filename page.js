document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle?.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Subscribe form handler
    const form = document.querySelector('.subscribe-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Bienvenido a BLINK! 💖 Gracias por suscribirte.');
            form.reset();
        });
    }
    
    // Initialize ScrollReveal if available
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.member-card', { delay: 150, duration: 800, origin: 'bottom' });
        ScrollReveal().reveal('.music-item', { delay: 200, duration: 800 });
        ScrollReveal().reveal('.section-title', { duration: 1000 });
    }
});