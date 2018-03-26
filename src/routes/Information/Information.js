import React from 'react'
import {Card, Row, Col, Progress, Divider, Input, Table, Tag, Icon, Badge, Button, Select} from 'antd'
import { Circle, Line } from 'rc-progress';
import MyProgress from '@/components/MyProgress'
import { connect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import ProjectMember from '@/components/ProjectMember'
import getState from 'utils/getState'
import { Link } from 'react-router-dom'
import {resourceTypeEnum} from 'utils/enum'

import styles from './styles.sass'

const CardGrid = Card.Grid
const {Search} = Input
const stateHeight = '168px'
const {Option} = Select

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
      title: <div className="text-center">序号</div>,
      dataIndex: 'id',
      className: 'text-center',
      render: (text, record, index) => {
        return <span>{(this.state.currentPage - 1) * 10 + index + 1}</span>
      }
    }, {
      title: '应用名称',
      dataIndex: 'name',
      className: 'text-center',
      sorter: (a, b) => a.name - b.name,
    }, {
      title: '项目经理',
      className: 'text-center',
      render: (record) => {
        const {businessManagers=[]} = record
        return <span>{businessManagers.join('、 ')}</span>
      },
      sorter: (a, b) => {
        const _a = a.businessManagers || []
        const _b = b.businessManagers || []
        return _a.length - _b.length
      },
    }, {
      title: '所属部门',
      className: 'text-center',
      render: (record) => {
        const filter = domains.filter(d => d.id === record.domainId)[0] || {}
        return <span>{filter.name}</span>
      },
      sorter: (a, b) => a.domainId - b.domainId,
    },{
      title: <div className="text-center">应用健康度</div>,
      className: 'text-center',
      render: (record) => (<span style={{color: '#149718'}}>健康-{85}分</span>)
    }, {
      title: <div className="text-center">资源种类</div>,
      className: 'text-center',
      render: (record) => {
        let resources=[]
        if (record.hasOwnProperty('resources')) {
          record.resources.map(r => {
            if (!resources.includes(resourceTypeEnum(r.resourceType))) {
              resources = [...resources, resourceTypeEnum(r.resourceType)]
            }
          })
        }
        return resources.sort().reverse().join('/')
      }
    }, {
      title: <div className="text-center">应用告警数</div>,
      className: 'text-center',
      render: (record) => (
        <span>
          <Badge status="error" text="3" className={styles['badge-error']}/>
          <Badge status="warning" text="3" style={{marginLeft: '16px'}} className={styles['badge-warning']}/>
          <Badge status="default" text="3" style={{marginLeft: '16px'}} className={styles['badge-default']}/>
        </span>
      )
    }, {
      title: <div className="text-center">操作</div>,
      className: 'text-center',
      render: (record, index) => {
        return (
          <div className="text-center">
            <a className="mg-l10" onClick={() => this.detail(record)}>查看详情</a>
          </div>
        )
      },
    }];

    const itemRender = (current, type, originalElement) => {
      if (type === 'prev') {
        return (<Button>上一页</Button>);
      } else if (type === 'next') {
        return (<Button>下一页</Button>);
      }
      return originalElement;
    }

    const boxes = projects.filter(a => {
      const {filter} = this.state
      if (filter) {
        const reg = new RegExp(filter, 'i')
        const fieldsToFilter = [a.name || ''].join()
        return reg.test(fieldsToFilter)
      }
      if (this.state.domainSelect !== 'all') {
        return a.domainId === this.state.domainSelect
      }
      return true
    })
    console.log(this.state.domainSelect)
    return (
      <div className="page-wrap">
        <section className="page-section">
            <h3>信息中心</h3>
            <Row style={{fontSize: '16px', marginTop: '20px'}}>
              <Col span={4}>应用总数 <span style={{color: '#005bac', marginLeft: '17px'}} className="number">{projects.length}</span></Col>
              <Col span={4}>健康应用 <span style={{color: '#149718', marginLeft: '17px'}} className="number">302</span></Col>
              <Col span={4}>告警应用 <span style={{color: '#e22334', marginLeft: '17px'}} className="number">23</span></Col>
            </Row>
            <Row type="flex" justify="space-between" className={styles.tableListForm}>
              <Col>
                <Select style={{ width: 200 }}
                        value={this.state.domainSelect}
                        onChange={domainSelect => this.setState({domainSelect})}
                >
                  <Option key='all'>全部</Option>
                  {domains.map(d => <Option key={d.id}>{d.name}</Option>)}
                </Select>
              </Col>
              <Col>
                <Search
                  placeholder="请输入您搜索的关键词"
                  style={{ width: 393 }}
                  onChange={e => this.setState({filter: e.target.value})}
                  enterButton="搜索"
                />
              </Col>
            </Row>
            <Table columns={columns}
                   dataSource={boxes}
                   rowKey="id"
                   scroll={{x: 1125}}
                   pagination={{
                     showQuickJumper: true,
                     onChange: (currentPage) => this.setState({currentPage}),
                     showLessItems: true,
                     itemRender: itemRender,
                   }}
            />

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
