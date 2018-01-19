import React from 'react'
import {Card, Row, Col, Progress, Divider} from 'antd'
import { Circle, Line } from 'rc-progress';
import MyProgress from '@/components/MyProgress'

const CardGrid = Card.Grid

const stateHeight = '168px'

class C extends React.Component {
  render() {
    return (
      <div className="page-wrap">
        <section className="page-section">
          <Row>
            <Col>
              <Card bordered={false}>
                <CardGrid style={{width: '15%', height: stateHeight}} className="text-center">
                  <div style={{fontSize: '4em', color: '#389e0d'}}>64</div>
                  <div>项目总数</div>
                </CardGrid>
                <CardGrid style={{width: '15%', height: stateHeight}} className="text-center">
                  {/* <Progress type="dashboard"
                            percent={75}
                            width={85}
                            format={percent => `
                              ${percent}%`}
                  /> */}
                  {/* <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info ant-progress-default">
                    <div style={{marginTop: '30px'}}>
                      <Line percent="45"
                            strokeWidth="15"
                            trailWidth="15"
                            strokeColor="#389e0d"
                            strokeLinecap="butt"
                      />
                      <span className="ant-progress-text">45%</span>
                    </div>
                  </div> */}
                  <MyProgress percent="45"
                              width="85px"
                  />
                  <div style={{marginTop: '8px'}}>PAAS使用率</div>
                </CardGrid>
                <CardGrid style={{width: '70%', height: stateHeight}} className="text-center">
                  <Row gutter={64}>
                    <Col span={8}>
                      <span style={{marginRight: '24px'}}>MySQL</span>
                      <MyProgress percent="75"
                                  width="85px"

                      />
                    </Col>
                    <Col span={8}>
                      <span style={{marginRight: '24px'}}>Redis</span>
                      <MyProgress percent="30"
                                  width="85px"
                      />
                    </Col>
                    <Col span={8}>
                      <span style={{marginRight: '24px'}}>RabbitMQ</span>         
                      <MyProgress percent="90"
                                  width="85px"
                      />
                    </Col>
                  </Row>
                  <div style={{marginTop: '16px'}}>中间件使用率(共享资源)</div>
                </CardGrid>
              </Card>
            </Col>
          </Row>
        </section>
      </div>
    )
  }
}

export default C
