const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express();

require("aws-sdk").config.region = "ap-northeast-2"

app.use(awsServerlessExpressMiddleware.eventContext())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 실제로 사용한다고 가정하면 유저정보를 실어주어야함.
app.use((req, res, next) => {
	res.locals.userId = "1";
	next();
});

app.get("/", (req, res, next) => {
	
	res.json({
		message: "Hello world",
		path: req.path,
		event: req.apiGateway?.event,
	});
});
app.use("/todo", require("./routes/todo"));


app.use((req, res, next) => {
	return res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
	console.error(err);
	return res.status(500).send(err);
});

module.exports = app;