import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input, Card, Progress, Checkbox } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import Item from './Item'
import { withRouter } from 'react-router'
import FormMapping from '@/components/FormMapping'
import replace from 'utils/replace'
import New from './New'
import nameMap from 'utils/nameMap'

const FormItem = Form.Item
const CardGrid = Card.Grid
const CheckboxGroup = Checkbox.Group;
const {Option} = Select;

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
  }

  componentWillMount() {
    const {record={}} = this.props.location
    this.props.selfDispatch({
      type: 'followProjectLink',
      payload: {
        data: record,
        link: 'self',
      },
    })
    this.props.selfDispatch({
      type: 'followResourceLink',
      payload: {
        data: record,
        link: 'resources',
      },
    })
    this.props.selfDispatch({type: 'findProject'})
    this.props.selfDispatch({type: 'findResource'})
  }

  render(){
    const {record={}} = this.props.location
    const {resources=[]} = this.props.reduxState
    const projectInfo = (record &&
      record.data &&
      record.data.data
    ) || {}
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
      </section>

      {resources.length > 0 && (
        <div>
          <section className="page-section">
            <Row gutter={24}>
              <Col key={'paas'} span={6}>
                <Item resource={paas}
                      project={record}
                      allProjects={this.props.reduxState.allProjects}
                      allResource={this.props.reduxState.allResource}
                />
              </Col>
            </Row>
          </section>

          <section className="page-section">
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
          </section>
        </div>
      )}


      {/* <section className="page-section">
        <h3>框架</h3>
        <CheckboxGroup options={plainOptions} value={["前端框架"]}/>
      </section>
      <section className="page-section">
        <h3>监控功能</h3>
        <Checkbox checked
        >
          开启
        </Checkbox>
      </section> */}

      <section className="page-section text-center">
        <Button onClick={() => {
                  this.props.selfDispatch({type:'setState',payload: {resources: []}})
                  this.props.history.goBack()}
                }>
          返回
        </Button>
      </section>
    </div>
      )
  }
}

Object.defineProperty(NewResource, "name", { value: "NewResource" });
export default withRouter(connect(require('./model'), ['App'])(NewResource))
