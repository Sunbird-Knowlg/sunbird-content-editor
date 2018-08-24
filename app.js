var express = require('express')

var http = require('http')

var path = require('path')

var fs = require('fs')

var urlHelper = require('url')

var bodyParser = require('body-parser')

var proxy = require('express-http-proxy')

http.globalAgent.maxSockets = 100000

var app = express()

// all environments
app.set('port', 3000)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static(path.join(__dirname, '.')))

app.use('/assets/public', proxy('dev.ekstep.in', {
	https: true,
	proxyReqPathResolver: function (req) {
		return '/assets/public' + urlHelper.parse(req.url).path
	}
}))
// eslint-disable-next-line
var routes = __dirname + '/server/routes'; var route_files = fs.readdirSync(routes)
route_files.forEach(function (file) {
	require(routes + '/' + file)(app, __dirname)
})

var server = http.createServer(app).listen(app.get('port'), 1500)
server.timeout = 0
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
