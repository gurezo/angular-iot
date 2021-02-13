set -e

docker rmi -f $(docker images)

docker-compose up -d --build
