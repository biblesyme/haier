import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Progress, Divider, Badge } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import {deployModeEnum} from 'utils/enum'
import MyProgress from '@/components/MyProgress'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CardGrid = Card.Grid

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

const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: {span: 16},
  style: {
    marginBottom: '5px'
  }
};

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
    const {resource={}, projects=[], resources=[]} = this.props
    const {data={}} = resource
    const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
    const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
    const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}
    let projectSelect = {}
    let exchangeType
    if (resource.resourceType === 'rabbitMQConsumer') {
      projectSelect = projects.filter(p => resource.data.producerApplicationScode === p.scode)[0] || {}
      let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
      let exchangeData = exchanges.filter(e => e.data.exchangeName === resource.data.exchangeName)[0] || {}
      exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''
    }

    return (
      <main>
        {resource.resourceType === 'containerHost' && (
          <div >
            <Row>
              <Col span={7} style={{width: 300}}>
               <span className="label">资源类型: </span>
               <span style={{fontSize: '16px', marginLeft: '10px'}}>容器</span>
             </Col>
              <Col span={7} style={{width: 300, marginLeft: 145}}>
               <span className="label">资源所在地: </span>
               <span style={{fontSize: '16px', marginLeft: '10px'}}>{locationFilter.name}</span>
               <span className="label" style={{marginLeft: '64px'}}>集群: </span>
               <span style={{fontSize: '16px', marginLeft: '10px'}}>{clusterFilter.name}</span>
             </Col>
            </Row>
            <Row>
              <Col span={7} style={{width: 300}}>
               <div className="label" style={{marginBottom: '30px'}}>应用资源配置: </div>
               <Card title={'配置资源'} className={styles['my-card']}>
                 <Form className={styles["card-body"]}>
                   <FormItem
                     {...formItemLayout3}
                     label="CPU内核数"
                     hasFeedback
                   >
                    {data.cpu/1000}
                   </FormItem>
                   <Divider style={{margin: '0px 0px'}}></Divider>
                   <FormItem
                     {...formItemLayout3}
                     label="内存"
                     hasFeedback
                   >
                    {`${parseInt(data.memory) / 1024 /1024 /1024 || ''}G`}
                   </FormItem>
                 </Form>
               </Card>
             </Col>
              <Col span={7} style={{marginLeft: 145, width: '600px', marginTop: '44px'}}>
                <Card bordered={false} className={styles['graph-card']}>
                  <CardGrid style={{width: '50%'}}>
                    <span style={{color: '#000'}}>资源使用率</span>
                    <Row className={styles['blue-progress']}>
                      <Col span={12}>
                        <div style={{marginTop: '80px'}}>
                          <Badge status="success" text={`使用: 1024M`}/>
                        </div>
                        <div style={{marginTop: 9}}><Badge status="default" text={`总共: 1024M`} /></div>
                      </Col>
                      <Col span={12} >
                        <Progress type="circle"
                                  percent={30}
                                  width={120}
                                  format={percent => <span style={{fontSize: 21}}><span style={{fontSize: 32, marginRight: 3, color: '#000', marginLeft: 10}}>{percent}</span>%</span>}
                        />
                      </Col>
                    </Row>
                  </CardGrid>
                  <CardGrid style={{width: '50%'}}>
                    <span style={{color: '#000'}}>健康实例率</span>
                    <Row className={styles['green-progress']}>
                      <Col span={12}>
                        <div style={{marginTop: '80px'}}>
                          <Badge status="success" text={`健康: 3`}/>
                        </div>
                        <div style={{marginTop: 9}}><Badge text={`总共: 10`} status="default"/></div>
                      </Col>
                      <Col span={12} >
                        <Progress type="circle"
                                  percent={30}
                                  width={120}
                                  format={percent => <span style={{fontSize: 21}}><span style={{fontSize: 32, marginRight: 3, color: '#000', marginLeft: 10}}>{percent}</span>%</span>}
                        />
                      </Col>
                    </Row>
                  </CardGrid>
                </Card>
             </Col>
            </Row>
          </div>
        )}
        {resource.resourceType === 'mysql' && (
          <div >
            <Card title="MySQL" style={{height: '250px', marginBottom: '16px'}}>
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
                  label="模式"
                  hasFeedback
                >
                 {deployModeEnum(data.deployMode)}
                </FormItem>

                {data.deployMode === '1' && (
                  <FormItem
                    {...formItemLayout4}
                    label="主从"
                    hasFeedback
                  >
                   {data.masterSlaveOption === '0' ? '一主一从' : '一主两从'}
                  </FormItem>
                )}

                {data.deployMode === '2' && (
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
        {resource.resourceType === 'redis' && (
          <div >
            <Card title="Redis" style={{marginBottom: '16px', height: '250px'}}>
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
                 {projectSelect.name}
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  label="Exchange名称"
                  hasFeedback
                  style = {{marginBottom: '10px'}}
                >
                  {data.exchangeName}
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="队列名"
                >
                 {data.queueName}
                </FormItem>

                {exchangeType === 'topic' && (
                  <FormItem
                    {...formInputLayout}
                    label="主题名"
                  >
                   {data.topicName}
                  </FormItem>
                )}
                {exchangeType === 'direct' && (
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
