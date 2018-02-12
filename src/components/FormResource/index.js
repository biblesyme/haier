import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';
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
    locationId: '',
    customeCPU: '1',
    customeMemory: '2',
    customeDiskSize: '256',
    clusters: [],
    locations: [],
    clusterName: '',
    clusterId: '',
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'App/findLocation',
      payload: {
        successCB: (res) => {
          this.setState({locations: res.data.data, locationId: res.data.data[0].id}),
          this.props.dispatch({
            type: 'App/followCluster',
            payload: {
              data: {
                id: res.data.data[0].id,
              },
              successCB: (res) => {
                this.setState({
                  clusters: res.data.data,
                  clusterId: res.data.data[0].id,
                  clusterName: res.data.data[0].name
                })
              },
            }
          })
        }
      }
    })
    this.setState({
      ...this.props.item,
    })
  }

  resourceSelect = (e) => {
    const {value} = e.target
    if (value === 'height') {
      const obj = {
        cpu: 16,
        memory: (16*1024).toString(),
        diskSize: 1024,
        resource: value,
      }
      const nextState = {
        ...this.state,
        ...obj,
      }
      this.props.onChange(nextState)
      this.setState({
        ...obj,
      })
    }
    if (value === 'middle') {
      const obj = {
        cpu: 8,
        memory: (16*1024).toString(),
        diskSize: 500,
        resource: value,
      }
      const nextState = {
        ...this.state,
        ...obj,
      }
      this.props.onChange(nextState)
      this.setState({
        ...obj,
      })
    }
    if (value === 'low') {
      const obj = {
        cpu: 4,
        memory: (16*1024).toString(),
        diskSize: 256,
        resource: value,
      }
      const nextState = {
        ...this.state,
        ...obj,
      }
      this.props.onChange(nextState)
      this.setState({
        ...obj,
      })
    }
    if (value === 'custome') {
      this.onChange(value, 'resource')
    }
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

  locationChange = (value) => {
    this.props.dispatch({
      type: 'App/followCluster',
      payload: {
        data: {
          id: value,
        },
        successCB: (res) =>  {
          this.setState({clusters: res.data.data, clusterName: res.data.data[0].name, clusterId: res.data.data[0].id})
          this.onChange(res.data.data[0].id, 'clusterId')
        },
      }
    })
    this.onChange(value, 'locationId')
  }

  render() {
    return (
      <main>
        <label htmlFor="">资源所在地：</label>
          <Select value={this.state.locationId} onChange={this.locationChange} style={{width: '200px'}}>
            {this.state.locations.map(l => <Option key={l.id}><Icon type="location" style={{color: '#27ae60'}}/> {l.name}</Option>)}
          </Select>
          <label htmlFor="" style={{marginLeft: '20px'}}>集群：</label>
            <Select value={this.state.clusterId} onChange={value => this.onChange(value, 'clusterId')} style={{width: '200px'}}>
              {this.state.clusters.map(c => <Option key={c.id}><Icon type="cluster" style={{color: '#27ae60'}}/> {c.name}</Option>)}
            </Select>
        <div style={{padding: '10px'}}></div>
        <label htmlFor="">应用资源配置：</label>
        <div style={{padding: '10px'}}></div>
        <RadioGroup name="radiogroup" value={this.state.resource} onChange={this.resourceSelect}>
          <section className={this.state.resource !== 'height' ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value='height'>
              </Radio>
              高配置资源
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               16
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               16G
              </FormItem>
              {/* <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               1024G
              </FormItem> */}
            </Form>
          </section>

          <section className={this.state.resource !== 'middle' ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value='middle'>
              </Radio>
              中配置资源
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               8
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               16G
              </FormItem>
              {/* <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               500G
              </FormItem> */}
            </Form>
          </section>

          <section className={this.state.resource !== 'low' ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value='low'>
              </Radio>
              低配置资源
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               4
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               16G
              </FormItem>
              {/* <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               256G
              </FormItem> */}
            </Form>
          </section>

          <section className={this.state.resource !== 'custome' ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value='custome'>
              </Radio>
              其他配置
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               <Input disabled={this.state.resource !== 'custome'}
                      placeholder="1-16"
                      value={this.state.customeCPU}
                      onChange={e => this.onChange(e.target.value, 'customeCPU')}
                      type="number"
                ></Input>
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               <Input disabled={this.state.resource !== 'custome'}
                      placeholder="2-32"
                      value={this.state.customeMemory}
                      onChange={e => this.onChange(e.target.value, 'customeMemory')}
                      type="number"
                      addonAfter="G"
                ></Input>
              </FormItem>
              {/* <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               <Input disabled={this.state.resource !== 'custome'}
                      placeholder="256-1024"
                      value={this.state.customeDiskSize}
                      onChange={e => this.onChange(e.target.value, 'customeDiskSize')}
                      type="number"
                      addonAfter="G"
                ></Input>
              </FormItem> */}
            </Form>
          </section>
        </RadioGroup>
      </main>
    )
  }
}
