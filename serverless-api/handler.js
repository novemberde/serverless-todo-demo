// lambda.js
'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'text/html'
]
// 반드시 API Gateway setting에서 Binary Media Types 에 */* 넣어줄 것!

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)
 
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)