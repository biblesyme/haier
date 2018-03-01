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
    return (
      <Collapse accordion className="detail">
        {middlewareMappings.filter(m => m.resourceType === 'redis').map(m => {
          const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === m.machineRoomId)[0] || {}
          if (m.clusterType === 'one') {
            return (
              <Panel header={`Redis - ${m.memorySize}M 单例`} key={m.id} showArrow={false}>
                <Row gutter={24}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
                  <Col span={12} push={2}>类型: &nbsp;单例</Col>
                  <Col span={12} push={2} style={{marginTop: '10px'}}>
                    内存: &nbsp;
                    {`${m.memorySize}M`}
                  </Col>
                </Row>
                <Row style={{marginTop: '10px'}}>
                  <Col span={12}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
                  <Col span={12}><Button onClick={() => this.props.removeMiddlewareMapping(m.id)} style={{width: '100%'}} icon="delete"></Button></Col>
                </Row>
              </Panel>
            )
          }
          if (m.clusterType === 'masterSlave') {
            return (
              <Panel header={`Redis - ${m.memorySize}M 主从`} key={m.id} showArrow={false}>
                <Row gutter={24}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
                  <Col span={12} push={2}>类型: &nbsp;主从</Col>
                  <Col span={12} push={2} style={{marginTop: '10px'}}>
                    内存: &nbsp;
                    {`${m.memorySize}M`}
                  </Col>
                </Row>
                <Row style={{marginTop: '10px'}}>
                  <Col span={12}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
                  <Col span={12}><Button onClick={() => this.props.removeMiddlewareMapping(m.id)} style={{width: '100%'}} icon="delete"></Button></Col>
                </Row>
              </Panel>
            )
          }
          if (m.clusterType === 'shared') {
            return (
              <Panel header={`Redis - ${m.memorySize}M 分片`} key={m.id} showArrow={false}>
                <Row gutter={24}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
                  <Col span={12} push={2}>类型: &nbsp;分片</Col>
                  <Col span={12} push={2} style={{marginTop: '10px'}}>
                    内存: &nbsp;
                    {`${m.memorySize}M`}
                  </Col>
                  <Col span={12} push={2} style={{marginTop: '10px'}}>
                    分片数量: &nbsp;
                    {`${m.sharedCount}`}
                  </Col>
                </Row>
                <Row style={{marginTop: '10px'}}>
                  <Col span={12}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
                  <Col span={12}><Button onClick={() => this.props.removeMiddlewareMapping(m.id)} style={{width: '100%'}} icon="delete"></Button></Col>
                </Row>
              </Panel>
            )
          }
        })}
      </Collapse>
    )
  }
}
