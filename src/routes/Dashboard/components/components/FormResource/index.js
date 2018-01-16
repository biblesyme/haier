import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';

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
    resource: 1,
  }
  render() {
    return (
      <main>
        <RadioGroup name="radiogroup" value={this.state.resource} onChange={e => this.setState({resource: e.target.value})}>
          <section className={this.state.resource !== 1 ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value={1}>
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
              <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               1024G
              </FormItem>
            </Form>
          </section>

          <section className={this.state.resource !== 2 ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value={2}>
              </Radio>
              中配置资源
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
              <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               500G
              </FormItem>
            </Form>
          </section>

          <section className={this.state.resource !== 3 ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value={3}>
              </Radio>
              低配置资源
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
              <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               256G
              </FormItem>
            </Form>
          </section>

          <section className={this.state.resource !==4 ? styles["card-disabled"] : styles["card-form"]}>
            <div className={styles["card-header"]}>
              <Radio value={4}>
              </Radio>
              其他资源
            </div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               <Input disabled={this.state.resource !== 4}
                      placeholder="1-16"
                ></Input>
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               <Input disabled={this.state.resource !== 4}
                      placeholder="2-32"
                ></Input>
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               <Input disabled={this.state.resource !== 4}
                      placeholder="256-1024"
                ></Input>
              </FormItem>
            </Form>
          </section>
        </RadioGroup>
      </main>
    )
  }
}
