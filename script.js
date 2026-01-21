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

    // Help to trigger the animation classes
    document.head.insertAdjacentHTML("beforeend", `<style>
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>`);

    // ---------------------------------------------------------
    // 3D TILT EFFECT LOGIC
    // ---------------------------------------------------------
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleHover);
        card.addEventListener('mouseleave', handleLeave);
        // Touch events
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleLeave);
    });

    function handleHover(e) {
        // requestAnimationFrame for smoothness
        requestAnimationFrame(() => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            // Calculate rotation
            // Max rotation deg (e.g., 10deg)
            const xMid = rect.width / 2;
            const yMid = rect.height / 2;

            // Rotate Y axis based on X position (left side should tilt left/down)
            const rotateY = ((x - xMid) / xMid) * 10;
            // Rotate X axis based on Y position (top side should tilt back/up)
            const rotateX = ((yMid - y) / yMid) * 10;

            // Apply transform
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;

            card.classList.add('tilt-active');
        });
    }

    function handleLeave(e) {
        requestAnimationFrame(() => {
            const card = e.currentTarget;
            // Reset to default
            card.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                scale3d(1, 1, 1)
            `;
            card.classList.remove('tilt-active');
        });
    }

    function handleTouchMove(e) {
        // Prevent scrolling while interacting with the card if desired, 
        // strictly following user request to make it follow finger.
        // But preventing scroll is risky for UX. Let's try to just capture the touch pt.
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();

            // Check if touch is inside card (it should be due to event listener)
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const xMid = rect.width / 2;
            const yMid = rect.height / 2;

            const rotateY = ((x - xMid) / xMid) * 10;
            const rotateX = ((yMid - y) / yMid) * 10;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
            card.classList.add('tilt-active');
        }
    }
});
