import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Progress, Icon} from 'antd'
import classnames from 'classnames'

const containerClass = classnames('ant-upload-list', 'ant-upload-list-picture')
const listItem = classnames('ant-upload-list-item', 'ant-upload-list-item-done')
const item = classnames('ant-upload-list-item-info')
const imgClass = classnames('ant-upload-list-picture ant-upload-list-item-thumbnail img')

class PreFile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      progress: 0
    }
  }

  render() {
    let {file, progress, onPreview, onClose, index,noImage} = this.props
    if (file) {
      console.log(file.name)
      return (
        <div className={containerClass}>
          <div className={listItem}>
            <div className={item}>
              {file.status == 'done' ?( noImage?<a href={file.url} download={file.name}>{file.name}</a>:<span onClick={() => onPreview(file)} style={{cursor: 'pointer'}}>
             <img className={imgClass} src={file.url}/>
                <span style={{marginLeft: 60}}>{file.name}</span>
            </span>) : <Progress style={{marginTop: 15}} percent={progress} status="active"/>}
            </div>
            <Icon onClick={() => onClose(file, index)} type="close"/>
          </div>
        </div>
      )
    }
    return null
  }
}

PreFile.propTypes = {}

export default PreFile
