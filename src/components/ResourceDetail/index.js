import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'

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
  }

  componentWillMount() {
    const {resource={}} = this.props
    const {data={}} = resource
    if (data.resourceType === 'containerHost') {
      this.props.dispatch({
        type: 'App/findLocation',
        payload: {
          successCB: (res) => this.setState({locations: res.data.data}),
        }
      })
      this.props.dispatch({
        type: 'App/followCluster',
        payload: {
          data: {
            id: data.machineRoomId,
          },
          successCB: (res) => this.setState({clusters: res.data.data}),
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

  render() {
    const {resource={}} = this.props
    const {data={}} = resource
    const locationFilter = this.state.locations.filter(l => l.id === data.machineRoomId)[0] || {}
    const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterName)[0] || {}
    const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}
    return (
      <main>
        {data.resourceType === 'containerHost' && (
          <div className="text-center">
            <label htmlFor="">资源所在地：</label>
              {locationFilter.name}
            <div style={{padding: '10px'}}></div>
            <label htmlFor="">已选集群：</label>
              {clusterFilter.name}
            <div style={{padding: '10px'}}></div>
              <section className={styles["card-form"]}>
                <div className={styles["card-header"]}>
                  {nameMap[this.state.resource]}
                </div>
                <Form className={styles["card-body"]}>
                  <FormItem
                    {...formItemLayout3}
                    label="CPU内核数"
                    hasFeedback
                  >
                   {data.cpu}
                  </FormItem>
                  <FormItem
                    {...formItemLayout3}
                    label="内存"
                    hasFeedback
                  >
                   {`${parseInt(data.memory) / 1024 || ''}G`}
                  </FormItem>
                  <FormItem
                    {...formItemLayout3}
                    label="硬盘"
                    hasFeedback
                  >
                   {`${data.diskSize || ''}G`}
                  </FormItem>
                </Form>
              </section>
              {this.props.approval && (
                <section className={styles["card-form"]}>
                  <div className={styles["card-header"]}>
                    {nameMap[this.state.resource]}
                  </div>
                  <Form className={styles["card-body"]}>
                    <FormItem
                      {...formItemLayout3}
                      label="可用CPU"
                      hasFeedback
                    >
                     {data.cpu}
                    </FormItem>
                    <FormItem
                      {...formItemLayout3}
                      label="可用内存"
                      hasFeedback
                    >
                     {`${parseInt(data.memory) / 1024 || ''}G`}
                    </FormItem>
                  </Form>
                </section>
              )}
          </div>
        )}
        {data.resourceType === 'mysql' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="MySQL" style={{marginBottom: '16px', width: '216px'}}>
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
                 {nameMap[data.deployMode]}
                </FormItem>

                {data.deployMode === 'primary' && (
                  <FormItem
                    {...formItemLayout4}
                    label="主从"
                    hasFeedback
                  >
                   {data.masterSlaveOption === '1' ? '一主一从' : '一主两从'}
                  </FormItem>
                )}

                {data.deployMode === 'cluster' && (
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
          </div>
        )}
        {data.resourceType === 'redis' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="Redis" style={{width: '216px', marginBottom: '20px'}}>
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
        {data.resourceType === 'rocketMQTopic' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="RocketMQ" style={{marginBottom: '16px', width: '216px'}}>
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
        {data.resourceType === 'rabbitMQProducer' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="RabbitMQ-生产者" style={{marginBottom: '16px', width: '216px'}}>
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
        {data.resourceType === 'rabbitMQConsumer' && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card title="RabbitMQ-消费者" style={{marginBottom: '16px', width: '216px'}}>
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
      </main>
    )
  }
}
