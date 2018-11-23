import React,{Component}from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import styles from './index.less'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    let res = []
  }


  render() {
    return (
      <Page loading={false} className={styles.dashboard}>
        首页
      </Page>
    )
  }
}

Home.propTypes = {

}

export default connect(({app}) => ({ app }))(Home)
