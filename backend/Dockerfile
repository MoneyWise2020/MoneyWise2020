FROM python:3.7.5-slim-buster

# Core dependencies
ADD ./requirements.txt /requirements.txt
RUN pip3 install -r ./requirements.txt

COPY . /app
WORKDIR /app/proj

CMD "python3" "manage.py" "runserver" "0.0.0.0:8000"
