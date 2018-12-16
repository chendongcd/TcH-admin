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
import {_setTimeOut,getButtons,cleanObject} from 'utils'
import {menuData} from "../../../common/menu";

const FormItem = Form.Item;

const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const pageButtons = menuData[16].buttons.map(a => a.permission)
const testValue = '123'
const testPDF = 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dose-juice-1184446-unsplash.jpg'
const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible,handleUpdateModalVisible,updateModalVisible,handleCheckDetail,selectedValues,checkDetail} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) return;
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          // console.log(fieldsValue[prop].format())
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
          //  console.log(fieldsValue[prop])
        }
        // console.log(typeof fieldsValue[prop])
      }
      fieldsValue.headUrl = testPDF
      // form.resetFields();
      handleAdd(fieldsValue, updateModalVisible, selectedValues);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={checkDetail?'管理人员信息':updateModalVisible?"编辑管理人员":"新增管理人员"}
      bodyStyle={{padding: 0 + 'px'}}
      visible={modalVisible}
      width={992}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => checkDetail?handleCheckDetail():updateModalVisible?handleUpdateModalVisible():handleModalVisible()}
    >
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="姓名">
              {form.getFieldDecorator('name', {
                rules: [{required: true, message: '请输入姓名'}],
                initialValue: selectedValues.name ? selectedValues.name : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入姓名'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span:7}} wrapperCol={{span: 15}} label="性别">
              {form.getFieldDecorator('sex', {
                rules: [{required: true}],
                initialValue: selectedValues.sex ? selectedValues.sex : testValue,
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="出生日期">
              {form.getFieldDecorator('brithday', {
                rules: [{required: true}],
                initialValue: selectedValues.brithday ? moment(selectedValues.brithday) : null,
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择出生日期"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="身份证号">
              {form.getFieldDecorator('idCard', {
                rules: [{required: true}],
                initialValue: selectedValues.idCard ? selectedValues.idCard : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入份证号'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
              {form.getFieldDecorator('phone', {
                rules: [{required: true}],
                initialValue: selectedValues.phone ? selectedValues.phone : testValue,
              })(<Input placehloder='请输入联系电话'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="QQ">
              {form.getFieldDecorator('qqNumber', {
                rules: [{required: true}],
                initialValue: selectedValues.qqNumber ? selectedValues.qqNumber : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入QQ号'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="家庭住址">
              {form.getFieldDecorator('homeAddress', {
                rules: [{required: true}],
                initialValue: selectedValues.homeAddress ? selectedValues.homeAddress : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入家庭住址'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
              {form.getFieldDecorator('projectName', {
                rules: [{required: true}],
                initialValue: selectedValues.projectName ? selectedValues.projectName : testValue,
              })(<Input placehloder='请输入项目名称'/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="状态">
              {form.getFieldDecorator('status', {
                rules: [{required: true}],
                initialValue: selectedValues.status ? selectedValues.status : testValue,
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="在岗">在岗</Option>
                <Option value="调岗">调岗</Option>
                <Option value="息工">息工</Option>
                <Option value="休假">休假</Option>
                <Option value="离职">离职</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="民族">
              {form.getFieldDecorator('famousFamily', {
                rules: [{required: true}],
                initialValue: selectedValues.famousFamily ? selectedValues.famousFamily : testValue,
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="汉族">汉族</Option>
                <Option value="少数民族">少数民族</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="健康状况">
              {form.getFieldDecorator('health', {
                rules: [{required: true}],
                initialValue: selectedValues.health ? selectedValues.health : testValue,
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="健康状态">健康状态</Option>
                <Option value="亚健康状态">亚健康状态</Option>
                <Option value="疾病的前驱状态">疾病的前驱状态</Option>
                <Option value="疾病状态">疾病状态</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="入党时间">
              {form.getFieldDecorator('joinAssociationTime', {
                rules: [{required: true,message:'请选择入党时间'}],
                initialValue: selectedValues.joinAssociationTime ? moment(selectedValues.joinAssociationTime) : null,
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择入党时间"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="籍贯">
              {form.getFieldDecorator('jiguan', {
                rules: [{required: true}],
                initialValue: selectedValues.jiguan? selectedValues.jiguan : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入籍贯'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="职称">
              {form.getFieldDecorator('jobTitle', {
                rules: [{required: true}],
                initialValue: selectedValues.jobTitle ? selectedValues.jobTitle : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入职称'/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="职务">
              {form.getFieldDecorator('position', {
                rules: [{required: true}],
                initialValue: selectedValues.position? selectedValues.position : testValue,
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="成本副经理">成本副经理</Option>
                <Option value="成本副经理兼部长">成本副经理兼部长</Option>
                <Option value="部长">部长</Option>
                <Option value="副部长">副部长</Option>
                <Option value="部员">部员</Option>
                <Option value="部见习生">部见习生</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="参加工作年限">
              {form.getFieldDecorator('workTime', {
                rules: [{required: true}],
                initialValue: selectedValues.workTime ? selectedValues.workTime : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入参加工作年限' addonAfter={'年'}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="特长">
              {form.getFieldDecorator('specialty', {
                rules: [{required: true}],
                initialValue: selectedValues.specialty ? selectedValues.specialty: testValue,
              })(<Input disabled={checkDetail} placehloder='请输入特长'/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span:5}} wrapperCol={{span: 15}} label="出生地">
              {form.getFieldDecorator('birthplace', {
                rules: [{required: true}],
                initialValue: selectedValues.birthplace ? selectedValues.birthplace : testValue,
              })(<Input disabled={checkDetail} placehloder='请输入出生地'/>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>第一学历</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="毕业院校">
              {form.getFieldDecorator('firstDegreeSchool', {
                rules: [{required: true, message: '请输入毕业院校'}],
                initialValue: selectedValues.firstDegreeSchool ? selectedValues.firstDegreeSchool : testValue,
              })(<Input disabled={checkDetail} placeholder="请输入毕业院校" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="专业">
              {form.getFieldDecorator('firstDegreeProfession', {
                rules: [{required: true, message: '请输入专业'}],
                initialValue: selectedValues.firstDegreeProfession ? selectedValues.firstDegreeProfession : testValue,
              })(<Input disabled={checkDetail} placeholder="请输入专业"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span:7}} wrapperCol={{span: 15}} label="毕业时间">
              {form.getFieldDecorator('firstDegreeTime', {
                rules: [{required: true, message: '请输入毕业时间'}],
                initialValue: selectedValues.firstDegreeTime? moment(selectedValues.firstDegreeTime) :null,
              })(<DatePicker style={{width: '100%'}} placeholder="请选择毕业时间"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem style={{marginLeft:16+'px'}} labelCol={{span: 4}} wrapperCol={{span: 10}} label="学历">
              {form.getFieldDecorator('firstDegreeLevel', {
                rules: [{required: true, message: '请选择学历'}],
                initialValue: selectedValues.firstDegreeLevel ? selectedValues.firstDegreeLevel : testValue,
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="专科">专科</Option>
                <Option value="本科">本科</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>第二学历</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="毕业院校">
              {form.getFieldDecorator('secondDegreeSchool', {
                rules: [{required: false}],
                initialValue: selectedValues.secondDegreeSchool ? selectedValues.secondDegreeSchool : testValue,
              })(<Input disabled={checkDetail} placeholder="请输入毕业院校" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="专业">
              {form.getFieldDecorator('secondDegreeProfession', {
                rules: [{required: false}],
                initialValue: selectedValues.secondDegreeProfession ? selectedValues.secondDegreeProfession : testValue,
              })(<Input disabled={checkDetail} placeholder="请输入专业"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span:7}} wrapperCol={{span: 15}} label="毕业时间">
              {form.getFieldDecorator('secondDegreeTime', {
                rules: [{required: false}],
                initialValue: selectedValues.secondDegreeTime? moment(selectedValues.secondDegreeTime) : null,
              })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择毕业时间"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem style={{marginLeft:16+'px'}} labelCol={{span: 4}} wrapperCol={{span: 10}} label="学历">
              {form.getFieldDecorator('secondDegreeLevel', {
                rules: [{required: false}],
                initialValue: selectedValues.secondDegreeLevel ? selectedValues.secondDegreeLevel : testValue,
              })(<Select disabled={checkDetail} placeholder="请选择" style={{width: '100%'}}>
                <Option value="专科">专科</Option>
                <Option value="本科">本科</Option>
              </Select>)}
            </FormItem>
          </Col>
        </Row>
      </div>

      <Row align={'middle'} gutter={0} className={styles.titleView}>
        <div className={styles.title}>其他信息</div>
      </Row>
      <div className={styles.modalContent}>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="工作经历">
              {form.getFieldDecorator('workExperience', {
                rules: [{required: false}],
                initialValue: selectedValues.workExperience ? selectedValues.workExperience : testValue,
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="工作经历" rows={4}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="职业资格证书取证情况">
              {form.getFieldDecorator('certificate', {
                rules: [{required: false}],
                initialValue: selectedValues.certificate ? selectedValues.certificate : testValue,
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="职业资格证书取证情况" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="学习及培训经历">
              {form.getFieldDecorator('training', {
                rules: [{required: false}],
                initialValue: selectedValues.training? selectedValues.training : testValue,
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="学习及培训经历" rows={4}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="获奖励和受表彰情况">
              {form.getFieldDecorator('award', {
                rules: [{required: false}],
                initialValue: selectedValues.award ? selectedValues.award : testValue,
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="获奖励和受表彰情况" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
              {form.getFieldDecorator('remark', {
                rules: [{required: false}],
                initialValue: selectedValues.projectId ? selectedValues.projectId : testValue,
              })(<Input.TextArea disabled={checkDetail} width={'100%'} placeholder="请输入" rows={4}/>)}
            </FormItem>
          </Col>
        </Row>
       {/* <Row gutter={8}>
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
        </Row>*/}
      </div>
    </Modal>
  );
});

@Form.create()
class PeopleInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      updateModalVisible: false,
      selectedRows: [],
      formValues: {},
      pageLoading: false,
      selectedValues:{},
      checkDetail:false
    }
  }

  columns = [
    {
      title: '人员编码',
      dataIndex: 'code',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName'
    },
    {
      title: '职务',
      dataIndex: 'position',
    },
    {
      title: '职称',
      dataIndex: 'jobTitle',
    },
    {
      title: '参加工作年限',
      dataIndex: 'workTime',
      render(val) {
        return <span>{val}年</span>;
      },
    },
    {
      title: '学历',
      dataIndex: 'firstDegreeLevel'
    },
    {
      title: '手机号码',
      dataIndex: 'phone'
    },
    {
      title: 'QQ号码',
      dataIndex: 'qqNumber',
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '身份证号码',
      dataIndex: 'idCard'
    },
    {
      title: '已取得证书',
      dataIndex: 'certificate'
    },
    {
      title: '籍贯（省/市/区/显）',
      dataIndex: 'jiguan'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render(val) {
        return <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark'
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
          {getButtons(button, pageButtons[2]) ?
            <Fragment>
              <a onClick={()=>this.handleCheckDetail(true,record)}>查看</a>
              <Divider type="vertical"/>
            </Fragment>: null}
          <a>下载简历</a>
        </Fragment>
      )}
    },
  ];

  componentDidMount() {
   // const {dispatch} = this.props;
    this.getList()
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
    console.log(record)
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
      sex: fieldsValue.sex,
      brithday: fieldsValue.brithday,
      famousFamily: fieldsValue.famousFamily,
      jiguan: fieldsValue.jiguan,
      jobTitle: fieldsValue.jobTitle,
      position: fieldsValue.position,
      workTime: fieldsValue.workTime,
      specialty: fieldsValue.specialty,
      birthplace: fieldsValue.birthplace,
      idCard: fieldsValue.idCard,
      phone: fieldsValue.phone,
      qqNumber: fieldsValue.qqNumber,
      homeAddress: fieldsValue.homeAddress,
      projectName: fieldsValue.projectName,
      status: fieldsValue.status,
      firstDegreeSchool: fieldsValue.firstDegreeSchool,
      firstDegreeTime: fieldsValue.firstDegreeTime,
      firstDegreeProfession: fieldsValue.firstDegreeProfession,
      firstDegreeLevel: fieldsValue.firstDegreeLevel,
      secondDegreeSchool: fieldsValue.secondDegreeSchool,
      secondDegreeLevel: fieldsValue.secondDegreeLevel,
      secondDegreeTime: fieldsValue.secondDegreeTime,
      secondDegreeProfession: fieldsValue.secondDegreeProfession,
      workExperience: fieldsValue.workExperience,
      joinAssociationTime:fieldsValue.joinAssociationTime,
      training: fieldsValue.training,
      certificate:fieldsValue.certificate,
      award: fieldsValue.award,
      remark:fieldsValue.remark,
      headUrl:fieldsValue.headUrl
    }
    if (updateModalVisible) {
      dispatch({
        type: 'peopleManage/update',
        payload: {...payload, ...{id: selectedValues.id}},
        token: user.token
      }).then(res=>{
        if (res) {
          this.handleUpdateModalVisible()
          this.getList()
        }
      })
    } else {
      dispatch({
        type: 'peopleManage/add',
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

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.searchList} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectName')(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="职务">
              {getFieldDecorator('jobTitle')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="成本副经理">成本副经理</Option>
                  <Option value="成本副经理兼部长">成本副经理兼部长</Option>
                  <Option value="部长">部长</Option>
                  <Option value="副部长">副部长</Option>
                  <Option value="部员">部员</Option>
                  <Option value="部见习生">部见习生</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="参加工作年限">
              {getFieldDecorator('workTime')(
                <Input addonAfter={'年'}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="学历">
              {getFieldDecorator('firstDegreeLevel')(<Select style={{width: '100%'}}>
                <Option value="专科">专科</Option>
                <Option value="本科">本科</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col push={6} md={12} sm={24}>
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
      peopleManage: {data},
      loading,
      app:{user}
    } = this.props;
    const {selectedRows, modalVisible, pageLoading,updateModalVisible,checkDetail,selectedValues} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
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
        <PageHeaderWrapper title="人员信息">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                {user.token&&getButtons(user.permissionsMap.button,pageButtons[0]) ?
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新增
                  </Button> : null}
                {user.token&&getButtons(user.permissionsMap.button,pageButtons[3]) ?
                  <Button icon="plus" type="primary">
                    导出
                  </Button> : null}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading.effects['peopleManage/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: '200%'}}
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
      type: 'peopleManage/fetch',
      payload: {page: page, pageSize: pageSize}
    });
  }

  searchList = (e,page = 1, pageSize = 10) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      let payload = {
        page: page,
        pageSize: pageSize,
        name: fieldsValue.name,
        projectName: fieldsValue.projectName,
        jobTitle: fieldsValue.jobTitle,
        workTime: fieldsValue.workTime,
        firstDegreeLevel: fieldsValue.firstDegreeLevel
      }
      cleanObject(payload)
      this.props.dispatch({
        type: 'peopleManage/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

PeopleInfo.propTypes = {}

export default connect(({app, rule, loading,peopleManage}) => ({app, rule, loading,peopleManage}))(PeopleInfo)
