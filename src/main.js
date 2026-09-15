// Main Application Entry Point
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';

import menuData from './data/menu.json';
import { renderHeader } from './components/Header';
import { renderHero } from './components/Hero';
import { renderSearchBar } from './components/SearchBar';
import { renderCategoryNav } from './components/CategoryNav';
import { renderFeaturedSection } from './components/FeaturedSection';
import { createProductCard } from './components/ProductCard';
import { createProductModal } from './components/ProductModal';
import { createCartDrawer } from './components/CartDrawer';
import { createCheckoutModal } from './components/CheckoutModal';
import { renderFooter } from './components/Footer';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;

  // Initialize Modals & Drawers
  const productModal = createProductModal();
  const checkoutModal = createCheckoutModal();
  const cartDrawer = createCartDrawer(
    () => checkoutModal.open(),
    (item) => {
      // Edit item handler
      const fullProduct = menuData.products.find((p) => p.id === item.productId);
      if (fullProduct) {
        productModal.open(fullProduct, {
          quantity: item.quantity,
          extras: item.extras,
          removedIngredients: item.removedIngredients,
          notes: item.notes
        });
      }
    }
  );

  // 1. Render Header
  renderHeader(app, () => cartDrawer.open());

  // 2. Render Hero
  renderHero(
    app,
    () => {
      const menuSection = document.getElementById('menu-catalog');
      if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
    },
    () => cartDrawer.open()
  );

  // 3. Search Bar
  let searchBarRef = null;
  let activeSearchQuery = '';

  const searchContainer = document.createElement('div');
  app.appendChild(searchContainer);

  // 4. Category Nav
  let categoryNavRef = null;
  const navContainer = document.createElement('div');
  app.appendChild(navContainer);

  // 5. Main Catalog Container
  const catalogMain = document.createElement('main');
  catalogMain.id = 'menu-catalog';
  catalogMain.className = 'container';
  app.appendChild(catalogMain);

  // Render "Los favoritos de Akamaru"
  renderFeaturedSection(catalogMain, menuData.products, (product) => {
    productModal.open(product);
  });

  // Container for all category sections
  const categorySectionsContainer = document.createElement('div');
  categorySectionsContainer.id = 'category-sections-container';
  catalogMain.appendChild(categorySectionsContainer);

  // Container for search results (when searching)
  const searchResultsContainer = document.createElement('div');
  searchResultsContainer.id = 'search-results-container';
  searchResultsContainer.style.display = 'none';
  searchResultsContainer.style.padding = '20px 0 40px';
  catalogMain.appendChild(searchResultsContainer);

  // Render Category Sections
  function renderAllCategorySections() {
    categorySectionsContainer.innerHTML = '';

    menuData.categories.forEach((cat) => {
      // 'destacados' is already rendered above in FeaturedSection ("Los favoritos de Akamaru")
      if (cat.id === 'destacados') return;

      const catProducts = menuData.products.filter((p) => p.category === cat.id);
      if (catProducts.length === 0) return;

      const catSection = document.createElement('section');
      catSection.className = 'menu-category-section';
      catSection.id = `cat-${cat.id}`;
      catSection.dataset.categoryId = cat.id;

      catSection.innerHTML = `
        <div class="category-header-wrap">
          <div class="category-icon-box">${cat.icon || '🍣'}</div>
          <div>
            <span class="category-title-text">${cat.name}</span>
            <span class="category-kanji-sub">${cat.kanji || ''}</span>
          </div>
          <p class="category-desc">${cat.description || ''}</p>
        </div>
        <div class="products-grid"></div>
      `;

      const grid = catSection.querySelector('.products-grid');
      catProducts.forEach((prod) => {
        const card = createProductCard(prod, (selected) => {
          productModal.open(selected);
        });
        grid.appendChild(card);
      });

      categorySectionsContainer.appendChild(catSection);
    });
  }

  renderAllCategorySections();

  // Filter products by query
  function filterProducts(query) {
    if (!query) return menuData.products;
    const q = query.toLowerCase().trim();

    return menuData.products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchIngredients = p.ingredients && p.ingredients.some((ing) => ing.toLowerCase().includes(q));
      const matchTag = p.tag && p.tag.toLowerCase().includes(q);
      return matchName || matchDesc || matchCategory || matchIngredients || matchTag;
    });
  }

  // Handle live search
  function handleSearchChange(query) {
    activeSearchQuery = query;

    if (!query) {
      // Normal view
      searchResultsContainer.style.display = 'none';
      searchResultsContainer.innerHTML = '';
      categorySectionsContainer.style.display = 'block';
      const featured = document.getElementById('destacados-section');
      if (featured) featured.style.display = 'block';
      return menuData.products.length;
    }

    // Search active view
    const filtered = filterProducts(query);
    categorySectionsContainer.style.display = 'none';
    const featured = document.getElementById('destacados-section');
    if (featured) featured.style.display = 'none';
    searchResultsContainer.style.display = 'block';

    if (filtered.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="empty-search-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No encontramos resultados</h3>
          <p class="empty-desc">No hay platos que coincidan con "<strong>${query}</strong>". Prueba con salmón, rolls, gyozas o palta.</p>
          <button class="btn btn-primary" id="btn-reset-search">
            <span>Ver todo el menú</span>
          </button>
        </div>
      `;

      const resetBtn = searchResultsContainer.querySelector('#btn-reset-search');
      if (resetBtn && searchBarRef) {
        resetBtn.addEventListener('click', () => {
          searchBarRef.setQuery('');
        });
      }
    } else {
      searchResultsContainer.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 20px; font-weight: 800;">
            Resultados para "${query}" (${filtered.length})
          </h2>
        </div>
        <div class="products-grid" id="search-grid"></div>
      `;

      const grid = searchResultsContainer.querySelector('#search-grid');
      filtered.forEach((prod) => {
        const card = createProductCard(prod, (selected) => {
          productModal.open(selected);
        });
        grid.appendChild(card);
      });
    }

    return filtered.length;
  }

  // Render Search Bar
  searchBarRef = renderSearchBar(searchContainer, handleSearchChange);

  // Render Category Navigation
  categoryNavRef = renderCategoryNav(navContainer, menuData.categories, (categoryId) => {
    // If search is active, clear it first
    if (activeSearchQuery && searchBarRef) {
      searchBarRef.setQuery('');
    }

    if (categoryId === 'destacados') {
      const featuredSection = document.getElementById('destacados-section');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const targetSection = document.getElementById(`cat-${categoryId}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // 6. Render Footer
  renderFooter(app);

  // Scrollspy to highlight active category pill as the user scrolls
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (activeSearchQuery || ticking) return;

    window.requestAnimationFrame(() => {
      const scrollHeaderOffset = 180;
      const sections = document.querySelectorAll('.menu-category-section, #destacados-section');

      let currentSectionId = null;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= scrollHeaderOffset && rect.bottom > scrollHeaderOffset) {
          currentSectionId = section.dataset.categoryId || (section.id === 'destacados-section' ? 'destacados' : null);
        }
      });

      if (currentSectionId && categoryNavRef) {
        categoryNavRef.setActive(currentSectionId);
      }
      ticking = false;
    });

    ticking = true;
  });
});

