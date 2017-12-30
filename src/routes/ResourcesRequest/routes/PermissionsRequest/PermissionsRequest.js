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
        PermissionsRequest
      </div>
    );
  }
}
const WrappedApp = Form.create()(IndexPage);
export default WrappedApp