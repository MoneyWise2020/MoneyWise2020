FROM python:3.7.5-slim-buster

# Dependencies needed for script entrance
ADD ./script/requirements.txt /script-requirements.txt
RUN pip3 install -r ./script-requirements.txt

# Core dependencies
ADD ./requirements.txt /requirements.txt
RUN pip3 install -r ./requirements.txt

# Ready workspace
RUN mkdir -p /workspace
WORKDIR /workspace
