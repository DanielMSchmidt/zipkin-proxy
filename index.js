const express = require('express');
const proxy = require('http-proxy-middleware');
const {Tracer, ExplicitContext, BatchRecorder} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

const localServiceName = process.env.ZIPKIN_SERVICE_NAME || 'proxy';
const ctxImpl = new ExplicitContext();
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: process.env.ZIPKIN_ENDPOINT + '/api/v1/spans',
  })
});

const app = express();

if (!process.env.ZIPKIN_ENDPOINT) {
    throw new Error('ZIPKIN_ENDPOINT environment variable needs to be set');
}

if (!process.env.ENDPOINT) {
    throw new Error('ENDPOINT environment variable needs to be set');
}

const tracer = new Tracer({ctxImpl, recorder, localServiceName});
app.use(zipkinMiddleware({tracer}));
app.use('/', proxy({target: process.env.ENDPOINT, changeOrigin: true}));

app.listen(80, () => console.log('Starting server on port 80'));
