
export default ()=> {
  window.checkToken = function (response) {
    if (response.code == '401' || response.code == '402') {
      return true
    }
    return false
  }
}
