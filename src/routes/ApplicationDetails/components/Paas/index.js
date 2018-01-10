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
            <Card title="容器云PaaS" style={{height: '350px'}}>
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
          <Col span={10}>

          </Col>
          <Col span={10}>

          </Col>
          <Col span={20}>
            <Card bordered={false}>
              <CardGrid style={{width: '50%'}}>
                <Chart height={chartHeight} data={resoucesDv} scale={resoucesScale} forceFit>
                  <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
                  <Axis name="percent" />
                  <Legend position='right' offsetY={-chartHeight / 2 + 120} offsetX={-100}/>
                  <Tooltip
                    showTitle={false}
                    itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                    />
                  <Guide >
                    <Html position ={[ '50%', '50%' ]} html='<div style="color:#000;font-size:1.16em;text-align: center;width: 10em;">资源<br />使用率</span></div>' alignX='middle' alignY='middle'/>
                  </Guide>
                  <Geom
                    type="intervalStack"
                    position="percent"
                    color='item'
                    tooltip={['item*percent',(item, percent) => {
                      percent = percent * 100 + '%';
                      return {
                        name: item,
                        value: percent
                      };
                    }]}
                    style={{lineWidth: 1,stroke: '#fff'}}
                    >
                  </Geom>
                </Chart>
              </CardGrid>
              <CardGrid style={{width: '50%'}}>
                <Chart height={chartHeight} data={hostDv} scale={hostScale} forceFit>
                  <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
                  <Axis name="percent" />
                  <Legend position='right' offsetY={-chartHeight / 2 + 120} offsetX={-100}/>
                  <Tooltip
                    showTitle={false}
                    itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                    />
                  <Guide >
                    <Html position ={[ '50%', '50%' ]} html='<div style="color:#8c8c8c;font-size:1em;text-align: center;width: 10em;">实例<br><span style="color:#262626;font-size:1.2em">10</span></div>' alignX='middle' alignY='middle'/>
                  </Guide>
                  <Geom
                    type="intervalStack"
                    position="percent"
                    color='item'
                    tooltip={['item*percent',(item, percent) => {
                      percent = percent * 100 + '%';
                      return {
                        name: item,
                        value: percent
                      };
                    }]}
                    style={{lineWidth: 1,stroke: '#fff'}}
                    >
                  </Geom>
                </Chart>
              </CardGrid>
            </Card>
          </Col>
        </Row>
        <Divider dashed></Divider>
      </main>
    )
  }
}