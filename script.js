document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // Mobile Menu Logic
    // ---------------------------------------------------------
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a, nav a');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isHidden = navMenu.classList.contains('opacity-0');
            if (isHidden) {
                // Show menu
                navMenu.classList.remove('opacity-0', '-translate-y-5', 'pointer-events-none');
            } else {
                // Hide menu
                navMenu.classList.add('opacity-0', '-translate-y-5', 'pointer-events-none');
            }
        });

        // Close when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.add('opacity-0', '-translate-y-5', 'pointer-events-none');
            });
        });
    }

    // ---------------------------------------------------------
    // 3D TILT EFFECT LOGIC (Robust & Smooth)
    // ---------------------------------------------------------
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Events for Mouse
        card.addEventListener('mousemove', handleHover);
        card.addEventListener('mouseleave', handleLeave);

        // Events for Touch
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);

        // Click / Tap Navigation
        card.addEventListener('click', handleClick);
    });

    function applyTilt(card, x, y) {
        // Use requestAnimationFrame for 60fps performance
        requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();

            // Mouse position relative to the card's center
            const xMid = rect.width / 2;
            const yMid = rect.height / 2;

            const clientXWithin = x - rect.left;
            const clientYWithin = y - rect.top;

            // Calculate rotation percentages
            // Range: -5deg to 5deg (Subtler, more corporate)

            // RotateX (up/down tilt):
            // Cursor at Top (y < mid) -> Tilt Back (Positive RotateX)
            // Cursor at Bottom (y > mid) -> Tilt Forward (Negative RotateX)
            const rotateX = ((yMid - clientYWithin) / yMid) * 5;

            // RotateY (left/right tilt):
            // Cursor at Left (x < mid) -> Tilt Left (Negative RotateY)
            // Cursor at Right (x > mid) -> Tilt Right (Positive RotateY)
            const rotateY = ((clientXWithin - xMid) / xMid) * 5;

            // Apply styles using inline transform (overrides Tailwind's transform classes momentarily)
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;

            // Add shadow via inline style or class
            card.style.boxShadow = `
                ${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.5)
            `;

            card.style.zIndex = '10'; // Bring to front
        });
    }

    function resetTilt(card) {
        requestAnimationFrame(() => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = 'none';
            card.style.zIndex = '1';

            // Clear mobile state
            card.classList.remove('mobile-ready');
            card.style.borderColor = ''; // Reset border
        });
    }

    // Event Handlers
    function handleHover(e) {
        applyTilt(e.currentTarget, e.clientX, e.clientY);
    }

    function handleLeave(e) {
        resetTilt(e.currentTarget);
    }

    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            // Prevent scroll if needed, but usually better to let user scroll unless dragging intentionally
            // e.preventDefault(); 
            applyTilt(e.currentTarget, e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    function handleTouchEnd(e) {
        resetTilt(e.currentTarget);
    }

    // Logic: First Tap -> Active State (Tilt/Highlight), Second Tap -> Open Link
    function handleClick(e) {
        const card = e.currentTarget;
        const link = card.getAttribute('data-link');
        const isMobile = window.matchMedia("(pointer: coarse)").matches;

        if (link) {
            if (isMobile) {
                // If not already ready, make it ready
                if (!card.classList.contains('mobile-ready')) {
                    e.preventDefault();

                    // Reset others
                    cards.forEach(c => c.classList.remove('mobile-ready'));

                    card.classList.add('mobile-ready');
                    card.style.borderColor = '#38bdf8'; // Accent color highlight

                    // Auto-reset
                    setTimeout(() => {
                        card.classList.remove('mobile-ready');
                        card.style.borderColor = '';
                    }, 2000);
                } else {
                    // Already ready, go to link
                    window.open(link, '_blank');
                    card.classList.remove('mobile-ready');
                    card.style.borderColor = '';
                }
            } else {
                // Desktop - just open
                window.open(link, '_blank');
            }
        }
    }

    // Intersection Observer for fade-ins (Optional but nice)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-4');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // ---------------------------------------------------------
    // Active Section Highlight Logic
    // ---------------------------------------------------------
    const sections = document.querySelectorAll('section');
    // navLinks is already defined at the top


    // Add scroll event listener
    window.addEventListener('scroll', () => {
        let current = '';

        // Determine which section is currently in view
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.clientHeight;
            // -100 offset for the fixed header
            if (pageYOffset >= sectionTop - 150) {
                current = sec.getAttribute('id');
            }
        });

        // Update active class on nav links
        navLinks.forEach(a => {
            // Remove active style (using Tailwind text color change)
            a.classList.remove('text-white', 'font-bold');
            a.classList.add('text-muted');

            // Check if link href matches current section
            if (a.getAttribute('href') === '#' + current) {
                a.classList.remove('text-muted');
                a.classList.add('text-white', 'font-bold');
            }
        });
    });
});
