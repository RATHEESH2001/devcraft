/**
 * DevCraft Main Script
 * Handles Theme Toggling, Mobile Navigation Drawer with Focus Trap,
 * Scroll Reveal Animations (IntersectionObserver), Testimonial Slider, and Year Update.
 */
(() => {
  'use strict';

  // Mark JS enabled immediately
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initScrollReveal();
    initTestimonialSlider();
    initFooterYear();
  });

  /* ------------------------------------------------------------------------
     1. THEME TOGGLING (Dark / Light)
     ------------------------------------------------------------------------ */
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('devcraft_theme', newTheme);
      } catch (e) {
        // LocalStorage might be restricted
      }
      toggleBtn.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} theme`);
    });
  }

  /* ------------------------------------------------------------------------
     2. MOBILE DRAWER NAVIGATION & ACCESSIBLE FOCUS TRAP
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('mobileBackdrop');
    const closeBtn = document.getElementById('closeDrawer');

    if (!hamburger || !drawer || !backdrop) return;

    const focusableElementsSelector = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let previousActiveElement = null;

    function openDrawer() {
      previousActiveElement = document.activeElement;
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      const focusable = drawer.querySelectorAll(focusableElementsSelector);
      if (focusable.length > 0) {
        setTimeout(() => focusable[0].focus(), 100);
      }
      document.addEventListener('keydown', handleKeyDown);
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = Array.from(drawer.querySelectorAll(focusableElementsSelector));
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // Close when clicking mobile links
    const drawerLinks = drawer.querySelectorAll('.mobile-drawer__link');
    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  /* ------------------------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS (data-sal)
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('[data-sal]');
    if (elements.length === 0) return;

    if (isReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('sal-animate'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-sal-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('sal-animate');
          }, parseInt(delay, 10));
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     4. TESTIMONIAL SLIDER (ACCESSIBLE)
     ------------------------------------------------------------------------ */
  function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    const track = slider.querySelector('.testimonial-track');
    const slides = Array.from(slider.querySelectorAll('.testimonial-slide'));
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    const dotsContainer = slider.querySelector('.testimonial-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const total = slides.length;

    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testimonial-dot';
        dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      currentIndex = index;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, idx) => {
          dot.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Touch swipe support
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     5. FOOTER YEAR
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    const yearEl = document.getElementById('footerYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

})();
