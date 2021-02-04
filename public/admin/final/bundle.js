(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


$(document).ready(function () {
  // Set new default font family and font color to mimic Bootstrap's default styling
  if (typeof Chart === "undefined") {
    return;
  }

  Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#292b2c';

  var ctx = document.getElementById("myAreaChart");

  var months = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };

  Ajax.get(AEnvironment.ANALYTICS_VISITORS_URL.replace('{{days}}', 13).replace('{{authtoken}}', getAuthToken()), function (resp) {
    resp = JSON.parse(resp).data;
    console.log('analytics visitors', resp);
    var labels = [];
    var datas = [];
    var max = 0;
    var min = 0;

    for (var key in resp) {
      if (resp.hasOwnProperty(key)) {
        labels.push(months[key.split('/')[1]] + ' ' + key.split('/')[2]);
        datas.push(resp[key]);
        if (max < resp[key]) {
          max = resp[key];
        }
      }
    }

    max = max + (10 - (max % 10));

    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Visitors",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          data: datas,
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              min: min,
              max: max,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  }, function (err) {
    err = JSON.parse(err);
    showToastMessage({
      title: 'Could not load analytics visitors data!',
      body: err.message || 'Something went wrong!'
    });
  });
});

},{}],2:[function(require,module,exports){

$(document).ready(function () {
  // Set new default font family and font color to mimic Bootstrap's default styling
  if (typeof Chart === "undefined") {
    return;
  }
  Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#292b2c';

  var months = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };
  Ajax.get(AEnvironment.ANALYTICS_ACTIVITY_URL.replace('{{days}}', 13).replace('{{authtoken}}', getAuthToken()), function (resp) {
    resp = JSON.parse(resp).data;
    console.log('analytics activity', resp);
    var labels = [];
    var datas = [];
    var max = 0;
    var min = 0;

    for (var key in resp) {
      if (resp.hasOwnProperty(key)) {
        labels.push(months[key.split('/')[1]] + ' ' + key.split('/')[2]);
        datas.push(resp[key]);
        if (max < resp[key]) {
          max = resp[key];
        }
      }
    }

    max = max + (10 - (max % 10));

    // Bar Chart Example
    var ctx = document.getElementById("myBarChart");
    var myLineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Activity",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: datas,
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'month'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 6
            }
          }],
          yAxes: [{
            ticks: {
              min: min,
              max: max,
              maxTicksLimit: 5
            },
            gridLines: {
              display: true
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  }, function (err) {
    err = JSON.parse(err);
    showToastMessage({
      title: 'Could not load analytics activity data!',
      body: err.message || 'Something went wrong!'
    });
  });
});
},{}],3:[function(require,module,exports){
// Call the dataTables jQuery plugin
$(document).ready(function() {
  // $('#dataTable').DataTable();
});

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
'use strict';

var AEnvironment = window.AEnvironment || {};

AEnvironment.ADMIN_COLELCTION_URL = AEnvironment.API_URL + '/admin/collection';
AEnvironment.ADMIN_COLELCTION_DISTINCT_URL = AEnvironment.API_URL + '/admin/collection/dist';

AEnvironment.SESSION_CHECK_URL = AEnvironment.API_URL + '/admin/sessioncheck';
AEnvironment.LOGIN_URL = AEnvironment.API_URL + '/admin/login';
AEnvironment.REGISTER_URL = AEnvironment.API_URL + '/admin/register';
AEnvironment.LOGOUT_URL = AEnvironment.API_URL + '/admin/logout';
AEnvironment.FORGOT_PASSWORD_URL = AEnvironment.API_URL + '/admin/forgotpassword';
AEnvironment.VALIDATE_PASS_RESET_URL = AEnvironment.API_URL + '/admin/validateresetrequest';
AEnvironment.RESET_PASSWORD_URL = AEnvironment.API_URL + '/admin/resetpassword';

AEnvironment.ANALYTICS_SUMMARY_URL = AEnvironment.API_URL + '/analytics/summary/{{authtoken}}';
AEnvironment.ANALYTICS_SESSION_DETAILS_URL = AEnvironment.API_URL + '/analytics/sessiondetails';

AEnvironment.ANALYTICS_VISITORS_URL = AEnvironment.API_URL + '/analytics/visitorsfordays/{{days}}/{{authtoken}}';
AEnvironment.ANALYTICS_ACTIVITY_URL = AEnvironment.API_URL + '/analytics/activityfordays/{{days}}/{{authtoken}}';

AEnvironment.REVIEW_URL = AEnvironment.API_URL + '/review';

AEnvironment.API_CONFIG_IS = AEnvironment.API_URL + '/isconfigured';
AEnvironment.API_CONFIG = AEnvironment.API_URL + '/siteinfo/configure';
AEnvironment.ADMIN_SETTINGS = AEnvironment.API_URL + '/siteinfo/settings';

AEnvironment.CONFIG_IS = AEnvironment.CURRENTHOST_URL + '/isconfigured';
AEnvironment.CONFIG = AEnvironment.CURRENTHOST_URL + '/configure';

AEnvironment.CONTENT_FOLDERS = AEnvironment.API_URL + '/contentfolder/site/{{authtoken}}';
AEnvironment.CONTENT_FOLDERS_BASE = AEnvironment.API_URL + '/contentfolder';

AEnvironment.CONTENT_ITEM = AEnvironment.API_URL + '/contentitem';
AEnvironment.CONTENT_ITEM_BY_FOLDER = AEnvironment.API_URL + '/contentitem/folderid/{{folderid}}/{{authtoken}}';

AEnvironment.MENU_FOLDER_SITE = AEnvironment.API_URL + '/menufolder/site/{{authtoken}}';
AEnvironment.MENU_FOLDER = AEnvironment.API_URL + '/menufolder';

AEnvironment.PAGE = AEnvironment.API_URL + '/page';
AEnvironment.PAGE_BY_FOLDER = AEnvironment.API_URL + '/page/folderid/{{folderid}}/{{authtoken}}';

AEnvironment.PAGE_CONTENT = AEnvironment.API_URL + '/pagecontent';
AEnvironment.PAGE_CONTENT_BY_PAGE = AEnvironment.API_URL + '/pagecontent/page/{{pageid}}/{{authtoken}}';
},{}],6:[function(require,module,exports){
'use strict';

var BForms = function () {
  var forms = {};
  var _id = 0;
  var idGen = function idGen() {
    return _id++;
  };
  var escapeRegExp = function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  var replaceAll = function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
  };
  window.replaceAll = replaceAll;

  var Model = function FormModel(data) {
    if (data == void 0) {
      data = {};
    }
    Object.assign(this, forms.Model.defaults(), data);
  };

  Model.prototype.getAttrByPropId = function (propId) {
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].propId == propId) {
        return this.elements[i];
      }
    }
  };

  Model.prototype.setPropValue = function (propId, val) {
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].propId == propId) {
        this.elements[i].value = val;
        break;
      }
    }
  };

  Model.prototype.toJSON = function () {
    var json = {};
    for (var i = 0; i < this.elements.length; i++) {
      json[this.elements[i].propId] = this.elements[i].value;
    }
    return json;
  };

  Model.prototype.validate = function () {
    for (var i = 0; i < this.elements.length; i++) {
      var currElement = this.elements[i];
      if (typeof currElement.validate == 'function') {
        var out = currElement.validate(currElement.value);
        if (!out) {
          return false;
        }
      }

      if (currElement.isRequired === true && currElement.value == '') {
        return false;
      }
    }

    return true;
  };

  Model.defaults = function () {
    return {
      elements: [],
      buttons: []
    };
  };

  forms.Model = Model;

  var View = function FormView(data) {
    if (data == void 0) {
      data = {};
    }
    Object.assign(this, forms.View.defaults(), data);
    this._boundFncs = [];
  };

  View.prototype.render = function () {
    this.$el.html('');
    this.$el.attr('id', this.id);
    this.$el.addClass(this.className);

    for (var i = 0; i < this.model.elements.length; i++) {
      var currAttr = this.model.elements[i];
      var currTpl = View.htmlTpls[currAttr.inputType];
      currTpl = replaceAll(currTpl, '{{propName}}', currAttr.propName);
      currTpl = replaceAll(currTpl, '{{formId}}', this.id);
      currTpl = replaceAll(currTpl, '{{propId}}', currAttr.propId || i);
      var $currTpl = $(currTpl);

      if (currAttr.inputType == 'radio') {
        for (j = 0; j < currAttr.options.length; j++) {
          var currOptn = currAttr.options[j];
          var tpl = replaceAll(View.htmlTpls['radio-item'], '{{formId}}', this.id);
          tpl = replaceAll(tpl, '{{propId}}', currAttr.propId || i);
          tpl = replaceAll(tpl, '{{optionId}}', j);
          tpl = replaceAll(tpl, '{{valueLabel}}', currOptn.valueLabel);
          tpl = replaceAll(tpl, '{{value}}', currOptn.value);
          $currTpl.append(tpl);
        }
        $currTpl.find("input[name=custom-form-radio-" + this.id + "-" + currAttr.propId || i + "][value=" + currOptn.value + "]").prop('checked', true);
        this.$el.append($currTpl);
      } else if (currAttr.inputType == 'text') {
        $currTpl.find('.custom-inputtext').val(currAttr.value);
        this.$el.append($currTpl);
      } else if (currAttr.inputType == 'textarea') {
        $currTpl.find('.custom-textarea').val(currAttr.value);
        this.$el.append($currTpl);
      } else {
        this.$el.append($currTpl);
      }
    }

    this.$el.append('<div class="button-container"></div>');

    for (var i = 0; i < this.model.buttons.length; i++) {
      var currBtn = this.model.buttons[i];
      var currTpl = View.htmlTpls.btn;
      currTpl = replaceAll(currTpl, '{{btnClassName}}', currBtn.btnClassName);
      currTpl = replaceAll(currTpl, '{{btnType}}', currBtn.btnType);
      currTpl = replaceAll(currTpl, '{{buttonId}}', currBtn.buttonId);
      currTpl = replaceAll(currTpl, '{{label}}', currBtn.label);
      currTpl = replaceAll(currTpl, '{{iconClassName}}', currBtn.iconClassName);
      var $currTpl = $(currTpl);

      if (!currBtn.iconClassName) {
        $currTpl.find('.custom-btn-icon').hide();
      }
      this.$el.find('.button-container').append($currTpl);
      this.$el.find('.button-container').append('<span class="btn-gap">&nbsp;</span>');
    }

    this.removeEventListeners();
    this.addEventListeners();

    return this;
  };

  View.prototype.addEventListeners = function () {
    var _this = this;
    this.$el.find('.custom-inputtext, .custom-textarea').bind('change keydown keyup', function (ev) {
      var propId = $(ev.target).data('id');
      var newVal = $(ev.target).val();
      var attr = _this.model.getAttrByPropId(propId);
      attr.value = newVal;
    });

    this.$el.find('.custom-inputradio').bind('change keydown keyup', function (ev) {
      var propId = $(ev.target).data('id');
      var newVal = $("input[name=custom-form-radio-" + _this.id + "-" + propId + "]:checked").val();
      var attr = _this.model.getAttrByPropId(propId);
      attr.value = newVal;
    });
  };

  View.prototype.removeEventListeners = function () {
    this.$el.find('.custom-inputtext, .custom-textarea').unbind('change keydown keyup');
    this.$el.find('.custom-inputradio').unbind('change keydown keyup');
  };

  View.prototype.bind = View.prototype.on = function (type, handler, context) {
    var _this = this;
    switch (type) {
      case 'submit':
        if (context) {
          var boundFnc = handler.bind(context);
          var onSubmit = function onSubmit(ev) {
            ev.preventDefault();
            if (!_this.model.validate()) {
              return;
            }
            return boundFnc(_this.model.toJSON(), _this, ev);
          };
          this._boundFncs.push({ fnc: onSubmit, type: type, context: context });
          this.$el.bind('submit', onSubmit);
        } else {
          this.$el.bind('submit', function (ev) {
            ev.preventDefault();
            if (!_this.model.validate()) {
              return;
            }
            return handler(_this.model.toJSON(), _this, ev);
          });
        }
        break;
    }

    if (type.indexOf('click<') != -1) {
      var regex = /(click<)(.*)(>)/;
      var btnId = regex.exec(type)[2];

      if (context) {
        var boundFnc = handler.bind(context);
        var onClick = function onClick(ev) {
          return boundFnc(_this.model.toJSON(), _this, ev);
        };
        this._boundFncs.push({ fnc: onClick, type: type, context: context });
        this.$el.find('#custom-btn-' + btnId).bind('click', onClick);
      } else {
        this.$el.find('#custom-btn-' + btnId).bind('click', function (ev) {
          return handler(_this.model.toJSON(), _this, ev);
        });
      }
    }
  };

  View.prototype.unbind = View.prototype.off = function (type, context) {
    if (context) {
      var fnc;
      for (var i = 0; i < this._boundFncs.length; i++) {
        if (this._boundFncs[i].type == type && this._boundFncs[i].context == context) {
          fnc = this._boundFncs[i].fnc;
          break;
        }
      }
      this.$el.unbind(type, fnc);
    } else {
      this.$el.unbind(type);
    }

    if (type.indexOf('click<') != -1) {
      var regex = /(click<)(.*)(>)/;
      var btnId = regex.exec(type)[2];

      if (context) {
        var fnc;
        var index = -1;
        for (var i = 0; i < this._boundFncs.length; i++) {
          if (this._boundFncs[i].type == type && this._boundFncs[i].context == context) {
            fnc = this._boundFncs[i].fnc;
            index = i;
            break;
          }
        }
        this.$el.find('#custom-btn-' + btnId).unbind('click', fnc);
        if (index != -1) {
          this._boundFncs.splice(index, 1);
        }
      } else {
        this.$el.find('#custom-btn-' + btnId).unbind('click');
      }
    }
  };

  View.htmlTpls = {};

  View._saveTpl = function (type, tpl) {
    View.htmlTpls[type] = tpl;
  };

  View.templates = {
    textarea: Ajax.get('/admin/templates/bootstrap-forms-textarea.html').then(View._saveTpl.bind(View, 'textarea')),
    text: Ajax.get('/admin/templates/bootstrap-forms-text.html').then(View._saveTpl.bind(View, 'text')),
    radio: Ajax.get('/admin/templates/bootstrap-forms-radio.html').then(View._saveTpl.bind(View, 'radio')),
    radioItem: Ajax.get('/admin/templates/bootstrap-forms-radio-item.html').then(View._saveTpl.bind(View, 'radio-item')),
    btn: Ajax.get('/admin/templates/bootstrap-forms-btn.html').then(View._saveTpl.bind(View, 'btn'))
  };

  View.defaults = function () {
    return {
      model: new Model(),
      id: 'custom-form-' + idGen(),
      el: '',
      $el: $('<form></form>'),
      className: 'custom-form'
    };
  };

  forms.View = View;
  return forms;
}();

