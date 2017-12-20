import React from 'react'
import {Form, Icon, Input, Button, Radio} from 'antd'

import styles from './styles.scss'
export default class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
    loginState: '',
    loginMessage: ''
  }
  formItems() {
    const options = {
      username: {
        rules: [{required: true, message: '请输入用户名'}],
      },
      password: {
        rules: [{required: true, message: '请输入密码'}],
        // rules: [{validator: passwordValidator}],
      },
    }
    const Username = <Input prefix={<Icon type="user" />} placeholder="用户名" />
    const Password = <Input type="password"  prefix={<Icon type="lock" />} placeholder="密码" />
    return {Password, Username}
  }
  render(){
    return (
      <Form onSubmit={this.props.submit} className={[styles.root , this.props.className].join(' ')}>
        <h3 className={styles.title}>登录</h3>
        <Form.Item hasFeedback style={{marginBottom: '20px'}}>{this.formItems().Username}</Form.Item>
        <Form.Item hasFeedback style={{marginBottom: '20px'}}>{this.formItems().Password}</Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.loginButton}> 登录 </Button>
        </Form.Item>
        <div className={styles.footer}>
          <a disabled onClick={this.forgotPassword}>忘记密码?</a>
        </div>
      </Form>
    )
  }
}