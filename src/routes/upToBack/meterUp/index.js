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
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut, getButtons, cleanObject, QiNiuOss,ImageUrl} from 'utils'
import {menuData} from 'common/menu'

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
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'
// {
//   uid: '-1',
//     name: 'xxx.png',
//   status: 'done',
//   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
// }
@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
  }

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;

    form.validateFields((err, fieldsValue) => {
      //return
      if (err) return;
      fieldsValue.annexUrl = testPDF
      fieldsValue.meteringTime = fieldsValue.meteringTime.format('YYYY-MM-DD')
      console.log(fieldsValue)
      //return
      // form.resetFields();
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({fileList}) => {
    console.log(fileList)
   // this.setState({ fileList })
  }

  render() {
    const {proNames, modalVisible, form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {previewVisible, previewImage, fileList} = this.state
    console.log(proNames)

    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '对上计量台账' : updateModalVisible ? "编辑对上计量台账" : "新增对上计量台账"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
        maskClosable={false}
        onOk={this.okHandle}
        onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
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
                  rules: [{required: true, message: '请输入期数'}],
                  initialValue: selectedValues.meteringNum ? selectedValues.meteringNum : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入期数"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="计量日期">
                {form.getFieldDecorator('meteringTime', {
                  rules: [{required: true}],
                  initialValue: selectedValues.meteringTime ? moment(selectedValues.meteringTime) : null,
                })(<DatePicker className={styles.customSelect} disabled={checkDetail} style={{width: '100%'}}
                               placeholder="请选择量日期"/>)}
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
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入税率"/>)}
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
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="已支付金额">
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
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="超计价金额">
                {form.getFieldDecorator('extraAmount', {
                  rules: [{required: true, message: '请输入超计价金额'}],
                  initialValue: selectedValues.extraAmount ? selectedValues.extraAmount : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入超计价金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="已完未计价金额">
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
                  rules: [{required: true}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem className="clearfix" style={{marginLeft: 13 + 'px'}} labelCol={{span: 4}}
                        wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('annexUrl', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  fileList: fileList
                  //initialValue: selectedValues.annexUrl ? selectedValues.annexUrl : 'https://images.unsplash.com/photo-1543364195-bfe6e4932397?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                })(
                  <Upload.Dragger onPreview={this.handlePreview}
                                  onChange={this.handleChange}
                                 // fileList= {fileList}
                                  listType="picture-card"
                                  name="files"
                                  disabled={fileList.length>0}
                                  onSuccess={this.onSuccess}
                                  onError={this.onError}
                                  onProgress={this.onProgress}
                                  customRequest={QiNiuOss}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <span style={info_css}>备注：请以一份PDF格式文件上传封面和汇总表</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </Modal>
    );
  }

  onProgress = (e) => {
    console.log('上传进度', e)
  }

  onError = (error) => {
    console.log('上传失败', error)
  }

  onSuccess = (res) => {
    console.log('上传成功', res)
    //this.state.fileList.push(ImageUrl+res.key)
    let file = {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: ImageUrl+res.key,
    }
    console.log(ImageUrl+res.key)
    //this.setState({fileList:[file]})
    this.props.form.setFieldsValue({annexUrl: [file]});
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
      checkDetail: false
    }
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'code',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '计量期数',
      dataIndex: 'meteringNum',
    },
    {
      title: '计量日期',
      dataIndex: 'meteringTime',
      render(val) {
        return <span>{moment(val).format('YYYY/MM/DD')}</span>;
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
          key: 'payProportion'
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
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      render: (val, record) => {
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ? <a onClick={() => this.handleCheckDetail(true, record)}>查看</a> : null}
            <Divider type="vertical"/>
            <a href={record.annexUrl} download="fujian">下载附件</a>
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    this.getProNames([])
    this.getList()
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
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

  handleAdd = (fields, updateModalVisible, selectedValues) => {
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
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
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
    console.log('Upload event:', e);
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
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

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
      proNames: proNames
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
                  <Button icon="plus" type="primary">
                    导出
                  </Button> : null}
                {/* {selectedRows.length > 0 && (
                  <span>
                  <Dropdown overlay={menu}>
                    <Button>
                     操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
                )}*/}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['meterUp/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: '200%'}}
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
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let time = fieldsValue.meteringTime ? fieldsValue.meteringTime.format('YYYY-MM-DD') : null
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        minPayProportion: fieldsValue.minPayProportion,
        maxPayProportion: fieldsValue.maxPayProportion,
        minProductionValue: fieldsValue.minProductionValue,
        maxProductionValue: fieldsValue.maxProductionValue,
        meteringTime: time
      }
      cleanObject(payload)
      //  form.resetFields();
      this.props.dispatch({
        type: 'meterUp/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

MeterUp.propTypes = {}

export default connect(({app, rule, loading, meterUp}) => ({app, rule, loading, meterUp}))(MeterUp)
