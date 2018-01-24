import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';
import nameMap from 'utils/nameMap'

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

export default class C extends React.Component {
  state = {
    resource: 'height',
    machineRoomId: 'qd',
  }

  componentWillMount() {
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
    console.log(this.state)
    return (
      <main>
        <label htmlFor="">资源所在地：</label>
          {nameMap[this.state.machineRoomId]}
        <div style={{padding: '10px'}}></div>
        <label htmlFor="">应用资源配置：</label>
        <div style={{padding: '10px'}}></div>
          <section className={styles["card-form"]}>
            <div className={styles["card-header"]}>
              {nameMap[this.state.resource]}
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               {this.state.cpu}
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               {`${parseInt(this.state.memory) / 1024}G`}
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               {`${this.state.diskSize}G`}
              </FormItem>
            </Form>
          </section>
      </main>
    )
  }
}
