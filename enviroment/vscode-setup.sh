# note: Please execute after executing node.sh

#!/bin/bash
set -e

# VS code のインストール
wget -O /tmp/code.deb 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-arm64'
sudo apt install -y /tmp/code.deb

rm -rf /tmp/code.deb
