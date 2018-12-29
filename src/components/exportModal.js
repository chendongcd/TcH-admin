import React, {Component} from 'react'
import {Checkbox, Modal, Row, Col} from 'antd'
import {createURL} from 'services/app'
import {cleanObject} from 'utils'

const CheckboxGroup = Checkbox.Group;


class ExportModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      checked: []
    }
  }

  okHandle = () => {

  };

  onChange = (checkedValues) => {
    this.setState({checked: checkedValues})
  }

  render() {
    const {exportModalVisible, exportUrl, plainOptions, handleExportModalVisible} = this.props;
    const sort = this.state.checked
    const href = sort.length > 0 ? createURL(exportUrl, {...{sort: this.state.checked}}) : exportUrl
    return <Modal
      destroyOnClose
      title={'请选择导出模块'}
      visible={exportModalVisible}
      onOk={(res) => {
        console.log(res)
        handleExportModalVisible()
      }}
      okText={'导出'}
      okButtonProps={{href, icon: "export", type: "primary"}}
      onCancel={() => handleExportModalVisible()}
    >
      <CheckboxGroup  onChange={this.onChange}>
        <Row>
          {plainOptions.map((item, index) => <Col key={index} span={8}><Checkbox value={item.value}>{item.label}</Checkbox></Col>)}
        </Row>
      </CheckboxGroup>
    </Modal>
  }
}

ExportModal.propTypes = {}

export default ExportModal
