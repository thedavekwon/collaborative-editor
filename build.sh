docker context use default

# Build docker containers
docker build -t thedavekwon/collab_server server
docker build -t thedavekwon/collab_client client

# Push containers to Docker hub
docker push thedavekwon/collab_server
docker push thedavekwon/collab_client

# docker-compose build
