import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Progress, Tabs } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import {clusterTypeEnum} from 'utils/enum'

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
            <div className={styles.title}>Redis</div>
          </Col>
        </Row>

        <Row style={{marginTop: '20px'}}>
          <Col span={24} push={1}>
            <Tabs>
              {items.map((item, index) => {
                const {data={}} = item
                const locationFilter = this.state.locations.filter(l => l.id === data.locationId)[0] || {}
                const clusterFilter = this.state.clusters.filter(c => c.id === data.clusterId)[0] || {}
                const machineRoomFilter = this.state.machineRooms.filter(m => m.id === data.machineRoomId)[0] || {}
                return (
                  <TabPane key={item.id} tab={`Redis - ${clusterTypeEnum(data.clusterType)}-${index + 1}`}>
                    <div>
                      <span style={{marginLeft: '32px'}}>地点: {machineRoomFilter.roomName}</span>
                      <span style={{marginLeft: '20px'}}>模式: {clusterTypeEnum(data.clusterType)}</span>
                      <span style={{marginLeft: '20px'}}>
                        内存: &nbsp;
                        {`${data.memorySize}M`}
                      </span>
                      {data.clusterType === 'shared' && (
                        <span style={{marginLeft: '20px'}}>
                          分片数量: &nbsp;
                          {data.sharedCount}
                        </span>
                      )}
                    </div>
                    <Card bordered={false}>
                      <CardGrid style={{width: '24%', height: '168px'}}>
                        资源使用率
                        <Row>
                          <Col span={12} style={{fontSize: '12px'}}>
                            <div style={{marginTop: '80px'}}>使用: 1024M</div>
                            <div>总共: 10240M</div>
                          </Col>
                          <Col span={12}>
                            <Progress type="dashboard"
                                      percent={75}
                                      width={120}
                                      format={percent => `
                                        ${percent}%`}
                            />
                          </Col>
                        </Row>
                      </CardGrid>
                      <CardGrid style={{width: '24%', height: '168px'}}>
                        命中率
                        <Row>
                          <Col span={12} style={{fontSize: '12px'}}>
                            <div style={{marginTop: '80px'}}>命中: 1024</div>
                            <div>总共: 10240</div>
                          </Col>
                          <Col span={12}>
                            <Progress type="circle"
                                      percent={30}
                                      width={120}
                                      format={percent => `
                                        ${percent}%`}
                            />
                          </Col>
                        </Row>
                      </CardGrid>
                      <CardGrid style={{width: '24%', height: '168px'}}>
                        日慢查询数量
                        <div style={{fontSize: '64px', textAlign: 'right'}}>
                          2334
                        </div>
                      </CardGrid>
                      <CardGrid style={{width: '24%', height: '168px'}}>
                        当前连接数
                        <div style={{fontSize: '64px', textAlign: 'right'}}>
                          999
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
