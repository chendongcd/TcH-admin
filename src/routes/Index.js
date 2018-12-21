import React, {Component} from 'react';
import {connect} from 'dva';
import {Helmet} from 'react-helmet'
import PropTypes from 'prop-types'
import config from '../utils/config'
import {Loader, MyLayout} from 'components'
import {BackTop, Layout} from 'antd'
import classnames from 'classnames'
import '../themes/index.less'

import {withRouter} from 'dva/router'

const {Content, Footer, Sider} = Layout
const {Header, styles} = MyLayout

class IndexPage extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    let {app, history} = this.props
    if (!app.user.token) {
      history.push('/login')
    }
  }

  render() {
    const {children, app, dispatch} = this.props
    const {menu, siderFold, location, darkTheme, navOpenKeys, loading, isNavbar, user, prefix} = app
    const siderProps = {
      menu,
      location,
      siderFold,
      darkTheme,
      navOpenKeys,
      changeTheme() {
        dispatch({type: 'app/switchTheme'})
      },
      changeOpenKeys(openKeys) {
        window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
        dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: openKeys}})
      },
    }
    const headerProps = {
      menu,
      user,
      location,
      siderFold,
      isNavbar,
      navOpenKeys,
      switchMenuPopover() {
        dispatch({type: 'app/switchMenuPopver'})
      },
      logout() {
        dispatch({type: 'app/logout'})
      },
      switchSider() {
        dispatch({type: 'app/switchSider'})
      },
      changeOpenKeys(openKeys) {
        dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: openKeys}})
      },
    }
    const {iconFontJS, iconFontCSS, logo} = config
    return (
      <div>
        <Loader fullScreen spinning={loading}/>
        <Helmet>
          <title>成本管理系统</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="icon" href={logo} type="image/x-icon"/>
          {/* <link rel="apple-touch-icon" href="http://mysite.com/img/apple-touch-icon-57x57.png" />*/}
          {iconFontJS && <script src={iconFontJS}/>}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS}/>}
        </Helmet>
        {user.token ? <Layout className={classnames({[styles.dark]: darkTheme, [styles.light]: !darkTheme})}>
            {!isNavbar && <Sider
              trigger={null}
              collapsible
              collapsed={app.siderFold}
            >
              {menu.length === 0 ? null : <MyLayout.Sider {...siderProps} />}
            </Sider>}
            <Layout style={{height: '100vh'}} id="mainContainer">
              <BackTop target={() => document.getElementById('mainContainer')}/>
              <Header className={classnames({[styles.dark]: darkTheme, [styles.light]: !darkTheme})} {...headerProps} />
              <Content style={{minHeight: '100vh-100'}}>
                {children}
              </Content>
              <Footer>
                {config.footerText}
              </Footer>
            </Layout>
          </Layout>
          :
          <div>
            <Layout style={{height: '100vh',backgroundColor:'#FFFFFF'}}>
              <Content>
                {children.props.children.filter(r => r.props.path && r.props.path == '/login')}
              </Content>
              <Footer style={{backgroundColor:'#FFFFFF'}}>
                {config.footerText}
              </Footer>
            </Layout>
          </div>}
      </div>
    );
  }
}

IndexPage.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default withRouter(connect(({app, loading}) => ({app, loading}))(IndexPage))
