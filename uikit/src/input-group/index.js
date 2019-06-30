// input-group/index.js

Component({
  behaviors: ['wx://form-field'],
  externalClasses: ['com-class'],

  // Component properties
  properties: {
    name: String, // 用于 form.submit 获取组件的〔name:value〕
    title: String,
    type: String,
    value: String,
    more: Boolean,
  },

  // Component initial data
  data: {},

  // Component methods
  methods: {
    onInput, onTapMore,
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
