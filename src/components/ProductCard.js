// Product Card Component (Regular & Featured Variants)
import { formatCurrency } from '../utils/formatters';

function getTagClass(tag) {
  if (!tag) return '';
  const normalized = tag.toLowerCase().replace(/\s+/g, '-');
  switch (normalized) {
    case 'más-pedido':
    case 'mas-pedido':
      return 'badge-mas-pedido';
    case 'nuevo':
      return 'badge-nuevo';
    case 'recomendado':
      return 'badge-recomendado';
    case 'promo':
      return 'badge-promo';
    case 'veggie':
      return 'badge-veggie';
    case 'picante':
      return 'badge-picante';
    default:
      return 'badge-recomendado';
  }
}

export function createProductCard(product, onSelectProduct, isFeatured = false) {
  const card = document.createElement('article');
  card.className = isFeatured ? 'featured-card' : 'product-card';
  card.dataset.productId = product.id;

  const tagHtml = product.tag
    ? `<span class="badge ${getTagClass(product.tag)}">${product.tag}</span>`
    : '';

  if (isFeatured) {
    card.innerHTML = `
      <div class="featured-card-image-wrap">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="featured-card-img" 
          loading="lazy" 
        />
        <div class="featured-card-tag">${tagHtml}</div>
      </div>
      <div class="featured-card-body">
        <h3 class="featured-card-title">${product.name}</h3>
        <p class="featured-card-desc">${product.description}</p>
        <div class="featured-card-footer">
          <div class="product-price">${formatCurrency(product.price)}</div>
          <button class="btn btn-primary product-add-btn" aria-label="Agregar ${product.name}">
            <span>+</span>
            <span>Agregar</span>
          </button>
        </div>
      </div>
    `;
  } else {
    card.innerHTML = `
      <div class="product-card-content">
        ${tagHtml ? `<div class="product-card-tag">${tagHtml}</div>` : ''}
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-desc">${product.description}</p>
        <div class="product-card-footer">
          <div class="product-price">${formatCurrency(product.price)}</div>
          <button class="btn btn-primary product-add-btn" aria-label="Agregar ${product.name}">
            <span>+</span>
            <span>Agregar</span>
          </button>
        </div>
      </div>
      <div class="product-card-image-wrap">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-card-img" 
          loading="lazy" 
        />
      </div>
    `;
  }

  // Click card or add button opens customization modal
  card.addEventListener('click', (e) => {
    e.preventDefault();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  });

  return card;
}
