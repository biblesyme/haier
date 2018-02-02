import React from 'react'
import {
  Modal,
  Icon,
  Button,
  Row,
  Col,
  Card,
  Form,
  Select,
  Tag,
  message,
  Input,
} from 'antd'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'
import { connect } from 'utils/ecos'
import ResourceDetail from '@/components/ResourceDetail'

const FormItem = Form.Item
const {Option} = Select

const formItemLayout4 = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    pull: 0,
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
    push: 0
  },
  style: {
    marginBottom: '10px'
  }
}

@Form.create()
@connect(null, ['App', 'Approval'])
export default class C extends React.Component {
  state = {
    resource: {},
  }

  componentWillMount() {
    this.props.dispatch({
      'type': 'App/followLink',
      payload: {
        data: {
          ...this.props.resource,
        },
        link: 'resource',
        successCB: (resource) => {
          if (resource.hasOwnProperty('data')) {
            resource = {
              ...resource,
              data: JSON.parse(resource.data),
            }
          }
          this.setState({resource})
        }
      },
    })
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

  deny = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (values.deniedMessages === undefined || values.deniedMessages === '') {
        message.warning('请输入驳回理由')
        return
      }
      let payload = {
        data: {
          ...this.props.resource,
          deniedMessages: values.deniedMessages,
          deniedAccountId: parseInt(this.props.App.user.id),
        },
        action: 'deny',
        successCB: () => {
          this.props.dispatch({'type': 'Approval/findApproval'})
          this.props.onCancel()
        },
        failCB: () => {
          message.error('驳回失败')
          this.props.onCancel()
        }
      }
      this.props.dispatch({'type': 'App/doAction', payload})
    })
  }

  pass = () => {
    let payload = {
      data: {
        ...this.props.resource,
        externalId: this.props.App.user.externalId,
      },
      action: 'pass',
      successCB: () => {
        this.props.dispatch({'type': 'Approval/findApproval'})
        if (this.props.App.role === 'domainAdmin') {
          message.success('确认成功')
        }
        if (this.props.App.role === 'admin') {
          message.success('通过成功')
        }
        this.props.onCancel()
      },
      failCB: () => {
        message.error('通过失败')
        this.props.onCancel()
      }
    }
    this.props.dispatch({'type': 'App/doAction', payload})
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {resource, filterResource} = this.props
    const footer = (
      <div>
        {(resource.state === 'pendding') && (
          <div className="text-center">
            <Button onClick={this.props.onCancel} style={{marginRight: '16px'}}>取消</Button>
            <Button style={{marginRight: '16px'}} onClick={this.deny}>驳回</Button>
            <Button onClick={this.pass}>同意</Button>
          </div>
        )}
        {(resource.state === 'confirmed' && this.props.App.role === 'admin') && (
          <div className="text-center">
            <Button onClick={this.props.onCancel} style={{marginRight: '16px'}}>取消</Button>
            <Button style={{marginRight: '16px'}} onClick={this.deny}>驳回</Button>
            <Button onClick={this.pass}>同意</Button>
          </div>
        )}
        {(resource.state === 'confirmed' && this.props.App.role !== 'admin') && (
          <div className="text-center">
            <Button onClick={this.props.onCancel} >返回</Button>
          </div>
        )}
        {(resource.state === 'passed' || resource.state === 'denied') && (
          <div className="text-center">
            <Button onClick={this.props.onCancel} >返回</Button>
          </div>
        )}
      </div>
    )
    return (
      <div>
        <Modal
          title={
            <div className="text-center">
              资源详情
              <Tag {...getState(resource.state)} className="pull-right">{nameMap[resource.state]}</Tag>
            </div>
          }
          {...this.props}
          footer={footer}
          closable={false}
          width={800}
          >
            {resource.state === 'denied' && (
              <div>
                <p style={{color: '#ffa940'}}>驳回理由: 资源申请超过项目需求</p>
                <ResourceDetail resource={filterResource} approval={true}/>
              </div>
            )}

            {resource.state === 'pendding' && (
              <div>
                <ResourceDetail resource={filterResource} approval={true}/>
                <br/>
                <FormItem
                  label="驳回理由"
                  {...formItemLayout4}
                >
                  {this.props.form.getFieldDecorator('deniedMessages', {
                    rules: [{
                      required: false,
                      message: '请输入驳回理由',
                    }],
                  })(
                    <Input placeholder="请输入驳回理由" />
                  )}
                </FormItem>

              </div>
            )}
            {(resource.state === 'confirmed' || resource.state === 'passed') && (
              <div>
                <ResourceDetail resource={filterResource} approval={true}/>
              </div>
            )}
        </Modal>
      </div>

    )
  }
}
