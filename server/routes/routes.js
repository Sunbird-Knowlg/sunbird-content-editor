/**
 * Defines all Rest Routes. This is a framework component that can be used to
 * configure deployable services at runtime from their orchestrator. This can
 * also provide authentication, interceptor capabilities.
 *
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
var ecmlBuilder = require('../helpers/ecmlBuilder');
var http = require('http');
var https = require('https');
var fs = require('fs');


module.exports = function(app, dirname) {

	/** Content List Routes */
	app.get('/app/image/get/:url', function(req, res) {
		var url = req.params.url;
		var client = url.startsWith('https') ? https : http;
		client.get(url, function(proxyRes) {
			proxyRes.pipe(res);
		}).on('error', function() {
			res.status(500).end();
		});
	});

	app.post('/app/ecml', function(req, res) {
		ecmlBuilder.buildECML(req, res);
	});

	app.post('/app/telemetry', function(req, res) {
		fs.appendFile('telemetry.json', req.body.event + "\n");
		res.end();
	});
};

