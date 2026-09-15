// Hero Component - Rediseño UX/UI Profesional
import config from '../data/config.json';

export function renderHero(container, onOpenMenu, onStartOrder) {
  const section = document.createElement('section');
  section.className = 'hero';
  section.id = 'hero-section';

  section.innerHTML = `
    <div class="container">
      <div class="hero-card">
        <!-- Fondo ambiental y kanji decorativo -->
        <div class="hero-background-art"></div>
        <div class="hero-glow-orb hero-glow-orb-1"></div>
        <div class="hero-glow-orb hero-glow-orb-2"></div>
        <div class="hero-kanji-watermark" aria-hidden="true">赤丸寿司</div>

        <!-- Columna de contenido / Copywriting & Conversión -->
        <div class="hero-content">
          <!-- Live Status & Sub-brand -->
          <div class="hero-meta-row">
            <div class="hero-live-badge">
              <span class="live-dot" aria-hidden="true"></span>
              <span>Cocina abierta • Envíos en vivo</span>
            </div>
            <div class="hero-top-badge">
              <span class="kanji">赤丸</span>
              <span>Contemporary Sushi Club</span>
            </div>
          </div>

          <!-- Título de Alto Impacto -->
          <h1 class="hero-title">
            SUSHI CON ACTITUD,<br />
            <span class="hero-title-accent">TRADICIÓN & ARTE</span>
          </h1>

          <!-- Propuesta de Valor -->
          <p class="hero-subtitle">
            Salmón fresco de corte diario, rolls de autor y texturas crocantes al momento. Viví una experiencia gastronómica japonesa contemporánea en Montevideo.
          </p>

          <!-- Social Proof & Confianza -->
          <div class="hero-trust-bar">
            <div class="hero-rating-stars">
              <div class="stars-group" aria-label="Calificación 4.9 de 5 estrellas">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span class="rating-val">4.9</span>
              <span class="rating-reviews">(+1.400 clientes felices)</span>
            </div>
            <div class="trust-divider" aria-hidden="true"></div>
            <div class="hero-guarantee-tag">
              <span class="guarantee-icon">🛡️</span>
              <span>Garantía de frescura & cadena de frío</span>
            </div>
          </div>

          <!-- Quick Service Info Pills -->
          <div class="hero-pills">
            <div class="hero-pill-item">
              <span class="pill-icon">🛵</span>
              <div class="pill-text">
                <span class="pill-title">Delivery Express</span>
                <span class="pill-desc">${config.restaurant.deliveryTime}</span>
              </div>
            </div>
            <div class="hero-pill-item">
              <span class="pill-icon">🏪</span>
              <div class="pill-text">
                <span class="pill-title">Take Away</span>
                <span class="pill-desc">Listo en ${config.restaurant.pickupTime}</span>
              </div>
            </div>
            <div class="hero-pill-item">
              <span class="pill-icon">📍</span>
              <div class="pill-text">
                <span class="pill-title">Ubicación</span>
                <span class="pill-desc">${config.restaurant.location}</span>
              </div>
            </div>
          </div>

          <!-- CTAs de Conversión Primaria y Secundaria -->
          <div class="hero-actions">
            <a href="#menu-catalog" class="btn btn-hero-primary" id="hero-btn-menu">
              <span class="btn-icon">🥢</span>
              <span>EXPLORAR MENÚ COMPLETO</span>
              <span class="btn-arrow" aria-hidden="true">↓</span>
            </a>
            <button class="btn btn-hero-secondary" id="hero-btn-order">
              <span class="btn-icon">🛍️</span>
              <span>PEDIR AHORA</span>
            </button>
          </div>
        </div>

        <!-- Columna Visual / Showcase Multi-Capa con Plato Insignia y Badges -->
        <div class="hero-image-wrapper">
          <div class="hero-showcase-card">
            <!-- Badge Flotante Superior: Más Pedido -->
            <div class="hero-floating-badge badge-top-highlight">
              <div class="badge-icon-wrap badge-flame">🔥</div>
              <div class="badge-text-wrap">
                <span class="badge-tag">Plato Estrella</span>
                <span class="badge-headline">Akamaru Special Roll (10 pcs)</span>
              </div>
            </div>

            <!-- Marco de la Fotografía Principal -->
            <div class="hero-image-frame">
              <img 
                src="/images/salmon_akamaru_roll.jpg" 
                alt="Akamaru Roll Especial con Salmón Fresco y Palta" 
                class="hero-img"
                id="hero-main-showcase-img"
                loading="eager"
              />
              <div class="hero-image-gradient-overlay"></div>
            </div>

            <!-- Badge Flotante Inferior: Garantía de Calidad y Salmón Fresco -->
            <div class="hero-floating-badge badge-bottom-highlight">
              <div class="badge-icon-wrap badge-salmon">🍣</div>
              <div class="badge-text-wrap">
                <div class="badge-headline">Salmón Calidad Premium</div>
                <div class="badge-desc">Cortes frescos y sashimis del día</div>
              </div>
              <span class="badge-pill-accent">TOP QUALITY</span>
            </div>

            <!-- Mini Selector de Platos para Interactividad -->
            <div class="hero-dish-selector" aria-label="Cambiar plato destacado">
              <button 
                class="hero-dish-thumb active" 
                data-img="/images/salmon_akamaru_roll.jpg" 
                data-name="Akamaru Special Roll (10 pcs)" 
                data-tag="Plato Estrella"
                title="Akamaru Roll"
              >
                <img src="/images/salmon_akamaru_roll.jpg" alt="Akamaru Roll" />
              </button>
              <button 
                class="hero-dish-thumb" 
                data-img="/images/combo_box_sushi.jpg" 
                data-name="Akamaru Box Premium (30 pcs)" 
                data-tag="El Favorito para Compartir"
                title="Combo Box"
              >
                <img src="/images/combo_box_sushi.jpg" alt="Combo Box" />
              </button>
              <button 
                class="hero-dish-thumb" 
                data-img="/images/crispy_hot_roll.jpg" 
                data-name="Hot Crispy Roll Panko Crocante" 
                data-tag="Sensación Caliente"
                title="Hot Rolls"
              >
                <img src="/images/crispy_hot_roll.jpg" alt="Hot Roll" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach interactive events
  const menuBtn = section.querySelector('#hero-btn-menu');
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (onOpenMenu) {
        onOpenMenu();
      } else {
        const menuEl = document.getElementById('menu-catalog');
        if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const orderBtn = section.querySelector('#hero-btn-order');
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      if (onStartOrder) onStartOrder();
    });
  }

  // Dish Switcher Logic
  const mainImg = section.querySelector('#hero-main-showcase-img');
  const headlineEl = section.querySelector('.badge-top-highlight .badge-headline');
  const tagEl = section.querySelector('.badge-top-highlight .badge-tag');
  const dishThumbs = section.querySelectorAll('.hero-dish-thumb');

  dishThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      dishThumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.dataset.img;
      const newName = thumb.dataset.name;
      const newTag = thumb.dataset.tag;

      if (mainImg && newSrc) {
        mainImg.style.opacity = '0.3';
        mainImg.style.transform = 'scale(0.96)';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1)';
        }, 150);
      }

      if (headlineEl && newName) headlineEl.textContent = newName;
      if (tagEl && newTag) tagEl.textContent = newTag;
    });
  });

  container.appendChild(section);
}
