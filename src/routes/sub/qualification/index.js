import React, {Component, PureComponent,Fragment} from 'react'
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
  Radio,
  Divider,
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
      title="新增分包商资质信息卡"
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
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="请输入分包商全称">
              {form.getFieldDecorator('proName1', {
                rules: [{required: true, message: '请输入分包商全称'}],
              })(<Input placeholder="请输入分包商全称"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="成立日期">
              {form.getFieldDecorator('proName2', {
                rules: [{required: true, message: '请选择成立日期'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="纳税人类型">
              {form.getFieldDecorator('proType3', {
                rules: [{required: true}],
              })(<Select placeholder="请选择纳税人类型" style={{width: '100%'}}>
                <Option value="0">一般纳税人</Option>
                <Option value="1">小规模纳税人</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="注册资本金">
              {form.getFieldDecorator('proType4', {
                rules: [{required: true}],
              })(<Input placeholder="请选择日期" addonAfter="万元"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="分包商类型">
              {form.getFieldDecorator('proName', {
                rules: [{required: true, message: '请选择分包商类型'}],
              })(<Select placeholder="请选择分包商类型" style={{width: '100%'}}>
                <Option value="0">关闭</Option>
                <Option value="1">运行中</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="电话">
              {form.getFieldDecorator('proType', {
                rules: [{required: true}],
              })(<Input placeholder="请输入电话"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="电子邮箱">
              {form.getFieldDecorator('proType', {
                rules: [{required: true}],
              })(<Input placeholder="请输入电子邮箱"/>)}
            </FormItem>
          </Col> <Row gutter={0}>
          <Col md={16} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="注册地址">
              {form.getFieldDecorator('proType5', {
                rules: [{required: true}],
              })(<Input placeholder="请输入注册地址"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="邮编">
              {form.getFieldDecorator('proType6', {
                rules: [{required: true}],
              })(<Input placeholder="请输入邮编"/>)}
            </FormItem>
          </Col>
        </Row>
        </Row>

        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="专业类型">
              {form.getFieldDecorator('proName7', {
                rules: [{required: true, message: '请选择专业类型'}],
              })(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">劳务承包</Option>
                <Option value="1">专业承包</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>法定代表人</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="姓名">
              {form.getFieldDecorator('proActualDays2', {
                rules: [{required: true, message: '请输入姓名'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入姓名"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="职务">
              {form.getFieldDecorator('proActualDays3', {
                rules: [{required: true, message: '请输入预付款'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入职务"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="身份证号码">
              {form.getFieldDecorator('proActualDays4', {
                rules: [{required: true, message: '请输入身份证号码'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入身份证"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系方式">
              {form.getFieldDecorator('proActualDays5', {
                rules: [{required: true, message: '请输入联系方式'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入联系方式"/>)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="家庭住址">
              {form.getFieldDecorator('proActualDay6', {
                rules: [{required: true, message: '请输入家庭住址'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入家庭住址"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>营业执照</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={4}>
          <Col md={10} sm={24}>
            <FormItem labelCol={{span: 9}} wrapperCol={{span: 15}} label="统一社会信誉代码">
              {form.getFieldDecorator('proActualDays8', {
                rules: [{required: true, message: '请输入统一社会信誉代码'}],
              })(<Input placeholder="请输入统一社会信誉代码"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="有效期限">
              {form.getFieldDecorator('proActualDays9', {
                rules: [{required: true, message: '请选择期限'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
              {form.getFieldDecorator('proActualDays11', {
                rules: [{required: true, message: '请输入发证机关'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>资质证书</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="证书编号">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入证书编号'}],
              })(<Input placeholder="请输入证书编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="有效期限">
              {form.getFieldDecorator('proActualDays12', {
                rules: [{required: true, message: '请选择期限'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
              {form.getFieldDecorator('proActualDays13', {
                rules: [{required: true, message: '请输入发证机关'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>安全生产许可证</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="编号">
              {form.getFieldDecorator('proActualDays', {
                rules: [{required: true, message: '请输入编号'}],
              })(<Input placeholder="请输入编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="有效期限">
              {form.getFieldDecorator('proActualDays14', {
                rules: [{required: true, message: '请选择期限'}],
              })(<DatePicker style={{width: '100%'}} placeholder="请选择日期"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
              {form.getFieldDecorator('proActualDays15', {
                rules: [{required: true, message: '请输入发证机关'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>开户银行许可证</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="开户银行">
              {form.getFieldDecorator('proActualDays16', {
                rules: [{required: true, message: '请输入开户银行'}],
              })(<Input placeholder="请输入开户银行"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="银行账号">
              {form.getFieldDecorator('proActualDays17', {
                rules: [{required: true, message: '请输入银行账号'}],
              })(<Input placeholder="请输入银行账号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="发证机关">
              {form.getFieldDecorator('proActualDays18', {
                rules: [{required: true, message: '请输入发证机关'}],
              })(<Input style={{marginTop: 4}} placeholder="请输入发证机关"/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>附件</div>
      </Row>
      <div className={styles.modalContent}>
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

const CreateReview = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleReviewModal} = props;
  const {getFieldDecorator, getFieldValue} = form

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const title = (type) => {
    let name = '股份公司综合信誉评价'
    switch (type) {
      case 1:
        name = '集团公司综合信誉评价'
        break
      case 2:
        name = '公司本级综合信誉评价'
        break
    }
    return name
  }

  const renderContent = (type) => {
    let content = (<div className={styles.modalContent}>
      <Row gutter={8}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="股份公司综合信誉评价">
            {form.getFieldDecorator('proName100', {
              rules: [{required: true, message: '请选择'}],
            })(<Select placeholder="请选择" style={{width: '100%'}}>
              <Option value="0">优秀</Option>
              <Option value="1">合格</Option>
              <Option value="2">不合格</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col md={12} sm={24}>
          <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="资质是否齐全">
            {form.getFieldDecorator('proName100', {
              rules: [{required: true, message: '请选择'}],
            })(<Select placeholder="请选择" style={{width: '100%'}}>
              <Option value="0">是</Option>
              <Option value="1">否</Option>
            </Select>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col md={24} sm={24}>
          <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="备注">
            {form.getFieldDecorator('proSummary', {
              rules: [{required: true}],
            })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
          </FormItem>
        </Col>
      </Row>
    </div>)

    switch (type) {
      case 1:
        content = (<div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="集团公司综合信誉评价">
                {form.getFieldDecorator('proName100', {
                  rules: [{required: true, message: '请选择'}],
                })(<Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">优秀</Option>
                  <Option value="1">合格</Option>
                  <Option value="2">不合格</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('proSummary', {
                  rules: [{required: true}],
                })(<Input.TextArea width={'100%'} placeholder="请输入" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
        </div>)
        break
      case 2:
        content = (<div className={styles.modalContent}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 9}} wrapperCol={{span: 12}} label="公司信誉评价">
                {form.getFieldDecorator('proName100', {
                  rules: [{required: true, message: '请选择'}],
                })(<Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">优秀</Option>
                  <Option value="1">良好</Option>
                  <Option value="2">合格</Option>
                  <Option value="3">不合格</Option>
                  <Option value="4">限制使用</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 11}} wrapperCol={{span: 12}} label="集团公司信誉评价">
                {form.getFieldDecorator('proName100', {
                  rules: [{required: true, message: '请选择'}],
                })(<Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">合格</Option>
                  <Option value="1">不合格</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
        </div>)
        break
    }

    return content
  }
  return (
    <Modal
      destroyOnClose
      title={title(modalVisible)}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible > -1}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleReviewModal(-1)}
    >
      {renderContent(modalVisible)}
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
class Qualification extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
      pageLoading: true,
      expandForm: false,
      reviewType: -1
    }
  }

  columns = [
    {
      title: '分包商备案编码',
      dataIndex: 'code',
    },
    {
      title: '分包商全称',
      dataIndex: 'name',
    },
    {
      title: '分包商类型',
      render(val) {
        return <span>专业承包</span>;
      }
    },
    {
      title: '专业类别',
      render(val) {
        return <span>强电专业</span>;
      }
    },
    {
      title: '纳税人类型',
      render(val) {
        return <span>小规模纳税人</span>;
      }
    },
    {
      title: '法人',
      render(val) {
        return <span>李蛋蛋</span>;
      }
    },
    {
      title: '注册本金（万元）',
      render(val) {
        return <span>100</span>;
      }
    },
    {
      title: '资料是否齐全',
      render(val) {
        return <span>是</span>;
      }
    },
    {
      title: '股份公司综合信誉评价',
      render(val) {
        return <span>优秀</span>;
      }
    },
    {
      title: '集团公司综合信誉评价',
      render(val) {
        return <span>优秀</span>;
      }
    },
    {
      title: '公司本级综合信誉评价',
      render(val) {
        return <span>优秀</span>;
      }
    },
    {
      title: '证件期限',
      render(val) {
        return <span>{moment(val.createdAt).format('YYYY/MM/DD')}</span>;
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
          <a>下载分包商资质信息卡</a>
          <Divider type="horizontal"/>
          <a href="">下载附件</a>
        </Fragment>
      ),
    },
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

  handleReviewModal = flag => {
    this.setState({
      reviewType: flag
    })
  }

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
    const {expandForm} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="分包商全称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="分包商类型">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">劳务分包</Option>
                <Option value="1">专业分包</Option>
                <Option value="1">劳务派遣</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="专业类别">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">临建工程</Option>
                <Option value="1">路基工程</Option>
                <Option value="2">路面工程</Option>
                <Option value="3">桥梁工程</Option>
                <Option value="4">涵洞工程</Option>
                <Option value="5">隧道工程</Option>
                <Option value="6">附属工程</Option>
                <Option value="7">装饰装修工程</Option>
                <Option value="8">弱电工程</Option>
                <Option value="9">强电工程</Option>
                <Option value="10">给排水工程</Option>
                <Option value="11">通风工程</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="注册资金">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">500万以下</Option>
                <Option value="1">500万-1000万</Option>
                <Option value="2">1000万-3000万</Option>
                <Option value="3">3000万-5000万</Option>
                <Option value="4">5000万-1亿</Option>
                <Option value="5">1亿以上</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? <Row gutter={{md: 4, lg: 12, xl: 24}}>
          <Col md={8} sm={24}>
            <FormItem label="股份公司综合信誉评价">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">优秀</Option>
                <Option value="1">合格</Option>
                <Option value="2">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="集团公司综合信誉评价">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">优秀</Option>
                <Option value="1">合格</Option>
                <Option value="2">不合格</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="公司本级综合信誉评价">
              {getFieldDecorator('name')(<Select placeholder="请选择" style={{width: '100%'}}>
                <Option value="0">优秀</Option>
                <Option value="1">合格</Option>
                <Option value="2">不合格</Option>
              </Select>)}
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
    const {selectedRows, modalVisible, pageLoading, reviewType} = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="edit">编辑</Menu.Item>
        <Menu.Item key="export">导出</Menu.Item>
        <Menu.Item key="export1">下载分包商信息卡</Menu.Item>
        <Menu.Item key="export2">导出</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleReviewModal:this.handleReviewModal
    };
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="分包商资质信息">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
                <Button icon="edit" type="primary" onClick={() => this.handleReviewModal(0)}>
                  股份公司综合信誉评价
                </Button>
                <Button icon="edit" type="primary" onClick={() => this.handleReviewModal(1)}>
                  集团公司综合信誉评价
                </Button>
                <Button icon="edit" type="primary" onClick={() => this.handleReviewModal(2)}>
                  公司本级综合信誉评价
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
          <CreateReview {...parentMethods} modalVisible={reviewType}/>
        </PageHeaderWrapper>
      </Page>
    )
  }
}

Qualification.propTypes = {}

export default connect(({app, rule, loading}) => ({app, rule, loading}))(Qualification)
