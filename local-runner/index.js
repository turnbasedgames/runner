#! /usr/bin/env node

const http = require('http');
const path = require('path')
var express = require('express');

var app = express();

const port = process.env.PORT || 3000;

fs = require('fs');
var p = path.join(__dirname, "../frontend/dist/", "index.html")

console.log(p)

exports.filePath = p;

fs.readFile("./index.html", function (err, html) {
    if (err) {
        console.log(err); 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});