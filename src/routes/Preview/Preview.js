import React from 'react'
import {Button, Row, Col, Form, Select, Checkbox, message} from 'antd'
import { withRouter } from 'react-router'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import Paas from './Paas'

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
  submit = () => {
    const {form} = this.props.App
    this.props.dispatch({
      type: 'App/saveRecord',
      payload: {
        data: {
          ...form,
          type: 'projects',
        },
        successCB: () => {
          message.success('应用创建成功')
          this.props.history.push({pathname: '/application'})
        },
        failCB: () => {
          message.error('应用创建失败')
        },
      }
    })
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const {history} = this.props
    const {form={projectInfo: {}}} = this.props.App
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
               {form.projectInfo.name}
              </FormItem>
            </Col>
            <Col span={col}>
              <FormItem
                {...formItemLayout}
                label="申请日期"
                hasFeedback
              >
               {new Date(form.projectInfo.createdAt).toLocaleString()}
              </FormItem>
            </Col>
            <Col span={col}>
              <FormItem
                {...formItemLayout}
                label="业务负责人"
                hasFeedback
              >
               {form.projectInfo.ownerUser}
              </FormItem>
            </Col>
            <Col span={col}>

              <FormItem
                {...formItemLayout}
                label="归属部门"
                hasFeedback
              >
               {form.projectInfo.ownerUserDp}
              </FormItem>
            </Col>
            <Col span={col}>
              <FormItem
                {...formItemLayout}
                label="应用属性"
                hasFeedback
              >
               {form.projectInfo.applicationType}
              </FormItem>
            </Col>
            <Col span={col}>
              <FormItem
                {...formItemLayout}
                label="应用领域"
                hasFeedback
              >
               {form.projectInfo.businessDomain}
              </FormItem>
            </Col>
          </Row>
          <div className="text-right pd-tb10">
            <Button type="primary">前往监控平台</Button>
          </div>
        </section>

        <section className="page-section">
          <Paas item={form.paas}></Paas>
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
          <Button type="primary" onClick={this.goBack}>返回</Button>
          <Button type="primary" style={{float: 'right'}} onClick={this.submit}>创建</Button>
        </section>
      </main>
    )
  }
}

const WrappedPreview = Form.create()(Preview);
Object.defineProperty(WrappedPreview, "name", { value: "WrappedPreview" });
export default withRouter(connect(null, ['App'])(WrappedPreview))
