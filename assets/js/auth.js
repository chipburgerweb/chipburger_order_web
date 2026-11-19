// Authentication State & Handler for Chip Burger
const STORAGE_USER_KEY = 'chipburger_user';
const STORAGE_ACCOUNTS_KEY = 'chipburger_accounts';

// Seed default demo accounts if not exists
function initDemoAccounts() {
  if (!localStorage.getItem(STORAGE_ACCOUNTS_KEY)) {
    const defaultAccounts = [
      {
        name: 'Burger Lover',
        email: 'demo@chipburger.com',
        phone: '081234567890',
        password: 'password123'
      }
    ];
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(defaultAccounts));
  }
}

// Get logged in user
function getCurrentUser() {
  const userStr = localStorage.getItem(STORAGE_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

// Set logged in user
function setCurrentUser(user) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

// Clear user (logout)
function logoutUser() {
  localStorage.removeItem(STORAGE_USER_KEY);
  window.location.reload();
}

// Tab switcher in login.html
function switchAuthTab(tab) {
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  const authAlert = document.getElementById('authAlert');

  if (authAlert) authAlert.classList.add('hidden');

  if (tab === 'login') {
    tabLoginBtn.className = 'py-2.5 rounded-xl font-bold text-xs text-zinc-950 bg-brand-yellow shadow-md transition-all';
    tabRegisterBtn.className = 'py-2.5 rounded-xl font-bold text-xs text-zinc-400 hover:text-white transition-all';
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    authTitle.textContent = 'Selamat Datang Kembali!';
    authSubtitle.textContent = 'Masuk untuk menikmati promo spesial & kemudahan pesan antar';
  } else {
    tabRegisterBtn.className = 'py-2.5 rounded-xl font-bold text-xs text-zinc-950 bg-brand-yellow shadow-md transition-all';
    tabLoginBtn.className = 'py-2.5 rounded-xl font-bold text-xs text-zinc-400 hover:text-white transition-all';
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    authTitle.textContent = 'Daftar Akun Member';
    authSubtitle.textContent = 'Nikmati diskon eksklusif dan kumpulkan poin setiap pesanan';
  }
}

// Toggle password visibility
function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// Quick demo credentials autofill
function fillDemoCredentials() {
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  if (loginEmail && loginPassword) {
    loginEmail.value = 'demo@chipburger.com';
    loginPassword.value = 'password123';
  }
}

// Handle Login Form Submit
function handleLogin(event) {
  event.preventDefault();
  initDemoAccounts();

  const emailOrUser = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const alertBox = document.getElementById('authAlert');

  const accounts = JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS_KEY) || '[]');
  const matchedUser = accounts.find(acc => 
    (acc.email.toLowerCase() === emailOrUser.toLowerCase() || acc.name.toLowerCase() === emailOrUser.toLowerCase()) && 
    acc.password === password
  );

  if (matchedUser) {
    setCurrentUser({
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone || '08123456789'
    });

    alertBox.className = 'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400';
    alertBox.innerHTML = '<i class="fa-solid fa-circle-check text-sm"></i> Login berhasil! Mengalihkan ke menu...';
    alertBox.classList.remove('hidden');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    alertBox.className = 'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400';
    alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-sm"></i> Email atau kata sandi tidak cocok. Gunakan tombol demo di atas.';
    alertBox.classList.remove('hidden');
  }
}

// Handle Registration Form Submit
function handleRegister(event) {
  event.preventDefault();
  initDemoAccounts();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const alertBox = document.getElementById('authAlert');

  if (password.length < 6) {
    alertBox.className = 'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400';
    alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-sm"></i> Kata sandi minimal 6 karakter.';
    alertBox.classList.remove('hidden');
    return;
  }

  const accounts = JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS_KEY) || '[]');
  const exists = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    alertBox.className = 'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400';
    alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-sm"></i> Email ini sudah terdaftar. Silakan login.';
    alertBox.classList.remove('hidden');
    return;
  }

  const newUser = { name, email, phone, password };
  accounts.push(newUser);
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  setCurrentUser({ name, email, phone });

  alertBox.className = 'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400';
  alertBox.innerHTML = '<i class="fa-solid fa-circle-check text-sm"></i> Registrasi berhasil! Selamat bergabung di Chip Burger.';
  alertBox.classList.remove('hidden');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initDemoAccounts();

  // If already logged in on login.html, show welcome message or allow switch
  const user = getCurrentUser();
  if (user && window.location.pathname.includes('login.html')) {
    const alertBox = document.getElementById('authAlert');
    if (alertBox) {
      alertBox.className = 'mb-4 p-3 rounded-xl text-xs font-semibold flex items-center justify-between bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow';
      alertBox.innerHTML = `
        <span>Anda saat ini login sebagai <strong>${user.name}</strong></span>
        <button onclick="logoutUser()" class="underline font-bold text-red-400 ml-2">Keluar (Logout)</button>
      `;
      alertBox.classList.remove('hidden');
    }
  }
});
