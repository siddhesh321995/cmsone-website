'use strict';

var currPage = 1;
var itemsPerPage = 10;
var distinct = '';
var collectionName = 'tracker';

var dataPopulate = function dataPopulate(resp) {
  resp = JSON.parse(resp);
  if (resp.data && resp.data.length) {
    var heads = Object.keys(resp.data[0]);
    var headStr = '<tr>';
    headStr += '<th scope="col">SR NO.</th>';
    for (var i = 0; i < heads.length; i++) {
      headStr += '<th scope="col">' + heads[i] + '</th>';
    }
    headStr += '</tr>';
    $('#main-table thead').html(headStr);

    $('#main-table tbody').html('');
    for (var i = 0; i < resp.data.length; i++) {
      var bodyStr = '<tr>';
      bodyStr += '<th scope="row">' + (i + 1) + '</th>';
      for (var key in resp.data[i]) {
        if (resp.data[i].hasOwnProperty(key)) {
          bodyStr += '<td>' + resp.data[i][key] + '</td>';
        }
      }
      bodyStr += '</tr>';
      $('#main-table tbody').append(bodyStr);
    }
  } else {
    $('#main-table tbody').html('No data found for this page');
  }
};

var getDataFindFromTo = function getDataFindFromTo() {
  var getDataObj = {};
  var sort;
  $('.inputsrows').each(function (index, el) {
    var key = $(el).find('.keyinput').val();
    var val = $(el).find('.valueinput').val();
    if (key) {
      getDataObj[key] = val;
    }
  });
  var sortkey = $('.sortkey').val();
  var sortval = Number($('.sortval').val());
  if (sortkey) {
    sort = {};
    sort[sortkey] = sortval;
  }
  Ajax.post(AEnvironment.ADMIN_COLELCTION_URL, {
    page: currPage,
    max: itemsPerPage,
    find: getDataObj,
    sort: sort,
    collectionName: collectionName
  }, dataPopulate, console.warn);
};

var onAddNewBtnClicked = function onAddNewBtnClicked(e) {
  e.preventDefault();
  e.stopPropagation();

  var maxRows = $('.input-container .inputsrows').length;
  var tpl = '<div class="row inputsrows" data-row="' + maxRows + '">\n  <div class="col">\n    <input type="text" class="form-control keyinput" placeholder="key">\n  </div>\n  <div class="col">\n    <input type="text" class="form-control valueinput" placeholder="value">\n  </div>\n</div>';
  $('.input-container').append(tpl);
};

var onClearBtnClicked = function onClearBtnClicked(e) {
  e.preventDefault();
  e.stopPropagation();

  $('.input-container .inputsrows').remove();
  onAddNewBtnClicked(e);
};

var getDataDistFromTo = function getDataDistFromTo() {
  $('#main-table thead').html('');
  $('#main-table tbody').html('Loading...');
  Ajax.post(AEnvironment.ADMIN_COLELCTION_DISTINCT_URL, {
    page: currPage,
    max: itemsPerPage,
    dist: distinct,
    collectionName: collectionName
  }, function (resp) {
    resp = JSON.parse(resp);
    if (resp.data && resp.data.length) {
      // var heads = Object.keys(resp.data[0]);
      var headStr = '<tr>';
      headStr += '<th scope="col">' + distinct + '</th>';
      headStr += '</tr>';
      $('#main-table thead').html(headStr);

      $('#main-table tbody').html('');
      for (var i = 0; i < resp.data.length; i++) {
        var bodyStr = '<tr>';
        bodyStr += '<td>' + resp.data[i] + '</td>';
        bodyStr += '</tr>';
        $('#main-table tbody').append(bodyStr);
      }
    } else {
      $('#main-table tbody').html('No data found for this page');
    }
  }, console.warn);
};

var go = function go() {
  if (distinct == '') {
    getDataFindFromTo();
  } else {
    getDataDistFromTo();
  }
};

$('document').ready(function () {
  var pass;
  var auth = Boolean(window.localStorage.getItem('auth'));
  if (!auth) {
    pass = window.prompt('Are you an admin? Prove it by submitting password!');
  }
  if (pass == 'siddhesh3' || auth) {
    window.localStorage.setItem('auth', 'true');
    $('.curr-page').html(currPage);
    $('.page-no').val(currPage);
    $('.max').val(itemsPerPage);
    $('.collname').val(collectionName);
    go();

    $('.addnew').click(onAddNewBtnClicked);
    $('.clear').click(onClearBtnClicked);

    $('.page-no').change(function () {
      currPage = Number($('.page-no').val());
      $('.page-no').val(currPage);
    });

    $('.collname').change(function () {
      collectionName = $('.collname').val();
      $('.collname').val(collectionName);
    });

    $('.max').change(function () {
      itemsPerPage = Number($('.max').val());
      $('.max').val(itemsPerPage);
    });

    $('.distinct').change(function () {
      distinct = $('.distinct').val();
      $('.distinct').val(distinct);
    });

    $('.prev').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      currPage -= 1;
      if (currPage < 1) {
        currPage = 1;
      }
      $('.curr-page').html(currPage);
      $('.page-no').val(currPage);
    });

    $('.next').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      currPage += 1;
      $('.curr-page').html(currPage);
      $('.page-no').val(currPage);
      go();
    });

    $('.go').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      go();
    });

    $('.go-dist').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      go();
    });
  } else {
    alert('Nope! You are not an admin');
    window.location.href = '/';
  }
});