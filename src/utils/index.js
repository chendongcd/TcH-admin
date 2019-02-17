/* global window */
import cloneDeep from 'lodash.clonedeep'
import {menuData} from "../common/menu";
import {upLoad} from '../services/app'
import * as QiNiu from 'qiniu-js'
export classnames from 'classnames'
export config from './config'
export request from './request'
export requestDev from './requestDev'
export {color} from './theme'
export {setStorage, getStorage} from './localStorage'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param  name {String}
 * @return  {String}
 */
export function queryURL(name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array, key, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(array, id = 'id', pid = 'pid', children = 'children') {
  let data = cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })
  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

export function _setTimeOut(func, time = 1000) {
  setTimeout(() => func(), time)
}

/*筛选用户拥有的菜单权限*/
export function getMenus(menus) {
  return menuData.filter(a=>menus.includes(a.permission))
}

/*筛选用户当前页面拥有的按钮权限*/
export function getButtons(pageButtons=[], button) {
  return pageButtons.includes(button)
}

/*删除对象中的空对象*/
export function cleanObject(obj) {
  for(let o in obj){
    if(!obj[o]&&obj[o]!=0){
      delete obj[o]
    }
  }
}

export function uuid(name){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return name+v.toString(16);
  });
}

export const ImageUrl = 'http://crcc23-3-jg.com/'//http://www.crcc23-3-jg.com/

export async function QiNiuOss(params) {
  return new Promise(function (resolve, reject) {
    upLoad().then(res => {
      if (res.code == '200') {
        let token = res.entity.token
        let {file, onProgress, onError, onSuccess} = params
        let putExtra = {
          fname: file.name,
          params: {},
          mimeType: null
        };
        let config = {
          useCdnDomain: true,
          region: QiNiu.region.z2
        };
        let observable = QiNiu.upload(file, file.uid, token, putExtra, config)

        let subscription = observable.subscribe(onProgress, onError, onSuccess) // 这样传参形式也可以

        resolve(subscription)
      }
      reject(false)
    })
  })
}

export function cloneObject(obj){
  var newObj = null;
  if( {}.toString.call(obj)=='[object Object]' ){
    newObj = {};
    for(var i in obj){
      cloneIn(i,newObj,obj);
    }
  }else if( {}.toString.call(obj)=='[object Array]' ){
    newObj = [];
    for(var i=0;i<obj.length;i++){
      cloneIn(i,newObj,obj);
    }
  }else{
    newObj = obj;
  }

  function cloneIn(key,newObj,obj){
    if( {}.toString.call(obj[key])=='[object Object]' ){
      newObj[key] = cloneObject(obj[key])
    }else if({}.toString.call(obj[key])=='[object Array]'){
      newObj[key] = cloneObject(obj[key])
    }else{
      newObj[key]=obj[key];
    }
  }
  return newObj;
}
