// Header Component
import { cartStore } from '../store/cartStore';

export function renderHeader(container, onOpenCart) {
  const header = document.createElement('header');
  header.className = 'header';
  header.id = 'main-header';

  header.innerHTML = `
    <div class="container header-container">
      <div class="header-brand" id="brand-link">
        <img src="/logo.png" alt="Akamaru Sushi Club" class="header-logo-img" />
        <div class="header-brand-text">
          <div class="header-brand-title">AKAMARU <span>赤丸</span></div>
          <div class="header-brand-subtitle">SUSHI CLUB</div>
        </div>
      </div>

      <nav class="header-nav">
        <a href="#menu-catalog" class="header-nav-link active" id="nav-menu">Menú</a>
        <a href="#destacados-section" class="header-nav-link" id="nav-destacados">Destacados</a>
        <a href="#nosotros-section" class="header-nav-link" id="nav-nosotros">Nosotros</a>
        <a href="#contacto-section" class="header-nav-link" id="nav-contacto">Contacto</a>
      </nav>

      <div class="header-actions">
        <button class="header-cart-btn" id="header-cart-trigger" aria-label="Abrir Carrito">
          <span class="cart-icon">🛒</span>
          <span class="cart-label">Pedido</span>
          <span class="cart-badge" id="header-cart-badge">0</span>
        </button>
      </div>
    </div>
  `;

  // Attach click listener for opening cart
  const cartBtn = header.querySelector('#header-cart-trigger');
  cartBtn.addEventListener('click', () => {
    if (onOpenCart) onOpenCart();
  });

  const brandLink = header.querySelector('#brand-link');
  brandLink.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Subscribe to cart changes to update badge
  const badge = header.querySelector('#header-cart-badge');
  cartStore.subscribe((state) => {
    badge.textContent = state.itemCount;
    if (state.itemCount > 0) {
      badge.classList.remove('bump');
      void badge.offsetWidth; // Force reflow
      badge.classList.add('bump');
    }
  });

  container.appendChild(header);
}
