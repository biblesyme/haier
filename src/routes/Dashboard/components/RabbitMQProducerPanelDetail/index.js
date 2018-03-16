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
            <span>{`RabbitMQ - 生产者-${count++}`}</span>
            <div style={{float: 'right'}}>
              <Icon onClick={(e) => this.onEdit(record.id, e)} type="edit" style={{marginRight: 10}}></Icon>
              <Icon onClick={(e) => this.onDelete(record.id, e)} type="delete" style={{marginRight: 21}}></Icon>
            </div>
          </div>
        )
      } else {
        return <span>{`RabbitMQ - 生产者-${count++}`}</span>
      }
    }
    return (
      <Collapse accordion className="detail" onChange={(panelIndex) => this.setState({panelIndex})}>
        {middlewareMappings.filter(m => m.resourceType === 'rabbitMQProducer').map(m => {
          const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === m.machineRoomId)[0] || {}
            return (
              <Panel header={header(m)} key={m.id} >
                <Row gutter={24} style={{paddingBottom: 19}}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
                  <Col span={12} push={2}>消息吞吐: &nbsp;{m.maxIO}</Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${m.exchangeName}`}
                  </Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    Exchange类型: &nbsp;
                    {m.exchangeType === 'fanout' && '广播'}
                    {m.exchangeType === 'topic' && '主题'}
                    {m.exchangeType === 'direct' && '直连'}
                  </Col>
                </Row>
              </Panel>
            )
        })}
      </Collapse>
    )
  }
}
