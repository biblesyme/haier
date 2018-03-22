import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Progress, Tabs } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import {clusterTypeEnum} from 'utils/enum'
import MyProgress from '@/components/MyProgress'
import prefixZero from 'utils/prefixZero'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CardGrid = Card.Grid
const TabPane = Tabs.TabPane

import styles from './styles.sass'

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
    let projectSelect = {}
    let exchangeType
    if (resource.resourceType === 'rabbitMQConsumer') {
      projectSelect = projects.filter(p => resource.data.producerApplicationScode === p.scode)[0] || {}
      let exchanges = resources.filter(r => (r.resourceType === 'rabbitMQProducer' && r.projectId === projectSelect.id))
      let exchangeData = exchanges.filter(e => e.data.exchangeName === resource.data.exchangeName)[0] || {}
      exchangeType = (exchangeData.data && exchangeData.data.exchangeType) || ''
    }

    return (
      <main style={{marginBottom: 47}}>
        <div style={{borderBottom: '1px solid #eaedf2', paddingBottom: '10px'}}>
          <span className={styles.title}><Icon type="rocket" style={{marginRight: 12}}/>RocketMQ</span>
        </div>

        <Row style={{marginTop: '20px'}}>
          <Col>
            <Tabs　type="card">
              {items.sort((a, b) => {
                if (a.data.clusterType > b.data.clusterType) return 1
                if (a.data.clusterType < b.data.clusterType) return -1
                return 0}).map((item, index) => {
                const {data={}} = item
                const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
                const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
                const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}

                const clusterCount = items.filter(m => m.resourceType === 'rocketMQTopic' && m.data.clusterType === 'cluster').length
                let tabIndex = index
                if (data.clusterType === 'cluster') {
                  tabIndex = prefixZero(index + 1)
                }
                if (data.clusterType === 'standalone') {
                  tabIndex = prefixZero(index - clusterCount + 1)
                }

                return (
                  <TabPane key={item.id} tab={`RocketMQ - ${clusterTypeEnum(data.clusterType)}-${tabIndex}`}>
                    <div>
                      <span style={{width: 150}} className="inline">地点: {machineRoomFilter.roomName}</span>
                      <span style={{width: 150}} className="inline">类型: {clusterTypeEnum(data.clusterType)}</span>
                      <span style={{width: 150}} className="inline">
                        主题名称: &nbsp;
                        {`${data.topicName}`}
                      </span>
                    </div>
                    <Row style={{marginTop: 30}}>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>生产者总数</div>
                          <div className={styles['number']}>
                            2334
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>生产者应用总数</div>
                          <div className={styles['number']}>
                            999
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>消费者应用总数</div>
                          <div className={styles['number']}>
                            10
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>消费者实例数</div>
                          <div className={styles['number']}>
                            99
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>一个小时内的消息总数</div>
                          <div className={styles['number']}>
                            6
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                )
              })}
            </Tabs>
          </Col>
        </Row>
      </main>
    )
  }
}
