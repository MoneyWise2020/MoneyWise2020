#!/bin/bash

docker stop moneywise-backend-container
docker rm -v moneywise-backend-container
docker build -t moneywise-backend .
docker run --name moneywise-backend-container -d -p 8000:8000 moneywise-backend