# Serverless Group First Hands-on Part 1

AWSKRUG Serverless Group의 첫번째 핸즈온 Part.1 웹어플리케이션 만들기입니다.😁

## Objective

Amazon Web Service 를 활용하여 Serverless architecture로 구성된 API를 배포합니다.
결과는 S3에 static-web-site로 배포된 React Web app을 통해 확인합니다.

## AWS Resources

AWS에서 사용하는 리소스는 다음과 같습니다.

- Cloud9: 코드 작성, 실행 및 디버깅을 위한 클라우드 기반 IDE.
- EC2: 클라우드에서 확장식 컴퓨팅을 제공. 여기서는 Cloud9을 동작하기 위해 사용.
- API Gateway : API를 생성, 게시, 유지 관리, 모니터링 및 보호할 수 있게 해주는 서비스.
- Lambda: 서버를 프로비저닝하거나 관리하지 않고도 코드를 실행할 수 있게 해주는 컴퓨팅 서비스. 서버리스 아키텍쳐의 핵심 서비스.
- DynamoDB: 완벽하게 관리되는 NoSQL 데이터베이스 서비스로, 원활한 확장성과 함께 빠르고 예측 가능한 성능을 제공.
- S3: 어디서나 원하는 양의 데이터를 저장하고 검색할 수 있도록 구축된 객체 스토리지. 소스코드의 저장소로 활용할 예정.

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

![c9-region](/images/c9-region.png)

설정을 마친 다음 Node.js 버전을 올려야합니다.
현재(2018-06-30) 제공하는 node의 버전이 6.10이기 때문입니다.
보통은 nvm을 따로 설치해야하지만 Cloud9을 사용하면 별도의 nvm 설치는 필요없습니다.
다음의 명령어를 terminal에 입력하여 node의 버전을 8.10으로 설정합니다.

```sh
$ sudo yum groupinstall 'Development Tools'
$ nvm install 8.10
Downloading https://nodejs.org/dist/v8.10.0/node-v8.10.0-linux-x64.tar.xz...
######################################################################## 100.0%
Now using node v8.10.0 (npm v5.6.0)

# 8.10을 default로 사용하기
$ nvm alias default 8.10
```

Cloud9 설정을 완료하였습니다.

## [Serverless Framework](https://serverless.com/)

![serverless framework main](/images/serverless-framework-1.png)

Serverless Framework 메인에 나와있는 소개문구는 다음과 같습니다.

Serverless is your toolkit for deploying and operating serverless architectures.
Focus on your application, not your infrastructure.

위 내용을 번역한 내용은 "Serverless는 서버 없는 아키텍처를 배치하고 운영하기 위한 툴킷입니다. 인프라가 아닌 애플리케이션에 집중합니다." 입니다.
이처럼 Serverless framework는 Serverless architecture를 운영하기 위한 툴이라고 생각하면 됩니다.

그러면 serverless framework를 사용하기 위한 환경은 어떻게 될까요?

node.js가 설치되어 있는 환경에서 사용할 수 있습니다.

