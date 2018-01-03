import React from 'react'
import renderRoutes from 'utils/renderRoutes'
import {Link} from 'react-router-dom'
import { Tabs, Button,Menu } from 'antd';

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
  render() {
    // console.log(this.props, '=========')
    let output = <LoginForm
                  submit={this.submit.bind(this)}
                  ></LoginForm>
    if(this.props.reduxState&&this.props.reduxState.login){
      output = <MainPage init={this.init} exit={this.exit}>{renderRoutes(this.props.route.routes, {app: this.props.app})}</MainPage>
    }
    return (
      <div className="page-wrap">
        {output}
      </div>
    );
  }
}

export default connect(model)(App,true)
