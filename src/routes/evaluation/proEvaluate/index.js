import React, {Component,Fragment} from 'react'
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
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let uuid = 0;
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
      title={checkDetail?'项目评估':updateModalVisible?"编辑项目评估":"新增项目评估"}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => checkDetail?handleCheckDetail():updateModalVisible?handleUpdateModalVisible():handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择项目'}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="工程类别">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='自动带出'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="出生日期">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} width={'100%'} placehloder='请选择出生日期'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="评估状态">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">未评估</Option>
                <Option value="1">初评</Option>
                <Option value="2">复评(二次)</Option>
                <Option value="3">复评(三次)</Option>
                <Option value="4">复评(四次)</Option>
                <Option value="5">定评</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目状态">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='自动带出'/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同价</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="中标">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入中标金额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="有效收入">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入有效金额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="是否签订">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="签订日期">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder='请选择日期'/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同工期</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="合同开工日期">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='自动带出'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="合同竣工日期">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='自动带出'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="工期(月)">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='自动计算'/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>经管部评价</div>
      </Row>
      <div className={styles.modalContent} style={{paddingRight:0}}>
        <Row gutter={8}>
          <Col md={7} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="评估时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} width={'100%'} placeholder='请选择'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="评估效益点(%)">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 13}} label="含分包差及经营费(%)">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={12} sm={24}>
            <FormItem style={{marginLeft:14+'px'}} labelCol={{span: 4}} wrapperCol={{span: 12}} label="评估编号">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder="请输入评估编号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft:11+'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
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
              <span style={info_css}>备注：请以一份压缩包格式文件上传</span>
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>会审情况</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={7} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="效益点">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="是否含分包差及经营费">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="上会时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} placeholder='请选择时间)'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft:11+'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
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
              <span style={info_css}>备注：请以一份压缩包格式文件上传</span>
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>责任状签订</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="效益点">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="签订时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} width={'100%'} placeholder='请选择'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="项目经理">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder='请输入项目经理'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="项目书记">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placeholder="项目书记" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft:25+'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="附件">
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
              <span style={info_css}>备注：请以一份PDF格式文件上传</span>
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

@Form.create()
class ProEvaluate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: true,
      selectedValues:{},
      checkDetail:false
    }
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'code',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '工程类别',
      render(val) {
        return <span>123</span>;
      },
    },
    {
      title: '项目状态',
      render(val) {
        return <span>123</span>;
      },
    },
    {
      title: '合同额',
      children: [{
        title: '中标',
        key: 'contract',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '有效收入',
        key: 'use_bill',
        render(val) {
          return <span>123</span>;
        },
      },]
    },
    {
      title: '合同',
      children: [{
        title: '是否签订',
        key: 'sign_is',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '签订日期',
        key: 'sign_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },]
    },
    {
      title: '合同工期',
      children: [{
        title: '合同开工时间',
        key: 'start_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '合同竣工时间',
        key: 'end_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },{
        title: '工期(月)',
        key: 'days',
        render(val) {
          return <span>1</span>;
        },
      }]
    },
    {
      title: '经管部评估',
      children: [{
        title: '评估时间',
        key: 'review_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '评估效益点(%)',
        key: 'review_point',
        render(val) {
          return <span>1</span>;
        },
      },{
        title: '含分包差及经营费(%)',
        key: 'split_bill',
        render(val) {
          return <span>1</span>;
        },
      },{
        title: '评估编号',
        key: 'review_code',
        render(val) {
          return <span>1123</span>;
        },
      },{
        title: '附件',
        key: 'files',
        render(val) {
          return <a href="#">下载</a>;
        },
      }]
    },
    {
      title: '会审情况',
      children: [{
        title: '效益点',
        key: 'benefit',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '是否含分包差及经营费',
        key: 'is_wrapper',
        render(val) {
          return <span>是</span>;
        },
      },{
        title: '上会时间',
        key: 'meet_time',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },{
        title: '附件',
        key: 'files_1',
        render(val) {
          return <a href="#">下载</a>;
        },
      }]
    },
    {
      title: '责任状签订',
      children: [{
        title: '效益点',
        key: 'benefit_1',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '签订时间',
        key: 'sign_date1',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },{
        title: '项目经理',
        key: 'pro_manager',
        render(val) {
          return <span>李蛋蛋</span>;
        },
      },{
        title: '项目书记',
        key: 'pro_secretary',
        render(val) {
          return <span>李蛋蛋</span>;
        },
      },{
        title: '附件',
        key: 'files_2',
        render(val) {
          return <a href="#">下载</a>;
        },
      }]
    },
    {
      title: '备注',
      render(val) {
        return <span>100万啊实打实的</span>;
      },
    },
    {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.handleCheckDetail(true,record)}>查看</a>
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
    dispatch({
      type: 'rule/fetch', payload: {pageSize: 5}
    });
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
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评估状态">
              {getFieldDecorator('date')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">未评估</Option>
                  <Option value="1">初评</Option>
                  <Option value="2">复评(二次)</Option>
                  <Option value="3">复评(三次)</Option>
                  <Option value="4">复评(四次)</Option>
                  <Option value="5">定评</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目状态">
              {getFieldDecorator('date')(
                <Input placeholder="自动带出"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="合同是否签订">
              {getFieldDecorator('give')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="责任状是否签订">
              {getFieldDecorator('give')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      rule: {data},
      loading,
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading,selectedValues,checkDetail} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
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
        <PageHeaderWrapper title="项目评估">
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
                loading={loading.effects['rule/fetch']}
                bordered
                data={data}
                scroll={{x: '250%'}}
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
}

ProEvaluate.propTypes = {}

export default connect(({app, rule, loading}) => ({app, rule, loading}))(ProEvaluate)
