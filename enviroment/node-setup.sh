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
# curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -
# https://github.com/nodesource/distributions 参照
echo "npm, node install  ----------------------------------"
nodeVer=22
nodeInstallCmd=`curl -sL https://deb.nodesource.com/setup_${nodeVer}.x | sudo -E bash -`
eval ${nodeInstallCmd}
sudo apt install nodejs -y
sudo npm install -g npm
