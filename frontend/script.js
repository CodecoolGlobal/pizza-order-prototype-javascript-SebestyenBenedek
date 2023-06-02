const CART = [];
const CART_AMOUNT = [];
const CHECKED_COLOR_IDS = [];
const CHECKED_COLOR_BOXES = document.querySelectorAll('.checkbox');
console.log(CHECKED_COLOR_BOXES);
const CURRENT_DATE = new Date();

async function main (){
  const watchJSON = await getWatchData();
  displayWatchesAddEventListener(watchJSON);
  const colorJSON = await getColorData();
  checkBox(colorJSON);
  filterEventListener(watchJSON);
  addEventListenerToHomePageButton();
  displayCart();
}

function displayWatchesAddEventListener(data){
  const watchButton = document.querySelector('#watches');

  watchButton.addEventListener('click', ()=>{
    displayWatches(data);
  });
}

function checkBox(datas) {
  CHECKED_COLOR_BOXES.forEach((checkbox) => {
    checkbox.addEventListener('change', function (event) {
      if (!checkbox.classList.contains('checked')) {
        checkbox.classList.add('checked');
        const colorId = datas.find((data) => data.name === event.target.value);
        CHECKED_COLOR_IDS.push(colorId.id);
      } else if (checkbox.classList.contains('checked')) {
        checkbox.classList.remove('checked');
        const colorIndex = CHECKED_COLOR_IDS.findIndex((color) => color === event.target.value);
        CHECKED_COLOR_IDS.splice(colorIndex, 1);
      }
      console.log(CHECKED_COLOR_IDS);
    });
  });
}

function filterEventListener(data) {
  const filterButton = document.querySelector('#filter');
  filterButton.addEventListener('click', () => {
    const filteredArr = watchFilteringByColor(data);
    displayWatches(filteredArr);
  });
}

function addEventListenerToHomePageButton() {
  const homeButton = document.querySelector('.level-left');
  const contentElement = document.querySelector('#content');

  homeButton.addEventListener('click', function handleHomeButton() {
    contentElement.innerHTML = '';
  });
}

function displayCart() {
  const cartButton = document.querySelector('#cart');
  const contentElement = document.querySelector('#content');

  cartButton.addEventListener('click', ()=>{
    cartDomManipulation(contentElement);
  });
}

/* ASYNCS */

async function getWatchData(){
  const response = await fetch('http://127.0.0.1:9001/api/watches');
  const jsonData = await response.json();
  /* console.log(jsonData); */
  return jsonData;
}

async function getColorData(){
  const response = await fetch('http://127.0.0.1:9001/api/colors');
  const jsonData = await response.json();
  /* console.log(jsonData); */
  return jsonData;
}

