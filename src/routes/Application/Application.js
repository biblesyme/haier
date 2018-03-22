import { Table, Icon, Pagination, Tag, Modal, Form, Input, Button, Select, Row, Col, Badge } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom'
import { connect as modelConnect } from 'utils/ecos'
import nameMap from 'utils/nameMap'
import ProjectMember from '@/components/ProjectMember'
import getState from 'utils/getState'
import {resourceTypeEnum} from 'utils/enum'

import styles from './styles.sass'

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

class Application extends React.Component {
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
    this.props.selfDispatch({
      type: 'findProject',
      payload: {
        callback: () => this.props.dispatch({type: 'App/setState', payload: {loading: false}}),
        account: this.props.App.user,
      }
    })
    this.props.selfDispatch({type: 'findAccount'})
    this.props.dispatch({type:'App/setState',payload: {selectedKeys: ['3']}})
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
    const {projects=[], accounts=[]} = this.props.reduxState
    const columns = [{
      title: '应用名称',
      dataIndex: 'name',
    }, {
      title: '技术负责人',
      render: (record) => {
        const {operationManagers=[]} = record
        return <span>{operationManagers.join('、 ')}</span>
      }
    }, {
      title: '应用健康度',
      render: (record) => (<span style={{color: '#149718'}}>健康-{85}分</span>)
    }, {
      title: '资源种类',
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
      title: '应用告警数',
      render: (record) => (
        <span>
          <Badge status="error" text="3" className={styles['badge-error']}/>
          <Badge status="warning" text="3" style={{marginLeft: '16px'}} className={styles['badge-warning']}/>
          <Badge status="default" text="3" style={{marginLeft: '16px'}} className={styles['badge-default']}/>
        </span>
      )
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
      const fieldsToFilter = [a.name || '', a.operationManagers || ''].join()
      return reg.test(fieldsToFilter)
    })

    const itemRender = (current, type, originalElement) => {
      if (type === 'prev') {
        return (<Button>上一页</Button>);
      } else if (type === 'next') {
        return (<Button>下一页</Button>);
      }
      return originalElement;
    }

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
               rowClassName="text-center"
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

    </div>
      )
  }
}
Object.defineProperty(Application, "name", { value: "Application" });
export default modelConnect(require('./model'), ['App'])(Application)
