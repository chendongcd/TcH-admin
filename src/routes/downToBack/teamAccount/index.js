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
  Dropdown,
  Menu,
  DatePicker,
  Modal,
  message,
  Upload,
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut} from 'utils'

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const info_css={
  color:'#fa541c'
}
const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, normFile,handleUpdateModalVisible,updateModalVisible,handleCheckDetail,selectedValues,checkDetail} = props;

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
      title={checkDetail?'队伍台账':updateModalVisible?"编辑台账":"新增台账"}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => checkDetail?handleCheckDetail():updateModalVisible?handleUpdateModalVisible():handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择项目'}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="合同类型">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择合同'}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">主合同</Option>
                <Option value="1">补充合同</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分包商名称">
              {form.getFieldDecorator('proType5', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder="请输入分包商名称"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="队伍名称">
              {form.getFieldDecorator('proType6', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder="请输入队伍名称"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="合同签订日期">
              {form.getFieldDecorator('proType5', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="预计合同金额">
              {form.getFieldDecorator('proType6', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder="请预计合同金额" addonAfter='元'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="施工范围">
              {form.getFieldDecorator('proType5', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder="请输入施工范围"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="队伍状态">
              {form.getFieldDecorator('proType6', {
                rules: [{required: true}],
              })(<Select disabled={checkDetail} placeholder="请选择队伍状态" style={{width: '100%'}}>
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
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入应缴金额'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入应缴金额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="实缴金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入实缴金额'}],
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
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入合同签订人'}],
              })(<Input disabled={checkDetail} placeholder="请输入合同签订人"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 12}} label="合同签订人联系电话">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入合同签订人联系电话'}],
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
            <FormItem style={{marginLeft:18+'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
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
              <span style={info_css}>备注：请以一份PDF格式文件上传。</span>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft:18+'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('proSummary', {
                rules: [{required: true}],
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const CreateCompForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleComModalVisible} = props;

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
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请选择日期'}],
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
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请选择日期'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="是否备案">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
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
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请选择日期'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft:21+'px'}} labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('proSummary', {
                rules: [{required: true}],
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
      comModal:false,
      selectedValues:{},
      checkDetail:false
    }
  }

  columns = [
    {
      title: '劳务队伍统计（项目部填写）',
      key:'01',
      children: [
        {
          title: '项目名称',
          dataIndex: 'projectName',
        },
        {
          title: '合同编码',
          dataIndex: 'id',
        },
        {
          title: '分包商名称',
          dataIndex:'subcontractorName'
        },
        {
          title: '队伍名称',
          dataIndex:'teamName',
        },
        {
          title: '队伍状态',
          dataIndex:'status',
          render(val) {
            return <span>已完结</span>;
          },
        },
        {
          title: '预计合同金额',
          dataIndex:'estimatedContractAmount',
          render(val) {
            return <span>{val}</span>;
          },
        },
        {
          title: '施工范围',
          dataIndex:'constructionScope'
        },
        {
          title: '覆约保证金',
          key:'008',
          children: [
            {
              title: '应缴金额（万元）',
              dataIndex:'shouldAmount'
            }, {
              title: '实际缴金额（万元）',
              dataIndex: 'realAmount'
            }]
        },
        {
          title: '负责人',
          key:'009',
          children: [{
            title: '合同签订人',
            dataIndex: 'contractPerson',
          },
            {
              title: '联系方式',
              dataIndex:'phone',
            }]
        },
        {
          title: '结算金额',
          key:'0010',
          render(val) {
            return <span>没有</span>;
          },
        },
        {
          title: '附件（含同）',
          dataIndex:'annexUrl',
          render(val) {
            return <a href={val} download={'附件'}>下载附件</a>;
          },
        },
        {
          title: '备注',
          dataIndex:'remark'
        },
      ]
    },
    {
      title: '备案情况（公司填写）',
      key:'02',
      children: [
        {
          title: '队伍选定',
          key:'020',
          children: [{
            title:'日期',
            dataIndex:'teamTime',
            render(val) {
              return <span>{moment(val).format('YYYY/MM/DD')}</span>;
            },
          }]
        },
        {
          title: '合同审批',
          key:'021',
          children: [{
            title:'日期',
            dataIndex:'contractTime',
            render(val) {
              return <span>{moment(val).format('YYYY/MM/DD')}</span>;
            },
          },
            {
              title:'是否备案',
              key:'0211',
              render(val) {
                return <span>没有</span>;
              },
            }]
        },
        {
          title: '结算审批',
          key:'022',
          children: [{
            title:'日期',
            dataIndex:'settlementTime',
            render(val) {
              return <span>{moment(val).format('YYYY/MM/DD')}</span>;
            },
          }]
        },
        ]
    },
    {
      title: '备注',
      render(val) {
        return <span>没有</span>;
      },
    },
    {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.handleCheckDetail(true,record)}>查看</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.handleComModalVisible(true)}>公司编辑</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
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

  handleComModalVisible = flag => {
    this.setState({
      comModal: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      modalVisible:!!flag,
      selectedValues: record || {},
    });
  };

  handleCheckDetail=(flag, record) => {
    this.setState({
      checkDetail: !!flag,
      modalVisible:!!flag,
      selectedValues: record || {},
    });
  };

  handleAdd = fields => {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    message.success('添加成功');
    this.handleModalVisible();
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
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="队伍状态">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">正在施工</Option>
                <Option value="1">完工待结算</Option>
                <Option value="2">已结算</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="合同备案">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
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
      teamAccount: {data},
      loading,
    } = this.props;
    const {selectedRows, modalVisible, pageLoading,comModal,selectedValues,updateModalVisible,checkDetail} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="export">导出</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleComModalVisible:this.handleComModalVisible,
      handleUpdateModalVisible:this.handleUpdateModalVisible,
      handleCheckDetail:this.handleCheckDetail
    };
    const parentState = {
      updateModalVisible:updateModalVisible,
      modalVisible:modalVisible,
      selectedValues:selectedValues,
      checkDetail:checkDetail
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="所属劳务队伍台账">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                  <Dropdown overlay={menu}>
                    <Button>
                     操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
                )}
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
          <CreateCompForm {...parentMethods} modalVisible={comModal}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'teamAccount/fetch',
      payload: {page: page, pageSize: pageSize},
      token:this.props.app.user.token
    });
  }

  searchList = (page = 1, pageSize = 10) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      this.props.dispatch({
        type: 'teamAccount/fetch',
        payload: {
          page: page,
          pageSize: pageSize,
          projectName: fieldsValue.projectName,
          mileageNumber: fieldsValue.mileageNumber,
          totalPrice: fieldsValue.totalPrice,
          contractStartTime: fieldsValue.contractStartTime,
          contractEndTime: fieldsValue.contractEndTime,
          realContractStartTime: fieldsValue.realContractStartTime,
          realContractEndTime: fieldsValue.realContractEndTime,
          status: fieldsValue.status,
          projectManager: fieldsValue.projectManager,
          chiefEngineer: fieldsValue.chiefEngineer,
          projectSecretary: fieldsValue.status,
        }
      });
    });
  }
}

TeamAccount.propTypes = {}

export default connect(({app, rule, loading,teamAccount}) => ({app, rule, loading,teamAccount}))(TeamAccount)
