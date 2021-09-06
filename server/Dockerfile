#backend

#Container setup from image
FROM golang:1.16

LABEL maintainer="unique <wesley>"

WORKDIR /go/src/app

COPY ./go.mod .

RUN go mod download

COPY . . 

RUN go build

#Commands run when container is run
CMD ["./Food"]