const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if(bar){
  bar.addEventListener('click', () => {
    nav.classList.add('active');
  })
}

if(close){
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  })
}

// Back to Top Button
const bttBtn = document.createElement('button');
bttBtn.innerHTML = '<i class="bi bi-arrow-up"></i> Back to top';
bttBtn.className = 'normal';
bttBtn.style.position = 'fixed';
bttBtn.style.bottom = '20px';
bttBtn.style.right = '20px';
bttBtn.style.zIndex = '100000';
bttBtn.style.backgroundColor = '#485769';
bttBtn.style.color = '#fff';
bttBtn.style.padding = '10px 20px';
bttBtn.style.display = 'none';
bttBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
bttBtn.style.border = 'none';

bttBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
document.body.appendChild(bttBtn);

window.addEventListener('scroll', () => {
    if(window.scrollY > 500) {
        bttBtn.style.display = 'block';
    } else {
        bttBtn.style.display = 'none';
    }
});

// Ensure products data is available
const allProducts = typeof products !== 'undefined' ? products : [];

// Helper to generate star HTML
function generateStars(rating) {
  let starsHtml = '';
  for(let i = 0; i < rating; i++) {
    starsHtml += '<i class="bi bi-star-fill"></i>';
  }
  return starsHtml;
}

// --- Amazon-style Additions (Search, Cart Badge, Toast) ---

// Inject Search Bar dynamically
if(nav) {
  const searchLi = document.createElement('li');
  searchLi.innerHTML = `<div class="search-bar">
    <input type="text" id="search-input" placeholder="Search products..." onkeyup="searchProducts(event)">
  </div>`;
  const lgBag = document.getElementById('lg-bag');
  if(lgBag) nav.insertBefore(searchLi, lgBag);
}

// Attach Badge Spans to cart icons
function attachBadges() {
  const lgBagLink = document.querySelector('#lg-bag a');
  if(lgBagLink && !document.getElementById('cart-badge')) {
    lgBagLink.style.position = 'relative';
    lgBagLink.innerHTML += `<span id="cart-badge" class="cart-badge">0</span>`;
  }
  
  const mobileBagLink = document.querySelector('#mobile a');
  if(mobileBagLink && !document.getElementById('cart-badge-mobile')) {
    mobileBagLink.style.position = 'relative';
    mobileBagLink.innerHTML += `<span id="cart-badge-mobile" class="cart-badge">0</span>`;
  }
}
attachBadges();

// Toast Container for popups
let toastContainer = document.getElementById('toast-container');
if(!toastContainer) {
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);
}

// Show a sleek toast instead of an alert
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="bi bi-check-circle-fill" style="color: #f08804;"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Search Logic
function showAutocomplete(query) {
    let box = document.getElementById('autocomplete-box');
    if(!box) {
        box = document.createElement('div');
        box.id = 'autocomplete-box';
        box.style.position = 'absolute';
        box.style.top = '40px'; box.style.left = '0'; box.style.background = '#fff';
        box.style.width = '100%'; box.style.zIndex = '9999'; box.style.border = '1px solid #ccc';
        document.querySelector('.search-bar').appendChild(box);
    }
    if(!query) { box.innerHTML = ''; return; }
    const matches = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0,5);
    box.innerHTML = matches.map(p => `<div style="padding:10px; cursor:pointer; border-bottom:1px solid #eee;" onclick="window.location.href='sproduct.html?id=${p.id}'"><img src="${p.image}" style="width:30px; vertical-align:middle; margin-right:10px">${p.name}</div>`).join('');
}
function searchProducts(event) {
  const query = event.target.value; showAutocomplete(query);
  if(event.key === 'Enter') {
    if(window.location.pathname.indexOf('shop.html') === -1) {
      window.location.href = 'shop.html?search=' + encodeURIComponent(query);
    } else {
      updateShopGrid(query, 1);
      document.getElementById('search-input').blur(); // lose focus
    }
  }
}

// ---------------------------

// Render a single product card
function generateProductCard(product) {
  return `
    <div class="pro" onclick="window.location.href='sproduct.html?id=${product.id}';">
      <img src="${product.image}" loading="lazy" alt="${product.name}">
      <div class="des">
        <span>${product.brand}</span>
        <h5>${product.name}</h5>
        <div class="star">
          ${generateStars(product.rating)}
        </div>
        <h4>₹${product.price}</h4>
      </div>
      <a href="#" aria-label="Add to Cart" onclick="event.stopPropagation(); addToCart('${product.id}'); return false;">
        <i class="bi bi-cart cart"></i>
      </a>
    </div>
  `;
}

