import React, {Component, Fragment} from 'react'
import {connect} from 'dva'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Modal,
  Upload,
  Divider,
  Badge,
  Tag
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, PreFile, ExportModal} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, QiNiuOss, ImageUrl} from 'utils'
import {menuData} from 'common/menu'
import {professionType, subType, taxpayerType} from 'common/types'
import moment from 'moment'
import {createURL} from 'services/app'
import {SUB_QUA_PDF, SUB_QUA_EXPORT} from 'common/urls'
import {apiDev} from 'utils/config'

const pageButtons = menuData[10].buttons.map(a => a.permission)

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const info_css = {
  color: '#fa541c'
}
const testValue = ''
const TenW = 100
const plainOptions = [
  {label: '分包商类型', value: '1'},
  {label: '法定代表人', value: '2'},
  {label: '注册资本金', value: '3'},
  {label: '资质信息', value: '4'},
  {label: '信誉评价', value: '5'},
]
const periodType = ['绿色','黄色','红色']
const _setColor = function (time) {
  let num
  num = time.split(' ')[0]
  if (time.includes('前')) {
    return 'error'
  } else {
    if (time.includes('天') || (num <= 3 && time.includes('月'))) {
      return 'warning'
    }
    return 'success'
  }

}

@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      progress: 0,
      dateOpen:false,
      showTag:false
    };
    this.upload = null
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
      if(fieldsValue.annex.length>0) {
        fieldsValue.annex = `{"url":"${this.state.fileList[0].url}","fileName":"${this.state.fileList[0].name}"}`
      }else {
        fieldsValue.annex =''
      }
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  componentDidUpdate(preProp, preState) {
    if (this.props.modalVisible && !preProp.selectedValues.annex && this.props.selectedValues.annex && this.state.fileList.length == 0) {
      let pdf = JSON.parse(this.props.selectedValues.annex)
      let file = {
        uid: '-1',
        name: pdf.fileName,
        status: 'done',
        url: pdf.url,
      }
      this.setState({fileList: [file]})
    }
  }

  handleCancel = () => this.setState({previewVisible: false})

  cleanState = () => {
    this.setState({fileList: [], previewImage: ''})
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  componentWillUnmount() {
    this.upload = null
  }

  handleChange = ({fileList}) => {
    this.setState({fileList})
  }

  renderExtral=()=>{
    return <a onClick={()=>this.longPeriod()}>长期</a>
  }

  longPeriod=()=>{
    this.props.form.setFieldsValue({'businessLicenseValidityPeriod':moment('2200-01-01')})
    this.setState({dateOpen:false,showTag:true})
  }

  render() {
    const {modalVisible, loading, form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {previewVisible, previewImage, fileList, progress,dateOpen,showTag} = this.state
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '分包商资质信息卡' : updateModalVisible ? "编辑分包商资质信息卡" : "新增分包商资质信息卡"}
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
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分包商全称">
                {form.getFieldDecorator('name', {
                  rules: [{required: true, message: '请输入分包商全称'}],
                  initialValue: selectedValues.name ? selectedValues.name : testValue
                })(<Input disabled={checkDetail} placeholder="请输入分包商全称"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="成立日期">
                {form.getFieldDecorator('createTime', {
                  rules: [{required: true, message: '请选择成立日期'}],
                  initialValue: selectedValues.createTime ? moment(selectedValues.createTime) : null
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="纳税人类型">
                {form.getFieldDecorator('taxpayerType', {
                  rules: [{required: true, message: '请选择纳税人类型'}],
                  initialValue: selectedValues.taxpayerType ? selectedValues.taxpayerType : ''
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择纳税人类型"
                           style={{width: '100%'}}>
                  {taxpayerType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="注册资本金">
                {form.getFieldDecorator('registeredCapital', {
                  rules: [{required: true, message: '请输入注册资本金'}],
                  initialValue: selectedValues.registeredCapital ? selectedValues.registeredCapital : testValue
                })(<Input disabled={checkDetail} placeholder="请输入注册资本金" addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col md={12} sm={24}>
              <FormItem  labelCol={{span: 4}} wrapperCol={{span: 20}} label="电话">
                {form.getFieldDecorator('phone', {
                  initialValue: selectedValues.phone ? selectedValues.phone : testValue
                })(<Input disabled={checkDetail} placeholder="请输入电话"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem  labelCol={{span: 4}} wrapperCol={{span: 20}} label="电子邮箱">
                {form.getFieldDecorator('email', {
                  initialValue: selectedValues.email ? selectedValues.email : testValue
                })(<Input disabled={checkDetail} placeholder="请输入电子邮箱"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="注册地址">
                {form.getFieldDecorator('address', {
                  rules: [{required: true, message: '请输入注册地址'}],
                  initialValue: selectedValues.address ? selectedValues.address : testValue
                })(<Input disabled={checkDetail} placeholder="请输入注册地址"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="邮编">
                {form.getFieldDecorator('zipCode', {
                  initialValue: selectedValues.zipCode ? selectedValues.zipCode : testValue
                })(<Input disabled={checkDetail} placeholder="请输入邮编"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col md={12} sm={24}>
              <FormItem style={{marginLeft: 14 + 'px'}} labelCol={{span: 4}} wrapperCol={{span: 20}} label="分包商类型">
                {form.getFieldDecorator('type', {
                  initialValue: selectedValues.type ? selectedValues.type.split('、') : []
                })(<Select mode="multiple" className={styles.customSelect} disabled={checkDetail} placeholder="请选择分包商类型"
                           style={{width: '100%'}}>
                  {subType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem style={{marginLeft: 14 + 'px'}} labelCol={{span: 4}} wrapperCol={{span: 20}} label="专业类型">
                {form.getFieldDecorator('professionType', {
                  initialValue: selectedValues.professionType ? selectedValues.professionType.split('、') : []
                })(<Select mode="multiple" className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {professionType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>法定代表人</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="姓名">
                {form.getFieldDecorator('legalPersonName', {
                  rules: [{required: true, message: '请输入姓名'}],
                  initialValue: selectedValues.legalPersonName ? selectedValues.legalPersonName : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入姓名"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="职务">
                {form.getFieldDecorator('legalPersonPosition', {
                  initialValue: selectedValues.legalPersonPosition ? selectedValues.legalPersonPosition : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入职务"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="身份证号码">
                {form.getFieldDecorator('legalPersonCard', {
                  initialValue: selectedValues.legalPersonCard ? selectedValues.legalPersonCard : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入身份证"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系方式">
                {form.getFieldDecorator('legalPersonPhone', {
                  initialValue: selectedValues.legalPersonPhone ? selectedValues.legalPersonPhone : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入联系方式"/>)}
              </FormItem>
            </Col>
            <Col md={16} sm={24}>
              <FormItem labelCol={{span: 3}} style={{marginLeft: 14 + 'px'}} wrapperCol={{span: 15}} label="家庭住址">
                {form.getFieldDecorator('legalPersonAddress', {
                  initialValue: selectedValues.legalPersonAddress ? selectedValues.legalPersonAddress : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入家庭住址"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>营业执照</div>
        </Row>
        <div className={styles.modalContent} style={{paddingLeft: 0}}>
          <Row gutter={2}>
            <Col md={10} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="统一社会信誉代码">
                {form.getFieldDecorator('businessLicenseCode', {
                  rules: [{required: true, message: '请输入统一社会信誉代码'}],
                  initialValue: selectedValues.businessLicenseCode ? selectedValues.businessLicenseCode : testValue
                })(<Input disabled={checkDetail} placeholder="请输入统一社会信誉代码"/>)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem style={{paddingLeft: 5 + 'px'}} labelCol={{span: 8}} wrapperCol={{span: 15}} label="有效期限">
                {form.getFieldDecorator('businessLicenseValidityPeriod', {
                  rules: [{required: true, message: '请选择期限'}],
                  initialValue: selectedValues.businessLicenseValidityPeriod ? moment(selectedValues.businessLicenseValidityPeriod) : null
                })(showTag?<Tag
                    closable
                    visible={showTag}
                    color="#87d068"
                    onClose={() => this.onTagClose()}
                  >
                    长期
                  </Tag>:
                  <DatePicker  onOpenChange={(dateOpen)=>this.setState({dateOpen})} open={dateOpen} renderExtraFooter={() => this.renderExtral()} disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
                {form.getFieldDecorator('businessLicenseFrom', {
                  rules: [{required: true, message: '请输入发证机关'}],
                  initialValue: selectedValues.businessLicenseFrom ? selectedValues.businessLicenseFrom : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>

        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>资质证书</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="证书编号">
                {form.getFieldDecorator('qualificationCode', {
                  initialValue: selectedValues.qualificationCode ? selectedValues.qualificationCode : testValue
                })(<Input disabled={checkDetail} placeholder="请输入证书编号"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="有效期限">
                {form.getFieldDecorator('qualificationValidityPeriod', {
                  initialValue: selectedValues.qualificationValidityPeriod ? moment(selectedValues.qualificationValidityPeriod) : null
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
                {form.getFieldDecorator('qualificationFrom', {
                  initialValue: selectedValues.qualificationFrom ? selectedValues.qualificationFrom : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>

        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>安全生产许可证</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="编号">
                {form.getFieldDecorator('safetyCode', {
                  initialValue: selectedValues.safetyCode ? selectedValues.safetyCode : testValue
                })(<Input disabled={checkDetail} placeholder="请输入编号"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="有效期限">
                {form.getFieldDecorator('safetyValidityPeriod', {
                  initialValue: selectedValues.safetyValidityPeriod ? moment(selectedValues.safetyValidityPeriod) : null
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
                {form.getFieldDecorator('safetyFrom', {
                  initialValue: selectedValues.safetyFrom ? selectedValues.safetyFrom : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>

        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>开户银行许可证</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="开户银行">
                {form.getFieldDecorator('bank', {
                  initialValue: selectedValues.bank ? selectedValues.bank : testValue
                })(<Input disabled={checkDetail} placeholder="请输入开户银行"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="银行账号">
                {form.getFieldDecorator('bankAccount', {
                  initialValue: selectedValues.bankAccount ? selectedValues.bankAccount : testValue
                })(<Input disabled={checkDetail} placeholder="请输入银行账号"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
                {form.getFieldDecorator('bankFrom', {
                  initialValue: selectedValues.bankFrom ? selectedValues.bankFrom : testValue
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>附件</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 14 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('annex', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.annex ? [selectedValues.annex] : [],
                })(
                  <Upload.Dragger onChange={this.handleChange}
                                  accept={'.pdf'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="picture"
                                  name="files"
                                  disabled={fileList.length > 0 || checkDetail}
                                  onSuccess={this.onSuccess}
                                  handleManualRemove={this.remove}
                                  onError={this.onError}
                                  onProgress={this.onProgress}
                                  customRequest={this.onUpload}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile disabled={checkDetail} onClose={this.remove} onPreview={this.handlePreview} progress={progress}
                         file={fileList[0]}/>
                <span style={info_css}>备注：包含营业执照、资质证书、安全生产许可证、开户银行许可证、法人身份证等相关资质资料(盖鲜章),请以一份PDF格式文件上传。</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 18 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="请输入" rows={4}/>)}
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

  onTagClose=()=>{
    this.props.form.setFieldsValue({'businessLicenseValidityPeriod':null})
    this.setState({ showTag: false })
  }

  onUpload = (params) => {
    QiNiuOss(params).then(res => {
      this.upload = res
    })
  }

  onProgress = (e) => {
    this.setState({progress: parseInt(e.total.percent)})
  }

  onError = (error) => {
    console.log('上传失败', error)
  }

  onSuccess = (res) => {
    //this.state.fileList.push(ImageUrl+res.key)
    let file = {
      uid: '-1',
      name: this.state.fileList[0].name,
      status: 'done',
      url: ImageUrl + res.key,
    }
    this.setState({fileList: [file]})
    this.props.form.setFieldsValue({annex: [file]});
  }

  remove = (res) => {
    if (res.status == 'done') {
      this.props.form.setFieldsValue({annex: []});
    } else if(this.upload){
      this.upload.unsubscribe()
    }
    this.setState({fileList: []})
  }
}

const CreateReview = Form.create()(props => {
  let {modalVisible, form, loading, handleReview, handleReviewModal, selectedValues} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleReview(fieldsValue, modalVisible, selectedValues);
    });
  };

  const title = (type) => {
    let name = '股份公司综合信誉评价'

    if (type == 1) {
      name = '集团公司综合信誉评价'
    }
    if (type == 2) {
      name = '公司本级综合信誉评价'
    }
    return name
  }

  const renderContent = (type) => {
    let content = (<div className={styles.modalContent}>
      <Row gutter={8}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="股份公司综合信誉评价">
            {form.getFieldDecorator('shareEvaluation', {
              rules: [{required: false}],
              initialValue: selectedValues.shareEvaluation ? selectedValues.shareEvaluation : ''
            })(<Select className={styles.customSelect} placeholder="请选择" style={{width: '100%'}}>
              <Option value="优秀">优秀</Option>
              <Option value="合格">合格</Option>
              <Option value="不合格">不合格</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
    </div>)

    if (type == 1) {
      content = (<div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="集团公司综合信誉评价">
              {form.getFieldDecorator('groupEvaluation', {
                rules: [{required: false}],
                initialValue: selectedValues.groupEvaluation ? selectedValues.groupEvaluation : ''
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>)
    }

    if (type == 2) {
      content = (<div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="公司信誉评价">
              {form.getFieldDecorator('companyEvaluation', {
                rules: [{required: false}],
                initialValue: selectedValues.companyEvaluation ? selectedValues.companyEvaluation : ''
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="良好">良好</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
                <Option value="限制使用">限制使用</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="资质是否齐全">
              {form.getFieldDecorator('qualification', {
                rules: [{required: false}],
                initialValue: selectedValues.qualification ? selectedValues.qualification : ''
              })(<Select className={styles.customSelect} placeholder="请选择" style={{width: '100%'}}>
                <Option value="是">是</Option>
                <Option value="否">否</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>)
    }
    return content
  }

  return (
    <Modal
      destroyOnClose
      title={title(modalVisible)}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible > -1}
      width={992}
      okButtonProps={{loading: loading}}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleReviewModal()}
    >
      {renderContent(modalVisible)}
    </Modal>
  );
});

@Form.create()
class Qualification extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      expandForm: false,
      reviewType: -1,
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
      title: '分包商备案编码',
      dataIndex: 'code',
    },
    {
      title: '分包商全称',
      dataIndex: 'name',
      render: (val, record) => {
        return <a onClick={() => this.getResume(val)}>{val}</a>
      }
    },
    {
      title: '分包商类型',
      dataIndex: 'type'
    },
    {
      title: '专业类型',
      dataIndex: 'professionType'
    },
    {
      title: '纳税人类型',
      dataIndex: 'taxpayerType'
    },
    {
      title: '法人',
      dataIndex: 'legalPersonName'
    },
    {
      title: '注册本金（万元）',
      dataIndex: 'registeredCapital'
    },
    {
      title: '资料是否齐全',
      dataIndex: 'qualification'
    },
    {
      title: '股份公司综合信誉评价',
      dataIndex: 'shareEvaluation'
    },
    {
      title: '集团公司综合信誉评价',
      dataIndex: 'groupEvaluation'
    },
    {
      title: '公司本级综合信誉评价',
      dataIndex: 'companyEvaluation'
    },
    {
      title: '证件期限',
      key: 'period',
      render: (val, record) => {
        let status = this.checkPeriod(record)
        return <Badge offset={[5, 0]} status={status}/>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '下载分包商资质信息卡',
      dataIndex: 'id',
      render: (val, record) => {
        return (
          <a href={apiDev + SUB_QUA_PDF + val} download={'分包商资质信息卡'}>下载</a>
        )
      }
    },
    {
      title: '下载附件',
      render: (val, record) => {
        if(!record.annex){
          return null
        }
        let annex = JSON.parse(record.annex)
        let href = annex.url + '?attname=' + annex.fileName
        return (
          <a href={href} download="附件">下载</a>
        )
      }
    },
    {
      title: '操作',
      render: (val, record) => {
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        const menu = (
          <Menu onClick={(e) => this.handleMenuClick(e, record)} selectedKeys={[]}>
            {getButtons(button, pageButtons[4]) ? <Menu.Item key="0">股份公司综合信誉评价</Menu.Item> : null}
            {getButtons(button, pageButtons[5]) ? <Menu.Item key="1"> 集团公司综合信誉评价</Menu.Item> : null}
            {getButtons(button, pageButtons[6]) ? <Menu.Item key="2">公司本级综合信誉评价</Menu.Item> : null}
          </Menu>
        );
        const more = (getButtons(button, pageButtons[4]) || getButtons(button, pageButtons[5]) || getButtons(button, pageButtons[6])
          ?
          <Fragment>
            <Divider type="vertical"/>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link">
                更多 <Icon type="down"/>
              </a>
            </Dropdown>
          </Fragment> : null)
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ?
              <a onClick={() => this.handleCheckDetail(true, record)}>查看</a> : null}
            {more}
            {/* <Divider type="horizontal"/>
          <a onClick={() => this.handleReviewModal(0,record)}> 股份公司综合信誉评价</a>
          <Divider type="horizontal"/>
          <a onClick={() => this.handleReviewModal(1,record)}>集团公司综合信誉评价</a>
          <Divider type="horizontal"/>
          <a onClick={() => this.handleReviewModal(2,record)}>公司本级综合信誉评价</a>*/}
          </Fragment>
        )
      }
    },
  ];

  checkPeriod = (record) => {
    let status1 = _setColor(moment(record.businessLicenseValidityPeriod).fromNow())
    let status2 = _setColor(moment(record.qualificationValidityPeriod).fromNow())
    let status3 = _setColor(moment(record.safetyValidityPeriod).fromNow())
    let status = [status1, status2, status3]
    if (status.includes('error')) {
      return 'error'
    }
    if (status.includes('warning')) {
      return 'warning'
    }
    return 'success'
  }

  componentDidMount() {
    this.getList()
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchList(pagination.current, pagination.pageSize)
  };

  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.getList()
  };

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e, selectValues) => {
    if (e.key == 3) {
      return
    } else {
      this.handleReviewModal(e.key, selectValues)
    }
  };

  handleSelectRows = rows => {
    if (rows.length <= 1) {
      this.setState({
        selectedRows: rows,
      });
    }
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

  handleReviewModal = (flag = -1, selectedValues = {}) => {
    this.setState({
      reviewType: flag,
      selectedValues: selectedValues
    })
  }

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

  handleAdd = (fieldsValue, updateModalVisible, selectedValues, cleanState) => {
    const {dispatch, app: {user}} = this.props;
    let payload = {
      name: fieldsValue.name,
      type: fieldsValue.type.join('、'),
      professionType: fieldsValue.professionType.join('、'),
      registeredCapital: fieldsValue.registeredCapital,
      taxpayerType: fieldsValue.taxpayerType,
      email: fieldsValue.email,
      phone: fieldsValue.phone,
      address: fieldsValue.address,
      zipCode: fieldsValue.zipCode,
      legalPersonName: fieldsValue.legalPersonName,
      legalPersonPosition: fieldsValue.legalPersonPosition,
      legalPersonCard: fieldsValue.legalPersonCard,
      legalPersonPhone: fieldsValue.legalPersonPhone,
      legalPersonAddress: fieldsValue.legalPersonAddress,
      businessLicenseCode: fieldsValue.registeredCapital,
      businessLicenseValidityPeriod: fieldsValue.businessLicenseValidityPeriod,
      businessLicenseFrom: fieldsValue.businessLicenseFrom,
      qualificationCode: fieldsValue.qualificationCode,
      qualificationValidityPeriod: fieldsValue.qualificationValidityPeriod,
      qualificationFrom: fieldsValue.qualificationFrom,
      safetyCode: fieldsValue.safetyCode,
      safetyValidityPeriod: fieldsValue.safetyValidityPeriod,
      safetyFrom: fieldsValue.safetyFrom,
      bank: fieldsValue.bank,
      bankAccount: fieldsValue.bankAccount,
      bankFrom: fieldsValue.bankFrom,
      annex: fieldsValue.annex,
      createTime: fieldsValue.createTime,
      remark: fieldsValue.remark
    }
    cleanObject(payload)
    if (updateModalVisible) {
      dispatch({
        type: 'sub_qua/update',
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
        type: 'sub_qua/add',
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

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {expandForm} = this.state;
    return (
      <Form onSubmit={this.searchList} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="分包商全称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商类型">
              {getFieldDecorator('type')(<Select  style={{width: '100%'}}>
                {subType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="专业类别">
              {getFieldDecorator('professionType')(<Select style={{width: '100%'}}>
                {professionType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="注册资金">
              {getFieldDecorator('registeredCapital')(<Select  style={{width: '100%'}}>
                <Option value={`{"minAmount":"0","maxAmount":"${5 * TenW}"}`}>500万以下</Option>
                <Option value={`{"minAmount":"${5 * TenW}","maxAmount":"${10 * TenW}"}`}>500万-1000万</Option>
                <Option value={`{"minAmount":"${10 * TenW}","maxAmount":"${30 * TenW}"}`}>1000万-3000万</Option>
                <Option value={`{"minAmount":"${30 * TenW}","maxAmount":"${50 * TenW}"}`}>3000万-5000万</Option>
                <Option value={`{"minAmount":"${50 * TenW}","maxAmount":"${100 * TenW}"}`}>5000万-1亿</Option>
                <Option value={`{"minAmount":"${100 * TenW}","maxAmount":"${900 * TenW}"}`}>1亿以上</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? <Row gutter={{md: 4, lg: 12, xl: 24}}>
          <Col md={8} sm={24}>
            <FormItem label="股份公司综合信誉评价">
              {getFieldDecorator('shareEvaluation')(<Select  style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="集团公司综合信誉评价">
              {getFieldDecorator('groupEvaluation')(<Select  style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="公司本级综合信誉评价">
              {getFieldDecorator('companyEvaluation')(<Select style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="良好">良好</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
                <Option value="限制使用">限制使用</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row> : null}
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="证书期限">
              {getFieldDecorator('isValid')(<Select style={{width: '100%'}}>
                {periodType.map((a, index) => <Option key={index} value={index}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <div style={{overflow: 'hidden'}}>
            <div style={{float: 'right', marginBottom: 24}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                {expandForm ? '收起' : '展开'} <Icon type={expandForm ? "up" : "down"}/>
              </a>
            </div>
          </div>
        </Row>
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
      sub_qua: {data},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, exportModalVisible, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail, reviewType} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleReviewModal: this.handleReviewModal,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      handleReview: this.handleReview
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      selectedRows: selectedRows
    }
    const exportUrl = createURL(SUB_QUA_EXPORT, {
      ...this.exportParams, ...{
        token: user.token,
        exportType: 'subcontractorExportType'
      }
    })
    const exportProps = {
      exportModalVisible: exportModalVisible,
      handleExportModalVisible: this.handleExportModalVisible,
      exportUrl: exportUrl,
      plainOptions: plainOptions,
      must: true
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="分包商资质信息">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button onClick={() => this.handleExportModalVisible(true)} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['sub_qua/fetch']}
                bordered
                rowKey="id"
                data={data}
                scroll={{x: '260%',y: global._scollY}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm
            loading={loading.effects[`sub_qua/${updateModalVisible ? 'update' : 'add'}`]} {...parentMethods} {...parentState}/>
          <CreateReview loading={loading.effects[`sub_qua/update'}`]} {...parentMethods} selectedValues={selectedValues}
                        modalVisible={reviewType}/>
          <ExportModal {...exportProps}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getResume = (name) => {
    //  routerRedux.push('/sub/resume',{subcontractorName:name})
    let payload = {subcontractorName: name}
    this.props.dispatch({type: 'sub_qua/getResume', payload: payload})
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'sub_qua/fetch',
      payload: {page: page, pageSize: pageSize}
    });
  }

  searchList = (e,page = 1, pageSize = 10) => {
    e&&e.preventDefault?e.preventDefault():null
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let minAmount, maxAmount
      if (fieldsValue.registeredCapital) {
        let amount = JSON.parse(fieldsValue.registeredCapital)
        minAmount = amount.minAmount
        maxAmount = amount.maxAmount
      }
      let payload = {
        page: page,
        pageSize: pageSize,
        name: fieldsValue.name,
        type: fieldsValue.type,
        professionType: fieldsValue.professionType,
        minAmount: minAmount,
        maxAmount: maxAmount,
        shareEvaluation: fieldsValue.shareEvaluation,
        companyEvaluation: fieldsValue.companyEvaluation,
        groupEvaluation: fieldsValue.groupEvaluation,
        isValid:fieldsValue.isValid
      }
      cleanObject(payload)
      this.props.dispatch({
        type: 'sub_qua/fetch',
        payload: payload
      });
    });
  }

  handleReview = (fieldsValue, type, selectedValues) => {
    //type:0股份公司 1集团公司 2公司本级
    const {dispatch, app: {user}} = this.props;
    const payload = type == 0 ? {
      shareEvaluation: fieldsValue.shareEvaluation,
      shareRemark: fieldsValue.shareRemark
    } : type == 1 ? {
      groupEvaluation: fieldsValue.groupEvaluation,
      groupRemark: fieldsValue.groupRemark
    } : {
      qualification: fieldsValue.qualification,
      companyEvaluation: fieldsValue.companyEvaluation,
    }
    this.exportParams = payload
    dispatch({
      type: 'sub_qua/update',
      payload: {...payload, ...{id: selectedValues.id}},
      token: user.token
    }).then(res => {
      if (res) {
        this.handleReviewModal()
        this.getList()
      }
    })
  }
}

Qualification.propTypes = {}

export default connect(({app, rule, loading, sub_qua}) => ({app, rule, loading, sub_qua}))(Qualification)
