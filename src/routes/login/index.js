import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button, Row, Form, Input, Layout} from 'antd'
import {config} from 'utils'
import styles from './index.less'

const FormItem = Form.Item
const {Content, Footer} = Layout

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loginLoading: false
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/showLoading', payload: {loading: false}
    })
  }

  handleOk = async (validateFieldsAndScroll) => {
    validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return
      }
      //{account:values.username,password:values.password}
      this.setState({loginLoading: true})
      await this.props.dispatch({type: 'app/login', payload: {account: values.username, password: values.password}})
      // await this.props.dispatch({ type: 'app/login', payload: values })
      this.setState({loginLoading: false})
    })
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        validateFieldsAndScroll
      }
    } = this.props
    const {loginLoading} = this.state
    return (
      <Layout style={{height: '100vh', backgroundColor: '#FFFFFF'}} id="mainContainer">
        <Content>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt="logo" src={config.logo}/>
            <span>{config.name}</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名'
                  },
                ],
              })(<Input onPressEnter={() => this.handleOk(validateFieldsAndScroll)} placeholder="Username"/>)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码'
                  },
                ],
              })(<Input type="password" onPressEnter={() => this.handleOk(validateFieldsAndScroll)}
                        placeholder="Password"/>)}
            </FormItem>
            <Row>
              <Button type="primary" onClick={() => this.handleOk(validateFieldsAndScroll)} loading={loginLoading}>
                登录
              </Button>
              {/*<p>
              <span>用户名：admin</span>
              <span>密码：admin</span>
            </p>*/}
            </Row>
          </form>
        </div>
        </Content>
        <Footer style={{backgroundColor: '#FFFFFF'}}>
          {config.footerText}
        </Footer>
      </Layout>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default connect(({app}) => ({app}))(Form.create()(Login))
