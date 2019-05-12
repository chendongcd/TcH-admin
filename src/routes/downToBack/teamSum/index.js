import React, {Component} from 'react'
import {connect} from 'dva'
import moment from 'moment';

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
import {getButtons, cleanObject, getPage,fixNumber} from 'utils'
import {TEAM_SUM_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const pageButtons = getPage('62').buttons.map(a => a.permission)
const FormItem = Form.Item;
const plainOptions = [{label: '劳务队伍统计', value: '0'},
  {label: '备案情况', value: '1'},
]
const vType = ['', '中期计价', '末次结算'];

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
      comModal: false,
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
      width: 100,
      dataIndex: 'ids',
    },
    {
      title: '项目名称',
      width: 180,
      dataIndex: 'projectName',
    },
    {
      title: '分包商名称',
      width: 180,
      dataIndex: 'subcontractorName'
    },
    {
      title: '队伍名称',
      width: 120,
      dataIndex: 'teamName',
    },
    {
      title: '合同金额',
      width: 130,
      dataIndex: 'contractPrice',
    },
    {
      title: '计价期数',
      dataIndex: 'valuationPeriodCount',
      width: 130,
      render(val) {
        return <span>{val !== undefined ? ('第' + val + '期') : ''}</span>;
      },
    },
    {
      title: '截止日期',
      width: 150,
      dataIndex: 'newPeriodTime',
      render(val) {
        return <span>{val ? moment(val).format('YYYY/MM/DD') : ''}</span>;
      },
    },
    {
      title: '计价类型',
      dataIndex: 'newPeriodType',
      width: 110,
      render(val) {
        return <span>{vType[val]}</span>;
      },
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
  ];

  componentDidMount() {
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
      <Form onSubmit={(e) => this.searchList(e)} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商名称">
              {getFieldDecorator('subName')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="队伍名称">
              {getFieldDecorator('teamName')(<Input/>)}
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

  renderForm() {
    return this.renderAdvancedForm()
  }

  render() {
    const {
      teamSum: {data},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, exportModalVisible, pageLoading} = this.state;

    const exportUrl = createURL(TEAM_SUM_EXPORT, {
      ...this.exportParams, ...{
        token: user.token,
        exportType: 'teamExportType'
      }
    })
    const exportProps = {
      exportModalVisible: exportModalVisible,
      handleExportModalVisible: this.handleExportModalVisible,
      exportUrl: exportUrl,
      plainOptions: plainOptions
    }

    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button htmlType={exportUrl} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['teamSum/fetch']}
                bordered
                data={data}
                rowKey={'ids'}
                scroll={{x: 2080, y: global._scollY}}
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

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'teamSum/fetch',
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
        subName: fieldsValue.subName,
        teamName: fieldsValue.teamName
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'teamSum/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'teamSum/del',
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

export default connect(({app, loading, teamSum}) => ({app, loading, teamSum}))(Index)
