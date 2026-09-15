// Product Customization Modal
import { formatCurrency } from '../utils/formatters';
import { cartStore } from '../store/cartStore';
import { toast } from './Toast';

export function createProductModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'product-modal-overlay';

  overlay.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true">
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Cerrar modal">✕</button>
      
      <div class="product-modal-image-wrap">
        <img src="" alt="" id="modal-product-img" class="product-modal-img" />
      </div>

      <div class="product-modal-body">
        <div class="modal-header-info">
          <div id="modal-product-tag-wrap"></div>
          <h2 class="modal-title" id="modal-product-name"></h2>
          <p class="modal-desc" id="modal-product-desc"></p>
          <div class="modal-base-price" id="modal-product-base-price"></div>
        </div>

        <!-- Cantidad -->
        <div class="modal-options-section">
          <div class="modal-section-title">
            <span>Cantidad</span>
          </div>
          <div class="quantity-stepper">
            <button class="stepper-btn" id="modal-qty-minus" aria-label="Disminuir cantidad">−</button>
            <span class="stepper-value" id="modal-qty-val">1</span>
            <button class="stepper-btn" id="modal-qty-plus" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>

        <!-- Adicionales -->
        <div class="modal-options-section" id="modal-extras-section">
          <div class="modal-section-title">
            <span>Adicionales</span>
            <span class="hint">Opcional</span>
          </div>
          <div id="modal-extras-list" class="form-grid"></div>
        </div>

        <!-- Ingredientes Removibles -->
        <div class="modal-options-section" id="modal-ingredients-section">
          <div class="modal-section-title">
            <span>Personalizar Ingredientes</span>
            <span class="hint">Desmarca para quitar</span>
          </div>
          <div id="modal-ingredients-list" class="form-grid"></div>
        </div>

        <!-- Observaciones -->
        <div class="modal-options-section">
          <div class="modal-section-title">
            <span>¿Alguna indicación especial?</span>
          </div>
          <textarea 
            class="modal-textarea" 
            id="modal-notes" 
            rows="2" 
            placeholder="Ej: Poco wasabi, salsa teriyaki aparte, sin palitos..."
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-primary modal-submit-btn" id="modal-add-cart-btn">
          <span>Agregar al pedido</span>
          <span id="modal-total-btn-price"></span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // State inside modal
  let currentProduct = null;
  let currentQuantity = 1;
  let selectedExtras = [];
  let removedIngredients = [];

  const imgEl = overlay.querySelector('#modal-product-img');
  const nameEl = overlay.querySelector('#modal-product-name');
  const descEl = overlay.querySelector('#modal-product-desc');
  const basePriceEl = overlay.querySelector('#modal-product-base-price');
  const tagWrap = overlay.querySelector('#modal-product-tag-wrap');
  const qtyVal = overlay.querySelector('#modal-qty-val');
  const qtyMinus = overlay.querySelector('#modal-qty-minus');
  const qtyPlus = overlay.querySelector('#modal-qty-plus');
  const extrasSection = overlay.querySelector('#modal-extras-section');
  const extrasList = overlay.querySelector('#modal-extras-list');
  const ingredientsSection = overlay.querySelector('#modal-ingredients-section');
  const ingredientsList = overlay.querySelector('#modal-ingredients-list');
  const notesInput = overlay.querySelector('#modal-notes');
  const addCartBtn = overlay.querySelector('#modal-add-cart-btn');
  const btnPrice = overlay.querySelector('#modal-total-btn-price');
  const closeBtn = overlay.querySelector('#modal-close-btn');

  function calculateModalTotal() {
    if (!currentProduct) return 0;
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    return (currentProduct.price + extrasTotal) * currentQuantity;
  }

  function updatePriceDisplay() {
    const total = calculateModalTotal();
    btnPrice.textContent = `— ${formatCurrency(total)}`;
    qtyMinus.disabled = currentQuantity <= 1;
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  qtyMinus.addEventListener('click', () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      qtyVal.textContent = currentQuantity;
      updatePriceDisplay();
    }
  });

  qtyPlus.addEventListener('click', () => {
    currentQuantity++;
    qtyVal.textContent = currentQuantity;
    updatePriceDisplay();
  });

  addCartBtn.addEventListener('click', () => {
    if (!currentProduct) return;

    cartStore.addItem(
      currentProduct,
      currentQuantity,
      selectedExtras,
      removedIngredients,
      notesInput.value
    );

    toast.show(`¡${currentProduct.name} agregado al pedido!`, 'success');
    closeModal();
  });

  return {
    open(product, initialConfig = null) {
      currentProduct = product;
      currentQuantity = initialConfig ? initialConfig.quantity : 1;
      selectedExtras = initialConfig ? [...initialConfig.extras] : [];
      removedIngredients = initialConfig ? [...initialConfig.removedIngredients] : [];

      imgEl.src = product.image;
      imgEl.alt = product.name;
      nameEl.textContent = product.name;
      descEl.textContent = product.description;
      basePriceEl.textContent = formatCurrency(product.price);
      qtyVal.textContent = currentQuantity;
      notesInput.value = initialConfig ? initialConfig.notes || '' : '';

      if (product.tag) {
        tagWrap.innerHTML = `<span class="badge badge-recomendado">${product.tag}</span>`;
      } else {
        tagWrap.innerHTML = '';
      }

      // Render Extras
      const extras = product.extras || [];
      if (extras.length > 0) {
        extrasSection.style.display = 'block';
        extrasList.innerHTML = '';
        extras.forEach((extra) => {
          const isChecked = selectedExtras.some((e) => e.id === extra.id);
          const row = document.createElement('div');
          row.className = `option-item-row ${isChecked ? 'selected' : ''}`;
          row.innerHTML = `
            <div class="option-left-content">
              <input 
                type="checkbox" 
                class="option-checkbox" 
                id="opt-${extra.id}" 
                ${isChecked ? 'checked' : ''}
              />
              <label for="opt-${extra.id}" class="option-name">+ ${extra.name}</label>
            </div>
            <div class="option-price">+ ${formatCurrency(extra.price)}</div>
          `;

          const checkbox = row.querySelector('.option-checkbox');
          const toggle = () => {
            checkbox.checked = !checkbox.checked;
            handleToggle();
          };

          const handleToggle = () => {
            if (checkbox.checked) {
              row.classList.add('selected');
              if (!selectedExtras.some((e) => e.id === extra.id)) {
                selectedExtras.push(extra);
              }
            } else {
              row.classList.remove('selected');
              selectedExtras = selectedExtras.filter((e) => e.id !== extra.id);
            }
            updatePriceDisplay();
          };

          row.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
              checkbox.checked = !checkbox.checked;
              handleToggle();
            }
          });

          checkbox.addEventListener('change', handleToggle);
          extrasList.appendChild(row);
        });
      } else {
        extrasSection.style.display = 'none';
      }

      // Render Removable Ingredients
      const removable = product.removableIngredients || product.ingredients || [];
      if (removable.length > 0) {
        ingredientsSection.style.display = 'block';
        ingredientsList.innerHTML = '';

        removable.forEach((ing) => {
          const isRemoved = removedIngredients.includes(ing);
          const row = document.createElement('div');
          row.className = `option-item-row ${isRemoved ? 'strikethrough' : ''}`;
          row.innerHTML = `
            <div class="option-left-content">
              <input 
                type="checkbox" 
                class="option-checkbox" 
                id="ing-${ing}" 
                ${!isRemoved ? 'checked' : ''}
              />
              <label for="ing-${ing}" class="option-name">${ing}</label>
            </div>
            <div class="option-price" style="font-size: 11px; color: var(--color-gray);">
              ${isRemoved ? 'Sin este ingrediente' : 'Incluido'}
            </div>
          `;

          const checkbox = row.querySelector('.option-checkbox');
          const statusText = row.querySelector('.option-price');

          const handleIngToggle = () => {
            if (!checkbox.checked) {
              row.classList.add('strikethrough');
              statusText.textContent = `Sin ${ing}`;
              statusText.style.color = 'var(--color-brand-red)';
              if (!removedIngredients.includes(ing)) {
                removedIngredients.push(ing);
              }
            } else {
              row.classList.remove('strikethrough');
              statusText.textContent = 'Incluido';
              statusText.style.color = 'var(--color-gray)';
              removedIngredients = removedIngredients.filter((r) => r !== ing);
            }
          };

          row.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
              checkbox.checked = !checkbox.checked;
              handleIngToggle();
            }
          });

          checkbox.addEventListener('change', handleIngToggle);
          ingredientsList.appendChild(row);
        });
      } else {
        ingredientsSection.style.display = 'none';
      }

      updatePriceDisplay();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
}
