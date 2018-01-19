import React from 'react'

import {
  Modal,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Table,
  Pagination,
} from 'antd'
const FormItem = Form.Item

const { Option } = Select

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

const columns = [{
  title: '序号',
  dataIndex: 'id',
}, {
  title: 'Portal账号',
  dataIndex: 'account.externalId',
}, {
  title: '姓名',
  dataIndex: 'account.name',
}];

@Form.create()
export default class C extends React.Component {
  state = {
    page: 1,
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
    const {resource, domainAdmins=[]} = this.props
    return (
      <div>
        <Modal
          title="领域详情"
          {...this.props}
          footer={<Button onClick={this.props.onCancel}>返回</Button>}
          >
            <p><label>当前领域：</label><span>{resource.name}</span></p>
            <h3>团队长：</h3>
            <Table pagination={false} columns={columns} dataSource={domainAdmins} size="small" rowKey="id"/>
            <div className="mg-b10"></div>
            <div className="text-center"><Pagination current={this.state.page} total={domainAdmins.length} onChange={this.onChange} /></div>
        </Modal>
      </div>

    )
  }
}
