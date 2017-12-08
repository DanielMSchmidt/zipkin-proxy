# Zipkin Proxy

Reroute all requests to the destination with zipkin tracing embedded

## Config

- `ZIPKIN_ENDPOINT`: your zipkin instance to trace to
- `ZIPKIN_SERVICE_NAME`: the name of the service (default "proxy")
- `ENDPOINT`: the endpoint to which the requests shall be routet

## Start

Get started using docker, by running `docker run -e ZIPKIN_ENDPOINT='http://localhost:9411' -e ENDPOINT='https://swapi.co' danielmschmidt/zipkin-proxy`
