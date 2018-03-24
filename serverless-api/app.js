const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
    res.send("hello world!");
});

app.use("/todo", require("./routes/todo"));

app.use((req, res, next) => {
    res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

module.exports = app;