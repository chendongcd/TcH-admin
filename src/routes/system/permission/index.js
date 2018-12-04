import React, {Component, Fragment} from 'react'
import {connect} from 'dva'
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  Tree,
  Modal,
  Drawer,
  Divider,
  Collapse
} from 'antd';
import {arrayToTree, _setTimeOut} from 'utils'
import {menuData} from '../../../common/menu'
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible,handleUpdateModalVisible,updateModalVisible,selectedValues} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
    //  form.resetFields();
      handleAdd(fieldsValue, updateModalVisible,selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={updateModalVisible?"编辑角色":"新增角色"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => updateModalVisible?handleUpdateModalVisible():handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色名称">
        {form.getFieldDecorator('roleName', {
          rules: [{required: true, message: '请输入角色名称'}],
          initialValue:selectedValues.name?selectedValues.name:''
        })(<Input placeholder="请输入"/>)}
      </FormItem>
    </Modal>
  );
});

class CreatDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onCheck = (checkedKeys, info) => {
    //console.log('onCheck', checkedKeys, info);
  }

  renderSubTree = (trees, parentKey) => {
    return trees.children ? trees.children.map((tree, index) => {
      const key = `${parentKey}-${index}`
      return (<TreeNode selectable={false} title={tree.name} key={key}>
        {this.renderSubTree(tree, key)}
      </TreeNode>)
    }) : null
  }

  renderTree = (menuTree) => {
    return menuTree.map((a, aIndex) => {
      return (
        <TreeNode selectable={false} icon={<Icon type={a.icon}/>} title={a.name} key={`0-${aIndex}`}>
          {this.renderSubTree(a, `0-${aIndex}`)}
        </TreeNode>
      )
    })
  }

  render() {
    const {onClose, drawVisible} = this.props
    const DescriptionItem = ({title, content}) => (
      <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 7,
          color: 'rgba(0,0,0,0.65)',
        }}
      >
        <p
          style={{
            marginRight: 8,
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
          }}
        >
          {title}:
        </p>
        {content}
      </div>
    );
    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };
    // 生成树状
    const menuTree = arrayToTree(menuData.filter(_ => (_.mpid !== '-1' && _.id !== '1')), 'id', 'mpid')
    return (
      <Drawer
        width={440}
        title="权限设置"
        placement="right"
        closable={false}
        onClose={onClose}
        style={{paddingBottom: 53 + 'px'}}
        visible={drawVisible}
      >
        <Collapse bordered={false}>
          <Collapse.Panel header="角色信息" key="1" style={{
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
          }}>
            <Row>
              <Col span={12}>
                <DescriptionItem title="角色名称" content="Lily"/>{' '}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="最新修改时间" content="2018-9-19"/>
              </Col>
              {' '}
              <Col span={12}>
                <DescriptionItem title="最新修改人" content="Melon"/>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="创建时间" content="2010-9-19"/>
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
        <Divider style={{marginTop: 0, marginBottom: 0}}/>
        <Tree
          checkable
          showIcon
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          onCheck={this.onCheck}
          style={{marginBottom: 53 + 'px', overflow: 'scroll'}}
        >
          {this.renderTree(menuTree)}
          {/*       <TreeNode icon={<Icon type="radius-setting"/>} title="系统管理" key="0-0">
            <TreeNode title="项目管理" key="0-0-0" disabled>
              <TreeNode title="leaf" key="0-0-0-0" disableCheckbox/>
              <TreeNode title="leaf" key="0-0-0-1"/>
            </TreeNode>
            <TreeNode title="权限管理" key="0-0-1">
              <TreeNode title={<span style={{color: '#1890ff'}}>sss</span>} key="0-0-1-0"/>
            </TreeNode>
            <TreeNode title="用户管理" key="0-0-2">
              <TreeNode title={<span style={{color: '#1890ff'}}>sss</span>} key="0-0-1-0"/>
            </TreeNode>
          </TreeNode>
          <TreeNode icon={<Icon type="project"/>} title="项目部管理" key="0-1">
            <TreeNode title="项目工程信息卡" key="0-1-0">
            </TreeNode>
          </TreeNode>
          <TreeNode icon={<Icon type="up-square"/>} title="对上管理" key="0-2">
            <TreeNode title="对上计量台账" key="0-2-0">
            </TreeNode>
          </TreeNode>
          <TreeNode icon={<Icon type="up-square"/>} title="分包商管理" key="0-3">
            <TreeNode title="分包商资质信息" key="0-3-0">
            </TreeNode>
            <TreeNode title="分包商履历" key="0-3-1">
            </TreeNode>
          </TreeNode>
          <TreeNode icon={<Icon type="up-square"/>} title="对下管理" key="0-4">
            <TreeNode title="分包商资质信息" key="0-3-0">
            </TreeNode>
            <TreeNode title="分包商履历" key="0-3-1">
            </TreeNode>
          </TreeNode>*/}
        </Tree>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button style={{
            marginRight: 8,
          }} onClick={onClose} type="primary">
            确认
          </Button>
          <Button
            onClick={onClose}
          >
            取消
          </Button>
        </div>
      </Drawer>
    )
  }
}

