import React from 'react'
import {
  Modal,
  Icon,
  Button,
  Row,
  Col,
  Card,
  Form,
  Select,
} from 'antd'


const FormItem = Form.Item
const {Option} = Select

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

@Form.create()
export default class C extends React.Component {
  state = {
  }
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      let value = {
        name: values.name,
      }
      this.props.onOk(value)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {resource} = this.props
    return (
      <div>
        <Modal
          title={
            <div className="text-center">
              资源详情
              <div className="pull-right" style={resource.state === '已驳回' ? {color: '#ffa940'} : {color: '#005aab'}}>{resource.state}</div>
            </div>
          }
          {...this.props}
          footer={ resource.state === '已驳回' ?
            <div className="text-center">
              <Button type="primary" onClick={this.props.onCancel} >返回</Button>
            </div> :
            <div className="text-center">
              <Button type="primary" onClick={this.props.onCancel} style={{marginRight: '16px'}}>取消</Button>
              <Button style={{marginRight: '16px'}}>驳回</Button>
              <Button>通过</Button>
            </div>
          }
          closable={false}
          width={800}
          >
            {resource.state === '已驳回' && (
              <div>
                <p style={{color: '#ffa940'}}>驳回理由: 资源申请超过项目需求</p>
                <Row>
                  <Col span={8}>
                    <Card title="MySQL" style={{height: '230px'}}>
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
                          label="配置"
                          hasFeedback
                        >
                          中
                        </FormItem>
                        <FormItem
                          {...formItemLayout4}
                          label="分片"
                          hasFeedback
                        >
                         50片
                        </FormItem>
                        <FormItem
                          {...formItemLayout4}
                          label="备份"
                          hasFeedback
                        >
                         是
                        </FormItem>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {resource.state !== '已驳回' && (
              <div>
                <Select placeholder="请选择集群"
                        style={{width: '200px', marginRight: '24px', marginBottom: '16px'}}
                ></Select>
                <div>中间件配置: </div>
                <br/>
                <Row>
                  <Col span={8}>
                    <Card title="MySQL" style={{height: '230px'}}>
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
                          label="配置"
                          hasFeedback
                        >
                          中
                        </FormItem>
                        <FormItem
                          {...formItemLayout4}
                          label="分片"
                          hasFeedback
                        >
                         50片
                        </FormItem>
                        <FormItem
                          {...formItemLayout4}
                          label="备份"
                          hasFeedback
                        >
                         是
                        </FormItem>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
        </Modal>
      </div>

    )
  }
}
