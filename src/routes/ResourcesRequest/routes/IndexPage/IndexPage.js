import React from 'react'
import {Table, Row, Col, Input, Button, Select, Tag} from 'antd'
import Detail from './Detail'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'

const {Search} = Input
const {Option} = Select

import styles from './styles.scss'

const adminMap = {
  confirmed: '待通过',
  passed: '已通过',
  denied: '已驳回',
  pending: '待审批',
}

const adminState = {
  confirmed: 'orange',
  denied: 'red',
  passed: 'green',
  pending: 'orange',
}

class Approval extends React.Component {
  state = {
    filteredInfo: null,
    visibleDetail: false,
    record: {},
    filter: null,
    Selected: 'all',
    resource: {},
  };

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.selfDispatch({
      type: 'findApproval',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}})
      }
    })
    this.props.selfDispatch({type: 'findAccount'})
    this.props.selfDispatch({type: 'findProject'})
    this.props.selfDispatch({type: 'findResource'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['5']}})
  }

  handleCancel = (e) => {
    this.setState({
      visibleDetail: false,
    });
  }

  render() {
    let { filteredInfo, } = this.state;
    const {approvals=[], accounts=[], projects=[], resources=[],} = this.props.reduxState
    const {role} = this.props.App
    let roleFilter = []
    if (role === 'admin') {
      roleFilter = approvals.filter(d => d.state !== 'pendding')
    } else {
      roleFilter = approvals
    }
    const boxes = roleFilter.filter(d => {
      const {filter} = this.state
      if (!filter || filter === 'all') {
        return true
      }
      const reg = new RegExp(filter, 'i')
      const fieldsToFilter = [d.state || '',].join()
      return reg.test(fieldsToFilter)
    })
    const columns = [{
      title: 'ID',
      dataIndex: 'id'
    }, {
      title: '申请人',
      render: (record) => {
        let selector = accounts.filter(a => a.id === record.requesterId)[0] || {}
        if (selector) {
          return <span>{selector.name}</span>
        } else {
          return <span></span>
        }
      }
    }, {
      title: '部门',
      render: (record) => {
        let selector = projects.filter(p => p.id === record.projectId)[0] || {}
        const {businessDomain} = (selector.data && selector.data.data) || {}
        if (selector) {
          return <span>{businessDomain}</span>
        } else {
          return <span></span>
        }
      }
    }, {
      title: '申请时间',
      render: (record) => <span>{new Date(record.requestTimestamp * 1000).toLocaleString()}</span>
    }, {
      title: '项目名称',
      render: (record) => {
        let selector = projects.filter(p => p.id === record.projectId)[0] || {}
        const {name} = (selector.data && selector.data.data) || {}
        if (selector) {
          return <span>{name}</span>
        } else {
          return <span></span>
        }
      }
    }, {
      title: '状态',
      render: (record) => {
        if (role === 'admin') {
          return <Tag color={adminState[record.state]}>{adminMap[record.state]}</Tag>
        }
        return <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>
      }
    }, {
      title: '操作',
      render: (record) => {
        let resource = resources.filter(r => r.id === record.resourceId)[0]
        return (
          <div>
            <a onClick={e => this.setState({visibleDetail: true, record, resource})}>查看</a>
          </div>
        )
      }
    },];
    return (
      <main className="page-section">
        <Row type="flex" justify="space-between" className={styles.tableListForm}>
          <Col>
            {this.props.App.role === 'admin' && (
              <Select style={{width: '200px'}}
                      value={this.state.Selected}
                      onChange={Selected => this.setState({Selected, filter: Selected,})}
              >
                <Option key='all'>全部</Option>
                <Option key="confirmed">待审批</Option>
                <Option key="passed">已通过</Option>
                <Option key="denied">已驳回</Option>
              </Select>
            )}
            {this.props.App.role === 'domainAdmin' && (
              <Select style={{width: '200px'}}
                      value={this.state.Selected}
                      onChange={Selected => this.setState({Selected, filter: Selected,})}
              >
                <Option key='all'>全部</Option>
                <Option key="pendding">待审批</Option>
                <Option key="confirmed">已同意</Option>
                <Option key="passed">已通过</Option>
                <Option key="denied">已驳回</Option>
              </Select>
            )}
          </Col>
        </Row>
        <Row>
        <Col>
          <Table
            dataSource={boxes}
            columns={columns}
            rowKey="id"
            pagination={{showQuickJumper: true}}
          />
        </Col>
      </Row>
      {this.state.visibleDetail && (
        <Detail key={this.state.record.id}
                visible={this.state.visibleDetail}
                onOk={(newData) => {this.saveAdd(newData)}}
                onCancel={this.handleCancel}
                resource={this.state.record}
                filterResource={this.state.resource}
          />
      )}
    </main>
    )
  }
}

Object.defineProperty(Approval, "name", { value: "Approval" });
export default connect(require('./model'),['App'])(Approval)
