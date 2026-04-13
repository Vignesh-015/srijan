// amazon.js - Firebase Powered Features

const firebaseConfig = {
  apiKey: "AIzaSyAHpZsqFT9qxHYFYWWqR3S3e7xMF7Lv1IQ",
  authDomain: "e-commerce-9e999.firebaseapp.com",
  databaseURL: "https://e-commerce-9e999-default-rtdb.firebaseio.com",
  projectId: "e-commerce-9e999",
  storageBucket: "e-commerce-9e999.firebasestorage.app",
  messagingSenderId: "386718539115",
  appId: "1:386718539115:web:d04a2bec735843dfc0c02e",
  measurementId: "G-YL3KNQQB85"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = typeof firebase !== 'undefined' ? firebase.database() : null;

// Helper to escape email for Firebase keys
function safeEmail(email) {
    return email ? email.replace(/[.#$\\[\\]]/g, '_') : 'guest';
}

// 1. Merge Local Custom Products into allProducts
if(db) {
    db.ref('custom_products').once('value').then(snapshot => {
        let customProducts = [];
        snapshot.forEach(child => { customProducts.push(child.val()); });
        if(typeof allProducts !== 'undefined' && customProducts.length > 0) {
            allProducts.push(...customProducts);
            // trigger re-renders
            if(typeof generateProductCard !== 'undefined') {
                const fc = document.getElementById('featured-products');
                if(fc) fc.innerHTML = allProducts.filter(p=>p.isFeatured).map(generateProductCard).join('');
                const nc = document.getElementById('new-arrivals');
                if(nc) nc.innerHTML = allProducts.filter(p=>p.isNew).map(generateProductCard).join('');
                const sc = document.getElementById('shop-products');
                if(sc && typeof updateShopGrid === 'function') {
                    const u = new URLSearchParams(window.location.search);
                    updateShopGrid(u.get('search') || '', 1);
                }
            }
        }
    });
}

// 2. Dynamic Navigation and Enhancements
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('navbar');
    if(nav) {
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const accountText = currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : `Account`;
        
        const amazonLinksHtml = `
            <li><a href="wishlist.html"><i class="bi bi-heart"></i> List</a></li>
            <li><a href="account.html"><i class="bi bi-person"></i> ${accountText}</a></li>
            <li><a href="seller.html"><i class="bi bi-shop"></i> Seller</a></li>
        `;
        
        const lgBag = document.getElementById('lg-bag');
        if(lgBag) {
             const tempDiv = document.createElement('div');
             tempDiv.innerHTML = amazonLinksHtml;
             Array.from(tempDiv.children).forEach(el => nav.insertBefore(el, lgBag));
        }

        const spAdd = document.getElementById('sp-add');
        if(spAdd) {
            // *NEW FEATURE: Amazon style Delivery Estimation*
            const deliverySection = document.createElement('div');
            deliverySection.style.margin = '15px 0';
            deliverySection.style.padding = '15px';
            deliverySection.style.border = '1px solid #e1e1e1';
            deliverySection.style.borderRadius = '8px';
            deliverySection.style.backgroundColor = '#fbfbfb';
            
            const d = new Date();
            d.setDate(d.getDate() + 3);
            const fastDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            d.setDate(d.getDate() + 4);
            const stdDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            deliverySection.innerHTML = `
              <p style="margin:0; font-size: 14px;"><i class="bi bi-truck" style="color:#088178;font-size:18px;"></i> <strong>Free Delivery</strong> by <strong style="color:#111;">${stdDate}</strong>.</p>
              <p style="margin:5px 0 0 0; font-size: 14px;"><i class="bi bi-lightning-charge" style="color:#f08804;font-size:18px;"></i> Fastest delivery by <strong>${fastDate}</strong>. Order within <span style="color:#b12704;font-weight:bold;">14 hrs 32 mins</span></p>
              <p style="margin:10px 0 0 0; font-size: 13px; color: #007185; cursor:pointer;"><i class="bi bi-geo-alt"></i> Deliver to India - Select Location</p>
              <h4 style="margin-top:15px; color:#007600; font-size:16px;">In Stock</h4>
            `;

            const spPrice = document.getElementById('sp-price');
            if(spPrice) spPrice.parentNode.insertBefore(deliverySection, spPrice.nextSibling);

            const buyNowBtn = document.createElement('button');
            buyNowBtn.className = 'normal';
            buyNowBtn.style.backgroundColor = '#ffa41c';
            buyNowBtn.style.color = '#111';
            buyNowBtn.style.marginLeft = '10px';
            buyNowBtn.innerText = 'Buy Now';
            buyNowBtn.onclick = () => {
                const qty = document.getElementById('sp-qty').value;
                const urlParams = new URLSearchParams(window.location.search);
                const productId = urlParams.get('id');
                if(typeof addToCart === 'function') addToCart(productId, parseInt(qty));
                if(typeof proceedToCheckout === 'function') {
                    proceedToCheckout();
                } else {
                    window.location.href = 'checkout.html';
                }
            };
            spAdd.parentNode.insertBefore(buyNowBtn, spAdd.nextSibling);

            const wlBtn = document.createElement('button');
            wlBtn.className = 'normal';
            wlBtn.style.backgroundColor = '#e3e6f3';
            wlBtn.style.color = '#1a1a1a';
            wlBtn.style.marginLeft = '10px';
            wlBtn.innerHTML = '<i class="bi bi-heart"></i> Save';
            wlBtn.onclick = () => {
                if(!currentUser) {
                    alert('Please login to add to wishlist!');
                    window.location.href = 'account.html';
                    return;
                }
                const urlParams = new URLSearchParams(window.location.search);
                const productId = urlParams.get('id');
                const userEmailEscaped = safeEmail(currentUser.email);
                
                db.ref("wishlist/" + userEmailEscaped).once('value').then(snap => {
                    let w = snap.val() || [];
                    if(!w.includes(productId)) {
                        w.push(productId);
                        db.ref("wishlist/" + userEmailEscaped).set(w).then(() => {
                            if(typeof showToast === 'function') showToast('Added to Wishlist');
                        });
                    } else {
                        if(typeof showToast === 'function') showToast('Already in Wishlist');
                    }
                });
            };
            buyNowBtn.parentNode.insertBefore(wlBtn, buyNowBtn.nextSibling);
            
            generateReviewsUIFirebase();
        }
    }
});

function generateReviewsUIFirebase() {
    const container = document.querySelector('.single-pro-details');
    if(!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const reviewSection = document.createElement('div');
    reviewSection.style.marginTop = '40px';
    reviewSection.style.borderTop = '1px solid #ccc';
    reviewSection.style.paddingTop = '20px';
    reviewSection.id = 'reviews-section-container';
    
    // Initial fetch
    if(db) {
        db.ref('reviews/' + productId).once('value').then(snap => {
            renderReviewUI(snap.val(), reviewSection, productId);
        });
    }
    container.appendChild(reviewSection);
}

function renderReviewUI(prodReviewsMap, section, productId) {
    let reviewsHtml = `<h4>Customer Reviews</h4>`;
    const prodReviews = prodReviewsMap ? Object.values(prodReviewsMap) : [];

    if(prodReviews.length === 0) {
        reviewsHtml += `<p>No reviews yet. Be the first to review!</p>`;
    } else {
        prodReviews.forEach(r => {
            let stars = '';
            for(let i=0; i<r.rating; i++) stars += '<i class="bi bi-star-fill" style="color: #f08804;"></i>';
            reviewsHtml += `
            <div style="margin-bottom: 15px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <div style="font-weight: bold; margin-bottom: 5px;">
                    <i class="bi bi-person-circle" style="color:#888;"></i> ${r.user} 
                    <span style="font-weight: normal; font-size: 12px; color: #c45500;">- Verified Purchase</span>
                </div>
                <div style="margin-bottom: 8px;">${stars}</div>
                <p style="margin: 0; font-size: 14px;">${r.text}</p>
            </div>`;
        });
    }

    reviewsHtml += `
        <div style="margin-top: 25px; background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h5 style="margin-bottom: 15px;">Write a Review</h5>
            <select id="review-stars" style="padding: 8px; margin-bottom: 15px; width: 100%; border: 1px solid #ccc; border-radius: 4px;">
                <option value="5">Excellent (5 Stars)</option>
                <option value="4">Good (4 Stars)</option>
                <option value="3">Average (3 Stars)</option>
                <option value="2">Poor (2 Stars)</option>
                <option value="1">Terrible (1 Star)</option>
            </select>
            <textarea id="review-text" rows="4" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px;" placeholder="What do you like or dislike about this product?"></textarea>
            <button class="normal" style="background-color: #f0c14b; border: 1px solid #a88734; color: #111;" onclick="submitReviewFirebase('${productId}')">Submit Review</button>
        </div>
    `;
    section.innerHTML = reviewsHtml;
}

window.submitReviewFirebase = function(productId) {
    const text = document.getElementById('review-text').value;
    const rating = document.getElementById('review-stars').value;
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    
    if(!text.trim()) {
        if(typeof showToast === 'function') showToast('Please write a review before submitting.');
        return;
    }

    let rData = {
        user: currentUser ? currentUser.name : 'Guest User',
        rating: parseInt(rating),
        text: text,
        date: new Date().toISOString()
    };

    if(db) {
        db.ref('reviews/' + productId).push(rData).then(() => {
            if(typeof showToast === 'function') showToast('Review submitted successfully!');
            setTimeout(() => location.reload(), 1000);
        });
    }
}

window.saveOrderToHistory = function(cartObj, total) {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const userEmailEscaped = safeEmail(currentUser ? currentUser.email : 'guest');
    
    const newOrder = {
        orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
        date: new Date().toISOString(),
        items: cartObj,
        total: total,
        status: 'Processing',
        user: userEmailEscaped
    };
    
    if(db) {
        db.ref('orders/' + newOrder.orderId).set(newOrder);
    }
    return newOrder.orderId;
}
