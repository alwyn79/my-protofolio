document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scrolling for anchor links (fallback if scroll-behavior: smooth isn't enough)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for Fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements we want to animate
    const animatedElements = document.querySelectorAll('.hero-content, .hero-visual, .section-header, .skill-card, .project-card, .service-item, .contact-wrapper');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Helper to trigger the animation classes
    document.head.insertAdjacentHTML("beforeend", `<style>
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>`);
});
