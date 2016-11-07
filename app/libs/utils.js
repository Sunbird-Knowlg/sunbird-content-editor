(function(window){
 'use strict';

  var EkstepAuthoringTool = function() {

    this.getBrowser = function() {
      var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
      if (isOpera) {
        return "opera";
      }
      var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
      if (isFirefox) {
        return "firefox";
      }
      var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
      if (isSafari) {
        return "safari";
      }
      var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
      if (isChrome) {
        return "chrome";
      }
      var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
      if (isIE) {
        return "ie";
      }
    };

    this.isMac = function() {
      return window.navigator.userAgent.indexOf("Mac") !== -1;
    };

    this.createArray = function(obj) {
        if (_.isUndefined(obj)) {
          return [];
        }

        if (_.isArray(obj)) {
          return obj;
        } else {
          return [obj];
        }
    };

    this.convertECMLXMLToJSON = function(data) {
      var x2js = new window.X2JS({attributePrefix: 'none', enableToStringFunc: false});
      return x2js.xml_str2json(data);
    };
  };
  window.EkstepAuthoringTool = new EkstepAuthoringTool();

}(window));
