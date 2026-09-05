/* ==========================================================================
   CEYLONÉA — Main Application & E-Commerce Controller
   ========================================================================== */

import { cartStore } from './src/store/cartStore.js';

document.addEventListener('DOMContentLoaded', () => {
  // Product Catalog Data
  const defaultProduct = {
    id: 'ceylonea-infusion-sticks',
    name: 'CEYLONÉA Ceylon Cinnamon Infusion Sticks',
    subtitle: '20 Infusion Sticks | Net Wt 40g',
    price: 4800,
    image: './assets/ceylonea_product_box.jpg'
  };

  let selectedQty = 1;

  // DOM Elements
  const cartBadge = document.getElementById('cart-count');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');

  // Checkout Elements
  const openCheckoutBtn = document.getElementById('open-checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutFormView = document.getElementById('checkout-form-view');
  const orderConfirmationView = document.getElementById('order-confirmation-view');
  const checkoutSummaryItems = document.getElementById('checkout-summary-items');
  const coSubtotal = document.getElementById('co-subtotal');
  const coTotal = document.getElementById('co-total');
  const finishCheckoutBtn = document.getElementById('finish-checkout-btn');
  const confirmedOrderId = document.getElementById('confirmed-order-id');

  // Product Controls
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyValDisplay = document.getElementById('product-qty-val');
  const btnAddToCart = document.getElementById('btn-add-to-cart');
  const btnBuyNow = document.getElementById('btn-buy-now');

  // Header Scroll Effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 1. Quantity Selector Handlers
  if (qtyMinus && qtyPlus && qtyValDisplay) {
    qtyMinus.addEventListener('click', () => {
      if (selectedQty > 1) {
        selectedQty--;
        qtyValDisplay.textContent = selectedQty;
      }
    });

    qtyPlus.addEventListener('click', () => {
      selectedQty++;
      qtyValDisplay.textContent = selectedQty;
    });
  }

  // 2. Cart UI Renderer
  function renderCart(cartItems) {
    // Update count badge
    const totalCount = cartStore.getItemCount();
    if (cartBadge) cartBadge.textContent = totalCount;

    // Update Subtotal
    const subtotal = cartStore.getSubtotal();
    const formattedSubtotal = `LKR ${subtotal.toLocaleString()}`;
    if (cartSubtotalVal) cartSubtotalVal.textContent = formattedSubtotal;
    if (coSubtotal) coSubtotal.textContent = formattedSubtotal;
    if (coTotal) coTotal.textContent = formattedSubtotal;

    // Render Drawer Items
    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; color: var(--color-ivory-dark); margin-top: 3rem; font-family: var(--font-serif); font-size: 1.2rem;">
          Your bag is currently empty.
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.image}" class="cart-item-img" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-ivory-dark); margin-bottom: 0.3rem;">${item.subtitle}</div>
            <div class="cart-item-price">LKR ${item.price.toLocaleString()} × ${item.qty}</div>
            <button class="cart-item-remove" data-id="${item.id}">REMOVE</button>
          </div>
        </div>
      `).join('');

      // Add remove listeners
      cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          cartStore.removeItem(id);
        });
      });
    }

    // Render Checkout Summary Items
    if (checkoutSummaryItems) {
      checkoutSummaryItems.innerHTML = cartItems.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.8rem; color: var(--color-ivory);">
          <div>
            <div style="font-weight: 500;">${item.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-ivory-dark);">Qty: ${item.qty}</div>
          </div>
          <div style="color: var(--color-gold);">LKR ${(item.price * item.qty).toLocaleString()}</div>
        </div>
      `).join('');
    }
  }

  // Subscribe cartStore to UI renderer
  cartStore.subscribe(renderCart);
  renderCart(cartStore.getCart());

  // 3. Cart Drawer Toggle Handlers
  function openDrawer() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  }

  function closeDrawer() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);

  document.getElementById('ft-open-cart')?.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });

  // 4. Add to Cart Handler
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      cartStore.addItem(defaultProduct, selectedQty);
      openDrawer();
    });
  }

  // 5. Buy Now Handler
  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      cartStore.addItem(defaultProduct, selectedQty);
      openCheckoutModal();
    });
  }

  // 6. Checkout Modal Handlers
  function openCheckoutModal() {
    closeDrawer();
    if (checkoutModal) {
      checkoutFormView.style.display = 'block';
      orderConfirmationView.style.display = 'none';
      checkoutModal.classList.add('active');
    }
  }

  function closeCheckoutModal() {
    if (checkoutModal) checkoutModal.classList.remove('active');
  }

  if (openCheckoutBtn) openCheckoutBtn.addEventListener('click', openCheckoutModal);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);

  document.getElementById('ft-checkout')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCheckoutModal();
  });

  // 7. Simulated Order Form Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Generate random order ref number
      const randomRef = 'CEY-' + Math.floor(100000 + Math.random() * 900000);
      if (confirmedOrderId) confirmedOrderId.textContent = randomRef;

      // Show confirmation view
      checkoutFormView.style.display = 'none';
      orderConfirmationView.style.display = 'block';

      // Clear cart
      cartStore.clearCart();
    });
  }

  if (finishCheckoutBtn) {
    finishCheckoutBtn.addEventListener('click', () => {
      closeCheckoutModal();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