open source로 기여하고 싶다면 [https://github.com/serverless/serverless](https://github.com/serverless/serverless)에서 issue와 pull request를 등록해주세요.

### Serverless Framework 살펴보기

Serverless Framework를 사용하기 위해서 명령어들을 살펴봅시다.

```sh
$ npm i -g serverless

# 명령어들을 확인해봅니다.
$ serverless --help

Commands
* You can run commands with "serverless" or the shortcut "sls"
* Pass "--verbose" to this command to get in-depth plugin info
* Pass "--no-color" to disable CLI colors
* Pass "--help" after any <command> for contextual help

Framework
* Documentation: https://serverless.com/framework/docs/

config ........................ Configure Serverless
config credentials ............ Configures a new provider profile for the Serverless Framework
create ........................ Create new Serverless service
deploy ........................ Deploy a Serverless service
deploy function ............... Deploy a single function from the service
deploy list ................... List deployed version of your Serverless Service
deploy list functions ......... List all the deployed functions and their versions
info .......................... Display information about the service
install ....................... Install a Serverless service from GitHub or a plugin from the Serverless registry
invoke ........................ Invoke a deployed function
invoke local .................. Invoke function locally
logs .......................... Output the logs of a deployed function
metrics ....................... Show metrics for a specific function
package ....................... Packages a Serverless service
plugin ........................ Plugin management for Serverless
plugin install ................ Install and add a plugin to your service
plugin uninstall .............. Uninstall and remove a plugin from your service
plugin list ................... Lists all available plugins
plugin search ................. Search for plugins
print ......................... Print your compiled and resolved config file
remove ........................ Remove Serverless service and all resources
rollback ...................... Rollback the Serverless service to a specific deployment
rollback function ............. Rollback the function to the previous version
slstats ....................... Enable or disable stats

Platform (Beta)
* The Serverless Platform is currently in experimental beta. Follow the docs below to get started.
* Documentation: https://serverless.com/platform/docs/

emit .......................... Emits an event to a running Event Gateway
login ......................... Login or sign up for the Serverless Platform
logout ........................ Logout from the Serverless Platform
run ........................... Runs the Event Gateway and the Emulator

Plugins
AwsConfigCredentials, Config, Create, Deploy, Emit, Info, Install, Invoke, Login, Logout, Logs, Metrics, Package, Plugin, PluginInstall, PluginList, PluginSearch, PluginUninstall, Print, Remove, Rollback, Run, SlStats
```

여기서 자주 사용하게 될 명령어는 다음과 같습니다.

- create: 프로젝트 생성시 사용
- deploy: 배포할 때 사용
- package: 배포될 패키지의 구조를 보고싶을 때 사용
- invoke: 특정 handler를 동작시킬 때 사용
- remove: 배포된 리소스를 제거할 때 사용

간단하게 로컬에서 serverless 명령어를 테스트해봅니다. deploy 명령어는 추후에 사용하겠습니다.

```sh

# serverless service 생성 힌트 받기
$ serverless create --help
Plugin: Create
create ........................ Create new Serverless service
    --template / -t .................... Template for the service. Available templates: "aws-nodejs", "aws-nodejs-typescript", "aws-nodejs-ecma-script", "aws-python", "aws-python3", "aws-groovy-gradle", "aws-java-maven", "aws-java-gradle", "aws-kotlin-jvm-maven", "aws-kotlin-jvm-gradle", "aws-kotlin-nodejs-gradle", "aws-scala-sbt", "aws-csharp", "aws-fsharp", "aws-go", "aws-go-dep", "azure-nodejs", "fn-nodejs", "fn-go", "google-nodejs", "kubeless-python", "kubeless-nodejs", "openwhisk-java-maven", "openwhisk-nodejs", "openwhisk-php", "openwhisk-python", "openwhisk-swift", "spotinst-nodejs", "spotinst-python", "spotinst-ruby", "spotinst-java8", "webtasks-nodejs", "plugin" and "hello-world"
    --template-url / -u ................ Template URL for the service. Supports: GitHub, BitBucket
    --template-path .................... Template local path for the service.
    --path / -p ........................ The path where the service should be created (e.g. --path my-service)
    --name / -n ........................ Name for the service. Overwrites the default name of the created service. ## "

# node를 사용하므로 템플릿을 "aws-nodejs" 로 "sample-app" 생성하기
$ serverless create -t "aws-nodejs" -p sample-app

# sample-app에서 명령어 연습하기
$ cd sample-app
~/sample-app $ serverless package
Serverless: Packaging service...
Serverless: Excluding development dependencies...

# 여기까지 진행했다면 .serverless 디렉터리를 확인할 수 있습니다.
~/sample-app $ cd .serverless

# 생성된 파일을 보면 다음과 같음을 알 수 있습니다.
~/sample-app/.serverless $ ls
cloudformation-template-create-stack.json
cloudformation-template-update-stack.json
sample-app.zip
serverless-state.json
```

위에 생성된 파일이 어떻게 동작하는지는 파일명만으로도 유추할 수 있습니다.

현재 cloudformation에 stack이 존재하지 않을 경우 스택을 생성한 다음,
업데이트를 하여 원하는 코드가 Lambda에 배포되도록 하는 것입니다.

serverless-state.json파일은 해당 버전의 serverless application에 대한
정보가 담겨 있습니다.

```sh
# 다시 앱의 루트디렉터리로 돌와와서 invoke를 해보겠습니다.
~/sample-app/.serverless $ cd ..
~/sample-app $ serverless invoke local --function hello
{
    "statusCode": 200,
    "body": "{\"message\":\"Go Serverless v1.0! Your function executed successfully!\",\"input\":\"\"}"
}
```

## S3 Bucket 생성하기

S3는 Object Storage로 쉽게 설명하자면 하나의 저장소입니다. 파일들을 업로드 / 다운로드 할 수 있으며 AWS에서 핵심적인 서비스 중 하나입니다.
여러 방면으로 활용할 수 있지만 여기서는 소스코드의 저장소 역할을 합니다.

S3의 메인으로 가서 버킷 생성하기 버튼을 클릭합니다.

![s3-create-btn.png](/images/s3-create-btn.png)

아래와 같이 입력하고 생성버튼을 클릭합니다.

- 버킷 이름(Bucket name): USERNAME-serverless-hands-on-1   // 여기서 USERNAME을 수정합니다. ex) khbyun-serverless-hands-on-1
- 리전(Region): 아시아 태평양(서울)

![s3-create-btn.png](/images/s3-create-1.png)


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
│   ├── config.yml : serverless.yml에서 사용하기 위한 변수
│   ├── package.json
│   └── serverless.yml :  Serverless Framework config file
└── static-web-front : SPA 방식의 Web Front
```

먼저 serverless-api 디렉터리를 생성하고 npm 초기화를 시켜줍니다.

```sh
$ mkdir serverless-api
$ cd serverless-api
$ npm init -y
```

필요한 npm module들을 install합니다. 
여기서 aws-sdk는 개발을 위해 설치합니다. 
Lambda는 aws-sdk를 기본적으로 포함하고 있기 때문에 실제로 배포할 때는 포함시키지 않아야합니다. 
dev-dependency로 넣어두면 배포할 때 제외됩니다.

- Dependencies
  - express : Web Application Framework
  - body-parser : Request Body를 parsing하기 위한 미들웨어
  - aws-serverless-express : Express를 Lambda에서 사용할 수 있도록 Wrapping하는 패키지
  - dynamoose : DynamoDB를 사용하기 쉽도록 Modeling하는 도구
  - dotenv : 환경 변수를 손쉽게 관리할 수 있게 하는 패키지
  - cors : 손쉽게 cors를 허용하는 미들웨어
- Dev-dependencies
  - mocha : 개발 도구
  - supertest : HTTP 테스트를 하기 위한 모듈
  - should: BDD(Behaviour-Driven Development)를 지원하기 위한 모듈
  - serverless: Serverless Framework
  - aws-sdk : AWS 리소스를 사용하기 위한 SDK
  - serverless-apigw-binary: Binary Media Type을 지원하기 위한 플러그인

```sh
$ npm i -S express aws-serverless-express body-parser dynamoose dotenv cors
$ npm i -D mocha should supertest serverless aws-sdk serverless-apigw-binary
```

각 파일을 편집합니다.

### serverless-api/config.yml

```yml
AWS_REGION: ap-northeast-2
STAGE: dev
DEPLOYMENT_BUCKET: ${USERNAME}-serverless-hands-on-1    # USERNAME 수정 필요!
```

### serverless-api/app.js

```js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("aws-sdk").config.region = "ap-northeast-2"

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 실제로 사용한다고 가정하면 유저정보를 실어주어야함.
app.use((req, res, next) => {
    res.locals.userId = "1";
    next();
});

app.get("/", (req, res, next) => {
    res.send("hello world!\n");
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

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)
 
module.exports.api = (event, context) => awsServerlessExpress.proxy(server, event, context)
```

### serverless-api/routes/todo.js

```js
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

### serverless-api/package.json

npm script 내용을 추가해주어야 합니다.

```json
{
  "name": "serverless-api",
  ....
  //// 이 스크립트 영역을 복사해서 붙여넣어줍니다.
  "scripts": {
    "test": "mocha spec/*.spec.js --timeout 10000",
    "start": "node bin/www",
    "deploy": "serverless deploy"
  },
  ////
  ...
  "keywords": [],
  "author": "",
  ...
}
```

<!-- 마지막으로 template.yaml을 생성합니다. 이것은 Cloud9상에서 Lambda함수를 배포할 수 있도록 해주는 파일입니다. -->
마지막으로 serverless.yml을 생성합니다. 이것은 Serverless Framework를 통해 AWS에 손쉽게 serverless 환경을 배포할 수 있게 도와줍니다.
내부적으로는 CloudFormation Template을 생성하여 배포합니다. 배포된 Artifact는 S3에서 확인해볼 수 있습니다.

### serverless-api/serverless.yml

```yml
service: ServerlessHandsOnPart1

provider:
  name: aws
  runtime: nodejs8.10
  memorySize: 128
  stage:  ${file(./config.yml):STAGE}
  region: ${file(./config.yml):AWS_REGION}
  deploymentBucket: ${file(./config.yml):DEPLOYMENT_BUCKET}
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
      - 'application/json'
      - 'text/html'

functions:
  webapp:
    handler: handler.api
    events:
      - http: 
          path: /{proxy+}
          method: ANY
          cors: true
      - http: 
          path: /{proxy+}
          method: OPTIONS
          cors: true
```

** 위에서 살펴보면 app.js와 serverless.yml에 cors관련 옵션이 있습니다. 보안 상의 이유로, 브라우저들은 스크립트 내에서 초기화되는 
cross-origin HTTP 요청을 제한하기 때문에 별도로 API Gateway에서 허용을 해주고, 실제로 동작하는 Lambda에서도 서버처럼 동작하기 때문에
옵션을 추가해야됩니다. 이에 대한 자세한 내용은 
[HTTP 접근 제어 (CORS)](https://developer.mozilla.org/ko/docs/Web/HTTP/Access_control_CORS)에서
확인할 수 있습니다.

---


모든 파일을 편집하였다면 서버를 가동해봅니다.

```sh
ec2-user:~/environment/serverless-api $ npm start
> serverless-api@1.0.0 start /home/ec2-user/environment/serverless-api
> node bin/www

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

- 파티션키(Partition Key): userId
- 정렬키(Sort Key): createdAt

소스코드 상에서는 userId를 "1"로 고정시켜두었습니다. 일반적으로 유저의 키값을 partition key로 사용하기 때문입니다.
또한 레코드의 생성 시간을 정렬키로 사용합니다.

그럼 [DynamoDB Console](https://ap-northeast-2.console.aws.amazon.com/dynamodb/home?region=ap-northeast-2#)로 이동합니다.
테이블 만들기를 클릭하여 아래와 같이 테이블을 생성합니다.

![dynamodb-create](/images/dynamodb-create.png)

그런 다음에 다시 Cloud9으로 돌아가서 테스트 코드를 돌려봅니다.

```sh
ec2-user:~/environment/serverless-api $ npm test

> serverless-api@1.0.0 test /home/ec2-user/environment/serverless-api
> mocha spec/*.spec.js --timeout 10000



  POST /todo
    ✓ Should return 201 status code (912ms)

  PUT /todo/:id
    ✓ Should return 200 status code (225ms)

  GET /todo
[ { content: 'world. Successfully modified!',
    createdAt: '2018-04-01T13:56:34.808Z',
    userId: '1',
    updatedAt: '2018-04-01T13:56:35.687Z',
    title: 'hello' } ]
    ✓ Should return 200 status code (224ms)

  GET /todo/:createdAt?user_id=
2018-04-01T13:56:34.808Z
1
{ content: 'world. Successfully modified!',
  createdAt: '2018-04-01T13:56:34.808Z',
  userId: '1',
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
만일 node 6.x버전이라면 Global로 serverless를 설치하여 줍니다. 현재는 8.x의 버전을 사용하기 때문에 다음 명령어는 넘어가겠습니다.

설치가 완료되었으면 배포를 합니다. package.json에 script에 serverless deploy를 넣어 두었기 때문에
다음과 같이 배포를 합니다.

```sh
ec2-user:~/environment/serverless-todo-demo/serverless-api (master) $ npm run deploy
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

## Static Web Site에서 API 호출해보기

지금까지 API를 구성해보았습니다. API만드로도 서비스가 가능할까요?
이를 호출할 클라이언트가 없다면 서비스가 될 수 없을 겁니다.
작성한 node server에서 Web site를 뿌려주는 Server Side Rendering방식을 택할 수도있습니다.
그렇지만 이번에는 Static Web Site를 하나의 앱이라고 생각하고
데이터만 서버에 요청하여 UI에 반영하려고 합니다.
작업한 내용이 어떻게 표현되는지 확인하고,
CloudFront + S3로 Static Web Site를 호스팅해봅시다.

첫 번째로, [Git repository](https://github.com/novemberde/serverless-todo-demo.git)를 가져옵니다.

```sh
# Work directory로 이동
ec2-user:~/environment $ cd ~/environment

# !! 여기서는 yarn으로 패키지를 설치. npm으로 설치하게 되면 Parcel bundler가 제대로 동작하지 않습니다.
ec2-user:~/environment $ curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
ec2-user:~/environment $ sudo yum install yarn
ec2-user:~/environment $ yarn --version

# Git repository clone하기
ec2-user:~/environment $ git clone https://github.com/novemberde/serverless-todo-demo.git

# Static Web Site를 구성한 directory로 이동
ec2-user:~/environment $ cd serverless-todo-demo/static-web-front

# npm으로 package 설치
ec2-user:~/environment/serverless-todo-demo/static-web-front $ yarn install

# Static Web Site 시작하기
ec2-user:~/environment/serverless-todo-demo/static-web-front $ npm start

> serverless-todo-demo-app@1.0.0 start /Users/kyuhyunbyun/WorkSpace/workshop/serverless-todo-demo/static-web-front
> npx parcel src/index.html

Server running at http://localhost:1234
✨  Built in 3.99s.
```

웹페이지는 출력되지만 현재 웹이 호출하는 API의 주소를 수정해주어야 현재 올린 API를 사용할 수 있습니다.
아래와 같은 파일을 열어 baseUrl값을 수정합니다. 이 값은 api를 배포하였을 때 복사해둔 CloudFront 주소입니다.

복사하지 않으셨다면 다음을 다시 참고해주시길 바랍니다.
<a href="#cloud9에서-배포하기">Cloud9에서 배포하기</a>

### static-web-front/src/components/App.js

```js
import 'setimmediate'
import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import MaterialUiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { List, ListItem } from 'material-ui/List'
import { TextField, RaisedButton } from 'material-ui'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Top from './Top'

const baseURL = 'CLOUD_FRONT_URL';  // Insert your CloudFront url.
...
```



정상적으로 동작하는지 확인하고 싶다면 새로운 터미널을 열고(맥은 option+t, 윈도우는 alt+t) 다음과 같이 확인합니다.

```sh
ec2-user:~/environment $ curl localhost:1234
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="/src.7afc2ec1.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css">
  <script src="/src.7afc2ec1.js"></script></head>
  <body>
    <div id="app"></div>
    <script src="/src.1e244cd7.js"></script>
  </body>
</html>
```

정상적으로 출력이 되는 것을 확인하였습니다. 하지만 기본적으로 EC2는 네트워크를 통제하고 있습니다.
Cloud9은 EC2를 생성하여 사용하는데, 보안그룹(Security Group)에서 포트를 열어주어야 외부에서
접근이 가능합니다.

[Security Group Setting](https://ap-southeast-1.console.aws.amazon.com/ec2/v2/home?region=ap-southeast-1#SecurityGroups:sort=groupId)으로
들어가서 그룹이름(Group name)이 aws-cloud9-serverless-hands-on로 시작하는 것을 선택합니다.

![security-group](/images/security-group.png)

편집(Edit)을 눌러서 "TCP / 1234 / 위치 무관(Anywhere)"으로 추가합니다.

![security-group](/images/security-group2.png)


이제 브라우저를 열고 http://{CLOUD9_PUBLIC_DNS}:1234 에 접속하시면 다음과 같은 화면을 볼 수 있습니다.

CLOUD9_PUBLIC_DNS 확인하는 것은 EC2 console에서 할 수 있습니다.
그렇지만 이게 귀찮다면 다음과 같이 terminal에 입력합니다. 간단히 public ip를 얻을 수 있습니다.
그럼 CLOUD9_PUBLIC_DNS 대신 ip를 넣어서 접속해봅니다.

```sh
ec2-user:~/environment $ curl http://checkip.amazonaws.com/
xxx.xxx.xxx.66
```

![static-front](/images/static-front.png)

이제 마음껏 추가 삭제 수정을 해보세요! 😀

## S3를 통해 Static Web Site를 호스팅하기

Amazon S3는 파일을 저장하는 저장소 역할을 합니다. 파일을 저장하고 URL을 통해서 파일에 접근합니다.
그렇다면 URL로 접근하는 파일이 HTML, CSS, JAVASCRIPT로 작성되어 있다면 브라우저에서 사용이 가능하겠죠?

그래서 S3는 정적인 웹사이트 호스팅을 지원합니다.

이전과 똑같이 [S3 Console](https://console.aws.amazon.com/s3/home?region=ap-northeast-2)에 접속하여 버킷을 생성합니다.

- 버킷이름(Bucket name): {USERNAME}-serverless-static-web
- 리전(Region): 아시아 태평양(서울)

![static-web1](/images/static-web1.png)

속성 설정은 Default로 두고, 권한설정에서 "이 버킷에 퍼블릭 읽기 액세스 권한을 부여함"을 선택하고 생성합니다.

![static-web3](/images/static-web3.png)


그 다음에 생성한 버킷 > 속성 메뉴에 들어가서 [정적 웹사이트 호스팅](Static Website Hosting)을 클릭하고 다음과 같이 입력합니다.

- 인덱스 문서(Index document): index.html
- 오류 문서(Error document): index.html

![static-web2](/images/static-web2.png)

설정을 완료하였습니다. 그럼 빌드된 html 문서를 S3에 업로드하면 됩니다.

다시 Cloud9으로 돌아와서 다음과 같이 입력합니다.

```sh
$ cd ~/environment/serverless-todo-demo/static-web-front/dist/
# USERNAME 은 수정합니다.
ec2-user:~/environment/serverless-todo-demo/static-web-front/dist (master) $ aws s3 cp ./ s3://{USERNAME}-serverless-static-web/ --recursive --acl public-read
```

모든 배포가 완료되었습니다.

http://{USERNAME}-serverless-static-web.s3-website.ap-northeast-2.amazonaws.com/ 에 접속하여 나만의 Todo List를 확인해보세요!


## 리소스 삭제하기

서버리스 앱은 내리는 것이 어렵지 않습니다.
간단한 Command 하나면 모든 스택이 내려갑니다.
Cloud9에서 새로운 터미널을 열고 다음과 같이 입력합니다.

```sh
$ cd ~/environment/serverless-api
$ serverless remove
Serverless: Getting all objects in S3 bucket...
Serverless: Removing objects in S3 bucket...
Serverless: Removing Stack...
Serverless: Checking Stack removal progress...
............
Serverless: Stack removal finished...
```

[DynamoDB Console](https://ap-northeast-2.console.aws.amazon.com/dynamodb/home?region=ap-northeast-2#)로 들어가서 Table을 삭제합니다. 리전은 서울입니다.

[Cloud9 Console](https://ap-southeast-1.console.aws.amazon.com/cloud9/home?region=ap-southeast-1)로 들어가서 IDE를 삭제합니다. 리전은 싱가포르입니다.

[S3 Console](https://s3.console.aws.amazon.com/s3/home?region=ap-southeast-1#)로 들어가서 생성된 버킷을 삭제합니다.

<!-- ## 하나 더! 서버리스 테스트하기

여기는 도커를 아는 분에 한해서 사용하실 수 있습니다.
알고보면 Lambda가 내부적으로 Docker container가 올라가는 형태인데요,
그렇다면 Docker를 활용해서 로컬에서 테스트해볼 수 있지 않을까요? -->


## References

- [https://aws.amazon.com/ko/cloud9/](https://aws.amazon.com/ko/cloud9/)
- [https://serverless.com/](https://serverless.com/)