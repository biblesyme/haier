import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Collapse, Table } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {clusterTypeEnum, exchangeTypeEnum} from 'utils/enum'
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
            return 1
          }
          if (a.resourceType > b.resourceType) {
            return -1
          }
          if (a. resourceType === 'rocketMQTopic') {
            if (a.data.clusterType < b.data.clusterType ) {
              return 1
            }
            if (a.data.clusterType > b.data.clusterType) {
              return -1
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
              {`RocketMQ - ${clusterTypeEnum(data.clusterType)} -
              ${boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1 > 9 ?
                boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1 :
                '0' + (boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1)
              }`}
            </span>
          )
        }
        return (
          <span style={{marginLeft: 21}}>
            {`${record.resourceType === 'rabbitMQConsumer' ? 'RabbitMQ - 消费者' : 'RabbitMQ - 生产者'} -
            ${boxes.slice(0, index).filter(b => b.resourceType === record.resourceType).length + 1 > 9 ?
              boxes.slice(0, index).filter(b => b.resourceType === record.resourceType).length + 1 :
              '0' + (boxes.slice(0, index).filter(b => b.resourceType === record.resourceType).length + 1)
            }`}
          </span>
        )
      }
    }, {
      title: <div style={{marginLeft: 100}}>配置描述</div>,
      render: (record) => {
        if (record.resourceType === 'rocketMQTopic') {
          return <span>{`集群类型-${clusterTypeEnum(record.data.clusterType)} / 主题名称:${record.data.topicName}`}</span>
        }
        if (record.resourceType === 'rabbitMQProducer') {
          return <span>{`最大消息吞吐量: ${record.data.maxIO} / Exchange名称:${record.data.exchangeName} / Exchange类型: ${exchangeTypeEnum(record.data.exchangeType)}`}</span>
        }
        if (record.resourceType === 'rabbitMQConsumer') {
          const {data={}} = record
          let projectSelect = projects.filter(p => data.producerApplicationScode === p.scode)[0] || {}
          let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
          let exchangeData = exchanges.filter(e => e.data.exchangeName === data.exchangeName)[0] || {}
          let exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''
          if (exchangeType === 'direct') {
            return <span>{`应用: ${projectSelect.name} / Exchange名称:${data.exchangeName} / 队列名: ${data.queueName} / 直连名: ${data.RouteKey}`}</span>
          }
          if (exchangeType === 'topic') {
            return <span>{`应用: ${projectSelect.name} / Exchange名称:${data.exchangeName} / 队列名: ${data.queueName} / 主题名: ${data.topicName}`}</span>
          }
          return <span>{`应用: ${projectSelect.name} / Exchange名称:${data.exchangeName} / 队列名: ${data.queueName}`}</span>
        }
        return <span></span>
      }
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
    )
  }
}
