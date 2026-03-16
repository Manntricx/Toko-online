// ===============================
// Keranjang menggunakan localStorage
// ===============================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

updateCartCount();
attachCartListeners();
attachDetailListeners();

// Event delegation untuk tombol keranjang
document.querySelector('.products').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const productDiv = e.target.closest('.product');
        const product = {
            name: productDiv.querySelector('h3').textContent,
            price: productDiv.querySelector('p').textContent,
            img: productDiv.querySelector('img').src
        };
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Produk ditambahkan ke keranjang!');
    }
});

}

// ===============================
// Tampilkan Keranjang
// ===============================
function showCart() {

    const cartItems = document.getElementById('cart-items');

    cartItems.innerHTML = '';

    if (cart.length === 0) {

        cartItems.innerHTML = '<p>Keranjang kosong.</p>';

    } else {

        cart.forEach((item, index) => {

            const itemDiv = document.createElement('div');

            itemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <span>${item.name} - ${item.price}</span>
                <button onclick="removeFromCart(${index})">Hapus</button>
            `;

            cartItems.appendChild(itemDiv);

        });

    }

    document.getElementById('cart-modal').style.display = 'block';
}

// ===============================
// Tutup keranjang
// ===============================
function closeCart() {

    document.getElementById('cart-modal').style.display = 'none';

}

// ===============================
// Hapus item keranjang
// ===============================
function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();

    showCart();

}

// ===============================
// Checkout
// ===============================
function checkout() {

    alert('Checkout berhasil! Terima kasih telah berbelanja.');

    cart = [];

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();

    closeCart();

}

// ===============================
// Tutup modal jika klik luar
// ===============================
window.onclick = function(event) {

    const modal = document.getElementById('cart-modal');

    if (event.target == modal) {

        modal.style.display = 'none';

    }

};

// ===============================
// Fitur pencarian
// ===============================
document.getElementById('search').addEventListener('input', function () {

    const query = this.value.toLowerCase();

    document.querySelectorAll('.product').forEach(product => {

        const name = product.querySelector('h3').textContent.toLowerCase();

        product.style.display = name.includes(query) ? 'block' : 'none';

    });

});

// ===============================
// Tambah produk baru
// ===============================
document.getElementById('add-product-form').addEventListener('submit', function(e){

    e.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const image = document.getElementById('product-image').value.trim();

    if(!name || !price || !image){
        alert('Semua field harus diisi');
        return;
    }

    const productDiv = document.createElement('div');

    productDiv.className = 'product';

    productDiv.innerHTML = `
        <img src="https://picsum.photos/200" alt="${name}">
        <h3>${name}</h3>
        <p>Harga: Rp ${parseInt(price).toLocaleString()}</p>

        <div class="button-group">
            <button class="detail-btn">Detail</button>
            <button class="cart-btn">Tambah ke Keranjang</button>
        </div>
    `;

    document.querySelector('.products').appendChild(productDiv);

    this.reset();

    attachCartListeners();
    attachDetailListeners();

    alert('Produk berhasil ditambahkan!');

});

// ===============================
// Validasi form kontak
// ===============================
document.getElementById('contact-form').addEventListener('submit', function(e){

    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if(!name){
        alert('Nama harus diisi');
        return;
    }

    if(!email || !isValidEmail(email)){
        alert('Email tidak valid');
        return;
    }

    if(!message){
        alert('Pesan harus diisi');
        return;
    }

    alert('Pesan berhasil dikirim!');

    this.reset();

});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Navbar active on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for navbar links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
