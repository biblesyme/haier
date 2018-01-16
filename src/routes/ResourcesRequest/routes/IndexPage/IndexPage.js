import React from 'react'
import {Table, Row, Col, Input, Button, Select} from 'antd'

const {Search} = Input
const {Option} = Select

import styles from './styles.scss'

class C extends React.Component {
  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'state',
      key: 'state',
      render: (state, record) => {
        return (
          <div>
            <Tag {...getState(record.state)}>
              {nameMap[state]}
            </Tag>
          </div>
        )
      }
    }, {
      title: '类型',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '申请人',
      dataIndex: 'rule',
      key: 'rule',
    }, {
      title: '申请时间',
      dataIndex: 'endPoint',
      key: 'endPoint',
    }, {
      title: '应用名称',
      dataIndex: 'startsAt',
      key: 'startsAt',
      render: (startsAt, record) => {
        return <span>{ (record.state === 'active' || record.state === 'suppressed') && startsAt}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'endsAt1',
      key: 'endsAt1',
      render: (endsAt, record) => {
        return <span>{ (record.state === 'active' || record.state === 'suppressed') && endsAt}</span>
      }
    }, {
      title: '操作',
      dataIndex: 'endsAt',
      key: 'endsAt',
      render: (endsAt, record) => {
        return <span>{ (record.state === 'active' || record.state === 'suppressed') && endsAt}</span>
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
            // dataSource={boxes}
            columns={columns}
            rowKey="id"
          />
        </Col>
      </Row>
    </main>
    )
  }
}

export default C
