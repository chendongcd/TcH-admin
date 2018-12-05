import {message} from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  420: '请求参数错误',
  422: '用户密码错误，请重新输入',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  console.log(response)
  if (response.code >= 200 && response.code < 300) {
    return
  }
  const errortext = codeMessage[response.code] || response.message;
  console.log(codeMessage[response.code])
  message.error(errortext);
  return
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function createURL(path, param/*链接和参数*/) {
  let i, url = ''
  for (i in param) url += '&' + i + '=' + param[i]
  return path + url.replace(/./, '?')
}

export default function request(url, options, token) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest()
    if (options.method === 'GET') {
      let _url = createURL(url, options.body)
      req.open(options.method, _url)
    } else {
      req.open(options.method, url)
    }
    req.setRequestHeader('Content-Type', 'application/json')
    if (token) {
      req.setRequestHeader('Authorization', `${token}`)
    }

    req.onload = function () {
      console.log(req)
      if (req.readyState === 4 && req.status == 200) {
          checkStatus(JSON.parse(req.response))
        resolve(JSON.parse(req.response))
      } else {
        reject(Error(req.statusText))
      }
    }
    req.onerror = function () {
      reject(Error('Network Error'))
    }
    req.timeout = 20000;
    req.ontimeout = function () {
      message.error('请求超时')
      req.abort()
      resolve({timeout: true})
      // reject(new Error('请求超时'))
    }
    if (options.method !== 'GET') {
      console.log(options)
      req.send(JSON.stringify(options.body))
    } else {
      req.send()
    }
  })
}
