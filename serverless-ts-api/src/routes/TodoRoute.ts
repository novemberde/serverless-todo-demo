import { Router, Request, Response } from "express";
import * as dynamoose from 'dynamoose';

dynamoose.AWS.config.region = process.env.AWS_REGION;
const TodoMecab = dynamoose.model('TodoMecab', {
    userId: {
        type: Number,
        hashKey: true
    }, 
    createdAt: {
        type: Number,
        rangeKey: true
    },
    updatedAt: Number,
    content: String,
    mecabResult: Object,
}, {
    create: false, // Create a table if not exist,
});
const mecab = require('mecab-ya');

export default class TodoRoute {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', this.findAll);
    this.router.get('/:createdAt', this.findOne);
    this.router.post('/', this.middleware, this.create);
    this.router.put('/:createdAt', this.middleware, this.update);
    this.router.delete('/:createdAt', this.delete);
  }

  private getMecabResult = async (text) => {
    return Promise.all([
      new Promise((resolve, reject) => {
        mecab.pos(text, function (err, result) {
          if(err) return reject(err);
          resolve(result);
        })
      }),
      new Promise((resolve, reject) => {
        mecab.morphs(text, function (err, result) {
          if(err) return reject(err);
          resolve(result);
        })
      }),
      new Promise((resolve, reject) => {
        mecab.nouns(text, function (err, result) {
          if(err) return reject(err);
          resolve(result);
        })
      })
    ]).then(result => {
      return {
        pos: result[0],
        morphs: result[1],
        nouns: result[2],
      };
    });
  }

  private middleware = (req, res, next) => {
    const {
      content,
    } = req.body;

    if(typeof content !== 'string' || content.trim().length < 2) return res.status(400).json('Invalid content');

    next();
  }

  private findAll = async (req: Request, res: Response, next) => {
    try {
      const {
        userId
      } = res.locals;
      let {
        lastKey
      } = req.query;

      const result = await TodoMecab.query('userId').eq(userId).startAt(lastKey).limit(1000).descending().exec();

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private findOne = async (req: Request, res: Response, next) => {
    try {
      const {
        userId
      } = res.locals;
      const {
        createdAt
      } = req.params;

      const result = await TodoMecab.get({userId, createdAt});

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  private create = async (req: Request, res: Response, next) => {
    try {
      const {
        content,
      } = req.body;
      const {
        userId
      } = res.locals;

      const mecabResult = await this.getMecabResult(content);
      await new TodoMecab({
        createdAt: Math.floor(<any>new Date() / 1000),
        content,
        mecabResult,
        userId: String(userId),
      }).save();

      return res.status(201).send();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  private update = async (req: Request, res: Response, next) => {
    try {
      const {
        content,
      } = req.body;
      const {
        createdAt
      } = req.params;
      const {
        userId
      } = res.locals;

      const mecabResult = await this.getMecabResult(content);
      await new TodoMecab({
        createdAt: Number(createdAt),
        updatedAt: Math.floor(<any>new Date() / 1000),
        content,
        mecabResult,
        userId,
      }).save();

      return res.status(201).send();
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  private delete = async (req: Request, res: Response, next) => {
    try {
      const {
        createdAt
      } = req.params;
      const {
        userId
      } = res.locals;
      
      if(!createdAt) return res.status(400).send("Bad request. createdAt is undefined");

      await TodoMecab.delete({
        userId,
        createdAt,
    });

      return res.status(204).json({});
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}