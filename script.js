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