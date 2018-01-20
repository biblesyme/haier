import React from 'react'
import { Menu, Icon, Button,Select, Radio, Form, Input, Row, Col, Checkbox } from 'antd';
import { connect } from 'utils/ecos'

import ApplicationForm from './components/ApplicationForm'
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

class NewApplication extends React.Component {
  render() {
    return (
      <ApplicationForm reduxState={this.props.reduxState}></ApplicationForm>
    );
  }
}

Object.defineProperty(NewApplication, "name", { value: "NewApplication" });
export default connect(require('./model'))(NewApplication)
