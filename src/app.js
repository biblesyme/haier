import React from 'react'
import renderRoutes from 'utils/renderRoutes'
import {Link} from 'react-router-dom'
import { Tabs, Button,Menu, Spin } from 'antd';
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
  init = ()=>{
    this.props.selfDispatch({
      type: 'loadSchema'
    })
  }
  submit(){
    this.props.selfDispatch({
      type: 'setState',
      payload: {login: true}
    })
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
                  submit={this.submit.bind(this)}
                  ></LoginForm>
    if(this.props.reduxState&&this.props.reduxState.login){
      output = (
        <Spin spinning={this.props.reduxState.loading}
              tip="加载中..."
              size="large"
              style={{marginTop: '200px'}}
        >
          <MainPage init={this.init} exit={this.exit}>{renderRoutes(this.props.route.routes, {app: this.props.app})}</MainPage>
        </Spin>
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
