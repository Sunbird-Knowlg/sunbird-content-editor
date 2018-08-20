// 'use strict';

// describe('Text migration specs', function() {
//     var textData, wordInfo, readAlong;
//     beforeAll(function(done) {
//         org.ekstep.pluginframework.pluginManager._loadPlugins([{"id": "org.ekstep.text","ver": "1.2","type": "plugin"}], undefined, function() {
//             done();
//         })
//     })
//     beforeEach(function() {
//         spyOn(org.ekstep.contenteditor.migration.textmigration_task, 'init').and.callThrough();
//         spyOn(org.ekstep.contenteditor.migration.textmigration_task, 'migrateText').and.callThrough();
//         spyOn(org.ekstep.contenteditor.migration.textmigration_task, 'isOldPluginAvailable').and.callThrough();
//         textData = {"x":5.69,"y":9.38,"minWidth":20,"w":35,"maxWidth":500,"fill":"#000000","fontStyle":"normal","fontWeight":"normal","stroke":"rgba(255, 255, 255, 0)","strokeWidth":1,"opacity":1,"editable":false,"lineHeight":1.3,"h":5.02,"rotate":0,"textType":"text","z-index":0,"font":"NotoSans","fontsize":48,"weight":"","id":"a0549c56-c529-42cd-a03a-05aabdc3688e","config":{"__cdata":'{"opacity":100,"strokeWidth":1,"stroke":"rgba(255, 255, 255, 0)","autoplay":false,"visible":true,"text":"Old Text","color":"#000000","fontfamily":"NotoSans","fontsize":18,"fontweight":false,"fontstyle":false,"align":"left"}'}};
//     });

//     it('should initialize & add event listener for text migration function', function() {
//         org.ekstep.contenteditor.migration.textmigration_task.init();
//         expect(EventBus.hasEventListener('org.ekstep.text:migrate')).toBe(true);
//     });

//     describe('should migrate the old text', function() {
//         it('When no text is available in stage', function() {

//         });

//         it('When only one text is available in stage', function() {
//             ecEditor.dispatchEvent("org.ekstep.text:create", textData);
//             var textInstance = org.ekstep.pluginframework.pluginManager.pluginInstance['a0549c56-c529-42cd-a03a-05aabdc3688e']
//             org.ekstep.contenteditor.migration.textmigration_task.migrateText(undefined, textInstance);
//             expect(textInstance.attributes.version).toBeDefined();
//             expect(textInstance.attributes.version).toEqual('V2');
//             expect(textInstance.attributes.offsetY).toBeDefined();
//             expect(textInstance.attributes.lineHeight).not.toEqual(1.13);
//         });

//         it('When multiple text are available in stage', function() {
//             ecEditor.dispatchEvent("org.ekstep.text:create", textData);
//             textData.id = "a0549c56-c529-42cd-a03a-05aabdc3688f";
//             ecEditor.dispatchEvent("org.ekstep.text:create", textData);
//             var textInstance1 = org.ekstep.pluginframework.pluginManager.pluginInstance['a0549c56-c529-42cd-a03a-05aabdc3688e']
//             var textInstance2 = org.ekstep.pluginframework.pluginManager.pluginInstance['a0549c56-c529-42cd-a03a-05aabdc3688f']
//             org.ekstep.contenteditor.migration.textmigration_task.migrateText(undefined, textInstance1);
//             org.ekstep.contenteditor.migration.textmigration_task.migrateText(undefined, textInstance2);
//             expect(textInstance1.attributes.version).toBeDefined();
//             expect(textInstance1.attributes.version).toEqual('V2');
//             expect(textInstance1.attributes.offsetY).toBeDefined();
//             expect(textInstance1.attributes.lineHeight).not.toEqual(1.13);
//             expect(textInstance2.attributes.version).toBeDefined();
//             expect(textInstance2.attributes.version).toEqual('V2');
//             expect(textInstance2.attributes.offsetY).toBeDefined();
//             expect(textInstance2.attributes.lineHeight).not.toEqual(1.13);
//         });

//         it('When one wordInfo text is available in stage', function() {

//         });

//         it('When multiple wordInfo text are available in stage', function() {

//         });

//         it('When wordInfo & normal text are available in stage', function() {

//         });

//         it('When one readalong text is available in stage', function() {

//         });

//         it('When multiple readalong text are available in stage', function() {

//         });

//         it('When wordInfo, readalong & normal text are available in stage', function() {

//         });

//         it('When one richtext is available in stage', function() {

//         });

//         it('When multiple richtext are available in stage', function() {

//         });

//         it('When wordInfo, readalong, richtext & normal text are available in stage', function() {

//         });

//     });

//     describe('Check if old instance of text plugin is available', function() {
//         it('if single old instance of text is available in stage', function() {

//         });

//         it('if multiple old instance of text are available in stage', function() {

//         });

//         it('if both instance of text & richtext are available in stage', function() {

//         });

//         it('if both instance of all 4 text(wordinfo, readalong, text & richtext) are available in stage', function() {

//         });

//         it('if old instance of wordinfo, readalong, text & richtext are available in stage', function() {

//         });
//     });
// });
