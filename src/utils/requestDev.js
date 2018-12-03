/* global window */
import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import cloneDeep from 'lodash.clonedeep'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { YQL, CORS } from './config'

const fetch = (url,options) => {
  let {
    method = 'get',
    body:data,
    fetchType,
  } = options
  const cloneData = cloneDeep(data)

  try {
    let domain = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domain] = url.match(/[a-zA-z]+:\/\/[^/]*/)
      url = url.slice(domain.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }
  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${url}?${encodeURIComponent(qs.stringify(options.body))}'&format=json`
    data = null
  }
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
 // axios.post(url, cloneData).then(res=>console.log(res)).catch(e=>console.log(e))
}

export default function request (url,options) {
  if (url && url.indexOf('//') > -1) {
    const origin = `${url.split('//')[0]}//${url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }
  console.log(url)
  return fetch(url,options).then((response) => {
    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    if (data instanceof Array) {
      data = {
        list: data,
      }
    }
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data,
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || 'Network Error'
    }

    /* eslint-disable */
    return Promise.reject({ success: false, statusCode, message: msg })
  })
}
