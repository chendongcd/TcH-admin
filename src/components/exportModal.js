import React, {Component} from 'react'
import {Checkbox, Modal, Row, Col} from 'antd'

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

  createUrl=(url,sort)=>{
    return url +'&'+'sort='+sort.join(',')
  }

  render() {
    const {exportModalVisible, exportUrl, plainOptions, handleExportModalVisible,must,span} = this.props;
    const sort = this.state.checked
    const href = sort.length||must > 0 ? this.createUrl(exportUrl,must?[...sort,0]:sort) : exportUrl
    return <Modal
      destroyOnClose
      title={'请选择导出模块'}
      visible={exportModalVisible}
      afterClose={()=> this.setState({checked:[]})}
      onOk={(res) => handleExportModalVisible()}
      okText={'导出'}
      okButtonProps={{href, icon: "export", type: "primary",disabled:!(sort.length||must > 0)}}
      onCancel={() =>handleExportModalVisible()}
    >
      <CheckboxGroup style={{width:'100%'}} onChange={this.onChange}>
        <Row>
          {plainOptions.map((item, index) => <Col key={index} span={span?span:8}><Checkbox value={item.value}>{item.label}</Checkbox></Col>)}
        </Row>
      </CheckboxGroup>
    </Modal>
  }
}

ExportModal.propTypes = {}

export default ExportModal
