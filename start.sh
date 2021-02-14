#!/bin/bash
echo "killing existing process"
kill `lsof -t -i:3000`
echo "wait for kill"
sleep 5
echo "start node"
cd ./backend && npm i && nohup node index.js & > /dev/null 2>&1 &
echo "done"
