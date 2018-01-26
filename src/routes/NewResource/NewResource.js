import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input, Card, Progress, Checkbox } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'
import Redis from './components/Redis'
import MySQL from './components/MySQL'
import Paas from './components/Paas'
import RocketMQProduct from './components/RocketMQProduct'
import RocketMQComsumer from './components/RocketMQComsumer'
import RabbitMQ from './components/RabbitMQ'
import { withRouter } from 'react-router'
import FormMapping from '@/components/FormMapping'
import replace from 'utils/replace'

const FormItem = Form.Item
const CardGrid = Card.Grid
const CheckboxGroup = Checkbox.Group;
const {Option} = Select;

import styles from './style.sass'

const columns = [{
  title: '序号',
  dataIndex: 'key',
}, {
  title: '能力名称',
  dataIndex: 'name',
  sorter: (a, b) => a.name.length - b.name.length,
}, {
  title: '类型',
  dataIndex: 'manager',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.manager.length - b.manager.length,
}, {
  title: '能力介绍',
  dataIndex: 'health',
}, {
  title: '操作',
  dataIndex: 'actions',
  render(text, record, index){
    return (
      <Link to={`/application/${record.key}`}>{text}</Link>
    )
  }
}];

const data = [{
  key: '1',
  name: '大数据',
  manager: '张三',
  health: '50%',
  resourceUsage: '30%',
  middleWareHealth: '75% 80% 60%',
  status: '待部署',
  actions: '查看详情'
}];

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

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class NewResource extends React.Component {
  state = {
    middlewareMappings: [],
    middlewareSelect: 'mysql',
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
        machineRoomId: 'qd',
        deployMode: 'one',
        masterSlaveOption: '1',
        mycatClusterManagerNodeCount: 0,
        mycatClusterDataNodeCount: 0,
        backup: 'false',
      }
    }
    if (value === 'redis') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        machineRoomId: 'qd',
        memorySize: '100',
        clusterType: 'one',
        sharedCount: '0',
      }
    }
    if (value === 'rocketMQTopic') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        machineRoomId: 'qd',
        clusterType: 'standalone',
        topicName: '',
      }
    }
    if (value === 'rabbitMQProducer') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        machineRoomId: 'qd',
        maxIO: '100',
        exchangeName: '',
        exchangeType: 'fanout',
      }
    }
    if (value === 'rabbitMQConsumer') {
      defaultMiddlewareMapping = {
        ...defaultMiddlewareMapping,
        producerApplicationScode: 'S123451',
        exchangeName: 'topic',
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


  render(){
    const {record={}} = this.props.location
    const projectInfo = (record &&
      record.data &&
      record.data.data
    ) || {}
    return (
    <div>
      <section className="page-section">
        <label>应用归属：</label>
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

      <section className="page-section">
        <label>资源所在地: 青岛</label>
        <div style={{padding: '10px'}}></div>
        <label htmlFor="">应用资源：</label>
        <div style={{padding: '10px'}}></div>
      </section>

    <section className="page-section">
      <Row>
        <Col>
          <label htmlFor="">中间件：</label>
          <div style={{padding: '10px'}}></div>
          <Select style={{width: '170px', marginLeft: '20px'}}
                  value={this.state.middlewareSelect}
                  onSelect={middlewareSelect => this.onMiddlewareSelect(middlewareSelect)}
          >
            <Option key="mysql">MySQL</Option>
            <Option key="redis">Redis</Option>
            <Option key="rocketMQTopic">RocketMQ</Option>
            <Option key="rabbitMQProducer">RabbitMQ(生产者)</Option>
            <Option key="rabbitMQConsumer">RabbitMQ(消费者)</Option>
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
        </Col>
      </Row>
    </section>
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
        <CheckboxGroup options={plainOptions} value={["前端框架"]}/>
      </section>
      <section className="page-section">
        <h3>监控功能</h3>
        <Checkbox checked
        >
          开启
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

Object.defineProperty(NewResource, "name", { value: "NewResource" });
export default withRouter(connect(null, ['App'])(NewResource))
