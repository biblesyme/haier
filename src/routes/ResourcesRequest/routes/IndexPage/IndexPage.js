import React from 'react'
import {Table, Row, Col, Input, Button, Select} from 'antd'
import Detail from './Detail'

const {Search} = Input
const {Option} = Select

import styles from './styles.scss'

const datas =[{
  id: 1,
  type: '中间件',
  applicant: '张三',
  department: '众创汇',
  time: '20170901',
  project: '海尔690大数据项目',
  state: '已驳回',
  action: '查看',
}, {
  id: 2,
  type: 'paas',
  applicant: '李四',
  department: '众创汇',
  time: '20170901',
  project: '海尔690大数据项目',
  state: '待审批',
  action: '查看',
}]

class C extends React.Component {
  state = {
    filteredInfo: null,
    visibleDetail: false,
    record: {},
  };

  handleCancel = (e) => {
    this.setState({
      visibleDetail: false,
    });
  }

  render() {
    let { filteredInfo, } = this.state;
    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '全部', value: 'all' },
        { text: '中间件', value: '中间件' },
        { text: 'PAAS', value: 'paas' },
        { text: '能力开放平台', value: 'Platform' },
      ],
      onFilter: (value, record) => {
        if (value === 'all') {
          return record.type
        }
        return record.type.includes(value)
      },
      filterMultiple: false,
    }, {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
    }, {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    }, {
      title: '申请时间',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: '项目名称',
      dataIndex: 'project',
      key: 'project',
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action, record) => {
        return (
          <div>
            <a onClick={e => this.setState({visibleDetail: true, record})}>{action}</a>
          </div>
        )
      }
    },];
    return (
      <main className="page-section">
        <Row type="flex" justify="space-between" className={styles.tableListForm}>
          <Col>
            <Select style={{width: '200px'}} defaultValue="1">
              <Option key="1">待审批</Option>
              <Option key="2">全部</Option>
              <Option key="3">已审批</Option>
              <Option key="4">已驳回</Option>
            </Select>
          </Col>
        </Row>
        <Row>
        <Col>
          <Table
            dataSource={datas}
            columns={columns}
            rowKey="id"
          />
        </Col>
      </Row>
      <Detail
        visible={this.state.visibleDetail}
        onOk={(newData) => {this.saveAdd(newData)}}
        onCancel={this.handleCancel}
        resource={this.state.record}
        />
    </main>
    )
  }
}

export default C
