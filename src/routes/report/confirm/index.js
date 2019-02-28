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
const pageButtons = menuData[26].buttons.map(a => a.permission)
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
  }

  cleanState = () => {
  }

  componentWillUnmount() {
  }

  render() {
    const {proNames, modalVisible, loading, form, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '确权清收表' : updateModalVisible ? "编辑确权清收表" : "新增确权清收表"}
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
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="项目名称">
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
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="填报时间">
                {form.getFieldDecorator('reportTime', {
                  rules: [{required: true, message: '请选择填报日期'}],
                  initialValue: selectedValues.reportTime ? moment(selectedValues.reportTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>年初余额</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="上年末开累完成产值" addonAfter={'万元'}>
                {form.getFieldDecorator('balanceCompleteValue', {
                  rules: [{required: true, message: '请输入上年末开累完成产值'}],
                  initialValue: selectedValues.balanceCompleteValue ? selectedValues.balanceCompleteValue : '',
                })(<Input disabled={true} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="上年末开累验工计价" addonAfter={'万元'}>
                {form.getFieldDecorator('balanceInspectionValue', {
                  rules: [{required: true, message: '请输入上年末开累验工计价'}],
                  initialValue: selectedValues.balanceInspectionValue ? selectedValues.balanceInspectionValue : '',
                })(<Input disabled={true} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>上年末完工未计价</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="合同内应计未计" addonAfter={'万元'}>
                {form.getFieldDecorator('balanceShould', {
                  rules: [{required: true, message: '请输入合同内应计未计'}],
                  initialValue: selectedValues.balanceShould ? selectedValues.balanceShould : '',
                })(<Input disabled={true} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="变更索赔预计额" addonAfter={'万元'}>
                {form.getFieldDecorator('balanceChange', {
                  rules: [{required: true, message: '请输入变更索赔预计额'}],
                  initialValue: selectedValues.balanceChange ? selectedValues.balanceChange : '',
                })(<Input disabled={true} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="小计" addonAfter={'万元'}>
                {form.getFieldDecorator('sumBalance', {
                  rules: [{required: true, message: '请输入小计'}],
                  initialValue: selectedValues.sumBalance ? selectedValues.sumBalance : null,
                })(<Input disabled={true} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>截至本期清收</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 13}} label="截至本期完成产值">
                {form.getFieldDecorator('currentProductionValue', {
                  rules: [{required: true, message: '请输入截至本期完成产值'}],
                  initialValue: selectedValues.currentProductionValue ? selectedValues.currentProductionValue : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>截至本期验工计价</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
            <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="上年末已完工本年计价">
              {form.getFieldDecorator('halfCompleteValue', {
                rules: [{required: true, message: '请输入上年末已完工本年计价'}],
                initialValue: selectedValues.halfCompleteValue ? selectedValues.halfCompleteValue : testValue,
              })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万元"/>)}
            </FormItem>
          </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="当年完成产值当年验工计价">
                {form.getFieldDecorator('oneCompleteValue', {
                  rules: [{required: true, message: '请输入当年完成产值当年验工计价'}],
                  initialValue: selectedValues.oneCompleteValue ? selectedValues.oneCompleteValue : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="小计" addonAfter={'万元'}>
                {form.getFieldDecorator('sumHalfOne', {
                  rules: [{required: true, message: '请输入小计'}],
                  initialValue: selectedValues.sumHalfOne ? selectedValues.sumHalfOne : testValue,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 10}} label="变更索赔预计额" addonAfter={'万元'}>
                {form.getFieldDecorator('changeValue', {
                  rules: [{required: true, message: '请输入变更索赔预计额'}],
                  initialValue: selectedValues.changeValue ? selectedValues.changeValue : testValue,
                })(<Input disabled={true} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>开累情况</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="开累完成产值">
                {form.getFieldDecorator('completedValue', {
                  rules: [{required: true, message: '请输入开累完成产值'}],
                  initialValue: selectedValues.completedValue ? selectedValues.completedValue : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter={'万元'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="开累验工计价">
                {form.getFieldDecorator('inspection', {
                  rules: [{required: true, message: '请输入开累验工计价'}],
                  initialValue: selectedValues.inspection ? selectedValues.inspection : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="万元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>期末完工未计价</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="其中:合同内应计未计">
                {form.getFieldDecorator('finalPeriodShould', {
                  rules: [{required: true, message: '请输入合同内应计未计'}],
                  initialValue: selectedValues.finalPeriodShould ? selectedValues.finalPeriodShould: testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter={'万元'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="其中:变更索赔预计额">
                {form.getFieldDecorator('finalPeriodChange', {
                  rules: [{required: true, message: '请输入变更索赔预计额'}],
                  initialValue: selectedValues.finalPeriodChange ? selectedValues.finalPeriodChange: testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter={'万元'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 13}} wrapperCol={{span: 11}} label="小计">
                {form.getFieldDecorator('sumFinalPeriod', {
                  rules: [{required: true,message: '请输入小计'}],
                  initialValue: selectedValues.sumFinalPeriod ? selectedValues.sumFinalPeriod : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter={'万元'}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

}

@Form.create()
class Confirmation extends Component {

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
      width: 180,
      render(val,record) {
        return <span>{val ? `${moment(val).format('YYYY')}年第${record.quarter}季度` : ''}</span>;
      }
    },
    {
      title: '年初余额',
      dataIndex: 'projectName1',
      children:[
        {
          title: '上年末开累完成产值',
          dataIndex: 'balanceCompleteValue',
          width: 150
        },
        {
          title: '上年末开累验工计价',
          dataIndex: 'balanceInspectionValue',
          width: 150
        },
        {
          title: '上年末完工未计价',
          children: [
            {
              title: '小计',
              dataIndex: 'sumBalance',
              width: 120,
            },
            {
              title: '合同内应计未计',
              dataIndex: 'balanceShould',
              width: 180,
            },
            {
              title: '变更索赔预计额',
              dataIndex: 'balanceChange',
              width: 180,
            },
          ]
        },
      ]
    },
    {
      title: '本年截至本期',
      children: [
        {
          title: '本年截至本期完成产值',
          dataIndex: 'currentProductionValue',
          width: 150,
        },
        {
          title: '截至本期验工计价',
          children: [
            {
              title: '小计',
              dataIndex: 'sumHalfOne',
              width: 120,
            },
            {
              title: '上年末已完工本年计价',
              dataIndex: 'halfCompleteValue',
              width: 170,
            },
            {
              title: '当年完成产值当年验工计价',
              dataIndex: 'oneCompleteValue',
              width: 170,
            },
          ]
        },
        {
          title: '变更索赔预计额',
          dataIndex: 'changeValue',
          width: 180,
        },
      ]
    },
    {
      title: '开累情况',
      children: [
        {
          title: '开累完成产值',
          dataIndex: 'completedValue',
          width: 120,
        },
        {
          title: '开累验工计价',
          dataIndex: 'inspection',
          width: 200,
        },
        {
          title: '期末完工未计价',
          children:[
            {
              title: '小记',
              dataIndex: 'sumFinalPeriod',
             // width: 120,
            },
            {
              title: '其中：合同内应计未计',
              dataIndex: 'finalPeriodShould',
              width: 180,
            },
            {
              title: '其中：变更索赔预计额',
              dataIndex: 'finalPeriodChange',
              width: 180,
            },
          ]
        },
      ]
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (val, record) => {
        if (record.id == '总计:') {
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
        type: 'confirmation/update',
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
        type: 'confirmation/add',
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
      confirmation: {data, proNames},
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
      loading: loading.effects[`confirmation/${updateModalVisible ? 'update' : 'add'}`]
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
                loading={loading.effects['confirmation/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: '280%', y: global._scollY}}
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
          type: 'confirmation/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'confirmation/fetch',
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
        type: 'confirmation/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

}

Confirmation.propTypes = {}

export default connect(({app, loading, confirmation}) => ({app, loading, confirmation}))(Confirmation)
