import React,{Component}from 'react'
import { connect } from 'dva'
import { Page } from 'components'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    return (
      <Page loading={false} >
      </Page>
    )
  }
}

Home.propTypes = {

}

export default connect(({app}) => ({ app }))(Home)
