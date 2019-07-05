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
    maxlength: {                  // 输入框最大长度
      type:             Number,
      value:            140,      // 系统默认值
    },
    focus:              Boolean,
    confirmType:        String,
    confirmHold:        Boolean,
    cursor:             Number,
    selectionStart:     Number,
    selectionEnd:       Number,
    more:               Boolean,
  },

  // Component initial data
  data: {
    _maxlength:         140,      // 输入框最大长度，外部传入长度限制
  },

  // Component lifecycle function
  lifetimes: { ready },

  // Component methods
  methods: {
    onInput, onTapMore,
    onKeyboardHeightChange,
  },
});

// 组件Ready
function ready() {
  this.setData({ _maxlength: this.properties.maxlength })
}

// 键盘输入的事件响应，外部通过 name 区分组件实例
function onInput(e) {
  // 是价格输入框吗？
  if ( this.properties.name === 'price' ) {
    const dot = e.detail.value.indexOf('.');
    if ( dot >= 0 ) { // 有小数点，最多只能继续输入2个字符
      this.properties.maxlength = dot + 3
    } else {          // 没有小数点，最大长度放开为初始值
      this.properties.maxlength = this.data._maxlength
    }
  }

  this.setData({ value: e.detail.value, maxlength: this.properties.maxlength });
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
