import React from 'react'
import {Button, Row, Col, Form, Select, Checkbox, message, Icon} from 'antd'
import { withRouter } from 'react-router'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import Paas from './Paas'
import FormMapping from './FormMapping'
import apiStore from 'utils/apiStore'
import MysqlPanelDetail from './MysqlPanelDetail'
import RedisPanelDetail from './RedisPanelDetail'
import RocketPanelDetail from './RocketPanelDetail'
import RabbitMQProducerPanelDetail from './RabbitMQProducerPanelDetail'
import RabbitMQConsumerPanelDetail from './RabbitMQConsumerPanelDetail'
import moment from 'moment'

import styles from './style.sass'

const col = 12
const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: {span: 16},
  style: {
    marginBottom: '5px'
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

const formItemCenter = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    push: 2
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    push: 0
  },
  style: {
    marginBottom: '10px'
  }
};

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const plainOptions = [{
  label: '前端框架',
  value: 'front',
}, {
  label: '后台框架',
  value: 'back',
}]

class Preview extends React.Component {
  componentWillMount() {
    this.props.selfDispatch({type:'findProject'})
    this.props.selfDispatch({type:'findResource'})
  }
  submit = () => {
    const {form} = this.props.App
    if (!form.scode) {
      message.error('未能获取S码 请返回上一页')
      return
    }
    const {projectInfo} = form
    delete form.paas.clusters
    delete form.paas.locations
    const resoures = [...form.middlewareMappings, form.paas]
    const record = resoures.map(r => {
      if (r.resourceType === 'containerHost') {
        delete r.clusterId
        delete r.clusterName
        return apiStore.createRecord({
          data: JSON.stringify({
            ...r,
            cpu: parseInt(r.cpu),
            memory: parseInt(r.memory*1024),
            // diskSize: parseInt(r.diskSize),
          }),
          version: 1,
          resourceType: 'containerHost',
          type: 'resource',
        })
      }
      if (r.resourceType === 'mysql') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'mysql',
          type: 'resource',
          data: JSON.stringify({
            ...r,
            deployMode: r.deployMode,
            masterSlaveOption: r.masterSlaveOption,
            mycatClusterManagerNodeCount: parseInt(r.mycatClusterManagerNodeCount),
            mycatClusterDataNodeCount: parseInt(r.mycatClusterDataNodeCount),
          })
        })
      }
      if (r.resourceType === 'redis') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'redis',
          type: 'resource',
          data: JSON.stringify({
            ...r,
            sharedCount: parseInt(r.sharedCount),
          })
        })
      }
      if (r.resourceType === 'rocketMQTopic') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'rocketMQTopic',
          type: 'resource',
          data: JSON.stringify({...r})
        })
      }
      if (r.resourceType === 'rabbitMQProducer') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'rabbitMQProducer',
          type: 'resource',
          data: JSON.stringify({
            ...r,
            maxIO: r.maxIO,
          })
        })
      }
      if (r.resourceType === 'rabbitMQConsumer') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'rabbitMQConsumer',
          type: 'resource',
          data: JSON.stringify({...r})
        })
      }
      return r
    })
    this.props.dispatch({
      type: 'App/saveRecord',
      payload: {
        data: {
          ...form,
          type: 'projects',
          resources: record,
        },
        successCB: () => {
          message.success('应用创建成功')
          if (this.props.App.role !== 'admin' && this.props.App.role !== 'domainAdmin' && this.props.App.role !== 'manager') {
            this.props.history.push({pathname: '/'})
          } else if (this.props.App.role === 'admin'){
            this.props.history.push({pathname: '/information'})
          } else if (this.props.App.role === 'domainAdmin') {
            this.props.history.push({pathname: '/applicationCenter'})
          } else if (this.props.App.role === 'manager') {
            this.props.history.push({pathname: '/resourcesRequest/permissionsRequest'})
          }
          this.props.dispatch({
            type: 'App/findApproval',
            payload: {
              account: this.props.App.user,
            }
          })
        },
        failCB: () => {
          message.error('应用创建失败')
        },
      }
    })
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const {history} = this.props
    const {form={}} = this.props.App
    const {projectInfo={}, middlewareMappings=[], domainName='',businessManagers=[], operationManagers=[]} = form
    return (
      <main>
        <section className="page-section">
          <label style={{fontSize: 16}}><span className="label">应用归属：</span>海尔</label>
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
                  {projectInfo.applicationId}
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
                 {form.domainName}
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
            </Row>
          </Form>
        </section>

        <section className="page-section">
          <Paas item={form.paas}></Paas>
        </section>
        <section className="page-section">
          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <label className="label">中间件资源申请:</label>
            </Col>
          </Row>
          {middlewareMappings.length > 0 && (
            <div style={{marginTop: 23}}>
              {middlewareMappings.filter(m => m.resourceType === 'mysql').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="mysql"/> MySQL</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <MysqlPanelDetail middlewareMappings={middlewareMappings}
                      />
                    </div>
                </section>
              )}
              {middlewareMappings.filter(m => m.resourceType === 'redis').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="redis"/> Redis</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RedisPanelDetail middlewareMappings={middlewareMappings}
                      />
                    </div>
                </section>
              )}
              {middlewareMappings.filter(m => m.resourceType === 'rocketMQTopic').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="rocket"/> RocketMQ</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RocketPanelDetail middlewareMappings={middlewareMappings}
                      />
                    </div>
                </section>
              )}
              {middlewareMappings.filter(m => m.resourceType === 'rabbitMQProducer').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="rocket"/> RabbitMQ-生产者</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RabbitMQProducerPanelDetail middlewareMappings={middlewareMappings}
                      />
                    </div>
                </section>
              )}
              {middlewareMappings.filter(m => m.resourceType === 'rabbitMQConsumer').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="rocket"/> RabbitMQ-消费者</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RabbitMQConsumerPanelDetail middlewareMappings={middlewareMappings}
                                                   projects={this.props.reduxState.projects}
                                                   resources={this.props.reduxState.resources}
                      />
                    </div>
                </section>
              )}
            </div>
          )}
        </section>

        <section className="page-section">
          <label className="label" style={{marginRight: 52}}>框架：</label>
          <CheckboxGroup options={plainOptions} value={form.frame}/>
        </section>
        <section className="page-section">
          <label className="label" style={{marginRight: 29}}>推荐服务</label>
          <Checkbox checked={form.alert}
                    style={{marginRight: 32}}
          >
            监控功能
          </Checkbox>
          <Checkbox checked={form.codeManaged}
          >
            代码托管
          </Checkbox>
        </section>

        <section className="page-section">
          <Button type="primary" onClick={this.goBack}>返回修改</Button>
          <Button type="primary" style={{float: 'right'}} onClick={this.submit}>创建</Button>
        </section>
      </main>
    )
  }
}

const WrappedPreview = Form.create()(Preview);
Object.defineProperty(WrappedPreview, "name", { value: "WrappedPreview" });
export default withRouter(connect(require('./model'), ['App'])(WrappedPreview))
