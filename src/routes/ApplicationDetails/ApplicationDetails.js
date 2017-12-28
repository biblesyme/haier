import { Table, Icon, Pagination, Button } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'utils/ecos'

const columns = [{
  title: '序号',
  dataIndex: 'key',
}, {
  title: '能力名称',
  dataIndex: 'name',
  sorter: (a, b) => a.name.length - b.name.length,
}, {
  title: '类型',
  dataIndex: 'manager',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.manager.length - b.manager.length,
}, {
  title: '能力介绍',
  dataIndex: 'health',
}, {
  title: '操作',
  dataIndex: 'actions',
  render(text, record, index){
    return (
      <Link to={`/application/${record.key}`}>{text}</Link>
    )
  }
}];

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
  render(){
    return (
    <div>
      <div className="page-section">
        <h3>微服务平台</h3>
        <Table pagination={false} columns={columns} dataSource={data} onChange={onChange} />
      </div>
      <div className="page-section">
        <h3>能力开放平台  <span className="pull-right mg-l10">已使用能力：2个</span> <span className="pull-right">已发布能力：3个</span></h3>
        <Table pagination={false} columns={columns} dataSource={data} onChange={onChange} />
        <div className="text-right pd-tb10">
          <Button type="primary">前往能力开放平台</Button>
        </div>
      </div>
    </div>
      )
  }
}
export default connect(require('./model'))(Application)