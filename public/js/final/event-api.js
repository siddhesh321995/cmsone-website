'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('./app');

var EventApiTracker = {};
window.EventApiTracker = EventApiTracker;
var currGeoLocation = '';

var DISABLE_GEOLOCATION_TRACKING = true;

EventApiTracker.getSession = function getSession() {
  return Ajax.get(AEnvironment.SESSION_START_URL).then(function (resp) {
    window.ACommon.sessionid = ACommon.getCookie('asession');
    return window.ACommon.sessionid;
  });
};

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
  var trackFnc = function trackFnc() {
    EventApiTracker.trackPageHits(AEnvironment.EVENT_API_URL, EventApiTracker.generatePageViewEvent(attr));
  };

  if (!window.ACommon.sessionid) {
    EventApiTracker.getSession().then(function () {
      trackFnc();
    });
    return;
  }
  trackFnc();
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

document.addEventListener('DOMContentLoaded', function (event) {
  if (!window.ACommon.sessionid) {
    EventApiTracker.getSession();
  }
});