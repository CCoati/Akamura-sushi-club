// WhatsApp Message Generator
import config from '../data/config.json';
import { formatCurrency } from './formatters';

export function generateWhatsAppMessage(cartState) {
  const { items, orderType, deliveryFee, subtotal, total, customer, paymentMethod, cashAmount, globalNotes } = cartState;

  const lines = [];

  lines.push('🍣 *NUEVO PEDIDO — AKAMARU SUSHI CLUB*');
  lines.push('━━━━━━━━━━━━━━');
  lines.push('🛍️ *PEDIDO*');
  lines.push('');

  items.forEach((item) => {
    lines.push(`${item.quantity}x ${item.name}`);
    if (item.extras && item.extras.length > 0) {
      item.extras.forEach((extra) => {
        lines.push(`   + ${extra.name} (${formatCurrency(extra.price)})`);
      });
    }
    if (item.removedIngredients && item.removedIngredients.length > 0) {
      item.removedIngredients.forEach((rem) => {
        lines.push(`   Sin ${rem}`);
      });
    }
    if (item.notes) {
      lines.push(`   Nota: "${item.notes}"`);
    }
    lines.push('');
  });

  lines.push('━━━━━━━━━━━━━━');
  lines.push('📦 *TIPO DE PEDIDO*');
  if (orderType === 'delivery') {
    lines.push('Delivery (35–60 min)');
    lines.push('');
    lines.push('📍 *DIRECCIÓN DE ENTREGA*');
    lines.push(`Cliente: ${customer.name || 'Sin nombre especificado'}`);
    lines.push(`Teléfono: ${customer.phone || 'Sin teléfono'}`);
    lines.push(`Dirección: ${customer.street || ''} ${customer.doorNumber ? '#' + customer.doorNumber : ''}`);
    if (customer.apartment) lines.push(`Apartamento: ${customer.apartment}`);
    if (customer.neighborhood) lines.push(`Barrio: ${customer.neighborhood}`);
    if (customer.reference) lines.push(`Referencia: ${customer.reference}`);
  } else {
    lines.push('Retiro en el local (20–30 min)');
    lines.push('');
    lines.push('🏪 *DATOS DEL CLIENTE*');
    lines.push(`Cliente: ${customer.name || 'Sin nombre especificado'}`);
    lines.push(`Teléfono: ${customer.phone || 'Sin teléfono'}`);
    lines.push(`Retira en: ${config.restaurant.address}`);
  }

  lines.push('');
  lines.push('💳 *MEDIO DE PAGO*');
  if (paymentMethod === 'cash') {
    const change = Math.max(0, cashAmount - total);
    lines.push('Efectivo');
    lines.push(`Paga con: ${formatCurrency(cashAmount)}`);
    lines.push(`Cambio: ${formatCurrency(change)}`);
  } else if (paymentMethod === 'transfer') {
    lines.push('Transferencia bancaria');
    lines.push(`Banco: ${config.restaurant.bankInfo.bank}`);
    lines.push(`Cuenta: ${config.restaurant.bankInfo.accountNumber}`);
    lines.push(`Alias: ${config.restaurant.bankInfo.alias}`);
    lines.push('(Se adjuntará comprobante a continuación)');
  } else if (paymentMethod === 'mercadopago') {
    lines.push('Mercado Pago');
    if (config.restaurant.mercadoPagoLink) {
      lines.push(`Enlace: ${config.restaurant.mercadoPagoLink}`);
    } else {
      lines.push('(Coordinar link de pago)');
    }
  }

  lines.push('━━━━━━━━━━━━━━');
  lines.push(`💰 Subtotal: ${formatCurrency(subtotal)}`);
  if (orderType === 'delivery') {
    lines.push(`🛵 Envío: ${formatCurrency(deliveryFee)}`);
  } else {
    lines.push('🏪 Envío: $U 0 (Retiro en local)');
  }
  lines.push(`💵 *TOTAL: ${formatCurrency(total)}*`);

  if (globalNotes && globalNotes.trim()) {
    lines.push('━━━━━━━━━━━━━━');
    lines.push('📝 *Observaciones generales:*');
    lines.push(globalNotes.trim());
  }

  lines.push('');
  lines.push('🙏 *¡Muchas gracias por elegir Akamaru Sushi Club!*');

  return lines.join('\n');
}

export function sendOrderToWhatsApp(cartState) {
  const message = generateWhatsAppMessage(cartState);
  const phoneNumber = config.restaurant.whatsappNumber;
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
