
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

  window._getTotalPage=(total,pageSize=10)=>{
    return (Math.ceil(total/pageSize))
  }
  window.calcuIndex = (response)=>{
    const  {list,pagination:{total,current,pageSize}} = response
    const max = total-(current-1)*pageSize
    return list.map((record,index)=>{
      record.ids = max-Number(index)
      return record
    })
    //return max-index+1
  }

}
