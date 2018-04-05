// lambda.js
'use strict'
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/x-font-ttf',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'font/woff',
  'font/woff2',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
]
// 반드시 API Gateway setting에서 Binary Media Types 에 */* 넣어줄 것!

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)
 
module.exports.api = (event, context) => awsServerlessExpress.proxy(server, event, context)