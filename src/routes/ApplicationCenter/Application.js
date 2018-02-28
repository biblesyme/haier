import { Table, Icon, Pagination, Tag, Modal, Form, Input, Button, Select, Row, Col } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect as modelConnect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import ProjectMember from '@/components/ProjectMember'
import getState from 'utils/getState'

import styles from './styles.scss'

const FormItem = Form.Item
const {Search} = Input

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  style: {
    marginBottom: '10px'
  }
};

class ApplicationCenter extends React.Component {
  state = {
    visibleAdd: false,
    visibleEdit: false,
    visibleDetail: false,
    domainSelect: 'all',
    filter: null,
    record: {},
  }

  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.dispatch({
      type: 'App/findProject',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}}),
      }
    })
    this.props.selfDispatch({type: 'findAccount'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['9']}})
  }

  showModal = (visible) => {
    return ()=>{this.setState({
      [visible]: true,
    });
  }
  }

  handleOk = (e) => {
    this.setState({
      visibleAdd: false,
      visibleEdit: false,
      visibleDetail: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visibleAdd: false,
      visibleEdit: false,
      visibleDetail: false,
    });
  }

  detail = (record) => {
    this.props.history.push({pathname: `/applications/${record.id}`, record})
  }

  deleteMember = (e, account) => {
    let newMembers = this.state.members.filter(m => m.account !== account)
    this.setState({
      members: newMembers,
    })
  }

  render(){
    const {accounts=[]} = this.props.reduxState
    const {projects=[]} = this.props.App
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '应用名称',
      dataIndex: 'name',
    }, {
      title: '技术负责人',
    }, {
      title: '应用告警数',
      dataIndex: 'health',
    }, {
      title: '应用健康度',
    }, {
      title: '资源种类',
      render: (record) => {
        let resources=[]
        if (record.hasOwnProperty('resources')) {
          record.resources.map(r => {
            if (!resources.includes(r.resourceType) && r.resourceType !== 'containerHost') {
              resources = [...resources, r.resourceType]
            }
          })
        }
        return resources.map(r => <Tag key={record.id + r} color="blue"><Icon  type={nameMap[r]}/></Tag>)
      }
    },
    {
      title: '状态',
      render: (record) => <Tag {...getState(record.state)}>{nameMap[record.state]}</Tag>
    }, {
      title: <div className="text-center">操作</div>,
      render: (record, index) => {
        return (
          <div className="text-center">
            {(record.state === 'resourceReady' && this.props.App.role !== 'developer') && (
              <a onClick={() => this.props.history.push({pathname: `/applications/${record.id}/NewResource`, record})}>申请资源</a>
            )}
            <a className="mg-l10" onClick={() => this.detail(record)}>查看详情</a>
            {(record.state === 'resourceReady' && this.props.App.role !== 'developer') && (
              <a className="mg-l10"
                 onClick={() => this.setState({visibleEdit: true, record})}
              >成员管理</a>
            )}
          </div>
        )
      }
    }];

    const boxes = projects.filter(a => {
      const {filter} = this.state
      if (!filter) {
        return true
      }
      const reg = new RegExp(filter, 'i')
      const fieldsToFilter = [a.name || '', a.externalId || ''].join()
      return reg.test(fieldsToFilter)
    })

    return (
    <div>
      <div className="page-section">
        <h3>应用列表</h3>
        <Row type="flex" justify="space-between" className={styles.tableListForm}>
          <Col>
            {/* <Select style={{ width: 200 }}
                    value={this.state.domainSelect}
                    onChange={domainSelect => this.setState({domainSelect})}
            >
              <Option key="all">全部</Option>
              <Option key="PSI">PSI</Option>
              <Option key="众创汇">众创汇</Option>
            </Select> */}
          </Col>
          <Col>
            <Search
              placeholder="请输入您搜索的关键词"
              style={{ width: 200 }}
              onChange={e => this.setState({filter: e.target.value})}
            />
          </Col>
        </Row>
        <Table pagination={{showQuickJumper: true}} columns={columns} dataSource={boxes} rowKey="id"/>
      </div>

      {this.state.visibleEdit && (
        <ProjectMember
          visible={this.state.visibleEdit}
          onOk={(newData) => {this.updateDomain(newData)}}
          onCancel={this.handleCancel}
          resource={this.state.record}
          accounts={accounts}
          />
      )}

    </div>
      )
  }
}
Object.defineProperty(ApplicationCenter, "name", { value: "ApplicationCenter" });
export default modelConnect(require('./model'), ['App'])(ApplicationCenter)