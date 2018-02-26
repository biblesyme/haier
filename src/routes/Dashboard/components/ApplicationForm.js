import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Spin, message } from 'antd';
import { connect } from 'utils/ecos'
import FormMapping from '@/components/FormMapping'
import FormResource from '@/components/FormResource'
import replace from 'utils/replace'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import axios from 'axios'
import LOAD_STATUS from 'utils/LOAD_STATUS_ENUMS'

const CheckboxGroup = Checkbox.Group;

const {SubMenu} = Menu;
const {Option} = Select;
const FormItem = Form.Item;
const {Search} = Input

import styles from './style.sass'


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

const formItemCenter = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    push: 1
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    push: 1
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
const col = 12
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
    codeManaged: '',
  }

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: false}})
    this.addMiddlewareMapping('mysql')
    this.props.dispatch({type:'NewApplication/findDomain'})
    this.props.dispatch({type:'NewApplication/findProject'})
    this.props.dispatch({type:'NewApplication/findResource'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['1']}})
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
      this.searchSCODE(form.scode)
    }
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

  onDomainSelect = (domainId) =>{
    const {domains} = this.props.NewApplication
    domains.forEach(domain =>{
      if(domain.id === domainId){
        this.setState({domainId:domain.id,domainName:domain.name})
      }
    })
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
      middlewareMappings: [{
        locationId: 'qd',
        deployMode: '0',
        masterSlaveOption: '0',
        mycatClusterManagerNodeCount: 0,
        mycatClusterDataNodeCount: 0,
        backup: 'false',
        id: this.middlewareMappingId++,
        resourceType: 'mysql',
      }],
      projectInfo: {},
      searching: LOAD_STATUS.INITIAL,
      codeManaged: '',
      alert: '',
      frame: [],
    })
    this.props.form.setFieldsValue({scode: ''})
  }

  searchSCODE = (value) => {
    if (this.state.searching !== LOAD_STATUS.START) {
      this.setState({searching: LOAD_STATUS.START})
      axios.get(`/v1/query/projects/${value}`)
        .then((res) => {
          const {domains} = this.props.NewApplication
          this.setState({projectInfo: res.data.data, searching: LOAD_STATUS.SUCCESS})
          domains.forEach(element => {
            if(element.name === res.data.data.businessDomain){
              this.setState({domainId:element.id,domainName:element.name})
            }
          });
        })
        .catch((err) => this.setState({projectInfo: null, searching: LOAD_STATUS.FAIL}))
    }
  }

  paasChange = (paas) => {
    this.setState({paas})
  }

  render() {
    const { projectInfo } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {domains} = this.props.NewApplication
    return (
      <div className="page-wrap">
        <section className="page-section">
          <label>应用归属：海尔</label>
        </section>
        <section className="page-section">
          <Form>
            <Row gutter={24}>
            <Col span={24}>
              <FormItem
                {...formItemCenter}
                label="S码验证"
                hasFeedback
              >
               {getFieldDecorator('scode', {
                  rules: [{ required: true, message: "请输入S码" }],
                })(
                  <Search placeholder="输入应用S码" enterButton="验证" onSearch={value => this.searchSCODE(value)}/>
                )}
              </FormItem>
            </Col>
          </Row>
            {this.state.searching === LOAD_STATUS.START && <div className="text-center"><Icon type="loading" style={{ fontSize: 24 }} spin /></div>}
            {(this.state.searching === LOAD_STATUS.FAIL) && (
               <div className="text-center">S码不存在</div>
            )}
            {this.state.searching === LOAD_STATUS.SUCCESS && (
            <Row gutter={24}  className="scode-info">
              <Col span={col}>
                <FormItem
                  {...formItemLeft}
                  label="应用名称"
                  hasFeedback
                >
                 {projectInfo.name}
                </FormItem>
              </Col>
              <Col span={col}>
                <FormItem
                  {...formItemLayout}
                  label="申请日期"
                  hasFeedback
                >
                 {new Date(projectInfo.createdAt).toLocaleString()}
                </FormItem>
              </Col>
              <Col span={col}>
                <FormItem
                  {...formItemLeft}
                  label="业务负责人"
                  hasFeedback
                >
                {projectInfo.ownerUser}
                </FormItem>
              </Col>
              <Col span={col}>
                <FormItem
                  {...formItemLayout}
                  label="技术负责人"
                  hasFeedback
                >
                {}
                </FormItem>
              </Col>
              <Col span={col}>

                <FormItem
                  {...formItemLeft}
                  label="归属部门"
                  hasFeedback
                >
                 {projectInfo.ownerUserDp}
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
              <Col span={col}>
                <FormItem
                  {...formItemLeft}
                  label="应用领域"
                  hasFeedback
                >
                 <Select value={this.state.domainId} onChange={domainId => this.onDomainSelect(domainId)}>
                   {domains.map(d => <Option key={d.id}><Icon type="area" style={{color: '#27ae60'}}/> {d.name}</Option>)}
                 </Select>
                </FormItem>
              </Col>
            </Row>
            )}
          </Form>
        </section>

        <section className="page-section">
          <FormResource onChange={this.paasChange} item={this.state.paas}/>
        </section>

        <section className="page-section">
          <h3>中间件申请</h3>
          <div style={{padding: '10px'}}></div>
          <label htmlFor="">添加中间件：</label>
          <Select style={{width: '170px', marginLeft: '20px'}}
                  value={this.state.middlewareSelect}
                  onSelect={middlewareSelect => this.onMiddlewareSelect(middlewareSelect)}
          >
            <Option key="mysql"><Icon type="mysql" style={{color: '#27ae60'}}/> MySQL</Option>
            <Option key="redis"><Icon type="redis" style={{color: '#27ae60'}}/> Redis</Option>
            <Option key="rocketMQTopic"><Icon type="rocket" style={{color: '#27ae60'}}/> RocketMQ</Option>
            <Option key="rabbitMQProducer"><Icon type="RabbitMQ" style={{color: '#27ae60'}}/> RabbitMQ(生产者)</Option>
            <Option key="rabbitMQConsumer"><Icon type="RabbitMQ" style={{color: '#27ae60'}}/> RabbitMQ(消费者)</Option>
          </Select>
          <div style={{padding: '10px'}}></div>
          <label htmlFor="">推荐中间件：</label>
          <div style={{padding: '10px'}}></div>

          <Row>
            {this.state.middlewareMappings.map(item => {
              return (
                <FormMapping
                  onChange={(item) => this.middlewareMappingChange(item)}
                  onRemove={() => this.removeMiddlewareMapping(item.id)}
                  key={item.id}
                  item={item}
                  projects={this.props.NewApplication.projects}
                  resources={this.props.NewApplication.resources}
                  />
              )
            })}
          </Row>


        </section>

        <section className="page-section">
          <h3>选择框架</h3>
          <CheckboxGroup options={plainOptions} value={this.state.frame} onChange={frame => this.setState({frame})}/>
        </section>
        <section className="page-section">
          <h3>推荐服务</h3>
          <Checkbox checked={this.state.alert}
                    onChange={e => this.setState({alert: e.target.checked})}
          >
            监控功能
          </Checkbox>
          <Checkbox checked={this.state.codeManaged}
                    onChange={e => this.setState({codeManaged: e.target.checked})}
          >
            代码托管
          </Checkbox>
        </section>
        <div style={{paddingBottom: '60px'}}></div>

        <section className="page-section bottom-actions">
          <Button onClick={this.reset}>重置</Button>
          <Button type="primary" icon="eye" style={{float: 'right'}} onClick={this.preview}>预览</Button>
        </section>
      </div>
    );
  }
}

const WrappedApp = Form.create()(ApplicationForm);
Object.defineProperty(WrappedApp, "name", { value: "WrappedApp" });
export default withRouter(connect(null, ['App', 'NewApplication'])(WrappedApp))
