import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card, Collapse, Table, InputNumber } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import {clusterTypeEnum} from 'utils/enum'
import Tabs, { TabPane } from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel

import styles from './style.sass'

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    resource: 'height',
    machineRoomId: 'qd',
    machineRooms: [],
    locations: [],
    clusters: [],
    clusterInfo: {},
    machineRooms: [],
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'App/findMachineRoom',
      payload: {
        successCB: (res) => {
          this.setState({machineRooms: res.data.data})
        },
      }
    })
  }

  edit = (record) => {
    record.editable = true
    this.props.onChange(record)
  }

  save = (record) => {
    const newItem = {
      ...record,
      data: record._data,
      editable: false,
    }
    this.props.onChange(newItem)
  }

  cancel = (record) => {
    const oldItem = {
      ...record,
      _data: record.data,
      editable: false,
    }
    this.props.onChange(oldItem)
  }

  stateChange = (record, value, field) => {
    let newItem = {
      ...record,
      _data: {
        ...record._data,
        [field]: value,
      }
    }
    this.props.onChange(newItem)
  }

  render() {
    const {onChange, item={}, onRemove, projects=[], resources=[], middlewareMappings=[]} = this.props
    let boxes = middlewareMappings.filter(m => m.resourceType === 'redis').sort(
      (a, b) => {
        if (a.flag === 'new' && b.flag === 'new') {
          return 0
        }
        if (a.flag === 'new' && b.flag !== 'new') {
          return 1
        }
        if (a.flag !== 'new' && b.flag === 'new') {
          return -1
        }
        if (!a.flag && !b.flag) {
          if (a.data.clusterType < b.data.clusterType ) {
            return -1
          }
          if (a.data.clusterType > b.data.clusterType) {
            return 1
          }
        }
        return 0
      }
    )

    const columns = [{
      title: <div style={{marginLeft: 100 - 16}}>中间件名称</div>,
      key: 'id',
      render: (text, record, index) => {
        const {data={}} = record
        return (
          <span style={{marginLeft: 21}}>
            {`Redis - ${clusterTypeEnum(data.clusterType)} -
            ${boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1 > 9 ?
              boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1 :
              '0' + (boxes.slice(0, index).filter(b => b.data.clusterType === data.clusterType).length + 1)
            }`}
          </span>
        )
      }
    }, {
      title: <div className="text-center">集群类型</div>,
      className: 'text-center',
      render: (record) => <span>{clusterTypeEnum(record.data.clusterType)}</span>
    }, {
      title: <div className="text-center">内存</div>,
      className: 'text-center',
      render: (record) => {
        if (record.editable) {
          return (
            <div>
              <InputNumber style={{ margin: '-5px 0' }}
                           value={record._data.memorySize}
                           onChange={value => this.stateChange(record, value, 'memorySize')}
                           min={0}
              />M
            </div>
          )
        }
        return <span>{record.data.memorySize}M</span>
      }
    }, {
      title: <div className="text-center">操作</div>,
      className: 'text-center',
      render: (text, record, index) => {
        if (record.editable) {
          return (
            <div>
              <a onClick={() => this.save(record)}>保存</a>
              <a onClick={() => this.cancel(record)} style={{marginLeft: 10}}>取消</a>
            </div>
          )
        } else {
          return <a onClick={() => this.edit(record)}>修改</a>
        }
      }
    }]

    return (
      <div style={{marginBottom: 38}}>
        <Tabs
          renderTabBar={()=><ScrollableInkTabBar />}
          renderTabContent={()=><TabContent />}
        >
          <TabPane tab={<div ><Icon type="redis" style={{marginRight: 12, fontSize: 14}}/><span>Redis</span></div>} key="1">
            <div>
              <Table scroll={{x: 1125}}
                     dataSource={boxes}
                     columns={columns}
                     rowKey="id"
                     pagination={false}
                     style={{marginTop: 21}}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
