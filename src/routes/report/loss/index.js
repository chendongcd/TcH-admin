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
  Modal, Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, CustomPicker,Remark} from 'components'
import styles from './index.less'
import {getButtons, cleanObject} from 'utils'
import {menuData} from 'common/menu'
import {LOSS_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const {Option} = Select;
const pageButtons = menuData[27].buttons.map(a => a.permission)
const testValue = ''


@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
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
      fieldsValue.lossRatio = fieldsValue.lossRatio/100
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  cleanState = () => {
  }

  componentWillUnmount() {
  }

  render() {
    const {proNames, modalVisible, loading, form, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '过程亏损项目明细表' : updateModalVisible ? "编辑过程亏损项目明细表" : "新增过程亏损项目明细表"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
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
                           disabled={checkDetail}
                           style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="填报时间">
                {form.getFieldDecorator('reportTime', {
                  rules: [{required: true, message: '请选择填报日期'}],
                  initialValue: selectedValues.reportTime ? moment(selectedValues.reportTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同金额">
                {form.getFieldDecorator('temporarilyPrice', {
                  rules: [{required: true, message: '请输入合同金额(万元)'}],
                  initialValue: selectedValues.temporarilyPrice ? selectedValues.temporarilyPrice : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>收入(万元)</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="已计价">
                {form.getFieldDecorator('alreadyPrice', {
                  rules: [{required: true, message: '请输入已计价'}],
                  initialValue: selectedValues.alreadyPrice ? selectedValues.alreadyPrice : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入已计价" addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="未计价">
                {form.getFieldDecorator('unPriced', {
                  rules: [{required: true, message: '请输入未计价'}],
                  initialValue: selectedValues.unPriced ? selectedValues.unPriced : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入未计价" addonAfter={'万元'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="财务确认收入">
                {form.getFieldDecorator('confirmPriced', {
                  rules: [{required: true, message: '请输入财务确认收入'}],
                  initialValue: selectedValues.confirmPriced ? selectedValues.confirmPriced : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>成本(不含上交公司管理费)(万元)</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="帐内成本">
                {form.getFieldDecorator('inBookCost', {
                  rules: [{required: true, message: '请输入帐内成本'}],
                  initialValue: selectedValues.inBookCost ? selectedValues.inBookCost : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入帐内成本" addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span:6}} wrapperCol={{span: 15}} label="帐外成本">
                {form.getFieldDecorator('outBookCost', {
                  rules: [{required: true, message: '请输入帐外成本'}],
                  initialValue: selectedValues.outBookCost ? selectedValues.outBookCost : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入帐外成本" addonAfter={'万元'}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>亏损情况(万元)</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="亏损比例">
                {form.getFieldDecorator('lossRatio', {
                  rules: [{required: true, message: '请输入亏损比例'}],
                  initialValue: selectedValues.lossRatio ? selectedValues.lossRatio*100 : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入亏损比例" addonAfter={'%'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="财务已确认净利润">
                {form.getFieldDecorator('confirmedNetProfit', {
                  rules: [{required: true, message: '请输入财务已确认净利润'}],
                  initialValue: selectedValues.confirmedNetProfit ? selectedValues.confirmedNetProfit : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入财务已确认净利润" addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>潜盈(+)潜亏(-)情况(万元)</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="预付账款">
                {form.getFieldDecorator('prepayments', {
                  rules: [{required: true, message: '请输入预付账款'}],
                  initialValue: selectedValues.prepayments ? selectedValues.prepayments: testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入预付账款" addonAfter={'万元'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="其他">
                {form.getFieldDecorator('other', {
                  initialValue: selectedValues.other ? selectedValues.other : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

}

@Form.create()
class LossForm extends Component {

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
      dataIndex: 'id',
      fixed: 'left',
      width: 100
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      fixed: 'left',
      width: 180
    },
    {
      title: '填报时间',
      dataIndex: 'reportTime',
      width: 150,
      render(val,record) {
        return <span>{val ? `${moment(val).format('YYYY')}年第${record.quarter}季度` : ''}</span>;
      }
    },
    {
      title: '合同金额(万元)',
      dataIndex: 'temporarilyPrice',
      width: 150
    },
    {
      title: '收入(万元)',
      children: [
        {
          title: '已计价',
          dataIndex: 'alreadyPrice',
          width: 100,
        },
        {
          title: '未计价',
          dataIndex: 'unPriced',
          width: 100,
        },
        {
          title: '小计',
          dataIndex: 'sumPriced',
          width: 100,
        },
        {
          title: '财务确认收入',
          dataIndex: 'confirmPriced',
          width: 180,
        },
      ]
    },
    {
      title: '成本(不含上交公司管理费)（万元）',
      children: [
        {
          title: '帐内成本',
          dataIndex: 'inBookCost',
          width: 100,
        },
        {
          title: '账外成本',
          dataIndex: 'outBookCost',
          width: 100,
        },
        {
          title: '小计',
          dataIndex: 'sunBookCost',
          width: 100,
        },
      ]
    },
    {
      title: '亏损情况(万元)',
      children: [
        {
          title: '亏损金额',
          dataIndex: 'lossAmount',
          width: 100,
        },
        {
          title: '财务已确认净利润',
          dataIndex: 'confirmedNetProfit',
          width: 200,
        },
        {
          title: '财务未确认的亏损',
          dataIndex: 'unConfirmedNetProfit',
          width: 200,
        },
        {
          title: '亏损比例',
          dataIndex: 'lossRatio',
          width: 180,
        },
      ]
    },
    {
      title:'潜盈(+)潜亏(-)情况(万元)',
      children:[
        {
          title:'账内潜亏',
          children:[
            {
              title:'应收客户合同工程款',
              dataIndex:'contractReceivable',
              width:200
            },
            {
              title:'预付账款',
              dataIndex:'prepayments',
              width:100
            },
            {
              title:'其他',
              dataIndex:'other',
              width:100
            },
            {
              title:'小计',
              dataIndex:'profitLossSubtotal',
              width:100
            },
          ]
        },
        {
          title:'帐外潜亏',
          dataIndex:'potentialLoss',
          width:100
        },
        {
          title:'合计',
          dataIndex:'sum',
          width:100
        }
      ]
    },
    {
      title:'备注',
      dataIndex:'remark',
      render:(val)=>{
        return <Remark content={val} max={10}/>
      }
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (val, record) => {
        if (record.id == '合计:') {
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
    this.searchList(null, pagination.current, pagination.pageSize)
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
      temporarilyPrice: fields.temporarilyPrice,
      alreadyPrice: fields.alreadyPrice,
      unPriced: fields.unPriced,
      confirmPriced: fields.confirmPriced,
      inBookCost: fields.inBookCost,
      reportTime: fields.reportTime,
      outBookCost: fields.outBookCost,
      lossRatio: fields.lossRatio,
      confirmedNetProfit: fields.confirmedNetProfit,
      prepayments: fields.prepayments,
      remark: fields.remark,
      other: fields.other,
    }
    if (updateModalVisible) {
      dispatch({
        type: 'lossForm/update',
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
        type: 'lossForm/add',
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
                <Option value={1}>第一季度</Option>
                <Option value={2}>第二季度</Option>
                <Option value={3}>第三季度</Option>
                <Option value={4}>第四季度</Option>
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
            </div>
          </div>
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
      lossForm: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      loading: loading.effects[`lossForm/${updateModalVisible ? 'update' : 'add'}`]
    }
    const exportUrl = createURL(LOSS_EXPORT, {
      ...this.exportParams, ...{
        token: user.token}
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
                loading={loading.effects['lossForm/fetch']}
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
          <CreateForm {...parentMethods} {...parentState}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'lossForm/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'lossForm/fetch',
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
        type: 'lossForm/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

}

LossForm.propTypes = {}

export default connect(({app, loading, lossForm}) => ({app, loading, lossForm}))(LossForm)
