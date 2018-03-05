import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input, Card, Progress, Checkbox, Tabs, Divider } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import Item from './Item'
import MysqlTabs from './MysqlTabs'
import RedisTabs from './RedisTabs'
import RocketMQTabs from './RocketMQTabs'
import RabitMQTabs from './RabitMQTabs'

const FormItem = Form.Item
const CardGrid = Card.Grid
const CheckboxGroup = Checkbox.Group;

import styles from './style.sass'

const col = 12
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  style: {
    marginBottom: '10px'
  }
};

const formItemLeft = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 5 },
    push: 4,
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    push: 4,
  },
  style: {
    marginBottom: '10px'
  }
};

const formItemLayout2 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  style: {
    marginBottom: '0'
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

const plainOptions = [{
  label: '前端框架',
  value: 'front',
}, {
  label: '后台框架',
  value: 'back',
}]

class ApplicationDetail extends React.Component {
  componentWillMount() {
    const {record={}} = this.props.location
    this.props.selfDispatch({
      type: 'followProjectLink',
      payload: {
        data: record,
        link: 'self',
        successCB: (resource) => this.props.selfDispatch({type: 'findProjectInfo', payload: {scode: resource.scode}}),
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
        <label>应用归属：海尔</label>
      </section>
      <section className="page-section">
        <label>应用信息:</label>
        <Row gutter={24} className="scode-info">
          <Col span={col} push={12}>
            <FormItem
              {...formItemLayout}
              label="应用S码"
              hasFeedback
            >
             {record.scode}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24} className="scode-info">
          <Col span={col}>
            <FormItem
              {...formItemLeft}
              label="应用名称"
            >
             {record.name}
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="申请日期"
            >
             {new Date(record.createDate * 1000).toLocaleString()}
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLeft}
              label="业务负责人"
              hasFeedback
            >
              {businessManagers.join('、 ')}
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="技术负责人"
              hasFeedback
            >
              {operationManagers.join('、 ')}
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLeft}
              label="归属部门"
              hasFeedback
            >
             {domain.name}
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="应用属性"
              hasFeedback
            >
             {projectInfo.applicationType}
            </FormItem>
          </Col>
        </Row>
        <div className="text-right pd-tb10">
          <Button type="primary">前往监控平台</Button>
        </div>
      </section>

      {resources.length > 0 && (
        <div>
          <section className="page-section">
            <Row gutter={24}>
              <Col key={'paas'}><Item resource={paas} project={record}/></Col>
            </Row>
            <div className="text-right pd-tb10">
              <Button type="primary">前往容器云</Button>
            </div>
          </section>

          <section className="page-section">
            <Row style={{marginBottom: '20px'}}>
              <Col>中间件资源: </Col>
            </Row>
            {middleware.filter(r => r.resourceType === 'mysql').length > 0 && (
              <div>
                <MysqlTabs items={middleware.filter(r => r.resourceType === 'mysql')}
                />
                <Divider></Divider>
              </div>
            )}
            {middleware.filter(r => r.resourceType === 'redis').length > 0 && (
              <div>
                <RedisTabs items={middleware.filter(r => r.resourceType === 'redis')}
                />
                <Divider></Divider>
              </div>
            )}
            {middleware.filter(r => r.resourceType === 'rocketMQTopic').length > 0 && (
              <div>
                <RocketMQTabs items={middleware.filter(r => r.resourceType === 'rocketMQTopic')}
                />
                <Divider></Divider>
              </div>
            )}
            {middleware.filter(r => (r.resourceType === 'rabbitMQConsumer' || r.resourceType === 'rabbitMQProducer')).length > 0 && (
              <div>
                <RabitMQTabs items={middleware.filter(r => (r.resourceType === 'rabbitMQConsumer' || r.resourceType === 'rabbitMQProducer'))}
                             projects={this.props.App.projects}
                             resources={this.props.App.resources}
                />
                <Divider></Divider>
              </div>
            )}

            <div className="text-right pd-tb10">
              <Button type="primary">前往中间件平台</Button>
            </div>
          </section>
        </div>
      )}

      <section className="page-section">
        <h3>框架</h3>
        <CheckboxGroup options={plainOptions} value={record.frame}/>
      </section>
      <section className="page-section">
        <h3>服务</h3>
        <Checkbox checked={record.alert}
        >
          监控功能
        </Checkbox>
        <Checkbox checked={record.codeManaged}
        >
          代码托管
        </Checkbox>
      </section>
      <div style={{paddingBottom: '60px'}}></div>

      <section className="page-section bottom-actions">
        <Button type="primary" style={{float: 'right'}} onClick={() => this.props.history.goBack()}>返回</Button>
      </section>
    </div>
      )
  }
}

Object.defineProperty(ApplicationDetail, "name", { value: "ApplicationDetail" });
export default withRouter(connect(require('./model'), ['App'])(ApplicationDetail))
