var express = require('express'),
    http = require('http'),
    path = require('path');
http.globalAgent.maxSockets = 100000;

var app = express();

// all environments
app.set('port', 3000);

app.use(express.static(path.join(__dirname, '.')));

var server = http.createServer(app).listen(app.get('port'), 1500);
server.timeout = 0;
