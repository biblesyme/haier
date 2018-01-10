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
            <Card title="Redis" style={{ height: '200px'}}>
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
            <Card bordered={false}>
              <CardGrid style={{width: '25%'}}>
                <Progress type="dashboard"
                          percent={75}
                          width={120}
                          format={percent => `内存使用
                            ${percent}%`}
                />
              </CardGrid>
              <CardGrid style={{width: '25%'}}>
                <Progress type="circle"
                          percent={30}
                          width={120}
                          format={percent => `命中率
                            ${percent}%`}
                          style={{marginLeft: '20px'}}
                />
              </CardGrid>
              <CardGrid style={{width: '25%', height: '168px'}}>
                日慢查询数量
                <div style={{fontSize: '64px', textAlign: 'right'}}>
                  2334
                </div>
              </CardGrid>
              <CardGrid style={{width: '25%', height: '168px'}}>
                当前连接数
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