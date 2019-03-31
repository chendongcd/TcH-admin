import React, {Component, Fragment} from 'react'
import {connect} from 'dva'

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal, Divider, Popconfirm
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {getButtons, cleanObject,getPage} from 'utils'
import {CONTRACT_STAT_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;


const pageButtons = getPage('912').buttons.map(a => a.permission)
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

  };

  componentWillUnmount() {
  }

  render() {
    const { modalVisible, form, handleCheckDetail, selectedValues, checkDetail} = this.props;
    return (
      <Modal
        destroyOnClose
        title={'项目合同外计日工及补偿费用台账'}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={1100}
        maskClosable={false}
        onOk={() => handleCheckDetail()}
        onCancel={() => handleCheckDetail()}
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectName', {
                  initialValue: selectedValues.projectName ? selectedValues.projectName : '',
                })(<Input disabled={true}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程类别">
                {form.getFieldDecorator('projectType', {
                  initialValue: selectedValues.projectType ? selectedValues.projectType : '',
                })(<Input disabled={true} />)}
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
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同内计量">
                {form.getFieldDecorator('statisticsTotalAmountContract', {
                  initialValue: selectedValues.statisticsTotalAmountContract ? selectedValues.statisticsTotalAmountContract : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="计日工">
                {form.getFieldDecorator('statisticsDailyWorkSubtotal', {
                  initialValue: selectedValues.statisticsDailyWorkSubtotal ? selectedValues.statisticsDailyWorkSubtotal : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter={'元'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同外补偿/赔偿">
                {form.getFieldDecorator('statisticsCompensationSubtotal', {
                  initialValue: selectedValues.statisticsCompensationSubtotal ? selectedValues.statisticsCompensationSubtotal : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="小记">
                {form.getFieldDecorator('statisticsAlreadySubtotal', {
                  initialValue: selectedValues.statisticsAlreadySubtotal ? selectedValues.statisticsAlreadySubtotal : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>预计金额(元)</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="计日工">
                {form.getFieldDecorator('statisticsEstimateDailyWorkSubtotal', {
                  initialValue: selectedValues.statisticsEstimateDailyWorkSubtotal ? selectedValues.statisticsEstimateDailyWorkSubtotal : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter={'元'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同外补偿/赔偿">
                {form.getFieldDecorator('statisticsEstimateCompensationSubtotal', {
                  initialValue: selectedValues.statisticsEstimateCompensationSubtotal ? selectedValues.statisticsEstimateCompensationSubtotal : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="小记">
                {form.getFieldDecorator('statisticsEstimateSubtotal', {
                  initialValue: selectedValues.statisticsEstimateSubtotal ? selectedValues.statisticsEstimateSubtotal : testValue,
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
class Daily extends Component {

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
/*    {
      title: '序号',
      dataIndex: 'id',
      width: 100,
     // fixed: 'left',
    },*/
    {
      title: '项目名称',
      dataIndex: 'projectName',
      width: 180,
      //fixed: 'left',
    },
    {
      title: '工程类别',
      dataIndex: 'projectType',
      width: 110,
     // fixed: 'left',
    },
    {
      title: '已计价金额（元）',
      children: [
        {
          title: '合同内计量',
          dataIndex: 'statisticsTotalAmountContract',
          key: 'statisticsTotalAmountContract',
          width: 180,
        },
        {
          title: '计日工',
          dataIndex: 'statisticsDailyWorkSubtotal',
          width: 110,
        },
        {
          title: '合同外补偿/赔偿',
          dataIndex: 'statisticsCompensationSubtotal',
          width: 210,
        },
        {
          title: '小计',
          dataIndex: 'statisticsAlreadySubtotal',
          width: 110,
        },
      ]
    },
    {
      title: '预估金额（元）',
      children: [
        {
          title: '计日工',
          dataIndex: 'statisticsEstimateDailyWorkSubtotal',
          width: 100,
        },
        {
          title: '合同外补偿/赔偿',
          dataIndex: 'statisticsEstimateCompensationSubtotal',
          width: 150,
        },
        {
          title: '小计',
          width:110,
          dataIndex: 'statisticsEstimateSubtotal',
        },
      ]
    },
    {
      title: '操作',
      width: 120,
      //fixed: 'right',
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
            {getButtons(button, pageButtons[0]) ?
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
       this.getList()
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchList(null, pagination.current)
  };

  handleFormReset = () => {
    const {form} = this.props;
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

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.searchList} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
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

  renderForm() {
    return this.renderAdvancedForm()
  }

  render() {
    const {
      expenseDaily: {data},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
    }
    const exportUrl = createURL(CONTRACT_STAT_EXPORT, {
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
                {user.token && getButtons(user.permissionsMap.button, pageButtons[1]) ?
                  <Button href={exportUrl} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['expenseDaily/fetch']}
                bordered
                data={data}
                rowKey={'projectName'}
                scroll={{x: 1430, y: global._scollY}}
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

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'expenseDaily/fetch',
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
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'expenseDaily/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

Daily.propTypes = {}

export default connect(({app, loading, expenseDaily}) => ({app, loading, expenseDaily}))(Daily)
