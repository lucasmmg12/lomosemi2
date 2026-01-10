import './style.css'

// Configuración y Datos
const PHONE_NUMBER = "5492645308449";

const PRODUCTS = [
    // PIZZAS
    { id: 101, category: 'pizzas', name: 'Pizza Muzza', desc: 'Salsa, muzzarella, aceitunas.', price: 8000, img: '/Pizza Muzzarela.webp' },
    { id: 102, category: 'pizzas', name: 'Pizza Especial', desc: 'Jamón, morrones, aceitunas.', price: 9000, img: '/Pizza Especial.webp' },
    { id: 103, category: 'pizzas', name: 'Pizza Emi', desc: 'La especialidad de la casa.', price: 10000, img: '/Pizza Emi.webp' },

    // LOMIPIZZAS
    { id: 201, category: 'pizzas', name: 'Lomipizza Entera', desc: 'Combinación bomba de lomo y pizza.', price: 28000, img: '/lomipizza.webp' },
    { id: 202, category: 'pizzas', name: 'Lomipizza Mitad', desc: 'Media porción de nuestra lomipizza.', price: 20000, img: '/lomipizza.webp' },

    // BURGERS (Con Variantes)
    {
        id: 301, category: 'hamburguesas', name: 'Burger', desc: 'Hamburguesa casera clásica.', price: 5000, img: '/burger simple.webp',
        isDoubleOption: true, doublePriceDelta: 1000 // Especial 5000, Doble 6000 -> Diff 1000
    },
    {
        id: 302, category: 'hamburguesas', name: 'Pan Papas', desc: 'Con exclusivo pan de papa.', price: 6000, img: '/Hamburguesa pan de papa.webp',
        isDoubleOption: true, doublePriceDelta: 1000 // Esp 6000, Doble 7000
    },
    {
        id: 303, category: 'hamburguesas', name: 'Gigante', desc: 'Tamaño XL para valientes.', price: 7000, img: '/Hamburguesa Pan Normal.webp',
        isDoubleOption: true, doublePriceDelta: 2000 // Esp 7000, Doble 9000 -> Diff 2000
    },

    // LOMOS & PACHATAS (Con Variantes)
    {
        id: 401, category: 'lomos', name: 'Lomo 25cm', desc: 'Carne tierna, lechuga, tomate, mayo.', price: 6500, img: '/Lomo 25cm.webp',
        isDoubleOption: true, doublePriceDelta: 4000
    },
    {
        id: 403, category: 'lomos', name: 'Lomo 50cm', desc: 'Carne tierna, lechuga, tomate, mayo. Ideal para compartir.', price: 12000, img: '/Lomo 50cm.webp',
        isDoubleOption: true, doublePriceDelta: 8000 // Esp 12000, Doble 20000 -> Diff 8000
    },
    {
        id: 402, category: 'sandwiches', name: 'Pachata', desc: 'Nuestro sándwich estrella.', price: 12000, img: '/Pachata emi.webp',
        isDoubleOption: true, doublePriceDelta: 8000 // Esp 12000, Doble 20000
    },

    // MIGAS & TOSTADOS
    { id: 501, category: 'sandwiches', name: 'Tostado', desc: 'Sándwich de miga tostado.', price: 5000, img: '/Tostado Miga.webp' },
    { id: 502, category: 'sandwiches', name: 'Americano', desc: 'Tostado especial.', price: 6000, img: '/Tostado Miga.webp' },
    { id: 503, category: 'sandwiches', name: 'Barroluco', desc: 'Doble miga con carne y queso.', price: 18000, img: '/Barroluco.webp' },

    // FRITAS & MINUTAS
    { id: 601, category: 'minutas', name: 'Papas Chicas', desc: 'Porción individual.', price: 4000, img: '/papas fritas comunes.webp' },
    { id: 602, category: 'minutas', name: 'Papas Grandes', desc: 'Para compartir.', price: 7000, img: '/papas fritas comunes.webp' },
    {
        id: 603, category: 'minutas', name: 'Salchipapa', desc: 'Papas con salchicha. ¡Agregale cosas!', price: 9000, img: '/Salchipapa.webp',
        addons: [
            { name: 'Cheddar', price: 0 },
            { name: 'Panceta', price: 0 }
        ]
    }
];

let cart = [];

function init() {
    renderProducts(PRODUCTS);
    updateCartUI();
}

