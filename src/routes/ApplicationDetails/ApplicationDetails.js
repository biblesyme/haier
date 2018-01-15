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

const FormItem = Form.Item
const CardGrid = Card.Grid
const CheckboxGroup = Checkbox.Group;

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

const plainOptions = ['前端框架', '后台框架']

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class Application extends React.Component {
  render(){
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
    // 数据源
    const data = [
      { genre: 'Sports', sold: 275, income: 2300 },
      { genre: 'Strategy', sold: 115, income: 667 },
      { genre: 'Action', sold: 120, income: 982 },
      { genre: 'Shooter', sold: 350, income: 5271 },
      { genre: 'Other', sold: 150, income: 3710 }
    ];

    // 定义度量
    const cols = {
      sold: { alias: '销售量' },
      genre: { alias: '游戏种类' }
    };
    return (
    <div>
      <section className="page-section">
        <label>应用归属：海尔</label>
      </section>
      <section className="page-section">
        <label>应用信息:</label>
        <Row gutter={24}>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="应用名称"
              hasFeedback
            >
             海尔690大数据平台规划
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="申请日期"
              hasFeedback
            >
             2017年11月5日
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="业务负责人"
              hasFeedback
            >
             张三、王五
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="技术负责人"
              hasFeedback
            >
             李四
            </FormItem>
          </Col>
          <Col span={col}>

            <FormItem
              {...formItemLayout}
              label="归属部门"
              hasFeedback
            >
             大数据部
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="应用属性"
              hasFeedback
            >
             自开发
            </FormItem>
          </Col>
          <Col span={col}>
            <FormItem
              {...formItemLayout}
              label="应用领域"
              hasFeedback
            >
             供应链
            </FormItem>
          </Col>
        </Row>
        <div className="text-right pd-tb10">
          <Button type="primary">前往监控平台</Button>
        </div>
      </section>

      <section className="page-section">
        <label>资源所在地: 青岛</label>
        <div style={{padding: '10px'}}></div>
        <label htmlFor="">应用资源：</label>
        <div style={{padding: '10px'}}></div>
        <section className={styles["card-form"]}>
          <div className={styles["card-header"]}>高配置资源</div>
          <Form className={styles["card-body"]}>
            <FormItem
              {...formItemLayout3}
              label="CPU内核数"
              hasFeedback
            >
             16
            </FormItem>
            <FormItem
              {...formItemLayout3}
              label="内存"
              hasFeedback
            >
             16G
            </FormItem>
            <FormItem
              {...formItemLayout3}
              label="硬盘"
              hasFeedback
            >
             1024G
            </FormItem>
          </Form>
        </section>
        <div className="text-right pd-tb10">
          <Button type="primary">前往容器云</Button>
        </div>
    </section>

    <section className="page-section">
      <Row>
        <Col>
          <label htmlFor="">中间件：</label>
          <div style={{padding: '10px'}}></div>
        </Col>

        <Redis></Redis>
        <MySQL></MySQL>
        <Paas></Paas>
        <RocketMQComsumer></RocketMQComsumer>
        <RabbitMQ></RabbitMQ>
        <br/>
        <Col span={24}>
          <div className="text-right pd-tb10">
            <Button type="primary">前往中间件平台</Button>
          </div>
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
        <h3>选择框架</h3>
        <CheckboxGroup options={plainOptions} value="前端框架"/>
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
        <Button type="primary" icon="rollback">重置</Button>
        <Button type="primary" icon="eye" style={{float: 'right'}}>预览</Button>
      </section>
    </div>
      )
  }
}
export default connect(require('./model'))(Application)
