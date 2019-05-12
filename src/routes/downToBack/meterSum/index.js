import React, {Component} from 'react'
import {connect} from 'dva'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, getPage, fixNumber} from 'utils'
import {DOWN_SUM_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const pageButtons = getPage('64').buttons.map(a => a.permission)
const FormItem = Form.Item;

@Form.create()
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      selectedValues: {},
      checkDetail: false
    }
    this.exportParams = {
      page: 1,
      pageSize: 10
    }
  }

  columns = [
    {
      title: '序号',
      width: 100,
      dataIndex: 'ids',
      // fixed: 'left'
    },
    {
      title: '项目名称',
      width: 180,
      dataIndex: 'projectName',
      // fixed: 'left'
    },
    {
      title: '合同金额',
      width: 130,
      dataIndex: 'contractPrice',
    },
    {
      title: '计价金额',
      children: [
        {
          title: '计价总金额',
          dataIndex: 'sumValuationPrice',
          key: 'sumValuationPrice',
          width: 150,
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '扣款',
          dataIndex: 'sumValuationPriceReduce',
          key: 'sumValuationPriceReduce',
          width: 120,
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '扣除质保金',
          width: 120,
          dataIndex: 'sumWarranty',
          key: 'sumWarranty',
        },
        {
          title: '扣除履约保证金',
          width: 120,
          dataIndex: 'sumPerformanceBond',
          key: 'sumPerformanceBond',
        },
        {
          title: '计日工及补偿费用',
          width: 120,
          dataIndex: 'sumCompensation',
          key: 'sumCompensation'
        },
        {
          title: '应支付金额',
          dataIndex: 'sumShouldAmount',
          key: 'sumShouldAmount',
          width: 120,
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '已完未计',
          dataIndex: 'sumEndedPrice',
          key: 'sumEndedPrice',
          width: 120,
        }]
    },
    {
      title: '对下计价率(%)',
      dataIndex: 'sumRate',
      width: 110,
      render: (val) => {
        if (val === null || val === '') {
          return null
        }
        return <span>{fixNumber(val, 100) + '%'}</span>
      }
    },
    {
      title: '备注',
      width: 180,
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    // let w = 0
    // this.columns.map(a => {
    //   if (a.width) {
    //     w += a.width
    //   } else if (a.children) {
    //     a.children.map(b => {
    //       w += b.width
    //     })
    //   }
    // })
    // console.log(w)
    this.getList()
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

  handleAdd = (fields, updateModalVisible, selectedValues, cleanState) => {
    const {dispatch, app: {user}} = this.props;
    const payload = {
      projectId: fields.projectId,
      valuationType: fields.valuationType,
      valuationTime: fields.valuationTime,
      valuationPriceReduce: fields.valuationPriceReduce,
      valuationPrice: fields.valuationPrice,
      valuationPerson: fields.valuationPerson,
      valuationPeriod: fields.valuationPeriod,
      laborAccountId: fields.laborAccountId,
      subcontractorId: fields.subcontractorId,
      subcontractorName: selectedValues.subcontractorName,
      shouldAmount: fields.shouldAmount,
      remark: fields.remark,
      annexUrl: fields.annexUrl,
      contractPrice: fields.contractPrice,
      warranty: fields.warranty,
      compensation: fields.compensation,
      endedPrice: fields.endedPrice,
      performanceBond: fields.performanceBond
    }
    cleanObject(payload)
    if (updateModalVisible) {
      dispatch({
        type: 'meterSum/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.searchList(false, this.exportParams.page, this.exportParams.pageSize)
          cleanState()
        }
      })
    } else {
      dispatch({
        type: 'meterSum/add',
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
      <Form onSubmit={(e) => this.searchList(e)} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={12} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input/>)}
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
      meterSum: {data},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, pageLoading} = this.state;

    const exportUrl = createURL(DOWN_SUM_EXPORT, {...this.exportParams, ...{token: user.token}})

    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button href={exportUrl} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['meterSum/fetch']}
                bordered
                data={data}
                rowKey={'ids'}
                scroll={{x: 1570, y: global._scollY}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'meterSum/fetch',
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
        type: 'meterSum/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'meterSum/del',
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

Index.propTypes = {}

export default connect(({app, loading, meterSum}) => ({app, loading, meterSum}))(Index)
