// 发起到〔ali￤wx〕的特定项目网络请求接口，仅用于微信小程序端上调用

import qs from 'querystring'
import 'promise' // 异步任务〔串行￤并行〕调度能力

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
function _request({ svr = '', api = '/', param = {}, method = 'GET', header = {}, json = {}, LOG = '[[@onev.util.request.miniprogram]]' }) {
  const LP = '[[@onev.util.request.miniprogram :: common_request]]';

  // 检查svr必须为〔ali￤fc￤wx〕
  console.assert(svr === 'ali' || svr === 'fc' || svr === 'wx', LP, ':: error :: svr ==', svr);

  // 检查api参数合法性
  console.assert(api && api.length > 1 && api[0] === '/', LP, ':: error :: api ==', api);
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
    method, data:json,
  };
  Object.keys(header).length ? rest.header = header : null;

  // 发起网络连接
  return new Promise(doRequest).then(res => {
    if ( res.statusCode === 200 ) {
      console.log('%s :: RESPONSE OK :: url == %o :: res.data == %o', LOG, rest.url, res.data);
      return res.data
    } else if ( res.statusCode === 403 ) {
      console.log('%s :: RESPONSE OK :: AUTH 403 ERR :: REQUEST FIRST :: url == %o :: res == %o', LOG, rest.url, res);

      // 触发认证403错误的外部补偿逻辑
      token.ali = '';
      use.fullLogin();

      let hasToken = false;
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      return (async () => {
        for (let i = 0; i < 10; i++) {
          if ( hasToken ) break;
          await sleep(1000).then(() => hasToken = !!token.ali)
        }

        // 修正阿里云访问请求的header
        rest.header.Authorization = 'Bearer ' + token.ali;
        return new Promise(doRequest).then(res => {
          console.log('%s :: RESPONSE OK :: AUTH 403 EOK :: REQUEST SECOND :: url == %o :: res.data == %o', LOG, rest.url, res.data);
          return res.data
        })
      })()
    }
  }).catch(err => {
    console.log('%s :: CATCH ERROR :: url == %o :: err == %o', LOG, rest.url, err);
    return err
  });

  function doRequest(resolve, reject) {
    wx.request({
      ...rest,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('%s :: RESPONSE ERROR :: url == %o :: err == %o', LOG, rest.url, err);
        reject(err)
      }
    })
  }
}

/**
 * 发起到阿里云后台的网络请求
 */
function aliRequest({ api = '/', param = {}, method = 'GET', json = {} }) {
  const LP = '[[@onev.util.request.miniprogram :: ali]]';

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
  const LP = '[[@onev.util.request.miniprogram :: fc]]';

  // 检查token合法性
  console.assert(token.ali, LP, ':: missing userToken !!');
  const header = { Authorization: 'Bearer ' + token.ali };

  // 发起网络连接
  return _request({ svr: 'fc', api, param, method, header, json, LOG: LP })
}

/**
 * 发起到微信后台的网络请求
 */
function wxRequest(type = '', json = {}) {
  const LP = '[[@onev.util.request.miniprogram :: wx]]';

  // 检查type合法性：不能为空
  console.assert(type, LP, ':: error :: type ==', type);

  // 检查json合法性：必须有数据
  console.assert(Object.keys(json).length, LP, ':: error :: json ==', json);

  json.type = type; // 微信云函数的调用类型
  return wx.cloud.callFunction({ name: 'capi', data:json }).then(res => res.result)
}

/**
 * 处理阿里云服务的认证403错误
 * handler: fullLogin
 */
let use = {};
function registerHandler(handler = {}) {
  use = { ...use, ...handler }
}

// 模块导出
export default {
  init, registerHandler,
  ali: aliRequest,
  fc:  fcRequest,
  wx:  wxRequest,
}
