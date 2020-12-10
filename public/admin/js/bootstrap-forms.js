var BForms = (function () {
  var forms = {};
  var _id = 0;
  var idGen = function () { return _id++; };
  var escapeRegExp = function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  var replaceAll = function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
  };
  window.replaceAll = replaceAll;

  var Model = function FormModel(data) {
    if (data == void 0) { data = {}; }
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
    if (data == void 0) { data = {}; }
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
        $currTpl.find("input[name=custom-form-radio-" + this.id + "-" + currAttr.propId || i + "][value=" + currOptn.value + "]")
          .prop('checked', true);
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
          var onSubmit = function (ev) {
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
        var onClick = function (ev) {
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
})();

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
