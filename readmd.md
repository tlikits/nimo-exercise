## Nimo Test Exercise

This repository is created for implementing the exercise that assigned by Nimo Industries.

## Prerequisite

- Node 20.x
- AWS SAM

## Getting Started

1. Setup AWS Credential by providing `AWS Access Key ID` and `AWS Secret Access Key`
```
aws configure
```

2. Install the dependency of the project
```
npm ci
```

3. Build source code for deploying on Lambda
```
npm run build
```

4. Deploy to AWS with AWS SAM
```
sam deploy
```

5. After the deployment is completed, the outputs will be displayed, providing the endpoint of the service

## API Specification

Check on the [openapi document](/openapi.yaml) or you could try on [postman collection](/nimo-exercise.postman_collection.json)
