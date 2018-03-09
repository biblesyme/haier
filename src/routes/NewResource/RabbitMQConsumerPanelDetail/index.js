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

  render() {
    const {onChange, item={}, onRemove, projects=[], resources=[], middlewareMappings=[]} = this.props
    let count = 1

    return (
      <Collapse accordion className="detail">
        {middlewareMappings.filter(m => m.resourceType === 'rabbitMQConsumer').map(m => {
          const {data={}} = m
          const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === data.machineRoomId)[0] || {}
          let projectSelect = projects.filter(p => data.producerApplicationScode === p.scode)[0] || {}
          let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
          let exchangeData = exchanges.filter(e => e.data.exchangeName === data.exchangeName)[0] || {}
          let exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''

            return (
              <Panel header={`RabbitMQ - 消费者-${count++}`} key={m.id} >
                <Row gutter={24}>
                  <Col span={24} push={2}>应用: &nbsp;{projectSelect.name}</Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${data.exchangeName}`}
                  </Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    队列名: &nbsp;
                    {data.queueName}
                  </Col>
                  {exchangeType === 'topic' && (
                    <Col span={24} push={2} style={{marginTop: '10px'}}>
                      主题名: &nbsp;
                      {data.topicName}
                    </Col>
                  )}
                  {exchangeType === 'direct' && (
                    <Col span={24} push={2} style={{marginTop: '10px'}}>
                      直连名: &nbsp;
                      {data.RouteKey}
                    </Col>
                  )}
                </Row>
                <Row style={{marginTop: '10px'}}>
                  <Col span={24}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
                </Row>
              </Panel>
            )
        })}
      </Collapse>
    )
  }
}
