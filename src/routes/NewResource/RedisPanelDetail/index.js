import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Collapse, Table } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {deployModeEnum} from 'utils/enum'
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';

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
    let boxes = middlewareMappings.filter(m => m.resourceType === 'redis').sort(
      (a, b) => {
        if (a.flag || b.flag) {
          return 0
        }
        if (a.data.deployMode < b.data.deployMode ) {
          return -1
        }
        if (a.data.deployMode > b.data.deployMode) {
          return 1
        }
        return 0
      }
    )

    const columns = [{
      title: <div style={{marginLeft: 100 - 16}}>中间件名称</div>,
      key: 'id',
      render: (text, record, index) => {
        const {data={}} = record
        if (record.flag !== 'new') {
          if (data.deployMode === 0) {
            return <span>MySQL - {deployModeEnum(data.deployMode)}-{(index) + 1}</span>
          }
          if (data.deployMode === 1) {
            return <span>MySQL - {deployModeEnum(data.deployMode)}-{(index - oneLength) + 1}</span>
          }
          if (data.deployMode === 2) {
            return <span>MySQL - {deployModeEnum(data.deployMode)}-{(index - masterLength - oneLength) + 1}</span>
          }
        } else {
          if (data.deployMode === 0) {
            return <span>MySQL - {deployModeEnum(data.deployMode)}-{boxes.slice(0, index).filter(b => b.data.deployMode === 0).length + 1}</span>
          }
          if (data.deployMode === 1) {
            return <span>MySQL - {deployModeEnum(data.deployMode)}-{boxes.slice(0, index).filter(b => b.data.deployMode === 1).length + 1}</span>
          }
          if (data.deployMode === 2) {
            return <span>MySQL - {deployModeEnum(data.deployMode)}-{boxes.slice(0, index).filter(b => b.data.deployMode === 2).length + 1}</span>
          }
        }
      }
    }, {
      title: <div className="text-center">集群类型</div>,
      className: 'text-center',
      render: (record) => <span>{deployModeEnum(record.data.deployMode)}</span>
    }, {
      title: <div className="text-center">内存</div>,
      className: 'text-center',
      render: (record) => {
        if (record.editable) {
          return (
            <InputNumber style={{ margin: '-5px 0' }}
                         value={record._data.mycatClusterManagerNodeCount}
                         onChange={value => this.stateChange(record, value, 'mycatClusterManagerNodeCount')}
                         min={0}
            />
          )
        }
        return <span>{record.data.mycatClusterManagerNodeCount}</span>
      }
    }, {
      title: <div className="text-center">操作</div>,
      className: 'text-center',
      render: (text, record, index) => {
        if (record.editable) {
          return (
            <div>
              <a onClick={() => this.save(record)}>保存</a>
              <a onClick={() => this.cancel(record)} style={{marginLeft: 10}}>取消</a>
            </div>
          )
        } else {
          return <a onClick={() => this.edit(record)}>修改</a>
        }
      }
    }]

    return (
      <div className="middleware" style={{marginBottom: 38}}>
        <Tabs
          renderTabBar={()=><ScrollableInkTabBar />}
          renderTabContent={()=><TabContent />}
        >
          <TabPane tab={<div ><Icon type="redis" style={{marginRight: 12, fontSize: 14}}/><span>Redis</span></div>} key="1">
            <div>
              <Table scroll={{x: 1125}}
                     dataSource={boxes}
                     columns={columns}
                     rowKey="id"
                     pagination={false}
                     style={{marginTop: 21}}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
      // <Collapse accordion className="detail">
      //   {middlewareMappings.filter(m => m.resourceType === 'redis').map(m => {
      //     const {data={}} = m
      //     const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === data.machineRoomId)[0] || {}
      //     if (data.clusterType === 'one') {
      //       return (
      //         <Panel header={`Redis - ${data.memorySize}M 单例`} key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>类型: &nbsp;单例</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               内存: &nbsp;
      //               {`${data.memorySize}M`}
      //             </Col>
      //           </Row>
      //           <Row style={{marginTop: '10px'}}>
      //             <Col span={24}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
      //           </Row>
      //         </Panel>
      //       )
      //     }
      //     if (data.clusterType === 'masterSlave') {
      //       return (
      //         <Panel header={`Redis - ${data.memorySize}M 主从`} key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>类型: &nbsp;主从</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               内存: &nbsp;
      //               {`${data.memorySize}M`}
      //             </Col>
      //           </Row>
      //           <Row style={{marginTop: '10px'}}>
      //             <Col span={24}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
      //           </Row>
      //         </Panel>
      //       )
      //     }
      //     if (data.clusterType === 'shared') {
      //       return (
      //         <Panel header={`Redis - ${data.memorySize}M 分片`} key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>类型: &nbsp;分片</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               内存: &nbsp;
      //               {`${data.memorySize}M`}
      //             </Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               分片数量: &nbsp;
      //               {`${data.sharedCount}`}
      //             </Col>
      //           </Row>
      //           <Row style={{marginTop: '10px'}}>
      //             <Col span={24}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
      //           </Row>
      //         </Panel>
      //       )
      //     }
      //   })}
      // </Collapse>
    )
  }
}
