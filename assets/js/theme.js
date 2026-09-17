/**
 * NOËL & CO. - FULL MULTI-PAGE & RESPONSIVE INTERACTION ENGINE
 * Standard Shopify UX Patterns (Prestige & Dawn Compatible)
 */

(function () {
  'use strict';

  // --- GLOBAL STATE ---
  const STATE = {
    currency: localStorage.getItem('noel_currency') || 'USD',
    currencySymbol: '$',
    freeShippingThreshold: { USD: 75, EUR: 70 },
    giftWrapPrice: { USD: 4.99, EUR: 4.50 },
    cart: JSON.parse(localStorage.getItem('noel_cart') || '[]'),
    giftWrapSelected: JSON.parse(localStorage.getItem('noel_gift_wrap') || 'false'),
    appliedDiscount: JSON.parse(localStorage.getItem('noel_discount') || 'null'), // e.g. { code: 'XMAS15', percent: 15 }
    activeFilter: 'all',
    snowEnabled: localStorage.getItem('noel_snow') !== 'false'
  };

  // --- INITIALIZATION ON LOAD ---
  document.addEventListener('DOMContentLoaded', () => {
    initCurrency();
    initSnowfall();
    initMobileNav();
    initCartDrawer();
    initHeaderScroll();
    initAnnouncementSlider();
    initCountdown();
    initAccordions();

    // Check which page we are on
    const path = window.location.pathname.toLowerCase();
    if (path.includes('product.html') || document.getElementById('pdp-container')) {
      initProductDetailPage();
    } else if (path.includes('collections.html') || document.getElementById('catalog-products-grid')) {
      initCollectionsPage();
    } else if (path.includes('cart.html') || document.getElementById('cart-page-items')) {
      initCartPage();
    } else if (path.includes('checkout.html') || document.getElementById('checkout-order-items')) {
      initCheckoutPage();
    } else if (path.includes('gift-guide.html') || document.getElementById('gift-guide-grid')) {
      initGiftGuidePage();
    } else {
      // Default homepage
      renderProducts();
      renderBundles();
      initFilterTabs();
      initQuickViewModal();
      initShoppableHotspots();
      initGiftMatchmaker();
      initFlashDealCountdown();
      updateSpendSaveLadder();
    }

    initLiveSalesToasts();
    updateGlobalCartCounters();
  });

  // ==========================================================================
  // 1. CURRENCY MANAGEMENT (USD / EUR)
  // ==========================================================================
  function initCurrency() {
    const selects = document.querySelectorAll('#currency-select, #mobile-currency-select');
    updateCurrencySymbol();

    selects.forEach(select => {
      if (!select) return;
      select.value = STATE.currency;
      select.addEventListener('change', (e) => {
        STATE.currency = e.target.value;
        localStorage.setItem('noel_currency', STATE.currency);
        updateCurrencySymbol();

        // Refresh all selects
        selects.forEach(s => { s.value = STATE.currency; });

        // Re-render current page elements
        const path = window.location.pathname.toLowerCase();
        if (path.includes('product.html') || document.getElementById('pdp-container')) {
          initProductDetailPage();
        } else if (path.includes('collections.html')) {
          initCollectionsPage();
        } else if (path.includes('cart.html')) {
          renderCartPage();
        } else if (path.includes('checkout.html')) {
          renderCheckoutSummary();
        } else if (path.includes('gift-guide.html')) {
          initGiftGuidePage();
        } else {
          renderProducts();
          renderBundles();
        }

        updateCartUI();
        showToast(`Switched market to ${STATE.currency} (${STATE.currencySymbol})`);
      });
    });
  }

  function updateCurrencySymbol() {
    STATE.currencySymbol = STATE.currency === 'EUR' ? '€' : '$';
  }

  function formatPrice(amountUSD, amountEUR) {
    const val = STATE.currency === 'EUR' ? amountEUR : amountUSD;
    return `${STATE.currencySymbol}${val.toFixed(2)}`;
  }

  // ==========================================================================
  // 2. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  function initMobileNav() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-mobile-nav-btn');
    const overlay = document.getElementById('mobile-nav-overlay');
    const drawer = document.getElementById('mobile-nav-drawer');

    function openMobileNav() {
      if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeMobileNav() {
      if (drawer && overlay) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
    if (overlay) overlay.addEventListener('click', closeMobileNav);
  }

  // ==========================================================================
  // 3. SNOWFALL CANVAS ANIMATION
  // ==========================================================================
  function initSnowfall() {
    const canvas = document.getElementById('snow-canvas');
    const toggleBtn = document.getElementById('snow-toggle');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const flakeCount = Math.min(width < 768 ? 35 : 70, 80);
    const flakes = [];

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.8 + 1,
        d: Math.random() * flakeCount,
        speed: Math.random() * 0.7 + 0.4,
        opacity: Math.random() * 0.6 + 0.3
      });
    }

    let angle = 0;
    function drawSnow() {
      if (!STATE.snowEnabled) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();

      angle += 0.01;
      for (let i = 0; i < flakeCount; i++) {
        const f = flakes[i];
        f.y += f.speed;
        f.x += Math.sin(angle + f.d) * 0.5;

        if (f.y > height) {
          flakes[i] = {
            x: Math.random() * width,
            y: -10,
            r: f.r,
            d: f.d,
            speed: f.speed,
            opacity: f.opacity
          };
        }

        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      requestAnimationFrame(drawSnow);
    }

    if (!STATE.snowEnabled) {
      document.body.classList.add('snow-disabled');
      if (toggleBtn) toggleBtn.innerHTML = '❄️ Snow: OFF';
    } else {
      requestAnimationFrame(drawSnow);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        STATE.snowEnabled = !STATE.snowEnabled;
        localStorage.setItem('noel_snow', STATE.snowEnabled);
        if (STATE.snowEnabled) {
          document.body.classList.remove('snow-disabled');
          toggleBtn.innerHTML = '❄️ Snow: ON';
          requestAnimationFrame(drawSnow);
        } else {
          document.body.classList.add('snow-disabled');
          toggleBtn.innerHTML = '❄️ Snow: OFF';
        }
      });
    }
  }

  // ==========================================================================
  // 4. SHIPPING CUTOFF COUNTDOWN
  // ==========================================================================
  function initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    if (!daysEl) return;

    const now = new Date();
    let currentYear = now.getFullYear();
    let target = new Date(`December 18, ${currentYear} 23:59:59 GMT-0500`);

    if (now > target) {
      target = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000);
    }

    function updateTimer() {
      const currentTime = new Date().getTime();
      const diff = target - currentTime;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ==========================================================================
  // 5. ACCORDIONS LOGIC (For PDP & FAQ)
  // ==========================================================================
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        if (item) {
          item.classList.toggle('open');
        }
      });
    });
  }

  // ==========================================================================
  // 6. GLOBAL CART COUNTERS & PERSISTENCE
  // ==========================================================================
  function updateGlobalCartCounters() {
    const totalCount = STATE.cart.reduce((sum, it) => sum + it.quantity, 0);
    document.querySelectorAll('#cart-counter, #bottom-cart-badge').forEach(el => {
      if (el) el.textContent = totalCount;
    });
  }

  function saveCart() {
    localStorage.setItem('noel_cart', JSON.stringify(STATE.cart));
    updateGlobalCartCounters();
  }

  // ==========================================================================
  // 7. CART DRAWER (Global)
  // ==========================================================================
  function initCartDrawer() {
    const cartToggles = document.querySelectorAll('#cart-toggle-btn, #bottom-cart-toggle');
    const closeBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('cart-drawer-overlay');
    const giftWrapCheck = document.getElementById('gift-wrap-checkbox');
    const checkoutBtn = document.getElementById('btn-checkout');

    cartToggles.forEach(btn => {
      if (btn) btn.addEventListener('click', openCart);
    });
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    if (giftWrapCheck) {
      giftWrapCheck.checked = STATE.giftWrapSelected;
      giftWrapCheck.addEventListener('change', (e) => {
        STATE.giftWrapSelected = e.target.checked;
        localStorage.setItem('noel_gift_wrap', STATE.giftWrapSelected);
        updateCartUI();
        if (document.getElementById('cart-page-items')) renderCartPage();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
      });
    }

    updateCartUI();
  }

  function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function addToCart(productId, qty = 1) {
    if (typeof CHRISTMAS_PRODUCTS === 'undefined') return;
    const product = CHRISTMAS_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = STATE.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      STATE.cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        priceUSD: product.priceUSD,
        priceEUR: product.priceEUR,
        quantity: qty
      });
    }

    saveCart();
    updateCartUI();
    if (document.getElementById('cart-page-items')) renderCartPage();
    openCart();
    showToast(`Added "${product.name}" to bag! 🎄`);
  }

  function updateQuantity(productId, delta) {
    const item = STATE.cart.find(it => it.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      STATE.cart = STATE.cart.filter(it => it.id !== productId);
    }

    saveCart();
    updateCartUI();
    if (document.getElementById('cart-page-items')) renderCartPage();
    if (document.getElementById('checkout-order-items')) renderCheckoutSummary();
  }

  function removeItem(productId) {
    STATE.cart = STATE.cart.filter(it => it.id !== productId);
    saveCart();
    updateCartUI();
    if (document.getElementById('cart-page-items')) renderCartPage();
    if (document.getElementById('checkout-order-items')) renderCheckoutSummary();
    showToast('Item removed from holiday bag.');
  }

  function updateCartUI() {
    const itemsList = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const shippingBarTrack = document.getElementById('shipping-progress-fill');
    const shippingBarText = document.getElementById('shipping-bar-msg');
    const giftWrapPriceLabel = document.getElementById('gift-wrap-price-label');

    updateGlobalCartCounters();
    updateSpendSaveLadder();

    let subtotal = STATE.cart.reduce((sum, it) => {
      const p = STATE.currency === 'EUR' ? it.priceEUR : it.priceUSD;
      return sum + p * it.quantity;
    }, 0);

    const giftWrapCost = STATE.currency === 'EUR' ? STATE.giftWrapPrice.EUR : STATE.giftWrapPrice.USD;
    if (giftWrapPriceLabel) {
      giftWrapPriceLabel.textContent = `+${STATE.currencySymbol}${giftWrapCost.toFixed(2)}`;
    }

    if (STATE.giftWrapSelected && STATE.cart.length > 0) {
      subtotal += giftWrapCost;
    }

    // Active coupon discount calculation
    let couponDiscount = 0;
    const savedCoupon = localStorage.getItem('noel_active_coupon');
    let couponData = null;
    if (savedCoupon && STATE.cart.length > 0) {
      try {
        couponData = JSON.parse(savedCoupon);
        if (couponData.isFixed) {
          couponDiscount = STATE.currency === 'EUR' ? (couponData.discountVal * 0.9) : couponData.discountVal;
        } else {
          couponDiscount = subtotal * (couponData.discountVal / 100);
        }
        subtotal = Math.max(subtotal - couponDiscount, 0);
      } catch (e) {}
    }

    if (subtotalEl) {
      subtotalEl.textContent = `${STATE.currencySymbol}${subtotal.toFixed(2)}`;
    }

    // Free shipping progress calculation
    const threshold = STATE.currency === 'EUR' ? STATE.freeShippingThreshold.EUR : STATE.freeShippingThreshold.USD;
    if (shippingBarTrack && shippingBarText) {
      if (subtotal >= threshold) {
        shippingBarTrack.style.width = '100%';
        shippingBarText.innerHTML = `🎉 <strong>Congratulations!</strong> You have unlocked <strong>Free Holiday Shipping!</strong>`;
      } else {
        const remaining = (threshold - subtotal).toFixed(2);
        const percentage = Math.min((subtotal / threshold) * 100, 100);
        shippingBarTrack.style.width = `${percentage}%`;
        shippingBarText.innerHTML = `You are only <strong>${STATE.currencySymbol}${remaining}</strong> away from <strong>Free Shipping!</strong>`;
      }
    }

    if (!itemsList || !emptyState) return;

    if (STATE.cart.length === 0) {
      emptyState.style.display = 'block';
      itemsList.style.display = 'none';
      if (document.getElementById('cart-footer-box')) {
        document.getElementById('cart-footer-box').style.display = 'none';
      }
    } else {
      emptyState.style.display = 'none';
      itemsList.style.display = 'block';
      if (document.getElementById('cart-footer-box')) {
        document.getElementById('cart-footer-box').style.display = 'block';
      }

      itemsList.innerHTML = STATE.cart.map(item => {
        const unitPrice = STATE.currency === 'EUR' ? item.priceEUR : item.priceUSD;
        const lineTotal = unitPrice * item.quantity;

        return `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.name}</h4>
              <span class="cart-item-price">${STATE.currencySymbol}${lineTotal.toFixed(2)}</span>
              <div class="cart-item-quantity">
                <button class="qty-btn" onclick="window.NoelApp.updateQty('${item.id}', -1)">-</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn" onclick="window.NoelApp.updateQty('${item.id}', 1)">+</button>
              </div>
              <button class="btn-remove-item" onclick="window.NoelApp.removeItem('${item.id}')" title="Remove">✕</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // ==========================================================================
  // 8. PRODUCT DETAIL PAGE (PDP) LOGIC
  // ==========================================================================
  function initProductDetailPage() {
    if (typeof CHRISTMAS_PRODUCTS === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id') || 'prod-candle';
    const product = CHRISTMAS_PRODUCTS.find(p => p.id === prodId) || CHRISTMAS_PRODUCTS[0];

    const container = document.getElementById('pdp-container');
    if (!container) return;

    const priceNow = formatPrice(product.priceUSD, product.priceEUR);
    const priceWas = formatPrice(product.originalPriceUSD, product.originalPriceEUR);

    // Complementary product for Frequently Bought Together
    const complementProduct = CHRISTMAS_PRODUCTS.find(p => p.id !== product.id) || CHRISTMAS_PRODUCTS[1];
    const compPriceNow = formatPrice(complementProduct.priceUSD, complementProduct.priceEUR);

    // Bundle pricing (-15% bundle discount)
    const rawSumUSD = (product.priceUSD + complementProduct.priceUSD) * 0.85;
    const rawSumEUR = (product.priceEUR + complementProduct.priceEUR) * 0.85;
    const bundlePriceFormatted = formatPrice(rawSumUSD, rawSumEUR);
    const bundleOriginalSum = formatPrice(product.priceUSD + complementProduct.priceUSD, product.priceEUR + complementProduct.priceEUR);

    // Related items
    const relatedItems = CHRISTMAS_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

    container.innerHTML = `
      <div class="breadcrumbs" style="justify-content: flex-start; margin-bottom: 24px;">
        <a href="index.html">Home</a> <span>/</span>
        <a href="collections.html">Holiday Catalog</a> <span>/</span>
        <span style="color: var(--color-primary-forest); font-weight: 600;">${product.name}</span>
      </div>

      <div class="pdp-layout">
        <!-- Gallery -->
        <div class="pdp-gallery">
          <div class="pdp-main-image">
            <img id="pdp-active-img" src="${product.image}" alt="${product.name}">
          </div>
          <div class="pdp-thumbs">
            <div class="pdp-thumb-item active" onclick="window.NoelApp.setPDPImage('${product.image}', this)">
              <img src="${product.image}" alt="View 1">
            </div>
            <div class="pdp-thumb-item" onclick="window.NoelApp.setPDPImage('${product.secondaryImage}', this)">
              <img src="${product.secondaryImage}" alt="View 2">
            </div>
          </div>

          <!-- Left Column Artisan Highlights & Guarantees (Eliminates Empty Space) -->
          <div class="pdp-gallery-highlights">
            <div class="gallery-highlights-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              <span>Artisanal Craftsmanship & Highlights</span>
            </div>
            <ul class="gallery-highlights-list">
              ${(product.features || [
                "100% Natural Organic Materials",
                "Handcrafted in Small Artisan Batches",
                "Deluxe Presentation Keepsake Packaging",
                "Passed Down Family Heirloom Quality"
              ]).map(f => `
                <li class="gallery-highlight-item">
                  <span class="highlight-check">✓</span>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="pdp-gallery-guarantee">
            <div class="gallery-guarantee-grid">
              <div class="guarantee-badge-item">
                <div class="guarantee-icon">🎁</div>
                <div class="guarantee-text">
                  <strong>Signature Gift Box</strong>
                  <span>Ribbon & card ready</span>
                </div>
              </div>
              <div class="guarantee-badge-item">
                <div class="guarantee-icon">🚚</div>
                <div class="guarantee-text">
                  <strong>Pre-Dec 24 Express</strong>
                  <span>Guaranteed delivery</span>
                </div>
              </div>
              <div class="guarantee-badge-item">
                <div class="guarantee-icon">🛡️</div>
                <div class="guarantee-text">
                  <strong>Extended Returns</strong>
                  <span>Until Jan 31, 2025</span>
                </div>
              </div>
              <div class="guarantee-badge-item">
                <div class="guarantee-icon">✨</div>
                <div class="guarantee-text">
                  <strong>Artisan Guarantee</strong>
                  <span>100% Happiness pledge</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pdp-gallery-quote">
            <div class="quote-stars">★★★★★</div>
            <p class="quote-text">“${product.id === 'prod-candle' ? 'The fragrance filled our living room before we even lit it! The embossed emerald jar looks like an antique family treasure.' : product.id === 'prod-ornaments' ? 'The craftsmanship of these mouth-blown glass baubles is unbelievable in person. Packaged like royal jewelry!' : 'Exceeded our expectations in every way. The signature holiday packaging is gorgeous.'}”</p>
            <div class="quote-author">
              <span class="quote-author-name">${product.id === 'prod-candle' ? 'Eleanor M., Boston, MA' : product.id === 'prod-ornaments' ? 'Julian & Sarah K., Munich' : 'Marianne S., London'}</span>
              <span class="quote-badge">✓ Verified Holiday Purchase</span>
            </div>
          </div>

          <!-- Accordion Specifications (Balances left & right columns to exact equal height) -->
          <div class="pdp-accordions">
            <div class="accordion-item">
              <button class="accordion-header">
                <span>Detailed Specifications &amp; Care</span>
                <span class="accordion-icon">▼</span>
              </button>
              <div class="accordion-content">
                <p style="margin-bottom:6px;">• <strong>Dimensions / Size:</strong> ${product.id === 'prod-candle' ? '12 oz (340g) | 4.2" H x 3.5" D | 65-hour clean burn' : product.id === 'prod-ornaments' ? 'Set of 6 assorted heirloom baubles (3.2" to 4.5" diameter) with velvet loops' : '50" x 70" (127cm x 178cm) | Weight: 4.2 lbs Australian Merino Wool'}</p>
                <p style="margin-bottom:6px;">• <strong>Materials &amp; Origin:</strong> ${product.id === 'prod-candle' ? '100% pure organic soy wax, cotton wick, embossed emerald keepsake glass' : product.id === 'prod-ornaments' ? 'Mouth-blown Bavarian glass, hand-painted 24K gold filigree' : '100% fine Merino wool, non-itch, natural temperature regulating'}</p>
                <p>• <strong>Holiday Gift Packaging:</strong> Includes signature gold-foiled keepsake box and satin ribbon.</p>
              </div>
            </div>

            <div class="accordion-item">
              <button class="accordion-header">
                <span>Transatlantic Delivery &amp; 60-Day Returns</span>
                <span class="accordion-icon">▼</span>
              </button>
              <div class="accordion-content">
                <p style="margin-bottom:6px;">• <strong>USA:</strong> Delivered within 2-3 business days via FedEx Priority from Columbus, Ohio.</p>
                <p style="margin-bottom:6px;">• <strong>Europe:</strong> Delivered within 2-4 business days via DHL Express from Frankfurt, Germany.</p>
                <p>• <strong>Holiday Return Guarantee:</strong> Extended to January 31, 2025. Hassle-free gift returns.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details & CRO Conversion Box -->
        <div class="pdp-info">
          <!-- 1. Live Social Proof Viewer Badge -->
          <div class="live-viewers-badge">
            <span class="live-pulse-dot"></span>
            <span><strong id="live-viewer-count">32</strong> holiday shoppers are viewing this right now</span>
          </div>

          <div class="pdp-badge-line">
            <span class="product-badge-tag badge-${product.badgeType}">${product.badge}</span>
            <span style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-light);">
              ${product.category}
            </span>
          </div>

          <h1 class="pdp-title">${product.name}</h1>
          <p style="font-size: 1.05rem; color: var(--color-text-muted); margin-bottom: 12px;">${product.subtitle}</p>

          <div class="pdp-rating-row">
            <span class="rating-stars">★★★★★</span>
            <span style="font-weight: 700; color: var(--color-primary-forest);">${product.rating}</span>
            <a href="#reviews-section" style="color: var(--color-text-muted); text-decoration: underline;">
              (${product.reviewsCount} verified holiday buyer reviews)
            </a>
          </div>

          <div class="pdp-price-box">
            <span class="pdp-price-now" id="pdp-main-price">${priceNow}</span>
            <span class="pdp-price-was" id="pdp-price-was">${priceWas}</span>
            <span class="pdp-save-badge" id="pdp-save-badge">-20% OFF</span>
          </div>

          <!-- Dedicated Active Coupon Notification Bar (Clean, unstacked, single line) -->
          <div class="pdp-active-coupon-banner" id="pdp-active-coupon-banner" style="display:none;">
            <div class="active-coupon-badge">
              <span class="active-coupon-tag">🏷️ COUPON APPLIED</span>
              <span class="active-coupon-info">
                Code <strong id="active-coupon-code">XMAS10</strong> applied:
                <span class="active-coupon-discount" id="active-coupon-savings">Save $10.00</span>
              </span>
            </div>
            <button class="btn-remove-coupon" onclick="window.NoelApp.removeActiveCoupon()" aria-label="Remove coupon">✕ Remove</button>
          </div>

          <!-- Interactive Holiday Vouchers & Coupons Box -->
          <div class="pdp-coupons-box">
            <div class="pdp-coupons-header">
              <div class="pdp-coupons-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                <span>Available Holiday Coupons &amp; Offers</span>
              </div>
              <span class="pdp-coupons-badge">3 Active</span>
            </div>

            <div class="pdp-coupon-list">
              <!-- Coupon 1: NOEL15 -->
              <div class="pdp-coupon-card" id="coupon-card-NOEL15">
                <div class="pdp-coupon-left">
                  <div class="pdp-coupon-code-row">
                    <span class="pdp-coupon-code">NOEL15</span>
                    <span class="pdp-coupon-type">15% OFF</span>
                  </div>
                  <span class="pdp-coupon-desc">Take 15% off orders over $50 / €45 (Expires Dec 24)</span>
                </div>
                <button class="pdp-coupon-apply-btn" id="btn-coupon-NOEL15" onclick="window.NoelApp.applyPDPCoupon('NOEL15', 15, '${product.id}', false)">
                  Apply
                </button>
              </div>

              <!-- Coupon 2: XMAS10 -->
              <div class="pdp-coupon-card" id="coupon-card-XMAS10">
                <div class="pdp-coupon-left">
                  <div class="pdp-coupon-code-row">
                    <span class="pdp-coupon-code">XMAS10</span>
                    <span class="pdp-coupon-type">$10 / €9 OFF</span>
                  </div>
                  <span class="pdp-coupon-desc">Instant $10 / €9 discount for first-time holiday shoppers</span>
                </div>
                <button class="pdp-coupon-apply-btn" id="btn-coupon-XMAS10" onclick="window.NoelApp.applyPDPCoupon('XMAS10', 10, '${product.id}', true)">
                  Apply
                </button>
              </div>

              <!-- Coupon 3: VIP20 -->
              <div class="pdp-coupon-card" id="coupon-card-VIP20">
                <div class="pdp-coupon-left">
                  <div class="pdp-coupon-code-row">
                    <span class="pdp-coupon-code">VIP20</span>
                    <span class="pdp-coupon-type">20% OFF</span>
                  </div>
                  <span class="pdp-coupon-desc">Save 20% when bundling 2+ gifts or orders over $120 / €110</span>
                </div>
                <button class="pdp-coupon-apply-btn" id="btn-coupon-VIP20" onclick="window.NoelApp.applyPDPCoupon('VIP20', 20, '${product.id}', false)">
                  Apply
                </button>
              </div>
            </div>

            <div class="pdp-coupon-feedback" id="pdp-coupon-feedback" style="display:none;">
              🎉 <span id="pdp-coupon-feedback-text"></span>
            </div>
          </div>

          <!-- 2. Stock Urgency Meter -->
          <div class="stock-meter-box">
            <div class="stock-meter-header">
              <span>⚠️ Low Stock Warning: Only <strong>${product.stock} items left</strong></span>
              <span style="color: var(--color-festive-red);">Selling Fast!</span>
            </div>
            <div class="stock-progress-track">
              <div class="stock-progress-bar" style="width: ${Math.min(product.stock * 6, 88)}%;"></div>
            </div>
          </div>

          <!-- 3. Dynamic Delivery Estimator -->
          <div class="delivery-estimator-box">
            <div class="delivery-est-header">
              <span>🚚 Guaranteed Pre-Christmas Arrival</span>
              <span style="font-size: 0.78rem; background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px;">100% On-Time</span>
            </div>
            <p style="font-size: 0.84rem; line-height: 1.5; margin: 0;">
              Order within the next <strong style="color: var(--color-festive-red);">03h 48m</strong> for guaranteed delivery by <span class="delivery-date-highlight">Wednesday, Dec 18</span>.
            </p>
          </div>

          <p style="font-size: 0.96rem; color: var(--color-text-muted); line-height: 1.65; margin-bottom: 24px;">
            ${product.description}
          </p>

          <!-- Variant Options -->
          <div class="pdp-option-group">
            <span class="pdp-option-label">Select Fragrance / Edition:</span>
            <div class="pdp-option-pills">
              <button class="pdp-pill-btn active" onclick="window.NoelApp.selectPill(this)">Winter Pine & Cinnamon (Signature)</button>
              <button class="pdp-pill-btn" onclick="window.NoelApp.selectPill(this)">Frosted Cranberry & Spiced Orange</button>
              <button class="pdp-pill-btn" onclick="window.NoelApp.selectPill(this)">Vanilla Bourbon & Cedarwood</button>
            </div>
          </div>

          <!-- Add to Cart Controls -->
          <div class="pdp-actions-row" id="pdp-main-actions">
            <div class="pdp-qty-selector">
              <button class="qty-btn" id="pdp-qty-minus">-</button>
              <span class="qty-number" id="pdp-qty-val" style="width: 36px;">1</span>
              <button class="qty-btn" id="pdp-qty-plus">+</button>
            </div>

            <button class="pdp-btn-add" id="pdp-add-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Add to Holiday Bag
            </button>
          </div>

          <!-- Direct Shop Pay Checkout Button -->
          <button class="pdp-btn-buynow" id="pdp-buynow-btn">
            Buy with <span style="font-weight: 800; font-family: sans-serif; letter-spacing: -0.5px;">Shop Pay</span>
          </button>

          <!-- Checkout Security & Trust Row (Finishes right column at exact equal height) -->
          <div class="pdp-checkout-trust-row">
            <div class="checkout-trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>Shopify 256-Bit SSL</span>
            </div>
            <div class="checkout-trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line></svg>
              <span>Pre-Christmas Express</span>
            </div>
            <div class="checkout-trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>
              <span>Returns 'til Jan 31</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Frequently Bought Together (FBT) Bundle -->
      <section class="fbt-section">
        <h3 class="fbt-title">Frequently Bought Together</h3>
        <p class="fbt-subtitle">Complete your holiday setup and save an extra 15% on this curated holiday bundle</p>

        <div class="fbt-grid">
          <div class="fbt-products-row">
            <div class="fbt-item-card">
              <input type="checkbox" checked id="fbt-check-1" style="accent-color: var(--color-festive-red);">
              <img src="${product.image}" alt="${product.name}">
              <div>
                <strong style="display:block; font-size:0.86rem; color:var(--color-primary-forest);">${product.name}</strong>
                <span style="font-size:0.82rem; font-weight:700;">${priceNow}</span>
              </div>
            </div>

            <span class="fbt-plus-sign">+</span>

            <div class="fbt-item-card">
              <input type="checkbox" checked id="fbt-check-2" style="accent-color: var(--color-festive-red);">
              <img src="${complementProduct.image}" alt="${complementProduct.name}">
              <div>
                <strong style="display:block; font-size:0.86rem; color:var(--color-primary-forest);">${complementProduct.name}</strong>
                <span style="font-size:0.82rem; font-weight:700;">${compPriceNow}</span>
              </div>
            </div>
          </div>

          <div class="fbt-summary-box">
            <span class="fbt-save-pill">🎁 Holiday Bundle Deal: Save 15%</span>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);">Total Combined Price:</div>
            <div class="fbt-total-price" id="fbt-price-display">${bundlePriceFormatted}</div>
            <div style="font-size: 0.8rem; color: var(--color-text-light); text-decoration: line-through; margin-bottom: 12px;">${bundleOriginalSum}</div>
            <button class="btn btn-gold" style="width: 100%;" id="fbt-add-btn">
              Add Both to Holiday Bag
            </button>
          </div>
        </div>
      </section>

      <!-- 5. Interactive Holiday Unboxing Experience -->
      <section class="unboxing-section">
        <div class="unboxing-grid">
          <div class="unboxing-image-box">
            <img src="assets/images/hero-banner.jpg" alt="Gift Unboxing Experience">
          </div>
          <div>
            <span class="section-pretitle">The Holiday Unboxing Experience</span>
            <h2 style="font-family: var(--font-heading); font-size: 2.2rem; color: var(--color-primary-forest); margin-bottom: 16px;">
              Ready to Place Under the Tree
            </h2>
            <p style="font-size: 1rem; color: var(--color-text-muted); line-height: 1.65;">
              Every order arrives ready-to-gift in our signature forest green keepsake box with gold foil embossing, protected by custom tissue and tied with red satin ribbon.
            </p>

            <div class="unboxing-features-list">
              <div class="unboxing-feature-item">
                <div class="unboxing-feature-icon">🎁</div>
                <div>
                  <strong style="color: var(--color-primary-forest); display: block; font-size: 1rem;">Signature Forest Green Gift Box</strong>
                  <span style="color: var(--color-text-muted); font-size: 0.88rem;">Deluxe reusable presentation box made from recycled FSC board.</span>
                </div>
              </div>
              <div class="unboxing-feature-item">
                <div class="unboxing-feature-icon">🎀</div>
                <div>
                  <strong style="color: var(--color-primary-forest); display: block; font-size: 1rem;">Hand-Tied Velvet Red Ribbon</strong>
                  <span style="color: var(--color-text-muted); font-size: 0.88rem;">Luxurious crimson velvet bow with brass bell charm.</span>
                </div>
              </div>
              <div class="unboxing-feature-item">
                <div class="unboxing-feature-icon">📜</div>
                <div>
                  <strong style="color: var(--color-primary-forest); display: block; font-size: 1rem;">Gold Wax-Sealed Holiday Card</strong>
                  <span style="color: var(--color-text-muted); font-size: 0.88rem;">Includes your personalized handwritten gift message inside.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Verified Holiday Reviews Section -->
      <section class="reviews-section" id="reviews-section">
        <div class="section-header" style="margin-bottom: 36px;">
          <span class="section-pretitle">Verified Customer Experiences</span>
          <h2 class="section-title">Loved by Families Across USA &amp; Europe</h2>
          <p class="section-description">Over 1,200+ five-star reviews from verified holiday buyers.</p>
        </div>

        <div class="reviews-summary-card">
          <div class="reviews-big-score">
            <div class="big-rating-number">${product.rating}</div>
            <div class="rating-stars" style="font-size: 1.2rem; margin: 4px 0;">★★★★★</div>
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">Based on ${product.reviewsCount} reviews</span>
          </div>

          <div class="review-bars-list">
            <div class="review-bar-row">
              <span style="width: 50px;">5 Stars</span>
              <div class="review-bar-track"><div class="review-bar-fill" style="width: 92%;"></div></div>
              <span style="width: 35px; text-align: right; font-weight: 700;">92%</span>
            </div>
            <div class="review-bar-row">
              <span style="width: 50px;">4 Stars</span>
              <div class="review-bar-track"><div class="review-bar-fill" style="width: 8%;"></div></div>
              <span style="width: 35px; text-align: right; font-weight: 700;">8%</span>
            </div>
            <div class="review-bar-row">
              <span style="width: 50px;">3 Stars</span>
              <div class="review-bar-track"><div class="review-bar-fill" style="width: 0%;"></div></div>
              <span style="width: 35px; text-align: right; color: #888;">0%</span>
            </div>
          </div>
        </div>

        <!-- Keyword Filter Pills -->
        <div class="review-filter-pills">
          <button class="review-filter-pill active">All Reviews</button>
          <button class="review-filter-pill">✨ Fragrance &amp; Glow</button>
          <button class="review-filter-pill">🎁 Gift Packaging</button>
          <button class="review-filter-pill">⚡ Fast US Delivery</button>
          <button class="review-filter-pill">🇪🇺 EU Arrival</button>
        </div>

        <!-- Review Cards Grid -->
        <div class="reviews-cards-grid">
          <div class="review-item-card">
            <div class="review-buyer-meta">
              <span class="rating-stars">★★★★★</span>
              <span class="verified-buyer-badge">✓ Verified Buyer</span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-primary-forest); margin-bottom: 8px;">
              "Smells like authentic Christmas morning in Maine!"
            </h4>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 16px;">
              The pine and cinnamon fragrance fills our whole living room without being overpowering. The crackling wood wick adds such cozy fireside ambiance. Arrived in 2 days in Boston!
            </p>
            <div style="margin-top: auto; font-size: 0.82rem; color: #888;">
              <strong>Eleanor V.</strong> • Boston, MA (USA)
            </div>
          </div>

          <div class="review-item-card">
            <div class="review-buyer-meta">
              <span class="rating-stars">★★★★★</span>
              <span class="verified-buyer-badge">✓ Verified Buyer</span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-primary-forest); margin-bottom: 8px;">
              "Wunderschöne Qualität und super schnelle Lieferung!"
            </h4>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 16px;">
              Ordered to Munich and it arrived via DHL Express in 48 hours. The green glass with gold embossed lid looks like luxury boutique glassware. My wife loved the handwritten card!
            </p>
            <div style="margin-top: auto; font-size: 0.82rem; color: #888;">
              <strong>Maximilian B.</strong> • Munich, Germany (EU)
            </div>
          </div>

          <div class="review-item-card">
            <div class="review-buyer-meta">
              <span class="rating-stars">★★★★★</span>
              <span class="verified-buyer-badge">✓ Verified Buyer</span>
            </div>
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-primary-forest); margin-bottom: 8px;">
              "The gift packaging alone is worth every penny."
            </h4>
            <p style="font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 16px;">
              I bought 4 of these as Christmas gifts for our family. The heavy velvet presentation boxes with gold wax seals made them look like $100+ luxury items. Highly recommend!
            </p>
            <div style="margin-top: auto; font-size: 0.82rem; color: #888;">
              <strong>Charlotte D.</strong> • London, UK
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Related Holiday Treasures -->
      <section style="padding: 60px 0 20px;">
        <div class="section-header" style="margin-bottom: 36px;">
          <span class="section-pretitle">Complete The Holiday Magic</span>
          <h2 class="section-title">You May Also Love</h2>
        </div>

        <div class="products-grid">
          ${relatedItems.map(item => `
            <article class="product-card" onclick="window.location.href='product.html?id=${item.id}'">
              <div class="product-media">
                <span class="product-badge-tag badge-${item.badgeType}">${item.badge}</span>
                <img src="${item.image}" alt="${item.name}" class="product-img-primary">
                <img src="${item.secondaryImage}" alt="${item.name}" class="product-img-secondary">
              </div>
              <div class="product-content">
                <span class="product-category">${item.category}</span>
                <h3 class="product-title">${item.name}</h3>
                <div class="product-price-row">
                  <span class="current-price">${formatPrice(item.priceUSD, item.priceEUR)}</span>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;

    // Hook PDP Quantity & Actions
    let pdpQty = 1;
    const minus = document.getElementById('pdp-qty-minus');
    const plus = document.getElementById('pdp-qty-plus');
    const qtyVal = document.getElementById('pdp-qty-val');
    const addBtn = document.getElementById('pdp-add-btn');
    const buyNowBtn = document.getElementById('pdp-buynow-btn');
    const fbtAddBtn = document.getElementById('fbt-add-btn');

    if (minus && plus && qtyVal) {
      minus.onclick = () => { if (pdpQty > 1) { pdpQty--; qtyVal.textContent = pdpQty; } };
      plus.onclick = () => { pdpQty++; qtyVal.textContent = pdpQty; };
    }

    if (addBtn) {
      addBtn.onclick = () => {
        addToCart(product.id, pdpQty);
      };
    }

    if (buyNowBtn) {
      buyNowBtn.onclick = () => {
        addToCart(product.id, pdpQty);
        window.location.href = 'checkout.html';
      };
    }

    if (fbtAddBtn) {
      fbtAddBtn.onclick = () => {
        addToCart(product.id, 1);
        addToCart(complementProduct.id, 1);
        showToast('Holiday Bundle Deal (Both Items) Added to Bag! 🎁');
      };
    }

    // Fluctuate live viewer count slightly for realistic social proof
    const viewerEl = document.getElementById('live-viewer-count');
    if (viewerEl) {
      setInterval(() => {
        const randViewers = Math.floor(Math.random() * 9) + 26;
        viewerEl.textContent = randViewers;
      }, 7000);
    }

    // Sticky Mobile Add to Cart Bar initialization
    initStickyMobileBar(product, priceNow);

    initAccordions();

    // Restore active coupon on PDP if present
    const savedCoupon = localStorage.getItem('noel_active_coupon');
    if (savedCoupon) {
      try {
        const cData = JSON.parse(savedCoupon);
        applyPDPCoupon(cData.code, cData.discountVal, product.id, cData.isFixed, false);
      } catch (e) {}
    }
  }

  function initStickyMobileBar(product, priceNow) {
    let bar = document.getElementById('sticky-mobile-pdp-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sticky-mobile-pdp-bar';
      bar.className = 'sticky-mobile-pdp';
      document.body.appendChild(bar);
    }

    bar.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="sticky-mobile-thumb">
      <div class="sticky-mobile-info">
        <div class="sticky-mobile-title">${product.name}</div>
        <div class="sticky-mobile-price">${priceNow}</div>
      </div>
      <button class="sticky-mobile-btn" onclick="window.NoelApp.addToCart('${product.id}', 1)">
        Quick Add 🎁
      </button>
    `;

    const triggerEl = document.getElementById('pdp-main-actions');
    window.addEventListener('scroll', () => {
      if (!triggerEl) return;
      const rect = triggerEl.getBoundingClientRect();
      if (rect.bottom < 0) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    });
  }

  function setPDPImage(src, thumbElement) {
    const mainImg = document.getElementById('pdp-active-img');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.pdp-thumb-item').forEach(el => el.classList.remove('active'));
    if (thumbElement) thumbElement.classList.add('active');
  }

  function selectPill(btn) {
    const parent = btn.closest('.pdp-option-pills');
    if (parent) {
      parent.querySelectorAll('.pdp-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  // ==========================================================================
  // 9. COLLECTIONS / CATALOG PAGE LOGIC
  // ==========================================================================
  function initCollectionsPage() {
    const grid = document.getElementById('catalog-products-grid');
    const sortSelect = document.getElementById('catalog-sort');
    const categoryInputs = document.querySelectorAll('input[name="cat_filter"]');
    if (!grid || typeof CHRISTMAS_PRODUCTS === 'undefined') return;

    function renderCatalog() {
      let items = [...CHRISTMAS_PRODUCTS];

      // Filter by checked categories
      const checkedCats = Array.from(document.querySelectorAll('input[name="cat_filter"]:checked')).map(cb => cb.value);
      if (checkedCats.length > 0 && !checkedCats.includes('all')) {
        items = items.filter(p => checkedCats.includes(p.category));
      }

      // Sort
      const sortBy = sortSelect ? sortSelect.value : 'featured';
      if (sortBy === 'price-asc') {
        items.sort((a, b) => (STATE.currency === 'EUR' ? a.priceEUR - b.priceEUR : a.priceUSD - b.priceUSD));
      } else if (sortBy === 'price-desc') {
        items.sort((a, b) => (STATE.currency === 'EUR' ? b.priceEUR - a.priceEUR : b.priceUSD - a.priceUSD));
      } else if (sortBy === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
      }

      grid.innerHTML = items.map(product => {
        const priceNow = formatPrice(product.priceUSD, product.priceEUR);
        const priceWas = formatPrice(product.originalPriceUSD, product.originalPriceEUR);

        return `
          <article class="product-card" data-id="${product.id}">
            <div class="product-media" onclick="window.location.href='product.html?id=${product.id}'">
              <span class="product-badge-tag badge-${product.badgeType}">${product.badge}</span>
              <img src="${product.image}" alt="${product.name}" class="product-img-primary" loading="lazy">
              <img src="${product.secondaryImage}" alt="${product.name}" class="product-img-secondary" loading="lazy">
              <div class="card-quick-actions" onclick="event.stopPropagation()">
                <button class="btn-card-add" onclick="window.NoelApp.addToCart('${product.id}', 1)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  Quick Add
                </button>
              </div>
            </div>
            <div class="product-content">
              <span class="product-category">${product.category}</span>
              <h3 class="product-title" onclick="window.location.href='product.html?id=${product.id}'" style="cursor:pointer;">${product.name}</h3>
              <div class="product-rating">
                <span class="rating-stars">★★★★★</span>
                <span class="rating-count">(${product.reviewsCount})</span>
              </div>
              <div class="product-price-row">
                <span class="current-price">${priceNow}</span>
                <span class="original-price">${priceWas}</span>
              </div>
            </div>
          </article>
        `;
      }).join('');

      const countEl = document.getElementById('catalog-count');
      if (countEl) countEl.textContent = `${items.length} holiday items found`;
    }

    if (sortSelect) sortSelect.onchange = renderCatalog;
    categoryInputs.forEach(cb => { cb.onchange = renderCatalog; });

    renderCatalog();
  }

  // ==========================================================================
  // 10. DEDICATED CART PAGE LOGIC
  // ==========================================================================
  function initCartPage() {
    renderCartPage();

    const couponBtn = document.getElementById('apply-coupon-btn');
    if (couponBtn) {
      couponBtn.onclick = () => {
        const input = document.getElementById('coupon-code-input');
        if (!input) return;
        const code = input.value.trim().toUpperCase();
        if (code === 'XMAS15') {
          STATE.appliedDiscount = { code: 'XMAS15', percent: 15 };
          localStorage.setItem('noel_discount', JSON.stringify(STATE.appliedDiscount));
          showToast('Holiday discount XMAS15 (15% OFF) applied! 🎁');
          renderCartPage();
        } else {
          showToast('Invalid coupon code. Try code "XMAS15"');
        }
      };
    }
  }

  function renderCartPage() {
    const container = document.getElementById('cart-page-items');
    const emptyState = document.getElementById('cart-page-empty');
    const subtotalEl = document.getElementById('cart-page-subtotal');
    const discountRow = document.getElementById('cart-page-discount-row');
    const discountVal = document.getElementById('cart-page-discount-val');
    const finalTotalEl = document.getElementById('cart-page-final-total');

    if (!container) return;

    if (STATE.cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      container.style.display = 'none';
      if (document.getElementById('cart-page-summary-box')) {
        document.getElementById('cart-page-summary-box').style.display = 'none';
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'block';
    if (document.getElementById('cart-page-summary-box')) {
      document.getElementById('cart-page-summary-box').style.display = 'block';
    }

    container.innerHTML = STATE.cart.map(item => {
      const price = STATE.currency === 'EUR' ? item.priceEUR : item.priceUSD;
      const lineTotal = price * item.quantity;

      return `
        <div class="cart-item" style="grid-template-columns: 90px 1fr; padding: 18px 0;">
          <img src="${item.image}" alt="${item.name}" style="width:90px; height:90px; border-radius:6px; object-fit:cover;">
          <div class="cart-item-details">
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--color-primary-forest); margin-bottom:6px;">${item.name}</h4>
            <span style="font-size:0.95rem; font-weight:800; color:var(--color-text-main); margin-bottom:10px;">${STATE.currencySymbol}${lineTotal.toFixed(2)} (${STATE.currencySymbol}${price.toFixed(2)} each)</span>
            <div class="cart-item-quantity">
              <button class="qty-btn" onclick="window.NoelApp.updateQty('${item.id}', -1)">-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" onclick="window.NoelApp.updateQty('${item.id}', 1)">+</button>
            </div>
            <button class="btn-remove-item" onclick="window.NoelApp.removeItem('${item.id}')" title="Remove" style="font-size:1rem;">✕</button>
          </div>
        </div>
      `;
    }).join('');

    let subtotal = STATE.cart.reduce((sum, it) => {
      const p = STATE.currency === 'EUR' ? it.priceEUR : it.priceUSD;
      return sum + p * it.quantity;
    }, 0);

    let discountAmount = 0;
    if (STATE.appliedDiscount) {
      discountAmount = (subtotal * STATE.appliedDiscount.percent) / 100;
      if (discountRow && discountVal) {
        discountRow.style.display = 'flex';
        discountVal.textContent = `-${STATE.currencySymbol}${discountAmount.toFixed(2)} (${STATE.appliedDiscount.code})`;
      }
    } else if (discountRow) {
      discountRow.style.display = 'none';
    }

    if (subtotalEl) subtotalEl.textContent = `${STATE.currencySymbol}${subtotal.toFixed(2)}`;
    if (finalTotalEl) finalTotalEl.textContent = `${STATE.currencySymbol}${(subtotal - discountAmount).toFixed(2)}`;
  }

  // ==========================================================================
  // 11. SHOPIFY CHECKOUT PAGE LOGIC (1-Page Experience)
  // ==========================================================================
  function initCheckoutPage() {
    renderCheckoutSummary();

    const form = document.getElementById('checkout-address-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const total = document.getElementById('checkout-final-amount')?.textContent || '$0.00';
        alert(`🎉 ORDER PLACED SUCCESSFULLY ON SHOPIFY! 🎄\n\n` +
          `Order Confirmation #NOEL-${Math.floor(100000 + Math.random() * 900000)}\n` +
          `Total Paid: ${total}\n` +
          `Market Currency: ${STATE.currency}\n` +
          `Delivery Notice: Guaranteed Pre-Christmas Priority Express.\n\n` +
          `Thank you for shopping with NOËL & CO.! A tracking link has been sent to your email.`);
        STATE.cart = [];
        saveCart();
        window.location.href = 'index.html';
      };
    }
  }

  function renderCheckoutSummary() {
    const list = document.getElementById('checkout-order-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const finalTotalEl = document.getElementById('checkout-final-amount');
    const shippingEl = document.getElementById('checkout-shipping-val');
    if (!list) return;

    if (STATE.cart.length === 0) {
      list.innerHTML = `<p style="padding: 20px; color: var(--color-text-muted); text-align: center;">Your holiday bag is empty. <a href="collections.html" style="color:var(--color-festive-red); text-decoration:underline;">Continue shopping</a></p>`;
      if (subtotalEl) subtotalEl.textContent = `${STATE.currencySymbol}0.00`;
      if (finalTotalEl) finalTotalEl.textContent = `${STATE.currencySymbol}0.00`;
      return;
    }

    list.innerHTML = STATE.cart.map(item => {
      const p = STATE.currency === 'EUR' ? item.priceEUR : item.priceUSD;
      const total = p * item.quantity;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; font-size: 0.9rem;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="position: relative;">
              <img src="${item.image}" alt="${item.name}" style="width: 52px; height: 52px; border-radius: 6px; object-fit: cover; border: 1px solid #e2ded8;">
              <span style="position: absolute; top: -6px; right: -6px; background: #606764; color: #fff; border-radius: 50%; width: 20px; height: 20px; font-size: 0.72rem; font-weight: 700; display: flex; align-items: center; justify-content: center;">${item.quantity}</span>
            </div>
            <div>
              <strong style="color: var(--color-primary-forest); display: block;">${item.name}</strong>
              <span style="font-size: 0.8rem; color: var(--color-text-muted);">Standard Gift Box</span>
            </div>
          </div>
          <span style="font-weight: 700;">${STATE.currencySymbol}${total.toFixed(2)}</span>
        </div>
      `;
    }).join('');

    const subtotal = STATE.cart.reduce((sum, it) => {
      const p = STATE.currency === 'EUR' ? it.priceEUR : it.priceUSD;
      return sum + p * it.quantity;
    }, 0);

    const threshold = STATE.currency === 'EUR' ? STATE.freeShippingThreshold.EUR : STATE.freeShippingThreshold.USD;
    const isFree = subtotal >= threshold;

    if (shippingEl) {
      shippingEl.innerHTML = isFree ? `<strong style="color:#27ae60;">FREE (Holiday Promo)</strong>` : `${STATE.currencySymbol}4.99`;
    }

    if (subtotalEl) subtotalEl.textContent = `${STATE.currencySymbol}${subtotal.toFixed(2)}`;
    if (finalTotalEl) {
      const shipCost = isFree ? 0 : 4.99;
      finalTotalEl.textContent = `${STATE.currencySymbol}${(subtotal + shipCost).toFixed(2)}`;
    }
  }

  // ==========================================================================
  // 12. GIFT GUIDE PAGE LOGIC
  // ==========================================================================
  function initGiftGuidePage() {
    const grid = document.getElementById('gift-guide-grid');
    if (!grid || typeof CHRISTMAS_PRODUCTS === 'undefined') return;

    grid.innerHTML = CHRISTMAS_PRODUCTS.map(product => {
      const priceNow = formatPrice(product.priceUSD, product.priceEUR);
      return `
        <article class="product-card">
          <div class="product-media" onclick="window.location.href='product.html?id=${product.id}'">
            <span class="product-badge-tag badge-${product.badgeType}">🎁 Perfect for ${product.recipient}</span>
            <img src="${product.image}" alt="${product.name}" class="product-img-primary">
            <img src="${product.secondaryImage}" alt="${product.name}" class="product-img-secondary">
            <div class="card-quick-actions" onclick="event.stopPropagation()">
              <button class="btn-card-add" onclick="window.NoelApp.addToCart('${product.id}', 1)">
                Quick Add
              </button>
            </div>
          </div>
          <div class="product-content">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title" onclick="window.location.href='product.html?id=${product.id}'">${product.name}</h3>
            <div class="product-price-row">
              <span class="current-price">${priceNow}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // ==========================================================================
  // 13. HOMEPAGE SPECIFIC (Slider, Bundles, Quickview)
  // ==========================================================================
  function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container || typeof CHRISTMAS_PRODUCTS === 'undefined') return;

    let filtered = CHRISTMAS_PRODUCTS;
    if (STATE.activeFilter === 'under-25') {
      filtered = CHRISTMAS_PRODUCTS.filter(p => p.priceTier === 'under-25');
    } else if (STATE.activeFilter === 'under-50') {
      filtered = CHRISTMAS_PRODUCTS.filter(p => p.priceTier === 'under-25' || p.priceTier === 'under-50');
    } else if (['her', 'him', 'home', 'kids'].includes(STATE.activeFilter)) {
      filtered = CHRISTMAS_PRODUCTS.filter(p => p.recipient === STATE.activeFilter);
    }

    container.innerHTML = filtered.map(product => {
      const priceNow = formatPrice(product.priceUSD, product.priceEUR);
      const priceWas = formatPrice(product.originalPriceUSD, product.originalPriceEUR);

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-media" onclick="window.location.href='product.html?id=${product.id}'">
            <span class="product-badge-tag badge-${product.badgeType}">${product.badge}</span>
            <img src="${product.image}" alt="${product.name}" class="product-img-primary" loading="lazy">
            <img src="${product.secondaryImage}" alt="${product.name}" class="product-img-secondary" loading="lazy">
            <div class="card-quick-actions" onclick="event.stopPropagation()">
              <button class="btn-card-add" onclick="window.NoelApp.addToCart('${product.id}', 1)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                Quick Add
              </button>
              <button class="btn-card-quickview" title="Quick View" onclick="window.NoelApp.openQuickView('${product.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>
          <div class="product-content">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title" onclick="window.location.href='product.html?id=${product.id}'" style="cursor:pointer;">${product.name}</h3>
            <div class="product-rating">
              <span class="rating-stars">★★★★★</span>
              <span class="rating-count">(${product.reviewsCount})</span>
            </div>
            <div class="product-price-row">
              <span class="current-price">${priceNow}</span>
              <span class="original-price">${priceWas}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderBundles() {
    const bundleEl = document.getElementById('bundle-spotlight-content');
    if (!bundleEl || typeof HOLIDAY_BUNDLES === 'undefined' || !HOLIDAY_BUNDLES[0]) return;

    const b = HOLIDAY_BUNDLES[0];
    const priceNow = formatPrice(b.priceUSD, b.priceEUR);
    const priceWas = formatPrice(b.originalPriceUSD, b.originalPriceEUR);

    bundleEl.innerHTML = `
      <div class="bundle-container">
        <div class="bundle-image-box">
          <span class="bundle-badge-floating">${b.badge}</span>
          <img src="${b.image}" alt="${b.title}" loading="lazy">
        </div>
        <div class="bundle-info">
          <span class="section-pretitle" style="color: var(--color-gold-light);">Limited Holiday Exclusive</span>
          <h2 class="bundle-title">${b.title}</h2>
          <p style="color: #d1d5d2; font-size: 1.05rem;">${b.tagline}</p>
          <ul class="bundle-items-list">
            ${b.items.map(it => `
              <li class="bundle-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${it}</span>
              </li>
            `).join('')}
          </ul>
          <div class="bundle-pricing">
            <span class="bundle-price-now">${priceNow}</span>
            <span class="bundle-price-was">${priceWas}</span>
          </div>
          <button class="btn btn-gold" style="width: 100%; max-width: 380px;" onclick="window.NoelApp.addToCart('prod-candle', 1); window.NoelApp.addToCart('prod-blanket', 1);">
            Claim Complete Holiday Set
          </button>
        </div>
      </div>
    `;
  }

  function initFilterTabs() {
    const tabs = document.querySelectorAll('.gift-guide-tabs .tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        STATE.activeFilter = tab.getAttribute('data-filter');
        renderProducts();
      });
    });
  }

  function initQuickViewModal() {
    const modal = document.getElementById('quickview-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (!modal) return;

    if (closeBtn) closeBtn.onclick = closeQuickView;
    modal.onclick = (e) => { if (e.target === modal) closeQuickView(); };
  }

  function openQuickView(productId) {
    if (typeof CHRISTMAS_PRODUCTS === 'undefined') return;
    const product = CHRISTMAS_PRODUCTS.find(p => p.id === productId);
    const modal = document.getElementById('quickview-modal');
    const container = document.getElementById('quickview-content');
    if (!product || !modal || !container) return;

    const priceNow = formatPrice(product.priceUSD, product.priceEUR);
    const priceWas = formatPrice(product.originalPriceUSD, product.originalPriceEUR);

    container.innerHTML = `
      <div class="modal-product-grid">
        <div class="modal-media">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
          <span style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-festive-red); font-weight: 700; margin-bottom: 8px;">
            ${product.badge} • ${product.category}
          </span>
          <h2 style="font-family: var(--font-heading); font-size: 1.65rem; color: var(--color-primary-forest); margin-bottom: 8px;">
            ${product.name}
          </h2>
          <div class="product-rating" style="margin-bottom: 12px;">
            <span class="rating-stars">★★★★★</span>
            <span class="rating-count">(${product.reviewsCount} verified holiday buyers)</span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px;">
            <span style="font-size: 1.6rem; font-weight: 800; color: var(--color-primary-forest);">${priceNow}</span>
            <span style="font-size: 1rem; color: var(--color-text-light); text-decoration: line-through;">${priceWas}</span>
          </div>
          <p style="font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 20px;">
            ${product.description}
          </p>
          <div style="display: flex; gap: 12px; align-items: center; margin-top: auto;">
            <button class="btn btn-primary" style="flex: 1;" onclick="window.NoelApp.addToCart('${product.id}', 1); window.NoelApp.closeQuickView();">
              Add to Holiday Bag
            </button>
            <a href="product.html?id=${product.id}" class="btn btn-outline" style="color:var(--color-primary-forest); border-color:var(--color-border);">
              Full Details
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function initAnnouncementSlider() {
    const slides = [
      '🎄 <strong>Holiday Delivery Guarantee</strong> — Order by Dec 18 for guaranteed Christmas arrival',
      '🎁 <strong>Free Luxury Gift Packaging</strong> on all orders over $75 / €70',
      '⚡ <strong>Holiday Secret Special</strong> — Use code <strong>XMAS15</strong> for 15% OFF your order'
    ];
    let currentIndex = 0;
    const slider = document.getElementById('announcement-msg');
    if (!slider) return;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      slider.style.opacity = '0';
      setTimeout(() => {
        slider.innerHTML = `<span>${slides[currentIndex]}</span>`;
        slider.style.opacity = '1';
      }, 300);
    }, 4500);
  }

  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ==========================================================================
  // 14. SHOPPABLE FESTIVE ROOM HOTSPOTS
  // ==========================================================================
  function initShoppableHotspots() {
    const pins = document.querySelectorAll('.hotspot-pin');
    const popovers = document.querySelectorAll('.hotspot-popover');

    pins.forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = pin.getAttribute('data-target');
        const popover = document.getElementById(targetId);

        popovers.forEach(p => { if (p !== popover) p.classList.remove('active'); });

        if (popover) {
          popover.classList.toggle('active');
        }
      });
    });

    document.addEventListener('click', () => {
      popovers.forEach(p => p.classList.remove('active'));
    });
  }

  // ==========================================================================
  // 15. HOLIDAY GIFT MATCHMAKER QUIZ
  // ==========================================================================
  function initGiftMatchmaker() {
    const quizBox = document.getElementById('gift-quiz-content');
    if (!quizBox) return;

    let quizStep = 1;
    let quizAnswers = { recipient: '', budget: '', vibe: '' };

    function renderQuizStep() {
      if (quizStep === 1) {
        quizBox.innerHTML = `
          <div class="quiz-progress-bar">
            <span class="quiz-step-dot active">1</span>
            <div style="flex:1; height:2px; background:rgba(255,255,255,0.2); margin:0 8px;"></div>
            <span class="quiz-step-dot">2</span>
            <div style="flex:1; height:2px; background:rgba(255,255,255,0.2); margin:0 8px;"></div>
            <span class="quiz-step-dot">3</span>
          </div>
          <h3 class="quiz-question-title">Step 1: Who are you choosing a gift for?</h3>
          <p style="text-align:center; color:#cfd6d1; font-size:0.9rem;">Select the lucky recipient on your Christmas list:</p>
          <div class="quiz-options-grid">
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('recipient', 'her')">
              <div class="quiz-option-icon">✨</div>
              <span class="quiz-option-label">For Her</span>
              <span class="quiz-option-desc">Wife, Mother, Sister, or Best Friend</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('recipient', 'him')">
              <div class="quiz-option-icon">🌲</div>
              <span class="quiz-option-label">For Him</span>
              <span class="quiz-option-desc">Husband, Father, Brother, or Colleague</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('recipient', 'home')">
              <div class="quiz-option-icon">🏡</div>
              <span class="quiz-option-label">For the Entire Family</span>
              <span class="quiz-option-desc">Cozy holiday home decor & festive hampers</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('recipient', 'kids')">
              <div class="quiz-option-icon">🧸</div>
              <span class="quiz-option-label">Kids & Keepsakes</span>
              <span class="quiz-option-desc">Traditional heirloom music boxes & stockings</span>
            </div>
          </div>
        `;
      } else if (quizStep === 2) {
        quizBox.innerHTML = `
          <div class="quiz-progress-bar">
            <span class="quiz-step-dot active">✓</span>
            <div style="flex:1; height:2px; background:var(--color-gold-accent); margin:0 8px;"></div>
            <span class="quiz-step-dot active">2</span>
            <div style="flex:1; height:2px; background:rgba(255,255,255,0.2); margin:0 8px;"></div>
            <span class="quiz-step-dot">3</span>
          </div>
          <h3 class="quiz-question-title">Step 2: What is your comfortable budget?</h3>
          <p style="text-align:center; color:#cfd6d1; font-size:0.9rem;">We have curated treasures in every holiday price range:</p>
          <div class="quiz-options-grid">
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('budget', 'under-25')">
              <div class="quiz-option-icon">🎁</div>
              <span class="quiz-option-label">Under $25 / €22</span>
              <span class="quiz-option-desc">Secret Santa & thoughtful festive stocking stuffers</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('budget', 'under-50')">
              <div class="quiz-option-icon">🕯️</div>
              <span class="quiz-option-label">Sweet Spot: $25 - $50</span>
              <span class="quiz-option-desc">Luxury soy candles & handcrafted Belgian chocolates</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('budget', 'under-100')">
              <div class="quiz-option-icon">⭐</div>
              <span class="quiz-option-label">Premium: $50 - $100</span>
              <span class="quiz-option-desc">European mouth-blown baubles & merino wool throws</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('budget', 'luxury')">
              <div class="quiz-option-icon">👑</div>
              <span class="quiz-option-label">Ultimate Luxury: $100+</span>
              <span class="quiz-option-desc">Curated fireside hampers & heirloom collectibles</span>
            </div>
          </div>
        `;
      } else if (quizStep === 3) {
        quizBox.innerHTML = `
          <div class="quiz-progress-bar">
            <span class="quiz-step-dot active">✓</span>
            <div style="flex:1; height:2px; background:var(--color-gold-accent); margin:0 8px;"></div>
            <span class="quiz-step-dot active">✓</span>
            <div style="flex:1; height:2px; background:var(--color-gold-accent); margin:0 8px;"></div>
            <span class="quiz-step-dot active">3</span>
          </div>
          <h3 class="quiz-question-title">Step 3: What holiday vibe speaks to them?</h3>
          <p style="text-align:center; color:#cfd6d1; font-size:0.9rem;">Choose their holiday aesthetic:</p>
          <div class="quiz-options-grid">
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('vibe', 'cozy')">
              <div class="quiz-option-icon">🔥</div>
              <span class="quiz-option-label">Cozy Fireside Warmth</span>
              <span class="quiz-option-desc">Crackling candles, hot cider, and warm wool</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('vibe', 'glamour')">
              <div class="quiz-option-icon">✨</div>
              <span class="quiz-option-label">Sparkling European Glamour</span>
              <span class="quiz-option-desc">24K gold filigree, mouth-blown crystal & satin</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('vibe', 'nostalgia')">
              <div class="quiz-option-icon">🎄</div>
              <span class="quiz-option-label">Childhood Holiday Nostalgia</span>
              <span class="quiz-option-desc">Carved nutcrackers, gingerbread village & velvet stockings</span>
            </div>
            <div class="quiz-option-card" onclick="window.NoelApp.selectQuizOption('vibe', 'gourmet')">
              <div class="quiz-option-icon">🍫</div>
              <span class="quiz-option-label">Festive Gourmet Indulgence</span>
              <span class="quiz-option-desc">Swiss pralines, spiced champagne ganache & treats</span>
            </div>
          </div>
        `;
      } else if (quizStep === 4) {
        // Show result
        let match = CHRISTMAS_PRODUCTS[0];
        if (quizAnswers.recipient === 'him') match = CHRISTMAS_PRODUCTS[2]; // Blanket
        else if (quizAnswers.recipient === 'kids') match = CHRISTMAS_PRODUCTS[7]; // Nutcracker
        else if (quizAnswers.vibe === 'glamour') match = CHRISTMAS_PRODUCTS[1]; // Ornaments
        else if (quizAnswers.vibe === 'gourmet') match = CHRISTMAS_PRODUCTS[3]; // Chocolate
        else if (quizAnswers.budget === 'under-25') match = CHRISTMAS_PRODUCTS[5]; // Stocking

        const price = formatPrice(match.priceUSD, match.priceEUR);

        quizBox.innerHTML = `
          <div style="text-align:center; animation:fadeIn 0.5s ease;">
            <span style="background:var(--color-gold-accent); color:var(--color-primary-dark); font-weight:800; font-size:0.8rem; padding:4px 14px; border-radius:9999px; text-transform:uppercase;">
              🎉 98% Match Found!
            </span>
            <h3 style="font-family:var(--font-heading); font-size:2rem; margin:14px 0 8px;">
              ${match.name}
            </h3>
            <p style="color:#cfd6d1; max-width:520px; margin:0 auto 20px; font-size:0.95rem;">
              Based on your answers, this handcrafted heirloom piece is guaranteed to delight your recipient on Christmas morning.
            </p>

            <div style="display:inline-flex; align-items:center; gap:20px; background:rgba(255,255,255,0.1); border:1px solid rgba(212,175,55,0.4); padding:16px 24px; border-radius:12px; margin-bottom:24px;">
              <img src="${match.image}" alt="${match.name}" style="width:75px; height:75px; border-radius:8px; object-fit:cover;">
              <div style="text-align:left;">
                <span style="color:var(--color-gold-light); font-weight:700; font-size:1.3rem;">${price}</span>
                <span style="display:block; font-size:0.8rem; color:#b0b8b3;">${match.shippingInfo}</span>
                <span style="display:block; font-size:0.75rem; color:#84e184; font-weight:700; margin-top:2px;">Use code <strong>MATCH15</strong> for 15% OFF!</span>
              </div>
            </div>

            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
              <button class="btn btn-gold" onclick="window.NoelApp.addToCart('${match.id}', 1)">
                Add Matched Gift to Bag 🎁
              </button>
              <a href="product.html?id=${match.id}" class="btn btn-outline">
                View Full Details
              </a>
              <button class="btn btn-outline" onclick="window.NoelApp.resetQuiz()" style="font-size:0.85rem; padding:10px 18px;">
                Restart Quiz ↺
              </button>
            </div>
          </div>
        `;
      }
    }

    window.NoelApp.selectQuizOption = function (key, val) {
      quizAnswers[key] = val;
      quizStep++;
      renderQuizStep();
    };

    window.NoelApp.resetQuiz = function () {
      quizStep = 1;
      quizAnswers = { recipient: '', budget: '', vibe: '' };
      renderQuizStep();
    };

    renderQuizStep();
  }

  // ==========================================================================
  // 16. FLASH DEAL OF THE DAY COUNTDOWN
  // ==========================================================================
  function initFlashDealCountdown() {
    const hEl = document.getElementById('flash-hrs');
    const mEl = document.getElementById('flash-mins');
    const sEl = document.getElementById('flash-secs');
    if (!hEl) return;

    let timeLeft = 5 * 3600 + 42 * 60 + 19; // 5 hours 42 mins

    setInterval(() => {
      if (timeLeft > 0) timeLeft--;
      const hrs = Math.floor(timeLeft / 3600);
      const mins = Math.floor((timeLeft % 3600) / 60);
      const secs = timeLeft % 60;

      hEl.textContent = String(hrs).padStart(2, '0');
      mEl.textContent = String(mins).padStart(2, '0');
      sEl.textContent = String(secs).padStart(2, '0');
    }, 1000);
  }

  // ==========================================================================
  // 17. LIVE RECENT SALES ACTIVITY TOAST (Social Proof Ticker)
  // ==========================================================================
  function initLiveSalesToasts() {
    const salesEvents = [
      { name: 'Eleanor V.', city: 'Boston, MA (USA)', item: 'Winter Spice & Pine Candle', img: 'assets/images/product-candle.jpg', time: '2 minutes ago' },
      { name: 'Johannes K.', city: 'Munich, Germany (EU)', item: 'The Ultimate Holiday Hamper', img: 'assets/images/hero-banner.jpg', time: '4 minutes ago' },
      { name: 'Charlotte D.', city: 'London, UK', item: 'Aethelred Heirloom Glass Baubles', img: 'assets/images/product-ornaments.jpg', time: '1 minute ago' },
      { name: 'Pierre L.', city: 'Paris, France (EU)', item: 'Nordic Chunky Merino Wool Blanket', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80', time: '5 minutes ago' },
      { name: 'David M.', city: 'Chicago, IL (USA)', item: 'Personalized Heirloom Velvet Stocking', img: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=400&q=80', time: '3 minutes ago' }
    ];

    let toastEl = document.getElementById('live-sales-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'live-sales-toast';
      toastEl.className = 'live-sales-toast';
      document.body.appendChild(toastEl);
    }

    let currentIndex = 0;
    function showSale() {
      const s = salesEvents[currentIndex];
      toastEl.innerHTML = `
        <img src="${s.img}" alt="${s.item}" class="live-sales-thumb">
        <div class="live-sales-text">
          <strong>${s.name}</strong> from ${s.city}<br>
          purchased <em>${s.item}</em>
          <span class="live-sales-time">✓ Verified Purchase • ${s.time}</span>
        </div>
      `;
      toastEl.classList.add('show');

      setTimeout(() => {
        toastEl.classList.remove('show');
      }, 4500);

      currentIndex = (currentIndex + 1) % salesEvents.length;
    }

    // First appearance after 3 seconds, then repeats every 10 seconds
    setTimeout(() => {
      showSale();
      setInterval(showSale, 11000);
    }, 3500);
  }

  // ==========================================================================
  // 18. SPEND & SAVE TIERED REWARDS LADDER LOGIC
  // ==========================================================================
  function updateSpendSaveLadder() {
    const fill = document.getElementById('ladder-progress-fill');
    const statusEl = document.getElementById('ladder-status-msg');
    const step1 = document.getElementById('ladder-step-1');
    const step2 = document.getElementById('ladder-step-2');
    const step3 = document.getElementById('ladder-step-3');
    if (!fill || !statusEl) return;

    let subtotal = STATE.cart.reduce((sum, it) => {
      const p = STATE.currency === 'EUR' ? it.priceEUR : it.priceUSD;
      return sum + p * it.quantity;
    }, 0);

    const t1 = STATE.currency === 'EUR' ? 70 : 75;
    const t2 = STATE.currency === 'EUR' ? 110 : 120;
    const t3 = STATE.currency === 'EUR' ? 165 : 180;
    const currSym = STATE.currencySymbol;

    let pct = Math.min((subtotal / t3) * 100, 100);
    fill.style.width = `${pct}%`;

    if (step1) {
      if (subtotal >= t1) step1.classList.add('unlocked');
      else step1.classList.remove('unlocked');
    }
    if (step2) {
      if (subtotal >= t2) step2.classList.add('unlocked');
      else step2.classList.remove('unlocked');
    }
    if (step3) {
      if (subtotal >= t3) step3.classList.add('unlocked');
      else step3.classList.remove('unlocked');
    }

    if (subtotal >= t3) {
      statusEl.innerHTML = `🎉 <strong>All VIP Perks Unlocked!</strong> Use code <strong>NOELVIP20</strong> for 20% OFF!`;
    } else if (subtotal >= t2) {
      const diff = (t3 - subtotal).toFixed(2);
      statusEl.innerHTML = `🎁 Add <strong>${currSym}${diff}</strong> more to unlock <strong>20% OFF Entire Order!</strong>`;
    } else if (subtotal >= t1) {
      const diff = (t2 - subtotal).toFixed(2);
      statusEl.innerHTML = `🕯️ Add <strong>${currSym}${diff}</strong> more to get a <strong>Free Deluxe Candle ($38 Value)!</strong>`;
    } else {
      const diff = (t1 - subtotal).toFixed(2);
      statusEl.innerHTML = `🚚 Add <strong>${currSym}${diff}</strong> more to unlock <strong>Free Express Delivery!</strong>`;
    }
  }

  // ==========================================================================
  // 19. SECRET SANTA VOUCHER REVEAL
  // ==========================================================================
  function revealSecretSanta() {
    const btn = document.getElementById('secret-scratch-btn');
    const pill = document.getElementById('voucher-revealed-pill');
    if (!btn || !pill) return;

    btn.style.display = 'none';
    pill.style.display = 'inline-block';

    if (navigator.clipboard) {
      navigator.clipboard.writeText('SANTA15').then(() => {
        showToast('🎁 Secret code SANTA15 copied to clipboard! (15% OFF applied)');
      }).catch(() => {
        showToast('🎁 Secret Code: SANTA15 (Use at checkout for 15% OFF)');
      });
    } else {
      showToast('🎁 Secret Code: SANTA15 (Use at checkout for 15% OFF)');
    }
  }

  // ==========================================================================
  // 20. PDP COUPON & VOUCHER LOGIC
  // ==========================================================================
  function applyPDPCoupon(code, discountVal, prodId, isFixed = false, triggerToast = true) {
    const product = (typeof CHRISTMAS_PRODUCTS !== 'undefined')
      ? (CHRISTMAS_PRODUCTS.find(p => p.id === prodId) || CHRISTMAS_PRODUCTS[0])
      : null;

    // Reset all coupon buttons & cards
    document.querySelectorAll('.pdp-coupon-apply-btn').forEach(btn => {
      btn.classList.remove('applied');
      btn.textContent = 'Apply';
    });
    document.querySelectorAll('.pdp-coupon-card').forEach(card => {
      card.classList.remove('applied');
    });

    const activeBtn = document.getElementById(`btn-coupon-${code}`);
    const activeCard = document.getElementById(`coupon-card-${code}`);
    if (activeBtn) {
      activeBtn.classList.add('applied');
      activeBtn.textContent = '✓ Applied';
    }
    if (activeCard) {
      activeCard.classList.add('applied');
    }

    const clipCheck = document.getElementById('clip-coupon-check');
    if (clipCheck) {
      clipCheck.checked = (code === 'NOEL15');
    }

    // Calculate savings
    let price = product ? (STATE.currency === 'EUR' ? product.priceEUR : product.priceUSD) : 56;
    let originalPrice = product ? (STATE.currency === 'EUR' ? product.originalPriceEUR : product.originalPriceUSD) : 72;
    let discountAmount = 0;
    if (isFixed) {
      discountAmount = STATE.currency === 'EUR' ? (discountVal * 0.9) : discountVal;
    } else {
      discountAmount = price * (discountVal / 100);
    }
    let discountedPrice = Math.max(price - discountAmount, 0);

    // Update main price display to discounted price cleanly (no stacking!)
    const mainPriceEl = document.getElementById('pdp-main-price');
    const wasPriceEl = document.getElementById('pdp-price-was');
    const saveBadgeEl = document.getElementById('pdp-save-badge');
    if (mainPriceEl) {
      mainPriceEl.textContent = `${STATE.currencySymbol}${discountedPrice.toFixed(2)}`;
    }
    if (wasPriceEl) {
      wasPriceEl.textContent = `${STATE.currencySymbol}${price.toFixed(2)}`;
    }
    if (saveBadgeEl) {
      const totalPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
      saveBadgeEl.textContent = `-${Math.max(totalPercent, discountVal)}% OFF`;
    }

    // Show dedicated active coupon banner cleanly
    const banner = document.getElementById('pdp-active-coupon-banner');
    const codeEl = document.getElementById('active-coupon-code');
    const savingsEl = document.getElementById('active-coupon-savings');
    if (banner && codeEl && savingsEl) {
      banner.style.display = 'flex';
      codeEl.textContent = code;
      savingsEl.textContent = `Save ${STATE.currencySymbol}${discountAmount.toFixed(2)}`;
    }

    // Feedback message
    const feedbackBox = document.getElementById('pdp-coupon-feedback');
    const feedbackText = document.getElementById('pdp-coupon-feedback-text');
    if (feedbackBox && feedbackText) {
      feedbackBox.style.display = 'flex';
      feedbackText.innerHTML = `Coupon <strong>${code}</strong> active! You save <strong>${STATE.currencySymbol}${discountAmount.toFixed(2)}</strong> on this order. Auto-applied to your holiday bag!`;
    }

    // Persist active coupon
    const couponData = { code, discountVal, isFixed, discountAmount };
    localStorage.setItem('noel_active_coupon', JSON.stringify(couponData));

    if (triggerToast) {
      showToast(`🎉 Coupon ${code} Applied! Saved ${STATE.currencySymbol}${discountAmount.toFixed(2)}`);
    }

    updateCartUI();
  }

  function removeActiveCoupon() {
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id') || 'prod-candle';
    const product = (typeof CHRISTMAS_PRODUCTS !== 'undefined')
      ? (CHRISTMAS_PRODUCTS.find(p => p.id === prodId) || CHRISTMAS_PRODUCTS[0])
      : null;

    localStorage.removeItem('noel_active_coupon');
    document.querySelectorAll('.pdp-coupon-apply-btn').forEach(btn => {
      btn.classList.remove('applied');
      btn.textContent = 'Apply';
    });
    document.querySelectorAll('.pdp-coupon-card').forEach(card => {
      card.classList.remove('applied');
    });

    if (product) {
      const priceNow = formatPrice(product.priceUSD, product.priceEUR);
      const priceWas = formatPrice(product.originalPriceUSD, product.originalPriceEUR);
      const mainPriceEl = document.getElementById('pdp-main-price');
      const wasPriceEl = document.getElementById('pdp-price-was');
      const saveBadgeEl = document.getElementById('pdp-save-badge');
      if (mainPriceEl) mainPriceEl.textContent = priceNow;
      if (wasPriceEl) wasPriceEl.textContent = priceWas;
      if (saveBadgeEl) saveBadgeEl.textContent = '-20% OFF';
    }

    const banner = document.getElementById('pdp-active-coupon-banner');
    if (banner) banner.style.display = 'none';

    const feedbackBox = document.getElementById('pdp-coupon-feedback');
    if (feedbackBox) feedbackBox.style.display = 'none';

    showToast('Coupon removed.');
    updateCartUI();
  }

  // Order Tracking Handler
  function handleTrackLookup() {
    const orderInput = document.getElementById('track-order-id');
    const resultCard = document.getElementById('tracking-result-card');
    const submitBtn = document.getElementById('btn-track-submit');

    if (!orderInput || !resultCard) return;

    const orderId = orderInput.value.trim() || '#NOEL-84920';
    
    if (submitBtn) {
      submitBtn.innerHTML = 'Scanning Courier Satellites... 🛰️';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Track Holiday Package
        `;
        submitBtn.disabled = false;
      }

      const resOrderEl = document.getElementById('res-order-id');
      if (resOrderEl) resOrderEl.textContent = orderId.toUpperCase();

      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Animate progress bar
      const fillBar = document.getElementById('timeline-bar-fill');
      if (fillBar) {
        fillBar.style.width = '0%';
        setTimeout(() => {
          fillBar.style.width = '75%';
        }, 150);
      }

      showToast('Live tracking details loaded!');
    }, 600);
  }

  function fillDemoTracking() {
    const orderInput = document.getElementById('track-order-id');
    const emailInput = document.getElementById('track-email');
    if (orderInput) orderInput.value = '#NOEL-84920';
    if (emailInput) emailInput.value = 'clara.vance@example.com';
    handleTrackLookup();
  }

  // FAQ Page Category Switching & Search
  function switchFAQCategory(category, buttonEl) {
    document.querySelectorAll('.faq-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonEl) buttonEl.classList.add('active');

    const sections = document.querySelectorAll('.faq-group-section');
    sections.forEach(section => {
      if (category === 'all' || section.getAttribute('data-category') === category) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  }

  function filterFAQ(query) {
    const q = query.toLowerCase().trim();
    const items = document.querySelectorAll('.faq-group-section .accordion-item');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'block';
        if (q && text.includes(q)) {
          item.classList.add('open');
        }
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Global methods
  window.NoelApp = {
    addToCart,
    updateQty: updateQuantity,
    removeItem,
    openCart,
    closeCart,
    openQuickView,
    closeQuickView,
    setPDPImage,
    selectPill,
    showToast,
    updateSpendSaveLadder,
    revealSecretSanta,
    applyPDPCoupon,
    toggleClipCoupon,
    removeActiveCoupon,
    handleTrackLookup,
    fillDemoTracking,
    switchFAQCategory,
    filterFAQ
  };

})();

