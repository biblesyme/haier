import React from 'react'
import {Card, Row, Col, Progress, Divider} from 'antd'
import { Circle, Line } from 'rc-progress';

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
                <CardGrid style={{width: '20%', height: stateHeight}} className="text-center">
                  {/* <Progress type="dashboard"
                            percent={75}
                            width={85}
                            format={percent => `
                              ${percent}%`}
                  /> */}
                  <div className="ant-progress ant-progress-circle ant-progress-status-normal ant-progress-show-info ant-progress-default">
                    <div className="ant-progress-inner">
                      <Circle percent="45"
                              strokeColor="#389e0d"
                              strokeWidth="6"
                              trailWidth="6"
                              gapPosition="bottom"
                              gapDegree="75"
                              style={{width: '85px'}}
                      />
                      <span className="ant-progress-text">45%</span>
                    </div>
                  </div>
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


                  <div style={{marginTop: '8px'}}>PAAS使用率</div>
                </CardGrid>
                <CardGrid style={{width: '65%', height: stateHeight}} className="text-center">
                  <Row gutter={64}>
                    <Col span={8}>
                      MySQL
                      <Progress type="dashboard"
                                percent={75}
                                width={85}
                                format={percent => `
                                  ${percent}%`}
                                style={{marginLeft: '16px'}}
                      />
                    </Col>
                    <Col span={8}>
                      Redis
                      <Progress type="dashboard"
                                percent={75}
                                width={85}
                                format={percent => `
                                  ${percent}%`}
                                style={{marginLeft: '16px'}}
                      />
                    </Col>
                    <Col span={8}>
                      RabbitMQ
                      <Progress type="dashboard"
                                percent={75}
                                width={85}
                                format={percent => `
                                  ${percent}%`}
                                style={{marginLeft: '16px'}}
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
