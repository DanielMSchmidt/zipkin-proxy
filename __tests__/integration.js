const { spawn } = require('child_process');
const fetch = require('node-fetch');
const express = require('express');
const { sleep } = require('sleep');

const proxyEndpoint = 'http://localhost:8080';
describe("Proxy Integration test", () => {
  beforeEach(function () {
    const app = express();
    const self = this;

    // Endpoint
    self.endpointCalls = [];
    app.get('/user', (req, res) => {
      self.endpointCalls.push(req);
      res.status(202).json({
        traceId: req.header('X-B3-TraceId') || '?',
        spanId: req.header('X-B3-SpanId') || '?'
      });
    });
    this.endpointServer = app.listen(8001);

    // Zipkin
    self.zipkinCalls = [];
    app.post('/api/v1/spans', (req, res) => {
      self.zipkinCalls.push(req);
      res.status(202).json({
        traceId: req.header('X-B3-TraceId') || '?',
        spanId: req.header('X-B3-SpanId') || '?'
      });
    });
    this.zipkinServer = app.listen(8002);

    // Proxy
    this.proxyServer = spawn(process.argv[0], ['index.js'], {
      env: {
        'ZIPKIN_ENDPOINT': 'http://127.0.0.1:8001',
        'ENDPOINT': 'http://127.0.0.1:8002',
        'PORT': 8080
      }
    });
    this.proxyServer.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    this.proxyServer.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    this.proxyServer.on('error', (err) => {
      console.log('Failed to start subprocess.');
    });

    this.proxyServer.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
    });

    sleep(2);
  });

  afterEach(function (done) {
    // this.endpointServer.close(done);
    // this.zipkinServer.close(done);
    // this.proxyServer.kill('SIGTERM');
  });

  it("connects to endpoint", () => {

    expect.assertions(1);
    return fetch('http://localhost:8001/user').then(res => expect(res.status).toBe(202));
  });

  it("sends a request to the destination given");
  it("extends the send request with span information");
  it("sends a request to the zipkin server");
});