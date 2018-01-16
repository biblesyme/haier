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

    return (
      <div>
        <Modal
          title="新增领域"
          {...this.props}
          okText="添加"
          cancelText="取消"
          onOk={this.submit}
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="领域"
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入',
                  }],
                })(
                  <Input placeholder="请输入领域名称"/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="账号"
              >
                <Input />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户名"
              >
                  <Input />
              </FormItem>
            </Form>
        </Modal>
      </div>

    )
  }
}
