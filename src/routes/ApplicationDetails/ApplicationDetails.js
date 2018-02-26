import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input, Card, Progress, Checkbox } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import { withRouter } from 'react-router'
import Item from './Item'

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
  }
  render(){
    const {record={}} = this.props.location
    const {resources=[], projectInfo={}} = this.props.reduxState
    const paas = resources.filter(r => r.resourceType === 'containerHost')[0]
    const middleware = resources.filter(r => r.resourceType !== 'containerHost')
    return (
    <div>
      <section className="page-section">
        <label>应用归属：海尔</label>
      </section>
      <section className="page-section">
        <label>应用信息:</label>
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
              {...formItemLeft}
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
              {projectInfo.businessDomain}
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
              <Col key={'paas'} span={6}><Item resource={paas} project={record}/></Col>
            </Row>
            <div className="text-right pd-tb10">
              <Button type="primary">前往容器云</Button>
            </div>
          </section>

          <section className="page-section">
            <Row gutter={24}>
              {middleware.map(m => (
                <Col key={m.id} span={6}>
                  <Item resource={m}
                        project={record}
                        projects={this.props.App.projects}
                        resources={this.props.App.resources}
                  />
                </Col>
              ))}
            </Row>
            <div className="text-right pd-tb10">
              <Button type="primary">前往中间件平台</Button>
            </div>
          </section>
        </div>
      )}

      {/* <section className="page-section">
        <label>资源所在地: 青岛</label>
        <div style={{padding: '10px'}}></div>
        <label htmlFor="">应用资源：</label>
        <div style={{padding: '10px'}}></div>
        <Paas></Paas>

      </section> */}

    {/* <section className="page-section">
      <Row>
        <Col>
          <label htmlFor="">中间件：</label>
          <div style={{padding: '10px'}}></div>
        </Col>

        <Redis></Redis>
        <MySQL></MySQL>
        <RocketMQComsumer></RocketMQComsumer>
        <RabbitMQ></RabbitMQ>
        <br/>
        <Col span={24}>

        </Col>
      </Row>
    </section> */}
      {/* <div className="page-section">
        <h3>已选框架</h3>
        <Table pagination={false} columns={columns} dataSource={data} onChange={onChange} />
      </div>
      <div className="page-section">
        <h3>已选能力<span className="pull-right mg-l10">已使用能力：2个</span> <span className="pull-right">已发布能力：3个</span></h3>
        <Table pagination={false} columns={columns} dataSource={data} onChange={onChange} />
        <div className="text-right pd-tb10">
          <Button type="primary">前往能力开放平台</Button>
        </div>
      </div> */}
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
