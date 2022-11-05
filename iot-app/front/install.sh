#!/bin/bash
set -e

echo "portfolio re-install"
rm -rf node_modules package-lock.json && npm cache clear --force && npm cache verify && npm i --force
