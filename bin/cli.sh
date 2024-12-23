#/bin/bash

case $1 in 
  "build")
    docker buildx build --tag tenant-image .
  ;;
  "serve")
    docker run --name tenant -i -t -p 8020:8020 tenant-image
  ;;
  "copy-externals")
    mkdir -p dist/node_modules/
    mkdir -p dist/engine/
    cp -r node_modules/{react,react-dom,scheduler} dist/node_modules/
    cp -r engine/{paths,refs}.json dist/engine
  ;;
esac