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
  dataIndex: 'key',
}, {
  title: 'Portal账号',
  dataIndex: 'portal',
}, {
  title: '姓名',
  dataIndex: 'name',
}];
const data = [{
  key: '1',
  name: '张三',
  portal: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: '张三',
  portal: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: '张三',
  portal: 32,
  address: 'Sidney No. 1 Lake Park',
}];

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
          title="领域详情"
          {...this.props}
          footer={<Button onClick={this.props.onCancel}>返回</Button>}
          >
            <p><label for="">当前领域：</label><span>{resource.name}</span></p>
            <h3>团队长：</h3>
            <Table pagination={false} columns={columns} dataSource={data} size="small" />
            <div className="mg-b10"></div>
            <div className="text-center"><Pagination showQuickJumper defaultCurrent={2} total={100} onChange={this.onChange} /></div>
        </Modal>
      </div>

    )
  }
}
