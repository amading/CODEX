// Updated POS Web JavaScript with API integration - Na-update na JavaScript para sa POS Web na may API integration
// This version connects to the backend API for data persistence - Kumokonekta ito sa backend API para sa persistent data

// API base URL - Base URL ng API
const API_BASE = 'http://localhost:3001/api';

// Global state - Global na estado ng application
let currentUser = null;
let authToken = null;
let products = [];
let cart = [];
let sales = [];
let selectedPaymentMethod = 'cash';
let settings = {
  storeName: 'My Store',
  taxRate: 8.25,
  currency: 'USD'
};

// DOM Elements - Mga DOM elements na gagamitin
const loginSection = document.getElementById('login-section');
const mainApp = document.getElementById('main-app');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const userNameEl = document.querySelector('.user-name');
const userStatusEl = document.querySelector('.user-status');
const inventoryBody = document.getElementById('inventory-body');
const inventorySearch = document.getElementById('inventory-search');
const salesDateFrom = document.getElementById('sales-date-from');
const salesDateTo = document.getElementById('sales-date-to');
const filterSalesBtn = document.getElementById('filter-sales');
const reportContent = document.getElementById('report-content');

// Initialize app - Pag-initialize ng app
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  setupEventListeners();
});

// Authentication functions - Mga function para sa authentication
async function checkAuthStatus() { // Suriin ang authentication status
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      // Validate token by making a test request
      const response = await fetch(`${API_BASE}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        authToken = token;
        const userData = JSON.parse(localStorage.getItem('userData'));
        currentUser = userData;
        showMainApp();
        await loadInitialData();
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        showLogin();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      showLogin();
    }
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('main-app').style.display = 'none';
}

function showMainApp() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('main-app').style.display = 'block';
  updateUserDisplay();
}

function updateUserDisplay() {
  if (currentUser) {
    if (userNameEl) userNameEl.textContent = currentUser.username;
    if (userStatusEl) userStatusEl.textContent = `Clocked in at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
}

async function login(username, password) { // Login function - Function para sa pag-login ng user
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userData', JSON.stringify(currentUser));
      showMainApp();
      await loadInitialData();
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}

function logout() { // Logout function - Function para sa pag-logout
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  cart = [];
  updateCart();
  showLogin();
}

// API request helper - Helper function para sa API requests
async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: { ...defaultOptions.headers, ...options.headers }
    });

    if (response.status === 401) {
      logout();
      throw new Error('Authentication required');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Load initial data
async function loadInitialData() {
  try {
    await Promise.all([
      loadProducts(),
      loadSettings(),
      loadDashboardStats()
    ]);
  } catch (error) {
    console.error('Failed to load initial data:', error);
  }
}

// Product functions
async function loadProducts() {
  try {
    const response = await apiRequest('/products');
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

function displayProducts(productsToShow) {
  productList.innerHTML = '';
  if (!productsToShow.length) {
    productList.innerHTML = '<div class="empty-state">Walang produktong tumutugma sa search o category.</div>';
    return;
  }

  productsToShow.forEach(product => {
    const productEl = document.createElement('div');
    productEl.className = 'product-item';
    productEl.innerHTML = `
      <div class="product-card-image"></div>
      <div class="product-tag">${product.category || 'Menu'}</div>
      <h4>${product.name}</h4>
      <div class="price-row">
        <div>
          <div class="price">$${product.price.toFixed(2)}</div>
          <div class="old-price">$${(product.price * 1.15).toFixed(2)}</div>
        </div>
        <button class="add-btn">ADD</button>
      </div>
    `;
    productEl.addEventListener('click', () => addToCart(product));
    productList.appendChild(productEl);
  });
}

function addToCart(product) {
  if (product.stock <= 0) {
    alert('Product out of stock!');
    return;
  }

  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let subtotal = 0;

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-state small">Wala pang item sa cart.</div>';
  }

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="item-icon">${item.name.charAt(0)}</div>
      <div class="item-text">
        <div class="item-name">${item.name}</div>
        <div class="item-price">$${item.price.toFixed(2)} each</div>
      </div>
      <div class="item-count">
        <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
      <div class="line-total">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    cartItems.appendChild(itemEl);
    subtotal += item.price * item.quantity;
  });

  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }
    updateCart();
  }
}

