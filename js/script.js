
"use strict";

// Menu Data Section

const MENU_ITEMS = [
  { id: 1, name: "Smash Burger", category: "Burgers", price: 249, rating: "4.9", tag: "Bestseller", description: "Double smashed patty, cheddar, pickles and our signature sauce.", image: "./assets/food-images/smash-burger.png" },
  { id: 2, name: "Fiery Chicken Burger", category: "Burgers", price: 279, rating: "4.8", tag: "Spicy", description: "Crispy chicken, spicy mayo, lettuce and a little kick.", image: "./assets/food-images/chiken-burger.png" },
  { id: 3, name: "Loaded Cheese Pizza", category: "Pizza", price: 329, rating: "4.9", tag: "Popular", description: "Golden crust, rich tomato sauce and a blanket of cheese.", image: "./assets/food-images/cheese-pizza.png" },
  { id: 4, name: "Garden Fresh Pizza", category: "Pizza", price: 299, rating: "4.7", tag: "Veg", description: "Bell peppers, olives, onion and herbs on a crisp base.", image: "./assets/food-images/garden-golden-pizza.png"},
  { id: 5, name: "Crispy Loaded Fries", category: "Sides", price: 159, rating: "4.8", tag: "Must try", description: "Crunchy fries topped with cheese sauce and herbs.", image: "./assets/food-images/crisy-fries.png"},
  { id: 6, name: "Peri Peri Wings", category: "Sides", price: 219, rating: "4.8", tag: "Spicy", description: "Juicy wings tossed in our smoky peri peri seasoning.", image: "./assets/food-images/peri-peri-wings.png" },
  { id: 7, name: "Classic Cold Coffee", category: "Drinks", price: 119, rating: "4.6", tag: "Chilled", description: "Creamy, chilled coffee blended for a smooth finish.", image: "./assets/food-images/classic-cold-coffe.png" },
  { id: 8, name: "Mango Cooler", category: "Drinks", price: 99, rating: "4.7", tag: "Fresh", description: "A bright mango refresher with a citrusy twist.", image: "./assets/food-images/mango-cooler.png" },
  { id: 9, name: "Chocolate Brownie", category: "Desserts", price: 139, rating: "4.9", tag: "Sweet pick", description: "Rich chocolate brownie with a soft, fudgy centre.", image: "./assets/food-images/chocolate-brownie.png"},
  { id: 10, name: "Classic Cheesecake", category: "Desserts", price: 169, rating: "4.8", tag: "Treat", description: "Creamy baked cheesecake with a buttery biscuit base.", image: "./assets/food-images/cheesecake.png" }
];


// Cart Section

const CART_KEY = "yahRestaurantCart";
const COUPON_KEY = "yahRestaurantCoupon";
let activeCategory = "All";
let activeSearch = "";
let activeSort = "popular";

function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(item => MENU_ITEMS.some(food => food.id === Number(item.id)) && Number(item.quantity) > 0) : [];
  } catch (error) {
    console.warn("Cart data could not be read. Starting with an empty cart.", error);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
}

function updateCartBadges() {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity), 0);
  document.querySelectorAll(".cart-count").forEach(badge => badge.textContent = count);
}

function addToCart(id) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart(cart);
  showToast("Added to your happy place!");
}

function changeQuantity(id, change) {
  const cart = getCart();
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += change;
  saveCart(cart.filter(entry => entry.quantity > 0));
  renderCart();
}

function removeFromCart(id) {
  saveCart(getCart().filter(item => item.id !== id));
  renderCart();
  showToast("Item removed from cart.");
}


// Food Card Section

function createFoodCard(food) {
  const article = document.createElement("article");
  article.className = "food-card";
  article.innerHTML = `
    <div class="food-image-wrap">
      <img class="food-image" src="${food.image}" alt="${food.name}" loading="lazy">
      <span class="food-tag">${food.tag}</span>
    </div>
    <div class="food-card-body">
      <div class="food-card-top"><h3>${food.name}</h3><span class="food-price">₹${food.price}</span></div>
      <p class="food-description">${food.description}</p>
      <div class="food-card-bottom"><span class="food-rating"><i class="fa-solid fa-star"></i> ${food.rating}</span>
        <button class="add-btn" type="button" aria-label="Add ${food.name} to cart"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>`;
  article.querySelector(".add-btn").addEventListener("click", () => addToCart(food.id));
  return article;
}

function renderFeaturedFoods() {
  const target = document.getElementById("featured-foods");
  if (!target) return;
  target.replaceChildren(...MENU_ITEMS.slice(0, 4).map(createFoodCard));
}


// Menu Filter Section

