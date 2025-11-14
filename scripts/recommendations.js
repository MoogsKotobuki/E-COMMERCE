// Function to load and display recommended products in carousel style (with random selection)
async function loadRecommendedProducts() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/MoogsKotobuki/E-COMMERCE/refs/heads/main/database/products.Json');
        if (!response.ok) throw new Error('Failed to load products');
        const products = await response.json();

        // Group products by productType
        const grouped = products.reduce((acc, product) => {
            if (!acc[product.productType]) acc[product.productType] = [];
            acc[product.productType].push(product);
            return acc;
        }, {});

        // Define the order of product types (matching your dropdown) - premade for Accessories and PC Components
        const typeOrder = ['Games', 'Laptops', 'Accessories', 'PC Components'];
        let html = '';

        typeOrder.forEach(type => {
            if (grouped[type] && grouped[type].length > 0) {
                // Randomly select at least 2 products for this type (or all if fewer)
                // Randomness: Shuffle the array and pick the first N
                const shuffled = grouped[type].sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, Math.max(2, shuffled.length)); // At least 2 if available

                // Group selected products into slides of 2
                const slides = [];
                for (let i = 0; i < selected.length; i += 2) {
                    slides.push(selected.slice(i, i + 2));
                }

                // Generate carousel HTML for this type
                const carouselId = `carousel-${type.replace(/\s+/g, '-').toLowerCase()}`;
                html += `
                    <hr class="my-4">
                    <h2 class="mb-3">${type}</h2>
                    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                `;

                slides.forEach((slideProducts, index) => {
                    const activeClass = index === 0 ? 'active' : '';
                    html += `<div class="carousel-item ${activeClass}">`;
                    html += '<div class="row justify-content-center">'; // Center the cards in the slide
                    slideProducts.forEach(product => {
                        const price = product.price[0] || 'N/A';
                        html += `
                            <div class="col-md-6 mb-3">
                                <div class="card h-100">
                                    <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: cover;">
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title">${product.title}</h5>
                                        <p class="card-text">${product.description.substring(0, 100)}...</p>
                                        <p class="card-text"><strong>Price: $${price}</strong></p>
                                        <a href="../pages/productOverview.html?id=${product.id}" class="btn btn-primary mt-auto">View Product</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    html += '</div></div>';
                });

                html += `
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                `;
            }
        });

        if (!html) {
            html = '<p class="text-center">No recommendations available at the moment.</p>';
        }

        document.getElementById('products-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-content').innerHTML = '<p class="text-center text-danger">Unable to load recommendations. Please try again later.</p>';
    }
}

// Helper: Map productType to filter ID (matching your dropdown)
function getFilterId(type) {
    const map = { 'Games': 1, 'Laptops': 2, 'Accessories': 3, 'PC Components': 4 };
    return map[type] || 1; // Default to 1 if unknown
}

// Load recommendations on page load
document.addEventListener('DOMContentLoaded', loadRecommendedProducts);