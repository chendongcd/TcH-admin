import React, {Component, Fragment} from 'react'
import {connect} from 'dva'
import moment from 'moment';

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Modal,
  Upload,
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, ExportModal, PreFile} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, QiNiuOss, ImageUrl} from 'utils'
import {menuData} from 'common/menu'
import {TEAM_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const pageButtons = menuData[13].buttons.map(a => a.permission)
const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const info_css = {
  color: '#fa541c'
}
const teamStatus = ['正在施工', '完工待结算', '已结算']
const contractType = ['主合同', '补充合同']
const testValue = ''
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'
const plainOptions = [{label: '劳务队伍统计', value: '0'},
  {label: '备案情况', value: '1'},
]

@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      progress: 0,
      contractType: -1,
      contractNum: '',
      sqProgress: 0,
      sqFileList: [],
    };
    this.upload = null
  }

  componentDidUpdate(preProp, preState) {
    if (!preProp.selectedValues.annexUrl && this.props.selectedValues.annexUrl && this.state.fileList.length === 0) {
      let pdf = JSON.parse(this.props.selectedValues.annexUrl)
      let file = {
        uid: '-1',
        name: pdf.fileName,
        status: 'done',
        url: pdf.url,
      }
      this.setState({fileList: [file]})
    }
    if (!preProp.selectedValues.annexUrlSq && this.props.selectedValues.annexUrlSq && this.state.sqFileList.length === 0) {
      let pdf = JSON.parse(this.props.selectedValues.annexUrlSq)
      let file = {
        uid: '-1',
        name: pdf.fileName,
        status: 'done',
        url: pdf.url,
      }
      this.setState({sqFileList: [file]})
    }
    if (preProp.selectedValues.contractType === undefined && this.props.selectedValues.contractType != undefined && this.state.contractType === -1) {
      this.setState({contractType: this.props.selectedValues.contractType})
    }
  }

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
        }
      }
      fieldsValue.annexUrl = `{"url":"${this.state.fileList[0].url}","fileName":"${this.state.fileList[0].name}"}`
      fieldsValue.annexUrlSq = this.state.sqFileList.length > 0 ? `{"url":"${this.state.sqFileList[0].url}","fileName":"${this.state.sqFileList[0].name}"}` : null
      if(this.state.contractType===1){
        fieldsValue.contractCode = null
      }
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  cleanState = () => {
    this.setState({fileList: [], previewImage: '', contractType: -1, sqFileList: []})
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  componentWillUnmount() {
    this.upload = null
  }

  handleChange = ({fileList}, type) => {
    if (type) {
      this.setState({fileList})
    } else {
      this.setState({sqFileList: fileList})
    }
  }

  _onSelect = (e) => {
    if (e == 1) {
      this.props.form.setFieldsValue({'contractCode': ''})
    }
    this.setState({contractType: e})
  }

  _onChange = (e, option) => {
    this.setState({contractNum: option.props.item.contractNumber})
  }

  render() {
    const {modalVisible, proNames, loading, subNames, form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {previewVisible, previewImage, fileList, progress, contractType, sqProgress, sqFileList} = this.state
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '队伍台账' : updateModalVisible ? "编辑台账" : "新增台账"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
        okButtonProps={{loading: loading}}
        maskClosable={false}
        onOk={() => checkDetail ? handleCheckDetail() : this.okHandle()}
        onCancel={() => {
          this.cleanState()
          checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()
        }
        }
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                           disabled={checkDetail} onChange={this._onChange} placeholder="请选择" style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="队伍名称">
                {form.getFieldDecorator('teamName', {
                  rules: [{required: true, message: '请输入队伍名称'}],
                  initialValue: selectedValues.teamName ? selectedValues.teamName : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入队伍名称"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="分包商名称">
                {form.getFieldDecorator('subcontractorId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.subcontractorId ? selectedValues.subcontractorId : '',
                })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                           disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {subNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          {checkDetail ?
            <Fragment>
              <Row gutter={8}>
                <Col md={12} sm={24}>
                  <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同类型">
                    {form.getFieldDecorator('contractType', {
                      initialValue: 0,
                    })(<Select onSelect={this._onSelect} className={styles.customSelect} disabled={checkDetail}
                               placeholder="请选择"
                               style={{width: '100%'}}>
                      <Option name={'主合同'} value={0}>主合同</Option>
                      <Option name={'补充合同'} value={1}>补充合同</Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col md={12} sm={24}>
                  <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同编码">
                    {form.getFieldDecorator('contractCode', {
                      initialValue: selectedValues.contractNumber,
                    })(<Input disabled={true}/>)}
                  </FormItem>
                </Col>
              </Row>
              {selectedValues.contractType == 1 ? <Row gutter={8}>
                <Col md={12} sm={24}>
                  <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同类型">
                    {form.getFieldDecorator('contractType1', {
                      initialValue: 1,
                    })(<Select onSelect={this._onSelect} className={styles.customSelect} disabled={checkDetail}
                               placeholder="请选择"
                               style={{width: '100%'}}>
                      <Option name={'主合同'} value={0}>主合同</Option>
                      <Option name={'补充合同'} value={1}>补充合同</Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col md={12} sm={24}>
                  <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同编码">
                    {form.getFieldDecorator('contractCode1', {
                      initialValue: selectedValues.contractCode,
                    })(<Input disabled={true} placeholder="自动带入"/>)}
                  </FormItem>
                </Col>
              </Row> : null}
            </Fragment>
            : <Row gutter={8}>
              <Col md={12} sm={24}>
                <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同类型">
                  {form.getFieldDecorator('contractType', {
                    rules: [{required: true, message: '请选择合同类型'}],
                    initialValue: (selectedValues.contractType || selectedValues.contractType === 0) ? selectedValues.contractType : '',
                  })(<Select onSelect={this._onSelect} className={styles.customSelect} disabled={checkDetail}
                             placeholder="请选择"
                             style={{width: '100%'}}>
                    <Option name={'主合同'} value={0}>主合同</Option>
                    <Option name={'补充合同'} value={1}>补充合同</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                {contractType !== -1 ?
                  <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同编码">
                    {form.getFieldDecorator('contractCode', {
                      rules: [{required: !(contractType !== 0), message: '请选择项目'}],
                      initialValue: selectedValues.contractNumber ? selectedValues.contractNumber : '',
                    })(<Input disabled={contractType !== 0} placeholder={contractType !== 0 ? '系统自动生成' : '请输入'}/>)}
                  </FormItem> : null
                }
              </Col>
            </Row>}
          <Row gutter={0}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同签订日期">
                {form.getFieldDecorator('contractTime', {
                  rules: [{required: true, message: '请选择合同签订日期'}],
                  initialValue: selectedValues.contractTime ? moment(selectedValues.contractTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="预计合同金额">
                {form.getFieldDecorator('estimatedContractAmount', {
                  rules: [{required: true, message: '请输入预计合同金额'}],
                  initialValue: selectedValues.estimatedContractAmount ? selectedValues.estimatedContractAmount : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入预计合同金额" addonAfter='元'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="施工范围">
                {form.getFieldDecorator('constructionScope', {
                  rules: [{required: true, message: '请输入施工范围'}],
                  initialValue: selectedValues.constructionScope ? selectedValues.constructionScope : testValue
                })(<Input disabled={checkDetail} placeholder="请输入施工范围"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="队伍状态">
                {form.getFieldDecorator('status', {
                  rules: [{required: true, message: '请选择队伍状态'}],
                  initialValue: selectedValues.status || selectedValues.status == 0 ? selectedValues.status : ''
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择队伍状态"
                           style={{width: '100%'}}>
                  <Option value={0}>正在施工</Option>
                  <Option value={1}>完工待结算</Option>
                  <Option value={2}>已完结</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>履约保证金</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="应缴金额">
                {form.getFieldDecorator('shouldAmount', {
                  rules: [{required: true, message: '请输入应缴金额'}],
                  initialValue: selectedValues.shouldAmount ? selectedValues.shouldAmount : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入应缴金额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="实缴金额">
                {form.getFieldDecorator('realAmount', {
                  rules: [{required: true, message: '请输入实缴金额'}],
                  initialValue: selectedValues.realAmount ? selectedValues.realAmount : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入实缴金额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>负责人</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同签订人">
                {form.getFieldDecorator('contractPerson', {
                  rules: [{required: true, message: '请输入合同签订人'}],
                  initialValue: selectedValues.contractPerson ? selectedValues.contractPerson : testValue
                })(<Input disabled={checkDetail} placeholder="请输入合同签订人"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 12}} label="合同签订人联系电话">
                {form.getFieldDecorator('phone', {
                  rules: [{required: true, message: '请输入合同签订人联系电话'}],
                  initialValue: selectedValues.phone ? selectedValues.phone : testValue
                })(<Input disabled={checkDetail} placeholder="请输入合同签订人联系电话"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="法人">
                {form.getFieldDecorator('legalPerson', {
                  initialValue: selectedValues.legalPerson ? selectedValues.legalPerson : testValue
                })(<Input disabled={checkDetail} placeholder="请输入法人"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>其他</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 18 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('annexUrl', {
                  rules: [{required: true, message: '请上传附件'}],
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.annexUrl ? [selectedValues.annexUrl] : [],
                })(
                  <Upload.Dragger onChange={(e) => this.handleChange(e, true)}
                                  accept={'.pdf'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="picture"
                                  name="files"
                                  disabled={fileList.length > 0 || checkDetail}
                                  onSuccess={(e) => this.onSuccess(e, true)}
                                  onError={this.onError}
                                  onProgress={(e) => this.onProgress(e, true)}
                                  customRequest={this.onUpload}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile disabled={checkDetail} onClose={this.remove} onPreview={this.handlePreview} progress={progress}
                         file={fileList[0]}/>
                <span style={info_css}>备注：请以一份PDF格式文件上传合同扫描件</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 18 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="授权委托书">
                {form.getFieldDecorator('annexUrlSq', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.annexUrlSq ? [selectedValues.annexUrlSq] : [],
                })(
                  <Upload.Dragger onChange={(e) => this.handleChange(e, false)}
                                  accept={'.pdf'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="picture"
                                  name="files"
                                  disabled={sqFileList.length > 0 || checkDetail}
                                  onSuccess={(e) => this.onSuccess(e, false)}
                                  onError={this.onError}
                                  onProgress={(e) => this.onProgress(e, false)}
                                  customRequest={this.onUpload}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile disabled={checkDetail} onClose={this.removeSq} onPreview={this.handlePreview}
                         progress={sqProgress}
                         file={sqFileList[0]}/>
                <span style={info_css}>备注：非法人管理队伍请上传授权委托书扫描件</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 18 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue
                })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Modal width={643} style={{width: 643, height: 940}} bodyStyle={{width: 643, height: 940}}
               visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <iframe style={{width: 595, height: 892}} frameBorder={0} src={previewImage}/>
        </Modal>
      </Modal>
    )
  }

  onUpload = (params) => {
    QiNiuOss(params).then(res => {
      this.upload = res
    })
  }

  onProgress = (e, type) => {
    if (type) {
      this.setState({progress: parseInt(e.total.percent)})
    } else {
      this.setState({sqProgress: parseInt(e.total.percent)})
    }
  }

  onError = (error) => {
    console.log('上传失败', error)
  }

  onSuccess = (res, type) => {
    //this.state.fileList.push(ImageUrl+res.key)
    if (type) {
      let file = {
        uid: '-1',
        name: this.state.fileList[0].name,
        status: 'done',
        url: ImageUrl + res.key,
      }
      this.setState({fileList: [file]})
      this.props.form.setFieldsValue({annexUrl: [file]});
    } else {
      let file = {
        uid: '-1',
        name: this.state.sqFileList[0].name,
        status: 'done',
        url: ImageUrl + res.key,
      }
      this.setState({sqFileList: [file]})
      this.props.form.setFieldsValue({annexUrlSq: [file]});
    }
  }

  remove = (res) => {
    if (res.status == 'done') {
      this.props.form.setFieldsValue({annexUrl: []});
    } else {
      if (this.upload && this.upload.unsubscribe) {
        this.upload.unsubscribe()
      }
    }
    this.setState({fileList: []})
  }

  removeSq = (res) => {
    if (res.status == 'done') {
      this.props.form.setFieldsValue({annexUrlSq: []});
    } else {
      if (this.upload && this.upload.unsubscribe) {
        this.upload.unsubscribe()
      }
    }
    this.setState({sqFileList: []})
  }
}

const CreateCompForm = Form.create()(props => {
  const {modalVisible, form, loading, companyUpdate, handleComModalVisible, selectedValues} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      companyUpdate(fieldsValue, selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="公司编辑台账"
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      okButtonProps={{loading: loading}}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleComModalVisible()}
    >
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>队伍选定</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="日期">
              {form.getFieldDecorator('teamTime', {
                initialValue: selectedValues.teamTime ? moment(selectedValues.teamTime) : null
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同审批</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="日期">
              {form.getFieldDecorator('approvalTime', {
                initialValue: selectedValues.approvalTime ? moment(selectedValues.approvalTime) : null
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="是否备案">
              {form.getFieldDecorator('settlementFiling', {
                initialValue: (selectedValues.settlementFiling || selectedValues.settlementFiling == 0) ? selectedValues.settlementFiling : ''
              })(<Select className={styles.customSelect} placeholder="请选择" style={{width: '100%'}}>
                <Option name={'是'} value={1}>是</Option>
                <Option name={'否'} value={0}>否</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>结算审批</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="日期">
              {form.getFieldDecorator('settlementTime', {
                initialValue: selectedValues.settlementTime ? moment(selectedValues.settlementTime) : null
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft: 21 + 'px'}} labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('settlementRemark', {
                rules: [{required: false}],
                initialValue: selectedValues.settlementRemark ? selectedValues.settlementRemark : null
              })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

@Form.create()
class TeamAccount extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      comModal: false,
      selectedValues: {},
      checkDetail: false,
      exportModalVisible: false
    }
    this.exportParams = {
      page: 1,
      pageSize: 10
    }
  }

  columns = [
    {
      title: '序号',
      width:80,
      dataIndex: 'id'
    },
    {
      title: '劳务队伍统计（项目部填写）',
      key: '01',
      children: [
        {
          title: '项目名称',
          width:100,
          dataIndex: 'projectName',
        },
        {
          title: '合同编码',
          width:120,
          dataIndex: 'contractCode',
        },
        {
          title: '合同类型',
          width:100,
          dataIndex: 'contractType',
          render(val) {
            return <span>{contractType[val]}</span>
          }
        },
        {
          title: '分包商名称',
          width:100,
          dataIndex: 'subcontractorName'
        },
        {
          title: '队伍名称',
          width:100,
          dataIndex: 'teamName',
        },
        {
          title: '队伍状态',
          width:100,
          dataIndex: 'status',
          render(val) {
            return <span>{teamStatus[val]}</span>;
          },
        },
        {
          title: '合同签订日期',
          width:120,
          dataIndex: 'contractTime',
          render(val) {
            return <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>;
          },
        },
        {
          title: '预计合同金额',
          dataIndex: 'estimatedContractAmount',
          width:120,
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '施工范围',
          width:100,
          dataIndex: 'constructionScope'
        },
        {
          title: '履约保证金',
          key: '008',
          children: [
            {
              title: '应缴金额（万元）',
              width:150,
              dataIndex: 'shouldAmount'
            }, {
              title: '实际缴金额（万元）',
              width:150,
              dataIndex: 'realAmount'
            }]
        },
        {
          title: '负责人',
          key: '009',
          children: [{
            title: '法人',
            width:100,
            dataIndex: 'legalPerson'
          }, {
            title: '合同签订人',
            width:100,
            dataIndex: 'contractPerson',
          },
            {
              title: '联系方式',
              width:150,
              dataIndex: 'phone',
            }]
        },
        {
          title: '结算金额',
          width:100,
          dataIndex: 'settlementAmount'
        },
        {
          title: '附件（合同）',
          dataIndex: 'annexUrl',
          width:120,
          render(val) {
            //if(JSON.parse(record.annexUrl))
            function isJSON(str) {
              if (typeof str == 'string') {
                try {
                  let obj = JSON.parse(str);
                  if (str.indexOf('{') > -1) {
                    return true;
                  } else {
                    return false;
                  }
                } catch (e) {
                  return false;
                }
              }
              return false;
            }

            let href = ''
            if (isJSON(val)) {
              let annex = JSON.parse(val)
              href = annex.url + '?attname=' + annex.fileName
            } else {
              href = val
            }
            return <a href={href} download={'附件'}>下载附件</a>;
          },
        },
        {
          title: '授权委托书',
          dataIndex: 'annexUrlSq',
          width:100,
          render(val) {
            function isJSON(str) {
              if (typeof str === 'string') {
                try {
                  let obj = JSON.parse(str);
                  if (str.indexOf('{') > -1) {
                    return true;
                  } else {
                    return false;
                  }
                } catch (e) {
                  return false;
                }
              }
              return false;
            }

            let href = ''
            if (isJSON(val)) {
              let annex = JSON.parse(val)
              href = annex.url + '?attname=' + annex.fileName
            } else {
              href = val
            }
            return href ? <a href={href} download={'授权委托书'}>下载</a> : null;
          },
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
      ]
    },
    {
      title: '备案情况（公司填写）',
      key: '02',
      children: [
        {
          title: '队伍选定',
          key: '020',
          children: [{
            title: '日期',
            dataIndex: 'teamTime',
            width:110,
            render(val) {
              return <span>{val ? moment(val).format('YYYY/MM/DD') : ''}</span>;
            },
          }]
        },
        {
          title: '合同审批',
          key: '021',
          children: [{
            title: '日期',
            dataIndex: 'approvalTime',
            width:110,
            render(val) {
              return <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>;
            },
          },
            {
              title: '是否备案',
              key: 'settlementFiling',
              dataIndex: 'settlementFiling',
              width:110,
              render(val) {
                if (!val && val != 0) {
                  return null
                }
                return <span>{val == 0 ? '否' : '是'}</span>;
              },
            }]
        },
        {
          title: '结算审批',
          key: '022',
          children: [{
            title: '日期',
            width:110,
            dataIndex: 'settlementTime',
            render(val) {
              return <span>{moment(val).format('YYYY/MM/DD')}</span>;
            },
          }]
        },
      ]
    },
    {
      title: '操作',
      ket: '03',
      width: 180,
      fixed: 'right',
      render: (val, record) => {
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a> : null}
            {getButtons(button, pageButtons[2]) ?
              <Fragment>
                <Divider type="vertical"/>
                <a onClick={() => this.handleCheckDetail(true, record)}>查看</a></Fragment> : null}
            {getButtons(button, pageButtons[3]) ?
              <Fragment> <Divider type="vertical"/><a onClick={() => this.handleComModalVisible(true, record)}>公司编辑</a> </Fragment> : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({pageLoading:false})
    // },1000)
    this.getList()
    this.getProNames()
    this.getSubNames()
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchList(null, pagination.current, pagination.pageSize)
  };

  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getList()
  };

  handleMenuClick = e => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleExportModalVisible = (flag = false) => {
    this.setState({
      exportModalVisible: !!flag,
    });
  }

  handleComModalVisible = (flag, record = {}) => {
    this.setState({
      comModal: !!flag,
      selectedValues: record
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      modalVisible: !!flag,
      selectedValues: record || {},
    });
  };

  handleCheckDetail = (flag, record) => {
    this.setState({
      checkDetail: !!flag,
      modalVisible: !!flag,
      selectedValues: record || {},
    });
  };

  handleAdd = (fields, updateModalVisible, selectedValues, cleanState) => {
    const {dispatch, app: {user}} = this.props;
    const payload = {
      projectId: fields.projectId,
      contractType: fields.contractType,
      subcontractorId: fields.subcontractorId,
      subcontractorName: selectedValues.subcontractorName,
      teamName: fields.teamName,
      contractTime: fields.contractTime,
      estimatedContractAmount: fields.estimatedContractAmount,
      constructionScope: fields.constructionScope,
      status: fields.status,
      realAmount: fields.realAmount,
      shouldAmount: fields.shouldAmount,
      remark: fields.remark,
      annexUrl: fields.annexUrl,
      annexUrlSq: fields.annexUrlSq,
      contractPerson: fields.contractPerson,
      phone: fields.phone,
      approvalFiling: fields.approvalFiling,
      contractCode: fields.contractCode,
      legalPerson: fields.legalPerson
    }
    cleanObject(payload)
    if (updateModalVisible) {
      dispatch({
        type: 'teamAccount/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.getList()
          cleanState()
        }
      })
    } else {
      dispatch({
        type: 'teamAccount/add',
        payload: payload,
        token: user.token
      }).then(res => {
        if (res) {
          this.handleModalVisible()
          this.getList()
          cleanState()
        }
      })
    }
  };

  companyUpdate = (fields, selectedValues) => {
    const {dispatch, app: {user}} = this.props;
    let payload = {
      id: selectedValues.id,
      teamTime: fields.teamTime.format('YYYY-MM-DD'),
      settlementFiling: fields.settlementFiling,
      settlementTime: fields.settlementTime.format('YYYY-MM-DD'),
      settlementRemark: fields.settlementRemark,
      approvalTime: fields.approvalTime.format('YYYY-MM-DD')
    }
    cleanObject(payload)
    dispatch({
      type: 'teamAccount/updateCompany',
      payload: payload,
      token: user.token
    }).then(res => {
      if (res) {
        this.handleComModalVisible()
        this.getList()
      }
    })
  }

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={(e) => this.searchList(e)} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商名称">
              {getFieldDecorator('subcontractorName')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="队伍状态">
              {getFieldDecorator('status')(<Select style={{width: '100%'}}>
                {teamStatus.map((a, index) => <Option key={index} value={index}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="合同备案">
              {getFieldDecorator('approval')(<Select style={{width: '100%'}}>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={6} sm={24}>
              <FormItem label="合同签订人">
                {getFieldDecorator('contractPerson')(<Input/>)}
              </FormItem>
            </Col>
          </Row>
          <div style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm()
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const {
      teamAccount: {data, proNames, subNames, contractCodes},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, exportModalVisible, modalVisible, pageLoading, comModal, selectedValues, updateModalVisible, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleComModalVisible: this.handleComModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      companyUpdate: this.companyUpdate
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      subNames: subNames,
      contractCodes: contractCodes
    }
    const exportUrl = createURL(TEAM_EXPORT, {
      ...this.exportParams, ...{
        token: user.token,
        exportType: 'teamExportType'
      }
    })
    const exportProps = {
      exportModalVisible: exportModalVisible,
      handleExportModalVisible: this.handleExportModalVisible,
      exportUrl: exportUrl,
      plainOptions: plainOptions
    }

    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="所属劳务队伍台账">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[4]) ?
                  <Button onClick={() => this.handleExportModalVisible(true)} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['teamAccount/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: '300%', y: global._scollY}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm
            loading={loading.effects[`teamAccount/${updateModalVisible ? 'update' : 'add'}`]} {...parentMethods} {...parentState}/>
          <CreateCompForm loading={loading.effects[`teamAccount/updateCompany`]} {...parentMethods}
                          selectedValues={selectedValues} modalVisible={comModal}/>
          <ExportModal {...exportProps}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName = []) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'teamAccount/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'teamAccount/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e, page = 1, pageSize = 10) => {
    e && e.preventDefault ? e.preventDefault() : null
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        subcontractorName: fieldsValue.subcontractorName,
        status: fieldsValue.status,
        approval: fieldsValue.approval,
        contractPerson: fieldsValue.contractPerson
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'teamAccount/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

  getSubNames = (subName = []) => {
    if (subName.length < 1) {
      this.props.dispatch(
        {
          type: 'teamAccount/querySubNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }
}

TeamAccount.propTypes = {}

export default connect(({app, loading, teamAccount}) => ({app, loading, teamAccount}))(TeamAccount)
