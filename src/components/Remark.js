import React, {Component} from 'react'
class Remark extends Component {

  render() {
    let {content,max} = this.props
    if (content) {
      let remark = ''
      if(content.length>max){
        remark = content.substr(0,max-3)+'...'
      }else {
        remark = content
      }
      return (
       <span>{remark}</span>
      )
    }
    return null
  }
}

Remark.propTypes = {}

export default Remark
