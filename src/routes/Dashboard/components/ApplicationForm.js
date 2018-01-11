import React from 'react'
import { Menu, Icon, Button, Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';
import { connect } from 'utils/ecos'
import FormMySQL from './components/FormMySQL'

const CheckboxGroup = Checkbox.Group;

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;

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
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  addMiddleware = () => {
    console.log(this.state.middlewareSelect)
  }

  render() {
    const { size, size2 } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page-wrap">
        <section className="page-section">
          <label>应用归属：</label>
          <Radio.Group value={size}>
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
                  rules: [{ required: false, message: "请输入应用S码" }],
                })(
                  <Input placeholder="请输入应用S码"/>
                )}
              </FormItem>
            </Col>
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
               <Select defaultValue="supply" disabled>
                 <Option key="supply">供应链</Option>
               </Select>
              </FormItem>
            </Col>
            </Row>
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
          <Radio.Group value={size2}>
            <Radio.Button value="qd">青岛</Radio.Button>
            <Radio.Button value="bj">北京</Radio.Button>
            <Radio.Button value="qt">其他</Radio.Button>
          </Radio.Group>
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

          <section className={styles["card-form"]}>
            <div className={styles["card-header"]}>其他资源</div>
            <Form className={styles["card-body"]}>
              <FormItem
                {...formItemLayout3}
                label="CPU内核数"
                hasFeedback
              >
               <Input></Input>
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="内存"
                hasFeedback
              >
               <Input></Input>
              </FormItem>
              <FormItem
                {...formItemLayout3}
                label="硬盘"
                hasFeedback
              >
               <Input></Input>
              </FormItem>
            </Form>
          </section>
        </section>

        <section className="page-section">
          <h3>中间件申请</h3>
          <div style={{padding: '10px'}}></div>
          <label htmlFor="">添加中间件：</label>
          <Select style={{width: '120px'}}
                  value={this.state.middlewareSelect}
                  onChange={middlewareSelect => this.setState({middlewareSelect})}
          >
            <Option key="MySQL">MySQL</Option>
            <Option key="Redis">Redis</Option>
            <Option key="PaaS">容器云PaaS</Option>
            <Option key="RocketMQ">RocketMQ</Option>
            <Option key="RabbitMQ">RabbitMQ</Option>
          </Select>
          <Button onClick={this.addMiddleware}><Icon type="plus" /></Button>
          <div style={{padding: '10px'}}></div>
          <label htmlFor="">推荐中间件：</label>
          <div style={{padding: '10px'}}></div>

          <div>
            <section className={`${styles["card-form"]} ${styles["width-260"]}`}>
              <div className={styles["card-header"]}>MYSQL</div>
              <Form className={styles["card-body"]}>
                <FormItem
                  {...formItemLayout4}
                  label="地点"
                  hasFeedback
                >
                 <Radio.Group value={size}>
                  <Radio.Button value="haier">青岛</Radio.Button>
                  <Radio.Button value="nohaier">北京</Radio.Button>
                </Radio.Group>
                </FormItem>
                <FormItem
                  {...formItemLayout4}
                  label="资源"
                  hasFeedback
                >
                 <Radio.Group value={size}>
                  <Radio.Button value="haier">高</Radio.Button>
                  <Radio.Button value="nohaier">中</Radio.Button>
                  <Radio.Button value="nohaier">低</Radio.Button>
                </Radio.Group>
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
                  <Radio.Group value={size}>
                    <Radio.Button value="haier">是</Radio.Button>
                    <Radio.Button value="nohaier">否</Radio.Button>
                  </Radio.Group>
                </FormItem>
              </Form>
            </section>
            <br/>
            <section className={`${styles["card-form"]} ${styles["width-260"]}`}
                     style={{marginTop: '2px', marginBottom: '20px'}}
            >
              <Button style={{width: '100%'}}><Icon type="delete" /></Button>
            </section>
          </div>

          <FormMySQL></FormMySQL>

        </section>

        {/* <section className="page-section">
          <h3>选择框架</h3>
          <CheckboxGroup options={plainOptions} />
        </section>
        <section className="page-section">
          <h3>监控功能</h3>
          <Checkbox
          >
            开启
          </Checkbox>
        </section> */}
        <div style={{paddingBottom: '60px'}}></div>

        <section className="page-section bottom-actions">
          <Button type="primary" icon="rollback">重置</Button>
          <Button type="primary" icon="eye" style={{float: 'right'}}>预览</Button>
        </section>
      </div>
    );
  }
}

const WrappedApp = Form.create()(ApplicationForm);
export default WrappedApp
