import React from 'react'
import {Card, Row, Col, Progress, Divider, Input, Table, Tag, Icon} from 'antd'
import { Circle, Line } from 'rc-progress';
import MyProgress from '@/components/MyProgress'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import ProjectMember from '@/components/ProjectMember'
import getState from 'utils/getState'
import { Link } from 'react-router-dom'

import styles from './styles.scss'

const CardGrid = Card.Grid
const {Search} = Input

const stateHeight = '168px'

class Information extends React.Component {
  state = {
    visibleAdd: false,
    visibleEdit: false,
    visibleDetail: false,
    domainSelect: 'all',
    filter: null,
    record: {},
    currentPage: 1,
  }
  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: true}})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['2']}})
    this.props.selfDispatch({type: 'findAccount'})
    this.props.dispatch({
      type: 'App/findProject',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}}),
      }
    })
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
  render() {
    const {projects=[], domains=[]} = this.props.App
    const {accounts=[]} = this.props.reduxState

    const columns = [{
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => {
        return <span>{(this.state.currentPage - 1) * 10 + index + 1}</span>
      }
    }, {
      title: '应用名称',
      dataIndex: 'name',
    }, {
      title: '项目经理',
      render: (record) => {
        const {businessManagers=[]} = record
        return <span>{businessManagers.join('、 ')}</span>
      }
    }, {
      title: '所属部门',
      render: (record) => {
        const filter = domains.filter(d => d.id === record.domainId)[0] || {}
        return <span>{filter.name}</span>
      }
    },{
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
    }, {
      title: '应用告警数',
      dataIndex: 'health',
    }, {
      title: <div className="text-center">操作</div>,
      render: (record, index) => {
        return (
          <div className="text-center">
            <a className="mg-l10" onClick={() => this.detail(record)}>查看详情</a>
          </div>
        )
      },
      // fixed: 'right',
      // width: 100,
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
      <div className="page-wrap">
        <section className="page-section">
          <div className="page-section">
            <h3>应用列表</h3>
            <Row style={{fontSize: '18px', marginTop: '20px'}}>
              <Col span={4}>应用总数 <span style={{color: 'blue', marginLeft: '5px'}}>{projects.length}</span></Col>
              <Col span={4}>健康应用 <span style={{color: 'green', marginLeft: '5px'}}>302</span></Col>
              <Col span={4}>告警应用 <span style={{color: 'red', marginLeft: '5px'}}>23</span></Col>
            </Row>
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
            <Table columns={columns}
                   dataSource={boxes}
                   rowKey="id"
                   scroll={{x: 1300}}
                   pagination={{
                     showQuickJumper: true,
                     onChange: (currentPage) => this.setState({currentPage}),
                   }}
            />
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
        </section>
      </div>
    )
  }
}

Object.defineProperty(Information, "name", { value: "Information" });
export default connect(require('./model'),['App'])(Information)
