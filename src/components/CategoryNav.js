// Category Sticky Navigation Component

export function renderCategoryNav(container, categories, onSelectCategory) {
  const navWrapper = document.createElement('div');
  navWrapper.className = 'category-nav-wrapper';
  navWrapper.id = 'category-nav-wrapper';

  const containerInner = document.createElement('div');
  containerInner.className = 'container';

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'category-scroll-container';
  scrollContainer.id = 'category-scroll-container';

  function centerPill(pill) {
    if (!scrollContainer || !pill) return;
    const containerRect = scrollContainer.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const delta = (pillRect.left + pillRect.width / 2) - (containerRect.left + containerRect.width / 2);
    scrollContainer.scrollBy({ left: delta, behavior: 'smooth' });
  }

  let currentActiveId = categories[0]?.id || null;

  categories.forEach((cat, index) => {
    const pill = document.createElement('button');
    pill.className = `category-pill ${index === 0 ? 'active' : ''}`;
    pill.dataset.categoryId = cat.id;
    pill.setAttribute('aria-label', `Categoría ${cat.name}`);

    pill.innerHTML = `
      <span class="pill-icon">${cat.icon || '🍣'}</span>
      <span class="pill-text">${cat.name}</span>
      <span class="kanji-badge">${cat.kanji || ''}</span>
    `;

    pill.addEventListener('click', (e) => {
      e.preventDefault();
      // Update active styling
      scrollContainer.querySelectorAll('.category-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentActiveId = cat.id;

      // Scroll horizontal nav smoothly without affecting window scroll
      centerPill(pill);

      if (onSelectCategory) {
        onSelectCategory(cat.id);
      }
    });

    scrollContainer.appendChild(pill);
  });

  containerInner.appendChild(scrollContainer);
  navWrapper.appendChild(containerInner);
  container.appendChild(navWrapper);

  return {
    setActive(categoryId) {
      if (!categoryId || categoryId === currentActiveId) return;
      const activePill = scrollContainer.querySelector(`[data-category-id="${categoryId}"]`);
      if (activePill) {
        scrollContainer.querySelectorAll('.category-pill').forEach((p) => p.classList.remove('active'));
        activePill.classList.add('active');
        currentActiveId = categoryId;
        centerPill(activePill);
      }
    }
  };
}

