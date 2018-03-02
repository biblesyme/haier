import React from 'react'
import {Table, Row, Col, Input, Select, Tag} from 'antd'
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

class MySubmit extends React.Component {
  state = {
    filteredInfo: null,
    visibleDetail: false,
    record: {},
    filter: null,
    Selected: 'all',
    currentPage: 1,
  };

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.selfDispatch({
      type: 'findApproval',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}}),
        account: this.props.App.user,
      }
    })
    this.props.selfDispatch({type: 'findAccount'})
    this.props.selfDispatch({type: 'findProject'})
    this.props.selfDispatch({type: 'findResource'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['6']}})
  }

  handleCancel = (e) => {
    this.setState({
      visibleDetail: false,
    });
  }

  render() {
    let { filteredInfo, } = this.state;
    const {approvals=[], accounts=[], projects=[], resources=[]} = this.props.reduxState
    const {user={}, role} = this.props.App
    const selector = approvals.filter(a => a.requesterId === user.id)
    const boxes = selector.filter(d => {
      const {filter} = this.state
      if (!filter || filter === 'all') {
        return true
      }
      const reg = new RegExp(filter, 'i')
      const fieldsToFilter = [d.state || '',].join()
      return reg.test(fieldsToFilter)
    })
    const columns = [{
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => {
        return <span>{(this.state.currentPage - 1) * 10 + index + 1}</span>
      }
    }, {
      title: '资源信息',
      render: (record) => {
        let selector = resources.filter(r => r.id === record.resourceId)[0] || {}
        if (selector.resourceType === 'containerHost') {
          return <span>容器</span>
        } else {
          return <span>{selector.resourceType}</span>
        }
      }
    }, {
      title: '所属应用',
      render: (record) => {
        let selector = projects.filter(p => p.id === record.projectId)[0] || {}
        if (selector) {
          return <span>{selector.name}</span>
        } else {
          return <span></span>
        }
      }
    }, {
      title: '描述',
      render: (record) => {
        let selector = resources.filter(r => r.id === record.resourceId)[0] || {}
        const {data={}} = selector
        if (selector.resourceType === 'containerHost') {
          return <span>{`容器-${data.cpu / 1000}核-${data.memory / 1024 / 1024 / 1024}G`}</span>
        }
        if (selector.resourceType === 'mysql') {
          if (data.deployMode === 0) return <span>{`MySQL-单机`}</span>
          if (data.deployMode === 1) return <span>{`MySQL-主从`}</span>
          if (data.deployMode === 2) return <span>{`MySQL-集群`}</span>
        }
        if (selector.resourceType === 'redis') {
          if (data.clusterType === 'one') return <span>{`Redis-${data.memorySize}M-单例`}</span>
          if (data.clusterType === 'masterSlave') return <span>{`Redis-${data.memorySize}M-主从`}</span>
          if (data.clusterType === 'shared') return <span>{`Redis-${data.memorySize}M-分片`}</span>
        }
        if (selector.resourceType === 'rocketMQTopic') {
          if (data.clusterType === 'standalone') return <span>{`RocketMQ-单机`}</span>
          if (data.clusterType === 'cluster') return <span>{`RocketMQ-集群`}</span>
        }
        return <span>{selector.resourceType}</span>
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
            <Select style={{width: '200px'}}
                    value={this.state.Selected}
                    onChange={Selected => this.setState({Selected, filter: Selected,})}
            >
              <Option key='all'>全部</Option>
              <Option key="pendding">待审批</Option>
              <Option key="confirmed">已审批</Option>
              <Option key="denied">已驳回</Option>
            </Select>
          </Col>
        </Row>
        <Row>
        <Col>
          <Table
            dataSource={boxes}
            columns={columns}
            rowKey="id"
            pagination={{
              showQuickJumper: true,
              onChange: (currentPage) => this.setState({currentPage}),
            }}
            scroll={{x: 1300}}
          />
        </Col>
      </Row>
      {this.state.visibleDetail && (
        <Detail
          visible={this.state.visibleDetail}
          onOk={(newData) => {this.saveAdd(newData)}}
          onCancel={this.handleCancel}
          resource={this.state.record}
          filterResource={this.state.resource}
          projects={this.props.reduxState.projects}
          resources={this.props.reduxState.resources}
          />
      )}
    </main>
    )
  }
}

export default connect(require('./model'),['App'])(MySubmit)
