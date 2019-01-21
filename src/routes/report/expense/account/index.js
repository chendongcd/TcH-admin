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
  DatePicker,
  Modal,
  Upload,
  Divider
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, PreFile, ExportModal} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, QiNiuOss, ImageUrl} from 'utils'
import {menuData} from 'common/menu'
import {METER_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const pageButtons = menuData[8].buttons.map(a => a.permission)
const info_css = {
  color: '#fa541c'
}
const testValue = ''
const plainOptions = [
  {label: '预付款', value: '1'},
  {label: '计价金额', value: '2'},
  {label: '实际支付', value: '3'},
  {label: '资金拨付情况', value: '4'},
  {label: '其它计价', value: '5'},
  {label: '产值计价率', value: '6'}
]
const qiShu = []
for (let i = 1; i < 201; i++) {
  qiShu.push(<Option key={i} value={i}>{'第' + (i) + '期'}</Option>);
}

@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      progress: 0
    };
    this.upload = null
  }

  componentDidMount() {
  }

  componentDidUpdate(preProp, preState) {
    if (!preProp.selectedValues.annexUrl && this.props.selectedValues.annexUrl && this.state.fileList.length == 0) {
      let pdf = JSON.parse(this.props.selectedValues.annexUrl)
      let file = {
        uid: '-1',
        name: pdf.fileName,
        status: 'done',
        url: pdf.url,
      }
      this.setState({fileList: [file]})
    }
  }

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.meteringTime = fieldsValue.meteringTime.format('YYYY-MM-DD')
      fieldsValue.annexUrl = `{"url":"${this.state.fileList[0].url}","fileName":"${this.state.fileList[0].name}"}`
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  cleanState = () => {
    this.setState({fileList: [], previewImage: ''})
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  componentWillUnmount() {
    this.upload = null
  }

  handleChange = ({fileList}) => {
    this.setState({fileList})
  }

  render() {
    const {proNames, modalVisible, loading, form, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '对上计量台账' : updateModalVisible ? "编辑对上计量台账" : "新增对上计量台账"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
        okButtonProps={{loading: loading}}
        maskClosable={false}
        onOk={() => checkDetail ? handleCheckDetail() : this.okHandle()}
        onCancel={() => {
          this.cleanState()
          checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()
        }
        }
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                           disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程类别">
                {form.getFieldDecorator('projectType', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectType ? selectedValues.projectType : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同编码">
                {form.getFieldDecorator('projectCode', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectCode ? selectedValues.projectCode : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="分包商名称">
                {form.getFieldDecorator('subcontractorName', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.subcontractorName ? selectedValues.subcontractorName : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="队伍名称">
                {form.getFieldDecorator('teamName', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.teamName ? selectedValues.teamName : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="合同签订人">
                {form.getFieldDecorator('signPerson', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.signPerson ? selectedValues.signPerson : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="填报日期">
                {form.getFieldDecorator('tianbaoTime', {
                  rules: [{required: true, message: '请填报日期'}],
                  initialValue: selectedValues.tianbaoTime? moment(selectedValues.tianbaoTime).format('YYYY-MM-DD') : null,
                })(<DatePicker style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>已计价金额</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同内计量">
                {form.getFieldDecorator('prepaymentAmount', {
                  rules: [{required: true, message: '请输入合同内计量'}],
                  initialValue: selectedValues.prepaymentAmount ? selectedValues.prepaymentAmount : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入合同内计量"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>计日工</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="机械台班">
                {form.getFieldDecorator('valuationAmountTax', {
                  rules: [{required: true, message: '请输入机械台班'}],
                  initialValue: selectedValues.valuationAmountTax ? selectedValues.valuationAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="零星用功">
                {form.getFieldDecorator('tax', {
                  rules: [{required: true, message: '请输入零星用功'}],
                  initialValue: selectedValues.tax ? selectedValues.tax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入零星用功" addonAfter={'元'}/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="小计">
                {form.getFieldDecorator('tax', {
                  rules: [{required: true, message: '请输入零星用功'}],
                  initialValue: selectedValues.tax ? selectedValues.tax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入零星用功" addonAfter={'元'}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>合同外补偿/赔偿</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="进出场">
                {form.getFieldDecorator('realAmountTax', {
                  rules: [{required: true, message: '请输入进出场'}],
                  initialValue: selectedValues.realAmountTax ? selectedValues.realAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="灾损">
                {form.getFieldDecorator('realAmountTax1', {
                  initialValue: selectedValues.realAmountTax ? selectedValues.realAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="窝工/停工">
                {form.getFieldDecorator('realAmountTax2', {
                  initialValue: selectedValues.realAmountTax ? selectedValues.realAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}}  addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="其他">
                {form.getFieldDecorator('realAmountTax4', {
                  initialValue: selectedValues.realAmountTax ? selectedValues.realAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="小计">
                {form.getFieldDecorator('realAmountTax5', {
                  initialValue: selectedValues.realAmountTax ? selectedValues.realAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同">
                {form.getFieldDecorator('realAmountTax6', {
                  rules: [{required: true, message: '请输入进出场'}],
                  initialValue: selectedValues.realAmountTax ? selectedValues.realAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

  onUpload = (params) => {
    QiNiuOss(params).then(res => {
      this.upload = res
    })
  }

  onProgress = (e) => {
    this.setState({progress: parseInt(e.total.percent)})
  }

  onError = (error) => {
    console.log('上传失败', error)
  }

  onSuccess = (res) => {
    //this.state.fileList.push(ImageUrl+res.key)
    let file = {
      uid: '-1',
      name: this.state.fileList[0].name,
      status: 'done',
      url: ImageUrl + res.key,
    }
    //  console.log(file)

    this.setState({fileList: [file]})
    this.props.form.setFieldsValue({annexUrl: [file]});
  }

  remove = (res) => {
    if (res.status == 'done') {
      this.props.form.setFieldsValue({annexUrl: []});
    } else {
      if (this.upload && this.upload.unsubscribe) {
        this.upload.unsubscribe()
      }
    }
    this.setState({fileList: []})
  }
}

@Form.create()
class Account extends Component {

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
      dataIndex: 'id',
    },
    {
      title: '项目编码',
      dataIndex: 'projectCode',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '工程类别',
      dataIndex: 'projectType'
    },
    {
      title: '合同编码',
      dataIndex: 'contractCode'
    },
    {
      title: '分包商名称',
      dataIndex: 'subcontractorName',
    },
    {
      title: '队伍名称',
      dataIndex: 'teamName'
    },
    {
      title: '合同签订人',
      dataIndex: 'signName'
    },
    {
      title: '填报日期',
      dataIndex: 'tianbaoTime',
      render(val) {
        return <span>{val ? moment(val).format('YYYY/MM') : ''}</span>;
      }
    },
    {
      title: '已计价金额（元）',
      children: [
        {
          title: '合同内计量',
          dataIndex: 'hetongneijilaing',
          key: 'hetongneijiliang',
        },
        {
          title: '计日工',
          key: 'jirigong',
          children: [{
            title: '机械台班',
            dataIndex: 'jixietaiban',
            key: 'jixietaiban',
          }, {
            title: '零星用工',
            dataIndex: 'jixietaiban1',
            key: 'jixietaiban',
          }, {
            title: '小计',
            dataIndex: 'jixietaiban1',
            key: 'jixietaiban1',
          },]
        },
        {
          title: '合同外补偿',
          key: 'hetongwaibuc',
          children: [{
            title: '进出场',
            dataIndex: 'jinchuc1',
            key: 'jinchuc1',
          }, {
            title: '灾损',
            dataIndex: 'jinchuc2',
            key: 'jinchuc2',
          }, {
            title: '窝工/停工',
            dataIndex: 'jinchuc3',
            key: 'jinchuc3',
          }, , {
            title: '其他',
            dataIndex: 'jinchuc4',
            key: 'jinchuc4',
          }, {
            title: '小计',
            dataIndex: 'jinchuc5',
            key: 'jinchuc5',
          },]
        },
        {
          title: '合计',
          dataIndex: 'heji',
          key: 'heji',
        },
      ]
    },
    {
      title: '计日工占已计价金额比例（%）',
      dataIndex: 'jirigongbilio'
    },
    {
      title: '合同外补偿/赔偿占已计价金额比例（%）',
      dataIndex: 'jirigongbilio1'
    },
    {
      title: '计日工及补偿已拨付金额（元）',
      dataIndex: 'jirigongbilio2'
    },
    {
      title: '计日工及补偿已拨付金额拨付率（%）',
      dataIndex: 'jirigongbilio3'
    },
    {
      title: '是否报审',
      dataIndex: 'jirigongbilio4'
    },
    {
      title: '是否结算',
      dataIndex: 'jirigongbilio5'
    },
  ];

  componentDidMount() {
    if (this.props.app.user.token) {
      // this.getProNames([])
      // this.getList()
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
      meteringNum: fields.meteringNum,
      meteringTime: fields.meteringTime,
      prepaymentAmount: fields.prepaymentAmount,
      valuationAmountTax: fields.valuationAmountTax,
      tax: fields.tax,
      realAmountTax: fields.realAmountTax,
      alreadyPaidAmount: fields.alreadyPaidAmount,
      extraAmount: fields.extraAmount,
      notCalculatedAmount: fields.notCalculatedAmount,
      remark: fields.remark,
      annexUrl: fields.annexUrl
    }
    if (updateModalVisible) {
      dispatch({
        type: 'meterUp/update',
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
        type: 'meterUp/add',
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
              {getFieldDecorator('projectName', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="计量日期">
              {getFieldDecorator('meteringTime', {
                initialValue: null
              })(
                <DatePicker.MonthPicker style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col style={{flexDirection: 'row', display: 'flex'}} md={12} sm={24}>
            <FormItem label="拨付率">
              {getFieldDecorator('minPayProportion', {
                initialValue: null
              })(<Input placeholder="请输入" addonAfter={'%'}/>)}
            </FormItem>
            <FormItem style={{marginLeft: 15 + 'px'}} label="至">
              {getFieldDecorator('maxPayProportion', {
                initialValue: null
              })(<Input placeholder="请输入" addonAfter={'%'}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col style={{flexDirection: 'row', display: 'flex'}} md={12} sm={24}>
            <FormItem label="产值计价率">
              {getFieldDecorator('minProductionValue', {
                initialValue: null
              })(<Input placeholder="请输入" addonAfter={'%'}/>)}
            </FormItem>
            <FormItem style={{marginLeft: 15 + 'px'}} label="至">
              {getFieldDecorator('maxProductionValue', {
                initialValue: null
              })(<Input placeholder="请输入" addonAfter={'%'}/>)}
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

  render() {
    const {
      expenseAccount: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, exportModalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

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
      proNames: proNames,
      loading: loading.effects[`meterUp/${updateModalVisible ? 'update' : 'add'}`]
    }
    const exportUrl = createURL(METER_EXPORT, {
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
        <PageHeaderWrapper title="对上计量台账">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button onClick={() => this.handleExportModalVisible(true)} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['meterUp/fetch']}
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
          <ExportModal {...exportProps}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'meterUp/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'meterUp/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e, page = 1, pageSize = 10) => {
    e && e.preventDefault ? e.preventDefault() : null
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let time = fieldsValue.meteringTime ? fieldsValue.meteringTime.format('YYYY-MM') : null
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        minPayProportion: fieldsValue.minPayProportion ? fieldsValue.minPayProportion / 100 : '',
        maxPayProportion: fieldsValue.maxPayProportion ? fieldsValue.maxPayProportion / 100 : '',
        minProductionValue: fieldsValue.minProductionValue ? fieldsValue.minProductionValue / 100 : '',
        maxProductionValue: fieldsValue.maxProductionValue ? fieldsValue.maxProductionValue / 100 : '',
        meteringTime: time
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'meterUp/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

Account.propTypes = {}

export default connect(({app, loading, expenseAccount}) => ({app, loading, expenseAccount}))(Account)
