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
const statusMap = [ 'success', 'error'];
const status = ['启用', '禁用'];

/*const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const _onSelect = (value) => {
    console.log(value)
  }
  return (
    <Modal
      destroyOnClose
      title={checkDetail ? '用户详情' : updateModalVisible ? "编辑用户" : "新建用户"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号类型">
        {form.getFieldDecorator('type', {
          rules: [{required: true, message: '请选择账号类型'}],
        })(<Select onSelect={(e) => _onSelect(e)} disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
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
    </Modal>
  );
});*/

@Form.create()
class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 0,
    }
    this.isLoad = false
  }

  componentDidMount() {

  }

  okHandle = (handleAdd, form,updateModalVisible,selectedValues) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handleAdd(fieldsValue,updateModalVisible,selectedValues);
    });
  }

  _onSelect = (value) => {
    this.setState({type: value})
  }

  getOptions = async (func, param) => {
    this.isLoad = false
    await func(param)
    this.isLoad = true
  }

  render() {
    const {modalVisible, form, handleAdd, getProNames, getRoleNames, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail, proNames, roleNames} = this.props;
   // console.log(roleNames)
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={checkDetail ? '用户详情' : updateModalVisible ? "编辑用户" : "新建用户"}
        visible={modalVisible}
        onOk={() => this.okHandle(handleAdd, form,updateModalVisible,selectedValues)}
        onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
      >
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号类型">
          {form.getFieldDecorator('type', {
            rules: [{required: true, message: '请选择账号类型',initialValue:selectedValues.type?selectedValues.type:-1}],
          })(<Select onSelect={(e) => this._onSelect(e)} disabled={checkDetail} placeholder="请选择"
                     style={{width: '100%'}}>
            <Option value="0">公司</Option>
            <Option value="1">项目部</Option>
          </Select>)}
        </FormItem>
        {this.state.type == 1 ? <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目名称">
          {form.getFieldDecorator('proName', {
            rules: [{required: true, message: '请选择项目名称',initialValue:selectedValues.projectId?selectedValues.projectId:''}],
          })(<Select onFocus={() => this.getOptions(getProNames, proNames)}
                     notFoundContent={this.isLoad ? '暂无数据' : '正在加载'}
                     mode={'multiple'} disabled={checkDetail}
                     placeholder="请选择" style={{width: '100%'}}>
            {proNames.map((item, index) => {
              return <Option key={index} value={`{"id":${item.id}}`}>{item.name}</Option>
            })}
          </Select>)}
        </FormItem> : null}
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色权限">
          {form.getFieldDecorator('role', {
            rules: [{required: true, message: '请选择角色权限'}],
          })(
            <Select onFocus={() => this.getOptions(getRoleNames,roleNames)}
                    disabled={checkDetail}
                    notFoundContent={this.isLoad?'暂无数据':'正在加载'}
                    placeholder="请选择"
                    style={{width: '100%'}}>
              {roleNames.map((item, index) => {
                return <Option key={index} value={item.id}>{item.name}</Option>
              })}
            </Select>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号名称">
          {form.getFieldDecorator('account', {
            rules: [{required: true, message: '请输入账号名称'}],
          })(<Input disabled={checkDetail} placeholder="请输入"/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账号密码">
          {form.getFieldDecorator('password', {
            rules: [{required: true, message: '请输入账号密码'}],
          })(<Input disabled={checkDetail} placeholder="请输入"/>)}
        </FormItem>
      </Modal>
    );
  }
}

@Form.create()
class User extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      selectedValues: {},
      checkDetail: false
    }
  }

  columns = [
    {
      title: '序号编码',
      dataIndex: 'id',
    },
    {
      title: '账号类别',
      dataIndex: 'type',
      render: val => <span>{val==0?'公司':'项目部'}</span>,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目密码',
      dataIndex: 'password',
    },
    {
      title: '角色权限',
      dataIndex: 'roleType',
    },
    {
      title: '状态',
      dataIndex: 'disable',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUserId',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '最新修改人',
      dataIndex: 'updateUserId'
    },
    {
      title: '最新修改时间',
      dataIndex: 'updateTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.handleCheckDetail(true, record)}>查看</a>
          <Divider type="vertical"/>
          <a>{record.disable==0?'禁用':'启用'}</a>
        </Fragment>
      )},
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    this.getProNames([])
    this.getRoleNames([])
    // dispatch({
    //   type:'sys_user/queryUserList',
    //   payload:{page:1,pageSize:10}
    // })
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    dispatch({
      type:'sys_user/queryUserList',
      payload:{page:1,pageSize:10}
    })
    // dispatch({
    //   type: 'rule/fetch',
    // });
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

  handleAdd = (fields,updateModalVisible,selectedValues) => {
    const {dispatch,app:{user}} = this.props;
    const payload = {
      account:fields.account,
      password:fields.password,
      projects:fields.proName.map(a=>JSON.parse(a)),
    }
    if(updateModalVisible){
      dispatch({
        type:'sys_user/updateUser',
        payload:{...payload,...{id:selectedValues.id}},
        token:user.token
      })
    }else {
      dispatch({
        type:'sys_user/addUser',
        payload:payload,
        token:user.token
      })
    }
    // dispatch({
    //   type: 'sys_user/addUser',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    //
    // message.success('添加成功');
    // this.handleModalVisible();
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
      loading,
      sys_user: {proNames, roleNames,data}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="true">启用</Menu.Item>
        <Menu.Item key="false">禁用</Menu.Item>
      </Menu>
    );
   // console.log(roleNames)

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      getProNames: this.getProNames,
      getRoleNames: this.getRoleNames
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      roleNames: roleNames,
      loading: loading
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
                loading={loading.effects['sys_user/queryUserList']}
                rowKey="id"
                data={data}
                scroll={{x: '150%'}}
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
          type: 'sys_user/queryProNames',
          payload: {page: 1, pageSize: 10}
        }
      )
    }
  }

  getRoleNames = (roleName) => {
    if (roleName.length < 1) {
      this.props.dispatch(
        {
          type: 'sys_user/queryRoleNames',
          payload: {page: 1, pageSize: 10}
        }
      )
    }
  }
}

User.propTypes = {}

export default connect(({app, rule, sys_user, loading}) => ({app, rule, sys_user, loading}))(User)
