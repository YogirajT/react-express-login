#!/bin/bash
echo "killing existing process"
kill `lsof -t -i:3001`
echo "wait for kill"
sleep 5
echo "start react"
cd ./frontend
if [ -d "./build" ]; then
  echo "removing build directory"
  rm -r ./build
fi
npm i && npm run build && npm start
echo "done"