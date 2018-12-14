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
  message,
  Upload,
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut, getButtons,cleanObject} from 'utils'
import {menuData} from 'common/menu'

const pageButtons = menuData[13].buttons.map(a => a.permission)
const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const info_css = {
  color: '#fa541c'
}
const teamStatus = ['正在施工', '完工待结算', '已结算']
const testValue = '123'
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'
const CreateForm = Form.create()(props => {
  const {modalVisible, proNames, form, handleAdd, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      // form.resetFields();
      fieldsValue.annexUrl = testPDF
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          // console.log(fieldsValue[prop].format())
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
        }
      }
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={checkDetail ? '队伍台账' : updateModalVisible ? "编辑台账" : "新增台账"}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
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
                         disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                {proNames.map((item, index) => {
                  return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="合同类型">
              {form.getFieldDecorator('contractType', {
                rules: [{required: true, message: '请选择合同类型'}],
                initialValue: selectedValues.contractType ? selectedValues.contractType : '',
              })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                         style={{width: '100%'}}>
                <Option value="0">主合同</Option>
                <Option value="1">补充合同</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分包商名称">
              {form.getFieldDecorator('subcontractorName', {
                rules: [{required: true,message:'请输入分包商名称'}],
                initialValue: selectedValues.subcontractorName ? selectedValues.subcontractorName : testValue,
              })(<Input disabled={checkDetail} placeholder="请输入分包商名称"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="队伍名称">
              {form.getFieldDecorator('teamName', {
                rules: [{required: true,message:'请输入队伍名称'}],
                initialValue: selectedValues.teamName ? selectedValues.teamName : testValue,
              })(<Input disabled={checkDetail} placeholder="请输入队伍名称"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="合同签订日期">
              {form.getFieldDecorator('contractTime', {
                rules: [{required: true,message:'请选择合同签订日期'}],
                initialValue: selectedValues.contractTime ? moment(selectedValues.contractTime) : null,
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="预计合同金额">
              {form.getFieldDecorator('estimatedContractAmount', {
                rules: [{required: true,message:'请输入预计合同金额'}],
                initialValue: selectedValues.estimatedContractAmount ? selectedValues.estimatedContractAmount : testValue
              })(<Input disabled={checkDetail} placeholder="请输入预计合同金额" addonAfter='元'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="施工范围">
              {form.getFieldDecorator('constructionScope', {
                rules: [{required: true,message:'请输入施工范围'}],
                initialValue: selectedValues.constructionScope ? selectedValues.constructionScope : testValue
              })(<Input disabled={checkDetail} placeholder="请输入施工范围"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="队伍状态">
              {form.getFieldDecorator('status', {
                rules: [{required: true,message:'请选择队伍状态'}],
                initialValue: selectedValues.status ? selectedValues.status : ''
              })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择队伍状态"
                         style={{width: '100%'}}>
                <Option value="0">正在施工</Option>
                <Option value="1">完工待结算</Option>
                <Option value="2">已完结</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>覆约保证金</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="应缴金额">
              {form.getFieldDecorator('shouldAmount', {
                rules: [{required: true, message: '请输入应缴金额'}],
                initialValue: selectedValues.shouldAmount ? selectedValues.shouldAmount : testValue
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入应缴金额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="实缴金额">
              {form.getFieldDecorator('realAmount', {
                rules: [{required: true, message: '请输入实缴金额'}],
                initialValue: selectedValues.realAmount ? selectedValues.realAmount : testValue
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入实缴金额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>负责人</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="合同签订人">
              {form.getFieldDecorator('contractPerson', {
                rules: [{required: true, message: '请输入合同签订人'}],
                initialValue: selectedValues.contractPerson ? selectedValues.contractPerson : testValue
              })(<Input disabled={checkDetail} placeholder="请输入合同签订人"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 12}} label="合同签订人联系电话">
              {form.getFieldDecorator('phone', {
                rules: [{required: true, message: '请输入合同签订人联系电话'}],
                initialValue: selectedValues.phone ? selectedValues.phone : testValue
              })(<Input disabled={checkDetail} placeholder="请输入合同签订人联系电话"/>)}
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
            <FormItem style={{marginLeft: 18 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
              {form.getFieldDecorator('annexUrl', {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
              })(
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                  </p>
                  <p className="ant-upload-text">点击或拖动附件进入</p>
                </Upload.Dragger>
              )}
              <span style={info_css}>备注：请以一份PDF格式文件上传。</span>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft: 18 + 'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [{required: false}],
                initialValue: selectedValues.remark ? selectedValues.remark : testValue
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});
const CreateCompForm = Form.create()(props => {
  const {modalVisible, form, companyUpdate, handleComModalVisible, selectedValues} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      // form.resetFields();
      companyUpdate(fieldsValue,selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="公司编辑台账"
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleComModalVisible()}
    >
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>队伍选定</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="日期">
              {form.getFieldDecorator('teamTime', {
                rules: [{required: true, message: '请选择日期'}],
                initialValue: selectedValues.teamTime ? moment(selectedValues.teamTime) : null
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同审批</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="日期">
              {form.getFieldDecorator('approvalTime', {
                rules: [{required: true, message: '请选择日期'}],
                initialValue: selectedValues.approvalTime ? moment(selectedValues.approvalTime) : null
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="是否备案">
              {form.getFieldDecorator('approvalFiling', {
                rules: [{required: true}],
                initialValue: selectedValues.approvalFiling ? selectedValues.approvalFiling : ''
              })(<Select className={styles.customSelect} placeholder="请选择" style={{width: '100%'}}>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>结算审批</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="日期">
              {form.getFieldDecorator('settlementTime', {
                rules: [{required: true, message: '请选择日期'}],
                initialValue: selectedValues.settlementTime ? moment(selectedValues.settlementTime) : null
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft: 21 + 'px'}} labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('settlementRemark', {
                rules: [{required: true}],
                initialValue: selectedValues.settlementRemark ? selectedValues.settlementRemark : null
              })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

@Form.create()
class TeamAccount extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: true,
      comModal: false,
      selectedValues: {},
      checkDetail: false
    }
  }

  columns = [
    {
      title: '劳务队伍统计（项目部填写）',
      key: '01',
      children: [
        {
          title: '项目名称',
          dataIndex: 'projectName',
        },
        {
          title: '合同编码',
          dataIndex: 'contractCode',
        },
        {
          title: '分包商名称',
          dataIndex: 'subcontractorName'
        },
        {
          title: '队伍名称',
          dataIndex: 'teamName',
        },
        {
          title: '队伍状态',
          dataIndex: 'status',
          render(val) {
            return <span>{teamStatus[val]}</span>;
          },
        },
        {
          title: '预计合同金额',
          dataIndex: 'estimatedContractAmount',
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '施工范围',
          dataIndex: 'constructionScope'
        },
        {
          title: '覆约保证金',
          key: '008',
          children: [
            {
              title: '应缴金额（万元）',
              dataIndex: 'shouldAmount'
            }, {
              title: '实际缴金额（万元）',
              dataIndex: 'realAmount'
            }]
        },
        {
          title: '负责人',
          key: '009',
          children: [{
            title: '合同签订人',
            dataIndex: 'contractPerson',
          },
            {
              title: '联系方式',
              dataIndex: 'phone',
            }]
        },
        {
          title: '结算金额',
          key: 'settlementAmount'
        },
        {
          title: '附件（含同）',
          dataIndex: 'annexUrl',
          render(val) {
            return <a href={val} download={'附件'}>下载附件</a>;
          },
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
      ]
    },
    {
      title: '备案情况（公司填写）',
      key: '02',
      children: [
        {
          title: '队伍选定',
          key: '020',
          children: [{
            title: '日期',
            dataIndex: 'teamTime',
            render(val) {
              return <span>{moment(val).format('YYYY/MM/DD')}</span>;
            },
          }]
        },
        {
          title: '合同审批',
          key: '021',
          children: [{
            title: '日期',
            dataIndex: 'contractTime',
            render(val) {
              return <span>{moment(val).format('YYYY/MM/DD')}</span>;
            },
          },
            {
              title: '是否备案',
              key: 'approvalFiling',
              dataIndex: 'approvalFiling',
              render(val) {
                return <span>{val ? '否' : '是'}</span>;
              },
            }]
        },
        {
          title: '结算审批',
          key: '022',
          children: [{
            title: '日期',
            dataIndex: 'settlementTime',
            render(val) {
              return <span>{moment(val).format('YYYY/MM/DD')}</span>;
            },
          }]
        },
      ]
    },
    {
      title: '备注',
      dataIndex: 'settlementRemark',
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
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a> : null}
            {getButtons(button, pageButtons[2]) ?
              <Fragment>
                <Divider type="vertical"/>
                <a onClick={() => this.handleCheckDetail(true, record)}>查看</a></Fragment> : null}
            {getButtons(button, pageButtons[3]) ?
              <Fragment>
                <Divider type="vertical"/>
                <a onClick={() => this.handleComModalVisible(true,record)}>公司编辑</a></Fragment> : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    // setTimeout(() => {
    //   this.setState({pageLoading:false})
    // },1000)
    this.getList()
    this.getProNames()
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
    const {form}= this.props;
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

  handleComModalVisible = (flag,record={}) => {
    this.setState({
      comModal: !!flag,
      selectedValues:record
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
      contractType: fields.contractType,
      subcontractorName: fields.subcontractorName,
      teamName: fields.teamName,
      contractTime: fields.contractTime,
      estimatedContractAmount: fields.estimatedContractAmount,
      constructionScope: fields.constructionScope,
      status: fields.status,
      realAmount: fields.realAmount,
      shouldAmount: fields.shouldAmount,
      remark: fields.remark,
      annexUrl: fields.annexUrl,
      contractPerson: fields.contractPerson,
      phone: fields.phone
    }
    if (updateModalVisible) {
      dispatch({
        type: 'teamAccount/update',
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
        type: 'teamAccount/add',
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

  companyUpdate=(fields, selectedValues)=>{
    const {dispatch, app: {user}} = this.props;
    const payload = {
      id: selectedValues.id,
      teamTime: fields.teamTime.format('YYYY-MM-DD'),
      approvalTime: fields.approvalTime.format('YYYY-MM-DD'),
      approvalFiling: fields.approvalFiling,
      settlementTime: fields.settlementTime.format('YYYY-MM-DD'),
      settlementRemark: fields.settlementRemark,
    }
      dispatch({
        type: 'teamAccount/updateCompany',
        payload: payload,
        token: user.token
      }).then(res => {
        if (res) {
          this.handleComModalVisible()
          this.getList()
        }
      })
  }

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={(e)=>this.searchList(e)} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商名称">
              {getFieldDecorator('subcontractorName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="队伍状态">
              {getFieldDecorator('status')(<Select placeholder="请选择" style={{width: '100%'}}>
                {teamStatus.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="合同备案">
              {getFieldDecorator('approvalFiling')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
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
      teamAccount: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, pageLoading, comModal, selectedValues, updateModalVisible, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleComModalVisible: this.handleComModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      companyUpdate:this.companyUpdate
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
        <PageHeaderWrapper title="所属劳务队伍台账">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[4]) ?
                  <Button icon="plus" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['teamAccount/fetch']}
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
          <CreateCompForm {...parentMethods} selectedValues={selectedValues} modalVisible={comModal}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName = []) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'teamAccount/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'teamAccount/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e,page = 1, pageSize = 10) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      let payload ={
          page: page,
          pageSize: pageSize,
          projectName: fieldsValue.projectName,
          subcontractorName: fieldsValue.subcontractorName,
          status: fieldsValue.status,
          approvalFiling:fieldsValue.approvalFiling
        }
      cleanObject(payload)
      this.props.dispatch({
        type: 'teamAccount/fetch',
        payload: payload,
        token:this.props.app.user.token
      });
    });
  }
}

TeamAccount.propTypes = {}

export default connect(({app, rule, loading, teamAccount}) => ({app, rule, loading, teamAccount}))(TeamAccount)
