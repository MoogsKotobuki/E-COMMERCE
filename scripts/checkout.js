const productsContainer = document.getElementById('products');
let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCart();

function updateCart() {
  productsContainer.innerHTML = ""; // clear display first

  cart.forEach((item, index) => {
    const total = (item.price * item.quantity).toFixed(2);
    let productTitle = item.title;
    if (item.optionSelected) productTitle += " - " + item.optionSelected;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${item.image}" height="50px" alt="">
        ${productTitle}
      </td>
      <td>₱${item.price.toFixed(2)}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" class="form-control qty-input" data-index="${index}" style="width: 80px;">
      </td>
      <td class="total">₱${total}</td>
      <td><button class="btn btn-danger delete-btn" data-index="${index}">Delete</button></td>
    `;
    productsContainer.appendChild(row);
  });

  attachEventListeners();
  updateCartCount();
}

// Handle quantity and delete actions
function attachEventListeners() {
  // Quantity change
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const index = e.target.dataset.index;
      let newQty = parseInt(e.target.value);
      if (isNaN(newQty) || newQty < 1) newQty = 1;

      cart[index].quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));

      const totalCell = e.target.closest("tr").querySelector(".total");
      totalCell.textContent = "₱" + (cart[index].price * newQty).toFixed(2);

      updateCartCount();
    });
  });

  // Delete button
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
      updateCartCount();
    });
  });
}

// Optional: Cart item counter
function updateCartCount() {
  const countSpan = document.getElementById("cartCount");
  if (countSpan) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countSpan.textContent = totalItems;
  }
}