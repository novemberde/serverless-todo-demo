# Pre-requirements


1. Install node-gyp globally.
```bash
$ npm i -g node-gyp
```

# Steps

1. Install modules.
```bash
$ npm install
```

2. You need mecab or mecab-ko for Korean language.

Build mecab using docker image "lambci/lambda:build-nodejs8.10". [reference](https://hub.docker.com/r/lambci/lambda)


```bash
$ ./sls-build.sh 
bash: permission denied: ./sls-build.sh

# Add a permission on 'sls-build.sh' file
$ chmod +x sls-build.sh 
```

<!-- 
lambci로 mecab을 빌드하면 로컬에서 돌아가지 않는다.
또한, 로컬에서 빌드한 것은 lambci에서 돌아가지 않는다.
 -->

# References

- https://github.com/golbin/node-mecab-ya
- https://hub.docker.com/r/lambci/lambda