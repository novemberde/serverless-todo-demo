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

