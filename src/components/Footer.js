// Footer & Contact Component
import config from '../data/config.json';

export function renderFooter(container) {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.id = 'contacto-section';

  footer.innerHTML = `
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand-wrap" id="nosotros-section">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/logo.png" alt="Akamaru Sushi Club" class="footer-logo" />
            <div>
              <div class="footer-brand-title">AKAMARU 赤丸</div>
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: var(--color-brand-red);">SUSHI CLUB</div>
            </div>
          </div>
          <p class="footer-brand-desc">
            Sushi contemporáneo con actitud. Fusionamos técnicas maestras del sushi japonés con la energía del streetwear y la cultura pop de Tokio en Uruguay.
          </p>
          <div style="display: flex; gap: 8px;">
            <span class="hanko-stamp">URUGUAY</span>
            <span class="hanko-stamp">FRESH SALMON</span>
          </div>
        </div>

        <div>
          <h4 class="footer-col-title">Atención & Pedidos</h4>
          <ul class="footer-list">
            <li>📍 <strong>Local:</strong> ${config.restaurant.address}</li>
            <li>🛵 <strong>Delivery:</strong> Pocitos, Punta Carretas, Centro y zonas aledañas</li>
            <li>⏰ <strong>Horarios:</strong> ${config.restaurant.schedule}</li>
            <li>📱 <strong>WhatsApp:</strong> ${config.restaurant.phoneDisplay}</li>
            <li>📸 <strong>Instagram:</strong> ${config.restaurant.instagram}</li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-title">Medios de Pago</h4>
          <ul class="footer-list">
            <li>💵 Efectivo al recibir (con cambio exacto)</li>
            <li>🏦 Transferencia bancaria (BROU / Santander)</li>
            <li>💳 Mercado Pago (QR, crédito y débito)</li>
            <li style="margin-top: 10px;">
              <span class="badge badge-mas-pedido">100% Pedidos por WhatsApp</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>
          © ${new Date().getFullYear()} AKAMARU SUSHI CLUB. Todos los derechos reservados.
        </div>
        <div>
          Hecho con pasión por el buen sushi • Montevideo, Uruguay
        </div>
      </div>
    </div>
  `;

  container.appendChild(footer);
}
