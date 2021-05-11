docker context use myecscontext
docker compose convert > docker-compose-aws.yml 
sed -i "s/'!Ref UserPoolClient'/!Ref UserPoolClient/" docker-compose-aws.yml 
sed -i "s/'!Ref UserPool'/!Ref UserPool/" docker-compose-aws.yml 

aws cloudformation create-stack --stack-name collabeditor --template-body file://docker-compose-aws.yml --capabilities CAPABILITY_NAMED_IAM