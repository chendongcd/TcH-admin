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
import {Page, PageHeaderWrapper, StandardTable, ExportModal} from 'components'
import styles from './index.less'
import {getButtons, cleanObject,getPage, fixNumber} from 'utils'
import {METER_SUM_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;

const pageButtons = getPage('42').buttons.map(a => a.permission)
const plainOptions = [
  {label: '预付款', value: '1'},
  {label: '计价金额', value: '2'},
  {label: '实际支付', value: '3'},
  {label: '资金拨付情况', value: '4'},
  {label: '其它计价', value: '5'},
  {label: '产值计价率', value: '6'}
]
@Form.create()
class UpSummary extends Component {

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
      exportModalVisible: false
    }
    this.exportParams = {
      page: 1,
      pageSize: 10
    }
  }

  columns = [
    {
      title: '序号',
      // fixed: 'left',
      width: 100,
      dataIndex: 'ids',
    },
    {
      title: '项目名称',
      //fixed: 'left',
      width: 180,
      dataIndex: 'projectName',
    },
    {
      title: '预付款（元）',
      width: 120,
      dataIndex: 'sumPrepaymentAmount',
    },
    {
      title: '计价金额（元）',
      children: [{
        title: '含税',
        dataIndex: 'sumValuationAmountTax',
        width: 150,
        key: 'sumValuationAmountTax'
      },
        {
          title: '税率(%)',
          dataIndex: 'tax',
          width: 100,
          key: 'tax'
        }, {
          title: '不含税',
          dataIndex: 'valuationAmountNotTax',
          key: 'valuationAmountNotTax',
          width: 150,
        }]
    },
    {
      title: '实际应付金额（元）',
      children: [{
        title: '含税',
        dataIndex: 'sumRealAmountTax',
        key: 'sumRealAmountTax',
        width: 150,
      }, {
        title: '不含税',
        dataIndex: 'sumRealAmount',
        key: 'sumRealAmount',
        width: 150,
      }]
    },
    {
      title: '资金拨付情况（元）',
      children: [{
        title: '已支付金额',
        dataIndex: 'sumAlreadyPaidAmount',
        key: 'sumAlreadyPaidAmount',
        width: 150,
      },
        {
          title: '未支付金额',
          dataIndex: 'sumUnpaidAmount',
          key: 'sumUnpaidAmount',
          width: 150,
        }, {
          title: '拨付率(%)',
          dataIndex: 'payProportion',
          key: 'payProportion',
          width: 110,
          render(val) {
            return <span>{Number.isInteger(val * 100) ? (val * 100) : (val * 100).toFixed(2)}</span>;
          }
        }]
    },
    {
      title: '其他计价（元）',
      children: [{
        title: '超计价',
        dataIndex: 'sumExtraAmount',
        key: 'sumExtraAmount',
        width: 100,
      },
        {
          title: '已完未计',
          dataIndex: 'sumNotCalculatedAmount',
          key: 'sumNotCalculatedAmount',
          width: 110,
        }]
    },
    {
      title: '产值计价率(%)',
      width: 130,
      dataIndex: 'productionValue',
      render(val) {
        return <span>{fixNumber(val, 100) + '%'}</span>;
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

  handleExportModalVisible = (flag = false) => {
    this.setState({
      exportModalVisible: !!flag,
    });
  }

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
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={18} sm={24}>
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

  render() {
    const {
      upSummary: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, exportModalVisible, pageLoading} = this.state;

    const exportUrl = createURL(METER_SUM_EXPORT, {
      ...this.exportParams, ...{
        token: user.token,
        exportType: 'forUpExportType'
      }
    })
    const exportProps = {
      exportModalVisible: exportModalVisible,
      handleExportModalVisible: this.handleExportModalVisible,
      exportUrl: exportUrl,
      plainOptions: plainOptions,
      must: true
    }
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
                loading={loading.effects['upSummary/fetch']}
                bordered
                data={data}
                rowKey={'ids'}
                scroll={{x: 1850, y: global._scollY}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <ExportModal {...exportProps}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'upSummary/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'upSummary/fetch',
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
        type: 'upSummary/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'upSummary/del',
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

UpSummary.propTypes = {}

export default connect(({app, loading, upSummary}) => ({app, loading, upSummary}))(UpSummary)
