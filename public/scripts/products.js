async function fetchData(endpoint) {
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`);
    if (!response.ok) throw new Error(`Error fetching data from ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("Error", error);
    return [];
  }
}

function displayProducts(products) {
  const productList = document.getElementById("productList");
  if (!products.length) {
    productList.innerHTML = `<p class="text-center text-danger">
        No products found.</p>`;
    return;
  }

  productList.innerHTML = `
        <table class="table table-striped table-bordered">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
                </thead>
             <tbody>
    ${products
      .map(
        (product) => `
        <tr>
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td>$${product.unitPrice.toFixed(2)}</td>
            <td>${product.unitsInStock}</td>
            <td>
                <a href="details.html?id=${
                  product.productId
                }" class="btn btn-primary btn-sm">View Details</a>
            </td>
        </tr>
    `
      )
      .join("")}
        </tbody>
    </table>
`;
}

document
  .getElementById("searchType")
  .addEventListener("change", async function () {
    const type = this.value;
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Clear the list

    if (type === "viewAll") {
      const products = await fetchData("/api/products");
      displayProducts(products);
    } else if (type === "byCategory") {
      const categories = await fetchData("/api/categories");
      const categorySelect = document.getElementById("categories");
      categorySelect.innerHTML = `
            <option value="">Select One...</option>
            ${categories
              .map(
                (cat) =>
                  `<option value="${cat.categoryId}">${cat.name}</option>`
              )
              .join("")}
        `;
      document.getElementById("categorySelect").style.display = "block";

      categorySelect.addEventListener("change", async function () {
        const products = await fetchData(
          `/api/products/bycategory/${this.value}`
        );
        displayProducts(products);
      });
    }
  });

document.getElementById("resetButton").addEventListener("click", function () {
  document.getElementById("searchType").value = "";
  document.getElementById("categorySelect").style.display = "none";
  document.getElementById("categories").innerHTML = "";
  document.getElementById("productList").innerHTML = "";
});
