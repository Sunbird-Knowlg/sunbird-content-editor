/*
    Author : Harish Kumar Gangula <harishg@ilimi.in>
 
    This is used to create the basic plugin structure
 */
var fs = require("fs");
var unzip = require("unzip");
var path = require("path");
var pluginHelper = {
    create: function(name, cli) {
        var instance = this;
        var version = "1.0";
        var cwd = process.cwd();
        if (fs.existsSync(cwd + "/" + name + "-" + version)) {
            console.warn(name + ' Plugin with Version ' + version + ' already created.');
            process.exit(0);
        }
        fs.createReadStream(path.join(__dirname, '/../data/test.zip'))
            .pipe(unzip.Extract({ path: cwd })).on('close', function() {
                fs.renameSync(cwd + "/org.ekstep.hollowcircle-1.0", cwd + "/" + name + "-" + version);
                instance.createManifest(cwd, name, version, function(err, success) {
                    if (err) {
                        instance.showError(cli, name);
                    } else {
                        instance.createRenderer(cwd, name, version, function(err, success) {
                            if (err) {
                                instance.showError(cli, name);
                            } else {
                                instance.createHelp(cwd, name, version,
                                    function(err, success) {
                                        if (err) {
                                            instance.showError(cli, name);
                                        } else {
                                            console.log(name+" Plugin with version "+version+" created successfully.")
                                        }
                                    });
                            }
                        })
                    }
                })

            }).on('error', function(err) {
                instance.showError(cli, name);
            });

    },
    createManifest: function(cwd, name, version, callback) {
        var manifestFile = cwd + "/" + name + "-" + version + '/manifest.json';
        fs.readFile(manifestFile, "utf-8", function read(err, manifestJson) {
            if (err) {
                callback("Error while reading manifest \n", undefined);
            }
            manifestJson = JSON.parse(manifestJson);
            manifestJson.id = name;
            manifestJson.ver = version;
            manifestJson.title = name + " Plugin";
            fs.truncate(manifestFile, 0, function() {
                fs.writeFile(manifestFile, JSON.stringify(manifestJson, null, 4), function(err) {
                    if (err) {
                        callback("Unable to update manifest\n", undefined);
                    } else {
                        callback(undefined, true);
                    }
                });
            });
        });
    },
    createRenderer: function(cwd, name, version, callback) {
        var renderFile = cwd + "/" + name + "-" + version + '/renderer/plugin.js';
        fs.readFile(renderFile, "utf-8", function read(err, rendererJs) {
            if (err) {
                callback("Error while reading renderer \n", undefined);
            }
            rendererJs = rendererJs.replace("org.ekstep.hollowcircle", name);
            fs.truncate(renderFile, 0, function() {
                fs.writeFile(renderFile, rendererJs, function(err) {
                    if (err) {
                        callback("Unable to update renderer\n", undefined);
                    } else {
                        callback(undefined, true);
                    }
                });
            });
        });
    },
    createHelp: function(cwd, name, version, callback) {
        var helpFile = cwd + "/" + name + "-" + version + '/editor/help.md'; //***Hollow Circle***
        fs.readFile(helpFile, "utf-8", function read(err, help) {
            if (err) {
                callback("Error while reading help \n", undefined);
            }
            help = help.replace("***Hollow Circle***", "***" + name + "***");
            fs.truncate(helpFile, 0, function() {
                fs.writeFile(helpFile, help, function(err) {
                    if (err) {
                        callback("Error Updating help \n", undefined);
                    } else {
                        callback(undefined, true);
                    }
                });
            });
        });
    },
    showError: function (cli, name) {
        throw new cli.Error("Error While creating " + name + " Plugin \n");
        process.exit(0);
    }

};
module.exports = pluginHelper;
