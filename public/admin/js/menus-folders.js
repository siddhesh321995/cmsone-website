var tpls = {
  addEditFolderModal: Ajax.get('/admin/templates/add-edit-folder-modal.html'),
  addEditItemModal: Ajax.get('/admin/templates/add-edit-item-modal.html'),
  deleteFolderModal: Ajax.get('/admin/templates/delete-folder-modal.html'),
  deleteItemModal: Ajax.get('/admin/templates/delete-item-modal.html')
};

var modalGeneratorFnc = function (command) {
  return function (id) { $('#' + id).modal(command); };
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
          authtoken: getAuthToken(),
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

    window.getFolderPathById = getFolderPathById;

    var fetchtItemsbyFolder = function (id) {
      return new Promise(function (res, rej) {
        Ajax.get(folderConfig.contentByFolderURL.replace('{{folderid}}', id)
          .replace('{{authtoken}}', getAuthToken())
          , function (resp) {
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

    var fetchFolderData = function () {
      Ajax.get(folderConfig.siteFolderTreeURL.replace('{{authtoken}}', getAuthToken())).then(json).then(function (resp) {
        var updateFolders = function (root) {
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