import React from 'react'
import {Table, Row, Col, Input, Radio, Button} from 'antd'
import userActions from './userActions'
import ActionDropdown from '../../../components/ActionDropdown'

const {Search} = Input
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

import styles from './styles.scss'

class C extends React.Component {
  state = {
    tableSelect: 'staff',
  }
  render() {
    const columnStaff = [{
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
      title: '用户名',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '姓名',
      dataIndex: 'rule',
      key: 'rule',
    }, {
      title: '角色',
      dataIndex: 'endPoint',
      key: 'endPoint',
    }, {
      title: '领域',
      dataIndex: 'startsAt',
      key: 'startsAt',
      render: (startsAt, record) => {
        return <span>{ (record.state === 'active' || record.state === 'suppressed') && startsAt}</span>
      }
    }, {
      title: '状态',
      dataIndex: 'endsAt',
      key: 'endsAt',
      render: (endsAt, record) => {
        return <span>{ (record.state === 'active' || record.state === 'suppressed') && endsAt}</span>
      }
    },
    {
      className: styles.center,
      render: (d, record) => {
        return (
          <ActionDropdown
            actions={alertActions(record)}
            resource={record}
            component={this}
            cbMap={this.alertActions}
          />
        )},
      width: 100,
      fixed: 'right',
    },];
    return (
      <main className="page-section">
        <h3>用户列表</h3>
        <Row type="flex" justify="space-between" className={styles.tableListForm}>
          <Col>
            {/* <Button type="primary">
              新建角色
            </Button> */}
            <RadioGroup style={{ marginRight: 20 }}
                        size="large"
                        value={this.state.tableSelect}
                        onChange={e => this.setState({tableSelect: e.target.value})}
            >
              <RadioButton value='staff'>员工</RadioButton>
              <RadioButton value="supplier">供应商</RadioButton>
              <RadioButton value="management">管理层</RadioButton>
            </RadioGroup>
          </Col>
          <Col>
            <Search
              placeholder="请输入您搜索的关键词"
              style={{ width: 200 }}
            />
          </Col>
        </Row>
        <Row>
        <Col>
          {this.state.tableSelect === 'staff' && (
            <Table
              // dataSource={boxes}
              columns={columnStaff}
              rowKey="id"
            />
          )}
        </Col>
      </Row>
    </main>
    )
  }
}

export default C
