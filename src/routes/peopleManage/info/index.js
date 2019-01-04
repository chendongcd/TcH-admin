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
  Icon,
  Upload
} from 'antd';
import {Page, PageHeaderWrapper, StandardTable, PreFile} from 'components'
import styles from './index.less'
import {getButtons, cleanObject, QiNiuOss, ImageUrl} from 'utils'
import {menuData} from "../../../common/menu";
import {PEOPLE_EXPORT, PEOPLE_PDF} from 'common/urls'
import {nationals} from 'common/types'
import {apiDev} from 'utils/config'
import {createURL} from 'services/app'

const FormItem = Form.Item;

const {Option} = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const pageButtons = menuData[16].buttons.map(a => a.permission)
const testValue = ''
const info_css = {
  color: '#fa541c',
  textAlign: 'center',
  marginLeft: 18
}
const degree = ['专科', '本科', '研究生']
@Form.create()
class CreateForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      progress: 0
    };
    this.upload = null
  }

  componentDidUpdate(preProp, preState) {
    if (!preProp.selectedValues.headUrl && this.props.selectedValues.headUrl && this.state.fileList.length == 0) {
      let pdf = JSON.parse(this.props.selectedValues.headUrl)
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
      console.log(fieldsValue)
      if (err) return;
      for (let prop in fieldsValue) {
        if (fieldsValue[prop] instanceof moment) {
          fieldsValue[prop] = fieldsValue[prop].format('YYYY-MM-DD')
        }
      }
      fieldsValue.headUrl = `{"url":"${this.state.fileList[0].url}","fileName":"${this.state.fileList[0].name}"}`

      // form.resetFields();
      handleAdd(fieldsValue, updateModalVisible, selectedValues, this.cleanState);
    });
  };

  cleanState = () => {
    this.setState({fileList: [], previewImage: ''})
  }

  handleCancel = () => this.setState({previewVisible: false})

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  componentWillUnmount() {
    this.upload = null
  }

  handleChange = ({fileList}) => {
    this.setState({fileList})
  }

  render() {
    const {modalVisible, loading,proNames, form, handleModalVisible, handleUpdateModalVisible, updateModalVisible, handleCheckDetail, selectedValues, checkDetail, normFile} = this.props;
    let {previewVisible, previewImage, fileList, progress} = this.state
    return (
      <Modal
        destroyOnClose
        title={checkDetail ? '管理人员信息' : updateModalVisible ? "编辑管理人员" : "新增管理人员"}
        bodyStyle={{padding: 0 + 'px'}}
        visible={modalVisible}
        width={992}
        maskClosable={false}
        okButtonProps={{loading:loading}}
        onOk={() => checkDetail ? handleCheckDetail() : this.okHandle()}
        onCancel={() => {
          this.cleanState()
          checkDetail ? handleCheckDetail() : updateModalVisible ? handleUpdateModalVisible() : handleModalVisible()
        }
        }
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
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="项目名称">
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
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="状态">
                {form.getFieldDecorator('status', {
                  rules: [{required: true, message: '请选择状态'}],
                  initialValue: selectedValues.status ? selectedValues.status : testValue,
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
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
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="身份证号">
                {form.getFieldDecorator('idCard', {
                  rules: [{required: true, message: '请输入身份证号'}],
                  initialValue: selectedValues.idCard ? selectedValues.idCard : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入身份证号'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="性别">
                {form.getFieldDecorator('sex', {
                  rules: [{required: true, message: '请选择性别'}],
                  initialValue: selectedValues.sex ? selectedValues.sex : testValue,
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="出生日期">
                {form.getFieldDecorator('brithday', {
                  rules: [{required: true, message: '请选择出生日期'}],
                  initialValue: selectedValues.brithday ? moment(selectedValues.brithday) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择出生日期"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="联系电话">
                {form.getFieldDecorator('phone', {
                  rules: [{required: true, message: '请输入联系电话'}],
                  initialValue: selectedValues.phone ? selectedValues.phone : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入联系电话'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="QQ">
                {form.getFieldDecorator('qqNumber', {
                  rules: [{required: true, message: '请输入QQ号'}],
                  initialValue: selectedValues.qqNumber ? selectedValues.qqNumber : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入QQ号'/>)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="邮箱">
                {form.getFieldDecorator('email', {
                  rules: [{required: true, message: '请输入邮箱'}],
                  initialValue: selectedValues.email ? selectedValues.email : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入邮箱'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="民族">
                {form.getFieldDecorator('famousFamily', {
                  rules: [{required: true, message: '请选择民族'}],
                  initialValue: selectedValues.famousFamily ? selectedValues.famousFamily : testValue,
                })(<Select className={styles.customSelect} showSearch={true} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {nationals.map((a, index) => <Option key={index} value={a}>{a}</Option>)}
                </Select>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="健康状况">
                {form.getFieldDecorator('health', {
                  initialValue: selectedValues.health ? selectedValues.health : testValue,
                })(<Select className={styles.customSelect} disabled={checkDetail}
                           style={{width: '100%'}}>
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
                  initialValue: selectedValues.joinAssociationTime ? moment(selectedValues.joinAssociationTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="籍贯">
                {form.getFieldDecorator('jiguan', {
                  rules: [{required: true, message: '请输入籍贯'}],
                  initialValue: selectedValues.jiguan ? selectedValues.jiguan : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入籍贯'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="职称">
                {form.getFieldDecorator('jobTitle', {
                  initialValue: selectedValues.jobTitle ? selectedValues.jobTitle : testValue,
                })(<Input disabled={checkDetail} />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="职务">
                {form.getFieldDecorator('position', {
                  rules: [{required: true, message: '请选择职务'}],
                  initialValue: selectedValues.position ? selectedValues.position : testValue,
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  <Option value="成本副经理">副总工兼部长</Option>
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
                  rules: [{required: true, message: '请输入参加工作年限'}],
                  initialValue: selectedValues.workTime ? selectedValues.workTime : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入参加工作年限' addonAfter={'年'}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="特长">
                {form.getFieldDecorator('specialty', {
                  rules: [{required: true, message: '请输入特长'}],
                  initialValue: selectedValues.specialty ? selectedValues.specialty : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入特长'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="家庭住址">
                {form.getFieldDecorator('homeAddress', {
                  rules: [{required: true, message: '请输入家庭住址'}],
                  initialValue: selectedValues.homeAddress ? selectedValues.homeAddress : testValue,
                })(<Input disabled={checkDetail} placehloder='请输入家庭住址'/>)}
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
                })(<Input disabled={checkDetail} placeholder="请输入毕业院校"/>)}
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
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="毕业时间">
                {form.getFieldDecorator('firstDegreeTime', {
                  rules: [{required: true, message: '请输入毕业时间'}],
                  initialValue: selectedValues.firstDegreeTime ? moment(selectedValues.firstDegreeTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择毕业时间"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem style={{marginLeft: 16 + 'px'}} labelCol={{span: 4}} wrapperCol={{span: 10}} label="学历">
                {form.getFieldDecorator('firstDegreeLevel', {
                  rules: [{required: true, message: '请选择学历'}],
                  initialValue: selectedValues.firstDegreeLevel ? selectedValues.firstDegreeLevel : testValue,
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {degree.map((a, index) => {
                    return <Option key={index} value={a}>{a}</Option>
                  })}
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
                })(<Input disabled={checkDetail} placeholder="请输入毕业院校"/>)}
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
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="毕业时间">
                {form.getFieldDecorator('secondDegreeTime', {
                  rules: [{required: false}],
                  initialValue: selectedValues.secondDegreeTime ? moment(selectedValues.secondDegreeTime) : null,
                })(<DatePicker disabled={checkDetail} style={{width: '100%'}} placeholder="请选择毕业时间"/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem style={{marginLeft: 16 + 'px'}} labelCol={{span: 4}} wrapperCol={{span: 10}} label="学历">
                {form.getFieldDecorator('secondDegreeLevel', {
                  rules: [{required: false}],
                  initialValue: selectedValues.secondDegreeLevel ? selectedValues.secondDegreeLevel : testValue,
                })(<Select className={styles.customSelect} disabled={checkDetail} placeholder="请选择"
                           style={{width: '100%'}}>
                  {degree.map((a, index) => {
                    return <Option key={index} value={a}>{a}</Option>
                  })}
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
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="工作经历" rows={4}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="职业资格证书取证情况">
                {form.getFieldDecorator('certificate', {
                  rules: [{required: false}],
                  initialValue: selectedValues.certificate ? selectedValues.certificate : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="职业资格证书取证情况" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 6}} wrapperCol={{span: 15}} label="学习及培训经历">
                {form.getFieldDecorator('training', {
                  rules: [{required: false}],
                  initialValue: selectedValues.training ? selectedValues.training : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="学习及培训经历" rows={4}/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem labelCol={{span: 7}} wrapperCol={{span: 15}} label="获奖励和受表彰情况">
                {form.getFieldDecorator('award', {
                  rules: [{required: false}],
                  initialValue: selectedValues.award ? selectedValues.award : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="获奖励和受表彰情况" rows={4}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem style={{marginLeft: 0}} labelCol={{span: 3}} wrapperCol={{span: 15}} label="头像">
                {form.getFieldDecorator('headUrl', {
                  rules: [{required: true, message: '必须上传照片'}],
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                  initialValue: selectedValues.headUrl ? [selectedValues.headUrl] : [],
                })(
                  <Upload.Dragger onChange={this.handleChange}
                                  accept={'image/*'}
                                  showUploadList={false}
                    // fileList={fileList}
                                  listType="picture"
                                  name="files"
                                  disabled={fileList.length > 0 || checkDetail}
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
                <PreFile noPdf={true} disabled={checkDetail} onClose={this.remove} onPreview={this.handlePreview}
                         progress={progress} file={fileList[0]}/>
                <span style={info_css}>必须上传照片</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{span: 3}} wrapperCol={{span: 15}} label="备注">
                {form.getFieldDecorator('remark', {
                  rules: [{required: false}],
                  initialValue: selectedValues.projectId ? selectedValues.projectId : testValue,
                })(<Input.TextArea className={styles.customSelect} disabled={checkDetail} width={'100%'}
                                   placeholder="请输入" rows={4}/>)}
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
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </Modal>
    )
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
    }
    this.setState({fileList: [file]})
    this.props.form.setFieldsValue({headUrl: [file]});
  }

  remove = (res) => {
    if (res.status == 'done') {
      this.props.form.setFieldsValue({headUrl: []});
    } else {
      this.upload.unsubscribe()
    }
    this.setState({fileList: []})
  }
}

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
      selectedValues: {},
      checkDetail: false
    }
    this.exportParams = {
      page: 1,
      pageSize: 10
    }
    console.log('进入page')
  }

  columns = [
    {
      title: '人员编码',
      dataIndex: 'id',
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
      title: '第一学历',
      dataIndex: 'firstDegreeLevel'
    },
    {
      title: '第二学历',
      dataIndex: 'secondDegreeLevel'
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
      title: '简历下载',
      render: (val, record) => {
        return (
          <a href={apiDev + PEOPLE_PDF + record.id} download={'信息卡'}>下载</a>
        )
      }
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
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
              : null}
            <Divider type="vertical"/>
            {getButtons(button, pageButtons[2]) ?
              <a onClick={() => this.handleCheckDetail(true, record)}>查看</a> : null}
          </Fragment>
        )
      }
    },
  ];

  componentDidMount() {
    // const {dispatch} = this.props;
    this.getProNames()
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

  handleAdd = (fieldsValue, updateModalVisible, selectedValues, cleanState) => {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });
    const {dispatch, app: {user}} = this.props;
    let payload = {
      name: fieldsValue.name,
      sex: fieldsValue.sex,
      brithday: fieldsValue.brithday,
      famousFamily: fieldsValue.famousFamily,
      jiguan: fieldsValue.jiguan,
      jobTitle: fieldsValue.jobTitle,
      position: fieldsValue.position,
      workTime: fieldsValue.workTime,
      specialty: fieldsValue.specialty,
      health: fieldsValue.health,
      idCard: fieldsValue.idCard,
      phone: fieldsValue.phone,
      qqNumber: fieldsValue.qqNumber,
      homeAddress: fieldsValue.homeAddress,
      projectId: fieldsValue.projectId,
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
      joinAssociationTime: fieldsValue.joinAssociationTime,
      training: fieldsValue.training,
      certificate: fieldsValue.certificate,
      award: fieldsValue.award,
      remark: fieldsValue.remark,
      headUrl: fieldsValue.headUrl,
      email:fieldsValue.email
    }
    cleanObject(payload)
    if (updateModalVisible) {
      dispatch({
        type: 'peopleManage/update',
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
        type: 'peopleManage/add',
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
              {getFieldDecorator('position')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="成本副经理">成本副经理</Option>
                  <Option value="成本副经理兼部长">成本副经理兼部长</Option>
                  <Option value="部长">部长</Option>
                  <Option value="副部长">副部长</Option>
                  <Option value="部员">部员</Option>
                  <Option value="见习生">见习生</Option>
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
            <FormItem label="第一学历">
              {getFieldDecorator('firstDegreeLevel')(<Select style={{width: '100%'}}>
                {degree.map((a, index) => {
                  return <Option key={index} value={a}>{a}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="第二学历">
              {getFieldDecorator('secondDegreeLevel')(<Select style={{width: '100%'}}>
                {degree.map((a, index) => {
                  return <Option key={index} value={a}>{a}</Option>
                })}
              </Select>)}
            </FormItem>
          </Col>
          <Col push={6} md={12} sm={24}>
            <div>
              <div>
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
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const {
      peopleManage: {data, proNames},
      loading,
      app: {user}
    } = this.props;
    const {selectedRows, modalVisible, pageLoading, updateModalVisible, checkDetail, selectedValues} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      normFile: this.normFile,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCheckDetail: this.handleCheckDetail,

    };
    const parentState = {
      updateModalVisible: updateModalVisible,
      modalVisible: modalVisible,
      selectedValues: selectedValues,
      checkDetail: checkDetail,
      proNames: proNames,
      loading:loading.effects[`peopleManage/${updateModalVisible?'update':'add'}`]
    }
    const exportUrl = createURL(PEOPLE_EXPORT, {...this.exportParams, ...{token: user.token}})
    return (
      <Page inner={true} loading={pageLoading}>
        <PageHeaderWrapper title="人员信息">
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
                loading={loading.effects['peopleManage/fetch']}
                bordered
                data={data}
                rowKey={'id'}
                scroll={{x: '300%'}}
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

  getProNames = (proName = []) => {
    if (proName.length < 1) {
      this.props.dispatch(
        {
          type: 'peopleManage/queryProNames',
          payload: {page: 1, pageSize: 10},
          token: this.props.app.user.token
        }
      )
    }
  }

  getList = (page = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'peopleManage/fetch',
      payload: {page: page, pageSize: pageSize}
    });
  }

  searchList = (e, page = 1, pageSize = 10) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      //  form.resetFields();
      let payload = {
        page: page,
        pageSize: pageSize,
        name: fieldsValue.name,
        projectName: fieldsValue.projectName,
        position: fieldsValue.position,
        workTime: fieldsValue.workTime,
        firstDegreeLevel: fieldsValue.firstDegreeLevel,
        secondDegreeLevel: fieldsValue.secondDegreeLevel
      }
      cleanObject(payload)
      this.exportParams = payload
      this.props.dispatch({
        type: 'peopleManage/fetch',
        payload: payload,
        token: this.props.app.user.token
      });
    });
  }
}

PeopleInfo.propTypes = {}

export default connect(({app, rule, loading, peopleManage}) => ({app, rule, loading, peopleManage}))(PeopleInfo)
