/* const path = require('path');
const fileReaderAsync = require('../backend/fileReader');
const watchFilePath = path.join(`${__dirname}/watches.json`);
const colorFilePath = path.join(`${__dirname}/colors.json`);

const watchData = JSON.parse(await fileReaderAsync(watchFilePath));
const watches = JSON.parse(JSON.stringify(watchData.watches)); //deep copy to be modified instead of original json
const colorData = JSON.parse(await fileReaderAsync(colorFilePath));
const colors = colorData.colors;

let checkedColors = document.querySelector('.checkbox:checked').value;
console.log(checkedColors.value);
*/

/* let FILTERED_WATCHES = [];

function watchFilteringByColor(watches){
  watches.filter((watch) => watch)
} */


const CART = [];




async function main (){
  const watchJSON = await getWatchData();
  displayWatches(watchJSON);
}

async function getWatchData(){
  const response = await fetch('http://127.0.0.1:9001/api/watches');
  const jsonData = await response.json();
  console.log(jsonData);
  return jsonData;
}
function displayWatches(data){
  const watchButton = document.querySelector('#watches');
  const contentElement = document.querySelector('#content');

  watchButton.addEventListener('click', ()=>{
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
                      <button id="${watch.id}"class="button is-rounded">Add to cart</button>
                      </div>
                      </div>
                      </div>
                      </div>`);
    });
    addEventListenerToAllAddToCartButton(data);
  });

}

window.addEventListener('load', main);



function addEventListenerToAllAddToCartButton(everyWatch) {
  const cartButton = document.querySelectorAll('button');
  console.log(cartButton);

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
