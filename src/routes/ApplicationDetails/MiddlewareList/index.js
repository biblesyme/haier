import React from 'react'
import { Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Progress, Table, Divider } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import {deployModeEnum, clusterTypeEnum} from 'utils/enum'
import prefixZero from 'utils/prefixZero'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CardGrid = Card.Grid

import styles from './styles.sass'

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    resource: 'height',
    machineRoomId: 'qd',
    machineRooms: [],
    locations: [],
    clusters: [],
    visibleEdit: false,
    record: {},
  }

  componentWillMount() {
    const {resource={}} = this.props
    const {data={}} = resource
    if (data.resourceType === 'containerHost') {
      this.props.dispatch({
        type: 'App/findLocation',
        payload: {
          successCB: (res) => this.setState({locations: res.data.data || []}),
        }
      })
      this.props.dispatch({
        type: 'App/followCluster',
        payload: {
          data: {
            id: data.locationId,
          },
          successCB: (res) => this.setState({clusters: res.data.data || []}),
        }
      })
      this.props.dispatch({
        type: 'App/followClusterDetail',
        payload: {
          data: {
            id: data.clusterId,
          },
          successCB: (res) => this.setState({clusterInfo: res.data || {}}),
        }
      })
    } else {
      this.props.dispatch({
        type: 'App/findMachineRoom',
        payload: {
          successCB: (res) => {
            this.setState({machineRooms: res.data.data || []})
          },
        }
      })
    }
    this.setState({
      ...this.props.item,
    })
  }

  handleCancel = (e) => {
    this.setState({
      visibleEdit: false,
    });
  }

  handleEdit = (e) => {
    this.setState({
      visibleEdit: true,
    })
  }

  render() {
    const {resource={}, projects=[], resources=[], items=[], middlewareMappings=[]} = this.props
    const {data={}} = resource
    let projectSelect = {}
    let exchangeType
    if (resource.resourceType === 'rabbitMQConsumer') {
      projectSelect = projects.filter(p => resource.data.producerApplicationScode === p.scode)[0] || {}
      let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
      let exchangeData = exchanges.filter(e => e.data.exchangeName === resource.data.exchangeName)[0] || {}
      exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''
    }

    const mysqlColumns = [{
      title: '中间件名称',
      key: 'id',
      render: (text, record, index) => {
        const {data={}} = record
        const oneCount = middlewareMappings.filter(m => m.resourceType === 'mysql' && m.data.deployMode === 0).length
        const masterCount = middlewareMappings.filter(m => m.resourceType === 'mysql' && m.data.deployMode === 1).length
        if (data.deployMode === '0') {
          return <span>MySQL - {deployModeEnum(data.deployMode)}-{prefixZero(index + 1)}</span>
        }
        if (data.deployMode === '1') {
          return <span>MySQL - {deployModeEnum(data.deployMode)}-{prefixZero(index - oneCount + 1)}</span>
        }
        if (data.deployMode === '2') {
          return <span>MySQL - {deployModeEnum(data.deployMode)}-{prefixZero(index - oneCount - masterCount + 1)}</span>
        }
      }
    }, {
      title: '日慢查询数量',
      className: 'text-center',
      render: () => <span>2334</span>
    }, {
      title: '当前连接数',
      className: 'text-center',
      render: () => <span>2334</span>
    }, {
      title: '运行的线程个数',
      className: 'text-center',
      render: () => <span>2334</span>
    }, {
      title: '实例大小',
      className: 'text-center',
      render: () => <span>CPU:2 内存: 1024M 硬盘: 2G</span>
    }, {
      title: '锁定数量',
      className: 'text-center',
      render: () => <span>2334</span>
    }]

    const redisColumns = [{
      title: '中间件名称',
      key: 'id',
      render: (text, record, index) => {
        const {data={}} = record
        const oneCount = middlewareMappings.filter(m => m.resourceType === 'redis' && m.data.clusterType === 'one').length
        const masterCount = middlewareMappings.filter(m => m.resourceType === 'redis' && m.data.clusterType === 'masterSlave').length
        if (data.clusterType === 'one') {
          return <span>Redis - {clusterTypeEnum(data.clusterType)}-{prefixZero(index + 1)}</span>
        }
        if (data.clusterType === 'masterSlave') {
          return <span>Redis - {clusterTypeEnum(data.clusterType)}-{prefixZero(index - oneCount + 1)}</span>
        }
        if (data.clusterType === 'shared') {
          return <span>Redis - {clusterTypeEnum(data.clusterType)}-{prefixZero(index - oneCount - masterCount + 1)}</span>
        }
      }
    }, {
      title: '资源使用率',
      className: 'text-center',
      render: () => <span>57%</span>
    }, {
      title: '命中率',
      className: 'text-center',
      render: () => <span>30%</span>
    }, {
      title: '日慢查询数量',
      className: 'text-center',
      render: () => <span>2333</span>
    }, {
      title: '当前连接数',
      className: 'text-center',
      render: () => <span>233</span>
    }]

    const rocketMQColumns = [{
      title: '中间件名称',
      key: 'id',
      render: (text, record, index) => {
        const {data={}} = record
        const standaloneCount = middlewareMappings.filter(m => m.resourceType === 'rocketMQTopic' && m.data.clusterType === 'standalone').length
        if (data.clusterType === 'standalone') {
          return <span>RocketMQ - {clusterTypeEnum(data.clusterType)}-{prefixZero(index + 1)}</span>
        }
        if (data.clusterType === 'cluster') {
          return <span>RocketMQ - {clusterTypeEnum(data.clusterType)}-{prefixZero(index - standaloneCount + 1)}</span>
        }
      }
    }, {
      title: '生产者总数',
      className: 'text-center',
      render: () => <span>233</span>
    }, {
      title: '生产者应用总数',
      className: 'text-center',
      render: () => <span>999</span>
    }, {
      title: '消费者应用总数',
      className: 'text-center',
      render: () => <span>666</span>
    }, {
      title: '消费者实例数',
      className: 'text-center',
      render: () => <span>888</span>
    }, {
      title: '一个小时内的消息总数',
      className: 'text-center',
      render: () => <span>1122</span>
    }]

    const rabbitMQColumns = [{
      title: '中间件名称',
      key: 'id',
      render: (text, record, index) => {
        const consumerCount = middlewareMappings.filter(m => m.resourceType === 'rabbitMQConsumer').length
        if (record.resourceType === 'rabbitMQConsumer') {
          return <span>RabbitMQ - 消费者- {prefixZero(index + 1)}</span>
        } else {
          return <span>RabbitMQ - 生产者- {prefixZero(index + 1 - consumerCount)}</span>
        }
      }
    }, {
      title: '消费者应用总数',
      className: 'text-center',
      render: () => <span>233</span>
    }, {
      title: '消费者实例数',
      className: 'text-center',
      render: () => <span>999</span>
    }, {
      title: '一个小时内的消息总数',
      className: 'text-center',
      render: () => <span>10</span>
    }]

    return (
      <main>
        {middlewareMappings.filter(m => m.resourceType === 'mysql').length > 0 && (
          <div>
            <div style={{borderBottom: '1px solid #eaedf2', paddingBottom: '10px'}}>
              <span className={styles.title}><Icon type="mysql" style={{marginRight: 12}}/>MySQL</span>
            </div>

            <Row style={{marginTop: '20px', marginBottom: '40px'}}>
              <Col >
                <Table scroll={{x: 1110}}
                       dataSource={middlewareMappings.filter(m => m.resourceType === 'mysql').sort((a, b) => a.data.deployMode - b.data.deployMode)}
                       columns={mysqlColumns}
                       rowKey="id"
                       pagination={false}
                />
              </Col>
            </Row>
          </div>
        )}
        {middlewareMappings.filter(m => m.resourceType === 'redis').length > 0 && (
          <div>
            <div style={{borderBottom: '1px solid #eaedf2', paddingBottom: '10px'}}>
              <span className={styles.title}><Icon type="redis" style={{marginRight: 12}}/>Redis</span>
            </div>

            <Row style={{marginTop: '20px', marginBottom: '40px'}}>
              <Col >
                <Table scroll={{x: 1110}}
                       dataSource={middlewareMappings.filter(m => m.resourceType === 'redis')
                                           .sort((a, b) => {
                                             if (a.data.clusterType > b.data.clusterType) return 1
                                             if (a.data.clusterType < b.data.clusterType) return -1
                                             return 0
                       })}
                       columns={redisColumns}
                       rowKey="id"
                       pagination={false}
                />
              </Col>
            </Row>
          </div>
        )}
        {middlewareMappings.filter(m => m.resourceType === 'rocketMQTopic').length > 0 && (
          <div>
            <div style={{borderBottom: '1px solid #eaedf2', paddingBottom: '10px'}}>
              <span className={styles.title}><Icon type="rocket" style={{marginRight: 12}}/>RocketMQ</span>
            </div>

            <Row style={{marginTop: '20px', marginBottom: '40px'}}>
              <Col >
                <Table scroll={{x: 1110}}
                       dataSource={middlewareMappings.filter(m => m.resourceType === 'rocketMQTopic')
                                                     .sort((a, b) => {
                                                       if (a.data.clusterType > b.data.clusterType) return 1
                                                       if (a.data.clusterType < b.data.clusterType) return -1
                                                       return 0
                                   })}
                       columns={rocketMQColumns}
                       rowKey="id"
                       pagination={false}
                />
              </Col>
            </Row>
          </div>
        )}
        {middlewareMappings.filter(m => (m.resourceType === 'rabbitMQProducer' || m.resourceType === 'rabbitMQConsumer')).length > 0 && (
          <div>
            <div style={{borderBottom: '1px solid #eaedf2', paddingBottom: '10px'}}>
              <span className={styles.title}><Icon type="RabbitMQ" style={{marginRight: 12}}/>RabbitMQ</span>
            </div>

            <Row style={{marginTop: '20px', marginBottom: '40px'}}>
              <Col >
                <Table scroll={{x: 1110}}
                      dataSource={middlewareMappings.filter(m => m.resourceType === 'rabbitMQProducer' || m.resourceType === 'rabbitMQConsumer')
                                                    .sort((a, b) => {
                                                      if (a.resourceType > b.resourceType) return 1
                                                      if (a.resourceType < b.resourceType) return -1
                                                      return 0
                                  })}
                       columns={rabbitMQColumns}
                       rowKey="id"
                       pagination={false}
                />
              </Col>
            </Row>
          </div>
        )}
      </main>
    )
  }
}
