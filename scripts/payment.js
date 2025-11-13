// checkout.js

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productSection = document.querySelectorAll(".section")[1]; // Product Ordered section
  const totalDiv = productSection.querySelector(".total");

  // Remove placeholder products
  productSection.querySelectorAll(".product").forEach(p => p.remove());

  let grandTotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    let title = item.title;
    if (item.optionSelected) title += " - " + item.optionSelected;

    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <div>${title} × ${item.quantity}</div>
      <div>₱${itemTotal.toFixed(2)}</div>
    `;
    productSection.insertBefore(div, totalDiv);
  });

  totalDiv.textContent = "Total: ₱" + grandTotal.toFixed(2);
}

const pO = document.getElementById('placeOrder');
pO.addEventListener('click',placeOrder)


function placeOrder() {
  const inputs = document.querySelectorAll("#address input");
  const selectedPayment = document.querySelector('input[name="payment"]:checked');
  let valid = true;

  // Check all address fields
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      valid = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  // Check payment method
  if (!selectedPayment) {
    alert("Please select a payment method.");
    valid = false;
  }

  if (!valid) {
    alert("Please fill out all required fields before placing your order.");
    return;
  }

  // Mock payment section
  const method = selectedPayment.value;
  alert(`Order placed successfully!\nPayment Method: ${method}`);

  // Clear cart and redirect
  localStorage.removeItem("cart");
  window.location.href = "../index.html";
}
