const router = require("express").Router();
const dynamoose = require('dynamoose');
const _ = require('lodash');
const Todo = dynamoose.model('Todo', {
    userId: {
        type: String,
        hashKey: true
    }, 
    createdAt: {
        type: String,
        rangeKey: true
    },
    updatedAt: String,
    title: String,
    content: String
}, {
    create: false, // Create a table if not exist,
});

router.get("/", (req, res, next) => {
    const userId = res.locals.userId;
    let lastKey = req.query.lastKey;
    
    return Todo.query('userId').eq(userId).startAt(lastKey).limit(1000).descending().exec((err, result) => {
        if(err) return next(err, req, res, next);
        
        res.status(200).json(result);
    })
});

router.get("/:createdAt", (req, res, next) => {
    const userId = res.locals.userId;
    const createdAt = String(req.params.createdAt);

    return Todo.get({userId, createdAt}, function (err, result) {
        if(err) return next(err, req, res, next);
      
        res.status(200).json(result);
    });
});

router.post("/", (req, res, next) => {
    const userId = res.locals.userId;
    const body = req.body;
    
    body.createdAt = new Date().toISOString();
    body.updatedAt = new Date().toISOString();
    body.userId = userId;
    
    return new Todo(body).save((err, result) => {
        if(err) return next(err, req, res, next);
      
        res.status(201).json(result);
    });
});

router.put("/:createdAt", (req, res, next) => {
    const userId = res.locals.userId;
    const createdAt = req.params.createdAt;
    const body = req.body;
    
    if(body.createdAt) delete body.createdAt;
    
    body.updatedAt = new Date().toISOString(); 
    
    return new Todo(_.assign(body, {
        userId,
        createdAt
    })).save((err, result) => {
        if(err) return next(err, req, res, next);
      
        res.status(200).json(result);
    });
});

router.delete("/:createdAt", (req, res, next) => {
    const createdAt = req.params.createdAt;
    const userId = res.locals.userId;
    
    if(!createdAt) return res.status(400).send("Bad request. createdAt is undefined");
    
    return Todo.delete({
        userId,
        createdAt
    }, (err) => {
        if(err) return next(err, req, res, next);
      
        res.status(204).json();
    });
});

module.exports = router;