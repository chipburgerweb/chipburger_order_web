// Main script for Chip Burger Store, Cart & UI
const STORAGE_CART_KEY = 'chipburger_cart';
const STORAGE_PROMO_KEY = 'chipburger_active_promo';

let currentCategory = 'all';
let searchQuery = '';
let cart = [];
let appliedPromo = null;

// Currency formatter for IDR
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  if (type === 'success') {
    toastIcon.className = 'w-7 h-7 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold';
    toastIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
  } else if (type === 'error') {
    toastIcon.className = 'w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center text-sm font-bold';
    toastIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    toastIcon.className = 'w-7 h-7 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center text-sm font-bold';
    toastIcon.innerHTML = '<i class="fa-solid fa-info"></i>';
  }

  toast.classList.remove('opacity-0', 'translate-y-20', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-20', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 2500);
}

// Render Menu Cards
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const filtered = MENU_ITEMS.filter(item => {
    const matchCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-zinc-500 space-y-3">
        <i class="fa-solid fa-utensils text-4xl text-zinc-600"></i>
        <p class="text-sm font-medium">Menu tidak ditemukan untuk kata kunci "${searchQuery}".</p>
        <button onclick="filterMenu('all'); document.getElementById('menuSearchInput').value='';" class="px-4 py-2 bg-zinc-800 text-xs text-white rounded-xl hover:bg-zinc-700">
          Lihat Semua Menu
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="burger-card bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col group">
      <!-- Image Thumbnail -->
      <div class="relative h-48 overflow-hidden bg-zinc-800">
        <img src="${item.image}" alt="${item.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <!-- Floating Badges -->
        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          ${item.badge ? `<span class="bg-brand-red text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-md tracking-wider">${item.badge}</span>` : ''}
          ${item.spicy ? `<span class="bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-md"><i class="fa-solid fa-pepper-hot"></i> Spicy</span>` : ''}
        </div>
        <!-- Rating badge -->
        <div class="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-brand-yellow flex items-center gap-1 border border-zinc-700/50">
          <i class="fa-solid fa-star text-[10px]"></i> ${item.rating}
        </div>
      </div>

      <!-- Info Area -->
      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-1.5">
          <h3 class="font-bold text-white text-base group-hover:text-brand-yellow transition-colors line-clamp-1">${item.name}</h3>
          <p class="text-xs text-zinc-400 leading-relaxed line-clamp-2">${item.description}</p>
        </div>

        <div class="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Harga</span>
            <p class="text-base font-extrabold text-white">${formatRupiah(item.price)}</p>
          </div>
          <button onclick="addToCart('${item.id}')" class="px-3.5 py-2.5 rounded-xl bg-brand-yellow hover:bg-yellow-400 active:scale-95 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-brand-yellow/10">
            <i class="fa-solid fa-plus text-xs"></i> Tambah
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Category filter
function filterMenu(category) {
  currentCategory = category;
  const buttons = document.querySelectorAll('#categoryFilterContainer .category-btn');
  buttons.forEach(btn => {
    btn.className = 'category-btn px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-surface text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all';
  });

  const activeBtn = event ? event.target.closest('button') : null;
  if (activeBtn) {
    activeBtn.className = 'category-btn active px-5 py-2.5 rounded-xl font-bold text-sm bg-brand-yellow text-zinc-950 transition-all';
  }

  renderMenu();
}

// Search menu
function handleSearchMenu() {
  const input = document.getElementById('menuSearchInput');
  searchQuery = input ? input.value : '';
  renderMenu();
}

// Quick Order Featured from Hero
function quickOrderFeatured() {
  addToCart('cb-01');
  openCart();
}

// Load cart from LocalStorage
function loadCart() {
  const savedCart = localStorage.getItem(STORAGE_CART_KEY);
  cart = savedCart ? JSON.parse(savedCart) : [];

  const savedPromo = localStorage.getItem(STORAGE_PROMO_KEY);
  appliedPromo = savedPromo ? JSON.parse(savedPromo) : null;

  updateCartUI();
}

// Save cart to LocalStorage
function saveCart() {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  if (appliedPromo) {
    localStorage.setItem(STORAGE_PROMO_KEY, JSON.stringify(appliedPromo));
  } else {
    localStorage.removeItem(STORAGE_PROMO_KEY);
  }
  updateCartUI();
}

// Add item to cart
function addToCart(itemId) {
  const product = MENU_ITEMS.find(m => m.id === itemId);
  if (!product) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  showToast(`${product.name} dimasukkan ke keranjang!`);
}

// Change Qty in cart
function changeCartQty(itemId, delta) {
  const item = cart.find(c => c.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== itemId);
  }

  saveCart();
}

// Remove item from cart completely
function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  saveCart();
  showToast('Menu dihapus dari keranjang', 'error');
}

