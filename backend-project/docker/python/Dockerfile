FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
