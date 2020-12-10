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