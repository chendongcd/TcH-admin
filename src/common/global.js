
export default ()=> {
  window.checkToken = function (response) {
    if (response.code == '401' || response.code == '402') {
      return true
    }
    return false
  }

  window._scollY = 400

  window._checkNum=(num,testValue='')=>{
    return ((num||num==0)?num:testValue)
  }

}
