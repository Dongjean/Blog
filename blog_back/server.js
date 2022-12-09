const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded())

const Controller = require('./Controller/Controller.js')

app.use(Controller);

app.listen(3001);