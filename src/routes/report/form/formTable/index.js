import React, {Component, Fragment} from 'react'
import {connect} from 'dva'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {getButtons, cleanObject} from 'utils'
import {menuData} from 'common/menu'
import {ENGINEER_STAT_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const pageButtons = menuData[25].buttons.map(a => a.permission)


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

  cleanState = () => {
  }

  componentWillUnmount() {
  }

  render() {
    const { modalVisible,form, handleCheckDetail, selectedValues, checkDetail} = this.props;
    return (
      <Modal
        destroyOnClose
        title={'变更索赔情况统计表'}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={1100}
        maskClosable={false}
        onOk={() =>  handleCheckDetail()}
        onCancel={() => {
          handleCheckDetail()
        }}
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectName', {
                  initialValue: selectedValues.projectName ? selectedValues.projectName : '',
                })(<Input disabled={true} />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程类别">
                {form.getFieldDecorator('projectType', {
                  initialValue: selectedValues.projectType ? selectedValues.projectType : '',
                })(<Input disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="施工产值">
                {form.getFieldDecorator('constructionOutputValueStatistics', {
                  initialValue: selectedValues.constructionOutputValueStatistics ? selectedValues.constructionOutputValueStatistics : '',
                })(<Input disabled={checkDetail} style={{marginTop:4}} addonAfter={'万'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="变更索赔额">
                {form.getFieldDecorator('changeClaimAmountStatistics', {
                  initialValue: selectedValues.changeClaimAmountStatistics ? selectedValues.changeClaimAmountStatistics : '',
                })(<Input disabled={checkDetail} style={{marginTop:4}} addonAfter={'万'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同金额">
                {form.getFieldDecorator('temporarilyPriceStatistics', {
                  initialValue: selectedValues.temporarilyPriceStatistics ? selectedValues.temporarilyPriceStatistics : '',
                })(<Input disabled={checkDetail} style={{marginTop:4}} addonAfter={'万'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="变更索赔率">
                {form.getFieldDecorator('percentageStatistics', {
                  initialValue: selectedValues.percentageStatistics ? selectedValues.percentageStatistics : '',
                })(<Input disabled={true} style={{marginTop:4}} addonAfter={'%'}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

}

@Form.create()
class ReportFormTable extends Component {

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
      title: '工程类别',
      dataIndex: 'projectType',
      fixed: 'left',
      width: 100
    },
    {
      title: '合同总额(万)',
      dataIndex: 'temporarilyPriceStatistics',
      width: 150
    },
    {
      title: '施工产值(万)',
      dataIndex: 'constructionOutputValueStatistics',
      width: 150
    },
    {
      title: '变更索赔额(万)',
      dataIndex: 'changeClaimAmountStatistics',
      width: 150
    },
    {
      title: '变更索赔率',
      dataIndex: 'percentageStatistics',
      render:(val)=>{
        return<span>{isNaN(val)?'':(val*100).toFixed(2)}</span>
      },
      width: 120
    },
    {
      title: '操作',
      width: 120,
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
      this.getProNames([])
      this.getList()
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchList(null, pagination.current, pagination.pageSize)
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
      constructionOutputValue: fields.constructionOutputValue,
      changeClaimAmount: fields.changeClaimAmount,
    }
    if (updateModalVisible) {
      dispatch({
        type: 'reportFormTable/update',
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
        type: 'reportFormTable/add',
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

  renderForm() {
    return this.renderAdvancedForm()
  }

  render() {
    const {
      reportFormTable: {data},
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
    }
    const exportUrl = createURL(ENGINEER_STAT_EXPORT, {
      ...this.exportParams, ...{
        token: user.token}
    })


    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="变更索赔情况统计表">
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
                loading={loading.effects['reportFormTable/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x:1070, y: global._scollY}}
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
          type: 'reportFormTable/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'reportFormTable/fetch',
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
        type: 'reportFormTable/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

ReportFormTable.propTypes = {}

export default connect(({app, loading, reportFormTable}) => ({app, loading, reportFormTable}))(ReportFormTable)
