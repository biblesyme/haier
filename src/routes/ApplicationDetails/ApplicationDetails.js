import { Table, Icon, Pagination, Button, Row, Col, Form, Select, Input, Card, Progress } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'utils/ecos'

const FormItem = Form.Item
const CardGrid = Card.Grid

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

        <Row>
          <Col>
            <label htmlFor="">中间件：</label>
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
          </Col>

          <Row gutter={8}  style={{marginTop: '10px'}} >
            <Col span={4} style={{marginLeft: '20px'}}>
              <Card title="Redis" style={{width: '220px', height: '275px'}}>
                <Form>
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
              </Card>
            </Col>
            <Col span={19}>
              <Card title="状态">
                <CardGrid style={{width: '25%'}}>
                  <Progress type="dashboard"
                            percent={75}
                            width={120}
                            format={percent => `内存使用
                              ${percent}%`}
                  />
                </CardGrid>
                <CardGrid style={{width: '25%'}}>
                  <Progress type="circle"
                            percent={30}
                            width={120}
                            format={percent => `命中率
                              ${percent}%`}
                            style={{marginLeft: '20px'}}
                  />
                </CardGrid>
                <CardGrid style={{width: '25%', height: '168px'}}>
                  日慢查询数量
                  <div style={{fontSize: '64px', textAlign: 'right'}}>
                    2334
                  </div>
                </CardGrid>
                <CardGrid style={{width: '25%', height: '168px'}}>
                  当前连接数
                  <div style={{fontSize: '64px', textAlign: 'right'}}>
                    999
                  </div>
                </CardGrid>
              </Card>
            </Col>
          </Row>

          <Col span={24}>
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
    </div>
      )
  }
}
export default connect(require('./model'))(Application)
