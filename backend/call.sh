#!/bin/bash

docker run -it --rm \
    --mount "type=bind,src=${PWD},dst=/workspace" \
    --mount "type=bind,src=${HOME}/.cashflow-data,dst=/cashflow-data" \
    --workdir /workspace \
    cashflow-projection /bin/bash -c "python handler.py"
