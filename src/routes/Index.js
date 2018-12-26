import React, {Component} from 'react';
import {connect} from 'dva';
import {Helmet} from 'react-helmet'
import PropTypes from 'prop-types'
import config from '../utils/config'
import {Loader, MyLayout,Page} from 'components'
import {BackTop, Layout} from 'antd'
import classnames from 'classnames'
import '../themes/index.less'

import {withRouter} from 'dva/router'
import MenuContext from "../components/Layout/MenuContext";
import PageHeader from "../components/PageHeader";
import Style from './Index.less'
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
    const {menu, siderFold, location, darkTheme, navOpenKeys, loading, isNavbar, user, prefix,contentWidth} = app
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
    const {iconFontJS, iconFontCSS, ico} = config
    return (
      <div>
        <Loader fullScreen spinning={loading}/>
        <Helmet>
          <title>成本管理系统</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="shortcut icon" href={ico}/>
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
              <MenuContext.Consumer>
                {value => (
                  <PageHeader
                    wide={contentWidth === 'Fixed'}
                    home={"首页"}
                    {...value}
                    key="pageheader"
                    app={app}
                    itemRender={item => {
                      return item.name;
                    }}
                  />
                )}
              </MenuContext.Consumer>
              <Content style={{minHeight: '100vh-100',position:'relative'}}>
                {children}
                {app.locationPathname==='/home'?null: <Page className={Style.loadingPage} inner={false} loading={true}/>}
              </Content>
              <Footer>
                {config.footerText}
              </Footer>
            </Layout>
          </Layout>
          :
          children.props.children.filter(r => r.props.path && r.props.path == '/login')}
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
