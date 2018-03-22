import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Progress, Tabs, Badge } from 'antd';
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
          <span className={styles.title}><Icon type="redis" style={{marginRight: 12}}/>Redis</span>
        </div>
        <Row style={{marginTop: '40px'}}>
          <Col>
            <Tabs type="card">
              {items.sort((a, b) => {
                      if (a.data.clusterType > b.data.clusterType) return 1
                      if (a.data.clusterType < b.data.clusterType) return -1
                      return 0}).map((item, index) => {
                const {data={}} = item
                const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
                const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
                const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}

                const oneCount = items.filter(m => m.resourceType === 'redis' && m.data.clusterType === 'one').length
                const masterCount = items.filter(m => m.resourceType === 'redis' && m.data.clusterType === 'masterSlave').length
                let tabIndex = index
                if (data.clusterType === 'one') {
                  tabIndex = prefixZero(index + 1)
                }
                if (data.clusterType === 'masterSlave') {
                  tabIndex = prefixZero(index - oneCount + 1)
                }
                if (data.clusterType === 'shared') {
                  tabIndex = prefixZero(index - oneCount - masterCount + 1)
                }

                return (
                  <TabPane key={item.id} tab={`Redis - ${clusterTypeEnum(data.clusterType)}-${tabIndex}`}>
                    <div>
                      <span style={{width: 150}} className="inline">地点: {machineRoomFilter.roomName}</span>
                      <span style={{width: 150}} className="inline">模式: {clusterTypeEnum(data.clusterType)}</span>
                      <span style={{width: 150}} className="inline">
                        内存: &nbsp;
                        {`${data.memorySize}M`}
                      </span>
                      {data.clusterType === 'shared' && (
                        <span style={{width: 150}} className="inline">
                          分片数量: &nbsp;
                          {data.sharedCount}
                        </span>
                      )}
                    </div>
                    <Row style={{marginTop: 30}}>
                      <Col span={4} style={{width: '338px'}} className={styles['my-card']} >
                        <div>
                          <div className={styles['label']}>资源使用率</div>
                          <Row className={styles['blue-progress']} style={{paddingLeft: 30}}>
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
                        </div>
                      </Col>
                      <Col span={4} style={{width: '338px'}} className={styles['my-card']}>
                        <div>
                          <div className={styles['label']}>命中率</div>
                          <Row className={styles['green-progress']} style={{paddingLeft: 30}}>
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
                        </div>
                      </Col>
                      <Col span={4} style={{width: '210px'}} className={styles['my-card']}>
                        <div>
                          <div className={styles['label']}>日慢查询数量</div>
                          <div className={styles['number']}>
                            2334
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '210px'}} className={styles['my-card']}>
                        <div>
                          <div className={styles['label']}>当前连接数</div>
                          <div className={styles['number']}>
                            999
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
