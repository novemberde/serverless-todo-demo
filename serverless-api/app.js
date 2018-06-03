const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("aws-sdk").config.region = "ap-northeast-2"

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 실제로 사용한다고 가정하면 유저정보를 실어주어야함.
app.use((req, res, next) => {
    res.locals.userId = "1";
    next();
});

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