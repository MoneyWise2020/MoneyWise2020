#!/bin/bash

cp /usr/share/jenkins/backend-variables.env . 
docker stop moneywise-backend-container
docker rm -v moneywise-backend-container
docker-compose -f docker-compose.yml -f docker-compose.override.prod.yml up -d