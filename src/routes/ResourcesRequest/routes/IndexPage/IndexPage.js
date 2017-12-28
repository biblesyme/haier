import React from 'react'
import { Menu, Icon, Button,Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const FormItem = Form.Item;
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


function handleChange(value) {
  console.log(`selected ${value}`);
}

function handleBlur() {
  console.log('blur');
}

function handleFocus() {
  console.log('focus');
}

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
         <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择项目"
            optionFilterProp="children"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value="jack">大屏222112</Option>
            <Option value="lucy">大大大大大屏22</Option>
            <Option value="tom">大大大屏21232</Option>
          </Select>
        <section className="page-section">
          <Form>
            <Row gutter={24}>
            <Col span={col}>
              <FormItem
                {...formItemLayout}
                label="S码验证"
                hasFeedback
              >
               12345646513547698
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
          </Form>
        </section>
      </div>
    );
  }
}
const WrappedApp = Form.create()(IndexPage);
export default WrappedApp