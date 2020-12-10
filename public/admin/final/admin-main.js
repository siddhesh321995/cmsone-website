'use strict';

var checkIfConfigured = function checkIfConfigured() {
  /* Ajax.get(AEnvironment.CONFIG_IS, function (resp) {
    resp = JSON.parse(resp);
    if (!resp.isConfigured) {
      window.location.href = '/admin/configure';
    }
  }, getErrorFnc({
    errorTitle: 'Error while validating configuration'
  })); */

  Ajax.get(AEnvironment.API_CONFIG_IS, function (resp) {
    resp = JSON.parse(resp);
    if (!resp.isConfigured) {
      window.location.href = '/admin/configure';
    }
  }, getErrorFnc({
    errorTitle: 'Error while validating configuration'
  }));
};

var getErrorFnc = function getErrorFnc(data) {
  if (data == void 0) {
    data = {};
  }
  if (data.errorTitle == void 0) {
    data.errorTitle = 'Error occured';
  }
  if (data.errorMsg == void 0) {
    data.errorMsg = 'Something went wrong';
  }
  if (data.showToast == void 0) {
    data.showToast = true;
  }

  return function (err) {
    err = JSON.parse(err);
    console.warn(err);
    if (data.showToast) {
      showToastMessage({
        title: data.errorTitle,
        body: err.message || data.errorMsg
      });
    }
  };
};
window.getErrorFnc = getErrorFnc;

if (currentPage != 'adminconfigure') {
  checkIfConfigured();
}

var getItemTemplateProm = Ajax.get('/admin/templates/itemlist.html');
var getAdminNavTemplateProm = Ajax.get('/admin/templates/sidenav.html');
var getAdminTopNavTemplateProm = Ajax.get('/admin/templates/topnav.html');
window.getItemTemplateProm = getItemTemplateProm;
window.getAdminNavTemplateProm = getAdminNavTemplateProm;
window.getAdminTopNavTemplateProm = getAdminTopNavTemplateProm;

var getAuthToken = function getAuthToken() {
  return localStorage.getItem('usersession');
};
window.getAuthToken = getAuthToken;

var getParameterByName = function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

var _toastCount = 0;

var showToastMessage = function showToastMessage(data) {
  _toastCount++;
  $('.toast-parent').append('\n  <div id="dynamic-toast-' + _toastCount + '" class="toast" role="alert"\n    aria-live="assertive" aria-atomic="true" style="min-width: 200px;">\n    <div class="toast-header">\n      <strong class="mr-auto">' + data.title + '</strong> &nbsp;&nbsp;&nbsp;\n      <small class="text-muted">just now</small>\n      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\n        <span aria-hidden="true">&times;</span>\n      </button>\n    </div>\n    <div class="toast-body">\n      ' + data.body + '\n    </div>\n  </div>\n  ');

  $('#dynamic-toast-' + _toastCount).toast({ delay: 2000 });
  $('#dynamic-toast-' + _toastCount).toast('show');
};
window.showToastMessage = showToastMessage;

var allProds;
window.currentItems = [];

var getProductById = function getProductById(id) {
  if (allProds && allProds.products && allProds.products.length) {
    for (var i = 0; i < allProds.products.length; i++) {
      if (allProds.products[i].id == id) {
        return allProds.products[i];
      }
    }
  }
};

