#!/usr/bin/env bash

# Update dependencies
yarn install

# Run rollup build
yarn build

# Lint extension
npx web-ext lint
# Build extension
npx web-ext build --overwrite-dest

echo "✅ Done"