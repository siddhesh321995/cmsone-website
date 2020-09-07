var ContentItemTypes = ACommon.EnumGenerator({
  PLAIN_TEXT: 1,
  HTML: 2,
  JSON: 3,
  XML: 4
});

var ContentItemTypesDisplayTitles = ACommon.EnumGenerator({
  PLAIN_TEXT: 'Plaintext',
  HTML: 'HTML',
  JSON: 'JSON',
  XML: 'XML'
});

$(document).ready(function () {
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
      onClick: function (modal, ev) {
        modal.hide();
        $(contentModal).trigger('content-item-selection-cancelled', { modal: modal, event: ev });
      }
    }]
  });

  var fetchContentFolder = function () {
    Ajax.get(AEnvironment.CONTENT_FOLDERS.replace('{{authtoken}}', getAuthToken()), function (resp) {
      resp = JSON.parse(resp);
      var updateFolders = function (root) {
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

  var fetchContentItemsbyFolder = function (id) {
    return new Promise(function (res, rej) {
      Ajax.get(AEnvironment.CONTENT_ITEM_BY_FOLDER.replace('{{folderid}}', id)
        .replace('{{authtoken}}', getAuthToken())
        , function (resp) {
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

  var fetchItemsAndDisplay = function () {
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

  var getFolderPathRec = function (currPath, currNode, id) {
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

  var getFolderPathById = function (id) {
    return getFolderPathRec('~', treeData, id);
  };

  var bindTreeEvents = function () {
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