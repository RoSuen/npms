// pages/demo/demo.js

let p = null;

Page({

  data: {
    value: 'String',
    style: 'Q123',      style1: '98991',
    name: '夏装连衣裙',  name1: '冬装夏穿',
    group: {
      style1: false,
    },
    price: null,
    priceKeyboard: 'digit',
  },

  onLoad() { p = this },

  onInput, onTapMore,
  showInputValue, changePriceKeyboard,
});

function onInput(e) {
  // this.setData({ [e.detail.name]: e.detail.value })
  this.data[e.detail.name] = e.detail.value;

  if ( e.detail.name === 'price' ) {
    changePriceKeyboard()
  }
}

function onTapMore(e) {
  this.data.group[e.detail.name] = e.detail.more
}

function showInputValue(e) {
  wx.showModal({
    showCancel: false,
    title: '表单自动获取输入框的内容',
    content: `style: ${e.detail.value.style} ￤ name: ${e.detail.value.name}`,
  });
  console.log(e.detail.value)
}

function changePriceKeyboard() {
  if ( p.data.priceKeyboard === 'digit' ) {
    p.setData({ priceKeyboard: 'number'})
  } else {
    p.setData({ priceKeyboard: 'digit'})
  }
}