// Payment functions
async function processPayment(method) {
  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }

  try {
    const response = await apiRequest('/sales', {
      method: 'POST',
      body: JSON.stringify({
        items: cart,
        paymentMethod: method
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert(`Payment processed via ${method.toUpperCase()}\nSale ID: ${result.id}\nTotal: $${result.total.toFixed(2)}`);

      // Ina-update ang local stock pagkatapos ma-process ang sale.
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          product.stock -= item.quantity;
        }
      });

      // Nililinis ang cart at nire-refresh ang produkto pagkatapos ng bayad.
      cart = [];
      updateCart();
      displayProducts(products);
    } else {
      alert(result.error || 'Payment failed');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
}

// Settings functions
async function loadSettings() {
  try {
    const response = await apiRequest('/settings');
    const serverSettings = await response.json();

    settings = {
      storeName: serverSettings.store_name || 'My Store',
      taxRate: parseFloat(serverSettings.tax_rate || 8.25),
      currency: serverSettings.currency || 'USD'
    };

    updateSettingsDisplay();
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

function updateSettingsDisplay() {
  document.getElementById('store-name').value = settings.storeName;
  document.getElementById('tax-rate').value = settings.taxRate;
  document.getElementById('currency').value = settings.currency;
}

async function saveSettings() {
  const newSettings = {
    store_name: document.getElementById('store-name').value,
    tax_rate: document.getElementById('tax-rate').value,
    currency: document.getElementById('currency').value
  };

  try {
    const response = await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(newSettings)
    });

    if (response.ok) {
      settings = {
        storeName: newSettings.store_name,
        taxRate: parseFloat(newSettings.tax_rate),
        currency: newSettings.currency
      };
      alert('Settings saved successfully!');
      updateCart(); // Recalculate with new tax rate
    } else {
      alert('Failed to save settings');
    }
  } catch (error) {
    console.error('Settings save error:', error);
    alert('Failed to save settings');
  }
}

// Dashboard functions
async function loadDashboardStats() {
  try {
    const response = await apiRequest('/dashboard');
    const stats = await response.json();

    document.getElementById('today-sales').textContent = `$${stats.todaySales.toFixed(2)}`;
    document.getElementById('today-transactions').textContent = stats.todayTransactions;
    document.getElementById('total-products').textContent = stats.totalProducts;
    document.getElementById('total-stock').textContent = stats.totalStock;

    // Ipinapakita ang low stock alerts sa dashboard.
    const lowStockEl = document.getElementById('low-stock-alerts');
    lowStockEl.innerHTML = '';
    if (!stats.lowStockProducts.length) {
      lowStockEl.innerHTML = '<div class="empty-state small">Walang low stock ngayon.</div>';
      return;
    }
    stats.lowStockProducts.forEach(product => {
      const alertEl = document.createElement('div');
      alertEl.className = 'low-stock-item';
      alertEl.textContent = `${product.name}: ${product.stock} remaining`;
      lowStockEl.appendChild(alertEl);
    });
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
  }
}

// Inventory management
async function loadInventory() {
  displayInventory(products);
}

function displayInventory(productsToShow) {
  inventoryBody.innerHTML = '';
  if (!productsToShow.length) {
    inventoryBody.innerHTML = '<tr><td colspan="6" class="empty-cell">Walang produkto sa inventory.</td></tr>';
    return;
  }

  productsToShow.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category || '-'}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="small-btn" onclick="editProduct(${product.id})">Edit</button>
        <button class="small-btn danger" onclick="deleteProduct(${product.id})">Delete</button>
      </td>
    `;
    inventoryBody.appendChild(row);
  });
}

function filterSales(startDate, endDate) {
  const query = [];

  if (startDate) {
    query.push(`startDate=${startDate}`);
  }
  if (endDate) {
    query.push(`endDate=${endDate}`);
  }

  return apiRequest(`/sales${query.length ? '?' + query.join('&') : ''}`)
    .then(response => response.json())
    .then(filteredSales => {
      sales = filteredSales;
      displaySales(sales);
    });
}

async function saveProduct(productData, editId = null) {
  try {
    let response;
    if (editId) {
      response = await apiRequest(`/products/${editId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    } else {
      response = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    }

    if (response.ok) {
      await loadProducts();
      document.getElementById('product-modal').style.display = 'none';
      alert(editId ? 'Product updated successfully!' : 'Product added successfully!');
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to save product');
    }
  } catch (error) {
    console.error('Product save error:', error);
    alert('Failed to save product');
  }
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const response = await apiRequest(`/products/${productId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await loadProducts();
      alert('Product deleted successfully!');
    } else {
      alert('Failed to delete product');
    }
  } catch (error) {
    console.error('Product delete error:', error);
    alert('Failed to delete product');
  }
}

// Sales history
async function loadSales() {
  try {
    const response = await apiRequest('/sales');
    sales = await response.json();
    displaySales(sales);
  } catch (error) {
    console.error('Failed to load sales:', error);
  }
}

function displaySales(salesToShow) {
  const tbody = document.getElementById('sales-body');
  tbody.innerHTML = '';
  if (!salesToShow.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">Wala pang sales record.</td></tr>';
    return;
  }

  salesToShow.forEach(sale => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sale.id}</td>
      <td>${new Date(sale.created_at).toLocaleDateString()}</td>
      <td>${sale.items_summary || 'N/A'}</td>
      <td>$${parseFloat(sale.total).toFixed(2)}</td>
      <td>${sale.payment_method}</td>
    `;
    tbody.appendChild(row);
  });
}

