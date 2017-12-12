# Zipkin Proxy [![](https://images.microbadger.com/badges/image/danielmschmidt/zipkin-proxy.svg)](https://microbadger.com/images/danielmschmidt/zipkin-proxy "Get your own image badge on microbadger.com")

Reroute all requests to the destination with zipkin tracing embedded

## Config

- `ZIPKIN_ENDPOINT`: your zipkin instance to trace to
- `ZIPKIN_SERVICE_NAME`: the name of the service (default "proxy")
- `ENDPOINT`: the endpoint to which the requests shall be routet
- `PORT`: port the server should be started on

## Start

Get started using docker, by running `docker run -e ZIPKIN_ENDPOINT='http://localhost:9411' -e ENDPOINT='https://swapi.co' danielmschmidt/zipkin-proxy`
