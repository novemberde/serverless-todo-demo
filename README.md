# Serverless Group First Hands-on

AWSKRUG Serverless Group의 첫번째 핸즈온입니다.

## Objective

Amazon Web Service 를 활용하여 Serverless architecture로 구성된 API를 배포합니다.
결과는 S3에 static-web-site로 배포된 React Web app을 통해 확인합니다.

## AWS Resources

AWS에서 사용하는 리소스는 다음과 같습니다.

- Cloud9: 코드 작성, 실행 및 디버깅을 위한 클라우드 기반 IDE.
- EC2: 클라우드에서 확장식 컴퓨팅을 제공. 여기서는 Cloud9을 동작하기 위해 사용한다.
- API Gateway : API를 생성, 게시, 유지 관리, 모니터링 및 보호할 수 있게 해주는 서비스.
- Lambda: 서버를 프로비저닝하거나 관리하지 않고도 코드를 실행할 수 있게 해주는 컴퓨팅 서비스. 서버리스 아키텍쳐의 핵심 서비스.
- DynamoDB: 완벽하게 관리되는 NoSQL 데이터베이스 서비스로, 원활한 확장성과 함께 빠르고 예측 가능한 성능을 제공.

## Cloud 9 시작하기

Cloud9 은 하나의 IDE입니다. 그렇지만 이전의 설치형 IDE와는 다릅니다. 설치형 IDE는 로컬 PC에 프로그램을 설치하던가
실행하는 방식이었다면, Cloud9은 브라우저가 실행가능한 모든 OS에서 사용이 가능합니다.

맨 처음 Cloud9은 AWS 내에서가 아닌 별도의 서비스로 제공되었습니다. AWS에 인수된 이후 Cloud9은 AWS의 Managed Service형태로 바뀌었고,
AWS의 서비스와 결합하여 사용이 가능해졌습니다. 코드 편집과 명령줄 지원 등의 평범한 IDE 기능을 지니고 있던 반면에, 현재는 AWS 서비스와
결합되어 직접 Lambda 코드를 배포하던가, 실제로 Cloud9이 실행되고 있는 EC2의 컴퓨팅 성능을 향상시켜서
로컬 PC의 사양에 종속되지 않은 개발을 할 수가 있습니다.

그러면 Cloud9 환경을 시작해봅시다.

