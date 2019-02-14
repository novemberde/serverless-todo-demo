# Build
npm run build

# Deploy
aws s3 cp ./dist/ s3://sls-ts-static-web-front/ --recursive --acl public-read