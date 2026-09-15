// Featured Section ("Los favoritos de Akamaru")
import { createProductCard } from './ProductCard';

export function renderFeaturedSection(container, products, onSelectProduct) {
  const featuredProducts = products.filter((p) => p.featured === true);

  if (featuredProducts.length === 0) return null;

  const section = document.createElement('section');
  section.className = 'featured-section';
  section.id = 'destacados-section';
  section.dataset.categoryId = 'destacados';

  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <div class="section-title-group">
          <span class="section-subtitle-japanese">
            <span>人気のおすすめ</span>
            <span>•</span>
            <span>Selección Especial</span>
          </span>
          <h2 class="section-title">Los favoritos de Akamaru</h2>
        </div>
      </div>
      <div class="featured-grid" id="featured-products-grid"></div>
    </div>
  `;

  const grid = section.querySelector('#featured-products-grid');
  featuredProducts.forEach((product) => {
    const card = createProductCard(product, onSelectProduct, true);
    grid.appendChild(card);
  });

  container.appendChild(section);
  return section;
}
