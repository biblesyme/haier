import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';
import nameMap from 'utils/nameMap'
import { connect } from 'utils/ecos'

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

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    resource: 'height',
    machineRoomId: 'qd',
    locations: [],
    clusters: [],
  }

  componentWillMount() {
    const {item={}} = this.props
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
          id: item.locationId,
        },
        successCB: (res) => this.setState({clusters: res.data.data || []}),
      }
    })
    this.setState({
      ...this.props.item,
    })
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
    const locationFilter = this.state.locations.filter(l => l.id === this.state.machineRoomId)[0] || {}
    const clusterFilter = this.state.clusters.filter(c => c.id === this.state.clusterId)[0] || {}
    const {item={}} = this.props
    return (
      <main>
        <label htmlFor="">资源所在地：</label>
          {locationFilter.name}
        <div style={{padding: '10px'}}></div>
        <label htmlFor="">已选集群：</label>
          {clusterFilter.name}
        <div style={{padding: '10px'}}></div>
          <section className={styles["card-form"]}>
            <div className={styles["card-header"]}>
              应用资源配置
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               {item.cpu}
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               {`${parseInt(item.memory) / 1024}G`}
              </FormItem>
            </Form>
          </section>
      </main>
    )
  }
}
