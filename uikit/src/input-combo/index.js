// input-combo/index.js

Component({
  behaviors: ['wx://form-field'],

  // Component properties
  properties: {
    name: String, // 用于 form.submit 获取组件的〔name:value〕
    title: String,
    type: String,
    value: String,
  },

  // Component initial data
  data: {},

  // Component methods
  methods: {
    onInput,
  },
});

// 键盘输入的事件响应，外部通过 componentName 区分组件实例
function onInput(e) {
  this.setData({ value: e.detail.value });
  e.detail.componentName = this.properties.name;
  this.triggerEvent('input', e.detail)
}
