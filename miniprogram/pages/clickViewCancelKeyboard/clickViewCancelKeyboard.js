// pages/clickViewCancelKeyboard/clickViewCancelKeyboard.js
Page({

  'tapView'() {
    wx.showToast({
      title: '消息响应',
      icon: 'success',
      duration: 1000
    })
  },

  'inputFocus'() {
    wx.pageScrollTo({
      scrollTop: 200,
      duration: 200
    })
  },

});
