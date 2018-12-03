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
  Modal,
  message,
  Badge,
  Divider,
  Radio,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut} from "utils";

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible,handleUpdateModalVisible,updateModalVisible,handleCheckDetail,selectedValues,checkDetail} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={checkDetail?'用户详情':updateModalVisible?"编辑用户":"新建用户"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => checkDetail?handleCheckDetail():updateModalVisible?handleUpdateModalVisible():handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号名称">
        {form.getFieldDecorator('desc', {
          rules: [{required: true, message: '请输入账号名称'}],
        })(<Input disabled={checkDetail} placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号密码">
        {form.getFieldDecorator('name', {
          rules: [{required: true, message: '请输入账号密码'}],
        })(<Input disabled={checkDetail} placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号类型">
        {form.getFieldDecorator('desc', {
          rules: [{required: true, message: '请选择账号类型'}],
        })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
          <Option value="0">公司</Option>
          <Option value="1">项目部</Option>
        </Select>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色权限">
        {form.getFieldDecorator('desc', {
          rules: [{required: true, message: '请选择角色权限'}],
        })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
          <Option value="0">开发者</Option>
          <Option value="1">管理员</Option>
        </Select>)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class User extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      selectedValues:{},
      checkDetail:false
    }
  }

  columns = [
    {
      title: '序号编码',
      dataIndex: 'code',
    },
    {
      title: '账号类别',
      render: val => <span>主账号</span>,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目密码',
      dataIndex: 'proPassword',
    },
    {
      title: '角色权限',
      dataIndex: 'roleType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'owner',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '最新修改人',
      dataIndex: 'updateUser'
    },
    {
      title: '最新修改时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.handleCheckDetail(true,record)}>查看</a>
          <Divider type="vertical"/>
          <a >禁用</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    // dispatch({
    //   type:'sys_user/fetch',
    //   payload:{page:1,pageSize:10,status:1,code:'001',projectName:'A'}
    // })
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    dispatch({
      type: 'rule/fetch',
    });
  }

  componentWillUnmount() {
    clearTimeout(_setTimeOut)
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
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

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

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="用户编码">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">禁用</Option>
                  <Option value="1">启用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      rule: {data},
      loading,
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading,selectedValues,checkDetail} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="true">启用</Menu.Item>
        <Menu.Item key="false">禁用</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
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
        <PageHeaderWrapper title="用户管理">
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
                     批量操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
                )}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['rule/fetch']}
                data={data}
                scroll={{ x: '110%' }}
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

User.propTypes = {}

export default connect(({app, rule,sys_user, loading}) => ({app, rule,sys_user, loading}))(User)
