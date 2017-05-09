describe('framework plugin manager unit test cases', function() {
    var pm = org.ekstep.pluginframework.pluginManager;
    var em = org.ekstep.pluginframework.eventManager;
    var rm = org.ekstep.pluginframework.resourceManager;
    var publishedRepo = org.ekstep.pluginframework.publishedRepo;

    beforeEach(function() {
        pm.cleanUp();
    });

    it('registerPlugin method: should call _register method', function() {
        spyOn(pm, "_registerPlugin");
        var testManifest = { id: "org.ekstep.one", "ver": "1.0" };
        pm.registerPlugin(testManifest, {}, publishedRepo);
        expect(pm._registerPlugin).toHaveBeenCalledWith(testManifest.id, testManifest.ver, jasmine.any(Object), testManifest, publishedRepo);
    });

    it('_registerPlugin method: should register and dispatch plugin load event', function(done) {
        var pluginManifest;
        var testPlugin = { id: "org.ekstep.one", ver: "1.0" };

        spyOn(pm, "_registerNameSpace");
        spyOn(em, "dispatchEvent");

        rm.discoverManifest(testPlugin.id, testPlugin.ver, function(err, data) {
            pluginManifest = data.manifest;
            rm.getResource(pluginManifest.id, pluginManifest.ver, pluginManifest[org.ekstep.pluginframework.env].main, 'text', publishedRepo, function(err, data) {
                var plugin = eval(data);
                pm._registerPlugin(testPlugin.id, testPlugin.ver, plugin, pluginManifest, publishedRepo);

                expect(pm.plugins[testPlugin.id]).toEqual({ p: plugin, m: pluginManifest, repo: publishedRepo });
                expect(pm._registerNameSpace).toHaveBeenCalled();
                expect(pm.pluginManifests[testPlugin.id]).toEqual(pluginManifest);
                expect(pm.pluginObjs[testPlugin.id]).toBeDefined();
                expect(em.dispatchEvent).toHaveBeenCalledWith("plugin:load", { plugin: testPlugin.id, version: testPlugin.ver });
                expect(em.dispatchEvent).toHaveBeenCalledWith(testPlugin.id + ":load");
                done();
            });
        });
    });

    describe('loadCustomPlugin method', function() {
        afterAll(function() {
            pm.cleanUp();
        });

        it('should load and register custom plugin', function(done) {
            spyOn(pm, "_registerPlugin");
            spyOn(rm, "loadResource").and.callThrough();

            var dependency = {
                id: "org.ekstep.two",
                ver: "1.0",
                src: "base/test_framework/data/content-plugins/org.ekstep.two-1.0/renderer/two.js"
            };

            pm.loadCustomPlugin(dependency, function() {
                expect(pm._registerPlugin).toHaveBeenCalled();
                expect(rm.loadResource).toHaveBeenCalled();
                done();
            }, undefined);
        });

        it('should not load custom plugin for invalid path', function(done) {
            spyOn(pm, "_registerPlugin");
            spyOn(rm, "loadResource").and.callThrough();

            var dependency = {
                id: "org.ekstep.two",
                ver: "1.0",
                src: "base/test_framework/data/content-plugins/org.ekstep.two-1.0/renderer/plugin_123.js" //invalid path
            };

            pm.loadCustomPlugin(dependency, function() {
                expect(pm._registerPlugin).not.toHaveBeenCalled();
                expect(rm.loadResource).toHaveBeenCalled();
                done();
            }, undefined);
        });

        it('should not load custom plugin, if plugin has compilation error', function(done) {
            spyOn(pm, "_registerPlugin");
            spyOn(rm, "loadResource").and.callThrough();

            var dependency = {
                id: "org.ekstep.two-invalid",
                ver: "1.0",
                src: "base/test_framework/data/content-plugins/org.ekstep.two-invalid-1.0/renderer/two.js"
            };

            pm.loadCustomPlugin(dependency, function() {
                expect(pm._registerPlugin).not.toHaveBeenCalled();
                expect(rm.loadResource).toHaveBeenCalled();
                done();
            }, undefined);
        });

        it('should not load custom plugin, if plugin is already loaded and registered', function(done) {
            pm.plugins["org.ekstep.two"] = true; //plugin registered!

            spyOn(pm, "_registerPlugin");
            spyOn(rm, "loadResource").and.callThrough();

            var dependency = {
                id: "org.ekstep.two",
                ver: "1.0",
                src: "base/test_framework/data/content-plugins/org.ekstep.two-1.0/renderer/two.js"
            };

            pm.loadCustomPlugin(dependency, function() {
                expect(pm._registerPlugin).not.toHaveBeenCalled();
                expect(rm.loadResource).toHaveBeenCalled();
                done();
            }, undefined);
        });

    });

    describe("loadPluginByManifest method", function() {
        afterAll(function() {
            pm.cleanUp();
        });

        it('should load and register plugin by manifest', function(done) {
            var pluginManifest;
            var testPlugin = { id: "org.ekstep.one", ver: "1.0" };

            spyOn(pm, "registerPlugin");
            spyOn(rm, "getResource").and.callThrough();

            rm.discoverManifest(testPlugin.id, testPlugin.ver, function(err, data) {
                pluginManifest = data.manifest;
                pm.loadPluginByManifest(pluginManifest, publishedRepo, "plugin", undefined);
                expect(pm.registerPlugin).toHaveBeenCalled();
                expect(rm.getResource).toHaveBeenCalled();
                done();
            });
        });

        it('should not load plugin, if plugin has compilation error', function(done) {
            var pluginManifest;
            var testPlugin = { id: "org.ekstep.two-invalid", ver: "1.0" };

            spyOn(pm, "registerPlugin");
            spyOn(rm, "getResource").and.callThrough();

            rm.discoverManifest(testPlugin.id, testPlugin.ver, function(err, data) {
                pluginManifest = data.manifest;
                pm.loadPluginByManifest(pluginManifest, publishedRepo, "plugin", undefined);
                expect(pm.registerPlugin).not.toHaveBeenCalled();
                expect(rm.getResource).toHaveBeenCalled();
                done();
            });
        });

        it('should not load plugin, if plugin is already loaded and registered', function(done) {
            var pluginManifest;
            var testPlugin = { id: "org.ekstep.two", ver: "1.0" };
            pm.plugins["org.ekstep.two"] = true; //plugin registered!

            spyOn(pm, "registerPlugin");
            spyOn(rm, "getResource").and.callThrough();

            rm.discoverManifest(testPlugin.id, testPlugin.ver, function(err, data) {
                pluginManifest = data.manifest;
                pm.loadPluginByManifest(pluginManifest, publishedRepo, "plugin", undefined);
                expect(pm.registerPlugin).not.toHaveBeenCalled();
                expect(rm.getResource).toHaveBeenCalled();
                done();
            });
        });

        it('should load plugin type "library"', function(done) {
            var pluginManifest;
            var testPlugin = { id: "org.ekstep.two", ver: "1.0" };
            pm.plugins["org.ekstep.two"] = true; //plugin registered!

            spyOn(pm, "registerPlugin");
            spyOn(rm, "getResource").and.callThrough();

            rm.discoverManifest(testPlugin.id, testPlugin.ver, function(err, data) {
                pluginManifest = data.manifest;
                pm.loadPluginByManifest(pluginManifest, publishedRepo, "library", undefined);
                expect(pm.registerPlugin).not.toHaveBeenCalled();
                expect(rm.getResource).toHaveBeenCalled();
                done();
            });
        });
    });

    describe("_registerNameSpace method", function() {
        afterAll(function() {
            pm.cleanUp();
        });

        var clazz = Class.extend({
            id: "org.ekstep.external_plugin.audio_editor",
            init: function() {}
        });

        it("should register plugin namespace", function() {
            pm._registerNameSpace("org.ekstep.external_plugin.audio_editor", clazz);
            expect(window.org.ekstep.external_plugin.audio_editor).toBeDefined();
        });

        it("should be extendable by other plugins", function() {
            var extendedPlugin = clazz.extend({
                init: function() {}
            });
            extendedPlugin = new extendedPlugin;

            pm._registerNameSpace("com.editor.plugin", extendedPlugin);
            expect(window.com.editor.plugin).toBeDefined();
            expect(extendedPlugin.id).toBe("org.ekstep.external_plugin.audio_editor");
        });

        it("should register namespace to window object, when namespace not defined", function() {
            pm._registerNameSpace("someBadPlugin", clazz);
            expect(window.someBadPlugin).toBeDefined();
        });
    });

    describe("loadAndInitPlugin method", function() {
        afterAll(function() {
            pm.cleanUp();
        });

        it("should instantiate the plugin instance, if plugin is loaded", function() {
            spyOn(pm, "loadPluginWithDependencies");
            spyOn(pm, "invoke");
            spyOn(pm, "getPluginManifest").and.returnValue({ type: "widget", "editor": "", "renderer": "" });
            spyOn(pm, "isPluginDefined").and.returnValue(true);

            expect(pm.loadAndInitPlugin("org.ekstep.two", "1.0", undefined, {})).toBe(0);
            expect(pm.loadPluginWithDependencies).toHaveBeenCalled();
            expect(pm.invoke).toHaveBeenCalled();
        });

        it("should not instantiate when plugin is not loaded", function() {
            spyOn(pm, "loadPluginWithDependencies");
            spyOn(pm, "invoke");
            spyOn(pm, "getPluginManifest").and.returnValue({ type: "widget", "editor": "", "renderer": "" });
            spyOn(pm, "isPluginDefined").and.returnValue(false);

            expect(pm.loadAndInitPlugin("org.ekstep.two", "1.0", undefined, {})).toBe(1);
            expect(pm.loadPluginWithDependencies).toHaveBeenCalled();
            expect(pm.invoke).not.toHaveBeenCalled();
        });

        it("should only load plugin with type 'widget'", function() {
            spyOn(pm, "loadPluginWithDependencies");
            spyOn(pm, "invoke");
            spyOn(pm, "getPluginManifest").and.returnValue({ type: "plugin", "editor": "", "renderer": "" }); // type: plugin
            spyOn(pm, "isPluginDefined").and.returnValue(true);

            expect(pm.loadAndInitPlugin("org.ekstep.two", "1.0", undefined, {})).toBe(0);
            expect(pm.loadPluginWithDependencies).toHaveBeenCalled();
            expect(pm.invoke).not.toHaveBeenCalled();
        });
    });

    describe("loadPluginWithDependencies method", function() {
        afterEach(function() {
            pm.cleanUp();
        });

        it("should discover the plugin manifest and load the plugin", function(done) {
            spyOn(rm, "discoverManifest").and.callThrough();
            spyOn(pm, "loadManifestDependencies").and.callThrough();
            spyOn(pm, "loadPluginByManifest").and.callThrough();

            pm.loadPluginWithDependencies("org.ekstep.six", "1.0", "plugin", undefined, [], function() {
                expect(rm.discoverManifest).toHaveBeenCalled();
                expect(rm.discoverManifest.calls.count()).toEqual(1);
                expect(pm.loadManifestDependencies.calls.count()).toEqual(1);
                expect(pm.loadManifestDependencies).toHaveBeenCalled();
                expect(pm.loadPluginByManifest).toHaveBeenCalled();
                expect(pm.loadPluginByManifest.calls.count()).toEqual(1);
                expect(pm.isPluginDefined("org.ekstep.six")).toBe(true);
                done();
            });
        });

        it("should load plugin manifest dependencies", function(done) {
            spyOn(rm, "discoverManifest").and.callThrough();
            spyOn(pm, "loadManifestDependencies").and.callThrough();
            spyOn(pm, "loadPluginByManifest").and.callThrough();
            spyOn(pm, "queueDependencies").and.callThrough();

            pm.loadPluginWithDependencies("org.ekstep.five", "1.0", "plugin", undefined, [], function() {
                expect(rm.discoverManifest).toHaveBeenCalled();
                expect(rm.discoverManifest.calls.count()).toEqual(3);
                expect(pm.loadManifestDependencies.calls.count()).toEqual(3);
                expect(pm.loadManifestDependencies).toHaveBeenCalled();
                expect(pm.loadPluginByManifest).toHaveBeenCalled();
                expect(pm.loadPluginByManifest.calls.count()).toEqual(3);
                expect(pm.queueDependencies).toHaveBeenCalled();
                expect(pm.queueDependencies.calls.count()).toEqual(3);
                expect(pm.isPluginDefined("org.ekstep.five")).toBe(true);
                expect(pm.isPluginDefined("org.ekstep.seven")).toBe(true);
                done();
            });
        });

        it("should load other dependencies like js, css", function(done) {
            spyOn(rm, "discoverManifest").and.callThrough();
            spyOn(pm, "loadManifestDependencies").and.callThrough();
            spyOn(pm, "loadPluginByManifest").and.callThrough();
            spyOn(pm, "queueDependencies").and.callThrough();

            pm.loadPluginWithDependencies("org.ekstep.seven", "1.0", "plugin", undefined, [], function() {
                expect(rm.discoverManifest).toHaveBeenCalled();
                expect(rm.discoverManifest.calls.count()).toEqual(1);
                expect(pm.loadManifestDependencies.calls.count()).toEqual(1);
                expect(pm.loadManifestDependencies).toHaveBeenCalled();
                expect(pm.loadPluginByManifest).toHaveBeenCalled();
                expect(pm.loadPluginByManifest.calls.count()).toEqual(1);
                expect(pm.queueDependencies).toHaveBeenCalled();
                expect(pm.queueDependencies.calls.count()).toEqual(1);
                expect(pm.isPluginDefined("org.ekstep.seven")).toBe(true);
                done();
            });
        });

        it("should call the callback when plugin is already loaded", function(done) {
            pm.plugins["org.ekstep.seven"] = true // plugin loaded;

            spyOn(rm, "discoverManifest").and.callThrough();
            spyOn(pm, "loadManifestDependencies").and.callThrough();
            spyOn(pm, "loadPluginByManifest").and.callThrough();
            spyOn(pm, "queueDependencies").and.callThrough();

            pm.loadPluginWithDependencies("org.ekstep.seven", "1.0", "plugin", undefined, [], function() {
                expect(rm.discoverManifest).not.toHaveBeenCalled();
                expect(rm.discoverManifest.calls.count()).toEqual(0);
                expect(pm.loadManifestDependencies.calls.count()).toEqual(0);
                expect(pm.loadManifestDependencies).not.toHaveBeenCalled();
                expect(pm.loadPluginByManifest).not.toHaveBeenCalled();
                expect(pm.loadPluginByManifest.calls.count()).toEqual(0);
                expect(pm.queueDependencies).not.toHaveBeenCalled();
                expect(pm.queueDependencies.calls.count()).toEqual(0);
                done();
            });

        });

        it("should break the recurrsive loop and call callback when the same plugin is trying to load itself (cyclic dependency)", function(done) {
            // plugin org.ekstep.one depends --> org.ekstep.two
            // plugin org.ekstep.two depends --> org.ekstep.one 
            // cyclic dependency

            spyOn(rm, "discoverManifest").and.callThrough();
            spyOn(pm, "loadManifestDependencies").and.callThrough();
            spyOn(pm, "loadPluginByManifest").and.callThrough();

            pm.loadPluginWithDependencies("org.ekstep.one", "1.0", "plugin", undefined, [], function() {
                expect(rm.discoverManifest).toHaveBeenCalled();
                expect(rm.discoverManifest.calls.count()).toEqual(2);
                expect(pm.loadManifestDependencies.calls.count()).toEqual(2);
                expect(pm.loadManifestDependencies).toHaveBeenCalled();
                expect(pm.loadPluginByManifest).toHaveBeenCalled();
                expect(pm.loadPluginByManifest.calls.count()).toEqual(2);
                expect(pm.isPluginDefined("org.ekstep.one")).toBe(true);
                expect(pm.isPluginDefined("org.ekstep.two")).toBe(true);
                done();
            });
        });

        it("should call the callback when plugin has no other dependencies like js, css", function(done) {
            spyOn(rm, "discoverManifest").and.callThrough();
            spyOn(pm, "loadManifestDependencies").and.callThrough();
            spyOn(pm, "loadPluginByManifest").and.callThrough();
            spyOn(pm, "queueDependencies").and.callThrough();

            pm.loadPluginWithDependencies("org.ekstep.six", "1.0", "plugin", undefined, [], function() {
                expect(rm.discoverManifest).toHaveBeenCalled();
                expect(rm.discoverManifest.calls.count()).toEqual(1);
                expect(pm.loadManifestDependencies.calls.count()).toEqual(1);
                expect(pm.loadManifestDependencies).toHaveBeenCalled();
                expect(pm.loadPluginByManifest).toHaveBeenCalled();
                expect(pm.loadPluginByManifest.calls.count()).toEqual(1);
                expect(pm.queueDependencies).toHaveBeenCalled();
                expect(pm.queueDependencies.calls.count()).toEqual(1);
                expect(pm.isPluginDefined("org.ekstep.six")).toBe(true);
                done();
            });
        });

        it("should call the callback when plugin is not discoverable in any repo", function(done) {
            spyOn(rm, "discoverManifest").and.callThrough();
            spyOn(pm, "loadManifestDependencies").and.callThrough();
            spyOn(pm, "loadPluginByManifest").and.callThrough();

            pm.loadPluginWithDependencies("org.ekstep.invalidPlugin", "1.0", "plugin", undefined, [], function() {
                expect(rm.discoverManifest).toHaveBeenCalled();
                expect(rm.discoverManifest.calls.count()).toEqual(1);
                expect(pm.loadManifestDependencies.calls.count()).toEqual(0);
                expect(pm.loadManifestDependencies).not.toHaveBeenCalled();
                expect(pm.loadPluginByManifest).not.toHaveBeenCalled();
                expect(pm.loadPluginByManifest.calls.count()).toEqual(0);
                expect(pm.isPluginDefined("org.ekstep.invalidPlugin")).toBe(false);
                done();
            });
        });
    });

    describe("queueDependencies method", function() {
        afterEach(function() {
            pm.cleanUp();
        });

        it("should queue the dependencies to load from manifest editor/renderer dependencies", function(done) {
            rm.discoverManifest("org.ekstep.seven", "1.0", function(err, data) {
                spyOn(rm, "loadExternalPluginResource").and.callThrough();
                spyOn(pm, "loadPluginWithDependencies");
                spyOn(pm, "loadCustomPlugin");

                var queueLength = pm.queueDependencies(data.manifest, publishedRepo, "plugin", undefined, []).length();

                setTimeout(function() {
                    expect(queueLength).toBe(2);
                    expect(rm.loadExternalPluginResource).toHaveBeenCalled();
                    expect(rm.loadExternalPluginResource.calls.count()).toEqual(2);
                    expect(pm.loadCustomPlugin).not.toHaveBeenCalled();
                    expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled();
                    done();
                }, 400);
            });
        });

        it("should not queue the dependencies if there is no dependencies", function(done) {
            rm.discoverManifest("org.ekstep.six", "1.0", function(err, data) {
                spyOn(rm, "loadExternalPluginResource").and.callThrough();
                spyOn(pm, "loadPluginWithDependencies");
                spyOn(pm, "loadCustomPlugin");

                var queueLength = pm.queueDependencies(data.manifest, publishedRepo, "plugin", undefined, []).length();

                setTimeout(function() {
                    expect(queueLength).toBe(0);
                    expect(rm.loadExternalPluginResource).not.toHaveBeenCalled();
                    expect(pm.loadCustomPlugin).not.toHaveBeenCalled();
                    expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled();
                    done();
                }, 400);
            });

        });

        it("should load dependencies type: plugin for editor", function(done) {
            rm.discoverManifest("org.ekstep.five", "1.0", function(err, data) {
                spyOn(rm, "loadExternalPluginResource").and.callThrough();
                spyOn(pm, "loadPluginWithDependencies");
                spyOn(pm, "loadCustomPlugin");

                var queueLength = pm.queueDependencies(data.manifest, publishedRepo, "plugin", undefined, []).length();

                setTimeout(function() {
                    expect(queueLength).toBe(1);
                    expect(rm.loadExternalPluginResource).not.toHaveBeenCalled();
                    expect(pm.loadCustomPlugin).not.toHaveBeenCalled();
                    expect(pm.loadPluginWithDependencies).toHaveBeenCalled();
                    expect(pm.loadPluginWithDependencies.calls.count()).toBe(1);
                    done();
                }, 400);
            });
        });

        it("should load dependencies type: plugin for renderer", function(done) {
            org.ekstep.pluginframework.env = "renderer"
            rm.discoverManifest("org.ekstep.five", "1.0", function(err, data) {
                spyOn(rm, "loadExternalPluginResource").and.callThrough();
                spyOn(pm, "loadPluginWithDependencies");
                spyOn(pm, "loadCustomPlugin");

                var queueLength = pm.queueDependencies(data.manifest, publishedRepo, "plugin", undefined, []).length();

                setTimeout(function() {
                    expect(queueLength).toBe(1);
                    expect(rm.loadExternalPluginResource).not.toHaveBeenCalled();
                    expect(pm.loadCustomPlugin).toHaveBeenCalled();
                    expect(pm.loadCustomPlugin.calls.count()).toBe(1);
                    expect(pm.loadPluginWithDependencies).not.toHaveBeenCalled();
                    org.ekstep.pluginframework.env = "editor";
                    done();
                }, 400);
            });
        });
    });
});
