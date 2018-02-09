import React from 'react'
import {Table, Row, Col, Input, Radio, Button, Tag, message} from 'antd'
import userActions from './userActions'
import ActionDropdown from '../../../components/ActionDropdown'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'

const {Search} = Input
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

import styles from './styles.scss'

class User extends React.Component {
  state = {
    tableSelect: 'staff',
    filter: null,
  }

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.selfDispatch({
      type: 'findAccount',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}})
      }
    })
    this.props.selfDispatch({type: 'findProject'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['7']}})
  }

  deactivate = (record) => {
    let payload = {
      data: {
        ...record,
      },
      action: 'deactivate',
      successCB: () => {
        this.props.selfDispatch({'type': 'findAccount'})
        message.success('账号停用成功')
      },
      failCB: () => {
        message.error('账号停用失败')
      }
    }
    this.props.dispatch({'type': 'App/doAction', payload})
  }

  activate = (record) => {
    let payload = {
      data: {
        ...record,
      },
      action: 'activate',
      successCB: () => {
        this.props.selfDispatch({'type': 'findAccount'})
        message.success('账号启用成功')
      },
      failCB: () => {
        message.error('账号启用失败')
      }
    }
    this.props.dispatch({'type': 'App/doAction', payload})
  }

  render() {
    const {accounts=[], projects=[],} = this.props.reduxState
    const columnStaff = [{
      title: '用户名',
      dataIndex: 'externalId',
      key: 'externalId',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '角色',
      render: (record) => {
        let formatter = record.roles.map(r => nameMap[r])
        return <span>{formatter.join(',')}</span>
      }
    },{
      title: '部门/公司',
      // render: (record) => {
      //   let selector = projects.filter(p => p.creatorId === record.id)[0] || ''
      //   if (selector) {
      //     return <span>{selector.data.data.businessDomain}</span>
      //   } else {
      //     return <span></span>
      //   }
      // }
    }, {
      title: '状态',
      render: (record) => <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>
    }, {
      title: '操作',
      render: (record) => {
        if (record.state === 'active') {
          return <a record={record}  onClick={() => this.deactivate(record)}>停用</a>
        }
        if (record.state === 'inactive') {
          return <a record={record} onClick={() => this.activate(record)}>启用</a>
        }
      }
    },];

    const columnDeveloper = [{
      title: '用户名',
      dataIndex: 'externalId',
      key: 'externalId',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '角色',
      render: (record) => {
        let formatter = record.roles.map(r => nameMap[r])
        return <span>{formatter.join(',')}</span>
      }
    },{
      title: '项目经理',
      render: (record) => {
        let selector = projects.filter(p => p.creatorId === record.id)[0] || ''
        if (selector) {
          return <span>{selector.data.data.businessDomain}</span>
        } else {
          return <span></span>
        }
      }
    }, {
      title: '资源',
    },{
      title: '状态',
      render: (record) => <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>
    }, {
      title: '操作',
      render: (record) => {
        if (record.state === 'active') {
          return <a record={record}  onClick={() => this.deactivate(record)}>停用</a>
        }
        if (record.state === 'inactive') {
          return <a record={record} onClick={() => this.activate(record)}>启用</a>
        }
      }
    },];

    const columnAdmin = [{
      title: '用户名',
      dataIndex: 'externalId',
      key: 'externalId',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '状态',
      render: (record) => <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>
    }, {
      title: '操作',
      render: (record) => {
        if (record.state === 'active') {
          return <a record={record}  onClick={() => this.deactivate(record)}>停用</a>
        }
        if (record.state === 'inactive') {
          return <a record={record} onClick={() => this.activate(record)}>启用</a>
        }
      }
    },];

    let selector = []
    if (this.state.tableSelect === 'staff') {
      selector = accounts.filter(a => {
        if (a.hasOwnProperty('roles')) {
          if (!(a.roles.includes('developer') || a.roles.includes('external'))) {
            return a
          }
        }
      })
    }
    if (this.state.tableSelect === 'developer') {
      selector = accounts.filter(a => {
        if (a.hasOwnProperty('roles')) {
          if (a.roles.includes('developer') || a.roles.includes('external')) {
            return a
          }
        }
      })
    }
    if (this.state.tableSelect === 'admin') {
      selector = accounts.filter(a => {
        if (a.hasOwnProperty('roles')) {
          if (a.roles.includes('admin')) {
            return a
          }
        }
      })
    }
    const boxes = selector.filter(a => {
      const {filter} = this.state
      if (!filter) {
        return true
      }
      const reg = new RegExp(filter, 'i')
      const fieldsToFilter = [a.name || '', a.externalId || ''].join()
      return reg.test(fieldsToFilter)
    })
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
              <RadioButton value="developer">供应商</RadioButton>
              <RadioButton value="admin">管理层</RadioButton>
            </RadioGroup>
          </Col>
          <Col>
            <Search
              placeholder="请输入您搜索的关键词"
              style={{ width: 200 }}
              onChange={e => this.setState({filter: e.target.value})}
            />
          </Col>
        </Row>
        <Row>
        <Col>
          {this.state.tableSelect === 'staff' && (
            <Table
              dataSource={boxes}
              columns={columnStaff}
              rowKey="id"
              pagination={{showQuickJumper: true}}
            />
          )}
          {this.state.tableSelect === 'developer' && (
            <Table
              dataSource={boxes}
              columns={columnDeveloper}
              rowKey="id"
              pagination={{showQuickJumper: true}}
            />
          )}
          {this.state.tableSelect === 'admin' && (
            <Table
              dataSource={boxes}
              columns={columnAdmin}
              rowKey="externalId"
              pagination={{showQuickJumper: true}}
            />
          )}
        </Col>
      </Row>
    </main>
    )
  }
}

Object.defineProperty(User, "name", { value: "User" });
export default connect(require('./model'),['App'])(User)
