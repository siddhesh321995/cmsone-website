require('./event-api');

var _toastCount = 0;
var showToastMessage = function (data) {
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
      createdepochtime: parseInt((dateObj).getTime() / 1000)
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