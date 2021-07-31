#! /usr/bin/env node

const http = require('http');
const path = require('path')
const appRoot = require('app-root-path');
var express = require('express');

var app = express();

const port = process.env.PORT || 3000;

fs = require('fs');
var p = path.join(appRoot.path, "/dist/", "index.html")

console.log(`serving on PORT ${port}: ${p}`)

fs.readFile(p, function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(port);
});