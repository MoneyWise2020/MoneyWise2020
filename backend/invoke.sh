#!/bin/bash

stage=${1:-dev}

url=""
case $stage in
dev)
    url="https://kszg39jvii.execute-api.us-east-1.amazonaws.com/dev/project-transactions"
    ;;
prod)
    url="https://o2mfovbkvd.execute-api.us-east-1.amazonaws.com/prod/project-transactions"
    ;;
esac

start="2020-04-19"
end="2021-04-19"
current="8324"
set_aside="5000"
biweekly_start="2020-04-16"

curl \
    -v \
    -X POST "${url}?start=${start}&end=${end}&current=${current}&set_aside=${set_aside}&biweekly_start=${biweekly_start}" \
    --data @./rules.json
