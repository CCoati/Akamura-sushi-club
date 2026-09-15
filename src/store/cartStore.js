// Cart Store with localStorage persistence and pub/sub reactivity
import config from '../data/config.json';

const STORAGE_KEY = 'akamaru_cart_v1';

class CartStore {
  constructor() {
    this.items = [];
    this.orderType = 'delivery'; // 'delivery' | 'pickup'
    this.deliveryFee = config.restaurant.deliveryFee || 120;
    this.customer = {
      name: '',
      phone: '',
      street: '',
      doorNumber: '',
      apartment: '',
      neighborhood: '',
      reference: ''
    };
    this.paymentMethod = 'cash'; // 'cash' | 'transfer' | 'mercadopago'
    this.cashAmount = 0;
    this.globalNotes = '';
    this.listeners = new Set();

    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed.items)) {
          this.items = parsed.items;
        }
        if (parsed.orderType) this.orderType = parsed.orderType;
        if (parsed.customer) this.customer = { ...this.customer, ...parsed.customer };
        if (parsed.paymentMethod) this.paymentMethod = parsed.paymentMethod;
        if (parsed.cashAmount) this.cashAmount = parsed.cashAmount;
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: this.items,
          orderType: this.orderType,
          customer: this.customer,
          paymentMethod: this.paymentMethod,
          cashAmount: this.cashAmount
        })
      );
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getState());
      } catch (e) {
        console.error('Error notifying cart listener', e);
      }
    });
  }

  getState() {
    const subtotal = this.calculateSubtotal();
    const currentDeliveryFee = this.orderType === 'delivery' ? this.deliveryFee : 0;
    const total = subtotal + currentDeliveryFee;
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: [...this.items],
      orderType: this.orderType,
      deliveryFee: currentDeliveryFee,
      baseDeliveryFee: this.deliveryFee,
      subtotal,
      total,
      itemCount,
      customer: { ...this.customer },
      paymentMethod: this.paymentMethod,
      cashAmount: this.cashAmount,
      globalNotes: this.globalNotes
    };
  }

  generateCartItemId(productId, extras = [], removedIngredients = [], notes = '') {
    const extrasKey = extras
      .map((e) => e.id)
      .sort()
      .join(',');
    const removedKey = [...removedIngredients].sort().join(',');
    const notesKey = notes.trim().toLowerCase();
    return `${productId}_[${extrasKey}]_[${removedKey}]_[${notesKey}]`;
  }

  addItem(product, quantity = 1, extras = [], removedIngredients = [], notes = '') {
    const cartItemId = this.generateCartItemId(product.id, extras, removedIngredients, notes);
    const extrasTotal = extras.reduce((sum, e) => sum + (e.price || 0), 0);
    const unitPrice = product.price + extrasTotal;

    const existingIndex = this.items.findIndex((item) => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
      this.items[existingIndex].itemTotal = this.items[existingIndex].quantity * this.items[existingIndex].unitPrice;
    } else {
      this.items.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        basePrice: product.price,
        unitPrice,
        quantity,
        extras: [...extras],
        removedIngredients: [...removedIngredients],
        notes: notes.trim(),
        itemTotal: unitPrice * quantity
      });
    }

    this.saveToStorage();
  }

  updateQuantity(cartItemId, delta) {
    const itemIndex = this.items.findIndex((item) => item.cartItemId === cartItemId);
    if (itemIndex === -1) return;

    const newQty = this.items[itemIndex].quantity + delta;
    if (newQty <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = newQty;
      this.items[itemIndex].itemTotal = newQty * this.items[itemIndex].unitPrice;
    }

    this.saveToStorage();
  }

  removeItem(cartItemId) {
    this.items = this.items.filter((item) => item.cartItemId !== cartItemId);
    this.saveToStorage();
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
  }

  setOrderType(type) {
    if (type === 'delivery' || type === 'pickup') {
      this.orderType = type;
      this.saveToStorage();
    }
  }

  setCustomerData(data) {
    this.customer = { ...this.customer, ...data };
    this.saveToStorage();
  }

  setPaymentMethod(method) {
    this.paymentMethod = method;
    this.saveToStorage();
  }

  setCashAmount(amount) {
    this.cashAmount = Number(amount) || 0;
    this.saveToStorage();
  }

  setGlobalNotes(notes) {
    this.globalNotes = notes;
    this.saveToStorage();
  }
}

export const cartStore = new CartStore();