// Populate product grids
const featuredContainer = document.getElementById('featured-products');
const newContainer = document.getElementById('new-arrivals');
const shopContainer = document.getElementById('shop-products');

if(featuredContainer) {
  const featured = allProducts.filter(p => p.isFeatured);
  featuredContainer.innerHTML = featured.map(generateProductCard).join('');
}

if(newContainer) {
  const newArrivals = allProducts.filter(p => p.isNew);
  newContainer.innerHTML = newArrivals.map(generateProductCard).join('');
}

// --- Pagination & Shop Grid ---
const itemsPerPage = 8;
let currentPage = 1;
let currentSearchQuery = '';
let currentSortMethod = 'default';
let currentFilteredProducts = [];

function sortShopGrid(method) {
  currentSortMethod = method;
  updateShopGrid(currentSearchQuery, 1);
}

function updateShopGrid(query = '', page = 1) {
  if(!shopContainer) return;
  
  currentSearchQuery = query;
  let filtered = query 
    ? allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())) 
    : [...allProducts];

  if(currentSortMethod === 'low-high') {
    filtered.sort((a,b) => a.price - b.price);
  } else if (currentSortMethod === 'high-low') {
    filtered.sort((a,b) => b.price - a.price);
  }

  currentFilteredProducts = filtered;
  currentPage = page;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = currentFilteredProducts.slice(startIndex, endIndex);

  shopContainer.innerHTML = paginatedItems.length > 0 
    ? paginatedItems.map(generateProductCard).join('') 
    : '<p style="padding:40px; font-size:18px;">No products found matching your search.</p>';

  renderPagination();
}

function renderPagination() {
  const paginationContainer = document.getElementById('pagination');
  if(!paginationContainer) return;

  const totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);
  let paginationHtml = '';
  
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  for(let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    paginationHtml += `<a href="#" style="${isActive ? 'opacity: 1;' : 'opacity: 0.5; background-color: #cce7d0; color: #1a1a1a;'}" onclick="event.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); updateShopGrid(currentSearchQuery, ${i});">${i}</a>`;
  }

  if(currentPage < totalPages) {
    paginationHtml += `<a href="#" onclick="event.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); updateShopGrid(currentSearchQuery, ${currentPage + 1});"><i class="bi bi-arrow-right-short"></i></a>`;
  }

  paginationContainer.innerHTML = paginationHtml;
}

if(shopContainer) {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQ = urlParams.get('search');
  updateShopGrid(searchQ || '', 1);
}

// --- Single Product Page Logic ---
const spBrand = document.getElementById('sp-brand');
if(spBrand) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const product = allProducts.find(p => p.id === productId) || allProducts[0]; // fallback to first item
  
  if(product) {
    document.getElementById('MainImg').src = product.image;
    document.getElementById('sp-brand').innerText = `Home / ${product.category} / ${product.brand}`;
    document.getElementById('sp-name').innerText = product.name;
    document.getElementById('sp-price').innerText = `₹${product.price}`;
    
    // Dynamically populate small-img gallery with heavily related product pictures
    const smallImgs = document.getElementsByClassName('small-img');
    if(smallImgs && smallImgs.length > 0) {
        // Build a highly specific keyword from the product name and category
        const wordArr = product.name.split(' ');
        const mainKeyword = wordArr.length > 2 ? wordArr[wordArr.length - 1] : wordArr[0];
        const searchTags = encodeURIComponent(product.category + ',' + mainKeyword).toLowerCase();
        
        for(let i=0; i<smallImgs.length; i++) {
            // Append random query param to ensure 4 distinct related images!
            smallImgs[i].src = `https://loremflickr.com/400/400/${searchTags}/all?random=${i+1}`;
        }
    }

    // Hide size options practically if accessory
    if(product.category === 'Accessories') {
      const sizeSelect = document.getElementById('sp-size');
      if(sizeSelect) sizeSelect.style.display = 'none';
    }

    document.getElementById('sp-add').onclick = () => {
       const qty = document.getElementById('sp-qty').value;
       addToCart(product.id, parseInt(qty));
    };

    // Load related products
    const relatedContainer = document.getElementById('related-products');
    if(relatedContainer) {
      const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
      relatedContainer.innerHTML = related.length > 0 ? related.map(generateProductCard).join('') : '<p style="padding-left:10px;">No related products found.</p>';
    }
  }
}

