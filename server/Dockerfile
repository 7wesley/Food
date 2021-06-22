FROM golang:1.16

LABEL maintainer="unique <wesley>"

WORKDIR /go/src/app

COPY go.mod .
COPY go.sum .

#RUN go mod download
COPY . .

RUN go build
CMD ["./server"]