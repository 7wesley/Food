Create env configurations for server directory.

Docker:
Run client file by itself
docker build -t client
docker run --rm -p 10002:80 -v $PWD/client:/usr/local/apache2/htdocs/ client

Run server file by itself
docker build -t server
docker run --rm -p 10000:10000 server

Run both together:
docker-compose up

Run files:

Client:
Open index.html file in browser. Enable CORS from any
site to access from local file.
Note: Intelij has a built in web server always running
Rick click file -> Open in -> Browser

Server:
go build
./server
