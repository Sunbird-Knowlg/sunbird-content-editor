// describe('Sunbird Endpage Plugin', function() {
// 	var manifest, endPageInstance;
//     beforeAll(function(callback) {
//         org.ekstep.contentrenderer.loadPlugins([{"id":"org.sunbird.player.endpage","ver":1,"type":"plugin"}], [], function() {
//    			console.log("Sunbird endpage plugin is loaded");
// 			endPageInstance = org.ekstep.pluginframework.pluginManager.pluginObjs['org.sunbird.player.endpage'];
// 			manifest = org.ekstep.pluginframework.pluginManager.pluginManifests['org.sunbird.player.endpage'];
//             callback();
// 		});
//     });
//     describe("When plugin is initialized", function() {
//     	it("It should invoke loadNgModules", function() {
//             var ngController = org.ekstep.service.controller;
//     		spyOn(ngController, "loadNgModules").and.callThrough();
//             endPageInstance.initialize(manifest);
//             expect(endPageInstance.templatePath).not.toBeUndefined();
//             expect(endPageInstance.controllerPath).not.toBeUndefined();
//         });

//         it("It should invoke initEndPage", function(done) {
//             spyOn(endPageInstance, "initEndPage").and.callThrough();
//             endPageInstance.initEndPage(manifest);
//             // Add an event listener
//             // Assertion for those event properties
//             expect(endPageInstance.initEndPage).not.toBeUndefined();
//             done();            
//         });

//         it("It should invoke gotTohome", function(done) {
//             var instance = org.ekstep.service.renderer;
//             spyOn(endPageInstance, "gotTohome").and.callThrough();
//             function exitApp(){
//                 console.log("App is exited");
//                 done();
//             }
//             //Assertion for the hiding an endpage
//             //SpyOn for exit App
//             // Test should return a callback,Once all the behaviours are verified
//             // Test should have assertion for the both device and preview. Ex:!isBrowserPreview or isBrowserPreview
//             endPageInstance.gotTohome();
//             expect(endPageInstance.gotTohome).not.toBeUndefined();
//             spyOn(endPageInstance, "endGenieCanvas").and.callThrough();
//             endPageInstance.gotTohome();
//             expect(instance, 'endGenieCanvas').toBeUndefined();
//         });
//     });
// });