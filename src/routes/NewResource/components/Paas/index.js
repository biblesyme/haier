import React from 'react'
import {Row, Col, Card, Form, Progress, Divider, Icon} from 'antd'
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from 'bizcharts'
import { DataView } from '@antv/data-set';

const CardGrid = Card.Grid
const FormItem = Form.Item
const { Html } = Guide;

import styles from './style.sass'

export default class C extends React.Component {
  render() {
    const chartHeight = 250
    const resouces = [
      { item: '可用', count: 40 },
      { item: '已使用', count: 60 },
    ];
    const resoucesDv = new DataView();
    resoucesDv.source(resouces).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });
    const resoucesScale = {
      percent: {
        formatter: val => {
          val = (val * 100) + '%';
          return val;
        }
      }
    }

    const hosts = [
      { item: '健康', count: 10 },
      { item: '不健康', count: 0 },
    ];
    const hostDv = new DataView();
    hostDv.source(hosts).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });
    const hostScale = {
      percent: {
        formatter: val => {
          val = (val * 100) + '%';
          return val;
        }
      }
    }
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
    return (
      <main>
        <Row gutter={8}  style={{marginTop: '10px'}} >
          <Col span={4}>
            <Card title="高配置资源" style={{height: '250px'}}>
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
            </Card>
          </Col>
          <Col span={10}>

          </Col>
          <Col span={10}>

          </Col>
          <Col span={20}>
            <Card bordered={false} style={{height: '250px'}}>
              <CardGrid style={{width: '34%'}}>
                资源使用率
                <Row>
                  <Col span={12} style={{fontSize: '12px'}}>
                    <div style={{marginTop: '80px'}}>使用: 1024M</div>
                    <div>总共: 10240M</div>
                  </Col>
                  <Col span={12}>
                    <Progress type="dashboard"
                              percent={30}
                              width={120}
                              format={percent => `
                                ${percent}%`}
                    />
                  </Col>
                </Row>
              </CardGrid>
              <CardGrid style={{width: '34%'}}>
                健康实例率
                <Row>
                  <Col span={12} style={{fontSize: '12px'}}>
                    <div style={{marginTop: '80px'}}>健康: 3</div>
                    <div>总共: 10</div>
                  </Col>
                  <Col span={12}>
                    <Progress type="circle"
                              percent={30}
                              width={120}
                              format={percent => `
                                ${percent}%`}
                    />
                  </Col>
                </Row>
              </CardGrid>
            </Card>
          </Col>
        </Row>
      </main>
    )
  }
}
