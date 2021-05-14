# Deployment Instruction
## Build
```
# The default build script names the docker image as thedavekwon/collab_server and thedavekwon/collab_client. 
# Change the docker image name as <USERNAME>/collab_server and <USERNAME>/collab_client in order to push to your docker hub
./build.sh
```

## Local
```
cd deploy/local

# Setup Cognito UserPool and UserPoolClient
# Update following USER_POOL_ID and CLIENT_ID in deploy/local/docker-compose.yml
# - REACT_APP_USER_POOL_ID=REACT_APP_USER_POOL_ID
# - REACT_APP_CLIENT_ID=REACT_APP_CLIENT_ID

./run-local.sh
```

## AWS
```
cd deploy/aws

# If you named docker ecs context differently, update in run-aws.sh instead of myecscontext
./run-aws.sh

# Kill AWS Cloudformation Stack
./clean-aws.sh 
```