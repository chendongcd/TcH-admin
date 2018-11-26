import React, {Component, PureComponent} from 'react'
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
  Steps,
  Radio
} from 'antd';
import {Page, PageHeader, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'
import {_setTimeOut} from 'utils'

const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
let uuid = 0;

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible, normFile} = props;
  const {getFieldDecorator, getFieldValue} = form

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
      title="新增项目评估"
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择项目'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="工程类别">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input placehloder='自动带出'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="出生日期">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<DatePicker width={'100%'} placehloder='请选择出生日期'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="评估状态">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">未评估</Option>
                <Option value="1">初评</Option>
                <Option value="2">复评(二次)</Option>
                <Option value="3">复评(三次)</Option>
                <Option value="4">复评(四次)</Option>
                <Option value="5">定评</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目状态">
              {form.getFieldDecorator('proName', {
                rules: [{required: true}],
              })(<Input placehloder='自动带出'/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同价</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="中标">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入中标金额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="有效收入">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入有效金额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="扣除覆约保质金">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入扣除覆约保质金" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="计日工及补偿费用">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入计日工及补偿费用" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="应支付金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入应支付金额'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入应支付金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="已完未计">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入已完未计'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入已完未计" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="是否签订">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="签订日期">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker placeholder='请选择日期'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="扣除覆约保质金">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入扣除覆约保质金" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="计日工及补偿费用">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入计日工及补偿费用" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="应支付金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入应支付金额'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入应支付金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="已完未计">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入已完未计'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入已完未计" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>合同工期</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="合同开工日期">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='自动带出'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="合同竣工日期">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='自动带出'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="工期(月)">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='自动计算'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="扣除覆约保质金">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入扣除覆约保质金" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="计日工及补偿费用">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入计日工及补偿费用" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="应支付金额">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入应支付金额'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入应支付金额" addonAfter="元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="已完未计">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入已完未计'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入已完未计" addonAfter="元"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>经管部评价</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="评估时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker width={'100%'} placeholder='请选择'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="评估效益点(%)">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="含分包差及经营费(%)">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="评估编号">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder="请输入评估编号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
              {form.getFieldDecorator('dragger', {
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
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>会审情况</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="效益点">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="是否含分包差及经营费">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="上会时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker placeholder='请选择时间)'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
              {form.getFieldDecorator('dragger', {
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
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>责任状签订</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="效益点">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='请输入(小数点后两位)'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="签订时间">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<DatePicker width={'100%'} placeholder='请选择'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 15}} label="项目经理">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder='请输入项目经理'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="项目书记">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true}],
              })(<Input placeholder="项目书记" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="附件">
              {form.getFieldDecorator('dragger', {
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
      </div>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };
  }

  handleNext = currentStep => {
    const {form, handleUpdate} = this.props;
    const {formVals: oldValue} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = {...oldValue, ...fieldsValue};
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const {currentStep} = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const {currentStep} = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const {form} = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{width: '100%'}}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{width: '100%'}}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{required: true, message: '请选择开始时间！'}],
          })(
            <DatePicker
              style={{width: '100%'}}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{width: '100%'}}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{required: true, message: '请输入规则名称！'}],
          initialValue: formVals.name,
        })(<Input placeholder="请输入"/>)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{required: true, message: '请输入至少五个字符的规则描述！', min: 5}],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符"/>)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const {handleUpdateModalVisible} = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{float: 'left'}} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{float: 'left'}} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const {updateModalVisible, handleUpdateModalVisible} = this.props;
    const {currentStep, formVals} = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{padding: '32px 40px 48px'}}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Steps style={{marginBottom: 28}} size="small" current={currentStep}>
          <Step title="基本信息"/>
          <Step title="配置规则属性"/>
          <Step title="设定调度周期"/>
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

@Form.create()
class ProEvaluate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
      pageLoading: true
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
      title: '工程类别',
      render(val) {
        return <span>123</span>;
      },
    },
    {
      title: '项目状态',
      render(val) {
        return <span>123</span>;
      },
    },
    {
      title: '合同额',
      children: [{
        title: '中标',
        key: 'contract',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '有效收入',
        key: 'use_bill',
        render(val) {
          return <span>123</span>;
        },
      },]
    },
    {
      title: '合同',
      children: [{
        title: '是否签订',
        key: 'sign_is',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '签订日期',
        key: 'sign_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },]
    },
    {
      title: '合同工期',
      children: [{
        title: '合同开工时间',
        key: 'start_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '合同竣工时间',
        key: 'end_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },{
        title: '工期(月)',
        key: 'days',
        render(val) {
          return <span>1</span>;
        },
      }]
    },
    {
      title: '经管部评估',
      children: [{
        title: '评估时间',
        key: 'review_date',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      }, {
        title: '评估效益点(%)',
        key: 'review_point',
        render(val) {
          return <span>1</span>;
        },
      },{
        title: '含分包差及经营费(%)',
        key: 'split_bill',
        render(val) {
          return <span>1</span>;
        },
      },{
        title: '评估编号',
        key: 'review_code',
        render(val) {
          return <span>1123</span>;
        },
      },{
        title: '附件',
        key: 'files',
        render(val) {
          return <a href="#">下载</a>;
        },
      }]
    },
    {
      title: '会审情况',
      children: [{
        title: '效益点',
        key: 'benefit',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '是否含分包差及经营费',
        key: 'is_wrapper',
        render(val) {
          return <span>是</span>;
        },
      },{
        title: '上会时间',
        key: 'meet_time',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },{
        title: '附件',
        key: 'files_1',
        render(val) {
          return <a href="#">下载</a>;
        },
      }]
    },
    {
      title: '责任状签订',
      children: [{
        title: '效益点',
        key: 'benefit_1',
        render(val) {
          return <span>123</span>;
        },
      }, {
        title: '签订时间',
        key: 'sign_date1',
        render(val) {
          return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
        },
      },{
        title: '项目经理',
        key: 'pro_manager',
        render(val) {
          return <span>李蛋蛋</span>;
        },
      },{
        title: '项目书记',
        key: 'pro_secretary',
        render(val) {
          return <span>李蛋蛋</span>;
        },
      },{
        title: '附件',
        key: 'files_2',
        render(val) {
          return <a href="#">下载</a>;
        },
      }]
    },
    {
      title: '备注',
      render(val) {
        return <span>100万啊实打实的</span>;
      },
    }
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    _setTimeOut(() => this.setState({pageLoading: false}), 1000)
    // setTimeout(() => {
    //   this.setState({pageLoading:false})
    // },1000)
    dispatch({
      type: 'rule/fetch', payload: {pageSize: 5}
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
      stepFormValues: record || {},
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
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评估状态">
              {getFieldDecorator('date')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">未评估</Option>
                  <Option value="1">初评</Option>
                  <Option value="2">复评(二次)</Option>
                  <Option value="3">复评(三次)</Option>
                  <Option value="4">复评(四次)</Option>
                  <Option value="5">定评</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="项目状态">
              {getFieldDecorator('date')(
                <Input placeholder="自动带出"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="合同是否签订">
              {getFieldDecorator('give')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="责任状是否签订">
              {getFieldDecorator('give')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>)}
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
    const {selectedRows, modalVisible, pageLoading} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile
    };
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="项目评估">
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
                scroll={{x: '150%'}}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        </PageHeaderWrapper>
      </Page>
    )
  }
}

ProEvaluate.propTypes = {}

export default connect(({app, rule, loading}) => ({app, rule, loading}))(ProEvaluate)
