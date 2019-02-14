import 'source-map-support/register'
import * as awsServerlessExpress from 'aws-serverless-express';
import app from './app';

const binaryMimeTypes = [
  'application/javascript',
  'application/x-www-form-urlencoded',
  'application/json',
  'text/plain',
  'text/text',
];
const server = awsServerlessExpress.createServer(app, <any>null, binaryMimeTypes);

export const api = (event: any, context: any) => {
  return awsServerlessExpress.proxy(server, event, context);
}