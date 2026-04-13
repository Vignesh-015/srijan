const fs = require('fs');

// 1. Promo Code Engine in cart.html and script.js
let cartContent = fs.readFileSync('cart.html', 'utf8');
if (!cartContent.includes('id="promo-input"')) {
    cartContent = cartContent.replace(
        `<input type="text" placeholder="Enter Your Coupon">`,
        `<input type="text" id="promo-input" placeholder="Enter Your Coupon">`
    ).replace(
        `<button class="normal">Apply</button>`,
        `<button class="normal" onclick="applyPromo()">Apply</button>`
    );
    fs.writeFileSync('cart.html', cartContent);
}

let scriptContent = fs.readFileSync('script.js', 'utf8');
if (!scriptContent.includes('applyPromo()')) {
    scriptContent = scriptContent.replace(
        `function renderCart() {`,
        `let currentDiscount = 0;
window.applyPromo = function() {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    if(code === 'SAVE10') { currentDiscount = 0.10; showToast('10% off applied!'); }
    else if(code === 'WELCOME20') { currentDiscount = 0.20; showToast('20% off applied!'); }
    else { currentDiscount = 0; showToast('Invalid promo code'); }
    renderCart();
};

function renderCart() {`
    ).replace(
        `if(subtotalEl) subtotalEl.innerText = \`₹\${total.toFixed(2)}\`;
  if(grandtotalEl) grandtotalEl.innerText = \`₹\${total.toFixed(2)}\`;`,
        `if(subtotalEl) subtotalEl.innerText = \`₹\${total.toFixed(2)}\`;
  let gt = total - (total * currentDiscount);
  if(grandtotalEl) grandtotalEl.innerText = \`₹\${gt.toFixed(2)}\`;
  window.ecommerce_finalTotal = gt;`
    ).replace(
        `finalTotal += itemTotal;`,
        `finalTotal += itemTotal;`
    ).replace(
        `if(checkoutTotalEl) checkoutTotalEl.innerText = \`₹\${finalTotal.toFixed(2)}\`;`,
        `if (window.ecommerce_finalTotal !== undefined) finalTotal = window.ecommerce_finalTotal;
    if(checkoutTotalEl) checkoutTotalEl.innerText = \`₹\${finalTotal.toFixed(2)}\`;`
    ).replace( // Autocomplete logic
        `function searchProducts(event)`,
        `function showAutocomplete(query) {
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
    box.innerHTML = matches.map(p => \`<div style="padding:10px; cursor:pointer; border-bottom:1px solid #eee;" onclick="window.location.href='sproduct.html?id=\${p.id}'"><img src="\${p.image}" style="width:30px; vertical-align:middle; margin-right:10px">\${p.name}</div>\`).join('');
}
function searchProducts(event)`
    ).replace(
        `const query = event.target.value;`,
        `const query = event.target.value; showAutocomplete(query);`
    );
    fs.writeFileSync('script.js', scriptContent);
}

// 2. Saved Addresses in checkout.html
let checkoutContent = fs.readFileSync('checkout.html', 'utf8');
if (!checkoutContent.includes('loadSavedAddress()')) {
    checkoutContent = checkoutContent.replace(
        `<h3>1. Delivery Information</h3>`,
        `<h3>1. Delivery Information <button type="button" class="normal" style="padding:5px 10px; font-size:12px; margin-left:20px; float:right;" onclick="loadSavedAddress()">Use Saved Address</button></h3>`
    );
    checkoutContent = checkoutContent.replace(
        `<script src="amazon.js"></script>`,
        `<script src="amazon.js"></script>
<script>
  function loadSavedAddress() {
      const u = JSON.parse(localStorage.getItem('current_user'));
      if(!u) return;
      const safeE = safeEmail(u.email);
      db.ref('users/' + safeE + '/address').once('value').then(s => {
          const a = s.val();
          if(a) {
              document.getElementById('chk-name').value = a.name || u.name;
              document.getElementById('chk-phone').value = a.phone || '';
              document.getElementById('chk-address').value = a.street || '';
              document.getElementById('chk-city').value = a.city || '';
              document.getElementById('chk-pin').value = a.pin || '';
              if(typeof showToast === 'function') showToast('Address Loaded!');
          } else {
              if(typeof showToast === 'function') showToast('No saved address found.');
          }
      });
  }
  
  // hook into success
  const oldPay = payBtn.onclick;
  payBtn.onclick = async function(e) {
      const u = JSON.parse(localStorage.getItem('current_user'));
      if(u) {
          db.ref('users/' + safeEmail(u.email) + '/address').update({
              name: document.getElementById('chk-name').value,
              phone: document.getElementById('chk-phone').value,
              street: document.getElementById('chk-address').value,
              city: document.getElementById('chk-city').value,
              pin: document.getElementById('chk-pin').value
          });
      }
      if(oldPay) await oldPay(e);
  };
</script>`
    );
    fs.writeFileSync('checkout.html', checkoutContent);
}

// 3. Live order tracking UI in account.html
let accountContent = fs.readFileSync('account.html', 'utf8');
if(!accountContent.includes('progress-bar')) {
    accountContent = accountContent.replace(
        `\${o.status || 'Processing'}`,
        `<div style="display:flex; gap:5px; margin-top:5px; margin-bottom:5px;">
            <div style="height:5px; flex:1; background:\${o.status==='Delivered'?'#088178':'#088178'}"></div>
            <div style="height:5px; flex:1; background:\${o.status==='Delivered'?'#088178':'#eee'}"></div>
            <div style="height:5px; flex:1; background:\${o.status==='Delivered'?'#088178':'#eee'}"></div>
        </div>\${o.status || 'Processing'}`
    );
    fs.writeFileSync('account.html', accountContent);
}

console.log("All features effectively implemented.");

