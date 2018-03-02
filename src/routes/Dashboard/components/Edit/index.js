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
  message,
  Input,
  Radio,
  InputNumber,
} from 'antd'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'
import { connect } from 'utils/ecos'

const FormItem = Form.Item
const {Option} = Select
const RadioGroup = Radio.Group;

import styles from './style.sass'

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

@Form.create()
@connect(null, ['App', 'Approval'])
export default class C extends React.Component {
  state = {
    resource: {},
    mysql: {
      deployMode: '0',
      masterSlaveOption: '0',
      mycatClusterManagerNodeCount: 0,
      mycatClusterDataNodeCount: 0,
      backup: 'false',
      resourceType: 'mysql',
    },
    redis: {
      memorySize: '100',
      clusterType: 'one',
      sharedCount: '0',
      resourceType: 'redis',
    },
    rocketMQTopic: {
      clusterType: 'standalone',
      topicName: '',
      resourceType: 'rocketMQTopic',
    },
    rabbitMQProducer: {
      maxIO: '100',
      exchangeName: '',
      exchangeType: 'fanout',
      resourceType: 'rabbitMQProducer',
    },
    rabbitMQConsumer: {
      producerApplicationScode: '',
      exchangeName: '',
      queueName: '',
      topicName: '',
      RouteKey: '',
      resourceType: 'rabbitMQConsumer',
    },
    middlewareSelect: 'mysql',
    machineRooms: [],
    machineRoomId: '',
  }

  componentWillMount() {
    const {editId, middlewareMappings=[]} = this.props

    this.props.dispatch({
      type: 'App/findMachineRoom',
      payload: {
        successCB: (res) => {
          this.setState({machineRooms: res.data.data})
        },
      }
    })

    const item = middlewareMappings.filter(m => m.id === editId)[0] || {}
    this.setState({middlewareSelect: item.resourceType, [item.resourceType]: item, machineRoomId: item.machineRoomId})
    console.log(item)
  }

  onMysqlChange = (value, filed) => {
    this.setState({
      mysql: {
        ...this.state.mysql,
        [filed]: value,
      }
    })
  }
  onRedisChange = (value, filed) => {
    this.setState({
      redis: {
        ...this.state.redis,
        [filed]: value,
      }
    })
  }
  onChange = (value, filed, type) => {
    this.setState({
      [type]: {
        ...this.state[type],
        [filed]: value,
      }
    })
  }

