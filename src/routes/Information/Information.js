import React from 'react'
import {Card, Row, Col, Progress, Divider, Input, Table, Tag, Icon} from 'antd'
import { Circle, Line } from 'rc-progress';
import MyProgress from '@/components/MyProgress'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import Edit from './Edit'
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
  }
  componentWillMount() {
    this.props.dispatch({type: 'App/setState', payload: {loading: false}})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['2']}})
    this.props.selfDispatch({type: 'findAccount'})
    this.props.dispatch({type: 'App/findProject'})
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
    const {projects=[]} = this.props.App
    const {accounts=[]} = this.props.reduxState

    const columns = [{
      title: 'ID',
      dataIndex: 'id',
    }, {
      title: '应用名称',
      dataIndex: 'name',
    }, {
      title: '应用告警数',
      dataIndex: 'health',
    }, {
      title: '资源占用率',
      dataIndex: 'resourceUsage1',
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
      <div className="page-wrap">
        <section className="page-section">
          <Row>
            <Col>
              <Card bordered={false}>
                <CardGrid style={{width: '15%', height: stateHeight}} className="text-center">
                  <div style={{fontSize: '4em', color: '#389e0d'}}>{projects.length}</div>
                  <div>项目总数</div>
                </CardGrid>
                <CardGrid style={{width: '15%', height: stateHeight}} className="text-center">
                  {/* <Progress type="dashboard"
                            percent={75}
                            width={85}
                            format={percent => `
                              ${percent}%`}
                  /> */}
                  {/* <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-show-info ant-progress-default">
                    <div style={{marginTop: '30px'}}>
                      <Line percent="45"
                            strokeWidth="15"
                            trailWidth="15"
                            strokeColor="#389e0d"
                            strokeLinecap="butt"
                      />
                      <span className="ant-progress-text">45%</span>
                    </div>
                  </div> */}
                  <MyProgress percent="45"
                              width="85px"
                  />
                  <div style={{marginTop: '8px'}}>PAAS使用率</div>
                </CardGrid>
                <CardGrid style={{width: '70%', height: stateHeight}} className="text-center">
                  <Row gutter={64}>
                    <Col span={8}>
                      <span style={{marginRight: '24px'}}>MySQL</span>
                      <MyProgress percent="75"
                                  width="85px"

                      />
                    </Col>
                    <Col span={8}>
                      <span style={{marginRight: '24px'}}>Redis</span>
                      <MyProgress percent="30"
                                  width="85px"
                      />
                    </Col>
                    <Col span={8}>
                      <span style={{marginRight: '24px'}}>RabbitMQ</span>
                      <MyProgress percent="90"
                                  width="85px"
                      />
                    </Col>
                  </Row>
                  <div style={{marginTop: '16px'}}>中间件使用率(共享资源)</div>
                </CardGrid>
              </Card>
            </Col>
          </Row>
        </section>
        <section className="page-section">
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
            <Edit
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
