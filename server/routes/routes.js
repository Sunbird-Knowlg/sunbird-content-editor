/**
 * Defines all Rest Routes. This is a framework component that can be used to
 * configure deployable services at runtime from their orchestrator. This can
 * also provide authentication, interceptor capabilities.
 *
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
var ecmlBuilder = require('../helpers/ecmlBuilder');
var request = require('request');
var fs = require('fs');


module.exports = function(app, dirname) {
	
	/** Content List Routes */
	app.get('/app/image/get/:url', function(req, res) {
		request.get(req.params.url).pipe(res);
	});

	app.post('/app/ecml', function(req, res) {
		ecmlBuilder.buildECML(req, res);
	});

	app.post('/app/telemetry', function(req, res) {
		fs.appendFile('telemetry.json', req.body.event + "\n");
		res.end();
	});
};

