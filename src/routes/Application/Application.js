import { Table, Icon, Pagination, Tag, Modal, Form, Input, Button } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'
import  ActionDropdown from '../../components/ActionDropdown'

import { connect as modelConnect } from 'utils/ecos'

const FormItem = Form.Item
const {Search} = Input

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



const data = [{
  key: '1',
  name: '大数据',
  manager: '张三',
  health: '50%',
  resourceUsage: '30%',
  middleWareHealth: '75% 80% 60%',
  status: '待部署',
  actions: '查看详情'
}];

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class Application extends React.Component {
  state = { visibleAdd: false, visibleEdit: false, visibleDetail: false, }

  showModal = (visible) => {
    return ()=>{this.setState({
      [visible]: true,
    });
  }
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visibleAdd: false,
      visibleEdit: false,
      visibleDetail: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visibleAdd: false,
      visibleEdit: false,
      visibleDetail: false,
    });
  }

  render(){
    const columns = [{
      title: '序号',
      dataIndex: 'key',
    }, {
      title: '应用名称',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    }, {
      title: '项目经理',
      dataIndex: 'manager',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.manager.length - b.manager.length,
    }, {
      title: '应用告警数',
      dataIndex: 'health',
    }, {
      title: '资源占用率',
      dataIndex: 'resourceUsage1',
    }, {
      title: '资源种类',
      dataIndex: 'resourceUsage',
      render() {
        return (
          <div>
            <Tag>M</Tag>
            <Tag>P</Tag>
            <Tag>R</Tag>
            <Tag>MQ</Tag>
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
    }, {
      title: '操作',
      dataIndex: 'actions',
      render: (text, record, index) => {
        return (
          <div>
            <Link to={`/resourcesRequest`}>申请资源</Link>
            <Link className="mg-l10" to={`/applications/${record.key}`}>{text}</Link>
            <a className="mg-l10"
               onClick={this.showModal('visibleEdit')}
            >成员管理</a>
          </div>
        )
      }
    }];
    return (
    <div>
      <div className="page-section">
        <Table pagination={false} columns={columns} dataSource={data} onChange={onChange} />
      </div>
      <section className="page-section bottom-actions text-center">
          <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} />
      </section>
      <Modal
        title="成员管理"
        visible={this.state.visibleEdit}
        okText="添加"
        cancelText="取消"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="当前应用"
          >
            大数据
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="成员"
          >
            <p>张三  12123124231<Icon className="mg-l10" type="delete" onClick={e => console.log('poi')} /></p>
            <p>张三  12123124231<Icon className="mg-l10" type="delete" onClick={e => console.log('poi')} /></p>
            <p>张三  12123124231<Icon  className="mg-l10" type="delete" onClick={e => console.log('poi')} /></p>
          </FormItem>
        </Form>
        <h3>查询</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="账号"
          >

              <Search />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户信息"
          >
            <p>张三  12123124231</p>
          </FormItem>
        </Form>
      </Modal>
    </div>
      )
  }
}
export default modelConnect(require('./model'))(Application)
