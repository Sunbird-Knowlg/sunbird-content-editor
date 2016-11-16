/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
var builder = require('xmlbuilder');
var _ = require('lodash');

exports.buildECML = function(req, res) {
	var data = req.body.data;
	var xml = builder.create('theme');
	start(data.theme, xml);
	res.send(xml.end({ pretty: true}));
}

function start(data, xml) {
	var props = _.omitBy(data, _.isObject);
	_.forIn(props, function(value, key) {
		addProperty(key, value, xml);
	});

	var objects = _.pickBy(data, _.isObject);
	_.forIn(objects, function(value, key) {
		addObject(key, value, xml);
	});
}

function addProperty(key, value, xml) {
	switch(key) {
	case "__text":
		xml = xml.txt(value);
		break;
	case "__cdata":
		xml = xml.dat(value);
		break;
	default:
		if(value === 0) {
			xml = xml.att(key, "0");
		} else {
			xml = xml.att(key, (value || '').toString());
		}
	}
}

function addObject(key, value, xml) {
	if(_.isArray(value)) {
		_.each(value, function(value) {
			buildXML(key, value, xml);
		});
	} else {
		buildXML(key, value, xml);
	}
}

function buildXML(name, data, xml) {
	xml = xml.ele(name);
	var props = _.omitBy(data, _.isObject);
	_.forIn(props, function(value, key) {
		addProperty(key, value, xml);
	});
	var objects = _.pickBy(data, _.isObject);
	_.forIn(objects, function(value, key) {
		if(key === '__cdata') {
			addProperty(key, JSON.stringify(value), xml);
		} else {
			addObject(key, value, xml);
		}
	});
	xml = xml.up()
}