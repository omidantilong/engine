#/bin/bash

# This file deals with all incoming `engine` commands
# It is quite simple at the moment and won't scale well

case $1 in 
  "build")
    astro check && docker buildx build --tag tenant-image .
  ;;
  "build-local")
    astro check && astro build && engine prepare
  ;;
  "serve")
    docker run --name tenant -i -t -p 8020:8020 tenant-image
  ;;
  "prepare")
    mkdir -p dist/node_modules/
    mkdir -p dist/engine/
    cp -r node_modules/{react,react-dom,scheduler} dist/node_modules/
    cp -r engine/{paths,refs}.json dist/engine
  ;;
  "init")
    echo "engine init"
  ;;
esac

