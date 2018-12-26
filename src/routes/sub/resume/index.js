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
  Modal,
  Divider,
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {getButtons, cleanObject} from "utils";
import {menuData} from 'common/menu'

import {SUB_RES_EXPORT} from 'common/urls'
import {createURL} from 'services/app'

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const testValue = ''

const pageButtons = menuData[11].buttons.map(a => a.permission)

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail, subNames, teamList, proNames} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
        }
      }
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={checkDetail ? '分包履历' : updateModalVisible ? "编辑分包履历" : "新增分包履历"}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={() => checkDetail ? handleCheckDetail() : okHandle()}
      onCancel={() => checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="分包商名称">
              {form.getFieldDecorator('subcontractorId', {
                rules: [{required: true, message: '请选择项目'}],
                initialValue: selectedValues.subcontractorId ? selectedValues.subcontractorId : '',
              })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                         disabled={checkDetail} placeholder="请选择"
                         style={{width: '100%'}}>
                {subNames.map((item, index) => {
                  return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="开始日期">
              {form.getFieldDecorator('startTime', {
                rules: [{required: true, message: '请选择开始日期'}],
                initialValue: selectedValues.startTime ? moment(selectedValues.startTime) : null
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="结束日期">
              {form.getFieldDecorator('endTime', {
                rules: [{required: true, message: '请选择结束日期'}],
                initialValue: selectedValues.endTime ? moment(selectedValues.endTime) : null
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 12}} label="该时间段所属项目部">
              {form.getFieldDecorator('projectId', {
                rules: [{required: true, message: '请选择项目'}],
                initialValue: selectedValues.projectId ? selectedValues.projectId : '',
              })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                         onChange={this.onChange} disabled={checkDetail}
                         placeholder="请选择" style={{width: '100%'}}>
                {proNames.map((item, index) => {
                  return <Option key={item.id} item={item} name={item.name} value={item.id}>{item.name}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目部队伍名称">
              {form.getFieldDecorator('laborAccountId', {
                rules: [{required: true, message: '请输入项目部队伍名称'}],
                initialValue: selectedValues.laborAccountId ? selectedValues.laborAccountId : ''
              })(<Select className={styles.customSelect} showSearch={true} optionFilterProp={'name'}
                         onChange={this.onChange} disabled={checkDetail}
                         placeholder="请选择" style={{width: '100%'}}>
                {teamList.map((item, index) => {
                  return <Option key={item.id} item={item} name={item.teamName} value={item.id}>{item.teamName}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="施工规模">
              {form.getFieldDecorator('constructionScale', {
                rules: [{required: true, message: '请选择施工规模'}],
                initialValue: selectedValues.constructionScale ? selectedValues.constructionScale : testValue
              })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                         style={{width: '100%'}}>
                <Option value="项目1">项目1</Option>
                <Option value="项目2">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const CreateReview = Form.create()(props => {
  const {modalVisible, form, handleReview, handleReviewModal, selectedValues} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleReview(fieldsValue, selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title='项目部信誉评价'
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleReviewModal()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 10}} label="信誉评价">
              {form.getFieldDecorator('projectEvaluation', {
                rules: [{required: true, message: '请选择'}],
                initialValue: selectedValues.projectEvaluation ? selectedValues.projectEvaluation : ''
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="优秀">优秀</Option>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 10}} label="集团公司信誉评价">
              {form.getFieldDecorator('groupEvaluation', {
                rules: [{required: true, message: '请选择'}],
                initialValue: selectedValues.groupEvaluation ? selectedValues.groupEvaluation : ''
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="合格">合格</Option>
                <Option value="不合格">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft: 21 + 'px'}} labelCol={{span: 3}} wrapperCol={{span: 15}} label="文字评价">
              {form.getFieldDecorator('projectDescription', {
                rules: [{required: true, message: '请输入文字评价'}],
                initialValue: selectedValues.projectDescription ? selectedValues.projectDescription : ''
              })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

@Form.create()
class Resume extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      reviewType: false,
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
      title: '分包商备案编码',
      dataIndex: 'code',
    },
    {
      title: '分包商全称',
      dataIndex: 'subcontractorName',
    },
    {
      title: '队伍名称',
      dataIndex: 'teamName',
    },
    {
      title: '施工规模',
      dataIndex: 'constructionScale'
    },
    {
      title: '开始日期',
      dataIndex: 'startTime',
      render(val) {
        return <span>{moment(val).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '结束日期',
      dataIndex: 'endTime',
      render(val) {
        return <span>{moment(val).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '该时间段所属项目部',
      dataIndex: 'projectName'
    },
    {
      title: '合同签订人',
      dataIndex: 'contractPerson',
    },
    {
      title: '合同签订人联系方式',
      dataIndex: 'phone'
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount',
    },
    {
      title: '结算金额',
      dataIndex: 'settlementAmount',
    },
    {
      title: '项目部评价',
      dataIndex: 'projectEvaluation',
    },
    {
      title: '文字评价',
      dataIndex: 'projectDescription',
    },
    {
      title: '操作',
      render: (val, record) => {
        const user = this.props.app.user
        if (!user.token) {
          return null
        }
        const button = user.permissionsMap.button
        return (
          <Fragment>
            {getButtons(button, pageButtons[1]) ?
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ?
              <a onClick={() => this.handleCheckDetail(true, record)}>查看</a> : null}
            {getButtons(button, pageButtons[4]) ? <Fragment>
              <Divider type="vertical"/>
              <a onClick={() => this.handleReviewModal(true, record)}>项目部评价</a>
            </Fragment> : null}
            {/* {getButtons(button,pageButtons[3])? <a>导出</a>:null}*/}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    if (this.props.app.user.token) {
      this.getSubNames()
      this.getTeamNames()
      this.getProNames()
      this.getList()
    }
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

  handleReviewModal = (flag, record = {}) => {
    this.setState({
      reviewType: !!flag,
      selectedValues: record
    })
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

  handleAdd = (fields, updateModalVisible, selectedValues) => {
    const {dispatch, app: {user}} = this.props;
    const payload = {
      projectId: fields.projectId,
      subcontractorId: fields.subcontractorId,
      startTime: fields.startTime,
      endTime: fields.endTime,
      laborAccountId: fields.laborAccountId,
      constructionScale: fields.constructionScale,
    }
    if (updateModalVisible) {
      dispatch({
        type: 'sub_resume/update',
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
        type: 'sub_resume/add',
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

  handleReview = (fields, selectedValues) => {

    const {dispatch, app: {user}} = this.props;
    const payload = {
      groupEvaluation: fields.groupEvaluation,
      projectEvaluation: fields.projectEvaluation,
      projectDescription: fields.projectDescription
    }

    dispatch({
      type: 'sub_resume/update',
      payload: {...payload, ...{id: selectedValues.id}},
      token: user.token
    }).then(res => {
      if (res) {
        this.handleReviewModal()
        this.getList()
      }
    })
  };

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.searchList} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="分包商全称">
              {getFieldDecorator('subcontractorName')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目部信誉评价">
              {getFieldDecorator('projectEvaluation')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="优秀">优秀</Option>
                  <Option value="合格">合格</Option>
                  <Option value="不合格">不合格</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="施工规模">
              {getFieldDecorator('constructionScale')(<Select placeholder="请选择施工规模" style={{width: '100%'}}>
                <Option value="0">优秀</Option>
                <Option value="1">合格</Option>
                <Option value="1">不合格</Option>
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
    return this.renderAdvancedForm()
  }

  render() {
    const {
      sub_resume: {data, subNames, teamList, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, pageLoading, reviewType, updateModalVisible, checkDetail, selectedValues} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleReviewModal: this.handleReviewModal,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,
      handleReview: this.handleReview
    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      subNames: subNames,
      teamList: teamList,
      proNames: proNames
    }
    const exportUrl = createURL(SUB_RES_EXPORT, {...this.exportParams, ...{token: user.token}})
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="分包商履历">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token && getButtons(user.permissionsMap.button, pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token && getButtons(user.permissionsMap.button, pageButtons[3]) ?
                  <Button href={exportUrl} icon="plus" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['sub_resume/fetch']}
                bordered
                filterMultiple={false}
                rowKey={'id'}
                data={data}
                scroll={{x: '150%'}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} {...parentState}/>
          <CreateReview {...parentMethods} selectedValues={selectedValues} modalVisible={reviewType}/>
        </PageHeaderWrapper>
      </Page>
    )
  }

  getProNames = (proName = []) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'sub_resume/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getSubNames = (subName = []) => {
    if (subName.length < 1) {
      this.props.dispatch(
        {
          type: 'sub_resume/querySubNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getTeamNames = (teamList = []) => {
    if (teamList.length < 1) {
      this.props.dispatch(
        {
          type: 'sub_resume/queryTeamNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'sub_resume/fetch',
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
        subcontractorName: fieldsValue.subcontractorName,
        constructionScale: fieldsValue.constructionScale,
        projectEvaluation: fieldsValue.projectEvaluation,
      }
      cleanObject(payload)
      //  form.resetFields();
      this.props.dispatch({
        type: 'sub_resume/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

Resume.propTypes = {}

export default connect(({app, rule, loading, sub_resume}) => ({app, rule, loading, sub_resume}))(Resume)
