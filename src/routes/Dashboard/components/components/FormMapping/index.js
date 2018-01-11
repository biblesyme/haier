import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;

import styles from './style.sass'

export default class C extends React.Component {
  state = {
    size: 'haier',
    location: 'qd',
    checkedList: [],
    mode: 'one',
    servant: '1',
    isBackup: 'true',
  }

  render() {
    const {onChange, item, onRemove} = this.props
    const { size, size2 } = this.state;
    const formItemLayout4 = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        pull: 0,
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
        push: 0
      },
      style: {
        marginBottom: '10px'
      }
    }

    return (
      <main>
        {item.type === 'MySQL' && (
          <div>
            <section className={`${styles["card-form"]} ${styles["width-260"]}`}>
              <div className={styles["card-header"]}>MYSQL</div>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formItemLayout4}
                  label="地点"
                  hasFeedback
                >
                 <Radio.Group value={this.state.location} onChange={e => this.setState({location: e.target.value})}>
                  <Radio.Button value="qd">青岛</Radio.Button>
                  <Radio.Button value="bj">北京</Radio.Button>
                </Radio.Group>
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="部署模式"
                  hasFeedback
                >
                 <Radio.Group value={this.state.mode} onChange={e => this.setState({mode: e.target.value})}>
                    <Radio.Button value="one">单例</Radio.Button>
                    <Radio.Button value="primary">主从</Radio.Button>
                    <Radio.Button value="cluster">集群</Radio.Button>
                  </Radio.Group>
                </FormItem>

                {this.state.mode === 'primary' && (
                  <FormItem
                    {...formItemLayout4}
                    label="主从"
                    hasFeedback
                  >
                   <Radio.Group value={this.state.servant} onChange={e => this.setState({servant: e.target.value})}>
                      <Radio.Button value="1">一主一从</Radio.Button>
                      <Radio.Button value="2">一主两从</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                )}

                {this.state.mode === 'cluster' && (
                  <FormItem
                    {...formItemLayout4}
                    label="集群"
                    hasFeedback
                  >
                   <Input placeholder="请输入集群名"></Input>
                  </FormItem>
                )}

                <FormItem
                  {...formItemLayout4}
                  label="备份"
                  hasFeedback
                >
                  <Radio.Group value={this.state.isBackup} onChange={e => this.setState({isBackup: e.target.value})}>
                    <Radio.Button value="true">是</Radio.Button>
                    <Radio.Button value="false">否</Radio.Button>
                  </Radio.Group>
                </FormItem>
              </Form>
            </section>
            <br/>
            <section className={`${styles["card-form"]} ${styles["width-260"]}`}
                     style={{marginTop: '2px', marginBottom: '20px'}}
            >
              <Button style={{width: '100%'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
            </section>
          </div>
        )}

        {item.type === 'Redis' && (
          <div>
            <section className={`${styles["card-form"]} ${styles["width-260"]}`}>
              <div className={styles["card-header"]}>Redis</div>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formItemLayout4}
                  label="地点"
                  hasFeedback
                >
                 <Radio.Group value={size}>
                  <Radio.Button value="haier">青岛</Radio.Button>
                  <Radio.Button value="nohaier">北京</Radio.Button>
                </Radio.Group>
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="资源"
                  hasFeedback
                >
                 <Radio.Group value={size}>
                  <Radio.Button value="haier">高</Radio.Button>
                  <Radio.Button value="nohaier">中</Radio.Button>
                  <Radio.Button value="nohaier">低</Radio.Button>
                </Radio.Group>
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="分片"
                  hasFeedback
                >
                 1024G
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="备份"
                  hasFeedback
                >
                  <Radio.Group value={size} onChange={e => this.setState({size: e.target.value})}>
                    <Radio.Button value="haier">是</Radio.Button>
                    <Radio.Button value="nohaier">否</Radio.Button>
                  </Radio.Group>
                </FormItem>
              </Form>
            </section>
            <br/>
            <section className={`${styles["card-form"]} ${styles["width-260"]}`}
                     style={{marginTop: '2px', marginBottom: '20px'}}
            >
              <Button style={{width: '100%'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
            </section>
          </div>
        )}
      </main>

    )
  }
}
