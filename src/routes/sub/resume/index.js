import React, {Component, PureComponent} from 'react'
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
  Steps,
  Radio
} from 'antd';
import {Page, PageHeader, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut} from 'utils'

const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let uuid = 0;

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible,normFile} = props;
  const {getFieldDecorator, getFieldValue} = form

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
      title="新增分包履历"
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="分包商名称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择名称'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="开始日期">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="结束日期">
              {form.getFieldDecorator('proType', {
                rules: [{required: true}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="该时间段所属项目部">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目部队伍名称">
              {form.getFieldDecorator('proType', {
                rules: [{required: true}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="施工规模">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择施工规模'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const CreateReview = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleReviewModal} = props;
  const {getFieldDecorator, getFieldValue} = form

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
      title='项目部信誉评价'
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleReviewModal()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="信誉评价">
              {form.getFieldDecorator('proName100', {
                rules: [{required: true, message: '请选择'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">优秀</Option>
                <Option value="1">合格</Option>
                <Option value="2">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="集团公司信誉评价">
              {form.getFieldDecorator('proName100', {
                rules: [{required: true, message: '请选择'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">合格</Option>
                <Option value="1">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="备注">
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
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };
  }

  handleNext = currentStep => {
    const {form, handleUpdate} = this.props;
    const {formVals: oldValue} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = {...oldValue, ...fieldsValue};
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const {currentStep} = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const {currentStep} = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const {form} = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{width: '100%'}}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{width: '100%'}}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{required: true, message: '请选择开始时间！'}],
          })(
            <DatePicker
              style={{width: '100%'}}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{width: '100%'}}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{required: true, message: '请输入规则名称！'}],
          initialValue: formVals.name,
        })(<Input placeholder="请输入"/>)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{required: true, message: '请输入至少五个字符的规则描述！', min: 5}],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符"/>)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const {handleUpdateModalVisible} = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{float: 'left'}} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{float: 'left'}} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const {updateModalVisible, handleUpdateModalVisible} = this.props;
    const {currentStep, formVals} = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{padding: '32px 40px 48px'}}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Steps style={{marginBottom: 28}} size="small" current={currentStep}>
          <Step title="基本信息"/>
          <Step title="配置规则属性"/>
          <Step title="设定调度周期"/>
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

@Form.create()
class Resume extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
      pageLoading:true,
      reviewType: false
    }
  }

  columns = [
    {
      title: '分包商备案编码',
      dataIndex: 'code',
    },
    {
      title: '分包商全称',
      dataIndex: 'name',
    },
    {
      title: '队伍名称',
      render(val) {
        return <span>四大队</span>;
      },
    },
    {
      title: '施工规模',
      render(val) {
        return <span>大</span>;
      },
    },
    {
      title: '开始日期',
      render(val) {
        return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '结束日期',
      render(val) {
        return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '该时间段所属项目部',
      render(val) {
        return <span>大</span>;
      },
    },
    {
      title: '合同签订人',
      render(val) {
        return <span>大</span>;
      },
    },
    {
      title: '合同签订人联系方式',
      render(val) {
        return <span>大</span>;
      },
    },
    {
      title: '合同金额',
      render(val) {
        return <span>10万</span>;
      },
    },
    {
      title: '结束金额',
      render(val) {
        return <span>10万</span>;
      },
    },
    {
      title: '项目部评价',
      render(val) {
        return <span>优秀</span>;
      },
    },
    {
      title: '文字评价',
      render(val) {
        return <span>很好很奈斯</span>;
      },
    }
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    _setTimeOut(()=>this.setState({pageLoading:false}),1000)
    // setTimeout(() => {
    //   this.setState({pageLoading:false})
    // },1000)
    dispatch({
      type: 'rule/fetch',payload:{pageSize:5}
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

  handleReviewModal = flag => {
    this.setState({
      reviewType: !!flag
    })
  }

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
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
            <FormItem label="分包商全称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目部信誉评价">
              {getFieldDecorator('date')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">优秀</Option>
                  <Option value="1">合格</Option>
                  <Option value="1">不合格</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="施工规模">
              {getFieldDecorator('give')(<Select placeholder="请选择施工规模" style={{width: '100%'}}>
                <Option value="0">优秀</Option>
                <Option value="1">合格</Option>
                <Option value="1">不合格</Option>
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

  render() {
    const {
      rule: {data},
      loading,
    } = this.props;
    const {selectedRows, modalVisible,pageLoading,reviewType} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleReviewModal:this.handleReviewModal
    };
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="分包商履历">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
                <Button icon="edit" type="primary" onClick={() => this.handleReviewModal(true)}>
                  项目部评价
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
                scroll={{ x: '150%' }}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible}/>
          <CreateReview {...parentMethods} modalVisible={reviewType}/>
        </PageHeaderWrapper>
      </Page>
    )
  }
}

Resume.propTypes = {}

export default connect(({app, rule,loading}) => ({app, rule,loading}))(Resume)