// --- Cart Logic ---
let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || {};

function saveCart() {
  localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
}

// Dynamically update the little orange cart popup badge
function updateBadge() {
  let count = 0;
  for(let key in cart) {
    count += cart[key].quantity;
  }
  const b1 = document.getElementById('cart-badge');
  const b2 = document.getElementById('cart-badge-mobile');
  if(b1) b1.innerText = count;
  if(b2) b2.innerText = count;
}
updateBadge(); // init

// Add item to shopping cart
function addToCart(productId, qtyToAdd = 1) {
  if (cart[productId]) {
    cart[productId].quantity += qtyToAdd;
  } else {
    const product = allProducts.find(p => p.id === productId);
    if(product) {
       cart[productId] = { ...product, quantity: qtyToAdd };
    }
  }
  saveCart();
  updateBadge();
  showToast('Added to Cart');
}

// Remove item from shopping cart
function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  updateBadge();
  renderCart();
}

// Update quantity securely
function updateQuantity(productId, newQuantity) {
  let qty = parseInt(newQuantity);
  if (isNaN(qty) || qty < 1) qty = 1;

  if(cart[productId]) {
    cart[productId].quantity = qty;
    saveCart();
    updateBadge();
    renderCart(); // Re-render table and totals
  }
}

// Render Cart Page Elements
const cartContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('cart-subtotal');
const grandtotalEl = document.getElementById('cart-grandtotal');

let currentDiscount = 0;
window.applyPromo = function() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    if(code === 'SAVE10') { currentDiscount = 0.10; showToast('10% off applied!'); }
    else if(code === 'WELCOME20') { currentDiscount = 0.20; showToast('20% off applied!'); }
    else { currentDiscount = 0; showToast('Invalid promo code'); }
    renderCart();
};

