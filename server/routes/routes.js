/**
 * Defines all Rest Routes. This is a framework component that can be used to
 * configure deployable services at runtime from their orchestrator. This can
 * also provide authentication, interceptor capabilities.
 *
 * @author Santhosh Vasabhaktula
 */
var ecmlBuilder = require('../helpers/ecmlBuilder');
var request = require('request');

module.exports = function(app, dirname) {
	
	/** Content List Routes */
	app.get('/app/image/get/:url', function(req, res) {
		request.get(req.params.url).pipe(res);
	});

	app.post('/app/ecml', function(req, res) {
		ecmlBuilder.buildECML(req, res);
	})
};