// Event listeners setup
function setupEventListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    login(username, password);
  });

  // Navigation
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const sectionId = btn.dataset.section + '-section';
      document.getElementById(sectionId).classList.add('active');

      // Load section data
      if (btn.dataset.section === 'inventory') loadInventory();
      if (btn.dataset.section === 'sales') loadSales();
      if (btn.dataset.section === 'dashboard') loadDashboardStats();
    });
  });

  // Payment buttons - pinipili muna ang payment method bago mag-proceed.
  document.getElementById('cash-payment').addEventListener('click', () => selectPaymentMethod('cash'));
  document.getElementById('card-payment').addEventListener('click', () => selectPaymentMethod('card'));
  document.getElementById('complete-sale').addEventListener('click', () => processPayment(selectedPaymentMethod));

  // Settings
  document.getElementById('save-settings').addEventListener('click', saveSettings);

  // Product modal
  document.getElementById('add-product-btn').addEventListener('click', () => {
    document.getElementById('product-form').reset();
    document.getElementById('modal-title').textContent = 'Add Product';
    delete document.getElementById('save-product').dataset.editId;
    document.getElementById('product-modal').style.display = 'block';
  });

  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('product-modal').style.display = 'none';
  });

  document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const productData = {
      name: document.getElementById('product-name').value,
      price: parseFloat(document.getElementById('product-price').value),
      category: document.getElementById('product-category').value,
      stock: parseInt(document.getElementById('product-stock').value),
      barcode: document.getElementById('product-barcode').value
    };

    const editId = document.getElementById('save-product').dataset.editId;
    saveProduct(productData, editId);
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', logout);

  // Product search
  document.getElementById('product-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      (product.barcode && product.barcode.includes(searchTerm))
    );
    displayProducts(filteredProducts);
  });

  inventorySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      (product.barcode && product.barcode.includes(searchTerm)) ||
      (product.category && product.category.toLowerCase().includes(searchTerm))
    );
    displayInventory(filteredProducts);
  });

  filterSalesBtn.addEventListener('click', () => {
    const startDate = salesDateFrom.value;
    const endDate = salesDateTo.value;
    filterSales(startDate, endDate);
  });

  document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    updateCart();
  });

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.dataset.category;
      if (category === 'All') {
        displayProducts(products);
      } else {
        displayProducts(products.filter(product => product.category === category));
      }
    });
  });

  // Reports
  document.querySelectorAll('.report-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const reportType = btn.dataset.report;
      generateReport(reportType);
    });
  });
}

function selectPaymentMethod(method) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
  const activeButton = method === 'cash'
    ? document.getElementById('cash-payment')
    : document.getElementById('card-payment');
  activeButton.classList.add('active');
}

// Report generation
async function generateReport(type) {
  const reportContent = document.getElementById('report-content');

  try {
    let content = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h3>`;

    switch (type) {
      case 'daily': {
        const today = new Date().toISOString().split('T')[0];
        const response = await apiRequest(`/sales?startDate=${today}&endDate=${today}`);
        const todaySales = await response.json();
        const todayTotal = todaySales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        content += `<p>Today's Sales: $${todayTotal.toFixed(2)}</p>`;
        content += `<p>Number of transactions: ${todaySales.length}</p>`;
        break;
      }
      case 'weekly': {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        const startDate = weekAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];
        const response = await apiRequest(`/sales?startDate=${startDate}&endDate=${endDate}`);
        const weekSales = await response.json();
        const weekTotal = weekSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        content += `<p>Weekly Sales (${startDate} to ${endDate}): $${weekTotal.toFixed(2)}</p>`;
        content += `<p>Transactions: ${weekSales.length}</p>`;
        break;
      }
      case 'monthly': {
        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        const startDate = monthAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];
        const response = await apiRequest(`/sales?startDate=${startDate}&endDate=${endDate}`);
        const monthSales = await response.json();
        const monthTotal = monthSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        content += `<p>Monthly Sales (${startDate} to ${endDate}): $${monthTotal.toFixed(2)}</p>`;
        content += `<p>Transactions: ${monthSales.length}</p>`;
        break;
      }
      case 'inventory':
        content += '<h4>Current Inventory</h4><ul>';
        products.forEach(product => {
          content += `<li>${product.name}: ${product.stock} units ($${product.price.toFixed(2)} each)</li>`;
        });
        content += '</ul>';
        break;
    }

    reportContent.innerHTML = content;
  } catch (error) {
    console.error('Report generation error:', error);
    reportContent.innerHTML = '<p>Failed to generate report</p>';
  }
}

// Utility functions
function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-barcode').value = product.barcode;
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('save-product').dataset.editId = id;
    document.getElementById('product-modal').style.display = 'block';
  }
}

// Make functions globally available
window.changeQuantity = changeQuantity;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
