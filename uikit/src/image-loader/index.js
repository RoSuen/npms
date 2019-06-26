// image-loader/index.js

Component({
  // Component properties
  properties: {
    imgSrc: {
      type:   String,
      value:  '',
      observer(res) { this.triggerEvent('change', res) }
    },
  },

  // Properties Observer
  // ** 小程序基础库2.6.1+有效，性能优于属性定义的观察器 **
  // observers: {
  //   imgSrc () {
  //     this.triggerEvent("change", this.properties.imgSrc)
  //   },
  // },

  // Component initial data
  data: {},

  // Component methods
  methods: {
    'onSelect': onSelect,   // 响应图片选择
  },
});

// 响应图片选择
function onSelect() {
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: res => this.setData({ imgSrc: res.tempFilePaths[0] }),
    fail: () => this.setData({ imgSrc: '' }),
  })
}
