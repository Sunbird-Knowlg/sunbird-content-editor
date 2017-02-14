/*
    This is used to create the basic plugin structure
 */
var fs = require("fs");
var unzip = require("unzip");
var path = require("path");
var pluginHelper = {
    create: function(name, version,cli) {
        var cwd = process.cwd();
        fs.createReadStream(path.join(__dirname, '/../data/test.zip'))
            .pipe(unzip.Extract({ path: cwd })).on('close', function() {
                fs.renameSync(cwd + "/org.ekstep.hollowcircle-1.0", cwd + "/" + name + "-" + version);
                //Modify manifest
                var manifestFile = cwd + "/" + name + "-" + version + '/manifest.json';
                fs.readFile(manifestFile, "utf-8", function read(err, manifestJson) {
                    if (err) {
                        throw new cli.Error("Unable to read manifest \n");
                    }
                    manifestJson = JSON.parse(manifestJson);
                    manifestJson.id = name;
                    manifestJson.ver = version;
                    manifestJson.title = name + " Plugin";
                    manifestJson.editor.menu[0].id = name;
                    manifestJson.editor.menu[0].title = name;
                    manifestJson.editor.menu[0].toolTip = "Add " + name;
                    manifestJson.editor.menu[0].onclick.id = name + ":create";
                    fs.truncate(manifestFile, 0, function() {
                        fs.writeFile(manifestFile, JSON.stringify(manifestJson, null, 4), function(err) {
                            if (err) {
                                throw new cli.Error("Unable to update manifest \n");
                            }
                        });
                    });
                });

                var renderFile = cwd + "/" + name + "-" + version + '/renderer/plugin.js';
                fs.readFile(renderFile, "utf-8", function read(err, rendererJs) {
                    if (err) {
                        throw err;
                    }
                    rendererJs = rendererJs.replace("org.ekstep.hollowcircle", name);
                    fs.truncate(renderFile, 0, function() {
                        fs.writeFile(renderFile, rendererJs, function(err) {
                            if (err) {
                                throw new cli.Error("Unable to update renderer \n");
                            }
                        });
                    });
                });
                var helpFile = cwd + "/" + name + "-" + version + '/editor/help.md'; //***Hollow Circle***
                fs.readFile(helpFile, "utf-8", function read(err, help) {
                    if (err) {
                        throw err;
                    }
                    help = help.replace("***Hollow Circle***", "***" + name + "***");
                    fs.truncate(helpFile, 0, function() {
                        fs.writeFile(helpFile, help, function(err) {
                            if (err) {
                                throw new cli.Error("Error Updating help \n" );
                            }
                        });
                    });
                });

            }).on('error', function(err) {
                throw new cli.Error("Error While creating "+name+" Plugin \n" );
            });

    }
};

module.exports = pluginHelper;
