import React from 'react'
import {Table, Row, Col, Input, Radio, Button, Tag, message, Checkbox, Icon} from 'antd'
import userActions from './userActions'
import ActionDropdown from '../../../components/ActionDropdown'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'
import replace from 'utils/replace'
import RcTable from 'rc-table'

const {Search} = Input
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

import styles from './styles.sass'

class User extends React.Component {
  state = {
    tableSelect: 'staff',
    filter: null,
    projects: [],
    projectparticipants: [],
    loading: null,
    expandedRowKeys: [],
  }

  componentWillMount() {
    // this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.setState({loading: true})
    this.props.dispatch({type: 'App/findDomain'})
    this.props.selfDispatch({
      type: 'findAccount',
      payload: {
        // callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}}),
        callback: () => this.setState({loading: false}),
        successCB: (accounts) => {
          accounts.map(a => {
            this.props.selfDispatch({
              type: 'followLink',
              payload: {
                record: a,
                link: 'projectparticipants',
                successCB: (record) => {
                  this.setState({projectparticipants: [...this.state.projectparticipants, {id: a.id, record: record.content}]})
                }
              }
            })
          })
        }
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

  handleBelongTo = (belong, account) => {
    if (belong.state === 'active') {
      this.props.dispatch({
        type: 'App/doAction',
        payload: {
          data: belong,
          action: 'forbid',
          successCB: () => {
            message.success('取消关联成功')
            this.props.selfDispatch({
              type: 'followLink',
              payload: {
                record: account,
                link: 'projectparticipants',
                successCB: (record) => {
                  const {projectparticipants} = this.state
                  const nextAry = replace(projectparticipants, {id: account.id, record: record.content})
                  this.setState({
                    projectparticipants: nextAry
                  })
                }
              }
            })
          },
          failCB: () => message.error('取消关联失败'),
        }})
    }
    if (belong.state === 'forbidden') {
      this.props.dispatch({
        type: 'App/doAction',
        payload: {
          data: belong,
          action: 'restore',
          successCB: () => {
            message.success('启用关联成功')
            this.props.selfDispatch({
              type: 'followLink',
              payload: {
                record: account,
                link: 'projectparticipants',
                successCB: (record) => {
                  const {projectparticipants} = this.state
                  const nextAry = replace(projectparticipants, {id: account.id, record: record.content})
                  this.setState({
                    projectparticipants: nextAry
                  })
                }
              }
            })
          },
          failCB: () => message.error('启用关联失败'),
        }})
    }
  }

  render() {
    const {accounts=[], projects=[],} = this.props.reduxState
    const {projectparticipants=[]} = this.state
    const {domains=[]} = this.props.App
    const columnStaff = [{
      title: <div className="text-center">用户名</div>,
      dataIndex: 'externalId',
      key: 'externalId',
      className: 'text-center',
    }, {
      title: <div className="text-center">姓名</div>,
      dataIndex: 'name',
      key: 'name',
      className: 'text-center',
    }, {
      title: <div className="text-center">角色</div>,
      className: 'text-center',
      render: (record) => {
        let formatter = record.roles.map(r => nameMap[r])
        return <span>{formatter.join(',')}</span>
      }
    }, {
      title: <div className="text-center">所属应用</div>,
      className: 'text-center',
      render: (record) => {
        const filter = projectparticipants.filter(p => p.id === record.id)[0] || {}
        const records = filter.record || []
        const recordFilter = records.filter(r => r.state === 'active')
        if (recordFilter.length > 1) {
          return (
            <span onClick={() => {
                    if (record.id === this.state.expandedRowKeys[0]) {
                      this.setState({expandedRowKeys: []})
                      return
                    }
                    this.setState({expandedRowKeys: [record.id]})}
                  }
                  className="cursor">
              {`${recordFilter[0].projectName}... (${recordFilter.length})`}
              <Icon type={this.state.expandedRowKeys[0] !== record.id ? 'caret-down' : 'caret-up'}
                    style={{fontSize: 9, marginLeft: 5, position: 'relative', top: -2}}
              />
            </span>
          )
        }
        if (recordFilter.length === 1) {
          return (
            <span onClick={() => {
                    if (record.id === this.state.expandedRowKeys[0]) {
                      this.setState({expandedRowKeys: []})
                      return
                    }
                    this.setState({expandedRowKeys: [record.id]})}
                  }
                  className="cursor">
              {`${recordFilter[0].projectName} (${recordFilter.length})`}
              <Icon type={this.state.expandedRowKeys[0] !== record.id ? 'caret-down' : 'caret-up'}
                    style={{fontSize: 9, marginLeft: 5, position: 'relative', top: -2}}
              />
            </span>
          )
        }
        return (<span>无</span>)
      },
    }, {
      title: <div className="text-center">部门/公司</div>,
      className: 'text-center',
      render: (record) => {
        const project = projects.filter(p => p.creatorId === record.id)[0] || {}
        const domain = domains.filter(d => d.id === project.domainId)[0] || {}
        return <span>{domain.name}</span>
      }
    }, {
      title: <div className="text-center">状态</div>,
      className: 'text-center',
      render: (record) => <span style={{...getState(record.state)}}>{nameMap[record.state]}</span>,
    }, {
      title: <div className="text-center">操作</div>,
      className: 'text-center',
      render: (record) => {
        if (record.state === 'active') {
          return <a record={record}  onClick={() => this.deactivate(record)}>停用</a>
        }
        if (record.state === 'inactive') {
          return <a record={record} onClick={() => this.activate(record)}>启用</a>
        }
      },
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
      render: (record) => <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>,
      fixed: 'right',
      width: 100,
    }, {
      title: '操作',
      render: (record) => {
        if (record.state === 'active') {
          return <a record={record}  onClick={() => this.deactivate(record)}>停用</a>
        }
        if (record.state === 'inactive') {
          return <a record={record} onClick={() => this.activate(record)}>启用</a>
        }
      },
      fixed: 'right',
      width: 100,
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
      render: (record) => <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>,
      fixed: 'right',
      width: 100,
    }, {
      title: '操作',
      render: (record) => {
        if (record.state === 'active') {
          return <a record={record}  onClick={() => this.deactivate(record)}>停用</a>
        }
        if (record.state === 'inactive') {
          return <a record={record} onClick={() => this.activate(record)}>启用</a>
        }
      },
      fixed: 'right',
      width: 100,
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

    const expandedRowRender = (record) => {
      let filter = this.state.projectparticipants.filter(p => p.id === record.id)[0] || {}
      if (filter.record.length > 0) {
        return (
          <div>
            <Row>
              {filter.record.map(p => (
                <Checkbox key={p.id}
                          checked={p.state === 'active' ? true : false}
                          onChange={() => this.handleBelongTo(p, record)}
                          style={{margin: '0 10px'}}
                >
                  {p.projectName}
                </Checkbox>
              ))}
            </Row>
          </div>)
      } else {
        return <p>无所属应用</p>
      }

    }
    return (
      <main className="page-section">
        <h3>用户列表:</h3>
        <Row type="flex" justify="space-between" className={styles["radioButton"]}>
          <Col>
            <RadioGroup style={{ marginRight: 20 }}
                        value={this.state.tableSelect}
                        onChange={e => this.setState({tableSelect: e.target.value})}
            >
              <RadioButton value='staff'>项目经理</RadioButton>
              <RadioButton value="developer">项目成员</RadioButton>
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
              scroll={{x: 1125}}
              expandedRowRender={expandedRowRender}
              loading={this.state.loading}
              expandedRowKeys={this.state.expandedRowKeys}
              expandIconColumnIndex={10}
              expandIconAsCell={false}
            />
          )}
          {this.state.tableSelect === 'developer' && (
            <Table
              dataSource={boxes}
              columns={columnDeveloper}
              rowKey="id"
              pagination={{showQuickJumper: true}}
              scroll={{x: 1125}}
              loading={this.state.loading}
            />
          )}
          {this.state.tableSelect === 'admin' && (
            <Table
              dataSource={boxes}
              columns={columnAdmin}
              rowKey="externalId"
              pagination={{showQuickJumper: true}}
              scroll={{x: 1125}}
              loading={this.state.loading}
            />
          )}
        </Col>
      </Row>

      {/* <RcTable columns={columnStaff}
               data={boxes}
      /> */}

    </main>
    )
  }
}

Object.defineProperty(User, "name", { value: "User" });
export default connect(require('./model'),['App'])(User)
