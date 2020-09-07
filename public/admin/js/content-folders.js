$(document).ready(function () {
  if (currentPage == 'admincontent') {
    var treeData;
    var currModalType = '';

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

    var bindTreeEvents = function () {
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
      var button = $(event.relatedTarget)
      var purpose = button.data('purpose')
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
        authtoken: getAuthToken(),
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