window.BForms = BForms;

// Usage:
/* var model = new BForms.Model({
  elements: [{
    propName: 'Sample Radio',
    propId: 'myradio',
    inputType: 'radio',
    options: [{
      valueLabel: 'Yes',
      value: 'Yes'
    }, {
      valueLabel: 'No',
      value: 'No'
    }]
  }, {
    propName: 'Sample text',
    propId: 'mytext',
    value: 'My value',
    inputType: 'text',
    isRequired: true
  }, {
    propName: 'Sample text box',
    propId: 'mybox',
    inputType: 'textarea'
  }],
  buttons: [{
    label: 'Ok',
    buttonId: 'ok-btn',
    btnClassName: 'primary',
    btnType: 'submit',
    iconClassName: 'fas fa-edit'
  }, {
    label: 'Cancel',
    buttonId: 'cancel-btn',
    btnClassName: 'default',
    btnType: 'button',
    iconClassName: ''
  }]
});
var view = new BForms.View({ model: model });
*/
},{}],7:[function(require,module,exports){
'use strict';

$(document).ready(function () {
  if (currentPage == 'admincontent') {
    var treeData;
    var currModalType = '';

    var getFolderPathRec = function getFolderPathRec(currPath, currNode, id) {
      if (currNode.id == id) {
        return currPath + '/' + currNode.name;
      }

      var path = currPath + '/' + currNode.name;
      for (var i = 0; i < currNode.nodes.length; i++) {
        var currPath = getFolderPathRec(path, currNode.nodes[i], id);
        if (currPath) {
          return currPath;
        }
      }
      return null;
    };

    var getFolderPathById = function getFolderPathById(id) {
      return getFolderPathRec('~', treeData, id);
    };

    var fetchContentFolder = function fetchContentFolder() {
      Ajax.get(AEnvironment.CONTENT_FOLDERS.replace('{{authtoken}}', getAuthToken()), function (resp) {
        resp = JSON.parse(resp);
        var updateFolders = function updateFolders(root) {
          root.text = root.name;
          for (var i = 0; i < root.nodes.length; i++) {
            root.nodes[i] = updateFolders(root.nodes[i]);
          }
          return root;
        };
        resp = updateFolders(resp);
        console.log('cont folders', resp);
        treeData = resp;

        $('.admin-tree').treeview('remove');
        $('.admin-tree').treeview({
          data: [resp],
          expandIcon: 'fa fa-plus',
          collapseIcon: 'fa fa-minus',
          emptyIcon: 'fa',
          nodeIcon: '',
          showBorder: true,
          showIcon: true
        });
      }, getErrorFnc({
        errorTitle: 'Error occured while fetching content folders'
      }));
    };

    var fetchContentItemsbyFolder = function fetchContentItemsbyFolder(id) {
      return new Promise(function (res, rej) {
        Ajax.get(AEnvironment.CONTENT_ITEM_BY_FOLDER.replace('{{folderid}}', id).replace('{{authtoken}}', getAuthToken()), function (resp) {
          resp = JSON.parse(resp);
          console.log('fetch content items', resp);
          res(resp);
        }, function (err) {
          rej(err);
          getErrorFnc({
            errorTitle: 'Error fetching content for this folder',
            errorMsg: 'Please try again later'
          })(err);
        });
      });
    };

    window.fetchItemsAndDisplay = function () {
      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
      fetchContentItemsbyFolder(node.id).then(function (items) {
        window.currentItems = items;
        if (items.length == 0) {
          $('.main-item-msg').html('<p class="">No items available in this folder</p>');
        } else {
          $('.main-item-msg').html('<p class=""></p>');
        }

        getItemTemplateProm.then(function (tpl) {
          var str = '';
          for (var i = 0; i < items.length; i++) {
            var currStr = tpl;
            var currItem = items[i];
            currStr = replaceAll(currStr, '{{{itemtitle}}}', currItem.name);
            currStr = replaceAll(currStr, '{{{itemdesc}}}', currItem.desc);
            currStr = replaceAll(currStr, '{{{itemtype}}}', ContentItemTypesDisplayTitles[ContentItemTypes[currItem.type]]);
            currStr = replaceAll(currStr, '{{{itemlasteditedtime}}}', timeSince(new Date(currItem.lastmodifiedtime * 1000)) + ' ago');
            currStr = replaceAll(currStr, '{{{itemid}}}', currItem.id);

            str += currStr;
          }
          $('.main-items-area .list-group').html(str);
          $('.main-items-area .list-group .main-items-adv-edit-btn').hide();
          $('.main-items-area .list-group .main-items-select-btn').hide();
          window.bindItemEditEvents();
        }, getErrorFnc());
      });
    };

    var bindTreeEvents = function bindTreeEvents() {
      $('.admin-tree-parent').click(function (event) {
        if ($(event.target).hasClass('list-group-item') && $('.node-selected').data('nodeid') != void 0) {
          var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
          window.fetchItemsAndDisplay();
          var folderpath = getFolderPathById(node.id);
          var folders = folderpath.split('/');
          folders[folders.length - 1] = '<strong>' + folders[folders.length - 1] + '</strong>';
          folderpath = folders.join('/');
          $('.folder-path').html(folderpath);
        }
      });
    };

    fetchContentFolder();
    bindTreeEvents();

    $('#addEditFolderModal').on('show.bs.modal', function (event) {
      if ($('.node-selected').length == 0) {
        $('#addEditFolderModal').modal('hide');
        return;
      }
      var button = $(event.relatedTarget);
      var purpose = button.data('purpose');
      var modal = $(this);
      var title;
      if (purpose == 'add') {
        title = 'Add new content folder';
      } else if (purpose == 'edit') {
        title = 'Rename content folder';
      }

      modal.find('.modal-title').text(title);
      if (purpose == 'add') {
        var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
        modal.find('.parent-folder-para').show();
        modal.find('.parent-folder-name').text(node.text);
      } else if (purpose == 'edit') {
        var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
        modal.find('#folder-name').val(node.text);
        modal.find('.parent-folder-para').hide();
      }
      currModalType = purpose;
    });

    $('#deleteFolderModal').on('show.bs.modal', function (event) {
      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));

      $('#deleteFolderModal').find('.delete-fldr-title').text(node.text);
    });

    $('.tree-add-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        ev.stopPropagation();
        ev.preventDefault();
        getErrorFnc({
          errorTitle: 'Cannot add a folder',
          errorMsg: 'Please select a folder to add to'
        })('{}');
        return false;
      }
    });

    $('.tree-edit-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        ev.stopPropagation();
        ev.preventDefault();
        getErrorFnc({
          errorTitle: 'Cannot rename a folder',
          errorMsg: 'Please select a folder to rename'
        })('{}');
        return false;
      }
    });

    $('.tree-remove-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot delete a folder',
          body: 'Please select a folder to delete'
        });
        return;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));

      if (node.folderid == UUID_NIL) {
        showToastMessage({
          title: 'Cannot delete a folder',
          body: 'You cannot delete your core parent folder'
        });
        return;
      }

      $('#deleteFolderModal').modal('show');
    });

    $('.add-edit-save-btn').click(function (ev) {
      var newFolderName = $('#folder-name').val();
      var newFolderDesc = $('#folder-desc').val();

      if (!newFolderName) {
        showToastMessage({
          title: 'Please enter folder name',
          body: 'folder name must be non empty'
        });
        return;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));

      var reqData = {
        name: newFolderName,
        desc: newFolderDesc,
        authtoken: getAuthToken()
      };
      if (currModalType == 'add') {
        reqData.folderid = node.id;
        reqData.createdby = user.id;
      } else if (currModalType == 'edit') {
        reqData.folderid = node.folderid;
        reqData.id = node.id;
        reqData.lastmodifiedby = user.id;
      }

      Ajax.put(AEnvironment.CONTENT_FOLDERS_BASE, reqData).then(json).then(function (resp) {
        console.log('put c folder', resp);
        fetchContentFolder();
        $('#addEditFolderModal').modal('hide');
      }, getErrorFnc({
        errorTitle: 'Cannot add/edit content folder',
        errorMsg: 'Cannot add/edit content folder, please try again later'
      }));
    });

    $('.confirm-delete-fldr-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot delete a folder',
          body: 'Please select a folder to delete'
        });
        return false;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
      Ajax.delete(AEnvironment.CONTENT_FOLDERS_BASE, {
        id: node.id,
        authtoken: getAuthToken(),
        folderid: node.folderid
      }).then(json).then(function (resp) {
        console.log('delete c folder', resp);
        fetchContentFolder();
        $('#deleteFolderModal').modal('hide');
      }, getErrorFnc());
    });
  }
});
},{}],8:[function(require,module,exports){
'use strict';

var ContentItemTypes = ACommon.EnumGenerator({
  PLAIN_TEXT: 1,
  HTML: 2,
  JSON: 3,
  XML: 4
});
window.ContentItemTypes = ContentItemTypes;

var ContentItemTypesDisplayTitles = ACommon.EnumGenerator({
  PLAIN_TEXT: 'Plaintext',
  HTML: 'HTML',
  JSON: 'JSON',
  XML: 'XML'
});
window.ContentItemTypesDisplayTitles = ContentItemTypesDisplayTitles;

$(document).ready(function () {
  if (currentPage !== "adminmenuspages") {
    return;
  }
  var treeData;
  var tplModalProm = Ajax.get('/admin/templates/content-modal-select.html');
  var contentModal = new BModal({
    headerText: 'Select Content Item',
    body: '',
    size: BModal.SIZE.LARGE,
    buttons: [{
      label: 'Cancel',
      buttonId: 'content-cancel-btn',
      btnClassName: 'secondary',
      btnType: 'button',
      iconClassName: '',
      onClick: function onClick(modal, ev) {
        modal.hide();
        $(contentModal).trigger('content-item-selection-cancelled', { modal: modal, event: ev });
      }
    }]
  });

  var fetchContentFolder = function fetchContentFolder() {
    Ajax.get(AEnvironment.CONTENT_FOLDERS.replace('{{authtoken}}', getAuthToken()), function (resp) {
      resp = JSON.parse(resp);
      var updateFolders = function updateFolders(root) {
        root.text = root.name;
        for (var i = 0; i < root.nodes.length; i++) {
          root.nodes[i] = updateFolders(root.nodes[i]);
        }
        return root;
      };
      resp = updateFolders(resp);
      console.log('cont folders', resp);
      treeData = resp;

      contentModal.$el.find('.content-folder-tree').treeview('remove');
      contentModal.$el.find('.content-folder-tree').treeview({
        data: [resp],
        expandIcon: 'fa fa-plus',
        collapseIcon: 'fa fa-minus',
        emptyIcon: 'fa',
        nodeIcon: '',
        showBorder: true,
        showIcon: true
      });
    }, getErrorFnc());
  };

  var fetchContentItemsbyFolder = function fetchContentItemsbyFolder(id) {
    return new Promise(function (res, rej) {
      Ajax.get(AEnvironment.CONTENT_ITEM_BY_FOLDER.replace('{{folderid}}', id).replace('{{authtoken}}', getAuthToken()), function (resp) {
        resp = JSON.parse(resp);
        console.log('fetch content items', resp);
        res(resp);
      }, function (err) {
        rej(err);
        getErrorFnc({
          errorTitle: 'Error fetching content for this folder',
          errorMsg: 'Please try again later'
        })(err);
      });
    });
  };

  var fetchItemsAndDisplay = function fetchItemsAndDisplay() {
    var node = contentModal.$el.find('.content-folder-tree').treeview('getNode', contentModal.$el.find('.node-selected').data('nodeid'));
    fetchContentItemsbyFolder(node.id).then(function (items) {
      window.currentItems = items;
      if (items.length == 0) {
        contentModal.$el.find('.content-modal-item-msg').html('<p class="">No items available in this folder</p>');
      } else {
        contentModal.$el.find('.content-modal-item-msg').html('<p class=""></p>');
      }

      getItemTemplateProm.then(function (tpl) {
        var str = '';
        for (var i = 0; i < items.length; i++) {
          var currStr = tpl;
          var currItem = items[i];
          currStr = replaceAll(currStr, '{{{itemtitle}}}', currItem.name);
          currStr = replaceAll(currStr, '{{{itemdesc}}}', currItem.desc);
          currStr = replaceAll(currStr, '{{{itemtype}}}', ContentItemTypesDisplayTitles[ContentItemTypes[currItem.type]]);
          currStr = replaceAll(currStr, '{{{itemlasteditedtime}}}', timeSince(new Date(currItem.lastmodifiedtime * 1000)) + ' ago');
          currStr = replaceAll(currStr, '{{{itemid}}}', currItem.id);

          str += currStr;
        }
        contentModal.$el.find('.content-modal-items-area .list-group').html(str);
        contentModal.$el.find('.content-modal-items-area .list-group button').hide();
        contentModal.$el.find('.content-modal-items-area .list-group .main-items-select-btn').show();
        contentModal.$el.find('.content-modal-items-area .list-group .main-items-select-btn').click(function (ev) {
          var contentItemId = $(ev.currentTarget).attr('data-itemid');
          $(contentModal).trigger('content-item-selected', { modal: contentModal, event: ev, contentItemId: contentItemId });
        });
      }, getErrorFnc());
    });
  };

  var getFolderPathRec = function getFolderPathRec(currPath, currNode, id) {
    if (currNode.id == id) {
      return currPath + '/' + currNode.name;
    }

    var path = currPath + '/' + currNode.name;
    for (var i = 0; i < currNode.nodes.length; i++) {
      var currPath = getFolderPathRec(path, currNode.nodes[i], id);
      if (currPath) {
        return currPath;
      }
    }
    return null;
  };

  var getFolderPathById = function getFolderPathById(id) {
    return getFolderPathRec('~', treeData, id);
  };

  var bindTreeEvents = function bindTreeEvents() {
    contentModal.$el.find('.content-modal-folder-tree-parent').click(function (event) {
      if ($(event.target).hasClass('list-group-item') && contentModal.$el.find('.node-selected').data('nodeid') != void 0) {
        var node = contentModal.$el.find('.content-folder-tree').treeview('getNode', contentModal.$el.find('.node-selected').data('nodeid'));
        fetchItemsAndDisplay();
        var folderpath = getFolderPathById(node.id);
        var folders = folderpath.split('/');
        folders[folders.length - 1] = '<strong>' + folders[folders.length - 1] + '</strong>';
        folderpath = folders.join('/');
        contentModal.$el.find('.content-modal-folder-path').html(folderpath);
      }
    });
  };

  /**
   * @type {BModal}
   * @property {gl_contentModal}
   */
  window.gl_contentModal = contentModal;

  contentModal.render().then(function () {
    $('.modal-parent-cont').append(contentModal.$el);
    tplModalProm.then(function (tpl) {
      contentModal.$el.find('.other-main-container').html(tpl);
      fetchContentFolder();
      bindTreeEvents();
    });
  });
});
},{}],9:[function(require,module,exports){
'use strict';

var ContentItemTypes = ACommon.EnumGenerator({
  PLAIN_TEXT: 1,
  HTML: 2,
  JSON: 3,
  XML: 4
});
window.ContentItemTypes = ContentItemTypes;

var ContentItemTypesDisplayTitles = ACommon.EnumGenerator({
  PLAIN_TEXT: 'Plaintext',
  HTML: 'HTML',
  JSON: 'JSON',
  XML: 'XML'
});
window.ContentItemTypesDisplayTitles = ContentItemTypesDisplayTitles;

var selectedItemId;
var getItemById = function getItemById(id) {
  if (id == void 0) {
    id = selectedItemId;
  }
  var selectedItem;

  for (var i = 0; i < window.currentItems.length; i++) {
    var currItem = window.currentItems[i];
    if (currItem.id == id) {
      selectedItem = currItem;
      break;
    }
  }
  return selectedItem;
};

$(document).ready(function () {
  if (typeof currentPage == 'string' && currentPage == 'admincontent') {
    var modalType = '';

    window.bindItemEditEvents = function () {
      $('.main-items-edit-btn').click(function (ev) {
        selectedItemId = $(ev.currentTarget).attr('data-itemid');
        var selectedItem = getItemById(selectedItemId);

        if (!selectedItem) {
          showToastMessage({
            title: 'And error occured',
            body: 'Selected item cannot be found in list'
          });
          return;
        }

        $('#addedit-item-type').val(ContentItemTypesDisplayTitles[ContentItemTypes[selectedItem.type]]).attr('disabled', true);
        $('#addedit-item-name').val(selectedItem.name);
        $('#addedit-item-desc').val(selectedItem.desc);
        $('#addedit-item-itemmain').val(selectedItem.contentstr);

        $('.parent-item-para').hide();
        $('#addEditItemModal').modal('show');
        modalType = 'edit';
      });

      $('.main-items-remove-btn').click(function (ev) {
        selectedItemId = $(ev.currentTarget).attr('data-itemid');
        var selectedItem = getItemById(selectedItemId);

        $('#deleteItemModal').find('.delete-item-title').text(selectedItem.name);
        $('#deleteItemModal').modal('show');
      });
    };

    $('.main-items-add-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot insert item',
          body: 'Please select a folder to add item to'
        });
        return;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));

      $('#addedit-item-type').val('');
      $('#addedit-item-name').val('');
      $('#addedit-item-desc').val('');
      $('#addedit-item-itemmain').val('');

      $('.parent-item-para').show();
      $('.parent-item-name').text(node.text);
      $('#addedit-item-type').removeAttr('disabled');
      $('#addEditItemModal').modal('show');
      modalType = 'add';
    });

    $('.add-edit-item-save-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot insert item',
          body: 'Please select a folder to add item to'
        });
        return;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));

      var reqData = {};

      reqData.authtoken = getAuthToken();

      reqData.name = $('#addedit-item-name').val();
      reqData.desc = $('#addedit-item-desc').val();
      reqData.contentstr = $('#addedit-item-itemmain').val();
      reqData.lastmodifiedby = window.user.id;

      if (modalType == 'edit') {
        reqData.id = selectedItemId;
      } else if (modalType == 'add') {
        reqData.folderid = node.id;
        reqData.createdby = window.user.id;
        reqData.type = ContentItemTypes[ContentItemTypesDisplayTitles[$('#addedit-item-type').val()]];
      }

      Ajax.put(AEnvironment.CONTENT_ITEM, reqData).then(json).then(function (resp) {
        console.log('Put c item', resp);
        window.fetchItemsAndDisplay();
        $('#addEditItemModal').modal('hide');
      }, getErrorFnc());
    });

    $('.confirm-delete-item-btn').click(function (ev) {
      if (!selectedItemId) {
        showToastMessage({
          title: 'Cannot delete an item',
          body: 'Item id not found, refresh to continue'
        });
        return false;
      }

      Ajax.delete(AEnvironment.CONTENT_ITEM, {
        id: selectedItemId,
        authtoken: getAuthToken(),
        lastmodifiedby: window.user.id
      }).then(json).then(function (resp) {
        console.log('delete c item', resp);
        window.fetchItemsAndDisplay();
        $('#deleteItemModal').modal('hide');
      }, getErrorFnc());
    });
  }
});
},{}],10:[function(require,module,exports){
'use strict';

require('./scripts');
require('../assets/demo/chart-area-demo');
require('../assets/demo/chart-bar-demo');
require('../assets/demo/datatables-demo');
require('../../js/common/ajax');
require('../../js/common/browser');
require('../../js/common/app');
require('./app');
require('./admin-main');
require('./content-folders');
require('./content-items');
require('./bootstrap-forms');
require('./../../packages/bootstrap-modal/js/bootstrap-modals');
require('./pagecontent-adv-modal');
require('./content-item-modal');
require('./menus-folders');
require('./pages-items');
},{"../../js/common/ajax":15,"../../js/common/app":16,"../../js/common/browser":17,"../assets/demo/chart-area-demo":1,"../assets/demo/chart-bar-demo":2,"../assets/demo/datatables-demo":3,"./../../packages/bootstrap-modal/js/bootstrap-modals":18,"./admin-main":4,"./app":5,"./bootstrap-forms":6,"./content-folders":7,"./content-item-modal":8,"./content-items":9,"./menus-folders":11,"./pagecontent-adv-modal":12,"./pages-items":13,"./scripts":14}],11:[function(require,module,exports){
'use strict';

var tpls = {
  addEditFolderModal: Ajax.get('/admin/templates/add-edit-folder-modal.html'),
  addEditItemModal: Ajax.get('/admin/templates/add-edit-item-modal.html'),
  deleteFolderModal: Ajax.get('/admin/templates/delete-folder-modal.html'),
  deleteItemModal: Ajax.get('/admin/templates/delete-item-modal.html')
};

var modalGeneratorFnc = function modalGeneratorFnc(command) {
  return function (id) {
    $('#' + id).modal(command);
  };
};

var folderConfig = {
  pageName: 'adminmenuspages',
  contentByFolderURL: AEnvironment.PAGE_BY_FOLDER,
  siteFolderTreeURL: AEnvironment.MENU_FOLDER_SITE,
  folderDeleteURL: AEnvironment.MENU_FOLDER,
  folderPutURL: AEnvironment.MENU_FOLDER
};

var showModal = modalGeneratorFnc('show');
var hideModal = modalGeneratorFnc('hide');

if (currentPage == folderConfig.pageName) {
  var treeData;
  var currModalType;

  $(document).ready(function () {
    tpls.addEditFolderModal.then(function (tpl) {
      $('.modal-parent-cont').append(tpl);

      $('.add-edit-save-btn').click(function (ev) {
        var newFolderName = $('#folder-name').val();
        var newFolderDesc = $('#folder-desc').val();

        if (!newFolderName) {
          showToastMessage({
            title: 'Please enter folder name',
            body: 'folder name must be non empty'
          });
          return;
        }

        var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
        // var parNode = $('.admin-tree').treeview('getNode', node.folderid);
        var newDisOrder = node.nodes.length + 1;

        var reqData = {
          name: newFolderName,
          desc: newFolderDesc,
          authtoken: getAuthToken()
        };
        if (currModalType == 'add') {
          reqData.folderid = node.id;
          reqData.createdby = user.id;
          reqData.displayOrder = newDisOrder;
        } else if (currModalType == 'edit') {
          reqData.folderid = node.folderid;
          reqData.id = node.id;
          reqData.lastmodifiedby = user.id;
          reqData.displayOrder = node.displayOrder;
        }

        Ajax.put(folderConfig.folderPutURL, reqData).then(json).then(function (resp) {
          console.log('put folder', resp);
          fetchFolderData();
          $('#addEditFolderModal').modal('hide');
        }, getErrorFnc({
          errorTitle: 'Cannot add/edit content folder',
          errorMsg: 'Cannot add/edit content folder, please try again later'
        }));
      });
    });
    tpls.addEditItemModal.then(function (tpl) {
      $('.modal-parent-cont').append(tpl);
    });
    tpls.deleteFolderModal.then(function (tpl) {
      $('.modal-parent-cont').append(tpl);
    });
    tpls.deleteItemModal.then(function (tpl) {
      $('.modal-parent-cont').append(tpl);
    });

    var getFolderPathRec = function getFolderPathRec(currPath, currNode, id) {
      if (currNode.id == id) {
        return currPath + '/' + currNode.name;
      }

      var path = currPath + '/' + currNode.name;
      for (var i = 0; i < currNode.nodes.length; i++) {
        var currPath = getFolderPathRec(path, currNode.nodes[i], id);
        if (currPath) {
          return currPath;
        }
      }
      return null;
    };

    var getFolderPathById = function getFolderPathById(id) {
      return getFolderPathRec('~', treeData, id);
    };

    window.getFolderPathById = getFolderPathById;

    var fetchtItemsbyFolder = function fetchtItemsbyFolder(id) {
      return new Promise(function (res, rej) {
        Ajax.get(folderConfig.contentByFolderURL.replace('{{folderid}}', id).replace('{{authtoken}}', getAuthToken()), function (resp) {
          resp = JSON.parse(resp);
          console.log('fetch items', resp);
          res(resp);
        }, function (err) {
          rej(err);
          getErrorFnc({
            errorTitle: 'Error fetching pages for this folder',
            errorMsg: 'Please try again later'
          })(err);
        });
      });
    };

    window.fetchItemsAndDisplay = function () {
      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
      fetchtItemsbyFolder(node.id).then(function (items) {
        window.currentItems = items;
        if (items.length == 0) {
          $('.main-item-msg').html('<p class="">No items available in this folder</p>');
        } else {
          $('.main-item-msg').html('<p class=""></p>');
        }

        getItemTemplateProm.then(function (tpl) {
          var str = '';
          for (var i = 0; i < items.length; i++) {
            var currStr = tpl;
            var currItem = items[i];
            currStr = replaceAll(currStr, '{{{itemtitle}}}', currItem.name);
            currStr = replaceAll(currStr, '{{{itemdesc}}}', currItem.desc);
            currStr = replaceAll(currStr, '{{{itemlasteditedtime}}}', timeSince(new Date(currItem.lastmodifiedtime * 1000)) + ' ago');
            currStr = replaceAll(currStr, '{{{itemid}}}', currItem.id);

            str += currStr;
          }
          $('.main-items-area .list-group').html(str);
          $('.main-items-area .list-group .item-type').hide();
          $('.main-items-area .list-group .main-items-select-btn').hide();
          window.bindItemEditEvents();
        }, getErrorFnc());
      });
    };

    var bindTreeEvents = function bindTreeEvents() {
      $('.admin-tree-parent').click(function (event) {
        if ($(event.target).hasClass('list-group-item') && $('.node-selected').data('nodeid') != void 0) {
          var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
          window.fetchItemsAndDisplay();
          var folderpath = getFolderPathById(node.id);
          var folders = folderpath.split('/');
          folders[folders.length - 1] = '<strong>' + folders[folders.length - 1] + '</strong>';
          folderpath = folders.join('/');
          $('.folder-path').html(folderpath);
        }
      });
    };

    var fetchFolderData = function fetchFolderData() {
      Ajax.get(folderConfig.siteFolderTreeURL.replace('{{authtoken}}', getAuthToken())).then(json).then(function (resp) {
        var updateFolders = function updateFolders(root) {
          root.text = root.name;
          for (var i = 0; i < root.nodes.length; i++) {
            root.nodes[i] = updateFolders(root.nodes[i]);
          }
          return root;
        };
        resp = updateFolders(resp);
        console.log('folders', resp);
        treeData = resp;

        $('.admin-tree').treeview('remove');
        $('.admin-tree').treeview({
          data: [resp],
          expandIcon: 'fa fa-plus',
          collapseIcon: 'fa fa-minus',
          emptyIcon: 'fa',
          nodeIcon: '',
          showBorder: true,
          showIcon: true
        });
      });
    };

    $('.tree-remove-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot delete a folder',
          body: 'Please select a folder to delete'
        });
        return;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));

      if (node.folderid == UUID_NIL) {
        showToastMessage({
          title: 'Cannot delete a folder',
          body: 'You cannot delete your core parent folder'
        });
        return;
      }

      $('#deleteFolderModal').modal('show');
    });

    $('.tree-add-btn').click(function () {
      if ($('.node-selected').length == 0) {
        $('#addEditFolderModal').modal('hide');
        getErrorFnc({
          errorTitle: 'Cannot add a folder',
          errorMsg: 'Please select a folder to add to'
        })('{}');
        return false;
      }

      currModalType = 'add';

      var title;
      if (currModalType == 'add') {
        title = 'Add new content folder';
      } else if (currModalType == 'edit') {
        title = 'Rename content folder';
      }

      var modal = $('#addEditFolderModal');

      modal.find('.modal-title').text(title);
      if (currModalType == 'add') {
        var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
        modal.find('.parent-folder-para').show();
        modal.find('.parent-folder-name').text(node.text);
      } else if (currModalType == 'edit') {
        var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
        modal.find('#folder-name').val(node.text);
        modal.find('.parent-folder-para').hide();
      }
      showModal('addEditFolderModal');
    });

    $('.tree-edit-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        ev.stopPropagation();
        ev.preventDefault();
        getErrorFnc({
          errorTitle: 'Cannot rename a folder',
          errorMsg: 'Please select a folder to rename'
        })('{}');
        return false;
      }

      currModalType = 'add';
    });

    $('.confirm-delete-fldr-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot delete a folder',
          body: 'Please select a folder to delete'
        });
        return false;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
      Ajax.delete(folderConfig.folderDeleteURL, {
        id: node.id,
        authtoken: getAuthToken(),
        folderid: node.folderid
      }).then(json).then(function (resp) {
        console.log('delete folder', resp);
        fetchFolderData();
        $('#deleteFolderModal').modal('hide');
      }, getErrorFnc());
    });

    fetchFolderData();
    bindTreeEvents();
  });
}
},{}],12:[function(require,module,exports){
'use strict';

$(document).ready(function () {
  var tplModalProm = Ajax.get('/admin/templates/pagecontent-adv-modal.html');
  var pageContentAdvModal = new BModal({
    headerText: 'Edit Page content for ',
    body: '<p>Here you can customize your page</p><p>As soon as you attach content items here items will be saved automatically</p>',
    size: BModal.SIZE.LARGE,
    buttons: [{
      label: 'Done',
      buttonId: 'page-content-done-btn',
      btnClassName: 'secondary',
      btnType: 'button',
      iconClassName: '',
      onClick: function onClick(modal, ev) {
        modal.hide();
      }
    }]
  });

  /**
   * @type {BModal}
   * @property {gl_pageContentAdvModal}
   */
  window.gl_pageContentAdvModal = pageContentAdvModal;

  pageContentAdvModal.render().then(function () {
    $('.modal-parent-cont').append(pageContentAdvModal.$el);
    tplModalProm.then(function (tpl) {
      pageContentAdvModal.$el.find('.other-main-container').html(tpl);
      pageContentAdvModal.$el.find('.page-content-modal-add-content').click(function (ev) {
        window.gl_contentModal.show();
      });

      $(window.gl_contentModal).on('content-item-selected', function (ev, data) {
        console.log('content item selected', data.contentItemId);

        // save data.contentItemId with pageContentAdvModal.attrs.pageid
        var displayOrder = 1;
        if (pageContentAdvModal.attrs.pageContentList) {
          displayOrder = pageContentAdvModal.attrs.pageContentList.length + 1;
        }
        var reqData = {
          authtoken: getAuthToken(),
          pageid: pageContentAdvModal.attrs.pageid,
          contentid: data.contentItemId,
          displayOrder: displayOrder
        };

        Ajax.put(AEnvironment.PAGE_CONTENT, reqData).then(json).then(function (resp) {
          window.gl_contentModal.hide();
        }, getErrorFnc());
      });
    });
  });

  var fetchPageContent = function fetchPageContent() {
    if (pageContentAdvModal.attrs.pageid) {
      Ajax.get(AEnvironment.PAGE_CONTENT_BY_PAGE.replace('{{pageid}}', pageContentAdvModal.attrs.pageid).replace('{{authtoken}}', getAuthToken())).then(json).then(function (data) {
        console.log('page content', data);
        pageContentAdvModal.attrs.pageContentList = data;

        getItemTemplateProm.then(function (tpl) {
          if (data.length == 0) {
            pageContentAdvModal.$el.find('.page-content-modal-item-msg').html('No content added in this page yet');
          }

          var str = '';
          for (var i = 0; i < data.length; i++) {
            var currStr = tpl;
            var currItem = data[i];
            currStr = replaceAll(currStr, '{{{itemtitle}}}', currItem.name);
            currStr = replaceAll(currStr, '{{{itemdesc}}}', currItem.desc);
            currStr = replaceAll(currStr, '{{{itemlasteditedtime}}}', '');
            currStr = replaceAll(currStr, '{{{itemtype}}}', ContentItemTypesDisplayTitles[ContentItemTypes[currItem.type]]);
            currStr = replaceAll(currStr, '{{{itemid}}}', currItem.id);
            currStr = replaceAll(currStr, '{{{mappingid}}}', currItem.mappingid);

            str += currStr;
          }
          pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group').html(str);
          pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group button').hide();
          pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group .main-items-remove-btn').show();
          pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group .main-items-remove-btn').click(function (ev) {
            $(pageContentAdvModal).trigger('page-content-item-removed', { modal: pageContentAdvModal, event: ev });
            var contentItemId = $(ev.currentTarget).attr('data-itemid');
            var mappingId = $(ev.currentTarget).attr('data-mappingid');

            var reqData = {
              id: mappingId,
              authtoken: getAuthToken(),
              pageid: pageContentAdvModal.attrs.pageid,
              contentid: contentItemId
            };
            Ajax.delete(AEnvironment.PAGE_CONTENT, reqData).then(json).then(function (resp) {
              console.log('page content deleted', resp);
            }, getErrorFnc());
          });
        }, getErrorFnc());
      });
    }
  };

  pageContentAdvModal.updatePageId = function (pageid) {
    pageContentAdvModal.attrs.pageid = pageid;
    fetchPageContent();
  };
});
},{}],13:[function(require,module,exports){
'use strict';

var selectedItemId;
var selectedNodeId;
var getItemById = function getItemById(id) {
  if (id == void 0) {
    id = selectedItemId;
  }
  var selectedItem;

  for (var i = 0; i < window.currentItems.length; i++) {
    var currItem = window.currentItems[i];
    if (currItem.id == id) {
      selectedItem = currItem;
      break;
    }
  }
  return selectedItem;
};

var pageConfig = {
  pageName: 'adminmenuspages',
  putURL: AEnvironment.PAGE,
  deleteURL: AEnvironment.PAGE,
  postURL: AEnvironment.PAGE
};

$(document).ready(function () {
  if (typeof currentPage == 'string' && currentPage == pageConfig.pageName) {
    var modalType = '';

    window.bindItemEditEvents = function () {
      $('.main-items-edit-btn').click(function (ev) {
        selectedItemId = $(ev.currentTarget).attr('data-itemid');
        var selectedItem = getItemById(selectedItemId);

        if (!selectedItem) {
          showToastMessage({
            title: 'And error occured',
            body: 'Selected item cannot be found in list'
          });
          return;
        }

        var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
        selectedNodeId = node.id;
        var path = window.getFolderPathById(node.id);

        addNewPageModal.body = '<p>You are currently in ' + path + '</p><p>Add basic details for your page</p>';
        modalType = 'edit';
        addNewPageModal.formView.model.setPropValue('pagename', selectedItem.name);
        addNewPageModal.formView.model.setPropValue('pagedesc', selectedItem.desc);
        addNewPageModal.formView.model.setPropValue('pageurl', selectedItem.urlfrdnlyname);
        addNewPageModal.formView.model.setPropValue('pageseokeywords', selectedItem.metaKeyword);
        addNewPageModal.formView.model.setPropValue('pageseodesc', selectedItem.metaDesc);
        addNewPageModal.formView.render();
        bindAddEditItemModalEvents();
        addNewPageModal.show();
      });

      $('.main-items-remove-btn').click(function (ev) {
        selectedItemId = $(ev.currentTarget).attr('data-itemid');
        var selectedItem = getItemById(selectedItemId);

        /* $('#deleteItemModal').find('.delete-item-title').text(selectedItem.name);
        $('#deleteItemModal').modal('show'); */

        confirmDeleteModal.headerText = 'Are you sure you want to delete `' + selectedItem.name + '` page?';
        confirmDeleteModal.show();
      });

      $('.main-items-adv-edit-btn').click(function (ev) {
        selectedItemId = $(ev.currentTarget).attr('data-itemid');
        var selectedItem = getItemById(selectedItemId);

        window.gl_pageContentAdvModal.headerText = 'Edit Page content for <strong>' + selectedItem.name + '</strong>';
        window.gl_pageContentAdvModal.updatePageId(selectedItemId);
        window.gl_pageContentAdvModal.show();
      });
    };

    $('.main-items-add-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot insert item',
          body: 'Please select a folder to add item to'
        });
        return;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));
      selectedNodeId = node.id;
      var path = window.getFolderPathById(node.id);

      addNewPageModal.body = '<p>You are currently in ' + path + '</p><p>Add basic details for your page</p>';
      modalType = 'add';
      addNewPageModal.show();
    });

    $('.add-edit-item-save-btn').click(function (ev) {
      if ($('.node-selected').length == 0) {
        showToastMessage({
          title: 'Cannot insert item',
          body: 'Please select a folder to add item to'
        });
        return;
      }

      var node = $('.admin-tree').treeview('getNode', $('.node-selected').data('nodeid'));

      var reqData = {};

      reqData.authtoken = getAuthToken();

      reqData.name = $('#addedit-item-name').val();
      reqData.desc = $('#addedit-item-desc').val();
      // reqData.contentstr = $('#addedit-item-itemmain').val();
      reqData.lastmodifiedby = window.user.id;

      if (modalType == 'edit') {
        reqData.id = selectedItemId;
      } else if (modalType == 'add') {
        reqData.folderid = node.id;
        reqData.createdby = window.user.id;
        // reqData.type = ContentItemTypes[ContentItemTypesDisplayTitles[$('#addedit-item-type').val()]];
      }

      Ajax.put(pageConfig.putURL, reqData).then(json).then(function (resp) {
        console.log('Put c item', resp);
        window.fetchItemsAndDisplay();
        $('#addEditItemModal').modal('hide');
      }, getErrorFnc());
    });

    $('.confirm-delete-item-btn').click(function (ev) {
      if (!selectedItemId) {
        showToastMessage({
          title: 'Cannot delete an item',
          body: 'Item id not found, refresh to continue'
        });
        return false;
      }

      Ajax.delete(pageConfig.deleteURL, {
        id: selectedItemId,
        authtoken: getAuthToken(),
        lastmodifiedby: window.user.id
      }).then(json).then(function (resp) {
        console.log('delete c item', resp);
        window.fetchItemsAndDisplay();
        $('#deleteItemModal').modal('hide');
      }, getErrorFnc());
    });

    var addNewPageModal = new BModal({
      headerText: 'Add a new page',
      body: '<p>You are currently in </p><p>Add basic details for your page</p>',
      size: BModal.SIZE.LARGE,
      formData: {
        elements: [{
          propName: 'Page Name *',
          propId: 'pagename',
          value: '',
          inputType: 'text',
          isRequired: true
        }, {
          propName: 'Desription',
          propId: 'pagedesc',
          inputType: 'textarea'
        }, {
          propName: 'Page URL * (index URL will be treated as default)',
          propId: 'pageurl',
          value: '',
          inputType: 'text',
          isRequired: true
        }, {
          propName: 'SEO Meta Description *',
          propId: 'pageseodesc',
          value: '',
          inputType: 'textarea',
          isRequired: true
        }, {
          propName: 'SEO Meta Keywords *',
          propId: 'pageseokeywords',
          value: '',
          inputType: 'text',
          isRequired: true
        }],
        buttons: [{
          label: 'Save',
          buttonId: 'save-btn',
          btnClassName: 'primary',
          btnType: 'submit',
          iconClassName: 'fas fa-save'
        }, {
          label: 'Cancel',
          buttonId: 'cancel-btn',
          btnClassName: 'default',
          btnType: 'button',
          iconClassName: ''
        }]
      }
    });

    var bindAddEditItemModalEvents = function bindAddEditItemModalEvents() {
      addNewPageModal.formView.on('click<save-btn>', function (data, formView, event) {
        event.preventDefault();

        if (!formView.model.validate()) {
          showToastMessage({
            title: 'Cannot create/edit page',
            body: 'Please fill all the inputs'
          });
          return;
        }

        var path = window.getFolderPathById(selectedNodeId);
        var menusplit = path.split('/Menu');
        if (menusplit.length > 1) {
          path = menusplit[1];
        }
        var footersplit = path.split('/Footer');
        if (footersplit.length > 1) {
          path = footersplit[1];
        }
        console.log(path + '/' + data.pageurl);

        if (modalType == 'add') {
          var reqData = {
            authtoken: getAuthToken(),
            folderid: selectedNodeId,
            name: data.pagename,
            urlfrdnlyname: data.pageurl,
            completeurl: path + '/' + data.pageurl,
            desc: data.pagedesc,
            metaKeyword: data.pageseokeywords,
            metaDesc: data.pageseodesc
          };

          Ajax.put(pageConfig.putURL, reqData).then(json).then(function (resp) {
            console.log('Put page item', resp);
            window.fetchItemsAndDisplay();
            addNewPageModal.hide();
          }, getErrorFnc());
        } else if (modalType == 'edit') {
          var selectedItem = getItemById(selectedItemId);
          var reqData = {
            id: selectedItem.id,
            authtoken: getAuthToken(),
            name: data.pagename,
            urlfrdnlyname: data.pageurl,
            completeurl: path + '/' + data.pageurl,
            desc: data.pagedesc,
            metaKeyword: data.pageseokeywords,
            metaDesc: data.pageseodesc,
            lastmodifiedby: user.id
          };

          Ajax.post(pageConfig.postURL, reqData).then(json).then(function (resp) {
            console.log('Put page item', resp);
            window.fetchItemsAndDisplay();
            addNewPageModal.hide();
          }, getErrorFnc());
        }
      });
      addNewPageModal.formView.on('click<cancel-btn>', function (data, formView, event) {
        addNewPageModal.hide();
      });
    };

    addNewPageModal.render().then(function () {
      $('.modal-parent-cont').append(addNewPageModal.$el);
      bindAddEditItemModalEvents();
    });

    var confirmDeleteModal = new BModal({
      headerText: 'Are you sure you want to delete this page?',
      body: '<p>You wont be able to recover once you delete</p>',
      buttons: [{
        label: 'Delete',
        buttonId: 'page-delete-btn',
        btnClassName: 'danger',
        btnType: 'submit',
        iconClassName: 'fas fa-trash',
        onClick: function onClick(modal, ev) {
          ev.preventDefault();
          if (!selectedItemId) {
            showToastMessage({
              title: 'Something went wrong',
              body: 'Please try again later or refresh the page'
            });
            return;
          }

          Ajax.delete(pageConfig.deleteURL, {
            id: selectedItemId,
            authtoken: getAuthToken(),
            lastmodifiedby: window.user.id
          }).then(json).then(function (resp) {
            console.log('delete page item', resp);
            window.fetchItemsAndDisplay();
            modal.hide();
          }, getErrorFnc());
        }
      }, {
        label: 'Cancel',
        buttonId: 'page-del-cancel-btn',
        btnClassName: 'primary',
        btnType: 'button',
        iconClassName: '',
        onClick: function onClick(modal, ev) {
          modal.hide();
        }
      }]
    });
    confirmDeleteModal.render().then(function (modal) {
      $('.modal-parent-cont').append(modal.$el);
    });
  }
});
},{}],14:[function(require,module,exports){
"use strict";

/*!
    * CMS One - SB Admin v6.0.1 (https://startbootstrap.com/templates/sb-admin)
    * Copyright 2013-2020 CMS One
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
(function ($) {
    "use strict";

    // Add active state to sidbar nav links

    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function () {
        if (this.href === path) {
            $(this).addClass("active");
        }
    });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function (e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);
},{}],15:[function(require,module,exports){
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
}

window.ACommon.sessionid = ACommon.getCookie('asession');

ACommon.EnumGenerator = function EnumGenerator(attr) {
  for (var key in attr) {
    if (attr.hasOwnProperty(key)) {
      attr[attr[key]] = key;
    }
  }
  return attr;
};

var module = window || {};

(function () {
  var Ajax = {
    put: function (url, data, onSuccess, onFail) {
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
        }
        xhr.send(JSON.stringify(data));
      });
    },

    get: function (url, onSuccess, onFail) {
      return new Promise(function (res, rej) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onload = function () {
          var data = xhr.responseText;
          if (xhr.readyState == 4 && xhr.status == "200") {
            typeof onSuccess == "function" && onSuccess(data);
            typeof res == "function" && res(data);
          } else {
            typeof onFail == "function" && onFail(data);
            typeof rej == "function" && rej(data);
          }
        }
        xhr.send(null);
      });
    },

    post: function (url, data, onSuccess, onFail) {
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
        }
        xhr.send(JSON.stringify(data));
      });
    },

    delete: function (url, data, onSuccess, onFail) {
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
        }
        xhr.send(JSON.stringify(data));
      });
    }
  };

  module.Ajax = Ajax;
})();
},{}],16:[function(require,module,exports){
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
AEnvironment.SESSION_START_URL = AEnvironment.CURRENTHOST_URL + '/get-session';

AEnvironment.V_MAJOR = 1;
AEnvironment.V_MINOR = 5;
AEnvironment.V_PATH = 2;
AEnvironment.VERSION = 'v' + AEnvironment.V_MAJOR + '.' +
    AEnvironment.V_MINOR + '.' + AEnvironment.V_PATH;
},{"./browser":17}],17:[function(require,module,exports){
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
},{"./ajax":15}],18:[function(require,module,exports){
var BModal = (function (bmodalConfig) {
  if (bmodalConfig == void 0) { bmodalConfig = {}; }
  if (bmodalConfig.rootpath == void 0) { bmodalConfig.rootpath = '/packages/bootstrap-modal'; }

  var _id = 0;
  var idGen = function () { return _id++; };

  var escapeRegExp = function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  window.escapeRegExp = escapeRegExp;

  var replaceAll = function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
  };
  window.replaceAll = replaceAll;

  var Modal = function BModal(data) {
    if (data == void 0) { data = {}; }
    this.attrs = {};
    Object.defineProperty(this, 'body', {
      set: (function (x) {
        if (this.attrs.body == x) {
          return this.attrs.body = x;
        } else {
          this.attrs.body = x;
          this.renderBody();
          return this.attrs.body;
        }
      }).bind(this),
      get: (function () { return this.attrs.body; }).bind(this)
    });
    Object.defineProperty(this, 'headerText', {
      set: (function (x) {
        if (this.attrs.headerText == x) {
          return this.attrs.headerText = x;
        } else {
          this.attrs.headerText = x;
          this.renderHeaderText();
          return this.attrs.headerText;
        }
      }).bind(this),
      get: (function () { return this.attrs.headerText; }).bind(this)
    });
    Object.defineProperty(this, 'id', {
      set: (function (x) {
        if (this.attrs.id == x) {
          return this.attrs.id = x;
        } else {
          this.attrs.id = x;
          return this.attrs.id;
        }
      }).bind(this),
      get: (function () { return this.attrs.id; }).bind(this)
    });
    Object.defineProperty(this, 'buttons', {
      set: (function (x) {
        if (this.attrs.buttons == x) {
          return this.attrs.buttons = x;
        } else {
          this.attrs.buttons = x;
          this.renderBtns();
          return this.attrs.buttons;
        }
      }).bind(this),
      get: (function () { return this.attrs.buttons; }).bind(this)
    });
    Object.defineProperty(this, 'formData', {
      set: (function (x) {
        if (this.attrs.formData == x) {
          return this.attrs.formData = x;
        } else {
          this.attrs.formData = x;
          return this.attrs.formData;
        }
      }).bind(this),
      get: (function () { return this.attrs.formData; }).bind(this)
    });
    Object.defineProperty(this, 'size', {
      set: (function (x) {
        if (this.attrs.size == x) {
          return this.attrs.size = x;
        } else {
          this.attrs.size = x;
          this.renderSize();
          return this.attrs.size;
        }
      }).bind(this),
      get: (function () { return this.attrs.size; }).bind(this)
    });

    Object.assign(this.attrs, Modal.defaults(), data);

    this.$el = this.attrs.$el;
  };

  Modal.prototype.renderSize = function () {
    var size = this.size;
    this.$el.find('.modal-dialog').removeClass('modal-sm');
    this.$el.find('.modal-dialog').removeClass('modal-lg');
    if (size == Modal.SIZE.SMALL) {
      this.$el.find('.modal-dialog').addClass('modal-sm');
    } else if (size == Modal.SIZE.MEDIUM) {

    } else if (size == Modal.SIZE.LARGE) {
      this.$el.find('.modal-dialog').addClass('modal-lg');
    }
    return this;
  };

  Modal.prototype.renderBody = function () {
    this.$el.find('.parent-folder-para').html(this.body);
    return this;
  };

  Modal.prototype.renderHeaderText = function () {
    this.$el.find('.modal-title').html(this.headerText);
    return this;
  };

  Modal.prototype.renderBtns = function () {
    // Render buttons
    for (var i = 0; i < this.buttons.length; i++) {
      var currBtn = this.buttons[i];
      var currTpl = Modal.templates.button;
      currTpl = replaceAll(currTpl, '{{btnClassName}}', currBtn.btnClassName);
      currTpl = replaceAll(currTpl, '{{btnType}}', currBtn.btnType);
      currTpl = replaceAll(currTpl, '{{buttonId}}', currBtn.buttonId);
      currTpl = replaceAll(currTpl, '{{label}}', currBtn.label);
      currTpl = replaceAll(currTpl, '{{iconClassName}}', currBtn.iconClassName);
      var $currTpl = $(currTpl);

      if (!currBtn.iconClassName) {
        $currTpl.find('.custom-btn-icon').hide();
      }

      if (typeof currBtn.onClick == 'function') {
        $currTpl.bind('click', (function (btnItem, ev) {
          btnItem.onClick(this, ev);
        }).bind(this, currBtn));
      }

      this.$el.find('.modal-footer').append($currTpl);
      this.$el.find('.modal-footer').append('<span class="btn-gap">&nbsp;</span>');
    }

    return this;
  };

  Modal.prototype.render = function () {
    return new Promise((function (res, rej) {
      this.$el.html('');
      this.$el.attr('id', this.id);

      var readyCb = (function () {
        var tpl = Modal.templates.main;
        tpl = replaceAll(tpl, '{{modalId}}', this.id);
        tpl = replaceAll(tpl, '{{modalHeader}}', this.headerText);
        tpl = replaceAll(tpl, '{{modalDesc}}', this.body);
        this.$el.html(tpl);

        this.renderBtns();
        this.renderSize();

        // Render form data
        if (this.formData) {
          var formModel = new BForms.Model(this.formData);
          this.formView = new BForms.View({ model: formModel });
          this.$el.find('.form-container').append(this.formView.render().$el);
        }

        res(this);
      }).bind(this);

      if (!Modal.templates.main || !Modal.templates.button) {
        Promise.all([Modal.templateProms.main, Modal.templateProms.button]).then(readyCb);
      } else {
        readyCb();
      }
    }).bind(this));
  };

  Modal.prototype.show = function () {
    this.$el.find('.modal').modal('show');
  };

  Modal.prototype.hide = function () {
    this.$el.find('.modal').modal('hide');
  };

  Modal.templates = {};

  Modal._saveTpl = function (type, tpl) {
    Modal.templates[type] = tpl;
    return Modal.templates[type];
  };

  Modal.templateProms = {
    main: Ajax.get(bmodalConfig.rootpath + '/templates/main.html').then(Modal._saveTpl.bind(Modal, 'main')),
    button: Ajax.get(bmodalConfig.rootpath + '/templates/button.html').then(Modal._saveTpl.bind(Modal, 'button'))
  };

  Modal.defaults = function () {
    return {
      id: 'custom-modal-' + idGen(),
      buttons: [],
      $el: $('<div class="custom-modal"></div'),
      size: Modal.SIZE.MEDIUM
    };
  };

  Modal.SIZE = {
    SMALL: 0,
    MEDIUM: 1,
    LARGE: 2
  };

  return Modal;
})(window.bmodalConfig || void 0);

window.BModal = BModal;

// Usage:
/* var modalInst = new BModal({
  headerText: 'Are you sure?',
  body: 'You will not be able to recover this',
  buttons: [{
    label: 'Ok',
    buttonId: 'ok-btn',
    btnClassName: 'danger',
    btnType: 'submit',
    iconClassName: 'fas fa-trash',
    onClick: function (modal, ev) {
      ev.preventDefault();
    }
  }, {
    label: 'Cancel',
    buttonId: 'cancel-btn',
    btnClassName: 'primary',
    btnType: 'button',
    iconClassName: '',
    onClick: function (modal, ev) {
      modal.hide();
    }
  }]
});
$(document).ready(function () {
  $('.modal-parent-cont').append(modalInst.render().$el);
}); */

},{}]},{},[10]);
