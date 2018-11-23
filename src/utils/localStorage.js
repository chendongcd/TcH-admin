export function getStorage(key) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  let item = localStorage.getItem(key)
  let result
  try {
    result = JSON.parse(item);
  } catch (e) {
    result = item;
  }
  return result
}

export function setStorage(key,storage) {
  return localStorage.setItem(key,JSON.stringify(storage));
}
