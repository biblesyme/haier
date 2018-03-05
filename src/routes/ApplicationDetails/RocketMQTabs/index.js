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
            <div className={styles.title}>RocketMQ</div>
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
                  <TabPane key={item.id} tab={`RocketMQ - ${clusterTypeEnum(data.clusterType)}-${index + 1}`}>
                    <div>
                      <span style={{marginLeft: '32px'}}>地点: {machineRoomFilter.roomName}</span>
                      <span style={{marginLeft: '20px'}}>类型: {clusterTypeEnum(data.clusterType)}</span>
                      <span style={{marginLeft: '20px'}}>
                        主题名称: &nbsp;
                        {`${data.topicName}`}
                      </span>
                    </div>
                    <Card bordered={false} height={300}>
                         <CardGrid style={{width: '18%', height: '168px'}}>
                           生产者总数
                           <div style={{fontSize: '64px', textAlign: 'right'}}>
                             999
                           </div>
                         </CardGrid>
                         <CardGrid style={{width: '18%', height: '168px'}}>
                           生产者应用总数
                           <div style={{fontSize: '64px', textAlign: 'right'}}>
                             999
                           </div>
                         </CardGrid>
                         <CardGrid style={{width: '18%', height: '168px'}}>
                           消费者应用总数
                           <div style={{fontSize: '64px', textAlign: 'right'}}>
                             999
                           </div>
                         </CardGrid>
                         <CardGrid style={{width: '18%', height: '168px'}}>
                           消费者实例数
                           <div style={{fontSize: '64px', textAlign: 'right'}}>
                             999
                           </div>
                         </CardGrid>
                         <CardGrid style={{width: '18%', height: '168px'}}>
                           一个小时内的消息总数
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
