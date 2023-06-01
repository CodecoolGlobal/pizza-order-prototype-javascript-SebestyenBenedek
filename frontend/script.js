const checkedColorIDs = [];
const checkedColorBoxes = document.querySelectorAll('.checkbox');
console.log(checkedColorBoxes);


function checkBox(datas) {
  checkedColorBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function (event) {
      if (!checkbox.classList.contains('checked')) {
        checkbox.classList.add('checked');
        const colorId = datas.find((data) => data.name === event.target.value);
        checkedColorIDs.push(colorId.id);
      } else if (checkbox.classList.contains('checked')) {
        checkbox.classList.remove('checked');
        const colorIndex = checkedColorIDs.findIndex((color) => color === event.target.value);
        checkedColorIDs.splice(colorIndex, 1);
      }
      console.log(checkedColorIDs);
    });
  });
}

function watchFilteringByColor(data){
  const filtered = [];
  for (const colorID of checkedColorIDs) {
    for (const watch of data){
      if (watch.colors.includes(colorID) && !filtered.includes(watch)) filtered.push(watch);
    }
  }
  console.log(filtered);
  return filtered;
}

async function main (){
  const watchJSON = await getWatchData();
  displayWatches(watchJSON);
  const colorJSON = await getColorData();
  checkBox(colorJSON);
  filterEventListener(watchJSON);
  addEventListenerToHomePageButton();
  displayCart();
}

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

function filterEventListener(data) {
  const filterButton = document.querySelector('#filter');
  filterButton.addEventListener('click', () => {
    const filteredArr = watchFilteringByColor(data);
    displayFilteredWatches(filteredArr);
  });
}

function displayFilteredWatches(data){
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
                      <input class="input is-rounded" id="amount" max="9" min="0" placeholder="amount" type="number">
                    </div>
                  </div>
                  <div class="level-right" style="width: 50%;">
                    <div class="level-item" style="width: 90%;">
                      <button id="${watch.id} "class="button is-rounded is-primary">Add to cart</button>
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

function displayWatches(data){
  const watchButton = document.querySelector('#watches');
  const contentElement = document.querySelector('#content');

  watchButton.addEventListener('click', ()=>{
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
                      <input class="input is-rounded" id="amount" max="9" min="0" placeholder="amount" type="number">
                    </div>
                  </div>
                  <div class="level-right" style="width: 50%;">
                    <div class="level-item" style="width: 90%;">
                      <button id="${watch.id} "class="button is-rounded is-primary">Add to cart</button>
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
  });

}

window.addEventListener('load', main);

const CART = [];

function addEventListenerToAllAddToCartButton(everyWatch) {
  const cartButton = document.querySelectorAll('button');
  /* console.log(cartButton); */

  cartButton.forEach((button) => {
    button.addEventListener('click', function handleclick(event) {

      //console.log(event.currentTarget.id);
      everyWatch.forEach((watch) => {
        //console.log(watch);
        if (Number(event.currentTarget.id) === watch.id) CART.push(watch);
      });
      //console.log(event.currentTarget.id);
      console.log(CART);
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
    contentElement.innerHTML = '';
    contentElement.insertAdjacentHTML('beforeend', `
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

                    <div class="notification is-danger is-light">
                      <strong>
                        You don't have any item in your cart yet!
                      </strong>
                    </div>

                    <div class="card"> 
                      <div class="card-content">
                        <div class="media">
                          <div class="media-left">
                            <figure class="image is-48x48">
                              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                            </figure>
                          </div>
                          <div class="media-content">
                            <p class="title is-4">Item Name</p>
                            <p class="subtitle is-6">Item Price (Ft)</p>
                          </div>
                          <input type="number" value="1" style="width: 35px;" min="1" max="9">
                        </div>
                      </div>
                    </div>

                    <div class="card"> 
                      <div class="card-content">
                        <div class="media">
                          <div class="media-left">
                            <figure class="image is-48x48">
                              <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                            </figure>
                          </div>
                          <div class="media-content">
                            <p class="title is-4">Item Name</p>
                            <p class="subtitle is-6">Item Price (Ft)</p>
                          </div>
                          <input type="number" value="1" style="width: 35px;" min="1" max="9">
                        </div>
                      </div>
                    </div>

                    <hr>

                    <div class="level">
                      <div class="level-left">
                        <div class="level-item">
                          <h3>Total amount: </h3>
                        </div>
                      </div>
                      <div class="level-right">
                        <div class="level-item">
                          <h3>x Ft</h3>
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
                            <input class="input" type="text" placeholder="Name">
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
                            <input class="input" type="email" placeholder="Email">
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
                            <input class="input" type="text" placeholder="City">
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
                            <input class="input" type="text" placeholder="Street">
                            <span class="icon is-small is-left">
                              <i class="fas fa-road"></i>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!--
                    <hr>

                    <div class="level">
                      <div class="level-left">
                        <div class="level-item">
                          <h3>Total amount: </h3>
                        </div>
                      </div>
                      <div class="level-right">
                        <div class="level-item">
                          <h3>x Ft</h3>
                        </div>
                      </div>
                    </div>
                    -->

                    <hr>

                    <div class="level">
                      <div class="level-right">
                        <div class="level-item">
                          <button class="button is-success is-rounded">
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
  });
}
