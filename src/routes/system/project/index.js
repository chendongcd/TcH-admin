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
  Button,
  Modal,
  Badge,
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {getButtons,cleanObject} from "utils";
import {proTypes,menuData} from 'common/menu'
import {SYS_PRO_EXPORT} from 'common/urls'
import { createURL} from 'services/app'
const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'error'];
const status = ['启用', '禁用'];
const pageButtons = menuData[2].buttons.map(a=>a.permission)
const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, handleUpdateModalVisible, updateModalVisible, selectedValues} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
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
          initialValue: selectedValues.dictId ? selectedValues.dictId: ''
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
      pageLoading: false,
      selectedValues: {}
    }
    this.exportParams = {
      page:1,
      pageSize:10
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
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUserStr',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '最新修改人',
      dataIndex: 'updateUserStr'
    },
    {
      title: '最新修改时间',
      dataIndex: 'updateTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render: (val, record) => {
        const user = this.props.app.user
        if(!user.token){
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button,pageButtons[1])?<a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>:null}
            <Divider type="vertical"/>
            {getButtons(button,pageButtons[2])&&record.status == 1? <a onClick={() => this.updateStatus({
              id: record.id,
              status: 0
            })}>启用</a>:null}
            {getButtons(button,pageButtons[3])&&record.status == 0? <a onClick={() => this.updateStatus({
              id: record.id,
              status: 1
            })}>禁用</a>:null}
          </Fragment>
        )
      },
    },
  ];

  componentDidMount() {
   // _setTimeOut(() => this.setState({pageLoading: false}), 1000)
      this.getList()
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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

   this.getList(...params)
  };

  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.getList()
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

  handleAdd = (fields, updateModalVisible, selectedValues) => {
    const {dispatch, app: {user}} = this.props;
    if (updateModalVisible) {
      dispatch({
        type: 'sys_pro/updatePro',
        payload: {
          name: fields.name,
          dictId: fields.proType,
          id: selectedValues.id
        },
        token: user.token
      }).then(res=>{
        if(res){
          this.handleUpdateModalVisible()
          this.getList()
        }
      })
    } else {
      dispatch({
        type: 'sys_pro/addPro',
        payload: {
          name: fields.name,
          dictId: fields.proType
        },
        token: user.token
      }).then(res=>{
        if(res){
          this.handleModalVisible()
          this.getList()
        }
      })
    }
  };

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="项目编码">
              {getFieldDecorator('code', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName', {
                initialValue: null
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目状态">
              {getFieldDecorator('status', {
                initialValue: null
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="1">禁用</Option>
                  <Option value="0">启用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'right', marginBottom: 24}}>
            <Button onClick={()=>this.searchList()} type="primary" htmlType="submit">
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

  updateStatus = payload => {
    this.props.dispatch(
      {
        type: 'sys_pro/updateProStatus',
        payload: payload,
        token: this.props.app.user.token
      }
    ).then(res => {
      if (res) {
        this.getList()
      }
    })
  }

  render() {
    const {
      loading,
      sys_pro: {data},
      app:{user}
    } = this.props;
    //console.log(loading)
    const {selectedRows, modalVisible, pageLoading, updateModalVisible, selectedValues} = this.state;
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
    const exportUrl = createURL(SYS_PRO_EXPORT,{...this.exportParams,...{token:user.token}})

    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="项目管理">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token&&getButtons(user.permissionsMap.button,pageButtons[0])? <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>:null}
                {user.token&&getButtons(user.permissionsMap.button,pageButtons[4])? <Button href={exportUrl} icon="plus" type="primary">
                  导出
                </Button>:null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['sys_pro/queryProList']}
                data={data}
                rowKey="id"
                scroll={{x: '120%'}}
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

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'sys_pro/queryProList',
      payload: {page: page, pageSize: pageSize}
    });
  }

  searchList = (page = 1, pageSize = 10) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        code:fieldsValue.code,
        status:fieldsValue.status
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'sys_pro/queryProList',
        payload: payload
      });

    });
  }
}

Project.propTypes = {}

export default connect(({app, rule, sys_pro, loading}) => ({app, rule, sys_pro, loading}))(Project)
