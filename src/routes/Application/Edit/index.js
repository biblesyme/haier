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
import nameMap from 'utils/nameMap'

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
@connect(null, ['Application', 'App'])
export default class C extends React.Component {
  state = {
    members: [],
    searchName: '',
    searchAccount: '',
    particpants: [],
  }

  update = () => {
    let payload = {
      data: {
        ...this.props.resource,
      },
      link: 'projectParticipants',
      successCB: (particpants) => {
        this.setState({particpants: particpants.content.filter(p => p.stat !== 'removed')})
      }
    }
    this.props.dispatch({'type': 'App/followLink', payload})
  }

  componentWillMount() {
    this.update()
  }

  addMember = () => {
    if (this.props.resource.state !== 'ResourceReady') {
      message.warning(`应用${nameMap[this.props.resource.state]} 无法操作成员`)
      return
    }
    this.props.form.validateFields((err, values) => {
      if (err) return
      let payload = {
        data: {
          ...this.props.resource,
          accountId: this.state.accountId,
          projectId: this.props.resource.id,
          accountExternalId: this.state.searchAccount,
        },
        action: 'addMember',
        failCB: () => message.error('项目成员新增失败'),
        successCB: () => {
          this.update()
          message.success('项目成员新增成功')
        }
      }
      this.props.dispatch({'type': 'App/doAction', payload})
    })
  }

  deleteMember = (e, accountId) => {
    if (this.props.resource.state !== 'ResourceReady') {
      message.warning(`应用${nameMap[this.props.resource.state]} 无法操作成员`)
      return
    }
    let payload = {
      data: {
        accountId,
        projectId: this.props.resource.id,
        ...this.props.resource,
      },
      action: 'removeMember',
      failCB: () => message.error('项目成员删除失败'),
      successCB: () => {
        this.update()
        message.success('项目成员删除成功')
      },
    }
    this.props.dispatch({'type': 'App/doAction', payload})
  }

  searchExternalId = (e) => {
    let value = e.target.value
    let account = this.props.accounts.filter(d => d.externalId === value)[0]
    if (account !== undefined) {
      this.setState({
        searchName: account.name,
        searchAccount: account.externalId,
        accountId: account.id,
      })
    } else {
      this.setState({
        searchName: '账号不存在',
        searchAccount: '',
        accountId: '',
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {resource={}, accounts = [], } = this.props
    const {particpants} = this.state
    const members = particpants.map(p => {
      console.log(p)
      return (
        <p key={p.id}>
          {`${p.accountName} ${p.accountExternalId}`}
          <Icon className="mg-l10"
                type="delete"
                style={{cursor: 'pointer'}}
                onClick={e => this.deleteMember(e, p.accountId)}
          />
        </p>
      )
    })

    return (
      <div>
        <Modal
          title="成员管理"
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
                label="应用"
              >
                {resource.name}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="项目成员"
              >
                {members}
              </FormItem>
            </Form>
            <Divider dashed></Divider>
            <h3>新增项目成员</h3>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="账号"
              >
                <div>
                  {getFieldDecorator('externalId', {
                    rules: [{
                      required: true, message: '请输入',
                    }],
                  })(
                    <Search placeholder="请输入账号" style={{width: '80%'}} onChange={this.searchExternalId}/>
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
