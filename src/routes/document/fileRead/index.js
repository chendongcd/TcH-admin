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
import {Page, PageHeaderWrapper, StandardTable, PreFile} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, QiNiuOss, ImageUrl,getPage} from "utils";
const FormItem = Form.Item;
const {Option} = Select;
const pageButtons = getPage('11').buttons.map(a => a.permission)
const testValue = ''

@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      progress: 0
    };
    this.upload = null
  }

  componentDidUpdate(preProp, preState) {
    if (!preProp.selectedValues.annexUrl && this.props.selectedValues.annexUrl && this.state.fileList.length == 0) {
      let pdf = JSON.parse(this.props.selectedValues.annexUrl)
      let file = {
        uid: '-1',
        name: pdf.fileName,
        status: 'done',
        url: pdf.url,
      }
      this.setState({fileList: [file]})
    }
  }

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //form.resetFields();
      fieldsValue.annexUrl = `{"url":"${this.state.fileList[0].url}","fileName":"${this.state.fileList[0].name}"}`
      handleAdd(fieldsValue, updateModalVisible, selectedValues,this.cleanState);
    });
  };

  cleanState=()=>{
    this.setState({fileList:[]})
  }

  componentWillUnmount() {
    this.upload = null
  }

  handleChange = ({fileList}) => {
    this.setState({fileList})
  }

  render() {
    const {modalVisible, checkDetail ,loading,handleCheckDetail,form, handleModalVisible, normFile, handleUpdateModalVisible, updateModalVisible, selectedValues} = this.props;

    let {fileList, progress} = this.state

    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '文档详情' :updateModalVisible ? "编辑文档" : "新增文档"}
        visible={modalVisible}
        okButtonProps={{loading:loading}}
        onOk={()=>checkDetail ? handleCheckDetail():this.okHandle()}
        onCancel={() => {
          this.cleanState()
          checkDetail ? handleCheckDetail() :updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()
        }
        }
      >
        <div className={styles.modalContent}>
          <Row gutter={12}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="文档名称">
                {form.getFieldDecorator('name', {
                  rules: [{required: true, message: '项目名不能为空',}],
                  initialValue: selectedValues.name ? selectedValues.name : testValue
                })(<Input disabled={checkDetail} placeholder="请输入"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="文件类型">
                {form.getFieldDecorator('fileType', {
                  rules: [{required: true, message: '请选择文件类型'}],
                  initialValue: selectedValues.fileType ? selectedValues.fileType : ''
                })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                  <Option value="管理办法">管理办法</Option>
                  <Option value="通知">通知</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
                {form.getFieldDecorator('annexUrl', {
                  rules: [{required: true, message: '请上传附件'}],
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.annexUrl ? [selectedValues.annexUrl] : [],
                })(
                  <Upload.Dragger
                    onChange={this.handleChange}
                    showUploadList={false}
                    // fileList={fileList}
                    listType="picture"
                    name="files"
                    disabled={fileList.length > 0||checkDetail}
                    onSuccess={this.onSuccess}
                    handleManualRemove={this.remove}
                    onError={this.onError}
                    onProgress={this.onProgress}
                    customRequest={this.onUpload}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <PreFile disabled={checkDetail} noImage={true} onClose={this.remove} progress={progress} file={fileList[0]}/>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue
                })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

  onUpload = (params) => {
    QiNiuOss(params).then(res => {
      this.upload = res
    })
  }

  onProgress = (e) => {
    this.setState({progress: parseInt(e.total.percent)})
  }

  onError = (error) => {
    console.log('上传失败', error)
  }

  onSuccess = (res) => {
    //this.state.fileList.push(ImageUrl+res.key)
    let file = {
      uid: '-1',
      name: this.state.fileList[0].name,
      status: 'done',
      url: ImageUrl + res.key,
      type: this.state.fileList[0].type
    }
    this.setState({fileList: [file]})
    this.props.form.setFieldsValue({annexUrl: [file]});
  }

  remove = (res) => {
    if (res.status == 'done') {
      this.props.form.setFieldsValue({annexUrl: []});
    } else {
      if(this.upload&&this.upload.unsubscribe) {
        this.upload.unsubscribe()
      }
    }
    this.setState({fileList: []})
  }
}

@Form.create()
class FileRead extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      selectedValues: {},
      checkDetail: false
    }
    this.exportParams = {
      page: 1,
      pageSize: 10
    }
  }

  columns = [
    {
      title: '序号',
      width:100,
      dataIndex: 'ids',
    },
    {
      title: '文件名称',
      width:180,
      dataIndex: 'name',
    },
    {
      title: '文件类型',
      width:100,
      dataIndex: 'fileType',
    },
    {
      title: '创建时间',
      width:180,
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '下载附件',
      dataIndex: 'annexUrl',
      width:100,
      render: (val) => {
        let href = ''
        let annex = JSON.parse(val)
        href = annex.url + '?attname=' + annex.fileName
        return (
          <Fragment>
            <a href={href} download={'附件'}>下载附件</a>
          </Fragment>
        )
      }
    },
    {
      title: '操作',
      render: (val, record) => {
        if (record.ids === '合计:') {
          return null
        }
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?

                <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
               : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ?
                <a  onClick={() => this.handleCheckDetail(true, record)}>查看</a>
               : null}
          </Fragment>
        )
      }
    }
  ];

  componentDidMount() {
    this.getList()
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchList(null,pagination.current, pagination.pageSize)
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

  handleCheckDetail = (flag, record) => {
    this.setState({
      checkDetail: !!flag,
      modalVisible: !!flag,
      selectedValues: record || {},
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      modalVisible: !!flag,
      selectedValues: record || {},
    });
  };

  handleAdd = (fieldsValue, updateModalVisible, selectedValues,cleanState) => {
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
      remark: fieldsValue.remark
    }
    if (updateModalVisible) {
      dispatch({
        type: 'fileRead/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.searchList(false,this.exportParams.page,this.exportParams.pageSize)
          cleanState()
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
          cleanState()
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
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const {
      fileRead: {data},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, selectedValues, pageLoading,checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      normFile: this.normFile,
      handleCheckDetail:this.handleCheckDetail
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail:checkDetail,
      loading:loading.effects[`fileRead/${updateModalVisible?'update':'add'}`]
    }
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="文件阅览">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['fileRead/fetch']}
                data={data}
                scroll={{y: global._scollY}}
                bordered
                rowKey={'ids'}
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

  searchList = (e,page = 1, pageSize = 10) => {
    e&&e.preventDefault?e.preventDefault():null
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let payload = {
        page: page,
        pageSize: pageSize,
        fileName: fieldsValue.name,
        fileType: fieldsValue.fileType,
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'fileRead/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

FileRead.propTypes = {}

export default connect(({app,loading, fileRead}) => ({app, loading, fileRead}))(FileRead)
