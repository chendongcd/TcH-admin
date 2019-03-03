import React, {Component, Fragment} from 'react'
import {connect} from 'dva'
import moment, {isMoment} from 'moment';

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
  Badge,
  Divider
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, ExportModal} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, cloneObject} from 'utils'
import {apiDev} from 'utils/config'
import {menuData} from 'common/menu'
import {PRO_PDF, PRO_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'processing', 'success', 'error'];
const status = [{id: 0, name: '在建'}, {id: 1, name: '完工未结算'}, {id: 2, name: '完工已结算'}, {id: 3, name: '停工'}];

const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
let uuid = 0;
const pageButtons = menuData[6].buttons.map(a => a.permission)
const testValue = ''
const plainOptions = [{label: '项目工期', value: '1'},
  {label: '项目主要人员', value: '2'},
]

@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractDuaType: {
        validateStatus: null,
        errorMsg: null
      }
    }
    this.manager = [{
      name: '',
      time: '',
      phone: ''
    }]
    this.secretary = [{
      name: '',
      time: '',
      phone: ''
    }]
    this.engineer = [{
      name: '',
      time: '',
      phone: ''
    }]
    this.selectProject = {}
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.selectedValues.manager && this.props.selectedValues.manager) {
      this.manager = cloneObject(this.props.selectedValues.manager)
      this.props.form.setFieldsValue({manager: this.manager});
    }
    if (!prevProps.selectedValues.engineer && this.props.selectedValues.engineer) {
      this.engineer = cloneObject(this.props.selectedValues.engineer)
      this.props.form.setFieldsValue({engineer: this.engineer});
    }
    if (!prevProps.selectedValues.secretary && this.props.selectedValues.secretary) {
      this.secretary = cloneObject(this.props.selectedValues.secretary)
      this.props.form.setFieldsValue({secretary: this.secretary});
    }
    if (prevProps.modalVisible && !this.props.modalVisible) {
      this.props.form.setFieldsValue({
        manager: [{
          name: '',
          time: '',
          phone: ''
        }]
      });
      this.props.form.setFieldsValue({
        engineer: [{
          name: '',
          time: '',
          phone: ''
        }]
      });
      this.props.form.setFieldsValue({
        secretary: [{
          name: '',
          time: '',
          phone: ''
        }]
      });
    }
  }

  setRange = (item, index, arr) => {
    if (item.time.length > 0 && !isMoment(item.time[0])) {
      item.time = item.time.split(',').map(a => moment(a))
    }
  }

  setTime = (param) => {
    let obj = JSON.parse(JSON.stringify(param))
    obj.forEach(this.setRange)
    return obj
  }

  _setTime = (param) => {
    if (!Array.isArray(param)) {
      return param.split(',').map(a => moment(a))
    }
    return param

  }

  remove = (k, type, form) => {
    // can use data-binding to get
    const keys = form.getFieldValue(type);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    let object = {
      manager: keys.filter((key, index) => index != k)
    }
    if (type == 'secretary') {
      object = {
        secretary: keys.filter((key, index) => index != k)
      }
      this.secretary = this.secretary.filter((key, index) => index != k)
    } else if (type == 'engineer') {
      object = {
        engineer: keys.filter((key, index) => index != k)
      }
      this.engineer = this.engineer.filter((key, index) => index != k)
    } else {
      this.manager = this.manager.filter((key, index) => index != k)
    }
    // can use data-binding to set
    form.setFieldsValue(object);
  }

  add = (type, form) => {
    const keys = form.getFieldValue(type);
    const nextKeys = keys.concat({name: '', time: '', phone: ''});
    uuid++;

    let object = {
      manager: nextKeys,
    }
    if (type == 'secretary') {
      object = {
        secretary: nextKeys,
      }
      this.secretary = this.secretary.concat({name: '', time: '', phone: ''})
    } else if (type == 'engineer') {
      object = {
        engineer: nextKeys,
      }
      this.engineer = this.engineer.concat({name: '', time: '', phone: ''})
    } else {
      this.manager = this.manager.concat({name: '', time: '', phone: ''})
    }
    form.setFieldsValue(object);
  }

  handleRanges = (params) => {
    params.forEach((a) => {
      if (Array.isArray(a.time)) {
        a.time = this.handleRange(a.time)
      }
    })
    let res = params.filter(a =>a.time && a.name && a.phone)
    return res.length == 0 ? undefined : res
  }

  handleRange = (param) => {
    return param[0] + ',' + param[1]
  }

  formManager = (managers, checkDetail, form, getFieldDecorator) => {
    if (managers) {
      return managers.map((key, index) => {
        let isLast = (managers.length == index + 1)
        return (<Row key={`manager${index}`} gutter={8}>
          <Col className={styles.colPeople} md={6} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
              {getFieldDecorator(`Mname[${index}]`, {
                initialValue: key.name ? key.name : ''
              })(<Input onChange={(e) => {
                this.manager[index].name = e.target.value
              }}
                        disabled={checkDetail} placeholder="请输入姓名"/>)}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={9} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
              {getFieldDecorator(`Mtime[${index}]`, {
                initialValue: key.time ? this._setTime(key.time) : []
              })(<DatePicker.RangePicker disabled={checkDetail}
                                         required={true}
                                         onChange={(e, dateString) => {
                                           this.manager[index].time = this.handleRange(dateString)
                                         }}
                                         style={{width: '100%'}} placeholder="请选择任职时间"/>)}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {getFieldDecorator(`Mphone[${index}]`, {
                initialValue: key.phone ? key.phone : ''
              })(<Input disabled={checkDetail}
                        onChange={(e) => {
                          this.manager[index].phone = e.target.value
                        }}
                        placeholder="请输入联系电话"/>)}
            </FormItem>
          </Col>
          {checkDetail ? null : <Col className={styles.colPeople} md={2} sm={24}>
            {isLast ?
              <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary"
                      onClick={() => this.add('manager', form)}>
                <Icon type="plus"/>
              </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                                  onClick={() => this.remove(index, 'manager', form)}>
                <Icon type="minus"/>
              </Button>}
          </Col>}
        </Row>)
      })
    }
  }

  formSecretary = (secretary, checkDetail, form, getFieldDecorator) => {
    if (secretary) {
      return secretary.map((key, index) => {
        let isLast = (secretary.length == index + 1)
        return (<Row key={`secretary${index}`} gutter={8}>
          <Col className={styles.colPeople} md={6} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
              {getFieldDecorator(`Sname[${index}]`, {
                initialValue: key.name ? key.name : ''
              })(<Input onChange={(e) => {
                this.secretary[index].name = e.target.value
              }}
                        disabled={checkDetail} placeholder="请输入姓名"/>)}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={9} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
              {getFieldDecorator(`Stime[${index}]`, {
                initialValue: key.time ? this._setTime(key.time) : []
              })(<DatePicker.RangePicker disabled={checkDetail}
                                         required={true}
                                         onChange={(e, dateString) => this.secretary[index].time = this.handleRange(dateString)}
                                         style={{width: '100%'}} placeholder="请选择任职时间"/>)}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {getFieldDecorator(`Sphone[${index}]`, {
                initialValue: key.phone ? key.phone : ''
              })(<Input disabled={checkDetail}
                        onChange={(e) => this.secretary[index].phone = e.target.value}
                        placeholder="请输入联系电话"/>)}
            </FormItem>
          </Col>
          {checkDetail ? null : <Col className={styles.colPeople} md={2} sm={24}>
            {isLast ?
              <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary"
                      onClick={() => this.add('secretary', form)}>
                <Icon type="plus"/>
              </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                                  onClick={() => this.remove(index, 'secretary', form)}>
                <Icon type="minus"/>
              </Button>}
          </Col>}
        </Row>)
      })
    }
  }

  formChiefEngineer = (chiefEngineer, checkDetail, form, getFieldDecorator) => {
    if (chiefEngineer) {
      return chiefEngineer.map((key, index) => {
        let isLast = (chiefEngineer.length == index + 1)
        return (<Row key={`engineer${index}`} gutter={8}>
          <Col className={styles.colPeople} md={6} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
              {getFieldDecorator(`Ename[${index}]`, {
                initialValue: key.name ? key.name : ''
              })(<Input onChange={(e) => this.engineer[index].name = e.target.value}
                        disabled={checkDetail} placeholder="请输入姓名"/>)}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={9} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
              {getFieldDecorator(`Etime[${index}]`, {
                initialValue: key.time ? this._setTime(key.time) : []
              })(<DatePicker.RangePicker disabled={checkDetail}
                                         required={true}
                                         onChange={(e, dateString) => this.engineer[index].time = this.handleRange(dateString)}
                                         style={{width: '100%'}} placeholder="请选择任职时间"/>)}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {getFieldDecorator(`Ephone[${index}]`, {
                initialValue: key.phone ? key.phone : ''
              })(<Input disabled={checkDetail}
                        onChange={(e) => this.engineer[index].phone = e.target.value}
                        placeholder="请输入联系电话"/>)}
            </FormItem>
          </Col>
          {checkDetail ? null : <Col className={styles.colPeople} md={2} sm={24}>
            {isLast ?
              <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary"
                      onClick={() => this.add('engineer', form)}>
                <Icon type="plus"/>
              </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                                  onClick={() => this.remove(index, 'engineer', form)}>
                <Icon type="minus"/>
              </Button>}
          </Col>}
        </Row>)
      })
    }
  }

  okHandle = (form, updateModalVisible, handleAdd, selectedValues) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
        }
      }
      fieldsValue.manager = this.handleRanges(this.manager)
      fieldsValue.secretary = this.handleRanges(this.secretary)
      fieldsValue.engineer = this.handleRanges(this.engineer)
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };

  onChange = (value, option) => {
    this.selectProject = option.props.item
    this.props.form.setFieldsValue({projectType: this.selectProject.projectType});
  }

  render() {
    const {proNames, modalVisible, loading, form, handleAdd, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form
    if (selectedValues.manager) {
      getFieldDecorator('manager');
    } else {
      getFieldDecorator('manager', {
        initialValue: [{
          name: '',
          time: [],
          phone: ''
        }]
      });
    }
    if (selectedValues.secretary) {
      getFieldDecorator('secretary');
    } else {
      getFieldDecorator('secretary', {
        initialValue: [{
          name: '',
          time: [],
          phone: ''
        }]
      });
    }
    if (selectedValues.engineer) {
      getFieldDecorator('engineer');
    } else {
      getFieldDecorator('engineer', {
        initialValue: [{
          name: '',
          time: [],
          phone: ''
        }]
      });
    }
    let managers = getFieldValue('manager');
    let secretary = getFieldValue('secretary');
    let chiefEngineer = getFieldValue('engineer');
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '工程项目信息' : updateModalVisible ? "编辑工程项目信息" : "新增工程项目信息"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={1100}
        maskClosable={false}
        okButtonProps={{loading: loading}}
        onOk={() => checkDetail ? handleCheckDetail() : this.okHandle(form, updateModalVisible, handleAdd, selectedValues)}
        onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="项目名称">
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
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程类别">
                {form.getFieldDecorator('projectType', {
                  rules: [{required: true, message: '请选择工程类别'}],
                  initialValue: selectedValues.projectType ? selectedValues.projectType : '',
                })(<Input disabled={true} placeholder="自动带出"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程地点">
                {form.getFieldDecorator('address', {
                  rules: [{required: true, message: '请输入工程地点'}],
                  initialValue: selectedValues.address ? selectedValues.address : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入工程地点"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程状态">
                {form.getFieldDecorator('status', {
                  rules: [{required: true, message: '请选择工程状态'}],
                  initialValue: selectedValues.status || selectedValues.status == 0 ? selectedValues.status : '',
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {status.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={4}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="项目部地址">
                {form.getFieldDecorator('orgAddress', {
                  rules: [{required: true, message: '请输入项目部地址'}],
                  initialValue: selectedValues.orgAddress ? selectedValues.orgAddress : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入项目部地址"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="里程桩号">
                {form.getFieldDecorator('mileageNumber', {
                  rules: [{required: true, message: '请输入里程桩号'}],
                  initialValue: selectedValues.mileageNumber ? selectedValues.mileageNumber : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入里程桩号"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="暂估合同额">
                {form.getFieldDecorator('temporarilyPrice', {
                  rules: [{required: true, message: '请输入暂估合同额', pattern: reg}],
                  initialValue: selectedValues.temporarilyPrice ? selectedValues.temporarilyPrice : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入暂估合同额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="有效合同额">
                {form.getFieldDecorator('totalPrice', {
                  rules: [{required: true, message: '请输入有效合同额', pattern: reg}],
                  initialValue: selectedValues.totalPrice ? selectedValues.totalPrice : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入有效合同额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同编码">
                {form.getFieldDecorator('contractNumber', {
                  rules: [{required: true, message: '请输入合同编码'}],//pattern: reg
                  initialValue: selectedValues.contractNumber ? selectedValues.contractNumber : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入合同编码"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="合同开工日期">
                {form.getFieldDecorator('contractStartTime', {
                  rules: [{required: true, message: '请选择合同开工日期'}],
                  initialValue: selectedValues.contractStartTime ? moment(selectedValues.contractStartTime) : null,
                })(<DatePicker onChange={(date, dateString) => this.setContractTime(date, dateString, true)}
                               disabled={checkDetail} style={{width: '100%'}} placeholder="请选择合同开工日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="合同竣工日期">
                {form.getFieldDecorator('contractEndTime', {
                  rules: [{required: true, message: '请选择合同竣工日期'}],
                  initialValue: selectedValues.contractEndTime ? moment(selectedValues.contractEndTime) : null,
                })(<DatePicker onChange={(date, dateString) => this.setContractTime(date, dateString, false)}
                               disabled={checkDetail} style={{width: '100%'}} placeholder="请选择合同竣工日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同工期">
                {form.getFieldDecorator('contractDay', {
                  rules: [{required: true, message: '请选择正确的合同工期', type: 'number'}],
                  initialValue: selectedValues.contractDay ? selectedValues.contractDay : '',
                })(<Input disabled={true} style={{marginTop: 4}} placeholder="自动带入合同工期" addonAfter="月"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="实际开工日期">
                {form.getFieldDecorator('realContractStartTime', {
                  rules: [{required: true, message: '请选择实际开工日期'}],
                  initialValue: selectedValues.realContractStartTime ? moment(selectedValues.realContractStartTime) : null,
                })(<DatePicker onChange={(date, dateString) => this.setRealTime(date, dateString, true)} disabled={checkDetail} style={{width: '100%'}} placeholder="请选择实际开工日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="实际竣工日期">
                {form.getFieldDecorator('realContractEndTime', {
                  initialValue: selectedValues.realContractEndTime ? moment(selectedValues.realContractEndTime) : null,
                })(<DatePicker  onChange={(date, dateString) => this.setRealTime(date, dateString, false)} disabled={checkDetail} style={{width: '100%'}} placeholder="请选择实际竣工日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="实际工期">
                {form.getFieldDecorator('realContractDay', {
                  initialValue: selectedValues.realContractDay ? selectedValues.realContractDay : '',
                })(<Input disabled={true} style={{marginTop: 4}} placeholder="请输入实际工期" addonAfter="月"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="业主单位">
                {form.getFieldDecorator('proprietorCompany', {
                  rules: [{required: true, message: '请输入业主单位'}],
                  initialValue: selectedValues.proprietorCompany ? selectedValues.proprietorCompany : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入业主单位"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="业主地址">
                {form.getFieldDecorator('proprietorAddress', {
                  rules: [{required: true, message: '请输入业主地址'}],
                  initialValue: selectedValues.proprietorAddress ? selectedValues.proprietorAddress : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入业主地址"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
                {form.getFieldDecorator('proprietorPhone', {
                  rules: [{required: true, message: '请输入正确的联系方式'}],
                  initialValue: selectedValues.proprietorPhone ? selectedValues.proprietorPhone : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入业主电话"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监理单位">
                {form.getFieldDecorator('supervisionCompany', {
                  rules: [{required: true, message: '请输入监理单位'}],
                  initialValue: selectedValues.supervisionCompany ? selectedValues.supervisionCompany : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入监理单位"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监理地址">
                {form.getFieldDecorator('supervisionAddress', {
                  rules: [{required: true, message: '请输入监理单位'}],
                  initialValue: selectedValues.supervisionAddress ? selectedValues.supervisionAddress : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入监理单位"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监理电话">
                {form.getFieldDecorator('supervisionPhone', {
                  rules: [{required: true, message: '请输入正确的联系方式'}],
                  initialValue: selectedValues.supervisionPhone ? selectedValues.supervisionPhone : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入监理单位"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>项目经理</div>
        </Row>
        <div className={styles.modalContent}>
          {this.formManager(managers, checkDetail, form, getFieldDecorator)}
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>项目书记</div>
        </Row>
        <div className={styles.modalContent}>
          {this.formSecretary(secretary, checkDetail, form, getFieldDecorator)}
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>总工程师</div>
        </Row>
        <div className={styles.modalContent}>
          {this.formChiefEngineer(chiefEngineer, checkDetail, form, getFieldDecorator)}
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>统计</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="投入人员">
                {form.getFieldDecorator('inputPerson', {
                  initialValue: selectedValues.inputPerson ? selectedValues.inputPerson : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入投入人员数" addonAfter="人"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="正式职工">
                {form.getFieldDecorator('formalEmployee', {
                  initialValue: selectedValues.formalEmployee ? selectedValues.formalEmployee : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入正式职工数" addonAfter="人"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="外聘人员">
                {form.getFieldDecorator('externalEmployee', {
                  initialValue: selectedValues.externalEmployee ? selectedValues.externalEmployee : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入外聘人员数" addonAfter="人"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 12 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="工程概况">
                {form.getFieldDecorator('description', {
                  rules: [{required: true, message: '请输入工程概况'}],
                  initialValue: selectedValues.description ? selectedValues.description : testValue,
                })(<Input.TextArea className={styles.customSelect} width={'100%'} disabled={checkDetail}
                                   placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }

  calculateDuration = (start, end) => {
    let year = end.get('year') - start.get('year')
    let month = end.get('month') - start.get('month')
    let date = end.get('date') - start.get('date')
    if (year == 0) {
      return date>=0? (month + 1):-1
    } else if (year > 0) {
      if (month > 0) {
        return year * 12 + month + 1
      } else if(month==0){
        return date>=0?(year * 12 + month + 1):-1
      }else{
        return month + 13
      }
    }
    return -1
    // return year*12
  }

  setContractTime = (date, dateString, type) => {
    const form = this.props.form
    const {getFieldValue} = form
    let start = type ? date : getFieldValue('contractStartTime'), end = !type ? date : getFieldValue('contractEndTime')
    if (start && end) {
      let res = this.calculateDuration(start, end)
      if(res==-1){
      form.setFields({
        contractDay: {
            value: '时间不合法',
            errors: [new Error('结束时间应该大于开始时间')],
          },
        });
      }else {
        form.setFieldsValue({'contractDay': res})
      }
    }
  }

  setRealTime = (date, dateString, type) => {
    const form = this.props.form
    const {getFieldValue} = form
    let start = type ? date : getFieldValue('realContractStartTime'), end = !type ? date : getFieldValue('realContractEndTime')
    if (start && end) {
      let res = this.calculateDuration(start, end)
      if(res==-1){
        form.setFields({
          realContractDay: {
            value: '时间不合法',
            errors: [new Error('结束时间应该大于开始时间')],
          },
        });
      }else {
        form.setFieldsValue({'realContractDay': res})
      }
    }
  }
}

@Form.create()
class InfoCard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
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
      title:'序号',
      dataIndex:'id',
      width:100,
      fixed: 'left'
    },
    {
      title: '项目编码',
      dataIndex: 'code',
      width:160,
      fixed: 'left'
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width:180,
      fixed: 'left'
    },
    {
      title: '工程状态',
      dataIndex: 'status',
      width:100,
      render(val) {
        return <Badge status={statusMap[val]} text={status[val].name}/>;
      },
    },
    {
      title: '计划工期',
      children: [{
        title: '合同开工日期',
        dataIndex: 'contractStartTime',
        key: 'contractStartTime',
        width:130,
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      },
        {
          title: '合同完工日期',
          dataIndex: 'contractEndTime',
          key: 'contractEndTime',
          width:130,
          render(val) {
            return <span>{moment(val).format('YYYY/MM/DD')}</span>;
          },
        },]
    },
    {
      title: '实际工期',
      children: [{
        title: '实际开工日期',
        dataIndex: 'realContractStartTime',
        key: 'realContractStartTime',
        width:130,
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      },
        {
          title: '实际完工日期',
          dataIndex: 'realContractEndTime',
          key: 'realContractEndTime',
          width:130,
          render(val) {
            return <span>{val?moment(val).format('YYYY/MM/DD'):''}</span>;
          },
        },]
    },
    {
      title: '合同总价(万)',
      children: [{
        title: '暂估合同额',
        dataIndex: 'temporarilyPrice',
        width:150,
        render(val) {
          return <span>{val}</span>;
        },
      },
        {
          title: '有效合同额',
          dataIndex: 'totalPrice',
          width:150,
          render(val) {
            return <span>{val}</span>;
          },
        },]
    },
    {
      title: '项目经理',
      dataIndex: 'manager',
      width:100,
      render(val) {
        return <span>{val ? val[val.length - 1].name : ''}</span>;
      },
    },
    {
      title: '项目书记',
      dataIndex: 'secretary',
      width:100,
      render(val) {
        return <span>{val? val[val.length - 1].name : ''}</span>;
      },
    },
    {
      title: '总工',
      width:100,
      dataIndex: 'engineer',
      render(val) {
        return <span>{val ? val[val.length - 1].name : ''}</span>;
      },
    },
    {
      title: '下载信息卡',
      width:130,
      render(val) {
        return <a href={apiDev + PRO_PDF + val.id} download={'信息卡'}>下载</a>;
      },
    },
    {
      title: '操作',
      fixed:'right',
      width:120,
      render: (val, record) => {
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ?
              <a onClick={() => this.handleCheckDetail(true, record)}>查看</a> : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    if (this.props.app.user.token) {
      this.getProNames([])
      this.getList()
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchList(null,pagination.current, pagination.pageSize)
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
    const {dispatch, app: {user}} = this.props;
    let payload = {
      projectId: fields.projectId,
      projectType: fields.projectType,
      address: fields.address,
      orgAddress: fields.orgAddress,
      status: fields.status,
      mileageNumber: fields.mileageNumber,
      totalPrice: fields.totalPrice,
      temporarilyPrice: fields.temporarilyPrice,
      contractNumber: fields.contractNumber,
      contractDay: fields.contractDay,
      contractStartTime: fields.contractStartTime,
      contractEndTime: fields.contractEndTime,
      realContractDay: fields.realContractDay,
      realContractStartTime: fields.realContractStartTime,
      realContractEndTime: fields.realContractEndTime,
      proprietorCompany: fields.proprietorCompany,
      proprietorAddress: fields.proprietorAddress,
      proprietorPhone: fields.proprietorPhone,
      supervisionCompany: fields.supervisionCompany,
      supervisionAddress: fields.supervisionAddress,
      supervisionPhone: fields.supervisionPhone,
      inputPerson: fields.inputPerson,
      formalEmployee: fields.formalEmployee,
      externalEmployee: fields.externalEmployee,
      description: fields.description,
      manager: fields.manager,
      secretary: fields.secretary,
      engineer: fields.engineer,
    }
    cleanObject(payload)
    if (updateModalVisible) {
      dispatch({
        type: 'pro_proInfo/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.searchList(false,this.exportParams.page,this.exportParams.pageSize)
        }
      })
    } else {
      dispatch({
        type: 'pro_proInfo/add',
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
            <FormItem label="项目名称">
              {getFieldDecorator('projectName', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目经理">
              {getFieldDecorator('manager', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目书记">
              {getFieldDecorator('secretary', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="总工">
              {getFieldDecorator('engineer', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? <Row gutter={{md: 4, lg: 12, xl: 24}}>
          <Col md={6} sm={24}>
            <FormItem label="计划开工日期">
              {getFieldDecorator('contractStartTime', {
                initialValue: null
              })(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="计划完工日期">
              {getFieldDecorator('contractEndTime', {
                initialValue: null
              })(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="实际开工日期">
              {getFieldDecorator('realContractStartTime', {
                initialValue: null
              })(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="实际完工日期">
              {getFieldDecorator('realContractStartTime', {
                initialValue: null
              })(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
        </Row> : null}
        <Row>
          <Col md={6} sm={24}>
            <FormItem label="工程状态">
              {getFieldDecorator('status', {
                initialValue: null
              })(
                <Select placeholder="请选择" style={{width: '84%'}}>
                  <Option value="0">在建</Option>
                  <Option value="1">完工未结算</Option>
                  <Option value="2">完工已结算</Option>
                  <Option value="3">停工</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <div style={{overflow: 'hidden'}}>
            <div style={{float: 'right', marginBottom: 24}}>
              <Button onClick={() => this.searchList()} type="primary" htmlType="submit">
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

  render() {
    const {
      pro_proInfo: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, exportModalVisible, modalVisible, updateModalVisible, selectedValues, pageLoading, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      loading: loading.effects[`pro_proInfo/${updateModalVisible ? 'update' : 'add'}`]
    }
    const exportUrl = createURL(PRO_EXPORT, {
      ...this.exportParams, ...{
        token: user.token,
        exportType: 'projectExportType'
      }
    })
    const exportProps = {
      exportModalVisible: exportModalVisible,
      handleExportModalVisible: this.handleExportModalVisible,
      exportUrl: exportUrl,
      plainOptions: plainOptions,
      must: true,
      span: 10
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="工程项目信息卡">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button icon="export" type="primary" onClick={() => this.handleExportModalVisible(true)}>
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['pro_proInfo/fetch']}
                data={data}
                scroll={{x: 1920,y: global._scollY}}
                rowKey="id"
                bordered
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} {...parentState}/>
          <ExportModal {...exportProps}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName = []) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'pro_proInfo/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'pro_proInfo/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e,page = 1, pageSize = 10) => {
    e&&e.preventDefault?e.preventDefault():null
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        projectManager: fieldsValue.manager,
        projectSecretary: fieldsValue.secretary,
        projectEngineer: fieldsValue.engineer,
        status: fieldsValue.status
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'pro_proInfo/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

InfoCard.propTypes = {}

export default connect(({app, loading, pro_proInfo}) => ({app,  loading, pro_proInfo}))(InfoCard)