  payloadSelector = () => {
    const payload = {
      ...this.state[this.state.middlewareSelect],
      machineRoomId: this.state.machineRoomId,
      type: this.state.middlewareSelect,
    }
    this.props.onOk(payload)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {onChange, onRemove, projects=[], resources=[]} = this.props
    const {resource} = this.props
    const {middlewareSelect} = this.state

    let projectSelect = projects.filter(p => this.state.rabbitMQConsumer.producerApplicationScode === p.scode)[0] || {}
    let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
    let exchangeData = exchanges.filter(e => e.data.exchangeName === this.state.rabbitMQConsumer.exchangeName)[0] || {}
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
              编辑中间件
            </div>
          }
          {...this.props}
          footer={
            <div className="text-center">
              <Button onClick={() => this.payloadSelector()} type="primary">确定</Button>
              <Button onClick={this.props.onCancel} >取消</Button>
            </div>
          }
          closable={false}
          width={800}
          >
            <div className="text-center">
              {this.state.middlewareSelect === 'mysql' && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card title={<div><Icon type="mysql"/> MySQL</div>} style={{height: '350px', width: '400px'}}>
                  <Form className={styles["card-body"]}>
                    {machineRoomId}
                    <FormItem
                      {...formItemLayout4}
                      label="部署模式"
                      hasFeedback
                    >
                     <Radio.Group value={this.state.mysql.deployMode} onChange={(e) => this.onMysqlChange(e.target.value, 'deployMode')}>
                        <Radio.Button value="0">单机</Radio.Button>
                        <Radio.Button value="1">主从</Radio.Button>
                        <Radio.Button value="2">集群</Radio.Button>
                      </Radio.Group>
                    </FormItem>

                    {this.state.mysql.deployMode === '1' && (
                      <FormItem
                        {...formItemLayout4}
                        label="主从"
                        hasFeedback
                      >
                       <Radio.Group value={this.state.mysql.masterSlaveOption} onChange={(e => this.onMysqlChange(e.target.value, 'masterSlaveOption'))}>
                          <Radio.Button value="0">一主一从</Radio.Button>
                          <Radio.Button value="1">一主两从</Radio.Button>
                        </Radio.Group>
                      </FormItem>
                    )}

                    {this.state.mysql.deployMode === '2' && (
                      <div>
                        <FormItem
                          {...formInputLayout}
                          label="MyCAT节点数量"
                          hasFeedback
                        >
                          <InputNumber value={this.state.mysql.mycatClusterManagerNodeCount}
                                       onChange={value => this.onMysqlChange(value, 'mycatClusterManagerNodeCount')}
                                       min={0}
                          />
                        </FormItem>
                        <FormItem
                          {...formInputLayout}
                          label="MySQL数量"
                          hasFeedback
                        >
                          <InputNumber value={this.state.mysql.mycatClusterDataNodeCount}
                                       onChange={value => this.onMysqlChange(value, 'mycatClusterDataNodeCount')}
                                       min={0}
                          />
                        </FormItem>
                      </div>
                    )}

                    <FormItem
                      {...formItemLayout4}
                      label="备份"
                      hasFeedback
                    >
                      <Radio.Group value={this.state.backup} value={this.state.mysql.backup} onChange={e => this.onMysqlChange(e.target.value, 'backup')}>
                        <Radio.Button value="true">是</Radio.Button>
                        <Radio.Button value="false">否</Radio.Button>
                      </Radio.Group>
                    </FormItem>
                  </Form>
                </Card>
              </div>
              )}
              {this.state.middlewareSelect === 'redis' && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Card title={<div><Icon type="redis"/> Redis</div>} style={{height: '290px', width: '400px'}}>
                    <Form className={styles["card-body"]}>
                      {machineRoomId}
                      <FormItem
                        {...formInputLayout}
                        label="内存"
                        hasFeedback
                      >
                        <InputNumber value={this.state.redis.memorySize}
                                     onChange={value => this.onRedisChange(e.target.value, 'memorySize')}
                                     min={0}
                                     style={{width: '70%'}}
                                     defaultValue={100}
                        />
                        <span>M</span>
                      </FormItem>
                      <FormItem
                        {...formItemLayout4}
                        label="集群类型"
                        hasFeedback
                      >
                       <Radio.Group value={this.state.redis.clusterType} onChange={e => this.onRedisChange(e.target.value, 'clusterType')}>
                        <Radio.Button value="one">单例</Radio.Button>
                        <Radio.Button value="masterSlave">主从</Radio.Button>
                        <Radio.Button value="shared">分片</Radio.Button>
                       </Radio.Group>
                      </FormItem>

                      {this.state.redis.clusterType === 'shared' && (
                        <FormItem
                          {...formInputLayout}
                          label="分片数量"
                          hasFeedback
                        >
                          <InputNumber value={this.state.redis.sharedCount}
                                       onChange={value => this.onRedisChange(e.target.value, 'sharedCount')}
                                       min={0}
                          />
                        </FormItem>
                      )}
                    </Form>
                  </Card>
                </div>
              )}
              {this.state.middlewareSelect === 'rocketMQTopic' && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Card title={<div><Icon type="rocket"/> RocketMQ</div>} style={{height: '290px', width: '400px'}}>
                    <Form className={styles["card-body"]}>
                      {machineRoomId}
                      <FormItem
                        {...formItemLayout4}
                        label="集群类型"
                        hasFeedback
                      >
                       <Radio.Group value={this.state.rocketMQTopic.clusterType} onChange={e => this.onChange(e.target.value, 'clusterType', 'rocketMQTopic')}>
                          <Radio.Button value="standalone">单机</Radio.Button>
                          <Radio.Button value="cluster">集群</Radio.Button>
                        </Radio.Group>
                      </FormItem>
                      <FormItem
                        {...formInputLayout}
                        label="主题名称"
                        hasFeedback
                      >
                       <Input placeholder="请输入主题名称" value={this.state.rocketMQTopic.topicName} onChange={e => this.onChange(e.target.value, 'topicName', 'rocketMQTopic')}></Input>
                      </FormItem>
                    </Form>
                  </Card>
                </div>
              )}
              {middlewareSelect === 'rabbitMQProducer' && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Card title={<div><Icon type="RabbitMQ"/> RabbitMQ-生产者</div>} style={{height: '290px', width: '400px'}}>
                    <Form className={styles["card-body"]}>
                      {machineRoomId}
                      <FormItem
                        {...formInputLayout}
                        label="最大消息吞吐量"
                        hasFeedback
                      >
                        <InputNumber value={this.state[middlewareSelect].maxIO}
                                     onChange={value => this.onChange(value, 'maxIO', middlewareSelect)}
                                     min={0}
                        />
                      </FormItem>
                      <FormItem
                        {...formInputLayout}
                        label="Exchange名称"
                        hasFeedback
                      >
                       <Input placeholder="请输入Exchange名称"
                              value={this.state[middlewareSelect].exchangeName}
                              onChange={e => this.onChange(e.target.value, 'exchangeName', middlewareSelect)}
                       />
                      </FormItem>
                      <FormItem
                        labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                        wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                        style = {{marginBottom: '10px'}}
                        label="Exchange类型"
                        hasFeedback
                      >
                        <Radio.Group value={this.state[middlewareSelect].exchangeType} onChange={e => this.onChange(e.target.value, 'exchangeType', middlewareSelect)}>
                           <Radio.Button value="fanout">广播</Radio.Button>
                           <Radio.Button value="topic">主题</Radio.Button>
                           <Radio.Button value="direct">直连</Radio.Button>
                         </Radio.Group>
                      </FormItem>
                    </Form>
                  </Card>
                </div>
              )}
              {middlewareSelect === 'rabbitMQConsumer' && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Card title={<div><Icon type="RabbitMQ"/> RabbitMQ-消费者</div>} style={{height: '290px', width: '400px'}}>
                    <Form className={styles["card-body"]}>
                      <FormItem
                        {...formInputLayout}
                        label="应用"
                        hasFeedback
                      >
                       <Select placeholder="请选择应用"
                               value={this.state[middlewareSelect].producerApplicationScode}
                               onChange={producerApplicationScode => this.onChange(producerApplicationScode, 'producerApplicationScode', middlewareSelect)}
                        >
                         {projects.map(p => <Option key={p.scode}>{p.name}</Option>)}
                       </Select>
                      </FormItem>
                      <FormItem
                        {...formInputLayout}
                        label="Exchange名称"
                        hasFeedback
                      >
                       <Select placeholder="请选择Exchange名称"
                               value={this.state[middlewareSelect].exchangeName}
                               onChange={exchangeName => this.onChange(exchangeName, 'exchangeName', middlewareSelect)}
                       >
                         {exchanges.map(e => <Option key={e.id} value={e.data.exchangeName}>{e.data.exchangeName}</Option>)}
                       </Select>
                      </FormItem>
                      <FormItem
                        {...formInputLayout}
                        label="队列名"
                      >
                       <Input placeholder="请填写队列名称"
                              value={this.state[middlewareSelect].queueName}
                              onChange={e => this.onChange(e.target.value, 'queueName', middlewareSelect)}
                       />
                      </FormItem>

                      {exchangeType === 'topic' && (
                        <FormItem
                          {...formInputLayout}
                          label="主题名"
                        >
                         <Input placeholder="请输入主题名称"
                                value={this.state[middlewareSelect].topicName}
                                onChange={e => this.onChange(e.target.value, 'topicName', middlewareSelect)}
                         />
                        </FormItem>
                      )}
                      {exchangeType === 'direct' && (
                        <FormItem
                          {...formInputLayout}
                          label="直连名"
                        >
                         <Input placeholder="请输入直连名称"
                                value={this.state[middlewareSelect].RouteKey}
                                onChange={e => this.onChange(e.target.value, 'RouteKey', middlewareSelect)}
                         />
                        </FormItem>
                      )}
                    </Form>
                  </Card>
                </div>
              )}
            </div>
        </Modal>
      </div>

    )
  }
}
