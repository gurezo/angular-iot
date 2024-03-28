#!/bin/bash
set -e

echo "angular iot re-install"
rm -rf node_modules package-lock.json && npm cache verify && pnpm i
