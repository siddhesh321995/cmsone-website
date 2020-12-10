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
