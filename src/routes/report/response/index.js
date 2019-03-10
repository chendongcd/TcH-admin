import React, {Component} from 'react'
import {connect} from 'dva'
import moment from 'moment';

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal, Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, CustomPicker} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, getPage, fixNumber} from 'utils'
import {CONFIRMATION_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const {Option} = Select;
const pageButtons = getPage('95').buttons.map(a => a.permission)
const testValue = ''
const info_css = {
  color: '#fa541c'
}
const status = [{id: 0, name: '在建'}, {id: 1, name: '完工未结算'}, {id: 2, name: '完工已结算'}, {id: 3, name: '停工'}];

const _data = [{
  "projectName": "测试",
  "projectType": "市政工程",
  "projectStatus": "0",
  "contractStartTime": "2019-01-21 08:00:00",
  "contractEndTime": "2019-01-22 08:00:00",
  "lastYear": {
    "contractPrice": 0,
    "constructionOutputValue": 0,
    "advancePricing": 0,
    "completedUncalculated": 0,
    "shouldPrice": 0,
    "ownerTotal": 0,
    "sumOwnerTotal": 0,
    "budget": 0,
    "actualSum": 0,
    "actualManage": 0,
    "confirmPrice": 0,
    "comprehensiveIncome": 0,
    "comprehensiveIncomePercentage": 0,
    "costSuperPercentage": 0,
    "productionValuePercentage": 0,
    "managementPercentage": 0,
    "unconfirmPrice": 0,
    "shouldAppropriation": 0,
    "realAppropriation": 0,
    "inPlacePercentage": 0
  },
  "openTired": {
    "id": 1,
    "projectId": 24,
    "reportTime": 1552125600000,
    "contractPrice": 1000,
    "constructionOutputValue": 1000,
    "advancePricing": 2000,
    "completedUncalculated": 1000,
    "shouldPrice": 1000,
    "ownerTotal": 2000,
    "sumOwnerTotal": 5000,
    "budget": 1000,
    "actualSum": 1000,
    "actualManage": 1000,
    "confirmPrice": 2000,
    "comprehensiveIncome": 4000,
    "comprehensiveIncomePercentage": 0.8,
    "costSuperPercentage": 0,
    "productionValuePercentage": 2,
    "managementPercentage": 0.2,
    "unconfirmPrice": 2000,
    "shouldAppropriation": 2000,
    "realAppropriation": 1000,
    "inPlacePercentage": 1,
    "createTime": 1552099647000,
    "createUser": 4,
    "updateTime": 1552099718000,
    "updateUser": 4,
    "remark": "备注2",
    "projectName": "测试",
    "projectType": "市政工程",
    "projectStatus": "0",
    "contractStartTime": "2019-01-21 08:00:00",
    "contractEndTime": "2019-01-22 08:00:00"
  },
  "thisYear": {
    "contractPrice": 1000,
    "constructionOutputValue": 1000,
    "advancePricing": 2000,
    "completedUncalculated": 1000,
    "shouldPrice": 1000,
    "ownerTotal": 2000,
    "sumOwnerTotal": 5000,
    "budget": 1000,
    "actualSum": 1000,
    "actualManage": 1000,
    "confirmPrice": 2000,
    "comprehensiveIncome": 4000,
    "comprehensiveIncomePercentage": 0.8,
    "costSuperPercentage": 0,
    "productionValuePercentage": 2,
    "managementPercentage": 0.2,
    "unconfirmPrice": 2000,
    "shouldAppropriation": 2000,
    "realAppropriation": 1000,
    "inPlacePercentage": 1
  }
}]

@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {};
    this.CustomPicker = null
    this.selectProject = {}
  }

  componentDidMount() {
  }

  componentDidUpdate(preProp, preState) {
  }

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.reportTime = fieldsValue.reportTime.format('YYYY-MM-DD')
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  }

  cleanState = () => {
    this.props.form.resetFields();
  }

  componentWillUnmount() {
  }

  onChange = (value, option) => {
    this.selectProject = option.props.item
    this.props.form.setFieldsValue({
      projectType: this.selectProject.projectType,
      status:this.selectProject.projectStatus
    });
  }

  render() {
    const {proNames, modalVisible, loading, form, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '责任成本快报' : updateModalVisible ? "编辑责任成本快报" : "新增责任成本快报"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={1200}
        okButtonProps={{loading: loading}}
        maskClosable={false}
        onOk={() => checkDetail ? handleCheckDetail() : this.okHandle()}
        onCancel={() => {
          this.cleanState()
          checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()
        }}
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 13}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect}
                           showSearch={true}
                           onChange={this.onChange}
                           optionFilterProp={'name'}
                           disabled={checkDetail}
                           style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 13}} label="工程类别">
                {form.getFieldDecorator('projectType', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectType ? selectedValues.projectType : '',
                })(<Input disabled={true} placeholder="自动带出"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 13}} label="工程状态">
                {form.getFieldDecorator('status', {
                  rules: [{required: false, message: '请选择项目'}],
                  initialValue: selectedValues.status || selectedValues.status == 0 ? selectedValues.status : '',
                })(<Select placeholder="自动带出"  className={styles.customSelect} disabled={true}
                           style={{width: '100%'}}>
                  {status.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 13}} label="填报时间">
                {form.getFieldDecorator('reportTime', {
                  rules: [{required: true, message: '请选择填报日期'}],
                  initialValue: selectedValues.reportTime ? moment(selectedValues.reportTime) : null,
                })(<DatePicker.MonthPicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 13}} label="开工日期">
                {form.getFieldDecorator('contractStartTime', {
                  rules: [{required: true, message: '请选择开工日期'}],
                  initialValue: selectedValues.contractStartTime ? moment(selectedValues.contractStartTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 13}} label="竣工日期">
                {form.getFieldDecorator('contractEndTime', {
                  rules: [{required: true, message: '请选择竣工日期'}],
                  initialValue: selectedValues.contractEndTime ? moment(selectedValues.contractEndTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 12}} label="调整后合同额(不含税)">
                {form.getFieldDecorator('contractPrice', {
                  rules: [{required: true, message: '调整后合同额(不含税)'}],
                  initialValue: selectedValues.contractPrice ? selectedValues.contractPrice : testValue,
                })(<Input disabled={checkDetail} addonAfter={'万'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24} style={{marginTop: 11}}><span style={info_css}>备注:填报暂估项目工程信息卡里面的暂估合同额不含税值</span></Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>开累</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 15}} wrapperCol={{span: 9}} label="施工产值(不含销项税)">
                {form.getFieldDecorator('constructionOutputValue', {
                  rules: [{required: true, message: '请输入施工产值(不含销项税)'}],
                  initialValue: global._checkNum(selectedValues.constructionOutputValue),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="小计">
                {form.getFieldDecorator('ownerTotal', {
                  rules: [{required: true, message: '请输入小计'}],
                  initialValue: global._checkNum(selectedValues.ownerTotal),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="已完工未计价">
                {form.getFieldDecorator('completedUncalculated', {
                  rules: [{required: true, message: '请输入已完工未计价'}],
                  initialValue: global._checkNum(selectedValues.completedUncalculated),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="超前计价">
                {form.getFieldDecorator('advancePricing', {
                  rules: [{required: true, message: '请输入超前计价'}],
                  initialValue: global._checkNum(selectedValues.advancePricing),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 15}} wrapperCol={{span: 9}} label="其中:上年应计未计本年计价金额">
                {form.getFieldDecorator('shouldPrice', {
                  rules: [{required: true, message: '请输入其中:上年应计未计本年计价金额'}],
                  initialValue: global._checkNum(selectedValues.shouldPrice),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="责任预算成本">
                {form.getFieldDecorator('budget', {
                  rules: [{required: true, message: '请输入责任预算成本'}],
                  initialValue: global._checkNum(selectedValues.budget),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="小计">
                {form.getFieldDecorator('actualSum', {
                  rules: [{required: true, message: '请输入小计'}],
                  initialValue: global._checkNum(selectedValues.actualSum),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="其中:现场管理费">
                {form.getFieldDecorator('actualManage', {
                  rules: [{required: true, message: '请输入其中:现场管理费'}],
                  initialValue: global._checkNum(selectedValues.actualManage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 12}} wrapperCol={{span: 12}} label="财务决算已确认利润总额">
                {form.getFieldDecorator('confirmPrice', {
                  rules: [{required: true, message: '请输入财务决算已确认利润总额'}],
                  initialValue: global._checkNum(selectedValues.confirmPrice),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
          </Row>
          {/*<Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="项目综合收益额" >
                {form.getFieldDecorator('comprehensiveIncome', {
                  rules: [{required: true, message: '请输入项目综合收益额'}],
                  initialValue: global._checkNum(selectedValues.comprehensiveIncome),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="项目综合收益率" >
                {form.getFieldDecorator('comprehensiveIncomePercentage', {
                  rules: [{required: true, message: '请输入项目综合收益率'}],
                  initialValue: global._checkNum(selectedValues.comprehensiveIncomePercentage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="%"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="责任成本节超率" >
                {form.getFieldDecorator('costSuperPercentage', {
                  rules: [{required: true, message: '请输入责任成本节超率'}],
                  initialValue: global._checkNum(selectedValues.costSuperPercentage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="%"/>)}
              </FormItem>
            </Col>
          </Row>*/}
          {/*<Row gutter={8}>
           <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="产值计价率" >
                {form.getFieldDecorator('productionValuePercentage', {
                  rules: [{required: true, message: '请输入产值计价率'}],
                  initialValue: global._checkNum(selectedValues.productionValuePercentage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="%"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="产值管理费" >
                {form.getFieldDecorator('managementPercentage', {
                  rules: [{required: true, message: '请输入产值管理费'}],
                  initialValue: global._checkNum(selectedValues.managementPercentage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="%"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 15}} wrapperCol={{span: 9}} label="财务未确认利润(+潜盈-潜亏)" >
                {form.getFieldDecorator('unconfirmPrice', {
                  rules: [{required: true, message: '请输入财务未确认利润(+潜盈-潜亏)'}],
                  initialValue: global._checkNum(selectedValues.unconfirmPrice),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
          </Row>*/}
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="应拨款">
                {form.getFieldDecorator('shouldAppropriation', {
                  rules: [{required: true, message: '请输入应拨款'}],
                  initialValue: global._checkNum(selectedValues.shouldAppropriation),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="实际拨款">
                {form.getFieldDecorator('realAppropriation', {
                  rules: [{required: true, message: '请输入实际拨款'}],
                  initialValue: global._checkNum(selectedValues.realAppropriation),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万"/>)}
              </FormItem>
            </Col>
            {/* <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="项目资金拨付到位率" >
                {form.getFieldDecorator('inPlacePercentage', {
                  rules: [{required: true, message: '请输入项目资金拨付到位率'}],
                  initialValue: global._checkNum(selectedValues.inPlacePercentage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="%"/>)}
              </FormItem>
            </Col>*/}
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 15 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false, message: '请输入备注'}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

}

@Form.create()
class Response extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      selectedValues: {},
      checkDetail: false,
    }
    this.exportParams = {
      page: 1,
      pageSize: 10
    }
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 80
      // fixed: 'left',
      //width: 100,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 150
      // fixed: 'left',
      //width: 180,
    },
    {
      title: '工程类别',
      dataIndex: 'projectType',
      width: 100
      // fixed: 'left',
      //width: 110,
    },
    {
      title: '项目状态',
      dataIndex: 'projectStatus',
      width: 150
      // fixed: 'left',
      //width: 110,
    },
    {
      title: '填报时间',
      dataIndex: 'reportTime',
      width: 180,
      render: (val, record) => {
        return {
          children: <span>{val ? `${moment(val).format('YYYY')}年${moment(val).format('MM')}月` : ''}</span>,
        }
      }
    },
    {
      title: '开竣(交)工日期',
      dataIndex: 'projectName1',
      children: [
        {
          title: '开工日期',
          dataIndex: 'contractStartTime',
          width: 150,
          render: (val, record) => {
            return {
              children: <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
            }
          }
        },
        {
          title: '竣(交)工日期',
          dataIndex: 'contractEndTime',
          width: 150,
          render: (val, record) => {
            return {
              children: <span>{val ? moment(val).format('YYYY') : ''}</span>,
            }
          }
        },
      ]
    },
    {
      title: '调整后合同额(不含税)',
      dataIndex: 'contractPrice',
      // fixed: 'left',
      width: 180,
    },
    {
      title: '属性',
      dataIndex: 'shuxing',
      width: 100,
      render: () => {
        return <div>
          <span>年初</span>
          <Divider className={styles.customDivider} type="horizontal"/>
          <span>开累</span>
          <Divider className={styles.customDivider} type="horizontal"/>
          <span>本年</span>
        </div>
      }
    },
    {
      title: '施工产值(不含销项税)',
      dataIndex: 'constructionOutputValue',
      width: 180,
      render: (val, record) => this.renderColumns(record, 'constructionOutputValue')
    },
    {
      title: '业主收入',
      children: [
        {
          title: '小计',
          dataIndex: 'sumOwnerTotal',
          width: 120,
          render: (val, record) => this.renderColumns(record, 'sumOwnerTotal')
        },
        {
          title: '',
          key: 'nothing',
          children: [
            {
              title: '小计',
              dataIndex: 'ownerTotal',
              width: 120,
              render: (val, record) => this.renderColumns(record, 'ownerTotal')
            },
            {
              title: '其中：上年应计未计本年计价金额',
              dataIndex: 'shouldPrice',
              width: 180,
              render: (val, record) => this.renderColumns(record, 'shouldPrice')
            },
          ]
        },
        {
          title: '已完工未计价',
          dataIndex: 'completedUncalculated',
          width: 180,
          render: (val, record) => this.renderColumns(record, 'completedUncalculated')
        },
        {
          title: '超前计价',
          dataIndex: 'advancePricing',
          width: 150,
          render: (val, record) => this.renderColumns(record, 'advancePricing')
        },
      ]
    },
    {
      title: '责任预算成本',
      dataIndex: 'budget',
      width: 180,
      render: (val, record) => this.renderColumns(record, 'budget')
    },
    {
      title: '实际成本',
      children: [{
        title: '小计',
        dataIndex: 'actualSum',
        width: 120,
        render: (val, record) => this.renderColumns(record, 'actualSum')
      },
        {
          title: '其中:现场管理费',
          dataIndex: 'actualManage',
          width: 180,
          render: (val, record) => this.renderColumns(record, 'actualManage')
        },]
    },
    {
      title: '财务决算已确认利润总额',
      dataIndex: 'confirmPrice',
      width: 200,
      render: (val, record) => this.renderColumns(record, 'confirmPrice')
    },
    {
      title: '项目综合收益额',
      dataIndex: 'comprehensiveIncome',
      width: 180,
      render: (val, record) => this.renderColumns(record, 'comprehensiveIncome')
    },
    {
      title: '项目综合收益率(%)',
      dataIndex: 'comprehensiveIncomePercentage',
      width: 180,
      render: (val, record) => this.renderColumns(record, 'comprehensiveIncomePercentage', true)
    },
    {
      title: '责任成本节超率(%)',
      dataIndex: 'costSuperPercentage',
      width: 180,
      render: (val, record) => this.renderColumns(record, 'costSuperPercentage', true)
    },
    {
      title: '产值计价率(%)',
      dataIndex: 'productionValuePercentage',
      width: 200,
      render: (val, record) => this.renderColumns(record, 'productionValuePercentage', true)
    },
    {
      title: '产值管理费(%)',
      dataIndex: 'managementPercentage',
      width: 180,
      render: (val, record) => this.renderColumns(record, 'managementPercentage', true)
    },
    {
      title: '财务未确认利润(+潜盈-潜亏)',
      dataIndex: 'unconfirmPrice',
      width: 200,
      render: (val, record) => this.renderColumns(record, 'unconfirmPrice')
    },
    {
      title: '应拨款',
      dataIndex: 'shouldAppropriation',
      width: 130,
      render: (val, record) => this.renderColumns(record, 'shouldAppropriation')
    },
    {
      title: '实际拨款',
      dataIndex: 'realAppropriation',
      width: 130,
      render: (val, record) => this.renderColumns(record, 'realAppropriation')
    },
    {
      title: '项目资金拨付到位率(%)',
      dataIndex: 'inPlacePercentage',
      width: 180,
      render: (val, record) => this.renderColumns(record, 'inPlacePercentage', true)
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
    },
  ];

  renderColumns = (val, props, isRate) => {
    if (isRate) {
      //Number.isInteger(val * 100)?(val*100):(val*100).toFixed(2)
      return <div>
        <span>{val && fixNumber(val.lastYear[props], 100)}</span>
        <Divider className={styles.customDivider} type="horizontal"/>
        <span>{val && fixNumber(val.openTired[props], 100)}</span>
        <Divider className={styles.customDivider} type="horizontal"/>
        <span>{val && fixNumber(val.thisYear[props], 100)}</span>
      </div>
    }
    return <div>
      <span>{val && val.lastYear[props]}</span>
      <Divider className={styles.customDivider} type="horizontal"/>
      <span>{val && val.openTired[props]}</span>
      <Divider className={styles.customDivider} type="horizontal"/>
      <span>{val && val.thisYear[props]}</span>
    </div>
  }

  componentDidMount() {
    if (this.props.app.user.token) {
      this.getProNames([])
      this.getList()
    }
    let num = 0
    let res = (arr) => arr.map(a => {
      if (a.width) {
        num = num + a.width
      } else {
        res(a.children)
      }
    })
    res(this.columns)
    console.log(num)
  }

  handleStandardTableChange = (pagination) => {
    this.searchList(null, pagination.current)
  };

  handleFormReset = () => {
    const {form} = this.props;
    this.CustomPicker.resetValue()
    this.CustomPickerM.resetValue()
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getList()
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

  handleAdd = (fields, updateModalVisible, selectedValues, cleanState) => {
    const {dispatch, app: {user}} = this.props;
    const payload = {
      projectId: fields.projectId,
      reportTime: fields.reportTime,
      contractPrice: fields.contractPrice,
      constructionOutputValue: fields.constructionOutputValue,
      advancePricing: fields.advancePricing,
      completedUncalculated: fields.completedUncalculated,
      shouldPrice: fields.shouldPrice,
      ownerTotal: fields.ownerTotal,
      budget: fields.budget,
      actualSum: fields.actualSum,
      actualManage: fields.actualManage,
      confirmPrice: fields.confirmPrice,
      shouldAppropriation: fields.shouldAppropriation,
      realAppropriation: fields.realAppropriation,
      remark: fields.remark
    }
    if (updateModalVisible) {
      dispatch({
        type: 'response/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.searchList(false, this.exportParams.page)
          cleanState()
        }
      })
    } else {
      dispatch({
        type: 'response/add',
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
    return (
      <Form onSubmit={this.searchList} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName', {})(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="填报日期">
              {getFieldDecorator('year', {
                initialValue: null
              })(<CustomPicker ref={(e) => this.CustomPicker = e} topMode="year" setValue={this.setYear}
                               placeholder={'年'} format="YYYY" style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('month', {})(<CustomPicker ref={(e) => this.CustomPickerM = e} topMode="month" setValue={this.setMonth} placeholder={'月'} format="MM"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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

  setYear = (value) => {
    this.props.form.setFieldsValue({'year': value})
  }

  setMonth = (value) => {
    this.props.form.setFieldsValue({'month': value})
  }

  renderForm() {
    return this.renderAdvancedForm()
  }

  render() {
    const {
      response: {data, proNames},
      loading,
      app: {user},
      dispatch
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      dispatch: dispatch,
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      loading: loading.effects[`response/${updateModalVisible ? 'update' : 'add'}`],
      user: user
    }
    const exportUrl = createURL(CONFIRMATION_EXPORT, {
      ...this.exportParams, ...{
        token: user.token
      }
    })


    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="过程亏损项目明细表">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button href={exportUrl} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['response/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: 4560, y: global._scollY}}
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

  getProNames = (proName) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'response/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'response/fetch',
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
        year: fieldsValue.year?fieldsValue.year.format('YYYY'):null,
        month:fieldsValue.month
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'response/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

}

Response.propTypes = {}

export default connect(({app, loading, response}) => ({app, loading, response}))(Response)
