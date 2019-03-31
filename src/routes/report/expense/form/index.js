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
  Button,
  DatePicker,
  Modal, Divider, Popconfirm,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, CustomPicker} from 'components'
import styles from './index.less'
import {getButtons, cleanObject,getPage,fixNumber} from 'utils'
import {CONTRACT_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const {Option} = Select;
const pageButtons = getPage('911').buttons.map(a => a.permission)


@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selects: {}
    };
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
      if (selectedValues.subcontractorId) {
        fieldsValue.subcontractorId = selectedValues.subcontractorId
        fieldsValue.laborAccountId = selectedValues.laborAccountId
      }
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  cleanState = () => {
    this.setState({selects: {}})
  }

  componentWillUnmount() {
  }

  handleAmount = (value, type, item) => {
    let {form, getSubNames, getTeamList} = this.props
    let res = form.getFieldsValue(['projectId', 'subcontractorId', 'laborAccountId'])
    let selects = this.state.selects
    if (type === 0) {
      form.setFieldsValue({'projectType': item.projectType, 'contractNumber': item.contractNumber})
      if (selects.projectId != value) {
        if (selects.projectId) {
          form.setFieldsValue({'subcontractorId': '', 'laborAccountId': '', 'contractPerson': ''})
        }
        this.setState({selects: {projectId: value}})
        getSubNames({projectId: value})
        return
      }
      return
    } else if (type === 1) {
      if (selects.subcontractorId != value) {
        if (selects.subcontractorId) {
          form.setFieldsValue({'laborAccountId': '', 'contractPerson': ''})
        }
        this.setState({selects: {projectId: res.projectId, subcontractorId: value}})
        getTeamList({projectId: res.projectId, subcontractorId: value})
        return
      }
      return
    } else {
      form.setFieldsValue({'contractPerson': item.contractPerson})
      res.laborAccountId = value.props.name
    }
    this.setState({selects: res})
  }

  render() {
    const {proNames, teamList, teamLoading, subNames, subLoading, modalVisible, loading, form, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {selects} = this.state
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '合同外计日工赔偿情况统计表' : updateModalVisible ? "编辑合同外计日工赔偿情况统计表" : "新增合同外计日工赔偿情况统计表"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={1100}
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
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect}
                           showSearch={true}
                           optionFilterProp={'name'}
                           onSelect={(value, item) => this.handleAmount(value, 0, item.props.item)}
                           disabled={checkDetail}
                           style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程类别">
                {form.getFieldDecorator('projectType', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectType ? selectedValues.projectType : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="分包商名称">
                {form.getFieldDecorator('subcontractorId', {
                  rules: [{required: true, message: '请选择分包商'}],
                  initialValue: selectedValues.subcontractorName ? selectedValues.subcontractorName : '',
                })(<Select className={styles.customSelect} onSelect={(value) => this.handleAmount(value, 1)}
                           showSearch={true}
                           loading={subLoading}
                           optionFilterProp={'name'}
                           disabled={checkDetail || !selects.projectId}
                           style={{width: '100%'}}>
                  {subNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="队伍名称">
                {form.getFieldDecorator('laborAccountId', {
                  rules: [{required: true, message: '请选择队伍名称'}],
                  initialValue: selectedValues.teamName ? selectedValues.teamName : '',
                })(<Select className={styles.customSelect}
                           onSelect={(value, option) => this.handleAmount(option, 2, option.props.item)}
                           showSearch={true}
                           optionFilterProp={'name'}
                           loading={teamLoading}
                           disabled={checkDetail || !selects.subcontractorId}
                           style={{width: '100%'}}>
                  {teamList.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.teamName}
                                   value={item.id}>{item.teamName}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同编号">
                {form.getFieldDecorator('contractNumber', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.contractNumber ? selectedValues.contractNumber : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同签订人">
                {form.getFieldDecorator('contractPerson', {
                  rules: [{required: true, message: '请选择队伍'}],
                  initialValue: selectedValues.contractPerson ? selectedValues.contractPerson : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="填报日期">
                {form.getFieldDecorator('reportTime', {
                  rules: [{required: true, message: '请选择填报日期'}],
                  initialValue: selectedValues.reportTime ? moment(selectedValues.reportTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="计日工及补偿已拨付金额">
                {form.getFieldDecorator('amountAlreadyDisbursed', {
                  rules: [{required: true,message: '请输入计日工及补偿已拨付金额(数字)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.amountAlreadyDisbursed),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="是否报审">
                {form.getFieldDecorator('examination', {
                  rules: [{required: true, message: '请选择是否报审'}],
                  initialValue: selectedValues.examination ? selectedValues.examination : null,
                })(<Select className={styles.customSelect}
                           disabled={checkDetail}
                           style={{width: '100%'}}>
                  <Option value={'是'}>是</Option>
                  <Option value={'否'}>否</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="是否结算">
                {form.getFieldDecorator('settlement', {
                  rules: [{required: true, message: '请选择是否结算'}],
                  initialValue: selectedValues.settlement ? selectedValues.settlement : '',
                })(<Select className={styles.customSelect}
                           disabled={checkDetail}
                           style={{width: '100%'}}>
                  <Option value={'是'}>是</Option>
                  <Option value={'否'}>否</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>已计价金额(元)</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="机械台班">
                {form.getFieldDecorator('mechanicalClass', {
                  rules: [{required: true, message: '请输入机械台班(数字)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.mechanicalClass),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="零星用工">
                {form.getFieldDecorator('sporadicEmployment', {
                  rules: [{required: true, message: '请输入零星用工(数字)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.sporadicEmployment),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter={'元'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="进出场">
                {form.getFieldDecorator('outIn', {
                  rules: [{required: true, message: '请输入进出场(数字)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.outIn),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="灾损">
                {form.getFieldDecorator('disasterDamage', {
                  rules: [{required: true, message: '请输入灾损(数字)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.disasterDamage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="窝工/停工">
                {form.getFieldDecorator('workStop', {
                  rules: [{required: true, message: '请输入窝工/停工(数字)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.workStop),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="其他">
                {form.getFieldDecorator('other', {
                  rules:[{message: '请输入金额(数字)',type:'number',transform(value) {
                  if(value){
                  return Number(value);
                }
                }}],
                  initialValue: global._checkNum(selectedValues.other),
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同内计量">
                {form.getFieldDecorator('totalAmountContract', {
                  rules: [{required: true, message: '请输入合同内计量(数字)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.totalAmountContract),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>合同外计日工及赔偿预估金额(元)</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="机械台班">
                {form.getFieldDecorator('estimateMechanicalClass', {
                  rules: [{required: true, message: '请输入机械台班(数字)',type:'number',transform(value) {
                  if(value){
                  return Number(value);
                }
                }}],
                  initialValue: global._checkNum(selectedValues.estimateMechanicalClass),
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="零星用工">
                {form.getFieldDecorator('estimateSporadicEmployment', {
                  rules: [{required: true, message: '请输入零星用工(元)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.estimateSporadicEmployment),
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter={'元'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="进出场">
                {form.getFieldDecorator('estimateOutIn', {
                  rules: [{required: true, message: '请输入进出场(元)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.estimateOutIn),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="灾损">
                {form.getFieldDecorator('estimateDisasterDamage', {
                  rules: [{required: true, message: '请输入灾损(元)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.estimateDisasterDamage),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="窝工/停工">
                {form.getFieldDecorator('estimateWorkStop', {
                  rules: [{required: true, message: '请输入窝工/停工(元)',type:'number',transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}],
                  initialValue: global._checkNum(selectedValues.estimateWorkStop),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="其他">
                {form.getFieldDecorator('estimateOther', {
                  rules:[{message:'请输入金额(数字)',type:'number',transform(value) {
                  if(value){
                  return Number(value);
                }
                }}],
                  initialValue: global._checkNum(selectedValues.estimateOther),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

}

@Form.create()
class ExpenseForm extends Component {

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
    this.CustomPicker = null
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'ids',
     // fixed: 'left',
      width: 100
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
     // fixed: 'left',
      width: 150
    },
    {
      title: '工程类别',
      dataIndex: 'projectType',
     // fixed: 'left',
      width: 100
    },
    {
      title: '分包商名称',
      dataIndex: 'subcontractorName',
      //fixed: 'left',
      width: 180
    },
    {
      title: '队伍名称',
      dataIndex: 'teamName',
     // fixed: 'left',
      width: 150
    },
    {
      title: '合同编号',
      dataIndex: 'contractNumber',
      width: 110
    },
    {
      title: '合同签订人',
      dataIndex: 'contractPerson',
      width: 100
    },
    {
      title: '填报日期',
      dataIndex: 'reportTime',
      width: 160,
      render(val,record) {
        return <span>{val ? `${moment(val).format('YYYY')}年第${record.quarter}季度` : ''}</span>;
      }
    },
    {
      title: '已计价金额（元）',
      children: [
        {
          title: '合同内计量',
          dataIndex: 'totalAmountContract',
          key: 'totalAmountContract',
          width: 150,
        },
        {
          title: '计日工',
          key: 'jirigong',
          children: [{
            title: '机械台班',
            dataIndex: 'mechanicalClass',
            key: 'mechanicalClass',
            width: 100,
          }, {
            title: '零星用工',
            dataIndex: 'sporadicEmployment',
            key: 'sporadicEmployment',
            width: 100,
          }, {
            title: '小计',
            dataIndex: 'dailyWorkSubtotal',
            key: 'dailyWorkSubtotal',
            width: 100,
          },]
        },
        {
          title: '合同外补偿',
          key: 'hetongwaibuc',
          children: [{
            title: '进出场',
            dataIndex: 'outIn',
            key: 'outIn',
            width: 100,
          }, {
            title: '灾损',
            dataIndex: 'disasterDamage',
            key: 'disasterDamage',
            width: 100,
          }, {
            title: '窝工/停工',
            dataIndex: 'workStop',
            key: 'workStop',
            width: 100,
          }, {
            title: '其他',
            dataIndex: 'other',
            key: 'other',
            width: 100,
          }, {
            title: '小计',
            dataIndex: 'compensationSubtotal',
            key: 'compensationSubtotal',
            width: 100,
          },]
        },
        {
          title: '合计',
          dataIndex: 'total',
          key: 'total',
          width: 150,
        },
      ]
    },
    {
      title: '计日工占已计价金额比例（%）',
      dataIndex: 'dailyPercentage',
      width: 180,
      render:(val)=>{
        return<span>{`${fixNumber(val,100)}%`}</span>
      }
    },
    {
      title: '合同外补偿/赔偿占已计价金额比例（%）',
      dataIndex: 'compensationPercentage',
      width: 180,
      render:(val)=>{
        return<span>{`${fixNumber(val,100)}%`}</span>
      }
    },
    {
      title: '计日工及补偿已拨付金额（元）',
      dataIndex: 'amountAlreadyDisbursed',
      width: 180,
    },
    {
      title: '计日工及补偿已拨付金额拨付率（%）',
      dataIndex: 'disbursedPercentage',
      width: 180,
      render:(val)=>{
        return<span>{`${fixNumber(val,100)}%`}</span>
      }
    },
    {
      title: '是否报审',
      dataIndex: 'examination',
      width: 100,
    },
    {
      title: '是否结算',
      dataIndex: 'settlement',
      width: 100,
    },
    {
      title: '合同外计日工及赔偿预估金额（元）',
      key: 'exsjirigongbilio2',
      children: [{
        title: '计日工',
        key: 'exsjirigong',
        children: [{
          title: '机械台班',
          dataIndex: 'estimateMechanicalClass',
          key: 'estimateMechanicalClass',
          width: 100,
        }, {
          title: '零星用工',
          dataIndex: 'estimateSporadicEmployment',
          key: 'estimateSporadicEmployment',
          width: 100,
        }, {
          title: '小计',
          dataIndex: 'estimateDailyWorkSubtotal',
          key: 'estimateDailyWorkSubtotal',
          width: 100,
        },]
      },
        {
          title: '合同外补偿',
          key: 'hetongwaibuc1',
          children: [{
            title: '进出场',
            dataIndex: 'estimateOutIn',
            key: 'estimateOutIn',
            width: 100,
          }, {
            title: '灾损',
            dataIndex: 'estimateDisasterDamage',
            key: 'estimateDisasterDamage',
            width: 100,
          }, {
            title: '窝工/停工',
            dataIndex: 'estimateWorkStop',
            key: 'estimateWorkStop',
            width: 100,
          }, {
            title: '其他',
            dataIndex: 'estimateOther',
            key: 'estimateOther',
            width: 100,
          }, {
            title: '小计',
            dataIndex: 'estimateCompensationSubtotal',
            key: 'estimateCompensationSubtotal',
            width: 100,
          },]
        },
        {
          title: '合计',
          dataIndex: 'estimateTotal',
          key: 'estimateTotal',
          width: 110,
        },]
    },
    {
      title: '操作',
      width: 200,
     // fixed: 'right',
      render: (val, record) => {
        if (record.ids === '合计:') {
          return null
        }
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
              <Fragment>
                <a onClick={() => this.handleCheckDetail(true, record)}>查看</a>
              </Fragment> : null}
            {getButtons(button, pageButtons[4]) ?
              <Fragment>
                <Divider type="vertical"/>
                <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.id)} okText="是" cancelText="否">
                  <a>删除</a>
                </Popconfirm>
              </Fragment>
              : null}
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
    this.searchList(null, pagination.current)
  };

  handleFormReset = () => {
    const {form} = this.props;
    this.CustomPicker.resetValue()
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
      projectType: fields.projectType,
      subcontractorId: fields.subcontractorId,
      laborAccountId: fields.laborAccountId,
      contractNumber: fields.contractNumber,
      contractPerson: fields.contractPerson,
      reportTime: fields.reportTime,
      amountAlreadyDisbursed: fields.amountAlreadyDisbursed,
      examination: fields.examination,
      settlement: fields.settlement,
      mechanicalClass: fields.mechanicalClass,
      sporadicEmployment: fields.sporadicEmployment,
      outIn: fields.outIn,
      disasterDamage: fields.disasterDamage,
      workStop: fields.workStop,
      other: fields.other,
      estimateMechanicalClass: fields.estimateMechanicalClass,
      estimateSporadicEmployment: fields.estimateSporadicEmployment,
      estimateOutIn: fields.estimateOutIn,
      estimateDisasterDamage: fields.estimateDisasterDamage,
      estimateWorkStop: fields.estimateWorkStop,
      estimateOther: fields.estimateOther,
      totalAmountContract:fields.totalAmountContract,
    }
    cleanObject(payload)
    if (updateModalVisible) {
      dispatch({
        type: 'expenseForm/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.searchList(false,this.exportParams.page,this.exportParams.pageSize)
          cleanState()
        }
      })
    } else {
      dispatch({
        type: 'expenseForm/add',
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
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName', {})(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="分包商名称">
              {getFieldDecorator('subcontractorName', {})(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="队伍名称">
              {getFieldDecorator('teamName', {})(<Input/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="填报日期">
              {getFieldDecorator('year', {
                initialValue: null
              })(<CustomPicker ref={(e)=>this.CustomPicker = e } topMode="year" setValue={this.setYear} placeholder={'年'} format="YYYY" style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('quarter', {})(<Select placeholder="季度" style={{width: '70%'}}>
                <Option value={1}>第1季度</Option>
                <Option value={2}>第2季度</Option>
                <Option value={3}>第3季度</Option>
                <Option value={4}>第4季度</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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

  renderForm() {
    return this.renderAdvancedForm()
  }

  render() {
    const {
      expenseForm: {data, proNames, subNames, teamList},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      getSubNames: this.getSubNames,
      getTeamList: this.getTeamList
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      subNames: subNames,
      teamList: teamList,
      loading: loading.effects[`expenseForm/${updateModalVisible ? 'update' : 'add'}`],
      subLoading: loading.effects['expenseForm/querySubNames'],
      teamLoading: loading.effects['expenseForm/queryTeams'],
      amountLoading: loading.effects['expenseForm/queryAmount'],
    }
    const exportUrl = createURL(CONTRACT_EXPORT, {
      ...this.exportParams, ...{
        token: user.token}
    })


    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper>
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
                loading={loading.effects['expenseForm/fetch']}
                bordered
                data={data}
                rowKey={'ids'}
                scroll={{x: 4180, y: global._scollY}}
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
          type: 'expenseForm/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'expenseForm/fetch',
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
        teamName: fieldsValue.teamName,
        year: fieldsValue.year?fieldsValue.year.format('YYYY'):null,
        quarter: fieldsValue.quarter,
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'expenseForm/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

  getSubNames = (payload) => {
    this.props.dispatch(
      {
        type: 'expenseForm/querySubNames',
        payload: payload,
        token: this.props.app.user.token
      }
    )
  }

  getTeamList = (payload) => {
    this.props.dispatch(
      {
        type: 'expenseForm/queryTeams',
        payload: payload,
        token: this.props.app.user.token
      }
    )
  }

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'expenseForm/del',
      payload: {id},
      token: this.props.app.user.token
    }).then(res => {
      if (res) {
        if (res) {
          this.searchList(false, this.exportParams.page, this.exportParams.pageSize)
        }
      }
    })
  }
}

ExpenseForm.propTypes = {}

export default connect(({app, loading, expenseForm}) => ({app, loading, expenseForm}))(ExpenseForm)
