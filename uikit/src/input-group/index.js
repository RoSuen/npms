// input-group/index.js

Component({
  behaviors: ['wx://form-field'],
  externalClasses: ['com-class'],

  // Component properties
  properties: {
    name:               String,   // 用于 form.submit 获取组件的〔name:value〕
    title:              String,
    type:               String,
    value:              String,
    disabled:           Boolean,
    maxlength:          Number,   // 输入框最大长度，系统默认值
    focus:              Boolean,
    'confirm-type':     String,
    'confirm-hold':     Boolean,
    cursor:             Number,
    'selection-start':  Number,
    'selection-end':    Number,
    more:               Boolean,
  },

  // Component initial data
  data: {},

  // Component methods
  methods: {
    onInput, onTapMore,
    onKeyboardHeightChange,
  },
});

// 键盘输入的事件响应，外部通过 name 区分组件实例
function onInput(e) {
  this.setData({ value: e.detail.value });
  e.detail.name = this.properties.name;
  this.triggerEvent('input', e.detail)
}

function onTapMore(e) {
  this.setData({ more: !this.properties.more });
  e.detail.more = this.properties.more;
  e.detail.name = this.properties.name;
  this.triggerEvent('tapmore', e.detail)
}

// 获取键盘高度
function onKeyboardHeightChange(e) {
  this.triggerEvent('keyboardheightchange', e.detail)
}
