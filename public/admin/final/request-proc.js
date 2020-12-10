'use strict';

var getParameterByName = function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

var getAuthToken = function getAuthToken() {
  return localStorage.getItem('usersession');
};

var type = getParameterByName('type');
switch (type) {
  case 'approvereview':
    var reviewid = getParameterByName('reviewid');
    Ajax.post(AEnvironment.REVIEW_URL, {
      id: reviewid,
      isApproved: true,
      authtoken: getAuthToken()
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log(resp);
      document.getElementById('main').innerHTML = 'Request was completed';
      document.title = 'Request was completed';
    }, function (err) {
      document.getElementById('main').innerHTML = 'There was an error processing your request';
      document.title = 'Error processing your request';
    });
    break;
  case 'resetpassword':
    var resetid = getParameterByName('resetid');
    Ajax.post(AEnvironment.VALIDATE_PASS_RESET_URL, {
      resetid: resetid
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log(resp);
      document.getElementById('main').innerHTML = resp.message + '. Please wait, we will redirect you soon';
      document.title = 'Please wait, we will redirect you soon';
      window.location.href = '/admin/reset-password?resetid=' + resetid;
    }, function (err) {
      document.getElementById('main').innerHTML = 'There was an error processing your request';
      document.title = 'Error processing your request';
    });
    break;
  default:
    document.getElementById('main').innerHTML = 'Invalid request';
    document.title = 'Invalid request';
}