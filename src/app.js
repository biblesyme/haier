import React from 'react'
import renderRoutes from 'utils/renderRoutes'
import {Link} from 'react-router-dom'
import { Tabs, Button,Menu, Spin, message } from 'antd';
import Spinner from './components/Spinner'

import styles from './app.sass'
import './antd.less'

import { connect } from 'utils/ecos'
import model from './models'

import LoginForm from './components/pages/LoginForm'
import MainPage from './components/pages/MainPage'
import apiStore from 'utils/apiStore'

const TabPane = Tabs.TabPane;
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.selfDispatch({type: 'findAccount'})
    this.props.selfDispatch({
      type: 'setState',
      payload: {login: false}
    })
  }

  init = ()=>{
    this.props.selfDispatch({
      type: 'loadSchema'
    })
  }
  submit = (e, values) => {
    const {accounts=[]} = this.props.reduxState
    let account = accounts.filter(a => a.externalId === values.username)
    if (account.length > 0) {
      this.props.selfDispatch({
        type: 'setState',
        payload: {
          login: true,
          user: account[0],
        }
      })
    } else {
      message.error('账号不存在')
    }
  }
  exit = ()=>{
    this.props.selfDispatch({
      type: 'setState',
      payload: {login: false}
    })
  }

  updateLoading = (loading) => {
    this.setState({loading})
  }

  render() {
    // console.log(this.props, '=========')
    let output = <LoginForm
                  submit={this.submit}
                  ></LoginForm>
    if(this.props.reduxState&&this.props.reduxState.login){
      output = (

          <MainPage init={this.init} exit={this.exit}>{renderRoutes(this.props.route.routes, {app: this.props.app})}
            <Spin spinning={this.props.reduxState.loading}
                  tip="加载中..."
                  size="large"
                  style={{position: 'absolute', top: '50%', left: '50%'}}
            >
                    </Spin>
          </MainPage>

      )
    }
    return (
      <div className="page-wrap">
        {output}
      </div>
    );
  }
}

export default connect(model)(App,true)
