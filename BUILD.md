# Environment Setup Instruction
* Install docker
* Install docker-compose 
* Install AWS cli

* Install docker-compose ECS
```
# https://docs.docker.com/cloud/ecs-integration/#install-the-docker-compose-cli-on-linux
curl -L https://raw.githubusercontent.com/docker/compose-cli/main/scripts/install/install_linux.sh | sh
```
* Setup docker ECS context
```
docker context create ecs myecscontext
```