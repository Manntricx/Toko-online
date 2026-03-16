// ===================================
// Cart state
// ===================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

updateCartCount();
attachListeners();

// ===================================
// Helpers
// ===================================
function fmtRupiah(num) {
    return 'Rp ' + parseInt(num).toLocaleString('id-ID');
}

function getPriceText(el) {
    const newEl = el.querySelector('.price-new');
    return newEl ? newEl.textContent : '';
}

function getPriceNum(el) {
    const txt = getPriceText(el);
    return parseInt(txt.replace(/\D/g, '')) || 0;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 2600);
}

// ===================================
// Attach all button listeners
// ===================================
function attachListeners() {
    document.querySelectorAll('.product').forEach(el => {
        const cartBtn   = el.querySelector('.cart-btn');
        const detailBtn = el.querySelector('.detail-btn');
        const promoBtn  = el.querySelector('.promo-btn');

        if (cartBtn)   cartBtn.onclick   = () => addToCart(el);
        if (detailBtn) detailBtn.onclick = () => showDetail(el);
        if (promoBtn)  promoBtn.onclick  = () => showPromo(el);
    });
}

// ===================================
// Cart
// ===================================
function addToCart(el) {
    const name  = el.querySelector('h3').textContent;
    const price = getPriceText(el);
    const img   = el.querySelector('img').src;

    cart.push({ name, price, img });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('✓ ' + name + ' ditambahkan ke keranjang');
}

function updateCartCount() {
    const el = document.getElementById('cart-count');
    el.textContent = cart.length;
    el.style.transform = 'scale(1.3)';
    setTimeout(() => el.style.transform = '', 200);
}

