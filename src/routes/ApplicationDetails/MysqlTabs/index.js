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
        <Row>
          <Col push={1} span={4}>
            <div className={styles.title}>MySQL</div>
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
                return (
                  <TabPane key={item.id} tab={`MySQL - ${deployModeEnum(data.deployMode)}-${index + 1}`}>
                    <div>
                      <span style={{marginLeft: '32px'}}>地点: {machineRoomFilter.roomName}</span>
                      <span style={{marginLeft: '20px'}}>模式: {deployModeEnum(data.deployMode)}</span>
                      {data.deployMode === 1 && (
                        <span style={{marginLeft: '20px'}}>
                          主从: &nbsp;
                          {data.masterSlaveOption === 0 ? '一主一从' : '一主两从'}
                        </span>
                      )}
                      {data.deployMode === 2 && (
                        <span style={{marginLeft: '20px'}}>
                          mycat数量: &nbsp;
                          {data.mycatClusterManagerNodeCount}
                        </span>
                      )}
                      {data.deployMode === 2 && (
                        <span style={{marginLeft: '20px'}}>
                          mysql数量: &nbsp;
                          {data.mycatClusterDataNodeCount}
                        </span>
                      )}
                      <span style={{marginLeft: '20px'}}>
                        备份: &nbsp;
                        {data.backup === 'true' ? '是' : '否'}
                      </span>
                    </div>
                    <Card bordered={false}>
                      <CardGrid style={{width: '18%', height: '168px'}}>
                        日慢查询数量
                        <div style={{fontSize: '64px', textAlign: 'right'}}>
                          2334
                        </div>
                      </CardGrid>
                      <CardGrid style={{width: '18%', height: '168px'}}>
                        当前连接数
                        <div style={{fontSize: '64px', textAlign: 'right'}}>
                          999
                        </div>
                      </CardGrid>
                      <CardGrid style={{width: '18%', height: '168px'}}>
                        运行的线程个数
                        <div style={{fontSize: '64px', textAlign: 'right'}}>
                          10
                        </div>
                      </CardGrid>
                      <CardGrid style={{width: '18%', height: '168px'}}>
                        实例大小
                        <div  style={{fontSize: '16px', marginTop: '5px'}}>
                          <Row type="flex" justify="space-between">
                            <Col span={12}>cpu:</Col>
                            <Col span={6}>2</Col>
                          </Row>
                          <Row type="flex" justify="space-between">
                            <Col span={12}>内存:</Col>
                            <Col span={6}>1024M</Col>
                          </Row>
                          <Row type="flex" justify="space-between">
                            <Col span={12}>硬盘:</Col>
                            <Col span={6}>2G</Col>
                          </Row>
                        </div>
                      </CardGrid>
                      <CardGrid style={{width: '18%', height: '168px'}}>
                        锁定数量
                        <div style={{fontSize: '64px', textAlign: 'right'}}>
                          6
                        </div>
                      </CardGrid>
                    </Card>
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
