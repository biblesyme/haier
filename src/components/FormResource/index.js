import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, InputNumber, Divider } from 'antd';
import { connect } from 'utils/ecos'
import unauth from 'utils/unauth'

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

import styles from './style.sass'

const formItemLayout3 = {
  labelCol: {span: 4, style: {width: '90px'}},
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
        push: 0,

  },
  style: {
    padding: '0px 20px',
    marginBottom: '0px',
  }
}

@connect(null,['App'])
export default class C extends React.Component {
  state = {
    resource: 'height',
    locationId: '',
    customeCPU: 1,
    customeMemory: 2,
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
                  // clusterId: res.data.data[0].id,
                  // clusterName: res.data.data[0].name
                })
              },
              failCB: (e) => unauth(e),
            }
          })
        },
        failCB: (e) => unauth(e),
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
        cpu: 16*1000,
        memory: (16*1024*1024).toString(),
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
        cpu: 8*1000,
        memory: (16*1024*1024).toString(),
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
        cpu: 4*1000,
        memory: (16*1024*1024).toString(),
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
        failCB: (e) => unauth(e),
      }
    })
    this.onChange(value, 'locationId')
  }

  render() {
    return (
      <main>
        <label className="label">资源所在地：</label>
          <Select value={this.state.locationId} onChange={this.locationChange} style={{width: '161px', marginLeft: 10}}>
            {this.state.locations.map(l => <Option key={l.id}>{l.name}</Option>)}
          </Select>
        <div style={{padding: '10px'}}></div>
        <label className="label">应用资源配置：</label>
        <div style={{padding: '15px'}}></div>
        <RadioGroup name="radiogroup" value={this.state.resource} onChange={this.resourceSelect}>
          <section className={this.state.resource !== 'height' ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value='height'>
              </Radio>
              <span>高配置资源</span>
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               16
              </FormItem>
              <Divider style={{margin: '0px 0px'}}></Divider>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               16G
              </FormItem>
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
              <Divider style={{margin: '0px 0px'}}></Divider>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               16G
              </FormItem>
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
              <Divider style={{margin: '0px 0px'}}></Divider>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               16G
              </FormItem>
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
                wrapperCol={{span: 13}}
              >
                <InputNumber onChange={value => this.onChange(value, 'customeCPU')}
                             min={0}
                             value={this.state.customeCPU}
                             disabled={this.state.resource !== 'custome'}
                             style={{marginRight: 10}}
                />
              </FormItem>
              <Divider style={{margin: '0px 0px'}}></Divider>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
                <InputNumber onChange={value => this.onChange(value, 'customeMemory')}
                             min={0}
                             value={this.state.customeMemory}
                             disabled={this.state.resource !== 'custome'}
                             style={{width: '70%'}}
                />
                <span>G</span>
              </FormItem>
            </Form>
          </section>
        </RadioGroup>
      </main>
    )
  }
}
