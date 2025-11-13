//retriving the id on the URL

let param = new URLSearchParams(document.location.search)
let id = param.get("id")


//loading products database
async function loadDB()
{
  const response = await fetch("https://moogskotobuki.github.io/E-COMMERCE/database/products.json");
  const db = await response.json();
  return db;
}
const database = await loadDB();
console.log(database)

//Option Seletor Entity
var a = document.querySelector("optionsSelected");


//For Update UI Elements of the HTML
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const imag = document.getElementById('image');
const option = document.getElementById('option');
const quantity = document.getElementById('quantity')
const addToCart = document.getElementById('addCart');


//price Indicator tells which price to show relatively to an option
let priceIndex = 0;

let data = database[id]

let Price = data.price[priceIndex]

let Quantity = parseInt(quantity.innerHTML)



console.log(data)

//Updating The UI elements
title.innerHTML = data.title;
price.innerHTML = '₱' + Price;
description.innerHTML = data.description;
option.innerHTML = data.optionName + ':';

imag.src = data.image

//initializing options
optionInit(data);
let intPrice = parseFloat(Price.replace(',',''))

console.log(intPrice)


function changePrice(index)
{
  priceIndex = index;
  Price = data.price[priceIndex];
  intPrice = parseFloat(Price.replace(',',''))
  price.innerHTML = '₱' + Price;
} 


function optionInit(O)
{
  const optionHoler = document.getElementById("optionHolder");
  let options = O.options;
    console.log(options);
  let indexCount = 0;
  options.forEach(A => {
    
    if(indexCount == 0)
    {
      //creating a selector Entity
      optionHolder.innerHTML += `
      
      <div id="optionSelector"></div>
      `
      a = document.getElementById('optionSelector')
      console.log(a);

    }

    optionHoler.innerHTML += `
    <button class="btn btn-primary p-3 m-2 productOptions" id="options" type="button" name="${indexCount}" id="${indexCount}">${A}</button>
`
    indexCount++;
  });
}
const button = document.querySelectorAll('button');


button.forEach(b=> 
  {
    b.addEventListener('click',(e)=>
      {
       
        if(!b.classList.contains("quantityBtn"))
          return;

        const val = b.innerHTML

        switch (val)
        {

            case '-':
              if(Quantity ==1)
                return;
              Quantity--
              break;
            case '+':
              Quantity++

              break;
        }
        quantity.innerHTML = Quantity
        let total = intPrice * Quantity
        let fTotal = Math.round(total * 100)/100
        addToCart.innerHTML = '<b>Add-To-Cart' +" (₱" +fTotal +")</b>"
      })
  })


  let previousSelection

//Update Option Selector
button.forEach(b => {
  b.addEventListener('click',(e) => {
  

  let w 

  if(!b.classList.contains("productOptions"))
    return;
  if (b.classList.contains("Pselected")){
    w = b.clientWidth
    return;}
  
  b.className += " Pselected"
  a.className = "optionSelected";

  if (previousSelection != null)
  previousSelection.classList.remove("Pselected");

  previousSelection = b

  console.log(previousSelection)
  let name = b.name;
  console.log(name);
  let priceIdx= data.optionsPrice[parseInt(name)];
  changePrice(parseInt(priceIdx));
}
)
});

function ass()
{
  return 'a';
}
console.log(ass())

function addProductToCart() {
  // Ensure quantity and data exist
  if (!data || Quantity <= 0) {
    alert("Invalid quantity or product data.");
    return;
  }

  // Create a cart item object
  const cartItem = {
    id: id,
    title: data.title,
    price: intPrice,            // numeric price
    optionSelected: previousSelection ? previousSelection.innerHTML : null,
    quantity: Quantity,
    image: data.image
  };

  // Retrieve existing cart or create a new one
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if same product (and option) already exists in cart
  const existingIndex = cart.findIndex(item =>
    item.id === id && item.optionSelected === cartItem.optionSelected
  );

  if (existingIndex > -1) {
    // Update quantity
    cart[existingIndex].quantity += Quantity;
  } else {
    // Add new item
    cart.push(cartItem);
  }

  // Save updated cart
  localStorage.setItem("cart", JSON.stringify(cart));

  // Optional confirmation
  alert(`${data.title} added to cart!`);
  console.log("Cart:", cart);
}

addToCart.addEventListener('click', addProductToCart);