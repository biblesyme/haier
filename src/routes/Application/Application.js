import { Table, Icon, Pagination } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'

import { connect as modelConnect } from 'utils/ecos'

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
  title: '应用健康度',
  dataIndex: 'health',
}, {
  title: '资源占用率',
  dataIndex: 'resourceUsage',
}, {
  title: '中间件健康度',
  dataIndex: 'middleWareHealth',
  render(text, record, index){
    return (
        <Icon type="database">{text}</Icon>
      )
  }
}, {
  title: '状态',
  dataIndex: 'status',
}, {
  title: '操作',
  dataIndex: 'actions',
  render(text, record, index){
    return (
      <div>
        <Link to={`/resourcesRequest`}>申请资源</Link>
        <Link className="mg-l10" to={`/applications/${record.key}`}>{text}</Link>
      </div>
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
        <Table pagination={false} columns={columns} dataSource={data} onChange={onChange} />
      </div>
      <section className="page-section bottom-actions text-center">
          <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} />
        </section>
    </div>
      )
  }
}
export default modelConnect(require('./model'))(Application)