@Form.create()
class Permission extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      drawVisible: false,
      pageLoading: true,
      selectedValues:{}
    }
  }

  columns = [
    {
      title: '角色编码',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '最新修改人',
      dataIndex: 'updateUser',
      render: val => <span>没有</span>,
    },
    {
      title: '最新修改时间',
      dataIndex: 'updateTime',
      render: val => <span>没有</span>,
    },
    {
      title: '操作',
      dataIndex: 'operat',
      render: (val, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.showDrawer()}>权限设置</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    // dispatch({
    //   type:'sys_per/queryDetail',
    //   payload:{roleId:3}
    // })
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    dispatch({
      type:'sys_per/query',
      payload:{page:1,pageSize:10}
    })
    /*dispatch({
      type: 'rule/fetch',
    });*/
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
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    console.log(params)
    dispatch({
      type: 'sys_per/query',
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
      type: 'sys_per/query',
      payload: {page:1,pageSize:10},
    });
  };

  handleMenuClick = e => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

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

  handleAdd = (fields, updateModalVisible,selectedValues) => {
    const {dispatch,app:{user}} = this.props;
    if(updateModalVisible){
      dispatch({
        type: 'sys_per/updateRole',
        payload: {
          id:selectedValues.id,
          name: fields.roleName,
          description:'用于公司管理项目角色'
        },
        token:user.token,
        callback:this.handleUpdateModalVisible
      })
      dispatch({
        type:'sys_per/query',
        payload:{page:1,pageSize:10}
      })
    }else {
     dispatch({
        type: 'sys_per/addRole',
        payload: {
          name: fields.roleName,
          description:'用于公司管理项目角色'
        },
        token:user.token,
       callback:this.handleModalVisible
      })
    }
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
            <FormItem label="角色名称">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
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

  showDrawer = () => {
    this.setState({
      drawVisible: true,
    });
  };

  onDrawClose = () => {
    this.setState({
      drawVisible: false,
    });
  }

  render() {
    const {
      sys_per:{data},
      loading,
    } = this.props;
    const {selectedRows, modalVisible, pageLoading,updateModalVisible,selectedValues} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">权限设置</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible:this.handleUpdateModalVisible
    };
    const parentState = {
      updateModalVisible:updateModalVisible,
      modalVisible:modalVisible,
      selectedValues:selectedValues
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="权限管理">
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
                rowKey="id"
                loading={loading.effects['sys_per/query']}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} {...parentState}/>
        </PageHeaderWrapper>
        <CreatDrawer onClose={this.onDrawClose} drawVisible={this.state.drawVisible}/>
      </Page>
    )
  }
}

Permission.propTypes = {}

export default connect(({app, rule,sys_per, loading}) => ({app, rule,sys_per, loading}))(Permission)
