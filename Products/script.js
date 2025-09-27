function menuItems(menuitem){
  let productsHTML="";
  menuitem.forEach((product)=>{
    productsHTML+=`
      <article class="card" data-id="${product.id}" data-category="${product.category}">
        <div class="thumb"><img src="${product.img}" alt="${product.name}"></div>
        <div class="meta"><h3>${product.name}</h3><small>${product.restaurant}</small></div>
        <div class="desc">${product.desc}</div>
        <div class="rating">⭐⭐⭐⭐☆ (${product.rating})</div>
        <div class="price-row"><div class="price">₹${product.price}</div><button class="add add-js" data-id="${product.id}">Add</button></div>
      </article>
    `;
  });
  document.querySelector('[data-js-hook="menu-grid"]').innerHTML=productsHTML;
}
menuItems(products);

let cartItems=[];
function all(){
  document.querySelectorAll('.add-js').forEach((button)=>{
    button.addEventListener("click",()=>{
      const productId=button.dataset.id;
      const product=products.find(p=>p.id===productId);
      let matchingItem=cartItems.find(item=>item.id===productId);
      if(matchingItem){
        matchingItem.quantity++;
      }else{
        cartItems.push({...product,quantity:1});
        console.log(cartItems);
      }
      update();
      displayCart();
    });
  });
}
all();

function displayCart(){
  let cartHTML="";
  cartItems.forEach(item=>{
    cartHTML+=`<article class="card" data-id="${item.id}" data-category="${item.category}">
      <div class="thumb"><img src="${item.img}" alt="${item.name}"></div>
      <div class="meta"><h3>${item.name}</h3><small>${item.restaurant}</small></div>
      <div class="desc">${item.desc}</div>
      <div class="rating">⭐⭐⭐⭐☆ (${item.rating})</div>
      <div class="price-row"><div class="price">₹${item.price}</div></div>
      <div>Quantity:${item.quantity}</div>
      <button class="delete-js" data-id=${item.id}>Delete</button>
    </article><br>`;
  });
  document.querySelector('[data-js-hook="cart-list"]').innerHTML = cartHTML;
  removeItem();
}

function removeItem(){
  let cartDeletes=document.querySelectorAll('.delete-js');
  cartDeletes.forEach((cartDelete)=>{
    cartDelete.addEventListener("click",()=>{
      const productId=cartDelete.dataset.id;
      cartItems=cartItems.filter((value)=>value.id !== productId);
      update();  
      displayCart();
    });
  })
}

function TotalPrice(){
  let price=0; 
  cartItems.forEach((cartItem)=>{
    price+=cartItem.quantity*cartItem.price;
  });
  return price;
}
function quantity(){
  let quantity=0;
  cartItems.forEach(cartItem=>{
    quantity+=cartItem.quantity;
  });
  return quantity;
}
function update(){
  document.querySelector('[data-js-hook="cart-total-value"]').innerHTML=`$${TotalPrice().toFixed(2)}`;
  document.querySelector('[data-js-hook="cart-count"]').textContent=quantity();
}

// ========== NEW STATE FOR FILTER + SORT ==========
let currentFilter = "all";
let currentSort = "default";

function getFilteredAndSortedProducts() {
  let filtered = [...products];
  if (currentFilter !== "all") {
    filtered = products.filter(p => p.category === currentFilter);
  }
  if (currentSort === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }
  return filtered;
}
function renderProducts() {
  let result = getFilteredAndSortedProducts();
  menuItems(result);
  all();
}

// ========== FILTER BUTTONS ==========
document.querySelector('[data-filter="all"]').addEventListener('click',()=>{
  currentFilter="all";
  renderProducts();
});
document.querySelector('[data-filter="veg"]').addEventListener('click',()=>{
  currentFilter="veg";
  renderProducts();
});
document.querySelector('[data-filter="nonveg"]').addEventListener('click',()=>{
  currentFilter="nonveg";
  renderProducts();
});
document.querySelector('[data-filter="sides"]').addEventListener('click',()=>{
  currentFilter="sides";
  renderProducts();
});
document.querySelector('[data-filter="drinks"]').addEventListener('click',()=>{
  currentFilter="drinks";
  renderProducts();
});

// ========== SORT ==========
const sorting=document.querySelector('[data-js-hook="sort-select"]');
sorting.addEventListener('change',()=>{
  currentSort=sorting.value;
  renderProducts();
});

// ========== CART TOGGLE ==========
document.querySelector('[data-js-hook="open-cart"]').addEventListener('click',()=>{
  const cartElement = document.querySelector('.cart');
  cartElement.classList.toggle('is-visible');
  displayCart();
  update();
});

// Initial load
renderProducts();
