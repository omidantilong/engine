#/bin/bash

# This file deals with all incoming `engine` commands
# It is quite simple at the moment and won't scale well

case $1 in 
  "build")
    astro check && docker buildx build --tag tenant-image .
  ;;
  "build-local")
    astro check && engine prebuild && astro build && engine postbuild
  ;;
  "build-astro") 
    astro build
  ;;
  "serve")
    docker run --name tenant -i -t -p 8020:8020 tenant-image
  ;;
  "prebuild")
    esbuild tenant.config.ts --outfile=$PWD/engine/tenant.config.mjs
  ;;
  "postbuild")
    mkdir -p dist/node_modules/
    mkdir -p dist/engine/
    cp -r engine/tenant.config.mjs dist/engine/
  ;;
  "init")
    node node_modules/@omidantilong/engine/bin/init.mjs
  ;;
esac

