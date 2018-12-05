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
  Badge,
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut} from "utils";
import {proTypes} from 'common/menu'

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'error'];
const status = ['启用', '禁用'];

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, handleUpdateModalVisible, updateModalVisible, selectedValues} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handleAdd(fieldsValue, updateModalVisible,selectedValues);
    });
  };
  // console.log(selectedValues)
  return (
    <Modal
      destroyOnClose
      title={updateModalVisible ? "编辑项目" : "新增项目"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目名称">
        {form.getFieldDecorator('name', {
          rules: [{required: true, message: '项目名不能为空',}],
          initialValue: selectedValues.name ? selectedValues.name : ''
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="工程类别">
        {form.getFieldDecorator('proType', {
          rules: [{required: true, message: '请选择工程类别'}],
          initialValue: selectedValues.projectType ? selectedValues.projectType : ''
        })(<Select placeholder="请选择" style={{width: '100%'}}>
          {proTypes.map((item, index) => {
            return <Option key={index} value={item.id}>{item.value}</Option>
          })}
        </Select>)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class Project extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      pageLoading: true,
      selectedValues: {}
    }
  }

  columns = [
    {
      title: '项目编码',
      dataIndex: 'code',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '工程类别',
      dataIndex: 'projectType',
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
        }
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
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '最新修改人',
      dataIndex: 'updateUser'
    },
    {
      title: '最新修改时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={()=>this.updateStatus({id:record.id,status:record.status==0?1:0})}>{record.status==0?'禁用':'启用'}</a>
          </Fragment>
        )
      },
    },
  ];

  componentDidMount() {
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    this.getList()
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

  handleAdd = (fields, updateModalVisible,selectedValues) => {
    const {dispatch, app: {user}} = this.props;
    if (updateModalVisible) {
      dispatch({
        type: 'sys_pro/updatePro',
        payload: {
          name: fields.name,
          dictId: fields.proType,
          id: selectedValues.id
        },
        token: user.token,
        callback: this.handleUpdateModalVisible,
        callback2:this.getList
      });
    } else {
      dispatch({
        type: 'sys_pro/addPro',
        payload: {
          name: fields.name,
          dictId: fields.proType
        },
        token: user.token,
        callback: this.handleModalVisible,
        callback2:this.getList
      });
    }
  };

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目编码">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目状态">
              {getFieldDecorator('desc')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">禁用</Option>
                  <Option value="1">启用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">禁用</Option>
                  <Option value="1">启用</Option>
                </Select>
              )}
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
    return this.renderSimpleForm();
  }

  updateStatus= payload =>{
    this.props.dispatch(
      {
        type: 'sys_pro/updateProStatus',
        payload: payload,
        token:this.props.app.user.token
      }
    ).then(res=>{
      if(res) {
        this.getList()
      }
    })
  }

  render() {
    const {
      loading,
      sys_pro:{data}
    } = this.props;
    //console.log(loading)
    const {selectedRows, modalVisible, pageLoading, updateModalVisible, selectedValues} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">禁用</Menu.Item>
        <Menu.Item key="approval">启用</Menu.Item>
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
        <PageHeaderWrapper title="项目管理">
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
                loading={loading.effects['sys_pro/queryProList']}
                data={data}
                rowKey="id"
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

  getList=(page=1,pageSize=10)=>{
    this.props.dispatch({
      type: 'sys_pro/queryProList',
      payload: {page: page, pageSize: pageSize}
    });
  }
}

Project.propTypes = {}

export default connect(({app, rule, sys_pro, loading}) => ({app, rule, sys_pro, loading}))(Project)
