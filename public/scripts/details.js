async function fetchData(endpoint) {
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`);
    if (!response.ok) throw new Error(`Error fetching data from ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("Error", error);
    return null;
  }
}

function displayProductDetails(product) {
  const productDetails = document.getElementById("productDetails");

  if (!product) {
    productDetails.innerHTML = `<p class="text-center text-danger"</p>`;
    return;
  }
  productDetails.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">${product.productName}</h3>
                <p class="card-text"><strong>Price:</strong> $${product.unitPrice.toFixed(
                  2
                )}</p>
                <p class="card-text"><strong>Stock:</strong> ${
                  product.unitsInStock
                }</p>
                <p class="card-text"><strong>Supplier:</strong> ${
                  product.supplier
                }</p>
                <p class="card-text"><strong>Category ID:</strong> ${
                  product.categoryId
                }</p>
                <p class="card-text"><strong>Discontinued:</strong> ${
                  product.discontinued === "true" ? "Yes" : "No"
                }</p>
            </div>
        </div>
        `;
}

// Get the product ID from the URL
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Get the product details from the server
async function main() {
  const productId = getProductIdFromUrl();
  if (!productId) {
    displayProductDetails(null);
    return;
  }

  const product = await fetchData(`/api/products/${productId}`);
  displayProductDetails(product);
}

main();
