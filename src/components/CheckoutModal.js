// Checkout Modal & Order Confirmation Flow
import { cartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/formatters';
import { sendOrderToWhatsApp } from '../utils/whatsapp';
import config from '../data/config.json';
import { toast } from './Toast';

export function createCheckoutModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'checkout-modal-overlay';

  overlay.innerHTML = `
    <div class="modal-content" style="max-width: 620px;" role="dialog" aria-modal="true">
      <button class="modal-close-btn" id="checkout-close-btn" aria-label="Cerrar checkout">✕</button>

      <div style="padding: 24px 24px 12px; border-bottom: 1px solid var(--color-gray-light); background: var(--color-ivory);">
        <h2 style="font-size: 20px; font-weight: 900; display: flex; align-items: center; gap: 8px;">
          <span>🍣</span>
          <span>Finalizar Pedido</span>
        </h2>
        <p style="font-size: 13px; color: var(--color-gray); margin-top: 4px;">
          Completa los datos para enviar tu pedido directamente por WhatsApp
        </p>
      </div>

      <div class="checkout-steps-container">
        <!-- 1. Tipo de Pedido -->
        <div class="checkout-block">
          <div class="checkout-block-title">
            <span>1. Modalidad de Entrega</span>
          </div>
          <div class="order-type-tabs">
            <button type="button" class="order-type-tab active" id="tab-delivery">
              <span class="tab-icon">🛵</span>
              <span class="tab-title">Delivery</span>
              <span class="tab-estimate">${config.restaurant.deliveryTime} aprox.</span>
            </button>
            <button type="button" class="order-type-tab" id="tab-pickup">
              <span class="tab-icon">🏪</span>
              <span class="tab-title">Retiro en local</span>
              <span class="tab-estimate">${config.restaurant.pickupTime} aprox.</span>
            </button>
          </div>
        </div>

        <!-- 2. Datos del Cliente y Entrega -->
        <div class="checkout-block">
          <div class="checkout-block-title">
            <span>2. Tus Datos</span>
          </div>
          <div class="form-grid two-cols">
            <div class="form-group">
              <label class="form-label" for="cust-name">Nombre y Apellido *</label>
              <input type="text" id="cust-name" class="form-input" placeholder="Ej: Ignacio Silva" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="cust-phone">Teléfono / Celular *</label>
              <input type="tel" id="cust-phone" class="form-input" placeholder="Ej: 099 123 456" required />
            </div>
          </div>

          <!-- Campos de Delivery -->
          <div id="delivery-fields-group" class="form-grid" style="margin-top: 8px;">
            <div class="form-grid two-cols">
              <div class="form-group">
                <label class="form-label" for="cust-street">Calle *</label>
                <input type="text" id="cust-street" class="form-input" placeholder="Ej: Av. Brasil" />
              </div>
              <div class="form-group">
                <label class="form-label" for="cust-door">Número de puerta *</label>
                <input type="text" id="cust-door" class="form-input" placeholder="Ej: 2640" />
              </div>
            </div>
            <div class="form-grid two-cols">
              <div class="form-group">
                <label class="form-label" for="cust-apto">Apartamento / Piso (opcional)</label>
                <input type="text" id="cust-apto" class="form-input" placeholder="Ej: Apto 402" />
              </div>
              <div class="form-group">
                <label class="form-label" for="cust-neighborhood">Barrio *</label>
                <input type="text" id="cust-neighborhood" class="form-input" placeholder="Ej: Pocitos / Punta Carretas" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="cust-ref">Referencia de entrega (opcional)</label>
              <input type="text" id="cust-ref" class="form-input" placeholder="Ej: Portón negro al lado de la farmacia" />
            </div>
          </div>

          <!-- Nota de Retiro en local -->
          <div id="pickup-notice-box" style="display: none; padding: 14px; background: var(--color-brand-red-light); border-radius: var(--radius-sm); border: 1px solid var(--color-brand-red-glow);">
            <div style="font-weight: 800; font-size: 13.5px; color: var(--color-brand-red); display: flex; align-items: center; gap: 6px;">
              <span>🏪</span>
              <span>Retiras en nuestro local:</span>
            </div>
            <div style="font-size: 13px; color: var(--color-black); margin-top: 4px; font-weight: 600;">
              ${config.restaurant.address}
            </div>
            <div style="font-size: 11.5px; color: var(--color-gray); margin-top: 2px;">
              Horario: ${config.restaurant.schedule}
            </div>
          </div>
        </div>

        <!-- 3. Medio de Pago -->
        <div class="checkout-block">
          <div class="checkout-block-title">
            <span>3. Medio de Pago</span>
          </div>
          <div class="payment-methods-grid">
            <button type="button" class="payment-method-card active" id="pay-cash">
              <span class="payment-method-icon">💵</span>
              <span class="payment-method-title">Efectivo</span>
            </button>
            <button type="button" class="payment-method-card" id="pay-transfer">
              <span class="payment-method-icon">🏦</span>
              <span class="payment-method-title">Transferencia</span>
            </button>
            <button type="button" class="payment-method-card" id="pay-mercadopago">
              <span class="payment-method-icon">💳</span>
              <span class="payment-method-title">Mercado Pago</span>
            </button>
          </div>

          <!-- Detalle Efectivo -->
          <div id="payment-cash-box" class="payment-detail-box">
            <label class="form-label" for="cash-pay-amount">¿Con cuánto vas a pagar?</label>
            <div class="cash-calc-row">
              <div style="position: relative; flex: 1;">
                <span style="position: absolute; left: 12px; top: 11px; font-weight: 700; color: var(--color-gray);">$U</span>
                <input 
                  type="number" 
                  id="cash-pay-amount" 
                  class="form-input" 
                  style="padding-left: 38px; width: 100%; font-weight: 700; font-size: 16px;" 
                  placeholder="Ej: 1000" 
                  min="0"
                />
              </div>
            </div>
            <div id="cash-change-feedback" class="cash-change-display" style="display: none;"></div>
          </div>

          <!-- Detalle Transferencia -->
          <div id="payment-transfer-box" class="payment-detail-box" style="display: none;">
            <div class="bank-info-table">
              <div><strong>Banco:</strong> ${config.restaurant.bankInfo.bank}</div>
              <div><strong>Titular:</strong> ${config.restaurant.bankInfo.holder}</div>
              <div><strong>Cuenta:</strong> ${config.restaurant.bankInfo.accountNumber}</div>
              <div><strong>Alias:</strong> ${config.restaurant.bankInfo.alias}</div>
            </div>
            <div class="bank-note">
              ℹ️ Una vez realizada la transferencia, envía el comprobante por WhatsApp.
            </div>
          </div>

          <!-- Detalle Mercado Pago -->
          <div id="payment-mercadopago-box" class="payment-detail-box" style="display: none;">
            <div style="font-size: 13.5px; line-height: 1.5;">
              Puedes abonar mediante Mercado Pago (tarjetas de crédito, débito o dinero en cuenta).
            </div>
            <a 
              href="${config.restaurant.mercadoPagoLink}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-secondary" 
              style="align-self: flex-start; margin-top: 6px; font-size: 13px;"
            >
              <span>🔗</span>
              <span>Abrir link de Mercado Pago</span>
            </a>
            <div style="font-size: 12px; color: var(--color-gray);">
              También coordinamos el link de pago directamente por WhatsApp tras confirmar la orden.
            </div>
          </div>
        </div>

        <!-- 4. Resumen del Pedido ("TU PEDIDO") -->
        <div class="checkout-block">
          <div class="checkout-block-title">
            <span>4. Resumen del Pedido</span>
          </div>
          <div class="order-review-box" id="order-review-box">
            <div class="order-review-header">TU PEDIDO</div>
            <div class="order-review-items" id="review-items-list"></div>
            <div class="order-review-divider"></div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span>Subtotal:</span>
              <span id="review-subtotal">$U 0</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px;">
              <span id="review-delivery-label">Envío:</span>
              <span id="review-delivery-fee">$U 120</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; color: #FFFFFF; padding-top: 4px;">
              <span>TOTAL:</span>
              <span style="color: var(--color-brand-red);" id="review-total">$U 0</span>
            </div>
            <div class="order-review-divider"></div>
            <div class="order-review-meta" id="review-meta-details"></div>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="background: var(--color-ivory);">
        <button class="btn btn-primary" id="btn-confirm-order" style="width: 100%; padding: 16px; font-size: 16px; letter-spacing: 0.04em;">
          <span>📲</span>
          <span>CONFIRMAR PEDIDO EN WHATSAPP</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // References
  const closeBtn = overlay.querySelector('#checkout-close-btn');
  const tabDelivery = overlay.querySelector('#tab-delivery');
  const tabPickup = overlay.querySelector('#tab-pickup');
  const deliveryFields = overlay.querySelector('#delivery-fields-group');
  const pickupNotice = overlay.querySelector('#pickup-notice-box');

  const nameInput = overlay.querySelector('#cust-name');
  const phoneInput = overlay.querySelector('#cust-phone');
  const streetInput = overlay.querySelector('#cust-street');
  const doorInput = overlay.querySelector('#cust-door');
  const aptoInput = overlay.querySelector('#cust-apto');
  const neighborhoodInput = overlay.querySelector('#cust-neighborhood');
  const refInput = overlay.querySelector('#cust-ref');

  const payCash = overlay.querySelector('#pay-cash');
  const payTransfer = overlay.querySelector('#pay-transfer');
  const payMercadopago = overlay.querySelector('#pay-mercadopago');
  const cashBox = overlay.querySelector('#payment-cash-box');
  const transferBox = overlay.querySelector('#payment-transfer-box');
  const mpBox = overlay.querySelector('#payment-mercadopago-box');
  const cashAmountInput = overlay.querySelector('#cash-pay-amount');
  const cashFeedback = overlay.querySelector('#cash-change-feedback');

  const reviewItemsList = overlay.querySelector('#review-items-list');
  const reviewSubtotal = overlay.querySelector('#review-subtotal');
  const reviewDeliveryLabel = overlay.querySelector('#review-delivery-label');
  const reviewDeliveryFee = overlay.querySelector('#review-delivery-fee');
  const reviewTotal = overlay.querySelector('#review-total');
  const reviewMeta = overlay.querySelector('#review-meta-details');
  const confirmBtn = overlay.querySelector('#btn-confirm-order');

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Delivery vs Pickup selection
  tabDelivery.addEventListener('click', () => {
    tabDelivery.classList.add('active');
    tabPickup.classList.remove('active');
    deliveryFields.style.display = 'grid';
    pickupNotice.style.display = 'none';
    cartStore.setOrderType('delivery');
    syncInputsToStore();
    renderReview();
  });

  tabPickup.addEventListener('click', () => {
    tabPickup.classList.add('active');
    tabDelivery.classList.remove('active');
    deliveryFields.style.display = 'none';
    pickupNotice.style.display = 'block';
    cartStore.setOrderType('pickup');
    syncInputsToStore();
    renderReview();
  });

  // Payment methods
  payCash.addEventListener('click', () => {
    payCash.classList.add('active');
    payTransfer.classList.remove('active');
    payMercadopago.classList.remove('active');
    cashBox.style.display = 'flex';
    transferBox.style.display = 'none';
    mpBox.style.display = 'none';
    cartStore.setPaymentMethod('cash');
    renderReview();
  });

  payTransfer.addEventListener('click', () => {
    payTransfer.classList.add('active');
    payCash.classList.remove('active');
    payMercadopago.classList.remove('active');
    cashBox.style.display = 'none';
    transferBox.style.display = 'flex';
    mpBox.style.display = 'none';
    cartStore.setPaymentMethod('transfer');
    renderReview();
  });

  payMercadopago.addEventListener('click', () => {
    payMercadopago.classList.add('active');
    payCash.classList.remove('active');
    payTransfer.classList.remove('active');
    cashBox.style.display = 'none';
    transferBox.style.display = 'none';
    mpBox.style.display = 'flex';
    cartStore.setPaymentMethod('mercadopago');
    renderReview();
  });

  // Cash change calculation
  cashAmountInput.addEventListener('input', () => {
    const val = parseFloat(cashAmountInput.value) || 0;
    cartStore.setCashAmount(val);
    updateCashFeedback();
    renderReview();
  });

  function updateCashFeedback() {
    const state = cartStore.getState();
    const val = parseFloat(cashAmountInput.value) || 0;

    if (val <= 0) {
      cashFeedback.style.display = 'none';
      return;
    }

    cashFeedback.style.display = 'block';
    if (val < state.total) {
      const missing = state.total - val;
      cashFeedback.className = 'cash-change-display invalid';
      cashFeedback.textContent = `⚠️ Monto insuficiente. Faltan ${formatCurrency(missing)} para cubrir el total de ${formatCurrency(state.total)}.`;
    } else {
      const change = val - state.total;
      cashFeedback.className = 'cash-change-display positive';
      cashFeedback.textContent = `✓ Pago con: ${formatCurrency(val)} | Total: ${formatCurrency(state.total)} | Cambio a recibir: ${formatCurrency(change)}`;
    }
  }

  function syncInputsToStore() {
    cartStore.setCustomerData({
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      street: streetInput.value.trim(),
      doorNumber: doorInput.value.trim(),
      apartment: aptoInput.value.trim(),
      neighborhood: neighborhoodInput.value.trim(),
      reference: refInput.value.trim()
    });
  }

  [nameInput, phoneInput, streetInput, doorInput, aptoInput, neighborhoodInput, refInput].forEach((input) => {
    input.addEventListener('input', () => {
      syncInputsToStore();
      renderReview();
    });
  });

  function renderReview() {
    const state = cartStore.getState();

    // Items list
    reviewItemsList.innerHTML = '';
    state.items.forEach((item) => {
      const row = document.createElement('div');
      row.style.marginBottom = '6px';

      let extrasTxt = '';
      if (item.extras && item.extras.length > 0) {
        extrasTxt = item.extras.map((e) => `<div class="order-review-item-sub">+ ${e.name}</div>`).join('');
      }

      let remTxt = '';
      if (item.removedIngredients && item.removedIngredients.length > 0) {
        remTxt = item.removedIngredients.map((r) => `<div class="order-review-item-sub">Sin ${r}</div>`).join('');
      }

      let noteTxt = item.notes ? `<div class="order-review-item-sub">"${item.notes}"</div>` : '';

      row.innerHTML = `
        <div class="order-review-item-row">
          <span class="order-review-item-main">${item.quantity}x ${item.name}</span>
          <span style="font-weight: 700;">${formatCurrency(item.itemTotal)}</span>
        </div>
        ${extrasTxt}
        ${remTxt}
        ${noteTxt}
      `;
      reviewItemsList.appendChild(row);
    });

    reviewSubtotal.textContent = formatCurrency(state.subtotal);
    if (state.orderType === 'delivery') {
      reviewDeliveryLabel.textContent = 'Envío (Delivery):';
      reviewDeliveryFee.textContent = formatCurrency(state.deliveryFee);
    } else {
      reviewDeliveryLabel.textContent = 'Envío:';
      reviewDeliveryFee.textContent = '$U 0 (Retiro en local)';
    }
    reviewTotal.textContent = formatCurrency(state.total);

    // Meta details
    let payDesc = 'Efectivo';
    if (state.paymentMethod === 'transfer') payDesc = 'Transferencia bancaria';
    if (state.paymentMethod === 'mercadopago') payDesc = 'Mercado Pago';

    let addressTxt = '';
    if (state.orderType === 'delivery') {
      addressTxt = `
        <div><strong>Tipo de pedido:</strong> Delivery (${config.restaurant.deliveryTime})</div>
        <div><strong>Dirección:</strong> ${state.customer.street || '...'} ${state.customer.doorNumber || ''} ${state.customer.apartment ? '(' + state.customer.apartment + ')' : ''} ${state.customer.neighborhood ? '— ' + state.customer.neighborhood : ''}</div>
      `;
    } else {
      addressTxt = `
        <div><strong>Tipo de pedido:</strong> Retiro en el local (${config.restaurant.pickupTime})</div>
        <div><strong>Punto de retiro:</strong> ${config.restaurant.address}</div>
      `;
    }

    reviewMeta.innerHTML = `
      <div><strong>Cliente:</strong> ${state.customer.name || '(A completar)'} | <strong>Tel:</strong> ${state.customer.phone || '(A completar)'}</div>
      ${addressTxt}
      <div><strong>Medio de Pago:</strong> ${payDesc}</div>
    `;
  }

  // Final confirmation click
  confirmBtn.addEventListener('click', () => {
    const state = cartStore.getState();

    if (state.items.length === 0) {
      toast.show('El carrito está vacío. Agrega productos antes de confirmar.', 'error');
      return;
    }

    if (!nameInput.value.trim()) {
      toast.show('Por favor, ingresa tu nombre y apellido.', 'error');
      nameInput.focus();
      return;
    }

    if (!phoneInput.value.trim()) {
      toast.show('Por favor, ingresa tu teléfono o celular de contacto.', 'error');
      phoneInput.focus();
      return;
    }

    if (state.orderType === 'delivery') {
      if (!streetInput.value.trim() || !doorInput.value.trim() || !neighborhoodInput.value.trim()) {
        toast.show('Por favor completa los datos de entrega (Calle, Número y Barrio).', 'error');
        streetInput.focus();
        return;
      }
    }

    if (state.paymentMethod === 'cash') {
      const cashVal = parseFloat(cashAmountInput.value) || 0;
      if (cashVal < state.total) {
        toast.show(`Ingresa un monto igual o mayor a ${formatCurrency(state.total)} para calcular el cambio.`, 'error');
        cashAmountInput.focus();
        return;
      }
    }

    syncInputsToStore();
    const finalState = cartStore.getState();

    // Trigger WhatsApp
    sendOrderToWhatsApp(finalState);
    toast.show('¡Redirigiendo a WhatsApp para enviar tu pedido!', 'success', 4000);
    closeModal();
  });

  return {
    open() {
      const state = cartStore.getState();
      nameInput.value = state.customer.name || '';
      phoneInput.value = state.customer.phone || '';
      streetInput.value = state.customer.street || '';
      doorInput.value = state.customer.doorNumber || '';
      aptoInput.value = state.customer.apartment || '';
      neighborhoodInput.value = state.customer.neighborhood || '';
      refInput.value = state.customer.reference || '';

      if (state.orderType === 'pickup') {
        tabPickup.click();
      } else {
        tabDelivery.click();
      }

      if (state.cashAmount) {
        cashAmountInput.value = state.cashAmount;
      } else {
        cashAmountInput.value = '';
      }
      updateCashFeedback();
      renderReview();

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },
    close: closeModal
  };
}
