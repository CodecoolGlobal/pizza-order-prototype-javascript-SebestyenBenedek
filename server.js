const express = require('express');
const path = require('path');
const fs = require('fs');
const fileReaderAsync = require('./fileReader');
const filePath = path.join(`${__dirname}/pkgs.json`);
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 9001;





app.listen(port, () => console.log(`http://127.0.0.1:${port}`));