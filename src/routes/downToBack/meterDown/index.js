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
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable,PreFile} from 'components'
import styles from './index.less'
import { getButtons, cleanObject,QiNiuOss, ImageUrl} from 'utils'
import {menuData} from 'common/menu'
import {DOWN_EXPORT} from 'common/urls'
import {createURL} from 'services/app'
const pageButtons = menuData[14].buttons.map(a => a.permission)
const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const info_css = {
  color: '#fa541c'
}
const vType = ['过程计价', '中期结算', '末次结算'];
const testValue = ''
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'


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

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
        }
        // console.log(typeof fieldsValue[prop])
      }
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

  componentWillUnmount() {
    this.upload = null
  }

  handleChange = ({fileList}) => {
    this.setState({fileList})
  }

  render() {
    const {modalVisible, proNames, subNames, form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {previewVisible, previewImage, fileList, progress} = this.state

    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '对下验工计价台账' : updateModalVisible ? "编辑对下验工计价台账" : "新增对下验工计价台账"}
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
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                           disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="分包商名称">
                {form.getFieldDecorator('subcontractorId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.subcontractorId ? selectedValues.subcontractorId : '',
                })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                           disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {subNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="队伍名称">
                {form.getFieldDecorator('teamName', {
                  rules: [{required: true}],
                  initialValue: selectedValues.teamName ? selectedValues.teamName : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入队伍名称'/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同金额">
                {form.getFieldDecorator('contractPrice', {
                  rules: [{required: true}],
                  initialValue: selectedValues.contractPrice ? selectedValues.contractPrice : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入合同金额'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="计价期数">
                {form.getFieldDecorator('valuationPeriod', {
                  rules: [{required: true, message: '请输入期数'}],
                  initialValue: selectedValues.valuationPeriod ? selectedValues.valuationPeriod : testValue,
                })(<Input disabled={checkDetail} placeholder="请输入期数"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="计价日期">
                {form.getFieldDecorator('valuationTime', {
                  rules: [{required: true}],
                  initialValue: selectedValues.valuationTime ? moment(selectedValues.valuationPeriod) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="计价类型">
                {form.getFieldDecorator('valuationType', {
                  rules: [{required: true, message: '请选择计价类型'}],
                  initialValue: selectedValues.valuationType ? selectedValues.valuationType : testValue,
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  <Option value="0">过程结算</Option>
                  <Option value="1">中期结算</Option>
                  <Option value="2">末次结算</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="计价负责人">
                {form.getFieldDecorator('valuationPerson', {
                  rules: [{required: true}],
                  initialValue: selectedValues.valuationPerson ? selectedValues.valuationPerson : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入计价负责人'/>)}
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
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="计价总金额">
                {form.getFieldDecorator('valuationPrice', {
                  rules: [{required: true, message: '请输入计价总金额'}],
                  initialValue: selectedValues.valuationPrice ? selectedValues.valuationPrice : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入计价总金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="扣款">
                {form.getFieldDecorator('valuationPriceReduce', {
                  rules: [{required: true, message: '请输入扣款金额'}],
                  initialValue: selectedValues.valuationPriceReduce ? selectedValues.valuationPriceReduce : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入扣款金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="扣除保质金">
                {form.getFieldDecorator('warranty', {
                  rules: [{required: true, message: '请输入扣除保质金'}],
                  initialValue: selectedValues.warranty ? selectedValues.warranty : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入扣除保质金" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="扣除覆约保质金">
                {form.getFieldDecorator('performanceBond', {
                  rules: [{required: true, message: '请输入预付款'}],
                  initialValue: selectedValues.performanceBond ? selectedValues.performanceBond : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入扣除覆约保质金" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="计日工及补偿费用">
                {form.getFieldDecorator('compensation', {
                  rules: [{required: true, message: '请输入预付款'}],
                  initialValue: selectedValues.compensation ? selectedValues.compensation : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入计日工及补偿费用" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="应支付金额">
                {form.getFieldDecorator('shouldAmount', {
                  rules: [{required: true, message: '请输入应支付金额'}],
                  initialValue: selectedValues.shouldAmount ? selectedValues.shouldAmount : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入应支付金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="已完未计">
                {form.getFieldDecorator('endedPrice', {
                  rules: [{required: true, message: '请输入已完未计'}],
                  initialValue: selectedValues.endedPrice ? selectedValues.endedPrice : testValue,
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入已完未计" addonAfter="元"/>)}
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
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue,
                })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('annexUrl', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.annexUrl ? selectedValues.annexUrl : [],
                })(
                  <Upload.Dragger onChange={this.handleChange}
                                  accept={'image/*'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="picture"
                                  name="files"
                                  disabled={fileList.length > 0}
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
                <PreFile onClose={this.remove} onPreview={this.handlePreview} progress={progress} file={fileList[0]}/>
                <span style={info_css}>备注：中期计价附件（封面、验工计价批复表、汇总表；末次计价附件（公司批复的《劳务结算审批》、结算资料），请以一份PDF格式文件上传</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
        <img alt="中期计价附件" style={{width: '100%'}} src={previewImage}/>
      </Modal>
      </Modal>
    )
  }

  onUpload = (params) => {
    QiNiuOss(params).then(res=>{
      this.upload = res
    })
  }

  onProgress = (e) => {
    //  console.log(Upload.autoUpdateProgress)
    this.setState({progress: parseInt(e.total.percent)})
    // console.log('上传进度', e)
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
    this.setState({fileList: [file]})
    this.props.form.setFieldsValue({annexUrl: [file]});
  }

  remove = (res) => {
    if (res.status == 'done') {
      this.props.form.setFieldsValue({annexUrl: []});
    } else {
      this.upload.unsubscribe()
    }
    this.setState({fileList:[]})
  }
}

@Form.create()
class MeterDown extends Component {

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
      page:1,
      pageSize:10
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
      title: '分包商名称',
      dataIndex: 'subcontractorName',
    },
    {
      title: '队伍名称',
      dataIndex: 'teamName',
    },
    {
      title: '合同金额',
      dataIndex: 'contractPrice',
    },
    {
      title: '计价期数',
      dataIndex: 'valuationPeriod',
      render(val) {
        return <span>{val}</span>;
      },
    },
    {
      title: '计价日期',
      dataIndex: 'valuationTime',
      render(val) {
        return <span>{val?moment(val).format('YYYY/MM/DD'):''}</span>;
      },
    },
    {
      title: '计价类型',
      dataIndex: 'valuationType',
      render(val) {
        return <span>{vType[val]}</span>;
      },
    },
    {
      title: '计价金额（含税）',
      children: [
        {
          title: '计价总金额',
          dataIndex: 'valuationPrice',
          key: 'valuationPrice',
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '扣款',
          dataIndex: 'valuationPriceReduce',
          key: 'aluationPriceReduce',
          render(val) {
            return <span>{val}</span>;
          },
        }, {
          title: '扣除质保金',
          dataIndex: 'warranty',
          key: 'warranty',
        },
        {
          title: '扣除覆约保质金',
          dataIndex: 'performanceBond',
          key: 'performanceBond',
        },
        {
          title: '计日工及补偿费用',
          dataIndex: 'compensation',
          key: 'compensation'
        },
        {
          title: '应支付金额',
          dataIndex: 'shouldAmount',
          key: 'shouldAmount',
          render(val) {
            return <span>{val}</span>;
          },
        }, {
          title: '已完成未计',
          key: 'endedPrice',
        }]
    },
    {
      title: '对下计价率',
      dataIndex: 'underRate',
    },
    {
      title: '计价负责人',
      dataIndex: 'valuationPerson',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (val, record) => {
        if(record.id=='sum'){
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
                <Divider type="vertical"/>
              </Fragment> : null}
            <a href={record.annexUrl} download={'附件'}>下载附件</a>
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    this.getProNames()
    this.getList()
    this.getSubNames()
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
      valuationType: fields.valuationType,
      valuationTime: fields.valuationTime,
      valuationPriceReduce: fields.valuationPriceReduce,
      valuationPrice: fields.valuationPrice,
      valuationPerson: fields.valuationPerson,
      valuationPeriod: fields.valuationPeriod,
      teamName: fields.teamName,
      subcontractorId: fields.subcontractorId,
      subcontractorName: selectedValues.subcontractorName,
      shouldAmount: fields.shouldAmount,
      remark: fields.remark,
      annexUrl: fields.annexUrl,
      contractPrice: fields.contractPrice,
      warranty: fields.warranty,
      compensation: fields.compensation,
      endedPrice: fields.endedPrice
    }


    if (updateModalVisible) {
      dispatch({
        type: 'meterDown/update',
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
        type: 'meterDown/add',
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
      <Form onSubmit={(e) => this.searchList(e)} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商名称">
              {getFieldDecorator('subcontractorName')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="计价类型">
              {getFieldDecorator('valuationType')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">过程结算</Option>
                  <Option value="1">中期结算</Option>
                  <Option value="2">末次结算</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="计价日期">
              {getFieldDecorator('valuationTime')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col style={{flexDirection: 'row', display: 'flex'}} md={12} sm={24}>
            <FormItem label="对下计价率">
              {getFieldDecorator('minUnderRate')(<Input placeholder="请输入" addonAfter={'%'}/>)}
            </FormItem>
            <FormItem style={{marginLeft: 15 + 'px'}} label="至">
              {getFieldDecorator('maxUnderRate')(<Input placeholder="请输入" addonAfter={'%'}/>)}
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
      meterDown: {data, proNames, subNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, pageLoading, selectedValues, checkDetail, updateModalVisible} = this.state;

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
      subNames: subNames
    }
    const exportUrl = createURL(DOWN_EXPORT,{...this.exportParams,...{token:user.token}})

    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="对下验工计价台账">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button href={exportUrl} icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['meterDown/fetch']}
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

  getProNames = (proName = []) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'meterDown/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'meterDown/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e, page = 1, pageSize = 10) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();

      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        subcontractorName: fieldsValue.subcontractorName,
        valuationType: fieldsValue.valuationType,
        valuationTime: fieldsValue.valuationTime,
        minUnderRate: fieldsValue.minUnderRate,
        maxUnderRate: fieldsValue.maxUnderRate
      }

      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'meterDown/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }

  getSubNames = (subName = []) => {
    if (subName.length < 1) {
      this.props.dispatch(
        {
          type: 'meterDown/querySubNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }
}

MeterDown.propTypes = {}

export default connect(({app, rule, loading, meterDown}) => ({app, rule, loading, meterDown}))(MeterDown)
