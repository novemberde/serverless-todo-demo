import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import TodoRoute from "./routes/TodoRoute";
import ErrorHandler from "./middlewares/ErrorHandler";

const env = process.env.NODE_ENV || 'development';
const app = express();

// Set logger
if (env === 'production') app.use(logger('common'));
else if (env === 'development') app.use(logger('dev'));

app.use(cors());
app.use((req, res: express.Response, next) => {
    res.locals.userId = '0';
    return next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get(['/', '/test'], (req, res, next) => {
    return res.send('Welcome!');
});
app.use('/todo', new TodoRoute().router);
app.use(new ErrorHandler ().router);

export default app;