#!/bin/bash

set -e

# イメージを抽出
echo "イメージを抽出"
docker images -f "dangling=true"

# イメージを一括削除
echo "イメージを一括削除"
docker image prune
