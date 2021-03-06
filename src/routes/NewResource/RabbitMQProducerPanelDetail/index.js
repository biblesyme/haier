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
        {middlewareMappings.filter(m => m.resourceType === 'rabbitMQProducer').map(m => {
          const {data={}} = m
          const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === data.machineRoomId)[0] || {}
            return (
              <Panel header={`RabbitMQ - 生产者-${count++}`} key={m.id} >
                <Row gutter={24}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
                  <Col span={12} push={2}>消息吞吐: &nbsp;{data.maxIO}</Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${data.exchangeName}`}
                  </Col>
                  <Col span={12} push={2} style={{marginTop: '10px'}}>
                    Exchange类型: &nbsp;
                    {data.exchangeType === 'fanout' && '广播'}
                    {data.exchangeType === 'topic' && '主题'}
                    {data.exchangeType === 'direct' && '直连'}
                  </Col>
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
