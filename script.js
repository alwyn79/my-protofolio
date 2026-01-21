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
    // 3D TILT EFFECT LOGIC (Mobile Optimized)
    // ---------------------------------------------------------
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // MOUSE EVENTS (Desktop)
        card.addEventListener('mousemove', handleHover);
        card.addEventListener('mouseleave', handleLeave);

        // TOUCH EVENTS (Mobile)
        // We use 'click' to handle the navigation logic, and touchstart/move for tilt
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);

        // CLICK NAVIGATION
        card.addEventListener('click', handleClick);
    });

    // Helper to calculate and apply tilt
    function applyTilt(card, x, y) {
        // requestAnimationFrame for smoothness
        requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();

            // X and Y relative to the card's top-left
            const relX = x - rect.left;
            const relY = y - rect.top;

            // Calculate rotation
            const xMid = rect.width / 2;
            const yMid = rect.height / 2;

            // Rotate Y: Left side tilts down-left (negative x -> negative deg? No, actually:
            // If Mouse is on Right (x > mid), we want Right side to go BACK (rotateY > 0? No, rotateY > 0 moves right side towards you in some coords, away in others.
            // Standard CSS rotateY: positive = right side moves AWAY/back. 
            // We want the side UNDER mouse to go DOWN/AWAY.
            const rotateY = ((relX - xMid) / xMid) * 10;

            // Rotate X: Top side tilts back. 
            // If Mouse is Top (y < mid), we want Top side to go BACK (rotateX > 0).
            const rotateX = ((yMid - relY) / yMid) * 10;

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

    // Reset card
    function resetTilt(card) {
        requestAnimationFrame(() => {
            card.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                scale3d(1, 1, 1)
            `;
            card.classList.remove('tilt-active');
            // Remove mobile active state if present
            card.classList.remove('mobile-active');
        });
    }

    function handleHover(e) {
        applyTilt(e.currentTarget, e.clientX, e.clientY);
    }

    function handleLeave(e) {
        resetTilt(e.currentTarget);
    }

    // Mobile State
    // We need to track if a card is currently "active" (tapped once)
    let activeCard = null;

    function handleTouchStart(e) {
        const card = e.currentTarget;

        // If this card is NOT the active one, preventing default click/link behavior might be needed
        // But for 'touchstart', we primarily want to start the tilt visual
        if (e.touches.length > 0) {
            applyTilt(card, e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    function handleTouchMove(e) {
        // Prevent scrolling ONLY if we are intentionally interacting (optional, user said "follow finger")
        // e.preventDefault(); 
        if (e.touches.length > 0) {
            applyTilt(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    function handleTouchEnd(e) {
        const card = e.currentTarget;
        // Verify if we should reset or keep it tilted?
        // User said "Smooth transition back when not hovered". 
        // On mobile "not hovered" usually means finger lifted.
        resetTilt(card);
    }

    function handleClick(e) {
        const card = e.currentTarget;
        const link = card.getAttribute('data-link');

        // Mobile Logic: First tap activates, Second tap opens.
        // If we are on a touch device (can check via matchMedia or event type, but click fires on touch)
        // A simple heuristic: check if we successfully flagged it as 'mobile-active' recently?
        // Or simpler: changing styles via JS is instant. 

        // Let's implement the specific requirement: "First tap activates 3D effect, Second tap opens link"
        // Since 'touchstart' happens before 'click', we can track state.

        // HOWEVER, standard behavior is:
        // 1. TouchStart -> (Visuals applied)
        // 2. TouchEnd -> (Visuals reset)
        // 3. Click -> (Fires)

        // If visuals reset on TouchEnd, the "First tap activates" visual is fleeting.
        // Maybe the user wants the card to STAY tilted after tap?
        // "Smooth transition back when not hovered" implies reset on lift.
        // SO: The "First tap activates" might mean "Show the hover state".
        // If the user lifts finger, it resets.
        // THEN the 'click' event fires. 

        // If we want "Double Tap to Go", we need to intercept the first click.

        const isMobile = window.matchMedia("(pointer: coarse)").matches;

        if (isMobile && link) {
            // Check if this card was already "active" (tapped recently)
            if (!card.classList.contains('mobile-ready')) {
                // First Tap
                e.preventDefault(); // Stop navigation

                // Reset others
                cards.forEach(c => c.classList.remove('mobile-ready'));

                // Set this one ready
                card.classList.add('mobile-ready');

                // Visual feedback that it's selected?
                // The tilt resets on touchend, so maybe we need a persistent highlight?
                card.style.borderColor = 'var(--accent-color)';

                // Auto-reset after some time if no second tap?
                setTimeout(() => {
                    card.classList.remove('mobile-ready');
                    card.style.borderColor = ''; // Reset
                }, 2000);
            } else {
                // Second Tap (it has mobile-ready class)
                // Allow default or manually navigate
                window.open(link, '_blank');
                card.classList.remove('mobile-ready');
                card.style.borderColor = '';
            }
        } else if (link) {
            // Desktop click
            window.open(link, '_blank');
        }
    }
});
