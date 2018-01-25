import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card } from 'antd';

const CheckboxGroup = Checkbox.Group;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;

import styles from './style.sass'

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
  }

  render() {
    const {onChange, item, onRemove} = this.props
    const { size, size2 } = this.state;
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

    const gridLayout = {
      xl: {span: 7, offset: 1},
      md: {span: 11, offset: 1}
    }

    return (
      <main>
        {item.resourceType === 'mysql' && (
          <Col {...gridLayout}>
            <Card title="MySQL" style={{height: '290px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="地点"
                  hasFeedback
                >
                  <Select value={item.machineRoomId} onChange={machineRoomId => onChange({...item, machineRoomId})}>
                    <Option key="qd">青岛</Option>
                    <Option key="bj">北京</Option>
                  </Select>
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="部署模式"
                  hasFeedback
                >
                 <Radio.Group value={item.deployMode} onChange={e => onChange({...item, deployMode: e.target.value})}>
                    <Radio.Button value="one">单机</Radio.Button>
                    <Radio.Button value="primary">主从</Radio.Button>
                    <Radio.Button value="cluster">集群</Radio.Button>
                  </Radio.Group>
                </FormItem>

                {item.deployMode === 'primary' && (
                  <FormItem
                    {...formItemLayout4}
                    label="主从"
                    hasFeedback
                  >
                   <Radio.Group value={item.masterSlaveOption} onChange={e => onChange({...item, masterSlaveOption: e.target.value})}>
                      <Radio.Button value="1">一主一从</Radio.Button>
                      <Radio.Button value="2">一主两从</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                )}

                {item.deployMode === 'cluster' && (
                  <div>
                    <FormItem
                      {...formInputLayout}
                      label="管理节点数量"
                      hasFeedback
                    >
                     <Input placeholder="请输入管理节点数量" type="number" value={item.mycatClusterManagerNodeCount}
                            onChange={e => onChange({...item, mycatClusterManagerNodeCount: e.target.value})}
                      ></Input>
                    </FormItem>
                    <FormItem
                      {...formInputLayout}
                      label="数据节点数量"
                      hasFeedback
                    >
                     <Input placeholder="请输入数据节点数量" type="number" value={item.mycatClusterDataNodeCount}
                            onChange={e => onChange({...item, mycatClusterDataNodeCount: e.target.value})}
                      ></Input>
                    </FormItem>
                  </div>
                )}

                <FormItem
                  {...formItemLayout4}
                  label="备份"
                  hasFeedback
                >
                  <Radio.Group value={item.backup} onChange={e => onChange({...item, backup: e.target.value})}>
                    <Radio.Button value="true">是</Radio.Button>
                    <Radio.Button value="false">否</Radio.Button>
                  </Radio.Group>
                </FormItem>
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.resourceType === 'redis' && (
          <Col {...gridLayout}>
            <Card title="Redis" style={{height: '290px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="地点"
                  hasFeedback
                >
                  <Select value={item.machineRoomId} onChange={machineRoomId => onChange({...item, machineRoomId})}>
                    <Option key="qd">青岛</Option>
                    <Option key="bj">北京</Option>
                  </Select>
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="内存"
                  hasFeedback
                >
                  <Input placeholder="请输入内存大小"
                         type="number"
                         addonAfter="M"
                         value={item.memorySize}
                         onChange={e => onChange({...item, memorySize: e.target.value})}
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="集群类型"
                  hasFeedback
                >
                 <Radio.Group value={item.clusterType} onChange={e => onChange({...item, clusterType: e.target.value})}>
                  <Radio.Button value="one">单例</Radio.Button>
                  <Radio.Button value="masterSlave">主从</Radio.Button>
                  <Radio.Button value="shared">分片</Radio.Button>
                 </Radio.Group>
                </FormItem>

                {item.clusterType === 'shared' && (
                  <FormItem
                    {...formInputLayout}
                    label="分片数量"
                    hasFeedback
                  >
                    <Input placeholder="请输入分片数量"
                           type="number"
                           value={item.sharedCount}
                           onChange={e => onChange({...item, sharedCount: e.target.value})}
                    />
                  </FormItem>
                )}
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.resourceType === 'rocketMQTopic' && (
          <Col {...gridLayout}>
            <Card title="RocketMQ" style={{height: '290px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="地点"
                  hasFeedback
                >
                  <Select value={item.machineRoomId} onChange={machineRoomId => onChange({...item, machineRoomId})}>
                    <Option key="qd">青岛</Option>
                    <Option key="bj">北京</Option>
                  </Select>
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="集群类型"
                  hasFeedback
                >
                 <Radio.Group value={item.clusterType} onChange={e => onChange({...item, clusterType: e.target.value})}>
                    <Radio.Button value="standalone">单机</Radio.Button>
                    <Radio.Button value="cluster">集群</Radio.Button>
                  </Radio.Group>
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="主题名称"
                  hasFeedback
                >
                 <Input placeholder="请输入主题名称" value={item.topicName} onChange={e => onChange({...item, topicName: e.target.value})}></Input>
                </FormItem>
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.resourceType === 'rabbitMQProducer' && (
          <Col {...gridLayout}>
            <Card title="RabbitMQ-生产者" style={{height: '290px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="地点"
                  hasFeedback
                >
                  <Select value={item.machineRoomId} onChange={machineRoomId => onChange({...item, machineRoomId})}>
                    <Option key="qd">青岛</Option>
                    <Option key="bj">北京</Option>
                  </Select>
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="最大消息吞吐量"
                  hasFeedback
                >
                 <Input placeholder="请输入"
                        type="number"
                        value={item.maxIO}
                        onChange={e => onChange({...item, maxIO: e.target.value})}
                  />
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="Exchange名称"
                  hasFeedback
                >
                 <Input placeholder="请输入Exchange名称"
                        value={item.exchangeName}
                        onChange={e => onChange({...item, exchangeName: e.target.value})}
                 />
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  style = {{marginBottom: '10px'}}
                  label="Exchange类型"
                  hasFeedback
                >
                  <Radio.Group value={item.exchangeType} onChange={e => onChange({...item, exchangeType: e.target.value})}>
                     <Radio.Button value="fanout">广播</Radio.Button>
                     <Radio.Button value="topic">主题</Radio.Button>
                     <Radio.Button value="direct">直连</Radio.Button>
                   </Radio.Group>
                </FormItem>
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.resourceType === 'rabbitMQConsumer' && (
          <Col {...gridLayout}>
            <Card title="RabbitMQ-消费者" style={{height: '290px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="应用"
                  hasFeedback
                >
                 <Select placeholder="请选择应用"
                         value={item.producerApplicationScode}
                         onChange={producerApplicationScode => onChange({...item, producerApplicationScode})}
                  >
                   <Option key="S123451">产品中心</Option>
                   <Option key="S123450">鹿屋基地</Option>
                 </Select>
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="Exchange名称"
                  hasFeedback
                >
                 <Select placeholder="请选择Exchange名称"
                         value={this.state.exchangeName}
                         onChange={exchangeName => this.setState({exchangeName})}
                 >
                   <Option key="topic">主题应用</Option>
                   <Option key="direct">直连应用</Option>
                   <Option key="fanout">广播应用</Option>
                 </Select>
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="队列名"
                >
                 <Input placeholder="请填写队列名称" />
                </FormItem>

                {this.state.exchangeName === 'topic' && (
                  <FormItem
                    {...formInputLayout}
                    label="主题名"
                  >
                   <Input placeholder="请输入主题名称"></Input>
                  </FormItem>
                )}
                {this.state.exchangeName === 'direct' && (
                  <FormItem
                    {...formInputLayout}
                    label="直连名"
                  >
                   <Input placeholder="请输入直连名称"></Input>
                  </FormItem>
                )}
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}
      </main>

    )
  }
}