function renderCart() {
  if(!cartContainer) return; // Not on the cart page

  if (Object.keys(cart).length === 0) {
    cartContainer.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; font-weight: 600;">Your Amazon Cart is empty.</td></tr>`;
    if(subtotalEl) subtotalEl.innerText = '₹0.00';
    if(grandtotalEl) grandtotalEl.innerText = '₹0.00';
    return;
  }

  let html = '';
  let total = 0;

  for (const id in cart) {
    const item = cart[id];
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    html += `
      <tr>
        <td>
          <a href="#" aria-label="Remove item" onclick="event.preventDefault(); removeFromCart('${id}')">
            <i class="bi bi-trash"></i>
          </a>
        </td>
        <td><img src="${item.image}" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td><input type="number" value="${item.quantity}" onchange="updateQuantity('${id}', this.value)" min="1"></td>
        <td>₹${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }

  cartContainer.innerHTML = html;
  if(subtotalEl) subtotalEl.innerText = `₹${total.toFixed(2)}`;
  let gt = total - (total * currentDiscount);
  if(grandtotalEl) grandtotalEl.innerText = `₹${gt.toFixed(2)}`;
  window.ecommerce_finalTotal = gt;
}

// Initialize Cart Page if applicable
if(cartContainer) {
  renderCart();
}

// --- Checkout & Razorpay Logic ---
window.proceedToCheckout = function() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if(!currentUser) {
        showToast('Please login or signup to proceed.');
        setTimeout(() => window.location.href = 'account.html', 1500);
        return;
    }
    window.location.href = 'checkout.html';
};

const checkoutItemsEl = document.getElementById('checkout-items');
const checkoutTotalEl = document.getElementById('checkout-total');
const payBtn = document.getElementById('pay-btn');

if(checkoutItemsEl) {
  let finalTotal = 0;
  let html = '';

  if (Object.keys(cart).length === 0) {
    checkoutItemsEl.innerHTML = '<p>Your cart is empty. Please select products from the shop before checking out.</p>';
    if(payBtn) {
       payBtn.disabled = true;
       payBtn.style.opacity = '0.5';
    }
  } else {
    for (const id in cart) {
      const item = cart[id];
      const itemTotal = item.price * item.quantity;
      finalTotal += itemTotal;
      html += `
        <div class="chk-item">
          <span style="flex:2;">${item.quantity}x ${item.name}</span>
          <span style="font-weight:600;">₹${itemTotal.toFixed(2)}</span>
        </div>
      `;
    }
    checkoutItemsEl.innerHTML = html;
    if (window.ecommerce_finalTotal !== undefined) finalTotal = window.ecommerce_finalTotal;
    if(checkoutTotalEl) checkoutTotalEl.innerText = `₹${finalTotal.toFixed(2)}`;

    // Razorpay Implementation
    if(payBtn) {
      payBtn.onclick = async function(e){
        e.preventDefault();
        
        // Validate Address Form
        const name = document.getElementById('chk-name').value;
        const phone = document.getElementById('chk-phone').value;
        const address = document.getElementById('chk-address').value;
        const city = document.getElementById('chk-city').value;
        const pin = document.getElementById('chk-pin').value;
        
        if(!name || !phone || !address || !city || !pin) {
          showToast('Please fill out all delivery information fields.');
          return;
        }

        const exactAmountInPaise = Math.round(finalTotal * 100);
        payBtn.innerText = "Processing...";
        payBtn.disabled = true;

        try {
          // 1. Retrieve Server-Side order_id natively required for Live Mode
          const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: exactAmountInPaise })
          });
          
          if (!response.ok) {
            const errResult = await response.json();
            throw new Error(errResult.error || 'Server Order Generation Failed');
          }

          const order = await response.json();
          
          // Securely fetch public key config
          const configRes = await fetch('/api/config');
          const config = await configRes.json();

          // 2. Safely initialize Razorpay overlay
          const options = {
            "key": config.razorpayKeyId, // Frontend receives it securely from backend
            "amount": order.amount,
            "currency": order.currency,
            "order_id": order.id, // Successfully generated server-side Order ID injected!
            "name": "Cara E-Commerce",
            "description": "Secure Checkout",
            "image": "img/logo.png",
            "handler": function (res) {
               if(typeof saveOrderToHistory === 'function') {
                   saveOrderToHistory(cart, finalTotal);
               }
               cart = {};
               saveCart();
               updateBadge();
               window.location.href = 'success.html';
            },
            "prefill": {
                "name": name,
                "contact": phone
            },
            "theme": {
                "color": "#088178"
            }
          };
          
          const rzp1 = new Razorpay(options);
          rzp1.on('payment.failed', function (res){
            showToast('Payment Failed: ' + (res.error ? res.error.description : 'Cancelled'));
            payBtn.innerText = "Pay securely via Razorpay";
            payBtn.disabled = false;
          });
          rzp1.open();

        } catch(error) {
          showToast('Payment Error: Ensure backend (node server.js) is running on localhost:3000!');
          console.error(error);
          payBtn.innerText = "Pay securely via Razorpay";
          payBtn.disabled = false;
        }
      };
    }
  }
}

// --- Recently Viewed Items ---
const urlPrms = new URLSearchParams(window.location.search);
const currUrlId = urlPrms.get('id');

// If on single product page, update recently viewed array
if (window.location.pathname.includes('sproduct.html') && currUrlId && allProducts.length > 0) {
    let recent = JSON.parse(localStorage.getItem('ecommerce_recently_viewed')) || [];
    recent = recent.filter(id => id !== currUrlId);
    recent.unshift(currUrlId);
    if(recent.length > 6) recent.pop();
    localStorage.setItem('ecommerce_recently_viewed', JSON.stringify(recent));
}

// Render the Recently Viewed module globally (except checkout)
if(!window.location.pathname.includes('checkout.html') && typeof allProducts !== 'undefined') {
    let recentIds = JSON.parse(localStorage.getItem('ecommerce_recently_viewed')) || [];
    recentIds = recentIds.filter(id => id !== currUrlId); // don't show current item
    
    if(recentIds.length > 0) {
        const rvProducts = recentIds.map(id => allProducts.find(p => p.id === id)).filter(p => p);
        if(rvProducts.length > 0) {
            const section = document.createElement('section');
            section.className = 'section-p1';
            section.id = 'product1'; // reuse product1 styling
            section.style.borderTop = '1px solid #ccc';
            
            section.innerHTML = `
                <h2 style="text-align:left; font-size:24px; color:#c45500;">Inspired by your browsing history</h2>
                <p style="text-align:left;">Recently viewed items based on your session.</p>
                <div class="pro-container" style="justify-content: flex-start; gap: 2.66%;">
                    ${rvProducts.map(generateProductCard).join('')}
                </div>
            `;
            
            const newsletterEl = document.getElementById('newsletter');
            if(newsletterEl) {
                newsletterEl.parentNode.insertBefore(section, newsletterEl);
            } else if(document.querySelector('footer')) {
                document.querySelector('footer').parentNode.insertBefore(section, document.querySelector('footer'));
            }
        }
    }
}