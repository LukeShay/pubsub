#!/bin/bash

i=0

while [[ ${i} -le 100 ]]; do
    curl --data "{\"message\": \"Hello, World ${i}!\" }" \
        -X POST http://localhost:3000/message \
        -H 'Content-type: application/json'
done