$(document).ready(function () {
  var validPages = ['adminlogin', 'adminregister', 'adminforgotpassword', 'adminresetpassword', 'adminconfigure'];
  window.user = {};
  var isAuth = false;
  var dashboardData = {};

  var onLogoutClick = function onLogoutClick(e) {
    Ajax.post(AEnvironment.LOGOUT_URL, {
      usersessionid: getAuthToken()
    }, function (resp) {
      console.log('logout', resp);
      resp = JSON.parse(resp);
      localStorage.removeItem('usersession');
      window.location.href = '/admin/login';
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not log out properly!',
        body: err.message || 'Something went wrong! but logging you out none the less'
      });
      localStorage.removeItem('usersession');
      window.location.href = '/admin/login';
    });
    return false;
  };

  getAdminNavTemplateProm.then(function (tpl) {
    $('.admin-main-nav').html(tpl);
    var path = window.location.href;
    $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function () {
      if (this.href === path) {
        $(this).addClass("active");
      }
    });
  }, getErrorFnc());

  getAdminTopNavTemplateProm.then(function (tpl) {
    $('nav.navbar').html(tpl);
    $('#sidebarToggle').click(function () {
      $('body').toggleClass('sb-sidenav-toggled');
    });
    $('.logout-btn').click(onLogoutClick);
  }, getErrorFnc());

  if (currentPage == 'adminsettings') {
    $('.btn-sub-settings').click(function (ev) {
      var reqData = {
        googleAdClient: $('#inputGoogleAdClient').val(),
        googleAnalytics: $('#inputGoogleAnalytics').val(),
        msValidator: $('#inputMSValidator').val(),
        defMetaDesc: $('#inputDefMetaDesc').val(),
        defMetaKey: $('#inputDefMetaKey').val(),
        lang: $("input[name=gridLang]:checked").val()
      };

      for (var key in reqData) {
        if (reqData.hasOwnProperty(key)) {
          if (!reqData[key] && reqData[key] != 0) {
            delete reqData[key];
          }
        }
      }

      reqData.authtoken = getAuthToken();

      console.log('reqData for admin settings', reqData);
      Ajax.post(AEnvironment.ADMIN_SETTINGS, reqData).then(json).then(log);
      return false;
    });

    Ajax.get(AEnvironment.ADMIN_SETTINGS).then(json).then(function (resp) {
      $('#inputGoogleAdClient').val(resp.googleAdClient);
      $('#inputGoogleAnalytics').val(resp.googleAnalytics);
      $('#inputMSValidator').val(resp.msValidator);
      $('#inputDefMetaDesc').val(resp.defMetaDesc);
      $('#inputDefMetaKey').val(resp.defMetaKey);
      $("input[name=gridLang][value=" + resp.lang + "]").prop('checked', true);
    });
  }

  var updateUser = function updateUser() {
    $('.ausername').html(window.user.fName + ' ' + window.user.lName);

    if (currentPage == 'admindashboard') {
      Ajax.get(AEnvironment.ANALYTICS_SUMMARY_URL.replace('{{authtoken}}', getAuthToken()), function (resp) {
        resp = JSON.parse(resp);
        console.log('analytics', resp);
        dashboardData = resp.data;
        updateDashboardData();
      }, function (err) {
        err = JSON.parse(err);
        showToastMessage({
          title: 'Could not load analytics data!',
          body: err.message || 'Something went wrong!'
        });
      });
    }

    if (currentPage == 'admincontact') {
      getContactData();
    } else if (currentPage == 'adminnewsletter') {
      getNewsLetterData();
    } else if (currentPage == 'admindashboard') {
      getTrackerData();
    } else if (currentPage == 'adminlogs') {
      getLogsData();
    } else if (currentPage == 'adminreviews') {
      var ProdProm = new Promise(function (res, rej) {
        Ajax.get('/products/data/all.json', function (resp) {
          resp = JSON.parse(resp);
          allProds = resp;
          res(resp);
        }, rej);
      });
      ProdProm.then(function (resp) {
        getReviewsData();
        return resp;
      }, function (err) {
        getReviewsData();
      }).catch(function (err) {
        getReviewsData();
      });
    }
  };

  var getTrackerData = function getTrackerData() {
    Ajax.post(AEnvironment.API_URL + '/admin/collection', {
      "page": 1,
      "max": 100,
      "find": {},
      "collectionName": "tracker",
      "sort": { "epochtime": -1 }
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log('collection', resp);

      $('#dataTable thead, #dataTable tfoot').html('\n      <tr>\n        <th>Session ID</th>\n        <th>Date</th>\n        <th>Time</th>\n        <th>Type</th>\n        <th>URL</th>\n        <th>Epoch Time</th>\n        <th>Browser</th>\n        <th>IP Address</th>\n      </tr>\n      ');

      var str = '';
      for (var i = 0; i < resp.data.length; i++) {
        str += '\n        <tr>\n          <td>' + resp.data[i].sessionid + '</td>\n          <td>' + new Date(resp.data[i].epochtime * 1000).toLocaleDateString() + '</td>\n          <td>' + new Date(resp.data[i].epochtime * 1000).toLocaleTimeString() + '</td>\n          <td>' + resp.data[i].type + '</td>\n          <td>' + resp.data[i].url + '</td>\n          <td>' + resp.data[i].epochtime + '</td>\n          <td>' + resp.data[i].browser + '</td>\n          <td>' + resp.data[i].ip + '</td>\n        </tr>\n        ';
      }
      $('#dataTable tbody').html(str);

      $('#dataTable').DataTable();
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not load tracker data!',
        body: err.message || 'Something went wrong!'
      });
    });
  };

  var getContactData = function getContactData() {
    Ajax.post(AEnvironment.API_URL + '/admin/collection', {
      "page": 1,
      "max": 100,
      "find": {},
      "collectionName": "contactus"
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log('collection', resp);

      $('#dataTable thead, #dataTable tfoot').html('\n      <tr>\n        <th>First</th>\n        <th>Last</th>\n        <th>Email</th>\n        <th>Subject</th>\n        <th>Message</th>\n        <th>IP Address</th>\n        <th>Created date</th>\n        <th>Session ID</th>\n      </tr>\n      ');

      var str = '';
      for (var i = 0; i < resp.data.length; i++) {
        str += '\n        <tr>\n          <td>' + resp.data[i].fName + '</td>\n          <td>' + resp.data[i].lName + '</td>\n          <td>' + resp.data[i].email + '</td>\n          <td>' + resp.data[i].subject + '</td>\n          <td>' + resp.data[i].message + '</td>\n          <td>' + resp.data[i].ip + '</td>\n          <td>' + resp.data[i].cDate + '</td>\n          <td>' + resp.data[i].cmsid + '</td>\n        </tr>\n        ';
      }
      $('#dataTable tbody').html(str);

      $('#dataTable').DataTable();
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not load contact us data!',
        body: err.message || 'Something went wrong!'
      });
    });
  };

  var getNewsLetterData = function getNewsLetterData() {
    Ajax.post(AEnvironment.API_URL + '/admin/collection', {
      "page": 1,
      "max": 100,
      "find": {},
      "collectionName": "newsletter",
      "sort": { "createdepochtime": -1 }
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log('collection', resp);

      $('#dataTable thead, #dataTable tfoot').html('\n      <tr>\n        <th>Email</th>\n        <th>Is Active</th>\n        <th>Session ID</th>\n        <th>Date subscribed</th>\n        <th>IP</th>\n      </tr>\n      ');

      var str = '';
      for (var i = 0; i < resp.data.length; i++) {
        str += '\n        <tr>\n          <td>' + resp.data[i].email + '</td>\n          <td>' + resp.data[i].isactive + '</td>\n          <td>' + resp.data[i].sessionid + '</td>\n          <td>' + new Date(resp.data[i].createdepochtime * 1000).toLocaleString() + '</td>\n          <td>' + resp.data[i].ip + '</td>\n        </tr>\n        ';
      }
      $('#dataTable tbody').html(str);

      $('#dataTable').DataTable();
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not load news letter data!',
        body: err.message || 'Something went wrong!'
      });
    });
  };

  var getLogsData = function getLogsData() {
    Ajax.post(AEnvironment.API_URL + '/admin/collection', {
      "page": 1,
      "max": 100,
      "find": {},
      "collectionName": "logs",
      "sort": { "createdtime": -1 }
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log('collection', resp);

      $('#dataTable thead, #dataTable tfoot').html('\n      <tr>\n        <th>Log Message</th>\n        <th>Log Stacktrace</th>\n        <th>Date</th>\n        <th>Time</th>\n        <th>Epoch Time</th>\n        <th>Log Type</th>\n        <th>Log Severity</th>\n      </tr>\n      ');

      var str = '';
      for (var i = 0; i < resp.data.length; i++) {
        str += '\n        <tr>\n          <td>' + resp.data[i].logmessage + '</td>\n          <td>' + resp.data[i].logstack + '</td>\n          <td>' + new Date(resp.data[i].createdtime * 1000).toLocaleDateString() + '</td>\n          <td>' + new Date(resp.data[i].createdtime * 1000).toLocaleTimeString() + '</td>\n          <td>' + resp.data[i].createdtime + '</td>\n          <td>' + resp.data[i].type + '</td>\n          <td>' + resp.data[i].severity + '</td>\n        </tr>\n        ';
      }
      $('#dataTable tbody').html(str);

      $('#dataTable').DataTable();
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not load news letter data!',
        body: err.message || 'Something went wrong!'
      });
    });
  };

  var getReviewsData = function getReviewsData() {
    Ajax.post(AEnvironment.API_URL + '/admin/collection', {
      "page": 1,
      "max": 100,
      "find": {},
      "collectionName": "resourcereview",
      "sort": { "createtime": -1 }
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log('collection', resp);

      $('#dataTable thead, #dataTable tfoot').html('\n      <tr>\n        <th>Full Name</th>\n        <th>Email</th>\n        <th>Visible to public</th>\n        <th>Product Name</th>\n        <th>Date</th>\n        <th>Time</th>\n        <th>Epoch Time</th>\n        <th>Session Id</th>\n      </tr>\n      ');

      var str = '';
      for (var i = 0; i < resp.data.length; i++) {
        if (!resp.data[i].isActive) {
          continue;
        }
        var prod = getProductById(resp.data[i].resourceid);
        var title = resp.data[i].resourceid;
        if (prod) {
          title = prod.title;
        }
        str += '\n        <tr>\n          <td>' + resp.data[i].fullname + '</td>\n          <td>' + resp.data[i].email + '</td>\n          <td>' + resp.data[i].isApproved + '</td>\n          <td>' + title + '</td>\n          <td>' + new Date(resp.data[i].createtime * 1000).toLocaleDateString() + '</td>\n          <td>' + new Date(resp.data[i].createtime * 1000).toLocaleTimeString() + '</td>\n          <td>' + resp.data[i].createtime + '</td>\n          <td>' + resp.data[i].sessionid + '</td>\n        </tr>\n        ';
      }
      $('#dataTable tbody').html(str);

      $('#dataTable').DataTable();
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not load news letter data!',
        body: err.message || 'Something went wrong!'
      });
    });
  };

  var updateDashboardData = function updateDashboardData() {
    $('.total-visitors').html(dashboardData.totalPageViews);
    $('.unique-visitors').html(dashboardData.totalUniqueVisits);
    $('.contact-submit').html(dashboardData.totalContactUsSubmitted);
    $('.newsletter-subs').html(dashboardData.totalNewsLetterSubscribed);
    $('.top-browser').html(dashboardData.hotBrowser.name + ' with ' + dashboardData.hotBrowser.count + ' page view(s)');
    $('.top-visitor').html(dashboardData.hotIP.name + ' with ' + dashboardData.hotIP.count + ' page view(s)');
    $('.top-page').html(dashboardData.hotURL.name + ' was visited ' + dashboardData.hotURL.count + 'x time(s)');
    $('.top-page-link').attr('href', dashboardData.hotURL.name);
  };

  var checkSession = function checkSession() {
    Ajax.post(AEnvironment.SESSION_CHECK_URL, {
      usersessionid: getAuthToken()
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log(resp);
      user = resp.user;
      updateUser();
      isAuth = true;
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Authentication error!',
        body: err.message || 'Something went wrong!'
      });
      window.location.href = '/admin/login';
    });
  };

  if (validPages.indexOf(currentPage) == -1) {
    checkSession();
  }

  $('.register-btn').click(function (e) {
    Ajax.post(AEnvironment.REGISTER_URL, {
      fName: $('#inputFirstName').val(),
      lName: $('#inputLastName').val(),
      email: $('#inputEmailAddress').val(),
      password: $('#inputPassword').val()
    }, function (resp) {
      console.log('register', resp);
      alert('Registered successfully, Now you may login');
      window.location.href = '/admin/login';
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not register!',
        body: err.message || 'Something went wrong!'
      });
    });
    return false;
  });

  $('.logout-btn').click(onLogoutClick);

  $('.login-btn').click(function (e) {
    Ajax.post(AEnvironment.LOGIN_URL, {
      email: $('#inputEmailAddress').val(),
      password: $('#inputPassword').val()
    }, function (resp) {
      console.log('login', resp);
      resp = JSON.parse(resp);
      localStorage.setItem('usersession', resp.data.sessionid);
      window.location.href = '/admin';
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Could not log in!',
        body: err.message || 'Something went wrong!'
      });
    });
    return false;
  });

  $('.reset-pass-btn').click(function (e) {
    Ajax.post(AEnvironment.FORGOT_PASSWORD_URL, {
      email: $('#inputEmailAddress').val()
    }, function (resp) {
      resp = JSON.parse(resp);
      console.log('done', resp);
      showToastMessage({
        title: 'Done!',
        body: 'An email was sent to ' + $('#inputEmailAddress').val()
      });
    }, function (err) {
      err = JSON.parse(err);
      showToastMessage({
        title: 'Error!',
        body: err.message || 'Something went wrong!'
      });
    });
    return false;
  });

  if (currentPage == 'adminresetpassword') {
    var resetid = getParameterByName('resetid');
    if (!resetid) {
      showToastMessage({
        title: 'Invalid link!',
        body: 'Invalid or broken link'
      });
      window.location.href = '/admin/login';
      return;
    }
    $('.reset-pass-go-btn').click(function (e) {
      var pass = $('#inputPassword').val();
      var confirmPass = $('#inputConfirmPassword').val();
      if (pass != confirmPass) {
        showToastMessage({
          title: 'Invalid passwords!',
          body: 'Please enter matching passwords'
        });
        return;
      }

      Ajax.post(AEnvironment.RESET_PASSWORD_URL, {
        newpass: $('#inputPassword').val(),
        resetid: resetid
      }, function (resp) {
        resp = JSON.parse(resp);
        console.log('done', resp);
        showToastMessage({
          title: 'Done!',
          body: 'Your password has been reset, login with your new password to continue to CMS One'
        });
        setTimeout(function () {
          window.location.href = '/admin/login';
        }, 2000);
      }, function (err) {
        err = JSON.parse(err);
        showToastMessage({
          title: 'Error!',
          body: err.message || 'Something went wrong!'
        });
      });
      return false;
    });
  }

  $('.config-btn').click(function (e) {
    var www = $("input[name=www]:checked").val() == 'true';
    var https = $("input[name=https]:checked").val() == 'true';
    var sitename = $('#inputSiteName').val();
    var frontendurl = $('#inputSiteURL').val();
    var apiurl = $('#inputAPIUrl').val();
    var authkey = $('#inputAuthKey').val();

    if (!sitename || !frontendurl || !apiurl || !authkey) {
      getErrorFnc({
        errorTitle: 'Cannot configure site',
        errorMsg: 'Please fill all the details'
      })('{}');
      return;
    }

    /* var frontendConfig = new Promise(function (res, rej) {
      Ajax.post(AEnvironment.CONFIG, {
        sitename: sitename,
        frontendurl: frontendurl,
        apiurl: apiurl,
        haswww: www,
        isHttps: https,
        authkey: authkey,
      }, function (resp) {
        resp = JSON.parse(resp);
        console.log(resp);
        res(resp);
      }, rej);
    }); */

    var bkendConfig = new Promise(function (res, rej) {
      Ajax.post(AEnvironment.API_CONFIG, {
        sitename: sitename,
        frontendurl: frontendurl,
        apiurl: apiurl,
        haswww: www,
        isHttps: https,
        authkey: authkey
      }, function (resp) {
        resp = JSON.parse(resp);
        console.log(resp);
        res(resp);
      }, rej);
    });

    Promise.all([bkendConfig]).then(function () {
      showToastMessage({
        title: 'Success!',
        body: 'Successfully configured site data'
      });
      setTimeout(function () {
        window.location.href = '/admin/login';
      }, 2000);
    }, getErrorFnc({
      errorTitle: 'Could not configure site'
    }));

    return false;
  });

  var www = false;
  var https = false;
  var fUrl = '';
  var apiUrl = '';

  $('#inputSiteURL').val(window.location.host);
  $('#inputAPIUrl').val(AEnvironment.API_URL.replace('//', ''));

  var onChange = function onChange(ev) {
    apiUrl = $('#inputAPIUrl').val();
    fUrl = $('#inputSiteURL').val();

    www = $("input[name=www]:checked").val() == 'true';
    https = $("input[name=https]:checked").val() == 'true';
    $('#front-url').html((https ? 'https://' : 'http://') + (www ? 'www.' : '') + fUrl);
    $('#back-url').html((https ? 'https://' : 'http://') + apiUrl);

    setTimeout(function () {
      $('#front-url').html((https ? 'https://' : 'http://') + (www ? 'www.' : '') + fUrl);
      $('#back-url').html((https ? 'https://' : 'http://') + apiUrl);
    }, 50);
  };

  $('input[name=www], input[name=https], #inputAPIUrl, #inputSiteURL').on('change keydown keyup keypress', onChange);
  onChange();
});