import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input, Card, Progress, Checkbox, message, Radio, Divider} from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import Item from './Item'
import { withRouter } from 'react-router'
import FormMapping from '@/components/FormMapping'
import replace from 'utils/replace'
import New from './New'
import Edit from './Edit'
import nameMap from 'utils/nameMap'
import MysqlPanelDetail from './MysqlPanelDetail'
import RedisPanelDetail from './RedisPanelDetail'
import RocketPanelDetail from './RocketPanelDetail'
import RabbitMQProducerPanelDetail from './RabbitMQProducerPanelDetail'
import RabbitMQConsumerPanelDetail from './RabbitMQConsumerPanelDetail'


const FormItem = Form.Item
const CardGrid = Card.Grid
const CheckboxGroup = Checkbox.Group;
const {Option} = Select;
// const TabPane = Tabs.TabPane

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

const plainOptions = ['前端框架', '后台框架']

class NewResource extends React.Component {
  state = {
    middlewareMappings: [],
    middlewareSelect: 'mysql',
    visibleEdit: false,
    editId: '',
    paas: {
      cpu: null,
      memory: null,
      isChange: null,
    },
    frame: [],
    alert: null,
    codeManaged: null,
    followResourceStatus: 'init',
  }

  componentWillMount() {
    const {record={}} = this.props.location
    this.setState({
      frame: record.frame || [],
      alert: record.alert,
      codeManaged: record.codeManaged,
    })
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
        successCB: (middlewareMappings) => this.setState({middlewareMappings, followResourceStatus: 'success'})
      },
    })
    this.props.selfDispatch({type: 'findProject'})
    this.props.selfDispatch({type: 'findResource'})
  }

  handleCancel = (e) => {
    this.setState({
      visibleEdit: false,
    });
  }

  handleEditOK = (data) => {
    const {record={}} = this.props.location
    const {resource={}} = this.props
    this.props.dispatch({
      type: 'App/doSelfAction',
      payload: {
        data: {
          data: JSON.stringify(data),
          projectId: record.id,
          id: resource.id,
          resourceType: data.resourceType,
          // resourceTypeId: '1',
          version: data.version,
          // state: 'pending',
        },
        successCB: () => {
          message.success('资源申请成功')
          this.props.dispatch({
            type: 'NewResource/followResourceLink',
            payload: {
              data: record,
              link: 'resources',
            }
          })
          this.setState({
            visibleEdit: false,
          })
        },
        failCB: () => {
          message.error('资源申请失败')
        },
        action: 'applyResource',
        findRecord: {
          id: record.id,
          type: 'project',
        }
      }
   })
  }

  submit = () => {
    console.log(this.state)
    let submitResources = []
    if (this.state.paas.isChange === 'true') {
      submitResources = [...submitResources, this.state.paas]
    }
    console.log(submitResources)
  }

  onPaasChange = (state) => {
    this.setState({
      paas: {
        ...this.state.paas,
        cpu: state.cpu,
        memory: state.memory,
        isChange: state.paasChange,
      }
    })
  }

  indexId = 0
  addMiddlewareMapping = (newData) => {
    let newMiddleware = {
      data: newData,
      _data: newData,
      resourceType: newData.resourceType,
      flag: 'new',
      id: 'new' + this.indexId++,
    }
    this.setState({middlewareMappings: [...this.state.middlewareMappings, newMiddleware]})
  }

  middlewareMappingChange = (newItem) => {
    const {middlewareMappings} = this.state
    const nextAry = replace(middlewareMappings, newItem)
    this.setState({middlewareMappings: nextAry})
  }

  render(){
    const {record={}} = this.props.location
    const {frame=[]} = record
    const {resources=[], projectInfo={}} = this.props.reduxState
    const paas = resources.filter(r => r.resourceType === 'containerHost')[0]
    const middleware = resources.filter(r => r.resourceType !== 'containerHost')
    const {operationManagers=[], businessManagers=[]} = record
    const domain = this.props.App.domains.filter(d => d.id === record.domainId)[0] || {}
    console.log(this.state.middlewareMappings)
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
      </section>

      {resources.length > 0 && (
        <div>
          <section className="page-section">
            <p>当前应用资源配置:</p>
            <Item resource={paas}
                  project={record}
                  allProjects={this.props.reduxState.allProjects}
                  allResource={this.props.reduxState.allResource}
                  key={'paas'}
                  onChange={state => this.onPaasChange(state)}
            />
          </section>

          {/* <section className="page-section">
            <Row gutter={24}>
              {middleware.map(m => (
                <Col key={m.id} span={6}><Item resource={m} project={record}/></Col>
              ))}
              <Col span={6}>
                <New project={record}
                     allProjects={this.props.reduxState.allProjects}
                     allResource={this.props.reduxState.allResource}
                />
              </Col>
            </Row>
          </section> */}

          <section className="page-section">
            <Row>
              <Col>
                <New project={record}
                     allProjects={this.props.reduxState.allProjects}
                     allResource={this.props.reduxState.allResource}
                     onOk={(newData) => this.addMiddlewareMapping(newData)}
                />
                <div style={{padding: '10px'}}></div>
              </Col>
              {(this.state.followResourceStatus === 'success' && this.state.middlewareMappings.filter(m => m.resourceType === 'mysql').length > 0)
                && (
                <MysqlPanelDetail middlewareMappings={this.state.middlewareMappings}
                                  onChange={(item) => this.middlewareMappingChange(item)}
                />
              )}
              {(this.state.followResourceStatus === 'success' && this.state.middlewareMappings.filter(m => m.resourceType === 'redis').length > 0)
                && (
                  <RedisPanelDetail middlewareMappings={this.state.middlewareMappings}
                                    onChange={(item) => this.middlewareMappingChange(item)}
                  />
              )}
              {(this.state.followResourceStatus === 'success' && this.state.middlewareMappings.filter(m => m.resourceType !== 'mysql' && m.resourceType !== 'redis' && m.resourceType !== 'containerHost').length > 0)
                && (
                  <RocketPanelDetail middlewareMappings={this.state.middlewareMappings}
                                     onChange={(item) => this.middlewareMappingChange(item)}
                  />
              )}

              {/*

              <section className={styles["card-form"]} style={{width: '400px', height: '300px'}}>
                <div className={styles["card-header"]}>
                  <div><Icon type="rocket"/> RocketMQ</div>
                </div>
                  <div style={{height: '280px', overflowY: 'auto'}}>
                    <RocketPanelDetail middlewareMappings={middleware}
                                       onEdit={editId => this.setState({visibleEdit: true, editId})}
                    />
                  </div>
              </section>

              <section className={styles["card-form"]} style={{width: '400px', height: '300px'}}>
                <div className={styles["card-header"]}>
                  <div><Icon type="rocket"/> RabbitMQ-生产者</div>
                </div>
                  <div style={{height: '280px', overflowY: 'auto'}}>
                    <RabbitMQProducerPanelDetail middlewareMappings={middleware}
                                                 onEdit={editId => this.setState({visibleEdit: true, editId})}
                    />
                  </div>
              </section>

              <section className={styles["card-form"]} style={{width: '400px', height: '300px'}}>
                <div className={styles["card-header"]}>
                  <div><Icon type="rocket"/> RabbitMQ-消费者</div>
                </div>
                  <div style={{height: '280px', overflowY: 'auto'}}>
                    <RabbitMQConsumerPanelDetail middlewareMappings={middleware}
                                                 projects={this.props.reduxState.projects || []}
                                                 resources={this.props.reduxState.resources}
                                                 onEdit={editId => this.setState({visibleEdit: true, editId})}
                    />
                  </div>
              </section> */}
              <Col span={24}>
              </Col>
            </Row>
          </section>
        </div>
      )}

      <section className="page-section">
        <Row>
          <Col>
            已选框架:
            {frame.map(f => <span key={f} style={{marginLeft: 42}}>{f === 'front' ? '前端框架' : '后台框架'}</span>)}
          </Col>
        </Row>
        <Divider></Divider>
        <Row>
          <Col>
            变更框架:
            <CheckboxGroup options={plainOptions}
                           value={this.state.frame}
                           onChange={frame => this.setState({frame})}
                           style={{marginLeft: 20}}
            />
          </Col>
        </Row>
      </section>
      <section className="page-section">
        <Row>
          <Col>
            已选服务:
            {record.alert && (
              <span style={{marginLeft: 42}}>监控功能</span>
            )}
            {record.codeManaged && (
              <span style={{marginLeft: 42}}>代码托管</span>
            )}
          </Col>
        </Row>
        <Divider></Divider>
        <Row>
          <Col>
            变更服务:
            <Checkbox checked={this.state.alert}
                      onChange={e => this.setState({alert: e.target.checked})}
                      style={{marginLeft: 20}}
            >
              监控功能
            </Checkbox>
            <Checkbox checked={this.state.codeManaged}
                      onChange={e => this.setState({codeManaged: e.target.checked})}
            >
              代码托管
            </Checkbox>
          </Col>
        </Row>
      </section>

      <section className="page-section">
        <Button onClick={() => {
                  this.props.history.goBack()
        }}>
          取消
        </Button>
        <Button type="primary" style={{float: 'right'}}
                onClick={() => this.submit()}
        >
          提交申请
        </Button>
      </section>

      {this.state.visibleEdit && (
        <Edit visible={this.state.visibleEdit}
              onCancel={this.handleCancel}
              onOk={this.handleEditOK}
              projects={this.props.reduxState.allProjects}
              resources={this.props.reduxState.allResource}
              editId={this.state.editId}
              middlewareMappings={middleware}
          />
      )}
    </div>
      )
  }
}

Object.defineProperty(NewResource, "name", { value: "NewResource" });
export default withRouter(connect(require('./model'), ['App'])(NewResource))
