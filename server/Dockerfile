#backend
FROM golang:1.16

LABEL maintainer="unique <wesley>"

WORKDIR /go/src/app

COPY . .

RUN go build
CMD ["./server"]