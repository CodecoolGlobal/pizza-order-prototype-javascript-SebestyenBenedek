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

