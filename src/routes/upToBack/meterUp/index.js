import React, {Component,Fragment} from 'react'
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
  DatePicker,
  Modal,
  message,
  Upload,
  Divider
} from 'antd';
import {Page,PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut} from 'utils'

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let uuid = 0;


const info_css={
  color:'#fa541c'
}
const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible,normFile,handleUpdateModalVisible,updateModalVisible,handleCheckDetail,selectedValues,checkDetail} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={checkDetail?'对上计量台账':updateModalVisible?"编辑对上计量台账":"新增对上计量台账"}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => checkDetail?handleCheckDetail():updateModalVisible?handleUpdateModalVisible():handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择项目'}],
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="计量期数">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请输入期数'}],
              })(<Input disabled={checkDetail} placeholder="请输入期数"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="计量日期">
              {form.getFieldDecorator('proType', {
                rules: [{required: true}],
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择量日期"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>预付款金额</div>
      </Row>
      <div className={styles.modalContent}>
      <Row gutter={8}>
        <Col md={8} sm={24}>
          <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="预付款">
            {form.getFieldDecorator('proActualDays', {
              rules: [{required: true, message: '请输入预付款'}],
            })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入预付款" addonAfter="元"/>)}
          </FormItem>
        </Col>
      </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>计价金额</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="含税金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入含税金额'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="税率">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入税率'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入税率" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>实际应支付金额</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="含税金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入含税金额'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入含税金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>资金拨付情况</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="已支付金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入已支付金额'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入已支付金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col style={{paddingTop:11+'px'}} md={8} sm={24}>
            <span style={info_css}>备注：不含预付款金额</span>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>其他计价</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="超计价金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入超计价金额'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入超计价金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="已完未计价金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入已完未计价金额'}],
              })(<Input disabled={checkDetail} style={{marginTop: 4}} placeholder="请输入已完未计价金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>其他</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft:14+'px'}} labelCol={{span: 2}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('proSummary', {
                rules: [{required: true}],
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem style={{marginLeft:14+'px'}} labelCol={{span:2}} wrapperCol={{span: 15}} label="附件" >
                {form.getFieldDecorator('dragger', {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                })(
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或拖动附件进入</p>
                  </Upload.Dragger>
                )}
                <span style={info_css}>备注：请以一份PDF格式文件上传封面和汇总表</span>
            </FormItem>
          </Col>
        </Row>
      </div>

    </Modal>
  );
});

@Form.create()
class MeterUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading:true,
      selectedValues:{},
      checkDetail:false
    }
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'code',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '计量期数',
      render(val) {
        return <span>{1}</span>;
      },
    },
    {
      title: '计量日期',
      render(val) {
        return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '预付款',
      render(val) {
        return <span>10万</span>;
      },
    },
    {
      title: '计价金额（元）',
      children: [    {
        title: '含税',
        key: 'plan_account',
        render(val) {
          return <span>15万</span>;
        },
      },
        {
          title: '税率（%）',
          key: 'tax',
          render(val) {
            return <span>3</span>;
          },
        }, {
          title: '不含税',
          key: 'plan_account_noTax',
          render(val) {
            return <span>311</span>;
          },
        }]
    },
    {
      title: '实际应付金额（元）',
      children: [    {
        title: '含税',
        key: 'actul_account',
        render(val) {
          return <span>15万</span>;
        },
      }, {
          title: '不含税',
        key: 'actul_account_noTax',
          render(val) {
            return <span>311</span>;
          },
        }]
    },
    {
      title: '资金拨付情况（元）',
      children: [    {
        title: '已支付金额',
        key: 'paid',
        render(val) {
          return <span>15万</span>;
        },
      },
        {
          title: '未支付金额',
          key: 'noPaid',
          render(val) {
            return <span>3</span>;
          },
        }, {
          title: '拨付率',
          key:'pay_per',
          render(val) {
            return <span>311</span>;
          },
        }]
    },
    {
      title: '其他计价（元）',
      children: [    {
        title: '超计价',
        key:'more_plan',
        render(val) {
          return <span>15万</span>;
        },
      },
        {
          title: '已完未计',
          key:'end_noPlan',
          render(val) {
            return <span>3</span>;
          },
        }]
    },
    {
      title: '产值计价率',
      render(val) {
        return <span>2213</span>;
      },
    },
    {
      title: '备注',
      render(val) {
        return <span>100万啊实打实的</span>;
      },
    },
    {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.handleCheckDetail(true,record)}>查看</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    _setTimeOut(()=>this.setState({pageLoading:false}),1000)
    // setTimeout(() => {
    //   this.setState({pageLoading:false})
    // },1000)
    dispatch({
      type: 'rule/fetch',payload:{pageSize:5}
    });
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
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
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

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="计量日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col style={{flexDirection:'row',display:'flex'}} md={12} sm={24}>
            <FormItem label="拨付率">
              {getFieldDecorator('give')(<Input placeholder="请输入" addonAfter={'%'}/>)}
            </FormItem>
               <FormItem style={{marginLeft:15+'px'}} label="至">
              {getFieldDecorator('give')(<Input placeholder="请输入" addonAfter={'%'}/>)}
            </FormItem>
          </Col>
        </Row>
       <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col style={{flexDirection:'row',display:'flex'}} md={12} sm={24}>
              <FormItem label="产值计价率">
                {getFieldDecorator('give')(<Input placeholder="请输入" addonAfter={'%'}/>)}
              </FormItem>
              <FormItem style={{marginLeft:15+'px'}} label="至">
                {getFieldDecorator('give')(<Input placeholder="请输入" addonAfter={'%'}/>)}
              </FormItem>
            </Col>
         <Col md={12} sm={24}>
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
         </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm()
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const {
      rule: {data},
      loading,
    } = this.props;
    const {selectedRows, modalVisible,updateModalVisible,pageLoading,selectedValues,checkDetail} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile:this.normFile,
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
        <PageHeaderWrapper title="对上计量台账">
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
                     操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
                )}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['rule/fetch']}
                bordered
                data={data}
                scroll={{ x: '200%' }}
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

MeterUp.propTypes = {}

export default connect(({app, rule,loading}) => ({app, rule,loading}))(MeterUp)
