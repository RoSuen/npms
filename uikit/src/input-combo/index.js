// input-combo/index.js

Component({
  behaviors: ['wx://form-field'],
  externalClasses: ['com-class'],

  // Component properties
  properties: {
    name:     String,   // 用于 form.submit 获取组件的〔name:value〕
    title:    String,
    type:     String,
    value:    String,
    disabled: Boolean,
    focus:    Boolean,
  },

  // Component initial data
  data: {
    maxlength: 140, // 输入框最大长度，系统默认值
  },

  // Component methods
  methods: {
    onInput,
    onKeyboardHeightChange,
  },
});

// 键盘输入的事件响应，外部通过 name 区分组件实例
function onInput(e) {
  // 是价格输入框吗？
  if ( this.properties.name === 'price' ) {
    const dot = e.detail.value.indexOf('.');
    if ( dot >= 0 ) { // 有小数点，最多只能继续输入2个字符
      this.data.maxlength = dot + 3
    } else {          // 没有小数点，最大长度放开为系统限制
      this.data.maxlength = 140
    }
  }

  this.setData({ value: e.detail.value, maxlength: this.data.maxlength });
  e.detail.name = this.properties.name;
  this.triggerEvent('input', e.detail)
}

// 获取键盘高度
function onKeyboardHeightChange(e) {
  this.triggerEvent('keyboardheightchange', e.detail)
}
