import React from 'react'
import {Row, Col, Card, Form, Progress, Divider, Icon, Table} from 'antd'

const CardGrid = Card.Grid
const FormItem = Form.Item

import styles from './style.sass'

export default class C extends React.Component {
  render() {
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
    const columns = [{
      title: '应用名',
      dataIndex: 'state',
      key: 'state',
      render: (state, record) => {
        return (
          <div>
            <Tag {...getState(record.state)}>
              {nameMap[state]}
            </Tag>
          </div>
        )
      }
    }, {
      title: '已消费消息数量',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '消息堆积数',
      dataIndex: 'rule',
      key: 'rule',
    }, {
      title: '平均延时时间',
      dataIndex: 'endPoint',
      key: 'endPoint',
    }, {
      title: '死信数',
      dataIndex: 'startsAt',
      key: 'startsAt',
    },];
    return (
      <main>
        <Row gutter={8}  style={{marginTop: '10px'}} >
          <Col span={4}>
            <Card title="RocketMQ" style={{ height: '200px'}}>
              <Form>
                <FormItem
                  {...formItemLayout4}
                  label="地点"
                  hasFeedback
                >
                 青岛
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="资源"
                  hasFeedback
                >
                  共享资源
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="配置"
                  hasFeedback
                >
                 单例
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={20}>
            <Card bordered={false} height={300}>
              <CardGrid style={{width: '80%'}}>
                <Table
                  // dataSource={boxes}
                  columns={columns}
                  rowKey="id"
                />
              </CardGrid>
              <CardGrid style={{width: '20%', height: '168px'}}>
                消息总数
                <div style={{fontSize: '64px', textAlign: 'right'}}>
                  999
                </div>
              </CardGrid>
            </Card>
          </Col>
        </Row>
        <Divider dashed></Divider>
      </main>
    )
  }
}