/* ============================================================
   DEVCRAFT — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Sticky Nav ----
    const nav = document.getElementById('nav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open);
        const spans = hamburger.querySelectorAll('span');
        if (open) {
            spans[0].style.cssText = 'transform: rotate(45deg) translate(4px, 5px)';
            spans[1].style.cssText = 'opacity: 0';
            spans[2].style.cssText = 'transform: rotate(-45deg) translate(4px, -5px)';
        } else {
            spans.forEach(s => s.style.cssText = '');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav__mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
        });
    });

    // ---- Scroll Reveal ----
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger children if parent is a grid
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    // Stagger siblings
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
        // Find siblings in the same grid/flex parent
        const siblings = Array.from(el.parentElement.querySelectorAll(':scope > [data-reveal]'));
        const idx = siblings.indexOf(el);
        el.dataset.revealDelay = idx * 100;
        revealObserver.observe(el);
    });

    // ---- Smooth Anchor Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = document.getElementById('nav').offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ---- Active Nav Link Highlight ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    // ---- Typewriter effect on hero ----
    const headline = document.querySelector('.hero__headline-accent');
    if (headline) {
        const text = headline.textContent;
        headline.textContent = '';
        headline.style.borderRight = '2px solid var(--accent)';

        let i = 0;
        const type = () => {
            if (i < text.length) {
                headline.textContent += text[i++];
                setTimeout(type, 60);
            } else {
                setTimeout(() => {
                    headline.style.borderRight = 'none';
                }, 800);
            }
        };

        setTimeout(type, 400);
    }

    // ---- Form UX (pure frontend) ----
    const form = document.querySelector('.contact-form');
    if (form) {
        const btn = form.querySelector('button[type="submit"]');
        const successEl = document.getElementById('formSuccess');
        const errorEl = document.getElementById('formError');

        const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear UI
            if (successEl) successEl.hidden = true;
            if (errorEl) errorEl.hidden = true;

            // Basic validation
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const projectType = form.querySelector('#project_type');
            const message = form.querySelector('#message');

            const valid =
                name?.value.trim().length > 0 &&
                email?.value && emailOk(email.value) &&
                projectType?.value &&
                message?.value.trim().length > 0;

            if (!valid) {
                if (errorEl) errorEl.hidden = false;
                return;
            }

            // UX feedback
            btn.textContent = 'Sending...';
            btn.disabled = true;

            // Frontend-only: simulate send
            setTimeout(() => {
                if (successEl) {
                    successEl.hidden = false;
                }
                form.reset();
                btn.textContent = 'Send Message →';
                btn.disabled = false;
            }, 900);
        });

        // Floating label effect
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('focus', () => {
                field.closest('.form-group')?.classList.add('focused');
            });
            field.addEventListener('blur', () => {
                field.closest('.form-group')?.classList.remove('focused');
            });
        });
    }

    // Footer year
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());


    // ---- Counter animation for hero stats ----
    const counters = document.querySelectorAll('.hero__stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const num = parseInt(raw);
            const suffix = raw.replace(/\d+/, '');
            if (isNaN(num)) return;

            let current = 0;
            const step = num / 40;
            const tick = () => {
                current = Math.min(current + step, num);
                el.textContent = Math.floor(current) + suffix;
                if (current < num) requestAnimationFrame(tick);
            };
            tick();
            counterObserver.unobserve(el);
        });
    }, { threshold: 1 });

    counters.forEach(c => counterObserver.observe(c));

});