[Cloud 9 Console](https://ap-southeast-1.console.aws.amazon.com/cloud9/home?region=ap-southeast-1#)에 접속합니다.

아래와 같은 화면에서 [Create Environment](https://ap-southeast-1.console.aws.amazon.com/cloud9/home/create) 버튼을 누릅니다.

![c9-create](/images/c9-create.png)

Name과 Description을 다음과 같이 입력합니다.

- Name: ServerlessHandsOn
- Description: Serverless hands-on in AWSKRUG Serverless Group

![c9-create-name](/images/c9-create-name.png)

Configure Setting은 다음과 같이 합니다.

- Environment Type: EC2
- Instance Type: T2.micro
- Cost Save Setting: After 30 minutes
- Network Settings: Default

![c9-conf](/images/c9-conf.png)

모든 설정을 마쳤다면 Cloud9 Environment를 생성하고 Open IDE를 통해 개발 환경에 접속합니다.

접속하면 다음과 같은 화면을 볼 수 있습니다.

1. 현재 Environment name
2. EC2에서 명령어를 입력할 수 있는 Terminal
3. Lambda Functions
    - Local Functions: 배포되지 않은 편집중인 Functions
    - Remote Functions: 현재 설정해놓은 Region에 배포된 Lambda Functions
4. Preferences

![c9-env](/images/c9-env.png)

현재 ap-southeast-1 region에 Cloud9 Environment를 배포했으므로 Default Region이 ap-southeast-1으로 되어 있습니다.
Preferences(설정 화면)에서 ap-northeast-2(Seoul Region)으로 바꾸어줍니다.

- Preferences > AWS Settings > Region > Asia Pacific(Seoul)

## Node Express api server 만들어보기

파일 트리는 다음과 같습니다.

```txt
environment
├── serverless-api  : API server
│   ├── bin
│   │   └── www : app.js를 로컬에서 실행하기 위한 파일
│   ├── routes
│   │   └── todo.js : /todo 로 라우팅하는 파일
│   ├── spec
│   │   └── todo.spec.js : /todo 를 테스트 하는 spec 파일
│   ├── app.js : express 서버
│   ├── handler.js  : express를 wrapping하기 위한 handler
│   ├── .env : local에서 테스트하기 위한 환경 변수
│   ├── package.json
│   └── template.yaml : Serverless Application Model Template
└── static-web-front : SPA 방식의 Web Front
```

먼저 serverless-api 디렉터리를 생성하고 npm 초기화를 시켜줍니다.

```sh
$ mkdir serverless-api
$ cd serverless-api
$ npm init -y
```

필요한 npm module들을 install합니다.

- Dependencies
  - express : Web Application Framework
  - body-parser : Request Body를 parsing하기 위한 미들웨어
  - aws-sdk : AWS 리소스를 사용하기 위한 SDK
  - aws-serverless-express : Express를 Lambda에서 사용할 수 있도록 Wrapping하는 패키지
  - dynamoose : DynamoDB를 사용하기 쉽도록 Modeling하는 도구
  - dotenv : 환경 변수를 손쉽게 관리할 수 있게 하는 패키지
- Dev-dependencies
  - mocha : 개발 도구
  - supertest : HTTP 테스트를 하기 위한 모듈
  - should: BDD(Behaviour-Driven Development)를 지원하기 위한 모듈
  - serverless: Serverless Framework
  - serverless-apigw-binary: Binary Media Type을 지원하기 위한 플러그인

```sh
$ npm i -S express aws-sdk aws-serverless-express body-parser dynamoose
$ npm i -D dotenv mocha should supertest serverless serverless-apigw-binary
```

각 파일을 편집합니다.

### serverless-api/.env

```txt
AWS_REGION=ap-northeast-2
```

### serverless-api/app.js

```js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 실제로 사용한다고 가정하면 유저정보를 실어주어야함.
app.use((req, res, next) => {
    res.locals.user_id = "1";
    next();
});

app.get("/", (req, res, next) => {
    res.send("hello world!");
});

app.use("/todo", require("./routes/todo"));

app.use((req, res, next) => {
    res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

module.exports = app;
```

### serverless-api/bin/www

```js
const app = require("../app");
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.on("error", (err) => console.error(err));

server.listen(port, () => console.log(`Server is running on ${port}`));
```

### serverless-api/handler.js

```js
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
```

### serverless-api/routes/todo.js

```js
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
```

### serverless-api/spec/todo.spec.js

```js
const request = require('supertest');
const _ = require('lodash');
const app = require('../app');
const data = {
    title: "hello",
    content: "world"
}
let createdData = null;

describe("POST /todo", () => {
    it('Should return 201 status code', (done) => {
        request(app).post('/todo').send(data).expect(201, (err, res) => {
            if(err) return done(err);
            
            createdData = res.body;
            done();
        });
    });
});

describe("PUT /todo/:id", () => {
    it('Should return 200 status code', (done) => {
        request(app).put(`/todo/${createdData.createdAt}`).send(_.assign(data, {
            content: "world. Successfully modified!"
        })).expect(200, done);
    });
});

describe("GET /todo", () => {
    it('Should return 200 status code', (done) => {
        request(app).get('/todo').expect(200).end((err, res) => {
            if(err) return done(err);
            
            console.log(res.body);
            done();
        });
    });
});

describe("GET /todo/:createdAt", () => {
    it('Should return 200 status code', (done) => {
        request(app).get(`/todo/${createdData.createdAt}`).expect(200).end((err, res) => {
            if(err) return done(err);
            
            console.log(res.body);
            done();
        });
    });
});

describe("DELETE /todo/:id", () => {
    it('Should return 204 status code', (done) => {
        request(app).delete(`/todo/${createdData.createdAt}`).send(data).expect(204, done);
    });
});
```

<!-- 마지막으로 template.yaml을 생성합니다. 이것은 Cloud9상에서 Lambda함수를 배포할 수 있도록 해주는 파일입니다. -->
마지막으로 serverless.yml을 생성합니다. 이것은 Serverless Framework를 통해 AWS에 손쉽게 serverless 환경을 배포할 수 있게 도와줍니다.
내부적으로는 CloudFormation Template을 생성하여 배포합니다. 배포된 Artifact는 S3에서 확인해볼 수 있습니다.

### serverless-api/serverless.yml

```yml
service: ServerlessHandsOn

provider:
  name: aws
  runtime: nodejs8.10
  memorySize: 128
  stage: dev
  region: ap-northeast-2
  environment:
    NODE_ENV: production
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:DescribeTable
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:*"

plugins:
 - serverless-apigw-binary
custom:
  apigwBinary:
    types:
      - '*/*'

functions:
  serverlessHandsOn:
    handler: handler.api
    events:
      - http: ANY {proxy+}
```

---

모든 파일을 편집하였다면 서버를 가동해봅니다.

```sh
ec2-user:~/environment/serverless-api $ npm start
> serverless-api@1.0.0 start /home/ec2-user/environment/serverless-api
> node bin/www

ap-northeast-2
Server is running on 8080
```

서버가 제대로 응답하는지 확인하기 위해 새로운 터미널을 열어 get 요청을 해봅니다.

```sh
ec2-user:~/environment/serverless-api $ curl localhost:8080
hello world!
ec2-user:~/environment/serverless-api $ curl localhost:8080/todo
응답없음
```

서버를 가동하였지만 API가 사용가능한 상태는 아닙니다.
DynamoDB의 테이블을 생성하지 않았기 때문입니다.

## DynamoDB 테이블 생성하기

DynamoDB를 설계할 시 주의해야할 점은 [FAQ](https://aws.amazon.com/ko/dynamodb/faqs/)를 참고하시길 바랍니다.

이제 DynamoDB에 Todo table을 생성할 것입니다. 파티션 키와 정렬 키는 다음과 같이 설정합니다.

- 파티션키(Partition Key): user_id
- 정렬키(Sort Key): createdAt

소스코드 상에서는 user_id를 "1"로 고정시켜두었습니다. 일반적으로 유저의 키값을 partition key로 사용하기 때문입니다.
또한 레코드의 생성 시간을 정렬키로 사용합니다.

그럼 [DynamoDB Console](https://ap-northeast-2.console.aws.amazon.com/dynamodb/home?region=ap-northeast-2#)로 이동합니다.
테이블 만들기를 클릭하여 아래와 같이 테이블을 생성합니다.

![dynamodb-create](/images/dynamodb-create.png)

그런 다음에 다시 Cloud9으로 돌아가서 테스트 코드를 돌려봅니다.

```sh
ec2-user:~/environment/serverless-api $ npm test

> serverless-api@1.0.0 test /home/ec2-user/environment/serverless-api
> mocha spec/*.spec.js --timeout 10000

ap-northeast-2


  POST /todo
    ✓ Should return 201 status code (912ms)

  PUT /todo/:id
    ✓ Should return 200 status code (225ms)

  GET /todo
[ { content: 'world. Successfully modified!',
    createdAt: '2018-04-01T13:56:34.808Z',
    user_id: '1',
    updatedAt: '2018-04-01T13:56:35.687Z',
    title: 'hello' } ]
    ✓ Should return 200 status code (224ms)

  GET /todo/:createdAt?user_id=
2018-04-01T13:56:34.808Z
1
{ content: 'world. Successfully modified!',
  createdAt: '2018-04-01T13:56:34.808Z',
  user_id: '1',
  updatedAt: '2018-04-01T13:56:35.687Z',
  title: 'hello' }
    ✓ Should return 200 status code (215ms)

  DELETE /todo/:id
    ✓ Should return 204 status code (219ms)


  5 passing (2s)
```

DynamoDB에서 간단하게 CRUD작업하는 것을 확인할 수 있습니다.

## Cloud9에서 배포하기

<!-- Cloud9을 통한 배포는 크게 어렵지 않습니다. 다음과 같이 오른쪽 위치에 Local Functions가 있습니다.
여기에는 편집하고 있는 serverlessHandsOn으로 나타날 것입니다.
우클릭을 하고 Deploy를 클릭하면 배포가 완료됩니다.

배포가 완료되면 Local Functions 아래에 Remote Functions에 해당 람다를 확인할 수 있습니다.

![c9-deploy](/images/c9-deploy.png) -->
Node가 8.x버전이 설치되어 있으면 dev-dependency에 설치된 serverless 명령어를 바로 사용할 수 있습니다.
하지만 현재(2018-04-07)의 기준으로 Cloud9은 node 6.x버전을 지원하기 때문에 Global로 serverless를 설치하여 줍니다.

```sh
ec2-user:~/environment/serverless-todo-demo/serverless-api (master) $ npm i -g serverless
```

설치가 완료되었으면 배포를 합니다.

```sh
ec2-user:~/environment/serverless-todo-demo/serverless-api (master) $ serverless deploy
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (8.02 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..............
Serverless: Stack update finished...
Service Information
service: ServerlessHandsOn
stage: dev
region: ap-northeast-2
stack: ServerlessHandsOn-dev
api keys:
  None
endpoints:
  ANY - https://YOUR_CLOUD_FRONT_URL/dev/{proxy+}
functions:
  serverlessHandsOn: ServerlessHandsOn-dev-serverlessHandsOn
Serverless: 'Too many requests' received, sleeping 5 seconds
Serverless: 'Too many requests' received, sleeping 5 seconds
```

위와같이 배포되었으면 URL에 접속하여 실제 동작하는지 확인합니다.

```sh
ec2-user:~/environment/serverless-todo-demo/serverless-api (master) $ curl https://YOUR_CLOUD_FRONT_URL/dev/{proxy+}
[]
```

## References

- [https://aws.amazon.com/ko/cloud9/](https://aws.amazon.com/ko/cloud9/)