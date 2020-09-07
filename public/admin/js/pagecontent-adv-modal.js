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
      onClick: function (modal, ev) {
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

  var fetchPageContent = function () {
    if (pageContentAdvModal.attrs.pageid) {
      Ajax.get(AEnvironment.PAGE_CONTENT_BY_PAGE.replace('{{pageid}}', pageContentAdvModal.attrs.pageid)
        .replace('{{authtoken}}', getAuthToken()))
        .then(json)
        .then(function (data) {
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

              str += currStr;
            }
            pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group').html(str);
            pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group button').hide();
            pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group .main-items-remove-btn').show();
            pageContentAdvModal.$el.find('.page-content-modal-items-area .list-group .main-items-remove-btn').click(function (ev) {
              $(pageContentAdvModal).trigger('page-content-item-removed', { modal: pageContentAdvModal, event: ev });
              var contentItemId = $(ev.currentTarget).attr('data-itemid');

              var reqData = {
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