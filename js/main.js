/**
 * SIH 2026 - ARAM Innovators
 * Professional Interactive Website JavaScript
 * Scroll Reveals, Counters, Tabs, Smooth Scroll, Particles
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SCROLL REVEAL ANIMATION
       ========================================================================== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       2. ANIMATED COUNTERS
       ========================================================================== */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'), 10);
                const duration = 2000;
                const startTime = performance.now();

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentCount = Math.floor(easeOut * target);
                    counter.textContent = currentCount;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));


    /* ==========================================================================
       3. TABBED INTERFACE
       Matches HTML: .tab-link[data-tab] and .tab-content#id
       ========================================================================== */
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            if (targetContent) {
                // Remove active from all
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Activate clicked tab and content
                link.classList.add('active');
                targetContent.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       4. SMOOTH SCROLLING
       All anchor links and CTA buttons
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.top-nav')?.offsetHeight || 0;
                    const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
                    
                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks && navLinks.classList.contains('open')) {
                        navLinks.classList.remove('open');
                    }
                }
            }
        });
    });


    /* ==========================================================================
       5. MOBILE MENU TOGGLE
       Matches HTML: button.hamburger-menu and nav.nav-links
       ========================================================================== */
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            
            // Toggle icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.querySelector('i').className = 'fa-solid fa-bars';
            }
        });

        // Close on nav link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }


    /* ==========================================================================
       6. STICKY NAV ACTIVE STATE
       Highlight nav link based on visible section
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.25, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => navObserver.observe(section));


    /* ==========================================================================
       7. PARALLAX EFFECT ON HERO
       Subtle parallax on scroll for hero section
       ========================================================================== */
    const heroSection = document.querySelector('.hero');
    const heroContainer = document.querySelector('.hero-container');

    if (heroSection && heroContainer) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollPos = window.scrollY;
                    const heroHeight = heroSection.offsetHeight;
                    if (scrollPos < heroHeight) {
                        const opacity = 1 - (scrollPos / heroHeight) * 0.5;
                        heroContainer.style.transform = `translateY(${scrollPos * 0.15}px)`;
                        heroContainer.style.opacity = Math.max(opacity, 0.3);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }


    /* ==========================================================================
       8. TYPING EFFECT ON HERO TITLE
       ========================================================================== */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const fullText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.classList.add('typing-cursor');
        let charIndex = 0;

        const typeChar = () => {
            if (charIndex < fullText.length) {
                heroTitle.textContent += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 55);
            } else {
                setTimeout(() => heroTitle.classList.remove('typing-cursor'), 2000);
            }
        };

        // Start typing after a short delay
        setTimeout(typeChar, 600);
    }


    /* ==========================================================================
       9. STAGGERED GRID ANIMATIONS
       Add reveal + sequential delays to grid children
       ========================================================================== */
    const staggerSelectors = [
        '.team-card',
        '.gallery-item',
        '.stat-card',
        '.tech-badge',
        '.feature-list li',
        '.pipeline-timeline li',
        '.arch-block'
    ];

    staggerSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.style.transitionDelay = `${(index % 8) * 80}ms`;
            // Only add reveal if not already there
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                revealObserver.observe(el);
            }
        });
    });


    /* ==========================================================================
       10. PARTICLE ANIMATION (CSS-DRIVEN, JS-GENERATED)
       Generate floating particles in the hero background
       ========================================================================== */
    const particlesContainer = document.getElementById('particles-js');

    if (particlesContainer) {
        const count = 18;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 6 + 3;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 12 + 8;
            const delay = Math.random() * 6;
            const opacity = Math.random() * 0.3 + 0.1;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(29, 66, 138, ${opacity});
                border-radius: 50%;
                left: ${left}%;
                top: ${top}%;
                animation: particleFloat ${duration}s ease-in-out ${delay}s infinite alternate;
                pointer-events: none;
            `;

            particlesContainer.appendChild(particle);
        }
    }


    /* ==========================================================================
       11. SCROLL PROGRESS INDICATOR (BONUS)
       Shows a thin orange progress bar at the top of the page
       ========================================================================== */
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff5722, #e64a19);
        z-index: 9999;
        transition: width 0.1s linear;
        width: 0%;
    `;
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

});
