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
  Collapse,
  Spin
} from 'antd';
import {arrayToTree, _setTimeOut, getButtons} from 'utils'
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
  const {modalVisible, form, handleAdd, handleModalVisible, handleUpdateModalVisible, updateModalVisible, selectedValues} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={updateModalVisible ? "编辑角色" : "新增角色"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色名称">
        {form.getFieldDecorator('roleName', {
          rules: [{required: true, message: '请输入角色名称'}],
          initialValue: selectedValues.name ? selectedValues.name : ''
        })(<Input placeholder="请输入"/>)}
      </FormItem>
    </Modal>
  );
});
const pageButtons = menuData[3].buttons.map(a=>a.permission)

class CreatDrawer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      checkedKeys: [],
      buttons: []
    }
    this.resouces = []
  }

  componentDidUpdate(prevProps, preState) {
    // console.log(prevProps.selectedValues)
    if (!prevProps.selectedValues.resouces && this.props.selectedValues.resouces) {
      ///this.setState({checkStrictly:false})
      this.setState({checkedKeys: this.props.selectedValues.resouces})
    }
  }

  onCheck = (checkedKeys, info) => {
    // this.resouces=[...checkedKeys,...info.halfCheckedKeys]
    // console.log(info)
    // console.log(checkedKeys)
    this.resouces = checkedKeys.checked
    this.setState({checkedKeys})
  }

  renderSubTree = (trees) => {
    return trees.children ? trees.children.map((tree, index) => {
      return (<TreeNode selectable={false} title={tree.name} key={tree.permission}>
        {this.renderButton(tree.buttons)}
      </TreeNode>)
    }) : null
  }

  renderButton = (buttons = []) => {
    return buttons.map((button, index) => {
      return <TreeNode selectable={false} title={button.name} key={button.permission}/>
    })
  }

  renderTree = (menuTree) => {
    return menuTree.map((a, aIndex) => {
      return (
        <TreeNode selectable={false} item={[]} icon={<Icon type={a.icon}/>} title={a.name} key={a.permission}>
          {this.renderSubTree(a)}
        </TreeNode>
      )
    })
  }

  onCertain = (setPermission, selectedValues) => {
    //console.log(this.resouces)
    const res = this.resouces.length == 0 ? selectedValues.resouces : this.resouces
    setPermission({id: selectedValues.id, resouces: res.map(a => JSON.parse(`{"permission":"${a}"}`))})
    this.setState({checkedKeys: []})
  }

  _onClose = (onClose) => {
    onClose()
    this.setState({checkedKeys: []})
  }

  render() {
    const {onClose, drawVisible, selectedValues, setPermission} = this.props
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
    // 生成树状
    const menuTree = arrayToTree(menuData.filter(_ => (_.mpid !== '-1' && _.id !== '1')), 'id', 'mpid')
    // console.log()
    return (
      <Drawer
        width={440}
        title="权限设置"
        placement="right"
        closable={false}
        onClose={() => this._onClose(onClose)}
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
                <DescriptionItem title="角色名称" content={selectedValues.name}/>{' '}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="最新修改时间" content="没有"/>
              </Col>
              {' '}
              <Col span={12}>
                <DescriptionItem title="最新修改人" content="没有"/>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="创建时间" content={moment(selectedValues.createdTime).format('YYYY-MM-DD')}/>
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
        <Divider style={{marginTop: 0, marginBottom: 0}}/>
        <Spin style={{flex: 1, marginBottom: 53 + 'px', overflow: 'scroll', flexDirection: 'row'}}
              spinning={!selectedValues.resouces} tip="加载中">
          <Tree
            checkable
            showIcon
            checkStrictly
            checkedKeys={this.state.checkedKeys}
            onCheck={this.onCheck}
            // style={{marginBottom: 53 + 'px', overflow: 'scroll'}}
          >
            {this.renderTree(menuTree)}
          </Tree>
        </Spin>
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
          <Button disabled={!selectedValues.resouces} style={{
            marginRight: 8,
          }} onClick={() => this.onCertain(setPermission, selectedValues)} type="primary">
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
      selectedValues: {}
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
      render: (val, record) => {
        const button = this.props.app.user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[3]) ?
              <a onClick={() => this.showDrawer(record)}>权限设置</a> : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    this.getList()
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
    dispatch({
      type: 'sys_per/query',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.getList()
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

  handleAdd = (fields, updateModalVisible, selectedValues) => {
    const {dispatch, app: {user}} = this.props;
    if (updateModalVisible) {
      dispatch({
        type: 'sys_per/updateRole',
        payload: {
          id: selectedValues.id,
          name: fields.roleName,
          description: '用于公司管理项目角色'
        },
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.getList()
        }
      })
    } else {
      dispatch({
        type: 'sys_per/addRole',
        payload: {
          name: fields.roleName,
          description: '用于公司管理项目角色'
        },
        token: user.token,
        callback: this.handleModalVisible
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
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('searchName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button onClick={() => this.searchList()} type="primary" htmlType="submit">
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

  showDrawer = (value) => {
    this.setState({
      drawVisible: true,
      selectedValues: value
    });
    this.getRoleDetail(value.id)
  };

  onDrawClose = () => {
    this.setState({
      drawVisible: false,
      selectedValues: {}
    });
  }

  setPermission = (payload) => {
    // console.log(payload)
    this.props.dispatch({
      type: 'sys_per/updateRolePer',
      payload: payload,
      token: this.props.app.user.token,
      callback: this.onDrawClose
    })
  }

  getRoleDetail = (id = 2) => {
    this.props.dispatch({
      type: 'sys_per/queryDetail',
      payload: {roleId: id}
    }).then(res => {
      if (res) {
        res.resouces = res.resouces.map(a => a.permission)
        //console.log(res.resouces)
        this.setState({
          selectedValues: res
        });
      } else {
        this.setState({
          selectedValues: []
        });
      }
    })
  }

  render() {
    const {
      sys_per: {data},
      loading,
      app:{user}
    } = this.props;
    const {selectedRows, modalVisible, pageLoading, updateModalVisible, selectedValues} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">权限设置</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="权限管理">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
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
        <CreatDrawer setPermission={this.setPermission} selectedValues={selectedValues} onClose={this.onDrawClose}
                     drawVisible={this.state.drawVisible}/>
      </Page>
    )
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'sys_per/query',
      payload: {page: page, pageSize: pageSize}
    });
  }

  searchList = (page = 1, pageSize = 10) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      this.props.dispatch({
        type: 'sys_per/query',
        payload: {page: page, pageSize: pageSize, name: fieldsValue.searchName}
      });
    });
  }
}

Permission.propTypes = {}

export default connect(({app, rule, sys_per, loading}) => ({app, rule, sys_per, loading}))(Permission)
