import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Card } from 'antd';

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
    consumeMode: 'cluster',
    exchangeType: 'fanout',
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

    const formInputLayout = {
      labelCol: {xs: { span: 10 }, sm: { span: 10 }, pull: 0},
      wrapperCol: {xs: { span: 14 }, sm: { span: 14 }, push: 0},
      style: {marginBottom: '10px'},
    }

    return (
      <main>
        {item.type === 'MySQL' && (
          <Col span={7} offset={1}>
            <Card title="MySQL" style={{height: '290px'}}>
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
                    <Radio.Button value="one">单机</Radio.Button>
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
                  <div>
                    <FormItem
                      {...formInputLayout}
                      label="管理节点数量"
                      hasFeedback
                    >
                     <Input placeholder="请输入管理节点数量"></Input>
                    </FormItem>
                    <FormItem
                      {...formInputLayout}
                      label="数据节点数量"
                      hasFeedback
                    >
                     <Input placeholder="请输入数据节点数量"></Input>
                    </FormItem>
                  </div>
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
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.type === 'Redis' && (
          <Col span={7} offset={1}>
            <Card title="Redis" style={{height: '290px'}}>
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
                  label="内存"
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
                  label="部署模式"
                  hasFeedback
                >
                 <Radio.Group value={this.state.mode} onChange={e => this.setState({mode: e.target.value})}>
                  <Radio.Button value="one">单例</Radio.Button>
                  <Radio.Button value="cluster">集群</Radio.Button>
                 </Radio.Group>
                </FormItem>
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.type === 'RocketMQ' && (
          <Col span={7} offset={1}>
            <Card title="RocketMQ" style={{height: '290px'}}>
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
                  label="集群类型"
                  hasFeedback
                >
                 <Radio.Group value={this.state.consumeMode} onChange={e => this.setState({consumeMode: e.target.value})}>
                    <Radio.Button value="standalone">单机</Radio.Button>
                    <Radio.Button value="cluster">集群</Radio.Button>
                  </Radio.Group>
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="主题名称"
                  hasFeedback
                >
                 <Input placeholder="请输入主题名称"></Input>
                </FormItem>
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.type === 'RabbitMQP' && (
          <Col span={7} offset={1}>
            <Card title="RabbitMQ" style={{height: '290px'}}>
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
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  style = {{marginBottom: '10px'}}
                  label="最大消息吞吐量"
                  hasFeedback
                >
                 <Input placeholder="请输入" type="number"></Input>
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  label="Exchange名称"
                  hasFeedback
                  style = {{marginBottom: '10px'}}
                >
                 <Input placeholder="请输入Exchange名称"></Input>
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  style = {{marginBottom: '10px'}}
                  label="Exchange类型"
                  hasFeedback
                >
                  <Radio.Group value={this.state.exchangeType} onChange={e => this.setState({exchangeType: e.target.value})}>
                     <Radio.Button value="fanout">广播</Radio.Button>
                     <Radio.Button value="topic">主题</Radio.Button>
                     <Radio.Button value="direct">直连</Radio.Button>
                   </Radio.Group>
                </FormItem>
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}

        {item.type === 'RabbitMQC' && (
          <Col span={7} offset={1}>
            <Card title="RabbitMQ" style={{height: '290px'}}>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formInputLayout}
                  label="应用"
                  hasFeedback
                >
                 <Select placeholder="请选择应用"></Select>
                </FormItem>
                <FormItem
                  labelCol={{xs: { span: 10 }, sm: { span: 10 }, pull: 0}}
                  wrapperCol={{xs: { span: 14 }, sm: { span: 14 }, push: 0}}
                  label="Exchange名称"
                  hasFeedback
                  style = {{marginBottom: '10px'}}
                >
                 <Select placeholder="请选择Exchange名称"></Select>
                </FormItem>
                <FormItem
                  {...formInputLayout}
                  label="队列名"
                >
                 <Input placeholder="请填写队列名称" />
                </FormItem>
                {/* https://github.com/biblesyme/haier/issues/10 */}
              </Form>
            </Card>
            <Button style={{width: '100%', marginTop: '2px', marginBottom: '20px'}} onClick={() => onRemove()}><Icon type="delete" /></Button>
          </Col>
        )}
      </main>

    )
  }
}
