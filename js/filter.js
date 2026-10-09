/**
 * DevCraft Project Filter Script
 * Handles category filtering on work.html with accessibility live region announcements.
 */
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initProjectFilters();
  });

  function initProjectFilters() {
    const chipsContainer = document.getElementById('projectFilters');
    const projectGrid = document.getElementById('projectsGrid');
    const liveRegion = document.getElementById('filterLiveRegion');
    const emptyState = document.getElementById('filterEmptyState');

    if (!chipsContainer || !projectGrid) return;

    const chips = chipsContainer.querySelectorAll('[data-filter]');
    const cards = projectGrid.querySelectorAll('[data-tags]');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filterValue = chip.getAttribute('data-filter');

        // Update active chip state
        chips.forEach(c => {
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });

        let matchCount = 0;

        cards.forEach(card => {
          const tags = (card.getAttribute('data-tags') || '').split(',').map(t => t.trim().toLowerCase());
          const isMatch = filterValue === 'all' || tags.includes(filterValue.toLowerCase());

          if (isMatch) {
            card.style.display = '';
            // Trigger animation if present
            card.classList.add('sal-animate');
            matchCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Toggle empty state
        if (emptyState) {
          emptyState.style.display = matchCount === 0 ? 'block' : 'none';
        }

        // Announce to screen readers
        if (liveRegion) {
          const filterName = chip.textContent.trim();
          liveRegion.textContent = `Showing ${matchCount} ${matchCount === 1 ? 'project' : 'projects'} for ${filterName}`;
        }
      });
    });
  }
})();
