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

function displayOrders(data) {
  const cartButton = document.querySelector('#cart');
  const orderElement = document.querySelector('#content');

  cartButton.addEventListener('click', ()=>{
    data.forEach((watch) => {
      orderElement.insertAdjacentHTML('beforeend', `
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
                  <p class="subtitle is-6">${watch.price} Ft</p>
                </div>
              </div>
          
              <div class="content">
                <ul>
                    <li>
                    Type: ${watch.specifications.type}
                    </li>
                    <li>
                    Strap material: ${watch.specifications['strap material']} 
                    </li>
                    <li>
                    Waterproof: ${watch.specifications.iswaterproof ? 'yes' : 'no'} 
                    </li>
                    <li>
                    Sex: ${watch.specifications.sex}
                    </li>
                </ul>
                <br>
                <input class="input is-rounded" id="amount" max="9" min="1" placeholder="amount" type="number">
                <button class="button is-rounded">Add to cart</button>
              </div>
            </div>
          </div>`);
    });
  });
}
