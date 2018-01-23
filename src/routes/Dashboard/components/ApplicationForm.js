import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox, Spin } from 'antd';
import { connect } from 'utils/ecos'
import FormMapping from './components/FormMapping'
import FormResource from './components/FormResource'
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
const col = 12
const plainOptions = ['前端框架', '后台框架']

class ApplicationForm extends React.Component {
  state = {
    size: 'haier',
    size2: 'qd',
    checkedList: [],
    middlewareSelect: 'MySQL',
    middlewareMappings: [],
    company: 'haier',
    location: 'qd',
    projectInfo: null,
    searching: LOAD_STATUS.INITIAL,
    domainId: '',
  }

  componentWillMount() {
    this.addMiddlewareMapping('MySQL')
    this.props.dispatch({type:'NewApplication/findDomain'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['1']}})
    // if(this.props.form) {
    //   console.log('poi')
    // }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  addMiddleware = () => {
    console.log(this.state.middlewareSelect)
  }

  middlewareMappingId = 0
  addMiddlewareMapping = (value) => {
    const defaultMiddlewareMapping = {
      ip: null,
      id: this.middlewareMappingId++,
      type: value,
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

  preview = () => {
    this.props.form.validateFields((err, values) => {
      const form = {
        company: this.state.company,
        projectInfo: this.state.projectInfo,
        domainId: this.state.domainId,
        name: this.state.projectInfo.name,
        scode: values.scode,
      }
      this.props.dispatch({type:'App/setState', payload: {form}})
      this.props.history.push({pathname: '/preview'})
    })
  }

  reset = () => {
    this.setState({
      company: 'haier',
      location: 'qd',
    })
  }

  searchSCODE = (value) => {
    if (this.state.searching !== LOAD_STATUS.START) {
      this.setState({searching: LOAD_STATUS.START})
      axios.get(`/v1/query/projects/${value}`)
        .then((res) => this.setState({projectInfo: res.data.data, searching: LOAD_STATUS.SUCCESS, domainId: res.data.data.businessDomainId}))
        .catch((err) => this.setState({projectInfo: null, searching: LOAD_STATUS.FAIL}))
    }
  }

  render() {
    const { projectInfo } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {domains} = this.props.NewApplication
    console.log(domains)

    return (
      <div className="page-wrap">
        <section className="page-section">
          <label>应用归属：</label>
          <Radio.Group value={this.state.company} onChange={e=> this.setState({company: e.target.value})}>
            <Radio.Button value="haier">海尔</Radio.Button>
            <Radio.Button value="nohaier">非海尔</Radio.Button>
          </Radio.Group>
        </section>
        <section className="page-section">
          <Form>
            <Row gutter={24}>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label="S码验证"
                hasFeedback
              >
               {getFieldDecorator('scode', {
                  rules: [{ required: true, message: "请输入应用S码" }],
                })(
                  <Search placeholder="请输入应用S码" enterButton onSearch={value => this.searchSCODE(value)}/>
                )}
              </FormItem>
            </Col>
          </Row>
            {this.state.searching === LOAD_STATUS.START && <div className="text-center"><Icon type="loading" style={{ fontSize: 24 }} spin /></div>}
            {(this.state.searching === LOAD_STATUS.FAIL) && (
               <div className="text-center">S码不存在</div>
            )}
            {this.state.searching === LOAD_STATUS.SUCCESS && (
            <Row gutter={24}>
              <Col span={col}>
                <FormItem
                  {...formItemLayout}
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
                  {...formItemLayout}
                  label="业务负责人"
                  hasFeedback
                >
                {projectInfo.ownerUser}
                </FormItem>
              </Col>
              <Col span={col}>

                <FormItem
                  {...formItemLayout}
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
                  {...formItemLayout}
                  label="应用领域"
                  hasFeedback
                >
                 <Select value={this.state.domainId} onChange={domainId => this.setState({domainId})}>
                   {domains.map(d => <Option key={d.id}>{d.name}</Option>)}
                 </Select>
                </FormItem>
              </Col>
            </Row>
            )}


            {/* <Row gutter={24}>
              <Col span={24} style={{textAlign: 'right'}}>
                <FormItem
                  {...formItemLayout2}
                  hasFeedback
                >
                  <Button>修改</Button>
                </FormItem>
              </Col>
            </Row> */}
          </Form>
        </section>

        <section className="page-section">
          <label htmlFor="">资源所在地：</label>
            <Select value={this.state.location} onChange={location => this.setState({location})} style={{width: '200px'}}>
              <Option key="qd">青岛</Option>
              <Option key="bj">北京</Option>
            </Select>
          <div style={{padding: '10px'}}></div>
          <label htmlFor="">应用资源配置：</label>
          <div style={{padding: '10px'}}></div>
          <FormResource></FormResource>
        </section>

        <section className="page-section">
          <h3>中间件申请</h3>
          <div style={{padding: '10px'}}></div>
          <label htmlFor="">添加中间件：</label>
          <Select style={{width: '170px', marginLeft: '20px'}}
                  value={this.state.middlewareSelect}
                  onSelect={middlewareSelect => this.onMiddlewareSelect(middlewareSelect)}
          >
            <Option key="MySQL">MySQL</Option>
            <Option key="Redis">Redis</Option>
            <Option key="RocketMQ">RocketMQ</Option>
            <Option key="RabbitMQP">RabbitMQ(生产者)</Option>
            <Option key="RabbitMQC">RabbitMQ(消费者)</Option>
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
                  />
              )
            })}
          </Row>


        </section>

        <section className="page-section">
          <h3>选择框架</h3>
          <CheckboxGroup options={plainOptions} />
        </section>
        <section className="page-section">
          <h3>监控功能</h3>
          <Checkbox
          >
            开启
          </Checkbox>
        </section>
        <div style={{paddingBottom: '60px'}}></div>

        <section className="page-section bottom-actions">
          <Button type="primary" onClick={this.reset}>重置</Button>
          <Button type="primary" icon="eye" style={{float: 'right'}} onClick={this.preview}>预览</Button>
        </section>
      </div>
    );
  }
}

const WrappedApp = Form.create()(ApplicationForm);
Object.defineProperty(WrappedApp, "name", { value: "WrappedApp" });
export default withRouter(connect(null, ['App', 'NewApplication'])(WrappedApp))
