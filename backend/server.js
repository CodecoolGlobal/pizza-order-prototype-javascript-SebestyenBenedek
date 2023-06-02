const express = require('express');
const path = require('path');
const fs = require('fs');
const fileReaderAsync = require('./fileReader');
const watchFilePath = path.join(`${__dirname}/watches.json`);
const colorFilePath = path.join(`${__dirname}/colors.json`);
const orderFilePath = path.join(`${__dirname}/orders.json`);
const cors = require('cors');
const app = express();

// app.use((req, res, next) => {
//   req.artursProperty = "szia";
//   if (req.headers['content-type'].startsWith("application/json")) {
//     req.body = JSON.parse()
//   }
//   next();
// })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('frontend'));

const port = 9001;

function fileWriter(orders) {
  const content = {
    orders: orders,
  };
  fs.writeFile(`${__dirname}/orders.json`, JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

app.get('/api/watches', async (req, res) => {
  console.log(req.artursProperty);

  const fileData = JSON.parse(await fileReaderAsync(watchFilePath));
  const watches = fileData.watches;

  console.log(watches.toString());
  res.setHeader('Content-Type', 'application/json');

  res.send(JSON.stringify(watches));
});

app.get('/api/colors', async (req, res) => {
  const fileData = JSON.parse(await fileReaderAsync(colorFilePath));
  const colors = fileData.colors;

  console.log(colors.toString());
  res.setHeader('Content-Type', 'application/json');

  res.send(JSON.stringify(colors));
});

app.get('/api/order', async (req, res) => {
  const fileData = JSON.parse(await fileReaderAsync(orderFilePath));
  const orders = fileData.orders;

  console.log(orders.toString());
  res.setHeader('Content-Type', 'application/json');

  res.send(JSON.stringify(orders));
});


app.post('/api/order', async (req, res) => {
  // New package object from the request body
  const newOrder = req.body;

  // Read the existing packages data from pkgs.json
  const fileData = JSON.parse(await fileReaderAsync(orderFilePath));
  const orders = fileData.orders;

  // Generate a new unique ID for the package
  const maxId = orders.reduce((max, ord) => (ord.id > max ? ord.id : max), 0);
  const newId = maxId + 1;

  // Assign the new ID to the package
  newOrder.id = newId;

  // Add the new package to the array
  orders.push(newOrder);

  // Write the updated packages data to pkgs.json
  res.setHeader('Content-Type', 'application/json');
  fileWriter(orders);

  res.end('DONE');
});



app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
