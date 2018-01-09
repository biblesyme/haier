import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'

const FormItem = Form.Item

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
        <label htmlFor="">应用资源配置：</label>
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
        <label htmlFor="">推荐中间件：</label>
        <div style={{padding: '10px'}}></div>
        <section className={`${styles["card-form"]} ${styles["width-260"]}`}>
          <div className={styles["card-header"]}>MYSQL</div>
          <Form className={styles["card-body"]}>
            <FormItem
              {...formItemLayout4}
              label="地点"
              hasFeedback
            >
             青岛
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="资源"
              hasFeedback
            >
              中
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="分片"
              hasFeedback
            >
             1024G
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="备份"
              hasFeedback
            >
              是
            </FormItem>
          </Form>
        </section>
        <br/>
        <section className={`${styles["card-form"]} ${styles["width-260"]}`} style={{marginTop: '10px'}}>
          <div className={styles["card-header"]}>Redis</div>
          <Form className={styles["card-body"]}>
            <FormItem
              {...formItemLayout4}
              label="地点"
              hasFeedback
            >
             青岛
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="资源"
              hasFeedback
            >
              共享资源
            </FormItem>
            <FormItem
              {...formItemLayout4}
              label="配置"
              hasFeedback
            >
             单例
            </FormItem>
          </Form>
        </section>
        <div className="text-right pd-tb10">
          <Button type="primary">前往中间件平台</Button>
        </div>
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
    </div>
      )
  }
}
export default connect(require('./model'))(Application)
