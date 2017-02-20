#!/usr/bin/env node

"use strict";
var pluginHelper= require(__dirname+'/helper/create_plugin_helper.js');
var Cli = new require("n-cli");
var cli = new Cli({
  silent: false,
  handleUncaughtException : true,
});

cli.on("serve", function(){
    var fs = require('fs');
    var express = require('express');
    var https = require('https');
    var path = require('path');
    var cors = require('cors')
    var key = fs.readFileSync(path.join(__dirname,'/ssl/key.pem'));
    var cert = fs.readFileSync(path.join(__dirname,'/ssl/cert.pem'));
    var https_options = {
        key: key,
        cert: cert
    };
    var PORT = this.argv._[1] || 8081
    var HOST = 'localhost';
    var app = express();
    app.use(cors());
    app.use(express.static(process.cwd()));
    
    app.get('/list', function (req, res) {
      var dirs = fs.readdirSync(process.cwd()).filter(file => fs.statSync(path.join(process.cwd(), file)).isDirectory());
      for(key in dirs){
        if (!fs.existsSync(path.join(process.cwd(),dirs[key],"manifest.json"))) {
            dirs.splice(key,1);
        }
      }
      res.setHeader('Content-Type', 'application/json');
      return res.send(JSON.stringify(dirs));
    });
    var server = https.createServer(https_options, app).listen(PORT, HOST);
    console.log('HTTPS Server listening on %s:%s', HOST, PORT);
});

cli.on("create", function(){
    if (this.argv._[1] === undefined) {
        throw new cli.Error("please provide plugin name \n")
        process.exit(0);
    }
    pluginHelper.create(this.argv._[1],cli);
});