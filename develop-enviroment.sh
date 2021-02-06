#!/bin/bash

set -e

echo "apt-get -y update ----------------------------------"
sudo apt-get -y update
echo "apt-get -y upgrade ----------------------------------"
sudo apt-get -y upgrade
echo "apt-get -y autoremove ----------------------------------"
sudo apt-get -y autoremove
echo "apt-get -y autoclean ----------------------------------"
sudo apt-get -y autoclean

# curlコマンドがbashのシェルスクリプトを介して実行されない
# https://is.gd/bSlbfa
# curl コマンドは変数に入れて実行
# curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
# https://github.com/nodesource/distributions 参照
echo "npm, node install  ----------------------------------"
nodeVer=12
nodeInstallCmd=`curl -sL https://deb.nodesource.com/setup_${nodeVer}.x | sudo -E bash -`
eval ${nodeInstallCmd}
sudo apt install nodejs -y
sudo npm install -g npm

# curl コマンドは変数に入れて実行
# curl -fsSL https://get.docker.com -o get-docker.sh
echo "docker install  ----------------------------------"
dockerInstallCmd=`curl -fsSL https://get.docker.com -o get-docker.sh`
eval ${dockerInstallCmd}
chmod 755 get-docker.sh
sudo sh get-docker.sh

# docker-compose インストール用にセットアップ
echo "libffi-dev install  ----------------------------------"
sudo apt install libffi-dev -y

# bffi-devをインストールした後ならpip3でdocker-composeをインストールできる
echo "docker-compose  ----------------------------------"
sudo pip3 install docker-compose







