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
} from 'antd'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'
import ResourceDetail from '@/components/ResourceDetail'
import { connect } from 'utils/ecos'

const FormItem = Form.Item
const {Option} = Select

import styles from './styles.sass'

const formItemLayout4 = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    pull: 0,
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    push: 0
  },
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

@connect(null, ['App'])
@Form.create()
export default class C extends React.Component {
  state = {
    resource: {},
    status: '',
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

  render() {
    const { getFieldDecorator } = this.props.form
    const {resource={}, filterResource={}, projects=[]} = this.props
    const {role} = this.props.App

    let projectSelector = projects.filter(p => p.id === resource.projectId)[0] || {}

    return (
      <div>
        <Modal
          title={
            <div className="text-center">
              审批详情
            </div>
          }
          {...this.props}
          footer={
            <div className="text-center">
              <Button type="primary" onClick={this.props.onCancel} >返回</Button>
            </div>
          }
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
              <Row style={{marginTop: '20px'}}>
                <Col span={4} style={{width: '70px'}}>驳回理由: </Col>
                <Col span={12}>
                  {resource.deniedMessages}
                </Col>
              </Row>
            )}
            <Row style={{marginTop: '20px'}}>
              <Col span={4} style={{width: '70px'}}>申请时间:</Col>
              <Col span={12}>{new Date(resource.requestTimestamp * 1000).toLocaleString()}</Col>
            </Row>

            <Row style={{marginTop: '20px', marginBottom: '30px'}}>
              <Col span={4} style={{width: '70px'}}>所属应用:</Col>
              <Col span={12}>
                {projectSelector.name}
              </Col>
            </Row>
            {this.state.status === 'success' && (
              <ResourceDetail resource={this.state.resource}
                              projects={this.props.projects}
              />
            )}
        </Modal>
      </div>

    )
  }
}
