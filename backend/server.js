const express = require('express');
const path = require('path');
const fs = require('fs');
const fileReaderAsync = require('./fileReader');
const watchFilePath = path.join(`${__dirname}/watches.json`);
const colorFilePath = path.join(`${__dirname}/colors.json`);
//const orderFilePath = path.join(`${__dirname}/orders.json`);
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('frontend'));

const port = 9001;

app.get('/api/watches', async (req, res) => {
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


// app.get('/order', async (req, res) => {
//   res.send(displayOrders(data))
// });



app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
