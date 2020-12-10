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

      Ajax.put(AEnvironment.CONTENT_ITEM, reqData)
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