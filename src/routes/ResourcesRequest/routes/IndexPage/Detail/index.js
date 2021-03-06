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

import styles from './styles.sass'

const formItemLayout4 = {
  labelCol: {span:4, style: {width: '70px'}},
  wrapperCol: {span:16, style: {width: '290px'}},
  style: {
    marginBottom: '10px'
  }
}

const adminMap = {
  confirmed: '待通过',
  passed: '已通过',
  denied: '已驳回',
  pending: '待审批',
}

const adminState = {
  confirmed: 'orange',
  denied: 'red',
  passed: 'green',
  pending: 'orange',
}

@Form.create()
@connect(null, ['App', 'Approval'])
export default class C extends React.Component {
  state = {
    resource: {},
    status: '',
    clusterId: '',
    clusters: [],
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
          this.props.dispatch({
            type: 'App/followCluster',
            payload: {
              data: {
                id: resource.locationId,
              },
              successCB: (res) => {
                this.setState({
                  clusters: res.data.data || [],
                })
              },
            }
          })
          this.setState({resource, status: 'success'})
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
          this.props.dispatch({
            'type': 'App/findApproval',
            payload: {
              account: this.props.App.user,
            }
          })
          message.success('驳回成功')
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
    const {clusters=[]} = this.state
    const clusterFilter = clusters.filter(c => c.id === this.state.clusterId)[0] || {}
    let payload = {
      data: {
        ...this.props.resource,
        externalId: this.props.App.user.externalId,
        clusterId: this.state.clusterId,
        clusterName: clusterFilter.name,
      },
      action: 'pass',
      successCB: () => {
        this.props.dispatch({
          'type': 'App/findApproval',
          payload: {
            account: this.props.App.user,
          }
        })
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
    const {resource, filterResource, projects} = this.props
    const {role} = this.props.App

    let projectSelector = projects.filter(p => p.id === resource.projectId)[0] || {}

    const footer = (
      <div>
        {(resource.state === 'pending') && (
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button onClick={this.props.onCancel} style={{width: '83px', background: '#a6a6a6', color: '#fff'}}>取消</Button>
            <Button onClick={this.deny} style={{width: '83px', background: '#f8a03c', color: '#fff'}}>驳回</Button>
            <Button onClick={this.pass} style={{width: '83px', color: '#fff'}} type="primary">同意</Button>
          </div>
        )}
        {(resource.state === 'confirmed' && this.props.App.role === 'admin') && (
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button onClick={this.props.onCancel} style={{width: '83px', background: '#a6a6a6', color: '#fff'}}>取消</Button>
            <Button onClick={this.deny} style={{width: '83px', background: '#f8a03c', color: '#fff'}}>驳回</Button>
            <Button onClick={this.pass} style={{width: '83px', color: '#fff'}} type="primary">同意</Button>
          </div>
        )}
        {(resource.state === 'confirmed' && this.props.App.role !== 'admin') && (
          <div className="text-center">
            <Button type="primary" onClick={this.props.onCancel} style={{width: 83}}>关闭</Button>
          </div>
        )}
        {(resource.state === 'passed' || resource.state === 'denied') && (
          <div className="text-center">
            <Button type="primary" onClick={this.props.onCancel} style={{width: 83}}>关闭</Button>
          </div>
        )}
      </div>
    )
    return (
      <div>
        <Modal
          title={
            <div className="text-center">
              审批详情
            </div>
          }
          {...this.props}
          footer={footer}
          closable={false}
          width={616}
          className={styles['my-modal']}
          >
            <Row>
              <Col span={4} style={{width: '70px'}}>审批状态:</Col>
              <Col span={12}>
                {role === 'admin' ?
                  <Tag color={adminState[resource.state]}>{adminMap[resource.state]}</Tag>
                  : <Tag {...getState(resource.state)}>{nameMap[resource.state]}</Tag>
                }
              </Col>
            </Row>

            {(resource.state === 'denied' && this.state.status === 'success') && (
              <div>
                <Row style={{marginTop: '20px'}}>
                  <Col span={4} style={{width: '70px'}}>驳回理由: </Col>
                  <Col span={12}>
                    {resource.deniedMessages}
                  </Col>
                </Row>
              </div>
            )}

            <Row style={{marginTop: '20px'}}>
              <Col span={4} style={{width: '70px'}}>申请时间:</Col>
              <Col span={12}>{new Date(resource.requestTimestamp * 1000).toLocaleString()}</Col>
            </Row>

            <Row style={{marginTop: '20px'}}>
              <Col span={4} style={{width: '70px'}}>所属应用:</Col>
              <Col span={12}>
                {projectSelector.name}
              </Col>
            </Row>


            {((resource.state === 'confirmed' || resource.state === 'passed')  && this.state.status === 'success') && (
              <div style={{marginTop: 40}}>
                <ResourceDetail resource={this.state.resource}
                                approval={true}
                                projects={this.props.projects}
                                clusterId={this.state.clusterId}
                                onChange={(clusterId) => this.setState({clusterId})}
                                approval={resource}
                />
              </div>
            )}

            {(resource.state === 'denied' && this.state.status === 'success') && (
              <div style={{marginTop: '40px'}}>
                <ResourceDetail resource={this.state.resource}
                                approval={true}
                                projects={this.props.projects}
                                onChange={(clusterId) => this.setState({clusterId})}
                                approval={resource}
                />
              </div>
            )}

            {(resource.state === 'pending'  && this.state.status === 'success') && (
              <div style={{marginTop: 40}}>
                <ResourceDetail resource={this.state.resource}
                                approval={true}
                                projects={this.props.projects}
                                onChange={(clusterId) => this.setState({clusterId})}
                                approval={resource}
                />
              </div>
            )}

            {((resource.state === 'pending' || resource.state === 'confirmed')  && this.state.status === 'success') && (
              <div style={{marginTop: 20}}>
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
        </Modal>
      </div>

    )
  }
}
