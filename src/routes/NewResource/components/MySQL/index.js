import React from 'react'
import {Row, Col, Card, Form, Progress, Divider, Icon} from 'antd'

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
    return (
      <main>
        <Row gutter={8}  style={{marginTop: '10px'}} >
          <Col span={4}>
            <Card title="MySQL" style={{height: '230px'}}>
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
                  label="配置"
                  hasFeedback
                >
                  中
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="分片"
                  hasFeedback
                >
                 50片
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="备份"
                  hasFeedback
                >
                 是
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col span={20}>
            <Card bordered={false}>
              <CardGrid style={{width: '20%', height: '168px'}}>
                日慢查询数量
                <div style={{fontSize: '64px', textAlign: 'right'}}>
                  2334
                </div>
              </CardGrid>
              <CardGrid style={{width: '20%', height: '168px'}}>
                当前连接数
                <div style={{fontSize: '64px', textAlign: 'right'}}>
                  999
                </div>
              </CardGrid>
              <CardGrid style={{width: '20%', height: '168px'}}>
                运行的线程个数
                <div style={{fontSize: '64px', textAlign: 'right'}}>
                  10
                </div>
              </CardGrid>
              <CardGrid style={{width: '20%', height: '168px'}}>
                实例大小
                <div  style={{fontSize: '16px', marginTop: '5px'}}>
                  <Row type="flex" justify="space-between">
                    <Col span={12}>cpu:</Col>
                    <Col span={6}>2</Col>
                  </Row>
                  <Row type="flex" justify="space-between">
                    <Col span={12}>内存:</Col>
                    <Col span={6}>1024M</Col>
                  </Row>
                  <Row type="flex" justify="space-between">
                    <Col span={12}>硬盘:</Col>
                    <Col span={6}>2G</Col>
                  </Row>
                </div>
              </CardGrid>
              <CardGrid style={{width: '20%', height: '168px'}}>
                锁定数量
                <div style={{fontSize: '64px', textAlign: 'right'}}>
                  6
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