function renderMenu() {
  const target = document.getElementById("menu-foods");
  if (!target) return;
  let results = MENU_ITEMS.filter(food => {
    const matchesCategory = activeCategory === "All" || food.category === activeCategory;
    const query = activeSearch.toLowerCase();
    const matchesSearch = `${food.name} ${food.description} ${food.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  if (activeSort === "low") results.sort((a, b) => a.price - b.price);
  if (activeSort === "high") results.sort((a, b) => b.price - a.price);
  if (activeSort === "az") results.sort((a, b) => a.name.localeCompare(b.name));
  target.replaceChildren(...results.map(createFoodCard));
  document.getElementById("menu-result-count").textContent = `${results.length} delicious ${results.length === 1 ? "option" : "options"}`;
  document.getElementById("empty-menu").classList.toggle("hidden", results.length !== 0);
}

function setupMenuFilters() {
  const search = document.getElementById("menu-search");
  if (!search) return;
  search.addEventListener("input", event => { activeSearch = event.target.value.trim(); renderMenu(); });
  document.getElementById("menu-sort").addEventListener("change", event => { activeSort = event.target.value; renderMenu(); });
  document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
    renderMenu();
  }));
  document.getElementById("clear-filters").addEventListener("click", () => {
    activeCategory = "All"; activeSearch = ""; activeSort = "popular";
    search.value = ""; document.getElementById("menu-sort").value = "popular";
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.category === "All"));
    renderMenu();
  });
}


// Order Calculation Section

function calculateTotals() {
  const subtotal = getCart().reduce((sum, item) => {
    const food = MENU_ITEMS.find(entry => entry.id === item.id);
    return sum + (food ? food.price * item.quantity : 0);
  }, 0);
  const coupon = localStorage.getItem(COUPON_KEY) || "";
  const discount = coupon === "YEH10" ? Math.round(subtotal * 0.10) : coupon === "FEAST50" && subtotal >= 399 ? 50 : 0;
  const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 40;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}


// Cart Display Section

function renderCart() {
  const target = document.getElementById("cart-items");
  if (!target) return;
  const cart = getCart();
  target.replaceChildren();
  cart.forEach(item => {
    const food = MENU_ITEMS.find(entry => entry.id === item.id);
    if (!food) return;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${food.image}" alt="${food.name}">
      <div class="cart-row-info"><strong>${food.name}</strong><span>₹${food.price}</span></div>
      <div class="quantity-control">
        <button type="button" aria-label="Decrease ${food.name} quantity" data-action="minus">−</button>
        <strong>${item.quantity}</strong>
        <button type="button" aria-label="Increase ${food.name} quantity" data-action="plus">+</button>
      </div>
      <button class="remove-item" type="button" aria-label="Remove ${food.name}"><i class="fa-solid fa-trash"></i></button>`;
    row.querySelector('[data-action="minus"]').addEventListener("click", () => changeQuantity(food.id, -1));
    row.querySelector('[data-action="plus"]').addEventListener("click", () => changeQuantity(food.id, 1));
    row.querySelector(".remove-item").addEventListener("click", () => removeFromCart(food.id));
    target.appendChild(row);
  });
  document.getElementById("empty-cart").classList.toggle("hidden", cart.length !== 0);
  document.getElementById("checkout-form").querySelectorAll("input, textarea, button[type=submit]").forEach(control => control.disabled = cart.length === 0);
  updateOrderSummary();
}

function updateOrderSummary() {
  const totals = calculateTotals();
  const money = value => `₹${value.toLocaleString("en-IN")}`;
  const subtotal = document.getElementById("subtotal");
  if (!subtotal) return;
  subtotal.textContent = money(totals.subtotal);
  document.getElementById("discount").textContent = `−${money(totals.discount)}`;
  document.getElementById("delivery-fee").textContent = money(totals.delivery);
  document.getElementById("grand-total").textContent = money(totals.total);
}


// Coupon Section

function setupCoupon() {
  const button = document.getElementById("apply-coupon");
  if (!button) return;
  button.addEventListener("click", () => {
    const code = document.getElementById("coupon-code").value.trim().toUpperCase();
    const subtotal = calculateTotals().subtotal;
    const feedback = document.getElementById("coupon-feedback");
    if (code === "YEH10" && subtotal > 0) {
      localStorage.setItem(COUPON_KEY, code);
      feedback.textContent = "YEH10 applied — 10% off your food subtotal!";
    } else if (code === "FEAST50" && subtotal >= 399) {
      localStorage.setItem(COUPON_KEY, code);
      feedback.textContent = "FEAST50 applied — ₹50 off your order!";
    } else {
      localStorage.removeItem(COUPON_KEY);
      feedback.textContent = code === "FEAST50" ? "FEAST50 needs a food subtotal of ₹399." : "That code isn't valid. Try YEH10 or FEAST50.";
    }
    updateOrderSummary();
  });
}


// Checkout Section

function setupCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (getCart().length === 0) return;
    const orderCode = `YAH-${Date.now().toString().slice(-7)}`;
    document.getElementById("order-number").textContent = orderCode;
    document.getElementById("order-modal").classList.remove("hidden");
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(COUPON_KEY);
    updateCartBadges();
    renderCart();
    form.reset();
  });
  const modal = document.getElementById("order-modal");
  document.getElementById("close-order-modal").addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", event => { if (event.target === modal) modal.classList.add("hidden"); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") modal.classList.add("hidden"); });
}


// Contact Form Section

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    document.getElementById("contact-feedback").textContent = "Thanks! Your message passed validation. Connect a backend to deliver it to the restaurant.";
    form.reset();
  });
}


// Mobile Navigation Section

function setupMobileNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));
}


// Toast Notification Section

function showToast(message) {
  let toast = document.getElementById("yah-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "yah-toast";
    toast.style.cssText = "position:fixed;z-index:200;bottom:24px;left:50%;transform:translateX(-50%);background:#ffc857;color:#21150b;padding:12px 20px;border-radius:99px;font-weight:700;box-shadow:0 8px 30px #0008;";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(window.yahToastTimer);
  window.yahToastTimer = setTimeout(() => toast.classList.add("hidden"), 2200);
}


// Initialize App Section

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(node => node.textContent = new Date().getFullYear());
  setupMobileNavigation();
  updateCartBadges();
  renderFeaturedFoods();
  setupMenuFilters();
  renderMenu();
  renderCart();
  setupCoupon();
  setupCheckout();
  setupContactForm();
});
