import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Progress, Tabs } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import {exchangeTypeEnum} from 'utils/enum'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CardGrid = Card.Grid
const TabPane = Tabs.TabPane

import styles from './styles.scss'

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
    const {resource={}, projects=[], resources=[], items=[]} = this.props
    const {data={}} = resource


    return (
      <main>
        <Row>
          <Col push={1} span={4}>
            <div className={styles.title}>RabbitMQ</div>
          </Col>
        </Row>

        <Row style={{marginTop: '20px'}}>
          <Col span={22} push={1}>
            <Tabs>
              {items.map((item, index) => {
                const {data={}} = item
                const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
                const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
                const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}
                if (item.resourceType === 'rabbitMQProducer') {
                  return (
                    <TabPane key={item.id} tab={`RabbitMQ - 生产者-${index + 1}`}>
                      <div>
                        <span style={{marginLeft: '32px'}}>地点: {machineRoomFilter.roomName}</span>
                        <span style={{marginLeft: '20px'}}>消息吞吐: {data.maxIO}</span>
                        <span style={{marginLeft: '20px'}}>
                          Exchange名称: &nbsp;
                          {`${data.exchangeName}`}
                        </span>
                        <span style={{marginLeft: '20px'}}>
                          Exchange类型: &nbsp;
                          {`${exchangeTypeEnum(data.exchangeType)}`}
                        </span>
                      </div>
                      <Card bordered={false}>
                        <CardGrid style={{width: '32%', height: '168px'}}>
                          消息总数
                          <div style={{fontSize: '64px', textAlign: 'right'}}>
                            2334
                          </div>
                        </CardGrid>
                        <CardGrid style={{width: '32%', height: '168px'}}>
                          已经投递的消息数
                          <div style={{fontSize: '64px', textAlign: 'right'}}>
                            999
                          </div>
                        </CardGrid>
                        <CardGrid style={{width: '32%', height: '168px'}}>
                          已经投递的消息数
                          <div style={{fontSize: '64px', textAlign: 'right'}}>
                            999
                          </div>
                        </CardGrid>
                      </Card>
                    </TabPane>
                  )
                }
                if (item.resourceType === 'rabbitMQConsumer') {
                  let projectSelect = {}
                  let exchangeType
                  projectSelect = projects.filter(p => data.producerApplicationScode === p.scode)[0] || {}
                  let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
                  let exchangeData = exchanges.filter(e => e.data.exchangeName === data.exchangeName)[0] || {}
                  exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''
                  return (
                    <TabPane key={item.id} tab={`RabbitMQ - 消费者-${index + 1}`}>
                      <div>
                        <span style={{marginLeft: '32px'}}>应用: {projectSelect.name}</span>
                        <span style={{marginLeft: '20px'}}>Exchange名称: {`${data.exchangeName}`}</span>
                        <span style={{marginLeft: '20px'}}>
                          队列名: &nbsp;
                          {data.queueName}
                        </span>
                        {exchangeType === 'topic' && (
                          <span style={{marginLeft: '20px'}}>
                            主题名: &nbsp;
                            {data.topicName}
                          </span>
                        )}
                        {exchangeType === 'direct' && (
                          <span style={{marginLeft: '20px'}}>
                            直连名: &nbsp;
                            {data.RouteKey}
                          </span>
                        )}
                      </div>
                      <Card bordered={false}>
                        <CardGrid style={{width: '32%', height: '168px'}}>
                          消息总数
                          <div style={{fontSize: '64px', textAlign: 'right'}}>
                            2334
                          </div>
                        </CardGrid>
                        <CardGrid style={{width: '32%', height: '168px'}}>
                          已经投递的消息数
                          <div style={{fontSize: '64px', textAlign: 'right'}}>
                            999
                          </div>
                        </CardGrid>
                        <CardGrid style={{width: '32%', height: '168px'}}>
                          已经投递的消息数
                          <div style={{fontSize: '64px', textAlign: 'right'}}>
                            999
                          </div>
                        </CardGrid>
                      </Card>
                    </TabPane>
                  )
                }
              })}
            </Tabs>
          </Col>
        </Row>
      </main>
    )
  }
}
