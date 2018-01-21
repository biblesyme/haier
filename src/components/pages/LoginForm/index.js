import React from 'react'
import {Form, Icon, Input, Button, Radio} from 'antd'

import styles from './styles.scss'

@Form.create()
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
    const Username = this.props.form.getFieldDecorator('username', {
                        rules: [{
                          required: true, message: '请输入',
                        }],
                      })(
                        <Input prefix={<Icon type="user" />} placeholder="请输入账号" />
                      )
    const Password = <Input type="password"  prefix={<Icon type="lock" />} placeholder="密码" />
    return {Password, Username}
  }
  submit(e){
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      this.props.submit(e, values);
    })
  }
  render(){
    return (
      <div className={styles.wrapper}>
        <Form onSubmit={this.submit.bind(this)} className={[styles.root , this.props.className].join(' ')}>
          <h3 className={styles.title}>登录</h3>
          <Form.Item hasFeedback style={{marginBottom: '20px'}}>{this.formItems().Username}</Form.Item>
          {/* <Form.Item hasFeedback style={{marginBottom: '20px'}}>{this.formItems().Password}</Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginButton}> 登录 </Button>
          </Form.Item>
          <div className={styles.footer}>
            <a disabled onClick={this.forgotPassword}>忘记密码?</a>
          </div>
        </Form>
      </div>
    )
  }
}
