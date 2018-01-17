import React from 'react'

import {
  Modal,
  Form,
  Input,
  Select,
  Icon,
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
  }
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      let value = {
        name: values.name,
      }
      this.props.onOk(value)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {resource} = this.props
    return (
      <div>
        <Modal
          title="修改领域"
          {...this.props}
          okText="修改"
          cancelText="取消"
          onOk={this.submit}
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="当前领域"
              >
                {resource.name}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="当前团队长"
              >
                <p>张三  12123124231<Icon  className="mg-l10" type="delete" style={{cursor: 'pointer'}}/></p>
                <p>张三  12123124231<Icon  className="mg-l10" type="delete" style={{cursor: 'pointer'}}/></p>
                <p>张三  12123124231<Icon  className="mg-l10" type="delete" style={{cursor: 'pointer'}}/></p>
              </FormItem>
            </Form>
            <h3>新增团队长</h3>
            <Form onSubmit={this.handleSubmit}>
              {/* <FormItem
                {...formItemLayout}
                label="账号"
              >
                {getFieldDecorator('email', {
                  rules: [{
                    required: true, message: 'Please input your E-mail!',
                  }],
                })(
                  <Input />
                )}
              </FormItem> */}
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                {getFieldDecorator('email', {
                  rules: [{
                    required: true, message: 'Please input your E-mail!',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
            </Form>
        </Modal>
      </div>

    )
  }
}
