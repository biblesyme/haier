import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Collapse, Table, InputNumber } from 'antd';
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

  edit = (record) => {
    record.editable = true
    this.props.onChange(record)
  }

  save = (record) => {
    record.editable = false
    this.props.onChange(record)
  }

  cancel = (record) => {
    record.editable = false
    this.props.onChange(record)
  }

  render() {
    const {onChange, item={}, onRemove, projects=[], resources=[], middlewareMappings=[]} = this.props
    let boxes = middlewareMappings.filter(m => m.resourceType === 'mysql').sort(
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
    const oneLength = boxes.filter(b => (b.data.deployMode === 0 && b.flag !== 'new')).length
    const masterLength = boxes.filter(b => b.data.deployMode === 1 && b.flag !== 'new').length
    const clusterLength = boxes.filter(b => b.data.deployMode === 2 && b.flag !== 'new').length

    const mysqlColumns = [{
      title: <div className="text-center">中间件名称</div>,
      key: 'id',
      className: 'text-center',
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
      title: <div className="text-center">模式</div>,
      className: 'text-center',
      render: (record) => <span>{deployModeEnum(record.data.deployMode)}</span>
    }, {
      title: <div className="text-center">mycat数量</div>,
      className: 'text-center',
      render: (record) => {
        if (record.editable) {
          return <InputNumber />
        }
        return <span>{record.data.mycatClusterManagerNodeCount}</span>
      }
    }, {
      title: <div className="text-center">mysql数量</div>,
      className: 'text-center',
      render: (record) => <span>{record.data.mycatClusterDataNodeCount}</span>
    }, {
      title: <div className="text-center">备份服务</div>,
      className: 'text-center',
      render: (record) => <span>{record.data.backup === 'true' ? '是' : '否'}</span>
    }, {
      title: <div className="text-center">操作</div>,
      className: 'text-center',
      render: (text, record, index) => {
        console.log(record.editable)
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
      <div className="middleware">
        <Tabs
          renderTabBar={()=><ScrollableInkTabBar />}
          renderTabContent={()=><TabContent />}
        >
          <TabPane tab={<div ><Icon type="mysql" style={{marginRight: 12, fontSize: 14}}/><span>MySQL</span></div>} key="1">
            <div>
              <Table scroll={{x: 1300}}
                     dataSource={boxes}
                     columns={mysqlColumns}
                     rowKey="id"
                     pagination={false}
                     style={{marginTop: 21}}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>

      // <Collapse accordion className="detail">
      //   {middlewareMappings.filter(m => m.resourceType === 'mysql').map(m => {
      //     const {data={}} = m
      //     const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === data.machineRoomId)[0] || {}
      //     if (data.deployMode === 0) {
      //       return (
      //         <Panel header="MySQL - 单机" key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>模式: &nbsp;单机</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               备份: &nbsp;
      //               {data.backup === 'true' ? '是' : '否'}
      //             </Col>
      //           </Row>
      //           <Row style={{marginTop: '10px'}}>
      //             <Col span={24}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
      //           </Row>
      //         </Panel>
      //       )
      //     }
      //     if (data.deployMode === 1) {
      //       return (
      //         <Panel header="MySQL - 主从" key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>模式: &nbsp;主从</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               主从: &nbsp;
      //               {data.masterSlaveOption === '0' ? '一主一从' : '一主两从'}
      //             </Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               备份: &nbsp;
      //               {data.backup === 'true' ? '是' : '否'}
      //             </Col>
      //           </Row>
      //           <Row style={{marginTop: '10px'}}>
      //             <Col span={24}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
      //           </Row>
      //         </Panel>
      //       )
      //     }
      //     if (data.deployMode === 2) {
      //       return (
      //         <Panel header="MySQL - 集群" key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>模式: &nbsp;集群</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               mycat数量: &nbsp;
      //               {data.mycatClusterManagerNodeCount}
      //             </Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               mysql数量: &nbsp;
      //               {data.mycatClusterDataNodeCount}
      //             </Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               备份: &nbsp;
      //               {data.backup === 'true' ? '是' : '否'}
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
