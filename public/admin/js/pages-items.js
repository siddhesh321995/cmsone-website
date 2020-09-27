var selectedItemId;
var selectedNodeId;
var getItemById = function (id) {
  if (id == void 0) { id = selectedItemId; }
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

      Ajax.put(pageConfig.putURL, reqData)
        .then(json)
        .then(function (resp) {
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

    var bindAddEditItemModalEvents = function () {
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

          Ajax.put(pageConfig.putURL, reqData)
            .then(json)
            .then(function (resp) {
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

          Ajax.post(pageConfig.postURL, reqData)
            .then(json)
            .then(function (resp) {
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
        onClick: function (modal, ev) {
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
        onClick: function (modal, ev) {
          modal.hide();
        }
      }]
    });
    confirmDeleteModal.render().then(function (modal) {
      $('.modal-parent-cont').append(modal.$el);
    });
  }
});