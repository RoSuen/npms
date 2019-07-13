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

// 判断当前页面是否有portal存储
function isValid() {
  const page = getCurrentPage();
  return !!(page.__portal__ || page.__portal_key__ || page.options[KEY])
}

function getData() {
  const key = getKey();
  if ( !key ) return undefined;

  let storage = wx.getStorageSync(key);
  storage ? delete storage.result : null;

  return storage
}

function setData(data) {
  const key = getKey();
  if ( !key ) return false;

  let _data = { ...data };
  delete _data.result;

  let storage = wx.getStorageSync(key);
  if ( storage && storage.hasOwnProperty('result') ) {
    _data.result = storage.result;
  }

  wx.setStorageSync(key, _data);
  return true
}

function getResult() {
  const key = getKey();
  if ( !key ) return undefined;

  let storage = wx.getStorageSync(key);
  if ( storage && storage.hasOwnProperty('result') ) {
    return storage.result
  } else {
    return undefined
  }
}

function setResult(result) {
  const key = getKey();
  if ( !key ) return false;

  let storage = wx.getStorageSync(key);
  wx.setStorageSync(key, { ...storage, result });
  return true
}

function reset() {
  const key = getKey();
  if ( !key ) return false;

  wx.setStorageSync(key, null);
  return true
}

// 用于小程序启动时，清理portal残留数据
// ** 这种数据通常由于页面没有正常卸载导致 **
function cleanData() {
  let keys = wx.getStorageInfoSync().keys;

  keys.forEach(key =>
    key.slice(0, 4) === '__20' && key.slice(-3) === 'Z__' ? wx.removeStorageSync(key) : null
  )
}

function wxNavigateTo(url) {
  wx.navigateTo({ url: routeURL(url) })
}

function wxRedirectTo(url) {
  wx.redirectTo({ url: routeURL(url) })
}

function routeURL(url) {
  const key = getKey();
  if ( !key ) return url;

  let query = url.indexOf('?');
  return url + (query < 0 ? '?' : '&') + `${KEY}=${key}`
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
  valid: isValid,
  get: getData,
  set: setData,
  result: getResult,
  return: setResult,
  reset: reset,
  clean: cleanData,
  navigateTo: wxNavigateTo,
  redirectTo: wxRedirectTo,
}
