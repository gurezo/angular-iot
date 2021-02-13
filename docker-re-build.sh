#!/bin/bash

set -e

# コンテナ終了
docker-compose down

# コンテナを全削除する
docker ps -aq | xargs docker rm

# イメージを全削除する
docker images -aq | xargs docker rmi

# コンテナビルド開始
docker-compose up -d --build
