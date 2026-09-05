/* ==========================================================================
   CEYLONÉA — Reactive Shopping Cart Store
   ========================================================================== */

class CartStore {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('ceylonea_cart')) || [];
    this.listeners = [];
  }

  getCart() {
    return this.cart;
  }

  getItemCount() {
    return this.cart.reduce((total, item) => total + item.qty, 0);
  }

  getSubtotal() {
    return this.cart.reduce((total, item) => total + item.price * item.qty, 0);
  }

  addItem(product, qty = 1) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        subtitle: product.subtitle || '20 Infusion Sticks | Net Wt 40g',
        price: product.price,
        qty: qty,
        image: product.image
      });
    }
    this.saveAndNotify();
  }

  updateQuantity(productId, qty) {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      this.saveAndNotify();
    }
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveAndNotify();
  }

  clearCart() {
    this.cart = [];
    this.saveAndNotify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  saveAndNotify() {
    localStorage.setItem('ceylonea_cart', JSON.stringify(this.cart));
    this.listeners.forEach(listener => listener(this.cart));
  }
}

export const cartStore = new CartStore();
