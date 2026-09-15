// Cart Drawer & Mobile Floating Cart Component
import { cartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/formatters';

export function createCartDrawer(onCheckout, onEditItem) {
  const overlay = document.createElement('div');
  overlay.className = 'cart-drawer-overlay';
  overlay.id = 'cart-drawer-overlay';

  overlay.innerHTML = `
    <div class="cart-drawer" role="dialog" aria-modal="true">
      <div class="cart-drawer-header">
        <div class="cart-drawer-title">
          <span>🛍️ Tu Pedido</span>
          <span class="cart-badge" id="drawer-cart-count">0</span>
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <button class="cart-clear-link" id="cart-clear-btn" style="display: none;">Vaciar carrito</button>
          <button class="modal-close-btn" id="drawer-close-btn" style="position: static;" aria-label="Cerrar carrito">✕</button>
        </div>
      </div>

      <div class="cart-items-list" id="cart-items-container"></div>

      <div class="cart-drawer-footer" id="cart-drawer-footer" style="display: none;">
        <div class="cart-summary-line">
          <span>Subtotal</span>
          <span id="cart-subtotal-val">$U 0</span>
        </div>
        <div class="cart-summary-line">
          <span id="cart-delivery-label">Costo de envío estimado</span>
          <span id="cart-delivery-val">$U 120</span>
        </div>
        <div class="cart-summary-line total">
          <span>Total a pagar</span>
          <span class="price" id="cart-total-val">$U 0</span>
        </div>
        <button class="btn btn-primary" id="cart-checkout-btn" style="width: 100%; padding: 14px;">
          <span>Continuar al Pago</span>
          <span>→</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Mobile Bottom Floating Cart Bar
  const mobileBar = document.createElement('div');
  mobileBar.className = 'mobile-cart-bar';
  mobileBar.id = 'mobile-cart-bar';
  mobileBar.innerHTML = `
    <div class="mobile-cart-info">
      <span class="mobile-cart-count" id="mobile-cart-count">0 piezas / items</span>
      <span class="mobile-cart-total" id="mobile-cart-total">$U 0</span>
    </div>
    <button class="mobile-cart-btn" id="mobile-cart-trigger">
      <span>Ver Pedido</span>
      <span>🛍️</span>
    </button>
  `;
  document.body.appendChild(mobileBar);

  const drawerCount = overlay.querySelector('#drawer-cart-count');
  const itemsContainer = overlay.querySelector('#cart-items-container');
  const footerEl = overlay.querySelector('#cart-drawer-footer');
  const subtotalVal = overlay.querySelector('#cart-subtotal-val');
  const deliveryVal = overlay.querySelector('#cart-delivery-val');
  const deliveryLabel = overlay.querySelector('#cart-delivery-label');
  const totalVal = overlay.querySelector('#cart-total-val');
  const clearBtn = overlay.querySelector('#cart-clear-btn');
  const checkoutBtn = overlay.querySelector('#cart-checkout-btn');
  const closeBtn = overlay.querySelector('#drawer-close-btn');

  const mobileCount = mobileBar.querySelector('#mobile-cart-count');
  const mobileTotal = mobileBar.querySelector('#mobile-cart-total');
  const mobileTrigger = mobileBar.querySelector('#mobile-cart-trigger');

  function openDrawer() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDrawer();
  });

  mobileTrigger.addEventListener('click', openDrawer);

  clearBtn.addEventListener('click', () => {
    if (confirm('¿Deseas vaciar todos los productos de tu pedido?')) {
      cartStore.clearCart();
    }
  });

  checkoutBtn.addEventListener('click', () => {
    closeDrawer();
    if (onCheckout) onCheckout();
  });

  // Render items based on store state
  function updateCartUI(state) {
    const { items, itemCount, subtotal, deliveryFee, total, orderType } = state;

    drawerCount.textContent = itemCount;

    // Mobile Bar visibility
    if (itemCount > 0) {
      mobileBar.classList.add('visible');
      mobileCount.textContent = itemCount === 1 ? '1 producto seleccionado' : `${itemCount} productos en tu carrito`;
      mobileTotal.textContent = formatCurrency(total);
      clearBtn.style.display = 'block';
      footerEl.style.display = 'flex';
    } else {
      mobileBar.classList.remove('visible');
      clearBtn.style.display = 'none';
      footerEl.style.display = 'none';
    }

    subtotalVal.textContent = formatCurrency(subtotal);
    if (orderType === 'pickup') {
      deliveryLabel.textContent = 'Retiro en el local';
      deliveryVal.textContent = '$U 0';
    } else {
      deliveryLabel.textContent = 'Envío (Delivery)';
      deliveryVal.textContent = formatCurrency(deliveryFee);
    }
    totalVal.textContent = formatCurrency(total);

    // Render items list
    itemsContainer.innerHTML = '';
    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="icon">🍱</div>
          <h3 style="font-weight: 800; font-size: 18px;">Tu pedido está vacío</h3>
          <p style="font-size: 13.5px; color: var(--color-gray); max-width: 240px;">
            Agrega rolls, combos, nigiris o tus favoritos de Akamaru para comenzar.
          </p>
          <button class="btn btn-primary" id="cart-start-browsing" style="margin-top: 10px;">
            Explorar Menú
          </button>
        </div>
      `;
      const browseBtn = itemsContainer.querySelector('#cart-start-browsing');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          closeDrawer();
          const menuCatalog = document.getElementById('menu-catalog');
          if (menuCatalog) menuCatalog.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'cart-item-card';

      let extrasHtml = '';
      if (item.extras && item.extras.length > 0) {
        extrasHtml = item.extras
          .map((e) => `<span class="cart-item-tag-extra">+ ${e.name} (${formatCurrency(e.price)})</span>`)
          .join('');
      }

      let removedHtml = '';
      if (item.removedIngredients && item.removedIngredients.length > 0) {
        removedHtml = item.removedIngredients
          .map((r) => `<span class="cart-item-tag-removed">Sin ${r}</span>`)
          .join('');
      }

      const noteHtml = item.notes ? `<div class="cart-item-note">"${item.notes}"</div>` : '';

      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-tags-list">
            ${extrasHtml}
            ${removedHtml}
            ${noteHtml}
          </div>
          <div class="cart-item-row-footer">
            <div class="cart-item-price-calc">
              ${formatCurrency(item.itemTotal)}
            </div>
            <div class="cart-item-stepper">
              <button class="cart-stepper-btn btn-minus" aria-label="Reducir">−</button>
              <span style="font-size: 13px; font-weight: 800; min-width: 18px; text-align: center;">${item.quantity}</span>
              <button class="cart-stepper-btn btn-plus" aria-label="Aumentar">+</button>
              <button class="cart-item-remove-btn" title="Eliminar del carrito" aria-label="Eliminar">🗑️</button>
            </div>
          </div>
        </div>
      `;

      // Stepper events
      const minusBtn = card.querySelector('.btn-minus');
      const plusBtn = card.querySelector('.btn-plus');
      const removeBtn = card.querySelector('.cart-item-remove-btn');

      minusBtn.addEventListener('click', () => {
        cartStore.updateQuantity(item.cartItemId, -1);
      });

      plusBtn.addEventListener('click', () => {
        cartStore.updateQuantity(item.cartItemId, 1);
      });

      removeBtn.addEventListener('click', () => {
        cartStore.removeItem(item.cartItemId);
      });

      itemsContainer.appendChild(card);
    });
  }

  // Subscribe to store
  cartStore.subscribe(updateCartUI);
  updateCartUI(cartStore.getState());

  return {
    open: openDrawer,
    close: closeDrawer
  };
}
