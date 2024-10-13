#!/bin/bash

IS_RUNNING_TRAEFIK=`docker compose -f compose.deps.yml ps -q traefik`
IS_RUNNING_DB=`docker compose -f compose.deps.yml ps -q db`
if [[ "$IS_RUNNING_TRAEFIK" == "" || "$IS_RUNNING_DB" == "" ]]; then
    echo "Traefik or DB is not running. Running now..."
    docker compose -f compose.deps.yml up -d
else
    echo "Traefik and DB are running."
fi

docker compose -f compose.local.yml down 
docker compose -f compose.local.yml up --build -d 