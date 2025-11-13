const container = document.getElementById("pContainer")


async function loadDB()
{
  const response = await fetch("https://moogskotobuki.github.io/database/products.json");
  const db = await response.json();
  return db;
}
const database = await loadDB();
console.log(database)

database.forEach(db => {
  
  showProduct(db.id,db.title,db.price[0],db.image)
  
});


function showProduct(id,Title,Price,image)
{
  container.innerHTML += 
  `

  <div class="card m-2 custom-primaryColor" style="width: 18rem;">
    <img src="${image}" class="card-img-top product-img" alt="...">
    <div class="card-body ">
      <h5 class="card-title"><strong>${Title}</strong></h5>
      <p class="card-text">
      ₱${Price}</p>
      <a href="../pages/productOverview.html?id=${id}" class="btn btn-primary">Show Product</a>
      <a href="#" class="btn btn-primary">Add</a>
    </div>
  </div>

`
}