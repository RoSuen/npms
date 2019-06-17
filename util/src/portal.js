// 页面间数据传送，仅用于微信小程序端上调用

// page.__portal__ 存储页面自身拥有的storage
// page.__portal_key__ 存储传入页面的storage
// ** 目前页面只能处于以上两种状态之一 **

const KEY = 'portal_key'; // 页面间传送数据的键名

function load() {
  const page = getCurrentPage();

  // 优先处理传入页面的storage
  if ( page.options[KEY] ) {
    page.__portal_key__ = page.options[KEY];
    return
  }

  // 创建页面自身的storage
  if ( page.__portal__ ) return;

  let time = new Date(), ts = time.getTime() + 288e5;
  let key = `__${new Date(ts).toISOString()}__`;

  wx.setStorageSync(key, null);
  page.__portal__ = key;
}

function unload() {
  const page = getCurrentPage();

  // 只清除页面自身的storage
  if ( page.__portal__ ) {
    wx.removeStorageSync(page.__portal__);
    page.__portal__ = null
  }
}

function getData() {
  const key = getKey();

  if ( key ) {
    return wx.getStorageSync(key)
  }
  return undefined
}

function setData(data) {
  const key = getKey();

  if ( key ) {
    wx.setStorageSync(key, data);
    return true
  }
  return false
}

function wxNavigateTo(route) {
  const key = getKey();

  if ( key && route.indexOf('?') < 0 ) {
    wx.navigateTo({ url: route + `?${KEY}=${key}` });
    return true
  }
  return false
}

// 查询当前页面对象
function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1]
}

// 查询当前页面内的portal组件key
function getKey() {
  const page = getCurrentPage();

  if ( page.__portal__ ) return page.__portal__;
  if ( page.__portal_key__ ) return page.__portal_key__;
  if (page.options[KEY] ) return page.options[KEY]
}

// 模块导出
export default {
  load, unload,
  get: getData,
  set: setData,
  navigateTo: wxNavigateTo,
}
