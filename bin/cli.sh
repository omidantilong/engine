#/bin/bash

# This file deals with all incoming `engine` commands
# It is quite simple at the moment and won't scale well

case $1 in 
  "build")
    astro check && docker buildx build --tag tenant-image .
  ;;
  "build-local")
    engine prebuild && astro check && astro build && engine postbuild
  ;;
  "serve")
    docker run --name tenant -i -t -p 8020:8020 tenant-image
  ;;
  "prebuild")
    esbuild tenant.config.ts --outfile=engine/tenant.config.mjs
  ;;
  "postbuild")
    mkdir -p dist/node_modules/
    mkdir -p dist/engine/
    cp -r node_modules/{react,react-dom,scheduler} dist/node_modules/
    cp -r engine/ dist/engine
    rm engine/tenant.config.mjs
  ;;
  "init")
    node node_modules/@omidantilong/engine/bin/init.mjs
  ;;
esac

