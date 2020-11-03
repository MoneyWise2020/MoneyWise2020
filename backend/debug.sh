#!/bin/bash

echo "Waiting for debugger attachment..."
docker run --name moneywise-backend-container-debug  --rm -it -p 8000:8000 -p 3000:3000 moneywise-backend