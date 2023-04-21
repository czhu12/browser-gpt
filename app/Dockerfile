FROM python:3.8-slim

RUN apt-get update && apt-get install git build-essential python-dev python3-dev libreadline-dev libffi-dev default-libmysqlclient-dev -y

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_ENV=production
EXPOSE 5000

CMD ["flask", "run", "-p", "3001", "--host=0.0.0.0"]
