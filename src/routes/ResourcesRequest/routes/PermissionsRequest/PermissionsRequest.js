import React from 'react'
import { Menu, Icon, Button,Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;


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

class IndexPage extends React.Component {
  state = {
    size: 'haier',
    size2: 'qd',
    checkedList: []
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    const { size, size2 } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page-wrap">
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
            </Row>
            <Row gutter={24}>
              <Col span={24} style={{textAlign: 'right'}}>
                <FormItem
                  {...formItemLayout2}
                  hasFeedback
                >
                  <Button>修改</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </section>
      </div>
    );
  }
}
const WrappedApp = Form.create()(IndexPage);
export default WrappedApp