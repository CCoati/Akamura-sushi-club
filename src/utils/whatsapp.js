// WhatsApp Message Generator - Formato Profesional de Restaurante
import config from '../data/config.json';
import { formatCurrency } from './formatters';

export function generateWhatsAppMessage(cartState) {
  const { items, orderType, deliveryFee, subtotal, total, customer, paymentMethod, cashAmount, globalNotes } = cartState;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
  const orderId = `AKM-${Math.floor(1000 + Math.random() * 9000)}`;

  const lines = [];

  // Encabezado de Marca
  lines.push('🍣 *AKAMARU SUSHI CLUB*');
  lines.push(`🏮 *Pedido #${orderId}*`);
  lines.push(`📅 ${dateStr} • ${timeStr} hs`);
  lines.push('──────────────────────────────');

  // Detalle del Pedido
  lines.push('🥢 *DETALLE DEL PEDIDO*');
  lines.push('');

  items.forEach((item, index) => {
    const itemTotal = (item.price + (item.extras ? item.extras.reduce((acc, ex) => acc + ex.price, 0) : 0)) * item.quantity;
    lines.push(`*${item.quantity}x ${item.name}* — ${formatCurrency(itemTotal)}`);
    
    if (item.extras && item.extras.length > 0) {
      item.extras.forEach((extra) => {
        lines.push(`   └ ➕ *Extra:* ${extra.name} (+${formatCurrency(extra.price)})`);
      });
    }
    if (item.removedIngredients && item.removedIngredients.length > 0) {
      item.removedIngredients.forEach((rem) => {
        lines.push(`   └ ➖ *Sin:* ${rem}`);
      });
    }
    if (item.notes) {
      lines.push(`   └ 💬 *Nota:* _"${item.notes}"_`);
    }
    lines.push('');
  });

  lines.push('──────────────────────────────');

  // Modalidad y Datos de Entrega
  if (orderType === 'delivery') {
    lines.push('🛵 *MODALIDAD: DELIVERY EXPRESS*');
    lines.push(`⏱️ *Tiempo estimado:* ${config.restaurant.deliveryTime}`);
    lines.push('');
    lines.push('📍 *DATOS DE ENTREGA*');
    lines.push(`👤 *Cliente:* ${customer.name || 'No especificado'}`);
    lines.push(`📱 *Teléfono:* ${customer.phone || 'No especificado'}`);
    lines.push(`🏠 *Dirección:* ${customer.street || ''} ${customer.doorNumber ? '#' + customer.doorNumber : ''}`);
    if (customer.apartment) lines.push(`🏢 *Apto / Piso:* ${customer.apartment}`);
    if (customer.neighborhood) lines.push(`🏙️ *Barrio:* ${customer.neighborhood}`);
    if (customer.reference) lines.push(`🧭 *Referencia:* _${customer.reference}_`);
  } else {
    lines.push('🏪 *MODALIDAD: RETIRO EN LOCAL (Take Away)*');
    lines.push(`⏱️ *Listo en:* ${config.restaurant.pickupTime}`);
    lines.push('');
    lines.push('👤 *DATOS DEL CLIENTE*');
    lines.push(`Cliente: ${customer.name || 'No especificado'}`);
    lines.push(`Teléfono: ${customer.phone || 'No especificado'}`);
    lines.push(`📍 *Dirección de retiro:* ${config.restaurant.address}`);
  }

  lines.push('──────────────────────────────');

  // Medio de Pago
  lines.push('💳 *FORMA DE PAGO*');
  if (paymentMethod === 'cash') {
    const change = Math.max(0, cashAmount - total);
    lines.push('💵 *Efectivo contra entrega*');
    lines.push(`• Paga con: ${formatCurrency(cashAmount)}`);
    lines.push(`• Cambio a recibir: *${formatCurrency(change)}*`);
  } else if (paymentMethod === 'transfer') {
    lines.push('🏦 *Transferencia Bancaria (BROU)*');
    lines.push(`• Banco: ${config.restaurant.bankInfo.bank}`);
    lines.push(`• Cuenta: \`${config.restaurant.bankInfo.accountNumber}\``);
    lines.push(`• Alias: \`${config.restaurant.bankInfo.alias}\``);
    lines.push(`• Titular: ${config.restaurant.bankInfo.holder}`);
    lines.push('📎 _(Enviaré el comprobante por aquí a continuación)_');
  } else if (paymentMethod === 'mercadopago') {
    lines.push('📱 *Mercado Pago*');
    if (config.restaurant.mercadoPagoLink) {
      lines.push(`• Link de pago directo: ${config.restaurant.mercadoPagoLink}`);
    } else {
      lines.push('• _(Por favor enviar link o QR para abonar)_');
    }
  }

  lines.push('──────────────────────────────');

  // Resumen Financiero
  lines.push('🧾 *RESUMEN DE CUENTA*');
  lines.push(`• Subtotal: ${formatCurrency(subtotal)}`);
  if (orderType === 'delivery') {
    lines.push(`• Costo de envío: ${formatCurrency(deliveryFee)}`);
  } else {
    lines.push('• Costo de envío: $U 0 (Retiro en local)');
  }
  lines.push('');
  lines.push(`⭐ *TOTAL A PAGAR: ${formatCurrency(total)}*`);

  // Observaciones Generales
  if (globalNotes && globalNotes.trim()) {
    lines.push('──────────────────────────────');
    lines.push('📝 *OBSERVACIONES GENERALES:*');
    lines.push(`_"${globalNotes.trim()}"_`);
  }

  lines.push('──────────────────────────────');
  lines.push('✨ *¡Muchas gracias por elegir Akamaru!*');
  lines.push('🎌 _赤丸寿司倶楽部 — Tradición japonesa con actitud_');

  return lines.join('\n');
}

export function sendOrderToWhatsApp(cartState) {
  const message = generateWhatsAppMessage(cartState);
  const phoneNumber = config.restaurant.whatsappNumber;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