function showCart() {
    const cartItems = document.getElementById('cart-items');
    const summary   = document.getElementById('cart-summary');
    cartItems.innerHTML = '';
    summary.innerHTML   = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem 0;font-size:0.95rem;">Keranjang masih kosong 🛒</p>';
    } else {
        cart.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="ci-name">${item.name}</div>
                    <div class="ci-price">${item.price}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
            `;
            cartItems.appendChild(div);
        });

        const total = cart.reduce((s, it) => s + (parseInt(it.price.replace(/\D/g, '')) || 0), 0);
        const gratis = total >= 150000;
        summary.innerHTML = `
            <div class="summary-row">
                <span>Total (${cart.length} item)</span>
                <span class="summary-total">${fmtRupiah(total)}</span>
            </div>
            <div class="ongkir-tag ${gratis ? 'ongkir-gratis' : 'ongkir-info'}">
                ${gratis
                    ? '🚚 Selamat! Kamu mendapat <strong>gratis ongkir</strong>!'
                    : `🚚 Tambah <strong>${fmtRupiah(150000 - total)}</strong> lagi untuk gratis ongkir`}
            </div>
        `;
    }

    document.getElementById('cart-modal').style.display = 'flex';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function removeFromCart(i) {
    cart.splice(i, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart();
}

function checkout() {
    showToast('🎉 Checkout berhasil! Terima kasih telah berbelanja.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    closeCart();
}

// ===================================
// Detail Modal
// ===================================
function showDetail(el) {
    const name     = el.querySelector('h3').textContent;
    const priceNew = getPriceText(el);
    const priceOld = el.querySelector('.price-old')?.textContent || '';
    const discount = el.dataset.discount || '';
    const img      = el.querySelector('img').src;

    document.getElementById('detail-title').textContent = name;
    document.getElementById('detail-body').innerHTML = `
        <img src="${img}" alt="${name}" class="detail-img">
        <div class="detail-row"><span class="detail-label">Nama</span><span class="detail-val">${name}</span></div>
        <div class="detail-row"><span class="detail-label">Harga</span><span class="detail-val" style="color:var(--accent)">${priceNew}</span></div>
        ${priceOld ? `<div class="detail-row"><span class="detail-label">Harga Asli</span><span class="detail-val" style="text-decoration:line-through;color:var(--muted)">${priceOld}</span></div>` : ''}
        ${discount ? `<div class="detail-row"><span class="detail-label">Diskon</span><span class="detail-val" style="color:#f56565">${discount}%</span></div>` : ''}
    `;
    document.getElementById('detail-modal').style.display = 'flex';
}

// ===================================
// Promo Modal
// ===================================
function showPromo(el) {
    const name     = el.querySelector('h3').textContent;
    const priceNum = getPriceNum(el);
    const discount = parseInt(el.dataset.discount) || 0;
    const img      = el.querySelector('img').src;

    document.getElementById('detail-title').textContent = '🏷 Promo ' + name;

    let promoHtml = '';
    if (discount > 0) {
        const hemat = Math.round(priceNum * discount / (100 - discount));
        promoHtml = `
            <div class="promo-highlight">
                ⚡ <strong>Flash Sale!</strong> Hemat ${discount}% — kamu menghemat ${fmtRupiah(hemat)} untuk produk ini.<br>
                Penawaran terbatas, segera tambahkan ke keranjang!
            </div>`;
    } else {
        promoHtml = `
            <div class="promo-highlight">
                🎁 Belanja produk ini bersama item lain dan dapatkan <strong>gratis ongkir</strong> jika total belanja di atas Rp 150.000!
            </div>`;
    }

    document.getElementById('detail-body').innerHTML = `
        <img src="${img}" alt="${name}" class="detail-img">
        ${promoHtml}
        <div style="margin-top:1.25rem">
            <button class="checkout-btn" onclick="
                document.getElementById('detail-modal').style.display='none';
                addToCart(document.querySelector('.product[data-name=\\'${name}\\']') || document.querySelectorAll('.product')[0])
            ">+ Tambah ke Keranjang</button>
        </div>
    `;
    document.getElementById('detail-modal').style.display = 'flex';
}

// Close modals on backdrop click
window.addEventListener('click', e => {
    if (e.target === document.getElementById('cart-modal'))   closeCart();
    if (e.target === document.getElementById('detail-modal')) document.getElementById('detail-modal').style.display = 'none';
});

// ===================================
// Search
// ===================================
document.getElementById('search').addEventListener('input', function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.product').forEach(p => {
        p.style.display = p.querySelector('h3').textContent.toLowerCase().includes(q) ? '' : 'none';
    });
});

// ===================================
// Add Product Form
// ===================================
document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name     = document.getElementById('product-name').value.trim();
    const price    = parseInt(document.getElementById('product-price').value.trim());
    const discount = parseInt(document.getElementById('product-discount').value.trim()) || 0;
    const badge    = document.getElementById('product-badge-select').value;
    const image    = document.getElementById('product-image').value.trim();

    if (!name || !price || !image) { showToast('⚠ Nama, harga, dan URL gambar harus diisi'); return; }

    const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

    let badgeHTML = '';
    if      (discount > 0)    badgeHTML = `<div class="product-badge badge-sale">${discount}% OFF</div>`;
    else if (badge === 'new') badgeHTML = `<div class="product-badge badge-new">NEW</div>`;
    else if (badge === 'hot') badgeHTML = `<div class="product-badge badge-hot">TERLARIS</div>`;

    const priceHTML = discount > 0
        ? `<div class="product-price"><span class="price-old">${fmtRupiah(price)}</span><span class="price-new">${fmtRupiah(finalPrice)}</span></div>`
        : `<div class="product-price"><span class="price-new">${fmtRupiah(finalPrice)}</span></div>`;

    const el = document.createElement('div');
    el.className = 'product';
    el.dataset.price = price;
    el.dataset.name  = name;
    if (discount) el.dataset.discount = discount;

    el.innerHTML = `
        ${badgeHTML}
        <div class="product-img-wrap">
            <img src="${image}" alt="${name}">
            <div class="product-overlay">
                <button class="overlay-btn detail-btn">🔍 Detail</button>
                <button class="overlay-btn promo-btn">🏷 Promo</button>
            </div>
        </div>
        <div class="product-info">
            <h3>${name}</h3>
            ${priceHTML}
            <button class="cart-btn">+ Keranjang</button>
        </div>
    `;

    document.querySelector('.products').appendChild(el);
    attachListeners();
    this.reset();
    showToast('✓ Produk "' + name + '" berhasil ditambahkan!');
});

// ===================================
// Contact Form
// ===================================
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name)                        { showToast('⚠ Nama harus diisi'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('⚠ Email tidak valid'); return; }
    if (!message)                     { showToast('⚠ Pesan harus diisi'); return; }

    showToast('✉ Pesan berhasil dikirim! Terima kasih.');
    this.reset();
});