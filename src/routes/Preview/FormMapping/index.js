import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'

const CheckboxGroup = Checkbox.Group;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;

import styles from './style.sass'

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    size: 'haier',
    location: 'qd',
    checkedList: [],
    mode: 'one',
    servant: '1',
    isBackup: 'true',
    consumeMode: 'cluster',
    exchangeType: 'fanout',
    exchangeName: null,
    machineRoomId: 'qd',
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
    console.log(this.state)
    const {onChange, item={}, onRemove} = this.props
    const { size, size2 } = this.state;
    const machineRoomFilter = this.state.machineRooms.filter(m => m.id === item.machineRoomId)[0] || {}
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
      labelCol: {xs: { span: 10 }, sm: { span: 10 }, pull: 0},
      wrapperCol: {xs: { span: 14 }, sm: { span: 14 }, push: 0},
      style: {marginBottom: '10px'},
    }

    const gridLayout = {
      xl: {span: 7, offset: 1},
      md: {span: 11, offset: 1}
    }

    return (
      <main>
        {item.resourceType === 'mysql' && (
          <Col {...gridLayout}>
            <Card title="MySQL" style={{height: '290px', marginBottom: '20px'}}>
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
                 {nameMap[item.deployMode]}
                </FormItem>

                {item.deployMode === 'primary' && (
                  <FormItem
                    {...formItemLayout4}
                    label="主从"
                    hasFeedback
                  >
                   {item.masterSlaveOption === '1' ? '一主一从' : '一主两从'}
                  </FormItem>
                )}

                {item.deployMode === 'cluster' && (
                  <div>
                    <FormItem
                      {...formInputLayout}
                      label="管理节点数量"
                      hasFeedback
                    >
                     {item.mycatClusterManagerNodeCount}
                    </FormItem>
                    <FormItem
                      {...formInputLayout}
                      label="数据节点数量"
                      hasFeedback
                    >
                     {item.mycatClusterDataNodeCount}
                    </FormItem>
                  </div>
                )}

                <FormItem
                  {...formItemLayout4}
                  label="备份"
                  hasFeedback
                >
                  {nameMap[item.backup]}
                </FormItem>
              </Form>
            </Card>
          </Col>
        )}

        {item.resourceType === 'redis' && (
          <Col {...gridLayout}>
            <Card title="Redis" style={{height: '290px', marginBottom: '20px'}}>
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
                  {`${item.memorySize}M`}
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="集群类型"
                  hasFeedback
                >
                  {item.clusterType === 'one' && '单例'}
                  {item.clusterType === 'masterSlave' && '主从'}
                  {item.clusterType === 'shared' && '分片'}
                </FormItem>
                {item.clusterType === 'shared' && (
                  <FormItem
                    {...formInputLayout}
                    label="分片数量"
                    hasFeedback
                  >
                    {item.sharedCount}
                  </FormItem>
                )}
              </Form>
            </Card>

          </Col>
        )}

        {item.resourceType === 'rocketMQTopic' && (
          <Col {...gridLayout}>
            <Card title="RocketMQ" style={{height: '290px', marginBottom: '20px'}}>
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
                 {item.clusterType === 'standalone' ? '单机' : '集群'}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="主题名称"
                  hasFeedback
                >
                 {item.topicName}
                </FormItem>
              </Form>
            </Card>

          </Col>
        )}

        {item.resourceType === 'rabbitMQProducer' && (
          <Col {...gridLayout}>
            <Card title="RabbitMQ-生产者" style={{height: '290px', marginBottom: '20px'}}>
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
                 {item.maxIO}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="Exchange名称"
                  hasFeedback
                >
                 {item.exchangeName}
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  style = {{marginBottom: '10px'}}
                  label="Exchange类型"
                  hasFeedback
                >
                  {item.exchangeType === 'fanout' && '广播'}
                  {item.exchangeType === 'topic' && '主题'}
                  {item.exchangeType === 'direct' && '直连'}
                </FormItem>
              </Form>
            </Card>

          </Col>
        )}

        {item.resourceType === 'rabbitMQConsumer' && (
          <Col {...gridLayout}>
            <Card title="RabbitMQ-消费者" style={{height: '290px', marginBottom: '20px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="应用"
                  hasFeedback
                >
                 {item.producerApplicationScode === 'S123451' && '产品中心'}
                 {item.producerApplicationScode === 'S123450' && '鹿屋基地'}
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  label="Exchange名称"
                  hasFeedback
                  style = {{marginBottom: '10px'}}
                >
                  {item.exchangeName === 'topic' && '主题应用'}
                  {item.exchangeName === 'direct' && '直连应用'}
                  {item.exchangeName === 'fanout' && '广播应用'}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="队列名"
                >
                 {item.queueName}
                </FormItem>

                {item.exchangeName === 'topic' && (
                  <FormItem
                    {...formInputLayout}
                    label="主题名"
                  >
                   {item.topicName}
                  </FormItem>
                )}
                {item.exchangeName === 'direct' && (
                  <FormItem
                    {...formInputLayout}
                    label="直连名"
                  >
                   {item.RouteKey}
                  </FormItem>
                )}
              </Form>
            </Card>

          </Col>
        )}
      </main>

    )
  }
}
