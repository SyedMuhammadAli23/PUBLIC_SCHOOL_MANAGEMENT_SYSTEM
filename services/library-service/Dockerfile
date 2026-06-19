FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o main cmd/server/main.go


FROM alpine:3.19
RUN apk --no-cache add ca-certificates && \
    adduser -D -g '' appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appuser /app/main .
USER appuser
EXPOSE 8083
CMD ["./main"]






































