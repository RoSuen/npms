// 发起到〔ali￤wx〕的特定项目网络请求接口

const qs = require("querystring");
const request = require('request');
require('./promise'); // 异步任务〔串行￤并行〕调度能力

// 网络后台服务接口基础地址
let baseUrl = {
  ali: '',
  fc:  '',
  wx:  '',
};

// 网络后台服务的请求令牌
let token = {
  ali: '',
  wx: '',
};

/**
 * 初始化网络请求参数：
 *  阿里和微信网络服务请求令牌
 *  阿里和微信网络服务基础地址
 */
function init({ aliUrl = '', fcUrl = '', wxUrl = '', aliToken = '', wxToken = ''}) {
  aliUrl && ( baseUrl.ali = aliUrl )
  fcUrl  && ( baseUrl.fc  = fcUrl  )
  wxUrl  && ( baseUrl.wx  = wxUrl  )
  aliToken && ( token.ali = aliToken )
  wxToken  && ( token.wx  = wxToken  )
}

/**
 * 发起到〔ali￤wx〕的通用网络请求
 */
function _request({ svr = '', api = '/', param = {}, method = 'GET', header = {}, json = {}, LOG = '[[@onev.util.request]]' }) {
  const LP = '[[@onev.util.request :: common_request]]';

  // 检查svr必须为〔ali￤fc￤wx〕
  console.assert(svr === 'ali' || svr === 'fc' || svr === 'wx',
    LP, ':: error :: svr ==', svr);

  // 检查api参数合法性
  console.assert(api && api.length > 1 && api[0] === '/',
    LP, ':: error :: api ==', api);
  // api末尾追加'?'字符
  api += api.substr(-1) === '?' ? '' : '?';

  // 检查param参数是否非空
  if ( Object.keys(param).length ) {
    api += qs.stringify(param) // api末尾追加查询参数
  } else {
    api = api.slice(0, -1) // api末尾去掉'?'字符
  }

  // method, header
  // json ‑ 请求体的json数据

  // 网络请求配置
  const rest = {
    url: baseUrl[svr] + api,
    method, json,
  };
  Object.keys(header).length ? rest.headers = header : null;

  // 发起网络连接
  return new Promise((resolve, reject) => request(rest, (err, res, body) => {
    if (!res) { // 网络请求成功，内容错误
      console.log('%s :: RESPONSE ERROR :: url == %o :: err == %o',
        LOG, rest.url, err);
      return reject(err)
    }
    console.log('%s :: RESPONSE OK :: url == %o :: body == %o',
      LOG, rest.url, body);
    resolve(body)
  })).catch(err => {
    console.log('%s :: CATCH ERROR :: url == %o :: err == %o',
      LOG, rest.url, err);
    return err
  })
}

/**
 * 发起到阿里云后台的网络请求
 */
function aliRequest({ api = '/', param = {}, method = 'GET', json = {} }) {
  const LP = '[[@onev.util.request :: ali]]';

  // 检查token合法性
  console.assert(token.ali, LP, ':: missing userToken !!');
  const header = { Authorization: 'Bearer ' + token.ali };

  // 发起网络连接
  return _request({ svr: 'ali', api, param, method, header, json, LOG: LP })
}

/**
 * 发起到阿里云函数计算服务接口的网络请求
 */
function fcRequest({ api = '/', param = {}, method = 'GET', json = {} }) {
  const LP = '[[@onev.util.request :: fc]]';

  // 检查token合法性
  console.assert(token.ali, LP, ':: missing userToken !!');
  const header = { Authorization: 'Bearer ' + token.ali };

  // 发起网络连接
  return _request({ svr: 'fc', api, param, method, header, json, LOG: LP })
}

/**
 * 发起到微信后台的网络请求
 */
function wxRequest({ api = '/', param = {}, method = 'GET', json = {} }) {
  const LP = '[[@onev.util.request :: wx]]';

  // 检查token合法性
  !param.access_token ? param.access_token = token.wx : null;

  // 发起网络连接
  return _request({ svr: 'wx', api, param, method, json, LOG: LP })
}

// 模块导出
module.exports = {
  init,
  ali: aliRequest,
  fc:  fcRequest,
  wx:  wxRequest,
};
