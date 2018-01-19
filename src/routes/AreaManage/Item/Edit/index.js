import React from 'react'

import {
  Modal,
  Form,
  Input,
  Select,
  Icon,
  Button,
} from 'antd'
const FormItem = Form.Item

const { Option } = Select
const {Search} = Input

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

const formPostLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 12 },
  },
  style: {
    marginBottom: '10px'
  }
};

@Form.create()
export default class C extends React.Component {
  state = {
    members: [],
  }

  componentWillMount() {
    let members = [{
      name: '张三',
      accout: '12123124231'
    }, {
      name: '李四',
      accout: '12123124232'
    }, {
      name: '王五',
      accout: '12123124233'
    }]
    this.setState({members})
  }

  addMember = () => {
    let newMembers = this.state.members
    newMembers.push({
      accout: this.props.form.getFieldValue('domainAdmin'),
      name: '张三'
    })
    this.setState({
      members: newMembers,
    })
  }

  deleteMember = (e, accout) => {
    let newMembers = this.state.members.filter(m => m.accout !== accout)
    this.setState({
      members: newMembers,
    })
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      let value = {
        name: this.props.resource.name,
        id: this.props.resource.id,
        domainAdmin: values.domainAdmin,
      }
      this.props.onOk(value)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {resource} = this.props

    const members = this.state.members.map(m => {
      return (
        <p key={m.accout}>
          {`${m.name} ${m.accout}`}
          <Icon className="mg-l10"
                type="delete"
                style={{cursor: 'pointer'}}
                onClick={e => this.deleteMember(e, m.accout)}
          />
        </p>
      )
    })

    return (
      <div>
        <Modal
          title="修改领域"
          {...this.props}
          okText="修改"
          cancelText="取消"
          onOk={this.submit}
          destroyOnClose={true}
          key={resource.id}
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
                {members}
              </FormItem>
            </Form>
            <h3>新增团队长</h3>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="账号"
              >
                <div>
                  {getFieldDecorator('domainAdmin', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Search placeholder="请输入团队长账号" style={{width: '70%'}}/>
                  )}
                  <Button onClick={this.addMember}><Icon type="plus" /></Button>
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户信息"
              >
                <p>张三  12123124231</p>
              </FormItem>
            </Form>
        </Modal>
      </div>

    )
  }
}
