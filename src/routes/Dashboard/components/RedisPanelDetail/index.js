import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Collapse } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {clusterTypeEnum} from 'utils/enum'

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
    const header = (record) => {
      if (this.state.panelIndex === record.id.toString()) {
        return (
          <div>
            <span>{`Redis - ${record.memorySize}M ${clusterTypeEnum(record.clusterType)}`}</span>
            <div style={{float: 'right'}}>
              <Icon onClick={(e) => this.onEdit(record.id, e)} type="edit" style={{marginRight: 10}}></Icon>
              <Icon onClick={(e) => this.onDelete(record.id, e)} type="delete" style={{marginRight: 21}}></Icon>
            </div>
          </div>
        )
      } else {
        return <span>{`Redis - ${record.memorySize}M ${clusterTypeEnum(record.clusterType)}`}</span>
      }
    }
    return (
      <Collapse accordion className="detail" onChange={(panelIndex) => this.setState({panelIndex})}>
        {middlewareMappings.filter(m => m.resourceType === 'redis').map(m => {
          const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === m.machineRoomId)[0] || {}
          if (m.clusterType === 'one') {
            return (
              <Panel header={header(m)} key={m.id} >
                <Row gutter={24} style={{paddingBottom: 19}}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
                  <Col span={12} push={2}>类型: &nbsp;单例</Col>
                  <Col span={12} push={2} style={{marginTop: '10px'}}>
                    内存: &nbsp;
                    {`${m.memorySize}M`}
                  </Col>
                </Row>
              </Panel>
            )
          }
          if (m.clusterType === 'masterSlave') {
            return (
              <Panel header={header(m)} key={m.id} >
                <Row gutter={24} style={{paddingBottom: 19}}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
                  <Col span={12} push={2}>类型: &nbsp;主从</Col>
                  <Col span={12} push={2} style={{marginTop: '10px'}}>
                    内存: &nbsp;
                    {`${m.memorySize}M`}
                  </Col>
                </Row>
              </Panel>
            )
          }
          if (m.clusterType === 'shared') {
            return (
              <Panel header={header(m)} key={m.id} >
                <Row gutter={24} style={{paddingBottom: 19}}>
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
              </Panel>
            )
          }
        })}
      </Collapse>
    )
  }
}
