import React from 'react'
import {Button, Row, Col, Form, Select, Checkbox, message} from 'antd'
import { withRouter } from 'react-router'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import Paas from './Paas'
import FormMapping from './FormMapping'
import apiStore from 'utils/apiStore'

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
const plainOptions = [{
  label: '前端框架',
  value: 'front',
}, {
  label: '后台框架',
  value: 'back',
}]

class Preview extends React.Component {
  submit = () => {
    const {form} = this.props.App
    if (!form.scode) {
      message.error('未能获取S码 请返回上一页')
      return
    }
    const {projectInfo} = form
    const resoures = [...form.middlewareMappings, form.paas]
    const record = resoures.map(r => {
      if (r.resourceType === 'containerHost') {
        return apiStore.createRecord({
          data: JSON.stringify({...r}),
          version: 1,
          resourceType: 'containerHost',
          type: 'resource',
        })
      }
      if (r.resourceType === 'mysql') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'mysql',
          type: 'resource',
          data: JSON.stringify({...r})
        })
      }
      if (r.resourceType === 'redis') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'redis',
          type: 'resource',
          data: JSON.stringify({...r})
        })
      }
      if (r.resourceType === 'rocketMQTopic') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'rocketMQTopic',
          type: 'resource',
          data: JSON.stringify({...r})
        })
      }
      if (r.resourceType === 'rabbitMQProducer') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'rabbitMQProducer',
          type: 'resource',
          data: JSON.stringify({...r})
        })
      }
      if (r.resourceType === 'rabbitMQConsumer') {
        return apiStore.createRecord({
          version: 1,
          resourceType: 'rabbitMQConsumer',
          type: 'resource',
          data: JSON.stringify({...r})
        })
      }
      return r
    })
    this.props.dispatch({
      type: 'App/saveRecord',
      payload: {
        data: {
          ...form,
          type: 'projects',
          resources: record,
        },
        successCB: () => {
          message.success('应用创建成功')
          if (this.props.App.role !== 'admin') {
            this.props.history.push({pathname: '/application'})
          } else {
            this.props.history.push({pathname: '/information'})
          }
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
    const {form={}} = this.props.App
    const {projectInfo={}, middlewareMappings=[]} = form
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
               {projectInfo.businessDomain}
              </FormItem>
            </Col>
          </Row>
        </section>

        <section className="page-section">
          <Paas item={form.paas}></Paas>
        </section>

        <section className="page-section">
          <Row>
            <Col>
              <label htmlFor="">中间件：</label>
              <div style={{padding: '10px'}}></div>
            </Col>
            <Row>
              {middlewareMappings.map(item => {
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
            <Col span={24}>
            </Col>
          </Row>
        </section>

        <section className="page-section">
          <h3>框架</h3>
          <CheckboxGroup options={plainOptions} value={form.frame}/>
        </section>
        <section className="page-section">
          <h3>监控功能</h3>
          <Checkbox checked={form.alert}
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
