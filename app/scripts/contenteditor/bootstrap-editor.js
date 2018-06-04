/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
/* istanbul ignore next. Fabric extension - cannot be tested */
if(window.fabric) {
    window.fabric.Object.prototype.toObject = (function(toObject) {
        return function() {
            return window.fabric.util.object.extend(toObject.call(this), {
                meta: this.meta
            });
        };
    })(window.fabric.Object.prototype.toObject);
}

var content_editor = function() {};
content_editor.prototype.jQuery = window.$;
content_editor.prototype._ = window._;
window.org.ekstep.contenteditor = new content_editor();
content_editor = undefined;

window.ServiceConstants = {
    SEARCH_SERVICE: "search",
    POPUP_SERVICE: "popup",
    CONTENT_SERVICE: "content",
    ASSESSMENT_SERVICE: "assessment",
    LANGUAGE_SERVICE: "language",
    META_SERVICE: "meta",
    ASSET_SERVICE: "asset",
    TELEMETRY_SERVICE: "telemetry",
    DIALCODE_SERVICE: "dialcode"
}

window.ManagerConstants = {
    EVENT_MANAGER: "event",
    MEDIA_MANAGER: "media",
    PLUGIN_MANAGER: "plugin",
    RESOURCE_MANAGER: "resource",
    STAGE_MANAGER: "stage",
    TOOLBAR_MANAGER: "toolbar"
}

// webfonts loader configuration
WebFontConfig = {
  custom: {
    families: ['NotoSansDevanagari','NotoSansTelugu','NotoSansKannada','NotoSansOriya','NotoSansBengali','NotoSansMalayalam','NotoNastaliqUrdu','NotoSansGurmukhi','NotoSansTamil','NotoSans','NotoSansRegular','NotoSansGujarati'],
      urls: ['styles/noto.css']
  }
}
