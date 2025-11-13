const container = document.getElementById("pContainer");
const priceSlider = document.getElementById("customRange2");
const priceCheck = document.getElementById("priceCheck");
const filterRadios = document.querySelectorAll('input[name="flexRadioDefault"]');

// Create a price label below the slider
let priceLabel = document.createElement('p');
priceSlider.parentNode.insertBefore(priceLabel, priceSlider.nextSibling);

// Load database
async function loadDB() {
  const response = await fetch("https://raw.githubusercontent.com/MoogsKotobuki/E-COMMERCE/refs/heads/main/database/products.Json");
  const db = await response.json();
  return db;
}

const database = await loadDB();

// Map filter ID to product type (must match the "productType" property in your JSON)
const filterMap = {
  "0": "All",
  "1": "Games",
  "2": "Laptops",
  "3": "PC Components",
  "4": "Accessories"
};

// Initialize filters from URL
function initFiltersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter'); // e.g., "1", "2"
  const priceParam = urlParams.get('price'); // e.g., "1500"
  const priceEnabledParam = urlParams.get('priceEnabled'); // "true" or "false"

  if (filterParam && document.getElementById(`filter${filterParam}`)) {
    document.getElementById(`filter${filterParam}`).checked = true;
  }

  if (priceParam) priceSlider.value = priceParam;
  if (priceEnabledParam) priceCheck.checked = priceEnabledParam === "true";
}

initFiltersFromURL();

// Function to render a product
function showProduct(id, Title, Price, image) {
  return `
    <div class="card m-2 custom-primaryColor" style="width: 18rem;">
      <img src="${image}" class="card-img-top product-img" alt="${Title}">
      <div class="card-body">
        <h5 class="card-title"><strong>${Title}</strong></h5>
        <p class="card-text">₱${Price}</p>
        <a href="../pages/productOverview.html?id=${id}" class="btn btn-primary">Show Product</a>
        <button class="btn btn-primary add-to-cart-btn" data-product-id="${id}">Add to Cart</button>
      </div>
    </div>
  `;
}

// Filter and display products
function filterProducts() {
  const selectedTypeId = [...filterRadios].find(r => r.checked)?.id.replace('filter', '');
  const selectedType = filterMap[selectedTypeId] || "All";
  const maxPrice = parseInt(priceSlider.value);

  // Update price label
  priceLabel.innerText = `Max Price: ₱${maxPrice}`;

  console.log('Selected Type ID:', selectedTypeId);
  console.log('Selected Type:', selectedType);

  container.innerHTML = "";

  database.forEach(product => {
    // Normalize product type from JSON (which is "productType")
    const productType = product.productType?.toString().toLowerCase();
    const selectedTypeNormalized = selectedType.toLowerCase();

    console.log('Product Type:', productType, 'Selected Normalized:', selectedTypeNormalized);

    const typeMatch = selectedType === "All" || productType === selectedTypeNormalized;
    const priceMatch = !priceCheck.checked || product.price[0] <= maxPrice;

    if (typeMatch && priceMatch) {
      container.innerHTML += showProduct(product.id, product.title, product.price[0], product.image);
    }
  });

  // Update URL without reloading
  const url = new URL(window.location);
  url.searchParams.set('filter', selectedTypeId);
  url.searchParams.set('price', maxPrice);
  url.searchParams.set('priceEnabled', priceCheck.checked);
  window.history.replaceState({}, '', url);

  // Re-attach event listeners for new buttons
  attachAddToCartListeners();
}

// Add to Cart functionality
function addProductToCart(productId) {
  const product = database.find(p => p.id == productId);
  if (!product) {
    alert("Product not found.");
    return;
  }

  const Quantity = 1; // Default quantity on listing page
  const intPrice = parseFloat(product.price[0]); // Unit price

  if (Quantity <= 0) {
    alert("Invalid quantity.");
    return;
  }

  // Always choose the first option (as per your request)
  const optionSelected = product.options ? product.options[0] : null;

  // Prepare the cart item
  const cartItem = {
    id: product.id,
    title: product.title,
    price: intPrice, // Unit price
    optionSelected: optionSelected,
    quantity: Quantity,
    image: product.image
  };

  // Get existing cart or create empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Find if same product + same option already exists
  const existingIndex = cart.findIndex(item =>
    item.id === product.id && item.optionSelected === cartItem.optionSelected
  );

  if (existingIndex > -1) {
    // Update quantity
    cart[existingIndex].quantity += Quantity;
    // Price remains unit price
  } else {
    // Add new product entry
    cart.push(cartItem);
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // User feedback
  alert(`${product.title} (${optionSelected || 'Default'}) added to cart!`);

  console.log("Updated cart:", cart);
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalCount = 0;

  // Sum up all quantities
  cart.forEach(item => {
    totalCount += item.quantity;
  });

  // Update the span element
  const counter = document.getElementById("cartCount");
  if (counter) {
    counter.textContent = totalCount;
  }
}

function attachAddToCartListeners() {
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-product-id');
      addProductToCart(productId);
    });
  });
}

// Add event listeners to all controls
filterRadios.forEach(radio => radio.addEventListener('change', filterProducts));
priceSlider.addEventListener('input', filterProducts);
priceCheck.addEventListener('change', filterProducts);

// Initial render
filterProducts();

// Initial cart count update
updateCartCount();