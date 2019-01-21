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
    const {proNames, modalVisible, loading, form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {previewVisible, previewImage, fileList, progress} = this.state
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
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目名称">
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
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="计量期数">
                {form.getFieldDecorator('meteringNum', {
                  rules: [{required: true, message: '请选择期数'}],
                  initialValue: selectedValues.meteringNum ? ('第' + selectedValues.meteringNum + '期') : testValue,
                })(<Select className={styles.customSelect}
                           disabled={checkDetail} placeholder="请选择期数"
                           style={{width: '100%'}}>
                  {qiShu}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="计量日期">
                {form.getFieldDecorator('meteringTime', {
                  rules: [{required: true, message: '请选择计量日期'}],
                  initialValue: selectedValues.meteringTime ? moment(selectedValues.meteringTime) : null,
                })(<DatePicker.MonthPicker className={styles.customSelect} disabled={checkDetail}
                                           style={{width: '100%'}}
                                           placeholder="请选择计量日期"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>预付款金额</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="预付款">
                {form.getFieldDecorator('prepaymentAmount', {
                  rules: [{required: true, message: '请输入预付款'}],
                  initialValue: selectedValues.prepaymentAmount ? selectedValues.prepaymentAmount : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入预付款" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>计价金额</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="含税金额">
                {form.getFieldDecorator('valuationAmountTax', {
                  rules: [{required: true, message: '请输入含税金额'}],
                  initialValue: selectedValues.valuationAmountTax ? selectedValues.valuationAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="税率">
                {form.getFieldDecorator('tax', {
                  rules: [{required: true, message: '请输入税率'}],
                  initialValue: selectedValues.tax ? selectedValues.tax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入税率" addonAfter={'%'}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>实际应支付金额</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="含税金额">
                {form.getFieldDecorator('realAmountTax', {
                  rules: [{required: true, message: '请输入含税金额'}],
                  initialValue: selectedValues.realAmountTax ? selectedValues.realAmountTax : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>

        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>资金拨付情况</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="已支付金额">
                {form.getFieldDecorator('alreadyPaidAmount', {
                  rules: [{required: true, message: '请输入已支付金额'}],
                  initialValue: selectedValues.alreadyPaidAmount ? selectedValues.alreadyPaidAmount : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入已支付金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col style={{paddingTop: 11 + 'px'}} md={8} sm={24}>
              <span style={info_css}>备注：不含预付款金额</span>
            </Col>
          </Row>
        </div>

        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>其他计价</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="超计价金额">
                {form.getFieldDecorator('extraAmount', {
                  rules: [{required: true, message: '请输入超计价金额'}],
                  initialValue: selectedValues.extraAmount ? selectedValues.extraAmount : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入超计价金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="已完未计价金额">
                {form.getFieldDecorator('notCalculatedAmount', {
                  rules: [{required: true, message: '请输入已完未计价金额'}],
                  initialValue: selectedValues.notCalculatedAmount ? selectedValues.notCalculatedAmount : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入已完未计价金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
        </div>

        <Row align={'middle'} gutter={0} className={styles.titleView}>
          <div className={styles.title}>其他</div>
        </Row>
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 12 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: true, message: '请输入备注'}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 15 + 'px'}} labelCol={{span: 2}}
                        wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('annexUrl', {
                  rules: [{required: true, message: '请上传附件'}],
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.annexUrl ? [selectedValues.annexUrl] : [],
                })(
                  <Upload.Dragger
                    onChange={this.handleChange}
                    accept={'.pdf'}
                    showUploadList={false}
                    // fileList={fileList}
                    listType="picture"
                    name="files"
                    disabled={fileList.length > 0 || checkDetail}
                    onSuccess={this.onSuccess}
                    handleManualRemove={this.remove}
                    onError={this.onError}
                    onProgress={this.onProgress}
                    customRequest={this.onUpload}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile disabled={checkDetail} onClose={this.remove} onPreview={this.handlePreview} progress={progress}
                         file={fileList[0]}/>
                <span style={info_css}>备注：请以一份PDF格式文件上传封面、汇总表、清单计量表</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Modal width={643} style={{width: 643, height: 940}} bodyStyle={{width: 643, height: 940}}
               visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <iframe style={{width: 595, height: 892}} frameBorder={0} src={previewImage}/>
        </Modal>
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
class MeterUp extends Component {

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
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '计量期数',
      dataIndex: 'meteringNum',
      render: (val) => {
        return <span>{val !== undefined ? ('第' + val + '期') : ''}</span>
      }
    },
    {
      title: '计量日期',
      dataIndex: 'meteringTime',
      render(val) {
        return <span>{val ? moment(val).format('YYYY/MM') : ''}</span>;
      },
    },
    {
      title: '预付款（元）',
      dataIndex: 'prepaymentAmount',
    },
    {
      title: '计价金额（元）',
      children: [{
        title: '含税',
        dataIndex: 'valuationAmountTax',
        key: 'valuationAmountTax'
      },
        {
          title: '税率（%）',
          dataIndex: 'tax',
          key: 'tax'
        }, {
          title: '不含税',
          dataIndex: 'valuationAmountNotTax',
          key: 'valuationAmountNotTax',
        }]
    },
    {
      title: '实际应付金额（元）',
      children: [{
        title: '含税',
        dataIndex: 'realAmountTax',
        key: 'realAmountTax',
      }, {
        title: '不含税',
        dataIndex: 'realAmount',
        key: 'realAmount',
      }]
    },
    {
      title: '资金拨付情况（元）',
      children: [{
        title: '已支付金额',
        dataIndex: 'alreadyPaidAmount',
        key: 'alreadyPaidAmount'
      },
        {
          title: '未支付金额',
          dataIndex: 'unpaidAmount',
          key: 'unpaidAmount',
        }, {
          title: '拨付率',
          dataIndex: 'payProportion',
          key: 'payProportion',
          render(val) {
            return <span>{val * 100 + '%'}</span>;
          }
        }]
    },
    {
      title: '其他计价（元）',
      children: [{
        title: '超计价',
        dataIndex: 'extraAmount',
        key: 'extraAmount',
      },
        {
          title: '已完未计',
          dataIndex: 'notCalculatedAmount',
          key: 'notCalculatedAmount',
        }]
    },
    {
      title: '产值计价率',
      dataIndex: 'productionValue',
      render(val) {
        return <span>{val * 100 + '%'}</span>;
      }
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      render: (val, record) => {
        if (record.id === '合计:') {
          return null
        }
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        let annex = JSON.parse(record.annexUrl)
        let href = annex.url + '?attname=' + annex.fileName
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ? <a onClick={() => this.handleCheckDetail(true, record)}>查看</a> : null}
            <Divider type="vertical"/>
            <a href={href} download="附件">下载附件</a>
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
    this.searchList(null,pagination.current, pagination.pageSize)
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

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const {
      meterUp: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, exportModalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
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
                scroll={{x: '200%', y: global._scollY}}
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
    e&&e.preventDefault?e.preventDefault():null
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

MeterUp.propTypes = {}

export default connect(({app, loading, meterUp}) => ({app, loading, meterUp}))(MeterUp)
