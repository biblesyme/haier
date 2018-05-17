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

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    middlewareSelect: 'mysql',
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
  }

  submit = () => {
    let data = {
      ...this.state[this.state.middlewareSelect],
      machineRoomId: this.state.machineRoomId,
      resourceType: this.state.middlewareSelect,
    }
    this.props.onOk(data)
    this.props.onCancel()
  //   this.props.dispatch({
  //     type: 'App/doSelfAction',
  //     payload: {
  //       data: {
  //         data: JSON.stringify(data),
  //         projectId: this.props.project.id,
  //         // id: resource.id,
  //         resourceType: this.state.middlewareSelect,
  //         // version: 1,
  //       },
  //       successCB: () => {
  //         message.success('资源申请成功')
  //         this.props.dispatch({
  //           type: 'NewResource/followResourceLink',
  //           payload: {
  //             data: this.props.project,
  //             link: 'resources',
  //           }
  //         })
  //         this.props.onCancel()
  //       },
  //       failCB: () => {
  //         message.error('资源申请失败')
  //       },
  //       action: 'applyResource',
  //       findRecord: {
  //         id: this.props.project.id,
  //         type: 'project',
  //       }
  //     }
  //  })
  }

  render() {
    const {mysql, redis, rocketMQTopic, rabbitMQProducer, rabbitMQConsumer} = this.state
    const {allProjects=[], allResource=[]} = this.props

    let projectSelect = allProjects.filter(p => rabbitMQConsumer.producerApplicationScode === p.scode)[0] || {}
    let exchanges = allResource.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
    let exchangeData = exchanges.filter(e => e.data.exchangeName === rabbitMQConsumer.exchangeName)[0] || {}
    let exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''

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
              添加中间件
            </div>
          }
          {...this.props}
          footer={
            <div className="text-center">
              <Button onClick={this.props.onCancel} >返回</Button>
              <Button onClick={this.submit} style={{marginLeft: '16px'}} type="primary">添加</Button>
            </div>
          }
          closable={false}
          width={800}
          >
            <div className="text-center">
              中间件类型：
              <Select style={{width: '170px', marginLeft: '16px', marginBottom: '16px'}}
                      value={this.state.middlewareSelect}
                      onSelect={middlewareSelect => this.setState({middlewareSelect})}
                      placeholder="请选择中间件类型"
              >
                <Option key="mysql">MySQL</Option>
                <Option key="redis">Redis</Option>
                <Option key="rocketMQTopic">RocketMQ</Option>
                <Option key="rabbitMQProducer">RabbitMQ(生产者)</Option>
                <Option key="rabbitMQConsumer">RabbitMQ(消费者)</Option>
              </Select>
              <Row>
                <Col span={12} offset={6}>
                  {this.state.middlewareSelect === 'mysql' && (
                    <Card title="MySQL">
                      <Form className={styles["card-body"]}>
                        {machineRoomId}
                        <FormItem
                          {...formItemLayout4}
                          label="部署模式"
                          hasFeedback
                        >
                         <Radio.Group value={mysql.deployMode} onChange={e => this.setState({mysql: {...mysql, deployMode: e.target.value}})}>
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
                           <Radio.Group value={mysql.masterSlaveOption} onChange={e => this.setState({mysql: {...mysql, masterSlaveOption: e.target.value}})}>
                              <Radio.Button value='0'>一主一从</Radio.Button>
                              <Radio.Button value='1'>一主两从</Radio.Button>
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
                              <InputNumber value={mysql.mycatClusterManagerNodeCount}
                                           onChange={mycatClusterManagerNodeCount => this.setState({mysql: {...mysql, mycatClusterManagerNodeCount}})}
                              />
                            </FormItem>
                            <FormItem
                              {...formInputLayout}
                              label="数据节点数量"
                              hasFeedback
                            >
                              <InputNumber value={mysql.mycatClusterDataNodeCount}
                                           onChange={mycatClusterDataNodeCount => this.setState({mysql: {...mysql, mycatClusterDataNodeCount}})}
                              />
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

                  {this.state.middlewareSelect === 'redis' && (
                      <Card title="Redis">
                        <Form className={styles["card-body"]}>
                          {machineRoomId}
                          <FormItem
                            {...formInputLayout}
                            label="内存"
                            hasFeedback
                          >
                            <InputNumber value={redis.memorySize}
                                         onChange={memorySize => this.setState({redis: {...redis, memorySize}})}
                                         style={{width: '70%'}}
                            />
                            M
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
                              <InputNumber value={redis.sharedCount}
                                           onChange={sharedCount => this.setState({redis: {...redis, sharedCount}})}
                              />
                            </FormItem>
                          )}
                        </Form>
                      </Card>
                  )}
                  {this.state.middlewareSelect === 'rocketMQTopic' && (
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
                  {this.state.middlewareSelect === 'rabbitMQProducer' && (
                    <Card title="RabbitMQ-生产者">
                      <Form className={styles["card-body"]}>
                        {machineRoomId}
                        <FormItem
                          {...formInputLayout}
                          label="最大消息吞吐量"
                          hasFeedback
                        >
                          <InputNumber value={rabbitMQProducer.maxIO}
                                       onChange={maxIO => this.setState({rabbitMQProducer: {...rabbitMQProducer, maxIO}})}
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
                  {this.state.middlewareSelect === 'rabbitMQConsumer' && (
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

                        {exchangeType === 'topic' && (
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
                        {exchangeType === 'direct' && (
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
