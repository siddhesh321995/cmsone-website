(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.ACommon = window.ACommon || {};

var json = function json(str) {
  return JSON.parse(str);
};
window.json = json;

var log = function log(data) {
  console.log(data);
  return data;
};
window.log = log;

var escapeRegExp = function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
window.escapeRegExp = escapeRegExp;

var replaceAll = function replaceAll(str, term, replacement) {
  return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
};
window.replaceAll = replaceAll;

var timeSince = function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " year(s)";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " month(s)";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " day(s)";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hour(s)";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minute(s)";
  }
  return Math.floor(seconds) + " second(s)";
};
window.timeSince = timeSince;

var UUID_NIL = '00000000-0000-0000-0000-000000000000';
window.UUID_NIL = UUID_NIL;

ACommon.getCookie = function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

window.ACommon.sessionid = ACommon.getCookie('asession');

ACommon.EnumGenerator = function EnumGenerator(attr) {
  for (var key in attr) {
    if (attr.hasOwnProperty(key)) {
      attr[attr[key]] = key;
    }
  }
  return attr;
};

var _module = window || {};

(function () {
  var Ajax = {
    put: function put(url, data, onSuccess, onFail) {
      return new Promise(function (res, rej) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
          var data = xhr.responseText;
          if (xhr.readyState == 4 && xhr.status == "200") {
            typeof onSuccess == "function" && onSuccess(data);
            typeof res == "function" && res(data);
          } else {
            typeof onFail == "function" && onFail(data);
            typeof rej == "function" && rej(data);
          }
        };
        xhr.send(JSON.stringify(data));
      });
    },

    get: function get(url, onSuccess, onFail) {
      return new Promise(function (res, rej) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
          var data = xhr.responseText;
          if (xhr.readyState == 4 && xhr.status == "200") {
            typeof onSuccess == "function" && onSuccess(data);
            typeof res == "function" && res(data);
          } else {
            typeof onFail == "function" && onFail(data);
            typeof rej == "function" && rej(data);
          }
        };
        xhr.send(null);
      });
    },

    post: function post(url, data, onSuccess, onFail) {
      return new Promise(function (res, rej) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
          var data = xhr.responseText;
          if (xhr.readyState == 4 && xhr.status == "200") {
            typeof onSuccess == "function" && onSuccess(data);
            typeof res == "function" && res(data);
          } else {
            typeof onFail == "function" && onFail(data);
            typeof rej == "function" && rej(data);
          }
        };
        xhr.send(JSON.stringify(data));
      });
    },

    delete: function _delete(url, data, onSuccess, onFail) {
      return new Promise(function (res, rej) {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
          var data = xhr.responseText;
          if (xhr.readyState == 4 && xhr.status == "200") {
            typeof onSuccess == "function" && onSuccess(data);
            typeof res == "function" && res(data);
          } else {
            typeof onFail == "function" && onFail(data);
            typeof rej == "function" && rej(data);
          }
        };
        xhr.send(JSON.stringify(data));
      });
    }
  };

  _module.Ajax = Ajax;
})();
},{}],2:[function(require,module,exports){
'use strict';

require('./event-api');

var _toastCount = 0;
var showToastMessage = function showToastMessage(data) {
  _toastCount++;
  // var tplStr = '<div id="dynamic-toast-${_toastCount}" class="toast" role="alert"  aria-live="assertive" aria-atomic="true" style="min-width: 200px;">  <div class="toast-header"> <strong class="mr-auto">${data.title}</strong> &nbsp;&nbsp;&nbsp; <small class="text-muted">just now</small> <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="toast-body"> ${data.body} </div> </div>';
  var tplStr = '<div class="alert alert-primary" style="position: fixed; top: 100px; left: 100px; z-index: 9999;" id="dynamic-toast-${_toastCount}" role="alert">${data.title}<p>${data.body}</p></div>';
  tplStr = tplStr.replace('${_toastCount}', _toastCount);
  tplStr = tplStr.replace('${data.title}', data.title);
  tplStr = tplStr.replace('${data.body}', data.body);

  $('.toast-parent').append(tplStr);
  window.setTimeout(function (str) {
    $(str).hide(2000);
  }, 3500, '#dynamic-toast-' + _toastCount);
};

window.showToastMessage = showToastMessage;

$(document).ready(function () {
  console.log('CMS One running ', AEnvironment.VERSION);
  var allProds;

  EventApiTracker.trackIt({
    eventtypeid: EventApiTracker.EventType.PageView
  });

  $('a').click(function (event) {
    EventApiTracker.trackIt({
      eventtypeid: EventApiTracker.EventType.LinkClicked,
      eventroute: $(event.currentTarget).attr('href')
    });
  });

  $('#newsletter').on('submit', function () {
    var dateObj = new Date();
    Ajax.put(AEnvironment.NEWS_LETTER_API, {
      email: $('#newsletter-email').val(),
      sessionid: ACommon.sessionid,
      isactive: true,
      createdepochtime: parseInt(dateObj.getTime() / 1000)
    }, function () {
      showToastMessage({
        title: 'Done !',
        body: 'You have successfully subscribed to our news letter, Thank you!'
      });
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Error subscribing new letter!',
        body: err.message || 'Something went wrong! Please try again later..'
      });
    });

    EventApiTracker.trackIt({
      eventtypeid: EventApiTracker.EventType.NewsLetterSubscribed
    });

    return false;
  });
});
},{"./event-api":5}],3:[function(require,module,exports){
'use strict';

require('./browser');

var AEnvironment = window.AEnvironment || {};
window.AEnvironment = AEnvironment;

AEnvironment.CURRENTHOST_URL = location.protocol + '//' + location.host;

AEnvironment.EVENT_API_URL = AEnvironment.API_URL + '/events/capture-it';
AEnvironment.CONTACT_US_API = AEnvironment.API_URL + '/contact-us';
AEnvironment.NEWS_LETTER_API = AEnvironment.API_URL + '/newsletter';
AEnvironment.REVIEW_API = AEnvironment.API_URL + '/review';
AEnvironment.REVIEW_BY_API = AEnvironment.API_URL + '/review/product/{{prodid}}';

AEnvironment.SESSION_END_URL = AEnvironment.CURRENTHOST_URL + '/end-session';

AEnvironment.V_MAJOR = 1;
AEnvironment.V_MINOR = 5;
AEnvironment.V_PATH = 0;
AEnvironment.VERSION = 'v' + AEnvironment.V_MAJOR + '.' + AEnvironment.V_MINOR + '.' + AEnvironment.V_PATH;
},{"./browser":4}],4:[function(require,module,exports){
'use strict';

require('./ajax');

var _module = window || {};

(function () {
  var ABrowser = {};

  ABrowser.isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  ABrowser.isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  ABrowser.isSafari = /constructor/i.test(window.HTMLElement) || function (p) {
    return p.toString() === "[object SafariRemoteNotification]";
  }(!window['safari'] || typeof safari !== 'undefined' && safari.pushNotification);

  // Internet Explorer 6-11
  ABrowser.isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  ABrowser.isEdge = !ABrowser.isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  ABrowser.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  // ABrowser.isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  ABrowser.isEdgeChromium = ABrowser.isChrome && navigator.userAgent.indexOf("Edg") != -1;

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

  _module.ABrowser = ABrowser;
})();
},{"./ajax":1}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('./app');

var EventApiTracker = {};
window.EventApiTracker = EventApiTracker;
var currGeoLocation = '';

var DISABLE_GEOLOCATION_TRACKING = true;

EventApiTracker.checkTime = function checkTime(t) {
  if (t < 10) {
    t = "0" + t;
  }
  return t;
};

EventApiTracker.generatePageViewEvent = function (initializeObject) {
  initializeObject = convertKeysToLowerCase(initializeObject);
  updateGeoLocation();

  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var h = dateObj.getHours();
  var m = EventApiTracker.checkTime(dateObj.getMinutes());
  var s = EventApiTracker.checkTime(dateObj.getSeconds());

  var pageViewEvent = {};
  pageViewEvent.platform = 'Web';
  pageViewEvent.type = getEventIdName(initializeObject.eventtypeid);
  pageViewEvent.url = initializeObject.eventurl || window.location.href;
  pageViewEvent.route = initializeObject.eventroute || null;
  pageViewEvent.timestamp = dateObj.toUTCString();
  pageViewEvent.epochtime = parseInt(dateObj.getTime() / 1000);
  pageViewEvent.date = year + "/" + month + "/" + day;
  pageViewEvent.time = h + ":" + m + ":" + s;
  pageViewEvent.geoloc = currGeoLocation;
  pageViewEvent.useragent = navigator.userAgent.toString();
  pageViewEvent.browser = ABrowser.getName();
  pageViewEvent.reso = window.screen.availWidth + 'X' + window.screen.availHeight;
  pageViewEvent.sessionid = initializeObject.sessionid || window.ACommon.sessionid || null;
  pageViewEvent.userid = initializeObject.userid || window.ACommon.userid || null;
  pageViewEvent.skuid = initializeObject.skuid || window.ACommon.skuid || null;
  pageViewEvent.pageno = initializeObject.pageno || null;
  pageViewEvent.resourceid = initializeObject.resourceid || null;
  return pageViewEvent;
};

EventApiTracker.trackPageHits = function trackPageHits(url, pageViewEvent) {
  if ((typeof pageViewEvent === 'undefined' ? 'undefined' : _typeof(pageViewEvent)) !== "object") {
    return new Promise(function (res, rej) {
      res();
    });
  }
  // Return a new promise.
  pageViewEvent.geoloc = currGeoLocation;
  return new Promise(function (resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/json");

    req.onload = function () {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function () {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send(JSON.stringify(pageViewEvent));
  });
};

EventApiTracker.trackIt = function trackIt(attr) {
  EventApiTracker.trackPageHits(AEnvironment.EVENT_API_URL, EventApiTracker.generatePageViewEvent(attr));
};

EventApiTracker.EventType = ACommon.EnumGenerator({
  IgnorePageViewEvent: 0,
  Login: 1,
  Logout: 2,
  PageView: 3,
  ContactUsSubmitted: 4,
  ProductListingPageVisited: 5,
  ProductPageVisited: 6,
  LinkClicked: 7,
  NewsLetterSubscribed: 8,
  ReviewSubmitted: 9
});

var getEventIdName = function getEventIdName(eventId) {
  var eventTypeEnum = EventApiTracker.EventType;
  return eventTypeEnum[eventId];
};

var updateGeoLocation = function updateGeoLocation() {
  if (!DISABLE_GEOLOCATION_TRACKING) {
    if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      return "Geolocation is not supported by this browser.";
    }
  }
};

var showPosition = function showPosition(position) {
  currGeoLocation = "Latitude: " + position.coords.latitude + ",Longitude: " + position.coords.longitude;
};

var convertKeysToLowerCase = function convertKeysToLowerCase(obj) {
  var key,
      keys = Object.keys(obj);
  var n = keys.length;
  var newObj = {};

  while (n--) {
    key = keys[n];
    newObj[key.toLowerCase()] = obj[key];
  }

  return newObj;
};

updateGeoLocation();
},{"./app":3}]},{},[2]);
