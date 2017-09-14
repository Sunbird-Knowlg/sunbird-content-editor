var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    urlHelper = require('url'),
    bodyParser = require('body-parser'),
    proxy = require('express-http-proxy');

http.globalAgent.maxSockets = 100000;

var app = express();

// all environments
app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static(path.join(__dirname, '.')));

app.use('/assets/public', proxy('dev.ekstep.in', {
    https: true,
	proxyReqPathResolver: function(req) {
    	return "/assets/public" + urlHelper.parse(req.url).path;
  	}
}));

var routes = __dirname + '/server/routes', route_files = fs.readdirSync(routes);
route_files.forEach(function (file) {
    require(routes + '/' + file)(app, __dirname);
});

var server = http.createServer(app).listen(app.get('port'), 1500);
server.timeout = 0;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';