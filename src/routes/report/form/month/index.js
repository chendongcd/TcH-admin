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
  DatePicker,
  Modal, Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, CustomPicker} from 'components'
import styles from './index.less'
import {getButtons, cleanObject} from 'utils'
import {menuData} from 'common/menu'
import {ENGINEER_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const {Option} = Select;
const pageButtons = menuData[25].buttons.map(a => a.permission)
const testValue = ''


@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(preProp, preState) {
  }

  okHandle = () => {
    const {form, handleAdd, updateModalVisible, selectedValues} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.reportTime = fieldsValue.reportTime.format('YYYY-MM-DD')
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  cleanState = () => {
  }

  componentWillUnmount() {
  }

  setType = (item) => {
    let {form} = this.props
    console.log(item)
    form.setFieldsValue({'projectType': item.projectType})
  }

  render() {
    const {proNames,  modalVisible, loading, form, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail} = this.props;
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '工程变更索赔月快报表' : updateModalVisible ? "编辑工程变更索赔月快报表" : "新增工程变更索赔月快报表"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
        okButtonProps={{loading: loading}}
        maskClosable={false}
        onOk={() => checkDetail ? handleCheckDetail() : this.okHandle()}
        onCancel={() => {
          this.cleanState()
          checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()
        }}
      >
        <div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="项目名称">
                {form.getFieldDecorator('projectId', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : '',
                })(<Select className={styles.customSelect}
                           showSearch={true}
                           optionFilterProp={'name'}
                           onSelect={(value, item) => this.setType(item.props.item)}
                           disabled={checkDetail}
                           style={{width: '100%'}}>
                  {proNames.map((item, index) => {
                    return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工程类别">
                {form.getFieldDecorator('projectType', {
                  rules: [{required: true, message: '请选择项目'}],
                  initialValue: selectedValues.projectType ? selectedValues.projectType : '',
                })(<Input disabled={true} placeholder={'自动带出'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="填报日期">
                {form.getFieldDecorator('reportTime', {
                  rules: [{required: true, message: '请选择填报日期'}],
                  initialValue: selectedValues.reportTime ? moment(selectedValues.reportTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="施工产值">
                {form.getFieldDecorator('constructionOutputValue', {
                  rules: [{required: true, message: '请输入施工产值'}],
                  initialValue: selectedValues.constructionOutputValue ? selectedValues.constructionOutputValue : '',
                })(<Input disabled={checkDetail} style={{marginTop:4}} addonAfter={'万'} placeholder={'请输入施工产值'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="变更索赔额">
                {form.getFieldDecorator('changeClaimAmount', {
                  rules: [{required: true, message: '请输入变更索赔额'}],
                  initialValue: selectedValues.changeClaimAmount ? selectedValues.changeClaimAmount : '',
                })(<Input disabled={checkDetail} style={{marginTop:4}} addonAfter={'万'} placeholder={'请输入变更索赔额'}/>)}
              </FormItem>
            </Col>
          </Row>
          {checkDetail?<Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="合同金额">
                {form.getFieldDecorator('temporarilyPrice', {
                  initialValue: selectedValues.temporarilyPrice ? selectedValues.temporarilyPrice : '',
                })(<Input disabled={checkDetail} style={{marginTop:4}} addonAfter={'万'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="变更索赔率">
                {form.getFieldDecorator('percentage', {
                  initialValue: selectedValues.percentage ? selectedValues.percentage : '',
                })(<Input disabled={true} style={{marginTop:4}} addonAfter={'%'}/>)}
              </FormItem>
            </Col>
          </Row>:null}
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false}],
                  initialValue: selectedValues.remark ? selectedValues.remark : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

}

@Form.create()
class ReportForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      selectedValues: {},
      checkDetail: false,
    }
    this.exportParams = {
      page: 1,
      pageSize: 10
    }
    this.CustomPicker = null
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      fixed: 'left',
      width: 80
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      fixed: 'left',
      width: 180
    },
    {
      title: '工程类别',
      dataIndex: 'projectType',
      fixed: 'left',
      width: 100
    },
    {
      title: '填报日期',
      dataIndex: 'reportTime',
      width: 100,
      render(val) {
        return <span>{val ? moment(val).format('YYYY/MM') : ''}</span>;
      }
    },
    {
      title: '原合同额(万)',
      dataIndex: 'temporarilyPrice',
      width: 180
    },
    {
      title: '施工产值(万)',
      dataIndex: 'constructionOutputValue',
      width: 180
    },
    {
      title: '变更索赔额(万)',
      dataIndex: 'changeClaimAmount',
      width: 180
    },
    {
      title: '变更索赔率',
      dataIndex: 'percentage',
      width: 180,
      render:(val)=>{
        return<span>{isNaN(val)?'':(val*100).toFixed(2)}</span>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      width: 110,
      fixed: 'right',
      render: (val, record) => {
        if (record.id == '合计:') {
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
              <Fragment>
                <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
                <Divider type="vertical"/>
              </Fragment> : null}
            {getButtons(button, pageButtons[2]) ?
              <Fragment>
                <a onClick={() => this.handleCheckDetail(true, record)}>查看</a>
              </Fragment> : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    if (this.props.app.user.token) {
      this.getProNames([])
      this.getList()
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchList(null, pagination.current, pagination.pageSize)
  };

  handleFormReset = () => {
    const {form} = this.props;
    this.CustomPicker.resetValue()
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getList()
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

  handleExportModalVisible = (flag = false) => {
    this.setState({
      exportModalVisible: !!flag,
    });
  }

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

  handleAdd = (fields, updateModalVisible, selectedValues, cleanState) => {
    const {dispatch, app: {user}} = this.props;
    const payload = {
      projectId: fields.projectId,
      projectType: fields.projectType,
      reportTime: fields.reportTime,
      constructionOutputValue: fields.constructionOutputValue,
      changeClaimAmount: fields.changeClaimAmount,
      remark: fields.remark,
    }
    console.log(payload)
    if (updateModalVisible) {
      dispatch({
        type: 'reportForm/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res => {
        if (res) {
          this.handleUpdateModalVisible()
          this.getList()
          cleanState()
        }
      })
    } else {
      dispatch({
        type: 'reportForm/add',
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

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.searchList} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName', {})(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="填报日期">
              {getFieldDecorator('year', {
                initialValue: null
              })(<CustomPicker ref={(e) => this.CustomPicker = e} topMode="year" setValue={this.setYear}
                               placeholder={'年'} format="YYYY" style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('quarter', {})(<Select placeholder="季度" style={{width: '70%'}}>
                <Option value={1}>第一季度</Option>
                <Option value={2}>第二季度</Option>
                <Option value={3}>第三季度</Option>
                <Option value={4}>第四季度</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
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

  setYear = (value) => {
    this.props.form.setFieldsValue({'year': value})
  }

  renderForm() {
    return this.renderAdvancedForm()
  }

  render() {
    const {
      reportForm: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, pageLoading, selectedValues, checkDetail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      loading: loading.effects[`reportForm/${updateModalVisible ? 'update' : 'add'}`],
    }
    const exportUrl = createURL(ENGINEER_EXPORT, {
      ...this.exportParams, ...{
        token: user.token}
    })


    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="合同外赔偿情况统计表">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button href={exportUrl} icon="export" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['reportForm/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: '150%', y: global._scollY}}
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
          type: 'reportForm/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'reportForm/fetch',
      payload: {page: page, pageSize: pageSize},
      token: this.props.app.user.token
    });
  }

  searchList = (e, page = 1, pageSize = 10) => {
    e && e.preventDefault ? e.preventDefault() : null
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let payload = {
        page: page,
        pageSize: pageSize,
        projectName: fieldsValue.projectName,
        year: fieldsValue.year ? fieldsValue.year.format('YYYY') : null,
        quarter: fieldsValue.quarter,
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'reportForm/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

ReportForm.propTypes = {}

export default connect(({app, loading, reportForm}) => ({app, loading, reportForm}))(ReportForm)
