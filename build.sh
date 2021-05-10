docker context use default

# Build docker containers
docker build -t jampherpo/collab_server server
docker build -t jampherpo/collab_client client

# Push containers to Docker hub
docker push jampherpo/collab_server
docker push jampherpo/collab_client

# docker-compose build
