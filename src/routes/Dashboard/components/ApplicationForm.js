import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Spin, message, Tag, Collapse } from 'antd';
import { connect } from 'utils/ecos'
import FormMapping from '@/components/FormMapping'
import FormResource from '@/components/FormResource'
import replace from 'utils/replace'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import axios from 'axios'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'
import Detail from './Detail'
import MysqlPanelDetail from './MysqlPanelDetail'
import RedisPanelDetail from './RedisPanelDetail'
import RocketPanelDetail from './RocketPanelDetail'
import RabbitMQProducerPanelDetail from './RabbitMQProducerPanelDetail'
import RabbitMQConsumerPanelDetail from './RabbitMQConsumerPanelDetail'
import Edit from './Edit'
import NewManager from './NewManager'
import NewOperationManager from './NewOperationManager'
import moment from 'moment'

const CheckboxGroup = Checkbox.Group;
const Panel = Collapse.Panel

const {SubMenu} = Menu;
const {Option} = Select;
const FormItem = Form.Item;
const {Search} = Input

import styles from './style.sass'


const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: {span: 16},
  style: {
    marginBottom: '10px'
  }
};

const formItemCenter = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    xl: {span: 4},
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
  labelCol: { span: 8},
  wrapperCol: {span: 16},
  style: {
    marginBottom: '10px'
  }
};
const formItemEdit = {
  labelCol: { span: 6},
  wrapperCol: {span: 16},
  style: {
    marginBottom: '10px'
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

class ApplicationForm extends React.Component {
  state = {
    checkedList: [],
    middlewareSelect: 'mysql',
    middlewareMappings: [],
    company: 'haier',
    location: 'qd',
    projectInfo: null,
    searching: LOAD_STATUS.INITIAL,
    domainId: '',
    domainName:'',
    paas: {
      locationId: '',
      clusterName: '',
      clusterId: '',
      cpu: (16*1000).toString(),
      memory: (16 * 1024 * 1024).toString(),
      // diskSize: '1024',
      resourceType: 'containerHost',
    },
    frame: [],
    alert: false,
    locations: [],
    codeManaged: false,
    editProjectInfo: false,
    businessManagers: [],
    operationManagers: [],
    mysql: [],
    visibleEdit: false,
    editId: '',
    projectInfoEdit: {},
    visibleAddManager: false,
    visibleAddOperationManager: false,
  }

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: false}})
    this.props.dispatch({type:'NewApplication/findDomain'})
    this.props.dispatch({type:'NewApplication/findProject'})
    this.props.dispatch({type:'NewApplication/findResource'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['1']}})
    this.props.dispatch({type: 'NewApplication/findAccount'})
    this.props.dispatch({
      type: 'App/findLocation',
      payload: {
        successCB: (res) => {
          this.setState({paas:{
            ...this.state.paas,
            locationId: res.data.data[0].id
          }}),
          this.props.dispatch({
            type: 'App/followCluster',
            payload: {
              data: {
                id: res.data.data[0].id,
              },
              successCB: (res) => this.setState({paas: {
                ...this.state.paas,
                clusterId: res.data.data[0].id,
                clusterName: res.data.data[0].name,
              }}),
            }
          })
        }
      }
    })
    if (this.props.history.action === 'POP' && this.props.App.preview) {
      const {form} = this.props.App
      this.setState({
        ...form,
      })
      this.middlewareMappingId = form.middlewareMappingId
    }
  }

  componentDidMount() {
    if (this.props.history.action === 'POP' && this.props.App.preview) {
      const {form} = this.props.App
      this.props.form.setFieldsValue({
        scode: form.scode,
      })
    }
  }

  handleCancel = (e) => {
    this.setState({
      visibleDetail: false,
      visibleEdit: false,
      visibleAddManager: false,
      visibleAddOperationManager: false,
    });
  }

  handleOK = (e) => {
    console.log(e, 'poi')
    this.setState({
      middlewareMappings: [...this.state.middlewareMappings, {...e, id: this.middlewareMappingId++,}],
      visibleDetail: false,
    })
  }

  handleEditOK = (data) => {
    const {middlewareMappings} = this.state
    const nextAry = replace(middlewareMappings, data)
    this.setState({
      visibleEdit: false,
      middlewareMappings: nextAry
    })
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  middlewareMappingId = 0
  addMiddlewareMapping = (value) => {
    let defaultMiddlewareMapping = {
      id: this.middlewareMappingId++,
      resourceType: value,
    }
    if (value === 'mysql') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        deployMode: '0',
        masterSlaveOption: '0',
        mycatClusterManagerNodeCount: 0,
        mycatClusterDataNodeCount: 0,
        backup: 'false',
      }
    }
    if (value === 'redis') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        memorySize: '100',
        clusterType: 'one',
        sharedCount: '0',
      }
    }
    if (value === 'rocketMQTopic') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        clusterType: 'standalone',
        topicName: '',
      }
    }
    if (value === 'rabbitMQProducer') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        maxIO: '100',
        exchangeName: '',
        exchangeType: 'fanout',
      }
    }
    if (value === 'rabbitMQConsumer') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        queueName: '',
        topicName: '',
        RouteKey: '',
      }
    }
    const {middlewareMappings} = this.state
    this.setState({middlewareMappings: [...middlewareMappings, defaultMiddlewareMapping]})
  }

  addMysqlMapping = (item) => {
    let defaultMiddlewareMapping = {
      id: this.middlewareMappingId++,
      deployMode: '0',
      masterSlaveOption: '0',
      mycatClusterManagerNodeCount: 0,
      mycatClusterDataNodeCount: 0,
      backup: 'false',
    }
    const {mysql} = this.state
    this.setState({mysql: [...mysql, defaultMiddlewareMapping]})
  }
  mysqlMappingChange = (newItem) => {
    const {mysql} = this.state
    const nextAry = replace(mysql, newItem)
    this.setState({mysql: nextAry})
  }

  removeMiddlewareMapping = (id) => {
    const {middlewareMappings} = this.state
    const filtered = middlewareMappings.filter(item => item.id !== id)
    this.setState({middlewareMappings: filtered})
  }

  middlewareMappingChange = (newItem) => {
    const {middlewareMappings} = this.state
    const nextAry = replace(middlewareMappings, newItem)
    this.setState({middlewareMappings: nextAry})
  }

  onMiddlewareSelect = (middlewareSelect) => {
    this.setState({middlewareSelect})
    this.addMiddlewareMapping(middlewareSelect)
  }

  preview = () => {
    if (this.state.searching !== LOAD_STATUS.SUCCESS) {
      message.warning('S码未验证')
      return
    }
    if (this.state.domainId === ''){
      message.warning('请选择应用所属领域')
      return
    }
    let formatPaas = this.state.paas
    if (this.state.paas.resource === 'custome') {
      formatPaas = {
        ...this.state.paas,
        cpu: this.state.paas.customeCPU * 1000,
        memory: (this.state.paas.customeMemory * 1024 * 1024).toString(),
        // diskSize: this.state.paas.customeDiskSize,
        resourceType: 'containerHost',
      }
    }
    this.props.form.validateFields((err, values) => {
      const form = {
        ...this.state,
        scode: values.scode,
        paas: formatPaas,
        middlewareMappingId: this.middlewareMappingId,
        name: this.state.projectInfo.name
      }
      this.props.dispatch({type:'App/setState', payload: {form, preview: true}})
      this.props.history.push({pathname: '/preview'})
    })
  }

  reset = () => {
    this.setState({
      company: 'haier',
      location: (this.props.App.locations[0] && this.props.App.locations[0].id) || '',
      middlewareMappings: [],
      projectInfo: {},
      searching: LOAD_STATUS.INITIAL,
      codeManaged: '',
      alert: '',
      frame: [],
      paas: {
        locationId: '',
        clusterName: '',
        clusterId: '',
        cpu: (16*1000).toString(),
        memory: (16 * 1024 * 1024).toString(),
        // diskSize: '1024',
        resourceType: 'containerHost',
        resource: 'height',
      },

    })
    this.props.form.setFieldsValue({scode: ''})
  }

  searchSCODE = (value) => {
    if (this.state.searching !== LOAD_STATUS.START) {
      this.setState({searching: LOAD_STATUS.START})
      axios.get(`/v1/query/projects/${value}`)
        .then((res) => {
          if (res.status === 401) {
            // this.setState({})
          }
          console.log(res, 'res')
          const {domains} = this.props.NewApplication
          this.setState({
            projectInfo: res.data.data,
            projectInfoEdit: {
              ...res.data.data,
              businessManagers: [res.data.data.ownerUser,],
              operationManagers: [],
            },
            searching: LOAD_STATUS.SUCCESS,
            businessManagers: [res.data.data.ownerUser,],
          })
          domains.forEach(element => {
            if(element.name === res.data.data.businessDomain){
              this.setState({domainId:element.id,domainName:element.name})
            }
          });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.setState({projectInfo: null, searching: '401'})
            return
          }
          this.setState({projectInfo: null, searching: LOAD_STATUS.FAIL})
        })
    }
  }

  paasChange = (paas) => {
    this.setState({paas})
  }

  saveProjectInfo = () => {
    const {domains} = this.props.NewApplication
    let domainFilter = domains.filter(d => d.id === this.state.projectInfoEdit.domainId)[0] || {}
    this.setState({
      editProjectInfo: false,
      domainId: domainFilter.id,
      domainName: domainFilter.name,
      operationManagers: this.state.projectInfoEdit.operationManagers || [],
      businessManagers: this.state.projectInfoEdit.businessManagers || [],
    })
  }

  render() {
    const { projectInfo } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {domains=[], accounts=[]} = this.props.NewApplication
    return (
      <div className="page-wrap">
        <section className="page-section">
          <label><span className="label">应用归属：</span>海尔</label>
        </section>
        <section className="page-section">
          <Form>
            <Row gutter={24} className="scode-info">
            <Col span={12} style={{width: 500}}>
              <FormItem
                {...formItemCenter}
                label="S码验证"
              >
               {getFieldDecorator('scode', {
                  rules: [{ required: true, message: "请输入S码" }],
                })(
                  <Search placeholder="输入应用S码"
                          enterButton="验证"
                          onSearch={value => this.searchSCODE(value)}
                          style={{width: 394}}/>
                )}
              </FormItem>
            </Col>
          </Row>
            {this.state.searching === LOAD_STATUS.START && <div className="text-center"><Icon type="loading" style={{ fontSize: 24 }} spin /></div>}
            {(this.state.searching === LOAD_STATUS.FAIL) && (
               <div className="text-center">S码不存在</div>
            )}
            {(this.state.searching === '401') && (
               <div className="text-center">token失效 请重新登录</div>
            )}
            {(this.state.searching === LOAD_STATUS.SUCCESS && !this.state.editProjectInfo) && (
              <div>
                <Row gutter={24} className="scode-info">
                  <Col span={col} style={{width: 300}}>
                    <FormItem
                      {...formItemLeft}
                      label="应用名称"
                      hasFeedback
                    >
                     {projectInfo.name}
                    </FormItem>
                  </Col>
                  <Col span={col} style={{width: 300}}>
                    <FormItem
                      {...formItemLayout}
                      label="申请日期"
                      hasFeedback
                    >
                     {moment(projectInfo.createdAt).format('YYYY[年]MMMDo')}
                    </FormItem>
                  </Col>
                  <Col style={{display: 'flex', alignItems: 'center', height: 39}}>
                    <span className="cursor" onClick={(e) => this.setState({editProjectInfo: true})}>
                      <Icon type="edit" style={{marginRight: 6}}/>修改
                    </span>
                  </Col>
                </Row>
                <Row gutter={24} className="scode-info">
                  <Col span={col} style={{width: 300}}>
                    <FormItem
                      {...formItemLeft}
                      label="业务负责人"
                      hasFeedback
                    >
                    {this.state.businessManagers.join('、 ')}
                    </FormItem>
                  </Col>
                  <Col span={col} style={{width: 300}}>
                    <FormItem
                      {...formItemLayout}
                      label="技术负责人"
                      hasFeedback
                    >
                    {this.state.operationManagers.join('、 ')}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24} className="scode-info">
                  <Col span={col} style={{width: 300}}>
                    <FormItem
                      {...formItemLeft}
                      label="归属部门"
                      hasFeedback
                    >
                     {this.state.domainName}
                    </FormItem>
                  </Col>
                  <Col span={col} style={{width: 300}}>
                    <FormItem
                      {...formItemLayout}
                      label="应用属性"
                      hasFeedback
                    >
                     {projectInfo.applicationType}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            )}
            {this.state.editProjectInfo && (
              <div>
                <Row gutter={24} className="scode-info">
                  <Col span={col} style={{width: 410}}>
                    <FormItem
                      {...formItemEdit}
                      label="应用名称"
                      hasFeedback
                    >
                     {projectInfo.name}
                    </FormItem>
                  </Col>
                  <Col span={col} style={{width: 410}}>
                    <FormItem
                      {...formItemEdit}
                      label="申请日期"
                      hasFeedback
                    >
                     {moment(projectInfo.createdAt).format('YYYY[年]MMMDo')}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24} className="scode-info">
                  <Col span={col} style={{width: 410}}>
                    <FormItem
                      {...formItemEdit}
                      label="业务负责人"
                      hasFeedback
                    >
                     <Row>
                       <Col>
                         {this.state.projectInfoEdit.businessManagers.map((m, index) => {
                           return (
                             <Tag key={index}
                                  closable
                                  onClose={() => this.state.projectInfoEdit.businessManagers.splice(index, 1)}
                             >{m}</Tag>)
                         })}
                         <Tag onClick={() => this.setState({visibleAddManager: true})}>添加 <Icon type="plus" /></Tag>
                       </Col>
                     </Row>
                    </FormItem>
                  </Col>
                  <Col span={col} style={{width: 410}}>
                    <FormItem
                      {...formItemEdit}
                      label="技术负责人"
                      hasFeedback
                    >
                      <Row>
                        <Col>
                          {this.state.projectInfoEdit.operationManagers.map((m, index) => {
                            return (
                              <Tag key={index}
                                   closable
                                   onClose={() => this.state.projectInfoEdit.operationManagers.splice(index, 1)}
                              >{m}</Tag>)
                          })}
                          <Tag onClick={() => this.setState({visibleAddOperationManager: true})}>添加 <Icon type="plus" /></Tag>
                        </Col>
                      </Row>
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}  className="scode-info">
                  <Col span={col} style={{width: 410}}>
                    <FormItem
                      {...formItemEdit}
                      label="归属部门"
                      hasFeedback
                    >
                     <Select value={this.state.projectInfoEdit.domainId}
                             onChange={domainId => this.setState({projectInfoEdit: {...this.state.projectInfoEdit, domainId}})}>
                       {domains.map(d => <Option key={d.id}><Icon type="area" style={{color: '#27ae60'}}/> {d.name}</Option>)}
                     </Select>
                    </FormItem>
                  </Col>
                  <Col span={col} style={{width: 410}}>
                    <FormItem
                      {...formItemEdit}
                      label="应用属性"
                      hasFeedback
                    >
                     {projectInfo.applicationType}
                    </FormItem>
                  </Col>
                </Row>
                <div style={{marginTop: '20px', marginLeft: 92}}>
                  <Button type="primary" onClick={(e) => this.saveProjectInfo()}>保存</Button>
                  <Button style={{marginLeft: '20px'}} onClick={(e) => this.setState({editProjectInfo: false})}>取消</Button>
                </div>
              </div>
            )}
          </Form>
        </section>

        <section className="page-section">
          <FormResource onChange={this.paasChange} item={this.state.paas}/>
        </section>

        <section className="page-section">
          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <label className="label">中间件资源申请:</label>
            </Col>
            <Col>
              <Button onClick={e => this.setState({visibleDetail: true})}
                      type="primary">
                <Icon type="plus" /> 添加
              </Button>
            </Col>
          </Row>
          {this.state.middlewareMappings.length > 0 && (
            <div style={{marginTop: 23}}>
              {this.state.middlewareMappings.filter(m => m.resourceType === 'mysql').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="mysql"/> MySQL</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <MysqlPanelDetail middlewareMappings={this.state.middlewareMappings}
                                   removeMiddlewareMapping={this.removeMiddlewareMapping}
                                   onEdit={editId => this.setState({visibleEdit: true, editId})}
                      />
                    </div>
                </section>
              )}
              {this.state.middlewareMappings.filter(m => m.resourceType === 'redis').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="redis"/> Redis</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RedisPanelDetail middlewareMappings={this.state.middlewareMappings}
                                        removeMiddlewareMapping={this.removeMiddlewareMapping}
                                        onEdit={editId => this.setState({visibleEdit: true, editId})}
                      />
                    </div>
                </section>
              )}
              {this.state.middlewareMappings.filter(m => m.resourceType === 'rocketMQTopic').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="rocket"/> RocketMQ</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RocketPanelDetail middlewareMappings={this.state.middlewareMappings}
                                         removeMiddlewareMapping={this.removeMiddlewareMapping}
                                         onEdit={editId => this.setState({visibleEdit: true, editId})}
                      />
                    </div>
                </section>
              )}
              {this.state.middlewareMappings.filter(m => m.resourceType === 'rabbitMQProducer').length > 0 && (
                <section className={styles["card-form-m"]}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="rocket"/> RabbitMQ-生产者</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RabbitMQProducerPanelDetail middlewareMappings={this.state.middlewareMappings}
                                                   removeMiddlewareMapping={this.removeMiddlewareMapping}
                                                   onEdit={editId => this.setState({visibleEdit: true, editId})}
                      />
                    </div>
                </section>
              )}
              {this.state.middlewareMappings.filter(m => m.resourceType === 'rabbitMQConsumer').length > 0 && (
                <section className={styles["card-form-m"]} style={{marginLeft: 20, marginRight: 20}}>
                  <div className={styles["card-header"]}>
                    <div><Icon type="rocket"/> RabbitMQ-消费者</div>
                  </div>
                    <div style={{height: '280px', overflowY: 'auto'}}>
                      <RabbitMQConsumerPanelDetail middlewareMappings={this.state.middlewareMappings}
                                                   removeMiddlewareMapping={this.removeMiddlewareMapping}
                                                   projects={this.props.NewApplication.projects}
                                                   resources={this.props.NewApplication.resources}
                                                   onEdit={editId => this.setState({visibleEdit: true, editId})}
                      />
                    </div>
                </section>
              )}
            </div>
          )}
        </section>

        <section className="page-section">
          <label className="label" style={{marginRight: 52}}>选择框架</label>
          <CheckboxGroup options={plainOptions} value={this.state.frame} onChange={frame => this.setState({frame})}/>
        </section>
        <section className="page-section">
          <label className="label" style={{marginRight: 52}}>推荐服务</label>
          <Checkbox checked={this.state.alert}
                    onChange={e => this.setState({alert: e.target.checked})}
                    style={{marginRight: 32}}
          >
            监控功能
          </Checkbox>
          <Checkbox checked={this.state.codeManaged}
                    onChange={e => this.setState({codeManaged: e.target.checked})}
          >
            代码托管
          </Checkbox>
        </section>

        <section className="page-section" style={{paddingBottom: 22, paddingTop: 22}}>
          <Row type="flex" justify="end">
            <Col>
              <Button onClick={this.reset} type="primary" style={{width: 83}}>重置</Button>
              <Button type="primary" icon="eye" style={{marginLeft: 10, width: 83}} onClick={this.preview}>预览</Button>
            </Col>
          </Row>
        </section>

        {this.state.visibleDetail && (
          <Detail
                  visible={this.state.visibleDetail}
                  onCancel={this.handleCancel}
                  onOk={this.handleOK}
                  projects={this.props.NewApplication.projects}
                  resources={this.props.NewApplication.resources}
            />
        )}
        {this.state.visibleEdit && (
          <Edit visible={this.state.visibleEdit}
                onCancel={this.handleCancel}
                onOk={this.handleEditOK}
                projects={this.props.NewApplication.projects}
                resources={this.props.NewApplication.resources}
                editId={this.state.editId}
                middlewareMappings={this.state.middlewareMappings}
            />
        )}
        {this.state.visibleAddManager && (
          <NewManager
            visible={this.state.visibleAddManager}
            onOk={(newData) => {
              this.setState({
                projectInfoEdit: {
                  ...this.state.projectInfoEdit,
                  businessManagers: [...this.state.projectInfoEdit.businessManagers, newData],
                },
                visibleAddManager: false,
              })
            }}
            onCancel={this.handleCancel}
            accounts={accounts}
            />
        )}
        {this.state.visibleAddOperationManager && (
          <NewOperationManager
            visible={this.state.visibleAddOperationManager}
            onOk={(newData) => {
              this.setState({
                projectInfoEdit: {
                  ...this.state.projectInfoEdit,
                  operationManagers: [...this.state.projectInfoEdit.operationManagers, newData],
                },
                visibleAddOperationManager: false,
              })
            }}
            onCancel={this.handleCancel}
            accounts={accounts}
            />
        )}
      </div>
    );
  }
}

const WrappedApp = Form.create()(ApplicationForm);
Object.defineProperty(WrappedApp, "name", { value: "WrappedApp" });
export default withRouter(connect(null, ['App', 'NewApplication'])(WrappedApp))
