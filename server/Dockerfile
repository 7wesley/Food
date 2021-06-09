FROM golang:1.16

LABEL maintainer="unique <wesley>"

WORKDIR /go/src/app

COPY . .

ENV PORT :10000

RUN go build main.go

CMD ["./main"]