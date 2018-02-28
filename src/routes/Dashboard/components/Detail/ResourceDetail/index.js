import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {deployModeEnum} from 'utils/enum'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    resource: 'height',
    machineRoomId: 'qd',
    machineRooms: [],
    locations: [],
    clusters: [],
    clusterInfo: {},
  }

  componentWillMount() {
    const {resource={}} = this.props
    const {data={}} = resource
    if (resource.resourceType === 'containerHost') {
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
            this.setState({machineRooms: res.data.data})
          },
        }
      })
    }
    this.setState({
      ...this.props.item,
    })
    // this.props.dispatch({type: 'App/findLocation'})
  }

  onChange = (value, field) => {
    const nextState = {
      ...this.state,
      [field]: value,
    }
    this.props.onChange(nextState)
    this.setState({
      [field]: value,
    })
  }

  render() {
    const {onChange, item={}, onRemove, projects=[], resources=[]} = this.props
    const machineRoomId = (
      <FormItem
        {...formItemLayout4}
        label="地点"
        hasFeedback
      >
        <Select value={item.machineRoomId}>
          {this.state.machineRooms.map(m => <Option key={m.id}>{m.roomName}</Option>)}
        </Select>
      </FormItem>
    )
    return (
      <main>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card title={<div><Icon type="mysql"/> MySQL</div>} style={{height: '350px'}}>
            <Form className={styles["card-body"]}>
              {machineRoomId}
              <FormItem
                {...formItemLayout4}
                label="部署模式"
                hasFeedback
              >
               <Radio.Group value={item.deployMode} onChange={(e => this.onChange(e.target.value, 'deployMode'))}>
                  <Radio.Button value="0">单机</Radio.Button>
                  <Radio.Button value="1">主从</Radio.Button>
                  <Radio.Button value="2">集群</Radio.Button>
                </Radio.Group>
              </FormItem>

              {item.deployMode === '1' && (
                <FormItem
                  {...formItemLayout4}
                  label="主从"
                  hasFeedback
                >
                 <Radio.Group value={item.masterSlaveOption}>
                    <Radio.Button value="0">一主一从</Radio.Button>
                    <Radio.Button value="1">一主两从</Radio.Button>
                  </Radio.Group>
                </FormItem>
              )}

              {item.deployMode === '2' && (
                <div>
                  <FormItem
                    {...formInputLayout}
                    label="管理节点数量"
                    hasFeedback
                  >
                   <Input placeholder="请输入管理节点数量" type="number" value={item.mycatClusterManagerNodeCount}

                    ></Input>
                  </FormItem>
                  <FormItem
                    {...formInputLayout}
                    label="数据节点数量"
                    hasFeedback
                  >
                   <Input placeholder="请输入数据节点数量" type="number" value={item.mycatClusterDataNodeCount}

                    ></Input>
                  </FormItem>
                </div>
              )}

              <FormItem
                {...formItemLayout4}
                label="备份"
                hasFeedback
              >
                <Radio.Group value={item.backup} >
                  <Radio.Button value="true">是</Radio.Button>
                  <Radio.Button value="false">否</Radio.Button>
                </Radio.Group>
              </FormItem>
            </Form>
          </Card>
        </div>
      </main>
    )
  }
}
