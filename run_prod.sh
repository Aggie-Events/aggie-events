#!/bin/bash

# IS_RUNNING_APP=`sudo docker ps -a | grep app_container`
# IS_RUNNING_BACKEND=`sudo docker ps -a | grep backend_container`
# if [[ "$IS_RUNNING_APP" != ""]]; then
#     echo "App is running. Stopping now..."
#     docker stop app_container
#     docker rm app_container
# else

# if [[ "$IS_RUNNING_BACKEND" != ""]]; then
#     echo "Backend is running. Stopping now..."
#     docker stop backend_container
#     docker rm backend_container
# else

IS_RUNNING_TRAEFIK=`docker compose -f compose.deps.yml ps -q traefik`
IS_RUNNING_DB=`docker compose -f compose.deps.yml ps -q db`
if [[ "$IS_RUNNING_TRAEFIK" == "" || "$IS_RUNNING_DB" == "" ]]; then
    echo "Traefik or DB is not running. Running now..."
    docker compose -f compose.deps.yml up -d
else
    echo "Traefik and DB are running."
fi

docker compose -f compose.prod.yml down 
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d