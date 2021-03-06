import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Collapse } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {deployModeEnum} from 'utils/enum'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel

import styles from './style.sass'

const formItemLayout3 = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 10 },
        pull: 0,

  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
        push: 0,

  },
  style: {
    marginBottom: '10px'
  }
}

const formItemLayout4 = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 12 },
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

const formInputLayout = {
  labelCol: {xs: { span: 10 }, sm: { span: 10 }, pull: 0},
  wrapperCol: {xs: { span: 14 }, sm: { span: 14 }, push: 0},
  style: {marginBottom: '10px'},
}

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    resource: 'height',
    machineRoomId: 'qd',
    machineRooms: [],
    locations: [],
    clusters: [],
    clusterInfo: {},
    machineRooms: [],
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'App/findMachineRoom',
      payload: {
        successCB: (res) => {
          this.setState({machineRooms: res.data.data})
        },
      }
    })
  }

  onEdit = (id, e) => {
    e.stopPropagation()
    this.props.onEdit(id)
  }

  onDelete = (id ,e) => {
    e.stopPropagation()
    this.props.removeMiddlewareMapping(id)
  }

  render() {
    const {onChange, item={}, onRemove, projects=[], resources=[], middlewareMappings=[]} = this.props
    let count = 1
    const header = (record) => {
      if (this.state.panelIndex === record.id.toString()) {
        return (
          <div>
            <span>{`RabbitMQ - 消费者-${count++}`}</span>
          </div>
        )
      } else {
        return <span>{`RabbitMQ - 消费者-${count++}`}</span>
      }
    }
    return (
      <Collapse accordion className="detail" onChange={(panelIndex) => this.setState({panelIndex})}>
        {middlewareMappings.filter(m => m.resourceType === 'rabbitMQConsumer').map(m => {
          const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === m.machineRoomId)[0] || {}
          let projectSelect = projects.filter(p => m.producerApplicationScode === p.scode)[0] || {}
          let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
          let exchangeData = exchanges.filter(e => e.data.exchangeName === m.exchangeName)[0] || {}
          let exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''

            return (
              <Panel header={header(m)} key={m.id} >
                <Row gutter={24} style={{paddingBottom: 19}}>
                  <Col span={24} push={2}>应用: &nbsp;{projectSelect.name}</Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${m.exchangeName}`}
                  </Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    队列名: &nbsp;
                    {m.queueName}
                  </Col>
                  {exchangeType === 'topic' && (
                    <Col span={24} push={2} style={{marginTop: '10px'}}>
                      主题名: &nbsp;
                      {m.topicName}
                    </Col>
                  )}
                  {exchangeType === 'direct' && (
                    <Col span={24} push={2} style={{marginTop: '10px'}}>
                      直连名: &nbsp;
                      {m.RouteKey}
                    </Col>
                  )}
                </Row>
              </Panel>
            )
        })}
      </Collapse>
    )
  }
}
