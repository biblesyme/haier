import React from 'react'
import renderRoutes from 'utils/renderRoutes'
import {Link} from 'react-router-dom'
import { Tabs, Button,Menu, Spin, message } from 'antd';
import Spinner from './components/Spinner'
import {getCookieItem, b64DecodeUnicode} from 'utils/cookies'
import apiStore from 'utils/apiStore'

import styles from './app.sass'
import './antd.less'

import { connect } from 'utils/ecos'
import model from './models'

import LoginForm from './components/pages/LoginForm'
import MainPage from './components/pages/MainPage'

const TabPane = Tabs.TabPane;

const url = window.location.origin
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // document.cookie = `csid=9DC093072EEA274D6DE99B6E32C8CBF7;`
    this.props.selfDispatch({
      type: 'setState',
      payload: {login: false}
    })
    this.props.selfDispatch({
      type: 'loadSchema',
      payload: {
        failCB: (e) => {
          if (e.error && e.error.response && e.error.response.status === 401) {
          // if (e.error.response.status === 401) {
            window.location.href=`http://t.c.haier.net/login?url=${url}`
          }
        },
        successCB: () => {
          let user = {}
          if (getCookieItem('account') !== null) {
            user = JSON.parse(b64DecodeUnicode(getCookieItem('account')))
            this.props.selfDispatch({
              type: 'findUser',
              payload: {
                id: user.id,
                successCB: () => this.props.selfDispatch({ type: 'setState', payload: {login: true}})
            }})
          }
        }
      }
    })
  }

  init = ()=>{

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

    return (
      <div className="page-wrap">
        {
          this.props.reduxState.login === true ?
          (
                <MainPage init={this.init} exit={this.exit}>{renderRoutes(this.props.route.routes, {app: this.props.app})}
                  <Spin spinning={this.props.reduxState.loading}
                        tip="加载中..."
                        size="large"
                        style={{position: 'absolute', top: '50%', left: '50%'}}
                  />
                </MainPage>
          ) : <p>验证中</p>
        }
      </div>
    );
  }
}

export default connect(model)(App,true)