// Render Cards
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = items.map(p => {
        // Generar HTML de opciones
        let optionsInfo = '';

        // Opción Doble
        if (p.isDoubleOption) {
            optionsInfo += `
                <div class="mt-3 mb-2 bg-black/20 p-2 rounded-lg">
                    <label class="flex items-center gap-2 cursor-pointer select-none text-sm">
                        <input type="checkbox" id="double-${p.id}" class="w-4 h-4 accent-red-600" onchange="updateCardPrice(${p.id})">
                        doble carne (+$${p.doublePriceDelta})
                    </label>
                </div>
            `;
        }

        // Addons (Salchipapa)
        if (p.addons && p.addons.length > 0) {
            optionsInfo += `<div class="mt-3 mb-2 bg-black/20 p-2 rounded-lg space-y-1">
                <p class="text-xs text-gray-400 mb-1">Agregados:</p>
                ${p.addons.map((add, idx) => `
                    <label class="flex items-center gap-2 cursor-pointer select-none text-sm">
                        <input type="checkbox" id="addon-${p.id}-${idx}" value="${add.name}" class="w-4 h-4 accent-red-600" onchange="updateCardPrice(${p.id})">
                        ${add.name} ${add.price > 0 ? `(+$${add.price})` : ''}
                    </label>
                `).join('')}
            </div>`;
        }

        return `
        <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-red-custom/50 transition-all group flex flex-col h-full relative" id="card-${p.id}">
            <div class="h-48 overflow-hidden relative">
                <img src="${p.img}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
            <div class="p-5 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-1">
                    <h5 class="font-bold text-lg leading-tight mr-2">${p.name}</h5>
                    <span class="text-red-custom font-bold text-xl whitespace-nowrap" id="price-display-${p.id}">$${p.price}</span>
                </div>
                <p class="text-gray-400 text-xs line-clamp-2 min-h-[2.5em]">${p.desc}</p>
                
                <!-- Area de Opciones -->
                ${optionsInfo}
                
                <div class="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-white/5">
                    <div class="flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/5">
                        <button onclick="changeQtyUI(${p.id}, -1)" class="px-3 py-1 hover:bg-white/10">-</button>
                        <input type="text" id="qty-${p.id}" value="1" readonly class="w-8 text-center bg-transparent text-sm focus:outline-none">
                        <button onclick="changeQtyUI(${p.id}, 1)" class="px-3 py-1 hover:bg-white/10">+</button>
                    </div>
                    <button onclick="addToCart(${p.id})" class="bg-red-custom hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex-1 flex items-center justify-center gap-1 group-active:scale-95">
                        AGREGAR
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Live Price Update on Card
function updateCardPrice(id) {
    const product = PRODUCTS.find(p => p.id === id);
    let currentPrice = product.price;

    // Check Double
    const doubleCheck = document.getElementById(`double-${id}`);
    if (doubleCheck && doubleCheck.checked) {
        currentPrice += product.doublePriceDelta;
    }

    // Check Addons
    if (product.addons) {
        product.addons.forEach((add, idx) => {
            const el = document.getElementById(`addon-${id}-${idx}`);
            if (el && el.checked) {
                currentPrice += add.price;
            }
        });
    }

    // Update UI
    document.getElementById(`price-display-${id}`).innerText = `$${currentPrice}`;
}

function changeQtyUI(id, delta) {
    const input = document.getElementById(`qty-${id}`);
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

function filterMenu(cat) {
    const buttons = document.querySelectorAll('#menu button');
    buttons.forEach(btn => btn.classList.remove('bg-red-custom', 'text-white'));
    buttons.forEach(btn => btn.classList.add('bg-white/5', 'text-white'));

    event.target.classList.remove('bg-white/5');
    event.target.classList.add('bg-red-custom');

    if (cat === 'todos') {
        renderProducts(PRODUCTS);
    } else {
        const filtered = PRODUCTS.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('cart-open');
    document.getElementById('cart-overlay').classList.toggle('hidden');

    // Solo bloquear scroll en móviles
    if (window.innerWidth < 768) {
        document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden';
    }
}

function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const qty = parseInt(qtyInput.value);

    let finalPrice = product.price;
    let finalName = product.name;
    let extras = [];

    // Check Variants
    const doubleCheck = document.getElementById(`double-${productId}`);
    if (doubleCheck && doubleCheck.checked) {
        finalPrice += product.doublePriceDelta;
        finalName += " (DOBLE)";
    }

    // Check Addons
    if (product.addons) {
        product.addons.forEach((add, idx) => {
            const el = document.getElementById(`addon-${productId}-${idx}`);
            if (el && el.checked) {
                finalPrice += add.price;
                extras.push(add.name);
            }
        });
    }

    if (extras.length > 0) {
        finalName += ` + ${extras.join(', ')}`;
    }

    // Add to Cart
    const cartId = `${productId}-${finalName}`;

    const existing = cart.find(item => item.cartId === cartId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            ...product,
            cartId: cartId,
            name: finalName,
            price: finalPrice,
            qty
        });
    }

    // Reset UI inputs
    qtyInput.value = 1;
    if (doubleCheck) doubleCheck.checked = false;
    if (product.addons) {
        product.addons.forEach((_, idx) => {
            const el = document.getElementById(`addon-${productId}-${idx}`);
            if (el) el.checked = false;
        });
    }
    updateCardPrice(productId);

    updateCartUI();

    const btn = event.target;
    // Safety check if event target exists 
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "¡Agregado!";
        btn.classList.add('bg-green-600');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('bg-green-600');
        }, 1000);
    }

    // toggleCart(); // Removed to allow multiple items
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const countBadge = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('cart-subtotal');
    const btnWs = document.getElementById('btn-whatsapp');

    if (cart.length === 0) {
        itemsContainer.innerHTML = '';
        itemsContainer.appendChild(emptyMsg);
        btnWs.disabled = true;
        countBadge.innerText = 0;
        totalEl.innerText = "$0";
        subtotalEl.innerText = "$0";
        return;
    }

    emptyMsg.remove();
    let total = 0;
    let count = 0;

    itemsContainer.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        count += item.qty;
        return `
            <div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 animate-fade-in">
                <img src="${item.img}" class="w-16 h-16 object-cover rounded-lg" alt="">
                <div class="flex-1">
                    <h6 class="text-sm font-bold text-white leading-tight">${item.name}</h6>
                    <p class="text-xs text-red-custom">$${item.price.toLocaleString()} c/u</p>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="updateQty(${index}, -1)" class="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full text-xs text-white hover:bg-white/20">-</button>
                        <span class="text-sm font-mono">${item.qty}</span>
                        <button onclick="updateQty(${index}, 1)" class="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full text-xs text-white hover:bg-white/20">+</button>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold text-accent-gold">$${(item.price * item.qty).toLocaleString()}</p>
                    <button onclick="removeItem(${index})" class="text-xs text-gray-500 hover:text-red-500 mt-2 transition-colors">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');

    countBadge.innerText = count;
    subtotalEl.innerText = `$${total.toLocaleString()}`;
    totalEl.innerText = `$${total.toLocaleString()}`;
    btnWs.disabled = false;
}

function updateQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function sendToWhatsApp() {
    if (cart.length === 0) return;

    let total = 0;
    let itemsText = cart.map(item => {
        total += item.price * item.qty;
        return `• ${item.qty}x ${item.name} ($${(item.price * item.qty).toLocaleString()})`;
    }).join('\n');

    const message = `Hola Lomos Emi! 👋\nQuiero hacer un pedido:\n\n${itemsText}\n\n━━━━━━━━━━━━━━\n💰 TOTAL: $${total.toLocaleString()}\n━━━━━━━━━━━━━━\nNombre: \nDirección: \nForma de Pago: `;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}


// --- Logic for Promos & Combos ---

function updateComboPrice(type) {
    const select = document.getElementById(`combo-${type}-select`);
    const [name, price] = select.value.split('|');
    document.getElementById(`combo-${type}-display`).innerText = `$${parseInt(price).toLocaleString()}`;
}

function addComboToCart(type) {
    const select = document.getElementById(`combo-${type}-select`);
    const [name, priceRaw] = select.value.split('|');
    const price = parseInt(priceRaw);

    // Image mapping
    const imgMap = {
        'burger': '/burger simple.webp',
        'lomo': '/Lomo 50cm.webp',
        'lomipizza': '/lomipizza.webp',
        'mix': '/Salchipapa.webp'
    };

    const cartId = `promo-${type}-${name}`;

    const existing = cart.find(item => item.cartId === cartId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: 9999, // Dummy ID
            cartId: cartId,
            category: 'promos',
            name: `PROMO: ${name}`,
            desc: 'Combo en oferta',
            price: price,
            img: imgMap[type],
            qty: 1
        });
    }

    updateCartUI();

    // Visual feedback
    const btn = event.target;
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "¡Agregado!";
        btn.classList.add('bg-green-600');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('bg-green-600');
        }, 1000);
    }
}

