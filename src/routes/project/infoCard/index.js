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
  Dropdown,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Steps,
  Radio,
  Divider
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut, getButtons} from 'utils'
import {menuData} from 'common/menu'

const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['在建', '完工未结算', '完工已结算', '停工'];
const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
let uuid = 0;
const pageButtons = menuData[6].buttons.map(a => a.permission)

@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.selectProject = {}
  }

  // const {getFieldDecorator, getFieldValue} = form
  // getFieldDecorator('managers', {initialValue: [{manaName: '', manaTime: '', manaPhone: ''}]});
  // getFieldDecorator('secretary', {initialValue: [{secreName: '', secreTime: '', secrePhone: ''}]});
  // getFieldDecorator('chiefEngineer', {initialValue: [{chiefName: '', chiefTime: '', chiefPhone: ''}]});
  // const managers = getFieldValue('managers');
  // const secretary = getFieldValue('secretary');
  // const chiefEngineer = getFieldValue('chiefEngineer');
  remove = (k, type, form) => {
    // can use data-binding to get
    const keys = form.getFieldValue(type);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    let object = {
      managers: keys.filter(key => key !== k),
    }
    if (type == 'secretary') {
      object = {
        secretary: keys.filter(key => key !== k),
      }
    }
    if (type == 'chiefEngineer') {
      object = {
        chiefEngineer: keys.filter(key => key !== k),
      }
    }
    // can use data-binding to set
    form.setFieldsValue(object);
  }

  add = (type, form) => {
    // can use data-binding to get
    const keys = form.getFieldValue(type);
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    let object = {
      managers: nextKeys,
    }
    if (type == 'secretary') {
      object = {
        secretary: nextKeys,
      }
    }
    if (type == 'chiefEngineer') {
      object = {
        chiefEngineer: nextKeys,
      }
    }
    form.setFieldsValue(object);
  }

  formManager = (managers, checkDetail, form) => {
    if (managers) {
      return managers.map((key, index) => {
        let isLast = (managers.length == index + 1)
        return (<Row key={`manager${index}`} gutter={8}>
          <Col className={styles.colPeople} md={6} sm={24}>
            <FormItem required={true} labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
              <Input disabled={checkDetail} placeholder="请输入姓名"/>
              {/*          {form.getFieldDecorator(`names[${key}]`, {
            rules: [{required: true, message: '请输入姓名'}],
          })(<Input placeholder="请输入姓名"/>)}*/}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
              <DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择任职时间"/>
              {/*{form.getFieldDecorator('manaTime', {
            rules: [{required: true, message: '请选择任职时间'}],
          })( <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>)}*/}
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              <Input disabled={checkDetail} placeholder="请输入联系电话"/>
              {/*{form.getFieldDecorator('manaPhone', {
            rules: [{required: true, message: '请输入联系电话'}],
          })(<Input placeholder="请输入联系电话"/>)}*/}
            </FormItem>
          </Col>
          {checkDetail ? null : <Col className={styles.colPeople} md={4} sm={24}>
            {isLast ?
              <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary"
                      onClick={() => this.add('managers', form)}>
                <Icon type="plus"/>
              </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                                  onClick={() => this.remove(key, 'managers', form)}>
                <Icon type="minus"/>
              </Button>}
          </Col>}
        </Row>)
      })
    }
  }

  formSecretary = (secretary, checkDetail, form) => {
    if (secretary) {
      return secretary.map((key, index) => {
        let isLast = (secretary.length == index + 1)
        return (<Row key={`secretary${index}`} gutter={8}>
          <Col className={styles.colPeople} md={6} sm={24}>
            <FormItem required={true}
                      labelCol={{span: 5}}
                      wrapperCol={{span: 15}}
                      label="姓名">
              {/*          {form.getFieldDecorator('secreName', {
            rules: [{required: true, message: '请输入姓名'}],
          })(<Input placeholder="请输入姓名"/>)}*/}
              <Input disabled={checkDetail} placeholder="请输入姓名"/>
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
              {/*          {form.getFieldDecorator('secreTime', {
            rules: [{required: true, message: '请选择任职时间'}],
          })( <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>)}*/}
              <DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择任职时间"/>
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem min={1} type={'number'} required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {/* {form.getFieldDecorator('secrePhone', {
            rules: [{required: true, message: '请输入联系电话'}],
          })(<Input placeholder="请输入联系电话"/>)}*/}
              <Input disabled={checkDetail} placeholder="请输入联系电话"/>
            </FormItem>
          </Col>
          {checkDetail ? null : <Col className={styles.colPeople} md={4} sm={24}>
            {isLast ?
              <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary"
                      onClick={() => this.add('secretary', form)}>
                <Icon type="plus"/>
              </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                                  onClick={() => this.remove(key, 'secretary', form)}>
                <Icon type="minus"/>
              </Button>}
          </Col>}
        </Row>)
      })
    }
  }

  formChiefEngineer = (chiefEngineer, checkDetail, form) => {
    if (chiefEngineer) {
      return chiefEngineer.map((key, index) => {
        let isLast = (chiefEngineer.length == index + 1)
        return (<Row key={`chiefEngineer${index}`} gutter={8}>
          <Col className={styles.colPeople} md={6} sm={24}>
            <FormItem required={true} labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
              {/*          {form.getFieldDecorator('chiefName', {
            rules: [{required: true, message: '请输入姓名'}],
          })(<Input placeholder="请输入姓名"/>)}*/}
              <Input disabled={checkDetail} placeholder="请输入姓名"/>
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
              {/*          {form.getFieldDecorator('chiefTime', {
            rules: [{required: true, message: '请选择任职时间'}],
          })( <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>)}*/}
              <DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择任职时间"/>
            </FormItem>
          </Col>
          <Col className={styles.colPeople} md={7} sm={24}>
            <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {/*          {form.getFieldDecorator('chiefPhone', {
            rules: [{required: true, message: '请输入联系电话'}],
          })(<Input placeholder="请输入联系电话"/>)}*/}
              <Input disabled={checkDetail} placeholder="请输入联系电话"/>
            </FormItem>
          </Col>
          {checkDetail ? null : <Col className={styles.colPeople} md={4} sm={24}>
            {isLast ?
              <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary"
                      onClick={() => this.add('chiefEngineer', form)}>
                <Icon type="plus"/>
              </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                                  onClick={() => this.remove(key, 'chiefEngineer', form)}>
                <Icon type="minus"/>
              </Button>}
          </Col>}
        </Row>)
      })
    }
  }

  okHandle = (form, handleAdd) => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  onChange = (value, option) => {
    this.selectProject = option.props.item
    this.props.form.setFieldsValue({projectType: this.selectProject.projectType});
  }

  render() {
    const {proNames, modalVisible, form, handleAdd, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    const {getFieldDecorator} = this.props.form
    getFieldDecorator('managers', {initialValue: [{manaName: '', manaTime: '', manaPhone: ''}]});
    getFieldDecorator('secretary', {initialValue: [{secreName: '', secreTime: '', secrePhone: ''}]});
    getFieldDecorator('chiefEngineer', {initialValue: [{chiefName: '', chiefTime: '', chiefPhone: ''}]});
    const managers = form.getFieldValue('managers');
    const secretary = form.getFieldValue('secretary');
    const chiefEngineer = form.getFieldValue('chiefEngineer');
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '工程项目信息' : updateModalVisible ? "编辑工程项目信息" : "新增工程项目信息"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
        maskClosable={false}
        onOk={() => this.okHandle(form, handleAdd)}
        onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select showSearch={true} optionFilterProp={'name'} onChange={this.onChange} disabled={checkDetail}
                           placeholder="请选择" style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目类别">
                {form.getFieldDecorator('projectType', {
                  rules: [{required: true}],
                })(<Input disabled={checkDetail} placeholder="自动带出"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="工程地点">
                {form.getFieldDecorator('address', {
                  rules: [{required: true, message: '请输入工程地点'}],
                })(<Input disabled={checkDetail} placeholder="请输入工程地点"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="工程状态">
                {form.getFieldDecorator('status', {
                  rules: [{required: true, message: '请选择项目'}],
                })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">在建</Option>
                  <Option value="1">完工未结算</Option>
                  <Option value="2">完工已结算</Option>
                  <Option value="3">停工</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={4}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目部地址">
                {form.getFieldDecorator('orgAddress', {
                  rules: [{required: true, message: '请输入项目部地址'}],
                })(<Input disabled={checkDetail} placeholder="请输入项目部地址"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="里程桩号">
                {form.getFieldDecorator('mileageNumber', {
                  rules: [{required: true, message: '请输入里程桩号(数字)', pattern: reg}],
                })(<Input disabled={checkDetail} placeholder="请输入里程桩号"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="暂估合同额">
                {form.getFieldDecorator('temSum', {
                  rules: [{required: true, message: '请输入暂估合同额', pattern: reg}],
                })(<Input disabled={checkDetail} placeholder="请输入暂估合同额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="有效合同额">
                {form.getFieldDecorator('conSum', {
                  rules: [{required: true, message: '请输入有效合同额', pattern: reg}],
                })(<Input disabled={checkDetail} placeholder="请输入有效合同额" addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="合同编码">
                {form.getFieldDecorator('contractNumber', {
                  rules: [{required: true, message: '请输入合同编码', pattern: reg}],
                })(<Input disabled={checkDetail} placeholder="请输入合同编码"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同工期">
                {form.getFieldDecorator('contractDay', {
                  rules: [{required: true, message: '请输入合同工期', pattern: reg}],
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入合同工期" addonAfter="天"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="合同开工日期">
                {form.getFieldDecorator('contractStartTime', {
                  rules: [{required: true, message: '请选择合同开工日期'}],
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择合同开工日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="合同竣工日期">
                {form.getFieldDecorator('contractEndTime', {
                  rules: [{required: true, message: '请选择合同竣工日期'}],
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择合同竣工日期"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="实际工期">
                {form.getFieldDecorator('realContractDay', {
                  rules: [{required: true, message: '请输入实际工期', pattern: reg}],
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入实际工期" addonAfter="天"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="实际开工日期">
                {form.getFieldDecorator('realContractStartTime', {
                  rules: [{required: true, message: '请选择实际开工日期'}],
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择实际开工日期"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="实际竣工日期">
                {form.getFieldDecorator('realContractEndTime', {
                  rules: [{required: true, message: '请选择实际竣工日期'}],
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择实际竣工日期"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="业主单位">
                {form.getFieldDecorator('proprietorCompany', {
                  rules: [{required: true, message: '请输入业主单位'}],
                })(<Input disabled={checkDetail} placeholder="请输入业主单位"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="业主地址">
                {form.getFieldDecorator('proprietorAddress', {
                  rules: [{required: true, message: '请输入业主地址'}],
                })(<Input disabled={checkDetail} placeholder="请输入业主地址"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
                {form.getFieldDecorator('proprietorPhone', {
                  rules: [{required: true, pattern: reg, message: '请输入正确的联系方式'}],
                })(<Input disabled={checkDetail} placeholder="请输入业主电话"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监管单位">
                {form.getFieldDecorator('supervisionCompany', {
                  rules: [{required: true, message: '请输入监管单位'}],
                })(<Input disabled={checkDetail} placeholder="请输入监管单位"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监管地址">
                {form.getFieldDecorator('supervisionAddress', {
                  rules: [{required: true, message: '请输入监管地址'}],
                })(<Input disabled={checkDetail} placeholder="请输入监管地址"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监管电话">
                {form.getFieldDecorator('supervisionPhone', {
                  rules: [{required: true, pattern: reg, message: '请输入正确的联系方式'}],
                })(<Input disabled={checkDetail} placeholder="请输入监管电话"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>项目经理</div>
        </Row>
        <div className={styles.modalContent}>
          {this.formManager(managers, checkDetail, form)}
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>项目书记</div>
        </Row>
        <div className={styles.modalContent}>
          {this.formSecretary(secretary, checkDetail, form)}
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>总工程师</div>
        </Row>
        <div className={styles.modalContent}>
          {this.formChiefEngineer(chiefEngineer, checkDetail, form)}
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>统计</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="投入人员">
                {form.getFieldDecorator('inputPerson', {
                  rules: [{required: true, message: '请输入投入人员数'}],
                })(<Input disabled={checkDetail} placeholder="请输入投入人员数" addonAfter="人"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="正式职工">
                {form.getFieldDecorator('formalEmployee', {
                  rules: [{required: true, message: '请输入正式职工数'}],
                })(<Input disabled={checkDetail} placeholder="请输入正式职工数" addonAfter="人"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="外聘人员">
                {form.getFieldDecorator('externalEmployee', {
                  rules: [{required: true, message: '请输入外聘人员数'}],
                })(<Input disabled={checkDetail} placeholder="请输入外聘人员数" addonAfter="人"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 12 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="工程概况">
                {form.getFieldDecorator('description', {
                  rules: [{required: true}],
                })(<Input.TextArea width={'100%'} disabled={checkDetail} placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    )
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
      pageLoading: true,
      selectedValues: {},
      checkDetail: false
    }
  }

  columns = [
    {
      title: '项目编码',
      dataIndex: 'code',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '工程状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '计划工期',
      children: [{
        title: '合同开工日期',
        dataIndex: 'contractStartTime',
        key: 'contractStartTime',
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      },
        {
          title: '合同完工日期',
          dataIndex: 'contractEndTime',
          key: 'contractEndTime',
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
        render(val) {
          return <span>{moment(val).format('YYYY/MM/DD')}</span>;
        },
      },
        {
          title: '实际完工日期',
          dataIndex: 'realContractEndTime',
          key: 'realContractEndTime',
          render(val) {
            return <span>{moment(val.updatedAt).format('YYYY/MM/DD')}</span>;
          },
        },]
    },
    {
      title: '合同总价',
      children: [{
        title: '暂估合同额',
        key: 'plan_sum',
        render(val) {
          return <span>100万</span>;
        },
      },
        {
          title: '有效合同额',
          key: 'actul_sum',
          render(val) {
            return <span>100万</span>;
          },
        },]
    },
    {
      title: '项目经理',
      dataIndex: 'projectManager',
    },
    {
      title: '项目书记',
      dataIndex: 'projectSecretary',
    },
    {
      title: '总工',
      dataIndex: 'chiefEngineer',
      render: val => <span>李蛋蛋</span>,
    },
    {
      title: '操作',
      render: (val, record) => {
        const button = this.props.app.user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ?
              <a onClick={() => this.handleCheckDetail(true, record)}>查看</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[3]) ?
              <a>导出</a> : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    this.getProNames([])
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    this.getList()
  }

  componentWillUnmount() {
    clearTimeout(_setTimeOut)
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
      address: fields.address,
      orgAddress: fields.orgAddress,
      status: fields.status,
      mileageNumber: fields.mileageNumber,
      totalPrice: fields.totalPrice,
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
    }
    if (updateModalVisible) {
      dispatch({
        type: 'sys_user/update',
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
        type: 'sys_user/add',
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

  handleUpdate = fields => {
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {expandForm} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目经理">
              {getFieldDecorator('projectManager')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目书记">
              {getFieldDecorator('projectSecretary')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="总工">
              {getFieldDecorator('chiefEngineer')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? <Row gutter={{md: 4, lg: 12, xl: 24}}>
          <Col md={5} sm={24}>
            <FormItem label="计划开工日期">
              {getFieldDecorator('contractStartTime')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="计划完工日期">
              {getFieldDecorator('contractEndTime')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="实际开工日期">
              {getFieldDecorator('realContractStartTime')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="实际完工日期">
              {getFieldDecorator('realContractStartTime')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="工程状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">在建</Option>
                  <Option value="1">完工未结算</Option>
                  <Option value="2">完工已结算</Option>
                  <Option value="3">停工</Option>
                </Select>
              )}
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

  render() {
    const {
      pro_proInfo: {data, proNames},
      loading,
      app:{user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, selectedValues, pageLoading, checkDetail} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
      </Menu>
    );

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
      proNames: proNames
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="工程项目信息卡">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {getButtons(user.permissionsMap.button,pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {selectedRows.length > 0 && (
                  <span>
                  <Dropdown overlay={menu}>
                    <Button>
                     操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
                )}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['pro_proInfo/fetch']}
                data={data}
                scroll={{x: '150%'}}
                bordered
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
          type: 'pro_proInfo/queryProNames',
          payload: {page: 1, pageSize: 10}
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'pro_proInfo/fetch',
      payload: {page: page, pageSize: pageSize}
    });
  }

  searchList = (page = 1, pageSize = 10) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      this.props.dispatch({
        type: 'pro_proInfo/fetch',
        payload: {
          page: page,
          pageSize: pageSize,
          projectName: fieldsValue.projectName,
          mileageNumber: fieldsValue.mileageNumber,
          totalPrice: fieldsValue.totalPrice,
          contractStartTime: fieldsValue.contractStartTime,
          contractEndTime: fieldsValue.contractEndTime,
          realContractStartTime: fieldsValue.realContractStartTime,
          realContractEndTime: fieldsValue.realContractEndTime,
          status: fieldsValue.status,
          projectManager: fieldsValue.projectManager,
          chiefEngineer: fieldsValue.chiefEngineer,
          projectSecretary: fieldsValue.status,
        }
      });
    });
  }
}

InfoCard.propTypes = {}

export default connect(({app, rule, loading, pro_proInfo}) => ({app, rule, loading, pro_proInfo}))(InfoCard)
