const express = require('express');
const path = require('path');
const fs = require('fs');
const fileReaderAsync = require('./fileReader');
const filePath = path.join(`${__dirname}/watches.json`);
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 9001;

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.get('/api/pizza', async (req, res) => {
  const fileData = JSON.parse(await fileReaderAsync(filePath));
  const watches = fileData.watches;

  console.log(watches.toString());
  res.setHeader('Content-Type', 'application/json');

  res.send(JSON.stringify(watches));
});




app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
