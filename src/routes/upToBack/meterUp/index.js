import React, {Component, PureComponent, Fragment} from 'react'
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
  Badge,
  Steps,
  Radio
} from 'antd';
import {Page, PageHeader, PageHeaderWrapper, StandardTable} from 'components'
import styles from './index.less'


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
  const {modalVisible, form, handleAdd, handleModalVisible} = props;
  const {getFieldDecorator, getFieldValue} = form
  getFieldDecorator('managers', {initialValue: [{manaName: '', manaTime: '', manaPhone: ''}]});
  getFieldDecorator('secretary', {initialValue: [{secreName: '', secreTime: '', secrePhone: ''}]});
  getFieldDecorator('chiefEngineer', {initialValue: [{chiefName: '', chiefTime: '', chiefPhone: ''}]});
  const managers = getFieldValue('managers');
  const secretary = getFieldValue('secretary');
  const chiefEngineer = getFieldValue('chiefEngineer');
  const remove = (k, type, form) => {
    // can use data-binding to get
    const keys = form.getFieldValue(type);
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    let object = {
      managers: keys.filter(key => key !== k),
    }
    if (type == 'secretary') {
      object = {
        secretary: keys.filter(key => key !== k),
      }
    }
    if (type == 'chiefEngineer') {
      object = {
        chiefEngineer: keys.filter(key => key !== k),
      }
    }
    // can use data-binding to set
    form.setFieldsValue(object);
  }
  const add = (type, form) => {
    // can use data-binding to get
    const keys = form.getFieldValue(type);
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    let object = {
      managers: nextKeys,
    }
    if (type == 'secretary') {
      object = {
        secretary: nextKeys,
      }
    }
    if (type == 'chiefEngineer') {
      object = {
        chiefEngineer: nextKeys,
      }
    }
    form.setFieldsValue(object);
  }
  const formManager = managers.map((key, index) => {
    let isLast = (managers.length == index + 1)
    return (<Row gutter={8}>
      <Col className={styles.colPeople} md={6} sm={24}>
        <FormItem required={true} labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
          <Input placeholder="请输入姓名"/>
          {/*          {form.getFieldDecorator(`names[${key}]`, {
            rules: [{required: true, message: '请输入姓名'}],
          })(<Input placeholder="请输入姓名"/>)}*/}
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={7} sm={24}>
        <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
          <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>
          {/*{form.getFieldDecorator('manaTime', {
            rules: [{required: true, message: '请选择任职时间'}],
          })( <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>)}*/}
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={7} sm={24}>
        <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
          <Input placeholder="请输入联系电话"/>
          {/*{form.getFieldDecorator('manaPhone', {
            rules: [{required: true, message: '请输入联系电话'}],
          })(<Input placeholder="请输入联系电话"/>)}*/}
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={4} sm={24}>
        {isLast ?
          <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary" onClick={() => add('managers', form)}>
            <Icon type="plus"/>
          </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                              onClick={() => remove(key, 'managers', form)}>
            <Icon type="minus"/>
          </Button>}
      </Col>
    </Row>)
  })
  const formSecretary = secretary.map((key, index) => {
    let isLast = (secretary.length == index + 1)
    return (<Row gutter={8}>
      <Col className={styles.colPeople} md={6} sm={24}>
        <FormItem required={true}
                  labelCol={{span: 5}}
                  wrapperCol={{span: 15}}
                  label="姓名">
          {/*          {form.getFieldDecorator('secreName', {
            rules: [{required: true, message: '请输入姓名'}],
          })(<Input placeholder="请输入姓名"/>)}*/}
          <Input placeholder="请输入姓名"/>
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={7} sm={24}>
        <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
          {/*          {form.getFieldDecorator('secreTime', {
            rules: [{required: true, message: '请选择任职时间'}],
          })( <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>)}*/}
          <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={7} sm={24}>
        <FormItem min={1} type={'number'} required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
          {/* {form.getFieldDecorator('secrePhone', {
            rules: [{required: true, message: '请输入联系电话'}],
          })(<Input placeholder="请输入联系电话"/>)}*/}
          <Input placeholder="请输入联系电话"/>
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={4} sm={24}>
        {isLast ?
          <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary" onClick={() => add('secretary', form)}>
            <Icon type="plus"/>
          </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                              onClick={() => remove(key, 'secretary', form)}>
            <Icon type="minus"/>
          </Button>}
      </Col>
    </Row>)
  })
  const formChiefEngineer = chiefEngineer.map((key, index) => {
    let isLast = (chiefEngineer.length == index + 1)
    return (<Row gutter={8}>
      <Col className={styles.colPeople} md={6} sm={24}>
        <FormItem required={true} labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
          {/*          {form.getFieldDecorator('chiefName', {
            rules: [{required: true, message: '请输入姓名'}],
          })(<Input placeholder="请输入姓名"/>)}*/}
          <Input placeholder="请输入姓名"/>
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={7} sm={24}>
        <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="任职时间">
          {/*          {form.getFieldDecorator('chiefTime', {
            rules: [{required: true, message: '请选择任职时间'}],
          })( <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>)}*/}
          <DatePicker style={{width: '100%'}} placeholder="请选择任职时间"/>
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={7} sm={24}>
        <FormItem required={true} labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
          {/*          {form.getFieldDecorator('chiefPhone', {
            rules: [{required: true, message: '请输入联系电话'}],
          })(<Input placeholder="请输入联系电话"/>)}*/}
          <Input placeholder="请输入联系电话"/>
        </FormItem>
      </Col>
      <Col className={styles.colPeople} md={4} sm={24}>
        {isLast ?
          <Button style={{marginTop: 4 + 'px'}} shape="circle" type="primary"
                  onClick={() => add('chiefEngineer', form)}>
            <Icon type="plus"/>
          </Button> : <Button style={{marginTop: 4 + 'px'}} shape="circle" type="danger"
                              onClick={() => remove(key, 'chiefEngineer', form)}>
            <Icon type="minus"/>
          </Button>}
      </Col>
    </Row>)
  })

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
      title="新增工程项目信息"
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择项目'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">项目1</Option>
                <Option value="1">项目2</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目类别">
              {form.getFieldDecorator('proType', {
                rules: [{required: true}],
              })(<Input placeholder="自动带出"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="工程地点">
              {form.getFieldDecorator('proSite', {
                rules: [{required: true, message: '请输入工程地点'}],
              })(<Input placeholder="请输入工程地点"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="工程状态">
              {form.getFieldDecorator('proStatus', {
                rules: [{required: true, message: '请选择项目'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">在建</Option>
                <Option value="1">完工未结算</Option>
                <Option value="2">完工已结算</Option>
                <Option value="3">停工</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={4}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="项目部地址">
              {form.getFieldDecorator('proPlace', {
                rules: [{required: true, message: '请输入项目部地址'}],
              })(<Input placeholder="请输入项目部地址"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="里程桩号">
              {form.getFieldDecorator('proMileage', {
                rules: [{required: true, message: '请输入里程桩号'}],
              })(<Input placeholder="请输入里程桩号"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="暂估合同额">
              {form.getFieldDecorator('temSum', {
                rules: [{required: true, message: '请输入暂估合同额'}],
              })(<Input placeholder="请输入暂估合同额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="有效合同额">
              {form.getFieldDecorator('conSum', {
                rules: [{required: true, message: '请输入有效合同额'}],
              })(<Input placeholder="请输入有效合同额" addonAfter="万元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="合同编码">
              {form.getFieldDecorator('proCode', {
                rules: [{required: true, message: '请输入合同编码'}],
              })(<Input placeholder="请输入合同编码"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="合同工期">
              {form.getFieldDecorator('proContractDays', {
                rules: [{required: true, message: '请输入合同工期'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入合同工期" addonAfter="天"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="合同开工日期">
              {form.getFieldDecorator('proContractStart', {
                rules: [{required: true, message: '请选择合同开工日期'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择合同开工日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="合同竣工日期">
              {form.getFieldDecorator('proContractEnd', {
                rules: [{required: true, message: '请选择合同竣工日期'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择合同竣工日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="实际工期">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入实际工期'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入实际工期" addonAfter="天"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="实际开工日期">
              {form.getFieldDecorator('proActualStart', {
                rules: [{required: true, message: '请选择实际开工日期'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择实际开工日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="实际竣工日期">
              {form.getFieldDecorator('proActualEnd', {
                rules: [{required: true, message: '请选择实际竣工日期'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择实际竣工日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="业主单位">
              {form.getFieldDecorator('proOwnerUnit', {
                rules: [{required: true, message: '请输入业主单位'}],
              })(<Input placeholder="请输入业主单位"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="业主地址">
              {form.getFieldDecorator('proOwnerSite', {
                rules: [{required: true, message: '请输入业主地址'}],
              })(<Input placeholder="请输入业主地址"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {form.getFieldDecorator('proOwnerPhone', {
                rules: [{required: true, type: "number", message: '请输入正确的联系方式'}],
              })(<Input placeholder="请输入业主电话"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监管单位">
              {form.getFieldDecorator('proSubUnit', {
                rules: [{required: true, message: '请输入监管单位'}],
              })(<Input placeholder="请输入监管单位"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监管地址">
              {form.getFieldDecorator('proSubSite', {
                rules: [{required: true, message: '请输入监管地址'}],
              })(<Input placeholder="请输入监管地址"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="监管电话">
              {form.getFieldDecorator('proSubPhone', {
                rules: [{required: true, type: "number", message: '请输入正确的联系方式'}],
              })(<Input placeholder="请输入监管电话"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>项目经理</div>
      </Row>
      <div className={styles.modalContent}>
        {formManager}
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>项目书记</div>
      </Row>
      <div className={styles.modalContent}>
        {formSecretary}
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>总工程师</div>
      </Row>
      <div className={styles.modalContent}>
        {formChiefEngineer}
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>统计</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="投入人员">
              {form.getFieldDecorator('proPersons', {
                rules: [{required: true, message: '请输入投入人员数'}],
              })(<Input placeholder="请输入投入人员数" addonAfter="人"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="正式职工">
              {form.getFieldDecorator('proFormalPersons', {
                rules: [{required: true, message: '请输入正式职工数'}],
              })(<Input placeholder="请输入正式职工数" addonAfter="人"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="外聘人员">
              {form.getFieldDecorator('proRentPersons', {
                rules: [{required: true, message: '请输入外聘人员数'}],
              })(<Input placeholder="请输入外聘人员数" addonAfter="人"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem  labelCol={{span: 5}} wrapperCol={{span: 15}} label="工程概况">
              {form.getFieldDecorator('proSummary', {
                rules: [{required: true}],
              })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
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
class MeterUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
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
      title: '工程状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '合同开工日期',
      render(val) {
        return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '合同完工日期',
      render(val) {
        return <span>{moment(val.updatedAt).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '实际开工日期',
      render(val) {
        return <span>{moment(val.updatedAt).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '实际完工日期',
      render(val) {
        return <span>{moment(val.updatedAt).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      title: '暂估合同额',
      render(val) {
        return <span>100万</span>;
      },
    },
    {
      title: '有效合同额',
      render(val) {
        return <span>100万</span>;
      },
    },
    {
      title: '项目经理',
      dataIndex: 'owner',
    },
    {
      title: '项目书记',
      dataIndex: 'updateUser',
    },
    {
      title: '总工',
      render: val => <span>李蛋蛋</span>,
    }
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/fetch',
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

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
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
    console.log(fields)
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
    const {expandForm} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目经理">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目书记">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="总工">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? <Row gutter={{md: 4, lg: 12, xl: 24}}>
          <Col md={5} sm={24}>
            <FormItem label="计划开工日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="计划完工日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="实际开工日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="计划完工日期">
              {getFieldDecorator('date')(
                <DatePicker style={{width: '100%'}} placeholder="请选择日期"/>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="工程状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row> : null}
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              {expandForm ? '收起' : '展开'} <Icon type={expandForm ? "up" : "down"}/>
            </a>
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
      rule: {data},
      loading,
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, stepFormValues} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <Page loading={false}>
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
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible}/>
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null}
        </PageHeaderWrapper>
      </Page>
    )
  }
}

MeterUp.propTypes = {}

export default connect(({app, rule}) => ({app, rule}))(MeterUp)
