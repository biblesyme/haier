import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input, Card, Progress, Checkbox, Tabs, Divider, Tooltip } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import Item from './Item'
import MysqlTabs from './MysqlTabs'
import RedisTabs from './RedisTabs'
import RocketMQTabs from './RocketMQTabs'
import RabitMQTabs from './RabitMQTabs'
import MiddlewareList from './MiddlewareList'
import moment from 'moment'
import unauth from 'utils/unauth'

const FormItem = Form.Item
const CardGrid = Card.Grid
const CheckboxGroup = Checkbox.Group;

import styles from './style.sass'

const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: {span: 16},
  style: {
    marginBottom: '5px'
  }
};

const col = 7

const plainOptions = [{
  label: '前端框架',
  value: 'front',
}, {
  label: '后台框架',
  value: 'back',
}]

class ApplicationDetail extends React.Component {
  state = {
    list: false,
  }
  componentWillMount() {
    const {record={}} = this.props.location
    this.props.selfDispatch({
      type: 'followProjectLink',
      payload: {
        data: record,
        link: 'self',
        successCB: (resource) => this.props.selfDispatch({type: 'findProjectInfo', payload: {scode: resource.scode}}),
        failCB: (e) => unauth(e),
      },
    })
    this.props.selfDispatch({
      type: 'followResourceLink',
      payload: {
        data: record,
        link: 'resources',
      },
    })
    this.props.dispatch({type: 'App/findProject'})
    this.props.dispatch({type: 'App/findResource'})
    this.props.dispatch({type: 'App/findDomain'})
    this.props.dispatch({type: 'App/setState', payload: {list: false}})
  }
  render(){
    const {record={}} = this.props.location
    const {resources=[], projectInfo={}} = this.props.reduxState
    const paas = resources.filter(r => r.resourceType === 'containerHost')[0]
    const middleware = resources.filter(r => r.resourceType !== 'containerHost')
    const {operationManagers=[], businessManagers=[]} = record
    const domain = this.props.App.domains.filter(d => d.id === record.domainId)[0] || {}
    return (
    <div>
      <section className="page-section">
        <label className="label">应用归属：</label>
      <span style={{fontSize: '16px', marginLeft: '10px'}}>海尔</span>
      </section>
      <section className="page-section">
        <Form>
          <Row gutter={24} className="scode-info">
            <Col span={col} style={{width: 300}}>
              <FormItem
                {...formItemLayout}
                label="应用信息"
              >
              </FormItem>
            </Col>
            <Col span={col} style={{width: 300, marginLeft: 145}}>
              <FormItem
                {...formItemLayout}
                label="应用S码"
              >
                {record.scode}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} className="scode-info">
            <Col span={col} style={{width: 300}}>
              <FormItem
                {...formItemLayout}
                label="应用名称"
                hasFeedback
              >
               {projectInfo.name}
              </FormItem>
            </Col>
            <Col span={col} style={{width: 300, marginLeft: 145}}>
              <FormItem
                {...formItemLayout}
                label="申请日期"
                hasFeedback
              >
               {moment(projectInfo.createdAt).format('YYYY[年]MMMDo')}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} className="scode-info">
            <Col span={col} style={{width: 300}}>
              <FormItem
                {...formItemLayout}
                label="业务负责人"
                hasFeedback
              >
              {businessManagers.join('、 ')}
              </FormItem>
            </Col>
            <Col span={col} style={{width: 300, marginLeft: 145}}>
              <FormItem
                {...formItemLayout}
                label="技术负责人"
                hasFeedback
              >
              {operationManagers.join('、 ')}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} className="scode-info">
            <Col span={col} style={{width: 300}}>
              <FormItem
                {...formItemLayout}
                label="归属部门"
                hasFeedback
              >
               {domain.name}
              </FormItem>
            </Col>
            <Col span={col} style={{width: 300, marginLeft: 145}}>
              <FormItem
                {...formItemLayout}
                label="应用属性"
                hasFeedback
              >
               {projectInfo.applicationType}
              </FormItem>
            </Col>
            <Button type="primary" style={{position: 'relative', top: '-132px', left: '260px', width: 112}}>前往监控平台</Button>
          </Row>
        </Form>
      </section>

      {resources.length > 0 && (
        <div>
          {resources.filter(r => r.resourceType === 'containerHost').length > 0 && (
            <section className="page-section">
              <Row gutter={24}>
                <Col key={'paas'}><Item resource={paas} project={record}/></Col>
              </Row>
              <Button type="primary" style={{position: 'relative', top: '-272px', left: '990px', width: 112}}>前往容器云</Button>
            </section>
          )}

          <section className="page-section">
            <Row style={{marginBottom: '20px'}}>
              <Col span={18} style={{fontSize: 16, color: '#000'}}>中间件资源: </Col>
              {this.props.App.role === 'admin' && (
                <Col span={6}>
                  <Row type="flex" justify="end" align="middle">
                    <Col >
                      <Tooltip title="图表视图">
                        <Icon type="appstore" style={this.props.App.list ? {fontSize: '2em', cursor: 'pointer'} : {fontSize: '2em', color: '#005aab', cursor: 'pointer'}}
                                              onClick={() => this.props.dispatch({type: 'App/setState', payload: {list: false}})}
                        />
                      </Tooltip>
                    </Col>
                    <Col style={{marginLeft: 10}}>
                      <Tooltip title="列表视图">
                        <Icon type="bars" style={this.props.App.list ? {fontSize: '2em', color: '#005aab', cursor: 'pointer'} : {fontSize: '2em', cursor: 'pointer'}}
                                          className="mg-l10"
                                          onClick={() => this.props.dispatch({type: 'App/setState', payload: {list: true}})}
                        />
                      </Tooltip>
                    </Col>
                    <Col style={{marginLeft: 30}}><Button type="primary">前往中间件平台</Button></Col>
                  </Row>
                </Col>
              )}
            </Row>
            {!this.props.App.list && (
              <div>
                {middleware.filter(r => r.resourceType === 'mysql').length > 0 && (
                  <div>
                    <MysqlTabs items={middleware.filter(r => r.resourceType === 'mysql')}
                    />
                  </div>
                )}
                {middleware.filter(r => r.resourceType === 'redis').length > 0 && (
                  <div>
                    <RedisTabs items={middleware.filter(r => r.resourceType === 'redis')}
                    />
                  </div>
                )}
                {middleware.filter(r => r.resourceType === 'rocketMQTopic').length > 0 && (
                  <div>
                    <RocketMQTabs items={middleware.filter(r => r.resourceType === 'rocketMQTopic')}
                    />
                  </div>
                )}
                {middleware.filter(r => (r.resourceType === 'rabbitMQConsumer' || r.resourceType === 'rabbitMQProducer')).length > 0 && (
                  <div>
                    <RabitMQTabs items={middleware.filter(r => (r.resourceType === 'rabbitMQConsumer' || r.resourceType === 'rabbitMQProducer'))}
                                 projects={this.props.App.projects}
                                 resources={this.props.App.resources}
                    />
                  </div>
                )}
              </div>
            )}

            {this.props.App.list && (
              <MiddlewareList middlewareMappings={middleware}
              />
            )}
          </section>
        </div>
      )}

      <section className="page-section">
        <label className="label" style={{marginRight: 52}}>框架：</label>
        <CheckboxGroup options={plainOptions} value={record.frame}/>
      </section>
      <section className="page-section">
        <label className="label" style={{marginRight: 29}}>推荐服务</label>
        <Checkbox checked={record.alert}
                  style={{marginRight: 32}}
        >
          监控功能
        </Checkbox>
        <Checkbox checked={record.codeManaged}
        >
          代码托管
        </Checkbox>
      </section>

      <section className="page-section">
        <Row type="flex" justify="end">
          <Col>
            <Button onClick={() => {this.props.history.goBack()}}
                    type="primary"
            >
              返回
            </Button>
          </Col>
        </Row>
      </section>
    </div>
      )
  }
}

Object.defineProperty(ApplicationDetail, "name", { value: "ApplicationDetail" });
export default withRouter(connect(require('./model'), ['App'])(ApplicationDetail))
