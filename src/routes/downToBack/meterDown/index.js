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
  Divider, Popconfirm,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, PreFile} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, QiNiuOss, ImageUrl, getPage, fixNumber} from 'utils'
import {DOWN_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const pageButtons = getPage('62').buttons.map(a => a.permission)
const FormItem = Form.Item;
const {Option} = Select;
const info_css = {
  color: '#fa541c'
}
const vType = ['', '中期计价', '末次结算'];
const testValue = ''
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
      progress: 0,
      selects: {}
    };
    this.upload = null
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
      if (updateModalVisible && (typeof fieldsValue.valuationPeriod) === 'string' && fieldsValue.valuationPeriod.includes('第')) {
        fieldsValue.valuationPeriod = fieldsValue.valuationPeriod.slice(1, -1)
      }
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
        }
      }
      if (selectedValues.subcontractorId&&!fieldsValue.subcontractorId) {
        fieldsValue.subcontractorId = selectedValues.subcontractorId
      }
      if(selectedValues.laborAccountId&&!fieldsValue.laborAccountId){
        fieldsValue.laborAccountId = selectedValues.laborAccountId
      }
      fieldsValue.annexUrl = `{"url":"${this.state.fileList[0].url}","fileName":"${this.state.fileList[0].name}"}`
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  cleanState = () => {
    this.setState({fileList: [], previewImage: '', selects: {}})
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

  handleAmount = (value, type) => {
    let {form, getSubNames, getTeamList, getAmount} = this.props
    let res = form.getFieldsValue(['projectId', 'subcontractorId', 'laborAccountId'])
    let selects = this.state.selects
    if (type === 0) {
      if (selects.projectId != value) {
        if (selects.projectId) {
          form.setFieldsValue({'subcontractorId': '', 'laborAccountId': '', 'contractPrice': ''})
        }
        this.setState({selects: {projectId: value}})
        getSubNames({projectId: value})
        return
      }
      return
    } else if (type === 1) {
      if (selects.subcontractorId != value) {
        if (selects.subcontractorId) {
          form.setFieldsValue({'laborAccountId': '', 'contractPrice': ''})
        }
        this.setState({selects: {projectId: res.projectId, subcontractorId: value}})
        getTeamList({projectId: res.projectId, subcontractorId: value})
        return
      }
      return
    } else {
      res.laborAccountId = value.props.name
    }
    this.setState({selects: res})
    if (res.projectId && res.subcontractorId && res.laborAccountId) {
      let payload = {projectId: res.projectId, subcontractorId: res.subcontractorId, teamName: res.laborAccountId}
      getAmount(payload, this.setAmount)
    }
  }

  shouldPay = (value, type) => {
    let form = this.props.form
    let res = form.getFieldsValue(['valuationPrice', 'valuationPriceReduce', 'warranty', 'performanceBond', 'shouldAmount'])
    let arr = [res.valuationPrice, res.valuationPriceReduce, res.warranty, res.performanceBond]
    arr[type - 1] = value
    // return
    let test = (i) => {
      return ((typeof i === 'number') || (typeof Number(i)) === 'number' && i.length > 0)
    }
    if (arr.every(test)) {
      let pay = arr[0] - arr[1] - arr[2] - arr[3]
      form.setFieldsValue({shouldAmount: Number.isInteger(pay) ? pay : pay.toFixed(2)})
    } else if (res.shouldAmount || res.shouldAmount === 0) {
      form.setFieldsValue({shouldAmount: ''})
    }
  }

  setAmount = (value) => {
    this.props.form.setFieldsValue({contractPrice: value})

  }

  render() {
    const {modalVisible, loading, proNames, teamList, teamLoading, subNames, subLoading, form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    let {previewVisible, previewImage, fileList, progress, selects} = this.state
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '对下验工计价台账' : updateModalVisible ? "编辑对下验工计价台账" : "新增对下验工计价台账"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={1100}
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
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect}
                           onSelect={(value) => this.handleAmount(value, 0)}
                           showSearch={true} optionFilterProp={'name'}
                           disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="分包商名称">
                {form.getFieldDecorator('subcontractorId', {
                  rules: [{required: true, message: '请选择分包商名称'}],
                  initialValue: selectedValues.subcontractorName ? selectedValues.subcontractorName : '',
                })(<Select className={styles.customSelect} onSelect={(value) => this.handleAmount(value, 1)}
                           showSearch={true}
                           loading={subLoading}
                           optionFilterProp={'name'}
                           disabled={checkDetail || !selects.projectId} placeholder="请选择"
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
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="队伍名称">
                {form.getFieldDecorator('laborAccountId', {
                  rules: [{required: true, message: '请选择队伍名称'}],
                  initialValue: selectedValues.teamName ? selectedValues.teamName : '',
                })(<Select className={styles.customSelect}
                           onSelect={(value, option) => this.handleAmount(option, 2)}
                           showSearch={true}
                           optionFilterProp={'name'}
                           loading={teamLoading}
                           disabled={checkDetail || !selects.subcontractorId} placeholder="请选择队伍名称"
                           style={{width: '100%'}}>
                  {teamList.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.teamName}
                                   value={item.id}>{item.teamName}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="合同金额">
                {form.getFieldDecorator('contractPrice', {
                  rules: [{required: true, message: '请选择项目、分包商和队伍'}],
                  initialValue: selectedValues.sumContractAmount ? selectedValues.sumContractAmount : '',
                })(<Input disabled={true} placeholder='选择项目、分包商和队伍后自动带出' addonAfter={'元'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="计价期数">
                {form.getFieldDecorator('valuationPeriod', {
                  rules: [{required: true, message: '请选择期数'}],
                  initialValue: selectedValues.valuationPeriod ? ('第' + selectedValues.valuationPeriod + '期') : '',
                })(<Select className={styles.customSelect}
                           disabled={checkDetail}
                           placeholder="请选择期数"
                           style={{width: '100%'}}>
                  {qiShu}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="计价日期">
                {form.getFieldDecorator('valuationTime', {
                  rules: [{required: true, message: '请选择日期'}],
                  initialValue: selectedValues.valuationTime ? moment(selectedValues.valuationTime) : null,
                })(<DatePicker.MonthPicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="计价类型">
                {form.getFieldDecorator('valuationType', {
                  rules: [{required: true, message: '请选择计价类型'}],
                  initialValue: selectedValues.valuationType ? selectedValues.valuationType : '',
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  <Option value={1}>中期计价</Option>
                  <Option value={2}>末次结算</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="计价负责人">
                {form.getFieldDecorator('valuationPerson', {
                  rules: [{required: true, message: '请输入计价负责人'}],
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
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="计价总金额">
                {form.getFieldDecorator('valuationPrice', {
                  rules: [{required: true, message: '请输入计价总金额'}],
                  initialValue: global._checkNum(selectedValues.valuationPrice),
                })(<Input onChange={(e) => this.shouldPay(e.target.value, 1)} disabled={checkDetail}
                          style={{marginTop: 4}} placeholder="请输入计价总金额" addonAfter="元"/>)}
                <span style={info_css}>备注:填报未扣款的合同内外计价总金额</span>
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="扣款">
                {form.getFieldDecorator('valuationPriceReduce', {
                  rules: [{required: true, message: '请输入扣款金额'}],
                  initialValue: global._checkNum(selectedValues.valuationPriceReduce),
                })(<Input onChange={(e) => this.shouldPay(e.target.value, 2)} disabled={checkDetail}
                          style={{marginTop: 4}} placeholder="请输入扣款金额" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="扣除质保金">
                {form.getFieldDecorator('warranty', {
                  rules: [{required: true, message: '请输入扣除质保金'}],
                  initialValue: global._checkNum(selectedValues.warranty),
                })(<Input onChange={(e) => this.shouldPay(e.target.value, 3)} disabled={checkDetail}
                          style={{marginTop: 4}} placeholder="请输入扣除质保金" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="扣除履约保证金">
                {form.getFieldDecorator('performanceBond', {
                  rules: [{required: true, message: '请输入扣除履约保证金'}],
                  initialValue: global._checkNum(selectedValues.performanceBond),
                })(<Input onChange={(e) => this.shouldPay(e.target.value, 4)} disabled={checkDetail}
                          style={{marginTop: 4}} placeholder="请输入扣除履约保证金" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="计日工及补偿费用">
                {form.getFieldDecorator('compensation', {
                  rules: [{required: true, message: '请输入计日工及补偿费用'}],
                  initialValue: global._checkNum(selectedValues.compensation),
                })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入计日工及补偿费用" addonAfter="元"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="应支付金额">
                {form.getFieldDecorator('shouldAmount', {
                  rules: [{required: true, message: '请输入以上金额'}],
                  initialValue: global._checkNum(selectedValues.shouldAmount),
                })(<Input disabled={true} style={{marginTop: 4}} placeholder="输入以上计价金额自动带出" addonAfter="元"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="已完未计">
                {form.getFieldDecorator('endedPrice', {
                  rules: [{required: true, message: '请输入已完未计'}],
                  initialValue: global._checkNum(selectedValues.endedPrice),
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
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('annexUrl', {
                  rules: [{required: true, message: '请上传附件'}],
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.annexUrl ? [selectedValues.annexUrl] : [],
                })(
                  <Upload.Dragger onChange={this.handleChange}
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
                <span style={info_css}>备注：中期计价附件（封面、当期验工计价结算单、验工计价批复表、汇总表）；</span>
                <span style={info_css}>末次计价附件（公司批复的《劳务结算审批》、结算资料），当期计价合同外费用需上传支撑凭证,请以一份PDF格式文件上传</span>
              </FormItem>
            </Col>
          </Row>
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
        </div>
        <Modal width={'100%'} style={{width: '100%', height: '100%', top: 0}}
               bodyStyle={{width: '100%', height: 900, paddingTop: 50}}
               visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <iframe width={'100%'} height={'100%'} frameBorder={0} src={previewImage}/>
        </Modal>
      </Modal>
    )
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
      title: '分包商名称',
      width: 180,
      dataIndex: 'subcontractorName',
    },
    {
      title: '队伍名称',
      width: 150,
      dataIndex: 'teamName',
    },
    {
      title: '合同金额',
      width: 130,
      dataIndex: 'sumContractAmount',
    },
    {
      title: '计价期数',
      dataIndex: 'valuationPeriod',
      width: 130,
      render(val) {
        return <span>{val !== undefined ? ('第' + val + '期') : ''}</span>;
      },
    },
    {
      title: '计价日期',
      dataIndex: 'valuationTime',
      width: 130,
      render(val) {
        return <span>{val ? moment(val).format('YYYY/MM') : ''}</span>;
      },
    },
    {
      title: '计价类型',
      dataIndex: 'valuationType',
      width: 110,
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
          width: 150,
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '扣款',
          dataIndex: 'valuationPriceReduce',
          key: 'valuationPriceReduce',
          width: 120,
          render(val) {
            return <span>{val}</span>;
          },
        }, {
          title: '扣除质保金',
          width: 120,
          dataIndex: 'warranty',
          key: 'warranty',
        },
        {
          title: '扣除履约保证金',
          width: 120,
          dataIndex: 'performanceBond',
          key: 'performanceBond',
        },
        {
          title: '计日工及补偿费用',
          width: 120,
          dataIndex: 'compensation',
          key: 'compensation'
        },
        {
          title: '应支付金额',
          dataIndex: 'shouldAmount',
          key: 'shouldAmount',
          width: 120,
          render(val) {
            return <span>{val}</span>;
          },
        }, {
          title: '已完成未计',
          dataIndex: 'endedPrice',
          key: 'endedPrice',
          width: 120,
        }]
    },
    {
      title: '对下计价率(%)',
      dataIndex: 'underRate',
      width: 110,
      render: (val) => {
        return <span>{fixNumber(val, 100) + '%'}</span>
      }
    },
    {
      title: '计价负责人',
      width: 110,
      dataIndex: 'valuationPerson',
    },
    {
      title: '备注',
      width: 180,
      dataIndex: 'remark',
    },
    {
      title: '下载附件',
      dataIndex: 'annexUrl',
      width: 100,
      render: (val) => {
        //if(JSON.parse(record.annexUrl))
        function isJSON(str) {
          if (typeof str == 'string') {
            try {
              var obj = JSON.parse(str);
              if (str.indexOf('{') > -1) {
                return true;
              } else {
                return false;
              }
            } catch (e) {
              return false;
            }
          }
          return false;
        }

        let href = ''
        if (isJSON(val)) {
          let annex = JSON.parse(val)
          href = annex.url + '?attname=' + annex.fileName
        } else {
          href = val
        }
        return (
          <Fragment>
            <a href={href} download={'附件'}>下载附件</a>
          </Fragment>
        )
      }
    },
    {
      title: '操作',
      width: 170,
      //  fixed: 'right',
      render: (val, record) => {
        if (record.ids === '合计:') {
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
              </Fragment> : null}
            {getButtons(button, pageButtons[2]) ?
              <Fragment>
                <Divider type="vertical"/>
                <a onClick={() => this.handleCheckDetail(true, record)}>查看</a>
              </Fragment> : null}
            {getButtons(button, pageButtons[4]) ?
              <Fragment>
                <Divider type="vertical"/>
                <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.id)} okText="是" cancelText="否">
                  <a>删除</a>
                </Popconfirm>
              </Fragment>
              : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    this.getProNames()
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
        type: 'meterDown/update',
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
        type: 'meterDown/add',
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
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商名称">
              {getFieldDecorator('subcontractorName')(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="计价类型">
              {getFieldDecorator('valuationType')(
                <Select style={{width: '100%'}}>
                  <Option value="1">中期计价</Option>
                  <Option value="2">末次结算</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="计价日期">
              {getFieldDecorator('valuationTime')(
                <DatePicker.MonthPicker style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col style={{flexDirection: 'row', display: 'flex'}} md={12} sm={24}>
            <FormItem label="对下计价率">
              {getFieldDecorator('minUnderRate')(<Input addonAfter={'%'}/>)}
            </FormItem>
            <FormItem style={{marginLeft: 15 + 'px'}} label="至">
              {getFieldDecorator('maxUnderRate')(<Input addonAfter={'%'}/>)}
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
      meterDown: {data, proNames, subNames, teamList, sumContractAmount},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, pageLoading, selectedValues, checkDetail, updateModalVisible} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      getAmount: this.getAmount,
      getSubNames: this.getSubNames,
      getTeamList: this.getTeamList
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      subNames: subNames,
      teamList: teamList,
      loading: loading.effects[`meterDown/${updateModalVisible ? 'update' : 'add'}`],
      subLoading: loading.effects['meterDown/querySubNames'],
      teamLoading: loading.effects['meterDown/queryTeams'],
      amountLoading: loading.effects['meterDown/queryAmount'],
      sumContractAmount: sumContractAmount
    }
    const exportUrl = createURL(DOWN_EXPORT, {...this.exportParams, ...{token: user.token}})

    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper>
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
                loading={loading.effects['meterDown/fetch']}
                bordered
                data={data}
                rowKey={'ids'}
                scroll={{x: 2650, y: global._scollY}}
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
    e && e.preventDefault ? e.preventDefault() : null
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        subcontractorName: fieldsValue.subcontractorName,
        valuationType: fieldsValue.valuationType,
        valuationTime: fieldsValue.valuationTime ? fieldsValue.valuationTime.format('YYYY-MM-DD') : null,
        minUnderRate: fieldsValue.minUnderRate / 100,
        maxUnderRate: fieldsValue.maxUnderRate / 100
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

  getSubNames = (payload) => {
    this.props.dispatch(
      {
        type: 'meterDown/querySubNames',
        payload: payload,
        token: this.props.app.user.token
      }
    )
  }

  getTeamList = (payload) => {
    this.props.dispatch(
      {
        type: 'meterDown/queryTeams',
        payload: payload,
        token: this.props.app.user.token
      }
    )
  }

  getAmount = (payload, callback) => {
    this.props.dispatch(
      {
        type: 'meterDown/queryAmount',
        payload: payload,
        token: this.props.app.user.token
      }
    ).then(res => {
      if (res) {
        callback(res.sumAmount)
      }
    })
  }

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'meterDown/del',
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

MeterDown.propTypes = {}

export default connect(({app, loading, meterDown}) => ({app, loading, meterDown}))(MeterDown)
