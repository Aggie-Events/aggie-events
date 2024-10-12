docker compose -f compose.prod.yml down 
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d
docker image prune -af