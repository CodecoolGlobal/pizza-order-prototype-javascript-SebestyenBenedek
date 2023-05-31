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
  for (const colorID of checkedColorIDs) {
    data.filter((watch) => watch.id === colorID);
  }
}

async function main (){
  const watchJSON = await getWatchData();
  displayWatches(watchJSON);
  const colorJSON = await getColorData();
  checkBox(colorJSON);
  console.log(watchFilteringByColor(watchJSON));
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
                <button class="button is-rounded">Add to cart</button>
              </div>
            </div>
          </div>
        </div>`);
    });
  });

}

window.addEventListener('load', main);