// Apply Promo Code
function applyPromoCode() {
  const input = document.getElementById('promoCodeInput');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    showToast('Masukkan kode promo terlebih dahulu', 'error');
    return;
  }

  if (PROMO_CODES[code]) {
    appliedPromo = { code, ...PROMO_CODES[code] };
    saveCart();
    showToast(`Kode "${code}" berhasil digunakan! Promo aktif.`);
    input.value = '';
  } else {
    showToast('Kode promo tidak valid atau telah kedaluwarsa', 'error');
  }
}

// Update Cart Badge and Drawer DOM
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCountBadge');
  const subtitle = document.getElementById('cartItemsSubtitle');
  const itemsContainer = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountEl = document.getElementById('cartDiscount');
  const totalEl = document.getElementById('cartTotal');

  if (badge) badge.textContent = totalItems;
  if (subtitle) subtitle.textContent = `${totalItems} Menu Terpilih`;

  // Calculate pricing
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = 0;

  if (appliedPromo && subtotal > 0) {
    if (appliedPromo.discountPercent) {
      discount = Math.round(subtotal * (appliedPromo.discountPercent / 100));
    } else if (appliedPromo.discountFixed) {
      discount = Math.min(appliedPromo.discountFixed, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (discountEl) discountEl.textContent = discount > 0 ? `- ${formatRupiah(discount)} (${appliedPromo.code})` : '- Rp 0';
  if (totalEl) totalEl.textContent = formatRupiah(finalTotal);

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-12 space-y-3">
        <div class="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-2xl text-zinc-600">
          <i class="fa-solid fa-bag-shopping"></i>
        </div>
        <p class="text-sm font-semibold text-zinc-400">Keranjang pesananmu masih kosong</p>
        <p class="text-xs text-zinc-500 max-w-xs">Pilih burger favorit dan keripik renyah pilihanmu untuk mulai memesan.</p>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 pt-3 first:pt-0">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-zinc-800 shrink-0">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-white text-xs truncate">${item.name}</h4>
        <p class="text-xs text-brand-yellow font-bold mt-0.5">${formatRupiah(item.price)}</p>
        
        <!-- Quantity control -->
        <div class="flex items-center gap-2 mt-2">
          <div class="inline-flex items-center bg-zinc-800 rounded-lg border border-zinc-700/80">
            <button onclick="changeCartQty('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-xs">-</button>
            <span class="w-6 text-center text-xs font-bold text-white">${item.qty}</span>
            <button onclick="changeCartQty('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-xs">+</button>
          </div>
          <span class="text-[11px] text-zinc-400">x ${item.qty} = ${formatRupiah(item.price * item.qty)}</span>
        </div>
      </div>

      <button onclick="removeFromCart('${item.id}')" class="text-zinc-500 hover:text-red-400 p-2 transition-colors" title="Hapus">
        <i class="fa-solid fa-trash-can text-sm"></i>
      </button>
    </div>
  `).join('');
}

// WhatsApp Checkout Automation
function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    showToast('Keranjang Anda masih kosong!', 'error');
    return;
  }

  const currentUser = localStorage.getItem('chipburger_user');
  const user = currentUser ? JSON.parse(currentUser) : null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = 0;
  if (appliedPromo && subtotal > 0) {
    if (appliedPromo.discountPercent) discount = Math.round(subtotal * (appliedPromo.discountPercent / 100));
    else if (appliedPromo.discountFixed) discount = Math.min(appliedPromo.discountFixed, subtotal);
  }
  const finalTotal = Math.max(0, subtotal - discount);

  let message = `Halo Chip Burger! 🍔🍟 Saya ingin memesan menu via website:%0A%0A`;

  if (user) {
    message += `👤 *Data Pelanggan:*%0A`;
    message += `- Nama: ${user.name}%0A`;
    message += `- Kontak: ${user.phone || user.email}%0A%0A`;
  } else {
    message += `👤 *Pemesanan Tamu*%0A%0A`;
  }

  message += `📋 *Rincian Pesanan:*%0A`;
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.qty}x) - ${formatRupiah(item.price * item.qty)}%0A`;
  });

  message += `%0A💵 *Subtotal:* ${formatRupiah(subtotal)}%0A`;
  if (discount > 0) {
    message += `🏷️ *Diskon Promo (${appliedPromo.code}):* -${formatRupiah(discount)}%0A`;
  }
  message += `💰 *TOTAL AKHIR:* ${formatRupiah(finalTotal)}%0A%0A`;
  message += `Mohon konfirmasi pesanan dan alamat pengiriman saya ya, terima kasih!`;

  const waNumber = '6281234567890'; // Chip burger hotline
  const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${message}`;

  window.open(waUrl, '_blank');
}

// Drawer Toggle controls
function openCart() {
  const modal = document.getElementById('cartModal');
  const drawer = document.getElementById('cartDrawer');
  if (!modal || !drawer) return;

  modal.classList.remove('invisible', 'opacity-0');
  modal.classList.add('visible', 'opacity-100');
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
}

function closeCart() {
  const modal = document.getElementById('cartModal');
  const drawer = document.getElementById('cartDrawer');
  if (!modal || !drawer) return;

  drawer.classList.remove('translate-x-0');
  drawer.classList.add('translate-x-full');
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0');

  setTimeout(() => {
    modal.classList.add('invisible');
  }, 300);
}

// Render Top User Area depending on Login State
function renderUserNavbar() {
  const userArea = document.getElementById('navUserArea');
  if (!userArea) return;

  const userStr = localStorage.getItem('chipburger_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    userArea.innerHTML = `
      <div class="relative group">
        <button class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-800/90 border border-zinc-700 hover:border-brand-yellow/60 transition-all text-xs font-bold text-white">
          <div class="w-6 h-6 rounded-full bg-brand-yellow text-zinc-950 flex items-center justify-center font-black">
            ${user.name.charAt(0).toUpperCase()}
          </div>
          <span class="max-w-[100px] truncate">${user.name}</span>
          <i class="fa-solid fa-chevron-down text-[10px] text-zinc-400 group-hover:rotate-180 transition-transform"></i>
        </button>

        <!-- Dropdown menu -->
        <div class="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl py-2 hidden group-hover:block z-50">
          <div class="px-4 py-2 border-b border-zinc-800 text-xs">
            <p class="font-bold text-white truncate">${user.name}</p>
            <p class="text-[11px] text-zinc-400 truncate">${user.email}</p>
          </div>
          <a href="login.html" class="block px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white">
            <i class="fa-solid fa-user-gear mr-2"></i> Pengaturan Akun
          </a>
          <button onclick="localStorage.removeItem('chipburger_user'); window.location.reload();" class="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center">
            <i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Keluar (Logout)
          </button>
        </div>
      </div>
    `;
  }
}

// Page Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  loadCart();
  renderUserNavbar();

  // Attach event listeners
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
});
