require('./ajax');

var module = window || {};

(function () {
  var ABrowser = {};

  ABrowser.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  ABrowser.isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  ABrowser.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

  // Internet Explorer 6-11
  ABrowser.isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  ABrowser.isEdge = !ABrowser.isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  ABrowser.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  // ABrowser.isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  ABrowser.isEdgeChromium = ABrowser.isChrome && (navigator.userAgent.indexOf("Edg") != -1);

  // Blink engine detection
  ABrowser.isBlink = (ABrowser.isChrome || ABrowser.isOpera) && !!window.CSS;

  ABrowser.getName = function getName() {
    if (ABrowser.isEdgeChromium) {
      return 'Edge with chrome engine';
    }
    if (ABrowser.isEdge) {
      return 'Edge';
    }
    if (ABrowser.isOpera) {
      return 'Opera';
    }
    if (ABrowser.isFirefox) {
      return 'Firefox';
    }
    if (ABrowser.isSafari) {
      return 'Safari';
    }
    if (ABrowser.isIE) {
      return 'IE';
    }
    if (ABrowser.isChrome) {
      return 'Chrome';
    }
    return 'unknown';
  };

  module.ABrowser = ABrowser;
})();