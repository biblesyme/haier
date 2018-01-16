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
              <CardGrid style={{width: '25%'}}>
                {/* <Chart height={chartHeight} data={resoucesDv} scale={resoucesScale} forceFit>
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
                </Chart> */}
                资源使用率
                <div style={{textAlign: 'right'}}>
                  <Progress type="dashboard"
                            percent={30}
                            width={120}
                            format={percent => `
                              ${percent}%`}
                            style={{marginLeft: '20px'}}
                  />
                </div>
              </CardGrid>
              <CardGrid style={{width: '25%'}}>
                {/* <Chart height={chartHeight} data={hostDv} scale={hostScale} forceFit>
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
                </Chart> */}
                健康实例率
                <div style={{textAlign: 'right'}}>
                  <Progress type="circle"
                            percent={30}
                            width={120}
                            format={percent => `
                              ${percent}%`}
                            style={{marginLeft: '20px'}}
                  />
                </div>
              </CardGrid>

            </Card>
          </Col>
        </Row>
      </main>
    )
  }
}
