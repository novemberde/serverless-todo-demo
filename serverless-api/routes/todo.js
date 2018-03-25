const router = require("express").Router();
const dynamoose = require('dynamoose');
const _ = require('lodash');
const Todo = dynamoose.model('Todo', {
    user_id: {
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
});

router.get("/", (req, res, next) => {
    const user_id = res.locals.user_id;
    let lastKey = req.query.lastKey;
    
    return Todo.query('user_id').eq(user_id).startAt(lastKey).limit(10).exec((err, result) => {
        if(err) return next(err, req, res, next);
        
        res.status(200).json(result);
    })
});

router.get("/:createdAt", (req, res, next) => {
    const user_id = res.locals.user_id;
    const createdAt = String(req.params.createdAt);

    return Todo.get({user_id, createdAt}, function (err, result) {
        if(err) return next(err, req, res, next);
      
        res.status(200).json(result);
    });
});

router.post("/", (req, res, next) => {
    const user_id = res.locals.user_id;
    const body = req.body;
    
    body.createdAt = new Date().toISOString();
    body.updatedAt = new Date().toISOString();
    body.user_id = user_id;
    
    return new Todo(body).save((err, result) => {
        if(err) return next(err, req, res, next);
      
        res.status(201).json(result);
    });
});

router.put("/:createdAt", (req, res, next) => {
    const user_id = res.locals.user_id;
    const createdAt = req.params.createdAt;
    const body = req.body;
    
    if(body.createdAt) delete body.createdAt;
    
    body.updatedAt = new Date().toISOString(); 
    
    return new Todo(_.assign(body, {
        user_id,
        createdAt
    })).save((err, result) => {
        if(err) return next(err, req, res, next);
      
        res.status(200).json(result);
    });
});

router.delete("/:createdAt", (req, res, next) => {
    const createdAt = req.params.createdAt;
    const user_id = res.locals.user_id;
    
    if(!createdAt) return res.status(400).send("Bad request. createdAt is undefined");
    
    return Todo.delete({
        user_id,
        createdAt
    }, (err) => {
        if(err) return next(err, req, res, next);
      
        res.status(204).json();
    });
});

module.exports = router;