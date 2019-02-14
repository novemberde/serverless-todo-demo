import { Router } from "express";

export default class ErrorHandler {
    public router: Router;

    constructor () {
        this.router = Router();
        this.router.use(this.notFoundError);
        this.router.use(this.internalServerError);
    }

    private notFoundError (req, res, next) {
        res.status(404).json({message: 'Not found'});
    }

    private internalServerError (err, req, res, next) {
        res.status(500).send(err);
    }
}