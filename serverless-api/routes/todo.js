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
    let lastKey = req.query.lastKey;
    
    return Todo.query('user_id').eq(1).startAt(lastKey).limit(10).exec((err, result) => {
        if(err) return next(err, req, res, next);
        
        res.status(200).json(result);
    })
});

router.get("/:createdAt", (req, res, next) => {
    const createdAt = String(req.params.createdAt);
    const user_id = String(req.query.user_id); // 편의상 query로 사용. 실제 production이라고 가정한다면 res.locals에 user정보가 담긴다.
    
    console.log(createdAt);
    console.log(user_id);

    return Todo.get({user_id: user_id, createdAt: createdAt}, function (err, result) {
        if(err) return next(err, req, res, next);
      
        res.status(200).json(result);
    });
});

router.post("/", (req, res, next) => {
    const body = req.body;
    
    body.createdAt = new Date().toISOString();
    body.updatedAt = new Date().toISOString();
    
    return new Todo(body).save((err, result) => {
        if(err) return next(err, req, res, next);
      
        res.status(201).json(result);
    });
});

router.put("/:createdAt", (req, res, next) => {
    const createdAt = req.params.createdAt;
    const body = req.body;
    
    if(!body.user_id) return res.status(400).send("Bad request. user_id is undefined");
    
    if(body.createdAt) delete body.createdAt;
    
    body.updatedAt = new Date().toISOString(); 
    
    return new Todo(_.assign(body, {
        createdAt
    })).save((err, result) => {
        if(err) return next(err, req, res, next);
      
        res.status(200).json(result);
    });
});

router.delete("/:createdAt", (req, res, next) => {
    const createdAt = req.params.createdAt;
    const body = req.body;
    
    if(!body.user_id) return res.status(400).send("Bad request. user_id is undefined");
    
    if(body.createdAt) delete body.createdAt;
    
    return Todo.delete(_.assign(body, {
        createdAt
    }), (err) => {
        if(err) return next(err, req, res, next);
      
        res.status(204).json();
    });
});

module.exports = router;