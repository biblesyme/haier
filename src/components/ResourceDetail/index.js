import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {deployModeEnum} from 'utils/enum'

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
    const {resource={}, projects=[], resources=[]} = this.props
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
        {data.resourceType === 'containerHost' && (
          <div className="text-center">
            <label htmlFor="">资源所在地：</label>
              {locationFilter.name}
            <div style={{padding: '10px'}}></div>
            {(this.props.approval && this.props.App.role === 'admin') && (
              <div>
                <label htmlFor="" style={{marginLeft: '20px'}}>集群：</label>
                  <Select value={this.state.clusterId} onChange={clusterId => this.onClusterChange(clusterId)} style={{width: '200px'}}>
                    {this.state.clusters.map(c => <Option key={c.id}><Icon type="cluster" style={{color: '#27ae60'}}/> {c.name}</Option>)}
                  </Select>
                <div style={{padding: '10px'}}></div>
              </div>
            )}
              <section className={styles["card-form"]}>
                <div className={styles["card-header"]}>
                  资源配置
                </div>
                <Form className={styles["card-body"]}>
                  <FormItem
                    {...formItemLayout3}
                    label="CPU内核数"
                    hasFeedback
                  >
                   {data.cpu / 1000}
                  </FormItem>
                  <FormItem
                    {...formItemLayout3}
                    label="内存"
                    hasFeedback
                  >
                   {`${parseInt(data.memory) / 1024 /1024 /1024 || ''}G`}
                  </FormItem>
                </Form>
              </section>
              {this.props.approval && (
                <section className={styles["card-form"]}>
                  <div className={styles["card-header"]}>
                    集群信息
                  </div>
                  <Form className={styles["card-body"]}>
                    <FormItem
                      {...formItemLayout3}
                      label="可用CPU"
                      hasFeedback
                    >
                     {`${request.cpu - used.cpu}`}
                    </FormItem>
                    <FormItem
                      {...formItemLayout3}
                      label="可用内存"
                      hasFeedback
                    >
                     {`${request.memory - used.memory}`}
                    </FormItem>
                  </Form>
                </section>
              )}
          </div>
        )}
        {data.resourceType === 'mysql' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="MySQL" style={{marginBottom: '16px', width: '270px'}}>
              <Form className={styles["card-body"]}>
                <Row gutter={24}>
                  <Col span={12} push={1}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} push={1}>模式: &nbsp;{deployModeEnum(data.deployMode)}</Col>
                  {data.deployMode === 1 && (
                    <Col span={12} push={1} style={{marginTop: '10px'}}>
                      主从: &nbsp;
                      {data.masterSlaveOption === 0 ? '一主一从' : '一主两从'}
                    </Col>
                  )}
                  {data.deployMode === 2 && (
                    <Col span={12} push={1} style={{marginTop: '10px'}}>
                      mycat数量: &nbsp;
                      {data.mycatClusterManagerNodeCount}
                    </Col>
                  )}
                  {data.deployMode === 2 && (
                    <Col span={12} push={1} style={{marginTop: '10px'}}>
                      mysql数量: &nbsp;
                      {data.mycatClusterDataNodeCount}
                    </Col>
                  )}
                  <Col span={12} push={1} style={{marginTop: '10px'}}>
                    备份: &nbsp;
                    {data.backup === 'true' ? '是' : '否'}
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        )}
        {data.resourceType === 'redis' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="Redis" style={{width: '270px', marginBottom: '20px'}}>
              <Form className={styles["card-body"]}>
                <Row gutter={24}>
                  <Col span={12} push={1}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} push={1}>
                    类型: &nbsp;
                    {data.clusterType === 'one' && '单例'}
                    {data.clusterType === 'masterSlave' && '主从'}
                    {data.clusterType === 'shared' && '分片'}
                  </Col>
                  <Col span={12} push={1} style={{marginTop: '10px'}}>
                    内存: &nbsp;
                    {`${data.memorySize}M`}
                  </Col>
                  {data.clusterType === 'shared' && (
                    <Col span={12} push={1} style={{marginTop: '10px'}}>
                      分片数量: &nbsp;
                      {data.sharedCount}
                    </Col>
                  )}
                </Row>

              </Form>
            </Card>
          </div>
        )}
        {data.resourceType === 'rocketMQTopic' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="RocketMQ" style={{marginBottom: '16px', width: '270px'}}>
              <Form className={styles["card-body"]}>
                <Row gutter={24}>
                  <Col span={12} push={1}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} push={1}>
                    类型: &nbsp;
                    {data.clusterType === 'standalone' ? '单机' : '集群'}
                  </Col>
                  <Col span={24} push={1} style={{marginTop: '10px'}}>
                    主题名称: &nbsp;
                    {`${data.topicName}`}
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        )}
        {data.resourceType === 'rabbitMQProducer' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="RabbitMQ-生产者" style={{marginBottom: '16px', width: '270px'}}>
              <Form className={styles["card-body"]}>
                <Row gutter={24}>
                  <Col span={12} push={2}>地点: &nbsp;{machineRoomFilter.roomName}</Col>
                  <Col span={12} push={2}>消息吞吐: &nbsp;{data.maxIO}</Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${data.exchangeName}`}
                  </Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
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
        {data.resourceType === 'rabbitMQConsumer' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="RabbitMQ-消费者" style={{marginBottom: '16px', width: '270px'}}>
              <Form className={styles["card-body"]}>
                <Row gutter={24}>
                  <Col span={24} push={2}>应用: &nbsp;{projectSelect.name}</Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    Exchange名称: &nbsp;
                    {`${data.exchangeName}`}
                  </Col>
                  <Col span={24} push={2} style={{marginTop: '10px'}}>
                    队列名: &nbsp;
                    {data.queueName}
                  </Col>
                  {exchangeType === 'topic' && (
                    <Col span={24} push={2} style={{marginTop: '10px'}}>
                      主题名: &nbsp;
                      {data.topicName}
                    </Col>
                  )}
                  {exchangeType === 'direct' && (
                    <Col span={24} push={2} style={{marginTop: '10px'}}>
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
