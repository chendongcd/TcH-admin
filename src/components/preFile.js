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
  }

  render() {
    let {file, progress, onPreview, onClose, index,noImage,disabled} = this.props
    if (file) {
      return (
        <div className={containerClass}>
          <div className={listItem}>
            <div className={item}>
              {file.status == 'done' ?( noImage?<a href={file.url+'?attname='+file.name} download={file.name}>{file.name}</a>:<div onClick={() => onPreview(file)} style={{display:'flex',alignItems:'center',cursor: 'pointer'}}>
                <span style={{marginTop:12,marginLeft:20}}>{file.name}</span>
            </div>) : <Progress style={{marginTop: 15}} percent={progress} status="active"/>}
            </div>
            {disabled?null: <Icon onClick={() => onClose(file, index)} type="close"/>}
          </div>
        </div>
      )
    }
    return null
  }
}

PreFile.propTypes = {}

export default PreFile
