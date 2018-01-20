import React from 'react'

import {
  Modal,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Divider,
  message,
} from 'antd'
import { connect } from 'utils/ecos'

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
@connect(null, ['AreaManage', 'App'])
export default class C extends React.Component {
  state = {
    members: [],
    searchName: '',
    searchAccount: '',
  }

  componentWillMount() {
    let payload = {
      data: {
        externalId: this.props.form.getFieldValue('domainAdmin'),
        ...this.props.resource,
      },
      link: 'admins'
    }
    this.props.dispatch({'type': 'App/followLink', payload})
  }

  addMember = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      let newMembers = this.state.members
      let payload = {
        data: {
          externalId: this.props.form.getFieldValue('domainAdmin'),
          ...this.props.resource,
        },
        action: 'addAdmin',
        failCB: () => message.error('团队长新增失败'),
        successCB: () => {
          this.props.dispatch({'type': 'AreaManage/findDomainAdmin'})
          message.success('团队长新增成功')
        }
      }
      this.props.dispatch({'type': 'App/doAction', payload})
    })
  }

  deleteMember = (e, externalId) => {
    console.log(e)
    let payload = {
      data: {
        externalId,
        ...this.props.resource,
      },
      action: 'deleteAdmin',
      failCB: () => message.error('团队长删除失败'),
      successCB: () => {
        this.props.dispatch({'type': 'AreaManage/findDomainAdmin'})
        message.success('团队长删除成功')
      },
    }
    this.props.dispatch({'type': 'App/doAction', payload})
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
    const {resource, domainAdmins = [], accounts = [], } = this.props
    const members = domainAdmins.map(domainAdmin => {
      return (
        <p key={domainAdmin.id}>
          {`${domainAdmin.account.name} ${domainAdmin.account.externalId}`}
          <Icon className="mg-l10"
                type="delete"
                style={{cursor: 'pointer'}}
                onClick={e => this.deleteMember(e, domainAdmin.account.externalId)}
          />
        </p>
      )
    })

    return (
      <div>
        <Modal
          title="修改领域"
          {...this.props}
          onOk={this.submit}
          destroyOnClose={true}
          key={resource.id}
          footer={
            <div className="text-center">
              <Button onClick={this.props.onCancel} >返回</Button>
            </div>
          }
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
            <Divider dashed></Divider>
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
                    <Search placeholder="请输入团队长账号" style={{width: '80%'}} onChange={this.searchDomainAdmin}/>
                  )}
                  <Button onClick={this.addMember}><Icon type="plus" /></Button>
                </div>
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
