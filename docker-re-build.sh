#!/bin/bash

set -e

# コンテナ終了
docker-compose down

# 停止しているコンテナをすべて削除する
docker container prune

# コンテナビルド開始
docker-compose up -d --build
