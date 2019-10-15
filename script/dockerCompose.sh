#!/usr/bin/env bash

cd ..

docker build -t knrt10/static-contact-validation -f Dockerfile .

docker-compose up
