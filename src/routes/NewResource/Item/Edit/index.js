import React from 'react'
import {
  Modal,
  Icon,
  Button,
  Row,
  Col,
  Card,
  Form,
  Select,
  Tag,
  Radio,
  Input,
  message,
  InputNumber,
} from 'antd'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'
import ResourceDetail from '@/components/ResourceDetail'
import { connect } from 'utils/ecos'

import styles from './style.sass'

const FormItem = Form.Item
const {Option} = Select

const formItemLayout4 = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    pull: 0,
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    push: 0
  },
  style: {
    marginBottom: '10px'
  }
}

const formInputLayout = {
  labelCol: {xs: { span: 13 }, sm: { span: 13 }, pull: 0},
  wrapperCol: {xs: { span: 11 }, sm: { span: 11 }, push: 0},
  style: {marginBottom: '10px'},
}

@connect(null,['App', 'NewResource'])
// @Form.create()
export default class C extends React.Component {
  state = {
    middlewareSelect: '',
    containerHost: {
      cpu: '0',
      memory: '',
    },
    mysql: {
      deployMode: '0',
      masterSlaveOption: '0',
      mycatClusterManagerNodeCount: 0,
      mycatClusterDataNodeCount: 0,
      backup: 'false',
    },
    redis: {
      memorySize: '100',
      clusterType: 'one',
      sharedCount: '0',
    },
    rocketMQTopic: {
      clusterType: 'standalone',
      topicName: '',
    },
    rabbitMQProducer: {
      maxIO: '100',
      exchangeName: '',
      exchangeType: 'fanout',
    },
    rabbitMQConsumer: {
      producerApplicationScode: 'S123451',
      exchangeName: 'topic',
      queueName: '',
      topicName: '',
      RouteKey: '',
    },
    machineRoomId: '',
    machineRooms: [],
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'App/findMachineRoom',
      payload: {
        successCB: (res) => {
          this.setState({machineRooms: res.data.data, machineRoomId: res.data.data[0].id})
          this.props.onChange({...this.props.item, machineRoomId: res.data.data[0].id})
        },
      }
    })
    const {resource={}} = this.props
    const {data} = resource
    this.setState({
      containerHost: {
        ...data,
        cpu: data.cpu /1000,
        memory: data.memory / 1024 / 1024 / 1024,
      },
      mysql: {
        ...data,
        deployMode: data.deployMode,
        masterSlaveOption: data.masterSlaveOption,
      },
      redis: data,
      rocketMQTopic: data,
      rabbitMQConsumer: data,
      rabbitMQProducer: data,
    })
  }

  submit = () => {
    const {resource} = this.props
    let data = this.state[resource.resourceType]
    if (resource.resourceType === 'containerHost') {
      data = {
        ...data,
        cpu: data.cpu * 1000,
        memory: data.memory * 1024 * 1024 * 1024,
      }
    }
    if (resource.resourceType === 'mysql') {
      data = {
        ...data,
        deployMode: data.deployMode,
        masterSlaveOption: parseInt(data.masterSlaveOption),
        mycatClusterManagerNodeCount: parseInt(this.state.mysql.mycatClusterManagerNodeCount),
        mycatClusterDataNodeCount: parseInt(this.state.mysql.mycatClusterDataNodeCount),
      }
    }
    if (this.state.middlewareSelect === 'redis') {
      data = {
        ...this.state.redis,
        sharedCount: parseInt(this.state.mysql.sharedCount),
      }
    }
    if (this.state.middlewareSelect === 'rabbitMQProducer') {
      data = {
        ...this.state.rabbitMQProducer,
        maxIO: parseInt(this.state.mysql.maxIO),
      }
    }
    this.props.dispatch({
      type: 'App/doSelfAction',
      payload: {
        data: {
          data: JSON.stringify(data),
          projectId: this.props.project.id,
          id: resource.id,
          resourceType: resource.resourceType,
          // resourceTypeId: '1',
          version: resource.version,
          // state: 'pending',
        },
        successCB: () => {
          message.success('资源申请成功')
          this.props.dispatch({
            type: 'NewResource/followResourceLink',
            payload: {
              data: this.props.project,
              link: 'resources',
            }
          })
          this.props.onCancel()
        },
        failCB: () => {
          message.error('资源申请失败')
        },
        action: 'applyResource',
        findRecord: {
          id: this.props.project.id,
          type: 'project',
        }
      }
   })
  }

  render() {
    const {resource={}, project={}, allProjects=[], allResource=[]} = this.props
    const {containerHost, mysql, redis, rocketMQTopic, rabbitMQProducer, rabbitMQConsumer} = this.state

    let projectSelect = allProjects.filter(p => rabbitMQConsumer.producerApplicationScode === p.scode)[0] || {}
    let exchanges = allResource.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
    let exchangeData = exchanges.filter(e => e.data.exchangeName === rabbitMQConsumer.exchangeName)[0] || {}
    const machineRoomId = (
      <FormItem
        {...formItemLayout4}
        label="地点"
        hasFeedback
      >
        <Select value={this.state.machineRoomId} onChange={machineRoomId => this.setState({machineRoomId})}>
          {this.state.machineRooms.map(m => <Option key={m.id}>{m.roomName}</Option>)}
        </Select>
      </FormItem>
    )
    return (
      <div>
        <Modal
          title={
            <div className="text-center">
              修改配置
            </div>
          }
          {...this.props}
          footer={
            <div className="text-center">
              <Button onClick={this.props.onCancel} >返回</Button>
              <Button onClick={this.submit} style={{marginLeft: '16px'}} type="primary">提交</Button>
            </div>
          }
          closable={false}
          width={800}
          >
            <div className="text-center">
              <Row>
                <Col span={12} offset={6}>
                  {resource.resourceType === 'containerHost' && (
                    <Card title="自定义配置">
                      <Form className={styles["card-body"]}>
                        <FormItem
                          {...formInputLayout}
                          label="CPU内核数"
                          hasFeedback
                        >
                          <InputNumber value={containerHost.cpu}
                                       onChange={cpu => this.setState({containerHost: {...containerHost, cpu}})}
                          />
                        </FormItem>
                        <FormItem
                          {...formInputLayout}
                          label="内存"
                          hasFeedback
                        >
                          <InputNumber value={containerHost.memory}
                                       onChange={memory => this.setState({containerHost: {...containerHost, memory}})}
                                       style={{width: '70%'}}
                          />
                          G
                        </FormItem>
                      </Form>
                    </Card>
                  )}
                  {resource.resourceType === 'mysql' && (
                    <Card title="MySQL">
                      <Form className={styles["card-body"]}>
                        {machineRoomId}
                        <FormItem
                          {...formItemLayout4}
                          label="部署模式"
                          hasFeedback
                        >
                         <Radio.Group value={mysql.deployMode.toString()} onChange={e => this.setState({mysql: {...mysql, deployMode: e.target.value}})}>
                           <Radio.Button value="0">单机</Radio.Button>
                           <Radio.Button value="1">主从</Radio.Button>
                           <Radio.Button value="2">集群</Radio.Button>
                         </Radio.Group>
                        </FormItem>

                        {mysql.deployMode === '1' && (
                          <FormItem
                            {...formItemLayout4}
                            label="主从"
                            hasFeedback
                          >
                           <Radio.Group value={mysql.masterSlaveOption.toString()} onChange={e => this.setState({mysql: {...mysql, masterSlaveOption: e.target.value}})}>
                              <Radio.Button value="0">一主一从</Radio.Button>
                              <Radio.Button value="1">一主两从</Radio.Button>
                            </Radio.Group>
                          </FormItem>
                        )}

                        {mysql.deployMode === '2' && (
                          <div>
                            <FormItem
                              {...formInputLayout}
                              label="管理节点数量"
                              hasFeedback
                            >
                             <Input placeholder="请输入管理节点数量" type="number" value={mysql.mycatClusterManagerNodeCount}
                                    onChange={e => this.setState({mysql: {...mysql, mycatClusterManagerNodeCount: e.target.value}})}
                              ></Input>
                            </FormItem>
                            <FormItem
                              {...formInputLayout}
                              label="数据节点数量"
                              hasFeedback
                            >
                             <Input placeholder="请输入数据节点数量" type="number" value={mysql.mycatClusterDataNodeCount}
                                    onChange={e => this.setState({mysql: {...mysql, mycatClusterDataNodeCount: e.target.value}})}
                              ></Input>
                            </FormItem>
                          </div>
                        )}

                        <FormItem
                          {...formItemLayout4}
                          label="备份"
                          hasFeedback
                        >
                          <Radio.Group value={mysql.backup} onChange={e => this.setState({mysql: {...mysql, backup: e.target.value}})}>
                            <Radio.Button value="true">是</Radio.Button>
                            <Radio.Button value="false">否</Radio.Button>
                          </Radio.Group>
                        </FormItem>
                      </Form>
                    </Card>
                  )}

                  {resource.resourceType === 'redis' && (
                      <Card title="Redis">
                        <Form className={styles["card-body"]}>
                          {machineRoomId}
                          <FormItem
                            {...formInputLayout}
                            label="内存"
                            hasFeedback
                          >
                            <Input placeholder="请输入内存大小"
                                   type="number"
                                   addonAfter="M"
                                   value={redis.memorySize}
                                   onChange={e => this.setState({redis: {...redis, memorySize: e.target.value}})}
                            />
                          </FormItem>
                          <FormItem
                            {...formItemLayout4}
                            label="集群类型"
                            hasFeedback
                          >
                           <Radio.Group value={redis.clusterType} onChange={e => this.setState({redis:{...redis, clusterType: e.target.value}})}>
                            <Radio.Button value="one">单例</Radio.Button>
                            <Radio.Button value="masterSlave">主从</Radio.Button>
                            <Radio.Button value="shared">分片</Radio.Button>
                           </Radio.Group>
                          </FormItem>

                          {redis.clusterType === 'shared' && (
                            <FormItem
                              {...formInputLayout}
                              label="分片数量"
                              hasFeedback
                            >
                              <Input placeholder="请输入分片数量"
                                     type="number"
                                     value={redis.sharedCount}
                                     onChange={e => this.setState({redis: {...redis, sharedCount: e.target.value}})}
                              />
                            </FormItem>
                          )}
                        </Form>
                      </Card>
                  )}
                  {resource.resourceType === 'rocketMQTopic' && (
                    <Card title="RocketMQ">
                      <Form className={styles["card-body"]}>
                        {machineRoomId}
                        <FormItem
                          {...formItemLayout4}
                          label="集群类型"
                          hasFeedback
                        >
                         <Radio.Group value={rocketMQTopic.clusterType} onChange={e => this.setState({rocketMQTopic: {...rocketMQTopic, clusterType: e.target.value}})}>
                            <Radio.Button value="standalone">单机</Radio.Button>
                            <Radio.Button value="cluster">集群</Radio.Button>
                          </Radio.Group>
                        </FormItem>
                        <FormItem
                          {...formInputLayout}
                          label="主题名称"
                          hasFeedback
                        >
                         <Input placeholder="请输入主题名称" value={rocketMQTopic.topicName} onChange={e => this.setState({rocketMQTopic: {...rocketMQTopic, topicName: e.target.value}})}></Input>
                        </FormItem>
                      </Form>
                    </Card>
                  )}
                  {resource.resourceType === 'rabbitMQProducer' && (
                    <Card title="RabbitMQ-生产者">
                      <Form className={styles["card-body"]}>
                        {machineRoomId}
                        <FormItem
                          {...formInputLayout}
                          label="最大消息吞吐量"
                          hasFeedback
                        >
                         <Input placeholder="请输入"
                                type="number"
                                value={rabbitMQProducer.maxIO}
                                onChange={e => this.setState({rabbitMQProducer: {...rabbitMQProducer, maxIO: e.target.value}})}
                          />
                        </FormItem>
                        <FormItem
                          {...formInputLayout}
                          label="Exchange名称"
                          hasFeedback
                        >
                         <Input placeholder="请输入Exchange名称"
                                value={rabbitMQProducer.exchangeName}
                                onChange={e => this.setState({rabbitMQProducer: {...rabbitMQProducer, exchangeName: e.target.value}})}
                         />
                        </FormItem>
                        <FormItem
                          labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                          wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                          style = {{marginBottom: '10px'}}
                          label="Exchange类型"
                          hasFeedback
                        >
                          <Radio.Group value={rabbitMQProducer.exchangeType} onChange={e => this.setState({rabbitMQProducer: {...rabbitMQProducer, exchangeType: e.target.value}})}>
                             <Radio.Button value="fanout">广播</Radio.Button>
                             <Radio.Button value="topic">主题</Radio.Button>
                             <Radio.Button value="direct">直连</Radio.Button>
                           </Radio.Group>
                        </FormItem>
                      </Form>
                    </Card>
                  )}
                  {resource.resourceType === 'rabbitMQConsumer' && (
                    <Card title="RabbitMQ-消费者">
                      <Form className={styles["card-body"]}>
                        <FormItem
                          {...formInputLayout}
                          label="应用"
                          hasFeedback
                        >
                         <Select placeholder="请选择应用"
                                 value={rabbitMQConsumer.producerApplicationScode}
                                 onChange={producerApplicationScode => this.setState({rabbitMQConsumer: {...rabbitMQConsumer, producerApplicationScode, exchangeName: ''}})}
                          >
                           {allProjects.map(p => <Option key={p.scode}>{p.name}</Option>)}
                         </Select>
                        </FormItem>
                        <FormItem
                          {...formInputLayout}
                          label="Exchange名称"
                          hasFeedback
                        >
                         <Select placeholder="请选择Exchange名称"
                                 value={rabbitMQConsumer.exchangeName}
                                 onChange={exchangeName => this.setState({rabbitMQConsumer: {...rabbitMQConsumer, exchangeName}})}
                         >
                           {exchanges.map(e => <Option key={e.id} value={e.data.exchangeName}>{e.data.exchangeName}</Option>)}
                         </Select>
                        </FormItem>
                        <FormItem
                          {...formInputLayout}
                          label="队列名"
                        >
                         <Input placeholder="请填写队列名称"
                                value={rabbitMQConsumer.queueName}
                                onChange={e => this.setState({rabbitMQConsumer: {...rabbitMQConsumer, queueName: e.target.value}})}
                         />
                        </FormItem>

                        {exchangeData.exchangeName === 'topic' && (
                          <FormItem
                            {...formInputLayout}
                            label="主题名"
                          >
                           <Input placeholder="请输入主题名称"
                                  value={rabbitMQConsumer.topicName}
                                  onChange={e => this.setState({rabbitMQConsumer: {...rabbitMQConsumer, topicName: e.target.value}})}
                           />
                          </FormItem>
                        )}
                        {exchangeData.exchangeName === 'direct' && (
                          <FormItem
                            {...formInputLayout}
                            label="直连名"
                          >
                           <Input placeholder="请输入直连名称"
                                  value={rabbitMQConsumer.RouteKey}
                                  onChange={e => this.setState({rabbitMQConsumer: {...rabbitMQConsumer, RouteKey: e.target.value}})}
                           />
                          </FormItem>
                        )}
                      </Form>
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
        </Modal>
      </div>

    )
  }
}
