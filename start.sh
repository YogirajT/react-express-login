#!/bin/bash
echo "killing existing process"
kill `lsof -t -i:3000`
kill `lsof -t -i:3001`
echo "wait for kill"
sleep 5
echo "start node"
cd ./backend && npm i && nohup node index.js & > /dev/null 2>&1 &
cd ./frontend && rm -r ./build && npm i && npm run build && npm start
echo "done"