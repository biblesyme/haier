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

const FormItem = Form.Item
const {Option} = Select

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
    const {resource={}, filterResource={}} = this.props
    const {role} = this.props.App
    return (
      <div>
        <Modal
          title={
            <div className="text-center">
              资源详情
              {role === 'admin' ?
                <Tag className="pull-right" color={adminState[resource.state]}>{adminMap[resource.state]}</Tag>
                : <Tag {...getState(resource.state)} className="pull-right">{nameMap[resource.state]}</Tag>
              }
            </div>
          }
          {...this.props}
          footer={
            <div className="text-center">
              <Button type="primary" onClick={this.props.onCancel} >返回</Button>
            </div>
          }
          closable={false}
          width={800}
          >
            {resource.state === 'denied' && (
              <div>
                <p style={{color: '#ffa940'}}>驳回理由: 资源申请超过项目需求</p>
              </div>
            )}
            <ResourceDetail resource={filterResource}/>
        </Modal>
      </div>

    )
  }
}
