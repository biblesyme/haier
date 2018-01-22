import React from 'react'
import {Button, Row, Col, Form, Select, Checkbox} from 'antd'
import { withRouter } from 'react-router'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'

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

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['前端框架', '后台框架']

class Preview extends React.Component {
  render() {
    const {history} = this.props
    const {form} = this.props.App
    return (
      <main>
        <section className="page-section">
          <label>应用归属：{nameMap[form.company]}</label>
        </section>
        <section className="page-section">
          <label>应用信息:</label>
          <div style={{marginTop: '8px'}}></div>
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
            <Col span={24}>
              <div className="text-right pd-tb10">
                <Button type="primary">前往中间件平台</Button>
              </div>
            </Col>
          </Row>
        </section>

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
          <Button type="primary" onClick={e => history.goBack()}>返回</Button>
          <Button type="primary" style={{float: 'right'}} onClick={this.submit}>创建</Button>
        </section>
      </main>
    )
  }
}

const WrappedPreview = Form.create()(Preview);
Object.defineProperty(WrappedPreview, "name", { value: "WrappedPreview" });
export default withRouter(connect(null, ['App'])(WrappedPreview))
