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
  Divider,
  Radio
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut} from 'utils'

const FormItem = Form.Item;

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
  const {modalVisible, form, handleAdd, handleModalVisible,handleUpdateModalVisible,updateModalVisible,handleCheckDetail,selectedValues,checkDetail} = props;

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
      title={checkDetail?'管理人员信息':updateModalVisible?"编辑管理人员":"新增管理人员"}
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
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="姓名">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请输入姓名'}],
              })(<Input disabled={checkDetail} placehloder='请输入姓名'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span:7}} wrapperCol={{span: 15}} label="性别">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">男</Option>
                <Option value="1">女</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="出生日期">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择出生日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="身份证号">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入份证号'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input placehloder='请输入联系电话'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="QQ">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入QQ号'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="家庭住址">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入家庭住址'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input placehloder='请输入项目名称'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="状态">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">在岗</Option>
                <Option value="1">调岗</Option>
                <Option value="2">息工</Option>
                <Option value="3">休假</Option>
                <Option value="4">离职</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="民族">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">汉族</Option>
                <Option value="1">少数民族</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="健康状况">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">健康状态</Option>
                <Option value="1">亚健康状态</Option>
                <Option value="2">疾病的前驱状态</Option>
                <Option value="3">疾病状态</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="入党时间">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择入党时间"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="籍贯">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入籍贯'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="职称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入职称'/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="职务">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">成本副经理</Option>
                <Option value="1">成本副经理兼部长</Option>
                <Option value="2">部长</Option>
                <Option value="3">副部长</Option>
                <Option value="4">部员</Option>
                <Option value="5">部见习生</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="参加工作年限">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入参加工作年限'/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="特长">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入特长'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span:5}} wrapperCol={{span: 15}} label="出生地">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input disabled={checkDetail} placehloder='请输入出生地'/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>第一学历</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="毕业院校">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入毕业院校'}],
              })(<Input disabled={checkDetail} placeholder="请输入毕业院校" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="专业">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入专业'}],
              })(<Input disabled={checkDetail} placeholder="请输入专业"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span:7}} wrapperCol={{span: 15}} label="毕业时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择毕业时间"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem style={{marginLeft:16+'px'}} labelCol={{span: 4}} wrapperCol={{span: 10}} label="学历">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请选择学历'}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">专科</Option>
                <Option value="1">本科</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>第二学历</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="毕业院校">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: false}],
              })(<Input disabled={checkDetail} placeholder="请输入毕业院校" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="专业">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: false}],
              })(<Input disabled={checkDetail} placeholder="请输入专业"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span:7}} wrapperCol={{span: 15}} label="毕业时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: false}],
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择毕业时间"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem style={{marginLeft:16+'px'}} labelCol={{span: 4}} wrapperCol={{span: 10}} label="学历">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: false}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">专科</Option>
                <Option value="1">本科</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>其他信息</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工作经历">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: false}],
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="工作经历" rows={4}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="职业资格证书取证情况">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: false}],
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="职业资格证书取证情况" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="学习及培训经历">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: false}],
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="学习及培训经历" rows={4}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="获奖励和受表彰情况">
              {form.getFieldDecorator('proSummary', {
                rules: [{required: false}],
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="获奖励和受表彰情况" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('proSummary', {
                rules: [{required: false}],
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
       {/* <Row gutter={8}>
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
            </FormItem>
          </Col>
        </Row>*/}
      </div>
    </Modal>
  );
});

@Form.create()
class PeopleInfo extends Component {

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
      title: '人员编码',
      dataIndex: 'code',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      render(val) {
        return <span>男</span>;
      },
    },
    {
      title: '当前状态',
      render(val) {
        return <span>在线</span>;
      },
    },
    {
      title: '项目名称',
      render(val) {
        return <span>123123</span>;
      },
    },
    {
      title: '职务',
      render(val) {
        return <span>部长</span>;
      },
    },
    {
      title: '职称',
      render(val) {
        return <span>老板</span>;
      },
    },
    {
      title: '参加工作年限',
      render(val) {
        return <span>10年</span>;
      },
    },
    {
      title: '学历',
      render(val) {
        return <span>专科</span>;
      },
    },
    {
      title: '手机号码',
      render(val) {
        return <span>10010101010</span>;
      },
    },
    {
      title: 'QQ号码',
      render(val) {
        return <span>10010101010</span>;
      },
    },
    {
      title: '邮箱',
      render(val) {
        return <span>www.qq123.com</span>;
      },
    },
    {
      title: '身份证号码',
      render(val) {
        return <span>51111111111111111</span>;
      },
    },
    {
      title: '已取得证书',
      render(val) {
        return <span>一级证书</span>;
      },
    },
    {
      title: '籍贯（省/市/区/显）',
      render(val) {
        return <span>51111111111111111</span>;
      },
    },
    {
      title: '创建时间',
      render(val) {
        return <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>;
      },
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
          <Divider type="vertical"/>
          <a>下载简历</a>
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
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('date')(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="职务">
              {getFieldDecorator('date')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">成本副经理</Option>
                  <Option value="1">成本副经理兼部长</Option>
                  <Option value="2">部长</Option>
                  <Option value="3">副部长</Option>
                  <Option value="4">部员</Option>
                  <Option value="5">部见习生</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="参加工作年限">
              {getFieldDecorator('date')(
                <Input/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="学历">
              {getFieldDecorator('give')(<Select style={{width: '100%'}}>
                <Option value="0">专科</Option>
                <Option value="1">本科</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col push={6} md={12} sm={24}>
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
    const {selectedRows, modalVisible, pageLoading,updateModalVisible,checkDetail,selectedValues} = this.state;
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
        <PageHeaderWrapper title="人员信息">
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
}

PeopleInfo.propTypes = {}

export default connect(({app, rule, loading}) => ({app, rule, loading}))(PeopleInfo)
