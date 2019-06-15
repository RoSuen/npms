// pages/demo/demo.js
Page({

  data: {
    value: 'String',
    style: 'Q123',
    name: '夏装连衣裙',
  },

  onInput,
  showInputValue,
});

function onInput(e) {
  this.setData({ [e.detail.componentName]: e.detail.value });
}

function showInputValue(e) {
  wx.showModal({
    showCancel: false,
    title: '表单自动获取输入框的内容',
    content: `style: ${e.detail.value.style} ￤ name: ${e.detail.value.name}`,
  });
  console.log(e.detail.value)
}
