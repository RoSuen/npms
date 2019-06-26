// float-button/index.js

Component({
  externalClasses: ['com-class'],

  // Component properties
  properties: {
    url: {
      type: String,
      value: '',
    }
  },

  // Component initial data
  data: {},

  // Component methods
  methods: {
    'onClick': onClick,  // 响应点击事件
  }
});

// 响应点击事件
function onClick() {
  console.log(this.data.url);
  wx.navigateTo({ url: this.data.url })
}
