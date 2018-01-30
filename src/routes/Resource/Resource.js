import React from 'react'
import {Table, Row, Col, Input, Button, Select, Tag} from 'antd'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import getState from 'utils/getState'
import Detail from './Detail'

const {Search} = Input

import styles from './styles.scss'

class Resource extends React.Component {
  state = {
    visibleDetail: false,
    record: {},
  }

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.selfDispatch({
      type: 'findResource',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}})
      }
    })
    this.props.selfDispatch({type: 'findProject'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['4']}})
  }

  handleCancel = (e) => {
    this.setState({
      visibleDetail: false,
    });
  }

  render() {
    const {resources=[], projects=[]} = this.props.reduxState
    const columns = [{
      title: 'ID',
      dataIndex: 'id'
    }, {
      title: '类型',
      dataIndex: 'resourceType',
      // filters: [
      //   { text: '全部', value: 'all' },
      //   { text: '中间件', value: '中间件' },
      //   { text: 'PAAS', value: 'paas' },
      //   { text: '能力开放平台', value: 'Platform' },
      // ],
      // onFilter: (value, record) => {
      //   if (value === 'all') {
      //     return record.type
      //   }
      //   return record.type.includes(value)
      // },
      // filterMultiple: false,
    }, {
      title: '项目名称',
      render: (record) => {
        let selector = projects.filter(p => p.id === record.projectId)[0] || ''
        if (selector) {
          return <span>{selector.data.data.name}</span>
        } else {
          return <span></span>
        }
      }
    }, {
      title: '版本',
      dataIndex: 'version'
    }, {
      title: '状态',
      render: (record) => <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>
    }, {
      title: '操作',
      render: (record) => {
        return (
          <div>
            <a onClick={e => this.setState({visibleDetail: true, record})}>详情</a>
          </div>
        )
      }
    }]
    const boxes = resources
    return (
      <main className="page-section">
        <h3>资源列表</h3>
        <Row className={styles.tableListForm}>
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
                  onCancel={this.handleCancel}
                  resource={this.state.record}
            />
        )}
    </main>
    )
  }
}

Object.defineProperty(Resource, "name", { value: "Resource" });
export default connect(require('./model'),['App'])(Resource)
