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
import {Page, PageHeaderWrapper, StandardTable,PreFile} from 'components'
import styles from './index.less'
import {QiNiuOss, ImageUrl, cleanObject, getButtons} from 'utils'
import {menuData} from "../../../common/menu";
import {EVAL_EXPORT} from 'common/urls'
import {createURL} from 'services/app'
const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'
const testValue = ''
const reStatus = ["未评估", "初评", "复评(二次)", "复评(三次)", "复评(四次)", "定评"]
const info_css = {
  color: '#fa541c'
}
const pageButtons = menuData[18].buttons.map(a => a.permission)

@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      responsibilityAnnex: [],
      jointHearingAnnex:[],
      evaluationAnnex:[],
      evaProgress:0,
      joinProgress: 0,
      resProgress: 0,
      previewVisible: false,
      previewImage: ''
    };
    this.selectProject = {}
    this.upload = []
  }

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;

    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          // console.log(fieldsValue[prop].format())
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
          //  console.log(fieldsValue[prop])
        }
        // console.log(typeof fieldsValue[prop])
      }
      // fieldsValue.jointHearingAnnex = testPDF
      // fieldsValue.responsibilityAnnex = testPDF
      // fieldsValue.evaluationAnnex = testPDF
      // form.resetFields();
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };

  onChange = (value, option) => {
    this.selectProject = option.props.item
    console.log(option)
    this.props.form.setFieldsValue({
      engineeringType: this.selectProject.projectType,
      projectStatus: this.selectProject.statusStr,
      contractEndTime: moment(this.selectProject.contractEndTime).format('YYYY-MM-DD'),
      contractStartTime: moment(this.selectProject.contractStartTime).format('YYYY-MM-DD'),
      duration: this.selectProject.distanceTime
    });
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

  render() {
    const {modalVisible, proNames, form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {previewVisible,evaluationAnnex, previewImage,responsibilityAnnex, resProgress,evaProgress,jointHearingAnnex,joinProgress} = this.state

    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '项目评估' : updateModalVisible ? "编辑项目评估" : "新增项目评估"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
        maskClosable={false}
        onOk={this.okHandle}
        onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                           onChange={this.onChange} disabled={checkDetail}
                           placeholder="请选择" style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="工程类别">
                {form.getFieldDecorator('engineeringType', {
                  rules: [{required: true}],
                  initialValue: selectedValues.engineeringType ? selectedValues.engineeringType : '',
                })(<Input disabled={checkDetail || updateModalVisible} placeholder="自动带出"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="评估状态">
                {form.getFieldDecorator('evaluationStatus', {
                  rules: [{required: true, message: '请选择评估状态'}],
                  initialValue: selectedValues.evaluationStatus ? selectedValues.evaluationStatus : ''
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择评估状态"
                           style={{width: '100%'}}>
                  {reStatus.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目状态">
                {form.getFieldDecorator('projectStatus', {
                  rules: [{required: true}],
                  initialValue: selectedValues.projectStatus ? selectedValues.projectStatus : ''
                })(<Input disabled={checkDetail || updateModalVisible} placehloder='自动带出'/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>合同价</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="中标">
                {form.getFieldDecorator('winningBid', {
                  rules: [{required: true, message: '请输入预付款'}],
                  initialValue: selectedValues.winningBid ? selectedValues.winningBid : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入中标金额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="有效收入">
                {form.getFieldDecorator('effectiveIncome', {
                  rules: [{required: true, message: '请输入预付款'}],
                  initialValue: selectedValues.effectiveIncome ? selectedValues.effectiveIncome : testValue

                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入有效金额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>合同</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="是否签订">
                {form.getFieldDecorator('isSign', {
                  rules: [{required: true, message: '请选择是否签订'}],
                  initialValue: selectedValues.isSign ? selectedValues.isSign : ''

                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  <Option value="是">是</Option>
                  <Option value="否">否</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="签订日期">
                {form.getFieldDecorator('signTime', {
                  rules: [{required: true, message: '请选择签订时间'}],
                  initialValue: selectedValues.signTime ? moment(selectedValues.signTime) : null

                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder='请选择日期'/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>合同工期</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="合同开工日期">
                {form.getFieldDecorator('contractStartTime', {
                  rules: [{required: true}],
                  initialValue: selectedValues.contractStartTime ? moment(selectedValues.contractStartTime).format('YYYY-MM-DD') : ''
                })(<Input disabled={checkDetail || updateModalVisible} placeholder='自动带出'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="合同竣工日期">
                {form.getFieldDecorator('contractEndTime', {
                  rules: [{required: true}],
                  initialValue: selectedValues.contractEndTime ? moment(selectedValues.contractEndTime).format('YYYY-MM-DD') : ''
                })(<Input disabled={checkDetail || updateModalVisible} placeholder='自动带出'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="工期(月)">
                {form.getFieldDecorator('duration', {
                  rules: [{required: true}],
                  initialValue: selectedValues.duration ? selectedValues.duration : ''
                })(<Input disabled={checkDetail || updateModalVisible} placeholder='自动计算'/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>经管部评价</div>
        </Row>
        <div className={styles.modalContent} style={{paddingRight: 0}}>
          <Row gutter={8}>
            <Col md={7} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="评估时间">
                {form.getFieldDecorator('evaluationTime', {
                  rules: [{required: true, message: '请选择评估时间'}],
                  initialValue: selectedValues.evaluationTime ? moment(selectedValues.evaluationTime) : null

                })(<DatePicker disabled={checkDetail} width={'100%'} placeholder='请选择'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="评估效益点(%)">
                {form.getFieldDecorator('evaluationBenefit', {
                  rules: [{required: true, message: '请输入评估效益点(%)'}],
                  initialValue: selectedValues.evaluationBenefit ? selectedValues.evaluationBenefit : testValue

                })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
              </FormItem>
            </Col>
            <Col md={9} sm={24}>
              <FormItem labelCol={{span: 10}} wrapperCol={{span: 13}} label="含分包差及经营费(%)">
                {form.getFieldDecorator('evaluationCost', {
                  rules: [{required: true, message: '请输入含分包差及经营费(%)'}],
                  initialValue: selectedValues.evaluationCost ? selectedValues.evaluationCost : testValue

                })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col md={12} sm={24}>
              <FormItem style={{marginLeft: 14 + 'px'}} labelCol={{span: 4}} wrapperCol={{span: 12}} label="评估编号">
                {form.getFieldDecorator('evaluationCode', {
                  rules: [{required: true, message: '请输入评估编号'}],
                  initialValue: selectedValues.evaluationCode ? selectedValues.evaluationCode : testValue

                })(<Input disabled={checkDetail} placeholder="请输入评估编号"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 11 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('evaluationAnnex', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.evaluationAnnex ? selectedValues.evaluationAnnex : [],
                })(
                  <Upload.Dragger onChange={(e) => this.handleChange(e, 0)}
                                  accept={'.zip,.rar'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="text"
                                  name="files"
                                  disabled={jointHearingAnnex.length > 0}
                                  onSuccess={(e) => this.onSuccess(e, 0)}
                                  handleManualRemove={(e) => this.remove(e, 0)}
                                  onError={this.onError}
                                  onProgress={(e) => this.onProgress(e, 0)}
                                  customRequest={(e) => this.onUpload(e, 0)}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile index={0} noImage={true} onClose={this.remove} onPreview={this.handlePreview} progress={evaProgress} file={evaluationAnnex[0]}/>
                <span style={info_css}>备注：请以一份压缩包格式文件上传</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>会审情况</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={7} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="效益点">
                {form.getFieldDecorator('jointHearingBenefit', {
                  rules: [{required: true, message: '请输入效益点'}],
                  initialValue: selectedValues.jointHearingBenefit ? selectedValues.jointHearingBenefit : testValue

                })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
              </FormItem>
            </Col>
            <Col md={10} sm={24}>
              <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="是否含分包差及经营费">
                {form.getFieldDecorator('jointHearingCost', {
                  rules: [{required: true, message: '请输入是否含分包差及经营费'}],
                  initialValue: selectedValues.jointHearingCost ? selectedValues.jointHearingCost : testValue

                })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
              </FormItem>
            </Col>
            <Col md={7} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="上会时间">
                {form.getFieldDecorator('jointHearingTime', {
                  rules: [{required: true, message: '请选择上会时间'}],
                  initialValue: selectedValues.jointHearingTime ? moment(selectedValues.jointHearingTime) : null
                })(<DatePicker disabled={checkDetail} placeholder='请选择时间)'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 11 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('jointHearingAnnex', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.jointHearingAnnex ? selectedValues.jointHearingAnnex : [],
                })(
                  <Upload.Dragger onChange={(e) => this.handleChange(e, 1)}
                                  accept={'.zip,.rar'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="text"
                                  name="files"
                                  disabled={jointHearingAnnex.length > 0}
                                  onSuccess={(e) => this.onSuccess(e, 1)}
                                  handleManualRemove={(e) => this.remove(e, 1)}
                                  onError={this.onError}
                                  onProgress={(e) => this.onProgress(e, 1)}
                                  customRequest={(e) => this.onUpload(e, 1)}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile index={1} noImage={true} onClose={this.remove} onPreview={this.handlePreview} progress={joinProgress} file={jointHearingAnnex[0]}/>
                <span style={info_css}>备注：请以一份压缩包格式文件上传</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>责任状签订</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="效益点">
                {form.getFieldDecorator('responsibilityBenefiy', {
                  rules: [{required: true, message: '请输入效益点'}],
                  initialValue: selectedValues.responsibilityBenefiy ? selectedValues.responsibilityBenefiy : testValue

                })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="签订时间">
                {form.getFieldDecorator('responsibilityTime', {
                  rules: [{required: true, message: '请选择签订时间'}],
                  initialValue: selectedValues.responsibilityTime ? moment(selectedValues.responsibilityTime) : null

                })(<DatePicker disabled={checkDetail} width={'100%'} placeholder='请选择'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="项目经理">
                {form.getFieldDecorator('responsibilityPeople', {
                  rules: [{required: true, message: '请输入项目经理'}],
                  initialValue: selectedValues.responsibilityPeople ? selectedValues.responsibilityPeople : testValue

                })(<Input disabled={checkDetail} placeholder='请输入项目经理'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="项目书记">
                {form.getFieldDecorator('responsibilitySecretary', {
                  rules: [{required: true, message: '请输入项目书记'}],
                  initialValue: selectedValues.responsibilitySecretary ? selectedValues.responsibilitySecretary : testValue

                })(<Input disabled={checkDetail} placeholder="项目书记"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 25 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('responsibilityAnnex', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.responsibilityAnnex ? selectedValues.responsibilityAnnex : [],
                })(
                  <Upload.Dragger onChange={(e) => this.handleChange(e, 2)}
                                  accept={'image/*'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="picture"
                                  name="files"
                                  disabled={responsibilityAnnex.length > 0}
                                  onSuccess={(e) => this.onSuccess(e, 2)}
                                  handleManualRemove={(e) => this.remove(e, 2)}
                                  onError={this.onError}
                                  onProgress={(e) => this.onProgress(e, 2)}
                                  customRequest={(e) => this.onUpload(e, 2)}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile index={2} onClose={this.remove} onPreview={this.handlePreview} progress={resProgress} file={responsibilityAnnex[0]}/>
                <span style={info_css}>备注：请以一份图片格式文件上传</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="中期计价附件" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </Modal>
    );
  }

  handleChange = ({fileList}, index) => {
    if (index == 2) {
      this.setState({responsibilityAnnex: fileList})
    }
    if (index == 1) {
      this.setState({jointHearingAnnex: fileList})
    }
    if (index == 0) {
      this.setState({evaluationAnnex: fileList})
    }
  }

  onUpload = (params,index) => {
    QiNiuOss(params).then(res => {
      this.upload[index] = res
    })
  }

  onProgress = (e, index) => {
    //  console.log(Upload.autoUpdateProgress)
    if (index == 2) {
      this.setState({resProgress: parseInt(e.total.percent)})
    }
    if (index == 1) {
      this.setState({joinProgress: parseInt(e.total.percent)})
    }
    if (index == 0) {
      this.setState({evaProgress: parseInt(e.total.percent)})
    }
    // console.log('上传进度', e)
  }

  onError = (error) => {
    console.log('上传失败', error)
  }

  onSuccess = (res, index) => {
    //this.state.fileList.push(ImageUrl+res.key)
    if (index == 2) {
      let file = {
        uid: '-1',
        name: this.state.responsibilityAnnex[0].name,
        status: 'done',
        url: ImageUrl + res.key,
      }
      this.setState({responsibilityAnnex: [file]})
      this.props.form.setFieldsValue({responsibilityAnnex: [file]});
    }
    if (index == 1) {
      let file = {
        uid: '-1',
        name: this.state.jointHearingAnnex[0].name,
        status: 'done',
        url: ImageUrl + res.key,
        type:this.state.jointHearingAnnex[0].type.split('/')[1]
      }
      this.setState({jointHearingAnnex: [file]})
      this.props.form.setFieldsValue({jointHearingAnnex: [file]});
    }
    if (index == 0) {
      let file = {
        uid: '-1',
        name: this.state.evaluationAnnex[0].name,
        status: 'done',
        url: ImageUrl + res.key,
        type:this.state.evaluationAnnex[0].type.split('/')[1]
      }
      this.setState({evaluationAnnex: [file]})
      this.props.form.setFieldsValue({evaluationAnnex: [file]});
    }
  }

  remove = (res, index) => {
    if (index == 2) {
      if (res.status == 'done') {
        this.props.form.setFieldsValue({responsibilityAnnex: []});
      } else {
        this.upload[2].unsubscribe()
      }
      this.setState({responsibilityAnnex: []})
    }
    if (index == 1) {
      if (res.status == 'done') {
        this.props.form.setFieldsValue({jointHearingAnnex: []});
      } else {
        this.upload[1].unsubscribe()
      }
      this.setState({jointHearingAnnex: []})
    }
    if (index == 0) {
      if (res.status == 'done') {
        this.props.form.setFieldsValue({evaluationAnnex: []});
      } else {
        this.upload[0].unsubscribe()
      }
      this.setState({evaluationAnnex: []})
    }
  }
}

@Form.create()
class ProEvaluate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      selectedValues: {},
      checkDetail: false
    }
    this.exportParams = {
      page:1,
      pageSize:10
    }
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'code',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '工程类别',
      dataIndex: 'engineeringType',
    },
    {
      title: '项目状态',
      dataIndex: 'projectStatus',
    },
    {
      title: '合同额',
      children: [{
        title: '中标',
        key: 'winningBid',
        dataIndex: 'winningBid',
      }, {
        title: '有效收入',
        key: 'effectiveIncome',
        dataIndex: 'effectiveIncome',
      },]
    },
    {
      title: '合同',
      children: [{
        title: '是否签订',
        key: 'isSign',
        dataIndex: 'isSign'
      }, {
        title: '签订日期',
        dataIndex: 'signTime',
        key: 'signTime',
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      },]
    },
    {
      title: '合同工期',
      children: [{
        title: '合同开工时间',
        key: 'contractStartTime',
        dataIndex: 'contractStartTime',
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '合同竣工时间',
        key: 'contractEndTime',
        dataIndex: 'contractEndTime',
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '工期(月)',
        key: 'duration',
        dataIndex: 'duration',
      }]
    },
    {
      title: '经管部评估',
      children: [{
        title: '评估时间',
        key: 'evaluationTime',
        dataIndex: 'evaluationTime',
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '评估效益点(%)',
        key: 'evaluationBenefit',
        dataIndex: 'evaluationBenefit',
      }, {
        title: '含分包差及经营费(%)',
        key: 'evaluationCost',
        dataIndex: 'evaluationCost',
      }, {
        title: '评估编号',
        key: 'evaluationCode',
        dataIndex: 'evaluationCode'
      }, {
        title: '附件',
        key: 'evaluationAnnex',
        dataIndex: 'evaluationAnnex',
        render(val) {
          return <a href={val} download={'附件'}>下载</a>;
        },
      }]
    },
    {
      title: '会审情况',
      children: [{
        title: '效益点',
        key: 'jointHearingBenefit',
        dataIndex: 'jointHearingBenefit'
      }, {
        title: '是否含分包差及经营费',
        key: 'jointHearingCost',
        dataIndex: 'jointHearingCost'
      }, {
        title: '上会时间',
        key: 'jointHearingTime',
        dataIndex: 'jointHearingTime',
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '附件',
        key: 'jointHearingAnnex',
        dataIndex: 'jointHearingAnnex',
        render(val) {
          return <a href="#">下载</a>;
        },
      }]
    },
    {
      title: '责任状签订',
      children: [{
        title: '效益点',
        key: 'responsibilityBenefiy',
        dataIndex: 'responsibilityBenefiy'
      }, {
        title: '签订时间',
        key: 'responsibilityTime',
        dataIndex: 'responsibilityTime',
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '项目经理',
        key: 'responsibilityPeople',
        dataIndex: 'responsibilityPeople',
      }, {
        title: '项目书记',
        key: 'responsibilitySecretary',
        dataIndex: 'responsibilitySecretary',
      }, {
        title: '附件',
        key: 'responsibilityAnnex',
        dataIndex: 'responsibilityAnnex',
        render(val) {
          return <a href={val} download={'附件'}>下载</a>;
        },
      }]
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (val, record) => {
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <Fragment>
                <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
                <Divider type="vertical"/>
              </Fragment> : null}
            {getButtons(button, pageButtons[2]) ?
              <a onClick={() => this.handleCheckDetail(true, record)}>查看</a>
              : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    this.getProNames()
    this.getList()
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
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

  handleSearch = e => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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

  handleAdd = (fields, updateModalVisible, selectedValues) => {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    const {dispatch, app: {user}} = this.props;
    const payload = {
      projectId: fields.projectId,
      engineeringType: fields.engineeringType,
      signTime: fields.signTime,
      evaluationStatus: fields.evaluationStatus,
      projectStatus: fields.projectStatus,
      winningBid: fields.winningBid,
      effectiveIncome: fields.effectiveIncome,
      isSign: fields.isSign,
      duration: fields.duration,
      contractStartTime: fields.contractStartTime,
      contractEndTime: fields.contractEndTime,
      evaluationTime: fields.evaluationTime,
      evaluationBenefit: fields.evaluationBenefit,
      evaluationCost: fields.evaluationCost,
      evaluationCode: fields.evaluationCode,
      evaluationAnnex: fields.evaluationAnnex,
      jointHearingBenefit: fields.jointHearingBenefit,
      jointHearingCost: fields.jointHearingCost,
      jointHearingTime: fields.jointHearingTime,
      jointHearingAnnex: fields.jointHearingAnnex,
      responsibilityBenefiy: fields.responsibilityBenefiy,
      responsibilityTime: fields.responsibilityTime,
      responsibilityPeople: fields.responsibilityPeople,
      responsibilitySecretary: fields.responsibilitySecretary,
      responsibilityAnnex: fields.responsibilityAnnex,
    }
    // return console.log(updateModalVisible)
    if (updateModalVisible) {
      //  return console.log(selectedValues.id)
      dispatch({
        type: 'proEvaluate/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.getList()
        }
      })
    } else {
      dispatch({
        type: 'proEvaluate/add',
        payload: payload,
        token: user.token
      }).then(res => {
        if (res) {
          this.handleModalVisible()
          this.getList()
        }
      })
    }
  };

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评估状态">
              {getFieldDecorator('evaluationStatus')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  {reStatus.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目状态">
              {getFieldDecorator('projectStatus')(
                <Input/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="合同是否签订">
              {getFieldDecorator('siSign')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="是">是</Option>
                <Option value="否">否</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="责任状是否签订">
              {getFieldDecorator('give')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{overflow: 'hidden'}}>
              <div style={{float: 'right', marginBottom: 24}}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm()
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const {
      proEvaluate: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames
    }
    const exportUrl = createURL(EVAL_EXPORT,{...this.exportParams,...{token:user.token}})

    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="项目评估">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button href={exportUrl} icon="plus" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['proEvaluate/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: '250%'}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} {...parentState}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName = []) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'proEvaluate/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'proEvaluate/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e, page = 1, pageSize = 10) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let time = fieldsValue.meteringTime ? fieldsValue.meteringTime.format('YYYY-MM-DD') : null
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        minPayProportion: fieldsValue.minPayProportion,
        maxPayProportion: fieldsValue.maxPayProportion,
        minProductionValue: fieldsValue.minProductionValue,
        maxProductionValue: fieldsValue.maxProductionValue,
        meteringTime: time
      }
      cleanObject(payload)
      this.exportParams = payload
      //  form.resetFields();
      this.props.dispatch({
        type: 'proEvaluate/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

ProEvaluate.propTypes = {}

export default connect(({app, rule, loading, proEvaluate}) => ({app, rule, loading, proEvaluate}))(ProEvaluate)
