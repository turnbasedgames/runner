#! /usr/bin/env node
const assert = require('assert').strict;
const http = require('http');
const statik = require('node-static');
const appRoot = require('app-root-path');

const toolUIPort = process.env.TBG_TOOL_UI_PORT || 9091
const userFrontendPort = process.env.TBG_USER_FRONTEND_PORT || 9092
assert(toolUIPort !== userFrontendPort, "TBG_TOOL_UI_PORT and TBG_USER_FRONTEND_PORT should not be the same!");

const toolUIPath = __dirname + '/../build';
const userFrontendPath = appRoot.path + "/dist";

const toolUIStaticServer = new statik.Server(toolUIPath);
const userFrontendStaticServer = new statik.Server(userFrontendPath);

console.debug('Serving TBG Tool UI files from: ' + toolUIPath);
console.log("View TBG Tool UI on http://localhost:" + toolUIPort);
http.createServer(function (request, response) {
    request.addListener('end', function () {
        toolUIStaticServer.serve(request, response);
    }).resume();
}).listen(toolUIPort);

console.debug('Serving user frontend UI files from: ' + userFrontendPath);
console.debug("Serving user frontend UI on http://localhost:" + userFrontendPort);
http.createServer(function (request, response) {
    request.addListener('end', function () {
        userFrontendStaticServer.serve(request, response);
    }).resume();
}).listen(userFrontendPort);
