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
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut, getButtons} from 'utils'
import {menuData} from 'common/menu'
import {professionType, subType, taxpayerType} from 'common/types'
import moment from 'moment'

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
const testValue = '123'
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'
const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      fieldsValue.annex = testPDF
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          // console.log(fieldsValue[prop].format())
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
          //  console.log(fieldsValue[prop])
        }
        // console.log(typeof fieldsValue[prop])
      }
      // form.resetFields();
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={checkDetail ? '分包商资质信息卡' : updateModalVisible ? "编辑分包商资质信息卡" : "新增分包商资质信息卡"}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
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
              {form.getFieldDecorator('setUpTime', {
                rules: [{required: true, message: '请选择成立日期'}],
                initialValue: selectedValues.setUpTime ? moment(selectedValues.setUpTime) : null
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="纳税人类型">
              {form.getFieldDecorator('taxpayerType', {
                rules: [{required: true}],
                initialValue: selectedValues.taxpayerType ? selectedValues.taxpayerType : ''
              })(<Select disabled={checkDetail} placeholder="请选择纳税人类型" style={{width: '100%'}}>
                {taxpayerType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="注册资本金">
              {form.getFieldDecorator('registeredCapital', {
                rules: [{required: true}],
                initialValue: selectedValues.registeredCapital ? selectedValues.registeredCapital : testValue
              })(<Input disabled={checkDetail} placeholder="请输入注册资本金" addonAfter="万元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="分包商类型">
              {form.getFieldDecorator('type', {
                rules: [{required: true, message: '请选择分包商类型'}],
                initialValue: selectedValues.type ? selectedValues.type : ''
              })(<Select disabled={checkDetail} placeholder="请选择分包商类型" style={{width: '100%'}}>
                {subType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="电话">
              {form.getFieldDecorator('phone', {
                rules: [{required: true}],
                initialValue: selectedValues.phone ? selectedValues.phone : testValue
              })(<Input disabled={checkDetail} placeholder="请输入电话"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="电子邮箱">
              {form.getFieldDecorator('email', {
                rules: [{required: true}],
                initialValue: selectedValues.email ? selectedValues.email : testValue
              })(<Input disabled={checkDetail} placeholder="请输入电子邮箱"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={16} sm={24}>
            <FormItem style={{marginLeft: 14 + 'px'}} labelCol={{span: 3}} wrapperCol={{span: 15}} label="注册地址">
              {form.getFieldDecorator('address', {
                rules: [{required: true}],
                initialValue: selectedValues.address ? selectedValues.address : testValue
              })(<Input disabled={checkDetail} placeholder="请输入注册地址"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="邮编">
              {form.getFieldDecorator('zipCode', {
                rules: [{required: true}],
                initialValue: selectedValues.zipCode ? selectedValues.zipCode : testValue
              })(<Input disabled={checkDetail} placeholder="请输入邮编"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="专业类型">
              {form.getFieldDecorator('professionType', {
                rules: [{required: true, message: '请选择专业类型'}],
                initialValue: selectedValues.professionType ? selectedValues.professionType : ''
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
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
                rules: [{required: true, message: '请输入职务'}],
                initialValue: selectedValues.legalPersonPosition ? selectedValues.legalPersonPosition : testValue
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入职务"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="身份证号码">
              {form.getFieldDecorator('legalPersonCard', {
                rules: [{required: true, message: '请输入身份证号码'}],
                initialValue: selectedValues.legalPersonCard ? selectedValues.legalPersonCard : testValue
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入身份证"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系方式">
              {form.getFieldDecorator('legalPersonPhone', {
                rules: [{required: true, message: '请输入联系方式'}],
                initialValue: selectedValues.legalPersonPhone ? selectedValues.legalPersonPhone : testValue
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入联系方式"/>)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem labelCol={{span: 3}} style={{marginLeft: 14 + 'px'}} wrapperCol={{span: 15}} label="家庭住址">
              {form.getFieldDecorator('legalPersonAddress', {
                rules: [{required: true, message: '请输入家庭住址'}],
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
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
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
                rules: [{required: true, message: '请输入证书编号'}],
                initialValue: selectedValues.qualificationCode ? selectedValues.qualificationCode : testValue
              })(<Input disabled={checkDetail} placeholder="请输入证书编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="有效期限">
              {form.getFieldDecorator('qualificationValidityPeriod', {
                rules: [{required: true, message: '请选择期限'}],
                initialValue: selectedValues.qualificationValidityPeriod ? moment(selectedValues.qualificationValidityPeriod) : null
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
              {form.getFieldDecorator('qualificationFrom', {
                rules: [{required: true, message: '请输入发证机关'}],
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
                rules: [{required: true, message: '请输入编号'}],
                initialValue: selectedValues.safetyCode ? selectedValues.safetyCode : testValue
              })(<Input placeholder="请输入编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="有效期限">
              {form.getFieldDecorator('safetyValidityPeriod', {
                rules: [{required: true, message: '请选择期限'}],
                initialValue: selectedValues.safetyValidityPeriod ? moment(selectedValues.safetyValidityPeriod) : null
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
              {form.getFieldDecorator('safetyFrom', {
                rules: [{required: true, message: '请输入发证机关'}],
                initialValue: selectedValues.safetyFrom ? selectedValues.safetyFrom : testValue
              })(<Input style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
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
                rules: [{required: true, message: '请输入开户银行'}],
                initialValue: selectedValues.bank ? selectedValues.bank : testValue
              })(<Input disabled={checkDetail} placeholder="请输入开户银行"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="银行账号">
              {form.getFieldDecorator('bankAccount', {
                rules: [{required: true, message: '请输入银行账号'}],
                initialValue: selectedValues.bankAccount ? selectedValues.bankAccount : testValue
              })(<Input disabled={checkDetail} placeholder="请输入银行账号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
              {form.getFieldDecorator('bankFrom', {
                rules: [{required: true, message: '请输入发证机关'}],
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
              })(
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                  </p>
                  <p className="ant-upload-text">点击或拖动附件进入</p>
                </Upload.Dragger>
              )}
              <span style={info_css}>备注：包含营业执照、资质证书、安全生产许可证、开户银行许可证、法人身份证等相关资质资料(盖鲜章),请以一份PDF格式文件上传。</span>
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const CreateReview = Form.create()(props => {
  let {modalVisible, form, handleReview, handleReviewModal, selectedValues} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      // form.resetFields();
      handleReview(fieldsValue, modalVisible, selectedValues);
    });
  };

  const title = (type) => {
    let name = '股份公司综合信誉评价'
    switch (type) {
      case 1:
        name = '集团公司综合信誉评价'
        break
      case 2:
        name = '公司本级综合信誉评价'
        break
    }
    return name
  }

  const renderContent = (type) => {
    let content = (<div className={styles.modalContent}>
      <Row gutter={8}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="股份公司综合信誉评价">
            {form.getFieldDecorator('shareEvaluation', {
              rules: [{required: true, message: '请选择'}],
              initialValue: selectedValues.shareEvaluation ? selectedValues.shareEvaluation : ''
            })(<Select placeholder="请选择" style={{width: '100%'}}>
              <Option value="优秀">优秀</Option>
              <Option value="合格">合格</Option>
              <Option value="不合格">不合格</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="资质是否齐全">
            {form.getFieldDecorator('qualification', {
              rules: [{required: true, message: '请选择'}],
              initialValue: selectedValues.qualification ? selectedValues.qualification : ''
            })(<Select placeholder="请选择" style={{width: '100%'}}>
              <Option value="是">是</Option>
              <Option value="否">否</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col md={24} sm={24}>
          <FormItem style={{marginLeft: 21 + 'px'}} labelCol={{span: 4}} wrapperCol={{span: 15}} label="备注">
            {form.getFieldDecorator('shareRemark', {
              rules: [{required: true}],
              initialValue: selectedValues.shareRemark ? selectedValues.shareRemark : ''
            })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
          </FormItem>
        </Col>
      </Row>
    </div>)

    if(type==1){
      content = (<div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="集团公司综合信誉评价">
              {form.getFieldDecorator('groupEvaluation', {
                rules: [{required: true, message: '请选择'}],
                initialValue: selectedValues.groupEvaluation ? selectedValues.groupEvaluation : ''
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft: 21 + 'px'}} labelCol={{span: 5}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('groupRemark', {
                rules: [{required: true}],
                initialValue: selectedValues.groupRemark ? selectedValues.groupRemark : ''
              })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
      </div>)
    }

    if(type==2){
      content = (<div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="公司信誉评价">
              {form.getFieldDecorator('companyEvaluation', {
                rules: [{required: true, message: '请选择'}],
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
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="集团公司信誉评价">
              {form.getFieldDecorator('companyGroupEvaluation', {
                rules: [{required: true, message: '请选择'}],
                initialValue: selectedValues.companyGroupEvaluation ? selectedValues.companyGroupEvaluation : ''
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
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
      pageLoading: true,
      expandForm: false,
      reviewType: -1,
      selectedValues: {},
      checkDetail: false
    }
  }

  columns = [
    {
      title: '分包商备案编码',
      dataIndex: 'businessLicenseCode',
    },
    {
      title: '分包商全称',
      dataIndex: 'name',
    },
    {
      title: '分包商类型',
      dataIndex: 'type'
    },
    {
      title: '专业类别',
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
      dataIndex: 'businessLicenseValidityPeriod'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '下载分包商资质信息卡',
      render: (val, record) => {
        const button = this.props.app.user.permissionsMap.button
        return (
          <Fragment>
            <a>下载附件</a>
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
    {
      title: '操作',
      fixed: 'right',
      width: 175,
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

  componentDidMount() {
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    this.getList()
    // setTimeout(() => {
    //   this.setState({pageLoading:false})
    // },1000)
    // dispatch({
    //   type: 'rule/fetch', payload: {pageSize: 5}
    // });
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
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.getList(...params)
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
    console.log(e)
    console.log(selectValues)
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

  handleAdd = (fieldsValue, updateModalVisible, selectedValues) => {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    const {dispatch, app: {user}} = this.props;
    const payload = {
      name: fieldsValue.name,
      type: fieldsValue.type,
      professionType: fieldsValue.professionType,
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
      bank: fieldsValue.bank,
      bankAccount: fieldsValue.bankAccount,
      bankFrom: fieldsValue.bankFrom,
      annex: fieldsValue.annex,
    }
    if (updateModalVisible) {
      dispatch({
        type: 'sub_qua/update',
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
        type: 'sub_qua/add',
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
    const {expandForm} = this.state;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="分包商全称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商类型">
              {getFieldDecorator('type')(<Select placeholder="请选择" style={{width: '100%'}}>
                {subType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="专业类别">
              {getFieldDecorator('professionType')(<Select placeholder="请选择" style={{width: '100%'}}>
                {professionType.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="注册资金">
              {getFieldDecorator('registeredCapital')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">500万以下</Option>
                <Option value="1">500万-1000万</Option>
                <Option value="2">1000万-3000万</Option>
                <Option value="3">3000万-5000万</Option>
                <Option value="4">5000万-1亿</Option>
                <Option value="5">1亿以上</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? <Row gutter={{md: 4, lg: 12, xl: 24}}>
          <Col md={8} sm={24}>
            <FormItem label="股份公司综合信誉评价">
              {getFieldDecorator('companyGroupEvaluation')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="集团公司综合信誉评价">
              {getFieldDecorator('groupEvaluation')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="公司本级综合信誉评价">
              {getFieldDecorator('companyEvaluation')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row> : null}
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
      sub_qua: {data},
      loading,
      app: {darkTheme, user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail, reviewType} = this.state;

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
                  <Button icon="plus" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['sub_qua/fetch']}
                bordered
                rowKey="id"
                data={data}
                scroll={{x: '200%'}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} {...parentState}/>
          <CreateReview {...parentMethods} selectedValues={selectedValues} modalVisible={reviewType}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'sub_qua/fetch',
      payload: {page: page, pageSize: pageSize}
    });
  }

  searchList = (page = 1, pageSize = 10) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      this.props.dispatch({
        type: 'sub_qua/fetch',
        payload: {
          page: page,
          pageSize: pageSize,
          name: fieldsValue.name,
          typeId: fieldsValue.typeId,
          professionType: fieldsValue.professionType,
          registeredCapital: fieldsValue.registeredCapital,
          companyGroupEvaluation: fieldsValue.companyGroupEvaluation,
          companyEvaluation: fieldsValue.companyEvaluation,
          groupEvaluation: fieldsValue.groupEvaluation
        }
      });
    });
  }

  handleReview = (fieldsValue, type, selectedValues) => {
    //type:0股份公司 1集团公司 2公司本级
    const {dispatch, app: {user}} = this.props;
    const payload = type == 0 ? {
      shareEvaluation: fieldsValue.shareEvaluation,
      qualification: fieldsValue.qualification,
      shareRemark: fieldsValue.shareRemark
    } : type == 1 ? {
      groupEvaluation: fieldsValue.groupEvaluation,
      groupRemark: fieldsValue.groupRemark
    } : {
      companyEvaluation: fieldsValue.companyEvaluation,
      companyGroupEvaluation: fieldsValue.companyGroupEvaluation
    }
    dispatch({
      type: 'sub_qua/update',
      payload: {...payload, ...{id: selectedValues.id,}},
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
