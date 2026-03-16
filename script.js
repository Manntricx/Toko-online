// Keranjang belanja sederhana menggunakan localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

document.querySelectorAll('.product button').forEach((button, index) => {
    button.addEventListener('click', () => {
        const product = {
            name: document.querySelectorAll('.product h3')[index].textContent,
            price: document.querySelectorAll('.product p')[index].textContent,
            img: document.querySelectorAll('.product img')[index].src
        };
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Produk ditambahkan ke keranjang!');
    });
});

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function showCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Keranjang kosong.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}" style="width:50px; height:50px;">
                <span>${item.name} - ${item.price}</span>
                <button onclick="removeFromCart(${index})">Hapus</button>
            `;
            cartItems.appendChild(itemDiv);
        });
    }
    document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart();
}

function checkout() {
    alert('Checkout berhasil! Terima kasih telah berbelanja.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    closeCart();
}

// Tutup modal jika klik di luar
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Fitur pencarian produk
document.getElementById('search').addEventListener('input', filterProducts);

function filterProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        if (name.includes(query)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Tambah produk baru
document.getElementById('add-product-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const image = document.getElementById('product-image').value.trim();

    if (!name || !price || !image) {
        alert('Semua field harus diisi.');
        return;
    }

    // Buat elemen produk baru
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
        <img src="${image}" alt="${name}">
        <h3>${name}</h3>
        <p>Harga: Rp ${parseInt(price).toLocaleString()}</p>
        <button>Tambah ke Keranjang</button>
    `;

    // Tambahkan ke daftar produk
    document.querySelector('.products').appendChild(productDiv);

    // Reset form
    document.getElementById('add-product-form').reset();

    // Re-attach event listener untuk tombol baru
    attachCartListeners();

    alert('Produk berhasil ditambahkan!');
});

function attachCartListeners() {
    document.querySelectorAll('.product button').forEach((button, index) => {
        button.addEventListener('click', () => {
            const product = {
                name: document.querySelectorAll('.product h3')[index].textContent,
                price: document.querySelectorAll('.product p')[index].textContent,
                img: document.querySelectorAll('.product img')[index].src
            };
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert('Produk ditambahkan ke keranjang!');
        });
    });
}

// Panggil sekali untuk produk awal
attachCartListeners();

// Validasi form kontak
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name) {
        alert('Nama harus diisi.');
        return;
    }
    if (!email || !isValidEmail(email)) {
        alert('Email harus diisi dan valid.');
        return;
    }
    if (!message) {
        alert('Pesan harus diisi.');
        return;
    }

    // Simulasi pengiriman (dalam proyek nyata, kirim ke server)
    alert('Pesan berhasil dikirim! Terima kasih.');
    document.getElementById('contact-form').reset();
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}