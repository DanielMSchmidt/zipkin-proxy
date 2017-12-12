const express = require('express');
const proxy = require('http-proxy-middleware');
const {Tracer, ExplicitContext, BatchRecorder} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const fetch = require('node-fetch');

const localServiceName = process.env.ZIPKIN_SERVICE_NAME || 'proxy';
const port = process.env.PORT || 80;

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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-B3-SpanId, X-B3-ParentSpanId, X-B3-Sampled, X-B3-TraceId");
  
  if (req.method === 'OPTIONS') {
    res.status(200);
    res.end();
  } else {
    fetch(process.env.ENDPOINT + '/' + req.originalUrl, {
      method: req.method,
    }).then(response => {
      response.text().then(body => {
        res.status(response.status);
        res.send(body);
  
        res.end();
      }, err => {
        console.error("Error occured", err)
      })
    }, error => {
      console.error('ERR', error);
      // res.send(error);
      res.status(200);
      res.end();
    })
  }
});

app.listen(port, () => console.log(`Starting server on port ${port}`));
