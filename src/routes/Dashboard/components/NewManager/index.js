import React from 'react'

import {
  Modal,
  Form,
  Input,
  Select,
} from 'antd'
const FormItem = Form.Item

const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  style: {
    marginBottom: '10px'
  }
};

@Form.create()
export default class C extends React.Component {
  state = {
    searchName: '',
    searchAccount: '',
  }
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      this.props.onOk(this.state.searchName)
    })
  }

  searchDomainAdmin = (e) => {
    let value = e.target.value
    let account = this.props.accounts.filter(d => d.externalId === value)[0]
    if (account !== undefined) {
      this.setState({
        searchName: account.name,
        searchAccount: account.externalId,
      })
    } else {
      this.setState({
        searchName: '账号不存在',
        searchAccount: '',
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {type} = this.props
    return (
      <div>
        <Modal
          title={
            <div className="text-center">
              {type === 'business' ? '添加业务负责人' : '添加技术负责人'}
            </div>
          }
          {...this.props}
          okText="添加"
          cancelText="取消"
          onOk={this.submit}
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="账号"
              >
                {getFieldDecorator('account', {
                  rules: [{
                    required: true, message: '请输入',
                  }],
                })(
                  <Input placeholder="请输入账号" onChange={this.searchDomainAdmin}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户信息"
              >
                <p>{`${this.state.searchName} ${this.state.searchAccount}`}</p>
              </FormItem>
            </Form>
        </Modal>
      </div>

    )
  }
}
