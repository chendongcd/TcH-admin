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
import {_setTimeOut,getButtons} from 'utils'
import {menuData} from 'common/menu'
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
const vType = ['过程计价', '中期结算','末次结算'];
const testValue = '123'
const CreateForm = Form.create()(props => {
  const {modalVisible,proNames, form, handleAdd, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={checkDetail ? '对下验工计价台账' : updateModalVisible ? "编辑对下验工计价台账" : "新增对下验工计价台账"}
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
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('projectId', {
                rules: [{required: true, message: '请选择项目'}],
                initialValue: selectedValues.projectId ? selectedValues.projectId : '',
              })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'} disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                {proNames.map((item, index) => {
                  return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="分包商名称">
              {form.getFieldDecorator('subcontractorName', {
                rules: [{required: true}],
                initialValue: selectedValues.subcontractorName ? selectedValues.subcontractorName : '',
              })(<Input disabled={checkDetail} placehloder='请输入分包商名称'/>)}
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
              })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
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
                initialValue: selectedValues.valuationPerson ? selectedValues.valuationPerson : testValue,
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入扣款金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="扣除保质金">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入扣除保质金'}],
                initialValue: selectedValues.valuationPerson ? selectedValues.valuationPerson : testValue,
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入扣除保质金" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="扣除覆约保质金">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
                initialValue: selectedValues.valuationPerson ? selectedValues.valuationPerson : testValue,
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入扣除覆约保质金" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 10}} label="计日工及补偿费用">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
                initialValue: selectedValues.valuationPerson ? selectedValues.valuationPerson : testValue,
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
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入已完未计'}],
                initialValue: selectedValues.shouldAmount ? selectedValues.shouldAmount : testValue,
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
                rules: [{required: true}],
                initialValue: selectedValues.remark ? selectedValues.remark : testValue,
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
              {form.getFieldDecorator('dragger', {
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
              <span style={info_css}>备注：中期计价附件（封面、验工计价批复表、汇总表；末次计价附件（公司批复的《劳务结算审批》、结算资料），请以一份PDF格式文件上传</span>
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

@Form.create()
class MeterDown extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: true,
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
        return <span>{moment(val).format('YYYY/MM/DD')}</span>;
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
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '扣款',
          dataIndex: 'valuationPriceReduce',
          render(val) {
            return <span>{val}</span>;
          },
        }, {
          title: '扣除质保金',
          //dataIndex: 'projectName',
          render(val) {
            return <span>没有</span>;
          },
        },
        {
          title: '扣除覆约保质金',
         // dataIndex: 'projectName',
          render(val) {
            return <span>没有</span>;
          },
        },
        {
          title: '计日工及补偿费用',
         // dataIndex: 'projectName',
          render(val) {
            return <span>没有</span>;
          },
        },
        {
          title: '应支付金额',
          dataIndex: 'shouldAmount',
          render(val) {
            return <span>{val}</span>;
          },
        }, {
          title: '已完成未计',
         // dataIndex: 'projectName',
          render(val) {
            return <span>没有</span>;
          },
        }]
    },
    {
      title: '对下计价率',
      //dataIndex: 'projectName',
      render(val) {
        return <span>没有</span>;
      },
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
        const user = this.props.app.user
        if(!user.token){
          return null
        }
        const button = user.permissionsMap.button
        return(
        <Fragment>
          {getButtons(button, pageButtons[1]) ?
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
              <Divider type="vertical"/>
            </Fragment>: null}
          { getButtons(button, pageButtons[2]) ?
            <Fragment>
              <a onClick={() => this.handleCheckDetail(true, record)}>查看</a>
              <Divider type="vertical"/>
            </Fragment>: null}
            <a>下载附件</a>
        </Fragment>
      )}
    },
  ];

  componentDidMount() {
    // const {dispatch} = this.props;
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    // setTimeout(() => {
    //   this.setState({pageLoading:false})
    // },1000)
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
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
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

  handleSearch = e => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
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
      subcontractorName:fields.subcontractorName,
      shouldAmount:fields.shouldAmount,
      remark:fields.remark,
      annexUrl:fields.annexUrl,
      contractPrice:fields.contractPrice,
      warranty:fields.warranty,
      compensation:fields.compensation
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

  handleUpdate = fields => {
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
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
              {getFieldDecorator('date')(
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
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col style={{flexDirection: 'row', display: 'flex'}} md={12} sm={24}>
            <FormItem label="对下计价率">
              {getFieldDecorator('give')(<Input placeholder="请输入" addonAfter={'%'}/>)}
            </FormItem>
            <FormItem style={{marginLeft: 15 + 'px'}} label="至">
              {getFieldDecorator('give')(<Input placeholder="请输入" addonAfter={'%'}/>)}
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
      meterDown: {data,proNames},
      loading,
      app:{user}
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
      proNames:proNames
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="对下验工计价台账">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token&&getButtons(user.permissionsMap.button,pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token&&getButtons(user.permissionsMap.button,pageButtons[3]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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

  getProNames = (proName) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'pro_proInfo/queryProNames',
          payload: {page: 1, pageSize: 10},
          token:this.props.app.user.token
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

  searchList = (page = 1, pageSize = 10) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      this.props.dispatch({
        type: 'meterDown/fetch',
        payload: {
          page: page,
          pageSize: pageSize,
          projectName: fieldsValue.projectName,
          subcontractorName: fieldsValue.subcontractorName,
          status: fieldsValue.status,
        }
      });
    });
  }
}

MeterDown.propTypes = {}

export default connect(({app, rule, loading, meterDown}) => ({app, rule, loading, meterDown}))(MeterDown)
