import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Progress, Tabs } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import {deployModeEnum} from 'utils/enum'

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

    const width = '226px'
    const height = '180px'

    return (
      <main style={{marginBottom: 47}}>
        <div style={{borderBottom: '1px solid #eaedf2', paddingBottom: '10px'}}>
          <span className={styles.title}><Icon type="mysql" style={{marginRight: 12}}/>MySQL</span>
        </div>

        <Row style={{marginTop: '40px'}}>
          <Col>
            <Tabs type="card">
              {items.map((item, index) => {
                const {data={}} = item
                const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
                const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
                const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}
                return (
                  <TabPane key={item.id} tab={`MySQL - ${deployModeEnum(data.deployMode)}-${index + 1}`}>
                    <div>
                      <div style={{width: 150}} className="inline">地点: {machineRoomFilter.roomName}</div>
                      <div style={{width: 150}} className="inline">模式: {deployModeEnum(data.deployMode)}</div>
                      {data.deployMode === 1 && (
                        <div style={{width: 150}} className="inline">
                          主从: &nbsp;
                          {data.masterSlaveOption === 0 ? '一主一从' : '一主两从'}
                        </div>
                      )}
                      {data.deployMode === 2 && (
                        <div style={{width: 150}} className="inline">
                          mycat数量: &nbsp;
                          {data.mycatClusterManagerNodeCount}
                        </div>
                      )}
                      {data.deployMode === 2 && (
                        <div style={{width: 150}} className="inline">
                          mysql数量: &nbsp;
                          {data.mycatClusterDataNodeCount}
                        </div>
                      )}
                      <div style={{width: 150}} className="inline">
                        备份: &nbsp;
                        {data.backup === 'true' ? '是' : '否'}
                      </div>
                    </div>
                    <Row style={{marginTop: 30}}>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>日慢查询数量</div>
                          <div className={styles['number']}>
                            2334
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>当前连接数</div>
                          <div className={styles['number']}>
                            999
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>运行的线程个数</div>
                          <div className={styles['number']}>
                            10
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>实例大小</div>
                          <Row style={{marginTop: 30, color: '#545454', paddingLeft: 30}}><Col>CPU: 2</Col></Row>
                          <Row style={{marginTop: 14, color: '#545454', paddingLeft: 30}}><Col>内存: 1024M</Col></Row>
                          <Row style={{marginTop: 14, color: '#545454', paddingLeft: 30}}><Col>硬盘: 2G</Col></Row>
                        </div>
                      </Col>
                      <Col span={4} style={{width: '222px'}}>
                        <div className={styles['my-card']}>
                          <div className={styles['label']}>锁定数量</div>
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
