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



## References
- [https://aws.amazon.com/ko/cloud9/](https://aws.amazon.com/ko/cloud9/)