// Plant Data Repository
const plantData = [
  { id: 1, category: "flower", name: "Rose", description: "Vibrant crimson roses with a rich floral fragrance.", price: 500, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
  { id: 2, category: "flower", name: "Tulip", description: "Elegantly sculpted petals perfect for bright spaces.", price: 400, image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80" },
  { id: 3, category: "fruit", name: "Apple Tree", description: "Dwarf fruit-bearing hybrid ideal for container orchards.", price: 1500, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80" },
  { id: 4, category: "fruit", name: "Mango Tree", description: "Tropical grafted species providing sweet, luscious yields.", price: 1200, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80" },
  { id: 5, category: "medicinal", name: "Aloe Vera", description: "Classic succulent rich in healing enzymes.", price: 350, image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80" },
  { id: 6, category: "medicinal", name: "Holy Basil", description: "Aromatic therapeutic herb valued for wellness.", price: 300, image: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=600&q=80" },
  { id: 7, category: "indoor", name: "Snake Plant", description: "Air-purifying, structural powerhouse foliage.", price: 600, image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=600&q=80" },
  { id: 8, category: "indoor", name: "Peace Lily", description: "Graceful deep green foliage with bright white spathes.", price: 700, image: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80" },
  { id: 9, category: "outdoor", name: "Majesty Palm", description: "Feathery fronds that bring a resort feel home.", price: 2000, image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80" },
  { id: 10, category: "outdoor", name: "Golden Cactus", description: "Low-water architectural drought-tolerant display.", price: 500, image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80" }
];

let cart = JSON.parse(localStorage.getItem("greenlife_cart")) || [];
let activeCategory = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  updateCartUI();
  setupCartEvents();
});

// Render Plant Grid
function renderGrid() {
  const grid = document.getElementById("plantGrid");
  if (!grid) return;

  const filteredItems = plantData.filter(item => {
    return activeCategory === "all" || item.category === activeCategory;
  });

  grid.innerHTML = "";

  filteredItems.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${plant.image}" alt="${plant.name}" loading="lazy">
      </div>
      <div class="info">
        <h3>${plant.name}</h3>
        <p class="desc">${plant.description}</p>
        <div class="card-footer">
          <span class="price">৳${plant.price}</span>
          <button class="add-btn" onclick="addToCart(${plant.id})" aria-label="Add to Cart">+</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter Category Button Handler
window.filterCategory = function(category, buttonEl) {
  activeCategory = category;
  document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
  if (buttonEl) buttonEl.classList.add("active");
  renderGrid();
};

// Add Item to Cart Handler
window.addToCart = function(plantId) {
  const existingItemIndex = cart.findIndex(item => item.id === plantId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    const plant = plantData.find(p => p.id === plantId);
    if (plant) {
      cart.push({ ...plant, quantity: 1 });
    }
  }

  saveCartAndSync();
  openCart();
};

// Quantity & Remove Handlers
window.changeQuantity = function(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCartAndSync();
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCartAndSync();
};

function saveCartAndSync() {
  localStorage.setItem("greenlife_cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.innerText = totalCount;

  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">Your cart is currently empty.</p>`;
    totalEl.innerText = "৳0";
    return;
  }

  container.innerHTML = "";
  let totalAmount = 0;

  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>৳${item.price} x ${item.quantity}</p>
      </div>
      <div class="quantity-controls" style="display: flex; align-items: center; gap: 6px;">
        <button onclick="changeQuantity(${idx}, -1)" style="border:none; background:var(--bg-color); width:24px; height:24px; border-radius:50%; cursor:pointer;">-</button>
        <span style="font-weight:700; font-size:0.9rem;">${item.quantity}</span>
        <button onclick="changeQuantity(${idx}, 1)" style="border:none; background:var(--bg-color); width:24px; height:24px; border-radius:50%; cursor:pointer;">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${idx})" title="Remove Item">&times;</button>
    `;
    container.appendChild(itemEl);
  });

  totalEl.innerText = `৳${totalAmount}`;
}

// Drawer Visibility Controls
function setupCartEvents() {
  const overlay = document.getElementById("cartOverlay");
  const closeBtn = document.getElementById("cartCloseBtn");
  const openBtn = document.getElementById("cartToggleBtn");

  if (openBtn) openBtn.addEventListener("click", openCart);
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  if (overlay) overlay.addEventListener("click", closeCart);
}

function openCart() {
  const overlay = document.getElementById("cartOverlay");
  const drawer = document.getElementById("cartDrawer");
  if (overlay) overlay.classList.add("open");
  if (drawer) drawer.classList.add("open");
}

function closeCart() {
  const overlay = document.getElementById("cartOverlay");
  const drawer = document.getElementById("cartDrawer");
  if (overlay) overlay.classList.remove("open");
  if (drawer) drawer.classList.remove("open");
}

window.checkout = function() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  alert(`Thank you for your order! Total payment: ৳${totalAmount}`);
  cart = [];
  saveCartAndSync();
  closeCart();
};