async function postRequestForOrder() {
  const orderObject = {
    id: 0,
    date: {
      year: CURRENT_DATE.getFullYear(),
      month: (CURRENT_DATE.getMonth() + 1),
      day: CURRENT_DATE.getDate(),
      hour: CURRENT_DATE.getHours(),
      minute: CURRENT_DATE.getMinutes(),
    },
    customer: {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      address: {
        city: document.getElementById('city').value,
        street: document.getElementById('street').value,
      },
    },
  };

  try {
    const response = await fetch('http://127.0.0.1:9001/api/order', {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(orderObject),

    });
    displayThankYouMessage();
    while (CART.length > 0) CART.pop();
    while (CART_AMOUNT.length > 0) CART_AMOUNT.pop();
    console.log('Completed!', response);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

/* ADDEVENTLISTENER FUNCTIONS */

function addEventListenerToAllAddToCartButton(everyWatch) {
  const cartButton = document.querySelectorAll('button');
  /* console.log(cartButton); */

  cartButton.forEach((button) => {
    button.addEventListener('click', function handleclick(event) {

      const amountInputElement = document.querySelector(`#amount_${event.currentTarget.id}`).value;

      //console.log(event.currentTarget.id);
      everyWatch.forEach((watch) => {
        //console.log(watch);
        if (Number(event.currentTarget.id) === watch.id && amountInputElement > 0) {
          watch.amount = Number(amountInputElement);
          watch.price = Number(watch.price.split(',')[0].split('.').join(''));
          CART.push(watch);
          CART_AMOUNT.push(amountInputElement);
        }
      });
      //console.log(event.currentTarget.id);
      console.log(CART);
      console.log(CART_AMOUNT);
    });
  });
  //console.log(CART);
  //return CART;
}

function addEventListenerToInput() {
  const inputElement = document.querySelectorAll('input');
  inputElement.forEach((input) => {
    input.addEventListener('input', function handleInput(event) {
      if (Number(event.target.value) < 1) event.target.value = null;
    });
  });
}

function addEventListenerToOrder(){
  const orderButton = document.querySelector('#post-btn');

  orderButton.addEventListener('click', postRequestForOrder);
}

function addEventListenerToDeleteCartButton() {
  CART.forEach((product) => {
    const deleteButton = document.getElementById(`delete_${product.id}`);

    deleteButton.addEventListener('click', function handleclick(event) {
      event.target.parentNode.parentNode.parentElement.remove();
      // eslint-disable-next-line max-len
      const index = CART.findIndex((watch) => watch.id === Number(event.currentTarget.id.split('_')[1]));
      CART.splice(index, 1);
      CART_AMOUNT.splice(index, 1);

      const contentElement = document.querySelector('#content');
      cartDomManipulation(contentElement);
      //UpdateTotalCost() needed
    });

  });
}

/* BASIC CALCULATIONS */

function totalCost(){
  let sum = 0;
  CART.map((watch) => {
    sum += watch.amount * watch.price;
  });
  return sum;
}

function watchFilteringByColor(data){
  const filtered = [];
  for (const colorID of CHECKED_COLOR_IDS) {
    for (const watch of data){
      if (watch.colors.includes(colorID) && !filtered.includes(watch)) filtered.push(watch);
    }
  }
  console.log(filtered);
  return filtered;
}


/* DOM MANIPULATIONS */

function displayWatches(data){
  const contentElement = document.querySelector('#content');
  contentElement.innerHTML = '';

  data.forEach((watch) => {
    contentElement.insertAdjacentHTML('beforeend', `
      <div id='watch-content'>
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="${watch.image}" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">${watch.name}</p>
                <p class="subtitle is-6 has-text-primary-dark">${watch.price} Ft</p>
              </div>
            </div>
        
            <div class="content">
              <ul>
                  <li>
                    <span>Type:</span>
                    <span class="has-text-primary-dark">${watch.specifications.type}</span>
                  </li>
                  <li>
                    <span>Strap material:</span>
                    <span class="has-text-primary-dark">${watch.specifications['strap material']}</span>
                  </li>
                  <li>
                    <span>Waterproof:</span>
                    <span class="has-text-primary-dark">${watch.specifications.iswaterproof ? 'yes' : 'no'}</span>
                  </li>
                  <li>
                    <span>Sex:</span>
                    <span class="has-text-primary-dark">${watch.specifications.sex}</span>
                  </li>
              </ul>
              <br>
              <div class="level">
                <div class="level-left" style="width: 50%;">
                  <div class="level-item" style="width: 90%;">
                    <input class="input is-rounded" id="amount_${watch.id}" max="9" min="0" placeholder="amount" type="number">
                  </div>
                </div>
                <div class="level-right" style="width: 50%;">
                  <div class="level-item" style="width: 90%;">
                    <button id="${watch.id}" class="button is-rounded is-primary">Add to cart</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`);
  });
  addEventListenerToInput();
  addEventListenerToAllAddToCartButton(data);
}

function cartDomManipulation (element) {
  let cartItemsHTML = '';
  if (CART.length >= 1) {
    CART.forEach((item, i) => {
      cartItemsHTML += `
      <div class="card"> 
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48" style="height: 100%;">
                <img src="${item.image}" alt="Image" style="height: 100%">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">${item.name}</p>
              <p class="subtitle is-6">${item.price}</p>
            </div>
            <input class="input is-small is-rounded" type="number" value="${CART_AMOUNT[i]}" style="width: 55px;" min="1" max="9" disabled>
            <button id="delete_${item.id}" class="button is-light is-danger is-small" style="margin: 0 5px;">
                <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
      `;
    });
  } else {
    cartItemsHTML = `
    <div class="notification is-danger is-light">
      <strong>
        You don't have any item in your cart yet!
      </strong>
    </div>
    `;
  }

  element.innerHTML = '';
  element.insertAdjacentHTML('beforeend', `
    <div class="level" style="width: 90%;">
      <!-- My Cart -->
      <div class="level-left">
        
        <div id="cart-content">
          <div class="card">
            <div class="card-content">
              <p class="title is-4">
                <span class="icon">
                  <i class="fas fa-shopping-cart fa-sm" style="color: #000000;"></i>
                </span>
                <span>My Cart</span>
              </p>
              <hr>
          
              <div class="content">
            
                <div id="items-in-cart">

                  ${cartItemsHTML}

                  <hr>

                  <div class="level">
                    <div class="level-left">
                      <div class="level-item">
                        <h3>Total amount: </h3>
                      </div>
                    </div>
                    <div class="level-right">
                      <div class="level-item">
                        <h3>${totalCost()} Ft</h3>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Űrlap -->
      <div class="level-right">
        
          <div id="cart-content">
            <div class="card">
              <div class="card-content">
                <p class="title is-4">
                  <span class="icon">
                    <i class="fas fa-id-card" style="color: #000000;"></i>
                  </span>
                  <span>My Information</span>
                </p>
                <hr>
            
                <div class="content">
              
                  <div id="my-information-form">

                    <p class="menu-label">
                      Personal
                    </p>
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Name</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <p class="control is-expanded has-icons-left has-icons-right">
                            <input id="name" class="input" type="text" placeholder="Name" required>
                            <span class="icon is-small is-left">
                              <i class="fas fa-user"></i>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">E-Mail</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <p class="control is-expanded has-icons-left has-icons-right">
                            <input id="email" class="input" type="email" placeholder="Email" required>
                            <span class="icon is-small is-left">
                              <i class="fas fa-envelope"></i>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <hr>

                    <p class="menu-label">
                      Address
                    </p>
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">City</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <p class="control is-expanded has-icons-left has-icons-right">
                            <input id="city" class="input" type="text" placeholder="City" required>
                            <span class="icon is-small is-left">
                              <i class="fas fa-city"></i>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="field is-horizontal">
                      <div class="field-label is-normal">
                        <label class="label">Street</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <p class="control is-expanded has-icons-left has-icons-right">
                            <input id="street" class="input" type="text" placeholder="Street" required>
                            <span class="icon is-small is-left">
                              <i class="fas fa-road"></i>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>


                    <hr>

                    <div class="level">
                      <div class="level-right">
                        <div class="level-item">
                          <button id="post-btn" class="button is-success is-rounded">
                            <span class="icon">
                              <i class="fas fa-money-check-alt"></i>
                            </span>
                            <span>Order now!</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        
      </div>

    </div>
  `);
  addEventListenerToDeleteCartButton();
  addEventListenerToOrder();
}

function displayThankYouMessage() {
  const contentElement = document.querySelector('#content');
  contentElement.innerHTML = '';

  contentElement.insertAdjacentHTML('beforeend', `
  <div class="card" style="width: 80%;"> 
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">
            <h1 style="font-size: 72px; text-align: center;"><strong>THANK YOU!</strong></h1>
            <p style="text-align: center; margin: 5%;">
              <i class="far fa-check-circle" style="color: green; font-size: 72px;"></i>
            </p>
            <h2 style="font-size: 22px; text-align: center;"><i>for Your order</i></h2>
          </p>
        </div>
      </div>
    </div>
  </div>
  `);
}

window.addEventListener('load', main);
