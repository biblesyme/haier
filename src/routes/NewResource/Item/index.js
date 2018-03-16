import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Divider, InputNumber } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import Edit from './Edit'
import {deployModeEnum} from 'utils/enum'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button

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
    visibleEdit: false,
    record: {},
    paasChange: 'false',
    cpu: null,
    memory: null,
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
    if (resource.resourceType === 'containerHost') {
      this.setState({
        cpu: data.cpu / 1000,
        memory: data.memory / 1024 / 1024 / 1024,
      })
    }
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

  onChange = (value, field) => {
    const nextState = {
      ...this.state,
      [field]: value,
    }
    this.props.onChange(nextState)
    this.setState({
      [field]: value,
    })
  }

  render() {
    const {resource={}} = this.props
    const {data={}} = resource
    const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
    const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
    const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}
    return (
      <main>
        {resource.resourceType === 'containerHost' && (
          <div >
            <Row>
              <Col span={4}>资源类型: 容器</Col>
              <Col span={4}>资源所在地: {locationFilter.name}</Col>
              <Col span={4}>集群: {clusterFilter.name}</Col>
            </Row>
            <div style={{padding: '5px'}}></div>
            <Row>
              <Col span={4}>CPU内核数: {data.cpu/1000}</Col>
              <Col span={4}>内存: {`${parseInt(data.memory) / 1024/1024/1024 || ''}G`}</Col>
            </Row>
            {/* <Row>
              <Col span={6}>
                <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => this.setState({visibleEdit: true})}><Icon type="edit" /></Button>
              </Col>
            </Row> */}
            <Divider></Divider>
            <Row className={styles["radioButton"]}>
              <Col>
                变更应用资源配置:
                <RadioGroup style={{ marginLeft: 20 }}
                            value={this.state.paasChange}
                            onChange={e => this.onChange(e.target.value, 'paasChange')}
                >
                  <RadioButton value='true'>是</RadioButton>
                  <RadioButton value="false">否</RadioButton>
                </RadioGroup>
              </Col>
            </Row>
            {this.state.paasChange === 'true' && (
              <div>
                <Row>
                  <Col span={4}>资源类型: 容器</Col>
                  <Col span={4}>资源所在地: {locationFilter.name}</Col>
                  <Col span={4}>集群: {clusterFilter.name}</Col>
                </Row>
                <div style={{padding: '5px'}}></div>
                <Row>
                  <Col span={4}>
                    CPU内核数:
                    <InputNumber style={{ marginLeft: 20, marginRight: 5 }}
                                 onChange={(cpu) => this.onChange(cpu, 'cpu')}
                                 value={this.state.cpu}
                                 min={0}
                    />核
                  </Col>
                  <Col span={4}>
                    内存:
                    <InputNumber style={{ marginLeft: 20, marginRight: 5 }}
                                 onChange={(memory) => this.onChange(memory, 'memory')}
                                 value={this.state.memory}
                                 min={0}
                    />G
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
        {resource.resourceType === 'mysql' && (
          <div >
            <Card title="MySQL" style={{height: '250px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formItemLayout4}
                  label="地点"
                  hasFeedback
                >
                  {machineRoomFilter.roomName}
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="部署模式"
                  hasFeedback
                >
                 {deployModeEnum(data.deployMode)}
                </FormItem>

                {data.deployMode === 1 && (
                  <FormItem
                    {...formItemLayout4}
                    label="主从"
                    hasFeedback
                  >
                   {data.masterSlaveOption === 0 ? '一主一从' : '一主两从'}
                  </FormItem>
                )}

                {data.deployMode === 2 && (
                  <div>
                    <FormItem
                      {...formInputLayout}
                      label="管理节点数量"
                      hasFeedback
                    >
                     {data.mycatClusterManagerNodeCount}
                    </FormItem>
                    <FormItem
                      {...formInputLayout}
                      label="数据节点数量"
                      hasFeedback
                    >
                     {data.mycatClusterDataNodeCount}
                    </FormItem>
                  </div>
                )}

                <FormItem
                  {...formItemLayout4}
                  label="备份"
                  hasFeedback
                >
                  {nameMap[data.backup]}
                </FormItem>
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => this.setState({visibleEdit: true})}><Icon type="edit" /></Button>
          </div>
        )}
        {resource.resourceType === 'redis' && (
          <div >
            <Card title="Redis" style={{marginBottom: '20px', height: '250px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formItemLayout4}
                  label="地点"
                  hasFeedback
                >
                  {machineRoomFilter.roomName}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="内存"
                  hasFeedback
                >
                  {`${data.memorySize}M`}
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="集群类型"
                  hasFeedback
                >
                  {data.clusterType === 'one' && '单例'}
                  {data.clusterType === 'masterSlave' && '主从'}
                  {data.clusterType === 'shared' && '分片'}
                </FormItem>
                {data.clusterType === 'shared' && (
                  <FormItem
                    {...formInputLayout}
                    label="分片数量"
                    hasFeedback
                  >
                    {data.sharedCount}
                  </FormItem>
                )}
              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'rocketMQTopic' && (
          <div >
            <Card title="RocketMQ" style={{marginBottom: '16px', height: '250px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formItemLayout4}
                  label="地点"
                  hasFeedback
                >
                 {machineRoomFilter.roomName}
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="集群类型"
                  hasFeedback
                >
                 {data.clusterType === 'standalone' ? '单机' : '集群'}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="主题名称"
                  hasFeedback
                >
                 {data.topicName}
                </FormItem>
              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'rabbitMQProducer' && (
          <div >
            <Card title="RabbitMQ-生产者" style={{marginBottom: '16px', height: '250px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="地点"
                  hasFeedback
                >
                 {machineRoomFilter.roomName}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="最大消息吞吐量"
                  hasFeedback
                >
                 {data.maxIO}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="Exchange名称"
                  hasFeedback
                >
                 {data.exchangeName}
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  style = {{marginBottom: '10px'}}
                  label="Exchange类型"
                  hasFeedback
                >
                  {data.exchangeType === 'fanout' && '广播'}
                  {data.exchangeType === 'topic' && '主题'}
                  {data.exchangeType === 'direct' && '直连'}
                </FormItem>
              </Form>
            </Card>
          </div>
        )}
        {resource.resourceType === 'rabbitMQConsumer' && (
          <div >
            <Card title="RabbitMQ-消费者" style={{marginBottom: '16px', height: '250px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="应用"
                  hasFeedback
                >
                 {data.producerApplicationScode === 'S123451' && '产品中心'}
                 {data.producerApplicationScode === 'S123450' && '鹿屋基地'}
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  label="Exchange名称"
                  hasFeedback
                  style = {{marginBottom: '10px'}}
                >
                  {data.exchangeName === 'topic' && '主题应用'}
                  {data.exchangeName === 'direct' && '直连应用'}
                  {data.exchangeName === 'fanout' && '广播应用'}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="队列名"
                >
                 {data.queueName}
                </FormItem>

                {data.exchangeName === 'topic' && (
                  <FormItem
                    {...formInputLayout}
                    label="主题名"
                  >
                   {data.topicName}
                  </FormItem>
                )}
                {data.exchangeName === 'direct' && (
                  <FormItem
                    {...formInputLayout}
                    label="直连名"
                  >
                   {data.RouteKey}
                  </FormItem>
                )}
              </Form>
            </Card>
          </div>
        )}
        {this.state.visibleEdit && (
          <Edit
            visible={this.state.visibleEdit}
            onOk={(newData) => {this.saveAdd(newData)}}
            onCancel={this.handleCancel}
            resource={this.props.resource}
            project={this.props.project}
            allProjects={this.props.allProjects}
            allResource={this.props.allResource}
            />
        )}
      </main>
    )
  }
}
