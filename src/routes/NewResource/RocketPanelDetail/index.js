import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Collapse, Table } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {clusterTypeEnum} from 'utils/enum'
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

  render() {
    const {onChange, item={}, onRemove, projects=[], resources=[], middlewareMappings=[]} = this.props
    let boxes = middlewareMappings.filter(m => (m.resourceType !== 'redis' && m.resourceType !== 'mysql' && m.resourceType !== 'containerHost')).sort(
      (a, b) => {
        if (a.flag === 'new' && b.flag === 'new') {
          return 0
        }
        if (a.flag === 'new' && b.flag !== 'new') {
          return 1
        }
        if (a.flag !== 'new' && b.flag === 'new') {
          return -1
        }
        if (!a.flag && !b.flag) {
          if (a.resourceType < b.resourceType) {
            return -1
          }
          if (a.resourceType > b.resourceType) {
            return 1
          }
          if (a. resourceType === 'rocketMQTopic') {
            if (a.data.clusterType < b.data.clusterType ) {
              return -1
            }
            if (a.data.clusterType > b.data.clusterType) {
              return 1
            }
          }
        }
        return 0
      }
    )

    const columns = [{
      title: <div style={{marginLeft: 100 - 16}}>中间件名称</div>,
      key: 'id',
      render: (text, record, index) => {
        const {data={}} = record
        if (record.resourceType === 'rocketMQTopic') {
          return (
            <span style={{marginLeft: 21}}>
              {`Rocket - ${clusterTypeEnum(data.clusterType)} -
              ${boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1 > 9 ?
                boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1 :
                '0' + (boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1)
              }`}
            </span>
          )
        }
        return (
          <span style={{marginLeft: 21}}>
            {`${record.resourceType === 'rabbitMQConsumer' ? '消费者' : '生产者'} -
            ${boxes.slice(0, index).filter(b => b.resourceType === record.resourceType).length + 1 > 9 ?
              boxes.slice(0, index).filter(b => b.resourceType === record.resourceType).length + 1 :
              '0' + (boxes.slice(0, index).filter(b => b.resourceType === record.resourceType).length + 1)
            }`}
          </span>
        )
      }
    }, {
      title: <div className="text-center">配置描述</div>,
      className: 'text-center',
      render: (record) => <span>{clusterTypeEnum(record.data.clusterType)}</span>
    }]

    return (
      <div style={{marginBottom: 38}}>
        <Tabs
          renderTabBar={()=><ScrollableInkTabBar />}
          renderTabContent={()=><TabContent />}
        >
          <TabPane tab={<div ><span>MQ</span></div>} key="1">
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
      //   {middlewareMappings.filter(m => m.resourceType === 'rocketMQTopic').map(m => {
      //     const {data={}} = m
      //     const machineRoom = this.state.machineRooms.filter(machineRooms => machineRooms.id === data.machineRoomId)[0] || {}
      //     if (data.clusterType === 'standalone') {
      //       return (
      //         <Panel header={`Redis - 单机`} key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>类型: &nbsp;单机</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               主题名称: &nbsp;
      //               {`${data.topicName}`}
      //             </Col>
      //           </Row>
      //           <Row style={{marginTop: '10px'}}>
      //             <Col span={24}><Button onClick={() => this.props.onEdit(m.id)} style={{width: '100%'}} icon="edit"></Button></Col>
      //           </Row>
      //         </Panel>
      //       )
      //     }
      //     if (data.clusterType === 'cluster') {
      //       return (
      //         <Panel header={`Redis - 集群`} key={m.id} >
      //           <Row gutter={24}>
      //             <Col span={12} push={2}>地点: &nbsp;{machineRoom.roomName}</Col>
      //             <Col span={12} push={2}>类型: &nbsp;集群</Col>
      //             <Col span={12} push={2} style={{marginTop: '10px'}}>
      //               内存: &nbsp;
      //               {`${data.topicName}`}
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
