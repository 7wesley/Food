# Food REST API

> A REST API built with go and frontend using javascript.

## Get started

``` bash
# Run frontend
###
Open index.html in browser, allows CORS from all origins if making file requests
Note: Intelij has a built in web server always running
Right click file -> Open in -> Browser
###

# Run backend
go build
./server

# Docker containers
# ---------------------

# Run all containers
docker-compose up

# Run docker client container
docker build -t client
docker run --rm -p 10002:80 -v $PWD/client:/usr/local/apache2/htdocs/ client

# Run docker server container
docker build -t server
docker run --rm -p 10000:10000 server

# Run swagger container
docker run -p 80:8080 -e SWAGGER_JSON=/swagger.yml -v $PWD/swagger.yml:/swagger.yml swaggerapi/swagger-ui
```

### Author

Wesley Miller