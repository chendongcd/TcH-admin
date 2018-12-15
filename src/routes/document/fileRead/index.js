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
  Modal,
  Upload,
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut, getButtons, cleanObject} from "utils";
import {menuData} from "../../../common/menu";

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const pageButtons = menuData[21].buttons.map(a => a.permission)
const testValue = '123'
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, selectedValues,} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      fieldsValue.annexUrl = testPDF
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={updateModalVisible ? "编辑文档" : "新增文档"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="文档名称">
              {form.getFieldDecorator('name', {
                rules: [{required: true, message: '项目名不能为空',}],
                initialValue: selectedValues.name ? selectedValues.name : testValue
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="文件类型">
              {form.getFieldDecorator('fileType', {
                rules: [{required: true, message: '请选择文件类型'}],
                initialValue: selectedValues.fileType ? selectedValues.fileType : ''
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="管理办法">管理办法</Option>
                <Option value="通知">通知</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
              {form.getFieldDecorator('annexUrl', {
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
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [{required: false}],
                initialValue:selectedValues.remark?selectedValues.remark:testValue
              })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

@Form.create()
class FileRead extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: true,
      selectedValues: {},
      checkDetail: false
    }
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'code',
    },
    {
      title: '文件名称',
      dataIndex: 'name',
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '操作',
      render: (val, record) => {
        const user = this.props.app.user
        if(!user.token){
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <Fragment>
                <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
                <Divider type="vertical"/>
              </Fragment>: null}
            <a>下载附件</a>
          </Fragment>
        )
      }
    }
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
    const {form} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
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

  handleAdd = (fieldsValue, updateModalVisible, selectedValues) => {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    const {dispatch, app: {user}} = this.props;
    const payload = {
      name: fieldsValue.name,
      fileType: fieldsValue.fileType,
      annexUrl: fieldsValue.annexUrl,
      remark:fieldsValue.remark
    }
    if (updateModalVisible) {
      dispatch({
        type: 'fileRead/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.getList()
        }
      })
    } else {
      dispatch({
        type: 'fileRead/add',
        payload: payload,
        token: user.token
      }).then(res => {
        if (res) {
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
      <Form onSubmit={this.searchList} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="文件名称">
              {getFieldDecorator('name')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="文件类型">
              {getFieldDecorator('fileType')(<Select style={{width: '100%'}}>
                <Option value="管理办法">管理办法</Option>
                <Option value="通知">通知</Option>
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
    return this.renderSimpleForm();
  }

  render() {
    const {
      fileRead: {data},
      loading,
      app:{user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, selectedValues, pageLoading} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="文件阅览">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token&&getButtons(user.permissionsMap.button,pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
            </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['fileRead/fetch']}
                data={data}
                bordered
                rowKey ={'id'}
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
      type: 'fileRead/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e, page = 1, pageSize = 10) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let payload = {
        page: page,
        pageSize: pageSize,
        fileName: fieldsValue.name,
        fileType: fieldsValue.fileType,
      }
      cleanObject(payload)
      this.props.dispatch({
        type: 'fileRead/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

FileRead.propTypes = {}

export default connect(({app, rule, loading, fileRead}) => ({app, rule, loading, fileRead}))(FileRead)
