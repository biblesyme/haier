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
    domainNameInput: false,
    name: '',
  }

  componentWillMount() {
    const {resource, domainAdmins = [], accounts = [], } = this.props
    this.setState({name: resource.name})
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

  domianNameUpdate = () => {
    // this.setState({name: e.target.value})
    let payload = {
      data: {
        ...this.props.resource,
        name: this.state.name,
      },
      action: 'update',
      failCB: () => message.error('领域名修改失败'),
      successCB: () => {
        this.props.dispatch({'type': 'AreaManage/findDomain'})
        message.success('领域名修改成功')
        this.setState({domainNameInput: false})
      },
    }
    this.props.dispatch({'type': 'App/doAction', payload})
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
            <Form>
              <FormItem
                {...formItemLayout}
                label="当前领域"
              >
                {!this.state.domainNameInput ? (
                  <p>
                    {this.state.name}
                    <Icon className="mg-l10"
                          type="edit"
                          style={{cursor: 'pointer'}}
                          onClick={e => this.setState({domainNameInput: true})}
                    />
                  </p>
                ) : (
                  <p>
                    <Input style={{width: '70%'}}
                           value={this.state.name}
                           onChange={(e) => this.setState({name: e.target.value})}
                    />
                    <Button onClick={e => this.domianNameUpdate()}
                            type="primary"
                    >更新</Button>
                  </p>
                )}
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
            <Form>
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