function addSpecificCombo(name, price) {
    const cartId = `promo-specific-${name}`;
    const existing = cart.find(item => item.cartId === cartId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: 8888,
            cartId: cartId,
            category: 'promos',
            name: name,
            desc: 'Super Promo',
            price: price,
            img: '/Logo emi.webp', // Or Logo? Step 246 replaced it with Logo. I will use Logo here if it matches the visual.
            qty: 1
        });
    }
    // Wait, in Step 246 I replaced the image in HTML with Logo.
    // In JS (addSpecificCombo) I think it was using 'public/Flyer Promos.png' in the original code.
    // I should update it to '/Logo emi.png' to match the card, OR keep Flyer if that's what we want in cart.
    // I'll set it to '/Logo emi.png' to be consistent with the card update.

    // Actually, looking at Step 276 HTML Code:
    // HTML: img src="public/Logo emi.png"
    // JS `addSpecificCombo`: `img: 'public/Flyer Promos.png'` (inside the function).
    // So the cart shows the old image? I should fix this to `img: '/Logo emi.png'`.

    updateCartUI();

    // Visual feedback for specific combos (buttons with +)
    const btn = event.target.closest('button');
    if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '¡Listo!';
        btn.classList.add('text-green-500');
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('text-green-500');
        }, 1000);
    }
}

init();

// Expose functions to window for HTML onclick compatibility
window.filterMenu = filterMenu;
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.sendToWhatsApp = sendToWhatsApp;
window.updateComboPrice = updateComboPrice;
window.addComboToCart = addComboToCart;
window.addSpecificCombo = addSpecificCombo;
window.changeQtyUI = changeQtyUI;
window.updateCardPrice = updateCardPrice;
