import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Divider } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {deployModeEnum, clusterTypeEnum} from 'utils/enum'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
    clusterId: '',
  }

  componentWillMount() {
    const {resource={}} = this.props
    const {data={}} = resource
    console.log(resource)
    if (resource.resourceType === 'containerHost') {
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
          successCB: (res) => {
            this.setState({
              clusters: res.data.data || [],
              clusterId: res.data.data[0].id,
            })
            this.props.onChange(res.data.data[0].id)
          },
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
            this.setState({machineRooms: res.data.data})
          },
        }
      })
    }
    this.setState({
      ...this.props.item,
    })
    // this.props.dispatch({type: 'App/findLocation'})
  }

  onClusterChange = (clusterId) => {
    this.setState({clusterId})
    this.props.onChange(clusterId)
    this.props.dispatch({
      type: 'App/followClusterDetail',
      payload: {
        data: {
          id: clusterId,
        },
        successCB: (res) => this.setState({clusterInfo: res.data || {}}),
      }
    })
  }

  render() {
    const {resource={}, projects=[], resources=[], approval={}} = this.props
    const {data={}} = resource
    const {used={}} = this.state.clusterInfo
    const {request={}} = this.state.clusterInfo

    const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
    const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
    const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}

    let projectSelect = {}
    let exchangeType
    if (resource.resourceType === 'rabbitMQConsumer') {
      projectSelect = projects.filter(p => data.producerApplicationScode === p.scode)[0] || {}
      let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
      let exchangeData = exchanges.filter(e => e.data.exchangeName === data.exchangeName)[0] || {}
      exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''
    }

    return (
      <main>
        {resource.resourceType === 'containerHost' && (
          <div className={styles["my-card"]}>
            <Card title={<span>应用配置资源</span>}>
              <Form className={styles["card-body"]}>
                <div className={styles["title-panel"]}>
                  容器 - {data.cpu/1000}核 - {`${parseInt(data.memory) / 1024 /1024 /1024 || ''}G`}
                </div>
                <Row className={styles["body-panel"]}>
                  <Col span={12} style={{width: 157}}>地点: &nbsp;{locationFilter.name}</Col>
                  {(this.props.approval && this.props.App.role === 'domainAdmin' && approval.state === 'pending') ?
                    (
                      <Col span={12} style={{width: 157}}>&nbsp;</Col>
                    ) : (
                      <Col span={12} style={{width: 157}}>
                        集群: &nbsp;
                        {(this.props.approval && this.props.App.role === 'admin' && approval.state === 'confirmed') ?
                          (
                            <Select value={this.state.clusterId} onChange={clusterId => this.onClusterChange(clusterId)} style={{width: '110px'}}>
                              {this.state.clusters.map(c => <Option key={c.id}>{c.name}</Option>)}
                            </Select>
                          ) : clusterFilter.name}
                      </Col>
                    )
                  }

                  <Col span={12} style={{marginTop: '12px', width: 157}}>
                    CPU内核数: &nbsp;
                    {data.cpu / 1000}
                  </Col>
                  <Col span={12} style={{marginTop: '12px', width: 157}}>
                    内存: &nbsp;
                    {`${parseInt(data.memory) / 1024 /1024 /1024 || ''}G`}
                  </Col>
                  {(this.props.approval && this.props.App.role === 'admin' && approval.state === 'confirmed') && (
                    <Col span={12} style={{marginTop: '12px', width: 157}}>
                      可用CPU: &nbsp;
                      {`${request.cpu - used.cpu}`}
                    </Col>
                  )}
                  {(this.props.approval && this.props.App.role === 'admin' && approval.state === 'confirmed') && (
                    <Col span={12} style={{marginTop: '12px', width: 157}}>
                      可用内存: &nbsp;
                      {`${request.memory - used.memory}`}
                    </Col>
                  )}
                </Row>
              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'mysql' && (
          <div className={styles["my-card"]}>
            <Card title={<span><Icon type="mysql" style={{marginRight: 10}}/>MySQL</span>}>
              <Form className={styles["card-body"]}>
                <div className={styles["title-panel"]}>
                  MySQL - {deployModeEnum(data.deployMode)}
                </div>
                <Row className={styles["body-panel"]}>
                  <Col span={12} style={{width: 157}}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} style={{width: 157}}>模式: &nbsp;{deployModeEnum(data.deployMode)}</Col>
                  {data.deployMode === '1' && (
                    <Col span={12} style={{marginTop: '12px', width: 157}}>
                      主从: &nbsp;
                      {data.masterSlaveOption === '0' ? '一主一从' : '一主两从'}
                    </Col>
                  )}
                  {data.deployMode === '2' && (
                    <Col span={12} style={{marginTop: '12px', width: 157}}>
                      mycat数量: &nbsp;
                      {data.mycatClusterManagerNodeCount}
                    </Col>
                  )}
                  {data.deployMode === '2' && (
                    <Col span={12} style={{marginTop: '12px', width: 157}}>
                      mysql数量: &nbsp;
                      {data.mycatClusterDataNodeCount}
                    </Col>
                  )}
                  <Col span={12} style={{marginTop: '12px', width: 157}}>
                    备份: &nbsp;
                    {data.backup === 'true' ? '是' : '否'}
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'redis' && (
          <div className={styles["my-card"]}>
            <Card title={<span><Icon type="redis" style={{marginRight: 10}}/>Redis</span>}>
              <Form className={styles["card-body"]}>
                <div className={styles["title-panel"]}>
                  Redis - {clusterTypeEnum(data.clusterType)}
                </div>
                <Row className={styles["body-panel"]}>
                  <Col span={12} style={{marginTop: '12px', width: 157}}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} style={{marginTop: '12px', width: 157}}>
                    类型: &nbsp;
                    {data.clusterType === 'one' && '单例'}
                    {data.clusterType === 'masterSlave' && '主从'}
                    {data.clusterType === 'shared' && '分片'}
                  </Col>
                  <Col span={12} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                    内存: &nbsp;
                    {`${data.memorySize}M`}
                  </Col>
                  {data.clusterType === 'shared' && (
                    <Col span={12} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                      分片数量: &nbsp;
                      {data.sharedCount}
                    </Col>
                  )}
                </Row>

              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'rocketMQTopic' && (
          <div className={styles["my-card"]}>
            <Card title={<span><Icon type="rocket" style={{marginRight: 10}}/>RocketMQ</span>}>
              <Form className={styles["card-body"]}>
                <div className={styles["title-panel"]}>
                  RocketMQ - {data.clusterType === 'standalone' ? '单机' : '集群'}
                </div>
                <Row className={styles["body-panel"]}>
                  <Col span={12} style={{marginTop: '12px', width: 157}}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} style={{marginTop: '12px', width: 157}}>
                    类型: &nbsp;
                    {data.clusterType === 'standalone' ? '单机' : '集群'}
                  </Col>
                  <Col span={24} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                    主题名称: &nbsp;
                    {`${data.topicName}`}
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'rabbitMQProducer' && (
          <div className={styles["my-card"]}>
            <Card title={<span><Icon type="RabbitMQ" style={{marginRight: 10}}/>RabbitMQ-生产者</span>}>
              <Form className={styles["card-body"]}>
                <div className={styles["title-panel"]}>
                  RabbitMQ-生产者
                </div>
                <Row className={styles["body-panel"]}>
                  <Col span={12} style={{marginTop: '12px', width: 157}}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} style={{marginTop: '12px', width: 157}}>消息吞吐: &nbsp;{data.maxIO}</Col>
                  <Col span={24} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${data.exchangeName}`}
                  </Col>
                  <Col span={24} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                    Exchange类型: &nbsp;
                    {data.exchangeType === 'fanout' && '广播'}
                    {data.exchangeType === 'topic' && '主题'}
                    {data.exchangeType === 'direct' && '直连'}
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'rabbitMQConsumer' && (
          <div className={styles["my-card"]}>
            <Card title={<span><Icon type="RabbitMQ" style={{marginRight: 10}}/>RabbitMQ-消费者</span>}>
              <Form className={styles["card-body"]}>
                <div className={styles["title-panel"]}>
                  RabbitMQ-消费者
                </div>
                <Row className={styles["body-panel"]}>
                  <Col span={24} style={{marginTop: '12px', width: 157}}>应用: &nbsp;{projectSelect.name}</Col>
                  <Col span={24} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${data.exchangeName}`}
                  </Col>
                  <Col span={24} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                    队列名: &nbsp;
                    {data.queueName}
                  </Col>
                  {exchangeType === 'topic' && (
                    <Col span={24} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                      主题名: &nbsp;
                      {data.topicName}
                    </Col>
                  )}
                  {exchangeType === 'direct' && (
                    <Col span={24} style={{marginTop: '12px', width: 157}} style={{marginTop: '10px'}}>
                      直连名: &nbsp;
                      {data.RouteKey}
                    </Col>
                  )}
                </Row>
              </Form>
            </Card>
          </div>
        )}
      </main>
    )
  }
}
